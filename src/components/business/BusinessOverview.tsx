import { useState, useEffect } from 'react';
import { Send, Plus, ArrowUpRight, TrendingUp, Users, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string; id?: string } | null;
  onNavigate: (section: string) => void;
}

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const USDT_LOGO = 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png';

// Taux USDT réels approximatifs (mis à jour manuellement — à connecter à une API en production)
const LIVE_RATES = {
  XOF: { value: 620.5,  change: +0.18, label: 'XOF · Franc CFA' },
  EUR: { value: 0.9245, change: -0.06, label: 'EUR · Euro' },
  USD: { value: 1.0000, change: 0,     label: 'USD · Dollar' },
};

// Données de volume sur 7 jours (exemples réalistes pour démonstration)
const VOLUME_DEMO = [
  { jour: 'Lun', usdt: 1200 },
  { jour: 'Mar', usdt: 3400 },
  { jour: 'Mer', usdt: 800  },
  { jour: 'Jeu', usdt: 5200 },
  { jour: 'Ven', usdt: 2100 },
  { jour: 'Sam', usdt: 4800 },
  { jour: "Auj", usdt: 1600 },
];

// Volume mensuel sur 6 mois (démonstration)
const MONTHLY_DEMO = [
  { mois: 'Déc', usdt: 18400, xof: Math.round(18400 * 620.5) },
  { mois: 'Jan', usdt: 24200, xof: Math.round(24200 * 620.5) },
  { mois: 'Fév', usdt: 19800, xof: Math.round(19800 * 620.5) },
  { mois: 'Mar', usdt: 31500, xof: Math.round(31500 * 620.5) },
  { mois: 'Avr', usdt: 28700, xof: Math.round(28700 * 620.5) },
  { mois: 'Mai', usdt: 22100, xof: Math.round(22100 * 620.5) },
];

function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; bd: string; color: string; label: string; Icon: React.FC<any> }> = {
    pending:    { bg: C.amberT, bd: C.amberB, color: C.amber, label: 'En attente',  Icon: Clock },
    processing: { bg: C.blueT,  bd: C.blueB,  color: C.blue,  label: 'En cours',    Icon: Loader2 },
    completed:  { bg: C.emT,    bd: C.emB,    color: C.em,    label: 'Complété',    Icon: CheckCircle2 },
    failed:     { bg: C.redT,   bd: C.redB,   color: C.red,   label: 'Échoué',      Icon: XCircle },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: c.bg, border: `1px solid ${c.bd}`, color: c.color, whiteSpace: 'nowrap',
    }}>
      <c.Icon style={{ width: 9, height: 9 }} />
      {c.label}
    </span>
  );
}

function InitialAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = (parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: 'rgba(59,150,143,0.18)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700,
    }}>{initials}</div>
  );
}

