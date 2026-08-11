import { useState } from 'react';
import { WALLET_ADDRESSES } from '@/config/walletAddresses';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Check, HandCoins, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { KYCPage } from '../KYCPage';
import { NetworkPill } from '../shared/NetworkPill';
import { ProviderPill } from '../shared/ProviderPill';
import { PhoneBook } from '../shared/PhoneBook';
import { useSavedPhones } from '@/hooks/useSavedPhones';

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
};

const MIN_SELL_USDT = 50;

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
  border: `1px solid rgba(255,255,255,0.07)`,
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
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 0 8px' }}>
      <button
        onClick={onClick} disabled={disabled}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: disabled ? 'rgba(255,255,255,0.04)' : BTN,
          borderRadius: '16px', border: `1px solid rgba(255,255,255,${disabled ? '0.05' : '0.10'})`,
          padding: '13px 22px', color: disabled ? '#6b7280' : '#fff',
          fontSize: '14px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {children ?? <><HandCoins size={17} strokeWidth={2} /> Continuer</>}
      </button>
    </div>
  );
}

function ConfirmBtn({ onClick, disabled, loading }: { onClick: () => void; disabled?: boolean; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 0 8px' }}>
      <button
        onClick={onClick} disabled={disabled || loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: disabled || loading ? 'rgba(255,255,255,0.08)' : '#ffffff',
          borderRadius: '16px', border: 'none',
          padding: '13px 22px', color: disabled || loading ? '#6b7280' : '#141414',
          fontSize: '14px', fontWeight: 700, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        }}
      >
        <HandCoins size={17} strokeWidth={2} />
        {loading ? 'Traitement...' : 'Confirmer la vente'}
      </button>
    </div>
  );
}

