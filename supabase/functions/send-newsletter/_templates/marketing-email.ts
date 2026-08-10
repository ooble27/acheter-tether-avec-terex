// Email MARKETING Terex — style Ooble : HTML pur simple, aucun color-scheme forcé.
// UNE SEULE table continue du haut jusqu'au copyright pour éviter les
// « trois points » Gmail et le footer détaché en dark mode.

const F = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const BASE = 'https://terangaexchange.com';
const LOGO = 'https://terangaexchange.com/terex-icon.png';

export interface MarketingEmailProps {
  userName?: string;
  previewText: string;
  heroTitle: string;
  paragraphs: string[];
  highlight?: { label: string; value: string; sub?: string };
  ctaText: string;
  ctaUrl: string;
  unsubscribeUrl: string;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function marketingEmailHtml(p: MarketingEmailProps): string {
  const greeting = p.userName ? `Bonjour ${esc(p.userName)},` : 'Bonjour,';
  const yr = new Date().getFullYear();

  const paragraphs = p.paragraphs
    .map(t => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4a4a47;">${esc(t)}</p>`)
    .join('');

  const highlight = p.highlight ? `
    <div style="margin:8px 0 20px;background:#f6f6f4;border-radius:10px;padding:22px 18px;text-align:center;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a86;">${esc(p.highlight.label)}</p>
      <p style="margin:0;font-size:32px;font-weight:500;letter-spacing:-0.02em;color:#111;line-height:1;">${esc(p.highlight.value)}</p>
      ${p.highlight.sub ? `<p style="margin:10px 0 0;font-size:13px;color:#4a4a47;">${esc(p.highlight.sub)}</p>` : ''}
    </div>` : '';

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(p.previewText)}</title>
<style>
  body { margin: 0; background: #f6f6f4; font-family: ${F}; color: #111; line-height: 1.55; }
  a { color: #111; }
  .brand-logo { display: inline-block; width: 28px; height: 28px; border-radius: 7px; vertical-align: middle; margin-right: 10px; border: 0; }
  .brand { display: inline-block; vertical-align: middle; font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .btn { display: inline-block; background: #111; color: #fff !important; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; }
  .foot-brand { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .foot-link { color: #4a4a47; text-decoration: none; margin-right: 14px; font-size: 12px; }
</style>
</head>
<body style="margin:0;padding:0;background:#f6f6f4;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f6f6f4;">${esc(p.previewText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f4;">
    <tr><td align="center" style="padding:32px 14px 40px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;background:#ffffff;border-radius:14px;box-shadow:0 1px 0 rgba(0,0,0,0.02),0 12px 32px -12px rgba(20,20,20,0.08);">

        <tr><td style="padding:22px 28px 12px;">
          <img class="brand-logo" src="${LOGO}" width="28" height="28" alt="Terex" />
          <span class="brand">Terex</span>
        </td></tr>

        <tr><td style="padding:8px 28px 4px;">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:500;letter-spacing:-0.01em;color:#111;">${esc(p.heroTitle)}</h1>
          <p style="margin:0 0 14px;font-size:15px;font-weight:500;color:#111;">${greeting}</p>
          ${paragraphs}
          ${highlight}
          <div style="margin:4px 0 8px;"><a href="${p.ctaUrl}" class="btn">${esc(p.ctaText)}</a></div>
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <div style="height:1px;background:#ececea;font-size:1px;line-height:1px;">&nbsp;</div>
        </td></tr>

        <tr><td style="padding:14px 28px 4px;font-family:${F};font-size:12px;color:#4a4a47;line-height:1.55;">
          <div class="foot-brand">Terex</div>
          <div style="margin-top:6px">
            <a href="mailto:terangaexchange@gmail.com" style="color:#4a4a47;text-decoration:none;">terangaexchange@gmail.com</a>
            &nbsp;·&nbsp;
            <a href="${BASE}" style="color:#4a4a47;text-decoration:none;">terangaexchange.com</a>
          </div>
        </td></tr>

        <tr><td style="padding:12px 28px 4px;font-family:${F};font-size:12px;">
          <a href="${BASE}" class="foot-link">Site</a>
          <a href="${BASE}/help" class="foot-link">Aide</a>
          <a href="${p.unsubscribeUrl}" style="color:#4a4a47;text-decoration:underline;font-size:12px;">Se désabonner</a>
        </td></tr>

        <tr><td style="padding:14px 28px 24px;font-family:${F};font-size:11.5px;color:#8a8a86;line-height:1.6;">
          Vous recevez cet e-mail parce que vous êtes inscrit sur Terex.
          <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
