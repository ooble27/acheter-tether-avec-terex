import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Clock, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const STEPS = ['Montant & Réseau', 'Bénéficiaire', 'Révision', 'Confirmation'];

const NETWORKS = [
  { id: 'TRC20', label: 'TRC20', sub: 'TRON', dotColor: C.red },
  { id: 'BEP20', label: 'BEP20', sub: 'BSC', dotColor: C.amber },
  { id: 'ERC20', label: 'ERC20', sub: 'Ethereum', dotColor: C.blue },
  { id: 'POLYGON', label: 'Polygon', sub: 'MATIC', dotColor: C.purple },
];

function generateRef() {
  return 'TRX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── StepBar ───────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, fontFamily: FONT, gap: 0 }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: (isDone || isActive) ? C.teal : C.l3,
                color: '#fff',
                transition: 'all 0.12s',
              }}>
                {isDone ? <Check style={{ width: 12, height: 12, strokeWidth: 3 }} /> : n}
              </div>
              <span style={{
                fontSize: 11, fontWeight: isActive ? 500 : 400,
                color: (isDone || isActive) ? C.t2 : C.t3,
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 40, height: 1, marginTop: 12, flexShrink: 0,
                background: isDone ? C.tealB : C.bds,
                transition: 'background 0.12s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────
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

// ── Section title ─────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.08em',
      textTransform: 'uppercase', fontFamily: FONT, marginBottom: 12,
    }}>{children}</div>
  );
}

// ── Input helper ──────────────────────────────────────────────────
function Input({ value, onChange, placeholder, style, type, mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  style?: React.CSSProperties; type?: string; mono?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type || 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: C.l2,
        border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
        borderRadius: 8, padding: '10px 14px', color: C.t1,
        fontSize: 14, outline: 'none', fontFamily: mono ? MONO : FONT,
        boxSizing: 'border-box', transition: 'border-color 0.12s', ...style,
      }}
    />
  );
}

// ── Network pill ──────────────────────────────────────────────────
function NetworkPill({ net, active, onClick }: {
  net: typeof NETWORKS[0]; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      borderRadius: 8, border: `1px solid ${active ? C.tealB : C.bd}`,
      background: active ? C.tealT : C.l2, cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.12s', fontFamily: FONT,
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = C.bdh; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.bd; }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: net.dotColor, flexShrink: 0, display: 'inline-block' }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? C.teal : C.t1 }}>{net.label}</div>
        <div style={{ fontSize: 11, color: C.t3 }}>{net.sub}</div>
      </div>
    </button>
  );
}

