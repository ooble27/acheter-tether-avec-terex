import { useState, useEffect } from 'react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Send, Plus, Download, ArrowDownToLine, ArrowRight, Globe, Wallet, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onNavigate: (section: string) => void;
}

const C = {
  bg: '#151515', l1: '#1c1c1c', l2: '#222222', l3: '#2a2a2a', l4: '#333333',
  bd: '#303030', bds: '#252525', bdh: '#404040',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.07)', tealB: 'rgba(59,150,143,0.18)',
  t1: '#efefef', t2: '#8a8a8a', t3: '#5a5a5a', t4: '#2e2e2e',
  amber: '#d97706', amberT: 'rgba(217,119,6,0.08)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)',
  red: '#dc2626', redT: 'rgba(220,38,38,0.08)',
  gold: '#c9a84c',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const CARD = 'linear-gradient(145deg, #1d1d1d 0%, #181818 55%, #131313 100%)';
const CARD_BORDER = '#252525';

const VOLUME_DEMO = [
  { jour: 'Lun', usdt: 1200, xof: 744000 },
  { jour: 'Mar', usdt: 3400, xof: 2108000 },
  { jour: 'Mer', usdt: 800,  xof: 496000 },
  { jour: 'Jeu', usdt: 5200, xof: 3224000 },
  { jour: 'Ven', usdt: 2100, xof: 1302000 },
  { jour: 'Sam', usdt: 4800, xof: 2976000 },
  { jour: 'Auj', usdt: 1600, xof: 992000 },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    pending:    { label: 'En attente', bg: C.amberT, color: C.amber },
    processing: { label: 'En cours',   bg: C.blueT,  color: C.blue  },
    completed:  { label: 'Complété',   bg: C.tealT,  color: C.teal  },
    failed:     { label: 'Échoué',     bg: C.redT,   color: C.red   },
  };
  const s = map[status] || { label: status, bg: C.l3, color: C.t3 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 500,
      background: s.bg, color: s.color, fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

function InitialAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'rgba(59,150,143,0.14)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
    </div>
  );
}

