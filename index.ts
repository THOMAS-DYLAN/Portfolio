import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const MY_EMAIL   = "dylant5323@gmail.com";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Intake email builder ─────────────────────────────────────────────────
function buildEmail(name: string, service: string, where: string): string {
  const isEcom    = /signature|staple|e-commerce/i.test(service);
  const isCustom  = /custom/i.test(service);
  const isUnsure  = /not sure/i.test(service);
  const isPreLaunch = /not launched|pre-launch/i.test(where);
  const onMarket  = /etsy|amazon|ebay|tiktok|temu|facebook|marketplace/i.test(where);

  const opener = isPreLaunch
    ? "Exciting — launching a new brand is the best time to set things up right. Let me gather a few details so your store starts strong."
    : onMarket
    ? "Smart move getting off the marketplace — let me gather a few details so I can build you something that's actually yours."
    : isEcom
    ? "Sounds like you're ready to get a real online store built — let me gather a few details before I put anything together."
    : isCustom
    ? "A fully custom build is a real project — I want to make sure I have everything before we start."
    : isUnsure
    ? "No problem — your answers below will help me figure out the right fit."
    : "A template site can move fast — I just need a few things from you to get started.";

  const ecomRows = isEcom ? `
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Roughly how many products are you starting with?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">____________________</td></tr>
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Do you have product photos ready?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">Yes &nbsp;/&nbsp; No &nbsp;/&nbsp; Some of them</td></tr>
  ` : "";

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0d0b08;font-family:Outfit,system-ui,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 24px;">

  <div style="border-bottom:1px solid #2e2820;padding-bottom:24px;margin-bottom:32px;">
    <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#cf9532;margin:0 0 6px;">Deadwood Digital</p>
    <p style="font-size:22px;color:#f5ead6;margin:0;font-weight:300;">Web Design &amp; Development</p>
  </div>

  <p style="color:#f5ead6;font-size:16px;margin:0 0 8px;">Hey ${name},</p>
  <p style="color:#8a7d6a;font-size:14px;line-height:1.75;margin:0 0 16px;">${opener}</p>
  <p style="color:#8a7d6a;font-size:14px;line-height:1.75;margin:0 0 32px;">Reply to this email with whatever you have — rough answers are fine, anything helps.</p>

  <p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#cf9532;margin:0 0 12px;border-bottom:1px solid #2e2820;padding-bottom:8px;">YOUR BRAND</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Do you have a logo?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">Yes &nbsp;/&nbsp; No &nbsp;/&nbsp; In progress</td></tr>
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Brand colors?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">Yes (what are they?) &nbsp;/&nbsp; No &nbsp;/&nbsp; Open to suggestions</td></tr>
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">2–3 words for how the site should feel:</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">____________________</td></tr>
    <tr><td style="padding:6px 0;color:#8a7d6a;font-size:13px;">1–3 websites you like the look of:</td><td style="padding:6px 0 6px 16px;color:#e5d9c5;font-size:13px;">____________________</td></tr>
  </table>

  <p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#cf9532;margin:0 0 12px;border-bottom:1px solid #2e2820;padding-bottom:8px;">YOUR CONTENT</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Text written for your pages?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">Yes &nbsp;/&nbsp; Partially &nbsp;/&nbsp; No — need help</td></tr>
    <tr><td style="padding:6px 0;color:#8a7d6a;font-size:13px;">Do you have photos?</td><td style="padding:6px 0 6px 16px;color:#e5d9c5;font-size:13px;">Yes &nbsp;/&nbsp; No &nbsp;/&nbsp; Need help sourcing</td></tr>
  </table>

  <p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#cf9532;margin:0 0 12px;border-bottom:1px solid #2e2820;padding-bottom:8px;">YOUR SITE</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Pages you need (or what the site should do):</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">____________________</td></tr>
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">Customers buying directly from the site?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">Yes &nbsp;/&nbsp; No &nbsp;/&nbsp; Maybe later</td></tr>
    ${ecomRows}
    <tr><td style="padding:6px 0;color:#8a7d6a;font-size:13px;">Do you have a domain name?</td><td style="padding:6px 0 6px 16px;color:#e5d9c5;font-size:13px;">Yes (what is it?) &nbsp;/&nbsp; No</td></tr>
  </table>

  <p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#cf9532;margin:0 0 12px;border-bottom:1px solid #2e2820;padding-bottom:8px;">TIMELINE &amp; CONTEXT</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:36px;">
    <tr><td style="padding:6px 0;border-bottom:1px solid #2e2820;color:#8a7d6a;font-size:13px;">When do you need this live?</td><td style="padding:6px 0 6px 16px;border-bottom:1px solid #2e2820;color:#e5d9c5;font-size:13px;">ASAP &nbsp;/&nbsp; Within a month &nbsp;/&nbsp; 1–3 months &nbsp;/&nbsp; No rush</td></tr>
    <tr><td style="padding:6px 0;color:#8a7d6a;font-size:13px;">Anything I should know upfront?</td><td style="padding:6px 0 6px 16px;color:#e5d9c5;font-size:13px;">____________________</td></tr>
  </table>

  <div style="border-top:1px solid #2e2820;padding-top:24px;">
    <p style="color:#8a7d6a;font-size:13px;line-height:1.75;margin:0 0 20px;">That's it. Once I hear back I'll put together a full scope and quote.</p>
    <p style="color:#f5ead6;font-size:14px;margin:0;">— Dylan</p>
    <p style="color:#8a7d6a;font-size:12px;margin:4px 0 0;">Deadwood Digital &nbsp;·&nbsp; <a href="mailto:${MY_EMAIL}" style="color:#cf9532;text-decoration:none;">${MY_EMAIL}</a> &nbsp;·&nbsp; (816) 752-4944</p>
  </div>

</div>
</body></html>`;
}

// ── Handler ──────────────────────────────────────────────────────────────
serve(async (req) => {

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS });
  }

  try {
    const { name, email, service, business, where, timeframe, style, message } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from:     "Deadwood Digital <onboarding@resend.dev>",
        to:       [email],
        reply_to: MY_EMAIL,
        subject:  "A few quick questions about your project — Deadwood Digital",
        html:     buildEmail(name.split(" ")[0], service ?? "", where ?? ""),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: "Email failed" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
