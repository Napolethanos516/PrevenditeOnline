/*
# Install pg_cron and pg_net extensions for scheduled tasks

1. Extensions
- pg_cron: PostgreSQL job scheduler (installed in extensions schema)
- pg_net: Async HTTP client for PostgreSQL (for making HTTP requests from SQL)

2. Notes
- pg_cron is used to schedule the daily views report at 20:00
- pg_net is used to call the edge function from the scheduled job
*/

CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
