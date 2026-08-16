/**
 * SendMoney — Envoi P2P entre utilisateurs Terex (Apple design).
 *
 * Flow (4 etapes) :
 *   1. Destinataire (lookup par Terex ID ou email)
 *   2. Montant + message
 *   3. Confirmation
 *   4. Succes
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Copy, Check, Clock, Info, User, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTerexRates } from '@/hooks/useTerexRates';
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

const FEE_RATE = 0.01;
const FEE_MIN_CFA = 100;

interface Recipient { id: string; full_name: string | null; terex_id: string; }
type Step = 'recipient' | 'amount' | 'confirm' | 'success';

function press(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

export function SendMoney({ onBack }: { onBack?: () => void }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const { marketRateCfa } = useTerexRates(2.5);
  const isMobile = useIsMobile();
  const rate = marketRateCfa || 0;

  const [step, setStep] = useState<Step>('recipient');
  const [identifier, setIdentifier] = useState('');
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [looking, setLooking] = useState(false);
  const [amountCfa, setAmountCfa] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const cfa = parseFloat(amountCfa) || 0;
  const feeCfa = useMemo(() => cfa > 0 ? Math.max(Math.round(cfa * FEE_RATE), FEE_MIN_CFA) : 0, [cfa]);
  const totalCfa = cfa + feeCfa;
  const usdtAmount = useMemo(() => cfa && rate ? Math.round((cfa / rate) * 100) / 100 : 0, [cfa, rate]);

  useEffect(() => {
    if (step === 'recipient') setTimeout(() => inputRef.current?.focus(), 100);
    if (step === 'amount') setTimeout(() => amountRef.current?.focus(), 100);
  }, [step]);

  const lookupUser = async () => {
    const val = identifier.trim();
    if (!val) return;
    setLooking(true);
    setLookupError('');
    setRecipient(null);

    try {
      const { data, error } = await (supabase as any).rpc('lookup_user', { identifier: val });
      if (error) throw error;
      if (!data || data.length === 0) {
        setLookupError('Aucun utilisateur trouve avec cet ID ou email.');
        setLooking(false);
        return;
      }
      const found = data[0];
      if (found.id === user?.id) {
        setLookupError('Vous ne pouvez pas vous envoyer a vous-meme.');
        setLooking(false);
        return;
      }
      setRecipient(found);
      setStep('amount');
    } catch (err: any) {
      setLookupError(err?.message || 'Erreur de recherche');
    }
    setLooking(false);
  };

  const handleSend = async () => {
    if (!recipient || !amountCfa || !rate || !user) return;
    setSending(true);
    try {
      const { data, error } = await (supabase as any)
        .from('p2p_transfers')
        .insert({
          sender_id: user.id,
          receiver_id: recipient.id,
          amount_usdt: usdtAmount,
          amount_cfa: cfa,
          fee_cfa: feeCfa,
          exchange_rate: rate,
          message: message.trim() || null,
          status: 'pending_claim',
        })
        .select('id')
        .single();
      if (error) throw error;
      setTransferId(data.id);
      setStep('success');
    } catch (err: any) {
      toast({ title: 'Erreur', description: err?.message || 'Transfert impossible', variant: 'destructive' });
    }
    setSending(false);
  };

  const copyMyId = () => {
    if (!profile?.terex_id) return;
    navigator.clipboard.writeText(profile.terex_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // ─── Shared styles ────────────────────────────────────────────────────
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
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = SUBTLE; }}
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

  const primaryBtn = (label: string, enabled = true, onClick?: () => void, loading = false, extra?: React.ReactNode) => (
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
        transition: 'transform 0.15s ease, background 0.2s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: enabled ? '0 8px 24px -12px rgba(255,255,255,0.15)' : 'none',
      }}
      onPointerDown={e => { if (enabled && !loading) press(e); }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {loading ? '...' : (<>{extra}{label}</>)}
    </button>
  );

  // ─── STEP 1 : Destinataire ────────────────────────────────────────────
  if (step === 'recipient') {
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Envoyer', 'Transfert instantane entre utilisateurs Terex', onBack || (() => {}))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Mon Terex ID */}
          {profile?.terex_id && (
            <div style={{ ...glassCard, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(120% 60% at 100% 0%, rgba(255,255,255,0.06) 0%, transparent 50%)',
              }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
                    Mon Terex ID
                  </p>
                  <p style={{
                    color: WHITE, fontSize: 26, fontWeight: 700, margin: 0,
                    letterSpacing: '0.14em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>
                    {profile.terex_id}
                  </p>
                </div>
                <button
                  onClick={copyMyId}
                  aria-label="Copier"
                  style={{
                    width: 40, height: 40, borderRadius: 13,
                    background: copied ? 'rgba(52,211,153,0.14)' : SUBTLE,
                    border: `1px solid ${copied ? 'rgba(52,211,153,0.35)' : BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'transform 0.15s ease, background 0.2s ease',
                  }}
                  onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
                >
                  {copied ? <Check size={16} color={GREEN} strokeWidth={2.4} /> : <Copy size={15} color={DIM} strokeWidth={1.8} />}
                </button>
              </div>
            </div>
          )}

          {/* Recherche */}
          <div>
            <label style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', margin: '0 4px 10px' }}>
              Terex ID ou email du destinataire
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                ref={inputRef}
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setLookupError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') lookupUser(); }}
                placeholder="12345678 ou email@exemple.com"
                style={{
                  flex: 1, minWidth: 0,
                  background: SUBTLE, color: WHITE,
                  border: `1.5px solid ${BORDER}`, borderRadius: 16,
                  padding: '15px 18px', fontSize: 15, fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                  letterSpacing: '0.01em',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = SUBTLE; }}
              />
              <button
                onClick={lookupUser}
                disabled={looking || !identifier.trim()}
                style={{
                  background: identifier.trim() ? WHITE : SUBTLE,
                  color: identifier.trim() ? '#0a0a0a' : FAINT,
                  border: 'none', borderRadius: 16,
                  padding: '0 22px', fontSize: 14.5, fontWeight: 700,
                  cursor: identifier.trim() ? 'pointer' : 'default',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0, letterSpacing: '-0.01em',
                }}
                onPointerDown={e => { if (identifier.trim()) press(e); }}
                onPointerUp={release}
                onPointerLeave={release}
                onPointerCancel={release}
              >
                {looking ? '...' : 'Chercher'}
              </button>
            </div>
            {lookupError && (
              <p style={{ color: '#f87171', fontSize: 12.5, margin: '10px 4px 0', lineHeight: 1.5 }}>{lookupError}</p>
            )}
          </div>

          {/* Hint */}
          <div style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18, background: SUBTLE,
              border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <Send size={20} color={FADE} strokeWidth={1.8} />
            </div>
            <p style={{ color: DIM, fontSize: 13, fontWeight: 500, lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
              Demandez a votre destinataire son <strong style={{ color: WHITE }}>Terex ID</strong> ou utilisez son <strong style={{ color: WHITE }}>email</strong> de connexion Terex.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 : Montant ─────────────────────────────────────────────────
  if (step === 'amount') {
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Montant', `Envoi a ${recipient?.full_name || 'destinataire'}`, () => setStep('recipient'))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Recipient chip */}
          <div style={{ ...glassCard, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: SUBTLE, border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: WHITE, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {(recipient?.full_name || '?')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: WHITE, fontSize: 14.5, fontWeight: 600, margin: 0, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {recipient?.full_name}
              </p>
              <p style={{ color: FADE, fontSize: 11.5, margin: '3px 0 0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>
                ID {recipient?.terex_id}
              </p>
            </div>
            <button
              onClick={() => { setStep('recipient'); setRecipient(null); }}
              style={{
                background: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 10,
                padding: '7px 12px', fontSize: 11.5, color: DIM, cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'background 0.2s ease, transform 0.15s ease',
              }}
              onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
            >
              <RotateCcw size={11.5} /> Changer
            </button>
          </div>

          {/* Amount input hero */}
          <div style={{ ...glassCard, padding: '32px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(80% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)',
            }} />
            <p style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px', position: 'relative' }}>
              Montant a envoyer
            </p>
            <div style={{ position: 'relative' }}>
              <input
                ref={amountRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amountCfa}
                onChange={e => setAmountCfa(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: WHITE, fontSize: isMobile ? 56 : 68, fontWeight: 300,
                  letterSpacing: '-0.04em', textAlign: 'center', width: '100%', maxWidth: 320,
                  lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>
            <p style={{ color: FADE, fontSize: 13, margin: '10px 0 0', fontWeight: 500, letterSpacing: '0.05em', position: 'relative' }}>
              CFA
            </p>
          </div>

          {/* Live recap */}
          {cfa > 0 && (
            <div style={{ ...glassCard, padding: '16px 20px', animation: 'fadeIn 0.25s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: DIM, fontSize: 13 }}>Recu par le destinataire</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(cfa)} CFA · {nfUsdt.format(usdtAmount)} USDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: DIM, fontSize: 13 }}>Frais (1% · min 100 CFA)</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(feeCfa)} CFA
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ color: WHITE, fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Total a payer</span>
                <span style={{ color: WHITE, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(totalCfa)} CFA
                </span>
              </div>
            </div>
          )}

          {/* Quick amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[5000, 10000, 25000, 50000].map(v => {
              const selected = amountCfa === String(v);
              return (
                <button
                  key={v}
                  onClick={() => setAmountCfa(String(v))}
                  style={{
                    background: selected ? 'rgba(255,255,255,0.11)' : SUBTLE,
                    color: selected ? WHITE : DIM,
                    border: `1px solid ${selected ? 'rgba(255,255,255,0.22)' : BORDER}`,
                    borderRadius: 14, padding: '11px 8px', fontSize: 12.5, fontWeight: 700,
                    cursor: 'pointer', transition: 'transform 0.15s ease, background 0.2s ease',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
                  }}
                  onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
                >
                  {nfCfa.format(v)}
                </button>
              );
            })}
          </div>

          {/* Message */}
          <div>
            <label style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', margin: '0 4px 10px' }}>
              Message (optionnel)
            </label>
            <input
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 120))}
              placeholder="Un petit mot..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: SUBTLE, color: WHITE,
                border: `1.5px solid ${BORDER}`, borderRadius: 16,
                padding: '13px 16px', fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = SUBTLE; }}
            />
          </div>

          {primaryBtn('Continuer', cfa > 0, () => setStep('confirm'))}
        </div>

        <style>{`@keyframes fadeIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // ─── STEP 3 : Confirmation ────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
        {header('Confirmation', 'Verifiez les details avant d\'envoyer', () => setStep('amount'))}

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ ...glassCard, padding: '28px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(80% 40% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: SUBTLE, border: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Send size={24} color={WHITE} strokeWidth={1.8} />
              </div>
              <p style={{
                color: WHITE, fontSize: isMobile ? 36 : 42, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 6px',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>
                {nfCfa.format(cfa)}
                <span style={{ fontSize: 18, color: FADE, marginLeft: 8 }}>CFA</span>
              </p>
              <p style={{ color: DIM, fontSize: 14, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                = {nfUsdt.format(usdtAmount)} USDT au destinataire
              </p>
            </div>
          </div>

          <div style={{ ...glassCard, padding: '18px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{recipient?.full_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Terex ID</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
                  {recipient?.terex_id}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Taux applique</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(rate)} CFA/USDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Frais Terex</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{nfCfa.format(feeCfa)} CFA</span>
              </div>
              {message.trim() && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: DIM, fontSize: 13, flexShrink: 0 }}>Message</span>
                  <span style={{ color: WHITE, fontSize: 13, fontStyle: 'italic', textAlign: 'right', lineHeight: 1.4 }}>« {message} »</span>
                </div>
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: 13, borderTop: `1px solid ${BORDER}`, marginTop: 4,
              }}>
                <span style={{ color: WHITE, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Total a payer</span>
                <span style={{ color: WHITE, fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(totalCfa)} CFA
                </span>
              </div>
            </div>
          </div>

          {/* Info labo */}
          <div style={{
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.18)',
            borderRadius: 14, padding: '13px 15px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <p style={{ color: 'rgba(251,191,36,0.92)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              <strong>Mode labo :</strong> le paiement est simule. Aucun fonds reel n'est debite. Le transfert est directement pret a etre reclame par le destinataire.
            </p>
          </div>

          {primaryBtn(
            sending ? 'Envoi en cours...' : `Envoyer ${nfCfa.format(cfa)} CFA`,
            true, handleSend, sending,
            <Send size={16} strokeWidth={2.2} />
          )}
        </div>
      </div>
    );
  }

  // ─── STEP 4 : Succes ──────────────────────────────────────────────────
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
        Transfert envoye
      </h2>
      <p style={{ color: DIM, fontSize: 14.5, margin: '0 0 34px', textAlign: 'center', lineHeight: 1.6, maxWidth: 400 }}>
        {nfCfa.format(cfa)} CFA prets a etre reclames par <strong style={{ color: WHITE }}>{recipient?.full_name}</strong>.
      </p>

      <div style={{
        ...glassCard, padding: '18px 20px', width: '100%', maxWidth: 440, marginBottom: 16,
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
            En attente de reception
          </p>
          <p style={{ color: DIM, fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
            Le destinataire sera notifie et choisira ou recevoir ses USDT (wallet externe, Binance...).
          </p>
        </div>
      </div>

      <div style={{ ...glassCard, padding: '18px 20px', width: '100%', maxWidth: 440, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Reference</span>
            <span style={{ color: WHITE, fontSize: 12.5, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              {transferId?.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Montant</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {nfCfa.format(cfa)} CFA · {nfUsdt.format(usdtAmount)} USDT
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Frais</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{nfCfa.format(feeCfa)} CFA</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 440 }}>
        <button
          onClick={() => {
            setStep('recipient'); setIdentifier(''); setRecipient(null);
            setAmountCfa(''); setMessage(''); setTransferId(null);
          }}
          style={{
            flex: 1, padding: '15px', borderRadius: 16,
            background: SUBTLE, color: WHITE,
            border: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'transform 0.15s ease, background 0.2s ease',
            letterSpacing: '-0.01em',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          Nouvel envoi
        </button>
        <button
          onClick={() => onBack?.()}
          style={{
            flex: 1, padding: '15px', borderRadius: 16,
            background: WHITE, color: '#0a0a0a',
            border: 'none', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'transform 0.15s ease',
            letterSpacing: '-0.01em',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          Terminer
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
