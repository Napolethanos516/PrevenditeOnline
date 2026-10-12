/*
# Schedule daily views report at 20:00 via pg_cron

1. Scheduled Jobs
- `daily-views-report`: runs every day at 20:00 (Europe/Rome = UTC+2 in summer, UTC+1 in winter)
- Calls the edge function `daily-views-report` via pg_net
- The edge function queries page_views and sends a Telegram message with the daily stats

2. Notes
- pg_cron uses UTC time. 20:00 Rome = 18:00 UTC (CET) or 19:00 UTC (CEST).
- We use '0 19 * * *' to cover CEST (summer). During CET the report fires at 20:00 CET.
- The cron job uses pg_net's http_post to call the Supabase edge function.
*/

SELECT cron.schedule(
  'daily-views-report',
  '0 19 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qrbqozoimcahiennifyv.supabase.co/functions/v1/daily-views-report',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
