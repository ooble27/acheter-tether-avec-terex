import { useState } from 'react';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowLeft, Check, Send, Globe } from 'lucide-react';
import { TransferPending } from './TransferPending';
import { KYCPage } from '../KYCPage';

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
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px 20px 28px' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: disabled ? 'rgba(255,255,255,0.04)' : BTN,
          borderRadius: '16px',
          border: `1px solid rgba(255,255,255,${disabled ? '0.05' : '0.10'})`,
          padding: '13px 22px',
          color: disabled ? '#6b7280' : '#fff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.15s',
        }}
      >
        {children ?? <><Send size={17} strokeWidth={2} /> Continuer</>}
      </button>
    </div>
  );
}

function ConfirmBtn({ onClick, disabled, loading }: { onClick: () => void; disabled?: boolean; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 28px' }}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: disabled || loading ? 'rgba(255,255,255,0.08)' : '#ffffff',
          borderRadius: '16px',
          border: 'none',
          padding: '13px 22px',
          color: disabled || loading ? '#6b7280' : '#141414',
          fontSize: '14px',
          fontWeight: 700,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
        }}
      >
        <Send size={17} strokeWidth={2} />
        {loading ? 'Traitement...' : 'Confirmer le transfert'}
      </button>
    </div>
  );
}

const PAYMENT_LOGOS = {
  interac: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Interac_logo.svg/2560px-Interac_logo.svg.png',
  wave: 'https://play-lh.googleusercontent.com/SJJC8sL9FXgC-4P1sL8CvRzL8GVHJ7kzQQD8HEihRQUqfDAKZrYMMWR7DQdQD6D1ow',
  orange: '/payment-methods/orange-money-logo.png'
};

