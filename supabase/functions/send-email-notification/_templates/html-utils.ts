// HTML email utilities — pure table-based, works in all email clients (Gmail, Apple Mail, Outlook)

export const C = {
  green:      '#3B968F',
  pageBg:     '#141414',
  cardBg:     '#141414',
  footerBg:   '#0e0e0e',
  infoBg:     '#0e0e0e',
  rowBg:      '#1a1a1a',
  border:     '#1f1f23',
  borderSoft: '#111111',
  text:       '#fafafa',
  textMuted:  '#71717a',
  textDim:    '#3f3f46',
  red:        '#f87171',
  amber:      '#fbbf24',
};

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const FM = `ui-monospace,SFMono-Regular,Menlo,'Courier New',monospace`;
const LOGO = `https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png`;
const BASE = `https://terangaexchange.com`;

const CSS = `
body,html{margin:0;padding:0;background-color:#141414 !important;}
@media (prefers-color-scheme:light){
  body,html,.ebg{background-color:#141414 !important;}
  .ecard{background-color:#141414 !important;}
  .efooter{background-color:#0e0e0e !important;}
  .ebar{background-color:#0e0e0e !important;}
  .einfo{background-color:#0e0e0e !important;border-color:#1f1f23 !important;}
  .erow{background-color:#1a1a1a !important;}
  .etxt{color:#fafafa !important;}
  .emuted{color:#71717a !important;}
  .edim{color:#3f3f46 !important;}
  .egreen{color:#3B968F !important;}
  .ered{color:#f87171 !important;}
  .eborder{border-color:#1f1f23 !important;}
}
@media only screen and (max-width:600px){
  .w600{width:100% !important;max-width:100% !important;}
  .mpad{padding:20px 16px !important;}
  .mpad-sm{padding:12px 16px !important;}
  .mh1{font-size:20px !important;line-height:1.3 !important;}
  .scol{display:block !important;width:100% !important;border-right:none !important;border-bottom:1px solid #1f1f23 !important;}
  .scol-last{border-bottom:none !important;}
  .irow td{padding:10px 12px !important;}
  .mhide{display:none !important;}
}
`;

// ─── Header ───────────────────────────────────────────────────────────────────
export function header(topRight = 'terangaexchange.com'): string {
  return `
<tr>
  <td class="ecard" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:16px 24px;border-bottom:1px solid ${C.borderSoft};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;">
          <img src="${LOGO}" width="22" height="22" alt="" style="display:inline-block;vertical-align:middle;border-radius:4px;margin-right:8px;border:0;">
          <span class="egreen" style="font-family:${F};font-size:13px;font-weight:700;letter-spacing:4px;color:${C.green};vertical-align:middle;">TEREX</span>
        </td>
        <td class="edim" style="vertical-align:middle;text-align:right;font-family:${F};font-size:10px;color:${C.textDim};">${topRight}</td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function footer(note = "Vous avez reçu cet email suite à une activité sur votre compte Terex."): string {
  const yr = new Date().getFullYear();
  return `
<tr>
  <td class="efooter" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};padding:24px;border-top:1px solid ${C.borderSoft};">
    <p class="edim" style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:3px;color:${C.textDim};margin:0 0 10px 0;">TEREX</p>
    <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};line-height:1.8;margin:0 0 4px 0;">${note}</p>
    <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};line-height:1.8;margin:0 0 12px 0;">© ${yr} Teranga Exchange — Tous droits réservés.</p>
    <p style="font-family:${F};font-size:11px;margin:0;">
      <a href="${BASE}/privacy" class="edim" style="color:${C.textDim};text-decoration:none;">Confidentialité</a><span class="edim" style="color:${C.textDim};"> · </span><a href="${BASE}/help" class="edim" style="color:${C.textDim};text-decoration:none;">Centre d'aide</a><span class="edim" style="color:${C.textDim};"> · </span><a href="${BASE}" class="edim" style="color:${C.textDim};text-decoration:none;">terangaexchange.com</a>
    </p>
  </td>
