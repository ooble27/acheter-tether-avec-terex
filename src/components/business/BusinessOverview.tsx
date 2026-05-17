import { useState, useEffect } from 'react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Send, Plus, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onNavigate: (section: string) => void;
}

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868', t4: '#333333',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const VOLUME_DEMO = [
  { jour: 'Lun', usdt: 1200 },
  { jour: 'Mar', usdt: 3400 },
  { jour: 'Mer', usdt: 800  },
  { jour: 'Jeu', usdt: 5200 },
  { jour: 'Ven', usdt: 2100 },
  { jour: 'Sam', usdt: 4800 },
  { jour: 'Auj', usdt: 1600 },
];

function InitialAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'rgba(59,150,143,0.22)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
    </div>
  );
}

const STATUS_CONFIG: Record<string, { dot: string; label: string }> = {
  pending:    { dot: C.amber, label: 'En attente' },
  processing: { dot: C.blue,  label: 'En cours'   },
  completed:  { dot: C.em,    label: 'Complété'   },
  failed:     { dot: C.red,   label: 'Échoué'     },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { dot: C.t3, label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      paddingLeft: 9, paddingRight: 9, paddingTop: 3, paddingBottom: 3,
      borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: C.l3, border: `1px solid ${C.bds}`, color: C.t2,
      fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function LiveRateCard() {
  const { usdtToCfa, loading, lastUpdated } = useCryptoRates();
  const [secAgo, setSecAgo] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      if (lastUpdated) setSecAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 5000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  return (
    <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', fontFamily: FONT, textTransform: 'uppercase' }}>
            USDT / FCFA
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: loading ? C.t3 : C.em,
              boxShadow: !loading ? `0 0 0 3px rgba(34,197,94,0.15)` : 'none',
            }} />
            <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>
              {loading ? 'Chargement…' : 'Temps réel'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: loading ? C.t3 : C.t1, fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
            {usdtToCfa.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span style={{ fontSize: 11, color: C.t2, fontFamily: FONT }}>XOF/USDT</span>
        </div>
        <p style={{ fontSize: 10, color: C.t3, marginTop: 4, fontFamily: FONT, margin: '4px 0 0' }}>
          {lastUpdated
            ? secAgo < 10 ? 'À l\'instant' : `Actualisé il y a ${secAgo}s`
            : 'Actualisation…'}
        </p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0 }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
    </div>
  );
}

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key('payments')) || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
      setProfile(JSON.parse(localStorage.getItem(key('profile')) || 'null'));
    } catch {}
  }, [userId]);

  const completed = payments.filter(p => p.status === 'completed');
  const totalVolume = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = payments.filter(p => ['pending', 'processing'].includes(p.status)).length;
  const savings = Math.round(totalVolume * 0.03);
  const recent = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  const volumeData = payments.length > 0
    ? (() => {
        const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Auj'];
        const days: Record<string, number> = {};
        labels.forEach(l => { days[l] = 0; });
        payments.forEach(p => {
          const d = new Date(p.createdAt).getDay();
          const label = labels[d === 0 ? 6 : d - 1] || 'Auj';
          days[label] = (days[label] || 0) + (p.amount || 0);
        });
        return labels.map(jour => ({ jour, usdt: days[jour] || 0 }));
      })()
    : VOLUME_DEMO;

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = (user?.name || '').split(' ')[0] || 'là';

  const STATS = [
    { label: 'Volume total',  value: totalVolume > 0 ? totalVolume.toLocaleString('fr-FR') : '—', unit: totalVolume > 0 ? 'USDT' : '', sub: 'Transactions complétées' },
    { label: 'En cours',      value: String(pendingCount), unit: '', sub: pendingCount > 0 ? 'Paiements actifs' : 'Aucune en cours' },
    { label: 'Fournisseurs',  value: String(suppliers.length), unit: '', sub: 'Contacts enregistrés' },
    { label: 'Économies',     value: totalVolume > 0 ? `$${savings.toLocaleString('fr-FR')}` : '—', unit: '', sub: 'vs SWIFT estimé' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT, paddingTop: 8 }}>

      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Bonjour, {firstName} 👋
          </h2>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>{today}</p>
        </div>
        {!profile?.companyName && (
          <button
            onClick={() => onNavigate('profile')}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: C.teal, border: `1px solid ${C.tealB}`,
              background: 'transparent', padding: '5px 10px', borderRadius: 6,
              cursor: 'pointer', fontFamily: FONT,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealT)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Configurer le profil →
          </button>
        )}
      </div>

      {/* 4 stat cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{
          background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{ padding: '20px 22px', borderRight: i < 3 ? `1px solid ${C.bds}` : 'none', position: 'relative', overflow: 'hidden' }}>
            {/* Mini SVG illustration top-right */}
            <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.18 }}>
              {i === 0 && (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <path d="M8 22 L16 14 L24 20 L36 10" stroke="#3B968F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 30 L16 22 L24 28 L36 18" stroke="#3B968F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
                  <circle cx="36" cy="10" r="3" stroke="#3B968F" strokeWidth="1.5"/>
                  <path d="M30 36 L38 36 M34 32 L34 40" stroke="#3B968F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              {i === 1 && (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="13" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2"/>
                  <path d="M22 10 L22 22 L30 28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="22" cy="22" r="2" fill="#f59e0b"/>
                  <path d="M14 8 L14 6 M30 8 L30 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              {i === 2 && (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="14" cy="16" r="5" stroke="#3b82f6" strokeWidth="1.5"/>
                  <circle cx="30" cy="16" r="5" stroke="#3b82f6" strokeWidth="1.5"/>
                  <circle cx="22" cy="30" r="5" stroke="#3b82f6" strokeWidth="1.5"/>
                  <path d="M19 16 L25 16" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 1"/>
                  <path d="M16 21 L20 26" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 1"/>
                  <path d="M28 21 L24 26" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 1"/>
                </svg>
              )}
              {i === 3 && (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <path d="M10 34 L10 24 L17 24 L17 34" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 34 L19 18 L26 18 L26 34" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28 34 L28 12 L35 12 L35 34" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 34 L37 34" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 20 L20 14 L28 10" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 1"/>
                </svg>
              )}
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.t1, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {stat.value}
              </span>
              {stat.unit && <span style={{ fontSize: 12, color: C.t2 }}>{stat.unit}</span>}
            </div>
            <p style={{ fontSize: 11, color: C.t3, marginTop: 4, margin: '4px 0 0' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Featured sections — illustrated navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 14 }}>
        {[
          {
            key: 'payment',
            title: 'Paiements',
            desc: 'Envoyez des fonds à vos fournisseurs en USDT via TRC-20 ou ERC-20',
            svg: (
              <svg width="100%" height="100%" viewBox="0 0 180 90" fill="none" style={{ display: 'block' }}>
                {/* Card with stripe */}
                <rect x="18" y="18" width="84" height="54" rx="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
                <path d="M18 32 L102 32" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <rect x="26" y="40" width="34" height="7" rx="3.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <rect x="26" y="52" width="22" height="5" rx="2.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                <rect x="26" y="60" width="28" height="5" rx="2.5" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                {/* Arrow */}
                <path d="M112 45 L134 45" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M126 38 L134 45 L126 52" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Wallet */}
                <rect x="142" y="26" width="22" height="38" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
                <circle cx="153" cy="50" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <path d="M150 50 L152 52 L156 48" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Dots */}
                <circle cx="154" cy="34" r="2" fill="rgba(255,255,255,0.25)"/>
                <circle cx="160" cy="34" r="2" fill="rgba(255,255,255,0.18)"/>
              </svg>
            ),
          },
          {
            key: 'treasury',
            title: 'Trésorerie',
            desc: 'Gérez vos wallets, taux de change et liquidités en temps réel',
            svg: (
              <svg width="100%" height="100%" viewBox="0 0 180 90" fill="none" style={{ display: 'block' }}>
                {/* Vault / safe shape */}
                <rect x="20" y="15" width="70" height="62" rx="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
                <rect x="28" y="23" width="54" height="46" rx="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                <circle cx="55" cy="46" r="12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
                <circle cx="55" cy="46" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <path d="M55 34 L55 38 M55 54 L55 58 M43 46 L47 46 M63 46 L67 46" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M90 26 L90 77" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                {/* Bars right side */}
                <rect x="100" y="52" width="12" height="22" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <rect x="118" y="42" width="12" height="32" rx="2" stroke="rgba(255,255,255,0.42)" strokeWidth="1"/>
                <rect x="136" y="32" width="12" height="42" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                <path d="M96 78 L162 78" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round"/>
                {/* Trend arrow */}
                <path d="M100 56 L118 46 L136 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
              </svg>
            ),
          },
          {
            key: 'analytics',
            title: 'Analytique',
            desc: 'Visualisez vos volumes, tendances et rapports mensuels',
            svg: (
              <svg width="100%" height="100%" viewBox="0 0 180 90" fill="none" style={{ display: 'block' }}>
                {/* Axes */}
                <path d="M22 72 L22 16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M22 72 L164 72" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                {/* Grid lines */}
                <path d="M22 56 L160 56" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <path d="M22 40 L160 40" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <path d="M22 24 L160 24" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                {/* Area chart */}
                <path d="M22 72 L52 54 L82 60 L112 38 L142 44 L162 26 L162 72 Z" fill="rgba(255,255,255,0.04)"/>
                <path d="M22 72 L52 54 L82 60 L112 38 L142 44 L162 26" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Data points */}
                <circle cx="52" cy="54" r="3" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
                <circle cx="112" cy="38" r="3" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
                <circle cx="162" cy="26" r="3" fill="rgba(255,255,255,0.4)"/>
                {/* Tick marks */}
                <path d="M52 72 L52 70 M82 72 L82 70 M112 72 L112 70 M142 72 L142 70 M162 72 L162 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <path d="M22 56 L20 56 M22 40 L20 40 M22 24 L20 24" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </svg>
            ),
          },
        ].map((card, i) => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.key)}
            className={i === 0 ? 'col-span-2 sm:col-span-1' : undefined}
            style={{
              background: 'linear-gradient(135deg, #1e1e1e 0%, #141414 100%)', border: `1px solid ${C.bds}`,
              borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
              textAlign: 'left', padding: 0, fontFamily: FONT,
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.18)`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.08)`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ height: 90, padding: '12px 16px' }}>
              {card.svg}
            </div>
            <div style={{ padding: '12px 16px 16px', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', margin: '0 0 4px' }}>{card.title}</p>
              <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.45)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid: transactions + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr]" style={{ gap: 16 }}>

        {/* LEFT: Recent transactions */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Transactions récentes</h3>
            <button onClick={() => onNavigate('history')}
              style={{ fontSize: 12, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}>
              Tout voir →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.tealT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Send style={{ width: 16, height: 16, color: C.teal }} />
              </div>
              <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune transaction pour le moment</p>
              <button onClick={() => onNavigate('payment')}
                style={{ color: C.teal, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: FONT }}>
                Créer votre premier paiement →
              </button>
            </div>
          ) : (
            <div>
              {recent.map((tx, i) => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: i < recent.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <InitialAvatar name={tx.supplierName || 'Fournisseur'} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 11, color: C.t3, marginTop: 2, margin: '2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      {tx.network ? ` · ${tx.network}` : ''}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}{' '}
                      <span style={{ color: C.t2, fontWeight: 400 }}>{tx.currency || 'USDT'}</span>
                    </p>
                    <div style={{ marginTop: 4 }}>
                      <StatusPill status={tx.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Quick actions + Live rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Actions rapides</h3>
            </div>
            {[
              { label: 'Initier un paiement',    sub: 'Payer un fournisseur en USDT',    Icon: Send,     primary: true,  action: () => onNavigate('payment') },
              { label: 'Ajouter un fournisseur', sub: 'Enregistrer un nouveau contact',  Icon: Plus,     primary: false, action: () => onNavigate('suppliers') },
              { label: 'Exporter CSV',            sub: "Télécharger l'historique",        Icon: Download, primary: false, action: () => onNavigate('history') },
            ].map((item, i, arr) => {
              const { Icon } = item;
              return (
                <button key={item.label} onClick={item.action} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 8px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                  borderRadius: i === arr.length - 1 ? '0 0 12px 12px' : 0,
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.l3)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: item.primary ? C.teal : C.l2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 14, height: 14, color: item.primary ? '#fff' : C.t2 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: 0, fontFamily: FONT }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: C.t3, marginTop: 1, margin: '1px 0 0', fontFamily: FONT }}>{item.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom: AreaChart gauche + LiveRate droite */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr]" style={{ gap: 16 }}>

        {/* AreaChart — volume 7 jours */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0 }}>Volume des 7 derniers jours</h3>
              <p style={{ fontSize: 10, color: C.t3, margin: '2px 0 0' }}>En USDT{payments.length === 0 && ' · Démonstration'}</p>
            </div>
            {payments.length === 0 && (
              <span style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6, padding: '3px 7px' }}>
                Exemple
              </span>
            )}
          </div>
          <div style={{ padding: '12px 12px 8px' }}>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={volumeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
                <XAxis dataKey="jour" tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="usdt" stroke={C.teal} strokeWidth={2}
                  fill="url(#volumeGrad)" dot={false} activeDot={{ r: 3, fill: C.teal, stroke: C.l1, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <LiveRateCard />
      </div>

    </div>
  );
}
