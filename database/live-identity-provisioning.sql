-- Aurelia live identity provisioning — invitation-first pilot release.
-- Apply after database/live-core-schema.sql.
--
-- No role is self-granted. A server-verified issuer creates a short-lived,
-- role-scoped invitation. The authenticated recipient may claim exactly that
-- invitation; the browser never inserts profiles/memberships/guardian links.

begin;

create type public.account_invitation_state as enum ('pending', 'claimed', 'revoked', 'expired');

create table public.account_invitations (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  intended_role public.platform_role not null,
  intended_age_band public.age_band not null,
  school_id uuid references public.schools(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  education_group_id uuid references public.education_groups(id) on delete cascade,
  guardian_sponsor_profile_id uuid references public.profiles(id) on delete cascade,
  issued_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  state public.account_invitation_state not null default 'pending',
  expires_at timestamptz not null,
  claimed_by_auth_user_id uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at),
  check (expires_at <= created_at + interval '7 days'),
  check ((state = 'claimed') = (claimed_at is not null)),
  check (state <> 'claimed' or claimed_by_auth_user_id is not null),
  check (state <> 'revoked' or revoked_at is not null),
  check (
    (intended_role = 'child' and intended_age_band in ('under_9', 'age_9_12', 'age_13_15'))
    or (intended_role <> 'child' and intended_age_band = 'adult')
  ),
  check (intended_role <> 'teacher' or school_id is not null),
  check (intended_role <> 'school_admin' or school_id is not null),
  check (intended_role <> 'group_admin' or education_group_id is not null),
  check (intended_role = 'child' or guardian_sponsor_profile_id is null)
);

create index idx_account_invitations_issuer on public.account_invitations(issued_by_profile_id, state, expires_at);
create index idx_account_invitations_school on public.account_invitations(school_id, state) where school_id is not null;

alter table public.account_invitations enable row level security;
revoke all privileges on public.account_invitations from public, anon, authenticated;

