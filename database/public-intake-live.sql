-- Aurelia public enquiry and safeguarding intake.
-- Public callers never access these tables directly. Submissions enter through
-- the publishable-key Edge Function, while stored records remain server-only.

begin;

create type public.public_intake_kind as enum ('enquiry', 'safeguarding');
create type public.public_intake_audience as enum (
  'family', 'school', 'education_group', 'organisation', 'press', 'general'
);
create type public.public_intake_status as enum ('new', 'in_review', 'resolved', 'closed');

create table public.public_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  kind public.public_intake_kind not null,
  audience public.public_intake_audience not null default 'general',
  name text check (name is null or char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) between 3 and 254),
  organisation text check (organisation is null or char_length(organisation) between 1 and 160),
  message text not null check (char_length(message) between 20 and 8000),
  contact_permitted boolean not null default false,
  status public.public_intake_status not null default 'new',
  retention_class text not null check (retention_class in ('general_enquiry', 'safeguarding_report')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  closed_at timestamptz,
  check (kind = 'safeguarding' or email is not null),
  check (kind = 'safeguarding' or contact_permitted = true),
  check (
    (kind = 'enquiry' and retention_class = 'general_enquiry')
    or (kind = 'safeguarding' and retention_class = 'safeguarding_report')
  )
);

create table public.public_intake_rate_limits (
  key_hash text not null check (key_hash ~ '^[0-9a-f]{64}$'),
  window_start timestamptz not null,
  submission_count integer not null default 1 check (submission_count > 0),
  primary key (key_hash, window_start)
);

create index idx_public_intake_status_created
  on public.public_intake_submissions(kind, status, created_at desc);
create index idx_public_intake_audience_created
  on public.public_intake_submissions(audience, created_at desc);

alter table public.public_intake_submissions enable row level security;
alter table public.public_intake_rate_limits enable row level security;

revoke all privileges on public.public_intake_submissions from public, anon, authenticated, service_role;
revoke all privileges on public.public_intake_rate_limits from public, anon, authenticated, service_role;

grant select, insert on public.public_intake_submissions to service_role;
grant update (status, reviewed_at, closed_at) on public.public_intake_submissions to service_role;
grant select, insert, delete on public.public_intake_rate_limits to service_role;
grant update (submission_count) on public.public_intake_rate_limits to service_role;

create function public.server_consume_public_intake_quota(
  p_key_hash text,
  p_window_start timestamptz,
  p_limit integer default 10
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_key_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid rate-limit key';
  end if;
  if p_limit < 1 or p_limit > 50 then
    raise exception 'invalid rate-limit threshold';
  end if;
  if p_window_start < now() - interval '2 hours' or p_window_start > now() + interval '5 minutes' then
    raise exception 'invalid rate-limit window';
  end if;

  delete from public.public_intake_rate_limits
  where window_start < now() - interval '48 hours';

  insert into public.public_intake_rate_limits(key_hash, window_start, submission_count)
  values (lower(p_key_hash), date_trunc('hour', p_window_start), 1)
  on conflict (key_hash, window_start)
  do update set submission_count = public.public_intake_rate_limits.submission_count + 1
  returning submission_count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.server_consume_public_intake_quota(text, timestamptz, integer)
  from public, anon, authenticated;
grant execute on function public.server_consume_public_intake_quota(text, timestamptz, integer)
  to service_role;

commit;
