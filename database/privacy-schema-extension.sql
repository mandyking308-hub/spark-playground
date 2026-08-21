-- Privacy / jurisdiction schema extension draft
-- Reviewable only; combine into formal migrations when dedicated Supabase project exists.

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
  unique (jurisdiction_code, version)
);

create table public.privacy_preferences (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  jurisdiction_policy_id uuid references public.jurisdiction_policy_versions(id) on delete set null,
  parent_profile_id uuid references public.profiles(id) on delete set null,
  location_sharing boolean not null default false,
  profiling boolean not null default false,
  ai_enabled boolean not null default false,
  publishing_requires_parent_approval boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (subject_profile_id)
);

create index idx_jurisdiction_policy_code on public.jurisdiction_policy_versions(jurisdiction_code, effective_from desc);
create index idx_privacy_preferences_subject on public.privacy_preferences(subject_profile_id);

alter table public.jurisdiction_policy_versions enable row level security;
alter table public.privacy_preferences enable row level security;

create policy privacy_subject_select on public.privacy_preferences
for select to authenticated
using (
  subject_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid()))
  or subject_profile_id in (
    select gl.child_profile_id
    from public.guardian_links gl
    join public.profiles p on p.id = gl.parent_profile_id
    where p.auth_user_id = (select auth.uid()) and gl.status = 'verified'
  )
);

-- No public/authenticated mutation policy is granted to jurisdiction policy versions.
-- Country rule records must be written through a privileged audited administrative workflow.
-- Parent Alumni status alone does not grant access to child privacy preferences.
