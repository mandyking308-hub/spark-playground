-- Aurelia live Teacher -> Passport verification.
-- Apply after database/live-core-schema.sql.
-- Browser writes are deliberately narrow; verified achievement issuance is an
-- atomic server workflow tied to an active teacher/cohort assignment.

begin;

create type public.brief_state as enum ('draft', 'open', 'closed');
create type public.submission_review_state as enum ('submitted', 'in_review', 'revision_requested', 'verified', 'closed');
create type public.passport_visibility as enum ('private', 'family', 'school', 'shared_portfolio');

create table public.teacher_cohort_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  assigned_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (teacher_profile_id, cohort_id),
  check (ends_at is null or ends_at > starts_at)
);

create table public.learning_briefs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  created_by_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 160),
  instructions text not null check (char_length(instructions) between 1 and 8000),
  skills text[] not null default '{}',
  due_at timestamptz,
  state public.brief_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_brief_submissions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.learning_briefs(id) on delete cascade,
  child_profile_id uuid not null default public.current_profile_id() references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete cascade,
  review_state public.submission_review_state not null default 'submitted',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by_profile_id uuid references public.profiles(id) on delete set null,
  unique (brief_id, child_profile_id, project_id)
);

create table public.passport_achievements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  child_profile_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('project', 'certificate', 'skill', 'leadership', 'volunteering', 'award')),
  title text not null check (char_length(title) between 1 and 180),
  description text check (description is null or char_length(description) <= 4000),
  evidence_project_id uuid not null references public.projects(id) on delete restrict,
  evidence_submission_id uuid references public.learning_brief_submissions(id) on delete set null,
  issuer_type text not null check (issuer_type in ('teacher', 'school')),
  issuer_profile_id uuid not null references public.profiles(id) on delete restrict,
  verification_note text check (verification_note is null or char_length(verification_note) <= 2000),
  verified_at timestamptz not null default now(),
  visibility public.passport_visibility not null default 'private',
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.passport_verification_events (
  id bigint generated always as identity primary key,
  achievement_id uuid not null references public.passport_achievements(id) on delete cascade,
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  action text not null check (action in ('issued', 'revoked', 'visibility_changed')),
  reason text check (reason is null or char_length(reason) <= 2000),
  created_at timestamptz not null default now()
);

create index idx_teacher_assignments_teacher on public.teacher_cohort_assignments(teacher_profile_id, school_id, cohort_id);
create index idx_learning_briefs_cohort on public.learning_briefs(cohort_id, state, due_at);
create index idx_brief_submissions_brief on public.learning_brief_submissions(brief_id, review_state, submitted_at);
create index idx_brief_submissions_child on public.learning_brief_submissions(child_profile_id, submitted_at desc);
create index idx_passport_child on public.passport_achievements(child_profile_id, verified_at desc) where revoked_at is null;

alter table public.teacher_cohort_assignments enable row level security;
alter table public.learning_briefs enable row level security;
alter table public.learning_brief_submissions enable row level security;
alter table public.passport_achievements enable row level security;
alter table public.passport_verification_events enable row level security;

-- Teacher can see only their current assignment records.
create policy teacher_assignments_self_select
on public.teacher_cohort_assignments for select to authenticated
using (teacher_profile_id = public.current_profile_id());

-- Teacher brief visibility is assignment-scoped; children see only open briefs
-- for cohorts in which they are currently active members.
create policy learning_briefs_teacher_select
on public.learning_briefs for select to authenticated
using (
  exists (
    select 1 from public.teacher_cohort_assignments tca
    where tca.teacher_profile_id = public.current_profile_id()
      and tca.school_id = learning_briefs.school_id
      and tca.cohort_id = learning_briefs.cohort_id
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  )
  or (
    state = 'open'
    and exists (
      select 1 from public.cohort_memberships cm
      where cm.profile_id = public.current_profile_id()
        and cm.cohort_id = learning_briefs.cohort_id
        and cm.status = 'active'
    )
  )
);

create policy learning_briefs_teacher_insert
on public.learning_briefs for insert to authenticated
with check (
  created_by_profile_id = public.current_profile_id()
  and state = 'draft'
  and exists (
    select 1 from public.teacher_cohort_assignments tca
    where tca.teacher_profile_id = public.current_profile_id()
      and tca.school_id = learning_briefs.school_id
      and tca.cohort_id = learning_briefs.cohort_id
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  )
);

