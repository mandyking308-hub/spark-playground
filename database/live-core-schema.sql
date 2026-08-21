-- Aurelia CORE LIVE SCHEMA — phase 1
-- Target: a NEW dedicated Aurelia Supabase project only.
-- Purpose: activate the smallest safe identity/tenant/family/project/permission
-- surface before broader community, staff, partner and alumni domains go live.
--
-- This is intentionally NOT the old schema-draft.sql. It incorporates the
-- security corrections discovered during backend activation so unsafe draft
-- policies never need to exist in the new project.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.platform_role as enum (
  'child',
  'parent',
  'parent_alumni',
  'teacher',
  'school_admin',
  'group_admin',
  'organisation_admin',
  'alumni',
  'mentor',
  'platform_admin'
);

create type public.age_band as enum ('under_9', 'age_9_12', 'age_13_15', 'age_16_plus', 'adult');
create type public.membership_status as enum ('pending', 'active', 'suspended', 'ended');
create type public.guardian_link_status as enum ('pending', 'verified', 'revoked');
create type public.project_kind as enum ('podcast', 'story', 'book', 'art', 'video', 'game', 'general');
create type public.content_state as enum (
  'draft',
  'scan_pending',
  'approval_pending',
  'moderation_pending',
  'published',
  'rejected',
  'removed'
);

-- ---------------------------------------------------------------------------
-- Identity / tenancy
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  primary_role public.platform_role not null,
  age_band public.age_band not null,
  country_code text,
  avatar_path text,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_code text,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  education_group_id uuid references public.education_groups(id) on delete set null,
  name text not null,
  slug text not null,
  country_code text,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (education_group_id, slug)
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  cohort_type text not null default 'class',
  academic_year text,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.school_memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  role public.platform_role not null,
  status public.membership_status not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  unique (profile_id, school_id, role),
  check (role in ('child', 'teacher', 'school_admin'))
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  education_group_id uuid not null references public.education_groups(id) on delete cascade,
  role public.platform_role not null,
  status public.membership_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (profile_id, education_group_id, role),
  check (role in ('group_admin', 'platform_admin'))
);

create table public.cohort_memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (profile_id, cohort_id)
);

-- ---------------------------------------------------------------------------
-- Family relationships
-- ---------------------------------------------------------------------------

create table public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  parent_profile_id uuid not null references public.profiles(id) on delete cascade,
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  relationship_label text,
  status public.guardian_link_status not null default 'pending',
  verified_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (parent_profile_id, child_profile_id),
  check (parent_profile_id <> child_profile_id),
  check ((status = 'verified' and verified_at is not null and revoked_at is null)
    or (status = 'revoked' and revoked_at is not null)
    or status = 'pending')
);

-- ---------------------------------------------------------------------------
-- Jurisdiction / privacy configuration
-- ---------------------------------------------------------------------------

create table public.jurisdiction_policy_versions (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_code text not null,
  version text not null,
  effective_from timestamptz not null,
  effective_until timestamptz,
  policy jsonb not null,
  verified_by_profile_id uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (jurisdiction_code, version),
  check (effective_until is null or effective_until > effective_from)
);

create table public.privacy_preferences (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null unique references public.profiles(id) on delete cascade,
  jurisdiction_policy_id uuid references public.jurisdiction_policy_versions(id) on delete set null,
  location_sharing boolean not null default false,
  profiling boolean not null default false,
  ai_enabled boolean not null default false,
  publishing_requires_parent_approval boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Safe current-identity helpers
-- SECURITY INVOKER is deliberate: these helpers do not bypass RLS.
-- ---------------------------------------------------------------------------

create function public.current_profile_id()
returns uuid
language sql
stable
security invoker
set search_path = ''
as $$
  select p.id
  from public.profiles p
  where p.auth_user_id = (select auth.uid())
    and p.disabled_at is null
  limit 1
$$;

revoke all on function public.current_profile_id() from public;
grant execute on function public.current_profile_id() to authenticated;

-- ---------------------------------------------------------------------------
-- Child projects — identity is DB-derived, not browser-provided.
-- ---------------------------------------------------------------------------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  kind public.project_kind not null,
  title text not null check (char_length(title) between 1 and 160),
  summary text check (summary is null or char_length(summary) <= 4000),
  state public.content_state not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((state = 'published' and published_at is not null) or state <> 'published')
);

