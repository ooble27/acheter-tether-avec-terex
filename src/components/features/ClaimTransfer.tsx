/**
 * ClaimTransfer — Le destinataire choisit ou recevoir ses USDT.
 */
import { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, Wallet, Building2, ChevronRight,
  Clock, User, Info,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const BG_DEEP = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const GLASS = 'rgba(24,24,24,0.72)';
const CARD = '#1c1c1c';
const CARD_ELEVATED = '#212121';
const SUBTLE = 'rgba(255,255,255,0.05)';
const WHITE = '#ffffff';
const DIM = 'rgba(255,255,255,0.55)';
const FADE = 'rgba(255,255,255,0.35)';
const FAINT = 'rgba(255,255,255,0.18)';
const GREEN = '#34d399';
const AMBER = '#fbbf24';

const nfCfa = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const nfUsdt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

export interface PendingTransfer {
  id: string;
  created_at: string;
  sender_id: string;
  amount_usdt: number;
  amount_cfa: number;
  exchange_rate: number;
  message: string | null;
  sender_name?: string | null;
  sender_terex_id?: string | null;
}

type Step = 'overview' | 'choose_type' | 'wallet_form' | 'binance_form' | 'success';
type DeliveryType = 'wallet' | 'binance';

const NETWORKS = [
  { id: 'TRC20',   label: 'TRC20',   full: 'Tron',      hint: 'Frais bas · rapide' },
  { id: 'BEP20',   label: 'BEP20',   full: 'BNB Chain', hint: 'Frais tres bas' },
  { id: 'ERC20',   label: 'ERC20',   full: 'Ethereum',  hint: 'Frais eleves' },
  { id: 'POLYGON', label: 'Polygon', full: 'Polygon',   hint: 'Frais bas' },
];

function press(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

export function ClaimTransfer({
  transfer, onBack, onClaimed,
}: {
  transfer: PendingTransfer;
  onBack: () => void;
  onClaimed?: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>('overview');
  const [type, setType] = useState<DeliveryType | null>(null);
  const [network, setNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const senderLabel = transfer.sender_name || (transfer.sender_terex_id ? `Terex ID ${transfer.sender_terex_id}` : 'Un utilisateur');

  const glassCard: React.CSSProperties = {
    background: `linear-gradient(180deg, ${CARD_ELEVATED} 0%, ${CARD} 100%)`,
    border: `1px solid ${BORDER}`,
    borderRadius: 22,
  };

  const header = (title: string, sub: string, onBackClick: () => void) => (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: GLASS,
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderBottom: `1px solid ${BORDER}`,
      padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 20px 14px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onBackClick}
          aria-label="Retour"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: SUBTLE, border: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, background 0.2s ease',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          <ArrowLeft size={18} color={WHITE} strokeWidth={2} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: WHITE, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ color: DIM, fontSize: 12.5, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>
        </div>
      </div>
    </div>
  );

  const primaryBtn = (label: string, enabled: boolean, onClick: () => void, loading = false) => (
    <button
      onClick={onClick}
      disabled={!enabled || loading}
      style={{
        width: '100%', padding: '17px 20px', borderRadius: 18,
        background: enabled ? WHITE : SUBTLE,
        color: enabled ? '#0a0a0a' : FAINT,
        border: 'none', fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em',
        cursor: enabled && !loading ? 'pointer' : 'default',
        opacity: loading ? 0.7 : 1,
        transition: 'transform 0.15s ease',
        boxShadow: enabled ? '0 8px 24px -12px rgba(255,255,255,0.15)' : 'none',
      }}
      onPointerDown={e => { if (enabled && !loading) press(e); }}
      onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    >
      {loading ? 'Validation...' : label}
    </button>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: SUBTLE, color: WHITE,
    border: `1.5px solid ${BORDER}`, borderRadius: 16,
    padding: '15px 18px', fontSize: 14.5, fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    letterSpacing: '0.02em',
  };

  const submit = async () => {
    if (!user) return;
    const isWallet = type === 'wallet';
    if (isWallet && (!network || !address.trim())) {
      toast({ title: 'Adresse requise', description: 'Renseignez le reseau et l\'adresse.', variant: 'destructive' });
      return;
    }
    if (!isWallet && !binanceId.trim()) {
      toast({ title: 'Identifiant Binance requis', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const patch: any = {
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        delivery_type: type,
      };
      if (isWallet) {
        patch.delivery_network = network;
        patch.delivery_address = address.trim();
      } else {
        patch.delivery_binance_id = binanceId.trim();
      }

      const { error } = await (supabase as any)
        .from('p2p_transfers')
        .update(patch)
        .eq('id', transfer.id)
        .eq('receiver_id', user.id);
      if (error) throw error;

      setStep('success');
    } catch (err: any) {
      toast({ title: 'Erreur', description: err?.message || 'Impossible de valider la reception', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  // ─── STEP OVERVIEW ────────────────────────────────────────────────────
  if (step === 'overview') {
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Transfert recu', 'Choisissez ou recevoir vos USDT', onBack)}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero amount */}
          <div style={{ ...glassCard, padding: '32px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(80% 50% at 50% 0%, rgba(52,211,153,0.08) 0%, transparent 60%)',
            }} />
            <div style={{
              width: 60, height: 60, borderRadius: 18,
              background: 'rgba(52,211,153,0.14)',
              border: '1px solid rgba(52,211,153,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
            }}>
              <Wallet size={26} color={GREEN} strokeWidth={1.8} />
            </div>
            <p style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px', position: 'relative' }}>
              Vous avez recu
            </p>
            <p style={{
              color: WHITE, fontSize: isMobile ? 44 : 52, fontWeight: 300, letterSpacing: '-0.03em',
              margin: '0 0 6px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', position: 'relative',
            }}>
              {nfUsdt.format(transfer.amount_usdt)}
              <span style={{ fontSize: 18, color: FADE, marginLeft: 10, fontWeight: 500 }}>USDT</span>
            </p>
            <p style={{ color: DIM, fontSize: 13, margin: '10px 0 0', fontVariantNumeric: 'tabular-nums', position: 'relative' }}>
              equivalent {nfCfa.format(transfer.amount_cfa)} CFA
            </p>
          </div>

          {/* De la part de */}
          <div style={{ ...glassCard, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: SUBTLE, border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={18} color={DIM} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                De la part de
              </p>
              <p style={{ color: WHITE, fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>{senderLabel}</p>
            </div>
          </div>

          {/* Message */}
          {transfer.message && (
            <div style={{ ...glassCard, padding: '16px 18px' }}>
              <p style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                Message
              </p>
              <p style={{ color: WHITE, fontSize: 14, margin: 0, fontStyle: 'italic', lineHeight: 1.55 }}>
                « {transfer.message} »
              </p>
            </div>
          )}

          {/* Info */}
          <div style={{
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.18)',
            borderRadius: 14, padding: '13px 15px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <p style={{ color: 'rgba(251,191,36,0.92)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              Les fonds sont conserves brievement par Terex, le temps que vous choisissiez ou les recevoir. Aucun frais supplementaire.
            </p>
          </div>

          {primaryBtn('Choisir ou recevoir', true, () => setStep('choose_type'))}
        </div>

        <style>{`@keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  // ─── STEP CHOOSE TYPE ─────────────────────────────────────────────────
  if (step === 'choose_type') {
    const options = [
      { id: 'wallet' as const, icon: Wallet, label: 'Wallet externe', desc: 'TronLink, Trust Wallet, MetaMask, etc.', goto: 'wallet_form' as const },
      { id: 'binance' as const, icon: Building2, label: 'Compte Binance', desc: 'Envoi par email ou ID Binance', goto: 'binance_form' as const },
    ];

    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Ou recevoir ?', `${nfUsdt.format(transfer.amount_usdt)} USDT · de ${senderLabel}`, () => setStep('overview'))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(({ id, icon: Icon, label, desc, goto }) => (
            <button
              key={id}
              onClick={() => { setType(id); setStep(goto); }}
              style={{
                ...glassCard, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'transform 0.15s ease, border-color 0.2s ease',
              }}
              onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 15,
                background: SUBTLE, border: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={22} color={WHITE} strokeWidth={1.7} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: WHITE, fontSize: 15.5, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{label}</p>
                <p style={{ color: DIM, fontSize: 12.5, margin: '4px 0 0', lineHeight: 1.5 }}>{desc}</p>
              </div>
              <ChevronRight size={18} color={FADE} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP WALLET FORM ─────────────────────────────────────────────────
  if (step === 'wallet_form') {
    const ready = !!address.trim() && !!network;
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Adresse wallet', `Ou envoyer vos ${nfUsdt.format(transfer.amount_usdt)} USDT`, () => setStep('choose_type'))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Reseau */}
          <div>
            <label style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', margin: '0 4px 10px' }}>
              Reseau
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 8 }}>
              {NETWORKS.map(n => {
                const selected = network === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setNetwork(n.id)}
                    style={{
                      background: selected ? 'rgba(255,255,255,0.09)' : SUBTLE,
                      border: `1.5px solid ${selected ? 'rgba(255,255,255,0.24)' : BORDER}`,
                      borderRadius: 14, padding: '14px 12px',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'transform 0.15s ease, background 0.2s ease, border-color 0.2s ease',
                      position: 'relative',
                    }}
                    onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
                  >
                    {selected && (
                      <CheckCircle2 size={13} color={WHITE} style={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                    <p style={{ color: WHITE, fontSize: 13.5, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{n.label}</p>
                    <p style={{ color: FADE, fontSize: 10.5, margin: '2px 0 0' }}>{n.full}</p>
                    <p style={{ color: DIM, fontSize: 11, margin: '4px 0 0' }}>{n.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', margin: '0 4px 10px' }}>
              Adresse du wallet
            </label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value.trim())}
              placeholder={`Adresse ${network}`}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = SUBTLE; }}
            />
            <p style={{ color: FADE, fontSize: 11.5, margin: '10px 4px 0', lineHeight: 1.5 }}>
              Verifiez bien l'adresse. Un envoi sur le mauvais reseau ne peut pas etre recupere.
            </p>
          </div>

          {primaryBtn('Valider la reception', ready, submit, submitting)}
        </div>
      </div>
    );
  }

  // ─── STEP BINANCE FORM ────────────────────────────────────────────────
  if (step === 'binance_form') {
    const ready = !!binanceId.trim();
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Compte Binance', `Ou envoyer vos ${nfUsdt.format(transfer.amount_usdt)} USDT`, () => setStep('choose_type'))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', margin: '0 4px 10px' }}>
              Email, ID Binance ou telephone
            </label>
            <input
              value={binanceId}
              onChange={e => setBinanceId(e.target.value.trim())}
              placeholder="votre@email.com ou 12345678"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = SUBTLE; }}
            />
            <p style={{ color: FADE, fontSize: 11.5, margin: '10px 4px 0', lineHeight: 1.5 }}>
              Envoi via Binance Pay — sans frais, instantane des reception.
            </p>
          </div>

          {primaryBtn('Valider la reception', ready, submit, submitting)}
        </div>
      </div>
    );
  }

  // ─── STEP SUCCESS ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BG_DEEP, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px 40px' }}>
      <div style={{
        width: 88, height: 88, borderRadius: 26,
        background: 'rgba(52,211,153,0.14)',
        border: '1px solid rgba(52,211,153,0.28)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 26,
        animation: 'scaleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <CheckCircle2 size={42} color={GREEN} strokeWidth={1.8} />
      </div>

      <h2 style={{ color: WHITE, fontSize: 26, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.03em', textAlign: 'center' }}>
        Reception validee
      </h2>
      <p style={{ color: DIM, fontSize: 14.5, margin: '0 0 34px', textAlign: 'center', lineHeight: 1.6, maxWidth: 400 }}>
        Terex va envoyer vos <strong style={{ color: WHITE }}>{nfUsdt.format(transfer.amount_usdt)} USDT</strong> sur la destination choisie sous peu.
      </p>

      <div style={{
        ...glassCard, padding: '18px 20px', width: '100%', maxWidth: 440, marginBottom: 32,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 11,
          background: 'rgba(251,191,36,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Clock size={16} color={AMBER} strokeWidth={2} />
        </div>
        <div>
          <p style={{ color: WHITE, fontSize: 14, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            En cours de traitement
          </p>
          <p style={{ color: DIM, fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
            {type === 'wallet'
              ? `Envoi ${network} vers ${address.slice(0, 8)}...${address.slice(-6)}`
              : `Envoi Binance Pay vers ${binanceId}`
            }
          </p>
        </div>
      </div>

      <button
        onClick={() => { onClaimed?.(); onBack(); }}
        style={{
          padding: '15px 36px', borderRadius: 16,
          background: WHITE, color: '#0a0a0a',
          border: 'none', fontSize: 14.5, fontWeight: 700,
          cursor: 'pointer', transition: 'transform 0.15s ease',
          letterSpacing: '-0.01em',
          boxShadow: '0 8px 24px -12px rgba(255,255,255,0.15)',
        }}
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
      >
        Terminer
      </button>

      <style>{`@keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
