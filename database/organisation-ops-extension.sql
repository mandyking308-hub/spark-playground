-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Partner access is institutional/programme based and never confers generic child access.

create table if not exists public.organisation_verifications (
  organisation_id uuid primary key,
  legal_name text not null,
  status text not null default 'pending' check (status in ('pending','verified','suspended','revoked')),
  verified_by_user_id uuid,
  verified_at timestamptz,
  suspended_at timestamptz,
  revoked_at timestamptz,
  verification_note text
);

create table if not exists public.organisation_staff_grants (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisation_verifications(organisation_id) on delete cascade,
  user_id uuid not null,
  staff_role text not null check (staff_role in ('programme_admin','content_editor','judge')),
  granted_by_user_id uuid not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (organisation_id, user_id, staff_role)
);

create table if not exists public.organisation_programmes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisation_verifications(organisation_id) on delete cascade,
  tenant_id uuid not null,
  school_id uuid,
  title text not null,
  programme_type text not null check (programme_type in ('content','masterclass','event','challenge','competition','careers')),
  min_age integer,
  max_age integer,
  approval_state text not null default 'draft' check (approval_state in ('draft','submitted','approved','rejected','suspended')),
  approved_by_user_id uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.organisation_content_items (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.organisation_programmes(id) on delete cascade,
  created_by_user_id uuid not null,
  title text not null,
  content_type text not null,
  body jsonb not null default '{}'::jsonb,
  moderation_state text not null default 'draft' check (moderation_state in ('draft','submitted','approved','rejected','suspended')),
  approved_by_user_id uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.organisation_programme_metrics (
  programme_id uuid primary key references public.organisation_programmes(id) on delete cascade,
  eligible_participant_count integer not null default 0,
  participation_count integer not null default 0,
  completion_count integer not null default 0,
  aggregate_feedback jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organisation_verifications enable row level security;
alter table public.organisation_staff_grants enable row level security;
alter table public.organisation_programmes enable row level security;
alter table public.organisation_content_items enable row level security;
alter table public.organisation_programme_metrics enable row level security;

-- No child_id, child_profile_id, child_email, child_phone or behavioural_profile fields exist in the partner domain.
-- Partners receive programme eligibility/audience delivery through server-side rules, not participant lists.
-- Programme metrics are aggregate only.
-- Suspended/revoked organisations and revoked staff grants must fail server-side authorisation immediately.
-- No blanket authenticated policies are installed in this draft.
