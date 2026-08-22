-- Aurelia Dodo payment/subscription binding.
-- A successful subscription payment carries the checkout metadata Aurelia set
-- when it created the session. This binds Dodo's subscription id back to the
-- correct family billing account without granting access. Access is granted
-- only by the separate subscription lifecycle processor.

begin;

grant select, update on public.billing_accounts to service_role;
grant select, insert, update on public.billing_subscriptions to service_role;
grant select, insert, update on public.billing_events to service_role;
grant insert on public.audit_log to service_role;
grant usage, select on all sequences in schema public to service_role;

create or replace function public.server_bind_dodo_subscription_payment(
  p_provider_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_billing_account_id uuid,
  p_plan_key text,
  p_provider_subscription_id text,
  p_provider_product_id text,
  p_provider_checkout_session_id text default null,
  p_provider_customer_id text default null
)
returns table(processed boolean, subscription_status text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_event_id bigint;
  v_subscription_id uuid;
  v_status text;
begin
  if p_event_type <> 'payment.succeeded' then
    raise exception 'Unsupported Dodo payment event';
  end if;
  if p_provider_event_id is null or char_length(btrim(p_provider_event_id)) < 1 or char_length(p_provider_event_id) > 255 then
    raise exception 'Invalid Dodo event id';
  end if;
  if p_payload_hash is null or p_payload_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid Dodo payload hash';
  end if;
  if p_plan_key not in ('family_monthly', 'family_annual', 'family_plus_monthly', 'family_plus_annual') then
    raise exception 'Invalid Aurelia family plan';
  end if;
  if p_provider_subscription_id is null or char_length(btrim(p_provider_subscription_id)) < 1 or char_length(p_provider_subscription_id) > 255 then
    raise exception 'Invalid Dodo subscription id';
  end if;
  if p_provider_product_id is null or char_length(btrim(p_provider_product_id)) < 1 or char_length(p_provider_product_id) > 255 then
    raise exception 'Invalid Dodo product id';
  end if;
  if p_provider_checkout_session_id is not null and (char_length(btrim(p_provider_checkout_session_id)) < 1 or char_length(p_provider_checkout_session_id) > 255) then
    raise exception 'Invalid Dodo checkout session id';
  end if;
  if p_provider_customer_id is not null and (char_length(btrim(p_provider_customer_id)) < 1 or char_length(p_provider_customer_id) > 255) then
    raise exception 'Invalid Dodo customer id';
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

  insert into public.billing_events (
    provider, provider_event_id, billing_account_id, event_type, payload_hash
  ) values (
    'dodo', btrim(p_provider_event_id), p_billing_account_id, p_event_type, p_payload_hash
  )
  on conflict (provider, provider_event_id) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select bs.status into v_status
    from public.billing_subscriptions bs
    where bs.provider = 'dodo'
      and bs.provider_subscription_id = p_provider_subscription_id
    limit 1;
    return query select false, coalesce(v_status, 'duplicate');
    return;
  end if;

  insert into public.billing_subscriptions (
    billing_account_id,
    plan_key,
    provider,
    provider_subscription_id,
    provider_checkout_session_id,
    provider_product_id,
    status,
    amount_pence,
    currency
  ) values (
    p_billing_account_id,
    p_plan_key,
    'dodo',
    btrim(p_provider_subscription_id),
    nullif(btrim(p_provider_checkout_session_id), ''),
    btrim(p_provider_product_id),
    'pending',
    case p_plan_key
      when 'family_monthly' then 1299
      when 'family_annual' then 12900
      when 'family_plus_monthly' then 1999
      when 'family_plus_annual' then 19900
    end,
    'GBP'
  )
  on conflict (provider, provider_subscription_id) do update
  set billing_account_id = excluded.billing_account_id,
      plan_key = excluded.plan_key,
      provider_checkout_session_id = coalesce(excluded.provider_checkout_session_id, public.billing_subscriptions.provider_checkout_session_id),
      provider_product_id = excluded.provider_product_id,
      updated_at = now()
  returning id, status into v_subscription_id, v_status;

  update public.billing_accounts
  set provider_customer_id = coalesce(nullif(btrim(p_provider_customer_id), ''), provider_customer_id),
      updated_at = now()
  where id = p_billing_account_id;

  update public.billing_events
  set processed_at = now()
  where id = v_event_id;

  insert into public.audit_log (actor_profile_id, action, target_type, target_id, metadata)
  values (
    null,
    'dodo_subscription_payment_bound',
    'billing_subscription',
    v_subscription_id,
    jsonb_build_object(
      'event_type', p_event_type,
      'plan_key', p_plan_key,
      'provider_event_id', p_provider_event_id
    )
  );

  return query select true, v_status;
end;
$$;

revoke all on function public.server_bind_dodo_subscription_payment(
  text, text, text, uuid, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.server_bind_dodo_subscription_payment(
  text, text, text, uuid, text, text, text, text, text
) to service_role;

commit;
