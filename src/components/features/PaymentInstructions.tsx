import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, CheckCircle, Clock } from 'lucide-react';

interface PaymentInstructionsProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
  };
  orderId: string;
  onBack: () => void;
  onPaymentConfirmed: () => void;
}

const WAVE_NUMBER = '777569268';

export function PaymentInstructions({ orderData, orderId, onBack, onPaymentConfirmed }: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyRow = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, fontFamily: field === 'number' ? 'monospace' : undefined }}>{value}</div>
      </div>
      <button
        onClick={() => copyToClipboard(value, field)}
        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: copiedField === field ? '#4ade80' : 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500, transition: 'all 0.15s' }}
      >
        {copiedField === field ? <><CheckCircle size={14} /> Copié</> : <><Copy size={14} /> Copier</>}
      </button>
    </div>
  );

  if (orderData.paymentMethod === 'card') {
    const securityAnswer = orderId.slice(-8).toUpperCase();
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>Virement Interac</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Clock size={13} color="#f97316" />
                <span style={{ color: '#f97316', fontSize: '13px', fontWeight: 500 }}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
            <CopyRow label="Email destinataire" value="mohalaval4@gmail.com" field="email" />
            <CopyRow label="Montant" value={`${orderData.amount} ${orderData.currency}`} field="amount" />
            <CopyRow label="Question de sécurité" value="TEREX" field="question" />
            <CopyRow label="Réponse" value={securityAnswer} field="answer" />
          </div>

          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Vous recevez</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{orderData.usdtAmount} USDT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Réseau</span>
              <span style={{ color: '#fff', fontSize: '13px' }}>{orderData.network}</span>
            </div>
          </div>

          <button
            onClick={onPaymentConfirmed}
            style={{ width: '100%', background: '#fff', color: '#141414', border: 'none', borderRadius: '14px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
          >
            J'ai effectué le virement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>Paiement Wave</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Clock size={13} color="#f97316" />
              <span style={{ color: '#f97316', fontSize: '13px', fontWeight: 500 }}>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
          <CopyRow label="Numéro Wave" value={WAVE_NUMBER} field="number" />
          <CopyRow label="Montant à envoyer" value={`${orderData.amount} ${orderData.currency}`} field="amount" />
        </div>

        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Vous recevez</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{orderData.usdtAmount} USDT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Réseau</span>
            <span style={{ color: '#fff', fontSize: '13px' }}>{orderData.network}</span>
          </div>
        </div>

        <button
          onClick={onPaymentConfirmed}
          style={{ width: '100%', background: '#fff', color: '#141414', border: 'none', borderRadius: '14px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
        >
          J'ai payé
        </button>
      </div>
    </div>
  );
}
