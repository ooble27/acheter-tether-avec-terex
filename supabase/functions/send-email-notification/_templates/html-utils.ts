// HTML email utilities — pure table-based, always-dark, works in Gmail / Apple Mail / Outlook

export const C = {
  // Accent neutre — blanc (aligné au design system du site, aucun vert)
  green:      '#ffffff',   // (clé conservée pour compat) = accent d'emphase blanc
  accent:     '#ffffff',
  accentText: '#141414',   // texte sur bouton blanc
  pageBg:     '#141414',
  cardBg:     '#1a1a1a',
  footerBg:   '#161616',
  infoBg:     '#1e1e1e',
  rowBg:      '#242424',
  border:     '#2c2c2c',
  borderSoft: '#202020',
  text:       '#f5f5f5',
  textMuted:  '#a1a1a1',
  textDim:    '#6e6e6e',
  red:        '#f87171',
  amber:      '#fbbf24',
};

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const FM = `ui-monospace,SFMono-Regular,Menlo,'Courier New',monospace`;
const LOGO = `https://terangaexchange.com/terex-icon.png`;
const BASE = `https://terangaexchange.com`;

// ─── CSS — always dark, both light+dark system prefs, Gmail dark mode overrides ────────────
const CSS = `
/* Surfaces toujours sombres, texte toujours clair — cohérent quel que soit le client */
:root{color-scheme:dark !important;supported-color-schemes:dark !important;}
html,body{margin:0;padding:0;background-color:#141414 !important;color:#f5f5f5 !important;-webkit-text-size-adjust:100%;color-scheme:dark !important;}
/* light system → on garde le thème sombre */
@media (prefers-color-scheme:light){
  html,body,.ebg{background-color:#141414 !important;color-scheme:dark !important;}
  .ecard{background-color:#1a1a1a !important;}
  .efooter,.ebar{background-color:#161616 !important;}
  .einfo{background-color:#1e1e1e !important;border-color:#2c2c2c !important;}
  .erow{background-color:#242424 !important;}
  .etxt{color:#f5f5f5 !important;}
  .emuted{color:#a1a1a1 !important;}
  .edim{color:#6e6e6e !important;}
  .egreen{color:#ffffff !important;}
  .ered{color:#f87171 !important;}
}
/* dark system → surfaces sombres forcées, texte clair (jamais de texte sombre sur carte sombre) */
@media (prefers-color-scheme:dark){
  html,body,.ebg{background-color:#141414 !important;color-scheme:dark !important;}
  .ecard{background-color:#1a1a1a !important;}
  .efooter,.ebar{background-color:#161616 !important;}
  .einfo{background-color:#1e1e1e !important;border-color:#2c2c2c !important;}
  .erow{background-color:#242424 !important;}
  .etxt{color:#f5f5f5 !important;}
  .emuted{color:#a1a1a1 !important;}
  .edim{color:#6e6e6e !important;}
  .egreen{color:#ffffff !important;}
  .ered{color:#f87171 !important;}
}
/* Gmail Android [data-ogsc] — on re-force surfaces sombres + texte clair après l'inversion Gmail */
[data-ogsc] body,[data-ogsb] body{background-color:#141414 !important;}
[data-ogsc] table,[data-ogsb] table{background-color:transparent !important;}
[data-ogsc] .ecard,[data-ogsb] .ecard{background-color:#1a1a1a !important;}
[data-ogsc] .ebar,[data-ogsb] .ebar{background-color:#161616 !important;}
[data-ogsc] .efooter,[data-ogsb] .efooter{background-color:#161616 !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{background-color:#1e1e1e !important;}
[data-ogsc] .erow,[data-ogsb] .erow{background-color:#242424 !important;}
[data-ogsc] .etxt,[data-ogsb] .etxt{color:#f5f5f5 !important;}
[data-ogsc] .emuted,[data-ogsb] .emuted{color:#a1a1a1 !important;}
[data-ogsc] .edim,[data-ogsb] .edim{color:#6e6e6e !important;}
[data-ogsc] .egreen,[data-ogsb] .egreen{color:#ffffff !important;}
[data-ogsc] .ered,[data-ogsb] .ered{color:#f87171 !important;}
[data-ogsc] .einfo,[data-ogsb] .einfo{border-color:#2c2c2c !important;}
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


// ─── Header ─── logo tile + wordmark + statut optionnel à droite ──────────────
export function header(right?: string): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td class="ecard" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:20px 28px;border-bottom:1px solid ${C.borderSoft};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;padding-right:11px;">
              <img src="${LOGO}" width="40" height="40" alt="Terex" style="display:block;width:40px;height:40px;border-radius:11px;border:1px solid ${C.border};">
            </td>
            <td style="vertical-align:middle;">
              <span class="etxt" style="font-family:${F};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${C.text};">Terex</span>
            </td>
          </tr></table>
        </td>
        ${right ? `<td class="mhide" style="vertical-align:middle;text-align:right;">${right}</td>` : ''}
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
  <td class="efooter" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};padding:28px 32px;border-top:1px solid ${C.borderSoft};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr bgcolor="${C.footerBg}">
        <td bgcolor="${C.footerBg}" style="background-color:${C.footerBg};">
          <p class="etxt" style="font-family:${F};font-size:15px;font-weight:700;letter-spacing:-0.02em;color:${C.text};margin:0 0 10px 0;">Terex</p>
          <p class="edim" style="font-family:${F};font-size:11.5px;color:${C.textDim};line-height:1.7;margin:0 0 4px 0;">${note}</p>
          <p class="edim" style="font-family:${F};font-size:11.5px;color:${C.textDim};line-height:1.7;margin:0 0 16px 0;">© ${yr} Teranga Exchange — Tous droits réservés.</p>
          <p style="font-family:${F};font-size:11.5px;margin:0;">
            <a href="${BASE}/privacy" class="emuted" style="color:${C.textMuted};text-decoration:none;">Confidentialité</a>
            <span class="edim" style="color:${C.textDim};"> · </span>
            <a href="${BASE}/help" class="emuted" style="color:${C.textMuted};text-decoration:none;">Centre d'aide</a>
            <span class="edim" style="color:${C.textDim};"> · </span>
            <a href="${BASE}" class="emuted" style="color:${C.textMuted};text-decoration:none;">terangaexchange.com</a>
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
  const centered = !!opts.iconHtml;
  const align = centered ? 'center' : 'left';
  return `
