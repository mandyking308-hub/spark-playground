-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Enterprise administration uses explicit grants; profile metadata never grants privilege.

create table if not exists public.enterprise_school_authorisations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid not null,
  user_id uuid not null,
  admin_role text not null check (admin_role in ('school_admin','group_admin','teacher','safeguarding_staff')),
  granted_by_user_id uuid not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (school_id, user_id, admin_role)
);

create table if not exists public.enterprise_group_scopes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  group_admin_user_id uuid not null,
  school_id uuid not null,
  granted_by_user_id uuid not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (group_admin_user_id, school_id)
);

create table if not exists public.school_cohorts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid not null,
  name text not null,
  academic_year text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.school_cohort_memberships (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.school_cohorts(id) on delete cascade,
  school_id uuid not null,
  user_id uuid not null,
  member_type text not null check (member_type in ('learner','teacher')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (cohort_id, user_id)
);

alter table public.enterprise_school_authorisations enable row level security;
alter table public.enterprise_group_scopes enable row level security;
alter table public.school_cohorts enable row level security;
alter table public.school_cohort_memberships enable row level security;

-- No blanket authenticated policies are installed here.
-- Server-side verified grant helpers must establish school/group scope before browser reads are permitted.
-- Group-level analytics should query aggregate views, not expose raw cross-school learner rows.
-- A role request or user profile field must never create enterprise_school_authorisations records automatically.
