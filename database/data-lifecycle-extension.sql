-- Aurelia data lifecycle schema extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend exists.

create type public.data_rights_request_kind as enum ('export', 'delete_account', 'alumni_transfer');
create type public.data_rights_request_status as enum ('requested', 'verified', 'processing', 'completed', 'rejected', 'cancelled');
create type public.data_lifecycle_class as enum (
  'profile',
  'projects',
  'media',
  'achievements',
  'passport',
  'community',
  'consent_history',
  'moderation',
  'safeguarding',
  'audit'
);

create table public.data_rights_requests (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  requested_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  kind public.data_rights_request_kind not null,
  status public.data_rights_request_status not null default 'requested',
  policy_version text not null,
  requested_at timestamptz not null default now(),
  verified_at timestamptz,
  processing_started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  completion_summary text
);

create table public.data_rights_request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.data_rights_requests(id) on delete cascade,
  data_class public.data_lifecycle_class not null,
  action text not null check (action in ('export', 'delete', 'retain', 'transfer')),
  outcome text not null default 'pending' check (outcome in ('pending', 'completed', 'held', 'excluded', 'failed')),
  outcome_reason text,
  processed_at timestamptz,
  unique (request_id, data_class, action)
);

create table public.retention_holds (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  data_class public.data_lifecycle_class not null,
  reason text not null check (char_length(trim(reason)) >= 8),
  policy_version text not null check (char_length(trim(policy_version)) > 0),
  retain_until timestamptz not null,
  placed_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  released_at timestamptz,
  release_reason text,
  check (data_class in ('consent_history', 'moderation', 'safeguarding', 'audit')),
  check (retain_until > created_at)
);

create table public.alumni_transfer_selections (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.data_rights_requests(id) on delete cascade,
  source_passport_item_id uuid not null references public.passport_items(id) on delete cascade,
  consent_record_id uuid not null references public.consent_records(id) on delete restrict,
  transferred_at timestamptz,
  unique (request_id, source_passport_item_id)
);

create table public.data_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.data_rights_requests(id) on delete set null,
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  data_class public.data_lifecycle_class,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.data_rights_requests enable row level security;
alter table public.data_rights_request_items enable row level security;
alter table public.retention_holds enable row level security;
alter table public.alumni_transfer_selections enable row level security;
alter table public.data_lifecycle_events enable row level security;

-- Intentionally no blanket authenticated policies.
-- Access must be provided only through dedicated backend/service functions that verify:
-- 1. subject identity or a verified guardian relationship where jurisdiction allows it,
-- 2. child agency for Alumni transfer,
-- 3. staff authority before placing/releasing a retention hold,
-- 4. policy-version and retention-expiry requirements,
-- 5. exclusion of safeguarding/guardian records from Alumni transfer,
-- 6. immediate session/share revocation when deletion processing begins.
