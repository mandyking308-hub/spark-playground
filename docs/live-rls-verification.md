# Live RLS verification

This procedure is mandatory before enabling child-created persistence in the dedicated Aurelia Supabase project.

## Test identities

Create isolated test identities through Supabase Auth, never by inserting directly into `auth.users`:

- child A — under 16
- child B — under 16
- parent A — verified guardian of child A only
- parent B — verified guardian of child B only
- parent A revoked — same historical relationship after guardian-link revocation
- Parent Alumni — no active child guardian link

Use non-real synthetic names and email addresses. Do not use a real child for backend security testing.

## Fixture state

Create two private draft projects, one owned by each child. Create one pending publication permission request for each child through the authenticated permission workflow. Verify parent A only to child A and parent B only to child B. Capture the auth-user UUIDs, profile UUIDs, project UUIDs, guardian-link UUIDs and permission-request UUIDs in the test worksheet; do not commit those runtime IDs to GitHub.

## How each probe is run

For Data API checks, authenticate as the real test identity and use only the publishable client key. Never use the service-role key to evaluate an RLS scenario because it bypasses the browser trust boundary.

For each case in `src/domain/live-rls-matrix.ts`:

1. sign in as the named actor;
2. perform the exact Data API or Edge action;
3. record HTTP status and returned row count;
4. compare with the expected allow/deny outcome;
5. treat an unexpected row, successful mutation or authority escalation as a release blocker.

A deny is successful when the request is rejected or returns zero inaccessible rows without leaking object existence or sensitive detail.

## Mandatory denial probes

- child A cannot read/update child B's project;
- child A cannot set their own project directly to `published`;
- child A cannot edit role, age-band, auth identity or disabled status;
- parent A cannot read child A's private project row merely because the guardian link is verified;
- parent A cannot see parent B's guardian link or child B's permission request;
- a revoked parent link cannot read or decide the child's request;
- Parent Alumni cannot read any child project or permission request;
- anonymous access cannot read any phase-one core table;
- an authenticated browser cannot execute server-only permission RPCs directly;
- the frontend refuses a Supabase URL whose project ref differs from the explicitly approved project ref.

## Positive controls

The suite must also prove legitimate access works so an accidentally sealed database does not pass by denying everything:

- child A can read their own project;
- parent A can read their own verified guardian-link record;
- parent A can read child A's scoped permission request;
- the permission Edge workflow accepts a valid child publication request and valid guardian decision.

## Release gate

Do not enable live child uploads or public publishing until every mandatory denial and positive control passes against the dedicated project and Supabase security advisors have been reviewed.
