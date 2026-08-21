-- Release/change governance metadata draft.

create table if not exists public.release_changes (
  id uuid primary key default gen_random_uuid(),
  change_ref text not null unique,
  risk text not null check (risk in ('low','medium','high','critical')),
  requested_by uuid not null,
  production_approver uuid,
  tests_passed boolean not null default false,
  security_checks_passed boolean not null default false,
  safety_impact_reviewed boolean not null default false,
  rollback_plan_present boolean not null default false,
  migration_reversible_or_recovery_verified boolean not null default false,
  emergency boolean not null default false,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  deployed_at timestamptz,
  rolled_back_at timestamptz,
  check (production_approver is null or production_approver <> requested_by)
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null unique,
  safer_default boolean not null default true,
  child_access_expansion boolean not null default false,
  enabled boolean not null default false,
  approved_change_id uuid references public.release_changes(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (child_access_expansion = false or enabled = false or approved_change_id is not null)
);

create table if not exists public.release_reviews (
  id uuid primary key default gen_random_uuid(),
  release_change_id uuid not null references public.release_changes(id) on delete cascade,
  review_type text not null check (review_type in ('security','child_safety','privacy','database','after_action')),
  reviewed_by uuid not null,
  outcome text not null check (outcome in ('approve','changes_required','block')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.release_audit_events (
  id uuid primary key default gen_random_uuid(),
  release_change_id uuid not null references public.release_changes(id) on delete cascade,
  actor_user_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.release_changes enable row level security;
alter table public.feature_flags enable row level security;
alter table public.release_reviews enable row level security;
alter table public.release_audit_events enable row level security;

-- No blanket authenticated-user policies.
-- Production deployment requires application-side enforcement of green CI and the relevant review/rollback conditions.
-- Feature flags affecting child access default disabled and require an approved change before enabling.
-- Rollback must replay deletion/revocation state from the lifecycle and recovery controls.
