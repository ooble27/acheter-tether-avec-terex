// HTML email utilities — pure table-based, always-dark, works in Gmail / Apple Mail / Outlook

export const C = {
  green:      '#3B968F',
  pageBg:     '#0d0d0d',
  cardBg:     '#161616',
  footerBg:   '#0a0a0a',
  infoBg:     '#0d0d0d',
  rowBg:      '#1e1e1e',
  border:     '#2a2a2a',
  borderSoft: '#1d1d1d',
  text:       '#efefef',
  textMuted:  '#7a7a7a',
  textDim:    '#3d3d3d',
  red:        '#f87171',
  amber:      '#fbbf24',
};

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const FM = `ui-monospace,SFMono-Regular,Menlo,'Courier New',monospace`;
const LOGO = `https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png`;
const BASE = `https://terangaexchange.com`;

// ─── CSS — always dark, both light+dark system prefs, Gmail dark mode overrides ────────────
const CSS = `
/* force dark everywhere — color-scheme:only dark tells ALL clients not to transform */
:root{color-scheme:only dark !important;}
html,body{margin:0;padding:0;background-color:#0d0d0d !important;color:#efefef !important;-webkit-text-size-adjust:100%;color-scheme:only dark !important;}
/* light system → keep dark */
@media (prefers-color-scheme:light){
  html,body,.ebg{background-color:#0d0d0d !important;color-scheme:only dark !important;}
  .ecard{background-color:#161616 !important;}
  .efooter,.ebar{background-color:#0a0a0a !important;}
  .einfo{background-color:#0d0d0d !important;border-color:#2a2a2a !important;}
  .erow{background-color:#1e1e1e !important;}
  .etxt{color:#efefef !important;}
  .emuted{color:#7a7a7a !important;}
  .edim{color:#3d3d3d !important;}
  .egreen{color:#3B968F !important;}
  .ered{color:#f87171 !important;}
}
/* dark system → le fond sera blanc (Gmail l'inverse), on rend le texte sombre pour rester lisible */
@media (prefers-color-scheme:dark){
  html,body,.ebg{background-color:#0d0d0d !important;color-scheme:only dark !important;}
  .ecard{background-color:#161616 !important;}
  .efooter,.ebar{background-color:#0a0a0a !important;}
  .einfo{background-color:#0d0d0d !important;border-color:#2a2a2a !important;}
  .erow{background-color:#1e1e1e !important;}
  /* texte sombre → lisible même si Gmail inverse le fond en blanc */
  .etxt{color:#111111 !important;}
  .emuted{color:#333333 !important;}
  .edim{color:#555555 !important;}
  .egreen{color:#1f6b67 !important;}
  .ered{color:#b91c1c !important;}
}
/* Gmail Android dark mode [data-ogsc] — texte sombre pour fond blanc imposé par Gmail */
[data-ogsc] body,[data-ogsb] body{background-color:#0d0d0d !important;}
[data-ogsc] table,[data-ogsb] table{background-color:transparent !important;}
[data-ogsc] .ecard,[data-ogsb] .ecard{background-color:#161616 !important;}
[data-ogsc] .ebar,[data-ogsb] .ebar{background-color:#0a0a0a !important;}
[data-ogsc] .efooter,[data-ogsb] .efooter{background-color:#0a0a0a !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{background-color:#0d0d0d !important;}
[data-ogsc] .erow,[data-ogsb] .erow{background-color:#1e1e1e !important;}
[data-ogsc] .etxt,[data-ogsb] .etxt{color:#111111 !important;}
[data-ogsc] .emuted,[data-ogsb] .emuted{color:#333333 !important;}
[data-ogsc] .edim,[data-ogsb] .edim{color:#555555 !important;}
[data-ogsc] .egreen,[data-ogsb] .egreen{color:#1f6b67 !important;}
[data-ogsc] .ered,[data-ogsb] .ered{color:#b91c1c !important;}
/* Mobile */
@media only screen and (max-width:620px){
  .w600{width:100% !important;max-width:100% !important;}
  .mpad{padding:28px 20px !important;}
  .mpad-sm{padding:16px 20px !important;}
  .mh1{font-size:22px !important;line-height:1.35 !important;}
  .scol{display:block !important;width:100% !important;box-sizing:border-box !important;border-right:none !important;border-bottom:1px solid #2a2a2a !important;}
  .scol-last{border-bottom:none !important;}
  .irow td{padding:12px 16px !important;}
  .mfull{display:block !important;width:100% !important;box-sizing:border-box !important;}
  .mhide{display:none !important;}
}
`;

