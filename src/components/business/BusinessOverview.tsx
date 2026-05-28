import { useState, useEffect } from 'react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Send, Plus, Download, ArrowDownToLine } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import usdtLogo from '@/assets/usdt-logo.png';

interface Props {
  user: { email: string; name: string } | null;
  onNavigate: (section: string) => void;
}

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#565656',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const STATUS: Record<string, string> = {
  pending:    'En attente',
  processing: 'En cours',
  completed:  'Complété',
  failed:     'Échoué',
};

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const p = (name || 'U').split(' ').filter(Boolean);
  const s = p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : (p[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 9,
      background: 'rgba(59,150,143,0.12)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{s}</div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{value:number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 10, margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
    </div>
  );
}

const card: React.CSSProperties = {
  background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden',
};

const sH: React.CSSProperties = {
  color: C.t3, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0,
};

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const { usdtToCfa, loading: rateLoading, lastUpdated } = useCryptoRates();
  const userId = session?.user?.id || user?.email || 'guest';
  const k = (x: string) => `terex_b2b_${userId}_${x}`;

  const [payments,  setPayments]  = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [secAgo,    setSecAgo]    = useState(0);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(k('payments'))   || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(k('suppliers')) || '[]'));
    } catch {}
  }, [userId]);

  useEffect(() => {
    const t = setInterval(() => {
      if (lastUpdated) setSecAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 5000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const done      = payments.filter(p => p.status === 'completed');
  const usdtTotal = done.reduce((s, p) => s + (p.amount || 0), 0);
  const xofTotal  = rateLoading ? null : Math.round(usdtTotal * usdtToCfa);
  const pending   = payments.filter(p => ['pending','processing'].includes(p.status)).length;
  const recent    = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const hasData   = payments.length > 0;

  const chartData = hasData ? (() => {
    const lbl = ['Lun','Mar','Mer','Jeu','Ven','Sam','Auj'];
    const d: Record<string,number> = {}; lbl.forEach(l => { d[l] = 0; });
    payments.forEach(p => {
      const day = new Date(p.createdAt).getDay();
      d[lbl[day === 0 ? 6 : day - 1]] = (d[lbl[day === 0 ? 6 : day - 1]] || 0) + (p.amount || 0);
    });
    return lbl.map(j => ({ j, v: d[j] || 0 }));
  })() : null;

  const today    = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const firstName = (user?.name || '').split(' ')[0] || 'là';
  const rateText  = rateLoading ? '—' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const rateAge   = !rateLoading && lastUpdated ? (secAgo < 10 ? 'temps réel' : `il y a ${secAgo}s`) : '';

  return (
    <div style={{ fontFamily: FONT, color: C.t1, paddingTop: 8 }}>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ GAUCHE : héro + graphique ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Héro — même style exact que Trésorerie */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
            border: `1px solid ${C.bds}`, borderRadius: 16,
            padding: '30px 28px 26px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <img src={usdtLogo} alt="USDT" style={{ width: 26, height: 26, borderRadius: '50%' }} />
              <span style={{ ...sH }}>Vue d'ensemble</span>
            </div>

            {hasData ? (
              <>
                <p style={{ fontSize: 12, color: C.t3, margin: '0 0 8px', textTransform: 'capitalize' }}>{today}</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: C.t2, margin: '0 0 20px' }}>Bonjour, {firstName}</p>

                <div style={{ marginBottom: 22 }}>
                  <p style={{ color: C.t3, fontSize: 10, margin: '0 0 6px', fontWeight: 500 }}>Volume envoyé ce mois</p>
                  <p style={{ color: C.t1, fontSize: 50, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {usdtTotal.toLocaleString('fr-FR')}
                    <span style={{ color: C.t3, fontSize: 18, fontWeight: 400, marginLeft: 10, letterSpacing: 0 }}>USDT</span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
                  <div style={{ paddingRight: 24 }}>
                    <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>≈ en XOF</p>
                    <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                      {xofTotal !== null ? xofTotal.toLocaleString('fr-FR') : '—'}
                    </p>
                  </div>
                  <div style={{ width: 1, background: C.bds, alignSelf: 'stretch', marginRight: 24 }} />
                  <div>
                    <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>En attente</p>
                    <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>
                      {pending > 0 ? pending : '0'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* État vide — onboarding propre */
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, color: C.t3, margin: '0 0 4px', textTransform: 'capitalize' }}>{today}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.t1, margin: '0 0 20px' }}>Bonjour, {firstName}</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.bds}`, borderRadius: 12, padding: '20px 22px', marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.t2, margin: '0 0 6px' }}>Votre activité apparaîtra ici</p>
                  <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.6 }}>
                    Envoyez votre premier paiement USDT pour commencer à suivre votre volume mensuel.
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onNavigate('deposit')} style={{
                height: 36, paddingLeft: 16, paddingRight: 16,
                background: 'transparent', border: `1px solid ${C.bd}`,
                borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: FONT, whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.tealB; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd;    e.currentTarget.style.color = C.t2;  }}
              >
                <ArrowDownToLine style={{ width: 13, height: 13 }} /> Déposer
              </button>
              <button onClick={() => onNavigate('payment')} style={{
                height: 36, paddingLeft: 18, paddingRight: 18,
                background: C.teal, border: 'none', borderRadius: 9,
                color: '#fff', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: FONT, whiteSpace: 'nowrap', transition: 'background 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.tealH; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.teal;  }}
              >
                <Send style={{ width: 13, height: 13 }} /> Envoyer un paiement
              </button>
            </div>
          </div>

          {/* Graphique — seulement avec de vraies données */}
          {chartData ? (
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>Volume hebdomadaire</h3>
                  <p style={{ fontSize: 10, color: C.t3, margin: '3px 0 0' }}>USDT envoyé · 7 derniers jours</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
                  <defs>
                    <linearGradient id="ovG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.teal} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="j" tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.t3, fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                  <Tooltip content={<ChartTip />} cursor={{ stroke: C.teal, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="v" stroke={C.teal} strokeWidth={1.5}
                    fill="url(#ovG)" dot={false} isAnimationActive={false}
                    activeDot={{ r: 3, fill: C.teal, stroke: '#141414', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Premiers pas — visible uniquement sans données */
            <div style={{ ...card }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
                <span style={{ ...sH }}>Premiers pas</span>
              </div>
              {[
                { done: true,  label: 'Compte créé' },
                { done: false, label: 'Ajouter un fournisseur', to: 'suppliers' },
                { done: false, label: 'Envoyer un premier paiement', to: 'payment' },
              ].map((step, i, arr) => (
                <div key={step.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: step.done ? C.teal : 'transparent',
                    border: `1.5px solid ${step.done ? C.teal : C.bd}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.done && <div style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  {step.to ? (
                    <button onClick={() => onNavigate(step.to!)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: C.teal, fontFamily: FONT, textAlign: 'left' }}>
                      {step.label}
                    </button>
                  ) : (
                    <span style={{ fontSize: 13, color: C.t3 }}>{step.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ DROITE : taux + stats + transactions + actions ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Taux live */}
          <div style={{ ...card, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ ...sH }}>Taux en cours</span>
              <span style={{ fontSize: 10, color: C.t3 }}>{rateAge}</span>
            </div>
            <p style={{ fontSize: 38, fontWeight: 700, color: C.t1, fontFamily: MONO, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {rateText}
            </p>
            <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0' }}>XOF par 1 USDT</p>
          </div>

          {/* Résumé */}
          <div style={{ ...card }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ ...sH }}>Résumé</span>
            </div>
            {[
              { label: 'Transactions',   value: payments.length > 0 ? String(payments.length) : '0' },
              { label: 'Complétées',     value: done.length > 0 ? String(done.length) : '0' },
              { label: 'Fournisseurs',   value: suppliers.length > 0 ? String(suppliers.length) : '0' },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
              }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Transactions récentes */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Transactions récentes</span>
              {recent.length > 0 && (
                <button onClick={() => onNavigate('history')}
                  style={{ fontSize: 11, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: FONT }}
                >Voir tout →</button>
              )}
            </div>
            {recent.length === 0 ? (
              <p style={{ padding: '20px', fontSize: 12, color: C.t3, margin: 0, textAlign: 'center' }}>Aucune transaction</p>
            ) : (
              recent.map((tx, i) => (
                <div key={tx.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: i < recent.length - 1 ? `1px solid ${C.bds}` : 'none', transition: 'background .1s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Avatar name={tx.supplierName || '?'} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 10, color: C.t3, margin: '1px 0 0' }}>{STATUS[tx.status] || tx.status}</p>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, fontFamily: MONO, flexShrink: 0 }}>
                    {(tx.amount || 0).toLocaleString('fr-FR')}
                    <span style={{ fontSize: 9.5, color: C.t3, fontWeight: 400, marginLeft: 3 }}>USDT</span>
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Actions rapides */}
          <div style={{ ...card }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ ...sH }}>Actions rapides</span>
            </div>
            {([
              { label: 'Envoyer un paiement',   Icon: Send,            to: 'payment',   primary: true  },
              { label: 'Déposer des fonds',      Icon: ArrowDownToLine, to: 'deposit',   primary: false },
              { label: 'Ajouter un fournisseur', Icon: Plus,            to: 'suppliers', primary: false },
              { label: 'Historique',             Icon: Download,        to: 'history',   primary: false },
            ] as const).map((a, i, arr) => {
              const { Icon } = a;
              return (
                <button key={a.label} onClick={() => onNavigate(a.to)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', background: 'transparent', border: 'none',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                  cursor: 'pointer', fontFamily: FONT, transition: 'background .1s', textAlign: 'left',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: a.primary ? C.teal : C.l3,
                    border: `1px solid ${a.primary ? C.teal : C.bd}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 12, height: 12, color: a.primary ? '#fff' : C.t2 }} />
                  </div>
                  <span style={{ fontSize: 12, color: a.primary ? C.t1 : C.t2, fontWeight: a.primary ? 500 : 400 }}>
                    {a.label}
                  </span>
                  <span style={{ marginLeft: 'auto', color: C.t3, fontSize: 14 }}>›</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
