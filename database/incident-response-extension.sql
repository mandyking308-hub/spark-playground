-- Aurelia security/privacy incident response extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend exists.

create type public.incident_type as enum ('account_security', 'privacy_data', 'safeguarding_data', 'partner_access', 'service_integrity', 'provider_outage');
create type public.incident_severity as enum ('low', 'medium', 'high', 'critical');
create type public.incident_status as enum ('open', 'contained', 'investigating', 'remediating', 'monitoring', 'closed');

create table public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_type public.incident_type not null,
  severity public.incident_severity not null,
  status public.incident_status not null default 'open',
  title text not null,
  summary text not null,
  policy_version text,
  jurisdiction_code text,
  notification_due_at timestamptz,
  contained_at timestamptz,
  root_cause_summary text,
  corrective_action_summary text,
  monitoring_completed_at timestamptz,
  closed_at timestamptz,
  closed_by_profile_id uuid references public.profiles(id) on delete set null,
  second_reviewer_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.incident_actions (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.security_incidents(id) on delete cascade,
  action_type text not null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  detail text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.incident_affected_scopes (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.security_incidents(id) on delete cascade,
  scope_type text not null,
  scope_reference_hash text not null,
  data_class public.data_lifecycle_class,
  created_at timestamptz not null default now(),
  unique (incident_id, scope_type, scope_reference_hash)
);

create table public.incident_notifications (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.security_incidents(id) on delete cascade,
  audience text not null check (audience in ('guardian', 'staff', 'organisation', 'alumni', 'regulator')),
  safe_template_key text not null,
  policy_version text not null,
  due_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.security_incidents enable row level security;
alter table public.incident_actions enable row level security;
alter table public.incident_affected_scopes enable row level security;
alter table public.incident_notifications enable row level security;

-- Intentionally no blanket authenticated policies.
-- Incident response contract:
-- 1. incident logs store references/hashes and necessary summaries, never passwords, access/refresh tokens or unnecessary raw child content,
-- 2. containment actions are auditable and use existing session/partner/publication controls,
-- 3. notification_due_at must be derived from versioned jurisdiction policy when a legal notice is required; no universal deadline is hardcoded,
-- 4. child-facing external surfaces do not receive sensitive incident detail,
-- 5. high/critical incidents cannot close without containment, monitoring completion, root cause, corrective actions and a second reviewer,
-- 6. evidence preservation uses narrow retention holds rather than copying data into incident narratives.