-- ---------------------------------------------------------------------------
-- Child-initiated, resource-specific permission workflow
-- ---------------------------------------------------------------------------

create table public.permission_requests (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  requested_by_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  request_type text not null check (
    request_type in ('publish_external', 'join_club', 'enter_challenge', 'share_portfolio', 'alumni_transfer')
  ),
  resource_kind text not null check (
    resource_kind in ('project', 'club', 'challenge', 'passport_item', 'alumni_transition')
  ),
  resource_id uuid,
  state text not null default 'pending' check (state in ('pending', 'approved', 'denied', 'withdrawn', 'expired')),
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  check (requested_by_profile_id = child_profile_id),
  check (expires_at is null or expires_at > requested_at)
);

create table public.permission_requirements (
  request_id uuid primary key references public.permission_requests(id) on delete cascade,
  jurisdiction_policy_id uuid references public.jurisdiction_policy_versions(id) on delete set null,
  policy_version text not null,
  guardian_required boolean not null default true,
  school_required boolean not null default false,
  safety_review_required boolean not null default true,
  recorded_at timestamptz not null default now()
);

create table public.permission_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.permission_requests(id) on delete cascade,
  decision_role text not null check (decision_role in ('guardian', 'school', 'safety')),
  decision text not null check (decision in ('approved', 'denied')),
  decision_by_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete restrict,
  guardian_link_id uuid references public.guardian_links(id) on delete restrict,
  policy_version text not null,
  decision_note text check (decision_note is null or char_length(decision_note) <= 2000),
  decided_at timestamptz not null default now(),
  unique (request_id, decision_role),
  check ((decision_role = 'guardian' and guardian_link_id is not null)
    or (decision_role <> 'guardian' and guardian_link_id is null))
);

create table public.permission_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.permission_requests(id) on delete cascade,
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null check (
    event_type in ('requested', 'approved', 'denied', 'withdrawn', 'expired', 'policy_checked', 'safety_checked')
  ),
  event_metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

-- Browser-created guardian decisions derive actor + policy version in DB.
create function public.set_guardian_decision_context()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.decision_by_profile_id := public.current_profile_id();
  select pr.policy_version into new.policy_version
  from public.permission_requirements pr
  where pr.request_id = new.request_id;

  if new.policy_version is null then
    raise exception 'Permission requirements are not available for this request';
  end if;

  return new;
end;
$$;

revoke all on function public.set_guardian_decision_context() from public;
grant execute on function public.set_guardian_decision_context() to authenticated;

create trigger permission_decision_context_before_insert
before insert on public.permission_decisions
for each row execute function public.set_guardian_decision_context();

-- ---------------------------------------------------------------------------
-- Minimal audit anchor — privileged/server writes only.
-- ---------------------------------------------------------------------------

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index idx_profiles_auth_user_id on public.profiles(auth_user_id);
create index idx_school_memberships_profile on public.school_memberships(profile_id, status);
create index idx_school_memberships_school on public.school_memberships(school_id, status);
create index idx_group_memberships_profile on public.group_memberships(profile_id, status);
create index idx_cohort_memberships_profile on public.cohort_memberships(profile_id, status);
create index idx_guardian_links_parent on public.guardian_links(parent_profile_id, status);
create index idx_guardian_links_child on public.guardian_links(child_profile_id, status);
create index idx_projects_owner on public.projects(owner_profile_id, state);
create index idx_projects_school on public.projects(school_id, state);
create index idx_permission_requests_child_state on public.permission_requests(child_profile_id, state);
create index idx_permission_decisions_request on public.permission_decisions(request_id);
create index idx_permission_events_request on public.permission_events(request_id, occurred_at);
create index idx_jurisdiction_policy_code on public.jurisdiction_policy_versions(jurisdiction_code, effective_from desc);

-- ---------------------------------------------------------------------------
-- RLS activation
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.education_groups enable row level security;
alter table public.schools enable row level security;
alter table public.cohorts enable row level security;
alter table public.school_memberships enable row level security;
alter table public.group_memberships enable row level security;
alter table public.cohort_memberships enable row level security;
alter table public.guardian_links enable row level security;
alter table public.jurisdiction_policy_versions enable row level security;
alter table public.privacy_preferences enable row level security;
alter table public.projects enable row level security;
alter table public.permission_requests enable row level security;
alter table public.permission_requirements enable row level security;
alter table public.permission_decisions enable row level security;
alter table public.permission_events enable row level security;
alter table public.audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- RLS: identity and self-scoped tenant membership
-- ---------------------------------------------------------------------------

