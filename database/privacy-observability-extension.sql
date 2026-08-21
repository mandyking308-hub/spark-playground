-- Aurelia privacy-safe observability extension
-- REVIEWABLE ONLY: operational telemetry provider remains disconnected.

create type public.telemetry_class as enum ('availability', 'performance', 'error', 'security', 'capacity');

create table public.telemetry_policy_versions (
  id uuid primary key default gen_random_uuid(),
  policy_version text not null unique,
  retention_days integer not null check (retention_days > 0 and retention_days <= 90),
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.telemetry_events (
  id uuid primary key default gen_random_uuid(),
  telemetry_class public.telemetry_class not null,
  service_name text not null,
  route_template text,
  status_code integer,
  duration_bucket text,
  error_code text,
  request_id_hash text,
  region_code text,
  policy_version text not null,
  occurred_at timestamptz not null default now(),
  check (request_id_hash is null or char_length(request_id_hash) >= 32)
);

create table public.telemetry_daily_aggregates (
  id uuid primary key default gen_random_uuid(),
  telemetry_class public.telemetry_class not null,
  service_name text not null,
  route_template text,
  metric_date date not null,
  event_count bigint not null check (event_count >= 0),
  error_count bigint not null default 0 check (error_count >= 0),
  p50_duration_bucket text,
  p95_duration_bucket text,
  region_code text,
  created_at timestamptz not null default now(),
  unique (telemetry_class, service_name, route_template, metric_date, region_code)
);

alter table public.telemetry_policy_versions enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.telemetry_daily_aggregates enable row level security;

-- Intentionally no blanket authenticated policies.
-- Observability contract:
-- 1. telemetry records service health, performance, errors, security and capacity only,
-- 2. no child profile IDs, names/emails, full IP addresses, precise locations, project titles/body, search terms, AI prompts, chat text or safeguarding narratives,
-- 3. no raw request/response bodies or uploaded media are copied to observability,
-- 4. route dimensions use templates with IDs removed and query strings stripped,
-- 5. request_id_hash is non-reversible correlation only and never a stable advertising/profile identifier,
-- 6. child behavioural funnels, advertising attribution and cross-session profiling are prohibited,
-- 7. telemetry retention is policy-versioned and capped at 90 days in this diagnostic store,
-- 8. security-event evidence needing longer preservation belongs in the incident/audit lifecycle, not general telemetry.
