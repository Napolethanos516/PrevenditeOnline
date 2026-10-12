/*
# Create posters and requests tables (single-tenant, no auth)

1. New Tables
- `posters`
  - `id` (uuid, primary key)
  - `title` (text, not null) — title of the poster/event
  - `category` (text, not null) — category or date label
  - `image_url` (text, not null) — URL to the cover image (storage public URL or external URL)
  - `short_description` (text, not null) — brief description shown on cards
  - `full_description` (text, not null) — full description shown in detail modal
  - `created_at` (timestamptz, default now())
- `requests`
  - `id` (uuid, primary key)
  - `poster_id` (uuid, foreign key to posters, nullable) — which poster the request is about
  - `poster_title` (text, not null) — denormalized poster title for display even if poster is deleted
  - `request_type` (text, not null) — 'info' or 'purchase'
  - `contact_type` (text, not null) — 'phone' or 'instagram'
  - `contact_value` (text, not null) — the raw contact string entered by the user
  - `status` (text, not null, default 'pending') — 'pending' or 'completed'
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD on posters (admin manages via simple password gate, data is intentionally public to read).
- Allow anon + authenticated INSERT on requests (anyone can submit).
- Allow anon + authenticated SELECT on requests (admin reads them).
- Allow anon + authenticated UPDATE on requests (admin marks completed).
- DELETE on requests allowed for admin cleanup.

3. Storage
- Create a public storage bucket `posters` for image uploads.
- Add storage policies allowing public read and anon+authenticated upload/delete.
*/

CREATE TABLE IF NOT EXISTS posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_posters" ON posters;
CREATE POLICY "anon_select_posters" ON posters FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posters" ON posters;
CREATE POLICY "anon_insert_posters" ON posters FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posters" ON posters;
CREATE POLICY "anon_update_posters" ON posters FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posters" ON posters;
CREATE POLICY "anon_delete_posters" ON posters FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES posters(id) ON DELETE SET NULL,
  poster_title text NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('info', 'purchase')),
  contact_type text NOT NULL CHECK (contact_type IN ('phone', 'instagram')),
  contact_value text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_requests" ON requests;
CREATE POLICY "anon_select_requests" ON requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_requests" ON requests;
CREATE POLICY "anon_insert_requests" ON requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_requests" ON requests;
CREATE POLICY "anon_update_requests" ON requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_requests" ON requests;
CREATE POLICY "anon_delete_requests" ON requests FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests (status);

-- Storage bucket for poster image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('posters', 'posters', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_posters_storage" ON storage.objects;
CREATE POLICY "anon_read_posters_storage" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'posters');

DROP POLICY IF EXISTS "anon_insert_posters_storage" ON storage.objects;
CREATE POLICY "anon_insert_posters_storage" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'posters');

DROP POLICY IF EXISTS "anon_update_posters_storage" ON storage.objects;
CREATE POLICY "anon_update_posters_storage" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'posters') WITH CHECK (bucket_id = 'posters');

DROP POLICY IF EXISTS "anon_delete_posters_storage" ON storage.objects;
CREATE POLICY "anon_delete_posters_storage" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'posters');
