/*
# Add is_hidden and publish_at columns to posters

1. Modified Tables
- `posters`
  - `is_hidden` (boolean, default false): when true, the poster is not shown to site visitors
  - `publish_at` (timestamptz, nullable): when set, the poster only becomes visible after this datetime

2. Notes
- `is_hidden` lets the admin manually hide an event from the public site.
- `publish_at` lets the admin schedule a future publication time.
- The public site filters: is_hidden = false AND (publish_at IS NULL OR publish_at <= now()).
- The admin panel shows all posters regardless of hidden/scheduled status.
*/

ALTER TABLE posters ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS publish_at timestamptz;
