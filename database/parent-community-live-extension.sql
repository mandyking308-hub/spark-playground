-- Aurelia parent / parent-alumni community live extension
-- Adult-only by construction: these tables contain no child identifiers or child content foreign keys.

create table if not exists public.adult_directory_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  headline text check (headline is null or char_length(headline) <= 180),
  region text check (region is null or char_length(region) <= 120),
  bio text check (bio is null or char_length(bio) <= 1200),
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adult_communities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text check (description is null or char_length(description) <= 1200),
  community_type text not null default 'interest'
    check (community_type in ('interest', 'profession', 'location', 'school', 'alumni', 'volunteering')),
  created_by_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adult_community_memberships (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.adult_communities(id) on delete cascade,
  profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  member_role text not null default 'member' check (member_role in ('member', 'host')),
  status text not null default 'active' check (status in ('active', 'left', 'removed')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, profile_id)
);

create table if not exists public.adult_community_posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.adult_communities(id) on delete cascade,
  author_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  removed_at timestamptz
);

create table if not exists public.adult_connections (
  id uuid primary key default gen_random_uuid(),
  requester_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  addressee_profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_profile_id <> addressee_profile_id),
  unique (requester_profile_id, addressee_profile_id)
);

create table if not exists public.adult_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.adult_communities(id) on delete set null,
  created_by_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 180),
  description text check (description is null or char_length(description) <= 3000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location_text text check (location_text is null or char_length(location_text) <= 240),
  audience text not null default 'parents_and_alumni'
    check (audience in ('parents', 'parent_alumni', 'parents_and_alumni')),
  status text not null default 'active' check (status in ('draft', 'active', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists public.adult_event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.adult_events(id) on delete cascade,
  profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  response text not null default 'going' check (response in ('going', 'interested', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create index if not exists idx_adult_directory_visible
  on public.adult_directory_profiles (visible, updated_at desc);
create index if not exists idx_adult_communities_status
  on public.adult_communities (status, community_type, created_at desc);
create index if not exists idx_adult_memberships_profile
  on public.adult_community_memberships (profile_id, status);
create index if not exists idx_adult_memberships_community
  on public.adult_community_memberships (community_id, status);
create index if not exists idx_adult_posts_community
  on public.adult_community_posts (community_id, created_at desc) where removed_at is null;
create index if not exists idx_adult_connections_requester
  on public.adult_connections (requester_profile_id, status);
create index if not exists idx_adult_connections_addressee
  on public.adult_connections (addressee_profile_id, status);
create index if not exists idx_adult_events_starts
  on public.adult_events (status, starts_at);
create index if not exists idx_adult_event_rsvps_profile
  on public.adult_event_rsvps (profile_id, response);

alter table public.adult_directory_profiles enable row level security;
alter table public.adult_communities enable row level security;
alter table public.adult_community_memberships enable row level security;
alter table public.adult_community_posts enable row level security;
alter table public.adult_connections enable row level security;
alter table public.adult_events enable row level security;
alter table public.adult_event_rsvps enable row level security;

-- Directory: parents explicitly opt in. No child data is present in this table.
create policy adult_directory_parent_select
on public.adult_directory_profiles for select to authenticated
using (
  profile_id = public.current_profile_id()
  or (
    visible
    and exists (
      select 1 from public.profiles viewer
      where viewer.id = public.current_profile_id()
        and viewer.primary_role in ('parent', 'parent_alumni')
        and viewer.disabled_at is null
    )
  )
);

create policy adult_directory_self_insert
on public.adult_directory_profiles for insert to authenticated
with check (
  profile_id = public.current_profile_id()
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
);

create policy adult_directory_self_update
on public.adult_directory_profiles for update to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

create policy adult_directory_self_delete
on public.adult_directory_profiles for delete to authenticated
using (profile_id = public.current_profile_id());

-- Communities can be browsed and created only by current/alumni parents.
create policy adult_communities_parent_select
on public.adult_communities for select to authenticated
using (
  status = 'active'
  and exists (
    select 1 from public.profiles viewer
    where viewer.id = public.current_profile_id()
      and viewer.primary_role in ('parent', 'parent_alumni')
      and viewer.disabled_at is null
  )
);

create policy adult_communities_parent_insert
on public.adult_communities for insert to authenticated
with check (
  created_by_profile_id = public.current_profile_id()
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
);

create policy adult_communities_creator_update
on public.adult_communities for update to authenticated
using (created_by_profile_id = public.current_profile_id())
with check (created_by_profile_id = public.current_profile_id());

-- Membership is self-service for verified parent identities; removal is represented by status.
create policy adult_memberships_member_select
on public.adult_community_memberships for select to authenticated
using (
  profile_id = public.current_profile_id()
  or exists (
    select 1 from public.adult_community_memberships mine
    where mine.community_id = adult_community_memberships.community_id
      and mine.profile_id = public.current_profile_id()
      and mine.status = 'active'
  )
);

create policy adult_memberships_self_insert
on public.adult_community_memberships for insert to authenticated
with check (
  profile_id = public.current_profile_id()
  and member_role = 'member'
  and status = 'active'
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
  and exists (
    select 1 from public.adult_communities c
    where c.id = adult_community_memberships.community_id and c.status = 'active'
  )
);

create policy adult_memberships_self_update
on public.adult_community_memberships for update to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id() and member_role = 'member');

-- Posts are visible/writable only inside a circle the current adult has joined.
create policy adult_posts_member_select
on public.adult_community_posts for select to authenticated
using (
  removed_at is null
  and exists (
    select 1 from public.adult_community_memberships mine
    where mine.community_id = adult_community_posts.community_id
      and mine.profile_id = public.current_profile_id()
      and mine.status = 'active'
  )
);

create policy adult_posts_member_insert
on public.adult_community_posts for insert to authenticated
with check (
  author_profile_id = public.current_profile_id()
  and removed_at is null
  and exists (
    select 1 from public.adult_community_memberships mine
    where mine.community_id = adult_community_posts.community_id
      and mine.profile_id = public.current_profile_id()
      and mine.status = 'active'
  )
);

create policy adult_posts_author_update
on public.adult_community_posts for update to authenticated
using (author_profile_id = public.current_profile_id() and removed_at is null)
with check (author_profile_id = public.current_profile_id());

-- Connections never grant child access; the addressee must have opted into the adult directory.
create policy adult_connections_participant_select
on public.adult_connections for select to authenticated
using (
  requester_profile_id = public.current_profile_id()
  or addressee_profile_id = public.current_profile_id()
);

create policy adult_connections_request_insert
on public.adult_connections for insert to authenticated
with check (
  requester_profile_id = public.current_profile_id()
  and status = 'pending'
  and exists (
    select 1 from public.adult_directory_profiles target
    where target.profile_id = adult_connections.addressee_profile_id
      and target.visible = true
  )
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
);

-- Events are adult records only. Any verified parent can browse active events and RSVP.
create policy adult_events_parent_select
on public.adult_events for select to authenticated
using (
  status = 'active'
  and exists (
    select 1 from public.profiles viewer
    where viewer.id = public.current_profile_id()
      and viewer.primary_role in ('parent', 'parent_alumni')
      and viewer.disabled_at is null
  )
);

create policy adult_events_parent_insert
on public.adult_events for insert to authenticated
with check (
  created_by_profile_id = public.current_profile_id()
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
);

create policy adult_events_creator_update
on public.adult_events for update to authenticated
using (created_by_profile_id = public.current_profile_id())
with check (created_by_profile_id = public.current_profile_id());

create policy adult_rsvps_parent_select
on public.adult_event_rsvps for select to authenticated
using (
  profile_id = public.current_profile_id()
  or exists (
    select 1 from public.adult_events e
    where e.id = adult_event_rsvps.event_id
      and e.created_by_profile_id = public.current_profile_id()
  )
);

create policy adult_rsvps_self_insert
on public.adult_event_rsvps for insert to authenticated
with check (
  profile_id = public.current_profile_id()
  and exists (
    select 1 from public.adult_events e
    where e.id = adult_event_rsvps.event_id and e.status = 'active'
  )
  and exists (
    select 1 from public.profiles self
    where self.id = public.current_profile_id()
      and self.primary_role in ('parent', 'parent_alumni')
      and self.disabled_at is null
  )
);

create policy adult_rsvps_self_update
on public.adult_event_rsvps for update to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

create or replace function public.respond_adult_connection(
  p_connection_id uuid,
  p_response text
) returns public.adult_connections
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := public.current_profile_id();
  updated public.adult_connections;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;

  if p_response not in ('accepted', 'declined', 'blocked') then
    raise exception 'Invalid connection response';
  end if;

  update public.adult_connections
  set status = p_response,
      responded_at = now()
  where id = p_connection_id
    and addressee_profile_id = actor
    and status = 'pending'
  returning * into updated;

  if updated.id is null then
    raise exception 'Connection request not available';
  end if;

  return updated;
end;
$$;

revoke all on function public.respond_adult_connection(uuid, text) from public;
grant execute on function public.respond_adult_connection(uuid, text) to authenticated;
