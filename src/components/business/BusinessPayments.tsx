import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Clock, Upload, X, Zap, AlertTriangle, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import usdtLogo from '@/assets/usdt-logo.png';

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
  { id: 'TRC20',   label: 'TRC20',   sub: 'TRON Network',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', speed: '1–3 min',  feeLabel: 'Frais très bas', recommended: true  },
  { id: 'BEP20',   label: 'BEP20',   sub: 'BNB Smart Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', speed: '1–3 min',  feeLabel: 'Frais bas',      recommended: false },
  { id: 'ERC20',   label: 'ERC20',   sub: 'Ethereum',        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', speed: '5–15 min', feeLabel: 'Frais élevés',   recommended: false },
  { id: 'POLYGON', label: 'Polygon', sub: 'Polygon MATIC',   logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', speed: '1–5 min',  feeLabel: 'Frais très bas', recommended: false },
];

// Real flag images via flagcdn.com (works on all devices, no emoji issues)
function FlagImg({ code, size = 20 }: { code: string; size?: number }) {
  const cc = (code || '').toLowerCase().replace('—', '');
  if (!cc || cc.length !== 2) return <span style={{ fontSize: size * 0.7, color: C.t3 }}>—</span>;
  return (
    <img
      src={`https://flagcdn.com/${Math.round(size * 1.4)}x${size}.png`.replace(/\d+x\d+/, `${Math.round(size * 1.4)}x${size}`)}
      srcSet={`https://flagcdn.com/${cc}.svg`}
      alt={cc.toUpperCase()}
      style={{ width: Math.round(size * 1.4), height: size, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }}
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

function generateRef() {
  return 'TRX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function truncWallet(w: string | undefined | null) {
  if (!w) return '—';
  if (w.length <= 16) return w;
  return w.slice(0, 8) + '…' + w.slice(-6);
}

// ── StepBar ───────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, fontFamily: FONT }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: isDone ? C.teal : isActive ? C.teal : C.l3,
                color: isDone || isActive ? '#fff' : C.t3,
                boxShadow: isActive ? `0 0 0 4px ${C.tealT}` : 'none',
                border: `2px solid ${isDone || isActive ? C.teal : C.bd}`,
                transition: 'all 0.15s',
              }}>
                {isDone ? <Check style={{ width: 12, height: 12, strokeWidth: 3 }} /> : n}
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 400,
                color: isActive ? C.t1 : isDone ? C.t2 : C.t3,
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 48, height: 2, marginTop: 13, flexShrink: 0, background: isDone ? C.teal : C.bds, transition: 'background 0.15s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: FONT, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function FieldInput({ value, onChange, placeholder, style, type, mono }: {
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
        border: `1px solid ${focused ? C.teal : C.bd}`,
        borderRadius: 8, padding: '11px 14px', color: C.t1,
        fontSize: 14, outline: 'none', fontFamily: mono ? MONO : FONT,
        boxSizing: 'border-box', transition: 'border-color 0.12s',
        boxShadow: focused ? `0 0 0 3px ${C.tealT}` : 'none',
        ...style,
      }}
    />
  );
}

function NetworkCard({ net, active, onClick }: { net: typeof NETWORKS[0]; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
        borderRadius: 10, border: `1px solid ${active ? C.teal : hov ? C.bdh : C.bds}`,
        background: active ? 'rgba(59,150,143,0.06)' : hov ? C.l2 : 'transparent',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'all 0.12s', fontFamily: FONT,
        boxShadow: active ? `0 0 0 1px ${C.teal}` : 'none',
      }}
    >
      <img src={net.logo} alt={net.sub} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: active ? C.teal : C.t1 }}>{net.label}</span>
          {net.recommended && (
            <span style={{ fontSize: 9, fontWeight: 600, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 4, padding: '1px 5px', letterSpacing: '0.05em' }}>RECOMMANDÉ</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.t3 }}>{net.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <Timer style={{ width: 10, height: 10, color: C.t3 }} />
          <span style={{ fontSize: 10, color: C.t3 }}>{net.speed}</span>
          <span style={{ fontSize: 10, color: C.t3 }}>·</span>
          <span style={{ fontSize: 10, color: C.t3 }}>{net.feeLabel}</span>
        </div>
      </div>
      {active && (
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check style={{ width: 11, height: 11, color: '#fff', strokeWidth: 3 }} />
        </div>
      )}
    </button>
  );
}

