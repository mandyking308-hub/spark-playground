# Live backend activation

Aurelia is now ready to move from preview contracts to a dedicated Supabase project.

## Dedicated-project rule

The browser connection requires all three values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_REF`

The URL project ref must exactly match the explicitly approved project ref. This prevents the application being accidentally pointed at an unrelated or legacy Supabase project.

## Current live activation order

1. Create a new dedicated Aurelia Supabase project in the explicitly approved organisation/region.
2. Leave automatic Data API exposure disabled / use explicit grants.
3. Apply `database/schema-draft.sql` to the dedicated project only.
4. Apply required domain extensions for the live workflow being activated.
5. Apply `database/live-access-hardening.sql`.
6. Apply `database/live-family-permission-policies.sql` after the family permission tables exist.
7. Run Supabase security + performance advisors.
8. Verify live RLS using separate representative identities.
9. Generate TypeScript database types.
10. Add only the project URL, publishable key and project ref to public runtime configuration.
11. Connect read-only/session-aware repositories first.
12. Enable project writes only after self-ownership RLS tests pass.
13. Enable guardian approvals only after cross-family denial tests pass.
14. Keep uploads disabled until private quarantine storage policies and the sanitizer derivative pipeline are live.

## Live security corrections from the original review draft

- Browser users cannot mutate role/age/auth/disabled profile fields.
- Project creation/editing cannot set publication or moderation state.
- A verified guardian relationship does not provide generic read access to a child's private drafts.
- Parent decisions operate on a child-created `permission_request`, not an arbitrary project ID.
- Browser write APIs derive actor identity from the authenticated session instead of accepting owner/parent profile IDs from the client.
- Sensitive safeguarding/moderation/audit tables remain outside ordinary Data API grants until exact live staff policies are installed and tested.

## Production activation threshold

Do not call the backend production-ready until:

- the dedicated project is healthy;
- advisors are clear or reviewed;
- child A cannot read/write child B data;
- parent A cannot see/approve child B requests;
- Parent Alumni has no child-data access;
- school staff cannot cross schools;
- group admins cannot browse a merged child directory;
- organisation staff cannot browse/contact children;
- alumni cannot read under-16 records;
- browser clients have no service-role/secret credentials;
- publication state cannot be set directly by a child client;
- deleted/revoked access remains revoked after recovery tests.
