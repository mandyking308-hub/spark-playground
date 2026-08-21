-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Adult parent networking is a separate graph from child/guardian records.

create table if not exists public.parent_network_profiles (
  user_id uuid primary key,
  role text not null check (role in ('parent','parent_alumni')),
  verified_adult boolean not null default false,
  community_opt_in boolean not null default false,
  display_name text not null,
  headline text,
  profession text,
  city_or_region text,
  interests text[] not null default '{}',
  school_community_labels text[] not null default '{}',
  visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_connections (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references public.parent_network_profiles(user_id) on delete cascade,
  addressee_user_id uuid not null references public.parent_network_profiles(user_id) on delete cascade,
  state text not null default 'pending' check (state in ('pending','accepted','declined','blocked')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_user_id <> addressee_user_id),
  unique (requester_user_id, addressee_user_id)
);

create table if not exists public.parent_circles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid,
  name text not null,
  purpose text not null,
  audience text not null default 'current_and_alumni' check (audience in ('current','alumni','current_and_alumni')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_circle_memberships (
  circle_id uuid not null references public.parent_circles(id) on delete cascade,
  user_id uuid not null references public.parent_network_profiles(user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table if not exists public.parent_circle_posts (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.parent_circles(id) on delete cascade,
  author_user_id uuid not null references public.parent_network_profiles(user_id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now()
);

create table if not exists public.parent_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid,
  title text not null,
  audience text not null check (audience in ('current','alumni','current_and_alumni')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  city_or_region text,
  is_adult_only boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_event_rsvps (
  event_id uuid not null references public.parent_events(id) on delete cascade,
  user_id uuid not null references public.parent_network_profiles(user_id) on delete cascade,
  status text not null check (status in ('going','maybe','declined')),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.parent_network_profiles enable row level security;
alter table public.parent_connections enable row level security;
alter table public.parent_circles enable row level security;
alter table public.parent_circle_memberships enable row level security;
alter table public.parent_circle_posts enable row level security;
alter table public.parent_events enable row level security;
alter table public.parent_event_rsvps enable row level security;

-- No child_id, guardian_link_id, child_profile_id, child_contact, child_portfolio_id or pupil identifier
-- exists in this adult-network extension. Eligibility is derived server-side from verified family history.
-- Do not expose family-history tables merely to prove adult network eligibility.
-- No blanket authenticated policies are installed in this draft: deny-by-default until verified-adult helpers exist.
