
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface PaymentPendingProps {
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
  onBackToHome: () => void;
}

export function PaymentPending({ orderData, orderId, onBackToHome }: PaymentPendingProps) {
  const [step, setStep] = useState(1);
  const [dots, setDots] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const stepInterval = setInterval(() => {
      setStep(prev => prev < 3 ? prev + 1 : prev);
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Vérification', icon: <RefreshCw size={16} /> },
    { id: 2, label: 'Confirmé', icon: <CheckCircle size={16} /> },
    { id: 3, label: 'Envoi USDT', icon: <Clock size={16} /> },
  ];

  const shortAddr = `${orderData.walletAddress.substring(0, 6)}...${orderData.walletAddress.substring(orderData.walletAddress.length - 4)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px' }}>

        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0' }}>
          Traitement en cours{dots}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '0 0 20px 0' }}>
          Commande #{orderId.slice(-8).toUpperCase()}
        </p>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {steps.map((s) => {
            const active = step >= s.id;
            const current = step === s.id;
            return (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: current ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'center', marginBottom: '6px',
                  color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                  animation: current ? 'pulse 2s infinite' : undefined,
                }}>
                  {s.icon}
                </div>
                <div style={{ color: active ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recap */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
          <Row label="Montant payé" value={`${orderData.amount} ${orderData.currency}`} />
          <Row label="Vous recevez" value={`${orderData.usdtAmount} USDT`} highlight />
          <Row label="Réseau" value={orderData.network} />
          <Row label="Adresse" value={shortAddr} mono />
          <Row label="Statut" value={step >= 3 ? 'Envoi en cours' : step >= 2 ? 'Confirmé' : 'Vérification...'} last />
        </div>

        <button
          onClick={onBackToHome}
          style={{
            width: '100%', background: '#fff', color: '#141414', border: 'none',
            borderRadius: '14px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Retourner à l'accueil
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, mono, last }: { label: string; value: string; highlight?: boolean; mono?: boolean; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 16px',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{label}</span>
      <span style={{
        color: highlight ? '#4ade80' : '#fff',
        fontSize: '13px',
        fontWeight: highlight ? 700 : 600,
        fontFamily: mono ? 'monospace' : undefined,
      }}>
        {value}
      </span>
    </div>
  );
}
