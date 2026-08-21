-- Secrets/configuration governance extension draft.
-- Stores references and governance metadata only. Raw secret values never belong in this schema.

create table if not exists public.secret_references (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_reference text not null,
  secret_purpose text not null,
  environment text not null check (environment in ('development','preview','staging','production')),
  state text not null check (state in ('active','rotating','revoked','compromised')) default 'active',
  owner_user_id uuid not null,
  last_rotated_at timestamptz,
  rotation_due_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference, environment)
);

create table if not exists public.config_change_requests (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('development','preview','staging','production')),
  config_key text not null,
  config_class text not null check (config_class in ('public','server_config','secret_reference')),
  requested_by uuid not null,
  approved_by uuid,
  change_ticket_id text not null,
  step_up_verified_at timestamptz,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  applied_at timestamptz,
  rejected_at timestamptz,
  check (approved_by is null or approved_by <> requested_by),
  check (environment <> 'production' or approved_by is not null),
  check (environment <> 'production' or step_up_verified_at is not null)
);

create table if not exists public.secret_rotation_events (
  id uuid primary key default gen_random_uuid(),
  secret_reference_id uuid not null references public.secret_references(id) on delete restrict,
  initiated_by uuid not null,
  approved_by uuid,
  rotation_deadline timestamptz not null,
  replacement_provider_reference text,
  old_secret_revoked_at timestamptz,
  incident_id uuid,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (approved_by is null or approved_by <> initiated_by),
  check (rotation_deadline > created_at)
);

create table if not exists public.config_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  environment text not null check (environment in ('development','preview','staging','production')),
  action text not null,
  config_key text,
  secret_reference_id uuid references public.secret_references(id) on delete set null,
  change_request_id uuid references public.config_change_requests(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.secret_references enable row level security;
alter table public.config_change_requests enable row level security;
alter table public.secret_rotation_events enable row level security;
alter table public.config_audit_events enable row level security;

-- Deliberately no blanket authenticated-user policies.
-- Access will be granted only to dedicated platform-security/configuration roles in the live backend.
-- Provider secret values, private keys, passwords, raw access tokens and refresh tokens are prohibited here.
-- A compromised credential must be revoked through the provider and linked to incident response.
