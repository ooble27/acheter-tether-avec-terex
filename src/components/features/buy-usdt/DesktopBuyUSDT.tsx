import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNabooPay } from '@/hooks/useNabooPay';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowLeft, Check, Coins } from 'lucide-react';
import { BinanceEmailInput } from './BinanceEmailInput';
import { PURCHASE_LIMITS, getLimitMessage, enforceMaxLimit } from './LimitsValidator';
import { KYCPage } from '../KYCPage';

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
  BINANCE: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png'
};

const CARD: React.CSSProperties = {
  background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  overflow: 'hidden',
};
const BORDER = 'rgba(255,255,255,0.07)';
const BTN = '#2d2d2d';
const SEL_BG = 'rgba(255,255,255,0.06)';
const SEL_BORDER = 'rgba(255,255,255,0.18)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${BORDER}`,
  borderRadius: '12px',
  padding: '13px 16px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '8px',
  letterSpacing: '0.04em',
};

function ContinueBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '20px 0 8px' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: disabled ? 'rgba(255,255,255,0.04)' : BTN,
          borderRadius: '16px',
          border: `1px solid rgba(255,255,255,${disabled ? '0.05' : '0.10'})`,
          padding: '13px 22px',
          color: disabled ? '#6b7280' : '#fff',
          fontSize: '14px', fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {children ?? <><Coins size={17} strokeWidth={2} /> Continuer</>}
      </button>
    </div>
  );
}

function ConfirmBtn({ onClick, disabled, loading }: { onClick: () => void; disabled?: boolean; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '20px 0 8px' }}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: disabled || loading ? 'rgba(255,255,255,0.08)' : '#ffffff',
          borderRadius: '16px', border: 'none',
          padding: '13px 22px',
          color: disabled || loading ? '#6b7280' : '#141414',
          fontSize: '14px', fontWeight: 700,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
        }}
      >
        <Coins size={17} strokeWidth={2} />
        {loading ? 'Traitement...' : 'Confirmer et payer'}
      </button>
    </div>
  );
}