create policy learning_briefs_teacher_update
on public.learning_briefs for update to authenticated
using (
  created_by_profile_id = public.current_profile_id()
  and exists (
    select 1 from public.teacher_cohort_assignments tca
    where tca.teacher_profile_id = public.current_profile_id()
      and tca.school_id = learning_briefs.school_id
      and tca.cohort_id = learning_briefs.cohort_id
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  )
)
with check (created_by_profile_id = public.current_profile_id());

-- A child submits only their own draft/rejected project to an open brief in
-- their own active cohort. Projects in publication/moderation flow cannot be
-- reused as classroom submission evidence until they return to an editable state.
create policy brief_submissions_child_select
on public.learning_brief_submissions for select to authenticated
using (child_profile_id = public.current_profile_id());

create policy brief_submissions_child_insert
on public.learning_brief_submissions for insert to authenticated
with check (
  child_profile_id = public.current_profile_id()
  and review_state = 'submitted'
  and reviewed_at is null
  and reviewed_by_profile_id is null
  and exists (
    select 1
    from public.learning_briefs lb
    join public.cohort_memberships cm on cm.cohort_id = lb.cohort_id
    join public.projects p on p.id = learning_brief_submissions.project_id
    where lb.id = learning_brief_submissions.brief_id
      and lb.school_id = learning_brief_submissions.school_id
      and lb.state = 'open'
      and (lb.due_at is null or lb.due_at >= now())
      and cm.profile_id = public.current_profile_id()
      and cm.status = 'active'
      and p.owner_profile_id = public.current_profile_id()
      and p.state in ('draft', 'rejected')
      and (p.school_id is null or p.school_id = lb.school_id)
  )
);

-- Assigned teachers may read submissions in their cohorts, but browser writes
-- cannot mark work verified; verification is an atomic server workflow.
create policy brief_submissions_teacher_select
on public.learning_brief_submissions for select to authenticated
using (
  exists (
    select 1
    from public.learning_briefs lb
    join public.teacher_cohort_assignments tca on tca.cohort_id = lb.cohort_id and tca.school_id = lb.school_id
    where lb.id = learning_brief_submissions.brief_id
      and tca.teacher_profile_id = public.current_profile_id()
      and tca.revoked_at is null
      and (tca.ends_at is null or tca.ends_at > now())
  )
);

-- Passport records are private by default. Child and verified guardian may read
-- active records; no parent access to underlying private project is implied.
create policy passport_child_guardian_select
on public.passport_achievements for select to authenticated
using (
  revoked_at is null
  and (
    child_profile_id = public.current_profile_id()
    or exists (
      select 1 from public.guardian_links gl
      where gl.parent_profile_id = public.current_profile_id()
        and gl.child_profile_id = passport_achievements.child_profile_id
        and gl.status = 'verified'
        and gl.revoked_at is null
    )
  )
);

create policy passport_issuer_select
on public.passport_achievements for select to authenticated
using (issuer_profile_id = public.current_profile_id());

-- Verification event history is visible to the child and issuer only; parent
-- sees the verified Passport record rather than privileged operational audit.
create policy passport_events_subject_issuer_select
on public.passport_verification_events for select to authenticated
using (
  exists (
    select 1 from public.passport_achievements pa
    where pa.id = passport_verification_events.achievement_id
      and (pa.child_profile_id = public.current_profile_id() or pa.issuer_profile_id = public.current_profile_id())
  )
);

-- Start this domain from zero Data API privileges.
revoke all privileges on public.teacher_cohort_assignments from anon, authenticated;
revoke all privileges on public.learning_briefs from anon, authenticated;
revoke all privileges on public.learning_brief_submissions from anon, authenticated;
revoke all privileges on public.passport_achievements from anon, authenticated;
revoke all privileges on public.passport_verification_events from anon, authenticated;

grant select on public.teacher_cohort_assignments to authenticated;
grant select on public.learning_briefs to authenticated;
grant insert (school_id, cohort_id, title, instructions, skills, due_at) on public.learning_briefs to authenticated;
grant update (title, instructions, skills, due_at, state) on public.learning_briefs to authenticated;

grant select on public.learning_brief_submissions to authenticated;
grant insert (brief_id, project_id, school_id) on public.learning_brief_submissions to authenticated;

grant select on public.passport_achievements to authenticated;
grant select on public.passport_verification_events to authenticated;

-- No browser insert/update/delete grant exists for Passport achievements or
-- verification events. No leaderboard, likes, follower or popularity fields.

commit;
