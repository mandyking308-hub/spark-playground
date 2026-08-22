-- Billing webhook events are server/audit records and must never be browser-readable.
-- An explicit false policy documents that boundary while preserving RLS denial.

create policy billing_events_browser_denied
on public.billing_events for select to authenticated
using (false);
