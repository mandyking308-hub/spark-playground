-- Shows + media safety extension draft
-- Reviewable only until the dedicated Supabase project exists.

create type public.show_format as enum ('podcast', 'video_series', 'audio_drama', 'book_club', 'newsroom');
create type public.show_state as enum ('draft', 'review', 'published', 'paused', 'archived');
create type public.media_storage_class as enum ('private_original', 'review_derivative', 'published_derivative');

create table public.shows (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  title text not null,
  description text,
  format public.show_format not null,
  state public.show_state not null default 'draft',
  current_season integer not null default 1 check (current_season >= 1),
  public_publisher_label text not null default 'Young Creator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.show_episodes (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.shows(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  season_number integer not null default 1 check (season_number >= 1),
  episode_number integer not null check (episode_number >= 1),
  title text not null,
  state public.content_state not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (show_id, season_number, episode_number)
);

create table public.media_review_records (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  storage_class public.media_storage_class not null default 'private_original',
  sanitised_from_asset_id uuid references public.media_assets(id) on delete set null,
  metadata_stripped boolean not null default false,
  personal_information_scan text not null default 'pending',
  unsafe_content_scan text not null default 'pending',
  copyright_review text not null default 'not_required',
  moderator_profile_id uuid references public.profiles(id) on delete set null,
  approved_for_publication boolean not null default false,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_shows_owner on public.shows(owner_profile_id, state);
create index idx_show_episodes_show on public.show_episodes(show_id, season_number, episode_number);
create index idx_media_reviews_asset on public.media_review_records(media_asset_id, storage_class);

alter table public.shows enable row level security;
alter table public.show_episodes enable row level security;
alter table public.media_review_records enable row level security;

create policy shows_owner_select on public.shows
for select to authenticated
using (owner_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())));

create policy shows_owner_update on public.shows
for update to authenticated
using (owner_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())))
with check (owner_profile_id in (select id from public.profiles where auth_user_id = (select auth.uid())));

create policy show_episodes_owner_select on public.show_episodes
for select to authenticated
using (
  show_id in (
    select s.id from public.shows s
    join public.profiles p on p.id = s.owner_profile_id
    where p.auth_user_id = (select auth.uid())
  )
);

-- No public policy exposes owner_profile_id as the public publisher identity.
-- Public content delivery should use an explicitly safe view/edge/API layer that
-- returns the show title, approved publisher label and approved derivative media only.
-- Private originals and review derivatives must never be served as public assets.
