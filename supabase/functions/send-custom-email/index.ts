import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Envoi d'un email libre depuis le back-office (page Messagerie).
 * Le contenu HTML est fourni par le staff — pas de template ici, c'est
 * l'appelant qui compose. Toujours enrobé dans le layout Terex minimal
 * pour garder header/footer cohérents avec les mails transactionnels.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const { to, subject, html, text, cc, replyTo, senderName } = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ success: false, error: "to / subject / html requis" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const wrapped = wrapMinimal(html, subject);

    const res = await resend.emails.send({
      from: `${senderName || "Terex"} <noreply@terangaexchange.com>`,
      to: Array.isArray(to) ? to : [to],
      cc: cc && cc.length > 0 ? cc : undefined,
      reply_to: replyTo || "terangaexchange@gmail.com",
      subject,
      html: wrapped,
      text: text || stripTags(html),
    });

    if (res.error) {
      return new Response(JSON.stringify({ success: false, error: res.error.message || String(res.error) }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, id: res.data?.id }),
      { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || "Erreur inconnue" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Enveloppe minimale style Terex — header logo, corps HTML libre du staff,
 * footer légal + empreinte unique anti-clip Gmail (voir wrapEmail des
 * templates transactionnels).
 */
function wrapMinimal(bodyHtml: string, preview: string): string {
  const F = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
  const BASE = "https://terangaexchange.com";
  const LOGO = "https://terangaexchange.com/terex-icon.png";
  const yr = new Date().getFullYear();
  const uniq = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(preview)}</title>
<style>
  body { margin: 0; background: #f6f6f4; font-family: ${F}; color: #111; line-height: 1.55; }
  a { color: #111; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px; }
  .wrap { max-width: 560px; margin: 0 auto; padding: 32px 20px 40px; }
  .card { background: #ffffff; border-radius: 14px; box-shadow: 0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08); overflow: hidden; }
  .head { padding: 22px 28px 12px; }
  .brand-logo { display: inline-block; width: 28px; height: 28px; border-radius: 7px; vertical-align: middle; margin-right: 10px; border: 0; }
  .brand { display: inline-block; vertical-align: middle; font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .body { padding: 4px 28px 28px; font-size: 15px; color: #111; }
  .body p { margin: 0 0 14px; }
  .body p:last-child { margin-bottom: 0; }
  .foot { border-top: 1px solid #ececea; color: #4a4a47; font-size: 12px; line-height: 1.55; }
  .foot a { color: #4a4a47; text-decoration: none; }
  .foot .row { padding: 16px 28px; }
  .foot .brand-mark { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .foot .fine { border-top: 1px solid #ececea; color: #8a8a86; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <img class="brand-logo" src="${LOGO}" width="28" height="28" alt="Terex" />
        <span class="brand">Terex</span>
      </div>
      <div class="body">${bodyHtml}</div>
      <div class="foot">
        <div class="row">
          <div class="brand-mark">Terex</div>
          <div style="margin-top:6px">
            <a href="mailto:terangaexchange@gmail.com">terangaexchange@gmail.com</a> &nbsp;·&nbsp;
            <a href="${BASE}">terangaexchange.com</a>
          </div>
        </div>
        <div class="row fine">
          Vous recevez cet e-mail parce que vous avez un compte sur Terex.
          <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
          <span style="display:none;color:#f6f6f4;font-size:1px;line-height:1px;">Ref ${uniq}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
