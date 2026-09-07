/**
 * Self-contained crypto coin icons for the Academy.
 *
 * Every logo is inline SVG with the coin's real brand colour, so they render
 * instantly, work offline, and never depend on an external image host (the
 * app's egress blocks icon CDNs anyway). Each coin is a brand-coloured disc
 * with a white mark — the geometric logos (ETH, BNB, SOL, POL) are drawn as
 * faithful paths; the letter-marks (BTC ₿, USDT ₮, USDC $, TRX) use a bold
 * glyph. Together they read as one coherent coin set.
 *
 * Two entry points:
 *   <CoinIcon sym="btc" size={20} />        inline, next to a word
 *   <CoinBadge sym="btc" label="…" />       block-level hero chip
 */

export type CoinSym =
  | 'btc' | 'eth' | 'usdt' | 'usdc' | 'bnb' | 'sol' | 'trx' | 'pol' | 'ton' | 'xrp';

type CoinDef = { name: string; ticker: string; bg: string; glyph: (s: number) => JSX.Element };

const white = '#ffffff';

const COINS: Record<CoinSym, CoinDef> = {
  btc: {
    name: 'Bitcoin', ticker: 'BTC', bg: '#F7931A',
    glyph: (s) => (
      <text x="16" y="22.5" textAnchor="middle" fontSize={s * 0.62} fontWeight={700}
        fill={white} fontFamily="Georgia, 'Times New Roman', serif">₿</text>
    ),
  },
  eth: {
    name: 'Ethereum', ticker: 'ETH', bg: '#627EEA',
    glyph: () => (
      <g fill={white}>
        <path d="M16 4 L16 12.9 L23.4 16.2 Z" opacity="0.75" />
        <path d="M16 4 L8.6 16.2 L16 12.9 Z" />
        <path d="M16 21.6 L16 28 L23.5 17.6 Z" opacity="0.75" />
        <path d="M16 28 L16 21.6 L8.6 17.6 Z" />
        <path d="M16 20.2 L23.4 15.8 L16 12.5 Z" opacity="0.45" />
        <path d="M8.6 15.8 L16 20.2 L16 12.5 Z" opacity="0.9" />
      </g>
    ),
  },
  usdt: {
    name: 'Tether', ticker: 'USDT', bg: '#26A17B',
    glyph: (s) => (
      <text x="16" y="22.5" textAnchor="middle" fontSize={s * 0.62} fontWeight={700}
        fill={white} fontFamily="Georgia, 'Times New Roman', serif">₮</text>
    ),
  },
  usdc: {
    name: 'USD Coin', ticker: 'USDC', bg: '#2775CA',
    glyph: (s) => (
      <text x="16" y="22.5" textAnchor="middle" fontSize={s * 0.6} fontWeight={700}
        fill={white} fontFamily="Georgia, 'Times New Roman', serif">$</text>
    ),
  },
  bnb: {
    name: 'BNB', ticker: 'BNB', bg: '#F3BA2F',
    glyph: () => (
      <g fill={white}>
        <rect x="13.9" y="13.9" width="4.2" height="4.2" transform="rotate(45 16 16)" />
        <rect x="13.9" y="6.2" width="4.2" height="4.2" transform="rotate(45 16 8.3)" />
        <rect x="13.9" y="21.6" width="4.2" height="4.2" transform="rotate(45 16 23.7)" />
        <rect x="6.2" y="13.9" width="4.2" height="4.2" transform="rotate(45 8.3 16)" />
        <rect x="21.6" y="13.9" width="4.2" height="4.2" transform="rotate(45 23.7 16)" />
      </g>
    ),
  },
  sol: {
    name: 'Solana', ticker: 'SOL', bg: '#000000',
    glyph: () => (
      <g>
        <path d="M9 11.2 L23 11.2 L20.4 13.8 L6.4 13.8 Z" fill="#14F195" />
        <path d="M6.4 15.1 L20.4 15.1 L23 17.7 L9 17.7 Z" fill="#9945FF" />
        <path d="M9 19 L23 19 L20.4 21.6 L6.4 21.6 Z" fill="#14F195" />
      </g>
    ),
  },
  trx: {
    name: 'Tron', ticker: 'TRX', bg: '#EB0029',
    glyph: () => (
      <path d="M8 9 L24 12 L15 24 L11.5 13.2 L18.8 14 L10.2 10.8 Z" fill={white} opacity="0.95" />
    ),
  },
  pol: {
    name: 'Polygon', ticker: 'POL', bg: '#7B3FE4',
    glyph: () => (
      <path fill={white} fillRule="evenodd" clipRule="evenodd"
        d="M16 6 L24.5 11 L24.5 21 L16 26 L7.5 21 L7.5 11 Z M16 10 L11 13 L11 19 L16 22 L21 19 L21 13 Z" />
    ),
  },
  ton: {
    name: 'Toncoin', ticker: 'TON', bg: '#0098EA',
    glyph: () => (
      <path fill={white} d="M9 12 L23 12 L16 24 Z M16 13.6 L11.6 13.6 L15.2 20 Z M16 13.6 L20.4 13.6 L16.8 20 Z" />
    ),
  },
  xrp: {
    name: 'XRP', ticker: 'XRP', bg: '#23292F',
    glyph: () => (
      <g fill="none" stroke={white} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 10 L14 15 Q16 17 18 15 L23 10" />
        <path d="M9 22 L14 17 Q16 15 18 17 L23 22" />
      </g>
    ),
  },
};

