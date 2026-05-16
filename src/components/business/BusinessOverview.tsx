import { useState, useEffect } from 'react';
import { Send, Plus, Download, Clock, CheckCircle2, XCircle, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
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
      background: 'rgba(59,150,143,0.18)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
    </div>
  );
}

const STATUS_CONFIG: Record<string, { bg: string; border: string; color: string; label: string; Icon: React.FC<any> }> = {
  pending:    { bg: C.amberT, border: C.amberB, color: C.amber, label: 'En attente',  Icon: Clock },
  processing: { bg: C.blueT,  border: C.blueB,  color: C.blue,  label: 'En cours',    Icon: Loader2 },
  completed:  { bg: C.emT,    border: C.emB,    color: C.em,    label: 'Complété',    Icon: CheckCircle2 },
  failed:     { bg: C.redT,   border: C.redB,   color: C.red,   label: 'Échoué',      Icon: XCircle },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: C.l3, border: C.bd, color: C.t2, label: status, Icon: Clock };
  const { bg, border, color, label, Icon } = cfg;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3,
      borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: bg, border: `1px solid ${border}`, color,
      fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      <Icon style={{ width: 9, height: 9 }} />
      {label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
    </div>
  );
}

function LiveRateCard() {
  return (
    <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', fontFamily: FONT, textTransform: 'uppercase', margin: 0 }}>
            Taux de change
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.em }} />
            <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>En direct</span>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 10, color: C.t3, margin: '0 0 4px', fontFamily: FONT }}>USDT / FCFA</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>
              620.5
            </span>
            <span style={{ fontSize: 11, color: C.t2, fontFamily: FONT }}>XOF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <TrendingUp style={{ width: 11, height: 11, color: C.em }} />
            <span style={{ fontSize: 11, color: C.em, fontFamily: FONT }}>+0.18% aujourd'hui</span>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.bds}`, paddingTop: 12, marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>USDT / EUR</span>
            <span style={{ fontSize: 11, color: C.t2, fontFamily: MONO }}>0.921</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>USDT / USD</span>
            <span style={{ fontSize: 11, color: C.t2, fontFamily: MONO }}>1.000</span>
          </div>
        </div>
        <p style={{ fontSize: 10, color: C.t3, marginTop: 10, fontFamily: FONT, margin: '10px 0 0' }}>
          Actualisé il y a 5 secondes
        </p>
      </div>
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
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    .slice(0, 5);

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
    {
      label: 'Volume total',
      value: totalVolume > 0 ? totalVolume.toLocaleString('fr-FR') : '—',
      unit: totalVolume > 0 ? 'USDT' : '',
      trend: totalVolume > 0 ? { dir: 'up', text: 'Transactions complétées' } : { dir: 'neutral', text: 'Aucune transaction' },
    },
    {
      label: 'En cours',
      value: String(pendingCount),
      unit: '',
      trend: pendingCount > 0
        ? { dir: 'neutral', text: 'Paiements actifs' }
        : { dir: 'up', text: 'Aucune en attente' },
    },
    {
      label: 'Fournisseurs',
      value: String(suppliers.length),
      unit: '',
      trend: { dir: 'neutral', text: 'Contacts enregistrés' },
    },
    {
      label: 'Économies',
      value: totalVolume > 0 ? `$${savings.toLocaleString('fr-FR')}` : '—',
      unit: '',
      trend: totalVolume > 0
        ? { dir: 'up', text: 'vs SWIFT estimé' }
        : { dir: 'neutral', text: 'vs SWIFT estimé' },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT, paddingTop: 8 }}>

      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 4px' }}>
            Bonjour, {firstName} 👋
          </h2>
          <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>{today}</p>
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

      {/* 4 stat cards — grouped, Analytics-style polish */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{
          background: C.l1,
          border: `1px solid ${C.bds}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            onMouseEnter={() => setHoveredStat(i)}
            onMouseLeave={() => setHoveredStat(null)}
            style={{
              padding: '20px 22px',
              borderRight: i < 3 ? `1px solid ${C.bds}` : 'none',
              background: hoveredStat === i ? C.l2 : 'transparent',
              transition: 'background 0.15s',
              cursor: 'default',
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase', fontFamily: FONT }}>
              {stat.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1, fontFamily: MONO, letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
              {stat.unit && <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{stat.unit}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {stat.trend.dir === 'up' && <TrendingUp style={{ width: 10, height: 10, color: C.em, flexShrink: 0 }} />}
              {stat.trend.dir === 'down' && <TrendingDown style={{ width: 10, height: 10, color: C.red, flexShrink: 0 }} />}
              {stat.trend.dir === 'neutral' && <Minus style={{ width: 10, height: 10, color: C.t3, flexShrink: 0 }} />}
              <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>{stat.trend.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured sections — illustrated navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          {
            key: 'payment',
            title: 'Paiements',
            desc: 'Envoyez des fonds à vos fournisseurs en USDT via TRC-20 ou ERC-20',
            svg: (
              <svg width="100%" height="100%" viewBox="0 0 180 90" fill="none" style={{ display: 'block' }}>
                <rect x="18" y="18" width="84" height="54" rx="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
                <path d="M18 32 L102 32" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <rect x="26" y="40" width="34" height="7" rx="3.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <rect x="26" y="52" width="22" height="5" rx="2.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                <rect x="26" y="60" width="28" height="5" rx="2.5" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                <path d="M112 45 L134 45" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M126 38 L134 45 L126 52" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="142" y="26" width="22" height="38" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
                <circle cx="153" cy="50" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <path d="M150 50 L152 52 L156 48" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <rect x="20" y="15" width="70" height="62" rx="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
                <rect x="28" y="23" width="54" height="46" rx="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                <circle cx="55" cy="46" r="12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
                <circle cx="55" cy="46" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <path d="M55 34 L55 38 M55 54 L55 58 M43 46 L47 46 M63 46 L67 46" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M90 26 L90 77" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                <rect x="100" y="52" width="12" height="22" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                <rect x="118" y="42" width="12" height="32" rx="2" stroke="rgba(255,255,255,0.42)" strokeWidth="1"/>
                <rect x="136" y="32" width="12" height="42" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                <path d="M96 78 L162 78" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round"/>
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
                <path d="M22 72 L22 16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M22 72 L164 72" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M22 56 L160 56" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <path d="M22 40 L160 40" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <path d="M22 24 L160 24" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <path d="M22 72 L52 54 L82 60 L112 38 L142 44 L162 26 L162 72 Z" fill="rgba(255,255,255,0.04)"/>
                <path d="M22 72 L52 54 L82 60 L112 38 L142 44 L162 26" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="52" cy="54" r="3" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
                <circle cx="112" cy="38" r="3" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
                <circle cx="162" cy="26" r="3" fill="rgba(255,255,255,0.4)"/>
                <path d="M52 72 L52 70 M82 72 L82 70 M112 72 L112 70 M142 72 L142 70 M162 72 L162 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <path d="M22 56 L20 56 M22 40 L20 40 M22 24 L20 24" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </svg>
            ),
          },
        ].map(card => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.key)}
            onMouseEnter={() => setHoveredCard(card.key)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'linear-gradient(135deg, #1e1e1e 0%, #141414 100%)',
              border: `1px solid ${hoveredCard === card.key ? C.bdh : C.bds}`,
              borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
              textAlign: 'left', padding: 0, fontFamily: FONT,
              boxShadow: hoveredCard === card.key ? '0 4px 12px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.3)',
              transform: hoveredCard === card.key ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <div style={{ height: 90, padding: '12px 16px' }}>
              {card.svg}
            </div>
            <div style={{ padding: '12px 16px 16px', borderTop: `1px solid rgba(255,255,255,0.06)`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', margin: '0 0 4px', fontFamily: FONT }}>{card.title}</p>
                <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.4)', margin: 0, lineHeight: 1.5, fontFamily: FONT }}>{card.desc}</p>
              </div>
              <span style={{ fontSize: 14, color: hoveredCard === card.key ? C.teal : 'rgba(240,240,240,0.3)', flexShrink: 0, marginLeft: 8, transition: 'color 0.15s' }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid: transactions + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr]" style={{ gap: 14 }}>

        {/* LEFT: Recent transactions */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontFamily: FONT }}>Transactions récentes</h3>
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
              <p style={{ color: C.t3, fontSize: 13, margin: 0, fontFamily: FONT }}>Aucune transaction pour le moment</p>
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
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 11, color: C.t3, marginTop: 2, margin: '2px 0 0', fontFamily: FONT }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      {tx.network ? ` · ${tx.network}` : ''}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontFamily: MONO }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}{' '}
                      <span style={{ color: C.t2, fontWeight: 400, fontFamily: FONT }}>{tx.currency || 'USDT'}</span>
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

        {/* RIGHT: Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontFamily: FONT }}>Actions rapides</h3>
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
                  padding: '12px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.l2)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: item.primary ? C.teal : C.l3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 14, height: 14, color: item.primary ? '#fff' : C.t2 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: 0, fontFamily: FONT }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: C.t3, marginTop: 1, margin: '1px 0 0', fontFamily: FONT }}>{item.sub}</p>
                  </div>
                  <span style={{ fontSize: 14, color: C.t3, flexShrink: 0 }}>→</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: AreaChart + LiveRate */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr]" style={{ gap: 14 }}>

        {/* AreaChart */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontFamily: FONT }}>Volume des 7 derniers jours</h3>
              <p style={{ fontSize: 10, color: C.t3, margin: '3px 0 0', fontFamily: FONT }}>En USDT{payments.length === 0 && ' · Démonstration'}</p>
            </div>
            {payments.length === 0 && (
              <span style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6, padding: '3px 8px', fontFamily: FONT }}>
                Exemple
              </span>
            )}
          </div>
          <div style={{ padding: '16px 12px 12px' }}>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={volumeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.bds} vertical={false} />
                <XAxis dataKey="jour" tick={{ fill: C.t3, fontSize: 10, fontFamily: FONT }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="usdt" stroke={C.teal} strokeWidth={2}
                  fill="url(#volumeGrad)" dot={false} activeDot={{ r: 4, fill: C.teal, stroke: C.l1, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <LiveRateCard />
      </div>

    </div>
  );
}
