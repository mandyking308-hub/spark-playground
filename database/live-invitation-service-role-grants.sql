-- Narrow the dedicated Aurelia server role to the invitation operations used by
-- issuance, claim/revocation and privacy-minimal preflight workflows.
-- Apply after database/live-identity-invoker-hardening.sql.

begin;

revoke delete, references, trigger, truncate on public.account_invitations from service_role;
revoke update on public.account_invitations from service_role;

grant select, insert on public.account_invitations to service_role;
grant update (state, claimed_by_auth_user_id, claimed_at, revoked_at)
  on public.account_invitations to service_role;

commit;