export function coinName(sym: string): string | null {
  const c = COINS[sym as CoinSym];
  return c ? c.name : null;
}

/** Small inline coin logo. Sits on the text baseline next to a word. */
export function CoinIcon({ sym, size = 20 }: { sym: string; size?: number }) {
  const coin = COINS[sym as CoinSym];
  if (!coin) return null;
  return (
    <span style={{ display: 'inline-flex', verticalAlign: '-0.22em', margin: '0 1px' }} aria-label={coin.name}>
      <svg width={size} height={size} viewBox="0 0 32 32" role="img">
        <circle cx="16" cy="16" r="16" fill={coin.bg} />
        {coin.glyph(size)}
      </svg>
    </span>
  );
}

/**
 * Block-level coin badge — a bordered chip with the logo, the coin's name and
 * ticker, and an optional one-line tag. Used at the head of a coin's lesson.
 */
export function CoinBadge({
  sym, label, C, FONT,
}: {
  sym: string; label?: string;
  C: { l1: string; l2: string; bds: string; t1: string; t2: string; t3: string };
  FONT: string;
}) {
  const coin = COINS[sym as CoinSym];
  if (!coin) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '10px 16px 10px 10px', borderRadius: 999,
      background: C.l1, border: `1px solid ${C.bds}`, margin: '4px 0',
      maxWidth: '100%',
    }}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
        <svg width={38} height={38} viewBox="0 0 32 32" role="img" aria-label={coin.name}>
          <circle cx="16" cy="16" r="16" fill={coin.bg} />
          {coin.glyph(38)}
        </svg>
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{ color: C.t1, fontSize: 15, fontWeight: 500, fontFamily: FONT }}>{coin.name}</span>
          <span style={{ color: C.t3, fontSize: 11.5, fontWeight: 400, fontFamily: FONT, letterSpacing: '0.04em' }}>{coin.ticker}</span>
        </span>
        {label && (
          <span style={{ display: 'block', color: C.t2, fontSize: 12.5, fontWeight: 300, fontFamily: FONT, marginTop: 1, lineHeight: 1.4 }}>
            {label}
          </span>
        )}
      </span>
    </div>
  );
}

/** A horizontal row of small coin badges, for lessons that compare several. */
export function CoinRow({ syms, size = 30 }: { syms: string[]; size?: number }) {
  const valid = syms.filter(s => COINS[s as CoinSym]);
  if (valid.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '6px 0 2px' }}>
      {valid.map((s, i) => <CoinIcon key={i} sym={s} size={size} />)}
    </div>
  );
}
