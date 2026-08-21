-- External provider/data-processing governance draft.
-- Provider approvals are purpose-, region-, policy- and data-class-specific.

create table if not exists public.provider_approvals (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,
  provider_purpose text not null check (provider_purpose in ('auth','storage','ai','email','notification','payment','moderation','observability','backup')),
  policy_version text not null,
  region_code text not null,
  region_approved boolean not null default false,
  retention_days integer not null check (retention_days >= 0 and retention_days <= 365),
  child_data_training_allowed boolean not null default false check (child_data_training_allowed = false),
  behavioural_advertising_allowed boolean not null default false check (behavioural_advertising_allowed = false),
  subprocessors_reviewed_at timestamptz,
  incident_contact_verified_at timestamptz,
  approved_by uuid,
  approved_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_data_class_grants (
  id uuid primary key default gen_random_uuid(),
  provider_approval_id uuid not null references public.provider_approvals(id) on delete cascade,
  data_class text not null check (data_class in ('account_identity','guardian_relationship','child_content','sanitized_media','ai_prompt','payment_reference','safeguarding','operational_telemetry')),
  allowed boolean not null default false,
  purpose_detail text not null,
  created_at timestamptz not null default now(),
  unique (provider_approval_id, data_class)
);

create table if not exists public.provider_subprocessors (
  id uuid primary key default gen_random_uuid(),
  provider_approval_id uuid not null references public.provider_approvals(id) on delete cascade,
  subprocessor_name text not null,
  region_code text not null,
  purpose text not null,
  reviewed_at timestamptz,
  approved boolean not null default false,
  retired_at timestamptz
);

create table if not exists public.provider_change_events (
  id uuid primary key default gen_random_uuid(),
  provider_approval_id uuid not null references public.provider_approvals(id) on delete cascade,
  change_type text not null check (change_type in ('region','subprocessor','retention','purpose','terms','incident_contact','revocation')),
  discovered_at timestamptz not null default now(),
  reviewed_by uuid,
  reviewed_at timestamptz,
  decision text check (decision in ('approve','suspend','revoke')),
  incident_id uuid,
  notes text
);

alter table public.provider_approvals enable row level security;
alter table public.provider_data_class_grants enable row level security;
alter table public.provider_subprocessors enable row level security;
alter table public.provider_change_events enable row level security;

-- Deliberately no blanket authenticated-user policies.
-- Provider credentials and secret values are governed separately and do not belong here.
-- AI/model-training and behavioural-advertising use of child data are prohibited by schema defaults/checks.
-- Region/subprocessor changes require review before continued processing.
