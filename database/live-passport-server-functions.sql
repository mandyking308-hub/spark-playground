-- Server-only Teacher -> Passport workflows.
-- Apply after database/live-passport-verification.sql.

begin;

-- SECURITY INVOKER is deliberate: grant only the table operations required by
-- the three reviewed server workflows. Ordinary browser roles remain excluded.
grant select on public.profiles to service_role;
grant select on public.projects to service_role;
grant select on public.school_memberships to service_role;
grant select on public.teacher_cohort_assignments to service_role;
grant select on public.learning_briefs to service_role;
grant select, update on public.learning_brief_submissions to service_role;
grant select, insert, update on public.passport_achievements to service_role;
grant insert on public.passport_verification_events to service_role;
grant insert on public.audit_log to service_role;

create function public.server_set_submission_review_state(
  p_auth_user_id uuid,
  p_submission_id uuid,
  p_review_state public.submission_review_state
)
returns table(submission_id uuid, review_state public.submission_review_state)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_teacher_id uuid;
  v_submission public.learning_brief_submissions%rowtype;
  v_brief public.learning_briefs%rowtype;
begin
  if p_review_state not in ('in_review', 'revision_requested', 'closed') then
    raise exception 'review state requires verification workflow';
  end if;

  select p.id into v_teacher_id
  from public.profiles p
  where p.auth_user_id = p_auth_user_id
    and p.primary_role = 'teacher'
    and p.age_band = 'adult'
    and p.disabled_at is null
  limit 1;
  if v_teacher_id is null then raise exception 'verified teacher profile not found'; end if;

  select s.* into v_submission
  from public.learning_brief_submissions s
  where s.id = p_submission_id
  for update;
  if v_submission.id is null then raise exception 'submission not found'; end if;

  select lb.* into v_brief from public.learning_briefs lb where lb.id = v_submission.brief_id;
  if not exists (
    select 1 from public.teacher_cohort_assignments tca
    where tca.teacher_profile_id = v_teacher_id
      and tca.school_id = v_brief.school_id
      and tca.cohort_id = v_brief.cohort_id
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  ) then raise exception 'teacher assignment does not cover submission'; end if;

  if v_submission.review_state = 'verified' then raise exception 'verified submission cannot be downgraded'; end if;

  update public.learning_brief_submissions
  set review_state = p_review_state,
      reviewed_by_profile_id = v_teacher_id,
      reviewed_at = now()
  where id = p_submission_id;

  insert into public.audit_log(actor_profile_id, action, target_type, target_id, metadata)
  values (v_teacher_id, 'learning_submission_review_state_changed', 'learning_brief_submission', p_submission_id,
    jsonb_build_object('review_state', p_review_state::text));

  return query select p_submission_id, p_review_state;
end;
$$;

