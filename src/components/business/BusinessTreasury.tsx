import { useState, useCallback } from 'react';
import {
  QrCode, ArrowDownToLine, ArrowUpFromLine, Copy, Check,
  X, Bell, Trash2, Plus, TrendingUp, TrendingDown, Shield,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  CartesianGrid, XAxis, YAxis,
} from 'recharts';
import usdtLogo from '@/assets/usdt-logo.png';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#565656',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#627EEA', blueT: 'rgba(98,126,234,0.08)', blueB: 'rgba(98,126,234,0.20)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#E84142', redT: 'rgba(232,65,66,0.08)', redB: 'rgba(232,65,66,0.20)',
};
const FONT  = "'Inter', sans-serif";
const MONO  = '"JetBrains Mono", Consolas, monospace';

// ── Data ─────────────────────────────────────────────────────────
const WALLETS = [
  {
    id: 'trc20',  chain: 'TRC20',   network: 'TRON Network',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
    accent: '#E84142', accentT: 'rgba(232,65,66,0.08)', accentB: 'rgba(232,65,66,0.22)',
    usdt: 45230,
    address: 'T9xDRaWvH3qKZ1nM8bUoFpY5jL2wX6vRs',
  },
  {
    id: 'bep20',  chain: 'BEP20',   network: 'BNB Smart Chain',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    accent: '#F0B90B', accentT: 'rgba(240,185,11,0.08)', accentB: 'rgba(240,185,11,0.22)',
    usdt: 12450,
    address: '0x3A7b9c2D4E8F1a6B5C0D9E3F7a2B4C8D1E5F3A9',
  },
  {
    id: 'erc20',  chain: 'ERC20',   network: 'Ethereum',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    accent: '#627EEA', accentT: 'rgba(98,126,234,0.08)', accentB: 'rgba(98,126,234,0.22)',
    usdt: 8100,
    address: '0xaB7c3D2E9F5a1C4B8D0E7F3a6C2D5E9F1B4A8C3',
  },
];

const RATES = [
  { pair: 'USDT / XOF', short: 'XOF', rate: 575.2,  change: +0.18, color: C.teal  },
  { pair: 'USDT / EUR', short: 'EUR', rate: 0.9245, change: -0.06, color: C.amber },
  { pair: 'USDT / USD', short: 'USD', rate: 1.0000, change:  0.00, color: C.blue  },
];

const TOTAL_USDT = WALLETS.reduce((s, w) => s + w.usdt, 0);
const TOTAL_XOF  = Math.round(TOTAL_USDT * 575.2);
const TOTAL_EUR  = Math.round(TOTAL_USDT * 0.9245);
const RESERVE    = Math.round(TOTAL_USDT * 0.885);

function mkSparkline(base: number, n = 22) {
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v = v + (Math.random() - 0.48) * base * 0.004;
    return { i, v: parseFloat(v.toFixed(4)) };
  });
}
const SPARKLINES = RATES.map(r => mkSparkline(r.rate));

function mk30d() {
  let v = 0.938;
  return Array.from({ length: 31 }, (_, i) => {
    v = v + (Math.random() - 0.48) * 0.005;
    return { day: `J-${30 - i}`, rate: parseFloat(v.toFixed(4)) };
  });
}
const HISTORY = mk30d();