create function public.server_issue_account_invitation(
  p_auth_user_id uuid,
  p_token_hash text,
  p_intended_role public.platform_role,
  p_intended_age_band public.age_band,
  p_school_id uuid default null,
  p_cohort_id uuid default null,
  p_education_group_id uuid default null,
  p_expires_at timestamptz default (now() + interval '24 hours')
)
returns table(invitation_id uuid, expires_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor public.profiles%rowtype;
  v_guardian_sponsor uuid;
  v_invitation_id uuid;
begin
  if p_token_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid invitation token hash'; end if;
  if p_expires_at <= now() or p_expires_at > now() + interval '7 days' then raise exception 'invalid invitation expiry'; end if;

  select p.* into v_actor from public.profiles p
  where p.auth_user_id = p_auth_user_id and p.disabled_at is null limit 1;
  if v_actor.id is null then raise exception 'issuer profile not found'; end if;

  if v_actor.primary_role = 'platform_admin' then
    if p_intended_role not in ('parent', 'child', 'teacher', 'school_admin', 'group_admin') then
      raise exception 'role requires separate verified transition';
    end if;
  elsif v_actor.primary_role = 'school_admin' then
    if p_school_id is null or p_intended_role not in ('child', 'teacher') then
      raise exception 'school administrator invitation outside allowed scope';
    end if;
    if not exists (
      select 1 from public.school_memberships sm
      where sm.profile_id = v_actor.id and sm.school_id = p_school_id
        and sm.role = 'school_admin' and sm.status = 'active'
        and (sm.ends_at is null or sm.ends_at > now())
    ) then raise exception 'school administrator scope mismatch'; end if;
  elsif v_actor.primary_role = 'parent' then
    if p_intended_role <> 'child' then raise exception 'parent may invite a child only'; end if;
    if p_school_id is not null and not exists (
      select 1 from public.school_memberships sm
      where sm.profile_id = v_actor.id and sm.school_id = p_school_id
        and sm.role = 'parent' and sm.status = 'active'
        and (sm.ends_at is null or sm.ends_at > now())
    ) then raise exception 'parent school scope mismatch'; end if;
    v_guardian_sponsor := v_actor.id;
  else
    raise exception 'issuer role cannot create account invitations';
  end if;

  if p_intended_role = 'child' and p_intended_age_band not in ('under_9', 'age_9_12', 'age_13_15') then
    raise exception 'child invitation requires under-16 age band';
  end if;
  if p_intended_role <> 'child' and p_intended_age_band <> 'adult' then raise exception 'adult role requires adult age band'; end if;
  if p_intended_role = 'child' and v_guardian_sponsor is null and p_school_id is null then
    raise exception 'child invitation requires verified parent or school sponsor';
  end if;
  if p_intended_role in ('teacher', 'school_admin') and p_school_id is null then raise exception 'school-scoped role requires school'; end if;
  if p_intended_role = 'group_admin' and p_education_group_id is null then raise exception 'group administrator requires education group'; end if;
  if p_cohort_id is not null and p_school_id is null then raise exception 'cohort requires school'; end if;
  if p_cohort_id is not null and not exists (
    select 1 from public.cohorts c where c.id = p_cohort_id and c.school_id = p_school_id
  ) then raise exception 'cohort school mismatch'; end if;

  insert into public.account_invitations (
    token_hash, intended_role, intended_age_band, school_id, cohort_id,
    education_group_id, guardian_sponsor_profile_id, issued_by_profile_id, expires_at
  ) values (
    lower(p_token_hash), p_intended_role, p_intended_age_band, p_school_id, p_cohort_id,
    p_education_group_id, v_guardian_sponsor, v_actor.id, p_expires_at
  ) returning id into v_invitation_id;

  insert into public.audit_log(actor_profile_id, action, target_type, target_id, metadata)
  values (v_actor.id, 'account_invitation_issued', 'account_invitation', v_invitation_id,
    jsonb_build_object('role', p_intended_role::text, 'school_scoped', p_school_id is not null));

  return query select v_invitation_id, p_expires_at;
end;
$$;

create function public.server_claim_account_invitation(
  p_auth_user_id uuid,
  p_token_hash text,
  p_display_name text,
  p_country_code text default null
)
returns table(profile_id uuid, role public.platform_role, school_id uuid, education_group_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_invitation public.account_invitations%rowtype;
  v_profile_id uuid;
  v_display_name text;
begin
  v_display_name := btrim(p_display_name);
  if char_length(v_display_name) < 1 or char_length(v_display_name) > 120 then raise exception 'invalid display name'; end if;
  if p_country_code is not null and p_country_code !~ '^[A-Z]{2}$' then raise exception 'invalid country code'; end if;
  if p_token_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid invitation token hash'; end if;
  if not exists (select 1 from auth.users u where u.id = p_auth_user_id) then raise exception 'authenticated user not found'; end if;
  if exists (select 1 from public.profiles p where p.auth_user_id = p_auth_user_id) then raise exception 'profile already exists'; end if;

  select ai.* into v_invitation from public.account_invitations ai
  where ai.token_hash = lower(p_token_hash) and ai.state = 'pending'
    and ai.revoked_at is null and ai.claimed_at is null and ai.expires_at > now()
  for update limit 1;
  if v_invitation.id is null then raise exception 'invitation is invalid or expired'; end if;

  insert into public.profiles (auth_user_id, display_name, primary_role, age_band, country_code)
  values (p_auth_user_id, v_display_name, v_invitation.intended_role, v_invitation.intended_age_band, p_country_code)
  returning id into v_profile_id;

  if v_invitation.school_id is not null then
    insert into public.school_memberships(profile_id, school_id, role, status, starts_at)
    values (v_profile_id, v_invitation.school_id, v_invitation.intended_role, 'active', now());
  end if;
  if v_invitation.education_group_id is not null then
    insert into public.group_memberships(profile_id, education_group_id, role, status)
    values (v_profile_id, v_invitation.education_group_id, v_invitation.intended_role, 'active');
  end if;
  if v_invitation.cohort_id is not null then
    insert into public.cohort_memberships(profile_id, cohort_id, status)
    values (v_profile_id, v_invitation.cohort_id, 'active');
  end if;
  if v_invitation.intended_role = 'child' and v_invitation.guardian_sponsor_profile_id is not null then
    insert into public.guardian_links(parent_profile_id, child_profile_id, relationship_label, status, verified_at)
    values (v_invitation.guardian_sponsor_profile_id, v_profile_id, 'guardian', 'verified', now());
  end if;

  update public.account_invitations
  set state = 'claimed', claimed_by_auth_user_id = p_auth_user_id, claimed_at = now()
  where id = v_invitation.id;

  insert into public.audit_log(actor_profile_id, action, target_type, target_id, metadata)
  values (v_profile_id, 'account_invitation_claimed', 'account_invitation', v_invitation.id,
    jsonb_build_object('role', v_invitation.intended_role::text));

  return query select v_profile_id, v_invitation.intended_role, v_invitation.school_id, v_invitation.education_group_id;
end;
$$;

create function public.server_revoke_account_invitation(p_auth_user_id uuid, p_invitation_id uuid)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare
  v_actor_id uuid;
  v_invitation public.account_invitations%rowtype;
begin
  select p.id into v_actor_id from public.profiles p
  where p.auth_user_id = p_auth_user_id and p.disabled_at is null limit 1;
  select ai.* into v_invitation from public.account_invitations ai where ai.id = p_invitation_id for update;
  if v_actor_id is null or v_invitation.id is null then return false; end if;
  if v_invitation.issued_by_profile_id <> v_actor_id then raise exception 'invitation issuer mismatch'; end if;
  if v_invitation.state <> 'pending' then raise exception 'invitation is not pending'; end if;

  update public.account_invitations set state = 'revoked', revoked_at = now() where id = p_invitation_id;
  insert into public.audit_log(actor_profile_id, action, target_type, target_id)
  values (v_actor_id, 'account_invitation_revoked', 'account_invitation', p_invitation_id);
  return true;
end;
$$;

revoke all on function public.server_issue_account_invitation(uuid, text, public.platform_role, public.age_band, uuid, uuid, uuid, timestamptz) from public, anon, authenticated;
revoke all on function public.server_claim_account_invitation(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.server_revoke_account_invitation(uuid, uuid) from public, anon, authenticated;

grant execute on function public.server_issue_account_invitation(uuid, text, public.platform_role, public.age_band, uuid, uuid, uuid, timestamptz) to service_role;
grant execute on function public.server_claim_account_invitation(uuid, text, text, text) to service_role;
grant execute on function public.server_revoke_account_invitation(uuid, uuid) to service_role;

commit;
