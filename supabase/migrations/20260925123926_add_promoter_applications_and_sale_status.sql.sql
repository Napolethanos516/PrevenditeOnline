/*
# Add promoter_applications table and sale_status to requests

1. New table `promoter_applications`:
   - id (uuid, primary key)
   - first_name (text, not null)
   - last_name (text, not null)
   - has_experience (boolean, default false)
   - phone (text, not null)
   - instagram (text, not null)
   - status (text, default 'pending') — pending / reviewed / hired
   - created_at (timestamptz, default now())
2. Requests table changes:
   - `sale_status` (text, default 'none') — none / sold / not_sold
3. Security:
   - RLS enabled on promoter_applications.
   - anon+authenticated CRUD (single-tenant, no auth).
   - requests table already has RLS; new column inherits existing policies.
*/

CREATE TABLE IF NOT EXISTS promoter_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  has_experience boolean NOT NULL DEFAULT false,
  phone text NOT NULL,
  instagram text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promoter_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_promoter_apps" ON promoter_applications;
CREATE POLICY "anon_select_promoter_apps" ON promoter_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_promoter_apps" ON promoter_applications;
CREATE POLICY "anon_insert_promoter_apps" ON promoter_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_promoter_apps" ON promoter_applications;
CREATE POLICY "anon_update_promoter_apps" ON promoter_applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_promoter_apps" ON promoter_applications;
CREATE POLICY "anon_delete_promoter_apps" ON promoter_applications FOR DELETE
  TO anon, authenticated USING (true);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'sale_status') THEN
    ALTER TABLE requests ADD COLUMN sale_status text NOT NULL DEFAULT 'none';
  END IF;
END $$;