<tr bgcolor="${C.cardBg}">
  <td class="ecard mpad" bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:${centered ? '44px 32px 26px' : '40px 32px 28px'};text-align:${align};">
    ${opts.iconHtml ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 22px;"><tr><td>${opts.iconHtml}</td></tr></table>` : ''}
    ${opts.eyebrow ? `<p class="edim" style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.textDim};margin:0 0 16px 0;">${opts.eyebrow}</p>` : ''}
    <h1 class="mh1 etxt" style="font-family:${F};font-size:27px;font-weight:700;letter-spacing:-0.02em;color:${C.text};line-height:1.25;margin:0 0 12px 0;">${opts.title}</h1>
    ${opts.subtitle ? `<p class="emuted" style="font-family:${F};font-size:15px;color:${C.textMuted};line-height:1.65;margin:0;">${opts.subtitle}</p>` : ''}
    ${opts.date ? `<p class="edim" style="font-family:${F};font-size:12px;color:${C.textDim};margin:12px 0 0 0;">${opts.date}</p>` : ''}
    ${opts.reference ? `<p class="edim" style="font-family:${FM};font-size:10.5px;color:${C.textDim};letter-spacing:0.5px;margin:${opts.date ? '6px' : '12px'} 0 0 0;">${opts.reference}</p>` : ''}
  </td>
</tr>`;
}

// ─── Summary bar — carte arrondie, colonnes ────────────────────────────────────
export function summaryBar(cols: Array<{ label: string; value: string; sub?: string; green?: boolean }>): string {
  const w = Math.floor(100 / cols.length);
  const cells = cols.map((c, i) => `
    <td class="scol${i === cols.length - 1 ? ' scol-last' : ''}" style="padding:20px 22px;vertical-align:top;width:${w}%;${i < cols.length - 1 ? `border-right:1px solid ${C.border};` : ''}">
      <p class="edim" style="font-family:${F};font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 8px 0;">${c.label}</p>
      <p class="${c.green ? 'egreen' : 'etxt'}" style="font-family:${F};font-size:21px;font-weight:700;letter-spacing:-0.02em;color:${c.green ? C.white : C.text};margin:0;line-height:1.15;">${c.value}</p>
      ${c.sub ? `<p class="edim" style="font-family:${F};font-size:10.5px;color:${C.textDim};margin:6px 0 0 0;">${c.sub}</p>` : ''}
    </td>`).join('');
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:16px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>${cells}</tr>
    </table>
  </td>
</tr>`;
}

