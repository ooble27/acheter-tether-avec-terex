import { useState, useCallback } from 'react';
import { QrCode, ArrowDownToLine, ArrowUpFromLine, Copy, Check, X, Bell, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// --- Mock data ---
const WALLETS = [
  {
    id: 'trc20',
    chain: 'TRC20',
    network: 'TRON',
    color: C.red,
    colorT: C.redT,
    colorB: C.redB,
    usdt: 45230,
    eur: 42761,
    address: 'T9xDRaWvH3qKZ1nM8bUoFpY5jL2wX6vRs',
  },
  {
    id: 'bep20',
    chain: 'BEP20',
    network: 'BSC',
    color: C.amber,
    colorT: C.amberT,
    colorB: C.amberB,
    usdt: 12450,
    eur: 11768,
    address: '0x3A7b9c2D4E8F1a6B5C0D9E3F7a2B4C8D1E5F3A9',
  },
  {
    id: 'erc20',
    chain: 'ERC20',
    network: 'ETH',
    color: C.blue,
    colorT: C.blueT,
    colorB: C.blueB,
    usdt: 8100,
    eur: 7656,
    address: '0xaB7c3D2E9F5a1C4B8D0E7F3a6C2D5E9F1B4A8C3',
  },
];

const RATES = [
  {
    pair: 'USDT/EUR',
    rate: 0.9245,
    change: -0.06,
    color: C.teal,
  },
  {
    pair: 'USDT/XOF',
    rate: 620.5,
    change: +0.18,
    color: C.amber,
  },
  {
    pair: 'USDT/USD',
    rate: 1.0000,
    change: 0,
    color: C.blue,
  },
];

function generateSparkline(base: number, count = 20) {
  const points = [];
  let v = base;
  for (let i = 0; i < count; i++) {
    v = v + (Math.random() - 0.48) * base * 0.003;
    points.push({ i, v: parseFloat(v.toFixed(4)) });
  }
  return points;
}

const SPARKLINES = RATES.map(r => generateSparkline(r.rate));

function generate30DayHistory() {
  const pts = [];
  let v = 0.938;
  for (let i = 30; i >= 0; i--) {
    v = v + (Math.random() - 0.48) * 0.004;
    pts.push({ day: `J-${i}`, rate: parseFloat(v.toFixed(4)) });
  }
  return pts;
}

const HISTORY_30 = generate30DayHistory();

const TOTAL_USDT = WALLETS.reduce((s, w) => s + w.usdt, 0);
const TOTAL_EUR = WALLETS.reduce((s, w) => s + w.eur, 0);
const TOTAL_XOF = Math.round(TOTAL_USDT * 619.4);
const RESERVE = Math.round(TOTAL_USDT * 0.885);

// --- Sub-components ---

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bd}`,
      borderRadius: 8, padding: '8px 12px', fontFamily: FONT,
    }}>
      <p style={{ color: C.t3, fontSize: 10, margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>
        {payload[0].value}
      </p>
    </div>
  );
}

interface QRModalProps {
  wallet: typeof WALLETS[0];
  onClose: () => void;
}

function QRModal({ wallet, onClose }: QRModalProps) {
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
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.l1, border: `1px solid ${C.bd}`,
          borderRadius: 16, padding: 28, width: 400, maxWidth: '90vw',
          position: 'relative', fontFamily: FONT,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: C.l3, border: `1px solid ${C.bd}`,
            borderRadius: 6, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.t3, cursor: 'pointer',
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: wallet.color, flexShrink: 0,
          }} />
          <h2 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0 }}>
            Adresse de réception {wallet.chain}
          </h2>
        </div>

        {/* QR placeholder */}
        <div style={{
          width: 120, height: 120, borderRadius: 10,
          background: C.l3, border: `1px solid ${C.bd}`,
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <QrCode style={{ width: 40, height: 40, color: C.t3 }} />
            <p style={{ color: C.t3, fontSize: 9, margin: '4px 0 0', fontFamily: MONO }}>QR CODE</p>
          </div>
        </div>

        {/* Address */}
        <div style={{
          background: C.l3, border: `1px solid ${C.bds}`,
          borderRadius: 8, padding: '10px 12px',
          fontFamily: MONO, fontSize: 11, color: C.t2,
          wordBreak: 'break-all', lineHeight: 1.6, marginBottom: 12,
        }}>
          {wallet.address}
        </div>

        {/* Copy button */}
        <button
          onClick={copy}
          style={{
            width: '100%', height: 38,
            background: copied ? C.emT : C.teal,
            border: `1px solid ${copied ? C.em : C.teal}`,
            borderRadius: 8, color: copied ? C.em : '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            fontFamily: FONT, transition: 'all 0.15s',
          }}
        >
          {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
          {copied ? 'Copié !' : "Copier l'adresse"}
        </button>

        {/* Warning */}
        <p style={{
          color: C.amber, fontSize: 11, textAlign: 'center',
          marginTop: 12, marginBottom: 0,
          background: C.amberT, borderRadius: 6, padding: '6px 10px',
        }}>
          Envoyez uniquement des USDT sur le réseau {wallet.chain} ({wallet.network})
        </p>
      </div>
    </div>
  );
}

interface Alert {
  id: number;
  pair: string;
  condition: '<' | '>';
  threshold: string;
  active: boolean;
}

interface AlertPanelProps {
  alerts: Alert[];
  onAdd: (a: Omit<Alert, 'id' | 'active'>) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function AlertPanel({ alerts, onAdd, onToggle, onDelete }: AlertPanelProps) {
  const [open, setOpen] = useState(false);
  const [pair, setPair] = useState('USDT/EUR');
  const [condition, setCondition] = useState<'<' | '>'>('<');
  const [threshold, setThreshold] = useState('');

  const submit = () => {
    if (!threshold) return;
    onAdd({ pair, condition, threshold });
    setThreshold('');
    setOpen(false);
  };

  const inputStyle = {
    background: C.l3, border: `1px solid ${C.bd}`,
    borderRadius: 7, padding: '7px 10px',
    color: C.t1, fontSize: 12, fontFamily: FONT,
    outline: 'none',
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 14,
      }}>
        <h3 style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0 }}>
          Alertes de taux
        </h3>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            height: 30, paddingLeft: 10, paddingRight: 10,
            background: C.tealT, border: `1px solid ${C.tealB}`,
            borderRadius: 7, color: C.teal, fontSize: 11, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: FONT,
          }}
        >
          <Plus style={{ width: 12, height: 12 }} />
          Créer une alerte
        </button>
      </div>

      {open && (
        <div style={{
          background: C.l2, border: `1px solid ${C.bd}`,
          borderRadius: 10, padding: 14, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={pair}
              onChange={e => setPair(e.target.value)}
              style={{ ...inputStyle, flex: '1 1 100px' }}
            >
              <option>USDT/EUR</option>
              <option>USDT/XOF</option>
              <option>USDT/FCFA</option>
            </select>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value as '<' | '>')}
              style={{ ...inputStyle, width: 60 }}
            >
              <option value="<">&lt;</option>
              <option value=">">&gt;</option>
            </select>
            <input
              type="number"
              placeholder="0.93"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              style={{ ...inputStyle, flex: '1 1 80px' }}
            />
            <button
              onClick={submit}
              style={{
                height: 32, paddingLeft: 14, paddingRight: 14,
                background: C.teal, border: 'none',
                borderRadius: 7, color: '#fff', fontSize: 12,
                fontWeight: 500, cursor: 'pointer', fontFamily: FONT,
              }}
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {alerts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          color: C.t3, fontSize: 12,
        }}>
          <Bell style={{ width: 24, height: 24, marginBottom: 8, opacity: 0.4 }} />
          <p style={{ margin: 0 }}>Aucune alerte configurée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: C.l2, border: `1px solid ${C.bds}`,
              borderRadius: 8, padding: '8px 12px',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: a.active ? C.em : C.t3, flexShrink: 0,
              }} />
              <span style={{ color: C.t2, fontSize: 12, fontFamily: MONO, flex: 1 }}>
                {a.pair} {a.condition} {a.threshold}
              </span>
              <button
                onClick={() => onToggle(a.id)}
                style={{
                  fontSize: 10, color: a.active ? C.em : C.t3,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: FONT,
                }}
              >
                {a.active ? 'Actif' : 'Inactif'}
              </button>
              <button
                onClick={() => onDelete(a.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.t3, padding: 0, display: 'flex',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.red)}
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

// --- Main component ---
export function BusinessTreasury({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [qrWallet, setQrWallet] = useState<typeof WALLETS[0] | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, pair: 'USDT/EUR', condition: '<', threshold: '0.93', active: true },
  ]);
  const [alertIdCounter, setAlertIdCounter] = useState(2);

  const addAlert = useCallback((a: Omit<Alert, 'id' | 'active'>) => {
    setAlerts(prev => [...prev, { ...a, id: alertIdCounter, active: true }]);
    setAlertIdCounter(c => c + 1);
  }, [alertIdCounter]);

  const toggleAlert = useCallback((id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }, []);

  const deleteAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  void user;

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: C.t1, fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Trésorerie
          </h1>
          <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>
            Gestion de vos wallets et taux
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            height: 34, paddingLeft: 14, paddingRight: 14,
            background: C.l2, border: `1px solid ${C.bd}`,
            borderRadius: 8, color: C.t2, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONT, transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.bdh)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.bd)}
          >
            <ArrowDownToLine style={{ width: 13, height: 13 }} />
            Déposer
          </button>
          <button style={{
            height: 34, paddingLeft: 14, paddingRight: 14,
            background: C.teal, border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONT, transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
            onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
          >
            <ArrowUpFromLine style={{ width: 13, height: 13 }} />
            Retirer
          </button>
        </div>
      </div>

      {/* Wallet cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
        {WALLETS.map(w => (
          <WalletCard key={w.id} wallet={w} onReceive={() => setQrWallet(w)} />
        ))}
      </div>

      {/* Total balance banner */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 12, padding: '14px 20px',
        display: 'flex', flexWrap: 'wrap', gap: 12,
        alignItems: 'center', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: C.t3, fontSize: 11 }}>Total consolidé</span>
          <span style={{ color: C.t1, fontSize: 16, fontWeight: 700, fontFamily: MONO }}>
            {TOTAL_USDT.toLocaleString()} USDT
          </span>
        </div>
        <div style={{ width: 1, height: 16, background: C.bds }} />
        <span style={{ color: C.t2, fontSize: 13, fontFamily: MONO }}>
          ≈ {TOTAL_EUR.toLocaleString()} EUR
        </span>
        <div style={{ width: 1, height: 16, background: C.bds }} />
        <span style={{ color: C.t2, fontSize: 13, fontFamily: MONO }}>
          ≈ {TOTAL_XOF.toLocaleString()} XOF
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ color: C.t3, fontSize: 11 }}>
            Réserve disponible :{' '}
            <span style={{ color: C.em, fontFamily: MONO }}>{RESERVE.toLocaleString()} USDT</span>
            {' '}(après paiements planifiés)
          </span>
        </div>
      </div>

      {/* Live rates */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 12, padding: '16px 20px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>
            Taux de marché en direct
          </h2>
          <span style={{ color: C.t3, fontSize: 11 }}>Il y a 2 min</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {RATES.map((r, i) => (
            <RateCard key={r.pair} rate={r} sparkData={SPARKLINES[i]} />
          ))}
        </div>
      </div>

      {/* History chart + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 14 }}>
        {/* History chart */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: '16px 20px',
        }}>
          <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>
            Historique USDT/EUR — 30 jours
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={HISTORY_30} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.teal} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: C.t3, fontSize: 10, fontFamily: FONT }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={48}
                tickFormatter={(v: number) => v.toFixed(4)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke={C.teal}
                strokeWidth={2}
                fill="url(#tealGrad)"
                dot={false}
                activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: '16px 20px',
        }}>
          <AlertPanel
            alerts={alerts}
            onAdd={addAlert}
            onToggle={toggleAlert}
            onDelete={deleteAlert}
          />
        </div>
      </div>

      {/* QR Modal */}
      {qrWallet && <QRModal wallet={qrWallet} onClose={() => setQrWallet(null)} />}
    </div>
  );
}

// --- WalletCard ---
interface WalletCardProps {
  wallet: typeof WALLETS[0];
  onReceive: () => void;
}

function WalletCard({ wallet, onReceive }: WalletCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.l1,
        border: `1px solid ${hovered ? C.bdh : C.bds}`,
        borderRadius: 14, padding: 24,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 24px rgba(0,0,0,0.24)' : 'none',
      }}
    >
      {/* Chain header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: wallet.color, flexShrink: 0,
        }} />
        <span style={{
          color: wallet.color, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em',
        }}>
          {wallet.chain}
        </span>
        <span style={{ color: C.t3, fontSize: 11 }}>·</span>
        <span style={{ color: C.t3, fontSize: 11 }}>{wallet.network}</span>
      </div>

      {/* Balance */}
      <p style={{
        color: C.t1, fontSize: 26, fontWeight: 700,
        fontFamily: MONO, margin: '0 0 4px',
        letterSpacing: '-0.02em',
      }}>
        {wallet.usdt.toLocaleString()}
        <span style={{ fontSize: 13, fontWeight: 500, color: C.t3, marginLeft: 6 }}>USDT</span>
      </p>
      <p style={{ color: C.t3, fontSize: 13, margin: '0 0 20px', fontFamily: MONO }}>
        ≈ {wallet.eur.toLocaleString()} EUR
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onReceive}
          style={{
            flex: 1, height: 32,
            background: wallet.colorT,
            border: `1px solid ${wallet.colorB}`,
            borderRadius: 7, color: wallet.color,
            fontSize: 11, fontWeight: 500,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            fontFamily: FONT, transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <QrCode style={{ width: 12, height: 12 }} />
          Recevoir
        </button>
        <button
          style={{
            flex: 1, height: 32,
            background: C.teal, border: 'none',
            borderRadius: 7, color: '#fff',
            fontSize: 11, fontWeight: 500,
            cursor: 'pointer', fontFamily: FONT,
            transition: 'background 0.15s',
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

// --- RateCard ---
interface RateCardProps {
  rate: typeof RATES[0];
  sparkData: Array<{ i: number; v: number }>;
}

function RateCard({ rate, sparkData }: RateCardProps) {
  const isPositive = rate.change >= 0;
  const changeColor = isPositive ? C.em : C.red;

  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bds}`,
      borderRadius: 10, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: C.t3, fontSize: 11, fontWeight: 500 }}>{rate.pair}</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          color: changeColor, fontSize: 11, fontWeight: 600,
        }}>
          {isPositive
            ? <TrendingUp style={{ width: 11, height: 11 }} />
            : <TrendingDown style={{ width: 11, height: 11 }} />}
          {isPositive ? '+' : ''}{rate.change}%
        </div>
      </div>

      <p style={{
        color: C.t1, fontSize: 22, fontWeight: 700,
        fontFamily: MONO, margin: '0 0 10px',
        letterSpacing: '-0.02em',
      }}>
        {rate.rate.toLocaleString(undefined, { minimumFractionDigits: rate.rate > 10 ? 1 : 4, maximumFractionDigits: rate.rate > 10 ? 2 : 4 })}
      </p>

      <ResponsiveContainer width="100%" height={50}>
        <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${rate.pair}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={rate.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={rate.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={rate.color}
            strokeWidth={1.5}
            fill={`url(#spark-${rate.pair})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