</tr>`;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
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
  <td class="ecard mpad" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:36px 24px 28px;">
    ${opts.iconHtml ? `<div style="margin-bottom:20px;">${opts.iconHtml}</div>` : ''}
    ${opts.eyebrow ? `<p class="egreen" style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.green};margin:0 0 14px 0;">${opts.eyebrow}</p>` : ''}
    ${opts.reference ? `<p class="edim" style="font-family:${FM};font-size:10px;color:${C.textDim};letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px 0;">${opts.reference}</p>` : ''}
    <h1 class="mh1 etxt" style="font-family:${F};font-size:24px;font-weight:600;color:${C.text};line-height:1.3;margin:0 0 8px 0;">${opts.title}</h1>
    ${opts.date ? `<p class="edim" style="font-family:${F};font-size:12px;color:${C.textDim};margin:0 0 8px 0;">${opts.date}</p>` : ''}
    ${opts.subtitle ? `<p class="emuted" style="font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.7;margin:8px 0 0 0;">${opts.subtitle}</p>` : ''}
  </td>
</tr>`;
}

// ─── Summary bar ──────────────────────────────────────────────────────────────
export function summaryBar(cols: Array<{ label: string; value: string; sub?: string; green?: boolean }>): string {
  const cells = cols.map((c, i) => `
    <td class="scol${i === cols.length - 1 ? ' scol-last' : ''} ebar" bgcolor="${C.footerBg}"
      style="background-color:${C.footerBg};padding:16px;vertical-align:top;width:${Math.floor(100/cols.length)}%;${i < cols.length - 1 ? `border-right:1px solid ${C.border};` : ''}">
      <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 6px 0;">${c.label}</p>
      <p class="${c.green ? 'egreen' : 'etxt'}" style="font-family:${F};font-size:17px;font-weight:600;color:${c.green ? C.green : C.text};margin:0;line-height:1.2;">${c.value}</p>
      ${c.sub ? `<p class="edim" style="font-family:${F};font-size:10px;color:${C.textDim};margin:3px 0 0 0;">${c.sub}</p>` : ''}
    </td>`).join('');
  return `
<tr>
  <td class="ebar" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>${cells}</tr>
    </table>
  </td>
</tr>`;
}

// ─── Info table ───────────────────────────────────────────────────────────────
export function infoTable(
  rows: Array<{ label: string; value: string; mono?: boolean; green?: boolean; big?: boolean; last?: boolean }>,
  title?: string
): string {
  const rowsHtml = rows.map(r => `
    <tr class="irow">
      <td class="emuted" style="padding:12px 16px;font-family:${F};font-size:12px;color:${C.textMuted};${r.last ? '' : `border-bottom:1px solid ${C.borderSoft};`}vertical-align:middle;width:42%;">${r.label}</td>
      <td class="${r.green ? 'egreen' : 'etxt'}" style="padding:12px 16px;font-family:${r.mono ? FM : F};font-size:${r.big ? '15px' : r.mono ? '11px' : '12px'};font-weight:${r.big ? 700 : 500};color:${r.green ? C.green : C.text};${r.last ? '' : `border-bottom:1px solid ${C.borderSoft};`}text-align:right;word-break:break-word;vertical-align:middle;">${r.value}</td>
    </tr>`).join('');
  return `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      ${title ? `<tr><td colspan="2" class="edim" style="padding:10px 16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">${title}</td></tr>` : ''}
      ${rowsHtml}
    </table>
  </td>
</tr>`;
}

// ─── Notice box ───────────────────────────────────────────────────────────────
export function noticeBox(text: string, tone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral'): string {
  const s = {
    neutral: { bg: C.rowBg,    border: C.border,                    color: C.textMuted },
    warning: { bg: '#1f1a08',  border: '#3a2f0f',                   color: '#f4d77a'   },
    danger:  { bg: '#1f0d0e',  border: '#3a1517',                   color: '#fca5a5'   },
    success: { bg: '#0b1f1e',  border: 'rgba(59,150,143,0.25)',     color: C.text      },
  }[tone];
  return `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 16px;background-color:${s.bg};border:1px solid ${s.border};border-radius:8px;font-family:${F};font-size:12px;color:${s.color};line-height:1.7;">${text}</td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