create policy profiles_self_select
on public.profiles for select to authenticated
using (auth_user_id = (select auth.uid()) and disabled_at is null);

create policy profiles_self_update_presentation
on public.profiles for update to authenticated
using (auth_user_id = (select auth.uid()) and disabled_at is null)
with check (auth_user_id = (select auth.uid()) and disabled_at is null);

create policy school_memberships_self_select
on public.school_memberships for select to authenticated
using (profile_id = public.current_profile_id());

create policy group_memberships_self_select
on public.group_memberships for select to authenticated
using (profile_id = public.current_profile_id());

create policy cohort_memberships_self_select
on public.cohort_memberships for select to authenticated
using (profile_id = public.current_profile_id());

create policy schools_member_select
on public.schools for select to authenticated
using (
  id in (
    select sm.school_id from public.school_memberships sm
    where sm.profile_id = public.current_profile_id() and sm.status = 'active'
  )
);

create policy groups_member_select
on public.education_groups for select to authenticated
using (
  id in (
    select gm.education_group_id from public.group_memberships gm
    where gm.profile_id = public.current_profile_id() and gm.status = 'active'
  )
  or id in (
    select s.education_group_id
    from public.schools s
    join public.school_memberships sm on sm.school_id = s.id
    where sm.profile_id = public.current_profile_id()
      and sm.status = 'active'
      and s.education_group_id is not null
  )
);

create policy cohorts_member_select
on public.cohorts for select to authenticated
using (
  id in (
    select cm.cohort_id from public.cohort_memberships cm
    where cm.profile_id = public.current_profile_id() and cm.status = 'active'
  )
  or school_id in (
    select sm.school_id from public.school_memberships sm
    where sm.profile_id = public.current_profile_id()
      and sm.status = 'active'
      and sm.role in ('teacher', 'school_admin')
  )
);

-- ---------------------------------------------------------------------------
-- RLS: guardian relationships — relationship visibility, NOT draft access.
-- ---------------------------------------------------------------------------

create policy guardian_links_subject_select
on public.guardian_links for select to authenticated
using (
  parent_profile_id = public.current_profile_id()
  or child_profile_id = public.current_profile_id()
);

-- ---------------------------------------------------------------------------
-- RLS: privacy preferences — subject + currently verified guardian read only.
-- ---------------------------------------------------------------------------

create policy privacy_preferences_subject_guardian_select
on public.privacy_preferences for select to authenticated
using (
  subject_profile_id = public.current_profile_id()
  or exists (
    select 1 from public.guardian_links gl
    where gl.parent_profile_id = public.current_profile_id()
      and gl.child_profile_id = privacy_preferences.subject_profile_id
      and gl.status = 'verified'
  )
);

-- Jurisdiction policy versions are server-managed. A verified active record may
-- be exposed later through a purpose-specific security-invoker view/RPC.

-- ---------------------------------------------------------------------------
-- RLS: projects — owner only in phase 1.
-- ---------------------------------------------------------------------------

create policy projects_owner_select
on public.projects for select to authenticated
using (owner_profile_id = public.current_profile_id());

create policy projects_owner_insert
on public.projects for insert to authenticated
with check (
  owner_profile_id = public.current_profile_id()
  and state = 'draft'
  and published_at is null
  and (
    school_id is null
    or school_id in (
      select sm.school_id from public.school_memberships sm
      where sm.profile_id = public.current_profile_id()
        and sm.status = 'active'
        and sm.role = 'child'
    )
  )
);

create policy projects_owner_update_draft
on public.projects for update to authenticated
using (
  owner_profile_id = public.current_profile_id()
  and state in ('draft', 'rejected')
)
with check (
  owner_profile_id = public.current_profile_id()
  and state in ('draft', 'rejected')
  and published_at is null
);

create policy projects_owner_delete_unpublished
on public.projects for delete to authenticated
using (
  owner_profile_id = public.current_profile_id()
  and state in ('draft', 'rejected')
  and published_at is null
);

-- No generic parent/teacher/organisation/alumni project policy exists here.

-- ---------------------------------------------------------------------------
-- RLS: child-initiated permission requests
-- ---------------------------------------------------------------------------

