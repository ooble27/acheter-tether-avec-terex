import { useState, useEffect, useCallback } from 'react';
import {
  QrCode, ArrowDownToLine, ArrowUpFromLine, Copy, Check,
  X, Bell, Trash2, Plus,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  CartesianGrid, XAxis, YAxis,
} from 'recharts';
import usdtLogo from '@/assets/usdt-logo.png';
import { useCryptoRates } from '@/hooks/useCryptoRates';

// ── Tokens ────────────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#565656',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── Wallets statiques ─────────────────────────────────────────────
const WALLETS = [
  { id: 'trc20', chain: 'TRC20', network: 'TRON Network',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', usdt: 45230, address: 'T9xDRaWvH3qKZ1nM8bUoFpY5jL2wX6vRs' },
  { id: 'bep20', chain: 'BEP20', network: 'BNB Smart Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', usdt: 12450, address: '0x3A7b9c2D4E8F1a6B5C0D9E3F7a2B4C8D1E5F3A9' },
  { id: 'erc20', chain: 'ERC20', network: 'Ethereum',        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', usdt:  8100, address: '0xaB7c3D2E9F5a1C4B8D0E7F3a6C2D5E9F1B4A8C3' },
];
const TOTAL_USDT = WALLETS.reduce((s, w) => s + w.usdt, 0);

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
        background: '#141414', border: `1px solid ${C.bd}`, borderRadius: 18,
        padding: 28, width: 360, maxWidth: '90vw', position: 'relative',
        fontFamily: FONT, boxShadow: '0 28px 70px rgba(0,0,0,0.6)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, background: C.l3,
          border: `1px solid ${C.bd}`, borderRadius: 8, width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.t3, cursor: 'pointer',
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
          width: 130, height: 130, borderRadius: 12, background: C.l2,
          border: `1px solid ${C.bd}`, margin: '0 auto 20px',
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
          color: C.t3, fontSize: 11, textAlign: 'center', margin: '10px 0 0',
          background: C.l2, borderRadius: 7, padding: '7px 12px', border: `1px solid ${C.bds}`,
        }}>
          Envoyez uniquement des USDT · réseau {wallet.chain}
        </p>
      </div>
    </div>
  );
}

// ── Modal Alerte ──────────────────────────────────────────────────
function AlertModal({ onAdd, onClose }: {
  onAdd: (a: { pair: string; condition: '<' | '>'; threshold: string }) => void;
  onClose: () => void;
}) {
  const [pair, setPair]           = useState('USDT/XOF');
  const [condition, setCondition] = useState<'<' | '>'>('<');
  const [threshold, setThreshold] = useState('');

  const inpSt: React.CSSProperties = {
    background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 9,
    padding: '10px 12px', color: C.t1, fontSize: 13, fontFamily: FONT,
    outline: 'none', width: '100%', boxSizing: 'border-box', colorScheme: 'dark',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#141414', border: `1px solid ${C.bd}`, borderRadius: 18,
        padding: 28, width: 380, maxWidth: '90vw', fontFamily: FONT,
        boxShadow: '0 28px 70px rgba(0,0,0,0.6)', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, background: C.l3,
          border: `1px solid ${C.bd}`, borderRadius: 8, width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.t3, cursor: 'pointer',
        }}><X style={{ width: 14, height: 14 }} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: C.tealT,
            border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <Bell style={{ width: 16, height: 16, color: C.teal }} />
          </div>
          <div>
            <p style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0 }}>Nouvelle alerte</p>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>Notifié quand le seuil est atteint</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Paire</p>
            <select value={pair} onChange={e => setPair(e.target.value)} style={inpSt}>
              <option>USDT/XOF</option><option>USDT/EUR</option><option>USDT/USD</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Condition</p>
              <select value={condition} onChange={e => setCondition(e.target.value as '<' | '>')} style={inpSt}>
                <option value="<">Inférieur à</option>
                <option value=">">Supérieur à</option>
              </select>
            </div>
            <div>
              <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Seuil</p>
              <input type="number" placeholder="575" value={threshold}
                onChange={e => setThreshold(e.target.value)} style={inpSt} />
            </div>
          </div>
          {threshold && (
            <div style={{ padding: '10px 14px', borderRadius: 9, background: C.tealT, border: `1px solid ${C.tealB}`, fontSize: 12, color: C.t2 }}>
              Alerte : <span style={{ color: C.t1, fontFamily: MONO }}>
                {pair} {condition === '<' ? 'passe sous' : 'dépasse'} {threshold}
              </span>
            </div>
          )}
          <button
            onClick={() => { if (threshold.trim()) { onAdd({ pair, condition, threshold }); onClose(); } }}
            style={{
              height: 42, background: threshold.trim() ? C.teal : C.l3,
              border: 'none', borderRadius: 10, color: threshold.trim() ? '#fff' : C.t3,
              fontSize: 13, fontWeight: 600, cursor: threshold.trim() ? 'pointer' : 'default',
              fontFamily: FONT, transition: 'all 0.15s',
            }}
          >
            Créer l'alerte
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────
interface Alert { id: number; pair: string; condition: '<' | '>'; threshold: string; active: boolean }

