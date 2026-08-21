-- Aurelia media ingestion safety extension
-- REVIEWABLE ONLY: do not apply until the dedicated backend/storage project exists.

create type public.media_ingestion_status as enum ('quarantined', 'scanning', 'review_required', 'sanitized', 'blocked', 'failed');
create type public.media_scan_status as enum ('pending', 'clear', 'review', 'blocked', 'error');

alter table public.media_assets
  add column if not exists sha256 text,
  add column if not exists detected_mime_type text,
  add column if not exists ingestion_status public.media_ingestion_status not null default 'quarantined',
  add column if not exists metadata_stripped boolean not null default false,
  add column if not exists sanitized_from_asset_id uuid references public.media_assets(id) on delete set null,
  add column if not exists public_eligible boolean not null default false;

create table public.media_ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  original_asset_id uuid not null unique references public.media_assets(id) on delete cascade,
  malware_scan_status public.media_scan_status not null default 'pending',
  content_scan_status public.media_scan_status not null default 'pending',
  metadata_scan_status public.media_scan_status not null default 'pending',
  declared_mime_type text not null,
  detected_mime_type text,
  original_filename_label text,
  sanitized_asset_id uuid references public.media_assets(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now()
);

create table public.media_safety_findings (
  id uuid primary key default gen_random_uuid(),
  ingestion_job_id uuid not null references public.media_ingestion_jobs(id) on delete cascade,
  finding_type text not null,
  severity text not null check (severity in ('info', 'review', 'block')),
  detail text,
  created_at timestamptz not null default now()
);

alter table public.media_ingestion_jobs enable row level security;
alter table public.media_safety_findings enable row level security;

-- Intentionally no blanket authenticated policies.
-- Storage/backend contract:
-- 1. originals go only to a private quarantine bucket under random server-generated keys,
-- 2. declared MIME/extension never overrides server-side file signature detection,
-- 3. active/executable/archive child-upload formats are rejected,
-- 4. malware/content/metadata scanner errors fail closed and keep media quarantined,
-- 5. precise location/EXIF metadata is removed before a sanitized derivative is produced,
-- 6. original uploads never become publication assets,
-- 7. sanitized derivatives remain private until the separate publication approval workflow succeeds,
-- 8. original filename is display/audit metadata only and never a storage locator.
