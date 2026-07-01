import { useState, useEffect, useRef } from 'react';
import { ArrowDownToLine, ArrowRight, Check, Copy, RefreshCw, Smartphone, Building2, Info, X } from 'lucide-react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useAuth } from '@/contexts/AuthContext';
import { WaveLogo, OrangeMoneyLogo, FreeMoneyLogo, BankLogo, UsdtLogo } from './shared/BrandLogos';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#ffffff', tealH: '#2d7870', tealT: 'rgba(255, 255, 255,0.08)', tealB: 'rgba(255, 255, 255,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const STEPS = ['Montant', 'Paiement', 'Confirmation'];

const PAYMENT_METHODS = [
  { id: 'wave',   label: 'Wave',          sub: 'Sénégal · Instant',   number: '+221 77 000 00 00', color: '#1e90d8', emoji: '🌊' },
  { id: 'om',     label: 'Orange Money',  sub: 'Sénégal · 5–30 min',  number: '+221 77 111 11 11', color: '#f68b1e', emoji: '🔶' },
  { id: 'free',   label: 'Free Money',    sub: 'Sénégal · 5–30 min',  number: '+221 77 222 22 22', color: '#7c3aed', emoji: '🟣' },
  { id: 'bank',   label: 'Virement bancaire', sub: 'BNP Paribas · 24–48h', number: 'SN99 9999 9999 9999 9999 99', color: '#3b82f6', emoji: '🏦' },
];

const NETWORKS = [
  { id: 'TRC20',   label: 'TRC20',   sub: 'TRON',     fee: 1   },
  { id: 'BEP20',   label: 'BEP20',   sub: 'BNB Chain',fee: 0.5 },
  { id: 'ERC20',   label: 'ERC20',   sub: 'Ethereum', fee: 5   },
  { id: 'Polygon', label: 'Polygon', sub: 'MATIC',    fee: 0.1 },
];

function generateDepositRef(): string {
  return 'DEP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

function StepBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 28, fontFamily: FONT }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: isDone ? C.teal : isActive ? C.teal : C.l3,
                color: isDone || isActive ? '#fff' : C.t3,
                boxShadow: isActive ? `0 0 0 4px ${C.tealT}` : 'none',
                border: `2px solid ${isDone || isActive ? C.teal : C.bd}`,
                transition: 'all 0.15s',
              }}>
                {isDone ? <Check style={{ width: 11, height: 11, strokeWidth: 3 }} /> : n}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? C.t1 : isDone ? C.t2 : C.t3, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 56, height: 2, marginTop: 12, flexShrink: 0, background: isDone ? C.teal : C.bds, transition: 'background 0.15s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, background: copied ? C.tealT : C.l2, border: `1px solid ${copied ? C.tealB : C.bds}`, color: copied ? C.teal : C.t2, fontSize: 11, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', flexShrink: 0 }}>
      {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
      {label || (copied ? 'Copié !' : 'Copier')}
    </button>
  );
}