function TealBtn({ children, onClick, style, disabled }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: disabled ? C.l3 : hov ? C.tealH : C.teal,
      color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 8,
      padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? C.l3 : 'transparent', color: C.t2,
      border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 8,
      padding: '11px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}>{children}</button>
  );
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(59,150,143,0.18)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0, fontFamily: FONT,
    }}>{(name || '?').charAt(0).toUpperCase()}</div>
  );
}

// ── Native date/time input styled ─────────────────────────────────
const dateInputStyle: React.CSSProperties = {
  width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
  borderRadius: 8, padding: '11px 14px', color: C.t1, fontSize: 13,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
};

// ────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────
export function BusinessPayments({ user, onBack }: {
  user: { email: string; name: string; id?: string } | null;
  onBack: () => void;
}) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';

  const [step, setStep] = useState(1);

  // Step 1
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

  // Step 2
  const [benefTab, setBenefTab] = useState<'suppliers' | 'manual'>('suppliers');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualWallet, setManualWallet] = useState('');
  const [saveSupplier, setSaveSupplier] = useState(false);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; amount: string; supplierName: string; network: string; wallet: string }>>([]);

  // Step 3
  const [templateName, setTemplateName] = useState('');
  const [templatesSaved, setTemplatesSaved] = useState(false);

  const [paymentRef] = useState(generateRef());

  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string; country: string; network: string; wallet: string }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`terex_b2b_${userId}_suppliers`);
      if (raw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = JSON.parse(raw).map((s: any) => ({ ...s, wallet: s.wallet || s.walletAddress || '' }));
        setSuppliers(parsed);
      } else {
        setSuppliers([
          { id: 's1', name: 'Shenzhen Electronics', country: 'CN', network: 'TRC20', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7' },
          { id: 's2', name: 'Lagos Imports Ltd',    country: 'NG', network: 'BEP20', wallet: '0xd3e8b4f6c2a1f9e5c7b0a3d2e1f8c4b6a5d9e2f7' },
          { id: 's3', name: 'Dubai Trade Co.',      country: 'AE', network: 'ERC20', wallet: '0x9a4f2c3b1e6d7a8f5c2b4e1d9f3a6c7b2e8d5f1' },
        ]);
      }
      const rawT = localStorage.getItem(`terex_b2b_${userId}_payment_templates`);
      if (rawT) setTemplates(JSON.parse(rawT));
    } catch { /* ignore */ }
  }, [userId]);

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

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum * 0.025;
  const total = amountNum + fee;
  const net = NETWORKS.find(n => n.id === network);

  const getSelectedSupplierObj = () => suppliers.find(s => s.id === selectedSupplier);
  const getBenefName   = () => benefTab === 'suppliers' ? getSelectedSupplierObj()?.name   || '' : manualName;
  const getBenefWallet = () => benefTab === 'suppliers' ? getSelectedSupplierObj()?.wallet || '' : manualWallet;

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    const newT = { id: Date.now().toString(), name: templateName.trim(), amount, supplierName: getBenefName(), network, wallet: getBenefWallet() };
    const newTemplates = [...templates, newT];
    setTemplates(newTemplates);
    try { localStorage.setItem(`terex_b2b_${userId}_payment_templates`, JSON.stringify(newTemplates)); } catch { /* ignore */ }
    setTemplatesSaved(true);
  };

  const handleUseTemplate = (t: typeof templates[0]) => {
    setAmount(t.amount); setNetwork(t.network);
    if (t.wallet) { setBenefTab('manual'); setManualName(t.supplierName); setManualWallet(t.wallet); }
    setStep(1);
  };

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()));
  const canGoNext1 = amountNum >= 100 && !!network;
  const canGoNext2 = benefTab === 'suppliers' ? !!selectedSupplier : (!!manualName.trim() && !!manualWallet.trim());

  const handleNext = () => {
    if (step === 2 && benefTab === 'manual' && saveSupplier && manualName && manualWallet) {
      const newS = { id: Date.now().toString(), name: manualName, country: '—', network, wallet: manualWallet };
      const updated = [...suppliers, newS];
      setSuppliers(updated);
      try { localStorage.setItem(`terex_b2b_${userId}_suppliers`, JSON.stringify(updated)); } catch { /* ignore */ }
    }
    if (step === 3) {
      const newPayment = {
        id: paymentRef, reference: paymentRef,
        amount: amountNum, fee, total, currency: 'USDT', network,
        supplierName: getBenefName(), wallet: getBenefWallet(), note,
        status: amountNum >= 5000 ? 'pending' : 'processing',
        createdAt: schedDate ? `${schedDate}T${schedTime || '00:00'}:00.000Z` : new Date().toISOString(),
        invoiceFile: invoiceFile || null, scheduled: !!schedDate, recurrence: recurFreq || null,
      };
      try {
        const raw = localStorage.getItem(`terex_b2b_${userId}_payments`);
        const existing = raw ? JSON.parse(raw) : [];
        localStorage.setItem(`terex_b2b_${userId}_payments`, JSON.stringify([newPayment, ...existing]));
      } catch { /* ignore */ }
    }
    setStep(s => s + 1);
  };

  const step3Rows = [
    { label: 'Montant',            value: `${amountNum.toFixed(2)} USDT` },
    { label: 'Réseau',             value: `${net?.label} · ${net?.sub}` },
    { label: 'Fournisseur',        value: getBenefName() || '—' },
    { label: 'Wallet destinataire',value: getBenefWallet() || '—', mono: true },
    { label: 'Frais (2.5%)',       value: `${fee.toFixed(2)} USDT` },
    { label: 'Total à débiter',    value: `${total.toFixed(2)} USDT`, bold: true },
    { label: 'Note interne',       value: note || '—' },
    { label: 'Facture jointe',     value: invoiceFile || 'Aucune' },
    ...(schedDate  ? [{ label: 'Planifié le',  value: `${schedDate} ${schedTime}` }] : []),
    ...(recurFreq  ? [{ label: 'Récurrence',   value: recurFreq }] : []),
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 920, margin: '0 auto', padding: '8px 0 48px' }}>

      {/* ── Hero header (no back button inside) ─────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
        border: `1px solid ${C.bds}`, borderRadius: 14,
        padding: '20px 24px', marginBottom: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
          <img src={usdtLogo} alt="USDT" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.t1, margin: '0 0 3px', letterSpacing: '-0.02em' }}>
              Nouveau paiement USDT
            </h1>
            <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>
              Envoi sécurisé vers un fournisseur · Blockchain · 2.5% de frais
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {NETWORKS.map((n, i) => (
            <img key={n.id} src={n.logo} alt={n.label} title={n.label}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a1a1a', marginLeft: i > 0 ? -8 : 0, zIndex: NETWORKS.length - i, position: 'relative' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          ))}
          <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>4 réseaux</span>
        </div>
        <div style={{ position: 'absolute', right: 160, top: 0, bottom: 0, opacity: 0.04, pointerEvents: 'none' }}>
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <circle cx="60" cy="40" r="35" stroke="white" strokeWidth="1"/>
            <circle cx="60" cy="40" r="20" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
            <path d="M25 40 L95 40 M60 5 L60 75" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>

      <StepBar step={step} />

      {/* ── Step 1 ──────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col lg:flex-row" style={{ gap: 18 }}>

          {/* LEFT column */}
          <div className="w-full lg:w-[58%]" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Amount */}
            <Card>
              <Label>Montant à envoyer</Label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%', height: 72, background: C.l2,
                    border: `1px solid ${C.bd}`, borderRadius: 10,
                    padding: '0 90px 0 20px', color: C.t1,
                    fontSize: 36, fontWeight: 700, outline: 'none',
                    fontFamily: MONO, textAlign: 'right', boxSizing: 'border-box',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.tealT}`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <div style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 7, padding: '5px 10px',
                }}>
                  <img src={usdtLogo} alt="USDT" style={{ width: 16, height: 16, borderRadius: '50%' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.teal, fontFamily: MONO }}>USDT</span>
                </div>
              </div>

              {amountNum > 0 && amountNum < 100 && (
                <div style={{ marginTop: 10, padding: '10px 14px', background: C.redT, border: `1px solid ${C.redB}`, borderRadius: 8, fontSize: 12, color: C.red, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle style={{ width: 13, height: 13, flexShrink: 0 }} />
                  Minimum 100 USDT requis
                </div>
              )}

              {amountNum >= 100 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                  {[
                    { label: 'Montant net', value: `${amountNum.toLocaleString('fr-FR')} USDT`, accent: false },
                    { label: 'Frais 2.5%',  value: `${fee.toFixed(2)} USDT`,                    accent: false },
                    { label: 'Total',        value: `${total.toFixed(2)} USDT`,                  accent: true  },
                  ].map(item => (
                    <div key={item.label} style={{ background: item.accent ? C.tealT : C.l2, border: `1px solid ${item.accent ? C.tealB : C.bds}`, borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, color: item.accent ? C.teal : C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: item.accent ? C.teal : C.t1, fontFamily: MONO }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 18, borderTop: `1px solid ${C.bds}`, paddingTop: 16 }}>
                <Label>Note interne (optionnel)</Label>
                <FieldInput value={note} onChange={setNote} placeholder="Ex: Facture #2024-089 · Commande matières premières" />
              </div>
            </Card>

            {/* Schedule */}
            <Card>
              <button onClick={() => setScheduleOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0, width: '100%' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: C.tealT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock style={{ width: 14, height: 14, color: C.teal }} />
                </div>
                <span style={{ fontWeight: 600, color: C.teal, fontSize: 13, flex: 1, textAlign: 'left' }}>Planifier ce paiement</span>
                {scheduleOpen ? <ChevronUp size={14} color={C.t3} /> : <ChevronDown size={14} color={C.t3} />}
              </button>

              {scheduleOpen && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="grid grid-cols-2" style={{ gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <Label>Date</Label>
                      <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={dateInputStyle} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <Label>Heure</Label>
                      <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} style={dateInputStyle} />
                    </div>
                  </div>

                  <button onClick={() => setRecurOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 12, fontFamily: FONT, padding: 0 }}>
                    <span style={{ fontSize: 15 }}>↺</span>
                    <span>Récurrence</span>
                    {recurOpen ? <ChevronUp size={12} color={C.t3} /> : <ChevronDown size={12} color={C.t3} />}
                  </button>

                  {recurOpen && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Hebdomadaire', 'Mensuel', 'Trimestriel'].map(f => (
                        <button key={f} onClick={() => setRecurFreq(f === recurFreq ? '' : f)} style={{
                          padding: '7px 16px', borderRadius: 6, fontSize: 12, fontFamily: FONT,
                          border: `1px solid ${recurFreq === f ? C.tealB : C.bd}`,
                          background: recurFreq === f ? C.tealT : 'transparent',
                          color: recurFreq === f ? C.teal : C.t2, cursor: 'pointer', transition: 'all 0.12s',
                        }}>{f}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Invoice — left column */}
            <Card>
              <Label>Joindre une facture (optionnel)</Label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setInvoiceFile(f.name); }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  minHeight: 90, border: `2px dashed ${dragOver ? C.teal : C.bds}`,
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: dragOver ? C.tealT : 'transparent',
                  transition: 'all 0.12s', flexDirection: 'column', gap: 6, padding: 20,
                }}
              >
                {invoiceFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: C.tealT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check style={{ width: 14, height: 14, color: C.teal }} />
                    </div>
                    <span style={{ fontSize: 13, color: C.teal, fontFamily: MONO }}>{invoiceFile}</span>
                    <button onClick={e => { e.stopPropagation(); setInvoiceFile(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C.l2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload style={{ width: 16, height: 16, color: C.t3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>Déposer ou cliquer pour joindre</span>
                    <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>PDF · max 10 Mo</span>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) setInvoiceFile(f.name); }} />
            </Card>
          </div>

          {/* RIGHT column — network + rate lock only */}
          <div className="w-full lg:w-[42%]" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Card>
              <Label>Réseau blockchain</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NETWORKS.map(n => (
                  <NetworkCard key={n.id} net={n} active={network === n.id} onClick={() => setNetwork(n.id)} />
                ))}
              </div>
            </Card>

            <Card>
              <Label>Taux de change</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 14 }}>
                <img src={usdtLogo} alt="USDT" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>Taux actuel</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO }}>1 USDT = 0.9245 EUR</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.em, margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 9, color: C.t3 }}>Live</div>
                </div>
              </div>
              {!rateLocked ? (
                <button onClick={() => { setRateLocked(true); setRateCountdown(15 * 60); }} style={{
                  width: '100%', background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8,
                  padding: '10px 16px', color: C.t2, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', transition: 'all 0.12s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.l3; e.currentTarget.style.color = C.t1; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.l2; e.currentTarget.style.color = C.t2; }}
                >
                  <Zap style={{ width: 14, height: 14 }} />
                  Figer le taux 15 minutes
                </button>
              ) : (
                <div style={{ padding: '10px 14px', background: C.emT, border: `1px solid ${C.emB}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check style={{ width: 14, height: 14, color: C.em }} />
                  <span style={{ fontSize: 13, color: C.em, fontFamily: MONO }}>Taux figé · {fmt(rateCountdown)} restantes</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── Step 2 : Bénéficiaire ────────────────────────────────── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.bds}` }}>
              {(['suppliers', 'manual'] as const).map(tab => {
                const lbl = tab === 'suppliers' ? `Mes fournisseurs (${suppliers.length})` : 'Adresse manuelle';
                const active = benefTab === tab;
                return (
                  <button key={tab} onClick={() => setBenefTab(tab)} style={{
                    padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
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
                <FieldInput value={supplierSearch} onChange={setSupplierSearch} placeholder="Rechercher un fournisseur…" style={{ marginBottom: 12 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
                  {filteredSuppliers.map(s => {
                    const isSelected = selectedSupplier === s.id;
                    const sNet = NETWORKS.find(n => n.id === s.network);
                    return (
                      <div key={s.id} onClick={() => setSelectedSupplier(s.id)} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                        borderRadius: 10, border: `1px solid ${isSelected ? C.teal : C.bds}`,
                        background: isSelected ? 'rgba(59,150,143,0.06)' : C.l2,
                        cursor: 'pointer', transition: 'all 0.12s',
                        boxShadow: isSelected ? `0 0 0 1px ${C.teal}` : 'none',
                      }}>
                        <Avatar name={s.name} size={42} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? C.teal : C.t1, marginBottom: 4 }}>{s.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Real flag image */}
                            <img
                              src={`https://flagcdn.com/20x15/${(s.country || '').toLowerCase()}.png`}
                              alt={s.country}
                              style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover' }}
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                            <span style={{ fontSize: 12, color: C.t3 }}>{s.country}</span>
                            {sNet && (
                              <>
                                <span style={{ color: C.t3, fontSize: 10 }}>·</span>
                                <img src={sNet.logo} alt={sNet.label} style={{ width: 16, height: 16, borderRadius: '50%' }}
                                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                <span style={{ fontSize: 12, color: C.t3 }}>{s.network}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO, marginBottom: 4 }}>{truncWallet(s.wallet)}</div>
                          {isSelected && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.teal }}>
                              <Check style={{ width: 11, height: 11 }} />
                              Sélectionné
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredSuppliers.length === 0 && (
                    <div style={{ fontSize: 13, color: C.t3, padding: '24px 0', textAlign: 'center' }}>Aucun fournisseur trouvé</div>
                  )}
                </div>
              </div>
            )}

            {benefTab === 'manual' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Label>Nom du fournisseur</Label>
                  <FieldInput value={manualName} onChange={setManualName} placeholder="Ex: Acme Supplies Inc." />
                </div>
                <div>
                  <Label>Adresse wallet ({net?.label})</Label>
                  <FieldInput value={manualWallet} onChange={setManualWallet} placeholder={network === 'TRC20' ? 'T…' : '0x…'} mono />
                  <p style={{ fontSize: 11, color: C.t3, margin: '6px 0 0' }}>
                    Vérifiez que l'adresse correspond au réseau {net?.label} ({net?.sub})
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 16px', background: C.l2, borderRadius: 8, border: `1px solid ${C.bds}` }}>
                  <input type="checkbox" checked={saveSupplier} onChange={e => setSaveSupplier(e.target.checked)} style={{ accentColor: C.teal, width: 16, height: 16, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>Sauvegarder comme fournisseur</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Retrouvez ce contact dans vos prochains paiements</div>
                  </div>
                </label>
              </div>
            )}
          </Card>

          {templates.length > 0 && (
            <Card>
              <Label>Modèles de paiement rapide</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {templates.map(t => {
                  const tNet = NETWORKS.find(n => n.id === t.network);
                  return (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, border: `1px solid ${C.bds}`, background: C.l2 }}>
                      {tNet && <img src={tNet.logo} alt={tNet.label} style={{ width: 32, height: 32, borderRadius: '50%' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: C.t3 }}>{t.supplierName} · {t.amount} USDT · {t.network}</div>
                      </div>
                      <TealBtn onClick={() => handleUseTemplate(t)} style={{ padding: '7px 14px', fontSize: 12 }}>Utiliser</TealBtn>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Step 3 : Révision ────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col lg:flex-row" style={{ gap: 18 }}>

          {/* Left: recap table */}
          <div style={{ flex: 1 }}>
            <Card>
              <Label>Récapitulatif du paiement</Label>

              {/* Network badge */}
              {net && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 16 }}>
                  <img src={net.logo} alt={net.label} style={{ width: 32, height: 32, borderRadius: '50%' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{net.label} · {net.sub}</span>
                    <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0' }}>Délai estimé : {net.speed}</p>
                  </div>
                </div>
              )}

              <div style={{ border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden' }}>
                {step3Rows.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', padding: '12px 18px',
                    borderBottom: i < step3Rows.length - 1 ? `1px solid ${C.bds}` : 'none',
                    background: (r as any).bold ? 'rgba(59,150,143,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <div style={{ width: 170, fontSize: 12, color: C.t3, flexShrink: 0 }}>{r.label}</div>
                    <div style={{ flex: 1, fontSize: 13, fontFamily: (r as any).mono ? MONO : FONT, color: (r as any).bold ? C.teal : C.t1, fontWeight: (r as any).bold ? 700 : 400 }}>
                      {(r as any).mono ? truncWallet(r.value) : r.value}
                    </div>
                  </div>
                ))}
              </div>

              {amountNum >= 5000 && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: C.amberT, border: `1px solid ${C.amberB}`, borderRadius: 8, fontSize: 13, color: C.amber, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle style={{ width: 15, height: 15, flexShrink: 0 }} />
                  Ce paiement requiert l'approbation d'un administrateur Terex
                </div>
              )}
            </Card>
          </div>

          {/* Right: save template + security note */}
          <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <Label>Sauvegarder comme modèle</Label>
              {templatesSaved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.emT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 12, height: 12, color: C.em }} />
                  </div>
                  <span style={{ fontSize: 13, color: C.em }}>Modèle sauvegardé</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FieldInput value={templateName} onChange={setTemplateName} placeholder="Ex: Paiement Shenzhen mensuel" />
                  <TealBtn onClick={handleSaveTemplate} disabled={!templateName.trim()} style={{ width: '100%' }}>
                    Sauvegarder
                  </TealBtn>
                </div>
              )}
            </Card>

            <div style={{ padding: '14px 16px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Sécurité</div>
              {[
                'Transaction chiffrée de bout en bout',
                'Adresse wallet vérifiée avant envoi',
                'Référence traçable sur la blockchain',
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 2 ? 10 : 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 9, height: 9, color: C.teal }} />
                  </div>
                  <span style={{ fontSize: 12, color: C.t3, lineHeight: 1.5 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4 : Confirmation ────────────────────────────────── */}
      {step === 4 && (
        <Card style={{ padding: '56px 40px', textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="60" cy="50" r="38" stroke="rgba(59,150,143,0.15)" strokeWidth="2"/>
              <circle cx="60" cy="50" r="38" stroke={C.teal} strokeWidth="2" strokeDasharray="60 180" strokeLinecap="round" transform="rotate(-90 60 50)"/>
              <circle cx="60" cy="50" r="26" fill="rgba(59,150,143,0.08)" stroke={C.tealB} strokeWidth="1.5"/>
              <path d="M47 50 L56 59 L74 42" stroke={C.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="20" r="7" fill="rgba(59,150,143,0.1)" stroke={C.tealB} strokeWidth="1"/>
              <circle cx="102" cy="20" r="5" fill="rgba(59,150,143,0.07)" stroke={C.tealB} strokeWidth="1"/>
              <circle cx="14" cy="72" r="4" fill="rgba(59,150,143,0.07)" stroke={C.tealB} strokeWidth="1"/>
              <circle cx="106" cy="72" r="6" fill="rgba(59,150,143,0.1)" stroke={C.tealB} strokeWidth="1"/>
              <path d="M24 25 L34 34" stroke={C.tealB} strokeWidth="1" strokeDasharray="2 2"/>
              <path d="M97 25 L86 34" stroke={C.tealB} strokeWidth="1" strokeDasharray="2 2"/>
            </svg>
          </div>

          <div style={{ fontSize: 24, fontWeight: 700, color: C.t1, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Paiement soumis avec succès
          </div>
          <div style={{ fontSize: 14, color: C.t3, marginBottom: 28, lineHeight: 1.7 }}>
            {amountNum >= 5000
              ? "Ce paiement est en attente d'approbation administrateur.\nVous serez notifié par email."
              : "Votre transaction est en cours de traitement.\nDélai estimé : 2–24h ouvrées."}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>Référence</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.teal, fontFamily: MONO }}>{paymentRef}</span>
          </div>

          {net && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
              <img src={net.logo} alt={net.label} style={{ width: 20, height: 20, borderRadius: '50%' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <span style={{ fontSize: 12, color: C.t3 }}>Via {net.label} ({net.sub}) · {net.speed}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <GhostBtn onClick={onBack}>Voir l'historique</GhostBtn>
            <TealBtn onClick={() => {
              setStep(1); setAmount(''); setNote(''); setNetwork('TRC20');
              setSelectedSupplier(null); setManualName(''); setManualWallet('');
              setInvoiceFile(''); setTemplateName(''); setTemplatesSaved(false);
              setRateLocked(false); setSchedDate(''); setSchedTime(''); setRecurFreq('');
            }}>+ Nouveau paiement</TealBtn>
          </div>
        </Card>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <GhostBtn onClick={() => { if (step === 1) onBack(); else setStep(s => s - 1); }}>
            {step === 1 ? 'Annuler' : '← Retour'}
          </GhostBtn>
          <TealBtn onClick={handleNext} disabled={step === 1 ? !canGoNext1 : step === 2 ? !canGoNext2 : false}>
            {step === 3 ? '✓ Confirmer le paiement' : 'Continuer →'}
          </TealBtn>
        </div>
      )}
    </div>
  );
}
