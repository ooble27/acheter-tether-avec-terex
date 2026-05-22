import { useState, useEffect } from 'react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Send, Plus, Download, ArrowDownToLine, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onNavigate: (section: string) => void;
}

const C = {
  bg:   '#141414',
  l1:   '#1a1a1a',
  l2:   '#202020',
  l3:   '#272727',
  bd:   '#2e2e2e',
  bds:  '#222222',
  teal: '#3B968F',
  tealD:'rgba(59,150,143,0.08)',
  t1:   '#e8e8e8',
  t2:   '#808080',
  t3:   '#4e4e4e',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const CARD = 'linear-gradient(160deg, #1c1c1c 0%, #161616 100%)';

const DEMO_VOLUME = [
  { j: 'Lun', v: 1200 }, { j: 'Mar', v: 3400 }, { j: 'Mer', v: 900 },
  { j: 'Jeu', v: 5200 }, { j: 'Ven', v: 2100 }, { j: 'Sam', v: 4600 },
  { j: 'Auj', v: 1800 },
];

const STATUS: Record<string, string> = {
  pending:    'En attente',
  processing: 'En cours',
  completed:  'Complété',
  failed:     'Échoué',
};

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const p = (name || 'U').split(' ').filter(Boolean);
  const s = p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : (p[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'rgba(59,150,143,0.12)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    }}>{s}</div>
  );
}

function Tip({ active, payload, label }: { active?: boolean; payload?: Array<{value:number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
      <p style={{ color: C.t3, fontSize: 11, margin: '0 0 3px' }}>{label}</p>
      <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: MONO }}>
        {payload[0].value.toLocaleString('fr-FR')} USDT
      </p>
    </div>
  );
}

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const { usdtToCfa, loading: rateLoading, lastUpdated } = useCryptoRates();
  const userId = session?.user?.id || user?.email || 'guest';
  const k = (x: string) => `terex_b2b_${userId}_${x}`;

  const [payments, setPayments]   = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [secAgo, setSecAgo]       = useState(0);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(k('payments'))  || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(k('suppliers'))|| '[]'));
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
  const pending   = payments.filter(p => ['pending','processing'].includes(p.status)).length;
  const recent    = [...payments].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const chart = payments.length > 0 ? (() => {
    const lbl = ['Lun','Mar','Mer','Jeu','Ven','Sam','Auj'];
    const d: Record<string,number> = {}; lbl.forEach(l => { d[l] = 0; });
    payments.forEach(p => {
      const day = new Date(p.createdAt).getDay();
      const l   = lbl[day === 0 ? 6 : day - 1] || 'Auj';
      d[l] = (d[l] || 0) + (p.amount || 0);
    });
    return lbl.map(j => ({ j, v: d[j] || 0 }));
  })() : DEMO_VOLUME;

  const today     = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const firstName = (user?.name || '').split(' ')[0] || 'là';
  const rateText  = rateLoading ? '…' : usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const rateAge   = !rateLoading && lastUpdated ? (secAgo < 10 ? 'temps réel' : `il y a ${secAgo}s`) : '';

  /* ─ shared card style ─ */
  const card = {
    background: CARD,
    border: `1px solid ${C.bds}`,
    borderRadius: 16,
    overflow: 'hidden' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT }}>

      {/* ── 1. Header ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, paddingBottom: 4 }}>
        <div>
          <p style={{ fontSize: 11, color: C.t3, margin: 0, textTransform: 'capitalize' }}>{today}</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: C.t1, margin: '4px 0 0', letterSpacing: '-0.025em' }}>
            Bonjour, {firstName}
          </h2>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => onNavigate('deposit')} style={{
            display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8,
            background:'transparent', border:`1px solid ${C.bd}`, color:C.t2,
            fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:FONT, transition:'all 0.15s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.teal; e.currentTarget.style.color=C.t1; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.bd;   e.currentTarget.style.color=C.t2; }}
          >
            <ArrowDownToLine style={{width:12,height:12}} /> Déposer
          </button>
          <button onClick={() => onNavigate('payment')} style={{
            display:'flex', alignItems:'center', gap:6, padding:'8px 15px', borderRadius:8,
            background:C.teal, border:`1px solid ${C.teal}`, color:'#fff',
            fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:FONT, transition:'background 0.15s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#2d7870'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.teal;    }}
          >
            <Send style={{width:12,height:12}} /> Envoyer un paiement
          </button>
        </div>
      </div>

      {/* ── 2. Pipeline XOF → USDT ── */}
      <div style={{ ...card }}>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display:'flex', alignItems:'stretch', gap:0 }}>

            {/* XOF */}
            <div style={{ flex:1, padding:'16px 20px', borderRight:`1px solid ${C.bds}` }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.t3, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 12px' }}>
                Vous déposez
              </p>
              <p style={{ fontSize:28, fontWeight:800, color:C.t1, margin:0, fontFamily:MONO, letterSpacing:'-0.04em', lineHeight:1 }}>
                XOF
              </p>
              <p style={{ fontSize:11, color:C.t3, margin:'10px 0 0', lineHeight:1.7 }}>
                Wave<br/>Orange Money<br/>Free Money<br/>Virement bancaire
              </p>
            </div>

            {/* Taux */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 28px', flexShrink:0, gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ width:10, height:1, background: C.teal, opacity: 0.3 + i * 0.2, borderRadius:1 }}/>
                ))}
                <ArrowRight style={{ width:13, height:13, color:C.teal }}/>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:9, color:C.t3, margin:0, letterSpacing:'0.1em', textTransform:'uppercase' }}>1 USDT</p>
                <p style={{ fontSize:20, fontWeight:700, color:C.teal, margin:'4px 0 2px', fontFamily:MONO, letterSpacing:'-0.03em' }}>
                  {rateText}
                </p>
                <p style={{ fontSize:9, color:C.t3, margin:0 }}>XOF{rateAge ? ` · ${rateAge}` : ''}</p>
              </div>
            </div>

            {/* USDT */}
            <div style={{ flex:1, padding:'16px 20px', borderLeft:`1px solid ${C.bds}` }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.teal, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 12px', opacity:0.7 }}>
                Destinataire reçoit
              </p>
              <p style={{ fontSize:28, fontWeight:800, color:C.teal, margin:0, fontFamily:MONO, letterSpacing:'-0.04em', lineHeight:1 }}>
                USDT
              </p>
              <p style={{ fontSize:11, color:C.t3, margin:'10px 0 0', lineHeight:1.7 }}>
                TRC20<br/>BEP20<br/>ERC20<br/>Polygon
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── 3. Métriques ── */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap:10 }}>
        {[
          { label:'Volume envoyé',    value: usdtTotal > 0 ? usdtTotal.toLocaleString('fr-FR', {maximumFractionDigits:0}) : '—', unit: usdtTotal > 0 ? 'USDT' : '', sub:'Ce mois, complété' },
          { label:'Taux en cours',    value: rateText, unit:'XOF', sub:'Par 1 USDT' },
          { label:'En attente',       value: pending > 0 ? String(pending) : '—', unit: pending > 0 ? 'paiement' + (pending>1?'s':'') : '', sub:'À traiter' },
          { label:'Fournisseurs',     value: suppliers.length > 0 ? String(suppliers.length) : '—', unit:'', sub:'Contacts enregistrés' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding:'16px 18px' }}>
            <p style={{ fontSize:9.5, fontWeight:600, color:C.t3, letterSpacing:'0.09em', textTransform:'uppercase', margin:'0 0 10px' }}>
              {s.label}
            </p>
            <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
              <span style={{ fontSize:24, fontWeight:700, color:C.t1, fontFamily:MONO, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>
                {s.value}
              </span>
              {s.unit && <span style={{ fontSize:10, color:C.t3 }}>{s.unit}</span>}
            </div>
            <p style={{ fontSize:11, color:C.t3, margin:'6px 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 4. Corps — transactions + actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr]" style={{ gap:10 }}>

        {/* Transactions */}
        <div style={{ ...card }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${C.bds}` }}>
            <span style={{ fontSize:12, fontWeight:600, color:C.t1 }}>Transactions récentes</span>
            <button onClick={() => onNavigate('history')} style={{ fontSize:11, color:C.teal, background:'none', border:'none', cursor:'pointer', fontFamily:FONT, padding:0, opacity:.8 }}
              onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; }}
              onMouseLeave={e=>{ e.currentTarget.style.opacity='.8'; }}
            >Voir tout →</button>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding:'48px 20px', textAlign:'center' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:C.tealD, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <Send style={{ width:15, height:15, color:C.teal }}/>
              </div>
              <p style={{ color:C.t3, fontSize:13, margin:'0 0 8px' }}>Aucune transaction</p>
              <button onClick={() => onNavigate('payment')} style={{ color:C.teal, fontSize:12, background:'none', border:'none', cursor:'pointer', fontFamily:FONT, opacity:.8 }}
                onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; }}
                onMouseLeave={e=>{ e.currentTarget.style.opacity='.8'; }}
              >Créer votre premier paiement →</button>
            </div>
          ) : (
            <>
              {recent.map((tx, i) => (
                <div key={tx.id}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderBottom: i < recent.length-1 ? `1px solid ${C.bds}` : 'none', transition:'background .1s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}
                >
                  <Avatar name={tx.supplierName || '?'} size={34}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:C.t1, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize:11, color:C.t3, margin:'2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      {tx.network && <span style={{ marginLeft:6, background:C.l3, borderRadius:4, padding:'1px 5px', fontSize:9.5 }}>{tx.network}</span>}
                    </p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:C.t1, margin:0, fontFamily:MONO, fontVariantNumeric:'tabular-nums' }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}
                      <span style={{ fontSize:10, color:C.t3, fontWeight:400, marginLeft:4 }}>USDT</span>
                    </p>
                    <p style={{ fontSize:10, color:C.t3, margin:'3px 0 0' }}>
                      {STATUS[tx.status] || tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Actions + taux */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

          {/* Taux compact */}
          <div style={{ ...card, padding:'16px 20px' }}>
            <p style={{ fontSize:9.5, fontWeight:600, color:C.t3, letterSpacing:'0.09em', textTransform:'uppercase', margin:'0 0 8px' }}>USDT / XOF</p>
            <p style={{ fontSize:26, fontWeight:700, color:C.t1, margin:0, fontFamily:MONO, letterSpacing:'-0.03em', lineHeight:1 }}>
              {rateText}
            </p>
            <p style={{ fontSize:10, color:C.t3, margin:'6px 0 0' }}>
              {rateAge || 'Chargement…'}
            </p>
          </div>

          {/* Actions */}
          <div style={{ ...card, flex:1 }}>
            <div style={{ padding:'12px 18px', borderBottom:`1px solid ${C.bds}` }}>
              <p style={{ fontSize:9.5, fontWeight:600, color:C.t3, letterSpacing:'0.09em', textTransform:'uppercase', margin:0 }}>Actions</p>
            </div>
            {[
              { label:'Envoyer un paiement',    Icon:Send,            to:'payment',   primary:true  },
              { label:'Déposer des fonds',       Icon:ArrowDownToLine, to:'deposit',   primary:false },
              { label:'Ajouter un fournisseur',  Icon:Plus,            to:'suppliers', primary:false },
              { label:'Historique',              Icon:Download,        to:'history',   primary:false },
            ].map((a, i, arr) => {
              const { Icon } = a;
              return (
                <button key={a.label} onClick={() => onNavigate(a.to)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'10px 16px', background:'transparent', border:'none',
                    borderBottom: i < arr.length-1 ? `1px solid ${C.bds}` : 'none',
                    cursor:'pointer', fontFamily:FONT, transition:'background .1s', textAlign:'left',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.025)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}
                >
                  <div style={{
                    width:28, height:28, borderRadius:7, flexShrink:0,
                    background: a.primary ? C.teal : C.l3,
                    border:`1px solid ${a.primary ? C.teal : C.bd}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon style={{ width:12, height:12, color: a.primary ? '#fff' : C.t2 }}/>
                  </div>
                  <span style={{ fontSize:12, color: a.primary ? C.t1 : C.t2, fontWeight: a.primary ? 500 : 400 }}>
                    {a.label}
                  </span>
                  <span style={{ marginLeft:'auto', color:C.t3, fontSize:13 }}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. Graphique ── */}
      <div style={{ ...card }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${C.bds}` }}>
          <div>
            <span style={{ fontSize:12, fontWeight:600, color:C.t1 }}>Volume hebdomadaire</span>
            <p style={{ fontSize:10, color:C.t3, margin:'3px 0 0' }}>USDT envoyé · 7 jours</p>
          </div>
          {payments.length === 0 && (
            <span style={{ fontSize:9.5, color:C.t3, background:C.l3, border:`1px solid ${C.bd}`, borderRadius:5, padding:'3px 8px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              Aperçu
            </span>
          )}
        </div>
        <div style={{ padding:'14px 14px 10px' }}>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={chart} margin={{ top:4, right:4, bottom:0, left:-14 }}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.teal} stopOpacity={0.15}/>
                  <stop offset="100%" stopColor={C.teal} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
              <XAxis dataKey="j" tick={{ fill:C.t3, fontSize:9.5 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.t3, fontSize:9.5 }} axisLine={false} tickLine={false}
                tickFormatter={v => v>=1000 ? `${(v/1000).toFixed(0)}k` : String(v)}/>
              <Tooltip content={<Tip/>} cursor={{ stroke:C.teal, strokeWidth:1, strokeDasharray:'4 4' }}/>
              <Area type="monotone" dataKey="v" stroke={C.teal} strokeWidth={1.5}
                fill="url(#vg)" dot={false} isAnimationActive={false}
                activeDot={{ r:3, fill:C.teal, stroke:'#141414', strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
