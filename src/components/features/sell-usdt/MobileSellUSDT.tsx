import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowLeft, HandCoins, Check, Copy } from 'lucide-react';
import { KYCPage } from '../KYCPage';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const BTN = '#2d2d2d';
const SEL_BG = 'rgba(255,255,255,0.06)';
const SEL_BORDER = 'rgba(255,255,255,0.18)';

const WALLET_ADDRESSES: Record<string, string> = {
  TRC20:    'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  BEP20:    '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  ERC20:    '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Arbitrum: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Polygon:  '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Solana:   '8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN',
  Aptos:    '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
};

const NETWORK_LOGOS: Record<string, string> = {
  TRC20:  'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:  'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20:  'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos:  'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
};

const MIN_SELL_USDT = 50;

const circleBackBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '38px', height: '38px', flexShrink: 0,
  background: 'rgba(255,255,255,0.06)', borderRadius: '50%', border: 'none', cursor: 'pointer',
  outline: 'none', WebkitTapHighlightColor: 'transparent',
};

const fullScreen: React.CSSProperties = {
  minHeight: '100vh', overflowY: 'auto',
  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
  paddingBottom: '110px',
};

function StepHeader({ onBack, title, description }: { onBack?: () => void; title: React.ReactNode; description: React.ReactNode }) {
  return (
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onBack && <button onClick={onBack} style={circleBackBtn}><ArrowLeft size={18} color="#fff" /></button>}
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>{title}</h2>
      </div>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 0' }}>{description}</p>
    </div>
  );
}

function ContinueBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 28px' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: disabled ? 'rgba(255,255,255,0.04)' : BTN,
          borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)',
          padding: '13px 22px', color: disabled ? '#6b7280' : '#fff',
          fontSize: '14px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none', WebkitTapHighlightColor: 'transparent', transition: 'background 0.15s',
        }}
      >
        {children ?? <><HandCoins size={17} strokeWidth={2} /> Continuer</>}
      </button>
    </div>
  );
}

