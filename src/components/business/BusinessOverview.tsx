import { useState, useEffect } from 'react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Send, Plus, Download, ArrowDownToLine, ChevronRight, CheckCircle, Circle } from 'lucide-react';
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
  amber: '#f59e0b',
  blue: '#3b82f6',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const CARD_BG = 'linear-gradient(135deg, #1e1e1e 0%, #191919 60%, #141414 100%)';

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

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente', color: C.amber },
  processing: { label: 'En cours',   color: C.blue  },
  completed:  { label: 'Complété',   color: C.teal  },
  failed:     { label: 'Échoué',     color: C.red   },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: C.t3 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2,
      borderRadius: 999, fontSize: 10.5, fontWeight: 500,
      background: C.l3, border: `1px solid ${C.bds}`, color: C.t3,
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
    <div style={{ background: CARD_BG, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.1em', fontFamily: FONT, textTransform: 'uppercase' }}>
            USDT / FCFA
          </span>
          <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>
            {loading ? 'Chargement…' : lastUpdated
              ? secAgo < 10 ? 'À l\'instant' : `Actualisé il y a ${secAgo}s`
              : 'Actualisation…'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: loading ? C.t3 : C.t1, fontFamily: MONO, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {usdtToCfa.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span style={{ fontSize: 11, color: C.t2, fontFamily: FONT }}>XOF/USDT</span>
        </div>
      </div>
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

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const { usdtToCfa, loading: rateLoading } = useCryptoRates();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key('payments')) || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
    } catch {}
  }, [userId]);

  const completed = payments.filter(p => p.status === 'completed');
  const totalVolume = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = payments.filter(p => ['pending', 'processing'].includes(p.status)).length;
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
  const showSetup = suppliers.length === 0 && payments.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontFamily: FONT, paddingTop: 8 }}>

      {/* 1. En-tête de page — titre à gauche, actions à droite */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Vue d'ensemble
          </h2>
          <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0', textTransform: 'capitalize' }}>
            Bonjour, {firstName} · {today}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => onNavigate('deposit')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: FONT,
              background: 'transparent', border: `1px solid ${C.bd}`, color: C.t2,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.t1; e.currentTarget.style.background = C.tealT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowDownToLine style={{ width: 13, height: 13 }} />
            Déposer
          </button>
          <button
            onClick={() => onNavigate('payment')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, fontFamily: FONT,
              background: C.teal, border: `1px solid ${C.teal}`, color: '#fff',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.tealH; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.teal; }}
          >
            <Send style={{ width: 13, height: 13 }} />
            Envoyer un paiement
          </button>
        </div>
      </div>

      {/* 2. Stats — 4 cartes */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10 }}>
        {[
          {
            label: 'Volume ce mois',
            value: totalVolume > 0 ? totalVolume.toLocaleString('fr-FR') : '—',
            unit: totalVolume > 0 ? 'USDT' : '',
            sub: 'Transactions complétées',
          },
          {
            label: 'Taux actuel',
            value: rateLoading ? '…' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 }),
            unit: '',
            sub: 'XOF / 1 USDT',
          },
          {
            label: 'En attente',
            value: String(pendingCount),
            unit: '',
            sub: 'Paiements en cours',
          },
          {
            label: 'Fournisseurs',
            value: String(suppliers.length),
            unit: '',
            sub: 'Contacts enregistrés',
          },
        ].map(stat => (
          <div key={stat.label} style={{
            background: CARD_BG,
            border: `1px solid ${C.bds}`,
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.09em', margin: 0, textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 10 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontFamily: MONO, letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
              {stat.unit && <span style={{ fontSize: 11, color: C.t2 }}>{stat.unit}</span>}
            </div>
            <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. Contenu principal — 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr]" style={{ gap: 14 }}>

        {/* GAUCHE : Transactions récentes */}
        <div style={{ background: CARD_BG, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.bds}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Transactions récentes</h3>
            <button
              onClick={() => onNavigate('history')}
              style={{ fontSize: 12, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}
            >
              Voir tout →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: '44px 20px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.tealT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Send style={{ width: 16, height: 16, color: C.teal }} />
              </div>
              <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune transaction</p>
              <button
                onClick={() => onNavigate('payment')}
                style={{ color: C.teal, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: FONT }}
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
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                    borderBottom: i < recent.length - 1 ? `1px solid ${C.bds}` : 'none',
                    transition: 'background 0.1s', cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <InitialAvatar name={tx.supplierName || 'Fournisseur'} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      {tx.network ? ` · ${tx.network}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, fontVariantNumeric: 'tabular-nums', fontFamily: MONO }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}{' '}
                      <span style={{ color: C.t3, fontWeight: 400, fontSize: 11 }}>{tx.currency || 'USDT'}</span>
                    </p>
                    <div style={{ marginTop: 4 }}>
                      <StatusPill status={tx.status} />
                    </div>
                  </div>
                  <ChevronRight style={{ width: 13, height: 13, color: C.t4, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DROITE : taux live + actions rapides + premiers pas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <LiveRateCard />

          {/* Actions rapides */}
          <div style={{ background: CARD_BG, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Actions rapides</h3>
            </div>
            {[
              { label: 'Envoyer un paiement',   Icon: Send,            primary: true,  action: () => onNavigate('payment')   },
              { label: 'Déposer des fonds',      Icon: ArrowDownToLine, primary: false, action: () => onNavigate('deposit')   },
              { label: 'Ajouter un fournisseur', Icon: Plus,            primary: false, action: () => onNavigate('suppliers') },
              { label: 'Exporter CSV',            Icon: Download,        primary: false, action: () => onNavigate('history')  },
            ].map((item, i, arr) => {
              const { Icon } = item;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
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
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: item.primary ? C.teal : C.l2,
                    border: `1px solid ${item.primary ? C.teal : C.bds}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 13, height: 13, color: item.primary ? '#fff' : C.t3 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.t2 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Premiers pas — uniquement si aucun fournisseur/paiement */}
          {showSetup && (
            <div style={{ background: CARD_BG, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Premiers pas</h3>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle style={{ width: 16, height: 16, color: C.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.t2 }}>Compte créé</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Circle style={{ width: 16, height: 16, color: C.t4, flexShrink: 0 }} />
                  <button onClick={() => onNavigate('suppliers')} style={{ fontSize: 12, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}>
                    Ajouter un fournisseur
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Circle style={{ width: 16, height: 16, color: C.t4, flexShrink: 0 }} />
                  <button onClick={() => onNavigate('payment')} style={{ fontSize: 12, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}>
                    Premier paiement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Graphique volume — pleine largeur */}
      <div style={{ background: CARD_BG, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Volume 7 jours</h3>
            <p style={{ fontSize: 10, color: C.t3, margin: '3px 0 0' }}>En USDT</p>
          </div>
          {payments.length === 0 && (
            <span style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 5, padding: '3px 8px' }}>
              Exemple
            </span>
          )}
        </div>
        <div style={{ padding: '14px 14px 10px' }}>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={volumeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="jour" tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone" dataKey="usdt" stroke={C.teal} strokeWidth={1.5}
                fill="url(#volumeGrad)" dot={false} isAnimationActive={false}
                activeDot={{ r: 3, fill: C.teal, stroke: '#141414', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
