-- Aurelia backend schema draft
-- REVIEWABLE ONLY: do not apply to the inactive generic Supabase project.
-- Convert to a formal Supabase migration only after a dedicated project exists.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
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
create type public.parent_lifecycle_state as enum ('current_parent', 'parent_alumni', 'current_and_alumni', 'inactive');
create type public.child_lifecycle_state as enum ('under_16_member', 'graduation_pending', 'alumni_16_plus', 'inactive');
create type public.project_kind as enum ('podcast', 'story', 'book', 'art', 'video', 'game', 'general');
create type public.content_state as enum ('draft', 'scan_pending', 'approval_pending', 'moderation_pending', 'published', 'rejected', 'removed');
create type public.community_audience as enum ('parents', 'parent_alumni', 'parents_and_alumni', 'staff', 'alumni_16_plus');
create type public.moderation_status as enum ('open', 'reviewing', 'actioned', 'dismissed', 'appealed', 'closed');
create type public.consent_type as enum ('account', 'publishing', 'ai', 'media', 'portfolio_transition', 'community');
create type public.opportunity_audience as enum ('under_16', 'alumni_16_plus', 'adults');

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
  unique (profile_id, school_id, role)
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  education_group_id uuid not null references public.education_groups(id) on delete cascade,
  role public.platform_role not null,
  status public.membership_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (profile_id, education_group_id, role)
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
-- Family lifecycle
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
  check (parent_profile_id <> child_profile_id)
);

create table public.parent_lifecycle (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  state public.parent_lifecycle_state not null default 'current_parent',
  alumni_opt_in_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.child_lifecycle (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  state public.child_lifecycle_state not null default 'under_16_member',
  transition_eligible_at timestamptz,
  transitioned_at timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Creator / passport
-- ---------------------------------------------------------------------------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  kind public.project_kind not null,
  title text not null,
  summary text,
  state public.content_state not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  byte_size bigint,
  privacy_state text not null default 'private',
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.podcast_series (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  state public.content_state not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.podcast_series(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  audio_asset_id uuid references public.media_assets(id) on delete set null,
  transcript text,
  state public.content_state not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  issued_by_profile_id uuid references public.profiles(id) on delete set null,
  achievement_type text not null,
  title text not null,
  description text,
  verified boolean not null default false,
  awarded_at timestamptz not null default now(),
  evidence_project_id uuid references public.projects(id) on delete set null
);

create table public.passport_items (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  display_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  check (project_id is not null or achievement_id is not null)
);

-- ---------------------------------------------------------------------------
-- Challenges / clubs
-- ---------------------------------------------------------------------------

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organisation_type text,
  verified_at timestamptz,
  status public.membership_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.membership_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (organisation_id, profile_id)
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  education_group_id uuid references public.education_groups(id) on delete cascade,
  organisation_id uuid references public.organisations(id) on delete cascade,
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text not null,
  starts_at timestamptz,
  closes_at timestamptz,
  state public.content_state not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.challenge_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted',
  unique (challenge_id, child_profile_id, project_id)
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  description text,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.membership_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (club_id, profile_id)
);

-- ---------------------------------------------------------------------------
-- Adult parent / parent alumni community
-- ---------------------------------------------------------------------------

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  education_group_id uuid references public.education_groups(id) on delete cascade,
  name text not null,
  description text,
  audience public.community_audience not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.community_memberships (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.membership_status not null default 'pending',
  joined_at timestamptz,
  unique (community_id, profile_id)
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create table public.adult_connections (
  id uuid primary key default gen_random_uuid(),
  requester_profile_id uuid not null references public.profiles(id) on delete cascade,
  addressee_profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  check (requester_profile_id <> addressee_profile_id)
);

create table public.adult_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete cascade,
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location_text text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Consent / safeguarding / moderation
-- ---------------------------------------------------------------------------

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  granted_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  consent_type public.consent_type not null,
  policy_version text not null,
  granted boolean not null,
  recorded_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create table public.publication_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  automated_scan_status text not null default 'pending',
  parent_approval_status text not null default 'not_required',
  moderator_status text not null default 'pending',
  reviewed_by_profile_id uuid references public.profiles(id) on delete set null,
  decision_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.moderation_cases (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  subject_profile_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  opened_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  category text not null,
  status public.moderation_status not null default 'open',
  severity text not null default 'standard',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.safeguarding_reports (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  child_profile_id uuid references public.profiles(id) on delete set null,
  reporter_profile_id uuid not null references public.profiles(id) on delete restrict,
  category text not null,
  risk_level text not null,
  summary text not null,
  status public.moderation_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Opportunities / alumni 16+
-- ---------------------------------------------------------------------------

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  education_group_id uuid references public.education_groups(id) on delete cascade,
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  audience public.opportunity_audience not null,
  opportunity_type text not null,
  title text not null,
  description text not null,
  opens_at timestamptz,
  closes_at timestamptz,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.portfolio_transition_consents (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  approved_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  approved_at timestamptz not null default now(),
  revoked_at timestamptz,
  check (project_id is not null or achievement_id is not null)
);

create table public.alumni_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  alumni_profile_id uuid not null references public.profiles(id) on delete cascade,
  source_transition_consent_id uuid references public.portfolio_transition_consents(id) on delete set null,
  title text not null,
  description text,
  item_type text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AI policy / audit
-- ---------------------------------------------------------------------------

create table public.ai_policy_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  age_band public.age_band not null,
  country_code text,
  policy jsonb not null,
  active_from timestamptz not null default now(),
  active_until timestamptz
);

create table public.ai_audit_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  policy_version text not null,
  capability text not null,
  classification text not null,
  outcome text not null,
  prompt_retained boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Audit
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
-- Indexes used by RLS / common filters
-- ---------------------------------------------------------------------------

create index idx_profiles_auth_user_id on public.profiles(auth_user_id);
create index idx_school_memberships_profile on public.school_memberships(profile_id, status);
create index idx_school_memberships_school on public.school_memberships(school_id, status);
create index idx_group_memberships_profile on public.group_memberships(profile_id, status);
create index idx_guardian_links_parent on public.guardian_links(parent_profile_id, status);
create index idx_guardian_links_child on public.guardian_links(child_profile_id, status);
create index idx_projects_owner on public.projects(owner_profile_id, state);
create index idx_projects_school on public.projects(school_id, state);
create index idx_achievements_child on public.achievements(child_profile_id, awarded_at desc);
create index idx_community_memberships_profile on public.community_memberships(profile_id, status);
create index idx_community_memberships_community on public.community_memberships(community_id, status);
create index idx_moderation_school on public.moderation_cases(school_id, status);
create index idx_safeguarding_school on public.safeguarding_reports(school_id, status);
create index idx_ai_audit_profile on public.ai_audit_events(profile_id, created_at desc);

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
alter table public.parent_lifecycle enable row level security;
alter table public.child_lifecycle enable row level security;
alter table public.projects enable row level security;
alter table public.media_assets enable row level security;
alter table public.podcast_series enable row level security;
alter table public.podcast_episodes enable row level security;
alter table public.achievements enable row level security;
alter table public.passport_items enable row level security;
alter table public.organisations enable row level security;
alter table public.organisation_memberships enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_submissions enable row level security;
alter table public.clubs enable row level security;
alter table public.club_memberships enable row level security;
alter table public.communities enable row level security;
alter table public.community_memberships enable row level security;
alter table public.community_posts enable row level security;
alter table public.adult_connections enable row level security;
alter table public.adult_events enable row level security;
alter table public.consent_records enable row level security;
alter table public.publication_reviews enable row level security;
alter table public.moderation_cases enable row level security;
alter table public.safeguarding_reports enable row level security;
alter table public.opportunities enable row level security;
alter table public.portfolio_transition_consents enable row level security;
alter table public.alumni_portfolio_items enable row level security;
alter table public.ai_policy_versions enable row level security;
alter table public.ai_audit_events enable row level security;
alter table public.audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- Core RLS policy shapes
-- These are deliberately restrictive defaults and must be exercised with live
-- RLS tests before production.
-- ---------------------------------------------------------------------------

create policy profiles_self_select on public.profiles
for select to authenticated
using ((select auth.uid()) = auth_user_id);

create policy profiles_self_update on public.profiles
for update to authenticated
using ((select auth.uid()) = auth_user_id)
with check ((select auth.uid()) = auth_user_id);

create policy projects_owner_all on public.projects
for all to authenticated
using (owner_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())))
with check (owner_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())));

