// Email MARKETING Terex — style Ooble : HTML pur simple, aucun color-scheme forcé.
// Gmail adapte naturellement au mode du destinataire (blanc en clair, gris sombre
// en dark). Palette monochrome, carte blanche à ombre légère, bouton noir.

const F = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const BASE = 'https://terangaexchange.com';

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
  .wrap { max-width: 560px; margin: 0 auto; padding: 32px 20px 40px; }
  .card { background: #ffffff; border-radius: 14px; box-shadow: 0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08); overflow: hidden; }
  .head { padding: 22px 28px 12px; }
  .brand { font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .body { padding: 4px 28px 22px; font-size: 15px; color: #111; }
  .btn { display: inline-block; background: #111; color: #fff !important; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; }
  .foot { border-top: 1px solid #ececea; color: #4a4a47; font-size: 12px; line-height: 1.55; }
  .foot a { color: #4a4a47; text-decoration: none; }
  .foot a:hover { text-decoration: underline; }
  .foot .row { padding: 16px 28px; }
  .foot .brand-mark { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .foot .fine { border-top: 1px solid #ececea; color: #8a8a86; }
  .foot .links a { margin-right: 14px; }
</style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f6f6f4;">${esc(p.previewText)}</div>
  <div class="wrap">
    <div class="card">
      <div class="head"><span class="brand">Terex</span></div>
      <div class="body">
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:500;letter-spacing:-0.01em;color:#111;">${esc(p.heroTitle)}</h1>
        <p style="margin:0 0 14px;font-size:15px;font-weight:500;color:#111;">${greeting}</p>
        ${paragraphs}
        ${highlight}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px;"><tr><td>
          <a href="${p.ctaUrl}" class="btn">${esc(p.ctaText)}</a>
        </td></tr></table>
      </div>
      <div class="foot">
        <div class="row">
          <div class="brand-mark">Terex</div>
          <div style="margin-top:6px">
            <a href="mailto:terangaexchange@gmail.com">terangaexchange@gmail.com</a> &nbsp;·&nbsp;
            <a href="${BASE}">terangaexchange.com</a>
          </div>
        </div>
        <div class="row links" style="padding-top:0">
          <a href="${BASE}">Site</a>
          <a href="${BASE}/help">Aide</a>
          <a href="${p.unsubscribeUrl}" style="text-decoration:underline;">Se désabonner</a>
        </div>
        <div class="row fine">
          Vous recevez cet e-mail parce que vous êtes inscrit sur Terex.
          <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
