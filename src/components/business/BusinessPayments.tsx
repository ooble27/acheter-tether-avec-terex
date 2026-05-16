import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onBack: () => void;
}

const NETWORKS = ['TRC20 (TRON)', 'BEP20 (BSC)', 'ERC20 (Ethereum)', 'Polygon (MATIC)'];
const STEPS = ['Montant & réseau', 'Fournisseur', 'Confirmation'];

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868', t4: '#383838',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── StepBar ───────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, fontFamily: FONT }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const isDone = step > n;

        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              borderRadius: 8,
              background: isActive ? C.tealT : 'transparent',
              border: isActive ? `1px solid ${C.tealB}` : '1px solid transparent',
              transition: 'all 0.15s',
            }}>
              {/* Step circle */}
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: (isDone || isActive) ? C.teal : C.l3,
                color: (isDone || isActive) ? '#fff' : C.t3,
                border: (isDone || isActive) ? 'none' : `1px solid ${C.bd}`,
                transition: 'all 0.15s',
              }}>
                {isDone ? <Check style={{ width: 10, height: 10 }} /> : n}
              </div>
              {/* Label */}
              <span style={{
                fontSize: 12,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? C.t1 : isDone ? C.t3 : C.t3,
              }}>
                {label}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                width: 16, height: 1, margin: '0 2px',
                background: isDone ? C.tealB : C.bds,
                transition: 'background 0.15s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Input style helper ────────────────────────────────────────────
const inputStyle = (focused?: boolean): React.CSSProperties => ({
  width: '100%', background: C.l2, border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
  borderRadius: 8, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
  color: C.t1, fontSize: 14, outline: 'none', fontFamily: FONT,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

// ── Label style ───────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600, color: C.t3,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
  fontFamily: FONT,
};

// ── Pill button ───────────────────────────────────────────────────
function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 8, border: `1px solid ${active ? C.tealB : C.bd}`,
        background: active ? C.tealT : C.l2, color: active ? C.teal : C.t3,
        fontSize: 12, fontWeight: active ? 500 : 400, cursor: 'pointer',
        fontFamily: FONT, transition: 'all 0.1s', textAlign: 'left',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget.style.borderColor = C.bdh); }}
      onMouseLeave={e => { if (!active) (e.currentTarget.style.borderColor = C.bd); }}
    >
      {label}
    </button>
  );
}

// ── Btn primary ───────────────────────────────────────────────────
function BtnPrimary({ onClick, disabled, children, fullWidth }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 44, paddingLeft: 20, paddingRight: 20,
        background: disabled ? 'rgba(59,150,143,0.3)' : C.teal,
        border: 'none', borderRadius: 8,
        color: '#fff', fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: FONT, width: fullWidth ? '100%' : undefined,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget.style.background = C.tealH); }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget.style.background = C.teal); }}
    >
      {children}
    </button>
  );
}

