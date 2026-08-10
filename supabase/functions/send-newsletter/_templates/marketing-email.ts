// Template email MARKETING Terex — style Ooble : light mode forcé, minimaliste,
// palette monochrome sur fond gris clair / carte blanche. CTA noir + texte blanc.
// Résout le problème d'inversion Gmail dark mode.

const C = {
  pageBg: '#f6f6f4', cardBg: '#ffffff', footerBg: '#ffffff', infoBg: '#fafaf8',
  border: '#ececea', borderSoft: '#f0f0ee',
  text: '#111111', muted: '#4a4a47', dim: '#8a8a86',
  accent: '#111111', accentText: '#ffffff',
};
const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`;
const BASE = 'https://terangaexchange.com';

const CSS = `
:root{color-scheme:light only;supported-color-schemes:light;}
html,body{margin:0;padding:0;background:${C.pageBg} !important;color:${C.text} !important;line-height:1.55;-webkit-text-size-adjust:100%;color-scheme:light only;}
a{color:${C.text};}
@media (prefers-color-scheme:dark){
  html,body,.ebg{background:${C.pageBg} !important;color:${C.text} !important;color-scheme:light !important;}
  .ecard{background:${C.cardBg} !important;} .efooter{background:${C.footerBg} !important;}
  .einfo{background:${C.infoBg} !important;border-color:${C.border} !important;}
  .etxt{color:${C.text} !important;} .emuted{color:${C.muted} !important;} .edim{color:${C.dim} !important;}
}
[data-ogsc] body,[data-ogsb] body{background:${C.pageBg} !important;color:${C.text} !important;}
[data-ogsc] .ecard,[data-ogsb] .ecard{background:${C.cardBg} !important;}
[data-ogsc] .efooter,[data-ogsb] .efooter{background:${C.footerBg} !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{background:${C.infoBg} !important;}
[data-ogsc] .etxt,[data-ogsb] .etxt{color:${C.text} !important;}
[data-ogsc] .emuted,[data-ogsb] .emuted{color:${C.muted} !important;}
[data-ogsc] .edim,[data-ogsb] .edim{color:${C.dim} !important;}
@media only screen and (max-width:620px){
  .w560{width:100% !important;max-width:100% !important;}
  .mpad{padding-left:22px !important;padding-right:22px !important;}
  .mh1{font-size:22px !important;}
}
`;

export interface MarketingEmailProps {
  userName?: string;
  previewText: string;
  heroTitle: string;
  /** Paragraphes du corps — chaque élément = un paragraphe. */
  paragraphs: string[];
  /** Bloc mis en avant optionnel (ex. taux du jour, code promo). */
  highlight?: { label: string; value: string; sub?: string };
  ctaText: string;
  ctaUrl: string;
  unsubscribeUrl: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function marketingEmailHtml(p: MarketingEmailProps): string {
  const greeting = p.userName ? `Bonjour ${escapeHtml(p.userName)},` : 'Bonjour,';
  const yr = new Date().getFullYear();

  const paragraphsHtml = p.paragraphs
    .map(t => `<p style="font-family:${F};font-size:15px;color:${C.muted};line-height:1.65;margin:0 0 14px 0;">${escapeHtml(t)}</p>`)
    .join('');

  const highlightHtml = p.highlight ? `
      <tr><td class="mpad" style="padding:2px 28px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo"
          style="background:${C.infoBg};border:1px solid ${C.border};border-radius:12px;">
          <tr><td style="padding:24px 20px;text-align:center;">
            <p style="font-family:${F};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.dim};margin:0 0 12px 0;">${escapeHtml(p.highlight.label)}</p>
            <p style="font-family:${F};font-size:34px;font-weight:500;letter-spacing:-0.02em;color:${C.text};margin:0;line-height:1;">${escapeHtml(p.highlight.value)}</p>
            ${p.highlight.sub ? `<p style="font-family:${F};font-size:13px;color:${C.muted};margin:12px 0 0 0;">${escapeHtml(p.highlight.sub)}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>` : '';

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light only"/>
<meta name="supported-color-schemes" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${escapeHtml(p.previewText)}</title>
<style>${CSS}</style>
</head>
<body class="ebg" style="margin:0;padding:0;background:${C.pageBg};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;font-size:1px;line-height:1px;color:${C.pageBg};">${escapeHtml(p.previewText)}</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebg" style="background:${C.pageBg};">
<tr><td align="center" style="padding:28px 14px 40px;">
<table class="w560 ecard" role="presentation" border="0" cellpadding="0" cellspacing="0" width="560"
  style="max-width:560px;width:100%;background:${C.cardBg};border-radius:14px;box-shadow:0 1px 0 rgba(0,0,0,0.02),0 12px 32px -12px rgba(20,20,20,0.08);overflow:hidden;">

  <!-- En-tête simple -->
  <tr><td class="ecard" style="background:${C.cardBg};padding:22px 28px 6px;">
    <span style="font-family:${F};font-size:15px;letter-spacing:0.14em;text-transform:uppercase;color:${C.text};font-weight:500;">Terex</span>
  </td></tr>

  <!-- Titre -->
  <tr><td class="mpad" style="padding:16px 28px 6px;">
    <h1 class="mh1" style="font-family:${F};font-size:22px;font-weight:500;letter-spacing:-0.01em;color:${C.text};line-height:1.3;margin:0;">${escapeHtml(p.heroTitle)}</h1>
  </td></tr>

  <!-- Corps -->
  <tr><td class="mpad" style="padding:14px 28px 6px;">
    <p style="font-family:${F};font-size:15px;font-weight:500;color:${C.text};margin:0 0 12px 0;">${greeting}</p>
    ${paragraphsHtml}
  </td></tr>

  ${highlightHtml}

  <!-- CTA -->
  <tr><td class="mpad" style="padding:8px 28px 24px;">
    <a href="${p.ctaUrl}" style="display:inline-block;padding:12px 22px;font-family:${F};font-size:14px;font-weight:500;color:${C.accentText};background:${C.accent};text-decoration:none;border-radius:8px;">${escapeHtml(p.ctaText)}</a>
  </td></tr>

  <!-- Pied de page + désabonnement -->
  <tr><td class="efooter" style="background:${C.footerBg};padding:0;border-top:1px solid ${C.border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:18px 28px;">
        <div style="font-family:${F};font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:${C.text};font-weight:500;">Terex</div>
        <div style="font-family:${F};margin-top:6px;font-size:12px;color:${C.muted};">
          <a href="mailto:terangaexchange@gmail.com" style="color:${C.muted};text-decoration:none;">terangaexchange@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="${BASE}" style="color:${C.muted};text-decoration:none;">terangaexchange.com</a>
        </div>
      </td></tr>
      <tr><td style="padding:0 28px 16px;">
        <a href="${BASE}" style="font-family:${F};font-size:12px;color:${C.muted};text-decoration:none;margin-right:14px;">Site</a>
        <a href="${BASE}/help" style="font-family:${F};font-size:12px;color:${C.muted};text-decoration:none;margin-right:14px;">Aide</a>
        <a href="${p.unsubscribeUrl}" style="font-family:${F};font-size:12px;color:${C.muted};text-decoration:underline;">Se désabonner</a>
      </td></tr>
      <tr><td style="padding:14px 28px 20px;border-top:1px solid ${C.border};font-family:${F};font-size:11.5px;color:${C.dim};line-height:1.6;">
        Vous recevez cet e-mail parce que vous êtes inscrit sur Terex.
        <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