// ─── Flow bar — itinéraire « de → vers » relié par points (style reçu Lyft) ────
export function flowBar(
  from: { label: string; amount: string; sub?: string },
  to:   { label: string; amount: string; sub?: string },
  rate?: string
): string {
  const endpoint = (
    p: { label: string; amount: string; sub?: string },
    filled: boolean
  ) => `
        <tr>
          <td width="30" style="vertical-align:middle;padding:0;">
            <div style="width:13px;height:13px;border-radius:50%;background:${filled ? C.white : C.infoBg};border:2px solid ${filled ? C.white : C.textMuted};margin:0 auto;"></div>
          </td>
          <td style="vertical-align:middle;padding:0;">
            <p class="edim" style="font-family:${F};font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 3px 0;">${p.label}</p>
            <p class="${filled ? 'egreen' : 'etxt'}" style="font-family:${F};font-size:18px;font-weight:700;letter-spacing:-0.01em;color:${filled ? C.white : C.text};margin:0;line-height:1.15;">${p.amount}</p>
          </td>
          ${p.sub ? `<td style="vertical-align:middle;text-align:right;padding:0;"><p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:0;">${p.sub}</p></td>` : '<td></td>'}
        </tr>`;
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="einfo" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:16px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr><td style="padding:22px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${endpoint(from, false)}
          <tr><td width="30" style="padding:2px 0;text-align:center;"><div style="width:2px;height:22px;background:${C.border};margin:0 auto;"></div></td><td colspan="2"></td></tr>
          ${endpoint(to, true)}
        </table>
      </td></tr>
      ${rate ? `<tr><td style="border-top:1px solid ${C.border};padding:13px 22px;">
        <table role="presentation" width="100%"><tr>
          <td class="emuted" style="font-family:${F};font-size:12px;color:${C.textMuted};">Taux appliqué</td>
          <td class="etxt" style="font-family:${F};font-size:12px;font-weight:600;color:${C.text};text-align:right;">${rate}</td>
        </tr></table>
      </td></tr>` : ''}
    </table>
  </td>
</tr>`;
}

