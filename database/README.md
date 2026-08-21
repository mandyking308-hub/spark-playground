# Database workspace

This directory is intentionally repository-side until a dedicated Supabase project is selected or created.

- `schema-draft.sql` is the reviewed target schema, not an applied migration.
- `schema-draft.test.ts` statically enforces key security invariants in CI.
- `security-test-cases.md` is the live RLS/IDOR acceptance suite to execute once the database exists.

Do not apply this schema to an unrelated or legacy project. Once the dedicated project exists, use Supabase migration tooling to create the formal migration history, then run advisors and the full access suite before enabling live child data.
