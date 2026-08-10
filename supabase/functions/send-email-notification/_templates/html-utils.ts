// Primitives email Terex — copie littérale du layout Ooble (send-email/layout.ts).
// HTML PUR simple, aucune directive color-scheme forcée, aucun media query dark :
// Gmail adapte naturellement (fond blanc en clair, gris sombre en dark mode),
// exactement comme le fait Ooble.
//
// Les signatures d'export historiques (header, footer, hero, summaryBar, flowBar,
// infoTable, ctaButton, noticeBox, sectionLabel, spacer, divider, statusBadge,
// dotBadge, checkRing, alertRing, steps, otpCard, linkBox, wrapEmail, C, LOGO)
// sont conservées pour que les templates enfants (welcome, order-confirmation…)
// continuent de fonctionner sans modification — c'est le rendu qui change.

// ────────────────────────────────────────────────────────────
// Palette : couleurs SIMPLES que Gmail sait inverser proprement.
// Pas de valeur pure (jamais #fff / #000) forcée : #111 texte sur #ffffff carte
// sur #f6f6f4 body — que Gmail affiche light ou inverse en dark, ça reste lisible.
// ────────────────────────────────────────────────────────────
export const C = {
  green:      '#111',
  white:      '#111',
  accent:     '#111',
  accentText: '#fff',
  pageBg:     '#f6f6f4',
  cardBg:     '#ffffff',
  footerBg:   '#ffffff',
  infoBg:     '#f6f6f4',
  rowBg:      '#f0f0ed',
  border:     '#ececea',
  borderSoft: '#f0f0ee',
  text:       '#111',
  textMuted:  '#4a4a47',
  textDim:    '#8a8a86',
  red:        '#c93030',
  amber:      '#a15c00',
};

const F  = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const FM = `'SFMono-Regular', Consolas, Menlo, monospace`;
export const LOGO = `https://terangaexchange.com/terex-icon.png`;
const BASE = `https://terangaexchange.com`;

// ────────────────────────────────────────────────────────────
// PRIMITIVES DE CONTENU — chaque bloc est un morceau HTML autonome.
// Aucun bloc n'ouvre de <tr> : ils vivent tous dans une même colonne
// `.body` à l'intérieur de la carte (voir wrapEmail plus bas). C'est le
// même modèle que layout.ts d'Ooble : primitives → wrapCustomBody.
// ────────────────────────────────────────────────────────────

/** Chapeau discret au-dessus du titre. */
function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${text}</p>`;
}

/** Titre principal. */
function heading(text: string): string {
  return `<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:500;letter-spacing:-0.01em;color:${C.text};">${text}</h1>`;
}

/** Paragraphe d'intro. */
function lead(text: string): string {
  return `<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${C.textMuted};">${text}</p>`;
}

/** Table clé/valeur pour un récapitulatif. */
function dataRows(pairs: Array<[label: string, value: string, mono?: boolean, big?: boolean]>): string {
  const rows = pairs.map(([label, value, mono, big]) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.textDim};vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid ${C.border};font-size:${mono ? '12.5px' : big ? '15px' : '14px'};font-weight:${big ? 600 : 400};color:${C.text};text-align:right;vertical-align:top;word-break:break-word;${mono ? `font-family:${FM};` : ''}">${value}</td>
    </tr>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;border-top:1px solid ${C.border};">${rows}</table>`;
}