// Tooltip personnalisé pour le graphique
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8,
      padding: '8px 12px', fontFamily: FONT,
    }}>
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0 }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
      {payload[0].payload?.xof && (
        <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>
          ≈ {payload[0].payload.xof.toLocaleString('fr-FR')} XOF
        </p>
      )}
    </div>
  );
}

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [payments, setPayments]   = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [profile, setProfile]     = useState<any>(null);
  const [tick, setTick]           = useState(0);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key('payments')) || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
      setProfile(JSON.parse(localStorage.getItem(key('profile')) || 'null'));
    } catch {}
  }, [userId]);

  // Rafraîchissement toutes les 30 secondes (simulation)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const completed    = payments.filter(p => p.status === 'completed');
  const pending      = payments.filter(p => ['pending', 'processing'].includes(p.status));
  const totalVolume  = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const monthlyLimit = 10000; // USDT — lié au niveau KYC
  const limitUsed    = Math.min(totalVolume, monthlyLimit);
  const limitPct     = Math.round((limitUsed / monthlyLimit) * 100);
  const recent       = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const firstName = (user?.name || '').split(' ')[0] || 'là';
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Données volume : réelles si dispo, sinon exemple
  const volumeData = payments.length > 0
    ? (() => {
        const days: Record<string, number> = {};
        const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Auj'];
        labels.forEach(l => { days[l] = 0; });
        payments.forEach(p => {
          const d = new Date(p.createdAt).getDay();
          const label = labels[d === 0 ? 6 : d - 1] || 'Auj';
          days[label] = (days[label] || 0) + (p.amount || 0);
        });
        return labels.map(jour => ({ jour, usdt: days[jour] || 0 }));
      })()
    : VOLUME_DEMO;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT, paddingTop: 8 }}>

      {/* ── Greeting ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Bonjour, {firstName} 👋
          </h2>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0', textTransform: 'capitalize' }}>{today}</p>
        </div>
        <button
          onClick={() => onNavigate('payment')}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            height: 38, paddingLeft: 16, paddingRight: 16,
            background: C.teal, border: 'none', borderRadius: 8,
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
          onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
        >
          <Send style={{ width: 14, height: 14 }} />
          Nouveau paiement
        </button>
      </div>

      {/* ── Taux USDT live ────────────────────────────────────────── */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={USDT_LOGO} alt="USDT" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 10, color: C.t3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>1 USDT =</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.em, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, color: C.t3 }}>Taux en direct</span>
              <span style={{ fontSize: 10, color: C.t3 }}>· Mis à jour il y a {30 - (tick % 2)} s</span>
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: C.bds, flexShrink: 0 }} className="hidden sm:block" />

        {Object.entries(LIVE_RATES).map(([code, rate]) => (
          <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <p style={{ fontSize: 10, color: C.t3, margin: 0 }}>{rate.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                  {rate.value.toLocaleString('fr-FR', { minimumFractionDigits: code === 'XOF' ? 1 : 4 })}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  color: rate.change > 0 ? C.em : rate.change < 0 ? C.red : C.t3,
                }}>
                  {rate.change > 0 ? '+' : ''}{rate.change.toFixed(2)}%
                </span>
              </div>
            </div>
            {code !== 'USD' && <div style={{ width: 1, height: 32, background: C.bds }} />}
          </div>
        ))}
      </div>

      {/* ── KPI cards (2×2 sur mobile, 4 colonnes sur desktop) ───── */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden',
        display: 'grid',
      }} className="grid grid-cols-2 md:grid-cols-4">
        {[
          {
            label: 'Volume ce mois',
            value: totalVolume > 0 ? totalVolume.toLocaleString('fr-FR') : '0',
            unit: 'USDT',
            sub: `≈ ${(totalVolume * LIVE_RATES.XOF.value).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF`,
            icon: <img src={USDT_LOGO} alt="USDT" style={{ width: 16, height: 16, borderRadius: '50%' }} />,
            accent: C.teal,
          },
          {
            label: 'Transactions',
            value: String(payments.length),
            unit: '',
            sub: `${completed.length} complétées · ${pending.length} en cours`,
            icon: <TrendingUp style={{ width: 14, height: 14, color: C.blue }} />,
            accent: C.blue,
          },
          {
            label: 'Fournisseurs',
            value: String(suppliers.length),
            unit: '',
            sub: suppliers.length > 0 ? 'Contacts actifs' : 'Aucun encore',
            icon: <Users style={{ width: 14, height: 14, color: C.purple || '#a855f7' }} />,
            accent: '#a855f7',
          },
          {
            label: 'Économies vs SWIFT',
            value: totalVolume > 0 ? Math.round(totalVolume * 0.04).toLocaleString('fr-FR') : '0',
            unit: 'USDT',
            sub: 'Frais bancaires évités',
            icon: <ArrowUpRight style={{ width: 14, height: 14, color: C.em }} />,
            accent: C.em,
          },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            padding: '18px 20px',
            borderRight: i < 3 ? `1px solid ${C.bds}` : 'none',
            borderBottom: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: `${stat.accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: 11, color: C.t3, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {stat.value}
              </span>
              {stat.unit && <span style={{ fontSize: 12, color: C.t3 }}>{stat.unit}</span>}
            </div>
            <p style={{ fontSize: 11, color: C.t3, marginTop: 4, margin: '4px 0 0' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Limite mensuelle KYC ──────────────────────────────────── */}
      {limitPct > 50 && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 16px', borderRadius: 10,
          background: limitPct >= 90 ? C.redT : C.amberT,
          border: `1px solid ${limitPct >= 90 ? C.redB : C.amberB}`,
        }}>
          <AlertCircle style={{ width: 16, height: 16, color: limitPct >= 90 ? C.red : C.amber, flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>
                Limite mensuelle Niveau 1 — {limitPct}% utilisée
              </span>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>
                {limitUsed.toLocaleString()} / {monthlyLimit.toLocaleString()} USDT
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${limitPct}%`,
                background: limitPct >= 90 ? C.red : C.amber,
                borderRadius: 99, transition: 'width 0.4s',
              }} />
            </div>
            <button
              onClick={() => onNavigate('compliance')}
              style={{ fontSize: 11, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6, fontFamily: FONT }}
            >
              Augmenter ma limite via Conformité KYC →
            </button>
          </div>
        </div>
      )}

      {/* ── Graphique volume + Transactions récentes ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: 16 }}>

        {/* Graphique volume 7 jours */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}
          className="lg:col-span-3">
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Volume des 7 derniers jours</h3>
              <p style={{ fontSize: 11, color: C.t3, margin: '3px 0 0' }}>En USDT · {payments.length === 0 && 'Données de démonstration'}</p>
            </div>
            {payments.length === 0 && (
              <span style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6, padding: '4px 8px' }}>
                Exemple
              </span>
            )}
          </div>
          <div style={{ padding: '20px 16px 12px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volumeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
                <XAxis dataKey="jour" tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="usdt" stroke={C.teal} strokeWidth={2}
                  fill="url(#volumeGrad)" dot={false} activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions récentes */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          className="lg:col-span-2">
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Activité récente</h3>
            <button onClick={() => onNavigate('history')}
              style={{ fontSize: 11, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
              Tout voir →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: C.tealT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Send style={{ width: 18, height: 18, color: C.teal }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: C.t2, fontSize: 13, fontWeight: 500, margin: 0 }}>Aucune transaction</p>
                <p style={{ color: C.t3, fontSize: 11, marginTop: 4, margin: '4px 0 0' }}>
                  Votre activité apparaîtra ici
                </p>
              </div>
              <button
                onClick={() => onNavigate('payment')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
                  color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`,
                  borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontFamily: FONT,
                }}
              >
                <Plus style={{ width: 13, height: 13 }} />
                Premier paiement
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {recent.map((tx, i) => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px',
                  borderBottom: i < recent.length - 1 ? `1px solid ${C.bds}` : 'none',
                }}>
                  <InitialAvatar name={tx.supplierName || 'F'} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 10, color: C.t3, margin: '2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      {tx.network ? ` · ${tx.network}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <img src={USDT_LOGO} alt="USDT" style={{ width: 12, height: 12, borderRadius: '50%' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                        {(tx.amount || 0).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div style={{ marginTop: 3 }}>
                      <StatusPill status={tx.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Volume mensuel (BarChart 6 mois) ─────────────────────── */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Volume mensuel</h3>
            <p style={{ fontSize: 11, color: C.t3, margin: '3px 0 0' }}>6 derniers mois · En USDT{payments.length === 0 && ' · Données de démonstration'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total 6 mois</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                {MONTHLY_DEMO.reduce((s, m) => s + m.usdt, 0).toLocaleString('fr-FR')} <span style={{ fontSize: 11, color: C.t3, fontWeight: 400 }}>USDT</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 16px 12px' }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={MONTHLY_DEMO} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
              <XAxis dataKey="mois" tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,150,143,0.06)' }} />
              <Bar dataKey="usdt" fill={C.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Actions rapides ───────────────────────────────────────── */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Actions rapides</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 0 }}>
          {[
            { label: 'Nouveau paiement',    sub: 'Payer un fournisseur',     icon: Send,    color: C.teal,          section: 'payment',   primary: true  },
            { label: 'Ajouter fournisseur', sub: 'Enregistrer un contact',   icon: Plus,    color: C.blue,          section: 'suppliers', primary: false },
            { label: 'Voir analytique',     sub: 'Performances & insights',  icon: TrendingUp, color: '#a855f7',    section: 'analytics', primary: false },
            { label: 'Lot de paiements',    sub: 'Payer plusieurs à la fois', icon: Users,   color: C.amber,         section: 'batch',     primary: false },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.section)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 18px', background: 'transparent', border: 'none',
                  borderRight: i < 3 ? `1px solid ${C.bds}` : 'none',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                  width: '100%',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.l2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: `${item.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 16, height: 16, color: item.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0' }}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
