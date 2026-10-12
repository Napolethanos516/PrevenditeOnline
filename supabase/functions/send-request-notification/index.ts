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
    const body = await req.json();
    const { notification_type } = body;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject = "Notifica dal sito";
    let html = "";

    if (notification_type === "promoter_application") {
      const { first_name, last_name, has_experience, phone, instagram } = body;
      const expLabel = has_experience ? "Si, ha gia lavorato come promoter" : "No, non ha esperienza";

      let phoneUrl = "";
      let phoneLabel = "";
      const digits = phone.replace(/[^0-9]/g, "");
      if (digits) {
        phoneUrl = `https://wa.me/${digits}`;
        phoneLabel = "Apri chat WhatsApp";
      }

      const igUser = instagram.replace(/^@/, "");
      const igUrl = `https://instagram.com/${igUser}`;

      subject = "Nuova candidatura promoter dal sito!";
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; padding: 32px; border-radius: 16px; color: #f4f4f5;">
          <h1 style="font-size: 24px; margin: 0 0 24px; color: #ffffff;">Nuova candidatura: Lavora con noi</h1>
          <div style="background: #18181b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px; width: 40%;">Nome</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${first_name} ${last_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Esperienza promoter</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${expLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Telefono</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Instagram</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${instagram}</td>
              </tr>
            </table>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${phoneUrl ? `<a href="${phoneUrl}" style="display: inline-block; background: #ffffff; color: #09090b; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px;">${phoneLabel}</a>` : ""}
            <a href="${igUrl}" style="display: inline-block; background: #18181b; color: #f4f4f5; border: 1px solid #27272a; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px;">Apri Instagram</a>
          </div>
          <p style="margin-top: 24px; color: #71717a; font-size: 12px;">Questa email e stata inviata automaticamente dal tuo sito.</p>
        </div>
      `;
    } else {
      const { poster_title, request_type, contact_type, contact_value, referrer } = body;

      const typeLabel =
        request_type === "purchase" ? "Prenota per acquisto di persona" : "Chiedi informazioni";
      const contactLabel =
        contact_type === "phone" ? "Telefono / WhatsApp" : "Instagram";

      let actionUrl = "";
      let actionLabel = "";
      if (contact_type === "phone") {
        const digits = contact_value.replace(/[^0-9]/g, "");
        actionUrl = `https://wa.me/${digits}`;
        actionLabel = "Apri chat WhatsApp";
      } else {
        const username = contact_value.replace(/^@/, "");
        actionUrl = `https://instagram.com/${username}`;
        actionLabel = "Apri profilo Instagram";
      }

      const referrerRow = referrer
        ? `<tr><td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Inviato da</td><td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${referrer}</td></tr>`
        : "";

      subject = "Nuova richiesta dal sito!";
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; padding: 32px; border-radius: 16px; color: #f4f4f5;">
          <h1 style="font-size: 24px; margin: 0 0 24px; color: #ffffff;">Nuova richiesta dal sito!</h1>
          <div style="background: #18181b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px; width: 40%;">Locandina</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${poster_title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Tipo richiesta</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${typeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Tipo contatto</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${contactLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Contatto</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${contact_value}</td>
              </tr>
              ${referrerRow}
            </table>
          </div>
          <a href="${actionUrl}" style="display: inline-block; background: #ffffff; color: #09090b; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            ${actionLabel}
          </a>
          <p style="margin-top: 24px; color: #71717a; font-size: 12px;">Questa email e stata inviata automaticamente dal tuo sito.</p>
        </div>
      `;
    }

    const emailPayload = {
      from: "Sito Notifiche <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL || "owner@example.com",
      subject,
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: `Resend API error: ${errText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
