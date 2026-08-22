-- Aurelia billing & entitlement extension
-- Family subscriptions are self-service; institutions are contract/invoice led.
-- Payment-provider writes remain server/webhook managed. No provider secrets live in SQL.

begin;

create table public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  account_type text not null check (account_type in ('family', 'school', 'education_group', 'organisation')),
  payer_profile_id uuid references public.profiles(id) on delete set null,
  school_id uuid references public.schools(id) on delete cascade,
  education_group_id uuid references public.education_groups(id) on delete cascade,
  organisation_name text,
  provider text not null default 'manual' check (provider in ('dodo', 'invoice', 'manual')),
  provider_customer_id text,
  currency text not null default 'GBP' check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'pending' check (status in ('pending', 'active', 'past_due', 'suspended', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (account_type = 'family' and payer_profile_id is not null and school_id is null and education_group_id is null and organisation_name is null)
    or (account_type = 'school' and payer_profile_id is null and school_id is not null and education_group_id is null and organisation_name is null)
    or (account_type = 'education_group' and payer_profile_id is null and school_id is null and education_group_id is not null and organisation_name is null)
    or (account_type = 'organisation' and payer_profile_id is null and school_id is null and education_group_id is null and organisation_name is not null)
  )
);

create unique index billing_accounts_one_family_per_payer
  on public.billing_accounts(payer_profile_id)
  where account_type = 'family' and payer_profile_id is not null;
create unique index billing_accounts_one_per_school
  on public.billing_accounts(school_id)
  where account_type = 'school' and school_id is not null;
create unique index billing_accounts_one_per_group
  on public.billing_accounts(education_group_id)
  where account_type = 'education_group' and education_group_id is not null;
create unique index billing_accounts_provider_customer
  on public.billing_accounts(provider, provider_customer_id)
  where provider_customer_id is not null;

create table public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  billing_account_id uuid not null references public.billing_accounts(id) on delete cascade,
  plan_key text not null check (plan_key in (
    'family_monthly', 'family_annual', 'family_plus_monthly', 'family_plus_annual',
    'school', 'education_group', 'organisation'
  )),
  provider text not null check (provider in ('dodo', 'invoice', 'manual')),
  provider_subscription_id text,
  provider_checkout_session_id text,
  provider_product_id text,
  status text not null default 'pending' check (status in (
    'pending', 'active', 'past_due', 'cancel_at_period_end', 'cancelled', 'expired'
  )),
  amount_pence integer check (amount_pence is null or amount_pence >= 0),
  currency text not null default 'GBP' check (currency ~ '^[A-Z]{3}$'),
  current_period_start timestamptz,
  current_period_end timestamptz,
  renews_at timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end is null or current_period_start is null or current_period_end > current_period_start)
);

create unique index billing_subscriptions_provider_subscription
  on public.billing_subscriptions(provider, provider_subscription_id)
  where provider_subscription_id is not null;
create index billing_subscriptions_account_status
  on public.billing_subscriptions(billing_account_id, status, created_at desc);

create table public.institution_contracts (
  id uuid primary key default gen_random_uuid(),
  billing_account_id uuid not null unique references public.billing_accounts(id) on delete cascade,
  seat_limit integer check (seat_limit is null or seat_limit > 0),
  school_limit integer check (school_limit is null or school_limit > 0),
  annual_amount_pence integer check (annual_amount_pence is null or annual_amount_pence >= 0),
  currency text not null default 'GBP' check (currency ~ '^[A-Z]{3}$'),
  invoice_reference text,
  status text not null default 'draft' check (status in ('draft', 'active', 'renewal_due', 'expired', 'cancelled')),
  contract_starts_at timestamptz,
  contract_ends_at timestamptz,
  renewal_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (contract_ends_at is null or contract_starts_at is null or contract_ends_at > contract_starts_at)
);

create table public.billing_entitlements (
  id uuid primary key default gen_random_uuid(),
  billing_account_id uuid not null references public.billing_accounts(id) on delete cascade,
  entitlement_key text not null check (char_length(entitlement_key) between 1 and 120),
  quantity integer check (quantity is null or quantity >= 0),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (billing_account_id, entitlement_key),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index billing_entitlements_account_active
  on public.billing_entitlements(billing_account_id, active);

create table public.billing_events (
  id bigint generated always as identity primary key,
  provider text not null check (provider in ('dodo', 'invoice', 'manual')),
  provider_event_id text not null,
  billing_account_id uuid references public.billing_accounts(id) on delete set null,
  event_type text not null,
  payload_hash text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

create index billing_events_account_received
  on public.billing_events(billing_account_id, received_at desc);

alter table public.billing_accounts enable row level security;
alter table public.billing_subscriptions enable row level security;
alter table public.institution_contracts enable row level security;
alter table public.billing_entitlements enable row level security;
alter table public.billing_events enable row level security;

-- A family payer can see their own billing account.
create policy billing_accounts_family_self_select
on public.billing_accounts for select to authenticated
using (account_type = 'family' and payer_profile_id = public.current_profile_id());

-- A verified parent can create the one pending family billing shell required before checkout.
create policy billing_accounts_family_self_insert
on public.billing_accounts for insert to authenticated
with check (
  account_type = 'family'
  and payer_profile_id = public.current_profile_id()
  and provider = 'dodo'
  and provider_customer_id is null
  and status = 'pending'
  and school_id is null
  and education_group_id is null
  and organisation_name is null
  and exists (
    select 1 from public.profiles p
    where p.id = public.current_profile_id()
      and p.primary_role = 'parent'
      and p.age_band = 'adult'
      and p.disabled_at is null
  )
);

-- School admins can read their school's account; group admins can read the group account.
create policy billing_accounts_school_admin_select
on public.billing_accounts for select to authenticated
using (
  account_type = 'school'
  and exists (
    select 1 from public.school_memberships sm
    where sm.school_id = billing_accounts.school_id
      and sm.profile_id = public.current_profile_id()
      and sm.role = 'school_admin'
      and sm.status = 'active'
  )
);

create policy billing_accounts_group_admin_select
on public.billing_accounts for select to authenticated
using (
  account_type = 'education_group'
  and exists (
    select 1 from public.group_memberships gm
    where gm.education_group_id = billing_accounts.education_group_id
      and gm.profile_id = public.current_profile_id()
      and gm.role in ('group_admin', 'platform_admin')
      and gm.status = 'active'
  )
);

-- Child/alumni profiles never receive billing-row policies.
-- Subordinate billing records inherit visibility through an account the viewer may read.
create policy billing_subscriptions_visible_account_select
on public.billing_subscriptions for select to authenticated
using (
  exists (select 1 from public.billing_accounts ba where ba.id = billing_subscriptions.billing_account_id)
);

create policy institution_contracts_visible_account_select
on public.institution_contracts for select to authenticated
using (
  exists (select 1 from public.billing_accounts ba where ba.id = institution_contracts.billing_account_id)
);

create policy billing_entitlements_visible_account_select
on public.billing_entitlements for select to authenticated
using (
  exists (select 1 from public.billing_accounts ba where ba.id = billing_entitlements.billing_account_id)
);

-- Billing event rows are deliberately not browser-readable. They are an integration/audit record.

grant select, insert on public.billing_accounts to authenticated;
grant select on public.billing_subscriptions to authenticated;
grant select on public.institution_contracts to authenticated;
grant select on public.billing_entitlements to authenticated;

commit;
