-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Presentation preferences and translation metadata are separate from legal jurisdiction policy.

create table if not exists public.translation_catalog_versions (
  id uuid primary key default gen_random_uuid(),
  locale_code text not null,
  version text not null,
  text_direction text not null check (text_direction in ('ltr','rtl')),
  state text not null default 'draft' check (state in ('draft','reviewing','ready','retired')),
  reviewed_by_profile_id uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (locale_code, version)
);

create table if not exists public.presentation_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  locale_code text not null default 'en-GB',
  text_scale text not null default 'default' check (text_scale in ('default','large','extra_large')),
  reduced_motion text not null default 'system' check (reduced_motion in ('system','reduce','full')),
  high_contrast text not null default 'system' check (high_contrast in ('system','on','off')),
  captions_preferred boolean not null default true,
  transcripts_preferred boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists idx_translation_catalog_locale on public.translation_catalog_versions(locale_code, state);

alter table public.translation_catalog_versions enable row level security;
alter table public.presentation_preferences enable row level security;

-- Locale changes presentation only. Legal/safeguarding jurisdiction must come from separate verified policy/account data.
-- Translation fallback must never silently relax child-safety controls when a translated string or pack is unavailable.
-- Presentation preferences should be readable/writable only by the subject profile (or narrowly authorised accessibility support workflows).
-- Translation catalog publication is privileged and reviewable; child or parent accounts cannot publish language packs.
-- No blanket authenticated policies are installed in this draft.