// ─── Info table — style « ticket » : lignes à filets fins, total en gras ──────
export function infoTable(
  rows: Array<{ label: string; value: string; mono?: boolean; green?: boolean; big?: boolean; last?: boolean }>,
  title?: string
): string {
  const rowsHtml = rows.map((r, i) => {
    const isLast = r.last ?? (i === rows.length - 1);
    // Une ligne « big » = total : filet de séparation au-dessus + gras.
    const totalTop = r.big ? `border-top:1px solid ${C.border};padding-top:15px;` : '';
    const under = isLast || r.big ? '' : `border-bottom:1px solid ${C.borderSoft};`;
    return `
    <tr class="irow">
      <td class="emuted" style="padding:12px 0;${totalTop}${under}font-family:${F};font-size:${r.big ? '15px' : '13px'};font-weight:${r.big ? 700 : 400};color:${r.big ? C.text : C.textMuted};vertical-align:middle;width:44%;">${r.label}</td>
      <td class="${r.green || r.big ? 'egreen' : 'etxt'}" style="padding:12px 0;${totalTop}${under}font-family:${r.mono ? FM : F};font-size:${r.big ? '15px' : r.mono ? '11.5px' : '13px'};font-weight:${r.big ? 700 : 500};color:${r.green || r.big ? C.white : C.text};text-align:right;word-break:break-word;vertical-align:middle;">${r.value}</td>
    </tr>`;
  }).join('');
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 26px;">
    ${title ? `<p class="edim" style="font-family:${F};font-size:9.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0 0 6px 2px;">${title}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rowsHtml}
    </table>
  </td>
</tr>`;
}

// ─── Notice box ───────────────────────────────────────────────────────────────
export function noticeBox(text: string, tone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral'): string {
  const s = {
    neutral: { bg: C.infoBg, border: C.border,               color: C.textMuted },
    warning: { bg: '#211a08', border: '#3a2f0f',             color: '#f4d77a'   },
    danger:  { bg: '#210d0e', border: '#3a1517',             color: '#fca5a5'   },
    success: { bg: C.infoBg, border: 'rgba(255,255,255,0.16)',color: C.text     },
  }[tone];
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:15px 18px;background-color:${s.bg};border:1px solid ${s.border};border-radius:12px;font-family:${F};font-size:12.5px;color:${s.color};line-height:1.7;">${text}</td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── CTA Button — pleine largeur ──────────────────────────────────────────────
export function ctaButton(text: string, href: string): string {
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:4px 32px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="${C.accent}" style="background-color:${C.accent};border-radius:12px;">
          <a href="${href}" style="display:block;background-color:${C.accent};color:${C.accentText};font-family:${F};font-size:14.5px;font-weight:700;padding:15px 24px;border-radius:12px;text-decoration:none;letter-spacing:0.2px;text-align:center;">${text}&nbsp;&nbsp;&rarr;</a>
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
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 12px;">
    <p class="edim" style="font-family:${F};font-size:9.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};margin:0;">${text}</p>
  </td>
</tr>`;
}

// ─── Spacer ───────────────────────────────────────────────────────────────────
export function spacer(h = 24): string {
  return `<tr bgcolor="${C.cardBg}"><td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function divider(): string {
  return `<tr bgcolor="${C.cardBg}"><td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px;"><div style="height:1px;background-color:${C.border};font-size:1px;line-height:1px;">&nbsp;</div></td></tr>`;
}

// ─── Status badge (inline) ────────────────────────────────────────────────────
export function statusBadge(text: string, tone: 'success' | 'warning' | 'danger' | 'neutral' = 'success'): string {
  const m = {
    success: { c: C.text,     bg: 'rgba(255,255,255,0.08)', b: 'rgba(255,255,255,0.18)' },
    warning: { c: C.amber,    bg: '#211a08',               b: '#3a2f0f'              },
    danger:  { c: C.red,      bg: '#210d0e',               b: '#3a1517'              },
    neutral: { c: C.textMuted,bg: C.rowBg,                 b: C.border               },
  }[tone];
  return `<span style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.5px;color:${m.c};background:${m.bg};padding:6px 12px;border-radius:999px;border:1px solid ${m.b};">${text}</span>`;
}

// ─── Dot badge — pastille avec point coloré ───────────────────────────────────
export function dotBadge(text: string, color: string): string {
  return `<span style="font-family:${F};font-size:11px;font-weight:600;color:${C.textMuted};background:rgba(255,255,255,0.05);border:1px solid ${C.border};border-radius:999px;padding:6px 12px;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>${text}</span>`;
}

// ─── Check ring ───────────────────────────────────────────────────────────────
export function checkRing(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:60px;height:60px;border-radius:50%;border:1.5px solid ${C.white};text-align:center;vertical-align:middle;font-size:26px;color:${C.white};line-height:58px;font-weight:400;">&#10003;</td></tr></table>`;
}

// ─── Alert ring ───────────────────────────────────────────────────────────────
export function alertRing(sym = '!', color = C.red): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:60px;height:60px;border-radius:50%;border:1.5px solid ${color};text-align:center;vertical-align:middle;font-size:24px;color:${color};line-height:58px;font-weight:700;">${sym}</td></tr></table>`;
}

// ─── Steps list — timeline ────────────────────────────────────────────────────
export function steps(items: Array<{ text: string; done?: boolean }>): string {
  const rows = items.map((s, i) => `
    <tr>
      <td style="width:30px;padding:0 0 ${i < items.length - 1 ? '18px' : '0'} 0;vertical-align:top;">
        <div style="width:22px;height:22px;border-radius:50%;background:${s.done ? C.accent : C.rowBg};border:${s.done ? 'none' : `1px solid ${C.border}`};color:${s.done ? C.accentText : C.textMuted};font-size:${s.done ? '11px' : '10px'};font-weight:${s.done ? 800 : 700};text-align:center;line-height:22px;font-family:${F};">${s.done ? '&#10003;' : i + 1}</div>
      </td>
      <td style="padding:0 0 ${i < items.length - 1 ? '18px' : '0'} 8px;vertical-align:top;">
        <p class="${s.done ? 'etxt' : 'emuted'}" style="font-family:${F};font-size:13.5px;line-height:1.4;color:${s.done ? C.text : C.textSoft};margin:0;padding-top:2px;">${s.text}</p>
      </td>
    </tr>`).join('');
  return `
<tr bgcolor="${C.cardBg}">
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:6px 32px 28px;">
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
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" align="center" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:16px;padding:34px 24px;">
          <p class="edim" style="font-family:${F};font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:${C.textDim};margin:0 0 12px 0;">Code de vérification</p>
          <p class="etxt" style="font-family:${FM};font-size:42px;font-weight:600;letter-spacing:12px;color:${C.text};margin:8px 0;line-height:1;">${code}</p>
          <p class="edim" style="font-family:${F};font-size:11.5px;color:${C.textDim};margin:12px 0 0 0;">Expire dans <span style="color:${C.red};">10 minutes</span></p>
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
  <td bgcolor="${C.cardBg}" style="background-color:${C.cardBg};padding:0 32px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="einfo" bgcolor="${C.infoBg}" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;padding:14px 16px;">
          <a href="${url}" class="emuted" style="font-family:${FM};font-size:10.5px;color:${C.textMuted};text-decoration:none;word-break:break-all;">${display}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ─── Main wrapper — le statut (3e arg HTML) s'affiche à droite de l'en-tête ────
export function wrapEmail(preview: string, rows: string, _topRightOrNote?: string, footerNote?: string): string {
  const topRight = _topRightOrNote && _topRightOrNote.includes('<') ? _topRightOrNote : undefined;
  const note = footerNote ?? (_topRightOrNote && !_topRightOrNote.includes('<') ? _topRightOrNote : undefined);
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr" bgcolor="${C.pageBg}" style="background-color:${C.pageBg};color-scheme:dark;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${preview}</title>
<style type="text/css">${CSS}</style>
</head>
<body class="ebg" bgcolor="${C.pageBg}" style="margin:0;padding:0;background-color:${C.pageBg};color-scheme:dark;">
<!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${C.pageBg}" class="ebg" style="background-color:${C.pageBg};">
<tr><td align="center" style="padding:24px 12px;">
<table class="w600" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="${C.cardBg}" style="max-width:600px;width:100%;background-color:${C.cardBg};border:1px solid ${C.border};border-radius:20px;overflow:hidden;">
${header(topRight)}
${rows}
${footer(note)}
</table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}
