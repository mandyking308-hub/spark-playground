# Database security test cases

These must pass against the dedicated Supabase project before live child data is allowed.

## Test identities

Create isolated fixtures for:

- Child A — School A
- Child B — School B
- Parent A — verified guardian of Child A only
- Parent Alumni A — no current guardian link
- Teacher A — School A only
- Teacher B — School B only
- School Admin A — School A only
- Group Admin G — Group G containing Schools A and B
- Organisation Admin O — Organisation O only
- Alumni A — 16+ environment only
- Platform safeguarding reviewer — narrow safeguarding role

## Guardian / parent boundary

1. Parent A can read Child A approved parent-visible records.
2. Parent A cannot read Child B profile, projects, passport or media metadata.
3. Revoking Parent A -> Child A guardian link removes child access immediately after session refresh.
4. Parent Alumni A cannot read any child's private profile or project merely because they are alumni.
5. Parent Alumni adult-community membership does not expand child data access.

## School tenancy

1. Teacher A can read authorised School A cohort data only.
2. Teacher A cannot read School B child data even when guessing UUIDs.
3. School Admin A cannot read School B private data.
4. Group Admin G can access only schools that belong to Group G.
5. Removing a school from Group G removes Group Admin G access after membership/session refresh.

## Child boundary

1. Child A can read/update their own draft projects.
2. Child A cannot read Child B private drafts.
3. Child A cannot enter adult parent communities.
4. Child A cannot read safeguarding case notes.
5. Child A cannot directly query adult connection records.

## Parent community

1. Current parent may access only communities where membership is active.
2. Parent Alumni may access only eligible alumni/adult communities.
3. Community membership grants access to adult posts, not child records.
4. A suspended community membership removes read/write access.
5. Adult connection endpoints must reject child profile IDs as requester/addressee targets.

## Organisation boundary

1. Organisation Admin O can manage Organisation O records and approved opportunities/challenges.
2. Organisation Admin O cannot list child profiles.
3. Organisation Admin O cannot query guardian links.
4. Organisation Admin O cannot read child private projects/submissions outside the explicit programme workflow.
5. Organisation Admin O cannot obtain child email, phone, contact details or private message channel.

## 16+ Alumni boundary

1. Alumni A cannot read under-16 projects directly.
2. Alumni A can read only alumni portfolio items tied to their own alumni profile.
3. Childhood content appears in Alumni only after an explicit non-revoked transition consent.
4. Revoked transition consent prevents new exposure and triggers review of any derived alumni item.
5. Alumni community membership does not grant access to child clubs/challenges/private profiles.

## AI

1. Child AI audit event is visible only to the child and authorised safety/admin workflow as defined.
2. `prompt_retained` defaults to false.
3. AI policy version cannot be modified by ordinary authenticated users.
4. Parent/school AI disablement must override a child request.
5. No service-role key is present in client bundles or browser environment variables.

## Moderation and safeguarding

1. Ordinary parent cannot read safeguarding reports.
2. Teacher access is restricted to authorised safeguarding scope and does not imply platform-wide case access.
3. School admin access is school-scoped.
4. Group admin access is group-scoped and should use least-privilege views where possible.
5. Organisation admins and alumni have no safeguarding-case access.
6. Every safeguarding read/update is audit logged.

## Storage

1. Private child upload path is unreadable without authorised record access.
2. Parent can retrieve only linked-child assets that are parent-visible.
3. Guessing another tenant's storage path fails.
4. Organisation admin cannot access child raw uploads.
5. Published derivative assets are separated from private originals.
6. Upserts require INSERT + SELECT + UPDATE policies as applicable.

## Negative UUID / IDOR suite

For every endpoint/table that accepts a UUID:

- replace the authorised object ID with another school/group/user object's valid UUID;
- verify the query returns no row / access denied;
- verify no error leaks private metadata;
- verify admin UI does not rely solely on client-side hiding.