create function public.server_issue_passport_achievement(
  p_auth_user_id uuid,
  p_submission_id uuid,
  p_kind text,
  p_title text,
  p_description text default null,
  p_verification_note text default null
)
returns table(achievement_id uuid, verified_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_teacher_id uuid;
  v_submission public.learning_brief_submissions%rowtype;
  v_brief public.learning_briefs%rowtype;
  v_project public.projects%rowtype;
  v_achievement_id uuid;
  v_verified_at timestamptz := now();
begin
  if p_kind not in ('project', 'certificate', 'skill', 'leadership', 'volunteering', 'award') then
    raise exception 'invalid achievement kind';
  end if;
  if char_length(btrim(p_title)) < 1 or char_length(btrim(p_title)) > 180 then raise exception 'invalid achievement title'; end if;
  if p_description is not null and char_length(p_description) > 4000 then raise exception 'achievement description too long'; end if;
  if p_verification_note is not null and char_length(p_verification_note) > 2000 then raise exception 'verification note too long'; end if;

  select p.id into v_teacher_id
  from public.profiles p
  where p.auth_user_id = p_auth_user_id
    and p.primary_role = 'teacher'
    and p.age_band = 'adult'
    and p.disabled_at is null
  limit 1;
  if v_teacher_id is null then raise exception 'verified teacher profile not found'; end if;

  select s.* into v_submission
  from public.learning_brief_submissions s
  where s.id = p_submission_id
  for update;
  if v_submission.id is null then raise exception 'submission not found'; end if;
  if v_submission.review_state in ('verified', 'closed') then raise exception 'submission already finalized'; end if;

  select lb.* into v_brief from public.learning_briefs lb where lb.id = v_submission.brief_id;
  if not exists (
    select 1 from public.teacher_cohort_assignments tca
    where tca.teacher_profile_id = v_teacher_id
      and tca.school_id = v_brief.school_id
      and tca.cohort_id = v_brief.cohort_id
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  ) then raise exception 'teacher assignment does not cover submission'; end if;

  select p.* into v_project from public.projects p where p.id = v_submission.project_id;
  if v_project.id is null
     or v_project.owner_profile_id <> v_submission.child_profile_id
     or (v_project.school_id is not null and v_project.school_id <> v_submission.school_id) then
    raise exception 'submission evidence does not belong to child';
  end if;

  insert into public.passport_achievements(
    school_id,
    child_profile_id,
    kind,
    title,
    description,
    evidence_project_id,
    evidence_submission_id,
    issuer_type,
    issuer_profile_id,
    verification_note,
    verified_at,
    visibility
  ) values (
    v_submission.school_id,
    v_submission.child_profile_id,
    p_kind,
    btrim(p_title),
    p_description,
    v_submission.project_id,
    v_submission.id,
    'teacher',
    v_teacher_id,
    p_verification_note,
    v_verified_at,
    'private'
  ) returning id into v_achievement_id;

  update public.learning_brief_submissions
  set review_state = 'verified', reviewed_by_profile_id = v_teacher_id, reviewed_at = v_verified_at
  where id = v_submission.id;

  insert into public.passport_verification_events(achievement_id, actor_profile_id, action, reason)
  values (v_achievement_id, v_teacher_id, 'issued', p_verification_note);

  insert into public.audit_log(actor_profile_id, action, target_type, target_id, metadata)
  values (v_teacher_id, 'passport_achievement_issued', 'passport_achievement', v_achievement_id,
    jsonb_build_object('submission_id', v_submission.id, 'kind', p_kind));

  return query select v_achievement_id, v_verified_at;
end;
$$;

create function public.server_revoke_passport_achievement(
  p_auth_user_id uuid,
  p_achievement_id uuid,
  p_reason text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor public.profiles%rowtype;
  v_achievement public.passport_achievements%rowtype;
begin
  if char_length(btrim(p_reason)) < 1 or char_length(p_reason) > 2000 then raise exception 'revocation reason required'; end if;

  select p.* into v_actor from public.profiles p
  where p.auth_user_id = p_auth_user_id and p.disabled_at is null limit 1;
  select pa.* into v_achievement from public.passport_achievements pa
  where pa.id = p_achievement_id for update;
  if v_actor.id is null or v_achievement.id is null then return false; end if;
  if v_achievement.revoked_at is not null then return true; end if;

  if v_actor.id <> v_achievement.issuer_profile_id and not exists (
    select 1 from public.school_memberships sm
    where sm.profile_id = v_actor.id
      and sm.school_id = v_achievement.school_id
      and sm.role = 'school_admin'
      and sm.status = 'active'
      and (sm.ends_at is null or sm.ends_at > now())
  ) then raise exception 'actor cannot revoke achievement'; end if;

  update public.passport_achievements set revoked_at = now() where id = p_achievement_id;
  insert into public.passport_verification_events(achievement_id, actor_profile_id, action, reason)
  values (p_achievement_id, v_actor.id, 'revoked', btrim(p_reason));
  insert into public.audit_log(actor_profile_id, action, target_type, target_id)
  values (v_actor.id, 'passport_achievement_revoked', 'passport_achievement', p_achievement_id);
  return true;
end;
$$;

revoke all on function public.server_set_submission_review_state(uuid, uuid, public.submission_review_state) from public, anon, authenticated;
revoke all on function public.server_issue_passport_achievement(uuid, uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.server_revoke_passport_achievement(uuid, uuid, text) from public, anon, authenticated;

grant execute on function public.server_set_submission_review_state(uuid, uuid, public.submission_review_state) to service_role;
grant execute on function public.server_issue_passport_achievement(uuid, uuid, text, text, text, text) to service_role;
grant execute on function public.server_revoke_passport_achievement(uuid, uuid, text) to service_role;

commit;
