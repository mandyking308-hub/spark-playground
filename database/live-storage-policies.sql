-- Aurelia private Storage RLS policies.
-- Apply only after the dedicated Supabase project exists and these PRIVATE
-- buckets have been created through the Storage API/dashboard with reviewed
-- MIME and file-size limits:
--   child-quarantine
--   sanitized-media
--   publication-media
--
-- Do not insert/update/delete storage metadata rows directly. File operations
-- use the Supabase Storage API; this SQL only defines access policies.

-- ---------------------------------------------------------------------------
-- Child quarantine bucket
-- ---------------------------------------------------------------------------

-- Authenticated child uploads use an opaque path:
--   <auth.uid()>/<uuid-v4>
-- The original filename is never part of the storage locator.

create policy child_quarantine_insert_own_prefix
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'child-quarantine'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 1
  and storage.filename(name) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
);

create policy child_quarantine_select_owned
on storage.objects
for select to authenticated
using (
  bucket_id = 'child-quarantine'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy child_quarantine_delete_owned
on storage.objects
for delete to authenticated
using (
  bucket_id = 'child-quarantine'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Intentionally NO authenticated UPDATE policy on child-quarantine.
-- A child cannot upsert/replace an existing original. New upload = new object.

-- ---------------------------------------------------------------------------
-- Sanitized derivatives
-- ---------------------------------------------------------------------------

-- No ordinary authenticated INSERT/UPDATE/DELETE policy is installed for
-- sanitized-media. Sanitizer/scanner services create derivatives server-side.
-- A sanitized derivative remains private and is not automatically publication
-- eligible merely because it exists in this bucket.

create policy sanitized_media_owner_select
on storage.objects
for select to authenticated
using (
  bucket_id = 'sanitized-media'
  and owner_id = (select auth.uid()::text)
);

-- ---------------------------------------------------------------------------
-- Publication media
-- ---------------------------------------------------------------------------

-- No ordinary authenticated INSERT/UPDATE/DELETE policy is installed for
-- publication-media. The publishing service copies an already-sanitized asset
-- only after the permission + moderation + safety chain is complete.
--
-- There is deliberately no blanket anon SELECT policy. Public/approved delivery
-- should use narrowly scoped signed URLs or a controlled delivery service so
-- revocation/removal can take effect without leaving permanent public objects.

create policy publication_media_owner_select
on storage.objects
for select to authenticated
using (
  bucket_id = 'publication-media'
  and owner_id = (select auth.uid()::text)
);

-- ---------------------------------------------------------------------------
-- Explicitly absent by design
-- ---------------------------------------------------------------------------
-- * no anon policies
-- * no child write access to sanitized-media/publication-media
-- * no UPDATE/upsert on child originals
-- * no filename-based identity or location information in paths
-- * no direct modification of storage schema metadata
-- * no public bucket dependency
