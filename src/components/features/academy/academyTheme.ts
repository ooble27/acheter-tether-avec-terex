/**
 * Academy-only theming.
 *
 * The rest of the app is dark-only, but the Academy supports a light/dark
 * toggle. Rather than thread a palette object through every render helper,
 * we express the whole palette as **CSS custom properties** scoped to the
 * Academy root (`.ac-scope`). Every token below is a `var(--ac-…)` string,
 * so the same static objects resolve to different colours depending on the
 * `data-ac-theme` attribute on the wrapper — flipping the attribute reskins
 * the entire subtree instantly, with zero React re-render of children.
 *
 * The token names and shapes mirror `@/components/admin/adminTheme` so the
 * Academy components can swap their import path and keep every `C.xxx`,
 * `card`, `btnPrimary`, … usage unchanged.
 */

export const C = {
  bg:   'var(--ac-bg)',
  l1:   'var(--ac-l1)',
  l2:   'var(--ac-l2)',
  l3:   'var(--ac-l3)',
  l4:   'var(--ac-l4)',

  bds:  'var(--ac-bds)',
  bd:   'var(--ac-bd)',
  bdh:  'var(--ac-bdh)',

  accent:      'var(--ac-accent)',
  accentFg:    'var(--ac-accent-fg)',
  accentSoft:  'var(--ac-accent-soft)',
  accentBd:    'var(--ac-accent-bd)',
  accentHover: 'var(--ac-accent-hover)',

  t1:   'var(--ac-t1)',
  t2:   'var(--ac-t2)',
  t3:   'var(--ac-t3)',

  ok:   'var(--ac-ok)',

  // Subtle overlays — white-on-dark in dark mode, black-on-light in light mode.
  ov15: 'var(--ac-ov15)',
  ov2:  'var(--ac-ov2)',
  ov3:  'var(--ac-ov3)',
  ov4:  'var(--ac-ov4)',
  ov5:  'var(--ac-ov5)',
  ov6:  'var(--ac-ov6)',
} as const;

export const FONT = "'Poppins', system-ui, sans-serif";

export const numeric: React.CSSProperties = {
  fontFamily: FONT,
  fontVariantNumeric: 'tabular-nums',
};

export const sH: React.CSSProperties = {
  color: C.t3,
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  margin: 0,
  fontFamily: FONT,
};

export const card: React.CSSProperties = {
  background: C.l1,
  border: `1px solid ${C.bds}`,
  borderRadius: 14,
  overflow: 'hidden',
};

export const heroCard: React.CSSProperties = {
  background: 'var(--ac-hero-grad)',
  border: `1px solid ${C.bds}`,
  borderRadius: 16,
  padding: '30px 28px 26px',
  boxShadow: 'var(--ac-hero-shadow)',
};

export const cardHeaderRow: React.CSSProperties = {
  padding: '14px 18px',
  borderBottom: `1px solid ${C.bds}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const cardTitle: React.CSSProperties = {
  color: C.t1,
  fontSize: 13,
  fontWeight: 400,
  margin: 0,
  fontFamily: FONT,
};

export const btnPrimary: React.CSSProperties = {
  height: 36,
  paddingLeft: 18,
  paddingRight: 18,
  background: C.accent,
  border: 'none',
  borderRadius: 9,
  color: C.accentFg,
  fontSize: 12,
  fontWeight: 400,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: FONT,
  whiteSpace: 'nowrap',
  transition: 'background 0.15s',
};

export const btnGhost: React.CSSProperties = {
  height: 36,
  paddingLeft: 16,
  paddingRight: 16,
  background: 'transparent',
  border: `1px solid ${C.bd}`,
  borderRadius: 9,
  color: C.t2,
  fontSize: 12,
  fontWeight: 400,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: FONT,
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
};

export function primaryHoverIn(el: HTMLElement) { el.style.background = C.accentHover; }
export function primaryHoverOut(el: HTMLElement) { el.style.background = C.accent; }
export function ghostHoverIn(el: HTMLElement) { el.style.borderColor = C.accentBd; el.style.color = C.accent; }
export function ghostHoverOut(el: HTMLElement) { el.style.borderColor = C.bd; el.style.color = C.t2; }
export function listRowHoverIn(el: HTMLElement) { el.style.background = C.ov15; }
export function listRowHoverOut(el: HTMLElement) { el.style.background = 'transparent'; }

/**
 * The CSS that defines every `--ac-*` variable, for both themes. Injected once
 * inside the Academy root. Dark is the default (bare `.ac-scope`); light is
 * applied when the wrapper carries `data-ac-theme="light"`.
 */
export const ACADEMY_THEME_CSS = `
.ac-scope {
  --ac-bg: #1a1a1a;
  --ac-l1: #212121;
  --ac-l2: #282828;
  --ac-l3: #303030;
  --ac-l4: #383838;
  --ac-bds: #2a2a2a;
  --ac-bd: #383838;
  --ac-bdh: #484848;
  --ac-accent: #ffffff;
  --ac-accent-fg: #111111;
  --ac-accent-soft: rgba(255,255,255,0.08);
  --ac-accent-bd: rgba(255,255,255,0.20);
  --ac-accent-hover: #e8e8e8;
  --ac-t1: #f0f0f0;
  --ac-t2: #888888;
  --ac-t3: #565656;
  --ac-ok: #4ade80;
  --ac-ov15: rgba(255,255,255,0.015);
  --ac-ov2:  rgba(255,255,255,0.02);
  --ac-ov3:  rgba(255,255,255,0.03);
  --ac-ov4:  rgba(255,255,255,0.04);
  --ac-ov5:  rgba(255,255,255,0.05);
  --ac-ov6:  rgba(255,255,255,0.06);
  --ac-hero-grad: linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #1a1a1a 100%);
  --ac-hero-shadow: 0 4px 32px rgba(0,0,0,0.45);
}
.ac-scope[data-ac-theme="light"] {
  --ac-bg: #f5f6f8;
  --ac-l1: #ffffff;
  --ac-l2: #eef0f3;
  --ac-l3: #e4e7eb;
  --ac-l4: #d9dde2;
  --ac-bds: #e6e8ec;
  --ac-bd: #d6dae0;
  --ac-bdh: #c1c7cf;
  --ac-accent: #1a1c1f;
  --ac-accent-fg: #ffffff;
  --ac-accent-soft: rgba(0,0,0,0.05);
  --ac-accent-bd: rgba(0,0,0,0.18);
  --ac-accent-hover: #33363b;
  --ac-t1: #1a1c1f;
  --ac-t2: #5b636e;
  --ac-t3: #97a0ab;
  --ac-ok: #15a34a;
  --ac-ov15: rgba(0,0,0,0.02);
  --ac-ov2:  rgba(0,0,0,0.03);
  --ac-ov3:  rgba(0,0,0,0.04);
  --ac-ov4:  rgba(0,0,0,0.05);
  --ac-ov5:  rgba(0,0,0,0.07);
  --ac-ov6:  rgba(0,0,0,0.08);
  --ac-hero-grad: linear-gradient(135deg, #ffffff 0%, #f3f4f6 60%, #eef0f3 100%);
  --ac-hero-shadow: 0 4px 24px rgba(15,23,42,0.08);
}
`;

const STORAGE_KEY = 'terex-academy-theme';

export function loadAcademyTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveAcademyTheme(mode: 'dark' | 'light') {
  try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
}
