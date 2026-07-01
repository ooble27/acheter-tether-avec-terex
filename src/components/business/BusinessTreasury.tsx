import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#ffffff', tealH: '#2d7870', tealT: 'rgba(255, 255, 255,0.08)', tealB: 'rgba(255, 255, 255,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#565656',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const WALLETS = [
  { id: 'trc20', chain: 'TRC20', network: 'TRON Network',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', usdt: 45230, address: 'T9xDRaWvH3qKZ1nM8bUoFpY5jL2wX6vRs' },
  { id: 'bep20', chain: 'BEP20', network: 'BNB Smart Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', usdt: 12450, address: '0x3A7b9c2D4E8F1a6B5C0D9E3F7a2B4C8D1E5F3A9' },
  { id: 'erc20', chain: 'ERC20', network: 'Ethereum',        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', usdt:  8100, address: '0xaB7c3D2E9F5a1C4B8D0E7F3a6C2D5E9F1B4A8C3' },
];
const TOTAL_USDT = WALLETS.reduce((s, w) => s + w.usdt, 0);

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const display = v >= 10
    ? v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
    : v.toFixed(4);
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 10, margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>{display}</p>
    </div>
  );
}

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
        background: '#1a1a1a', border: `1px solid ${C.bd}`, borderRadius: 18,
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
        background: '#1a1a1a', border: `1px solid ${C.bd}`, borderRadius: 18,
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

interface Alert { id: number; pair: string; condition: '<' | '>'; threshold: string; active: boolean }

type ChartPoint = { day: string; rate: number };

const FrozenAreaChart = React.memo(
  ({ data, pair }: { data: ChartPoint[]; pair: 'XOF' | 'EUR' | 'USD' }) => (
    <div style={{ width: '100%', height: 250, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 4, right: 2, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.teal} stopOpacity={0.22} />
              <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: C.t3, fontSize: 9, fontFamily: FONT }}
            tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: MONO }}
            tickLine={false} axisLine={false} domain={['auto', 'auto']} width={54}
            tickFormatter={(v: number) =>
              pair === 'XOF' ? v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : v.toFixed(4)
            } />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="rate" stroke={C.teal} strokeWidth={1.5}
            fill="url(#cGrad)" dot={false} isAnimationActive={false}
            activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ),
  (prev, next) => prev.data === next.data && prev.pair === next.pair
);

