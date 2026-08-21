-- REVIEWABLE DRAFT ONLY. Do not apply until the dedicated Supabase project is selected.
-- Club collaboration is programme-scoped, not a general-purpose child messaging system.

create table if not exists public.club_programmes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid,
  name text not null,
  scope text not null check (scope in ('school','group','cross_school','approved_programme')),
  min_age integer not null check (min_age >= 5),
  max_age integer not null check (max_age <= 17 and max_age >= min_age),
  membership_mode text not null default 'invited' check (membership_mode in ('invited','enrolled')),
  moderator_required boolean not null default true,
  is_open boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_programmes(id) on delete cascade,
  user_id uuid not null,
  member_role text not null check (member_role in ('child_member','staff_moderator','programme_facilitator')),
  approval_source text not null check (approval_source in ('guardian','school','group','programme')),
  approved_at timestamptz,
  revoked_at timestamptz,
  unique (club_id, user_id)
);

create table if not exists public.club_updates (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_programmes(id) on delete cascade,
  author_user_id uuid not null,
  update_kind text not null check (update_kind in ('club_post','project_comment','team_update','moderator_notice')),
  body text not null check (char_length(body) between 1 and 4000),
  moderation_state text not null default 'pending' check (moderation_state in ('pending','approved','hidden','escalated')),
  created_at timestamptz not null default now()
);

create table if not exists public.club_project_links (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_programmes(id) on delete cascade,
  project_id uuid not null,
  linked_by_user_id uuid not null,
  linked_at timestamptz not null default now(),
  unique (club_id, project_id)
);

alter table public.club_programmes enable row level security;
alter table public.club_memberships enable row level security;
alter table public.club_updates enable row level security;
alter table public.club_project_links enable row level security;

-- Intentionally no blanket authenticated policies in this draft.
-- Until verified membership helper functions are installed, browser clients receive deny-by-default RLS.
-- Service-side moderation/administration must use server-only credentials, never browser credentials.
-- There is deliberately no direct_messages table and no phone/email/contact field in club collaboration records.