export function MobileInternationalTransfer() {
  const [step, setStep] = useState<'amount' | 'recipient' | 'method' | 'confirm'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiveMethod, setReceiveMethod] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [provider, setProvider] = useState('');
  const [createdTransfer, setCreatedTransfer] = useState<any>(null);
  const [showPending, setShowPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createTransfer } = useInternationalTransfers();
  const { user } = useAuth();
  const { toast } = useToast();
  const { usdtToCfa, usdtToCad } = useCryptoRates();
  const { isAuthorized, kycStatus } = useTransactionAuthorization();

  const cadToUsd = usdtToCad ? (1 / usdtToCad) : 0.74;
  const usdToCfa = usdtToCfa || 600;
  const exchangeRate = Math.round(cadToUsd * usdToCfa * 100) / 100;

  const calculateReceiveAmount = () => {
    if (!sendAmount) return '0.00';
    const baseAmount = parseFloat(sendAmount) * exchangeRate;
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') return (baseAmount * 0.99).toFixed(2);
      if (provider === 'orange') return (baseAmount * 0.992).toFixed(2);
    }
    return baseAmount.toFixed(2);
  };

  const receiveAmount = calculateReceiveAmount();

  const handleContinueToRecipient = () => {
    if (!sendAmount || !recipientCountry) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    setStep('recipient');
  };

  const handleContinueToMethod = () => {
    if (!recipientFirstName || !recipientLastName || !recipientPhone) {
      toast({ title: "Erreur", description: "Veuillez remplir les informations du bénéficiaire", variant: "destructive" });
      return;
    }
    setStep('method');
  };

  const handleContinueToConfirm = () => {
    if (!paymentMethod || !receiveMethod) {
      toast({ title: "Erreur", description: "Veuillez sélectionner les méthodes de paiement", variant: "destructive" });
      return;
    }
    if (receiveMethod === 'mobile' && !provider) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un service Mobile Money", variant: "destructive" });
      return;
    }
    if (receiveMethod === 'bank' && (!recipientAccount || !recipientBank)) {
      toast({ title: "Erreur", description: "Veuillez remplir les informations bancaires", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!isAuthorized) {
      setShowKYCPage(true);
      return;
    }
    setLoading(true);
    const transferData = {
      amount: parseFloat(sendAmount),
      from_currency: 'CAD',
      to_currency: 'CFA',
      exchange_rate: exchangeRate,
      fees: 0,
      total_amount: parseFloat(receiveAmount),
      recipient_name: `${recipientFirstName} ${recipientLastName}`,
      recipient_account: recipientAccount || recipientPhone,
      recipient_bank: recipientBank,
      recipient_country: recipientCountry,
      recipient_phone: recipientPhone,
      recipient_email: recipientEmail,
      payment_method: paymentMethod,
      receive_method: receiveMethod,
      provider,
      status: 'pending'
    };
    const result = await createTransfer(transferData);
    setLoading(false);
    if (result) {
      setCreatedTransfer(result);
      setShowPending(true);
    }
  };

  const handleBackToDashboard = () => {
    setShowPending(false);
    setStep('amount');
    setSendAmount('');
    setRecipientCountry('');
    setPaymentMethod('');
    setReceiveMethod('');
    setRecipientFirstName('');
    setRecipientLastName('');
    setRecipientEmail('');
    setRecipientPhone('');
    setRecipientAccount('');
    setRecipientBank('');
    setProvider('');
    setCreatedTransfer(null);
  };

  if (showKYCPage) return <KYCPage onBack={() => setShowKYCPage(false)} />;
  if (showPending && createdTransfer) {
    return <TransferPending transfer={createdTransfer} onBack={handleBackToDashboard} />;
  }

  const countries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'NE', name: 'Niger', flag: '🇳🇪' }
  ];

  const stepNum = step === 'amount' ? 1 : step === 'recipient' ? 2 : step === 'method' ? 3 : 4;
  const progressPercent = stepNum * 25;

  const goBack = () => {
    if (step === 'recipient') setStep('amount');
    else if (step === 'method') setStep('recipient');
    else if (step === 'confirm') setStep('method');
  };

  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{label}</span>
      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#141414', paddingBottom: '96px' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#141414', borderBottom: `1px solid ${BORDER}`, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {step !== 'amount' && (
            <button
              onClick={goBack}
              style={{ padding: '8px', background: SEL_BG, borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: SEL_BG, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>Virement international</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Étape {stepNum} sur 4</div>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'rgba(255,255,255,0.5)', borderRadius: '99px', transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <div style={CARD}>
            <div style={{ padding: '24px 20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Globe size={20} color="rgba(255,255,255,0.6)" />
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>Montant à envoyer</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Montant (CAD)</label>
                <input
                  type="number"
                  placeholder="Ex: 100"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  style={{ ...inputStyle, fontSize: '20px', padding: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Pays de destination</label>
                <select
                  value={recipientCountry}
                  onChange={(e) => setRecipientCountry(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
                >
                  <option value="" disabled style={{ background: '#1e1e1e' }}>Sélectionner un pays</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code} style={{ background: '#1e1e1e' }}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              {sendAmount && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '16px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>Le bénéficiaire recevra</span>
                    <span style={{ color: '#fff', fontSize: '20px', fontWeight: 500 }}>{receiveAmount} CFA</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>Taux : 1 CAD = {exchangeRate} CFA</div>
                </div>
              )}
            </div>

            <ContinueBtn onClick={handleContinueToRecipient} disabled={!sendAmount || !recipientCountry} />
          </div>
        )}

        {/* Étape 2: Bénéficiaire */}
        {step === 'recipient' && (
          <div style={CARD}>
            <div style={{ padding: '24px 20px 0' }}>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Informations du bénéficiaire</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input
                    value={recipientFirstName}
                    onChange={(e) => setRecipientFirstName(e.target.value)}
                    style={inputStyle}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    style={inputStyle}
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Téléphone *</label>
                <input
                  type="tel"
                  placeholder="+221 XX XXX XX XX"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email (optionnel)</label>
                <input
                  type="email"
                  placeholder="email@exemple.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <ContinueBtn onClick={handleContinueToMethod} disabled={!recipientFirstName || !recipientLastName || !recipientPhone} />
          </div>
        )}

        {/* Étape 3: Méthode */}
        {step === 'method' && (
          <div style={CARD}>
            <div style={{ padding: '24px 20px 0' }}>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Méthodes de paiement</div>

              {/* Send method */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Vous payez avec</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { value: 'interac', label: 'Interac e-Transfer', logo: PAYMENT_LOGOS.interac },
                    { value: 'bank', label: 'Virement bancaire', logo: null }
                  ].map(m => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: paymentMethod === m.value ? SEL_BG : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${paymentMethod === m.value ? SEL_BORDER : BORDER}`,
                        borderRadius: '12px', padding: '12px 14px',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      {m.logo ? (
                        <img src={m.logo} alt={m.label} style={{ width: '32px', height: '20px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: '32px', height: '20px', background: SEL_BG, borderRadius: '6px' }} />
                      )}
                      <span style={{ color: '#fff', fontSize: '14px', flex: 1 }}>{m.label}</span>
                      {paymentMethod === m.value && <Check size={15} color="rgba(255,255,255,0.8)" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receive method */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Le bénéficiaire reçoit via</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { value: 'mobile', label: 'Mobile Money' },
                    { value: 'bank', label: 'Compte bancaire' }
                  ].map(m => (
                    <button
                      key={m.value}
                      onClick={() => setReceiveMethod(m.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: receiveMethod === m.value ? SEL_BG : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${receiveMethod === m.value ? SEL_BORDER : BORDER}`,
                        borderRadius: '12px', padding: '12px 14px',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: '14px', flex: 1 }}>{m.label}</span>
                      {receiveMethod === m.value && <Check size={15} color="rgba(255,255,255,0.8)" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Money provider */}
              {receiveMethod === 'mobile' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Service Mobile Money</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {[
                      { value: 'orange', label: 'Orange', logo: PAYMENT_LOGOS.orange, fee: '0.8%' },
                      { value: 'wave', label: 'Wave', logo: PAYMENT_LOGOS.wave, fee: '1%' },
                      { value: 'free', label: 'Free', logo: null, fee: '' }
                    ].map(p => (
                      <button
                        key={p.value}
                        onClick={() => setProvider(p.value)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                          background: provider === p.value ? SEL_BG : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${provider === p.value ? SEL_BORDER : BORDER}`,
                          borderRadius: '12px', padding: '12px 8px',
                          cursor: 'pointer', position: 'relative',
                        }}
                      >
                        {p.logo ? (
                          <img src={p.logo} alt={p.label} style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} />
                        ) : (
                          <div style={{ width: '28px', height: '28px', background: SEL_BG, borderRadius: '6px' }} />
                        )}
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>{p.label}</span>
                        {p.fee && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>{p.fee} frais</span>}
                        {provider === p.value && (
                          <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                            <Check size={12} color="rgba(255,255,255,0.8)" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank details */}
              {receiveMethod === 'bank' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Nom de la banque</label>
                    <input
                      value={recipientBank}
                      onChange={(e) => setRecipientBank(e.target.value)}
                      placeholder="Ex: Ecobank"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Numéro de compte</label>
                    <input
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder="Numéro de compte bancaire"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}
            </div>

            <ContinueBtn
              onClick={handleContinueToConfirm}
              disabled={
                !paymentMethod || !receiveMethod ||
                (receiveMethod === 'mobile' && !provider) ||
                (receiveMethod === 'bank' && (!recipientAccount || !recipientBank))
              }
            />
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 'confirm' && (
          <div style={CARD}>
            <div style={{ padding: '24px 20px 0' }}>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Récapitulatif du transfert</div>

              {/* Transfer details */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '4px 16px', marginBottom: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.05em', padding: '10px 0 6px' }}>TRANSFERT</div>
                {row('Montant envoyé', `${sendAmount} CAD`)}
                {row('Montant reçu', `${receiveAmount} CFA`)}
                {row('Taux de change', `1 CAD = ${exchangeRate} CFA`)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Frais Terex</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>Gratuit 🎉</span>
                </div>
              </div>

              {/* Recipient details */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '4px 16px', marginBottom: '8px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.05em', padding: '10px 0 6px' }}>BÉNÉFICIAIRE</div>
                {row('Nom', `${recipientFirstName} ${recipientLastName}`)}
                {row('Téléphone', recipientPhone)}
                {row('Pays', countries.find(c => c.code === recipientCountry)?.name ?? recipientCountry)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Méthode de réception</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>
                    {receiveMethod === 'mobile'
                      ? `${provider.charAt(0).toUpperCase() + provider.slice(1)} Money`
                      : 'Virement bancaire'}
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
