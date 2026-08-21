-- Software supply-chain governance metadata draft.
-- No registry credentials or package-manager secrets are stored here.

create table if not exists public.dependency_reviews (
  id uuid primary key default gen_random_uuid(),
  package_name text not null,
  resolved_version text not null,
  registry_host text not null,
  lockfile_hash text not null,
  provenance_reference text,
  vulnerability_risk text not null check (vulnerability_risk in ('low','medium','high','critical')),
  known_malicious boolean not null default false,
  source_approved boolean not null default false,
  install_scripts_reviewed boolean not null default false,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (package_name, resolved_version, lockfile_hash)
);

create table if not exists public.dependency_exceptions (
  id uuid primary key default gen_random_uuid(),
  dependency_review_id uuid not null references public.dependency_reviews(id) on delete cascade,
  reason text not null,
  approved_by uuid not null,
  second_approver_id uuid,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  check (expires_at > created_at),
  check (second_approver_id is null or second_approver_id <> approved_by)
);

create table if not exists public.ci_component_reviews (
  id uuid primary key default gen_random_uuid(),
  component_type text not null check (component_type in ('github_action','runtime','registry','builder')),
  component_name text not null,
  immutable_reference text not null,
  reviewed_by uuid not null,
  reviewed_at timestamptz not null default now(),
  superseded_at timestamptz
);

create table if not exists public.supply_chain_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  action text not null,
  dependency_review_id uuid references public.dependency_reviews(id) on delete set null,
  exception_id uuid references public.dependency_exceptions(id) on delete set null,
  ci_component_review_id uuid references public.ci_component_reviews(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.dependency_reviews enable row level security;
alter table public.dependency_exceptions enable row level security;
alter table public.ci_component_reviews enable row level security;
alter table public.supply_chain_audit_events enable row level security;

-- No blanket authenticated-user policies are intentionally defined.
-- Critical dependency exceptions must be explicit, time-bounded and reviewed before production use.
-- CI component references are expected to be immutable SHAs/versions, not floating tags.
