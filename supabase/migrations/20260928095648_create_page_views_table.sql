/*
# Create page_views table for tracking site views

1. New Tables
- `page_views`
  - `id` (uuid, primary key)
  - `poster_id` (uuid, nullable, FK to posters - set when a specific poster detail is opened)
  - `session_id` (text, not null - anonymous browser session identifier)
  - `user_agent` (text, nullable - browser user agent for device info)
  - `referrer` (text, nullable - referrer URL if available)
  - `view_type` (text, not null - 'site' for main page view, 'poster' for poster detail view)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `page_views`.
- Allow anon + authenticated to INSERT (the frontend tracks views anonymously).
- No SELECT/UPDATE/DELETE from the frontend - only the service role (edge functions) can read.
- Index on `created_at` for efficient daily queries.

3. Notes
- This table tracks every time a user opens the site or a poster detail.
- The daily report edge function will count rows where created_at falls on the current day.
- The Telegram bot edge function will respond to /visualizzazioni with the same count on demand.
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES posters(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  user_agent text,
  referrer text,
  view_type text NOT NULL DEFAULT 'site',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_view_type ON page_views (view_type);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views (session_id);

DROP POLICY IF EXISTS "anon_insert_page_views" ON page_views;
CREATE POLICY "anon_insert_page_views" ON page_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);