create policy permission_requests_subject_guardian_select
on public.permission_requests for select to authenticated
using (
  child_profile_id = public.current_profile_id()
  or exists (
    select 1 from public.guardian_links gl
    where gl.parent_profile_id = public.current_profile_id()
      and gl.child_profile_id = permission_requests.child_profile_id
      and gl.status = 'verified'
  )
);

create policy permission_requests_child_insert
on public.permission_requests for insert to authenticated
with check (
  child_profile_id = public.current_profile_id()
  and requested_by_profile_id = public.current_profile_id()
  and state = 'pending'
);

create policy permission_requests_child_withdraw
on public.permission_requests for update to authenticated
using (child_profile_id = public.current_profile_id() and state = 'pending')
with check (child_profile_id = public.current_profile_id() and state = 'withdrawn');

create policy permission_requirements_subject_guardian_select
on public.permission_requirements for select to authenticated
using (
  exists (
    select 1 from public.permission_requests req
    where req.id = permission_requirements.request_id
      and (
        req.child_profile_id = public.current_profile_id()
        or exists (
          select 1 from public.guardian_links gl
          where gl.parent_profile_id = public.current_profile_id()
            and gl.child_profile_id = req.child_profile_id
            and gl.status = 'verified'
        )
      )
  )
);

create policy permission_decisions_subject_guardian_select
on public.permission_decisions for select to authenticated
using (
  exists (
    select 1 from public.permission_requests req
    where req.id = permission_decisions.request_id
      and (
        req.child_profile_id = public.current_profile_id()
        or exists (
          select 1 from public.guardian_links gl
          where gl.parent_profile_id = public.current_profile_id()
            and gl.child_profile_id = req.child_profile_id
            and gl.status = 'verified'
        )
      )
  )
);

create policy permission_decisions_verified_guardian_insert
on public.permission_decisions for insert to authenticated
with check (
  decision_role = 'guardian'
  and decision_by_profile_id = public.current_profile_id()
  and exists (
    select 1
    from public.guardian_links gl
    join public.permission_requests req on req.child_profile_id = gl.child_profile_id
    where gl.id = guardian_link_id
      and req.id = request_id
      and gl.parent_profile_id = public.current_profile_id()
      and gl.status = 'verified'
      and req.state = 'pending'
  )
);

create policy permission_events_subject_guardian_select
on public.permission_events for select to authenticated
using (
  exists (
    select 1 from public.permission_requests req
    where req.id = permission_events.request_id
      and (
        req.child_profile_id = public.current_profile_id()
        or exists (
          select 1 from public.guardian_links gl
          where gl.parent_profile_id = public.current_profile_id()
            and gl.child_profile_id = req.child_profile_id
            and gl.status = 'verified'
        )
      )
  )
);

-- ---------------------------------------------------------------------------
-- Data API privileges: explicit least privilege.
-- ---------------------------------------------------------------------------

revoke all privileges on all tables in schema public from anon;
revoke all privileges on all tables in schema public from authenticated;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on all sequences in schema public from authenticated;

grant usage on schema public to authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, avatar_path) on public.profiles to authenticated;

grant select on public.education_groups to authenticated;
grant select on public.schools to authenticated;
grant select on public.cohorts to authenticated;
grant select on public.school_memberships to authenticated;
grant select on public.group_memberships to authenticated;
grant select on public.cohort_memberships to authenticated;
grant select on public.guardian_links to authenticated;
grant select on public.privacy_preferences to authenticated;

grant select on public.projects to authenticated;
grant insert (school_id, kind, title, summary) on public.projects to authenticated;
grant update (title, summary) on public.projects to authenticated;
grant delete on public.projects to authenticated;

grant select on public.permission_requests to authenticated;
grant insert (request_type, resource_kind, resource_id, expires_at) on public.permission_requests to authenticated;
grant update (state) on public.permission_requests to authenticated;
grant select on public.permission_requirements to authenticated;
grant select on public.permission_decisions to authenticated;
grant insert (request_id, decision_role, decision, guardian_link_id, decision_note) on public.permission_decisions to authenticated;
grant select on public.permission_events to authenticated;

-- No ordinary browser grants on:
-- * jurisdiction_policy_versions writes/reads
-- * guardian verification writes
-- * staff/tenant provisioning writes
-- * permission requirements/events writes
-- * audit_log
-- * project moderation/publication state
-- * any future safeguarding/partner/security operational tables

commit;