export function MobileSellUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'binance' | 'phone' | 'confirm' | 'instructions'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [inputCurrency, setInputCurrency] = useState<'USDT' | 'XOF'>('USDT');
  const [rawAmount, setRawAmount] = useState('');
  const [currency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'wave' | 'orange'>('wave');
  const [useBinancePay, setUseBinancePay] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexBuyRateCfa } = useTerexRates(2);
  const { isAuthorized } = useTransactionAuthorization();

  const usdtAmount = inputCurrency === 'USDT'
    ? rawAmount
    : (rawAmount && terexBuyRateCfa > 0 ? (parseFloat(rawAmount) / terexBuyRateCfa).toFixed(2) : '');
  const fiatAmount = usdtAmount ? (parseFloat(usdtAmount) * terexBuyRateCfa).toFixed(2) : '0';

  const handleContinueToNetwork = () => {
    const usdt = parseFloat(usdtAmount || '0');
    if (!usdtAmount || usdt <= 0) { toast({ title: 'Erreur', description: 'Veuillez entrer un montant valide', variant: 'destructive' }); return; }
    if (usdt < MIN_SELL_USDT) { toast({ title: 'Montant trop faible', description: `Minimum ${MIN_SELL_USDT} USDT`, variant: 'destructive' }); return; }
    setStep('network');
  };

  const handleContinueToPhone = () => {
    if (useBinancePay) setStep('binance'); else setStep('phone');
  };

  const handleContinueToConfirm = () => {
    if (!phoneNumber) { toast({ title: 'Erreur', description: 'Veuillez entrer un numéro de téléphone', variant: 'destructive' }); return; }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    if (!isAuthorized) { setShowKYCPage(true); return; }
    setLoading(true);
    const result = await createOrder({
      user_id: user.id, type: 'sell' as const,
      amount: parseFloat(fiatAmount), currency,
      usdt_amount: parseFloat(usdtAmount), exchange_rate: terexBuyRateCfa,
      payment_method: 'mobile',
      network: useBinancePay ? 'Binance Pay' : network,
      wallet_address: useBinancePay ? 'Binance Pay Transfer' : WALLET_ADDRESSES[network],
      status: 'pending' as const, payment_status: 'pending',
      notes: JSON.stringify({ phoneNumber, provider, paymentMethod: 'mobile', useBinancePay }),
    });
    if (result) setStep('instructions');
    setLoading(false);
  };

  const handleBackToDashboard = () => {
    setStep('amount');
    setRawAmount('');
    setPhoneNumber('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié !', description: `${label} copié dans le presse-papiers` });
  };

  if (showKYCPage) return <KYCPage onBack={() => setShowKYCPage(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* ── Step 1: Amount ─────────────────────────────────────────── */}
        {step === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '80px 20px 100px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.4px' }}>Vendre USDT</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Entrez le montant que vous souhaitez vendre</p>
            </div>

            {/* Input card */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Montant</span>
                <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                  {(['USDT', 'XOF'] as const).map(c => (
                    <button key={c} onClick={() => { setInputCurrency(c); setRawAmount(''); }}
                      style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, outline: 'none',
                        background: inputCurrency === c ? BTN : 'transparent',
                        color: inputCurrency === c ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
                      {c === 'XOF' ? 'CFA' : 'USDT'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <input type="number" placeholder="0" value={rawAmount}
                  onChange={e => setRawAmount(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '18px 84px 18px 20px', color: '#fff', fontSize: '34px', fontWeight: 700, outline: 'none', letterSpacing: '-1px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {inputCurrency === 'USDT' ? (
                    <><span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>USDT</span><img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '20px', height: '20px' }} /></>
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>CFA</span>
                  )}
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '11px', margin: '8px 0 0' }}>Minimum : {MIN_SELL_USDT} USDT</p>
            </div>

            {/* Summary */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inputCurrency === 'XOF' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>Vous vendez</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{usdtAmount || '0'} USDT</span>
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Vous recevez</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{inputCurrency === 'USDT' ? fiatAmount : rawAmount || '0'} {currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Taux</span>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>1 USDT = {terexBuyRateCfa} {currency}</span>
              </div>
            </div>

            {/* Continue — RIGHT */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleContinueToNetwork}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: BTN, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)', padding: '13px 22px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                <HandCoins size={17} strokeWidth={2} /> Continuer
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Network ─────────────────────────────────────────── */}
        {step === 'network' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('amount')}
              title="Mode d'envoi"
              description="Choisissez comment vous voulez envoyer vos USDT"
            />

            <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Binance Pay toggle */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                      <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>Binance Pay</p>
                      <p style={{ color: '#6b7280', fontSize: '11px', margin: 0 }}>Envoi instantané depuis Binance</p>
                    </div>
                  </div>
                  <Switch checked={useBinancePay} onCheckedChange={setUseBinancePay} className="data-[state=checked]:bg-[#2d2d2d]" />
                </div>
                {useBinancePay && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>Vous enverrez vos USDT via Binance Pay à notre ID Binance</p>
                  </div>
                )}
              </div>

              {/* Blockchain networks */}
              {!useBinancePay && (
                <div>
                  <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 10px' }}>Réseau blockchain</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Object.entries(NETWORK_LOGOS).map(([net, logo]) => {
                      const sel = network === net;
                      return (
                        <button key={net} onClick={() => setNetwork(net)}
                          style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 16px 9px 10px', borderRadius: '100px', border: `1px solid ${sel ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.18)'}`, background: sel ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s' }}>
                          <img src={logo} alt={net} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                          <span style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: sel ? 600 : 400 }}>{net}</span>
                          {sel && <Check size={12} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <ContinueBtn onClick={handleContinueToPhone} />
          </div>
        )}

        {/* ── Step 2b: Binance Pay instructions ──────────────────────── */}
        {step === 'binance' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('network')}
              title={<>
                <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                Binance Pay
              </>}
              description="Instructions pour l'envoi via Binance Pay"
            />

            <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 }}>Pour envoyer vos USDT via Binance Pay :</p>
                <ol style={{ color: '#9ca3af', fontSize: '12px', lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
                  <li>Ouvrez l'application Binance</li>
                  <li>Allez dans « Pay » puis « Envoyer »</li>
                  <li>Utilisez l'email ou l'ID ci-dessous</li>
                  <li>Montant exact : <strong style={{ color: '#fff' }}>{usdtAmount} USDT</strong></li>
                  <li>Confirmez l'envoi</li>
                </ol>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                {[
                  { label: 'Email Binance', value: 'lomohamed834@gmail.com' },
                  { label: 'ID Binance Pay', value: '450715599' },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{value}</span>
                      <button onClick={() => copyToClipboard(value, label)}
                        style={{ padding: '4px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Copy size={13} color="#9ca3af" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContinueBtn onClick={() => setStep('phone')}>
              <HandCoins size={17} strokeWidth={2} /> J'ai compris
            </ContinueBtn>
          </div>
        )}

        {/* ── Step 3: Phone + Provider ─────────────────────────────── */}
        {step === 'phone' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => useBinancePay ? setStep('binance') : setStep('network')}
              title="Informations de paiement"
              description="Entrez votre numéro Mobile Money"
            />

            <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Service Mobile Money</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {([
                    { id: 'wave' as const, label: 'Wave', logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png' },
                    { id: 'orange' as const, label: 'Orange Money', logo: '/payment-methods/orange-money-logo.png' },
                  ]).map(({ id, label, logo }) => {
                    const sel = provider === id;
                    return (
                      <button key={id} onClick={() => setProvider(id)}
                        style={{ padding: '16px 12px', borderRadius: '14px', border: `1px solid ${sel ? SEL_BORDER : BORDER}`, background: sel ? SEL_BG : 'rgba(255,255,255,0.02)', cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                        <img src={logo} alt={label} style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{label}</span>
                        {sel && <Check size={14} color="#fff" strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Numéro de téléphone</p>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                  <input
                    type="tel" placeholder="+221 XX XXX XX XX" value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToConfirm} disabled={!phoneNumber} />
          </div>
        )}

        {/* ── Step 4: Confirm ─────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('phone')}
              title="Confirmer la vente"
              description="Vérifiez les détails de votre transaction"
            />

            <div style={{ padding: '4px 20px' }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden' }}>
                {[
                  { label: 'Vous envoyez', value: `${usdtAmount} USDT` },
                  { label: 'Vous recevez', value: `${fiatAmount} ${currency}` },
                  { label: 'Réseau', value: useBinancePay ? 'Binance Pay' : network },
                  { label: 'Service', value: provider === 'wave' ? 'Wave' : 'Orange Money' },
                  { label: 'Numéro', value: phoneNumber },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>{label}</span>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 28px' }}>
              <button onClick={handleConfirm} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: loading ? 'rgba(255,255,255,0.04)' : '#ffffff', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', padding: '13px 22px', color: loading ? '#6b7280' : '#141414', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', outline: 'none' }}>
                <HandCoins size={17} strokeWidth={2} />
                {loading ? 'Traitement…' : 'Confirmer la vente'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Instructions ────────────────────────────────────── */}
        {step === 'instructions' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={handleBackToDashboard}
              title="Envoyer vos USDT"
              description="Suivez ces instructions pour compléter votre vente"
            />

            <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Amount highlight */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px' }}>Envoyez exactement</p>
                <p style={{ color: '#fff', fontSize: '32px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-1px' }}>{usdtAmount} <span style={{ fontSize: '16px', fontWeight: 500, color: '#9ca3af' }}>USDT</span></p>
                {!useBinancePay && <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>sur le réseau {network}</p>}
              </div>

              {useBinancePay ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                    {[
                      { label: 'Email Binance', value: 'lomohamed834@gmail.com' },
                      { label: 'ID Binance Pay', value: '450715599' },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>{label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{value}</span>
                          <button onClick={() => copyToClipboard(value, label)}
                            style={{ padding: '4px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <Copy size={13} color="#9ca3af" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
                      if (isMobile) {
                        window.location.href = 'binance://';
                        setTimeout(() => window.open(/iPhone|iPad|iPod/.test(navigator.userAgent) ? 'https://apps.apple.com/app/binance-buy-bitcoin-crypto/id1436799971' : 'https://play.google.com/store/apps/details?id=com.binance.dev', '_blank'), 1000);
                      } else { window.open('https://www.binance.com', '_blank'); }
                    }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                    <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '20px', height: '20px' }} />
                    Ouvrir Binance Pay
                  </button>
                </div>
              ) : (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '16px' }}>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 10px' }}>Adresse de réception Terex :</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p style={{ color: '#fff', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace', flex: 1, margin: 0, lineHeight: 1.6 }}>
                      {WALLET_ADDRESSES[network]}
                    </p>
                    <button onClick={() => copyToClipboard(WALLET_ADDRESSES[network], 'Adresse')}
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                      <Copy size={15} color="#9ca3af" />
                    </button>
                  </div>
                </div>
              )}

              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '12px 14px' }}>
                <p style={{ color: '#fbbf24', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                  Une fois l'envoi effectué, votre paiement sera traité en 2–5 minutes.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 28px' }}>
              <button onClick={handleBackToDashboard}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: BTN, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)', padding: '13px 22px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                <HandCoins size={17} strokeWidth={2} /> Compris
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
