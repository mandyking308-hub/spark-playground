-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Child feedback is curated encouragement inside verified learning contexts, not a popularity system.

create table if not exists public.constructive_reactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  context_type text not null check (context_type in ('cohort','club','challenge')),
  context_id uuid not null,
  reaction_type text not null check (reaction_type in ('inspired_me','clear_explanation','creative_idea','great_teamwork')),
  state text not null default 'active' check (state in ('active','removed')),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  check (sender_profile_id <> recipient_profile_id),
  unique (project_id, sender_profile_id, reaction_type, context_type, context_id)
);

create table if not exists public.constructive_reaction_events (
  id uuid primary key default gen_random_uuid(),
  reaction_id uuid not null references public.constructive_reactions(id) on delete cascade,
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null check (event_type in ('created','removed','restored','moderation_flagged','moderation_cleared')),
  event_metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_constructive_reactions_recipient on public.constructive_reactions(recipient_profile_id, created_at desc);
create index if not exists idx_constructive_reactions_context on public.constructive_reactions(context_type, context_id);
create index if not exists idx_constructive_reaction_events_reaction on public.constructive_reaction_events(reaction_id, occurred_at);

alter table public.constructive_reactions enable row level security;
alter table public.constructive_reaction_events enable row level security;

-- Server-side authorisation must establish that both child profiles hold active/verified membership in the same context_id.
-- The target project must belong to recipient_profile_id and must already be shared into that verified context.
-- Cohort checks use cohort_memberships; club checks use club membership/enrolment; challenge checks use authorised participation.
-- Organisation accounts, Parent/Parent Alumni accounts and unrelated adults cannot create child reactions.
-- Child-authored free-text feedback is intentionally absent from this domain.
-- No aggregate reaction_count, score, follower count, popularity rank, trending score or leaderboard fields exist.
-- Reactions are presented as individual encouragement and must not be used to rank or recommend children.
-- Removal/moderation is auditable through constructive_reaction_events.
-- No blanket authenticated policies are installed in this draft.
