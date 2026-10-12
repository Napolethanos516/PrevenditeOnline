import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
      return new Response(
        JSON.stringify({ error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const { count: todayCount } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00.000Z`)
      .lt("created_at", `${todayStr}T23:59:59.999Z`);

    const { count: todayUniqueSessions } = await supabase
      .from("page_views")
      .select("session_id", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00.000Z`)
      .lt("created_at", `${todayStr}T23:59:59.999Z`);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const { count: yesterdayCount } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${yesterdayStr}T00:00:00.000Z`)
      .lt("created_at", `${yesterdayStr}T23:59:59.999Z`);

    const { count: totalViews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });

    const dateLabel = today.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const diff = (todayCount ?? 0) - (yesterdayCount ?? 0);
    const trendEmoji = diff > 0 ? "📈" : diff < 0 ? "📉" : "➡️";
    const trendText =
      diff > 0
        ? `+${diff} rispetto a ieri`
        : diff < 0
        ? `${diff} rispetto a ieri`
        : "invariato rispetto a ieri";

    const reportText =
      `📊 <b>Report giornaliero visualizzazioni</b>\n` +
      `📅 ${dateLabel}\n` +
      `----------------------------------------\n` +
      `👁️ Visualizzazioni totali oggi: <b>${todayCount ?? 0}</b>\n` +
      `👤 Visitatori unici oggi: <b>${todayUniqueSessions ?? 0}</b>\n` +
      `${trendEmoji} ${trendText}\n` +
      `📊 Totale di sempre: <b>${totalViews ?? 0}</b>`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: reportText,
          parse_mode: "HTML",
        }),
      }
    );

    return new Response(
      JSON.stringify({ success: true, report: reportText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
