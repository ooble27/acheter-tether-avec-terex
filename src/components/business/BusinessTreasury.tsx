import { useState, useCallback } from 'react';
import {
  QrCode, ArrowDownToLine, ArrowUpFromLine, Copy, Check,
  X, Bell, Trash2, Plus, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  CartesianGrid, XAxis, YAxis,
} from 'recharts';
import usdtLogo from '@/assets/usdt-logo.png';

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#565656',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── Données ───────────────────────────────────────────────────────
const WALLETS = [
  { id: 'trc20',   chain: 'TRC20',  network: 'TRON Network',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', usdt: 45230, address: 'T9xDRaWvH3qKZ1nM8bUoFpY5jL2wX6vRs' },
  { id: 'bep20',   chain: 'BEP20',  network: 'BNB Smart Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', usdt: 12450, address: '0x3A7b9c2D4E8F1a6B5C0D9E3F7a2B4C8D1E5F3A9' },
  { id: 'erc20',   chain: 'ERC20',  network: 'Ethereum',        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', usdt:  8100, address: '0xaB7c3D2E9F5a1C4B8D0E7F3a6C2D5E9F1B4A8C3' },
];

const RATES = [
  { pair: 'USDT / XOF', short: 'XOF', rate: 575.2,  change: +0.18 },
  { pair: 'USDT / EUR', short: 'EUR', rate: 0.9245, change: -0.06 },
  { pair: 'USDT / USD', short: 'USD', rate: 1.0000, change:  0.00 },
];

const TOTAL_USDT = WALLETS.reduce((s, w) => s + w.usdt, 0);
const TOTAL_XOF  = Math.round(TOTAL_USDT * 575.2);
const TOTAL_EUR  = Math.round(TOTAL_USDT * 0.9245);

function mkSpark(base: number, n = 24) {
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v += (Math.random() - 0.48) * base * 0.004;
    return { i, v: parseFloat(v.toFixed(4)) };
  });
}
const SPARKLINES = RATES.map(r => mkSpark(r.rate));

function mk30d() {
  let v = 0.935;
  return Array.from({ length: 31 }, (_, idx) => {
    v += (Math.random() - 0.48) * 0.005;
    return { day: `J-${30 - idx}`, rate: parseFloat(v.toFixed(4)) };
  });
}
const HISTORY = mk30d();

// ── SVG hero (gauche) — composition circulaire ────────────────────
function HeroArtwork() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none"
      style={{ flexShrink: 0, display: 'block' }}>
      {/* Anneaux concentriques */}
      <circle cx="110" cy="110" r="100" stroke="rgba(59,150,143,0.07)" strokeWidth="1"/>
      <circle cx="110" cy="110" r="78"  stroke="rgba(59,150,143,0.11)" strokeWidth="1" strokeDasharray="5 4"/>
      <circle cx="110" cy="110" r="55"  stroke="rgba(59,150,143,0.18)" strokeWidth="1.2"/>
      <circle cx="110" cy="110" r="32"  stroke="rgba(59,150,143,0.28)" strokeWidth="1.5" fill="rgba(59,150,143,0.05)"/>
      {/* Disque central */}
      <circle cx="110" cy="110" r="16"  fill="rgba(59,150,143,0.15)" stroke="rgba(59,150,143,0.4)" strokeWidth="1.5"/>
      <path d="M110 103 L110 117 M106 107 Q110 104 114 107 M106 113 Q110 116 114 113"
        stroke="rgba(59,150,143,0.8)" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Nœuds sur le grand anneau (r=78) — 12h, 4h, 8h */}
      <circle cx="110" cy="32"  r="5.5" fill="rgba(59,150,143,0.35)" stroke="rgba(59,150,143,0.55)" strokeWidth="1.2"/>
      <circle cx="178" cy="149" r="5.5" fill="rgba(59,150,143,0.30)" stroke="rgba(59,150,143,0.50)" strokeWidth="1.2"/>
      <circle cx="42"  cy="149" r="5.5" fill="rgba(59,150,143,0.30)" stroke="rgba(59,150,143,0.50)" strokeWidth="1.2"/>
      {/* Nœuds secondaires sur anneau r=55 */}
      <circle cx="151" cy="68"  r="3.5" fill="rgba(59,150,143,0.22)"/>
      <circle cx="110" cy="165" r="3.5" fill="rgba(59,150,143,0.22)"/>
      <circle cx="69"  cy="68"  r="3.5" fill="rgba(59,150,143,0.22)"/>
      {/* Lignes de connexion entre nœuds */}
      <line x1="110" y1="32"  x2="178" y2="149" stroke="rgba(59,150,143,0.07)" strokeWidth="0.8" strokeDasharray="3 3"/>
      <line x1="178" y1="149" x2="42"  y2="149" stroke="rgba(59,150,143,0.07)" strokeWidth="0.8" strokeDasharray="3 3"/>
      <line x1="42"  y1="149" x2="110" y2="32"  stroke="rgba(59,150,143,0.07)" strokeWidth="0.8" strokeDasharray="3 3"/>
      {/* Mini barres en bas à droite */}
      <rect x="155" y="175" width="5" height="22" rx="2.5" fill="rgba(59,150,143,0.15)"/>
      <rect x="163" y="168" width="5" height="29" rx="2.5" fill="rgba(59,150,143,0.22)"/>
      <rect x="171" y="172" width="5" height="25" rx="2.5" fill="rgba(59,150,143,0.18)"/>
      <rect x="179" y="165" width="5" height="32" rx="2.5" fill="rgba(59,150,143,0.28)"/>
      <rect x="187" y="170" width="5" height="27" rx="2.5" fill="rgba(59,150,143,0.20)"/>
      {/* Points décoratifs coins */}
      <circle cx="12"  cy="30"  r="2.5" fill="rgba(255,255,255,0.05)"/>
      <circle cx="20"  cy="40"  r="1.5" fill="rgba(255,255,255,0.04)"/>
      <circle cx="205" cy="25"  r="2"   fill="rgba(255,255,255,0.05)"/>
      <circle cx="198" cy="36"  r="1.5" fill="rgba(255,255,255,0.03)"/>
    </svg>
  );
}

