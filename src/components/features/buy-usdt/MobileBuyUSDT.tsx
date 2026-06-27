import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNabooPay } from '@/hooks/useNabooPay';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowLeft, Coins, Check } from 'lucide-react';
import { BinanceEmailInput } from './BinanceEmailInput';
import { PURCHASE_LIMITS, getLimitMessage, enforceMaxLimit } from './LimitsValidator';
import { KYCPage } from '../KYCPage';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const BTN = '#2d2d2d';
const SEL_BG = 'rgba(255,255,255,0.06)';
const SEL_BORDER = 'rgba(255,255,255,0.18)';

const NETWORK_LOGOS: Record<string, string> = {
  TRC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana:  'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos:   'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
  BINANCE: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
};

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

function StepHeader({ onBack, title, description }: { onBack: () => void; title: React.ReactNode; description: React.ReactNode }) {
  return (
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={circleBackBtn}><ArrowLeft size={18} color="#fff" /></button>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>{title}</h2>
      </div>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 0' }}>{description}</p>
    </div>
  );
}

function ContinueBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px 20px 28px' }}>
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
        {children ?? <><Coins size={17} strokeWidth={2} /> Continuer</>}
      </button>
    </div>
  );
}

export function MobileBuyUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'address' | 'binance' | 'confirm'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [inputCurrency, setInputCurrency] = useState<'XOF' | 'USDT'>('XOF');
  const [rawAmount, setRawAmount] = useState('');
  const [paymentMethod] = useState<'mobile'>('mobile');
  const [currency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [binanceEmail, setBinanceEmail] = useState('');
  const [binanceUsername, setBinanceUsername] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTransaction } = useNabooPay();
  const { terexRateCfa, terexRateCad } = useTerexRates(2);
  const { isAuthorized } = useTransactionAuthorization();

  const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];

  const fiatAmount = inputCurrency === 'XOF'
    ? rawAmount
    : (rawAmount && exchangeRate > 0 ? (parseFloat(rawAmount) * exchangeRate).toFixed(0) : '');
  const numericFiat = parseFloat(fiatAmount || '0') || 0;

  useEffect(() => {
    const pending = localStorage.getItem('pendingBuyOrder');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        if (data.timestamp && Date.now() - data.timestamp < 30 * 60 * 1000) {
          if (data.amount) { setRawAmount(data.amount); setInputCurrency('XOF'); }
          if (data.network) setNetwork(data.network);
          if (data.walletAddress) setWalletAddress(data.walletAddress);
          if (data.walletAddress) setStep('confirm');
          else if (data.network) setStep('address');
        }
      } catch { /* ignore */ }
      localStorage.removeItem('pendingBuyOrder');
    }
  }, []);

  const usdtAmount = inputCurrency === 'USDT'
    ? rawAmount
    : (fiatAmount && numericFiat >= (limits?.min || 0) ? (numericFiat / exchangeRate).toFixed(2) : '0');

  const isBinanceNetwork = network === 'BINANCE';
  const limitMessage = getLimitMessage(fiatAmount || '0', currency);

  const handleContinueToNetwork = () => {
    const v = parseFloat(fiatAmount || '0');
    if (!rawAmount || v <= 0) { toast({ title: 'Erreur', description: 'Veuillez entrer un montant valide', variant: 'destructive' }); return; }
    if (limits && v < limits.min) { toast({ title: 'Montant trop faible', description: `Minimum ${limits.min.toLocaleString()} ${currency}`, variant: 'destructive' }); return; }
    if (limits && v > limits.max) { toast({ title: 'Montant trop élevé', description: `Maximum ${limits.max.toLocaleString()} ${currency}`, variant: 'destructive' }); return; }
    setStep('network');
  };

  const handleContinueToAddress = () => {
    if (isBinanceNetwork) setStep('binance'); else setStep('address');
  };

  const handleContinueToBinanceConfirm = () => {
    if (!binanceEmail || !binanceUsername || !binanceId) {
      toast({ title: 'Erreur', description: 'Veuillez remplir toutes les informations Binance', variant: 'destructive' }); return;
    }
    setStep('confirm');
  };

  const handleContinueToConfirm = () => {
    if (!walletAddress) { toast({ title: 'Erreur', description: 'Veuillez entrer une adresse valide', variant: 'destructive' }); return; }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    if (!isAuthorized) { setShowKYCPage(true); return; }
    setLoading(true);
    const orderData = {
      user_id: user.id, type: 'buy' as const,
      amount: parseFloat(fiatAmount), currency,
      usdt_amount: parseFloat(usdtAmount), exchange_rate: exchangeRate,
      payment_method: paymentMethod,
      network: isBinanceNetwork ? 'BINANCE' : network,
      wallet_address: isBinanceNetwork ? binanceEmail : walletAddress,
      status: 'pending' as const, payment_status: 'pending',
      notes: JSON.stringify({ paymentMethod, mobilePayment: true, destination: isBinanceNetwork ? 'binance' : 'wallet', binanceData: isBinanceNetwork ? { email: binanceEmail, username: binanceUsername, binanceId } : null }),
    };
    const result = await createOrder(orderData);
    if (result) {
      const nabooResult = await createTransaction({
        orderId: result.id, amount: parseFloat(fiatAmount),
        products: [{ name: `Achat USDT - ${parseFloat(usdtAmount).toFixed(2)} USDT`, category: 'Crypto', amount: parseFloat(fiatAmount), quantity: 1, description: `Achat de ${parseFloat(usdtAmount).toFixed(2)} USDT` }],
        paymentMethods: ['WAVE', 'ORANGE_MONEY'],
        successUrl: `${window.location.origin}/dashboard`,
        errorUrl: `${window.location.origin}/dashboard`,
      });
      if (nabooResult?.success && nabooResult.checkoutUrl) {
        window.location.href = nabooResult.checkoutUrl;
      } else {
        toast({ title: 'Paiement impossible', description: nabooResult?.error || 'Impossible de créer le paiement', variant: 'destructive' });
      }
    }
    setLoading(false);
  };

  if (showKYCPage) return <KYCPage onBack={() => setShowKYCPage(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#141414' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* ── Step 1: Amount ─────────────────────────────────────────── */}
        {step === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '80px 20px 100px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.4px' }}>Acheter USDT</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Entrez le montant que vous souhaitez dépenser</p>
            </div>

            {/* Amount input card */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Montant</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Currency toggle */}
                  <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                    {(['XOF', 'USDT'] as const).map(c => (
                      <button key={c} onClick={() => { setInputCurrency(c); setRawAmount(''); }}
                        style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, outline: 'none',
                          background: inputCurrency === c ? BTN : 'transparent',
                          color: inputCurrency === c ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
                        {c === 'XOF' ? 'CFA' : 'USDT'}
                      </button>
                    ))}
                  </div>
                  {/* Min / Max */}
                  {limits && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setRawAmount(inputCurrency === 'USDT' && exchangeRate > 0 ? (limits.min / exchangeRate).toFixed(2) : limits.min.toString())}
                        style={{ color: '#9ca3af', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
                        Min
                      </button>
                      <button
                        onClick={() => {
                          if (inputCurrency === 'USDT' && exchangeRate > 0) {
                            setRawAmount((Math.floor((limits.max / exchangeRate) * 100) / 100).toFixed(2));
                          } else {
                            setRawAmount(limits.max.toString());
                          }
                        }}
                        style={{ color: '#9ca3af', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
                        Max
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Number input */}
              <div style={{ position: 'relative' }}>
                <input
                  type="number" placeholder="0" value={rawAmount}
                  onChange={(e) => {
                    if (inputCurrency === 'XOF') {
                      setRawAmount(enforceMaxLimit(e.target.value, currency));
                    } else {
                      const val = e.target.value;
                      if (val && exchangeRate > 0 && limits) {
                        const numVal = parseFloat(val);
                        const cfa = numVal * exchangeRate;
                        if (cfa > limits.max) {
                          setRawAmount((Math.floor((limits.max / exchangeRate) * 100) / 100).toFixed(2));
                          return;
                        }
                        setRawAmount(String(numVal));
                        return;
                      }
                      setRawAmount(val);
                    }
                  }}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '18px 84px 18px 20px', color: '#fff', fontSize: '34px', fontWeight: 700, outline: 'none', letterSpacing: '-1px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {inputCurrency === 'USDT' ? (
                    <><img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '20px', height: '20px' }} /><span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>USDT</span></>
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>{currency}</span>
                  )}
                </span>
              </div>

              {limitMessage.type && (
                <p style={{ fontSize: '12px', margin: '8px 0 0', color: limitMessage.type === 'error' ? '#f87171' : limitMessage.type === 'max-reached' ? '#9ca3af' : '#fbbf24' }}>
                  {limitMessage.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inputCurrency === 'USDT' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>Vous payez</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{fiatAmount || '0'} {currency}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Vous recevez</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{usdtAmount} USDT</span>
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '18px', height: '18px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Taux</span>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>1 USDT = {exchangeRate} {currency}</span>
              </div>
            </div>

            {/* Continue — LEFT */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={handleContinueToNetwork}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: BTN, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)', padding: '13px 22px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                <Coins size={17} strokeWidth={2} /> Continuer
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Network ─────────────────────────────────────────── */}
        {step === 'network' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('amount')}
              title="Destination"
              description="Choisissez où vous voulez recevoir vos USDT"
            />

            <div style={{ padding: '4px 20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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

            <ContinueBtn onClick={handleContinueToAddress} />
          </div>
        )}

        {/* ── Step 3: Address ─────────────────────────────────────────── */}
        {step === 'address' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('network')}
              title="Adresse de réception"
              description={`Entrez votre adresse ${network}`}
            />

            <div style={{ padding: '4px 20px' }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, gap: '10px' }}>
                  <img src={NETWORK_LOGOS[network]} alt={network} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                  <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{network}</span>
                </div>
                <input
                  placeholder={`Votre adresse ${network}`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'monospace', lineHeight: 1.6, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToConfirm} disabled={!walletAddress} />
          </div>
        )}

        {/* ── Step 3b: Binance ─────────────────────────────────────────── */}
        {step === 'binance' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => setStep('network')}
              title={<>
                <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                Compte Binance
              </>}
              description="Vos USDT seront envoyés sur votre compte Binance"
            />

            <div style={{ padding: '4px 20px' }}>
              <BinanceEmailInput
                email={binanceEmail} setEmail={setBinanceEmail}
                username={binanceUsername} setUsername={setBinanceUsername}
                binanceId={binanceId} setBinanceId={setBinanceId}
              />
            </div>

            <ContinueBtn onClick={handleContinueToBinanceConfirm} disabled={!binanceEmail || !binanceUsername || !binanceId} />
          </div>
        )}

        {/* ── Step 4: Confirm ─────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div style={fullScreen}>
            <StepHeader
              onBack={() => isBinanceNetwork ? setStep('binance') : setStep('address')}
              title="Confirmer l'achat"
              description="Vérifiez les détails avant de payer"
            />

            <div style={{ padding: '4px 20px' }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden' }}>
                {[
                  { label: 'Vous payez',   value: `${fiatAmount} ${currency}` },
                  { label: 'Vous recevez', value: `${usdtAmount} USDT` },
                  { label: 'Destination',  value: isBinanceNetwork ? 'Binance' : network },
                  { label: isBinanceNetwork ? 'Email' : 'Adresse', value: isBinanceNetwork ? binanceEmail : walletAddress, mono: true },
                ].map(({ label, value, mono }, i, arr) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>{label}</span>
                    <span style={{ color: '#fff', fontSize: mono ? '11px' : '13px', fontWeight: 500, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all', fontFamily: mono ? 'monospace' : undefined }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px 20px 28px' }}>
              <button onClick={handleConfirm} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: loading ? 'rgba(255,255,255,0.04)' : '#ffffff', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', padding: '13px 22px', color: loading ? '#6b7280' : '#141414', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', outline: 'none' }}>
                <Coins size={17} strokeWidth={2} />
                {loading ? 'Traitement…' : 'Confirmer et payer'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
