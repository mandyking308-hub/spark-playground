-- Aurelia server-only permission workflow functions.
-- Apply AFTER database/live-core-schema.sql.
-- These functions are SECURITY INVOKER and executable only by service_role.
-- The Edge Function supplies the auth.user UUID from a verified user JWT; each
-- function independently resolves/validates the corresponding platform profile.

begin;

-- Explicit server privileges required by these narrowly scoped functions.
grant select on public.profiles to service_role;
grant select, update on public.projects to service_role;
grant select on public.guardian_links to service_role;
grant select on public.jurisdiction_policy_versions to service_role;
grant select, insert, update on public.permission_requests to service_role;
grant select, insert on public.permission_requirements to service_role;
grant select, insert on public.permission_decisions to service_role;
grant select, insert on public.permission_events to service_role;
grant insert on public.audit_log to service_role;
grant usage, select on all sequences in schema public to service_role;

-- ---------------------------------------------------------------------------
-- Child requests publication of their own project.
-- ---------------------------------------------------------------------------

create function public.server_request_project_publication(
  p_auth_user_id uuid,
  p_project_id uuid
)
returns table(request_id uuid, request_state text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_child_profile_id uuid;
  v_country_code text;
  v_existing_request_id uuid;
  v_policy_id uuid;
  v_policy_version text;
  v_request_id uuid;
begin
  select p.id, p.country_code
    into v_child_profile_id, v_country_code
  from public.profiles p
  where p.auth_user_id = p_auth_user_id
    and p.primary_role = 'child'
    and p.age_band in ('under_9', 'age_9_12', 'age_13_15')
    and p.disabled_at is null
  limit 1;

  if v_child_profile_id is null then
    raise exception 'Not authorised for child publication workflow';
  end if;

  perform 1
  from public.projects pr
  where pr.id = p_project_id
    and pr.owner_profile_id = v_child_profile_id
    and pr.state in ('draft', 'rejected')
    and pr.published_at is null
  for update;

  if not found then
    raise exception 'Project is not eligible for publication request';
  end if;

  select req.id
    into v_existing_request_id
  from public.permission_requests req
  where req.child_profile_id = v_child_profile_id
    and req.request_type = 'publish_external'
    and req.resource_kind = 'project'
    and req.resource_id = p_project_id
    and req.state = 'pending'
  order by req.requested_at desc
  limit 1;

  if v_existing_request_id is not null then
    return query select v_existing_request_id, 'pending'::text;
    return;
  end if;

  select jp.id, jp.version
    into v_policy_id, v_policy_version
  from public.jurisdiction_policy_versions jp
  where jp.jurisdiction_code = v_country_code
    and jp.verified_at is not null
    and jp.effective_from <= now()
    and (jp.effective_until is null or jp.effective_until > now())
  order by jp.effective_from desc
  limit 1;

  -- Unknown/unconfigured jurisdictions fail to the safer product policy.
  if v_policy_version is null then
    v_policy_id := null;
    v_policy_version := 'safe-default-v1';
  end if;

  insert into public.permission_requests (
    child_profile_id,
    requested_by_profile_id,
    request_type,
    resource_kind,
    resource_id,
    state,
    expires_at
  ) values (
    v_child_profile_id,
    v_child_profile_id,
    'publish_external',
    'project',
    p_project_id,
    'pending',
    now() + interval '30 days'
  ) returning id into v_request_id;

  insert into public.permission_requirements (
    request_id,
    jurisdiction_policy_id,
    policy_version,
    guardian_required,
    school_required,
    safety_review_required
  ) values (
    v_request_id,
    v_policy_id,
    v_policy_version,
    true,
    false,
    true
  );

  insert into public.permission_events (
    request_id,
    actor_profile_id,
    event_type,
    event_metadata
  ) values (
    v_request_id,
    v_child_profile_id,
    'requested',
    jsonb_build_object('resource_kind', 'project')
  );

  update public.projects
  set state = 'scan_pending', updated_at = now()
  where id = p_project_id and owner_profile_id = v_child_profile_id;

  insert into public.audit_log (actor_profile_id, action, target_type, target_id)
  values (v_child_profile_id, 'publication_request_created', 'permission_request', v_request_id);

  return query select v_request_id, 'pending'::text;
end;
$$;

-- ---------------------------------------------------------------------------
-- Child withdraws their still-pending request.
-- ---------------------------------------------------------------------------

create function public.server_withdraw_permission_request(
  p_auth_user_id uuid,
  p_request_id uuid
)
returns table(request_id uuid, request_state text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_child_profile_id uuid;
  v_resource_id uuid;
  v_request_type text;
  v_resource_kind text;
begin
  select p.id
    into v_child_profile_id
  from public.profiles p
  where p.auth_user_id = p_auth_user_id
    and p.primary_role = 'child'
    and p.age_band in ('under_9', 'age_9_12', 'age_13_15')
    and p.disabled_at is null
  limit 1;

  if v_child_profile_id is null then
    raise exception 'Not authorised for child permission workflow';
  end if;

  select req.resource_id, req.request_type, req.resource_kind
    into v_resource_id, v_request_type, v_resource_kind
  from public.permission_requests req
  where req.id = p_request_id
    and req.child_profile_id = v_child_profile_id
    and req.state = 'pending'
  for update;

  if not found then
    raise exception 'Permission request cannot be withdrawn';
  end if;

  update public.permission_requests
  set state = 'withdrawn', updated_at = now()
  where id = p_request_id;

  insert into public.permission_events (request_id, actor_profile_id, event_type)
  values (p_request_id, v_child_profile_id, 'withdrawn');

  if v_request_type = 'publish_external' and v_resource_kind = 'project' and v_resource_id is not null then
    update public.projects
    set state = 'draft', updated_at = now()
    where id = v_resource_id
      and owner_profile_id = v_child_profile_id
      and state in ('scan_pending', 'approval_pending', 'moderation_pending', 'rejected');
  end if;

  insert into public.audit_log (actor_profile_id, action, target_type, target_id)
  values (v_child_profile_id, 'permission_request_withdrawn', 'permission_request', p_request_id);

  return query select p_request_id, 'withdrawn'::text;
end;
$$;

-- ---------------------------------------------------------------------------
-- Verified guardian approves or denies a pending request.
-- ---------------------------------------------------------------------------

create function public.server_record_guardian_decision(
  p_auth_user_id uuid,
  p_request_id uuid,
  p_approved boolean,
  p_decision_note text default null
)
returns table(request_id uuid, request_state text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_parent_profile_id uuid;
  v_child_profile_id uuid;
  v_guardian_link_id uuid;
  v_policy_version text;
  v_guardian_required boolean;
  v_existing_decision text;
  v_resource_id uuid;
  v_request_type text;
  v_resource_kind text;
  v_state text;
begin
  if p_decision_note is not null and char_length(p_decision_note) > 2000 then
    raise exception 'Decision note is too long';
  end if;

  select p.id
    into v_parent_profile_id
  from public.profiles p
  where p.auth_user_id = p_auth_user_id
    and p.disabled_at is null
  limit 1;

  if v_parent_profile_id is null then
    raise exception 'Authenticated profile is unavailable';
  end if;

  select req.child_profile_id, req.resource_id, req.request_type, req.resource_kind
    into v_child_profile_id, v_resource_id, v_request_type, v_resource_kind
  from public.permission_requests req
  where req.id = p_request_id
    and req.state = 'pending'
    and (req.expires_at is null or req.expires_at > now())
  for update;

  if not found then
    raise exception 'Permission request is unavailable';
  end if;

  select gl.id
    into v_guardian_link_id
  from public.guardian_links gl
  where gl.parent_profile_id = v_parent_profile_id
    and gl.child_profile_id = v_child_profile_id
    and gl.status = 'verified'
    and gl.revoked_at is null
  limit 1;

  if v_guardian_link_id is null then
    raise exception 'Verified guardian relationship is required';
  end if;

  select pr.policy_version, pr.guardian_required
    into v_policy_version, v_guardian_required
  from public.permission_requirements pr
  where pr.request_id = p_request_id;

  if v_policy_version is null or not v_guardian_required then
    raise exception 'Guardian decision is not required for this request';
  end if;

  select pd.decision
    into v_existing_decision
  from public.permission_decisions pd
  where pd.request_id = p_request_id and pd.decision_role = 'guardian'
  limit 1;

  if v_existing_decision is not null then
    if (v_existing_decision = 'approved') = p_approved then
      select req.state into v_state from public.permission_requests req where req.id = p_request_id;
      return query select p_request_id, v_state;
      return;
    end if;
    raise exception 'Guardian decision is immutable';
  end if;

  insert into public.permission_decisions (
    request_id,
    decision_role,
    decision,
    decision_by_profile_id,
    guardian_link_id,
    policy_version,
    decision_note
  ) values (
    p_request_id,
    'guardian',
    case when p_approved then 'approved' else 'denied' end,
    v_parent_profile_id,
    v_guardian_link_id,
    v_policy_version,
    nullif(btrim(p_decision_note), '')
  );

  insert into public.permission_events (
    request_id,
    actor_profile_id,
    event_type
  ) values (
    p_request_id,
    v_parent_profile_id,
    case when p_approved then 'approved' else 'denied' end
  );

  if not p_approved then
    update public.permission_requests
    set state = 'denied', updated_at = now()
    where id = p_request_id;

    if v_request_type = 'publish_external' and v_resource_kind = 'project' and v_resource_id is not null then
      update public.projects
      set state = 'draft', updated_at = now()
      where id = v_resource_id
        and owner_profile_id = v_child_profile_id
        and state <> 'published';
    end if;
  end if;

  select req.state into v_state
  from public.permission_requests req
  where req.id = p_request_id;

  insert into public.audit_log (actor_profile_id, action, target_type, target_id, metadata)
  values (
    v_parent_profile_id,
    case when p_approved then 'guardian_permission_approved' else 'guardian_permission_denied' end,
    'permission_request',
    p_request_id,
    jsonb_build_object('decision_role', 'guardian')
  );

  return query select p_request_id, v_state;
end;
$$;

-- Server functions are not callable through ordinary user Data API roles.
revoke all on function public.server_request_project_publication(uuid, uuid) from public, anon, authenticated;
revoke all on function public.server_withdraw_permission_request(uuid, uuid) from public, anon, authenticated;
revoke all on function public.server_record_guardian_decision(uuid, uuid, boolean, text) from public, anon, authenticated;

grant execute on function public.server_request_project_publication(uuid, uuid) to service_role;
grant execute on function public.server_withdraw_permission_request(uuid, uuid) to service_role;
grant execute on function public.server_record_guardian_decision(uuid, uuid, boolean, text) to service_role;

commit;
