-- Live RLS and Data API grants for family permission workflows.
-- Apply after schema-draft.sql + privacy-schema-extension.sql + family-permissions-extension.sql.

-- Resolve the current authenticated profile inline in policies. Authorization
-- never reads user_metadata or other browser-editable JWT fields.

-- ---------------------------------------------------------------------------
-- permission_requests
-- ---------------------------------------------------------------------------

create policy permission_requests_child_guardian_select
on public.permission_requests
for select to authenticated
using (
  child_profile_id in (
    select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
  )
  or child_profile_id in (
    select gl.child_profile_id
    from public.guardian_links gl
    join public.profiles parent on parent.id = gl.parent_profile_id
    where parent.auth_user_id = (select auth.uid())
      and gl.status = 'verified'
  )
);

create policy permission_requests_child_insert
on public.permission_requests
for insert to authenticated
with check (
  child_profile_id = requested_by_profile_id
  and child_profile_id in (
    select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
  )
  and state = 'pending'
);

create policy permission_requests_child_withdraw
on public.permission_requests
for update to authenticated
using (
  state = 'pending'
  and child_profile_id in (
    select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
  )
)
with check (
  state = 'withdrawn'
  and child_profile_id in (
    select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
  )
);

-- ---------------------------------------------------------------------------
-- permission_requirements
-- ---------------------------------------------------------------------------

create policy permission_requirements_subject_guardian_select
on public.permission_requirements
for select to authenticated
using (
  request_id in (
    select pr.id
    from public.permission_requests pr
    where pr.child_profile_id in (
      select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
    )
    or pr.child_profile_id in (
      select gl.child_profile_id
      from public.guardian_links gl
      join public.profiles parent on parent.id = gl.parent_profile_id
      where parent.auth_user_id = (select auth.uid())
        and gl.status = 'verified'
    )
  )
);

-- Requirements are server/policy-engine generated; no browser writes.

-- ---------------------------------------------------------------------------
-- permission_decisions
-- ---------------------------------------------------------------------------

create policy permission_decisions_subject_guardian_select
on public.permission_decisions
for select to authenticated
using (
  request_id in (
    select pr.id
    from public.permission_requests pr
    where pr.child_profile_id in (
      select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
    )
    or pr.child_profile_id in (
      select gl.child_profile_id
      from public.guardian_links gl
      join public.profiles parent on parent.id = gl.parent_profile_id
      where parent.auth_user_id = (select auth.uid())
        and gl.status = 'verified'
    )
  )
);

create policy permission_decisions_verified_guardian_insert
on public.permission_decisions
for insert to authenticated
with check (
  decision_role = 'guardian'
  and decision_by_profile_id in (
    select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.guardian_links gl
    join public.permission_requests pr on pr.child_profile_id = gl.child_profile_id
    where gl.id = guardian_link_id
      and pr.id = request_id
      and gl.parent_profile_id = decision_by_profile_id
      and gl.status = 'verified'
      and pr.state = 'pending'
  )
);

-- Decisions are immutable. A changed decision creates a new governed workflow;
-- browser UPDATE/DELETE is intentionally not granted.

-- ---------------------------------------------------------------------------
-- permission_events
-- ---------------------------------------------------------------------------

create policy permission_events_subject_guardian_select
on public.permission_events
for select to authenticated
using (
  request_id in (
    select pr.id
    from public.permission_requests pr
    where pr.child_profile_id in (
      select p.id from public.profiles p where p.auth_user_id = (select auth.uid())
    )
    or pr.child_profile_id in (
      select gl.child_profile_id
      from public.guardian_links gl
      join public.profiles parent on parent.id = gl.parent_profile_id
      where parent.auth_user_id = (select auth.uid())
        and gl.status = 'verified'
    )
  )
);

-- Event inserts are server-generated only.

-- ---------------------------------------------------------------------------
-- Explicit Data API grants
-- ---------------------------------------------------------------------------

grant select on public.permission_requests to authenticated;
grant insert (
  child_profile_id,
  requested_by_profile_id,
  request_type,
  resource_kind,
  resource_id
) on public.permission_requests to authenticated;
grant update (state) on public.permission_requests to authenticated;

grant select on public.permission_requirements to authenticated;
grant select on public.permission_decisions to authenticated;
grant insert (
  request_id,
  decision_role,
  decision,
  decision_by_profile_id,
  guardian_link_id,
  policy_version,
  decision_note
) on public.permission_decisions to authenticated;
grant select on public.permission_events to authenticated;

-- No anonymous access, no generic project/media access, no parent-alumni
-- entitlement, and no browser write privileges on requirements/events.