export function ctaButton(text: string, href: string): string {
  return `
<tr>
  <td align="center" style="padding:0 24px 32px;">
    <a href="${href}" style="display:inline-block;background-color:${C.green};color:#ffffff;font-family:${F};font-size:13px;font-weight:600;padding:13px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">${text}</a>
  </td>
</tr>`;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function sectionLabel(text: string): string {
  return `
<tr>
  <td style="padding:0 24px 12px;">
    <p class="edim" style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0;">${text}</p>
  </td>
</tr>`;
}

// ─── Spacer ───────────────────────────────────────────────────────────────────
export function spacer(h = 24): string {
  return `<tr><td style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

// ─── Status badge (inline HTML for topRight) ─────────────────────────────────
export function statusBadge(text: string, tone: 'success' | 'warning' | 'danger' | 'neutral' = 'success'): string {
  const m = {
    success: { c: C.green,    bg: 'rgba(59,150,143,0.1)', b: 'rgba(59,150,143,0.25)' },
    warning: { c: C.amber,    bg: '#1f1a08',              b: '#3a2f0f'               },
    danger:  { c: C.red,      bg: '#1f0d0e',              b: '#3a1517'               },
    neutral: { c: C.textMuted,bg: C.rowBg,                b: C.border                },
  }[tone];
  return `<span style="font-family:${F};font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${m.c};background:${m.bg};padding:3px 10px;border-radius:20px;border:1px solid ${m.b};">${text}</span>`;
}

// ─── Dot badge (amber/red with dot) ──────────────────────────────────────────
export function dotBadge(text: string, color: string): string {
  return `<span style="font-family:${F};font-size:10px;font-weight:700;color:${color};"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${color};margin-right:5px;vertical-align:middle;"></span>${text}</span>`;
}

// ─── Check ring ───────────────────────────────────────────────────────────────
export function checkRing(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:50px;height:50px;border-radius:50%;border:1.5px solid ${C.green};text-align:center;vertical-align:middle;font-size:22px;color:${C.green};line-height:50px;">✓</td></tr></table>`;
}

// ─── Alert ring ───────────────────────────────────────────────────────────────
export function alertRing(sym = '!', color = C.red): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:50px;height:50px;border-radius:50%;border:1.5px solid ${color};text-align:center;vertical-align:middle;font-size:20px;color:${color};line-height:50px;font-weight:700;">${sym}</td></tr></table>`;
}

// ─── Steps list ───────────────────────────────────────────────────────────────
export function steps(items: Array<{ text: string; done?: boolean }>): string {
  const rows = items.map((s, i) => `
    <tr>
      <td style="width:32px;padding:10px 0;vertical-align:top;">
        <div style="width:22px;height:22px;border-radius:50%;background:${s.done ? C.green : C.rowBg};border:${s.done ? 'none' : `1px solid ${C.border}`};color:${s.done ? '#fff' : C.textDim};font-size:10px;font-weight:700;text-align:center;line-height:22px;font-family:${F};">${i + 1}</div>
      </td>
      <td style="padding:10px 0;vertical-align:top;${i < items.length - 1 ? `border-bottom:1px solid ${C.borderSoft};` : ''}">
        <p class="${s.done ? 'etxt' : 'edim'}" style="font-family:${F};font-size:13px;line-height:1.5;color:${s.done ? C.text : C.textDim};margin:0;">${s.text}</p>
      </td>
    </tr>`).join('');
  return `
<tr>
  <td style="padding:0 24px 28px;">
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
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" align="center" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;padding:28px 24px;">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.textDim};margin:0 0 8px 0;">Code de vérification</p>
          <p class="etxt" style="font-family:${FM};font-size:36px;font-weight:500;letter-spacing:10px;color:${C.text};margin:8px 0;line-height:1;">${code}</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:8px 0 0 0;">Expire dans <span style="color:${C.red};">10 minutes</span></p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Link box ─────────────────────────────────────────────────────────────────
export function linkBox(url: string): string {
  const display = url.length > 55 ? url.slice(0, 55) + '...' : url;
  return `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:8px;padding:12px 16px;">
          <a href="${url}" class="emuted" style="font-family:${FM};font-size:10px;color:${C.textMuted};text-decoration:none;word-break:break-all;">${display}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Divider line ─────────────────────────────────────────────────────────────
export function divider(): string {
  return `<tr><td style="height:1px;background-color:${C.borderSoft};font-size:1px;line-height:1px;">&nbsp;</td></tr>`;
}

// ─── Main wrapper ─────────────────────────────────────────────────────────────
export function wrapEmail(preview: string, rows: string, topRightHtml = 'terangaexchange.com', footerNote?: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${preview}</title>
<style type="text/css">${CSS}</style>
</head>
<body bgcolor="${C.pageBg}" style="margin:0;padding:0;background-color:${C.pageBg};">
<!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${C.pageBg}" style="background-color:${C.pageBg};">
<tr><td align="center" style="padding:0;">
<table class="w600" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="${C.cardBg}" style="max-width:600px;width:100%;background-color:${C.cardBg};">
${header(topRightHtml)}
${rows}
${footer(footerNote)}
</table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}
