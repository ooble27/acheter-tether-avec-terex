// Primitives email Terex — style Ooble : minimaliste, light mode forcé,
// typo système, palette monochrome sur fond gris clair / carte blanche.
//
// Toutes les signatures d'export sont conservées pour ne rien casser des
// templates existants (welcome, order-confirmation, etc.) ; c'est le rendu
// qui change : plus sobre, plus lisible, cohérent Gmail / Apple Mail / Outlook.

export const C = {
  // Blanc/accent d'emphase → devient l'encre foncée en light mode.
  green:      '#111111',
  white:      '#111111',
  accent:     '#111111',   // bouton principal : noir presque pur
  accentText: '#ffffff',
  pageBg:     '#f6f6f4',
  cardBg:     '#ffffff',
  footerBg:   '#ffffff',
  infoBg:     '#fafaf8',
  rowBg:      '#f6f6f4',
  border:     '#ececea',
  borderSoft: '#f0f0ee',
  text:       '#111111',
  textMuted:  '#4a4a47',
  textDim:    '#8a8a86',
  red:        '#c93030',
  amber:      '#a15c00',
};

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`;
const FM = `'SFMono-Regular',Consolas,Menlo,monospace`;
const LOGO_URL = `https://terangaexchange.com/terex-icon.png`;
const BASE = `https://terangaexchange.com`;

// ─── CSS commun ── LIGHT MODE FORCÉ (comme Ooble) ─────────────────────────────
const CSS = `
:root{color-scheme:light only;supported-color-schemes:light;}
html,body{margin:0;padding:0;background:#f6f6f4;color:#111;line-height:1.55;-webkit-text-size-adjust:100%;color-scheme:light only;}
a{color:#111;}
@media (prefers-color-scheme:dark){
  html,body,.ebg{background:#f6f6f4 !important;color:#111 !important;color-scheme:light !important;}
  .ecard{background:#ffffff !important;}
  .efooter{background:#ffffff !important;}
  .einfo{background:#fafaf8 !important;border-color:#ececea !important;}
  .etxt{color:#111 !important;} .emuted{color:#4a4a47 !important;} .edim{color:#8a8a86 !important;}
}
[data-ogsc] body,[data-ogsb] body{background:#f6f6f4 !important;color:#111 !important;}
[data-ogsc] .ecard,[data-ogsb] .ecard{background:#ffffff !important;}
[data-ogsc] .efooter,[data-ogsb] .efooter{background:#ffffff !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{background:#fafaf8 !important;border-color:#ececea !important;}
[data-ogsc] .etxt,[data-ogsb] .etxt{color:#111 !important;}
[data-ogsc] .emuted,[data-ogsb] .emuted{color:#4a4a47 !important;}
[data-ogsc] .edim,[data-ogsb] .edim{color:#8a8a86 !important;}
@media only screen and (max-width:620px){
  .w560{width:100% !important;max-width:100% !important;}
  .mpad{padding:24px 22px !important;}
  .mh1{font-size:20px !important;line-height:1.3 !important;}
  .scol{display:block !important;width:100% !important;box-sizing:border-box !important;border-right:none !important;border-bottom:1px solid #ececea !important;text-align:left !important;}
  .scol-last{border-bottom:none !important;}
}
`;

