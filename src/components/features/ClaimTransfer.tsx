/**
 * ClaimTransfer — Le destinataire choisit où recevoir ses USDT.
 * Utilise le design system Terex.
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

const CARD    = '#1e1e1e';
const BORDER  = 'rgba(255,255,255,0.07)';
const BTN     = '#2d2d2d';
const ICON_BG = 'rgba(255,255,255,0.06)';
const GREEN   = '#4ade80';
const AMBER   = '#fbbf24';

const nfCfa  = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
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
  { id: 'BEP20',   label: 'BEP20',   full: 'BNB Chain', hint: 'Frais très bas' },
  { id: 'ERC20',   label: 'ERC20',   full: 'Ethereum',  hint: 'Frais élevés' },
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

  const container: React.CSSProperties = {
    maxWidth: isMobile ? '100%' : 640,
    margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: 16,
  };

  const subHeader = (title: string, sub: string, onBackClick: () => void) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 20px' }}>
      <button
        onClick={onBackClick}
        aria-label="Retour"
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: ICON_BG, border: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.15s ease',
        }}
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
      >
        <ArrowLeft size={17} color="#fff" strokeWidth={2} />
      </button>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h1>
        <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>
      </div>
    </div>
  );

  const primaryBtn = (label: string, enabled: boolean, onClick: () => void, loading = false) => (
    <button
      onClick={onClick}
      disabled={!enabled || loading}
      style={{
        width: '100%', padding: '15px 20px', borderRadius: 14,
        background: enabled ? '#fff' : ICON_BG,
        color: enabled ? '#141414' : 'rgba(255,255,255,0.3)',
        border: 'none', fontSize: 15, fontWeight: 700,
        cursor: enabled && !loading ? 'pointer' : 'default',
        opacity: loading ? 0.7 : 1,
        transition: 'transform 0.15s ease',
      }}
      onPointerDown={e => { if (enabled && !loading) press(e); }}
      onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    >
      {loading ? 'Validation...' : label}
    </button>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', color: '#fff',
    border: `1px solid ${BORDER}`, borderRadius: 12,
    padding: '14px 16px', fontSize: 14.5,
    outline: 'none', transition: 'border-color 0.2s ease',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    letterSpacing: '0.02em',
  };

  const submit = async () => {
    if (!user) return;
    const isWallet = type === 'wallet';
    if (isWallet && (!network || !address.trim())) {
      toast({ title: 'Adresse requise', description: 'Renseignez le réseau et l\'adresse.', variant: 'destructive' });
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
      toast({ title: 'Erreur', description: err?.message || 'Impossible de valider la réception', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  // ─── STEP OVERVIEW ────────────────────────────────────────────────────
  if (step === 'overview') {
    return (
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Transfert reçu', 'Choisissez où recevoir vos USDT', onBack)}

        <div style={container}>
          {/* Hero amount */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
            padding: '30px 22px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(74,222,128,0.12)',
              border: '1px solid rgba(74,222,128,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <Wallet size={24} color={GREEN} strokeWidth={1.8} />
            </div>
            <p style={{
              color: '#6b7280', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px',
            }}>
              Vous avez reçu
            </p>
            <p style={{
              color: '#fff', fontSize: isMobile ? 40 : 48, fontWeight: 300,
              letterSpacing: '-2px', margin: '0 0 6px', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {nfUsdt.format(transfer.amount_usdt)}
              <span style={{ fontSize: 17, color: '#6b7280', marginLeft: 10, fontWeight: 500 }}>USDT</span>
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: '8px 0 0', fontVariantNumeric: 'tabular-nums' }}>
              équivalent {nfCfa.format(transfer.amount_cfa)} CFA
            </p>
          </div>

          {/* De la part de */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: ICON_BG, border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={17} color="rgba(255,255,255,0.7)" strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: '#6b7280', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px',
              }}>
                De la part de
              </p>
              <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 600, margin: 0 }}>{senderLabel}</p>
            </div>
          </div>

          {/* Message */}
          {transfer.message && (
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
              padding: '14px 18px',
            }}>
              <p style={{
                color: '#6b7280', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px',
              }}>
                Message
              </p>
              <p style={{ color: '#fff', fontSize: 14, margin: 0, fontStyle: 'italic', lineHeight: 1.55 }}>
                « {transfer.message} »
              </p>
            </div>
          )}

          <div style={{
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.18)',
            borderRadius: 12, padding: '13px 15px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <p style={{ color: 'rgba(251,191,36,0.92)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              Les fonds sont conservés brièvement par Terex, le temps que vous choisissiez où les recevoir. Aucun frais supplémentaire.
            </p>
          </div>

          {primaryBtn('Choisir où recevoir', true, () => setStep('choose_type'))}
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
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Où recevoir ?', `${nfUsdt.format(transfer.amount_usdt)} USDT · de ${senderLabel}`, () => setStep('overview'))}

        <div style={{ ...container, gap: 10 }}>
          {options.map(({ id, icon: Icon, label, desc, goto }) => (
            <button
              key={id}
              onClick={() => { setType(id); setStep(goto); }}
              style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'transform 0.15s ease',
              }}
              onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: ICON_BG, border: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} color="#fff" strokeWidth={1.7} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>{label}</p>
                <p style={{ color: '#9ca3af', fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>{desc}</p>
              </div>
              <ChevronRight size={17} color="rgba(255,255,255,0.35)" />
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
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Adresse wallet', `Où envoyer vos ${nfUsdt.format(transfer.amount_usdt)} USDT`, () => setStep('choose_type'))}

        <div style={container}>
          <div>
            <label style={{
              color: '#4b5563', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', margin: '0 4px 10px',
            }}>
              Réseau
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 8 }}>
              {NETWORKS.map(n => {
                const selected = network === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setNetwork(n.id)}
                    style={{
                      background: selected ? BTN : ICON_BG,
                      border: `1px solid ${selected ? 'rgba(255,255,255,0.20)' : BORDER}`,
                      borderRadius: 12, padding: '13px 12px',
                      cursor: 'pointer', textAlign: 'left', position: 'relative',
                      transition: 'transform 0.15s ease',
                    }}
                    onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
                  >
                    {selected && (
                      <CheckCircle2 size={13} color="#fff" style={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                    <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>{n.label}</p>
                    <p style={{ color: '#6b7280', fontSize: 10.5, margin: '2px 0 0' }}>{n.full}</p>
                    <p style={{ color: '#9ca3af', fontSize: 11, margin: '4px 0 0' }}>{n.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{
              color: '#4b5563', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', margin: '0 4px 10px',
            }}>
              Adresse du wallet
            </label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value.trim())}
              placeholder={`Adresse ${network}`}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
            />
            <p style={{ color: '#6b7280', fontSize: 11.5, margin: '10px 4px 0', lineHeight: 1.5 }}>
              Vérifiez bien l'adresse. Un envoi sur le mauvais réseau ne peut pas être récupéré.
            </p>
          </div>

          {primaryBtn('Valider la réception', ready, submit, submitting)}
        </div>
      </div>
    );
  }

  // ─── STEP BINANCE FORM ────────────────────────────────────────────────
  if (step === 'binance_form') {
    const ready = !!binanceId.trim();
    return (
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Compte Binance', `Où envoyer vos ${nfUsdt.format(transfer.amount_usdt)} USDT`, () => setStep('choose_type'))}

        <div style={container}>
          <div>
            <label style={{
              color: '#4b5563', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', margin: '0 4px 10px',
            }}>
              Email, ID Binance ou téléphone
            </label>
            <input
              value={binanceId}
              onChange={e => setBinanceId(e.target.value.trim())}
              placeholder="votre@email.com ou 12345678"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
            />
            <p style={{ color: '#6b7280', fontSize: 11.5, margin: '10px 4px 0', lineHeight: 1.5 }}>
              Envoi via Binance Pay — sans frais, instantané dès réception.
            </p>
          </div>

          {primaryBtn('Valider la réception', ready, submit, submitting)}
        </div>
      </div>
    );
  }

  // ─── STEP SUCCESS ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 40px', maxWidth: 500, margin: '0 auto' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(74,222,128,0.12)',
        border: '1px solid rgba(74,222,128,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <CheckCircle2 size={40} color={GREEN} strokeWidth={1.7} />
      </div>

      <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 10px', textAlign: 'center' }}>
        Réception validée
      </h2>
      <p style={{ color: '#9ca3af', fontSize: 14.5, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6 }}>
        Terex va envoyer vos <strong style={{ color: '#fff' }}>{nfUsdt.format(transfer.amount_usdt)} USDT</strong> sur la destination choisie sous peu.
      </p>

      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: '18px 20px', width: '100%', marginBottom: 24,
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
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>
            En cours de traitement
          </p>
          <p style={{ color: '#9ca3af', fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
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
          padding: '14px 34px', borderRadius: 12,
          background: '#fff', color: '#141414',
          border: 'none', fontSize: 14.5, fontWeight: 700,
          cursor: 'pointer', transition: 'transform 0.15s ease',
        }}
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
      >
        Terminer
      </button>

      <style>{`@keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