// ─── Header ─── clean TEREX only, no right text ───────────────────────────────
export function header(): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td class="ecard" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:20px 28px;border-bottom:1px solid ${C.borderSoft};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr bgcolor="${C.cardBg}">
        <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};vertical-align:middle;">
          <img src="${LOGO}" width="24" height="24" alt="" style="display:inline-block;vertical-align:middle;border-radius:5px;margin-right:10px;border:0;">
          <span class="egreen" style="font-family:${F};font-size:13px;font-weight:800;letter-spacing:5px;color:${C.green};vertical-align:middle;text-transform:uppercase;">TEREX</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function footer(note = "Vous avez reçu cet email suite à une activité sur votre compte Terex."): string {
  const yr = new Date().getFullYear();
  return `
<tr bgcolor="${C.footerBg}">
  <td class="efooter" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};padding:28px;border-top:1px solid ${C.borderSoft};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr bgcolor="${C.footerBg}">
        <td bgcolor="${C.footerBg}" style="background-color:${C.footerBg};">
          <p class="egreen" style="font-family:${F};font-size:11px;font-weight:800;letter-spacing:4px;color:${C.green};margin:0 0 12px 0;text-transform:uppercase;">TEREX</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};line-height:1.8;margin:0 0 4px 0;">${note}</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};line-height:1.8;margin:0 0 14px 0;">© ${yr} Teranga Exchange — Tous droits réservés.</p>
          <p style="font-family:${F};font-size:11px;margin:0;">
            <a href="${BASE}/privacy" class="edim" style="color:${C.textDim};text-decoration:none;">Confidentialité</a>
            <span class="edim" style="color:${C.textDim};"> · </span>
            <a href="${BASE}/help" class="edim" style="color:${C.textDim};text-decoration:none;">Aide</a>
            <span class="edim" style="color:${C.textDim};"> · </span>
            <a href="${BASE}" class="edim" style="color:${C.textDim};text-decoration:none;">terangaexchange.com</a>
          </p>
        </td>
      </tr>
    </table>
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
<tr bgcolor="${C.cardBg}">
  <td class="ecard mpad" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:40px 28px 32px;">
    ${opts.iconHtml ? `<div style="margin-bottom:22px;">${opts.iconHtml}</div>` : ''}
    ${opts.eyebrow ? `<p class="egreen" style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.green};margin:0 0 16px 0;">${opts.eyebrow}</p>` : ''}
    ${opts.reference ? `<p class="edim" style="font-family:${FM};font-size:10px;color:${C.textDim};letter-spacing:1px;text-transform:uppercase;margin:0 0 14px 0;">${opts.reference}</p>` : ''}
    <h1 class="mh1 etxt" style="font-family:${F};font-size:26px;font-weight:700;color:${C.text};line-height:1.3;margin:0 0 10px 0;">${opts.title}</h1>
    ${opts.date ? `<p class="edim" style="font-family:${F};font-size:12px;color:${C.textDim};margin:0 0 10px 0;">${opts.date}</p>` : ''}
    ${opts.subtitle ? `<p class="emuted" style="font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.75;margin:10px 0 0 0;">${opts.subtitle}</p>` : ''}
  </td>
</tr>`;
}

// ─── Summary bar (3 cols) ──────────────────────────────────────────────────────
export function summaryBar(cols: Array<{ label: string; value: string; sub?: string; green?: boolean }>): string {
  const w = Math.floor(100 / cols.length);
  const cells = cols.map((c, i) => `
    <td class="scol${i === cols.length - 1 ? ' scol-last' : ''} ebar" bgcolor="${C.footerBg}"
      style="background-color:${C.footerBg};padding:18px 20px;vertical-align:top;width:${w}%;${i < cols.length - 1 ? `border-right:1px solid ${C.border};` : ''}">
      <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0 0 7px 0;">${c.label}</p>
      <p class="${c.green ? 'egreen' : 'etxt'}" style="font-family:${F};font-size:18px;font-weight:700;color:${c.green ? C.green : C.text};margin:0;line-height:1.2;">${c.value}</p>
      ${c.sub ? `<p class="edim" style="font-family:${F};font-size:10px;color:${C.textDim};margin:4px 0 0 0;">${c.sub}</p>` : ''}
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

