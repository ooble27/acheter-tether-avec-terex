// Terex Mail Studio — Design Tokens
// Source unique pour couleurs, typo, espacement dans tous les emails.
// Valeurs inline (pas de CSS vars — les clients email ne les supportent pas).
// Aligné sur le langage visuel de l'app : fond #1a1a1a, vert #3fd6a5, Poppins.

export const T = {
  // ── Surfaces ──────────────────────────────────────────────
  pageBg:     '#111111',
  cardBg:     '#1a1a1a',
  surfaceBg:  '#222222',
  elevatedBg: '#2a2a2a',

  // ── Texte ─────────────────────────────────────────────────
  text:          '#ffffff',
  textSecondary: '#a3a3a3',
  textMuted:     '#666666',
  textOnBrand:   '#111111',
  textOnWhite:   '#111111',

  // ── Marque ────────────────────────────────────────────────
  brand:        '#3fd6a5',
  brandDark:    '#2db88a',
  brandSurface: '#1a2e26',

  // ── Bordures ──────────────────────────────────────────────
  border:     '#2c2c2c',
  borderSoft: '#222222',

  // ── Sémantiques ───────────────────────────────────────────
  success: '#3fd6a5',
  warning: '#f59e0b',
  error:   '#ef4444',

  white: '#ffffff',
  black: '#000000',

  // ── Typo ──────────────────────────────────────────────────
  font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  fontMono: `'SFMono-Regular', Consolas, Menlo, monospace`,

  // ── Layout ────────────────────────────────────────────────
  maxWidth:     600,
  cardRadius:   16,
  blockRadius:  12,
  buttonRadius: 10,
  pillRadius:   999,

  // ── Espacement ────────────────────────────────────────────
  cardPadding:  32,
  blockPadding: 24,
  blockGap:     0,
} as const;

export const BASE_URL = 'https://terangaexchange.com';
export const LOGO_URL = 'https://terangaexchange.com/terex-icon.png';
export const SUPPORT_EMAIL = 'terangaexchange@gmail.com';
