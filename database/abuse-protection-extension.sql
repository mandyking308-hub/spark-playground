-- Abuse/rate-limit protection metadata draft.
-- Stores coarse security counters/signals only; child content and precise behavioural profiles are prohibited.

create table if not exists public.abuse_rate_buckets (
  id uuid primary key default gen_random_uuid(),
  surface text not null check (surface in ('sign_in','password_reset','join_request','search','upload','feedback','challenge_submission','partner_api')),
  subject_hash text not null,
  window_started_at timestamptz not null,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  challenged_at timestamptz,
  denied_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (expires_at > window_started_at)
);

create table if not exists public.abuse_security_events (
  id uuid primary key default gen_random_uuid(),
  surface text not null,
  decision text not null check (decision in ('allow','challenge','deny')),
  subject_hash text,
  reason_code text not null,
  account_exists_disclosed boolean not null default false check (account_exists_disclosed = false),
  child_content_captured boolean not null default false check (child_content_captured = false),
  created_at timestamptz not null default now()
);

create table if not exists public.abuse_source_blocks (
  id uuid primary key default gen_random_uuid(),
  source_hash text not null,
  reason_code text not null,
  blocked_at timestamptz not null default now(),
  expires_at timestamptz,
  reviewed_by uuid,
  reviewed_at timestamptz,
  revoked_at timestamptz
);

alter table public.abuse_rate_buckets enable row level security;
alter table public.abuse_security_events enable row level security;
alter table public.abuse_source_blocks enable row level security;

-- No blanket authenticated-user policies.
-- There is deliberately no child-lookup table or public child-directory abuse surface.
-- Hashes used for abuse/security purposes must be scoped/non-advertising and follow the observability retention policy.
-- Automated abuse decisions do not close safeguarding cases or replace human safeguarding review.
