import { useState, useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, X, Upload } from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.10)', tealB: 'rgba(59,150,143,0.25)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const DAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

interface Recipient { id: string; name: string; wallet: string; network: string; amount: string; }
interface ScheduledPayment { id: string; date: Date; supplier: string; amount: string; network: string; }
interface Recurrence { id: string; supplier: string; amount: string; frequency: string; nextDate: string; status: 'active' | 'paused'; }
interface PendingApproval { id: string; supplier: string; amount: string; requestedBy: string; date: string; status: 'pending' | 'approved' | 'rejected'; }

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: 22, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 12px', fontFamily: FONT }}>
      {children}
    </p>
  );
}

function TealBtn({ children, onClick, style, disabled }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? C.l3 : hov ? C.tealH : C.teal, color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} style={{ background: hov ? C.l3 : 'rgba(255,255,255,0.05)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 600, color: C.t2, flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function truncWallet(w: string) {
  if (w.length <= 16) return w;
  return w.slice(0, 8) + '…' + w.slice(-6);
}

function MiniCalendar({ scheduledDates, selectedDate, onSelectDate }: { scheduledDates: Date[]; selectedDate: Date | null; onSelectDate: (d: Date) => void }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const paymentDays = new Set(scheduledDates.filter(d => d.getFullYear() === year && d.getMonth() === month).map(d => d.getDate()));
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSel = (day: number) => selectedDate !== null && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: '4px 8px', borderRadius: 6, transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = C.l3} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <ChevronLeft size={15} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{MONTH_NAMES[month]} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: '4px 8px', borderRadius: 6, transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = C.l3} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <ChevronRight size={15} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAY_HEADERS.map((h, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: C.t3, fontFamily: FONT, padding: '4px 0' }}>{h}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const sel = isSel(day);
          const hasPay = paymentDays.has(day);
          return (
            <div key={i}
              onClick={() => onSelectDate(new Date(year, month, day))}
              style={{ height: 32, borderRadius: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: sel ? C.teal : isToday ? C.tealT : 'transparent', border: `1px solid ${sel ? C.teal : isToday ? C.tealB : 'transparent'}`, color: sel ? '#fff' : isToday ? C.teal : C.t2, fontSize: 12, fontFamily: FONT, cursor: 'pointer', position: 'relative', transition: 'all 0.1s', userSelect: 'none' }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = isToday ? C.tealT : 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = isToday ? C.tealT : 'transparent'; }}
            >
              {day}
              {hasPay && !sel && (
                <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: C.teal }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BusinessBatch({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: 'Shenzhen Electronics', wallet: 'TQn7hB9kNYX4zCN8e2mJ', network: 'TRC20', amount: '2500' },
    { id: '2', name: 'Lagos Imports Ltd', wallet: '0xd3e8b4f6c2a1f9e5c7b0', network: 'BEP20', amount: '1800' },
  ]);
  const [previewing, setPreviewing] = useState(false);
  const [batchSent, setBatchSent] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    { id: 'sp1', date: new Date(today.getFullYear(), today.getMonth(), 8), supplier: 'Shenzhen Electronics', amount: '3 200', network: 'TRC20' },
    { id: 'sp2', date: new Date(today.getFullYear(), today.getMonth(), 15), supplier: 'Lagos Imports Ltd', amount: '1 500', network: 'BEP20' },
    { id: 'sp3', date: new Date(today.getFullYear(), today.getMonth(), 22), supplier: 'Dubai Trade Co.', amount: '800', network: 'ERC20' },
  ]);

  const [recurrences, setRecurrences] = useState<Recurrence[]>([
    { id: 'r1', supplier: 'Shenzhen Electronics', amount: '3 200 USDT', frequency: 'Mensuel', nextDate: '01/06/2026', status: 'active' },
    { id: 'r2', supplier: 'Lagos Imports Ltd', amount: '1 500 USDT', frequency: 'Hebdomadaire', nextDate: '18/05/2026', status: 'active' },
    { id: 'r3', supplier: 'Dubai Trade Co.', amount: '5 000 USDT', frequency: 'Trimestriel', nextDate: '01/07/2026', status: 'paused' },
  ]);

  const [approvals, setApprovals] = useState<PendingApproval[]>([
    { id: 'a1', supplier: 'Shenzhen Electronics', amount: '12 500 USDT', requestedBy: 'Fatou Ndiaye', date: '14/05/2026', status: 'pending' },
  ]);

  const addRecipient = () => setRecipients(r => [...r, { id: Date.now().toString(), name: '', wallet: '', network: 'TRC20', amount: '' }]);
  const removeRecipient = (id: string) => setRecipients(r => r.filter(x => x.id !== id));
  const updateRecipient = (id: string, field: keyof Recipient, value: string) => setRecipients(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));
  const totalAmount = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const activeRecurrences = recurrences.filter(r => r.status === 'active').length;

  const inputStyle: React.CSSProperties = { height: 32, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 7, padding: '0 8px', color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT, width: '100%', boxSizing: 'border-box' };

  const fmtDate = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1100, margin: '0 auto', padding: '8px 0 48px', display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 21, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Lots & Planification</h2>
            <p style={{ color: C.t3, fontSize: 12, margin: '5px 0 18px' }}>Paiements groupés, planifiés et récurrents</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Planifiés', value: scheduledPayments.length },
                { label: 'Récurrences actives', value: activeRecurrences },
                { label: 'En attente', value: pendingCount },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: C.t3 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <GhostBtn>Planifier</GhostBtn>
            <TealBtn onClick={() => { setPreviewing(false); setBatchSent(false); }}>+ Nouveau lot</TealBtn>
          </div>
        </div>
      </div>

      {/* ── 2 colonnes : lot + calendrier ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row" style={{ gap: 20 }}>

        {/* LEFT: Paiement groupé */}
        <div className="w-full lg:w-[55%]">
          <Card>
            <Label>Paiement groupé par lot</Label>

            {batchSent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={20} color={C.t1} strokeWidth={2.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>Lot soumis</div>
                <div style={{ fontSize: 12, color: C.t3, marginBottom: 22 }}>
                  {recipients.length} destinataire{recipients.length > 1 ? 's' : ''} · {totalAmount.toLocaleString('fr-FR')} USDT
                </div>
                <TealBtn onClick={() => { setBatchSent(false); setPreviewing(false); setRecipients([]); }}>
                  Nouveau lot
                </TealBtn>
              </div>
            ) : previewing ? (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: '0 0 12px' }}>Confirmation du lot</p>
                <div style={{ border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px', padding: '8px 14px', background: C.l2, borderBottom: `1px solid ${C.bds}`, fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span>Nom</span><span>Wallet</span><span>Réseau</span><span style={{ textAlign: 'right' }}>Montant</span>
                  </div>
                  {recipients.map((r, i) => (
                    <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px', padding: '10px 14px', borderBottom: i < recipients.length - 1 ? `1px solid ${C.bds}` : 'none', fontSize: 12, color: C.t1, alignItems: 'center' }}>
                      <span>{r.name || '—'}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.t2 }}>{truncWallet(r.wallet)}</span>
                      <span style={{ color: C.t2 }}>{r.network}</span>
                      <span style={{ textAlign: 'right', fontFamily: MONO, fontWeight: 600 }}>{r.amount}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: C.l2, borderTop: `1px solid ${C.bds}` }}>
                    <span style={{ fontSize: 12, color: C.t3 }}>{recipients.length} destinataire{recipients.length > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 12, color: C.t1, fontFamily: MONO, fontWeight: 600 }}>{totalAmount.toLocaleString('fr-FR')} USDT</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <GhostBtn onClick={() => setPreviewing(false)}>Modifier</GhostBtn>
                  <TealBtn onClick={() => setBatchSent(true)} style={{ flex: 1 }}>Confirmer le lot</TealBtn>
                </div>
              </div>
            ) : (
              <div>
                {/* Zone CSV */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); }}
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `1px dashed ${dragOver ? C.teal : C.bds}`, borderRadius: 10, padding: '18px', textAlign: 'center', cursor: 'pointer', background: dragOver ? C.tealT : 'transparent', transition: 'all 0.12s', marginBottom: 16 }}
                >
                  <Upload size={18} color={C.t3} style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: 12, color: C.t3 }}>Déposer un fichier CSV ou cliquer</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 3, opacity: 0.7 }}>Format : nom, wallet, réseau, montant</div>
                </div>
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} />

                {/* Tableau destinataires */}
                {recipients.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px 76px 28px', padding: '7px 10px', background: C.l2, borderRadius: '8px 8px 0 0', border: `1px solid ${C.bds}`, borderBottom: 'none', fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      <span>Nom</span><span>Wallet</span><span>Réseau</span><span>Montant</span><span />
                    </div>
                    <div style={{ border: `1px solid ${C.bds}`, borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                      {recipients.map((r, i) => (
                        <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px 76px 28px', padding: '6px 10px', gap: 6, alignItems: 'center', borderBottom: i < recipients.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                          <input value={r.name} onChange={e => updateRecipient(r.id, 'name', e.target.value)} placeholder="Nom" style={inputStyle} />
                          <input value={r.wallet} onChange={e => updateRecipient(r.id, 'wallet', e.target.value)} placeholder="Wallet" style={{ ...inputStyle, fontFamily: MONO, fontSize: 11 }} />
                          <select value={r.network} onChange={e => updateRecipient(r.id, 'network', e.target.value)} style={{ ...inputStyle, appearance: 'none', width: 86 }}>
                            {['TRC20', 'BEP20', 'ERC20', 'POLYGON'].map(n => <option key={n}>{n}</option>)}
                          </select>
                          <input value={r.amount} onChange={e => updateRecipient(r.id, 'amount', e.target.value)} placeholder="0" type="number" style={{ ...inputStyle, textAlign: 'right', fontFamily: MONO, width: 72 }} />
                          <button onClick={() => removeRecipient(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 4, transition: 'color 0.12s' }}
                            onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.t3}>
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <button onClick={addRecipient} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px dashed ${C.bds}`, borderRadius: 7, padding: '6px 12px', color: C.t3, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                    <Plus size={13} /> Ajouter un destinataire
                  </button>
                  {recipients.length > 0 && (
                    <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>
                      {recipients.length} · <span style={{ color: C.t1, fontWeight: 600 }}>{totalAmount.toLocaleString('fr-FR')} USDT</span>
                    </span>
                  )}
                </div>

                <TealBtn onClick={() => setPreviewing(true)} disabled={recipients.length === 0} style={{ width: '100%' }}>
                  Prévisualiser et envoyer
                </TealBtn>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT: Calendrier */}
        <div className="w-full lg:w-[45%]">
          <Card>
            <Label>Calendrier des paiements</Label>
            <MiniCalendar
              scheduledDates={scheduledPayments.map(p => p.date)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {selectedDate && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 9 }}>
                <p style={{ fontSize: 11, color: C.t3, margin: '0 0 2px' }}>Date sélectionnée</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: MONO, margin: 0 }}>{fmtDate(selectedDate)}</p>
              </div>
            )}

            <div style={{ marginTop: 18, borderTop: `1px solid ${C.bds}`, paddingTop: 16 }}>
              <Label>Paiements à venir</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {scheduledPayments.sort((a, b) => a.date.getTime() - b.date.getTime()).map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: C.l2, borderRadius: 9, border: `1px solid ${C.bds}` }}>
                    <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: C.t2, fontFamily: MONO }}>
                      {fmtDate(p.date)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.supplier}</div>
                      <div style={{ fontSize: 11, color: C.t3 }}>{p.amount} USDT · {p.network}</div>
                    </div>
                    <button onClick={() => setScheduledPayments(prev => prev.filter(x => x.id !== p.id))} style={{ background: 'none', border: `1px solid ${C.bds}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', flexShrink: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                      Annuler
                    </button>
                  </div>
                ))}
                {scheduledPayments.length === 0 && (
                  <p style={{ fontSize: 12, color: C.t3, textAlign: 'center', padding: '16px 0', margin: 0 }}>Aucun paiement planifié</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Récurrences ───────────────────────────────────────────── */}
      <Card>
        <Label>Récurrences actives</Label>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                {['Fournisseur', 'Montant', 'Fréquence', 'Prochain envoi', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recurrences.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < recurrences.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={r.supplier} size={28} />
                      <span style={{ fontSize: 13, color: C.t1 }}>{r.supplier}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: C.t1, fontFamily: MONO, whiteSpace: 'nowrap' }}>{r.amount}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: C.t2 }}>{r.frequency}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: C.t2, fontFamily: MONO }}>{r.nextDate}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: r.status === 'active' ? C.t2 : C.t3 }}>
                    {r.status === 'active' ? 'Actif' : 'Pausé'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setRecurrences(prev => prev.map(x => x.id === r.id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x))}
                        style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontFamily: FONT, transition: 'all 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                        {r.status === 'active' ? 'Pause' : 'Activer'}
                      </button>
                      <button onClick={() => setRecurrences(prev => prev.filter(x => x.id !== r.id))}
                        style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontFamily: FONT, transition: 'all 0.12s', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                        <X size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Approbations ──────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Label>Paiements en attente d'approbation</Label>
          {pendingCount > 0 && (
            <span style={{ background: C.l2, border: `1px solid ${C.bds}`, color: C.t2, borderRadius: 8, padding: '2px 8px', fontSize: 11, fontWeight: 600, marginTop: -12 }}>
              {pendingCount}
            </span>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                {['Fournisseur', 'Montant', 'Demandé par', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvals.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < approvals.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={a.supplier} size={28} />
                      <span style={{ fontSize: 13, color: C.t1 }}>{a.supplier}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: MONO, color: C.t1, fontWeight: 600, whiteSpace: 'nowrap' }}>{a.amount}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: C.t2 }}>{a.requestedBy}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: C.t3, fontFamily: MONO }}>{a.date}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {a.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'approved' } : x))}
                          style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', border: `1px solid ${C.tealB}`, background: C.tealT, color: C.teal, fontFamily: FONT, fontWeight: 500, transition: 'all 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.tealT; e.currentTarget.style.color = C.teal; }}>
                          Approuver
                        </button>
                        <button onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'rejected' } : x))}
                          style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontFamily: FONT, transition: 'all 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: a.status === 'approved' ? C.t2 : C.t3 }}>
                        {a.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                      </span>
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
