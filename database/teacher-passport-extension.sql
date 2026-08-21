-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Teacher verification is evidence-backed and limited to authorised cohort relationships.

create table if not exists public.teacher_briefs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid not null,
  cohort_id uuid not null,
  teacher_user_id uuid not null,
  title text not null,
  instructions text not null,
  skills text[] not null default '{}',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_brief_submissions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.teacher_briefs(id) on delete cascade,
  child_user_id uuid not null,
  project_id uuid not null,
  school_id uuid not null,
  review_state text not null default 'submitted' check (review_state in ('submitted','in_review','revision_requested','verified','closed')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by_user_id uuid
);

create table if not exists public.passport_achievement_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid not null,
  child_user_id uuid not null,
  kind text not null check (kind in ('project','certificate','skill','leadership','volunteering','award')),
  title text not null,
  evidence_type text not null,
  evidence_id uuid not null,
  issuer_type text not null check (issuer_type in ('teacher','school','approved_organisation')),
  issuer_user_id uuid,
  issuer_organisation_id uuid,
  verification_note text,
  verified_at timestamptz not null,
  visibility text not null default 'private' check (visibility in ('private','family','school','shared_portfolio')),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.passport_verification_audit (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.passport_achievement_records(id) on delete cascade,
  actor_user_id uuid not null,
  action text not null check (action in ('issued','updated','visibility_changed','revoked')),
  reason text,
  created_at timestamptz not null default now()
);

alter table public.teacher_briefs enable row level security;
alter table public.teacher_brief_submissions enable row level security;
alter table public.passport_achievement_records enable row level security;
alter table public.passport_verification_audit enable row level security;

-- No blanket authenticated policies are installed in this draft.
-- Teacher access must be derived from current school + cohort assignments, not role metadata alone.
-- Group administrators receive aggregate Passport reporting, not raw cross-school Passport browsing.
-- Passport visibility defaults to private; sharing is a separate explicit action.
-- No likes, follower counts, popularity scores or public learner rankings are represented here.
