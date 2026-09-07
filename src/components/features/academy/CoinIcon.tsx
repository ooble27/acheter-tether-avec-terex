/**
 * Real crypto coin logos for the Academy.
 *
 * These are the official brand logos (from the spothq/cryptocurrency-icons
 * set), bundled into the app as local SVG assets — no hand-drawn shapes and
 * no external image host at runtime, so they load instantly and reliably in
 * the learner's browser. Each source SVG already carries the coin's coloured
 * disc and mark, so we render it as an <img> at the requested size.
 *
 * Entry points:
 *   <CoinIcon sym="btc" size={20} />        inline, next to a word
 *   <CoinBadge sym="btc" label="…" />       block-level hero chip
 *   <CoinRow syms={['btc','eth']} />         row of logos
 */

import btc from './coins/btc.svg';
import eth from './coins/eth.svg';
import usdt from './coins/usdt.svg';
import usdc from './coins/usdc.svg';
import bnb from './coins/bnb.svg';
import sol from './coins/sol.svg';
import trx from './coins/trx.svg';
import matic from './coins/matic.svg';
import xrp from './coins/xrp.svg';

type CoinDef = { name: string; ticker: string; src: string };

const COINS: Record<string, CoinDef> = {
  btc:  { name: 'Bitcoin',  ticker: 'BTC',  src: btc },
  eth:  { name: 'Ethereum', ticker: 'ETH',  src: eth },
  usdt: { name: 'Tether',   ticker: 'USDT', src: usdt },
  usdc: { name: 'USD Coin', ticker: 'USDC', src: usdc },
  bnb:  { name: 'BNB',      ticker: 'BNB',  src: bnb },
  sol:  { name: 'Solana',   ticker: 'SOL',  src: sol },
  trx:  { name: 'Tron',     ticker: 'TRX',  src: trx },
  // Polygon's ticker migrated MATIC → POL; the official logo is the same.
  pol:  { name: 'Polygon',  ticker: 'POL',  src: matic },
  matic:{ name: 'Polygon',  ticker: 'POL',  src: matic },
  xrp:  { name: 'XRP',      ticker: 'XRP',  src: xrp },
};

export function coinName(sym: string): string | null {
  const c = COINS[sym.toLowerCase()];
  return c ? c.name : null;
}

/** Small inline coin logo. Sits on the text baseline next to a word. */
export function CoinIcon({ sym, size = 20 }: { sym: string; size?: number }) {
  const coin = COINS[sym.toLowerCase()];
  if (!coin) return null;
  return (
    <img
      src={coin.src}
      alt={coin.name}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: '-0.22em', margin: '0 1px' }}
    />
  );
}

/**
 * Block-level coin badge — a bordered chip with the real logo, the coin's
 * name and ticker, and an optional one-line tag. Used at the head of a coin's
 * lesson.
 */
export function CoinBadge({
  sym, label, C, FONT,
}: {
  sym: string; label?: string;
  C: { l1: string; l2: string; bds: string; t1: string; t2: string; t3: string };
  FONT: string;
}) {
  const coin = COINS[sym.toLowerCase()];
  if (!coin) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '10px 16px 10px 10px', borderRadius: 999,
      background: C.l1, border: `1px solid ${C.bds}`, margin: '4px 0',
      maxWidth: '100%',
    }}>
      <img src={coin.src} alt={coin.name} width={38} height={38} style={{ flexShrink: 0, display: 'block' }} />
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

/** A horizontal row of coin logos, for lessons that compare several. */
export function CoinRow({ syms, size = 34 }: { syms: string[]; size?: number }) {
  const valid = syms.filter(s => COINS[s.toLowerCase()]);
  if (valid.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '6px 0 2px' }}>
      {valid.map((s, i) => <CoinIcon key={i} sym={s} size={size} />)}
    </div>
  );
}