/** Bouton d'action principal — fond noir presque pur, texte blanc. */
function primaryButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px;"><tr><td>
    <a href="${href}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:500;color:${C.accentText};background:${C.accent};text-decoration:none;border-radius:8px;">${label}</a>
  </td></tr></table>`;
}

/** Encart de rappel / avertissement — simple carte grise, sans liseré. */
function notice(text: string): string {
  return `<div style="margin:16px 0;padding:14px 16px;background:${C.infoBg};border-radius:10px;font-size:13.5px;line-height:1.6;color:${C.textMuted};">${text}</div>`;
}

// ────────────────────────────────────────────────────────────
// SIGNATURES HISTORIQUES — enveloppes conservées pour ne pas casser
// les templates enfants existants (welcome, order-confirmation, etc.).
// Chaque enveloppe rend un <tr>…</tr> pour rester compatible avec
// l'appel wrapEmail(preview, rows) où `rows` est concaténé dans une
// grande table verticale. En interne : chaque enveloppe délègue aux
// primitives ci-dessus.
// ────────────────────────────────────────────────────────────

function bodyRow(inner: string): string {
  return `<tr><td style="padding:6px 28px;">${inner}</td></tr>`;
}

export function header(_right?: string): string {
  // Header intégré directement dans wrapEmail (comme Ooble).
  // Ce shim rend un <tr> vide pour compat au cas où un template l'inclut deux fois.
  return '';
}

export function footer(_note?: string): string {
  // Footer intégré directement dans wrapEmail (comme Ooble).
  return '';
}

export function hero(opts: {
  eyebrow?: string;
  reference?: string;
  title: string;
  date?: string;
  subtitle?: string;
  iconHtml?: string;
}): string {
  const parts: string[] = [];
  if (opts.iconHtml) parts.push(`<div style="margin:0 0 16px;">${opts.iconHtml}</div>`);
  if (opts.eyebrow) parts.push(eyebrow(opts.eyebrow));
  parts.push(heading(opts.title));
  if (opts.subtitle) parts.push(lead(opts.subtitle));
  if (opts.date) parts.push(`<p style="margin:6px 0 0;font-size:12px;color:${C.textDim};">${opts.date}</p>`);
  if (opts.reference) parts.push(`<p style="margin:${opts.date ? '4px' : '10px'} 0 12px;font-family:${FM};font-size:11px;color:${C.textDim};letter-spacing:0.3px;">${opts.reference}</p>`);
  return bodyRow(parts.join(''));
}

export function summaryBar(cols: Array<{ label: string; value: string; sub?: string; green?: boolean }>): string {
  const pairs: Array<[string, string, boolean?, boolean?]> = cols.map(c => [c.label, c.sub ? `${c.value}<br /><span style="font-size:11px;color:${C.textDim};font-weight:400;">${c.sub}</span>` : c.value, false, true]);
  return bodyRow(dataRows(pairs));
}

export function flowBar(
  from: { label: string; amount: string; sub?: string },
  to:   { label: string; amount: string; sub?: string },
  rate?: string
): string {
  const pairs: Array<[string, string, boolean?, boolean?]> = [
    [from.label, from.sub ? `${from.amount} <span style="color:${C.textDim};font-weight:400;font-size:12px;">· ${from.sub}</span>` : from.amount, false, true],
    [to.label,   to.sub   ? `${to.amount} <span style="color:${C.textDim};font-weight:400;font-size:12px;">· ${to.sub}</span>`   : to.amount,   false, true],
  ];
  if (rate) pairs.push(['Taux appliqué', rate]);
  return bodyRow(dataRows(pairs));
}

export function infoTable(
  rows: Array<{ label: string; value: string; mono?: boolean; green?: boolean; big?: boolean; last?: boolean }>,
  title?: string
): string {
  const pairs: Array<[string, string, boolean?, boolean?]> = rows.map(r => [r.label, r.value, r.mono, r.big]);
  const t = title ? `<p style="margin:0 0 8px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${title}</p>` : '';
  return bodyRow(t + dataRows(pairs));
}

export function noticeBox(text: string, _tone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral'): string {
  return bodyRow(notice(text));
}

export function ctaButton(text: string, href: string): string {
  return bodyRow(primaryButton(href, text));
}

export function sectionLabel(text: string): string {
  return bodyRow(`<p style="margin:8px 0 4px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">${text}</p>`);
}

export function spacer(h = 16): string {
  return `<tr><td style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

export function divider(): string {
  return bodyRow(`<div style="height:1px;background:${C.border};font-size:1px;line-height:1px;">&nbsp;</div>`);
}

export function statusBadge(text: string, tone: 'success' | 'warning' | 'danger' | 'neutral' = 'success'): string {
  const m = {
    success: { c: '#166534', bg: '#dcfce7' },
    warning: { c: C.amber,   bg: '#fef3c7' },
    danger:  { c: C.red,     bg: '#fee2e2' },
    neutral: { c: C.textMuted, bg: C.rowBg },
  }[tone];
  return `<span style="font-family:${F};font-size:11px;font-weight:500;letter-spacing:0.06em;color:${m.c};background:${m.bg};padding:4px 10px;border-radius:999px;">${text}</span>`;
}

export function dotBadge(text: string, color: string): string {
  return `<span style="font-family:${F};font-size:11px;color:${C.textMuted};background:${C.rowBg};border-radius:999px;padding:5px 11px;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>${text}</span>`;
}

export function checkRing(): string {
  return `<div style="width:52px;height:52px;border-radius:50%;background:${C.rowBg};text-align:center;line-height:52px;font-size:24px;color:${C.text};">&#10003;</div>`;
}

export function alertRing(sym = '!', color = C.red): string {
  return `<div style="width:52px;height:52px;border-radius:50%;border:1.5px solid ${color};text-align:center;line-height:50px;font-size:22px;color:${color};font-weight:600;">${sym}</div>`;
}

