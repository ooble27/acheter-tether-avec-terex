/**
 * SendMoney — Envoi P2P entre utilisateurs Terex.
 *
 * Utilise le design system Terex (couleurs, cards, boutons) — identique au
 * reste de la plateforme. 4 etapes : destinataire → montant → confirmation → succes.
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Copy, Check, Clock, Info, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useToast } from '@/hooks/use-toast';

const CARD    = '#1e1e1e';
const BORDER  = 'rgba(255,255,255,0.07)';
const BTN     = '#2d2d2d';
const ICON_BG = 'rgba(255,255,255,0.06)';
const GREEN   = '#4ade80';
const AMBER   = '#fbbf24';

const nfCfa  = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
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
        setLookupError('Aucun utilisateur trouvé avec cet ID ou email.');
        setLooking(false);
        return;
      }
      const found = data[0];
      if (found.id === user?.id) {
        setLookupError('Vous ne pouvez pas vous envoyer à vous-même.');
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

  const primaryBtn = (label: string, enabled = true, onClick?: () => void, loading = false, extra?: React.ReactNode) => (
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
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}
      onPointerDown={e => { if (enabled && !loading) press(e); }}
      onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    >
      {loading ? '...' : (<>{extra}{label}</>)}
    </button>
  );

  // ─── STEP 1 : Destinataire ────────────────────────────────────────────
  if (step === 'recipient') {
    return (
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Envoyer', 'Transfert instantané entre utilisateurs Terex', onBack || (() => {}))}

        <div style={container}>
          {/* Mon Terex ID */}
          {profile?.terex_id && (
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  color: '#6b7280', fontSize: 11, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px',
                }}>
                  Mon Terex ID
                </p>
                <p style={{
                  color: '#fff', fontSize: 22, fontWeight: 700, margin: 0,
                  letterSpacing: '2.5px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>
                  {profile.terex_id}
                </p>
              </div>
              <button
                onClick={copyMyId}
                aria-label="Copier"
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: copied ? 'rgba(74,222,128,0.14)' : BTN,
                  border: `1px solid ${copied ? 'rgba(74,222,128,0.30)' : 'rgba(255,255,255,0.10)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'transform 0.15s ease',
                }}
                onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
              >
                {copied ? <Check size={16} color={GREEN} strokeWidth={2.4} /> : <Copy size={15} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />}
              </button>
            </div>
          )}

          {/* Recherche */}
          <div>
            <label style={{
              color: '#4b5563', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', margin: '0 4px 10px',
            }}>
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
                  background: 'rgba(255,255,255,0.04)', color: '#fff',
                  border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: '14px 16px', fontSize: 15,
                  outline: 'none', transition: 'border-color 0.2s ease',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
              <button
                onClick={lookupUser}
                disabled={looking || !identifier.trim()}
                style={{
                  background: identifier.trim() ? '#fff' : ICON_BG,
                  color: identifier.trim() ? '#141414' : 'rgba(255,255,255,0.3)',
                  border: 'none', borderRadius: 12,
                  padding: '0 20px', fontSize: 14, fontWeight: 700,
                  cursor: identifier.trim() ? 'pointer' : 'default',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                }}
                onPointerDown={e => { if (identifier.trim()) press(e); }}
                onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
              >
                {looking ? '...' : 'Chercher'}
              </button>
            </div>
            {lookupError && (
              <p style={{ color: '#f87171', fontSize: 13, margin: '10px 4px 0' }}>{lookupError}</p>
            )}
          </div>

          {/* Hint */}
          <div style={{ textAlign: 'center', padding: '24px 16px 0' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: ICON_BG,
              border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <Send size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
            </div>
            <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
              Demandez à votre destinataire son <strong style={{ color: '#fff' }}>Terex ID</strong> ou utilisez son <strong style={{ color: '#fff' }}>email</strong> de connexion Terex.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 : Montant ─────────────────────────────────────────────────
  if (step === 'amount') {
    return (
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Montant', `Envoi à ${recipient?.full_name || 'destinataire'}`, () => setStep('recipient'))}

        <div style={container}>
          {/* Recipient chip */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
            padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: ICON_BG, border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>
                {(recipient?.full_name || '?')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {recipient?.full_name}
              </p>
              <p style={{ color: '#6b7280', fontSize: 11.5, margin: '3px 0 0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
                ID {recipient?.terex_id}
              </p>
            </div>
            <button
              onClick={() => { setStep('recipient'); setRecipient(null); }}
              style={{
                background: BTN, border: `1px solid rgba(255,255,255,0.10)`, borderRadius: 10,
                padding: '7px 12px', fontSize: 11.5, color: '#9ca3af', cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'transform 0.15s ease',
              }}
              onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
            >
              <RotateCcw size={11.5} /> Changer
            </button>
          </div>

          {/* Amount hero */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
            padding: '28px 20px', textAlign: 'center',
          }}>
            <p style={{
              color: '#6b7280', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px',
            }}>
              Montant à envoyer
            </p>
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
                color: '#fff', fontSize: isMobile ? 48 : 60, fontWeight: 300,
                letterSpacing: '-2px', textAlign: 'center', width: '100%', maxWidth: 320,
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}
            />
            <p style={{ color: '#6b7280', fontSize: 13, margin: '8px 0 0', fontWeight: 500 }}>CFA</p>
          </div>

          {/* Recap live */}
          {cfa > 0 && (
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
              padding: '16px 18px', animation: 'fadeIn 0.25s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Reçu par le destinataire</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(cfa)} CFA · {nfUsdt.format(usdtAmount)} USDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Frais (1 % · min 100 CFA)</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(feeCfa)} CFA
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ color: '#fff', fontSize: 13.5, fontWeight: 700 }}>Total à payer</span>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
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
                    background: selected ? BTN : ICON_BG,
                    color: selected ? '#fff' : '#9ca3af',
                    border: `1px solid ${selected ? 'rgba(255,255,255,0.15)' : BORDER}`,
                    borderRadius: 12, padding: '11px 8px', fontSize: 12.5, fontWeight: 700,
                    cursor: 'pointer', transition: 'transform 0.15s ease',
                    fontVariantNumeric: 'tabular-nums',
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
            <label style={{
              color: '#4b5563', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', margin: '0 4px 10px',
            }}>
              Message (optionnel)
            </label>
            <input
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 120))}
              placeholder="Un petit mot..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', color: '#fff',
                border: `1px solid ${BORDER}`, borderRadius: 12,
                padding: '13px 16px', fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
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
      <div style={{ paddingBottom: 100 }}>
        {subHeader('Confirmation', 'Vérifiez les détails avant d\'envoyer', () => setStep('amount'))}

        <div style={container}>
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
            padding: '26px 22px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: ICON_BG,
              border: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <Send size={22} color="#fff" strokeWidth={1.8} />
            </div>
            <p style={{
              color: '#fff', fontSize: isMobile ? 32 : 38, fontWeight: 300,
              letterSpacing: '-1.5px', margin: '0 0 4px',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>
              {nfCfa.format(cfa)}
              <span style={{ fontSize: 17, color: '#6b7280', marginLeft: 8 }}>CFA</span>
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13.5, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              = {nfUsdt.format(usdtAmount)} USDT au destinataire
            </p>
          </div>

          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Destinataire</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{recipient?.full_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Terex ID</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
                  {recipient?.terex_id}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Taux appliqué</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(rate)} CFA/USDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Frais Terex</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{nfCfa.format(feeCfa)} CFA</span>
              </div>
              {message.trim() && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: '#9ca3af', fontSize: 13, flexShrink: 0 }}>Message</span>
                  <span style={{ color: '#fff', fontSize: 13, fontStyle: 'italic', textAlign: 'right', lineHeight: 1.4 }}>« {message} »</span>
                </div>
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: 13, borderTop: `1px solid ${BORDER}`, marginTop: 4,
              }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Total à payer</span>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {nfCfa.format(totalCfa)} CFA
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.18)',
            borderRadius: 12, padding: '13px 15px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <p style={{ color: 'rgba(251,191,36,0.92)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              <strong>Mode test :</strong> le paiement est simulé. Aucun fonds réel n'est débité. Le transfert est directement prêt à être réclamé par le destinataire.
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
        Transfert envoyé
      </h2>
      <p style={{ color: '#9ca3af', fontSize: 14.5, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6 }}>
        {nfCfa.format(cfa)} CFA prêts à être réclamés par <strong style={{ color: '#fff' }}>{recipient?.full_name}</strong>.
      </p>

      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: '18px 20px', width: '100%', marginBottom: 14,
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
            En attente de réception
          </p>
          <p style={{ color: '#9ca3af', fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
            Le destinataire sera notifié et choisira où recevoir ses USDT (wallet externe, Binance...).
          </p>
        </div>
      </div>

      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: '18px 20px', width: '100%', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>Référence</span>
            <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              {transferId?.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>Destinataire</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>Montant</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {nfCfa.format(cfa)} CFA · {nfUsdt.format(usdtAmount)} USDT
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>Frais</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{nfCfa.format(feeCfa)} CFA</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        <button
          onClick={() => {
            setStep('recipient'); setIdentifier(''); setRecipient(null);
            setAmountCfa(''); setMessage(''); setTransferId(null);
          }}
          style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: BTN, color: '#fff',
            border: `1px solid rgba(255,255,255,0.10)`, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'transform 0.15s ease',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          Nouvel envoi
        </button>
        <button
          onClick={() => onBack?.()}
          style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#fff', color: '#141414',
            border: 'none', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'transform 0.15s ease',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          Terminer
        </button>
      </div>

      <style>{`@keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
