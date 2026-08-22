-- Make Dodo subscription reconciliation safely idempotent through a real unique constraint.
-- Multiple NULL provider subscription IDs remain allowed by PostgreSQL unique semantics.

drop index if exists public.billing_subscriptions_provider_subscription;

alter table public.billing_subscriptions
  add constraint billing_subscriptions_provider_subscription_unique
  unique (provider, provider_subscription_id);

create index if not exists billing_accounts_school_fk on public.billing_accounts(school_id) where school_id is not null;
create index if not exists billing_accounts_group_fk on public.billing_accounts(education_group_id) where education_group_id is not null;
create index if not exists billing_accounts_payer_fk on public.billing_accounts(payer_profile_id) where payer_profile_id is not null;