create policy guardian_parent_select on public.guardian_links
for select to authenticated
using (
  parent_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  or child_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
);

create policy linked_parent_projects_select on public.projects
for select to authenticated
using (
  owner_profile_id in (
    select gl.child_profile_id
    from public.guardian_links gl
    join public.profiles p on p.id = gl.parent_profile_id
    where p.auth_user_id = (select auth.uid())
      and gl.status = 'verified'
  )
);

create policy child_achievements_select on public.achievements
for select to authenticated
using (
  child_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  or child_profile_id in (
    select gl.child_profile_id
    from public.guardian_links gl
    join public.profiles p on p.id = gl.parent_profile_id
    where p.auth_user_id = (select auth.uid()) and gl.status = 'verified'
  )
);

create policy passport_child_parent_select on public.passport_items
for select to authenticated
using (
  child_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  or child_profile_id in (
    select gl.child_profile_id
    from public.guardian_links gl
    join public.profiles p on p.id = gl.parent_profile_id
    where p.auth_user_id = (select auth.uid()) and gl.status = 'verified'
  )
);

create policy community_member_select on public.community_posts
for select to authenticated
using (
  community_id in (
    select cm.community_id
    from public.community_memberships cm
    join public.profiles p on p.id = cm.profile_id
    where p.auth_user_id = (select auth.uid()) and cm.status = 'active'
  )
);

create policy community_member_insert on public.community_posts
for insert to authenticated
with check (
  author_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  and community_id in (
    select cm.community_id
    from public.community_memberships cm
    join public.profiles p on p.id = cm.profile_id
    where p.auth_user_id = (select auth.uid()) and cm.status = 'active'
  )
);

create policy adult_connections_own_select on public.adult_connections
for select to authenticated
using (
  requester_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  or addressee_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
);

create policy ai_audit_self_select on public.ai_audit_events
for select to authenticated
using (profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())));

create policy alumni_portfolio_self_select on public.alumni_portfolio_items
for select to authenticated
using (alumni_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())));

-- Intentionally NO generic parent-alumni -> child policies.
-- Intentionally NO generic organisation-admin -> profiles/projects policies.
-- Intentionally NO generic alumni -> under-16 project/passport policies.
-- Safeguarding policies are omitted from this draft until a dedicated DB can be
-- tested with restrictive staff role data; they must never inherit broad school
-- administration policies by default.
