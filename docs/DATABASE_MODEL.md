# Database and tenant model

The database must enforce the product security model independently of the frontend.

## Tenant hierarchy

`education_groups -> schools -> cohorts/classes`

A user can hold more than one membership over time. Access is derived from verified memberships and guardian links, not from editable profile metadata.

## Identity tables

### `profiles`
One row per authenticated user.

Key fields:
- `id`
- `auth_user_id`
- `display_name`
- `primary_role`
- `age_band`
- `country_code`
- `disabled_at`

Authorization-critical fields must not rely on user-editable auth metadata.

### `education_groups`
Enterprise customer / group tenant.

### `schools`
Belongs to an education group where applicable.

### `cohorts`
School-scoped class/year/club membership containers.

### `school_memberships`
Links users to schools and roles with historic status retained.

### `education_group_memberships`
Links group administrators to authorised education groups.

### `guardian_links`
Verified parent/guardian -> child relationships.

A parent query for child data must require an active verified guardian link.

## Lifecycle tables

### `child_lifecycle`
Tracks protected under-16 membership and transition into the separate 16+ environment.

### `parent_lifecycle`
States:
- `current_parent`
- `parent_alumni`
- `current_and_alumni`
- `inactive`

Parent Alumni is an adult community status and does not confer child-data access.

### `portfolio_transition_consents`
Stores explicit approval for which childhood portfolio items may transition into the 16+ environment.

## Adult community

### `communities`
Scoped to group/school or adult alumni network.

Audiences include:
- current parents
- parent alumni
- current + alumni parents
- staff
- 16+ alumni
- professional/interest groups

### `community_memberships`
Verified membership and moderation status.

### `community_posts`
Adult-community content separated from child content tables where practical.

### `adult_connections`
Verified adult-to-adult connection requests/relationships.

### `adult_events`
Networking, social, volunteering, talks and reunion events.

## Child creation and achievement

### `projects`
Master creative object for podcast, story/book, art, video, game or general project.

### `media_assets`
Private-by-default storage metadata. Object storage policies must mirror record-level authorization.

### `podcast_series`
### `podcast_episodes`
Audio, transcript and publication state.

### `challenges`
School/group/approved-organisation challenges.

### `submissions`
Child project submissions to challenges.

### `achievements`
Awards, certificates, skills, leadership, volunteering and competition outcomes.

### `passport_items`
Curated longitudinal presentation of achievements and projects.

## Safeguarding and consent

### `consent_records`
Versioned consent history. Withdrawal never deletes the audit history.

### `moderation_cases`
Content/profile/message review workflow.

### `safeguarding_reports`
High-sensitivity reporting; access should be significantly narrower than ordinary school administration.

### `publication_reviews`
Tracks automated scan, parent approval and moderator approval decisions separately.

### `audit_log`
Append-only security/admin activity record.

## AI

### `ai_policy_versions`
Versioned age/country capability policies.

### `ai_audit_events`
Records capability requested, age band, classification and outcome. Avoid storing unnecessary child prompt content.

## Opportunities / organisations

### `organisations`
Approved external education/cultural/charitable organisations.

### `organisation_memberships`
Verified organisation staff.

### `opportunities`
Challenges, events, courses and later 16+ careers/internships.

Organisations never gain a generic child directory or private child contact channel.

## RLS principles

Every exposed table must have RLS enabled.

Policies should be based on:
- `auth.uid()`
- verified membership rows
- verified guardian links
- explicit tenant IDs
- explicit community memberships

Do not use user-editable `user_metadata` for authorization.

High-level rules:

1. Child can view/edit their own private profile and own content subject to workflow state.
2. Parent can view only verified linked children.
3. Parent Alumni has no child-data policy derived from alumni status.
4. Teacher access is limited to active authorised school/cohort membership.
5. School Admin access is limited to their school.
6. Group Admin access is limited to schools within authorised group membership.
7. Organisation staff can manage only their organisation/opportunities.
8. Alumni 16+ cannot query under-16 private tables except explicitly transitioned portfolio records exposed through a safe view/table.
9. Safeguarding tables require narrower policies than ordinary administrative data.
10. Storage buckets mirror the same ownership/tenant rules.

## Indexing priorities

Indexes should cover columns used by RLS and frequent filters:
- `profiles.auth_user_id`
- `school_memberships.user_id`
- `school_memberships.school_id`
- `education_group_memberships.user_id`
- `guardian_links.parent_user_id`
- `guardian_links.child_user_id`
- `community_memberships.user_id`
- `community_memberships.community_id`
- `projects.child_user_id`
- `projects.school_id`
- `achievements.child_user_id`
- `moderation_cases.subject_id`

## Supabase implementation note

The connected Supabase account currently contains an old inactive generic project. No database changes should be applied to it without confirming that it belongs to this platform. When a dedicated project is selected/created, schema changes should be applied and verified there, followed by security/performance advisor checks before migration files are committed.