export function BusinessTreasury({ user }: { user: { email: string; name: string; id?: string } | null }) {
  void user;

  // Taux — on garde les anciennes valeurs pendant le refresh (pas de clignotement)
  const { usdtToCfa, loading: ratesLoading } = useCryptoRates();
  // Taux gelé pour le graphique — évite de recalculer chartData à chaque tick
  const frozenCfaRef = useRef(0);
  if (usdtToCfa > 0 && frozenCfaRef.current === 0) frozenCfaRef.current = usdtToCfa;
  const chartCfa = frozenCfaRef.current || usdtToCfa;
  const [usdtToEur, setUsdtToEur] = useState(0.9245);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!ratesLoading) setInitialLoad(false);
  }, [ratesLoading]);

  // EUR : fetch une seule fois au montage
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD', { signal: AbortSignal.timeout(10000) })
      .then(r => r.json())
      .then(d => { if (d.rates?.EUR) setUsdtToEur(d.rates.EUR); })
      .catch(() => {});
  }, []);

  // Graphique : fetch USD + conversion locale. Fallback synthétique si API indisponible.
  const [rawPrices, setRawPrices] = useState<{ ts: number; usd: number }[]>([]);
  const [chartPair, setChartPair] = useState<'XOF' | 'EUR' | 'USD'>('XOF');
  const [chartDays, setChartDays] = useState<7 | 30>(30);
  const [chartLoading, setChartLoading] = useState(true);

  const makeFallback = (days: number): { ts: number; usd: number }[] => {
    const now = Date.now();
    return Array.from({ length: days }, (_, i) => {
      const offset = days - 1 - i;
      const ts = now - offset * 86_400_000;
      const usd = 1 + Math.sin(i * 0.6) * 0.0008 + Math.cos(i * 1.2) * 0.0004;
      return { ts, usd: parseFloat(usd.toFixed(6)) };
    });
  };

  useEffect(() => {
    setChartLoading(true);
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 12000);

    fetch(
      `https://api.coingecko.com/api/v3/coins/tether/market_chart?vs_currency=usd&days=${chartDays}&interval=daily`,
      { signal: ctrl.signal }
    )
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => {
        clearTimeout(tid);
        if (Array.isArray(d.prices) && d.prices.length > 0) {
          setRawPrices(d.prices.map(([ts, usd]: [number, number]) => ({ ts, usd })));
        } else {
          setRawPrices(makeFallback(chartDays));
        }
      })
      .catch(() => setRawPrices(makeFallback(chartDays)))
      .finally(() => setChartLoading(false));

    return () => { ctrl.abort(); clearTimeout(tid); };
  }, [chartDays]);

  // Conversion locale — gelée après premier chargement réel (jamais de recalcul)
  const chartData = useMemo(() => rawPrices.map(p => ({
    day: new Date(p.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    rate: chartPair === 'XOF' ? Math.round(p.usd * chartCfa)
         : chartPair === 'EUR' ? parseFloat((p.usd * usdtToEur).toFixed(4))
         : parseFloat(p.usd.toFixed(4)),
  })), [rawPrices, chartPair, chartCfa, usdtToEur]);

  // Geler le rendu du graphique après premier chargement
  const frozenChartRef = useRef<typeof chartData>([]);
  if (chartData.length > 0 && frozenChartRef.current.length === 0) {
    frozenChartRef.current = chartData;
  }
  const displayChartData = frozenChartRef.current.length > 0 ? frozenChartRef.current : chartData;

  const totalXof = initialLoad ? null : Math.round(TOTAL_USDT * usdtToCfa);
  const totalEur = initialLoad ? null : Math.round(TOTAL_USDT * usdtToEur);

  const liveRates = [
    {
      short: 'XOF',
      label: 'USDT / XOF',
      display: initialLoad ? '—' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' XOF',
    },
    {
      short: 'EUR',
      label: 'USDT / EUR',
      display: initialLoad ? '—' : usdtToEur.toFixed(4) + ' EUR',
    },
    {
      short: 'USD',
      label: 'USDT / USD',
      display: '1.0000 USD',
    },
  ];

  const [alerts, setAlerts]         = useState<Alert[]>([{ id: 1, pair: 'USDT/XOF', condition: '<', threshold: '560', active: true }]);
  const [alertCtr, setAlertCtr]     = useState(2);
  const [alertModal, setAlertModal] = useState(false);
  const [qrWallet, setQrWallet]     = useState<typeof WALLETS[0] | null>(null);

  const addAlert = useCallback((a: Omit<Alert, 'id' | 'active'>) => {
    setAlerts(prev => [...prev, { ...a, id: alertCtr, active: true }]);
    setAlertCtr(c => c + 1);
  }, [alertCtr]);

  const toggleAlert = useCallback((id: number) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a)), []);
  const deleteAlert = useCallback((id: number) =>
    setAlerts(prev => prev.filter(a => a.id !== id)), []);

  const cardSt: React.CSSProperties = {
    background: C.l1, border: `1px solid ${C.bds}`,
    borderRadius: 14, overflow: 'hidden',
  };

  const sectionHead: React.CSSProperties = {
    color: C.t3, fontSize: 10, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0,
  };

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8 }}>

      {/* Layout 2 colonnes : héro + graphique à gauche / wallets + taux + alertes à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ COLONNE GAUCHE ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Héro — balance totale */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #1a1a1a 100%)',
            border: `1px solid ${C.bds}`, borderRadius: 16,
            padding: '30px 28px 26px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <img src={usdtLogo} alt="USDT"
                style={{ width: 26, height: 26, borderRadius: '50%' }} />
              <span style={{ ...sectionHead }}>Trésorerie totale</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <p style={{
                color: C.t1, fontSize: 50, fontWeight: 700, fontFamily: MONO,
                margin: 0, letterSpacing: '-0.04em', lineHeight: 1,
              }}>
                {TOTAL_USDT.toLocaleString('fr-FR')}
                <span style={{ color: C.t3, fontSize: 18, fontWeight: 400, marginLeft: 10, letterSpacing: 0 }}>USDT</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
              <div style={{ paddingRight: 24 }}>
                <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>≈ en XOF</p>
                <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                  {totalXof === null ? '—' : totalXof.toLocaleString('fr-FR')}
                </p>
              </div>
              <div style={{ width: 1, background: C.bds, alignSelf: 'stretch', marginRight: 24 }} />
              <div>
                <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>≈ en EUR</p>
                <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                  {totalEur === null ? '—' : totalEur.toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  height: 36, paddingLeft: 16, paddingRight: 16,
                  background: 'transparent', border: `1px solid ${C.bd}`,
                  borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: FONT, whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB;
                  (e.currentTarget as HTMLButtonElement).style.color = C.teal;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.bd;
                  (e.currentTarget as HTMLButtonElement).style.color = C.t2;
                }}
              >
                <ArrowDownToLine style={{ width: 13, height: 13 }} /> Déposer
              </button>
              <button
                style={{
                  height: 36, paddingLeft: 18, paddingRight: 18,
                  background: C.teal, border: 'none', borderRadius: 9,
                  color: '#fff', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: FONT, whiteSpace: 'nowrap', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
                onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
              >
                <ArrowUpFromLine style={{ width: 13, height: 13 }} /> Retirer
              </button>
            </div>
          </div>

          {/* Graphique */}
          <div style={{ ...cardSt, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h2 style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0 }}>
                  Évolution {chartDays} jours
                </h2>
                <p style={{ color: C.t3, fontSize: 10, margin: '3px 0 0' }}>
                  {chartLoading ? 'Chargement…' : 'USDT / ' + chartPair}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {/* Sélecteur de durée */}
                {([7, 30] as const).map(d => (
                  <button key={d} onClick={() => setChartDays(d)} style={{
                    height: 26, paddingLeft: 10, paddingRight: 10, borderRadius: 7,
                    border: `1px solid ${chartDays === d ? C.tealB : C.bds}`,
                    background: chartDays === d ? C.tealT : 'transparent',
                    color: chartDays === d ? C.teal : C.t3,
                    fontSize: 11, fontWeight: chartDays === d ? 600 : 400,
                    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s',
                  }}>{d}j</button>
                ))}
                <div style={{ width: 1, background: C.bds, margin: '0 2px' }} />
                {/* Sélecteur de paire */}
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
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: C.t3, fontSize: 12 }}>Chargement des données…</p>
              </div>
            ) : displayChartData.length === 0 ? (
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: C.t3, fontSize: 12 }}>Données indisponibles</p>
              </div>
            ) : (
              <FrozenAreaChart data={displayChartData} pair={chartPair} />
            )}
          </div>
        </div>

        {/* ══ COLONNE DROITE ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Portefeuilles — sans barres */}
          <div style={cardSt}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <p style={sectionHead}>Portefeuilles</p>
            </div>
            {WALLETS.map((w, i) => (
              <div key={w.id}
                style={{
                  padding: '14px 18px',
                  borderBottom: i < WALLETS.length - 1 ? `1px solid ${C.bds}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <img src={w.logo} alt={w.chain}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${C.bds}`, flexShrink: 0 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0 }}>{w.chain}</p>
                  <p style={{ color: C.t3, fontSize: 10, margin: '2px 0 0' }}>{w.network}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: C.t1, fontSize: 13, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                    {w.usdt.toLocaleString('fr-FR')}
                  </p>
                  <p style={{ color: C.t3, fontSize: 10, margin: '2px 0 0' }}>USDT</p>
                </div>
                <button onClick={() => setQrWallet(w)}
                  style={{
                    width: 28, height: 28, borderRadius: 7, background: 'transparent',
                    border: `1px solid ${C.bds}`, color: C.t3, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.tealB;
                    (e.currentTarget as HTMLButtonElement).style.color = C.teal;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds;
                    (e.currentTarget as HTMLButtonElement).style.color = C.t3;
                  }}
                  title="Voir l'adresse"
                >
                  <QrCode style={{ width: 12, height: 12 }} />
                </button>
              </div>
            ))}
          </div>

          {/* Taux de marché — 3 lignes séparées, bug EUR corrigé */}
          <div style={cardSt}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <p style={sectionHead}>Taux de marché</p>
            </div>
            {liveRates.map((r, i) => (
              <div key={r.short} style={{
                padding: '14px 18px',
                borderBottom: i < liveRates.length - 1 ? `1px solid ${C.bds}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <span style={{ color: C.t3, fontSize: 11, fontFamily: MONO }}>1 USDT =</span>
                <span style={{
                  color: initialLoad ? C.t3 : C.t1,
                  fontSize: 14, fontFamily: MONO, fontWeight: 600,
                  transition: 'color 0.4s',
                }}>
                  {r.display}
                </span>
              </div>
            ))}
          </div>

          {/* Alertes */}
          <div style={cardSt}>
            <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${C.bds}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={sectionHead}>Alertes</p>
              <button onClick={() => setAlertModal(true)} style={{
                height: 26, paddingLeft: 10, paddingRight: 10,
                background: C.tealT, border: `1px solid ${C.tealB}`,
                borderRadius: 7, color: C.teal, fontSize: 11, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: FONT, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <Plus style={{ width: 10, height: 10 }} /> Nouvelle
              </button>
            </div>

            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '22px 0', textAlign: 'center' }}>
                  <Bell style={{ width: 22, height: 22, color: C.t3, opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                  <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Aucune alerte configurée</p>
                </div>
              ) : alerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: C.l2, border: `1px solid ${a.active ? C.tealB : C.bds}`,
                  borderRadius: 9, padding: '9px 12px', transition: 'border-color 0.15s',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.active ? C.teal : C.t3, flexShrink: 0 }} />
                  <span style={{ color: a.active ? C.t1 : C.t2, fontSize: 11, fontFamily: MONO, flex: 1 }}>
                    {a.pair} {a.condition} {a.threshold}
                  </span>
                  <button onClick={() => toggleAlert(a.id)} style={{
                    fontSize: 10, color: a.active ? C.teal : C.t3,
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0,
                  }}>
                    {a.active ? 'Actif' : 'Off'}
                  </button>
                  <button onClick={() => deleteAlert(a.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 0,
                    display: 'flex', transition: 'color 0.12s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {qrWallet   && <QRModal wallet={qrWallet} onClose={() => setQrWallet(null)} />}
      {alertModal && <AlertModal onAdd={addAlert} onClose={() => setAlertModal(false)} />}
    </div>
  );
}
