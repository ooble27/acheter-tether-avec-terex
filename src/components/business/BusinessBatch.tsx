import { useState, useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, X, Upload } from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
      padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', ...style,

    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.08em',
      textTransform: 'uppercase', fontFamily: FONT, marginBottom: 12,
    }}>{children}</div>
  );
}

function TealBtn({ children, onClick, style, disabled }: {
  children: React.ReactNode; onClick?: () => void;
  style?: React.CSSProperties; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.l3 : hov ? C.tealH : C.teal,
      color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 8,
      padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} style={{
      background: hov ? C.l3 : 'transparent', color: C.t2, border: `1px solid ${C.bd}`,
      borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

function truncWallet(w: string) {
  if (w.length <= 16) return w;
  return w.slice(0, 8) + '…' + w.slice(-6);
}

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const colors = [C.teal, C.amber, C.blue, C.purple, C.red];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: colors[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{name.charAt(0).toUpperCase()}</div>
  );
}

// ── Types ──────────────────────────────────────────────────────────
interface Recipient {
  id: string;
  name: string;
  wallet: string;
  network: string;
  amount: string;
}

interface ScheduledPayment {
  id: string;
  date: Date;
  supplier: string;
  amount: string;
  network: string;
}

interface Recurrence {
  id: string;
  supplier: string;
  amount: string;
  frequency: string;
  nextDate: string;
  status: 'active' | 'paused';
}

interface PendingApproval {
  id: string;
  supplier: string;
  amount: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ── Mini Calendar ─────────────────────────────────────────────────
const DAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function MiniCalendar({ scheduledDates }: { scheduledDates: Date[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of month (adjust so Monday=0)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Payment dates set for quick lookup
  const paymentDays = new Set(
    scheduledDates
      .filter(d => d.getFullYear() === year && d.getMonth() === month)
      .map(d => d.getDate())
  );

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={prevMonth} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: C.t3,
          padding: '4px 8px', borderRadius: 4, transition: 'background 0.12s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.l3}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        ><ChevronLeft size={16} /></button>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.t1, fontFamily: FONT }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={nextMonth} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: C.t3,
          padding: '4px 8px', borderRadius: 4, transition: 'background 0.12s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.l3}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        ><ChevronRight size={16} /></button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAY_HEADERS.map(h => (
          <div key={h} style={{ textAlign: 'center', fontSize: 10, color: C.t3, fontFamily: FONT, padding: '4px 0' }}>{h}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasPay = paymentDays.has(day);
          return (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: 6, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: isToday ? C.tealT : 'transparent',
              border: isToday ? `1px solid ${C.tealB}` : '1px solid transparent',
              color: isToday ? C.teal : C.t2, fontSize: 12, fontFamily: FONT,
              position: 'relative',
            }}>
              {day}
              {hasPay && (
                <div style={{
                  position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: C.teal,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export function BusinessBatch({ user }: {
  user: { email: string; name: string; id?: string } | null;
}) {
  // Batch state
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: 'Shenzhen Electronics', wallet: 'TQn7hB9kNYX4zCN8e2mJ', network: 'TRC20', amount: '2500' },
    { id: '2', name: 'Lagos Imports Ltd', wallet: '0xd3e8b4f6c2a1f9e5c7b0', network: 'BEP20', amount: '1800' },
  ]);
  const [previewing, setPreviewing] = useState(false);
  const [batchSent, setBatchSent] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Scheduled payments (mock)
  const today = new Date();
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    { id: 'sp1', date: new Date(today.getFullYear(), today.getMonth(), 8), supplier: 'Shenzhen Electronics', amount: '3,200', network: 'TRC20' },
    { id: 'sp2', date: new Date(today.getFullYear(), today.getMonth(), 15), supplier: 'Lagos Imports Ltd', amount: '1,500', network: 'BEP20' },
    { id: 'sp3', date: new Date(today.getFullYear(), today.getMonth(), 22), supplier: 'Dubai Trade Co.', amount: '800', network: 'ERC20' },
  ]);

  // Recurrences (mock)
  const [recurrences, setRecurrences] = useState<Recurrence[]>([
    { id: 'r1', supplier: 'Shenzhen Electronics', amount: '3,200 USDT', frequency: 'Mensuel', nextDate: '01/06/2026', status: 'active' },
    { id: 'r2', supplier: 'Lagos Imports Ltd', amount: '1,500 USDT', frequency: 'Hebdomadaire', nextDate: '18/05/2026', status: 'active' },
    { id: 'r3', supplier: 'Dubai Trade Co.', amount: '5,000 USDT', frequency: 'Trimestriel', nextDate: '01/07/2026', status: 'paused' },
  ]);

  // Pending approvals (mock)
  const [approvals, setApprovals] = useState<PendingApproval[]>([
    { id: 'a1', supplier: 'Shenzhen Electronics', amount: '12,500 USDT', requestedBy: 'Fatou Ndiaye', date: '14/05/2026', status: 'pending' },
  ]);

  const addRecipient = () => {
    setRecipients(r => [...r, { id: Date.now().toString(), name: '', wallet: '', network: 'TRC20', amount: '' }]);
  };

  const removeRecipient = (id: string) => setRecipients(r => r.filter(x => x.id !== id));

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  const totalAmount = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  const cancelScheduled = (id: string) => setScheduledPayments(p => p.filter(x => x.id !== id));

  const toggleRecurrence = (id: string) => {
    setRecurrences(r => r.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x));
  };

  const deleteRecurrence = (id: string) => setRecurrences(r => r.filter(x => x.id !== id));

  const handleApprove = (id: string) => {
    setApprovals(a => a.map(x => x.id === id ? { ...x, status: 'approved' } : x));
  };

  const handleReject = (id: string) => {
    setApprovals(a => a.map(x => x.id === id ? { ...x, status: 'rejected' } : x));
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const activeRecurrences = recurrences.filter(r => r.status === 'active').length;

  const inlineInputStyle = (width?: string | number): React.CSSProperties => ({
    height: 32, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6,
    padding: '0 8px', color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT,
    width: width || '100%', boxSizing: 'border-box',
  });

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1100, margin: '0 auto', padding: '8px 0 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.t1 }}>Lots & Planification</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>Paiements groupés et récurrents</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostBtn onClick={() => {}}>+ Planifier</GhostBtn>
          <TealBtn onClick={() => { setPreviewing(false); setBatchSent(false); }}>+ Nouveau lot</TealBtn>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16 }}>
        {[
          { label: 'Paiements planifiés', value: scheduledPayments.length, color: C.teal, bg: C.tealT, border: C.tealB },
          { label: 'Récurrences actives', value: activeRecurrences, color: C.em, bg: C.emT, border: C.emB },
          { label: 'En attente d\'approbation', value: pendingCount, color: C.amber, bg: C.amberT, border: C.amberB },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: MONO }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="flex flex-col lg:flex-row" style={{ gap: 20 }}>
        {/* LEFT: Batch payments */}
        <div className="w-full lg:w-[55%]" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionTitle>Paiement groupé par lot</SectionTitle>

            {batchSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: C.emT,
                  border: `2px solid ${C.emB}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <Check size={22} color={C.em} strokeWidth={3} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 6 }}>Lot soumis !</div>
                <div style={{ fontSize: 13, color: C.t3, marginBottom: 20 }}>
                  {recipients.length} destinataire{recipients.length > 1 ? 's' : ''} · {totalAmount.toFixed(2)} USDT total
                </div>
                <TealBtn onClick={() => { setBatchSent(false); setPreviewing(false); setRecipients([]); }}>
                  Nouveau lot
                </TealBtn>
              </div>
            ) : previewing ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>Confirmation du lot</div>
                <div style={{ border: `1px solid ${C.bds}`, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px',
                    padding: '8px 12px', background: C.l2, borderBottom: `1px solid ${C.bds}`,
                    fontSize: 11, color: C.t3, fontWeight: 600,
                  }}>
                    <span>NOM</span><span>WALLET</span><span>RÉSEAU</span><span style={{ textAlign: 'right' }}>MONTANT</span>
                  </div>
                  {recipients.map((r, i) => (
                    <div key={r.id} style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px',
                      padding: '10px 12px', borderBottom: i < recipients.length - 1 ? `1px solid ${C.bds}` : 'none',
                      fontSize: 13, color: C.t1,
                    }}>
                      <span>{r.name || '—'}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.t2 }}>{truncWallet(r.wallet)}</span>
                      <span style={{ color: C.t2 }}>{r.network}</span>
                      <span style={{ textAlign: 'right', fontFamily: MONO, color: C.teal }}>{r.amount}</span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', padding: '10px 12px',
                    background: C.l2, borderTop: `1px solid ${C.bds}`, fontWeight: 600,
                  }}>
                    <span style={{ fontSize: 13, color: C.t2 }}>{recipients.length} destinataire{recipients.length > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 13, color: C.teal, fontFamily: MONO }}>Total: {totalAmount.toFixed(2)} USDT</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <GhostBtn onClick={() => setPreviewing(false)}>Modifier</GhostBtn>
                  <TealBtn onClick={() => setBatchSent(true)} style={{ flex: 1 }}>
                    Confirmer le lot
                  </TealBtn>
                </div>
              </div>
            ) : (
              <div>
                {/* CSV drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); }}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `1px dashed ${dragOver ? C.teal : C.bds}`,
                    borderRadius: 8, padding: '20px', textAlign: 'center',
                    cursor: 'pointer', background: dragOver ? C.tealT : 'transparent',
                    transition: 'all 0.12s', marginBottom: 16,
                  }}
                >
                  <Upload size={20} color={C.t3} style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: 13, color: C.t3 }}>Déposer un fichier CSV ou cliquer pour importer</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>Format: nom, wallet, réseau, montant</div>
                </div>
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} />

                {/* Recipients table */}
                {recipients.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 90px 80px 32px',
                      padding: '6px 8px', background: C.l2, borderRadius: '6px 6px 0 0',
                      border: `1px solid ${C.bds}`, borderBottom: 'none',
                      fontSize: 10, color: C.t3, fontWeight: 600, letterSpacing: '0.06em',
                    }}>
                      <span>NOM</span><span>WALLET</span><span>RÉSEAU</span><span>MONTANT</span><span />
                    </div>
                    <div style={{ border: `1px solid ${C.bds}`, borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                      {recipients.map((r, i) => (
                        <div key={r.id} style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr 90px 80px 32px',
                          padding: '6px 8px', gap: 6, alignItems: 'center',
                          borderBottom: i < recipients.length - 1 ? `1px solid ${C.bds}` : 'none',
                          background: i % 2 === 0 ? 'transparent' : C.l2,
                        }}>
                          <input value={r.name} onChange={e => updateRecipient(r.id, 'name', e.target.value)}
                            placeholder="Nom" style={inlineInputStyle()} />
                          <input value={r.wallet} onChange={e => updateRecipient(r.id, 'wallet', e.target.value)}
                            placeholder="Wallet" style={{ ...inlineInputStyle(), fontFamily: MONO, fontSize: 11 }} />
                          <select value={r.network} onChange={e => updateRecipient(r.id, 'network', e.target.value)}
                            style={{ ...inlineInputStyle(86), appearance: 'none' }}>
                            {['TRC20', 'BEP20', 'ERC20', 'POLYGON'].map(n => <option key={n}>{n}</option>)}
                          </select>
                          <input value={r.amount} onChange={e => updateRecipient(r.id, 'amount', e.target.value)}
                            placeholder="0" type="number" style={{ ...inlineInputStyle(76), textAlign: 'right', fontFamily: MONO }} />
                          <button onClick={() => removeRecipient(r.id)} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: C.t3,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 4, borderRadius: 4, transition: 'color 0.12s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.color = C.red}
                            onMouseLeave={e => e.currentTarget.style.color = C.t3}
                          ><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add recipient + summary */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <button onClick={addRecipient} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: 'none',
                    border: `1px dashed ${C.bds}`, borderRadius: 6, padding: '6px 12px',
                    color: C.t3, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
                    transition: 'all 0.12s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}
                  >
                    <Plus size={13} /> Ajouter un destinataire
                  </button>
                  {recipients.length > 0 && (
                    <span style={{ fontSize: 12, color: C.t2, fontFamily: MONO }}>
                      {recipients.length} destinataire{recipients.length > 1 ? 's' : ''} · Total: <span style={{ color: C.teal }}>{totalAmount.toFixed(2)} USDT</span>
                    </span>
                  )}
                </div>

                <TealBtn
                  onClick={() => setPreviewing(true)}
                  disabled={recipients.length === 0}
                  style={{ width: '100%' }}
                >
                  Prévisualiser et envoyer
                </TealBtn>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT: Calendar */}
        <div className="w-full lg:w-[45%]" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionTitle>Calendrier des paiements</SectionTitle>
            <MiniCalendar scheduledDates={scheduledPayments.map(p => p.date)} />

            {/* Upcoming payments list */}
            <div style={{ marginTop: 20, borderTop: `1px solid ${C.bds}`, paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t3, marginBottom: 10 }}>Paiements à venir</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scheduledPayments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(p => {
                    const d = p.date;
                    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                    return (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', background: C.l2, borderRadius: 8,
                        border: `1px solid ${C.bds}`,
                      }}>
                        <div style={{
                          flexShrink: 0, background: C.tealT, border: `1px solid ${C.tealB}`,
                          borderRadius: 6, padding: '3px 7px', fontSize: 11, color: C.teal,
                          fontFamily: MONO,
                        }}>{dateStr}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.supplier}</div>
                          <div style={{ fontSize: 11, color: C.t3 }}>{p.amount} USDT · {p.network}</div>
                        </div>
                        <button onClick={() => cancelScheduled(p.id)} style={{
                          background: 'none', border: `1px solid ${C.bd}`, borderRadius: 6,
                          padding: '3px 8px', fontSize: 11, color: C.t3, cursor: 'pointer',
                          fontFamily: FONT, transition: 'all 0.12s', flexShrink: 0,
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
                        >Annuler</button>
                      </div>
                    );
                  })}
                {scheduledPayments.length === 0 && (
                  <div style={{ fontSize: 12, color: C.t3, textAlign: 'center', padding: '12px 0' }}>Aucun paiement planifié</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Récurrences actives */}
      <Card>
        <SectionTitle>Récurrences actives</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                {['Fournisseur', 'Montant', 'Fréquence', 'Prochain envoi', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left', fontSize: 10,
                    fontWeight: 600, color: C.t3, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recurrences.map((r, i) => (
                <tr key={r.id} style={{
                  borderBottom: i < recurrences.length - 1 ? `1px solid ${C.bds}` : 'none',
                  background: i % 2 === 0 ? 'transparent' : C.l2,
                }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={r.supplier} size={28} />
                      <span style={{ fontSize: 13, color: C.t1 }}>{r.supplier}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.t1, fontFamily: MONO }}>{r.amount}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.t2 }}>{r.frequency}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: C.t2, fontFamily: MONO }}>{r.nextDate}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: r.status === 'active' ? C.emT : C.l3,
                      color: r.status === 'active' ? C.em : C.t3,
                      border: `1px solid ${r.status === 'active' ? C.emB : C.bds}`,
                    }}>{r.status === 'active' ? 'Actif' : 'Pausé'}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleRecurrence(r.id)} style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                        border: `1px solid ${C.bd}`, background: 'transparent',
                        color: C.t2, fontFamily: FONT, transition: 'all 0.12s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.teal}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.bd}
                      >{r.status === 'active' ? 'Pause' : 'Activer'}</button>
                      <button onClick={() => deleteRecurrence(r.id)} style={{
                        padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                        border: `1px solid ${C.bd}`, background: 'transparent',
                        color: C.t3, fontFamily: FONT, transition: 'all 0.12s',
                        display: 'flex', alignItems: 'center',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
                      ><X size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Approval queue */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Paiements en attente d'approbation</div>
          {pendingCount > 0 && (
            <span style={{
              background: C.amberT, border: `1px solid ${C.amberB}`, color: C.amber,
              borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 700,
            }}>{pendingCount}</span>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                {['Fournisseur', 'Montant', 'Demandé par', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left', fontSize: 10,
                    fontWeight: 600, color: C.t3, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvals.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < approvals.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={a.supplier} size={28} />
                      <span style={{ fontSize: 13, color: C.t1 }}>{a.supplier}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 13, fontFamily: MONO, color: C.amber }}>{a.amount}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.t2 }}>{a.requestedBy}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: C.t3, fontFamily: MONO }}>{a.date}</td>
                  <td style={{ padding: '12px 12px' }}>
                    {a.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleApprove(a.id)} style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                          border: `1px solid ${C.tealB}`, background: C.tealT,
                          color: C.teal, fontFamily: FONT, fontWeight: 500, transition: 'all 0.12s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.tealT; e.currentTarget.style.color = C.teal; }}
                        >Approuver</button>
                        <button onClick={() => handleReject(a.id)} style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                          border: `1px solid ${C.bd}`, background: 'transparent',
                          color: C.t3, fontFamily: FONT, transition: 'all 0.12s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
                        >Rejeter</button>
                      </div>
                    ) : (
                      <span style={{
                        padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: a.status === 'approved' ? C.emT : C.redT,
                        color: a.status === 'approved' ? C.em : C.red,
                        border: `1px solid ${a.status === 'approved' ? C.emB : C.redB}`,
                      }}>{a.status === 'approved' ? 'Approuvé' : 'Rejeté'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
