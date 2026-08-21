-- Aurelia notification privacy extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend/delivery providers exist.

create type public.notification_category as enum ('project_update', 'approval', 'deadline', 'achievement', 'club_update', 'security', 'safeguarding');
create type public.notification_channel as enum ('in_app', 'push', 'email', 'sms');
create type public.notification_delivery_status as enum ('pending', 'suppressed', 'sent', 'failed');

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  category public.notification_category not null,
  secure_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.notification_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  quiet_hours_enabled boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time,
  push_enabled boolean not null default false,
  email_enabled boolean not null default false,
  sms_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  check ((quiet_hours_enabled = false) or (quiet_hours_start is not null and quiet_hours_end is not null))
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.notification_events(id) on delete cascade,
  channel public.notification_channel not null,
  safe_template_key text not null,
  status public.notification_delivery_status not null default 'pending',
  suppress_reason text,
  provider_message_hash text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, channel)
);

alter table public.notification_events enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_deliveries enable row level security;

-- Intentionally no blanket authenticated policies.
-- Delivery contract:
-- 1. secure_payload is rendered only after authenticated in-app access; it is not copied into push/email/SMS bodies,
-- 2. external delivery uses fixed safe_template_key copy and no child/project/safeguarding object identifiers in URLs,
-- 3. safeguarding notifications target verified parent/staff recipients only,
-- 4. children receive no SMS/email delivery and no open/click tracking,
-- 5. quiet hours are respected for children and ordinary notifications,
-- 6. only adult safeguarding/security alerts may bypass quiet hours,
-- 7. engagement-bait/streak/popularity templates are not valid notification categories.