// ─── Flow bar (transaction arrow: from → to) ──────────────────────────────────
export function flowBar(
  from: { label: string; amount: string; sub?: string },
  to:   { label: string; amount: string; sub?: string },
  rate?: string
): string {
  return `
<tr>
  <td class="ebar" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>
        <td class="scol ebar" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};padding:22px 20px;vertical-align:middle;width:44%;border-right:1px solid ${C.border};">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0 0 7px 0;">${from.label}</p>
          <p class="etxt" style="font-family:${F};font-size:20px;font-weight:700;color:${C.text};margin:0;line-height:1.2;">${from.amount}</p>
          ${from.sub ? `<p class="edim" style="font-family:${F};font-size:10px;color:${C.textDim};margin:5px 0 0 0;">${from.sub}</p>` : ''}
        </td>
        <td class="mhide" style="padding:22px 12px;text-align:center;vertical-align:middle;width:12%;">
          <p class="egreen" style="font-family:${F};font-size:22px;font-weight:700;color:${C.green};margin:0;line-height:1;">→</p>
          ${rate ? `<p class="edim" style="font-family:${F};font-size:9px;color:${C.textDim};margin:5px 0 0 0;white-space:nowrap;">${rate}</p>` : ''}
        </td>
        <td class="scol scol-last ebar" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};padding:22px 20px;vertical-align:middle;width:44%;text-align:right;">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0 0 7px 0;text-align:right;">${to.label}</p>
          <p class="egreen" style="font-family:${F};font-size:20px;font-weight:700;color:${C.green};margin:0;line-height:1.2;text-align:right;">${to.amount}</p>
          ${to.sub ? `<p class="edim" style="font-family:${F};font-size:10px;color:${C.textDim};margin:5px 0 0 0;text-align:right;">${to.sub}</p>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Info table ───────────────────────────────────────────────────────────────
// ─── Info table ───────────────────────────────────────────────────────────────
export function infoTable(
  rows: Array<{ label: string; value: string; mono?: boolean; green?: boolean; big?: boolean; last?: boolean }>,
  title?: string
): string {
  const rowsHtml = rows.map(r => `
    <tr class="irow" bgcolor="${C.infoBg}">
      <td bgcolor="${C.infoBg}" class="emuted" style="background-color:${C.infoBg};padding:13px 18px;font-family:${F};font-size:12px;color:${C.textMuted};${r.last ? '' : `border-bottom:1px solid ${C.borderSoft};`}vertical-align:middle;width:44%;">${r.label}</td>
      <td bgcolor="${C.infoBg}" class="${r.green ? 'egreen' : 'etxt'}" style="background-color:${C.infoBg};padding:13px 18px;font-family:${r.mono ? FM : F};font-size:${r.big ? '15px' : r.mono ? '11px' : '12px'};font-weight:${r.big ? 700 : 500};color:${r.green ? C.green : C.text};${r.last ? '' : `border-bottom:1px solid ${C.borderSoft};`}text-align:right;word-break:break-word;vertical-align:middle;">${r.value}</td>
    </tr>`).join('');
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:12px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      ${title ? `<tr><td colspan="2" class="edim" style="padding:11px 18px;font-family:${F};font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">${title}</td></tr>` : ''}
      ${rowsHtml}
    </table>
  </td>
</tr>`;
}

// ─── Notice box ───────────────────────────────────────────────────────────────
export function noticeBox(text: string, tone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral'): string {
  const s = {
    neutral: { bg: C.rowBg,   border: C.border,              color: C.textMuted },
    warning: { bg: '#1f1a08', border: '#3a2f0f',             color: '#f4d77a'   },
    danger:  { bg: '#1f0d0e', border: '#3a1517',             color: '#fca5a5'   },
    success: { bg: '#0b1f1e', border: 'rgba(59,150,143,0.3)',color: C.text      },
  }[tone];
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background-color:${s.bg};border:1px solid ${s.border};border-radius:10px;font-family:${F};font-size:12px;color:${s.color};line-height:1.75;">${text}</td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
export function ctaButton(text: string, href: string): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" align="center" style="background-color:${C.cardBg};padding:4px 28px 36px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="${C.green}" style="background-color:${C.green};border-radius:9px;">
          <a href="${href}" style="display:inline-block;background-color:${C.green};color:#ffffff;font-family:${F};font-size:14px;font-weight:700;padding:15px 40px;border-radius:9px;text-decoration:none;letter-spacing:0.3px;">${text}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function sectionLabel(text: string): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 12px;">
    <p class="edim" style="font-family:${F};font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.textDim};margin:0;">${text}</p>
  </td>
</tr>`;
}

// ─── Spacer ───────────────────────────────────────────────────────────────────
export function spacer(h = 24): string {
  return `<tr bgcolor="${C.cardBg}"><td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function divider(): string {
  return `<tr><td style="height:1px;background-color:${C.borderSoft};font-size:1px;line-height:1px;">&nbsp;</td></tr>`;
}

// ─── Status badge (inline) ────────────────────────────────────────────────────
export function statusBadge(text: string, tone: 'success' | 'warning' | 'danger' | 'neutral' = 'success'): string {
  const m = {
    success: { c: C.green,    bg: 'rgba(59,150,143,0.12)', b: 'rgba(59,150,143,0.3)' },
    warning: { c: C.amber,    bg: '#1f1a08',               b: '#3a2f0f'              },
    danger:  { c: C.red,      bg: '#1f0d0e',               b: '#3a1517'              },
    neutral: { c: C.textMuted,bg: C.rowBg,                 b: C.border               },
  }[tone];
  return `<span style="font-family:${F};font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${m.c};background:${m.bg};padding:4px 10px;border-radius:20px;border:1px solid ${m.b};">${text}</span>`;
}

// ─── Dot badge ────────────────────────────────────────────────────────────────
export function dotBadge(text: string, color: string): string {
  return `<span style="font-family:${F};font-size:10px;font-weight:700;color:${color};"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${color};margin-right:5px;vertical-align:middle;"></span>${text}</span>`;
}

// ─── Check ring ───────────────────────────────────────────────────────────────
export function checkRing(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:52px;height:52px;border-radius:50%;border:2px solid ${C.green};text-align:center;vertical-align:middle;font-size:22px;color:${C.green};line-height:52px;font-weight:700;">✓</td></tr></table>`;
}

// ─── Alert ring ───────────────────────────────────────────────────────────────
export function alertRing(sym = '!', color = C.red): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:52px;height:52px;border-radius:50%;border:2px solid ${color};text-align:center;vertical-align:middle;font-size:22px;color:${color};line-height:52px;font-weight:700;">${sym}</td></tr></table>`;
}

