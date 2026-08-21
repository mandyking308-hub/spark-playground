-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- The 16+ Alumni environment is separate from the protected under-16 platform.

create table if not exists public.alumni_profiles (
  user_id uuid primary key,
  alumni_verified boolean not null default false,
  age_eligibility_verified boolean not null default false,
  verification_jurisdiction text,
  verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.alumni_opportunity_providers (
  id uuid primary key default gen_random_uuid(),
  provider_type text not null check (provider_type in ('university','employer','apprenticeship_provider','accelerator')),
  display_name text not null,
  verification_state text not null default 'pending' check (verification_state in ('pending','verified','suspended','revoked')),
  verified_by_user_id uuid,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.alumni_opportunities (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.alumni_opportunity_providers(id) on delete cascade,
  title text not null,
  opportunity_type text not null check (opportunity_type in ('university','internship','apprenticeship','job','entrepreneurship','volunteering')),
  minimum_age integer not null default 16 check (minimum_age >= 16),
  location_label text,
  state text not null default 'draft' check (state in ('draft','submitted','approved','closed','suspended')),
  approved_by_user_id uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.alumni_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.alumni_opportunities(id) on delete cascade,
  alumni_user_id uuid not null references public.alumni_profiles(user_id) on delete cascade,
  state text not null default 'draft' check (state in ('draft','submitted','withdrawn','reviewing','accepted','declined')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (opportunity_id, alumni_user_id)
);

create table if not exists public.alumni_application_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.alumni_applications(id) on delete cascade,
  portfolio_item_id uuid not null,
  selected_by_alumni_user_id uuid not null,
  selected_at timestamptz not null default now(),
  removed_at timestamptz,
  unique (application_id, portfolio_item_id)
);

create table if not exists public.alumni_mentor_profiles (
  alumni_user_id uuid primary key references public.alumni_profiles(user_id) on delete cascade,
  topics text[] not null default '{}'::text[],
  accepting_requests boolean not null default false,
  availability_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.alumni_mentoring_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_user_id uuid not null references public.alumni_profiles(user_id) on delete cascade,
  mentee_user_id uuid not null references public.alumni_profiles(user_id) on delete cascade,
  topic text not null,
  state text not null default 'requested' check (state in ('requested','accepted','declined','ended','cancelled')),
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  check (mentor_user_id <> mentee_user_id)
);

alter table public.alumni_profiles enable row level security;
alter table public.alumni_opportunity_providers enable row level security;
alter table public.alumni_opportunities enable row level security;
alter table public.alumni_applications enable row level security;
alter table public.alumni_application_portfolio_items enable row level security;
alter table public.alumni_mentor_profiles enable row level security;
alter table public.alumni_mentoring_requests enable row level security;

-- Eligibility must be verified before an alumni profile is activated for networking or applications.
-- Providers must be verified and opportunities approved before applications can be submitted.
-- Application disclosure is item-by-item: there is no generic full-profile or full-Passport grant.
-- No child_id, child_profile_id, guardian_id, school_child_id, child_email, child_phone or childhood wellbeing fields exist in this adult domain.
-- Alumni credentials never grant access to protected under-16 records or communication channels.
-- Alumni-to-child mentoring must use a separate school-controlled safeguarding programme outside these tables.
-- No blanket authenticated policies are installed in this draft.
