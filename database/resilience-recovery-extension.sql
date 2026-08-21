-- Aurelia resilience / recovery extension
-- REVIEWABLE ONLY: provider backup bytes and keys remain outside the application database.

create type public.backup_verification_status as enum ('pending', 'verified', 'failed', 'expired');
create type public.restore_status as enum ('requested', 'approved', 'validating', 'executing', 'verifying', 'completed', 'rejected', 'failed');
create type public.restore_check_status as enum ('pending', 'passed', 'failed');

create table public.backup_catalog (
  id uuid primary key default gen_random_uuid(),
  provider_reference_hash text not null unique,
  source_environment text not null,
  region_code text,
  encrypted_at_rest boolean not null,
  encrypted_in_transit boolean not null,
  created_at timestamptz not null,
  expires_at timestamptz not null,
  verification_status public.backup_verification_status not null default 'pending',
  verified_at timestamptz,
  check (expires_at > created_at),
  check (char_length(provider_reference_hash) >= 32)
);

create table public.deletion_tombstones (
  id uuid primary key default gen_random_uuid(),
  deletion_request_id uuid not null references public.data_rights_requests(id) on delete restrict,
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  data_class public.data_lifecycle_class not null,
  policy_version text not null,
  deleted_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (deletion_request_id, data_class)
);

create table public.restore_requests (
  id uuid primary key default gen_random_uuid(),
  backup_id uuid not null references public.backup_catalog(id) on delete restrict,
  requested_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  approved_by_profile_id uuid references public.profiles(id) on delete restrict,
  incident_id uuid references public.security_incidents(id) on delete set null,
  change_reference text,
  scope_type text not null check (scope_type in ('profile', 'school', 'group', 'platform')),
  scope_reference_hash text,
  target_environment text not null,
  production_restore boolean not null default false,
  policy_version text not null,
  status public.restore_status not null default 'requested',
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  validation_completed_at timestamptz,
  executed_at timestamptz,
  verified_at timestamptz,
  completed_at timestamptz,
  check (incident_id is not null or char_length(trim(change_reference)) > 0),
  check (approved_by_profile_id is null or approved_by_profile_id <> requested_by_profile_id)
);

create table public.restore_verification_checks (
  id uuid primary key default gen_random_uuid(),
  restore_request_id uuid not null references public.restore_requests(id) on delete cascade,
  check_key text not null,
  status public.restore_check_status not null default 'pending',
  detail text,
  checked_by_profile_id uuid references public.profiles(id) on delete set null,
  checked_at timestamptz,
  unique (restore_request_id, check_key)
);

create table public.recovery_policy_targets (
  id uuid primary key default gen_random_uuid(),
  policy_version text not null unique,
  recovery_point_minutes integer not null check (recovery_point_minutes > 0),
  recovery_time_minutes integer not null check (recovery_time_minutes > 0),
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.recovery_test_runs (
  id uuid primary key default gen_random_uuid(),
  backup_id uuid not null references public.backup_catalog(id) on delete restrict,
  policy_version text not null,
  isolated_environment_reference text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  passed boolean,
  summary text
);

alter table public.backup_catalog enable row level security;
alter table public.deletion_tombstones enable row level security;
alter table public.restore_requests enable row level security;
alter table public.restore_verification_checks enable row level security;
alter table public.recovery_policy_targets enable row level security;
alter table public.recovery_test_runs enable row level security;

-- Intentionally no blanket authenticated policies.
-- Recovery contract:
-- 1. backup bytes, encryption keys and raw auth-provider secrets are never stored in these tables,
-- 2. production restore requires step-up authentication plus a second approving staff member,
-- 3. backups are validated in an isolated environment before production execution,
-- 4. deletion_tombstones are replayed so a restore cannot resurrect deliberately deleted ordinary data,
-- 5. valid narrow retention holds remain authoritative for the records they cover,
-- 6. expired permission/partner grants are removed and media/publication safety state is revalidated,
-- 7. restored application sessions are revoked rather than resumed,
-- 8. RLS/role access checks must pass before restored data serves traffic,
-- 9. backups are recovery assets, not an alternative analytics or indefinite archive.