export function BusinessTreasury({ user }: { user: { email: string; name: string; id?: string } | null }) {
  void user;

  // ── Taux en direct ─────────────────────────────────────────────
  const { usdtToCfa, loading: ratesLoading, lastUpdated } = useCryptoRates();
  const [usdtToEur, setUsdtToEur] = useState(0.9245);
  const [secAgo, setSecAgo] = useState(0);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.EUR) setUsdtToEur(parseFloat(d.rates.EUR.toFixed(4))); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (lastUpdated) setSecAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 5000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const liveRates = [
    { pair: 'USDT / XOF', short: 'XOF', value: usdtToCfa,  fmt: (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) },
    { pair: 'USDT / EUR', short: 'EUR', value: usdtToEur,  fmt: (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) },
    { pair: 'USDT / USD', short: 'USD', value: 1.0000,     fmt: (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) },
  ];

  const totalXof = Math.round(TOTAL_USDT * usdtToCfa);
  const totalEur = Math.round(TOTAL_USDT * usdtToEur);

  // ── Graphique historique réel (CoinGecko) ──────────────────────
  const [chartData, setChartData] = useState<{ day: string; rate: number }[]>([]);
  const [chartPair, setChartPair] = useState<'XOF' | 'EUR' | 'USD'>('XOF');
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const cur = chartPair === 'XOF' ? 'xof' : chartPair === 'EUR' ? 'eur' : 'usd';
    setChartLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/tether/market_chart?vs_currency=${cur}&days=30&interval=daily`)
      .then(r => r.json())
      .then(d => {
        if (d.prices) {
          setChartData(d.prices.map(([ts, price]: [number, number]) => ({
            day: new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            rate: parseFloat(price.toFixed(chartPair === 'XOF' ? 0 : 4)),
          })));
        }
      })
      .catch(() => {})
      .finally(() => setChartLoading(false));
  }, [chartPair]);

  // ── Alertes ────────────────────────────────────────────────────
  const [alerts, setAlerts]       = useState<Alert[]>([{ id: 1, pair: 'USDT/XOF', condition: '<', threshold: '560', active: true }]);
  const [alertCtr, setAlertCtr]   = useState(2);
  const [alertModal, setAlertModal] = useState(false);
  const [qrWallet, setQrWallet]   = useState<typeof WALLETS[0] | null>(null);

  const addAlert = useCallback((a: Omit<Alert, 'id' | 'active'>) => {
    setAlerts(prev => [...prev, { ...a, id: alertCtr, active: true }]);
    setAlertCtr(c => c + 1);
  }, [alertCtr]);

  const toggleAlert = useCallback((id: number) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a)), []);
  const deleteAlert = useCallback((id: number) =>
    setAlerts(prev => prev.filter(a => a.id !== id)), []);

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Hero : solde gauche + wallets droite
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 0, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${C.bds}`, boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      }} className="grid grid-cols-1 md:grid-cols-2">

        {/* Gauche : solde total */}
        <div style={{
          background: 'linear-gradient(160deg, #1e1e1e 0%, #161616 100%)',
          padding: '28px 28px 24px',
          backgroundImage: 'radial-gradient(circle, rgba(59,150,143,0.10) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28,
          borderRight: `1px solid ${C.bds}`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <img src={usdtLogo} alt="USDT" style={{ width: 28, height: 28, borderRadius: '50%' }} />
              <span style={{ color: C.t3, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Trésorerie totale
              </span>
            </div>
            <p style={{ color: C.t1, fontSize: 44, fontWeight: 700, fontFamily: MONO, margin: '0 0 10px', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {TOTAL_USDT.toLocaleString('fr-FR')}
            </p>
            <p style={{ color: C.t3, fontSize: 13, margin: 0, fontFamily: MONO }}>USDT</p>

            <div style={{ display: 'flex', gap: 0, marginTop: 18, flexWrap: 'wrap' }}>
              {[
                { v: ratesLoading ? '…' : totalXof.toLocaleString('fr-FR'), u: 'XOF' },
                { v: ratesLoading ? '…' : totalEur.toLocaleString('fr-FR'), u: 'EUR' },
              ].map((item, i) => (
                <div key={item.u} style={{
                  paddingRight: 20, marginRight: 20,
                  borderRight: i === 0 ? `1px solid ${C.bds}` : 'none',
                }}>
                  <p style={{ color: C.t3, fontSize: 10, margin: '0 0 2px', fontWeight: 500 }}>≈ en {item.u}</p>
                  <p style={{ color: C.t2, fontSize: 15, fontFamily: MONO, fontWeight: 600, margin: 0 }}>{item.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={{
              height: 36, paddingLeft: 16, paddingRight: 16,
              background: 'transparent', border: `1px solid ${C.bd}`,
              borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB; (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bd; (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
            >
              <ArrowDownToLine style={{ width: 13, height: 13 }} /> Déposer
            </button>
            <button style={{
              height: 36, paddingLeft: 16, paddingRight: 16,
              background: C.teal, border: 'none', borderRadius: 9,
              color: '#fff', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
            >
              <ArrowUpFromLine style={{ width: 13, height: 13 }} /> Retirer
            </button>
          </div>
        </div>

        {/* Droite : liste wallets compacte */}
        <div style={{ background: C.l1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
            <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Répartition par réseau
            </p>
          </div>
          {WALLETS.map((w, i) => {
            const pct = Math.round((w.usdt / TOTAL_USDT) * 100);
            return (
              <div key={w.id} style={{
                padding: '16px 20px',
                borderBottom: i < WALLETS.length - 1 ? `1px solid ${C.bds}` : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <img src={w.logo} alt={w.chain}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${C.bds}`, flexShrink: 0 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <span style={{ color: C.t1, fontSize: 12, fontWeight: 600 }}>{w.chain}</span>
                      <span style={{ color: C.t3, fontSize: 10, marginLeft: 6 }}>{w.network}</span>
                    </div>
                    <span style={{ color: C.t2, fontSize: 13, fontFamily: MONO, fontWeight: 600 }}>
                      {w.usdt.toLocaleString('fr-FR')}
                      <span style={{ color: C.t3, fontSize: 10, marginLeft: 4 }}>USDT</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 99, background: C.l3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.tealH}, ${C.teal})`, borderRadius: 99 }} />
                    </div>
                    <span style={{ color: C.t3, fontSize: 10, fontFamily: MONO, flexShrink: 0 }}>{pct}%</span>
                  </div>
                </div>

                <button onClick={() => setQrWallet(w)} style={{
                  width: 30, height: 30, borderRadius: 8, background: 'transparent',
                  border: `1px solid ${C.bds}`, color: C.t3, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.12s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB; (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
                  title="Voir l'adresse"
                >
                  <QrCode style={{ width: 13, height: 13 }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — Taux en direct : une bande unifiée
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.28)', overflow: 'hidden',
      }}>
        {/* Label + last update */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderBottom: `1px solid ${C.bds}`,
          background: 'rgba(255,255,255,0.01)',
        }}>
          <span style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Taux de marché en direct
          </span>
          <span style={{ color: C.t3, fontSize: 10, fontFamily: MONO }}>
            {ratesLoading ? 'Chargement…' : lastUpdated ? (secAgo < 10 ? 'À l\'instant' : `il y a ${secAgo}s`) : '—'}
          </span>
        </div>

        {/* 3 taux séparés par des dividers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
          {liveRates.map((r, i) => (
            i % 2 === 0 ? (
              <div key={r.short} style={{ padding: '20px 24px', textAlign: 'center' }}>
                <p style={{ color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                  {r.pair}
                </p>
                <p style={{ color: ratesLoading ? C.t3 : C.t1, fontSize: 30, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
                  {ratesLoading ? '—' : r.fmt(r.value)}
                </p>
                <p style={{ color: C.t3, fontSize: 10, margin: '6px 0 0' }}>
                  1 USDT = {ratesLoading ? '…' : r.fmt(r.value)} {r.short}
                </p>
              </div>
            ) : (
              <div key={`sep-${i}`} style={{ background: C.bds, alignSelf: 'stretch' }} />
            )
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — Graphique + Alertes (asymétrique)
      ══════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gap: 14 }} className="grid grid-cols-1 lg:grid-cols-[1fr,300px]">

        {/* Graphique réel */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Évolution historique — 30 jours</h2>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>
                USDT / {chartPair} · {chartLoading ? 'Chargement…' : 'Données réelles CoinGecko'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['XOF', 'EUR', 'USD'] as const).map(p => (
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

          {chartLoading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: C.t3, fontSize: 12 }}>Chargement des données…</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
                  tickLine={false} axisLine={false} domain={['auto', 'auto']} width={48}
                  tickFormatter={(v: number) => chartPair === 'XOF' ? v.toFixed(0) : v.toFixed(4)}/>
                <Tooltip content={<ChartTooltip />}/>
                <Area type="monotone" dataKey="rate" stroke={C.teal} strokeWidth={2}
                  fill="url(#chartGrad)" dot={false}
                  activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alertes */}
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 14, padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: 0 }}>Alertes</h3>
              <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>{alerts.length} configurée{alerts.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setAlertModal(true)} style={{
              height: 30, paddingLeft: 10, paddingRight: 10,
              background: C.tealT, border: `1px solid ${C.tealB}`,
              borderRadius: 8, color: C.teal, fontSize: 11, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: FONT, transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus style={{ width: 11, height: 11 }} /> Nouvelle
            </button>
          </div>

          {alerts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 0', textAlign: 'center' }}>
              <Bell style={{ width: 28, height: 28, color: C.t3, opacity: 0.3, marginBottom: 10 }} />
              <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Aucune alerte</p>
              <p style={{ color: C.t3, fontSize: 11, margin: '4px 0 0', opacity: 0.6 }}>Crée une alerte de taux</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {alerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: C.l2, border: `1px solid ${a.active ? C.tealB : C.bds}`,
                  borderRadius: 10, padding: '10px 12px', transition: 'border-color 0.15s',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.active ? C.teal : C.t3, flexShrink: 0 }} />
                  <span style={{ color: a.active ? C.t1 : C.t2, fontSize: 12, fontFamily: MONO, flex: 1 }}>
                    {a.pair} {a.condition} {a.threshold}
                  </span>
                  <button onClick={() => toggleAlert(a.id)} style={{
                    fontSize: 10, color: a.active ? C.teal : C.t3,
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0,
                  }}>{a.active ? 'Actif' : 'Off'}</button>
                  <button onClick={() => deleteAlert(a.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 0, display: 'flex',
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
      {qrWallet  && <QRModal wallet={qrWallet} onClose={() => setQrWallet(null)} />}
      {alertModal && <AlertModal onAdd={addAlert} onClose={() => setAlertModal(false)} />}
    </div>
  );
}
