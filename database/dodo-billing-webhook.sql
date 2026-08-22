-- Aurelia Dodo billing webhook processor.
-- Applies one signed Dodo subscription event atomically to billing audit,
-- subscription state, payer account state and family entitlements.
-- The Edge Function verifies the Standard Webhooks signature and validates the
-- Dodo product ID before calling this service-role-only function.

begin;

-- The original billing migration used a partial unique index. A full unique
-- index still permits multiple NULLs in Postgres and lets ON CONFLICT infer the
-- provider/subscription identity safely.
drop index if exists public.billing_subscriptions_provider_subscription;
create unique index if not exists billing_subscriptions_provider_subscription_unique
  on public.billing_subscriptions(provider, provider_subscription_id);

grant select, update on public.billing_accounts to service_role;
grant select, insert, update on public.billing_subscriptions to service_role;
grant select, insert, update on public.billing_entitlements to service_role;
grant select, insert, update on public.billing_events to service_role;
grant insert on public.audit_log to service_role;
grant usage, select on all sequences in schema public to service_role;

create or replace function public.server_apply_dodo_subscription_event(
  p_provider_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_billing_account_id uuid,
  p_plan_key text,
  p_provider_subscription_id text,
  p_provider_product_id text,
  p_external_status text,
  p_amount_pence integer,
  p_currency text,
  p_provider_customer_id text default null,
  p_period_start timestamptz default null,
  p_period_end timestamptz default null,
  p_cancel_at_period_end boolean default false
)
returns table(processed boolean, subscription_status text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_event_id bigint;
  v_subscription_id uuid;
  v_local_status text;
  v_existing_status text;
  v_account_status text;
  v_expected_amount integer;
  v_access_active boolean;
  v_plus_active boolean;
begin
  if p_provider_event_id is null or char_length(btrim(p_provider_event_id)) < 1 or char_length(p_provider_event_id) > 255 then
    raise exception 'Invalid Dodo event id';
  end if;
  if p_event_type is null or p_event_type not like 'subscription.%' or char_length(p_event_type) > 120 then
    raise exception 'Invalid Dodo event type';
  end if;
  if p_payload_hash is null or p_payload_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid Dodo payload hash';
  end if;
  if p_provider_subscription_id is null or char_length(btrim(p_provider_subscription_id)) < 1 or char_length(p_provider_subscription_id) > 255 then
    raise exception 'Invalid Dodo subscription id';
  end if;
  if p_provider_product_id is null or char_length(btrim(p_provider_product_id)) < 1 or char_length(p_provider_product_id) > 255 then
    raise exception 'Invalid Dodo product id';
  end if;
  if p_provider_customer_id is not null and (char_length(btrim(p_provider_customer_id)) < 1 or char_length(p_provider_customer_id) > 255) then
    raise exception 'Invalid Dodo customer id';
  end if;

  v_expected_amount := case p_plan_key
    when 'family_monthly' then 1299
    when 'family_annual' then 12900
    when 'family_plus_monthly' then 1999
    when 'family_plus_annual' then 19900
    else null
  end;

  if v_expected_amount is null then
    raise exception 'Invalid Aurelia family plan';
  end if;
  if p_amount_pence is distinct from v_expected_amount then
    raise exception 'Dodo amount does not match Aurelia plan';
  end if;
  if upper(p_currency) <> 'GBP' then
    raise exception 'Unsupported billing currency';
  end if;
  if p_period_end is not null and p_period_start is not null and p_period_end <= p_period_start then
    raise exception 'Invalid billing period';
  end if;

  v_local_status := case p_external_status
    when 'pending' then 'pending'
    when 'active' then case when coalesce(p_cancel_at_period_end, false) then 'cancel_at_period_end' else 'active' end
    when 'on_hold' then 'past_due'
    when 'cancelled' then 'cancelled'
    when 'failed' then 'expired'
    when 'expired' then 'expired'
    else null
  end;

  if v_local_status is null then
    raise exception 'Unsupported Dodo subscription status';
  end if;

  perform 1
  from public.billing_accounts ba
  where ba.id = p_billing_account_id
    and ba.account_type = 'family'
    and ba.provider = 'dodo'
  for update;

  if not found then
    raise exception 'Aurelia family billing account is unavailable';
  end if;

  -- Dodo retries webhooks. The provider event id is the idempotency key. If it
  -- already exists, the whole event is a no-op and no entitlement is extended.
  insert into public.billing_events (
    provider,
    provider_event_id,
    billing_account_id,
    event_type,
    payload_hash
  ) values (
    'dodo',
    btrim(p_provider_event_id),
    p_billing_account_id,
    p_event_type,
    p_payload_hash
  )
  on conflict (provider, provider_event_id) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select bs.status
      into v_existing_status
    from public.billing_subscriptions bs
    where bs.provider = 'dodo'
      and bs.provider_subscription_id = p_provider_subscription_id
    limit 1;

    return query select false, coalesce(v_existing_status, 'duplicate');
    return;
  end if;

  insert into public.billing_subscriptions (
    billing_account_id,
    plan_key,
    provider,
    provider_subscription_id,
    provider_product_id,
    status,
    amount_pence,
    currency,
    current_period_start,
    current_period_end,
    renews_at,
    cancel_at_period_end
  ) values (
    p_billing_account_id,
    p_plan_key,
    'dodo',
    btrim(p_provider_subscription_id),
    btrim(p_provider_product_id),
    v_local_status,
    v_expected_amount,
    'GBP',
    p_period_start,
    p_period_end,
    case when v_local_status = 'cancel_at_period_end' then null else p_period_end end,
    coalesce(p_cancel_at_period_end, false)
  )
  on conflict (provider, provider_subscription_id) do update
  set billing_account_id = excluded.billing_account_id,
      plan_key = excluded.plan_key,
      provider_product_id = excluded.provider_product_id,
      status = excluded.status,
      amount_pence = excluded.amount_pence,
      currency = excluded.currency,
      current_period_start = excluded.current_period_start,
      current_period_end = excluded.current_period_end,
      renews_at = excluded.renews_at,
      cancel_at_period_end = excluded.cancel_at_period_end,
      updated_at = now()
  returning id, status into v_subscription_id, v_local_status;

  v_account_status := case v_local_status
    when 'active' then 'active'
    when 'cancel_at_period_end' then 'active'
    when 'past_due' then 'past_due'
    when 'cancelled' then 'closed'
    when 'expired' then 'closed'
    else 'pending'
  end;

  update public.billing_accounts
  set provider_customer_id = coalesce(nullif(btrim(p_provider_customer_id), ''), provider_customer_id),
      status = v_account_status,
      currency = 'GBP',
      updated_at = now()
  where id = p_billing_account_id;

  v_access_active := v_local_status in ('active', 'cancel_at_period_end');
  v_plus_active := v_access_active and p_plan_key in ('family_plus_monthly', 'family_plus_annual');

  insert into public.billing_entitlements (
    billing_account_id, entitlement_key, quantity, active, starts_at, ends_at
  ) values (
    p_billing_account_id,
    'family_core',
    1,
    v_access_active,
    case when v_access_active then coalesce(p_period_start, now()) else null end,
    case when v_access_active then p_period_end else now() end
  )
  on conflict (billing_account_id, entitlement_key) do update
  set quantity = excluded.quantity,
      active = excluded.active,
      starts_at = case
        when excluded.active then coalesce(public.billing_entitlements.starts_at, excluded.starts_at)
        else null
      end,
      ends_at = excluded.ends_at,
      updated_at = now();

  insert into public.billing_entitlements (
    billing_account_id, entitlement_key, quantity, active, starts_at, ends_at
  ) values (
    p_billing_account_id,
    'family_plus',
    1,
    v_plus_active,
    case when v_plus_active then coalesce(p_period_start, now()) else null end,
    case when v_plus_active then p_period_end else now() end
  )
  on conflict (billing_account_id, entitlement_key) do update
  set quantity = excluded.quantity,
      active = excluded.active,
      starts_at = case
        when excluded.active then coalesce(public.billing_entitlements.starts_at, excluded.starts_at)
        else null
      end,
      ends_at = excluded.ends_at,
      updated_at = now();

  update public.billing_events
  set processed_at = now()
  where id = v_event_id;

  insert into public.audit_log (
    actor_profile_id,
    action,
    target_type,
    target_id,
    metadata
  ) values (
    null,
    'dodo_subscription_event_applied',
    'billing_subscription',
    v_subscription_id,
    jsonb_build_object(
      'event_type', p_event_type,
      'plan_key', p_plan_key,
      'status', v_local_status,
      'provider_event_id', p_provider_event_id
    )
  );

  return query select true, v_local_status;
end;
$$;

revoke all on function public.server_apply_dodo_subscription_event(
  text, text, text, uuid, text, text, text, text, integer, text, text, timestamptz, timestamptz, boolean
) from public, anon, authenticated;

grant execute on function public.server_apply_dodo_subscription_event(
  text, text, text, uuid, text, text, text, text, integer, text, text, timestamptz, timestamptz, boolean
) to service_role;

commit;
