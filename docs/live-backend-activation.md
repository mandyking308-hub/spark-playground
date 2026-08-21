# Live backend activation

Aurelia is ready to move from preview contracts to a dedicated Supabase project.

## Dedicated-project rule

The browser connection requires all three values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_REF`

The URL project ref must exactly match the explicitly approved project ref. This prevents the application being accidentally pointed at an unrelated or legacy Supabase project.

## Current live activation order

1. Create a new dedicated Aurelia Supabase project in the explicitly approved organisation/region.
2. Keep Data API exposure explicit and least-privilege.
3. Apply **`database/live-core-schema.sql`** as the phase-one schema. Do **not** apply the older `schema-draft.sql` to the new project.
4. Run Supabase security + performance advisors immediately.
5. Provision representative test identities through the authenticated/admin onboarding path.
6. Verify live RLS with separate child, parent, teacher/admin test identities before enabling real user data.
7. Generate TypeScript database types from the live project.
8. Add only project URL, publishable key and the exact project ref to public runtime configuration.
9. Connect read-only/session-aware repositories first.
10. Enable direct project draft writes only after cross-user project isolation tests pass.
11. Deploy authenticated server/Edge workflows for permission-request creation, guardian decisions and audit events; permission tables are intentionally browser-read-only in the core schema.
12. Configure the private Storage buckets below through the Storage API/dashboard, then apply `database/live-storage-policies.sql`.
13. Enable uploads only after cross-user Storage tests pass and the sanitizer derivative service is live.
14. Add broader community, Passport, staff, partner, safeguarding and Alumni migrations in separately tested phases.

`database/schema-draft.sql` and the various historical extension drafts remain useful architecture references, but the new project starts from `live-core-schema.sql` so known unsafe draft policies never exist in the live environment.

## Storage activation

Create these as **private buckets**:

- `child-quarantine` — original authenticated child uploads only.
- `sanitized-media` — server-created derivatives after malware/content/metadata checks.
- `publication-media` — server-created delivery assets after permission + moderation + safety approval.

Bucket controls must be configured explicitly before uploads are enabled:

- approved MIME types only;
- reviewed maximum file size;
- no public bucket access;
- no filename-based object keys;
- no child write access to sanitized/publication buckets;
- no original-file upsert/replacement;
- file operations through Supabase Storage APIs, not direct writes to Storage metadata tables.

The child quarantine object path is `<auth-user-id>/<opaque-uuid-v4>`. Original filenames remain display/audit metadata only and never appear in the object locator.

Approved/public experiences should use revocable signed delivery or another controlled delivery route rather than a permanently public original object.

## Core live security properties

- Browser users cannot mutate role, age band, auth identity or disabled state.
- Only an active under-16 child profile can create/edit child projects.
- Project ownership defaults from the authenticated database identity; the browser cannot submit an owner ID.
- Project creation/editing cannot set publication or moderation state.
- A verified guardian relationship does not provide generic read access to a child's private drafts.
- Permission records are resource-specific and browser-read-only; the authenticated server workflow writes the request/requirements/decision/event chain atomically.
- Sensitive safeguarding/moderation/audit tables remain outside ordinary Data API grants until exact live staff policies are installed and tested.
- Original child uploads remain quarantined and never become publication assets.

## Production activation threshold

Do not call the backend production-ready until:

- the dedicated project is healthy;
- advisors are clear or explicitly reviewed;
- child A cannot read/write child B data;
- parent A cannot see/approve child B requests;
- Parent Alumni has no child-data access;
- school staff cannot cross schools;
- group admins cannot browse a merged child directory;
- organisation staff cannot browse/contact children;
- alumni cannot read under-16 records;
- browser clients have no service-role/secret credentials;
- publication state cannot be set directly by a child client;
- child A cannot read/delete child B quarantine objects;
- no child can write directly to sanitized/publication storage;
- deleted/revoked access remains revoked after recovery tests.
