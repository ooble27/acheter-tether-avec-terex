/**
 * ClaimTransfer — Le destinataire choisit ou recevoir ses USDT.
 *
 * Un utilisateur ayant recu un transfert P2P (`status='pending_claim'`) doit
 * indiquer ou livrer ses fonds :
 *   - Wallet externe : reseau (TRC20 / BEP20 / ERC20 / Polygon) + adresse
 *   - Binance : email / ID Binance
 *
 * A la validation, le transfert passe en `claimed`, puis Terex processe la
 * livraison (statut `processing` → `completed`).
 */
import { useState, useMemo } from 'react';
import {
  ArrowLeft, CheckCircle2, Wallet, Building2, ChevronRight,
  Clock, User, Info, ExternalLink,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BORDER = 'rgba(255,255,255,0.07)';
const GLASS = 'rgba(30,30,30,0.85)';
const SUBTLE = 'rgba(255,255,255,0.06)';
const WHITE = '#ffffff';
const DIM = 'rgba(255,255,255,0.4)';
const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#4ade80';
const AMBER = '#fbbf24';

const nf = new Intl.NumberFormat('fr-FR');

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
  { id: 'TRC20', label: 'TRC20 (Tron)', hint: 'Frais bas · rapide' },
  { id: 'BEP20', label: 'BEP20 (BNB Chain)', hint: 'Frais tres bas' },
  { id: 'ERC20', label: 'ERC20 (Ethereum)', hint: 'Frais eleves' },
  { id: 'POLYGON', label: 'Polygon', hint: 'Frais bas' },
];

