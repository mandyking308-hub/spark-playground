# Live identity bootstrap

Aurelia's ordinary account model is invitation-first. No browser action can grant `platform_admin`, and the generic invitation workflow deliberately cannot issue `platform_admin`, Parent Alumni, Alumni, mentor or organisation-admin roles.

## One-time first administrator

The first platform administrator is a controlled bootstrap operation, not a reusable product endpoint.

1. Create the intended administrator through normal Supabase Auth so the user exists in `auth.users`. Do not insert directly into `auth.users`.
2. Verify the identity outside the browser role-selection flow.
3. In an audited operator session, capture the exact Auth user UUID.
4. Verify there is currently no active platform administrator and that the Auth UUID has no existing Aurelia profile.
5. Execute a reviewed one-time SQL insert into `public.profiles` with:
   - the exact Auth user UUID;
   - verified display name;
   - `primary_role = 'platform_admin'`;
   - `age_band = 'adult'`.
6. Add an `audit_log` entry describing `initial_platform_admin_bootstrap` without copying authentication secrets or identity documents into the log.
7. Re-run security advisors and the live RLS verification suite.

Do **not** add a general RPC, Edge action, browser form or invitation type that can mint `platform_admin`. Subsequent privileged-admin expansion should use a separately reviewed two-person privileged-access workflow.

## Ordinary pilot provisioning after bootstrap

The authenticated platform administrator can issue short-lived invitations for Parent, Child, Teacher, School Admin and Group Admin, subject to the database scope checks. A verified Parent can issue Child invitations only. A School Admin can issue Child or Teacher invitations only within their active school scope.

The Edge Function returns a raw invitation token once to the authorised issuer. Only its SHA-256 hash is stored in the database. Claiming the invitation derives role, age band and tenant scope from the stored invitation; the recipient cannot supply or alter those authority fields.