/* ─── Composant "Flux" — visualise le pipeline XOF→USDT ─── */
function FlowHero({ usdtToCfa, loading, firstName, today, onNavigate }: {
  usdtToCfa: number; loading: boolean;
  firstName: string; today: string;
  onNavigate: (s: string) => void;
}) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${CARD_BORDER}`,
      borderRadius: 18, overflow: 'hidden', position: 'relative',
    }}>
      {/* Subtle top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
        background: `linear-gradient(90deg, transparent, ${C.teal}44, transparent)`,
      }} />

      <div style={{ padding: '22px 28px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 28, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ color: C.t3, fontSize: 11, margin: 0, textTransform: 'capitalize', fontFamily: FONT }}>
              {today}
            </p>
            <h2 style={{ color: C.t1, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: '3px 0 0', fontFamily: FONT }}>
              Bonjour, {firstName}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => onNavigate('deposit')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12, fontWeight: 500, fontFamily: FONT,
                background: 'transparent', border: `1px solid ${C.bd}`, color: C.t2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.t1; e.currentTarget.style.background = C.tealT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; e.currentTarget.style.background = 'transparent'; }}
            >
              <ArrowDownToLine style={{ width: 12, height: 12 }} />
              Déposer
            </button>
            <button
              onClick={() => onNavigate('payment')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: FONT,
                background: C.teal, border: `1px solid ${C.teal}`, color: '#fff',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.tealH; e.currentTarget.style.borderColor = C.tealH; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.borderColor = C.teal; }}
            >
              <Send style={{ width: 12, height: 12 }} />
              Envoyer un paiement
            </button>
          </div>
        </div>

        {/* Pipeline flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

          {/* LEFT — XOF */}
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${C.bd}`, borderRadius: 12,
            padding: '14px 18px',
          }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px', fontFamily: FONT }}>
              Vous déposez
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: C.t1, margin: 0, fontFamily: MONO, letterSpacing: '-0.03em' }}>
              XOF
            </p>
            <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0', fontFamily: FONT, lineHeight: 1.5 }}>
              Wave · Orange Money<br />
              Free Money · Virement
            </p>
          </div>

          {/* CENTER — Arrow + rate */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 18, height: 1.5,
                  background: `linear-gradient(90deg, ${C.teal}${i === 0 ? '44' : i === 1 ? '99' : 'ff'}, ${C.teal}${i === 2 ? '99' : 'ff'})`,
                  borderRadius: 2,
                }} />
              ))}
              <ArrowRight style={{ width: 14, height: 14, color: C.teal }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT }}>
                taux live
              </p>
              <p style={{
                fontSize: loading ? 13 : 15, fontWeight: 700,
                color: loading ? C.t3 : C.teal,
                margin: '3px 0 0', fontFamily: MONO,
                letterSpacing: '-0.02em', whiteSpace: 'nowrap',
              }}>
                {loading ? '…' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
              </p>
              <p style={{ fontSize: 9, color: C.t3, margin: '1px 0 0', fontFamily: FONT }}>
                XOF / USDT
              </p>
            </div>
          </div>

          {/* RIGHT — USDT */}
          <div style={{
            flex: 1, background: C.tealT,
            border: `1px solid ${C.teal}33`, borderRadius: 12,
            padding: '14px 18px',
          }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: C.teal, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px', fontFamily: FONT, opacity: 0.7 }}>
              Destinataire reçoit
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: C.teal, margin: 0, fontFamily: MONO, letterSpacing: '-0.03em' }}>
              USDT
            </p>
            <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0', fontFamily: FONT, lineHeight: 1.5 }}>
              TRC20 · BEP20<br />
              ERC20 · Polygon
            </p>
          </div>

        </div>

        {/* Bottom legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.bds}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe style={{ width: 11, height: 11, color: C.t3 }} />
            <span style={{ fontSize: 10.5, color: C.t3, fontFamily: FONT }}>Envoi mondial · Chine, Asie, Europe…</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal }} />
            <span style={{ fontSize: 10.5, color: C.t3, fontFamily: FONT }}>Taux actualisé en temps réel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const { usdtToCfa, loading: rateLoading, lastUpdated } = useCryptoRates();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [secAgo, setSecAgo] = useState(0);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key('payments')) || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
    } catch {}
  }, [userId]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (lastUpdated) setSecAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 5000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  const completed = payments.filter(p => p.status === 'completed');
  const totalUsdt = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const totalXof = totalUsdt * usdtToCfa;
  const pendingCount = payments.filter(p => ['pending', 'processing'].includes(p.status)).length;
  const recent = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

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

  const stats = [
    {
      label: 'USDT envoyé',
      value: totalUsdt > 0 ? totalUsdt.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : '—',
      unit: totalUsdt > 0 ? 'USDT' : '',
      sub: 'Volume ce mois',
      Icon: TrendingUp,
    },
    {
      label: 'Équivalent XOF',
      value: totalXof > 0 ? (totalXof / 1000000).toFixed(1) + 'M' : '—',
      unit: totalXof > 0 ? 'XOF' : '',
      sub: 'Fonds reçus',
      Icon: Wallet,
    },
    {
      label: 'En attente',
      value: String(pendingCount || '—'),
      unit: pendingCount > 0 ? 'tx' : '',
      sub: 'Paiements en cours',
      Icon: Clock,
    },
    {
      label: 'Fournisseurs',
      value: String(suppliers.length || '—'),
      unit: '',
      sub: 'Contacts actifs',
      Icon: Globe,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT }}>

      {/* 1. Hero — pipeline XOF → USDT */}
      <FlowHero
        usdtToCfa={usdtToCfa}
        loading={rateLoading}
        firstName={firstName}
        today={today}
        onNavigate={onNavigate}
      />

      {/* 2. Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10 }}>
        {stats.map(stat => {
          const { Icon } = stat;
          return (
            <div key={stat.label} style={{
              background: CARD, border: `1px solid ${CARD_BORDER}`,
              borderRadius: 14, padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase' }}>
                  {stat.label}
                </p>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: C.tealT, border: `1px solid ${C.teal}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 12, height: 12, color: C.teal }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: C.t1, lineHeight: 1, fontFamily: MONO, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </span>
                {stat.unit && <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>{stat.unit}</span>}
              </div>
              <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0', fontFamily: FONT }}>{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Main 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr]" style={{ gap: 12 }}>

        {/* LEFT — Transactions récentes */}
        <div style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '-0.01em' }}>Transactions récentes</h3>
            <button
              onClick={() => onNavigate('history')}
              style={{ fontSize: 11, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT, opacity: 0.85 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; }}
            >
              Tout voir →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: C.tealT, border: `1px solid ${C.teal}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Send style={{ width: 16, height: 16, color: C.teal }} />
              </div>
              <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune transaction pour l'instant</p>
              <button
                onClick={() => onNavigate('payment')}
                style={{ color: C.teal, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, fontFamily: FONT, opacity: 0.8 }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.8'; }}
              >
                Créer votre premier paiement →
              </button>
            </div>
          ) : (
            <div>
              {recent.map((tx, i) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
                    borderBottom: i < recent.length - 1 ? `1px solid ${C.bds}` : 'none',
                    transition: 'background 0.1s', cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <InitialAvatar name={tx.supplierName || '?'} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0', fontFamily: FONT }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      {tx.network ? <span style={{ marginLeft: 6, background: C.l3, borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>{tx.network}</span> : null}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}
                      <span style={{ color: C.t3, fontWeight: 400, fontSize: 10, marginLeft: 4 }}>USDT</span>
                    </p>
                    {tx.xofAmount && (
                      <p style={{ fontSize: 10, color: C.t3, margin: '1px 0 0', fontFamily: MONO }}>
                        {(tx.xofAmount || tx.amount * usdtToCfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF
                      </p>
                    )}
                    <div style={{ marginTop: 4 }}>
                      <StatusPill status={tx.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Actions + taux */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Mini rate strip */}
          <div style={{
            background: CARD, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 14, padding: '12px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: FONT }}>USDT / XOF</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: rateLoading ? C.t3 : C.t1, fontFamily: MONO, letterSpacing: '-0.03em' }}>
                  {rateLoading ? '—' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                </span>
                <span style={{ fontSize: 10, color: C.t3 }}>XOF</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal, marginLeft: 'auto', marginBottom: 4 }} />
              <p style={{ fontSize: 10, color: C.t3, margin: 0, fontFamily: FONT }}>
                {!rateLoading && lastUpdated
                  ? secAgo < 10 ? 'Temps réel' : `il y a ${secAgo}s`
                  : 'Chargement…'}
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: FONT }}>
                Actions rapides
              </p>
            </div>
            {[
              { label: 'Envoyer un paiement',   Icon: Send,            accent: true,  action: 'payment'   },
              { label: 'Déposer des fonds',      Icon: ArrowDownToLine, accent: false, action: 'deposit'   },
              { label: 'Ajouter un fournisseur', Icon: Plus,            accent: false, action: 'suppliers' },
              { label: 'Historique & Export',    Icon: Download,        accent: false, action: 'history'   },
            ].map((item, i, arr) => {
              const { Icon } = item;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.action)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                    transition: 'background 0.1s', fontFamily: FONT,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: item.accent ? C.teal : C.l3,
                    border: `1px solid ${item.accent ? C.teal : C.bd}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 12, height: 12, color: item.accent ? '#fff' : C.t2 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: item.accent ? 500 : 400, color: item.accent ? C.t1 : C.t2 }}>
                    {item.label}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: C.t4 }}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Volume chart */}
      <div style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '-0.01em' }}>Volume hebdomadaire</h3>
            <p style={{ fontSize: 10, color: C.t3, margin: '3px 0 0', fontFamily: FONT }}>USDT envoyé · 7 derniers jours</p>
          </div>
          {payments.length === 0 && (
            <span style={{ fontSize: 9.5, color: C.t3, background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 5, padding: '3px 8px', fontFamily: FONT, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Aperçu
            </span>
          )}
        </div>
        <div style={{ padding: '14px 14px 10px' }}>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={volumeData} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />
              <XAxis dataKey="jour" tick={{ fill: C.t3, fontSize: 9.5 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: C.t3, fontSize: 9.5 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone" dataKey="usdt" stroke={C.teal} strokeWidth={1.5}
                fill="url(#volGrad)" dot={false} isAnimationActive={false}
                activeDot={{ r: 3, fill: C.teal, stroke: '#131313', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
