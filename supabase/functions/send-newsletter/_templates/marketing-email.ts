// Template email MARKETING Terex — même design system que les emails
// transactionnels : sombre neutre, accent blanc, valeurs « presque pures »
// (jamais #fff/#000 : Gmail inverse mal les valeurs pures), logo, CTA blanc,
// et pied de page avec lien de désabonnement obligatoire.

const C = {
  pageBg: '#141414', cardBg: '#1a1a1a', footerBg: '#161616', infoBg: '#1e1e1e',
  border: '#2c2c2c', borderSoft: '#202020',
  text: '#f5f5f5', muted: '#a1a1a1', dim: '#6e6e6e',
  accent: '#f4f4f4', accentText: '#191919',
};
const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const LOGO = 'https://terangaexchange.com/terex-icon.png';
const BASE = 'https://terangaexchange.com';

const CSS = `
:root{color-scheme:dark !important;supported-color-schemes:dark !important;}
html,body{margin:0;padding:0;background-color:${C.pageBg} !important;color:${C.text} !important;-webkit-text-size-adjust:100%;color-scheme:dark !important;}
.etxt{color:${C.text};} .emuted{color:${C.muted};} .edim{color:${C.dim};}
@media (prefers-color-scheme:light){
  html,body,.ebg{background-color:${C.pageBg} !important;}
  .ecard{background-color:${C.cardBg} !important;} .efooter{background-color:${C.footerBg} !important;}
  .einfo{background-color:${C.infoBg} !important;border-color:${C.border} !important;}
  .etxt{color:${C.text} !important;} .emuted{color:${C.muted} !important;} .edim{color:${C.dim} !important;}
}
@media (prefers-color-scheme:dark){
  html,body,.ebg{background-color:${C.pageBg} !important;}
  .ecard{background-color:${C.cardBg} !important;} .efooter{background-color:${C.footerBg} !important;}
  .einfo{background-color:${C.infoBg} !important;border-color:${C.border} !important;}
  .etxt{color:${C.text} !important;} .emuted{color:${C.muted} !important;} .edim{color:${C.dim} !important;}
}
[data-ogsc] .ecard,[data-ogsb] .ecard{background-color:${C.cardBg} !important;}
[data-ogsc] .efooter,[data-ogsb] .efooter{background-color:${C.footerBg} !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{background-color:${C.infoBg} !important;}
[data-ogsc] .etxt,[data-ogsb] .etxt{color:${C.text} !important;}
[data-ogsc] .emuted,[data-ogsb] .emuted{color:${C.muted} !important;}
[data-ogsc] .edim,[data-ogsb] .edim{color:${C.dim} !important;}
@media only screen and (max-width:620px){
  .w600{width:100% !important;max-width:100% !important;}
  .mpad{padding-left:22px !important;padding-right:22px !important;}
  .mh1{font-size:24px !important;}
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

  const paragraphsHtml = p.paragraphs
    .map(t => `<p class="emuted" style="font-family:${F};font-size:15px;color:${C.muted};line-height:1.75;margin:0 0 18px 0;">${escapeHtml(t)}</p>`)
    .join('');

  const highlightHtml = p.highlight ? `
      <tr><td class="mpad" style="padding:6px 40px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo"
          style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:16px;border-collapse:separate;border-spacing:0;">
          <tr><td style="padding:34px 24px;text-align:center;">
            <p class="emuted" style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.muted};margin:0 0 14px 0;">${escapeHtml(p.highlight.label)}</p>
            <p class="etxt" style="font-family:${F};font-size:46px;font-weight:800;letter-spacing:-0.03em;color:${C.text};margin:0;line-height:1;">${escapeHtml(p.highlight.value)}</p>
            ${p.highlight.sub ? `<p class="emuted" style="font-family:${F};font-size:13px;color:${C.muted};margin:14px 0 0 0;">${escapeHtml(p.highlight.sub)}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>` : '';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr" style="background-color:${C.pageBg};color-scheme:dark;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${escapeHtml(p.previewText)}</title>
<style type="text/css">${CSS}</style>
</head>
<body class="ebg" style="margin:0;padding:0;background-color:${C.pageBg};color-scheme:dark;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(p.previewText)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebg" style="background-color:${C.pageBg};">
<tr><td align="center" style="padding:24px 12px;">
<table class="w600 ecard" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
  style="max-width:600px;width:100%;background-color:${C.cardBg};border:1px solid ${C.border};border-radius:20px;overflow:hidden;">

  <!-- En-tête -->
  <tr><td class="ecard" style="background-color:${C.cardBg};padding:20px 28px;border-bottom:1px solid ${C.borderSoft};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;padding-right:11px;">
        <img src="${LOGO}" width="40" height="40" alt="Terex" style="display:block;width:40px;height:40px;border-radius:11px;border:1px solid ${C.border};">
      </td>
      <td style="vertical-align:middle;">
        <span class="emuted" style="font-family:${F};font-size:14px;font-weight:600;letter-spacing:0.02em;color:${C.muted};">Terex</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- Logo USDT — simple et propre -->
  <tr><td style="padding:38px 40px 0;text-align:center;">
    <img src="https://terangaexchange.com/email/usdt.png" width="72" height="72" alt="USDT"
      style="display:inline-block;width:72px;height:72px;border:0;">
  </td></tr>

  <!-- Titre -->
  <tr><td class="mpad" style="padding:22px 40px 10px;text-align:center;">
    <h1 class="mh1 etxt" style="font-family:${F};font-size:28px;font-weight:800;letter-spacing:-0.02em;color:${C.text};line-height:1.25;margin:0;">${escapeHtml(p.heroTitle)}</h1>
  </td></tr>

  <!-- Corps -->
  <tr><td class="mpad" style="padding:14px 40px 8px;">
    <p class="etxt" style="font-family:${F};font-size:15px;font-weight:600;color:${C.text};margin:0 0 14px 0;">${greeting}</p>
    ${paragraphsHtml}
  </td></tr>

  ${highlightHtml}

  <!-- CTA -->
  <tr><td class="mpad" style="padding:6px 40px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td align="center" style="background-color:${C.accent};border-radius:12px;">
        <a href="${p.ctaUrl}" style="display:block;background-color:${C.accent};color:${C.accentText};font-family:${F};font-size:14.5px;font-weight:700;padding:15px 24px;border-radius:12px;text-decoration:none;text-align:center;">${escapeHtml(p.ctaText)}&nbsp;&nbsp;&rarr;</a>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="height:24px;line-height:24px;font-size:1px;">&nbsp;</td></tr>

  <!-- Pied de page + désabonnement (obligatoire) -->
  <tr><td class="efooter" style="background-color:${C.footerBg};padding:26px 32px;border-top:1px solid ${C.borderSoft};">
    <p class="etxt" style="font-family:${F};font-size:15px;font-weight:700;letter-spacing:-0.02em;color:${C.text};margin:0 0 10px 0;">Terex</p>
    <p class="edim" style="font-family:${F};font-size:11.5px;color:${C.dim};line-height:1.7;margin:0 0 4px 0;">Achat, vente et transfert d'USDT au meilleur taux en Afrique de l'Ouest.</p>
    <p class="edim" style="font-family:${F};font-size:11.5px;color:${C.dim};line-height:1.7;margin:0 0 14px 0;">© ${new Date().getFullYear()} Teranga Exchange — Tous droits réservés.</p>
    <p style="font-family:${F};font-size:11.5px;margin:0;">
      <a href="${BASE}" class="emuted" style="color:${C.muted};text-decoration:none;">terangaexchange.com</a>
      <span class="edim" style="color:${C.dim};"> · </span>
      <a href="${BASE}/help" class="emuted" style="color:${C.muted};text-decoration:none;">Centre d'aide</a>
      <span class="edim" style="color:${C.dim};"> · </span>
      <a href="${p.unsubscribeUrl}" class="edim" style="color:${C.dim};text-decoration:underline;">Se désabonner</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
