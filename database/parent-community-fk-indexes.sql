-- Cover parent-community foreign keys used by deletes, ownership checks and event filtering.

create index if not exists idx_adult_communities_created_by
  on public.adult_communities (created_by_profile_id);

create index if not exists idx_adult_posts_author
  on public.adult_community_posts (author_profile_id);

create index if not exists idx_adult_events_community
  on public.adult_events (community_id)
  where community_id is not null;

create index if not exists idx_adult_events_created_by
  on public.adult_events (created_by_profile_id);