export function BusinessDeposit({ user, onBack }: {
  user: { email: string; name: string; id?: string } | null;
  onBack: () => void;
}) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const { usdtToCfa, loading: rateLoading } = useCryptoRates();

  const [step, setStep] = useState(1);
  const [xofAmount, setXofAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [depRef] = useState(generateDepositRef());
  const [confirmed, setConfirmed] = useState(false);

  const xofNum = parseFloat(xofAmount.replace(/\s/g, '').replace(',', '.')) || 0;
  const selectedNet = NETWORKS.find(n => n.id === network)!;
  const terexFeePercent = 0.015;
  const usdtGross = rateLoading || usdtToCfa === 0 ? 0 : xofNum / usdtToCfa;
  const terexFeeUsdt = usdtGross * terexFeePercent;
  const networkFeeUsdt = selectedNet?.fee || 1;
  const usdtNet = Math.max(0, usdtGross - terexFeeUsdt - networkFeeUsdt);
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod)!;

  const canGoNext1 = xofNum >= 50000 && !!network;
  const minXof = (50000).toLocaleString('fr-FR');

  const handleConfirm = () => {
    const record = {
      id: depRef, reference: depRef, type: 'deposit',
      xofAmount: xofNum, usdtNet, network, paymentMethod: selectedMethod.label,
      status: 'pending', createdAt: new Date().toISOString(),
    };
    try {
      const key = `terex_b2b_${userId}_deposits`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([record, ...existing]));
    } catch {}
    setStep(3);
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 860, margin: '0 auto', padding: '8px 0 48px' }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #1a1a1a 100%)',
        border: `1px solid ${C.bds}`, borderRadius: 14,
        padding: '20px 24px', marginBottom: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowDownToLine style={{ width: 20, height: 20, color: C.teal }} />
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.t1, margin: '0 0 3px', letterSpacing: '-0.02em' }}>
            Déposer des fonds
          </h1>
          <p style={{ fontSize: 11, color: C.t3, margin: 0 }}>
            Envoyez des XOF par mobile money · Recevez des USDT · Taux en temps réel
          </p>
        </div>
        {!rateLoading && usdtToCfa > 0 && (
          <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>Taux actuel</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
              {usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF/USDT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block', boxShadow: `0 0 0 3px ${C.tealT}` }} />
              <span style={{ fontSize: 9, color: C.t3 }}>Live</span>
            </div>
          </div>
        )}
      </div>

      <StepBar step={step} />

      {/* ── Step 1: Montant ───────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>

          {/* Left */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* XOF input */}
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>Montant à déposer (XOF)</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={xofAmount}
                  onChange={e => setXofAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%', height: 68, background: C.l2,
                    border: `1px solid ${C.bd}`, borderRadius: 10,
                    padding: '0 100px 0 20px', color: C.t1,
                    fontSize: 32, fontWeight: 700, outline: 'none',
                    fontFamily: MONO, boxSizing: 'border-box', transition: 'border-color 0.12s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.tealT}`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <span style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 13, fontWeight: 700, color: C.teal, fontFamily: MONO,
                  background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 7, padding: '5px 10px',
                }}>XOF</span>
              </div>

              {xofNum > 0 && xofNum < 50000 && (
                <div style={{ marginTop: 10, padding: '10px 14px', background: C.redT, border: `1px solid ${C.redB}`, borderRadius: 8, fontSize: 12, color: C.red, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Info style={{ width: 13, height: 13, flexShrink: 0 }} />
                  Minimum {minXof} XOF requis
                </div>
              )}

              {/* Quick amounts */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {[100000, 250000, 500000, 1000000].map(v => (
                  <button key={v} onClick={() => setXofAmount(String(v))} style={{
                    padding: '6px 12px', borderRadius: 7, fontSize: 12,
                    background: xofNum === v ? C.tealT : C.l2,
                    border: `1px solid ${xofNum === v ? C.tealB : C.bds}`,
                    color: xofNum === v ? C.teal : C.t2,
                    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
                  }}>
                    {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`} XOF
                  </button>
                ))}
              </div>
            </div>

            {/* Network */}
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>Réseau de réception USDT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NETWORKS.map(n => {
                  const active = network === n.id;
                  return (
                    <button key={n.id} onClick={() => setNetwork(n.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                      borderRadius: 9, border: `1px solid ${active ? C.teal : C.bds}`,
                      background: active ? C.tealT : 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                      boxShadow: active ? `0 0 0 1px ${C.teal}` : 'none', transition: 'all 0.1s',
                    }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: active ? C.teal : C.l3, border: `2px solid ${active ? C.teal : C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.teal : C.t1 }}>{n.label}</span>
                        <span style={{ fontSize: 11, color: C.t3, marginLeft: 8 }}>{n.sub}</span>
                      </div>
                      <span style={{ fontSize: 10, color: C.t3 }}>Frais réseau : {n.fee} USDT</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div style={{ width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Récapitulatif</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden' }}>
                {[
                  { label: 'Vous envoyez', value: xofNum > 0 ? `${xofNum.toLocaleString('fr-FR')} XOF` : '—' },
                  { label: 'Taux', value: rateLoading ? '…' : `${usdtToCfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF/USDT` },
                  { label: 'Avant frais', value: usdtGross > 0 ? `${usdtGross.toFixed(2)} USDT` : '—' },
                  { label: 'Frais Terex (1.5%)', value: terexFeeUsdt > 0 ? `- ${terexFeeUsdt.toFixed(2)} USDT` : '—' },
                  { label: `Frais réseau (${network})`, value: networkFeeUsdt > 0 ? `- ${networkFeeUsdt} USDT` : '—' },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: 11, color: C.t3 }}>{row.label}</span>
                    <span style={{ fontSize: 11, color: C.t1, fontFamily: MONO }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, padding: '14px 16px', background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 10 }}>
                <span style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>Vous recevez</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UsdtLogo size={20} />
                  <span style={{ fontSize: 18, fontWeight: 700, color: C.teal, fontFamily: MONO }}>
                    {usdtNet > 0 ? `${usdtNet.toFixed(2)} USDT` : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>À noter</div>
              {['Dépôt crédité en 5–60 min après confirmation', 'Taux garanti 15 min après envoi', 'USDT envoyé sur votre wallet ' + network].map((txt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                  <Check style={{ width: 12, height: 12, color: C.teal, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Paiement ───────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>

          {/* Left: payment methods */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Choisir le mode de paiement</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PAYMENT_METHODS.map(m => {
                  const active = paymentMethod === m.id;
                  const LogoMap: Record<string, JSX.Element> = {
                    wave:  <WaveLogo size={32} />,
                    om:    <OrangeMoneyLogo size={32} />,
                    free:  <FreeMoneyLogo size={32} />,
                    bank:  <BankLogo size={32} />,
                  };
                  return (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                      borderRadius: 10, border: `1px solid ${active ? C.teal + '60' : C.bds}`,
                      background: active ? C.tealT : 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: FONT, transition: 'all 0.1s',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: C.l2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${active ? C.tealT : C.bds}`, overflow: 'hidden' }}>
                        {LogoMap[m.id]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: active ? C.t1 : C.t2 }}>{m.label}</div>
                        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{m.sub}</div>
                      </div>
                      {active && <Check style={{ width: 16, height: 16, color: C.teal, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment instructions */}
            <div style={{ background: C.l1, border: `1px solid ${C.tealB}`, borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 16 }}>
                Instructions de paiement — {selectedMethod.label}
              </div>

              {/* Reference + amount to send */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 9, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Montant exact à envoyer</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                      {xofNum.toLocaleString('fr-FR')} XOF
                    </span>
                    <CopyBtn text={String(xofNum)} />
                  </div>
                </div>

                <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 9, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    {selectedMethod.id === 'bank' ? 'IBAN' : 'Numéro'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: MONO }}>{selectedMethod.number}</span>
                    <CopyBtn text={selectedMethod.number} />
                  </div>
                </div>

                <div style={{ background: C.amberT, border: `1px solid ${C.amberB}`, borderRadius: 9, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Référence obligatoire (motif)</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b', fontFamily: MONO }}>{depRef}</span>
                    <CopyBtn text={depRef} />
                  </div>
                  <p style={{ fontSize: 10, color: C.t3, margin: '6px 0 0' }}>
                    ⚠️ Indiquez cette référence dans le motif du virement, sinon votre dépôt ne sera pas traité.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: 11, color: C.t3, lineHeight: 1.6, margin: 0 }}>
                Envoyez exactement <strong style={{ color: C.t1 }}>{xofNum.toLocaleString('fr-FR')} XOF</strong> au numéro <strong style={{ color: C.t1 }}>{selectedMethod.number}</strong> en indiquant la référence <strong style={{ color: '#f59e0b' }}>{depRef}</strong> dans le motif.
              </p>
            </div>
          </div>

          {/* Right: summary compact */}
          <div style={{ width: 290, flexShrink: 0 }}>
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Résumé</div>
              {[
                { label: 'Vous envoyez', value: `${xofNum.toLocaleString('fr-FR')} XOF`, accent: false },
                { label: 'Via', value: selectedMethod.label, accent: false },
                { label: 'Réseau USDT', value: network, accent: false },
                { label: 'Vous recevez', value: `${usdtNet.toFixed(2)} USDT`, accent: true },
              ].map((r, i, arr) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                  {r.accent ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <UsdtLogo size={16} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, fontFamily: MONO }}>{r.value}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 400, color: C.t1 }}>{r.value}</span>
                  )}
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '10px 12px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: C.t3, display: 'block', marginBottom: 3 }}>Référence</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.teal, fontFamily: MONO }}>{depRef}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirmation ───────────────────────────────── */}
      {step === 3 && (
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '52px 40px', textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Check style={{ width: 32, height: 32, color: C.teal, strokeWidth: 2.5 }} />
            </div>
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, color: C.t1, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Demande enregistrée
          </div>
          <p style={{ fontSize: 13, color: C.t3, marginBottom: 28, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 28px' }}>
            Votre demande de dépôt est en attente. Une fois votre virement reçu et la référence <strong style={{ color: '#f59e0b', fontFamily: MONO }}>{depRef}</strong> confirmée, les USDT seront crédités sur votre wallet {network}.
          </p>

          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, padding: '18px 28px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, marginBottom: 32, textAlign: 'left' }}>
            {[
              { label: 'Référence', value: depRef, accent: true, usdt: false },
              { label: 'Montant envoyé', value: `${xofNum.toLocaleString('fr-FR')} XOF`, accent: false, usdt: false },
              { label: 'USDT attendus', value: `${usdtNet.toFixed(2)} USDT`, accent: true, usdt: true },
              { label: 'Via', value: selectedMethod.label, accent: false, usdt: false },
              { label: 'Réseau', value: network, accent: false, usdt: false },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, fontSize: 12 }}>
                <span style={{ color: C.t3 }}>{r.label}</span>
                {r.usdt ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <UsdtLogo size={16} />
                    <span style={{ color: C.teal, fontFamily: MONO, fontWeight: 700 }}>{r.value}</span>
                  </div>
                ) : (
                  <span style={{ color: r.accent ? C.teal : C.t1, fontFamily: r.accent ? MONO : FONT, fontWeight: r.accent ? 700 : 400 }}>{r.value}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={onBack} style={{ height: 40, padding: '0 20px', background: 'transparent', border: `1px solid ${C.bds}`, borderRadius: 8, color: C.t2, fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
              Vue d'ensemble
            </button>
            <button onClick={() => { setStep(1); setXofAmount(''); }} style={{ height: 40, padding: '0 20px', background: C.teal, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
              + Nouveau dépôt
            </button>
          </div>
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────── */}
      {step < 3 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
          <button onClick={() => { if (step === 1) onBack(); else setStep(s => s - 1); }} style={{ height: 40, padding: '0 20px', background: 'transparent', border: `1px solid ${C.bds}`, borderRadius: 8, color: C.t2, fontSize: 13, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.borderColor = C.bds; }}>
            {step === 1 ? 'Annuler' : '← Retour'}
          </button>
          <button
            onClick={() => step === 2 ? handleConfirm() : setStep(s => s + 1)}
            disabled={step === 1 ? !canGoNext1 : false}
            style={{ height: 40, padding: '0 24px', background: (step === 1 && !canGoNext1) ? C.l3 : C.teal, border: 'none', borderRadius: 8, color: (step === 1 && !canGoNext1) ? C.t3 : '#fff', fontSize: 13, fontWeight: 600, cursor: (step === 1 && !canGoNext1) ? 'not-allowed' : 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}
            onMouseEnter={e => { if (!(step === 1 && !canGoNext1)) e.currentTarget.style.background = C.tealH; }}
            onMouseLeave={e => { if (!(step === 1 && !canGoNext1)) e.currentTarget.style.background = C.teal; }}>
            {step === 2 ? 'Confirmer le dépôt' : 'Continuer'}
            {step < 2 && <ArrowRight style={{ width: 14, height: 14 }} />}
          </button>
        </div>
      )}
    </div>
  );
}
