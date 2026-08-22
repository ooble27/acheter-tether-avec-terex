// Terex Mail Studio — Block Library (v1)
// Chaque bloc est une fonction (props) → HTML string.
// Inline styles partout — les clients email ignorent <style> ou la clippent.
// Assemblés par le renderer (renderer.ts) dans l'ordre du JSON template.

import { T, BASE_URL, LOGO_URL, SUPPORT_EMAIL } from './tokens.ts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ════════════════════════════════════════════════════════════
// 01 · BrandHeader
// ════════════════════════════════════════════════════════════
export interface BrandHeaderProps {
  linkText?: string;
  linkUrl?: string;
}

export function BrandHeader(p: BrandHeaderProps = {}): string {
  const linkText = p.linkText ?? 'Se connecter';
  const linkUrl = p.linkUrl ?? BASE_URL;

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${T.cardBg};border-bottom:1px solid ${T.border};">
  <tr>
    <td style="padding:20px ${T.cardPadding}px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;">
            <img src="${LOGO_URL}" width="28" height="28" alt="Terex" style="display:inline-block;width:28px;height:28px;border-radius:7px;border:0;vertical-align:middle;" />
            <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:${T.font};font-size:15px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${T.text};">TEREX</span>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <a href="${linkUrl}" style="font-family:${T.font};font-size:13px;color:${T.textSecondary};text-decoration:none;border:1px solid ${T.border};padding:7px 16px;border-radius:${T.pillRadius}px;">${esc(linkText)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 02 · HeroImage
// ════════════════════════════════════════════════════════════
export interface HeroImageProps {
  src: string;
  alt?: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  height?: number;
}

export function HeroImage(p: HeroImageProps): string {
  const alt = p.alt ?? '';
  const h = p.height ?? 320;

  let overlay = '';
  if (p.overlayTitle) {
    overlay = `
    <div style="position:absolute;bottom:0;left:0;right:0;padding:${T.blockPadding}px ${T.cardPadding}px;background:linear-gradient(transparent, rgba(0,0,0,0.7));">
      <p style="margin:0 0 4px;font-family:${T.font};font-size:28px;font-weight:700;color:${T.white};line-height:1.15;letter-spacing:-0.02em;">${esc(p.overlayTitle)}</p>
      ${p.overlaySubtitle ? `<p style="margin:0;font-family:${T.font};font-size:15px;color:rgba(255,255,255,0.75);line-height:1.4;">${esc(p.overlaySubtitle)}</p>` : ''}
    </div>`;
  }

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0;position:relative;overflow:hidden;height:${h}px;background:${T.surfaceBg};">
      <!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${T.maxWidth}px;height:${h}px;"><v:fill type="frame" src="${p.src}" /><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true"><![endif]-->
      <div style="position:relative;min-height:${h}px;">
        <img src="${p.src}" alt="${esc(alt)}" width="${T.maxWidth}" style="display:block;width:100%;height:${h}px;object-fit:cover;border:0;" />
        ${overlay}
      </div>
      <!--[if mso]></v:textbox></v:rect><![endif]-->
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 03 · BigTitle
// ════════════════════════════════════════════════════════════
export interface BigTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function BigTitle(p: BigTitleProps): string {
  const align = p.align ?? 'left';

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:${T.blockPadding + 8}px ${T.cardPadding}px ${T.blockPadding}px;text-align:${align};">
      <h1 style="margin:0 0 ${p.subtitle ? '12' : '0'}px;font-family:${T.font};font-size:32px;font-weight:700;line-height:1.15;letter-spacing:-0.02em;color:${T.text};">${esc(p.title)}</h1>
      ${p.subtitle ? `<p style="margin:0;font-family:${T.font};font-size:16px;line-height:1.5;color:${T.textSecondary};">${esc(p.subtitle)}</p>` : ''}
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 04 · FeatureRow
// ════════════════════════════════════════════════════════════
export interface FeatureItem {
  icon?: string;
  title: string;
  text: string;
}

export interface FeatureRowProps {
  features: FeatureItem[];
  columns?: 2 | 3;
}

export function FeatureRow(p: FeatureRowProps): string {
  const cols = p.columns ?? Math.min(p.features.length, 3) as 2 | 3;
  const colWidth = Math.floor(100 / cols);

  const cells = p.features.slice(0, cols).map((f) => `
    <td style="width:${colWidth}%;padding:0 8px;vertical-align:top;">
      ${f.icon ? `<div style="margin-bottom:10px;font-size:28px;line-height:1;">${f.icon}</div>` : ''}
      <p style="margin:0 0 6px;font-family:${T.font};font-size:14px;font-weight:600;color:${T.text};line-height:1.3;">${esc(f.title)}</p>
      <p style="margin:0;font-family:${T.font};font-size:13px;color:${T.textSecondary};line-height:1.5;">${esc(f.text)}</p>
    </td>`).join('');

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:${T.blockPadding}px ${T.cardPadding - 8}px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>${cells}</tr>
      </table>
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 05 · CTAButton
// ════════════════════════════════════════════════════════════
export interface CTAButtonProps {
  text: string;
  url: string;
  style?: 'brand' | 'white' | 'outline';
  subtitle?: string;
  align?: 'left' | 'center';
}

export function CTAButton(p: CTAButtonProps): string {
  const s = p.style ?? 'brand';
  const align = p.align ?? 'center';

  const styles: Record<string, { bg: string; color: string; border: string }> = {
    brand:   { bg: T.brand, color: T.textOnBrand, border: T.brand },
    white:   { bg: T.white, color: T.textOnWhite, border: T.white },
    outline: { bg: 'transparent', color: T.text, border: T.border },
  };
  const st = styles[s];

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:${T.blockPadding}px ${T.cardPadding}px;text-align:${align};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" ${align === 'center' ? 'align="center"' : ''}>
        <tr>
          <td style="background:${st.bg};border:1px solid ${st.border};border-radius:${T.buttonRadius}px;">
            <a href="${p.url}" style="display:inline-block;padding:14px 32px;font-family:${T.font};font-size:15px;font-weight:600;color:${st.color};text-decoration:none;letter-spacing:-0.01em;">${esc(p.text)}</a>
          </td>
        </tr>
      </table>
      ${p.subtitle ? `<p style="margin:10px 0 0;font-family:${T.font};font-size:12px;color:${T.textMuted};line-height:1.4;">${esc(p.subtitle)}</p>` : ''}
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 06 · TransactionReceipt
// ════════════════════════════════════════════════════════════
export interface ReceiptLine {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}

export interface TransactionReceiptProps {
  title?: string;
  lines: ReceiptLine[];
  status?: { text: string; tone: 'success' | 'warning' | 'error' | 'neutral' };
}

export function TransactionReceipt(p: TransactionReceiptProps): string {
  const toneColors: Record<string, { color: string; bg: string }> = {
    success: { color: '#166534', bg: '#dcfce7' },
    warning: { color: '#92400e', bg: '#fef3c7' },
    error:   { color: '#991b1b', bg: '#fee2e2' },
    neutral: { color: T.textSecondary, bg: T.surfaceBg },
  };

  const rows = p.lines.map((l) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid ${T.border};font-family:${T.font};font-size:13px;color:${T.textMuted};vertical-align:top;">${esc(l.label)}</td>
      <td style="padding:11px 0;border-bottom:1px solid ${T.border};font-family:${l.mono ? T.fontMono : T.font};font-size:${l.mono ? '12.5' : '14'}px;font-weight:${l.bold ? 600 : 400};color:${T.text};text-align:right;vertical-align:top;word-break:break-all;">${esc(l.value)}</td>
    </tr>`).join('');

  const statusHtml = p.status ? (() => {
    const tc = toneColors[p.status!.tone];
    return `<div style="margin-bottom:14px;"><span style="font-family:${T.font};font-size:11px;font-weight:500;letter-spacing:0.06em;color:${tc.color};background:${tc.bg};padding:4px 12px;border-radius:${T.pillRadius}px;">${esc(p.status!.text)}</span></div>`;
  })() : '';

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:${T.blockPadding}px ${T.cardPadding}px;">
      <div style="background:${T.surfaceBg};border-radius:${T.blockRadius}px;padding:20px;">
        ${statusHtml}
        ${p.title ? `<p style="margin:0 0 12px;font-family:${T.font};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${T.textMuted};">${esc(p.title)}</p>` : ''}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${T.border};">
          ${rows}
        </table>
      </div>
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 07 · QuietDivider
// ════════════════════════════════════════════════════════════
export interface QuietDividerProps {
  spacing?: number;
}

export function QuietDivider(p: QuietDividerProps = {}): string {
  const sp = p.spacing ?? 8;
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:${sp}px ${T.cardPadding}px;">
      <div style="height:1px;background:${T.border};font-size:1px;line-height:1px;">&nbsp;</div>
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// 08 · Footer
// ════════════════════════════════════════════════════════════
export interface FooterProps {
  unsubscribeUrl?: string;
  note?: string;
}

export function Footer(p: FooterProps = {}): string {
  const yr = new Date().getFullYear();
  const note = p.note ?? 'Vous recevez cet e-mail parce que vous avez un compte sur Terex.';
  const uniq = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  const unsubLink = p.unsubscribeUrl
    ? `<a href="${p.unsubscribeUrl}" style="color:${T.textMuted};text-decoration:underline;text-underline-offset:2px;">Se désabonner</a>`
    : '';

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${T.border};">
  <tr>
    <td style="padding:22px ${T.cardPadding}px 16px;">
      <p style="margin:0 0 6px;font-family:${T.font};font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${T.text};">TEREX</p>
      <p style="margin:0;font-family:${T.font};font-size:12px;color:${T.textMuted};line-height:1.5;">
        <a href="mailto:${SUPPORT_EMAIL}" style="color:${T.textMuted};text-decoration:none;">${SUPPORT_EMAIL}</a> &nbsp;·&nbsp;
        <a href="${BASE_URL}" style="color:${T.textMuted};text-decoration:none;">terangaexchange.com</a>
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 ${T.cardPadding}px 16px;font-family:${T.font};font-size:12px;">
      <a href="${BASE_URL}" style="color:${T.textMuted};text-decoration:none;margin-right:14px;">Site</a>
      <a href="${BASE_URL}/help" style="color:${T.textMuted};text-decoration:none;margin-right:14px;">Aide</a>
      <a href="${BASE_URL}/privacy" style="color:${T.textMuted};text-decoration:none;margin-right:14px;">Confidentialité</a>
      ${unsubLink}
    </td>
  </tr>
  <tr>
    <td style="padding:0 ${T.cardPadding}px 22px;border-top:1px solid ${T.borderSoft};">
      <p style="margin:12px 0 0;font-family:${T.font};font-size:11px;color:${T.textMuted};line-height:1.5;">
        ${esc(note)}<br />&copy; ${yr} Teranga Exchange. Tous droits réservés.
        <span style="display:none;color:${T.pageBg};font-size:1px;line-height:1px;">Ref ${uniq}</span>
      </p>
    </td>
  </tr>
</table>`;
}

// ════════════════════════════════════════════════════════════
// Bonus utilitaires réutilisables par les blocs
// ════════════════════════════════════════════════════════════

export interface TextBlockProps {
  text: string;
  greeting?: string;
}

export function TextBlock(p: TextBlockProps): string {
  const paragraphs = p.text.split('\n\n').filter(Boolean);
  const html = paragraphs
    .map(t => `<p style="margin:0 0 14px;font-family:${T.font};font-size:15px;line-height:1.6;color:${T.textSecondary};">${esc(t)}</p>`)
    .join('');

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:4px ${T.cardPadding}px ${T.blockPadding}px;">
      ${p.greeting ? `<p style="margin:0 0 14px;font-family:${T.font};font-size:15px;font-weight:500;color:${T.text};">${esc(p.greeting)}</p>` : ''}
      ${html}
    </td>
  </tr>
</table>`;
}

export interface HighlightBoxProps {
  label: string;
  value: string;
  sub?: string;
}

export function HighlightBox(p: HighlightBoxProps): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:4px ${T.cardPadding}px ${T.blockPadding}px;">
      <div style="background:${T.surfaceBg};border-radius:${T.blockRadius}px;padding:22px 18px;text-align:center;">
        <p style="margin:0 0 10px;font-family:${T.font};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${T.textMuted};">${esc(p.label)}</p>
        <p style="margin:0;font-family:${T.font};font-size:32px;font-weight:600;letter-spacing:-0.02em;color:${T.text};line-height:1;">${esc(p.value)}</p>
        ${p.sub ? `<p style="margin:10px 0 0;font-family:${T.font};font-size:13px;color:${T.textSecondary};">${esc(p.sub)}</p>` : ''}
      </div>
    </td>
  </tr>
</table>`;
}

// Export de la map type → fonction pour le renderer
export const BLOCK_REGISTRY: Record<string, (props: any) => string> = {
  'brand-header':        BrandHeader,
  'hero-image':          HeroImage,
  'big-title':           BigTitle,
  'feature-row':         FeatureRow,
  'cta-button':          CTAButton,
  'transaction-receipt': TransactionReceipt,
  'quiet-divider':       QuietDivider,
  'footer':              Footer,
  'text':                TextBlock,
  'highlight-box':       HighlightBox,
};