function EmptyAlertSVG() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none"
      style={{ opacity: 0.22, display: 'block', margin: '0 auto 10px' }}>
      <path d="M28 8 C18 8 10 16 10 26 C10 34 16 40 24 43 L24 46 C24 48 26 50 28 50 C30 50 32 48 32 46 L32 43 C40 40 46 34 46 26 C46 16 38 8 28 8 Z"
        stroke={C.teal} strokeWidth="1.2" fill="none"/>
      <circle cx="28" cy="22" r="2" fill={C.teal}/>
      <path d="M28 27 L28 36" stroke={C.teal} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 10, margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>{payload[0].value}</p>
    </div>
  );
}

// ── Modal QR ──────────────────────────────────────────────────────
function QRModal({ wallet, onClose }: { wallet: typeof WALLETS[0]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(wallet.address).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [wallet.address]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#141414', border: `1px solid ${C.bd}`,
        borderRadius: 18, padding: 28, width: 360, maxWidth: '90vw',
        position: 'relative', fontFamily: FONT,
        boxShadow: '0 28px 70px rgba(0,0,0,0.6)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8,
          width: 30, height: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: C.t3, cursor: 'pointer',
        }}><X style={{ width: 14, height: 14 }} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <img src={wallet.logo} alt={wallet.chain}
            style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${C.bds}` }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div>
            <p style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Adresse {wallet.chain}</p>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>{wallet.network}</p>
          </div>
        </div>

        <div style={{
          width: 130, height: 130, borderRadius: 12,
          background: C.l2, border: `1px solid ${C.bd}`,
          margin: '0 auto 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <QrCode style={{ width: 52, height: 52, color: C.t3 }} />
          <p style={{ color: C.t3, fontSize: 9, margin: 0, fontFamily: MONO, letterSpacing: '0.1em' }}>QR CODE</p>
        </div>

        <div style={{
          background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10,
          padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: C.t2,
          wordBreak: 'break-all', lineHeight: 1.7, marginBottom: 12,
        }}>{wallet.address}</div>

        <button onClick={copy} style={{
          width: '100%', height: 40,
          background: copied ? C.tealT : C.teal, border: `1px solid ${copied ? C.tealB : C.teal}`,
          borderRadius: 10, color: copied ? C.teal : '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontFamily: FONT, transition: 'all 0.15s',
        }}>
          {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
          {copied ? 'Copié !' : "Copier l'adresse"}
        </button>

        <p style={{
          color: C.t3, fontSize: 11, textAlign: 'center', marginTop: 10, marginBottom: 0,
          background: C.l2, borderRadius: 7, padding: '7px 12px',
          border: `1px solid ${C.bds}`,
        }}>
          Envoyez uniquement des USDT · réseau {wallet.chain}
        </p>
      </div>
    </div>
  );
}

// ── Modal Nouvelle alerte ─────────────────────────────────────────
function AlertModal({ onAdd, onClose }: {
  onAdd: (a: { pair: string; condition: '<' | '>'; threshold: string }) => void;
  onClose: () => void;
}) {
  const [pair, setPair] = useState('USDT/XOF');
  const [condition, setCondition] = useState<'<' | '>'>('<');
  const [threshold, setThreshold] = useState('');

  const inputSt: React.CSSProperties = {
    background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 9,
    padding: '10px 12px', color: C.t1, fontSize: 13, fontFamily: FONT,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    colorScheme: 'dark',
  };

  const submit = () => {
    if (!threshold.trim()) return;
    onAdd({ pair, condition, threshold });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#141414', border: `1px solid ${C.bd}`,
        borderRadius: 18, padding: 28, width: 380, maxWidth: '90vw',
        fontFamily: FONT, boxShadow: '0 28px 70px rgba(0,0,0,0.6)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8,
          width: 30, height: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: C.t3, cursor: 'pointer',
        }}><X style={{ width: 14, height: 14 }} /></button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: C.tealT, border: `1px solid ${C.tealB}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Bell style={{ width: 16, height: 16, color: C.teal }} />
          </div>
          <div>
            <p style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0 }}>Nouvelle alerte de taux</p>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>Soyez notifié quand un seuil est atteint</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <p style={{ color: C.t3, fontSize: 11, fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Paire
            </p>
            <select value={pair} onChange={e => setPair(e.target.value)} style={inputSt}>
              <option>USDT/XOF</option>
              <option>USDT/EUR</option>
              <option>USDT/USD</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ color: C.t3, fontSize: 11, fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Condition
              </p>
              <select value={condition} onChange={e => setCondition(e.target.value as '<' | '>')} style={inputSt}>
                <option value="<">Inférieur à</option>
                <option value=">">Supérieur à</option>
              </select>
            </div>
            <div>
              <p style={{ color: C.t3, fontSize: 11, fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Seuil
              </p>
              <input type="number" placeholder="575" value={threshold}
                onChange={e => setThreshold(e.target.value)} style={inputSt} />
            </div>
          </div>

          <div style={{
            padding: '10px 14px', borderRadius: 9,
            background: C.tealT, border: `1px solid ${C.tealB}`,
            fontSize: 12, color: C.t2,
          }}>
            Alerte : <span style={{ color: C.t1, fontFamily: MONO }}>
              {pair} {condition === '<' ? 'passe sous' : 'dépasse'} {threshold || '—'}
            </span>
          </div>

          <button onClick={submit} style={{
            height: 42, background: C.teal, border: 'none',
            borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONT,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
            onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
          >
            Créer l'alerte
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Carte wallet ──────────────────────────────────────────────────
function WalletCard({ wallet, total, onReceive }: {
  wallet: typeof WALLETS[0]; total: number; onReceive: () => void;
}) {
  const [hov, setHov] = useState(false);
  const pct = Math.round((wallet.usdt / total) * 100);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.l1, border: `1px solid ${hov ? C.tealB : C.bds}`,
        borderRadius: 14, padding: '18px 18px 16px',
        transition: 'all 0.2s',
        boxShadow: hov ? '0 6px 24px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      {/* Logo + chain */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: C.l2, border: `1.5px solid ${C.bds}`,
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img src={wallet.logo} alt={wallet.chain}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <p style={{ color: C.t1, fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>{wallet.chain}</p>
            <p style={{ color: C.t3, fontSize: 10, margin: '1px 0 0' }}>{wallet.network}</p>
          </div>
        </div>
        <span style={{
          background: C.l3, border: `1px solid ${C.bds}`,
          borderRadius: 20, padding: '2px 9px',
          fontSize: 11, color: C.t3, fontFamily: MONO,
        }}>{pct}%</span>
      </div>

      {/* Solde */}
      <div>
        <p style={{ color: C.t1, fontSize: 26, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {wallet.usdt.toLocaleString('fr-FR')}
          <span style={{ fontSize: 12, fontWeight: 500, color: C.t3, marginLeft: 5 }}>USDT</span>
        </p>
        <p style={{ color: C.t3, fontSize: 11, margin: '4px 0 0', fontFamily: MONO }}>
          ≈ {Math.round(wallet.usdt * 575.2).toLocaleString('fr-FR')} XOF
        </p>
      </div>

      {/* Barre */}
      <div>
        <div style={{ height: 3, borderRadius: 99, background: C.l3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.tealH}, ${C.teal})`,
            borderRadius: 99, transition: 'width 0.6s',
          }} />
        </div>
        <p style={{ color: C.t3, fontSize: 10, margin: '5px 0 0', fontFamily: MONO }}>
          {wallet.address.slice(0, 8)}…{wallet.address.slice(-5)}
        </p>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onReceive} style={{
          flex: 1, height: 33, borderRadius: 8,
          background: 'transparent', border: `1px solid ${C.bd}`,
          color: C.t2, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          fontFamily: FONT, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB; (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bd; (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
        >
          <QrCode style={{ width: 12, height: 12 }} /> Recevoir
        </button>
        <button style={{
          flex: 1, height: 33, borderRadius: 8,
          background: C.teal, border: 'none',
          color: '#fff', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', fontFamily: FONT, transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
          onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
        >
          Payer →
        </button>
      </div>
    </div>
  );
}

// ── Carte taux ────────────────────────────────────────────────────
function RateCard({ rate, sparkData }: { rate: typeof RATES[0]; sparkData: { i: number; v: number }[] }) {
  const isUp   = rate.change > 0;
  const isFlat = rate.change === 0;

  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bds}`,
      borderRadius: 12, padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          {rate.pair}
        </p>
        {!isFlat && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {isUp
              ? <TrendingUp style={{ width: 10, height: 10, color: C.t3 }} />
              : <TrendingDown style={{ width: 10, height: 10, color: C.t3 }} />}
            <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>
              {isUp ? '+' : ''}{rate.change}%
            </span>
          </div>
        )}
      </div>

      <p style={{ color: C.t1, fontSize: 28, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {rate.rate.toLocaleString('fr-FR', {
          minimumFractionDigits: rate.rate > 10 ? 1 : 4,
          maximumFractionDigits: rate.rate > 10 ? 1 : 4,
        })}
      </p>

      <ResponsiveContainer width="100%" height={48}>
        <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sg-${rate.short}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.teal} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={C.teal} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={C.teal} strokeWidth={1.5}
            fill={`url(#sg-${rate.short})`} dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────
interface Alert { id: number; pair: string; condition: '<' | '>'; threshold: string; active: boolean }

export function BusinessTreasury({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [qrWallet,    setQrWallet]    = useState<typeof WALLETS[0] | null>(null);
  const [alertModal,  setAlertModal]  = useState(false);
  const [alerts,      setAlerts]      = useState<Alert[]>([
    { id: 1, pair: 'USDT/XOF', condition: '<', threshold: '560', active: true },
  ]);
  const [alertCtr,    setAlertCtr]    = useState(2);
  const [chartPair,   setChartPair]   = useState('EUR');
  void user;

  const addAlert = useCallback((a: Omit<Alert, 'id' | 'active'>) => {
    setAlerts(prev => [...prev, { ...a, id: alertCtr, active: true }]);
    setAlertCtr(c => c + 1);
  }, [alertCtr]);

  const toggleAlert = useCallback((id: number) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a)), []);

  const deleteAlert = useCallback((id: number) =>
    setAlerts(prev => prev.filter(a => a.id !== id)), []);

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Hero : SVG gauche + solde droite ────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1d1d1d 0%, #181818 60%, #131313 100%)',
        border: `1px solid ${C.bds}`, borderRadius: 18,
        overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'stretch',
      }}>
        {/* SVG gauche */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '28px 20px 28px 28px',
          borderRight: `1px solid rgba(59,150,143,0.1)`,
          background: 'rgba(59,150,143,0.02)',
          flexShrink: 0,
        }}>
          <HeroArtwork />
        </div>

        {/* Contenu droite */}
        <div style={{ flex: 1, minWidth: 240, padding: '28px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src={usdtLogo} alt="USDT" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
              <div>
                <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Trésorerie consolidée
                </p>
                <p style={{ color: C.t2, fontSize: 11, margin: '1px 0 0' }}>Tous réseaux</p>
              </div>
            </div>

            <p style={{ color: C.t1, fontSize: 42, fontWeight: 700, fontFamily: MONO, margin: '0 0 8px', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {TOTAL_USDT.toLocaleString('fr-FR')}
              <span style={{ fontSize: 16, fontWeight: 400, color: C.t3, marginLeft: 8 }}>USDT</span>
            </p>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { v: TOTAL_XOF.toLocaleString('fr-FR'), u: 'XOF' },
                { v: TOTAL_EUR.toLocaleString('fr-FR'), u: 'EUR' },
              ].map(item => (
                <div key={item.u} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ color: C.t3, fontSize: 12 }}>≈</span>
                  <span style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600 }}>{item.v}</span>
                  <span style={{ color: C.t3, fontSize: 11 }}>{item.u}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={{
              height: 38, paddingLeft: 18, paddingRight: 18,
              background: 'transparent', border: `1px solid ${C.bd}`,
              borderRadius: 10, color: C.t2, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB; (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bd; (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
            >
              <ArrowDownToLine style={{ width: 14, height: 14 }} /> Déposer
            </button>
            <button style={{
              height: 38, paddingLeft: 18, paddingRight: 18,
              background: C.teal, border: 'none',
              borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
            >
              <ArrowUpFromLine style={{ width: 14, height: 14 }} /> Retirer
            </button>
          </div>
        </div>
      </div>

      {/* ── Cartes wallets ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
        {WALLETS.map(w => (
          <WalletCard key={w.id} wallet={w} total={TOTAL_USDT} onReceive={() => setQrWallet(w)} />
        ))}
      </div>

      {/* ── Taux de marché ───────────────────────────────────────── */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 14, padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
          <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Taux de marché</h2>
          <span style={{ color: C.t3, fontSize: 11 }}>/ indicatifs 24h</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 10 }}>
          {RATES.map((r, i) => <RateCard key={r.pair} rate={r} sparkData={SPARKLINES[i]} />)}
        </div>
      </div>

      {/* ── Graphique + Alertes ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px]" style={{ gap: 12 }}>

        {/* Graphique */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Évolution — 30 jours</h2>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>USDT / {chartPair}</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['EUR', 'XOF', 'USD'].map(p => (
                <button key={p} onClick={() => setChartPair(p)} style={{
                  height: 26, paddingLeft: 10, paddingRight: 10, borderRadius: 7,
                  border: `1px solid ${chartPair === p ? C.tealB : C.bds}`,
                  background: chartPair === p ? C.tealT : 'transparent',
                  color: chartPair === p ? C.teal : C.t3,
                  fontSize: 11, fontWeight: chartPair === p ? 600 : 400,
                  cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.28}/>
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: C.t3, fontSize: 9, fontFamily: FONT }}
                tickLine={false} axisLine={false} interval={4}/>
              <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: MONO }}
                tickLine={false} axisLine={false} domain={['auto', 'auto']} width={44}
                tickFormatter={(v: number) => v.toFixed(4)}/>
              <Tooltip content={<ChartTooltip />}/>
              <Area type="monotone" dataKey="rate" stroke={C.teal} strokeWidth={2}
                fill="url(#chartGrad)" dot={false}
                activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {/* Header alertes */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Alertes</h3>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>{alerts.length} configurée{alerts.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setAlertModal(true)} style={{
              height: 32, paddingLeft: 12, paddingRight: 12,
              background: C.tealT, border: `1px solid ${C.tealB}`,
              borderRadius: 8, color: C.teal,
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT,
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus style={{ width: 12, height: 12 }} /> Nouvelle alerte
            </button>
          </div>

          {/* Liste */}
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyAlertSVG />
              <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Aucune alerte</p>
              <p style={{ color: C.t3, fontSize: 11, margin: '4px 0 0', opacity: 0.6 }}>Crée une alerte pour suivre les taux</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {alerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: C.l2, border: `1px solid ${a.active ? C.tealB : C.bds}`,
                  borderRadius: 10, padding: '10px 12px', transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: a.active ? C.teal : C.t3, flexShrink: 0,
                  }} />
                  <span style={{ color: a.active ? C.t1 : C.t2, fontSize: 12, fontFamily: MONO, flex: 1 }}>
                    {a.pair} {a.condition} {a.threshold}
                  </span>
                  <button onClick={() => toggleAlert(a.id)} style={{
                    fontSize: 10, color: a.active ? C.teal : C.t3,
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0,
                  }}>
                    {a.active ? 'Actif' : 'Inactif'}
                  </button>
                  <button onClick={() => deleteAlert(a.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: C.t3, padding: 0, display: 'flex',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {qrWallet && <QRModal wallet={qrWallet} onClose={() => setQrWallet(null)} />}
      {alertModal && <AlertModal onAdd={addAlert} onClose={() => setAlertModal(false)} />}
    </div>
  );
}
