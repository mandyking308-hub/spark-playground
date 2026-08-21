# Backend readiness

This milestone prepares the application for a dedicated Supabase project without applying schema changes to the existing inactive generic project.

## Connection boundary

The app must use a dedicated Supabase project for this platform. Until that project is explicitly selected or created, all backend code remains repository-side only.

## Security principles

- Every exposed table has Row Level Security enabled.
- Authorization comes from verified memberships and guardian links, never user-editable metadata.
- Parent Alumni status never grants child-data access.
- 16+ Alumni sees only explicitly transitioned portfolio records.
- Approved organisations can manage their own opportunities/challenges but cannot browse child profiles or contact children privately.
- Safeguarding case access is narrower than ordinary school administration.
- Service-role credentials never enter browser code.
- Storage object policies mirror record-level ownership/tenant rules.

## Migration order

1. Extensions / enum types
2. Identity and tenant tables
3. Family/guardian relationships and lifecycle state
4. Creator, challenge, club and achievement tables
5. Adult community and parent alumni tables
6. Moderation, consent and safeguarding tables
7. Organisation/opportunity tables
8. 16+ transition tables
9. AI policy/audit tables
10. RLS policies and indexes
11. Storage bucket policies
12. Seed/reference data

## Activation checklist

When a dedicated project exists:

1. Apply the schema to a non-production branch/project first using Supabase migration tooling.
2. Generate TypeScript database types.
3. Run security and performance advisors.
4. Execute RLS access tests using representative child, parent, parent-alumni, teacher, school-admin, group-admin, organisation-admin and alumni identities.
5. Connect frontend with only the publishable project URL/key.
6. Verify auth lifecycle and tenant isolation before enabling uploads or child-created content.

## Repository files in this milestone

- `database/schema-draft.sql` — reviewable draft of tables, enums, indexes and RLS policy shapes. It is intentionally not a Supabase migration file until a dedicated project exists.
- `database/security-test-cases.md` — concrete access tests that must pass against the live project.
- `src/data/platform-contracts.ts` — typed frontend/backend contracts so UI work does not depend on a particular database client.
- `src/config/runtime.ts` — safe runtime configuration boundary that never accepts a service-role key in browser code.