export function DesktopSellUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'binance' | 'phone' | 'confirm' | 'instructions'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [inputCurrency, setInputCurrency] = useState<'USDT' | 'XOF'>('USDT');
  const [rawAmount, setRawAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'wave' | 'orange'>('wave');
  const [savePhone, setSavePhone] = useState(true);
  const [phoneLabel, setPhoneLabel] = useState('');
  const { add: addSavedPhone } = useSavedPhones();
  const [useBinancePay, setUseBinancePay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    if (!usdtAmount || usdt <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    if (usdt < MIN_SELL_USDT) {
      toast({ title: "Montant trop faible", description: `Minimum ${MIN_SELL_USDT} USDT`, variant: "destructive" });
      return;
    }
    setStep('network');
  };

  const handleContinueToPhone = () => {
    useBinancePay ? setStep('binance') : setStep('phone');
  };

  const handleContinueToConfirm = () => {
    if (!phoneNumber) {
      toast({ title: "Erreur", description: "Veuillez entrer un numéro de téléphone", variant: "destructive" });
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
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency: 'CFA',
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: terexBuyRateCfa,
      payment_method: 'mobile' as const,
      network: useBinancePay ? 'Binance Pay' : network,
      wallet_address: useBinancePay ? 'Binance Pay Transfer' : WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({ phoneNumber, provider, paymentMethod: 'mobile', useBinancePay })
    };

    const result = await createOrder(orderData);
    if (result) setStep('instructions');
    setLoading(false);
  };

  const handleBackToDashboard = () => {
    setStep('amount');
    setRawAmount('');
    setPhoneNumber('');
  };

  if (showKYCPage) return <KYCPage onBack={() => setShowKYCPage(false)} />;

  const copyToClipboard = async (text: string, field: string = 'default') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      /* silent */
    }
  };

  const backBtn = (to: typeof step) => (
    <button
      onClick={() => setStep(to)}
      style={{ padding: '8px', background: SEL_BG, borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', marginBottom: '16px' }}
    >
      <ArrowLeft size={18} />
    </button>
  );

  const rowItem = (label: string, value: string) => (
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
                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Vendre USDT</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Entrez le montant que vous souhaitez vendre</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={labelStyle}>Montant</label>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                  {(['USDT', 'XOF'] as const).map(c => (
                    <button key={c} onClick={() => { setInputCurrency(c); setRawAmount(''); }}
                      style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', background: inputCurrency === c ? '#2d2d2d' : 'transparent', color: inputCurrency === c ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                      {c === 'XOF' ? 'CFA' : c}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '4px' }}>
                <input
                  type="number" placeholder="0" value={rawAmount}
                  onChange={(e) => setRawAmount(e.target.value)}
                  style={{ ...inputStyle, fontSize: '28px', textAlign: 'center', padding: '16px 60px', fontWeight: 300 }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {inputCurrency === 'USDT'
                    ? <><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>USDT</span><img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '18px', height: '18px' }} /></>
                    : <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>CFA</span>
                  }
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}>Minimum : {MIN_SELL_USDT} USDT</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '4px' }}>
                {inputCurrency === 'XOF' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Vous vendez</span>
                    <span style={{ color: '#fff', fontSize: '12px' }}>{usdtAmount || '0'} USDT</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Vous recevez</span>
                  <span style={{ color: '#fff', fontSize: '12px' }}>{inputCurrency === 'USDT' ? fiatAmount : rawAmount || '0'} CFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Taux</span>
                  <span style={{ color: '#fff', fontSize: '12px' }}>1 USDT = {terexBuyRateCfa} CFA</span>
                </div>
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToNetwork} disabled={!rawAmount || parseFloat(usdtAmount || '0') <= 0} />
          </div>
        )}

        {/* Étape 2: Réseau + Binance Pay */}
        {step === 'network' && (
          <div>
            <div>
              {backBtn('amount')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Mode d'envoi</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Choisissez comment envoyer vos USDT</p>

              {/* Binance Pay toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>Binance Pay</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Envoi instantané depuis Binance</div>
                  </div>
                </div>
                <Switch checked={useBinancePay} onCheckedChange={setUseBinancePay} />
              </div>

              {!useBinancePay && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.keys(NETWORK_LOGOS).map(net => (
                    <NetworkPill key={net} network={net} selected={network === net} onSelect={() => setNetwork(net)} />
                  ))}
                </div>
              )}
            </div>

            <ContinueBtn onClick={handleContinueToPhone} />
          </div>
        )}

        {/* Étape 3: Binance Pay info */}
        {step === 'binance' && (
          <div>
            <div>
              {backBtn('network')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                Binance Pay
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Instructions pour l'envoi via Binance Pay</p>

              <div style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Pour envoyer vos USDT via Binance Pay :</p>
                <ol style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
                  <li>Ouvrez l'application Binance</li>
                  <li>Allez dans "Pay" puis "Envoyer"</li>
                  <li>Envoyez à l'email: lomohamed834@gmail.com</li>
                  <li>Ou utilisez l'ID: 450715599</li>
                  <li>Montant exact: {usdtAmount} USDT</li>
                  <li>Confirmez l'envoi</li>
                </ol>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '4px 14px' }}>
                {[['Email Binance', 'lomohamed834@gmail.com'], ['ID Binance Pay', '450715599']].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#fff', fontSize: '13px' }}>{val}</span>
                      <button onClick={() => copyToClipboard(val)} style={{ padding: '4px', background: SEL_BG, border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                        <Copy size={12} />
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

        {/* Étape 4: Téléphone & Provider */}
        {step === 'phone' && (
          <div>
            <div>
              {backBtn(useBinancePay ? 'binance' : 'network')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Informations de paiement</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Entrez votre numéro Mobile Money</p>

              <label style={labelStyle}>Service Mobile Money</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <ProviderPill provider="wave"   selected={provider === 'wave'}   onSelect={() => setProvider('wave')} />
                <ProviderPill provider="orange" selected={provider === 'orange'} onSelect={() => setProvider('orange')} />
              </div>

              <label style={labelStyle}>Numéro de téléphone</label>
              <PhoneBook
                provider={provider}
                value={phoneNumber}
                onChange={setPhoneNumber}
                saveToBook={savePhone}
                onToggleSave={setSavePhone}
                label={phoneLabel}
                onLabelChange={setPhoneLabel}
              />
            </div>

            <ContinueBtn
              onClick={async () => {
                if (savePhone && phoneNumber) {
                  try { await addSavedPhone({ provider, phone: phoneNumber, label: phoneLabel, setDefault: true }); } catch (_) {}
                }
                handleContinueToConfirm();
              }}
              disabled={!phoneNumber}
            />
          </div>
        )}

        {/* Étape 5: Confirmation */}
        {step === 'confirm' && (
          <div>
            <div>
              {backBtn('phone')}
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Confirmer la vente</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Vérifiez les détails de votre transaction</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '4px 16px' }}>
                {rowItem('Vous envoyez', `${usdtAmount} USDT`)}
                {rowItem('Vous recevez', `${fiatAmount} CFA`)}
                {rowItem('Réseau', useBinancePay ? 'Binance Pay' : network)}
                {rowItem('Service', provider === 'wave' ? 'Wave' : 'Orange Money')}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Numéro</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{phoneNumber}</span>
                </div>
              </div>
            </div>

            <ConfirmBtn onClick={handleConfirm} loading={loading} />
          </div>
        )}

        {/* Étape 6: Instructions d'envoi */}
        {step === 'instructions' && (
          <div>
            <div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 400, marginBottom: '4px' }}>Envoyer vos USDT</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Suivez ces instructions pour compléter votre vente</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" style={{ width: '36px', height: '36px' }} />
                  {!useBinancePay && network && NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS] && (
                    <img src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} alt={network} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>Envoyez exactement</p>
                    <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{usdtAmount} <span style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af' }}>USDT</span></p>
                  </div>
                </div>
                {!useBinancePay && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '12px' }}>sur le réseau <span style={{ color: '#fff', fontWeight: 600 }}>{network}</span></p>}

                {useBinancePay ? (
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '12px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '8px' }}>Via Binance Pay à :</p>
                    {[['Email', 'lomohamed834@gmail.com'], ['ID Binance', '450715599']].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '13px' }}>{val}</span>
                          <button onClick={() => copyToClipboard(val)} style={{ padding: '4px', background: SEL_BG, border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const ua = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
                        if (ua) window.location.href = 'binance://';
                        else window.open('https://www.binance.com', '_blank');
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: BTN, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '13px', cursor: 'pointer', marginTop: '8px', width: '100%', justifyContent: 'center' }}
                    >
                      <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
                      Ouvrir Binance Pay
                    </button>
                  </div>
                ) : (
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 }}>Scannez le QR</p>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>ou copiez l'adresse</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                      <div style={{ position: 'relative', background: '#fff', padding: '14px', borderRadius: '14px', lineHeight: 0 }}>
                        <QRCodeSVG value={WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]} size={200} level="M" />
                        {network && NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS] && (
                          <img src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} alt={network}
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #fff', background: '#fff' }} />
                        )}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '10px 12px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Adresse {network}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}>
                          {WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]}
                        </span>
                        <button onClick={() => copyToClipboard(WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES], 'address')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: copiedField === 'address' ? 'rgba(74,222,128,0.15)' : SEL_BG, border: 'none', borderRadius: '10px', cursor: 'pointer', color: copiedField === 'address' ? '#4ade80' : '#fff', fontSize: '12px', fontWeight: 600, flexShrink: 0, transition: 'all 0.15s' }}>
                          {copiedField === 'address' ? <><CheckCircle size={13} /> Copié</> : <><Copy size={13} /> Copier</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '12px 14px', marginTop: '12px' }}>
                <p style={{ color: 'rgba(251,191,36,0.9)', fontSize: '12px' }}>
                  Une fois l'envoi effectué, nous traiterons votre paiement en 2-5 minutes.
                </p>
              </div>
            </div>

            <ContinueBtn onClick={handleBackToDashboard}>
              <HandCoins size={17} strokeWidth={2} /> Compris
            </ContinueBtn>
          </div>
        )}
      </div>
    </div>
  );
}
