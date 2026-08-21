-- Mirrors the Passport performance hardening applied to the dedicated Aurelia
-- Supabase project after the post-deployment advisor pass.

begin;

create index if not exists idx_brief_submissions_project
  on public.learning_brief_submissions(project_id);
create index if not exists idx_brief_submissions_reviewed_by
  on public.learning_brief_submissions(reviewed_by_profile_id)
  where reviewed_by_profile_id is not null;
create index if not exists idx_brief_submissions_school
  on public.learning_brief_submissions(school_id);
create index if not exists idx_learning_briefs_created_by
  on public.learning_briefs(created_by_profile_id);
create index if not exists idx_learning_briefs_school
  on public.learning_briefs(school_id);
create index if not exists idx_passport_evidence_project
  on public.passport_achievements(evidence_project_id);
create index if not exists idx_passport_evidence_submission
  on public.passport_achievements(evidence_submission_id)
  where evidence_submission_id is not null;
create index if not exists idx_passport_issuer
  on public.passport_achievements(issuer_profile_id);
create index if not exists idx_passport_school
  on public.passport_achievements(school_id);
create index if not exists idx_passport_events_achievement
  on public.passport_verification_events(achievement_id);
create index if not exists idx_passport_events_actor
  on public.passport_verification_events(actor_profile_id);
create index if not exists idx_teacher_assignments_assigned_by
  on public.teacher_cohort_assignments(assigned_by_profile_id);
create index if not exists idx_teacher_assignments_cohort
  on public.teacher_cohort_assignments(cohort_id);
create index if not exists idx_teacher_assignments_school
  on public.teacher_cohort_assignments(school_id);

-- Preserve the original access union while avoiding duplicate permissive policy
-- evaluation for the same role/action.
drop policy if exists brief_submissions_child_select on public.learning_brief_submissions;
drop policy if exists brief_submissions_teacher_select on public.learning_brief_submissions;
create policy brief_submissions_subject_or_teacher_select
on public.learning_brief_submissions for select to authenticated
using (
  child_profile_id = public.current_profile_id()
  or exists (
    select 1
    from public.learning_briefs lb
    join public.teacher_cohort_assignments tca
      on tca.cohort_id = lb.cohort_id
     and tca.school_id = lb.school_id
    where lb.id = learning_brief_submissions.brief_id
      and tca.teacher_profile_id = public.current_profile_id()
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  )
);

drop policy if exists passport_child_guardian_select on public.passport_achievements;
drop policy if exists passport_issuer_select on public.passport_achievements;
create policy passport_subject_guardian_or_issuer_select
on public.passport_achievements for select to authenticated
using (
  (
    revoked_at is null
    and (
      child_profile_id = public.current_profile_id()
      or exists (
        select 1
        from public.guardian_links gl
        where gl.parent_profile_id = public.current_profile_id()
          and gl.child_profile_id = passport_achievements.child_profile_id
          and gl.status = 'verified'
          and gl.revoked_at is null
      )
    )
  )
  or issuer_profile_id = public.current_profile_id()
);

commit;
