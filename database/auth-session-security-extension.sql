-- Aurelia authentication/session security schema extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend exists.
-- Authentication credentials, refresh tokens and MFA secrets remain owned by the auth provider.

create type public.session_revocation_reason as enum (
  'credential_reset',
  'role_changed',
  'membership_ended',
  'guardian_link_revoked',
  'account_deletion_started',
  'manual_security_revoke'
);

create table public.session_registry (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider_session_hash text not null unique,
  active_role public.platform_role not null,
  issued_at timestamptz not null,
  last_seen_at timestamptz not null,
  idle_expires_at timestamptz not null,
  absolute_expires_at timestamptz not null,
  revoked_at timestamptz,
  revocation_reason public.session_revocation_reason,
  created_at timestamptz not null default now(),
  check (char_length(provider_session_hash) >= 32),
  check (idle_expires_at > issued_at),
  check (absolute_expires_at > issued_at),
  check ((revoked_at is null and revocation_reason is null) or (revoked_at is not null and revocation_reason is not null))
);

create table public.step_up_authorisations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid not null references public.session_registry(id) on delete cascade,
  purpose text not null check (purpose in (
    'change_credentials',
    'change_guardian_link',
    'place_retention_hold',
    'release_retention_hold',
    'open_safeguarding_record',
    'change_role_grant',
    'delete_account',
    'transfer_to_alumni'
  )),
  verified_at timestamptz not null default now(),
  valid_until timestamptz not null,
  consumed_at timestamptz,
  check (valid_until > verified_at),
  check (valid_until <= verified_at + interval '10 minutes')
);

create table public.security_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  session_id uuid references public.session_registry(id) on delete set null,
  event_type text not null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  detail text,
  occurred_at timestamptz not null default now()
);

alter table public.session_registry enable row level security;
alter table public.step_up_authorisations enable row level security;
alter table public.security_events enable row level security;

-- Intentionally no blanket authenticated policies.
-- Dedicated backend functions must:
-- 1. hash provider session identifiers before storage; never persist raw access/refresh tokens,
-- 2. derive active_role from verified profile/membership data, never browser input,
-- 3. enforce idle and absolute expiry server-side,
-- 4. revoke sessions on role/membership/guardian/account-security changes,
-- 5. require short-lived, single-purpose step-up authorisation for privileged actions,
-- 6. verify 16+ Alumni transition state independently of the role label.
