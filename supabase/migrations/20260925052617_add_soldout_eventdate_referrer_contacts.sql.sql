/*
# Add sold_out, event_date to posters; referrer to requests; contacts table

1. Posters table changes:
   - `sold_out` (boolean, default false): marks an event as sold out.
   - `event_date` (date, nullable): the date of the event, used for chronological ordering.
2. Requests table changes:
   - `referrer` (text, nullable): the Instagram handle the customer found the link from.
3. New table `site_contacts`:
   - `id` (uuid, primary key)
   - `email` (text)
   - `phone` (text)
   - `instagram` (text, nullable)
   - `updated_at` (timestamptz, default now())
   - Single-row table for editable contact info shown on the public site.
4. Security:
   - RLS enabled on site_contacts.
   - anon+authenticated CRUD (single-tenant, no auth).
   - Posters and requests already have RLS; new columns inherit existing policies.
5. Seed: insert one default contacts row with current values.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posters' AND column_name = 'sold_out') THEN
    ALTER TABLE posters ADD COLUMN sold_out boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posters' AND column_name = 'event_date') THEN
    ALTER TABLE posters ADD COLUMN event_date date;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'referrer') THEN
    ALTER TABLE requests ADD COLUMN referrer text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS site_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT 'zona.loco.eventi@gmail.com',
  phone text NOT NULL DEFAULT '+39 3519309702',
  instagram text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_contacts" ON site_contacts;
CREATE POLICY "anon_select_contacts" ON site_contacts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contacts" ON site_contacts;
CREATE POLICY "anon_insert_contacts" ON site_contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_contacts" ON site_contacts;
CREATE POLICY "anon_update_contacts" ON site_contacts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_contacts" ON site_contacts;
CREATE POLICY "anon_delete_contacts" ON site_contacts FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO site_contacts (email, phone, instagram)
VALUES ('zona.loco.eventi@gmail.com', '+39 3519309702', NULL)
ON CONFLICT DO NOTHING;
