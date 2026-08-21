-- Indexes added after running Supabase performance advisors on the dedicated
-- Aurelia project. These cover foreign-key lookup paths used by lifecycle,
-- permission and invitation workflows.

begin;

create index if not exists idx_account_invitations_claimed_auth
  on public.account_invitations(claimed_by_auth_user_id)
  where claimed_by_auth_user_id is not null;
create index if not exists idx_account_invitations_cohort
  on public.account_invitations(cohort_id)
  where cohort_id is not null;
create index if not exists idx_account_invitations_group
  on public.account_invitations(education_group_id)
  where education_group_id is not null;
create index if not exists idx_account_invitations_guardian
  on public.account_invitations(guardian_sponsor_profile_id)
  where guardian_sponsor_profile_id is not null;
create index if not exists idx_audit_log_actor
  on public.audit_log(actor_profile_id)
  where actor_profile_id is not null;
create index if not exists idx_cohort_memberships_cohort
  on public.cohort_memberships(cohort_id, status);
create index if not exists idx_cohorts_school
  on public.cohorts(school_id, status);
create index if not exists idx_group_memberships_group
  on public.group_memberships(education_group_id, status);
create index if not exists idx_jurisdiction_verified_by
  on public.jurisdiction_policy_versions(verified_by_profile_id)
  where verified_by_profile_id is not null;
create index if not exists idx_permission_decisions_actor
  on public.permission_decisions(decision_by_profile_id);
create index if not exists idx_permission_decisions_guardian_link
  on public.permission_decisions(guardian_link_id)
  where guardian_link_id is not null;
create index if not exists idx_permission_events_actor
  on public.permission_events(actor_profile_id);
create index if not exists idx_permission_requests_requested_by
  on public.permission_requests(requested_by_profile_id, state);
create index if not exists idx_permission_requirements_policy
  on public.permission_requirements(jurisdiction_policy_id)
  where jurisdiction_policy_id is not null;
create index if not exists idx_privacy_preferences_policy
  on public.privacy_preferences(jurisdiction_policy_id)
  where jurisdiction_policy_id is not null;

commit;