// ─── Steps list ───────────────────────────────────────────────────────────────
export function steps(items: Array<{ text: string; done?: boolean }>): string {
  const rows = items.map((s, i) => `
    <tr>
      <td style="width:34px;padding:11px 0;vertical-align:top;">
        <div style="width:24px;height:24px;border-radius:50%;background:${s.done ? C.green : C.rowBg};border:${s.done ? 'none' : `1px solid ${C.border}`};color:${s.done ? '#fff' : C.textDim};font-size:10px;font-weight:700;text-align:center;line-height:24px;font-family:${F};">${i + 1}</div>
      </td>
      <td style="padding:11px 0;vertical-align:top;${i < items.length - 1 ? `border-bottom:1px solid ${C.borderSoft};` : ''}">
        <p class="${s.done ? 'etxt' : 'edim'}" style="font-family:${F};font-size:13px;line-height:1.55;color:${s.done ? C.text : C.textDim};margin:0;">${s.text}</p>
      </td>
    </tr>`).join('');
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows}
    </table>
  </td>
</tr>`;
}

// ─── OTP Card ─────────────────────────────────────────────────────────────────
export function otpCard(code: string): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" align="center" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:12px;padding:32px 24px;">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 10px 0;">Code de vérification</p>
          <p class="etxt" style="font-family:${FM};font-size:40px;font-weight:500;letter-spacing:12px;color:${C.text};margin:10px 0;line-height:1;">${code}</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:10px 0 0 0;">Expire dans <span style="color:${C.red};">10 minutes</span></p>
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
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 28px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:9px;padding:13px 16px;">
          <a href="${url}" class="emuted" style="font-family:${FM};font-size:10px;color:${C.textMuted};text-decoration:none;word-break:break-all;">${display}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Main wrapper — topRight param kept for backward compat but not rendered ──
export function wrapEmail(preview: string, rows: string, _topRightOrNote?: string, footerNote?: string): string {
  // If only 3 args and 3rd doesn't look like a badge/HTML, treat it as footerNote
  const note = footerNote ?? (_topRightOrNote && !_topRightOrNote.includes('<') ? _topRightOrNote : undefined);
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr" bgcolor="${C.pageBg}" style="background-color:${C.pageBg};color-scheme:only dark;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="only dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${preview}</title>
<style type="text/css">${CSS}</style>
</head>
<body class="ebg" bgcolor="${C.pageBg}" style="margin:0;padding:0;background-color:${C.pageBg};color-scheme:only dark;">
<!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${C.pageBg}" class="ebg" style="background-color:${C.pageBg};">
<tr><td align="center" style="padding:0;">
<table class="w600" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="${C.cardBg}" class="ecard" style="max-width:600px;width:100%;background-color:${C.cardBg};">
${header()}
${rows}
${footer(note)}
</table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}
