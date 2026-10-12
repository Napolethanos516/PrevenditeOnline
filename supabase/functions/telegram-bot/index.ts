import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!TELEGRAM_BOT_TOKEN) {
      return new Response(
        JSON.stringify({ ok: true, skipped: "TELEGRAM_BOT_TOKEN not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || !message.text) {
      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chatId = message.chat?.id?.toString();
    const text = message.text?.trim();

    if (!chatId) {
      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text === "/visualizzazioni") {
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

      const { count: totalViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const { count: yesterdayCount } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${yesterdayStr}T00:00:00.000Z`)
        .lt("created_at", `${yesterdayStr}T23:59:59.999Z`);

      const dateLabel = today.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const reportText =
        `📊 <b>Visualizzazioni del ${dateLabel}</b>\n` +
        `----------------------------------------\n` +
        `👁️ Visualizzazioni totali oggi: <b>${todayCount ?? 0}</b>\n` +
        `👤 Visitatori unici oggi: <b>${todayUniqueSessions ?? 0}</b>\n` +
        `📈 Visualizzazioni ieri: <b>${yesterdayCount ?? 0}</b>\n` +
        `📊 Totale di sempre: <b>${totalViews ?? 0}</b>`;

      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, reportText);
    } else if (text === "/start" || text === "/help") {
      const helpText =
        `🤖 <b>Bot Notifiche PrevenditeOnline</b>\n\n` +
        `Comandi disponibili:\n` +
        `/visualizzazioni - Mostra le visualizzazioni del sito di oggi\n` +
        `/help - Mostra questo messaggio di aiuto`;

      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, helpText);
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
