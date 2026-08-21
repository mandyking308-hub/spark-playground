-- Aurelia external organisation / partner boundary extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend exists.

create type public.partner_programme_status as enum ('draft', 'reviewing', 'approved', 'suspended', 'ended');
create type public.partner_feedback_status as enum ('pending_moderation', 'approved', 'rejected', 'withdrawn');

create table public.partner_programmes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  status public.partner_programme_status not null default 'draft',
  approved_by_profile_id uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.partner_submission_access_grants (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.partner_programmes(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  challenge_submission_id uuid not null references public.challenge_submissions(id) on delete cascade,
  review_alias text not null,
  sharing_permission_request_id uuid references public.permission_requests(id) on delete restrict,
  granted_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  granted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at > granted_at)
);

create table public.partner_feedback_requests (
  id uuid primary key default gen_random_uuid(),
  access_grant_id uuid not null references public.partner_submission_access_grants(id) on delete cascade,
  authored_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  feedback_body text not null,
  status public.partner_feedback_status not null default 'pending_moderation',
  moderated_by_profile_id uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.partner_aggregate_reports (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.partner_programmes(id) on delete cascade,
  cohort_size integer not null check (cohort_size >= 10),
  aggregate_metrics jsonb not null default '{}'::jsonb,
  generated_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  generated_at timestamptz not null default now()
);

alter table public.partner_programmes enable row level security;
alter table public.partner_submission_access_grants enable row level security;
alter table public.partner_feedback_requests enable row level security;
alter table public.partner_aggregate_reports enable row level security;

-- Intentionally no blanket authenticated policies.
-- Partner access contract:
-- 1. organisation and organisation member must be verified and the programme approved,
-- 2. partners receive no child directory, direct contact fields, precise location or behavioural profile exports,
-- 3. a submission is visible only through a time-bounded grant tied to an approved sharing request,
-- 4. partner review uses review_alias and the sanitized submission rather than full child profile access,
-- 5. partner free-text feedback is moderated before any child-facing delivery,
-- 6. aggregate reports require cohort_size >= 10 and contain no child identifiers,
-- 7. partner content may not add third-party tracking or cross-programme child tracking.