function BtnOutline({ onClick, children, fullWidth }: { onClick: () => void; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 44, paddingLeft: 20, paddingRight: 20,
        background: 'transparent', border: `1px solid ${C.bd}`,
        borderRadius: 8, color: C.t3, fontSize: 13, fontWeight: 400,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: FONT, width: fullWidth ? '100%' : undefined,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
      onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bd; }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────
export function BusinessPayments({ user, onBack }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20 (TRON)');
  const [note, setNote] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [useManual, setUseManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualWallet, setManualWallet] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [walletFocused, setWalletFocused] = useState(false);

  useEffect(() => {
    try {
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
    } catch {}
  }, [userId]);

  const supplierName = useManual ? manualName : (selected?.name || '');
  const walletAddress = useManual ? manualWallet : (selected?.walletAddress || '');
  const reference = `TRX-${Date.now().toString(36).toUpperCase()}`;

  const step1Valid = amount && parseFloat(amount) >= 100;
  const step2Valid = selected || (manualName && manualWallet);

  const fee = parseFloat(amount || '0') * 0.025;
  const total = parseFloat(amount || '0') + fee;

  const handleSubmit = () => {
    const payment = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency: 'USDT',
      walletAddress,
      network,
      reference,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
      supplierName,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(key('payments')) || '[]');
      localStorage.setItem(key('payments'), JSON.stringify([payment, ...existing]));
    } catch {}
    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────
  if (submitted) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      maxWidth: 440, margin: '0 auto',
      padding: '64px 48px',
      fontFamily: FONT,
    }}>
      {/* Green check circle */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: C.emT, border: `1px solid ${C.emB}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <CheckCircle2 style={{ width: 28, height: 28, color: C.em }} />
      </div>

      <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.015em' }}>
        Paiement soumis
      </h2>
      <p style={{ color: C.t3, fontSize: 13, marginBottom: 6 }}>
        Notre équipe va traiter votre demande sous 2–24h.
      </p>

      {/* Reference chip */}
      <div style={{
        background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 8,
        padding: '6px 14px', marginBottom: 28, marginTop: 8,
      }}>
        <span style={{ color: C.t3, fontSize: 11 }}>Référence : </span>
        <span style={{ color: C.t1, fontSize: 11, fontFamily: MONO }}>{reference}</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <BtnOutline onClick={onBack}>Dashboard</BtnOutline>
        <BtnPrimary onClick={() => {
          setStep(1); setSubmitted(false);
          setAmount(''); setNote(''); setSelected(null);
          setManualName(''); setManualWallet(''); setUseManual(false);
        }}>
          Nouveau paiement
        </BtnPrimary>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: FONT }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: C.t3, background: 'none', border: 'none',
          cursor: 'pointer', fontSize: 13, marginBottom: 24, padding: 0,
          fontFamily: FONT,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
        onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
      >
        <ArrowLeft style={{ width: 15, height: 15 }} /> Retour
      </button>

      <div style={{ marginBottom: 6 }}>
        <h2 style={{ color: C.t1, fontSize: 18, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.015em' }}>
          Nouveau paiement
        </h2>
        <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Transfert USDT vers un fournisseur</p>
      </div>

      <div style={{ height: 1, background: C.bds, margin: '20px 0' }} />

      <StepBar step={step} />

      {/* ── Step 1: Amount & Network ────────────────────────────── */}
      {step === 1 && (
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {/* Amount input */}
          <div>
            <label style={labelStyle}>Montant en USDT</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                placeholder="0.00"
                min="100"
                style={{
                  ...inputStyle(amountFocused),
                  height: 56, fontSize: 28, fontWeight: 700,
                  paddingRight: 64,
                  border: `1px solid ${amountFocused ? 'rgba(59,150,143,0.35)' : C.bd}`,
                }}
              />
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                color: C.teal, fontSize: 13, fontWeight: 600, fontFamily: FONT,
              }}>
                USDT
              </span>
            </div>
            {amount && parseFloat(amount) > 0 && parseFloat(amount) < 100 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <AlertCircle style={{ width: 13, height: 13, color: C.amber }} />
                <p style={{ color: C.amber, fontSize: 12, margin: 0 }}>Montant minimum : 100 USDT</p>
              </div>
            )}
            {/* Fee summary */}
            {amount && parseFloat(amount) >= 100 && (
              <div style={{
                marginTop: 12, padding: 12, borderRadius: 8,
                background: C.l2, border: `1px solid ${C.bds}`,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>Montant</span>
                  <span style={{ fontSize: 12, color: C.t2 }}>{parseFloat(amount).toLocaleString()} USDT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>Frais plateforme (2.5%)</span>
                  <span style={{ fontSize: 12, color: C.t2 }}>{fee.toFixed(2)} USDT</span>
                </div>
                <div style={{ height: 1, background: C.bd }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Total à envoyer</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>{total.toFixed(2)} USDT</span>
                </div>
              </div>
            )}
          </div>

          {/* Network pills 2x2 */}
          <div>
            <label style={labelStyle}>Réseau blockchain</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {NETWORKS.map(net => (
                <PillBtn key={net} label={net} active={network === net} onClick={() => setNetwork(net)} />
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={labelStyle}>
              Note interne{' '}
              <span style={{ color: C.t3, textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(optionnel)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              placeholder="Ex : Commande #4521 – Textile Guangzhou"
              style={inputStyle(noteFocused)}
            />
          </div>

          <BtnPrimary onClick={() => setStep(2)} disabled={!step1Valid} fullWidth>
            Continuer <ArrowRight style={{ width: 15, height: 15 }} />
          </BtnPrimary>
        </div>
      )}

      {/* ── Step 2: Supplier ───────────────────────────────────── */}
      {step === 2 && (
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {/* Toggle pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setUseManual(false); setManualName(''); setManualWallet(''); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: `1px solid ${!useManual ? C.tealB : C.bd}`,
                background: !useManual ? C.tealT : C.l2,
                color: !useManual ? C.teal : C.t3,
                cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
              }}
            >
              Mes fournisseurs ({suppliers.length})
            </button>
            <button
              onClick={() => { setUseManual(true); setSelected(null); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: `1px solid ${useManual ? C.tealB : C.bd}`,
                background: useManual ? C.tealT : C.l2,
                color: useManual ? C.teal : C.t3,
                cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
              }}
            >
              Adresse manuelle
            </button>
          </div>

          {/* Supplier list */}
          {!useManual && (
            suppliers.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <p style={{ color: C.t3, fontSize: 13, margin: '0 0 8px' }}>Aucun fournisseur enregistré</p>
                <button
                  onClick={() => setUseManual(true)}
                  style={{ color: C.teal, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}
                >
                  Entrer les coordonnées manuellement →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                {suppliers.map(s => {
                  const isSelected = selected?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: 14, borderRadius: 8, textAlign: 'left',
                        border: `1px solid ${isSelected ? C.tealB : C.bds}`,
                        background: isSelected ? C.tealT : C.l2,
                        cursor: 'pointer', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget.style.borderColor = C.bd); }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget.style.borderColor = C.bds); }}
                    >
                      <div>
                        <p style={{ color: C.t1, fontSize: 13, fontWeight: 500, margin: 0 }}>{s.name}</p>
                        <p style={{ color: C.t2, fontSize: 11, marginTop: 2, margin: '2px 0 0' }}>
                          {s.country} · {s.network}
                        </p>
                        <p style={{ color: C.t3, fontSize: 10, marginTop: 2, fontFamily: MONO, margin: '2px 0 0' }}>
                          {s.walletAddress.slice(0, 14)}...{s.walletAddress.slice(-8)}
                        </p>
                      </div>
                      {isSelected && (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginLeft: 12,
                        }}>
                          <Check style={{ width: 11, height: 11, color: '#fff' }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* Manual inputs */}
          {useManual && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nom du fournisseur</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder="Ex : Shenzhen Trading Co."
                  style={inputStyle(nameFocused)}
                />
              </div>
              <div>
                <label style={labelStyle}>Adresse wallet USDT</label>
                <input
                  type="text"
                  value={manualWallet}
                  onChange={e => setManualWallet(e.target.value)}
                  onFocus={() => setWalletFocused(true)}
                  onBlur={() => setWalletFocused(false)}
                  placeholder={`Adresse ${network.split(' ')[0]}`}
                  style={{ ...inputStyle(walletFocused), fontFamily: MONO }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <BtnOutline onClick={() => setStep(1)} fullWidth>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Retour
            </BtnOutline>
            <BtnPrimary onClick={() => setStep(3)} disabled={!step2Valid} fullWidth>
              Continuer <ArrowRight style={{ width: 14, height: 14 }} />
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirmation ───────────────────────────────── */}
      {step === 3 && (
        <div style={{
          background: C.l1, border: `1px solid ${C.bds}`,
          borderRadius: 12, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div>
            <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Récapitulatif</h3>
            <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Vérifiez avant de confirmer</p>
          </div>

          {/* Recap table */}
          <div style={{
            background: C.l2, border: `1px solid ${C.bds}`,
            borderRadius: 8, overflow: 'hidden',
          }}>
            {([
              { label: 'Fournisseur', value: supplierName, type: 'standard' },
              { label: 'Réseau', value: network, type: 'standard' },
              { label: 'Wallet destinataire', value: `${walletAddress.slice(0, 16)}...${walletAddress.slice(-8)}`, type: 'mono' },
              { label: 'Montant', value: `${parseFloat(amount).toLocaleString()} USDT`, type: 'accent' },
              { label: 'Frais (2.5%)', value: `${fee.toFixed(2)} USDT`, type: 'standard' },
              { label: 'Total à envoyer', value: `${total.toFixed(2)} USDT`, type: 'bold' },
              { label: 'Référence', value: reference, type: 'mono' },
              ...(note ? [{ label: 'Note', value: note, type: 'standard' }] : []),
            ] as Array<{ label: string; value: string; type: string }>).map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingLeft: 20, paddingRight: 20, paddingTop: 11, paddingBottom: 11,
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none',
                }}
              >
                <span style={{ color: C.t3, fontSize: 12, fontFamily: FONT }}>{row.label}</span>
                <span style={{
                  fontSize: 12,
                  color: row.type === 'bold' ? C.t1 : row.type === 'accent' ? C.teal : C.t2,
                  fontWeight: row.type === 'bold' ? 700 : row.type === 'accent' ? 600 : 400,
                  fontFamily: row.type === 'mono' ? MONO : FONT,
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Warning block */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: 14, borderRadius: 8,
            background: C.amberT, border: `1px solid ${C.amberB}`,
          }}>
            <Info style={{ width: 15, height: 15, color: C.amber, flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: C.amber, fontSize: 12, margin: 0, lineHeight: 1.5, opacity: 0.85 }}>
              Après confirmation, notre équipe traitera votre demande. Le paiement est effectif sous 2–24h ouvrées. Vous recevrez une notification par email.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <BtnOutline onClick={() => setStep(2)} fullWidth>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Retour
            </BtnOutline>
            <BtnPrimary onClick={handleSubmit} fullWidth>
              <Send style={{ width: 14, height: 14 }} /> Confirmer le paiement
            </BtnPrimary>
          </div>
        </div>
      )}
    </div>
  );
}