export function steps(items: Array<{ text: string; done?: boolean }>): string {
  const rows = items.map((s, i) => `
    <tr>
      <td style="width:26px;padding:0 0 ${i < items.length - 1 ? '12px' : '0'} 0;vertical-align:top;">
        <div style="width:22px;height:22px;border-radius:50%;background:${s.done ? C.accent : C.rowBg};color:${s.done ? C.accentText : C.text};font-size:11px;font-weight:600;text-align:center;line-height:22px;font-family:${F};">${s.done ? '&#10003;' : i + 1}</div>
      </td>
      <td style="padding:0 0 ${i < items.length - 1 ? '12px' : '0'} 10px;vertical-align:top;">
        <p style="font-family:${F};font-size:14px;line-height:1.5;color:${C.text};margin:0;">${s.text}</p>
      </td>
    </tr>`).join('');
  return bodyRow(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`);
}

export function otpCard(code: string): string {
  return bodyRow(`
    <div style="background:${C.rowBg};border-radius:10px;padding:22px 18px;text-align:center;">
      <p style="margin:0 0 10px;font-family:${F};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};">Code de vérification</p>
      <p style="margin:6px 0;font-family:${FM};font-size:30px;font-weight:600;letter-spacing:8px;color:${C.text};line-height:1;">${code}</p>
      <p style="margin:10px 0 0;font-family:${F};font-size:12px;color:${C.textDim};">Expire dans <span style="color:${C.red};">10 minutes</span></p>
    </div>`);
}

export function linkBox(url: string): string {
  const display = url.length > 60 ? url.slice(0, 60) + '…' : url;
  return bodyRow(`
    <div style="background:${C.rowBg};border-radius:8px;padding:11px 14px;">
      <a href="${url}" style="font-family:${FM};font-size:11px;color:${C.textMuted};text-decoration:none;word-break:break-all;">${display}</a>
    </div>`);
}

// ────────────────────────────────────────────────────────────
// WRAPPER — layout Terex calqué sur Ooble : HTML pur, aucun color-scheme
// forcé, aucune @media prefers-color-scheme. Gmail adapte naturellement :
// - en light : blanc lisible tel que défini
// - en dark  : Gmail inverse #f6f6f4 → gris sombre, #ffffff → gris légèrement
//              plus clair, #111 → blanc cassé → toujours lisible.
// C'est exactement le comportement des mails Ooble.
// ────────────────────────────────────────────────────────────
export function wrapEmail(preview: string, rows: string, _topRightOrNote?: string, footerNote?: string): string {
  const note = footerNote ?? (_topRightOrNote && !_topRightOrNote.includes('<') ? _topRightOrNote : undefined);
  const yr = new Date().getFullYear();
  // Tout est dans UNE SEULE table continue (pas de <div> qui casse le flux).
  // Résultat : Gmail voit un seul bloc du haut jusqu'au copyright, plus de
  // « trois points » ni de footer détaché en mode sombre.
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${preview}</title>
<style>
  body { margin: 0; background: ${C.pageBg}; font-family: ${F}; color: ${C.text}; line-height: 1.55; }
  a { color: ${C.text}; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px; }
  .brand-logo { display: inline-block; width: 28px; height: 28px; border-radius: 7px; vertical-align: middle; margin-right: 10px; border: 0; }
  .brand { display: inline-block; vertical-align: middle; font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.text}; font-weight: 500; }
  .foot-brand { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.text}; font-weight: 500; }
  .foot-link { color: ${C.textMuted}; text-decoration: none; margin-right: 14px; font-size: 12px; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.pageBg};">${preview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.pageBg};">
    <tr><td align="center" style="padding:32px 14px 40px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;background:${C.cardBg};border-radius:14px;box-shadow:0 1px 0 rgba(0,0,0,0.02),0 12px 32px -12px rgba(20,20,20,0.08);">

        <!-- Header : logo + brand -->
        <tr><td style="padding:22px 28px 12px;">
          <img class="brand-logo" src="${LOGO}" width="28" height="28" alt="Terex" />
          <span class="brand">Terex</span>
        </td></tr>

        <!-- Corps -->
        ${rows}

        <!-- Espace avant footer (pas de border-top qui casserait la carte) -->
        <tr><td style="padding:14px 28px 4px;">
          <div style="height:1px;background:${C.border};font-size:1px;line-height:1px;">&nbsp;</div>
        </td></tr>

        <!-- Footer : brand + contact -->
        <tr><td style="padding:14px 28px 4px;font-family:${F};font-size:12px;color:${C.textMuted};line-height:1.55;">
          <div class="foot-brand">Terex</div>
          <div style="margin-top:6px">
            <a href="mailto:terangaexchange@gmail.com" style="color:${C.textMuted};text-decoration:none;">terangaexchange@gmail.com</a>
            &nbsp;·&nbsp;
            <a href="${BASE}" style="color:${C.textMuted};text-decoration:none;">terangaexchange.com</a>
          </div>
        </td></tr>

        <!-- Footer : liens -->
        <tr><td style="padding:12px 28px 4px;font-family:${F};font-size:12px;">
          <a href="${BASE}" class="foot-link">Site</a>
          <a href="${BASE}/help" class="foot-link">Aide</a>
          <a href="${BASE}/privacy" class="foot-link">Confidentialité</a>
          <a href="${BASE}/terms" class="foot-link">Conditions</a>
        </td></tr>

        <!-- Footer : fine print (fin de la même carte, aucun border) -->
        <tr><td style="padding:14px 28px 24px;font-family:${F};font-size:11.5px;color:${C.textDim};line-height:1.6;">
          ${note ?? "Vous recevez cet e-mail parce que vous avez un compte sur Terex."}
          <br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