export function DesktopBuyUSDT() {
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
      } catch (e) { /* ignore */ }
      localStorage.removeItem('pendingBuyOrder');
    }
  }, []);

  const usdtAmount = inputCurrency === 'USDT'
    ? rawAmount
    : (fiatAmount && numericFiat >= (limits?.min || 0) ? (numericFiat / exchangeRate).toFixed(2) : '0');

  const isBinanceNetwork = network === 'BINANCE';
  const limitMessage = getLimitMessage(fiatAmount || '0', currency);

  const handleContinueToNetwork = () => {
    const numericFiatVal = parseFloat(fiatAmount || '0');
    if (!rawAmount || numericFiatVal <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    if (limits && numericFiatVal < limits.min) {
      toast({ title: "Montant trop faible", description: `Minimum ${limits.min.toLocaleString()} ${currency}`, variant: "destructive" });
      return;
    }
    if (limits && numericFiatVal > limits.max) {
      toast({ title: "Montant trop élevé", description: `Maximum ${limits.max.toLocaleString()} ${currency}`, variant: "destructive" });
      return;
    }
    setStep('network');
  };

  const handleContinueToAddress = () => {
    isBinanceNetwork ? setStep('binance') : setStep('address');
  };

  const handleContinueToBinanceConfirm = () => {
    if (!binanceEmail || !binanceUsername || !binanceId) {
      toast({ title: "Erreur", description: "Veuillez remplir toutes les informations Binance", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleContinueToConfirm = () => {
    if (!walletAddress) {
      toast({ title: "Erreur", description: "Veuillez entrer une adresse valide", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    if (!isAuthorized) { setShowKYCPage(true); return; }
    setLoading(true);

    const orderData = {
      user_id: user.id,
      type: 'buy' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRate,
      payment_method: paymentMethod,
      network: isBinanceNetwork ? 'BINANCE' : network,
      wallet_address: isBinanceNetwork ? binanceEmail : walletAddress,
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        paymentMethod, mobilePayment: true,
        destination: isBinanceNetwork ? 'binance' : 'wallet',
        binanceData: isBinanceNetwork ? { email: binanceEmail, username: binanceUsername, binanceId } : null
      })
    };

    const result = await createOrder(orderData);
    if (result) {
      const nabooResult = await createTransaction({
        orderId: result.id,
        amount: parseFloat(fiatAmount),
        products: [{ name: `Achat USDT - ${parseFloat(usdtAmount).toFixed(2)} USDT`, category: 'Crypto', amount: parseFloat(fiatAmount), quantity: 1, description: `Achat de ${parseFloat(usdtAmount).toFixed(2)} USDT` }],
        paymentMethods: ['WAVE', 'ORANGE_MONEY'],
        successUrl: `${window.location.origin}/dashboard`,
        errorUrl: `${window.location.origin}/dashboard`
      });
      if (nabooResult?.success && nabooResult.checkoutUrl) {
        window.location.href = nabooResult.checkoutUrl;
      } else {
        toast({ title: "Erreur", description: "Impossible de créer le paiement", variant: "destructive" });
      }
    }
    setLoading(false);
  };

  if (showKYCPage) return <KYCPage onBack={() => setShowKYCPage(false)} />;

  const backBtn = (to: 'amount' | 'network' | 'address' | 'binance') => (
    <button
      onClick={() => setStep(to)}
      style={{ padding: '8px', background: SEL_BG, borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', marginBottom: '16px' }}
    >
      <ArrowLeft size={18} />
    </button>
  );

  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{label}</span>
      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 10rem)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <div>
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Acheter USDT</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Entrez le montant que vous souhaitez dépenser</p>
              </div>

              {/* Currency toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={labelStyle}>Montant</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                    {(['XOF', 'USDT'] as const).map(c => (
                      <button key={c} onClick={() => { setInputCurrency(c); setRawAmount(''); }}
                        style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', background: inputCurrency === c ? '#2d2d2d' : 'transparent', color: inputCurrency === c ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                        {c === 'XOF' ? 'CFA' : 'USDT'}
                      </button>
                    ))}
                  </div>
                  {limits && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '8px' }}>
                      {['Min', 'Max'].map(t => (
                        <button key={t} onClick={() => {
                          if (t === 'Min') {
                            setRawAmount(inputCurrency === 'USDT' && exchangeRate > 0 ? (limits.min / exchangeRate).toFixed(2) : limits.min.toString());
                          } else {
                            setRawAmount(inputCurrency === 'USDT' && exchangeRate > 0 ? (Math.floor(limits.max / exchangeRate * 100) / 100).toFixed(2) : limits.max.toString());
                          }
                        }}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '4px' }}>
                <input
                  type="number" placeholder="0" value={rawAmount}
                  onChange={(e) => {
                    if (inputCurrency === 'XOF') { setRawAmount(enforceMaxLimit(e.target.value, currency)); }
                    else {
                      const val = e.target.value;
                      if (val && exchangeRate > 0 && limits) {
                        const cfa = parseFloat(val) * exchangeRate;
                        if (cfa > limits.max) { setRawAmount((Math.floor(limits.max / exchangeRate * 100) / 100).toFixed(2)); return; }
                      }
                      setRawAmount(val);
                    }
                  }}
                  style={{ ...inputStyle, fontSize: '28px', textAlign: 'center', padding: '16px 60px 16px 16px', fontWeight: 300 }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {inputCurrency === 'USDT'
                    ? <><img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '20px', height: '20px' }} /><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>USDT</span></>
                    : <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>{currency}</span>
                  }
                </span>
              </div>

              {limitMessage.type && (
                <p style={{ fontSize: '11px', color: limitMessage.type === 'error' ? '#f87171' : 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                  {limitMessage.message}
                </p>
              )}

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '12px 14px', marginTop: '12px', marginBottom: '4px' }}>
                {inputCurrency === 'USDT' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Vous payez</span>
                    <span style={{ color: '#fff', fontSize: '12px' }}>{fiatAmount || '0'} {currency}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Vous recevez</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#fff', fontSize: '12px' }}>{usdtAmount} USDT</span>
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Taux</span>
                  <span style={{ color: '#fff', fontSize: '12px' }}>1 USDT = {exchangeRate} {currency}</span>
                </div>
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToNetwork} disabled={!rawAmount || numericFiat <= 0} />
          </div>
        )}

        {/* Étape 2: Réseau */}
        {step === 'network' && (
          <div>
            <div>
              {backBtn('amount')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Destination</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Choisissez où vous voulez recevoir vos USDT</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(NETWORK_LOGOS).map(([net, logo]) => {
                  const sel = network === net;
                  return (
                    <button key={net} onClick={() => setNetwork(net)}
                      style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 16px 9px 10px', borderRadius: '100px', border: `1px solid ${sel ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.18)'}`, background: sel ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', outline: 'none', transition: 'all 0.15s' }}>
                      <img src={logo} alt={net} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                      <span style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: sel ? 600 : 400 }}>{net}</span>
                      {sel && <Check size={12} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToAddress} />
          </div>
        )}

        {/* Étape 3: Adresse Wallet */}
        {step === 'address' && (
          <div>
            <div>
              {backBtn('network')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Adresse de réception</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Entrez votre adresse {network} pour recevoir les USDT</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: `1px solid ${BORDER}` }}>
                  <img src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} alt={network} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{network}</span>
                </div>
                <textarea
                  placeholder={`Votre adresse ${network}`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  rows={3}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: '14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToConfirm} disabled={!walletAddress} />
          </div>
        )}

        {/* Étape 3bis: Compte Binance */}
        {step === 'binance' && (
          <div style={CARD}>
            <div style={{ padding: '28px 24px 0', maxHeight: 'calc(100vh - 12rem)', overflowY: 'auto' }}>
              {backBtn('network')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                Compte Binance
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Vos USDT seront envoyés directement sur votre compte Binance</p>

              <BinanceEmailInput
                email={binanceEmail} setEmail={setBinanceEmail}
                username={binanceUsername} setUsername={setBinanceUsername}
                binanceId={binanceId} setBinanceId={setBinanceId}
              />
            </div>

            <ContinueBtn onClick={handleContinueToBinanceConfirm} disabled={!binanceEmail || !binanceUsername || !binanceId} />
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 'confirm' && (
          <div>
            <div>
              {backBtn(isBinanceNetwork ? 'binance' : 'address')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Confirmer l'achat</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Vérifiez les détails de votre transaction</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '4px 16px' }}>
                {row('Montant', `${fiatAmount} ${currency}`)}
                {row('Vous recevez', `${usdtAmount} USDT`)}
                {row('Destination', isBinanceNetwork ? 'Binance' : network)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{isBinanceNetwork ? 'Email' : 'Adresse'}</span>
                  <span style={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>
                    {isBinanceNetwork ? binanceEmail : walletAddress}
                  </span>
                </div>
              </div>
            </div>

            <ConfirmBtn onClick={handleConfirm} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}