// ── TealBtn ───────────────────────────────────────────────────────
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
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} style={{
      background: hov ? C.l3 : 'transparent',
      color: C.t2, border: `1px solid ${C.bd}`, borderRadius: 8,
      padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

// ── Truncate wallet ───────────────────────────────────────────────
function truncWallet(w: string) {
  if (w.length <= 16) return w;
  return w.slice(0, 8) + '…' + w.slice(-6);
}

// ── InitialAvatar ─────────────────────────────────────────────────
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors = [C.teal, C.amber, C.blue, C.purple, C.red];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: colors[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: FONT,
    }}>{name.charAt(0).toUpperCase()}</div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────
export function BusinessPayments({ user, onBack }: {
  user: { email: string; name: string; id?: string } | null;
  onBack: () => void;
}) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';

  // Step state
  const [step, setStep] = useState(1);

  // Step 1 state
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [rateLocked, setRateLocked] = useState(false);
  const [rateCountdown, setRateCountdown] = useState(15 * 60);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [recurOpen, setRecurOpen] = useState(false);
  const [recurFreq, setRecurFreq] = useState('');
  const [invoiceFile, setInvoiceFile] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [benefTab, setBenefTab] = useState<'suppliers' | 'manual'>('suppliers');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualWallet, setManualWallet] = useState('');
  const [saveSupplier, setSaveSupplier] = useState(false);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; amount: string; supplierName: string; network: string; wallet: string }>>([]);

  // Step 3 state
  const [templateName, setTemplateName] = useState('');
  const [templatesSaved, setTemplatesSaved] = useState(false);

  // Step 4 state
  const [paymentRef] = useState(generateRef());

  // Load suppliers & templates from localStorage
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string; country: string; network: string; wallet: string }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`terex_b2b_${userId}_suppliers`);
      if (raw) setSuppliers(JSON.parse(raw));
      else setSuppliers([
        { id: 's1', name: 'Shenzhen Electronics', country: 'CN', network: 'TRC20', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7' },
        { id: 's2', name: 'Lagos Imports Ltd', country: 'NG', network: 'BEP20', wallet: '0xd3e8b4f6c2a1f9e5c7b0a3d2e1f8c4b6a5d9e2f7' },
        { id: 's3', name: 'Dubai Trade Co.', country: 'AE', network: 'ERC20', wallet: '0x9a4f2c3b1e6d7a8f5c2b4e1d9f3a6c7b2e8d5f1' },
      ]);
      const rawT = localStorage.getItem(`terex_b2b_${userId}_payment_templates`);
      if (rawT) setTemplates(JSON.parse(rawT));
    } catch { /* ignore */ }
  }, [userId]);

  // Rate lock countdown
  useEffect(() => {
    if (rateLocked) {
      countdownRef.current = setInterval(() => {
        setRateCountdown(s => {
          if (s <= 1) { clearInterval(countdownRef.current!); setRateLocked(false); return 15 * 60; }
          return s - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setRateCountdown(15 * 60);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [rateLocked]);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum * 0.025;
  const total = amountNum + fee;

  // Compute net for step 3
  const net = NETWORKS.find(n => n.id === network);

  const getSelectedSupplierObj = () => suppliers.find(s => s.id === selectedSupplier);
  const getBenefName = () => {
    if (benefTab === 'suppliers') return getSelectedSupplierObj()?.name || '';
    return manualName;
  };
  const getBenefWallet = () => {
    if (benefTab === 'suppliers') return getSelectedSupplierObj()?.wallet || '';
    return manualWallet;
  };

  const handleLockRate = () => {
    setRateLocked(true);
    setRateCountdown(15 * 60);
  };

  const handleUseTemplate = (t: typeof templates[0]) => {
    setAmount(t.amount);
    setNetwork(t.network);
    if (t.wallet) {
      setBenefTab('manual');
      setManualName(t.supplierName);
      setManualWallet(t.wallet);
    }
    setStep(1);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    const newT = {
      id: Date.now().toString(),
      name: templateName.trim(),
      amount,
      supplierName: getBenefName(),
      network,
      wallet: getBenefWallet(),
    };
    const newTemplates = [...templates, newT];
    setTemplates(newTemplates);
    try { localStorage.setItem(`terex_b2b_${userId}_payment_templates`, JSON.stringify(newTemplates)); } catch { /* ignore */ }
    setTemplatesSaved(true);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const canGoNext1 = amountNum >= 100 && network;
  const canGoNext2 = benefTab === 'suppliers' ? !!selectedSupplier : (manualName.trim() && manualWallet.trim());

  const handleNext = () => {
    if (step === 2 && benefTab === 'manual' && saveSupplier && manualName && manualWallet) {
      const newS = { id: Date.now().toString(), name: manualName, country: '—', network, wallet: manualWallet };
      const updated = [...suppliers, newS];
      setSuppliers(updated);
      try { localStorage.setItem(`terex_b2b_${userId}_suppliers`, JSON.stringify(updated)); } catch { /* ignore */ }
    }
    setStep(s => s + 1);
  };

  // Step 3 recap rows
  const step3Rows = [
    { label: 'Montant', value: `${amountNum.toFixed(2)} USDT` },
    { label: 'Réseau', value: `${net?.label} · ${net?.sub}` },
    { label: 'Fournisseur', value: getBenefName() || '—' },
    { label: 'Wallet destinataire', value: getBenefWallet() || '—', mono: true },
    { label: 'Frais (2.5%)', value: `${fee.toFixed(2)} USDT` },
    { label: 'Total', value: `${total.toFixed(2)} USDT`, bold: true },
    { label: 'Note interne', value: note || '—' },
    { label: 'Facture jointe', value: invoiceFile || 'Aucune' },
    ...(schedDate ? [{ label: 'Planifié le', value: `${schedDate} ${schedTime}` }] : []),
    ...(recurFreq ? [{ label: 'Récurrence', value: recurFreq }] : []),
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 900, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: C.t3,
          display: 'flex', alignItems: 'center', padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>Nouveau paiement</div>
          <div style={{ fontSize: 13, color: C.t3 }}>Envoi USDT vers un fournisseur</div>
        </div>
      </div>

      <StepBar step={step} />

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Left column */}
          <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <SectionTitle>Montant à envoyer</SectionTitle>
              {/* Large amount input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%', height: 64, background: C.l2,
                    border: `1px solid ${C.bd}`, borderRadius: 8,
                    padding: '0 80px 0 16px', color: C.t1,
                    fontSize: 32, fontWeight: 700, outline: 'none',
                    fontFamily: MONO, textAlign: 'right',
                    boxSizing: 'border-box', transition: 'border-color 0.12s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,150,143,0.35)'}
                  onBlur={e => e.currentTarget.style.borderColor = C.bd}
                />
                <div style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 6,
                  padding: '4px 8px', fontSize: 13, fontWeight: 600, color: C.teal,
                }}>USDT</div>
              </div>

              {amountNum > 0 && amountNum < 100 && (
                <div style={{
                  marginTop: 8, padding: '8px 12px', background: C.redT,
                  border: `1px solid ${C.redB}`, borderRadius: 6, fontSize: 12, color: C.red,
                }}>Minimum 100 USDT requis</div>
              )}

              {amountNum >= 100 && (
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>
                    Frais 2.5% = <span style={{ color: C.t2 }}>{fee.toFixed(2)} USDT</span>
                  </span>
                  <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>
                    Total = <span style={{ color: C.teal, fontWeight: 600 }}>{total.toFixed(2)} USDT</span>
                  </span>
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <SectionTitle>Note interne (optionnel)</SectionTitle>
                <Input value={note} onChange={setNote} placeholder="Ex: Facture #2024-089" />
              </div>
            </Card>

            {/* Schedule section */}
            <Card>
              <button onClick={() => setScheduleOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                cursor: 'pointer', color: C.t2, fontSize: 13, fontFamily: FONT, padding: 0,
              }}>
                <Clock size={15} color={C.teal} />
                <span style={{ fontWeight: 500, color: C.teal }}>Planifier ce paiement</span>
                {scheduleOpen ? <ChevronUp size={14} color={C.t3} /> : <ChevronDown size={14} color={C.t3} />}
              </button>

              {scheduleOpen && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <SectionTitle>Date</SectionTitle>
                      <input
                        type="date"
                        value={schedDate}
                        onChange={e => setSchedDate(e.target.value)}
                        style={{
                          width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
                          borderRadius: 8, padding: '10px 14px', color: C.t1, fontSize: 14,
                          outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <SectionTitle>Heure</SectionTitle>
                      <input
                        type="time"
                        value={schedTime}
                        onChange={e => setSchedTime(e.target.value)}
                        style={{
                          width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
                          borderRadius: 8, padding: '10px 14px', color: C.t1, fontSize: 14,
                          outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <button onClick={() => setRecurOpen(o => !o)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                    cursor: 'pointer', color: C.t3, fontSize: 12, fontFamily: FONT, padding: 0,
                  }}>
                    <span style={{ fontSize: 14 }}>↺</span>
                    <span>Récurrence</span>
                    {recurOpen ? <ChevronUp size={12} color={C.t3} /> : <ChevronDown size={12} color={C.t3} />}
                  </button>

                  {recurOpen && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Hebdomadaire', 'Mensuel', 'Trimestriel'].map(f => (
                        <button key={f} onClick={() => setRecurFreq(f)} style={{
                          padding: '6px 14px', borderRadius: 6, fontSize: 12, fontFamily: FONT,
                          border: `1px solid ${recurFreq === f ? C.tealB : C.bd}`,
                          background: recurFreq === f ? C.tealT : C.l2,
                          color: recurFreq === f ? C.teal : C.t2, cursor: 'pointer',
                          transition: 'all 0.12s',
                        }}>{f}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <SectionTitle>Réseau blockchain</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {NETWORKS.map(n => (
                  <NetworkPill key={n.id} net={n} active={network === n.id} onClick={() => setNetwork(n.id)} />
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle>Lock de taux</SectionTitle>
              <div style={{
                padding: '10px 12px', background: C.blueT, border: `1px solid ${C.blueB}`,
                borderRadius: 8, marginBottom: 12,
              }}>
                <div style={{ fontSize: 11, color: C.t3, fontFamily: FONT }}>Taux actuel</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                  1 USDT = 0.9452 EUR
                </div>
              </div>
              {!rateLocked ? (
                <TealBtn onClick={handleLockRate} style={{ width: '100%' }}>
                  Figer le taux 15 min
                </TealBtn>
              ) : (
                <div style={{
                  padding: '10px 14px', background: C.emT, border: `1px solid ${C.emB}`,
                  borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Check size={14} color={C.em} />
                  <span style={{ fontSize: 13, color: C.em, fontFamily: MONO }}>
                    Taux figé — {formatCountdown(rateCountdown)} restantes
                  </span>
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle>Joindre une facture (optionnel)</SectionTitle>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) setInvoiceFile(f.name);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  height: 80, border: `1px dashed ${dragOver ? C.teal : C.bds}`,
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: dragOver ? C.tealT : 'transparent',
                  transition: 'all 0.12s', flexDirection: 'column', gap: 6,
                }}
              >
                {invoiceFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: C.teal }}>{invoiceFile}</span>
                    <button onClick={e => { e.stopPropagation(); setInvoiceFile(''); }} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 0,
                    }}><X size={14} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <Upload size={18} color={C.t3} />
                    <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT, textAlign: 'center', padding: '0 12px' }}>
                      Déposer ou cliquer pour joindre une facture PDF
                    </span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) setInvoiceFile(f.name); }} />
            </Card>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.bds}` }}>
              {(['suppliers', 'manual'] as const).map(tab => {
                const lbl = tab === 'suppliers' ? `Mes fournisseurs (${suppliers.length})` : 'Adresse manuelle';
                const active = benefTab === tab;
                return (
                  <button key={tab} onClick={() => setBenefTab(tab)} style={{
                    padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: FONT,
                    color: active ? C.teal : C.t3,
                    borderBottom: `2px solid ${active ? C.teal : 'transparent'}`,
                    marginBottom: -1, transition: 'all 0.12s',
                  }}>{lbl}</button>
                );
              })}
            </div>

            {benefTab === 'suppliers' && (
              <div>
                <Input
                  value={supplierSearch} onChange={setSupplierSearch}
                  placeholder="Rechercher un fournisseur..."
                  style={{ marginBottom: 12 }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                  {filteredSuppliers.map(s => (
                    <div key={s.id} onClick={() => setSelectedSupplier(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      borderRadius: 8, border: `1px solid ${selectedSupplier === s.id ? C.tealB : C.bds}`,
                      background: selectedSupplier === s.id ? C.tealT : C.l2,
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}>
                      <Avatar name={s.name} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: C.t3 }}>{s.country} · {s.network}</div>
                      </div>
                      <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{truncWallet(s.wallet)}</div>
                      {selectedSupplier === s.id && <Check size={14} color={C.teal} />}
                    </div>
                  ))}
                  {filteredSuppliers.length === 0 && (
                    <div style={{ fontSize: 13, color: C.t3, padding: '16px 0', textAlign: 'center' }}>
                      Aucun fournisseur trouvé
                    </div>
                  )}
                </div>
              </div>
            )}

            {benefTab === 'manual' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <SectionTitle>Nom du fournisseur</SectionTitle>
                  <Input value={manualName} onChange={setManualName} placeholder="Ex: Acme Supplies Inc." />
                </div>
                <div>
                  <SectionTitle>Adresse wallet</SectionTitle>
                  <Input value={manualWallet} onChange={setManualWallet} placeholder="0x... ou T..." mono />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox" checked={saveSupplier} onChange={e => setSaveSupplier(e.target.checked)}
                    style={{ accentColor: C.teal }}
                  />
                  <span style={{ fontSize: 13, color: C.t2, fontFamily: FONT }}>Sauvegarder comme fournisseur</span>
                </label>
              </div>
            )}
          </Card>

          {/* Payment templates */}
          {templates.length > 0 && (
            <Card>
              <SectionTitle>Templates de paiement</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {templates.map(t => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderRadius: 8, border: `1px solid ${C.bds}`, background: C.l2,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: C.t3 }}>{t.supplierName} · {t.amount} USDT · {t.network}</div>
                    </div>
                    <TealBtn onClick={() => handleUseTemplate(t)} style={{ padding: '6px 14px', fontSize: 12 }}>
                      Utiliser
                    </TealBtn>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <SectionTitle>Récapitulatif du paiement</SectionTitle>
            <div style={{ border: `1px solid ${C.bds}`, borderRadius: 8, overflow: 'hidden' }}>
              {step3Rows.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', padding: '11px 16px',
                  borderBottom: i < step3Rows.length - 1 ? `1px solid ${C.bds}` : 'none',
                  background: i % 2 === 0 ? 'transparent' : C.l2,
                }}>
                  <div style={{ width: 200, fontSize: 13, color: C.t3, fontFamily: FONT }}>{r.label}</div>
                  <div style={{
                    flex: 1, fontSize: 13, fontFamily: (r as any).mono ? MONO : FONT,
                    color: (r as any).bold ? C.teal : C.t1, fontWeight: (r as any).bold ? 700 : 400,
                  }}>{(r as any).mono ? truncWallet(r.value) : r.value}</div>
                </div>
              ))}
            </div>

            {amountNum >= 5000 && (
              <div style={{
                marginTop: 16, padding: '12px 16px', background: C.amberT,
                border: `1px solid ${C.amberB}`, borderRadius: 8, fontSize: 13, color: C.amber,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ Ce paiement requiert l'approbation d'un administrateur
              </div>
            )}
          </Card>

          {/* Save as template */}
          <Card>
            <SectionTitle>Sauvegarder comme template</SectionTitle>
            {templatesSaved ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={14} color={C.em} />
                <span style={{ fontSize: 13, color: C.em }}>Template sauvegardé !</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  value={templateName} onChange={setTemplateName}
                  placeholder="Nom du template (ex: Paiement Shenzhen mensuel)"
                  style={{ flex: 1 }}
                />
                <TealBtn onClick={handleSaveTemplate} disabled={!templateName.trim()} style={{ flexShrink: 0 }}>
                  Sauvegarder
                </TealBtn>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: C.emT,
            border: `2px solid ${C.emB}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <Check size={28} color={C.em} strokeWidth={3} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.t1, fontFamily: FONT, marginBottom: 8 }}>
            Paiement soumis
          </div>
          <div style={{ fontSize: 14, color: C.t2, fontFamily: FONT, marginBottom: 24 }}>
            {amountNum >= 5000
              ? "En attente d'approbation administrateur"
              : "Traitement sous 2–24h ouvrées"}
          </div>
          <div style={{
            display: 'inline-block', padding: '8px 16px', background: C.l2,
            border: `1px solid ${C.bds}`, borderRadius: 8, fontFamily: MONO,
            fontSize: 14, color: C.teal, marginBottom: 32,
          }}>{paymentRef}</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <GhostBtn onClick={onBack}>Voir l'historique</GhostBtn>
            <TealBtn onClick={() => {
              setStep(1); setAmount(''); setNote(''); setNetwork('TRC20');
              setSelectedSupplier(null); setManualName(''); setManualWallet('');
              setInvoiceFile(''); setTemplateName(''); setTemplatesSaved(false);
            }}>Nouveau paiement</TealBtn>
          </div>
        </Card>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <GhostBtn onClick={() => { if (step === 1) onBack(); else setStep(s => s - 1); }}>
            {step === 1 ? 'Annuler' : 'Retour'}
          </GhostBtn>
          <TealBtn
            onClick={handleNext}
            disabled={step === 1 ? !canGoNext1 : step === 2 ? !canGoNext2 : false}
          >
            {step === 3 ? 'Confirmer le paiement' : 'Continuer →'}
          </TealBtn>
        </div>
      )}
    </div>
  );
}
