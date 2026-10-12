/*
# Add featured event support to posters

1. Modified Tables
- `posters`
  - Add `is_featured` (boolean, not null, default false) to identify the event selected by the creator for priority display.

2. Application Behavior
- Public listings can sort featured posters before regular posters.
- Admin users can select or remove the featured status from a poster.
- Only one poster is intended to be featured at a time; the admin interface clears the previous featured selection before setting a new one.

3. Security
- Keep the existing single-tenant anon + authenticated CRUD policies unchanged because this app does not have a sign-in screen and uses the existing password-gated admin interface.

4. Data Safety
- This migration only adds a nullable-safe column with a false default and an index. No existing columns or rows are removed or changed.
*/

ALTER TABLE public.posters
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_posters_featured_created_at
  ON public.posters (is_featured DESC, created_at DESC);
