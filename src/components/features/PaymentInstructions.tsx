import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Lien marchand Wave (fixe) — seul le paramètre `amount` change par commande.
// Peut être surchargé via VITE_WAVE_MERCHANT_URL si le marchand change.
const WAVE_MERCHANT_URL =
  (import.meta as any).env?.VITE_WAVE_MERCHANT_URL ||
  'https://pay.wave.com/m/M_sn_0yPNqe48JO3h/c/sn/';
// Wave prélève ~1 % au marchand → on le répercute pour recevoir net.
const WAVE_FEE_RATE = 0.01;

function buildWaveLink(amountCfa: number): string {
  const waveAmount = Math.ceil(amountCfa * (1 + WAVE_FEE_RATE));
  const url = new URL(WAVE_MERCHANT_URL);
  url.searchParams.set('amount', String(waveAmount));
  return url.toString();
}

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

const CARD_BG = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

export function PaymentInstructions({ orderData, orderId, onBack, onPaymentConfirmed }: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [overrideLink, setOverrideLink] = useState<string | null>(null);

  // Lien auto : calculé depuis le montant de la commande (montant + frais Wave).
  const baseAmount = parseFloat(orderData.amount) || 0;
  const autoLink = useMemo(() => buildWaveLink(baseAmount), [baseAmount]);
  const paymentLink = overrideLink || autoLink;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Écoute un override admin (payment_reference posé manuellement en DB).
  // Le lien auto reste disponible tout de suite — l'override le remplace s'il arrive.
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('payment_reference')
        .eq('id', orderId)
        .maybeSingle();
      if (cancelled) return;
      const ref = (data as any)?.payment_reference;
      if (ref && typeof ref === 'string' && ref.startsWith('http')) {
        setOverrideLink(ref);
      }
    })();

    const channel = supabase
      .channel(`order-payment-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          const ref = (payload.new as any)?.payment_reference;
          if (ref && typeof ref === 'string' && ref.startsWith('http')) {
            setOverrideLink(ref);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Countdown timer
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
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const CopyRow = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
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

  // ── Interac (card) payment — unchanged ──
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

          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
            <CopyRow label="Email destinataire" value="mohalaval4@gmail.com" field="email" />
            <CopyRow label="Montant" value={`${orderData.amount} ${orderData.currency}`} field="amount" />
            <CopyRow label="Question de sécurité" value="TEREX" field="question" />
            <CopyRow label="Réponse" value={securityAnswer} field="answer" />
          </div>

          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
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

  // ── Mobile Money (Wave) — realtime payment link flow ──
  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
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

        {/* Order recap — affichage épuré, frais Wave silencieusement inclus dans le lien */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Montant</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{baseAmount.toLocaleString('fr-FR')} {orderData.currency}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Vous recevez</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{orderData.usdtAmount} USDT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>Réseau</span>
            <span style={{ color: '#fff', fontSize: '13px' }}>{orderData.network}</span>
          </div>
        </div>

        {/* Bouton Wave — toujours dispo, lien auto-généré */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle size={18} color="#4ade80" />
            <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 600, margin: 0 }}>Prêt à payer</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.5 }}>
            Cliquez ci-dessous pour ouvrir Wave et effectuer le paiement.
          </p>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', background: '#1B6EF3', color: '#fff', border: 'none',
              borderRadius: '14px', padding: '15px', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', textDecoration: 'none', textAlign: 'center',
            }}
          >
            <ExternalLink size={18} />
            Payer avec Wave
          </a>
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