// ─── Header — juste « Terex » en lettres, sans image (moins d'échec Gmail) ────
export function header(right?: string): string {
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:22px 28px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;">
        <span style="font-family:${F};font-size:15px;letter-spacing:0.14em;text-transform:uppercase;color:${C.text};font-weight:500;">Terex</span>
      </td>
      ${right ? `<td style="vertical-align:middle;text-align:right;">${right}</td>` : ''}
    </tr></table>
  </td>
</tr>`;
}

// ─── Footer — coordonnées, liens, mentions ────────────────────────────────────
export function footer(note = "Vous recevez cet e-mail parce que vous avez un compte sur Terex."): string {
  const yr = new Date().getFullYear();
  return `
<tr>
  <td class="efooter" style="background:${C.footerBg};border-top:1px solid ${C.border};padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:18px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:top;padding-right:20px;">
            <div style="font-family:${F};font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:${C.text};font-weight:500;">Terex</div>
            <div style="font-family:${F};margin-top:6px;font-size:12px;color:${C.textMuted};">
              <a href="mailto:terangaexchange@gmail.com" style="color:${C.textMuted};text-decoration:none;">terangaexchange@gmail.com</a>
              &nbsp;·&nbsp;
              <a href="${BASE}" style="color:${C.textMuted};text-decoration:none;">terangaexchange.com</a>
            </div>
          </td>
          <td style="vertical-align:top;text-align:right;">
            <div style="font-family:${F};font-size:12px;color:${C.textMuted};">Teranga Exchange</div>
            <div style="font-family:${F};margin-top:4px;font-size:12px;color:${C.textMuted};">Dakar · Sénégal</div>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0 28px 16px;">
        <a href="${BASE}" style="font-family:${F};font-size:12px;color:${C.textMuted};text-decoration:none;margin-right:14px;">Site</a>
        <a href="${BASE}/help" style="font-family:${F};font-size:12px;color:${C.textMuted};text-decoration:none;margin-right:14px;">Aide</a>
        <a href="${BASE}/privacy" style="font-family:${F};font-size:12px;color:${C.textMuted};text-decoration:none;margin-right:14px;">Confidentialité</a>
        <a href="${BASE}/terms" style="font-family:${F};font-size:12px;color:${C.textMuted};text-decoration:none;">Conditions</a>
      </td></tr>
      <tr><td style="padding:14px 28px 20px;border-top:1px solid ${C.border};font-family:${F};font-size:11.5px;color:${C.textDim};line-height:1.6;">
        ${note}
        <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
      </td></tr>
    </table>
  </td>
</tr>`;
}

// ─── Hero — eyebrow + heading + sous-titre optionnels ─────────────────────────
export function hero(opts: {
  eyebrow?: string;
  reference?: string;
  title: string;
  date?: string;
  subtitle?: string;
  iconHtml?: string;
}): string {
  return `
<tr>
  <td class="ecard mpad" style="background:${C.cardBg};padding:26px 28px 6px;">
    ${opts.iconHtml ? `<div style="margin:0 0 18px;">${opts.iconHtml}</div>` : ''}
    ${opts.eyebrow ? `<p style="margin:0 0 8px;font-family:${F};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${opts.eyebrow}</p>` : ''}
    <h1 class="mh1" style="margin:0 0 12px;font-family:${F};font-size:22px;line-height:1.3;font-weight:500;letter-spacing:-0.01em;color:${C.text};">${opts.title}</h1>
    ${opts.subtitle ? `<p style="margin:0 0 6px;font-family:${F};font-size:15px;color:${C.textMuted};line-height:1.6;">${opts.subtitle}</p>` : ''}
    ${opts.date ? `<p style="margin:10px 0 0;font-family:${F};font-size:12px;color:${C.textDim};">${opts.date}</p>` : ''}
    ${opts.reference ? `<p style="margin:${opts.date ? '4px' : '10px'} 0 0;font-family:${FM};font-size:11px;color:${C.textDim};letter-spacing:0.3px;">${opts.reference}</p>` : ''}
  </td>
</tr>`;
}

// ─── Summary bar — colonnes en ligne ─────────────────────────────────────────
export function summaryBar(cols: Array<{ label: string; value: string; sub?: string; green?: boolean }>): string {
  const w = Math.floor(100 / cols.length);
  const cells = cols.map((c, i) => `
    <td class="scol${i === cols.length - 1 ? ' scol-last' : ''}" style="padding:16px 18px;vertical-align:top;width:${w}%;${i < cols.length - 1 ? `border-right:1px solid ${C.border};` : ''}">
      <p style="margin:0 0 6px;font-family:${F};font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${c.label}</p>
      <p style="margin:0;font-family:${F};font-size:17px;font-weight:500;letter-spacing:-0.01em;color:${C.text};line-height:1.2;">${c.value}</p>
      ${c.sub ? `<p style="margin:5px 0 0;font-family:${F};font-size:11px;color:${C.textDim};">${c.sub}</p>` : ''}
    </td>`).join('');
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:6px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background:${C.infoBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      <tr>${cells}</tr>
    </table>
  </td>
</tr>`;
}