function press(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

export function ClaimTransfer({
  transfer,
  onBack,
  onClaimed,
}: {
  transfer: PendingTransfer;
  onBack: () => void;
  onClaimed?: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('overview');
  const [type, setType] = useState<DeliveryType | null>(null);
  const [network, setNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const senderLabel = transfer.sender_name || (transfer.sender_terex_id ? `Terex ID ${transfer.sender_terex_id}` : 'Un utilisateur');

  const glassCard: React.CSSProperties = {
    background: GLASS,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
  };

  const header: React.CSSProperties = {
    ...glassCard, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none',
    position: 'sticky', top: 0, zIndex: 10,
    padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
    display: 'flex', alignItems: 'center', gap: 12,
  };

  const backBtn: React.CSSProperties = {
    width: 38, height: 38, borderRadius: '50%', background: SUBTLE,
    border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    color: WHITE,
    border: `1.5px solid ${BORDER}`,
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
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

  // ─── STEP OVERVIEW ───
  if (step === 'overview') {
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={onBack} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
              Transfert recu
            </h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>
              Choisissez ou recevoir vos USDT
            </p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          {/* Hero amount */}
          <div style={{ ...glassCard, padding: '24px 20px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'rgba(74,222,128,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <Wallet size={24} color={GREEN} strokeWidth={1.7} />
            </div>
            <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              Vous avez recu
            </p>
            <p style={{ color: WHITE, fontSize: 42, fontWeight: 300, letterSpacing: '-1.5px', margin: '0 0 4px', lineHeight: 1 }}>
              {nf.format(transfer.amount_usdt)} <span style={{ fontSize: 18, color: DIM, fontWeight: 500 }}>USDT</span>
            </p>
            <p style={{ color: DIM, fontSize: 13, margin: '6px 0 0' }}>
              equivalent {nf.format(transfer.amount_cfa)} CFA
            </p>
          </div>

          {/* De la part de */}
          <div style={{ ...glassCard, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: SUBTLE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={18} color={DIM} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: DIM, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
                De la part de
              </p>
              <p style={{ color: WHITE, fontSize: 15, fontWeight: 600, margin: 0 }}>{senderLabel}</p>
            </div>
          </div>

          {/* Message */}
          {transfer.message && (
            <div style={{
              ...glassCard, padding: '14px 18px', marginBottom: 16,
              background: 'rgba(255,255,255,0.03)',
            }}>
              <p style={{ color: DIM, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                Message
              </p>
              <p style={{ color: WHITE, fontSize: 14, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                « {transfer.message} »
              </p>
            </div>
          )}

          {/* Info livraison */}
          <div style={{
            background: 'rgba(251,191,36,0.06)',
            border: `1px solid rgba(251,191,36,0.15)`,
            borderRadius: 14, padding: '12px 14px', marginBottom: 24,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: 'rgba(251,191,36,0.9)', fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
              Les fonds sont conserves brievement par Terex, le temps que vous choisissiez ou les recevoir. Aucun frais supplementaire.
            </p>
          </div>

          <button
            onClick={() => setStep('choose_type')}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: WHITE, color: '#000',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            onTouchStart={press} onTouchEnd={release}
          >
            Choisir ou recevoir
          </button>
        </div>

        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // ─── STEP CHOOSE TYPE ───
  if (step === 'choose_type') {
    const options = [
      {
        id: 'wallet' as const,
        icon: Wallet,
        label: 'Wallet externe',
        desc: 'TronLink, Trust Wallet, MetaMask, etc.',
        goto: 'wallet_form' as const,
      },
      {
        id: 'binance' as const,
        icon: Building2,
        label: 'Compte Binance',
        desc: 'Envoi par email ou ID Binance',
        goto: 'binance_form' as const,
      },
    ];

    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('overview')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
              Ou recevoir ?
            </h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>
              {nf.format(transfer.amount_usdt)} USDT · de {senderLabel}
            </p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(({ id, icon: Icon, label, desc, goto }) => (
            <button
              key={id}
              onClick={() => { setType(id); setStep(goto); }}
              style={{
                ...glassCard, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              onTouchStart={press} onTouchEnd={release}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, background: SUBTLE,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} color="rgba(255,255,255,0.8)" strokeWidth={1.7} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: WHITE, fontSize: 15, fontWeight: 600, margin: 0 }}>{label}</p>
                <p style={{ color: DIM, fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>{desc}</p>
              </div>
              <ChevronRight size={17} color={FAINT} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP WALLET FORM ───
  if (step === 'wallet_form') {
    const ready = !!address.trim() && !!network;
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('choose_type')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
              Adresse wallet
            </h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>Ou envoyer vos {nf.format(transfer.amount_usdt)} USDT</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          {/* Reseau */}
          <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            Reseau
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {NETWORKS.map(n => {
              const selected = network === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setNetwork(n.id)}
                  style={{
                    background: selected ? 'rgba(255,255,255,0.08)' : SUBTLE,
                    border: `1.5px solid ${selected ? 'rgba(255,255,255,0.25)' : BORDER}`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <p style={{ color: WHITE, fontSize: 14, fontWeight: 600, margin: 0 }}>{n.label}</p>
                    <p style={{ color: DIM, fontSize: 12, margin: '2px 0 0' }}>{n.hint}</p>
                  </div>
                  {selected && <CheckCircle2 size={18} color={WHITE} />}
                </button>
              );
            })}
          </div>

          {/* Adresse */}
          <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            Adresse du wallet
          </p>
          <input
            value={address}
            onChange={e => setAddress(e.target.value.trim())}
            placeholder={`Adresse ${network}`}
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
          <p style={{ color: FAINT, fontSize: 11.5, margin: '8px 4px 24px', lineHeight: 1.5 }}>
            Verifiez bien l'adresse. Un envoi sur le mauvais reseau ne peut pas etre recupere.
          </p>

          <button
            onClick={submit}
            disabled={!ready || submitting}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: ready ? WHITE : SUBTLE,
              color: ready ? '#000' : FAINT,
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: ready && !submitting ? 'pointer' : 'default',
              opacity: submitting ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseDown={e => { if (ready && !submitting) press(e); }}
            onMouseUp={release}
            onTouchStart={e => { if (ready && !submitting) press(e); }}
            onTouchEnd={release}
          >
            {submitting ? 'Validation...' : 'Valider la reception'}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP BINANCE FORM ───
  if (step === 'binance_form') {
    const ready = !!binanceId.trim();
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('choose_type')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
              Compte Binance
            </h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>Ou envoyer vos {nf.format(transfer.amount_usdt)} USDT</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            Email, ID Binance ou telephone
          </p>
          <input
            value={binanceId}
            onChange={e => setBinanceId(e.target.value.trim())}
            placeholder="votre@email.com ou 12345678"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
          />
          <p style={{ color: FAINT, fontSize: 11.5, margin: '8px 4px 24px', lineHeight: 1.5 }}>
            Envoi via Binance Pay — sans frais, instantane des reception.
          </p>

          <button
            onClick={submit}
            disabled={!ready || submitting}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: ready ? WHITE : SUBTLE,
              color: ready ? '#000' : FAINT,
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: ready && !submitting ? 'pointer' : 'default',
              opacity: submitting ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseDown={e => { if (ready && !submitting) press(e); }}
            onMouseUp={release}
            onTouchStart={e => { if (ready && !submitting) press(e); }}
            onTouchEnd={release}
          >
            {submitting ? 'Validation...' : 'Valider la reception'}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP SUCCESS ───
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px 40px', maxWidth: 500, margin: '0 auto' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(74,222,128,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <CheckCircle2 size={40} color={GREEN} strokeWidth={1.6} />
      </div>

      <h2 style={{ color: WHITE, fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px', textAlign: 'center' }}>
        Reception validee
      </h2>
      <p style={{ color: DIM, fontSize: 15, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6, maxWidth: 380 }}>
        Terex va envoyer vos <strong style={{ color: WHITE }}>{nf.format(transfer.amount_usdt)} USDT</strong> sur la destination choisie sous peu.
      </p>

      <div style={{
        ...glassCard, padding: '18px 20px', width: '100%', maxWidth: 420, marginBottom: 20,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: 'rgba(251,191,36,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Clock size={16} color={AMBER} />
        </div>
        <div>
          <p style={{ color: WHITE, fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
            En cours de traitement
          </p>
          <p style={{ color: DIM, fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
            {type === 'wallet'
              ? `Envoi ${network} vers ${address.slice(0, 6)}...${address.slice(-6)}`
              : `Envoi Binance Pay vers ${binanceId}`
            }
          </p>
        </div>
      </div>

      <button
        onClick={() => { onClaimed?.(); onBack(); }}
        style={{
          padding: '14px 32px', borderRadius: 14,
          background: WHITE, color: '#000',
          border: 'none', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.15s ease',
        }}
        onMouseDown={press} onMouseUp={release} onMouseLeave={release}
        onTouchStart={press} onTouchEnd={release}
      >
        Retour au labo
      </button>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
