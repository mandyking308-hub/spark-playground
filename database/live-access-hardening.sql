-- Aurelia live backend access hardening
-- Apply AFTER database/schema-draft.sql on the dedicated Aurelia Supabase project.
-- This file exists because RLS decides which ROWS can be reached, while Postgres
-- grants decide which TABLES/COLUMNS can be reached at all.
--
-- New Supabase projects no longer expose new public tables automatically by
-- default. We keep that safer posture deliberately and grant only the minimum
-- client capabilities needed for the first live workflows.

-- ---------------------------------------------------------------------------
-- Remove draft policies that are intentionally too broad for production.
-- ---------------------------------------------------------------------------

drop policy if exists linked_parent_projects_select on public.projects;

-- A verified guardian relationship is NOT a blanket entitlement to a child's
-- private drafts. Parent approvals are served through scoped permission records.

-- ---------------------------------------------------------------------------
-- Start from no Data API privileges for browser roles.
-- ---------------------------------------------------------------------------

revoke all privileges on all tables in schema public from anon;
revoke all privileges on all tables in schema public from authenticated;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on all sequences in schema public from authenticated;

grant usage on schema public to authenticated;

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

-- Profiles are readable only where an RLS policy allows it. The current draft
-- exposes self only; additional guardian/staff-safe profile projections should
-- be added as purpose-specific views rather than widening this table.
grant select on public.profiles to authenticated;

-- Users may edit presentation fields only. Role, age-band, auth identity,
-- country/legal state and disabled state remain server-authoritative.
grant update (display_name, avatar_path) on public.profiles to authenticated;

-- No direct browser INSERT/DELETE on profiles. Profile provisioning and account
-- lifecycle actions are server-controlled.

-- ---------------------------------------------------------------------------
-- Family relationships
-- ---------------------------------------------------------------------------

grant select on public.guardian_links to authenticated;

-- Guardian verification/revocation is not writable by ordinary browser users.
-- It is completed through verified school/platform workflows.

-- ---------------------------------------------------------------------------
-- Child creation
-- ---------------------------------------------------------------------------

grant select on public.projects to authenticated;

-- A child can create a private project, but may not choose publication state or
-- published timestamps at insert time.
grant insert (owner_profile_id, school_id, kind, title, summary) on public.projects to authenticated;

-- A child can edit creative metadata, not moderation/publication state.
grant update (title, summary) on public.projects to authenticated;

grant delete on public.projects to authenticated;

-- Media metadata is not yet browser-writable. Upload activation waits for the
-- private quarantine bucket + sanitizer/derivative pipeline.

-- ---------------------------------------------------------------------------
-- Achievement / Passport read paths
-- ---------------------------------------------------------------------------

grant select on public.achievements to authenticated;
grant select on public.passport_items to authenticated;

-- Teachers/staff do not receive direct broad write grants here. Verified
-- issuance is activated through scoped staff policies / server workflows.

-- ---------------------------------------------------------------------------
-- Adult community read paths
-- ---------------------------------------------------------------------------

grant select on public.communities to authenticated;
grant select on public.community_memberships to authenticated;
grant select on public.community_posts to authenticated;
grant insert (community_id, author_profile_id, body) on public.community_posts to authenticated;

-- Connections/events remain disabled until their adult-only RLS policies and
-- verification checks are exercised against live identities.

-- ---------------------------------------------------------------------------
-- Alumni
-- ---------------------------------------------------------------------------

grant select on public.alumni_portfolio_items to authenticated;

-- No browser write grant can migrate childhood data. Transition stays explicit
-- and item-by-item through the governed consent workflow.

-- ---------------------------------------------------------------------------
-- AI audit
-- ---------------------------------------------------------------------------

grant select on public.ai_audit_events to authenticated;

-- Client users never insert their own audit outcome. The AI gateway records it.

-- ---------------------------------------------------------------------------
-- Sensitive tables intentionally receive NO authenticated/anon Data API grant:
-- consent_records, publication_reviews, moderation_cases, safeguarding_reports,
-- audit_log, organisation memberships, provider/security governance tables, and
-- all other server/privileged operational records until their exact live access
-- policies are separately activated and tested.
-- ---------------------------------------------------------------------------

-- Service-role/privileged server access is intentionally not granted here. The
-- Supabase service role is server-only and must never appear in the browser.