// ─── Flow bar — de → vers (usage : montants source/destination) ──────────────
export function flowBar(
  from: { label: string; amount: string; sub?: string },
  to:   { label: string; amount: string; sub?: string },
  rate?: string
): string {
  const cell = (p: { label: string; amount: string; sub?: string }) => `
    <tr>
      <td style="padding:10px 0;">
        <p style="margin:0 0 4px;font-family:${F};font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${p.label}</p>
        <p style="margin:0;font-family:${F};font-size:17px;font-weight:500;color:${C.text};letter-spacing:-0.01em;">${p.amount}</p>
        ${p.sub ? `<p style="margin:4px 0 0;font-family:${F};font-size:11px;color:${C.textDim};">${p.sub}</p>` : ''}
      </td>
    </tr>`;
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:6px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background:${C.infoBg};border:1px solid ${C.border};border-radius:12px;">
      <tr><td style="padding:8px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${cell(from)}
          <tr><td style="padding:0 0 10px;"><div style="height:1px;background:${C.border};font-size:1px;line-height:1px;">&nbsp;</div></td></tr>
          ${cell(to)}
        </table>
      </td></tr>
      ${rate ? `<tr><td style="border-top:1px solid ${C.border};padding:11px 18px;">
        <table role="presentation" width="100%"><tr>
          <td style="font-family:${F};font-size:12px;color:${C.textMuted};">Taux appliqué</td>
          <td style="font-family:${F};font-size:12px;color:${C.text};text-align:right;">${rate}</td>
        </tr></table>
      </td></tr>` : ''}
    </table>
  </td>
</tr>`;
}

// ─── Info table — clé/valeur ──────────────────────────────────────────────────
export function infoTable(
  rows: Array<{ label: string; value: string; mono?: boolean; green?: boolean; big?: boolean; last?: boolean }>,
  title?: string
): string {
  const rowsHtml = rows.map((r, i) => {
    const isLast = r.last ?? (i === rows.length - 1);
    const under = isLast ? '' : `border-bottom:1px solid ${C.border};`;
    return `
      <tr>
        <td style="padding:11px 0;${under}font-family:${F};font-size:13px;color:${C.textDim};vertical-align:top;">${r.label}</td>
        <td style="padding:11px 0;${under}font-family:${r.mono ? FM : F};font-size:${r.mono ? '12.5px' : (r.big ? '15px' : '13.5px')};color:${C.text};text-align:right;vertical-align:top;word-break:break-word;font-weight:${r.big ? 600 : 400};">${r.value}</td>
      </tr>`;
  }).join('');
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:0 28px 20px;">
    ${title ? `<p style="margin:0 0 8px;font-family:${F};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${title}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.border};">
      ${rowsHtml}
    </table>
  </td>
</tr>`;
}

// ─── Notice box — encart d'alerte / rappel ────────────────────────────────────
export function noticeBox(text: string, tone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral'): string {
  const leftBorder = tone === 'warning' ? '3px solid ' + C.amber
                   : tone === 'danger' ? '3px solid ' + C.red
                   : tone === 'success' ? '3px solid ' + C.text
                   : '3px solid ' + C.text;
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:0 28px 20px;">
    <div style="background:${C.infoBg};border:1px solid ${C.border};border-left:${leftBorder};border-radius:6px;padding:12px 14px;font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.6;">${text}</div>
  </td>
</tr>`;
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
export function ctaButton(text: string, href: string): string {
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:6px 28px 22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td>
      <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${F};font-size:14px;font-weight:500;color:${C.accentText};background:${C.accent};text-decoration:none;border-radius:8px;">${text}</a>
    </td></tr></table>
  </td>
</tr>`;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function sectionLabel(text: string): string {
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:6px 28px 8px;">
    <p style="margin:0;font-family:${F};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${text}</p>
  </td>
</tr>`;
}

// ─── Spacer ───────────────────────────────────────────────────────────────────
export function spacer(h = 20): string {
  return `<tr><td class="ecard" style="background:${C.cardBg};height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function divider(): string {
  return `<tr><td class="ecard" style="background:${C.cardBg};padding:0 28px;"><div style="height:1px;background:${C.border};font-size:1px;line-height:1px;">&nbsp;</div></td></tr>`;
}

// ─── Status badge (inline) ────────────────────────────────────────────────────
export function statusBadge(text: string, tone: 'success' | 'warning' | 'danger' | 'neutral' = 'success'): string {
  const m = {
    success: { c: '#166534', bg: '#dcfce7', b: '#bbf7d0' },
    warning: { c: C.amber,   bg: '#fef3c7', b: '#fde68a' },
    danger:  { c: C.red,     bg: '#fee2e2', b: '#fecaca' },
    neutral: { c: C.textMuted, bg: C.infoBg, b: C.border  },
  }[tone];
  return `<span style="font-family:${F};font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:${m.c};background:${m.bg};padding:5px 11px;border-radius:999px;border:1px solid ${m.b};">${text}</span>`;
}

// ─── Dot badge — pastille avec point coloré ───────────────────────────────────
export function dotBadge(text: string, color: string): string {
  return `<span style="font-family:${F};font-size:11px;color:${C.textMuted};background:${C.infoBg};border:1px solid ${C.border};border-radius:999px;padding:5px 12px;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>${text}</span>`;
}

// ─── Check ring — badge succès ────────────────────────────────────────────────
export function checkRing(): string {
  return `<div style="width:56px;height:56px;border-radius:50%;background:${C.infoBg};border:1px solid ${C.border};text-align:center;line-height:56px;font-size:26px;color:${C.text};">&#10003;</div>`;
}

// ─── Alert ring ───────────────────────────────────────────────────────────────
export function alertRing(sym = '!', color = C.red): string {
  return `<div style="width:56px;height:56px;border-radius:50%;background:${C.infoBg};border:1.5px solid ${color};text-align:center;line-height:54px;font-size:24px;color:${color};font-weight:600;">${sym}</div>`;
}

// ─── Steps list — timeline ────────────────────────────────────────────────────
export function steps(items: Array<{ text: string; done?: boolean }>): string {
  const rows = items.map((s, i) => `
    <tr>
      <td style="width:26px;padding:0 0 ${i < items.length - 1 ? '14px' : '0'} 0;vertical-align:top;">
        <div style="width:22px;height:22px;border-radius:50%;background:${s.done ? C.accent : C.infoBg};border:${s.done ? 'none' : `1px solid ${C.border}`};color:${s.done ? C.accentText : C.textMuted};font-size:11px;font-weight:600;text-align:center;line-height:22px;font-family:${F};">${s.done ? '&#10003;' : i + 1}</div>
      </td>
      <td style="padding:0 0 ${i < items.length - 1 ? '14px' : '0'} 10px;vertical-align:top;">
        <p style="font-family:${F};font-size:13.5px;line-height:1.5;color:${C.text};margin:0;padding-top:1px;">${s.text}</p>
      </td>
    </tr>`).join('');
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:6px 28px 22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows}
    </table>
  </td>
</tr>`;
}

// ─── OTP Card ─────────────────────────────────────────────────────────────────
export function otpCard(code: string): string {
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:0 28px 22px;">
    <div class="einfo" style="background:${C.infoBg};border:1px solid ${C.border};border-radius:12px;padding:24px 20px;text-align:center;">
      <p style="margin:0 0 10px;font-family:${F};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">Code de vérification</p>
      <p style="margin:6px 0;font-family:${FM};font-size:34px;font-weight:600;letter-spacing:10px;color:${C.text};line-height:1;">${code}</p>
      <p style="margin:10px 0 0;font-family:${F};font-size:12px;color:${C.textDim};">Expire dans <span style="color:${C.red};">10 minutes</span></p>
    </div>
  </td>
</tr>`;
}