// ── SVG Decorations ───────────────────────────────────────────────
function HeroDecoration() {
  return (
    <svg width="360" height="160" viewBox="0 0 360 160" fill="none"
      style={{ position: 'absolute', right: 0, top: 0, opacity: 0.07, pointerEvents: 'none' }}>
      {/* Hex grid */}
      {[0,1,2,3,4].map(col => [0,1,2].map(row => {
        const x = col * 62 + (row % 2 === 0 ? 0 : 31);
        const y = row * 54;
        const pts = Array.from({ length: 6 }, (_, k) => {
          const a = (Math.PI / 180) * (60 * k - 30);
          return `${x + 26 * Math.cos(a)},${y + 26 * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={`${col}-${row}`} points={pts} stroke="white" strokeWidth="0.8" fill="none" />;
      }))}
      {/* Nodes */}
      {[[60,40],[180,30],[300,80],[120,120],[240,110]].map(([cx,cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={5} fill="white" />
          <circle cx={cx} cy={cy} r={12} stroke="white" strokeWidth="0.6" fill="none" />
        </g>
      ))}
      {/* Links */}
      {[[60,40,180,30],[180,30,300,80],[60,40,120,120],[180,30,240,110],[300,80,240,110]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.7" strokeDasharray="4 3"/>
      ))}
    </svg>
  );
}

function WalletSVG({ accent }: { accent: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.12, flexShrink: 0 }}>
      <rect x="4" y="12" width="40" height="28" rx="5" stroke={accent} strokeWidth="1.5"/>
      <path d="M4 20 H44" stroke={accent} strokeWidth="1.5"/>
      <rect x="32" y="24" width="8" height="8" rx="2" fill={accent}/>
      <path d="M12 16 L12 8 L20 8" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EmptyAlertSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }}>
      <circle cx="32" cy="32" r="28" stroke={C.teal} strokeWidth="1.2" strokeDasharray="4 3"/>
      <path d="M32 14 L32 34" stroke={C.teal} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="42" r="2.5" fill={C.teal}/>
      <path d="M22 20 L10 32 L22 44" stroke={C.t3} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 20 L54 32 L42 44" stroke={C.t3} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
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

// ── QR Modal ──────────────────────────────────────────────────────
function QRModal({ wallet, onClose }: { wallet: typeof WALLETS[0]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wallet.address]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#141414', border: `1px solid ${C.bd}`,
        borderRadius: 18, padding: 28, width: 380, maxWidth: '90vw',
        position: 'relative', fontFamily: FONT,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: C.l3, border: `1px solid ${C.bd}`,
          borderRadius: 8, width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.t3, cursor: 'pointer',
        }}>
          <X style={{ width: 14, height: 14 }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <img src={wallet.logo} alt={wallet.chain}
            style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${wallet.accentB}` }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div>
            <p style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Adresse {wallet.chain}</p>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>{wallet.network}</p>
          </div>
        </div>

        {/* QR placeholder */}
        <div style={{
          width: 140, height: 140, borderRadius: 12,
          background: C.l2, border: `1px solid ${C.bd}`,
          margin: '0 auto 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <QrCode style={{ width: 48, height: 48, color: C.t3 }} />
          <p style={{ color: C.t3, fontSize: 9, margin: 0, fontFamily: MONO, letterSpacing: '0.1em' }}>QR CODE</p>
        </div>

        <div style={{
          background: C.l2, border: `1px solid ${C.bds}`,
          borderRadius: 10, padding: '10px 14px',
          fontFamily: MONO, fontSize: 11, color: C.t2,
          wordBreak: 'break-all', lineHeight: 1.7, marginBottom: 12,
        }}>
          {wallet.address}
        </div>

        <button onClick={copy} style={{
          width: '100%', height: 40,
          background: copied ? C.emT : C.teal,
          border: `1px solid ${copied ? C.em : C.teal}`,
          borderRadius: 10, color: copied ? C.em : '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontFamily: FONT, transition: 'all 0.15s',
        }}>
          {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
          {copied ? 'Copié !' : "Copier l'adresse"}
        </button>

        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 8,
          background: wallet.accentT, border: `1px solid ${wallet.accentB}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Shield style={{ width: 13, height: 13, color: wallet.accent, flexShrink: 0 }} />
          <p style={{ color: wallet.accent, fontSize: 11, margin: 0 }}>
            Envoyez uniquement des USDT sur le réseau {wallet.chain}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Wallet Card ───────────────────────────────────────────────────
function WalletCard({ wallet, total, onReceive }: { wallet: typeof WALLETS[0]; total: number; onReceive: () => void }) {
  const [hov, setHov] = useState(false);
  const pct = Math.round((wallet.usdt / total) * 100);
  const xof = Math.round(wallet.usdt * 575.2);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.l1, border: `1px solid ${hov ? wallet.accentB : C.bds}`,
        borderRadius: 16, padding: '20px 20px 18px',
        transition: 'all 0.2s',
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px ${wallet.accentB}` : '0 1px 3px rgba(0,0,0,0.3)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      {/* Background accent glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: wallet.accentT,
        filter: 'blur(30px)', pointerEvents: 'none',
        opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s',
      }} />

      {/* Header: logo + chain + network */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: `2px solid ${wallet.accentB}`,
            overflow: 'hidden', flexShrink: 0,
            background: C.l2,
          }}>
            <img src={wallet.logo} alt={wallet.chain}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <p style={{ color: wallet.accent, fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>
              {wallet.chain}
            </p>
            <p style={{ color: C.t3, fontSize: 10, margin: '1px 0 0' }}>{wallet.network}</p>
          </div>
        </div>
        <div style={{
          background: `${wallet.accentT}`, border: `1px solid ${wallet.accentB}`,
          borderRadius: 20, padding: '3px 9px',
          fontSize: 11, fontWeight: 600, color: wallet.accent, fontFamily: MONO,
        }}>
          {pct}%
        </div>
      </div>

      {/* Balance */}
      <div>
        <p style={{ color: C.t1, fontSize: 28, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {wallet.usdt.toLocaleString('fr-FR')}
          <span style={{ fontSize: 13, fontWeight: 500, color: C.t3, marginLeft: 5 }}>USDT</span>
        </p>
        <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0', fontFamily: MONO }}>
          ≈ {xof.toLocaleString('fr-FR')} XOF
        </p>
      </div>

      {/* Distribution bar */}
      <div>
        <div style={{ height: 4, borderRadius: 99, background: C.l3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${wallet.accent}cc, ${wallet.accent})`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ color: C.t3, fontSize: 10, margin: '5px 0 0', fontFamily: MONO }}>
          {wallet.address.slice(0, 8)}…{wallet.address.slice(-5)}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onReceive} style={{
          flex: 1, height: 34, borderRadius: 9,
          background: wallet.accentT, border: `1px solid ${wallet.accentB}`,
          color: wallet.accent, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          fontFamily: FONT, transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <QrCode style={{ width: 12, height: 12 }} /> Recevoir
        </button>
        <button style={{
          flex: 1, height: 34, borderRadius: 9,
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

// ── Rate Card ─────────────────────────────────────────────────────
function RateCard({ rate, sparkData }: { rate: typeof RATES[0]; sparkData: { i: number; v: number }[] }) {
  const isUp = rate.change > 0;
  const isFlat = rate.change === 0;
  const changeColor = isFlat ? C.t3 : isUp ? C.em : '#ef4444';

  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bds}`,
      borderRadius: 14, padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: FONT }}>
            {rate.pair}
          </p>
          <p style={{ color: C.t1, fontSize: 26, fontWeight: 700, fontFamily: MONO, margin: '6px 0 0', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {rate.rate.toLocaleString('fr-FR', {
              minimumFractionDigits: rate.rate > 10 ? 1 : 4,
              maximumFractionDigits: rate.rate > 10 ? 1 : 4,
            })}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: isFlat ? C.l3 : isUp ? C.emT : 'rgba(239,68,68,0.08)',
          border: `1px solid ${isFlat ? C.bds : isUp ? C.emB : 'rgba(239,68,68,0.2)'}`,
          borderRadius: 20, padding: '4px 9px', marginTop: 2,
        }}>
          {!isFlat && (isUp
            ? <TrendingUp style={{ width: 10, height: 10, color: changeColor }} />
            : <TrendingDown style={{ width: 10, height: 10, color: changeColor }} />
          )}
          <span style={{ fontSize: 11, fontWeight: 600, color: changeColor, fontFamily: MONO }}>
            {isFlat ? '—' : `${isUp ? '+' : ''}${rate.change}%`}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={52}>
        <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sg-${rate.short}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={rate.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={rate.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={rate.color} strokeWidth={1.5}
            fill={`url(#sg-${rate.short})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>

      <p style={{ color: C.t3, fontSize: 10, margin: 0, fontFamily: FONT }}>
        Taux indicatif 24h
      </p>
    </div>
  );
}

// ── Alert Panel ───────────────────────────────────────────────────
interface Alert { id: number; pair: string; condition: '<' | '>'; threshold: string; active: boolean }

function AlertPanel({ alerts, onAdd, onToggle, onDelete }: {
  alerts: Alert[];
  onAdd: (a: Omit<Alert, 'id' | 'active'>) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pair, setPair] = useState('USDT/XOF');
  const [condition, setCondition] = useState<'<' | '>'>('<');
  const [threshold, setThreshold] = useState('');

  const inputSt: React.CSSProperties = {
    background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8,
    padding: '8px 10px', color: C.t1, fontSize: 12, fontFamily: FONT,
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  const submit = () => {
    if (!threshold) return;
    onAdd({ pair, condition, threshold });
    setThreshold(''); setOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Alertes de taux</h3>
          <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>{alerts.length} alerte{alerts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setOpen(o => !o)} style={{
          height: 32, paddingLeft: 12, paddingRight: 12,
          background: open ? C.l3 : C.tealT, border: `1px solid ${open ? C.bd : C.tealB}`,
          borderRadius: 8, color: open ? C.t2 : C.teal,
          fontSize: 11, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT,
        }}>
          <Plus style={{ width: 12, height: 12 }} />
          {open ? 'Annuler' : 'Nouvelle alerte'}
        </button>
      </div>

      {/* Add form */}
      {open && (
        <div style={{
          background: C.l2, border: `1px solid ${C.tealB}`,
          borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <p style={{ color: C.t2, fontSize: 11, margin: 0 }}>Notifier quand</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr', gap: 8 }}>
            <select value={pair} onChange={e => setPair(e.target.value)} style={inputSt}>
              <option>USDT/XOF</option>
              <option>USDT/EUR</option>
              <option>USDT/USD</option>
            </select>
            <select value={condition} onChange={e => setCondition(e.target.value as '<' | '>')} style={inputSt}>
              <option value="<">&lt;</option>
              <option value=">">&gt;</option>
            </select>
            <input type="number" placeholder="575" value={threshold}
              onChange={e => setThreshold(e.target.value)} style={inputSt} />
          </div>
          <button onClick={submit} style={{
            height: 36, background: C.teal, border: 'none',
            borderRadius: 9, color: '#fff', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', fontFamily: FONT,
          }}>
            Créer l'alerte
          </button>
        </div>
      )}

      {/* List */}
      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 16px' }}>
          <EmptyAlertSVG />
          <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Aucune alerte configurée</p>
          <p style={{ color: C.t3, fontSize: 11, margin: '4px 0 0', opacity: 0.7 }}>
            Crée une alerte pour être notifié quand un taux évolue
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: a.active ? C.tealT : C.l2,
              border: `1px solid ${a.active ? C.tealB : C.bds}`,
              borderRadius: 10, padding: '10px 14px',
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: a.active ? C.em : C.t3, flexShrink: 0,
              }} />
              <span style={{ color: a.active ? C.t1 : C.t2, fontSize: 12, fontFamily: MONO, flex: 1 }}>
                {a.pair} {a.condition} {a.threshold}
              </span>
              <button onClick={() => onToggle(a.id)} style={{
                fontSize: 10, color: a.active ? C.teal : C.t3,
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0,
              }}>
                {a.active ? 'Actif' : 'Inactif'}
              </button>
              <button onClick={() => onDelete(a.id)} style={{
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
  );
}

// ── Main Component ────────────────────────────────────────────────
export function BusinessTreasury({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [qrWallet, setQrWallet] = useState<typeof WALLETS[0] | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, pair: 'USDT/XOF', condition: '<', threshold: '560', active: true },
  ]);
  const [alertCounter, setAlertCounter] = useState(2);
  const [chartPair, setChartPair] = useState('EUR');

  void user;

  const addAlert = useCallback((a: Omit<Alert, 'id' | 'active'>) => {
    setAlerts(prev => [...prev, { ...a, id: alertCounter, active: true }]);
    setAlertCounter(c => c + 1);
  }, [alertCounter]);

  const toggleAlert = useCallback((id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }, []);

  const deleteAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #191919 50%, #141414 100%)',
        border: `1px solid ${C.bds}`, borderRadius: 18,
        padding: '24px 28px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}>
        <HeroDecoration />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* Left: label + big number */}
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src={usdtLogo} alt="USDT"
                style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
              <div>
                <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Trésorerie totale
                </p>
                <p style={{ color: C.t2, fontSize: 11, margin: '1px 0 0' }}>Tous réseaux confondus</p>
              </div>
            </div>
            <p style={{ color: C.t1, fontSize: 38, fontWeight: 700, fontFamily: MONO, margin: '0 0 6px', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {TOTAL_USDT.toLocaleString('fr-FR')}
              <span style={{ fontSize: 16, fontWeight: 500, color: C.t3, marginLeft: 8 }}>USDT</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
              {[
                { label: 'XOF', value: TOTAL_XOF.toLocaleString('fr-FR') },
                { label: 'EUR', value: TOTAL_EUR.toLocaleString('fr-FR') },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ color: C.t3, fontSize: 11 }}>≈</span>
                  <span style={{ color: C.t2, fontSize: 14, fontFamily: MONO, fontWeight: 600 }}>{item.value}</span>
                  <span style={{ color: C.t3, fontSize: 11 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: réserve + distribution */}
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                Réserve disponible
              </p>
              <p style={{ color: C.em, fontSize: 20, fontWeight: 700, fontFamily: MONO, margin: '0 0 10px' }}>
                {RESERVE.toLocaleString('fr-FR')} <span style={{ fontSize: 12, fontWeight: 500 }}>USDT</span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {WALLETS.map(w => {
                  const pct = Math.round((w.usdt / TOTAL_USDT) * 100);
                  return (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={w.logo} alt={w.chain}
                        style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      <div style={{ flex: 1, height: 3, borderRadius: 99, background: C.l3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: w.accent, borderRadius: 99 }} />
                      </div>
                      <span style={{ color: C.t3, fontSize: 10, fontFamily: MONO, width: 28, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <button style={{
              height: 40, paddingLeft: 18, paddingRight: 18,
              background: C.l2, border: `1px solid ${C.bd}`,
              borderRadius: 10, color: C.t2, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; (e.currentTarget as HTMLButtonElement).style.color = C.t1; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bd; (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
            >
              <ArrowDownToLine style={{ width: 14, height: 14 }} /> Déposer
            </button>
            <button style={{
              height: 40, paddingLeft: 18, paddingRight: 18,
              background: C.teal, border: 'none',
              borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 500,
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

      {/* ── Wallet Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 14 }}>
        {WALLETS.map(w => (
          <WalletCard key={w.id} wallet={w} total={TOTAL_USDT} onReceive={() => setQrWallet(w)} />
        ))}
      </div>

      {/* ── Live Rates ───────────────────────────────────────────── */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 14, padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Taux de marché</h2>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>Actualisé toutes les 20 secondes</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: C.emT, border: `1px solid ${C.emB}`,
            borderRadius: 20, padding: '4px 10px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.em, display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: C.em, fontWeight: 500 }}>Temps réel</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
          {RATES.map((r, i) => <RateCard key={r.pair} rate={r} sparkData={SPARKLINES[i]} />)}
        </div>
      </div>

      {/* ── Chart + Alerts ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px]" style={{ gap: 14 }}>

        {/* History chart */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Évolution historique — 30 jours</h2>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>Taux de change USDT/{chartPair}</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['EUR', 'XOF', 'USD'].map(p => (
                <button key={p} onClick={() => setChartPair(p)} style={{
                  height: 28, paddingLeft: 10, paddingRight: 10, borderRadius: 7,
                  border: `1px solid ${chartPair === p ? C.tealB : C.bds}`,
                  background: chartPair === p ? C.tealT : 'transparent',
                  color: chartPair === p ? C.teal : C.t3,
                  fontSize: 11, fontWeight: chartPair === p ? 600 : 400,
                  cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: C.t3, fontSize: 9, fontFamily: FONT }}
                tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: MONO }}
                tickLine={false} axisLine={false} domain={['auto', 'auto']} width={44}
                tickFormatter={(v: number) => v.toFixed(4)} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="rate" stroke={C.teal} strokeWidth={2}
                fill="url(#chartGrad)" dot={false}
                activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <AlertPanel alerts={alerts} onAdd={addAlert} onToggle={toggleAlert} onDelete={deleteAlert} />
        </div>
      </div>

      {/* QR Modal */}
      {qrWallet && <QRModal wallet={qrWallet} onClose={() => setQrWallet(null)} />}
    </div>
  );
}
