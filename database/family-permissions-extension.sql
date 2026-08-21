-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Extends the existing verified guardian_links, profiles and jurisdiction policy model.
-- Permission requests are child-initiated and resource/action-specific; guardians are approvers, not owners of child work.

create table if not exists public.permission_requests (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  requested_by_profile_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('publish_external','join_club','enter_challenge','share_portfolio','alumni_transfer')),
  resource_kind text not null check (resource_kind in ('project','club','challenge','passport_item','alumni_transition')),
  resource_id uuid,
  state text not null default 'pending' check (state in ('pending','approved','denied','withdrawn','expired')),
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  check (requested_by_profile_id = child_profile_id)
);

create table if not exists public.permission_requirements (
  request_id uuid primary key references public.permission_requests(id) on delete cascade,
  jurisdiction_policy_id uuid references public.jurisdiction_policy_versions(id) on delete set null,
  policy_version text not null,
  guardian_required boolean not null default true,
  school_required boolean not null default false,
  safety_review_required boolean not null default true,
  recorded_at timestamptz not null default now()
);

create table if not exists public.permission_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.permission_requests(id) on delete cascade,
  decision_role text not null check (decision_role in ('guardian','school','safety')),
  decision text not null check (decision in ('approved','denied')),
  decision_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  guardian_link_id uuid references public.guardian_links(id) on delete restrict,
  policy_version text not null,
  decision_note text,
  decided_at timestamptz not null default now(),
  unique (request_id, decision_role),
  check ((decision_role = 'guardian' and guardian_link_id is not null) or (decision_role <> 'guardian' and guardian_link_id is null))
);

create table if not exists public.permission_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.permission_requests(id) on delete cascade,
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null check (event_type in ('requested','approved','denied','withdrawn','expired','policy_checked','safety_checked')),
  event_metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_permission_requests_child_state on public.permission_requests(child_profile_id, state);
create index if not exists idx_permission_decisions_request on public.permission_decisions(request_id);
create index if not exists idx_permission_events_request on public.permission_events(request_id, occurred_at);

alter table public.permission_requests enable row level security;
alter table public.permission_requirements enable row level security;
alter table public.permission_decisions enable row level security;
alter table public.permission_events enable row level security;

-- Server-side authorisation must verify a guardian decision against the referenced guardian_links row:
-- guardian_links.status = 'verified', guardian_links.parent_profile_id = decision_by_profile_id,
-- and guardian_links.child_profile_id = permission_requests.child_profile_id.
-- Parent Alumni status by itself never satisfies a guardian requirement.
-- A withdrawn request cannot be revived by a later approval; create a new child-initiated request instead.
-- A permission is scoped to one request_type + resource_kind + resource_id. There is no wildcard/global child consent.
-- Permission records do not grant generic access to private drafts, media, messages or other unrelated child records.
-- Final approval is server-derived only after every recorded requirement is satisfied and no denial/withdrawal exists.
-- No blanket authenticated policies are installed in this draft.