// ─── Link box ─────────────────────────────────────────────────────────────────
export function linkBox(url: string): string {
  const display = url.length > 55 ? url.slice(0, 55) + '...' : url;
  return `
<tr>
  <td class="ecard" style="background:${C.cardBg};padding:0 28px 22px;">
    <div class="einfo" style="background:${C.infoBg};border:1px solid ${C.border};border-radius:8px;padding:12px 14px;">
      <a href="${url}" style="font-family:${FM};font-size:11px;color:${C.textMuted};text-decoration:none;word-break:break-all;">${display}</a>
    </div>
  </td>
</tr>`;
}

// ─── Main wrapper ─────────────────────────────────────────────────────────────
export function wrapEmail(preview: string, rows: string, _topRightOrNote?: string, footerNote?: string): string {
  const topRight = _topRightOrNote && _topRightOrNote.includes('<') ? _topRightOrNote : undefined;
  const note = footerNote ?? (_topRightOrNote && !_topRightOrNote.includes('<') ? _topRightOrNote : undefined);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light only"/>
<meta name="supported-color-schemes" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${preview}</title>
<style>${CSS}</style>
</head>
<body class="ebg" style="margin:0;padding:0;background:${C.pageBg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.pageBg};">${preview}</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:${C.pageBg};">
<tr><td align="center" style="padding:28px 14px 40px;">
<table class="w560" role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:${C.cardBg};border-radius:14px;box-shadow:0 1px 0 rgba(0,0,0,0.02),0 12px 32px -12px rgba(20,20,20,0.08);overflow:hidden;">
${header(topRight)}
${rows}
${footer(note)}
</table>
</td></tr>
</table>
</body>
</html>`;
}

// Vestige LOGO (utilisé nulle part maintenant que le header est textuel)
export const LOGO = LOGO_URL;
