-- Mirrors the hardening applied to the dedicated Aurelia Supabase project.
-- Apply after database/live-identity-provisioning.sql.

begin;

-- SECURITY INVOKER provisioning RPCs need explicit, narrow service-role table
-- privileges. Bypass-RLS alone does not grant SQL privileges.
grant select, insert on public.account_invitations to service_role;
grant update (state, claimed_by_auth_user_id, claimed_at, revoked_at) on public.account_invitations to service_role;
grant select, insert on public.profiles to service_role;
grant insert on public.school_memberships to service_role;
grant insert on public.group_memberships to service_role;
grant insert on public.cohort_memberships to service_role;
grant insert on public.guardian_links to service_role;
grant select on public.cohorts to service_role;
grant select on auth.users to service_role;

create or replace function public.server_issue_account_invitation(
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

  select p.* into v_actor
  from public.profiles p
  where p.auth_user_id = p_auth_user_id and p.disabled_at is null
  limit 1;
  if v_actor.id is null then raise exception 'issuer profile not found'; end if;

  -- Parents are family identities in the live core model, not school/group
  -- membership roles. Generic parent invitations therefore cannot smuggle in
  -- tenant membership scope.
  if p_intended_role = 'parent'
    and (p_school_id is not null or p_cohort_id is not null or p_education_group_id is not null)
  then
    raise exception 'parent invitation must not carry tenant membership scope';
  end if;

  if v_actor.primary_role = 'platform_admin' then
    if p_intended_role not in ('parent', 'child', 'teacher', 'school_admin', 'group_admin') then
      raise exception 'role requires separate verified transition';
    end if;
  elsif v_actor.primary_role = 'school_admin' then
    if p_school_id is null or p_intended_role not in ('child', 'teacher') then
      raise exception 'school administrator invitation outside allowed scope';
    end if;
    if not exists (
      select 1
      from public.school_memberships sm
      where sm.profile_id = v_actor.id
        and sm.school_id = p_school_id
        and sm.role = 'school_admin'
        and sm.status = 'active'
        and (sm.ends_at is null or sm.ends_at > now())
    ) then
      raise exception 'school administrator scope mismatch';
    end if;
  elsif v_actor.primary_role = 'parent' then
    if p_intended_role <> 'child' then raise exception 'parent may invite a child only'; end if;
    if p_school_id is not null then
      raise exception 'parent-sponsored child invitation must be family-scoped';
    end if;
    v_guardian_sponsor := v_actor.id;
  else
    raise exception 'issuer role cannot create account invitations';
  end if;

  if p_intended_role = 'child' and p_intended_age_band not in ('under_9', 'age_9_12', 'age_13_15') then
    raise exception 'child invitation requires under-16 age band';
  end if;
  if p_intended_role <> 'child' and p_intended_age_band <> 'adult' then
    raise exception 'adult role requires adult age band';
  end if;
  if p_intended_role = 'child' and v_guardian_sponsor is null and p_school_id is null then
    raise exception 'child invitation requires verified parent or school sponsor';
  end if;
  if p_intended_role in ('teacher', 'school_admin') and p_school_id is null then
    raise exception 'school-scoped role requires school';
  end if;
  if p_intended_role = 'group_admin' and p_education_group_id is null then
    raise exception 'group administrator requires education group';
  end if;
  if p_cohort_id is not null and p_school_id is null then raise exception 'cohort requires school'; end if;
  if p_cohort_id is not null and not exists (
    select 1 from public.cohorts c where c.id = p_cohort_id and c.school_id = p_school_id
  ) then
    raise exception 'cohort school mismatch';
  end if;

  insert into public.account_invitations (
    token_hash, intended_role, intended_age_band, school_id, cohort_id,
    education_group_id, guardian_sponsor_profile_id, issued_by_profile_id, expires_at
  ) values (
    lower(p_token_hash), p_intended_role, p_intended_age_band, p_school_id, p_cohort_id,
    p_education_group_id, v_guardian_sponsor, v_actor.id, p_expires_at
  ) returning id into v_invitation_id;

  insert into public.audit_log(actor_profile_id, action, target_type, target_id, metadata)
  values (
    v_actor.id,
    'account_invitation_issued',
    'account_invitation',
    v_invitation_id,
    jsonb_build_object('role', p_intended_role::text, 'school_scoped', p_school_id is not null)
  );

  return query select v_invitation_id, p_expires_at;
end;
$$;

revoke all on function public.server_issue_account_invitation(uuid, text, public.platform_role, public.age_band, uuid, uuid, uuid, timestamptz) from public, anon, authenticated;
grant execute on function public.server_issue_account_invitation(uuid, text, public.platform_role, public.age_band, uuid, uuid, uuid, timestamptz) to service_role;

commit;
