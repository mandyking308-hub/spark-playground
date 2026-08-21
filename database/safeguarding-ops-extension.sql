-- REVIEWABLE DRAFT ONLY. Apply only to the dedicated platform Supabase project.
-- Safeguarding data is need-to-know and more restricted than ordinary school administration.

create table if not exists public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid,
  reporter_user_id uuid,
  reporter_role text not null check (reporter_role in ('child','parent','teacher','staff','system_signal')),
  category text not null,
  related_record_type text,
  related_record_id uuid,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists public.safeguarding_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  school_id uuid not null,
  source_report_id uuid references public.safety_reports(id),
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  state text not null default 'open' check (state in ('open','triage','in_review','escalated','actioned','follow_up','closed')),
  escalated_to_group boolean not null default false,
  critical_escalated_at timestamptz,
  closed_at timestamptz,
  closed_by_user_id uuid,
  closure_reason text,
  created_at timestamptz not null default now(),
  check (severity <> 'critical' or state <> 'closed' or critical_escalated_at is not null)
);

create table if not exists public.safeguarding_case_assignments (
  case_id uuid not null references public.safeguarding_cases(id) on delete cascade,
  reviewer_user_id uuid not null,
  assignment_role text not null check (assignment_role in ('assigned_teacher','safeguarding_staff','school_admin','group_safeguarding_admin')),
  assigned_by_user_id uuid not null,
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (case_id, reviewer_user_id)
);

create table if not exists public.safeguarding_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.safeguarding_cases(id) on delete cascade,
  source_type text not null,
  source_record_id uuid,
  preserved_storage_key text,
  evidence_note text,
  preserved_at timestamptz not null default now(),
  preserved_by_user_id uuid
);

create table if not exists public.safeguarding_case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.safeguarding_cases(id) on delete cascade,
  actor_user_id uuid,
  event_type text not null check (event_type in ('created','viewed','assigned','severity_changed','evidence_added','decision_recorded','escalated','follow_up','closed','reopened')),
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.safety_reports enable row level security;
alter table public.safeguarding_cases enable row level security;
alter table public.safeguarding_case_assignments enable row level security;
alter table public.safeguarding_evidence enable row level security;
alter table public.safeguarding_case_events enable row level security;

-- No blanket authenticated policies are installed in this draft.
-- Report creation can later be exposed through a narrow RPC/function without granting reporters case-table read access.
-- Case reads must require explicit assignment/safeguarding role + school scope.
-- Group safeguarding reads must require escalated_to_group = true and an authorised school grant.
-- Critical cases require an escalation timestamp before closure.
-- AI/system signals may create or prioritise reports but may never set closed_by_user_id or close a case autonomously.
-- Group reporting should use aggregate, de-identified views instead of raw case browsing.
