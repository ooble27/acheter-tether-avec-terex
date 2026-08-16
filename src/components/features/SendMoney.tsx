/**
 * SendMoney — Envoi P2P entre utilisateurs Terex.
 *
 * Workflow (labo, isole de la prod) :
 *   1. Sender entre le Terex ID ou email du destinataire → RPC lookup_user
 *   2. Sender entre le montant + note optionnelle → recap avec frais 1% (min 100 CFA)
 *   3. Sender confirme → paiement (simulation en labo) → transfert cree 'pending_claim'
 *   4. Le destinataire recoit une notification et choisit ou deposer ses USDT
 *
 * Terex ne detient jamais les fonds long-terme : chaque transfert est un
 * mini-achat cote sender + une livraison cote receveur.
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Copy, Check, Clock, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTerexRates } from '@/hooks/useTerexRates';
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

const FEE_RATE = 0.01;       // 1 %
const FEE_MIN_CFA = 100;     // Minimum 100 CFA

interface Recipient { id: string; full_name: string | null; terex_id: string; }
type Step = 'recipient' | 'amount' | 'confirm' | 'success';

function press(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

export function SendMoney({ onBack }: { onBack?: () => void }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const { marketRateCfa } = useTerexRates(2.5);
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
  const feeCfa = useMemo(() => Math.max(Math.round(cfa * FEE_RATE), cfa > 0 ? FEE_MIN_CFA : 0), [cfa]);
  const totalCfa = cfa + feeCfa;
  const usdtAmount = useMemo(() => {
    if (!cfa || !rate) return 0;
    return Math.round((cfa / rate) * 100) / 100;
  }, [cfa, rate]);

  useEffect(() => {
    if (step === 'recipient') inputRef.current?.focus();
    if (step === 'amount') amountRef.current?.focus();
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
          status: 'pending_claim',   // labo : on considere le paiement recu (simulation)
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
    setTimeout(() => setCopied(false), 2000);
  };

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

  // ─── STEP 1 : Destinataire ───
  if (step === 'recipient') {
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          {onBack && (
            <button onClick={onBack} style={backBtn}>
              <ArrowLeft size={18} color={WHITE} />
            </button>
          )}
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Envoyer</h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>Transfert entre utilisateurs Terex</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          {/* Mon Terex ID */}
          {profile?.terex_id && (
            <div style={{
              ...glassCard, padding: '16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: DIM, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                  Mon Terex ID
                </p>
                <p style={{ color: WHITE, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '2px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  {profile.terex_id}
                </p>
              </div>
              <button
                onClick={copyMyId}
                style={{
                  background: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: '10px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s ease', flexShrink: 0,
                }}
                onMouseDown={press} onMouseUp={release} onMouseLeave={release}
                onTouchStart={press} onTouchEnd={release}
              >
                {copied ? <Check size={15} color={GREEN} /> : <Copy size={15} color={DIM} />}
                <span style={{ color: copied ? GREEN : DIM, fontSize: 12, fontWeight: 600 }}>
                  {copied ? 'Copie' : 'Copier'}
                </span>
              </button>
            </div>
          )}

          {/* Recherche destinataire */}
          <p style={{ color: DIM, fontSize: 13, fontWeight: 500, margin: '0 0 10px' }}>
            Terex ID ou email du destinataire
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              ref={inputRef}
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setLookupError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') lookupUser(); }}
              placeholder="Ex : 12345678 ou email@exemple.com"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                color: WHITE,
                border: `1.5px solid ${BORDER}`,
                borderRadius: 14,
                padding: '14px 16px',
                fontSize: 15,
                fontWeight: 500,
                outline: 'none',
                transition: 'border-color 0.2s ease',
                letterSpacing: '0.02em',
                minWidth: 0,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
            />
            <button
              onClick={lookupUser}
              disabled={looking || !identifier.trim()}
              style={{
                background: identifier.trim() ? WHITE : SUBTLE,
                color: identifier.trim() ? '#000' : FAINT,
                border: 'none', borderRadius: 14,
                padding: '0 22px', fontSize: 14, fontWeight: 700,
                cursor: identifier.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s ease', flexShrink: 0,
              }}
              onMouseDown={e => { if (identifier.trim()) press(e); }}
              onMouseUp={release}
              onTouchStart={e => { if (identifier.trim()) press(e); }}
              onTouchEnd={release}
            >
              {looking ? '...' : 'OK'}
            </button>
          </div>

          {lookupError && (
            <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 16px', padding: '0 4px' }}>{lookupError}</p>
          )}

          <div style={{ textAlign: 'center', padding: '32px 16px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18, background: SUBTLE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <Send size={22} color={DIM} strokeWidth={1.6} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
              Demandez a votre destinataire son <strong style={{ color: WHITE }}>Terex ID</strong> ou utilisez son <strong style={{ color: WHITE }}>email</strong> de connexion.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 : Montant + message ───
  if (step === 'amount') {
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('recipient')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <div>
            <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Montant</h1>
            <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>
              Envoi a {recipient?.full_name || 'destinataire'}
            </p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          {/* Recipient chip */}
          <div style={{ ...glassCard, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: SUBTLE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: WHITE, fontSize: 16, fontWeight: 700 }}>
                {(recipient?.full_name || '?')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: WHITE, fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {recipient?.full_name}
              </p>
              <p style={{ color: FAINT, fontSize: 12, margin: '2px 0 0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '1px' }}>
                ID {recipient?.terex_id}
              </p>
            </div>
            <button onClick={() => { setStep('recipient'); setRecipient(null); }} style={{
              background: SUBTLE, border: 'none', borderRadius: 8,
              padding: '6px 10px', fontSize: 12, color: DIM, cursor: 'pointer', fontWeight: 600,
            }}>
              Changer
            </button>
          </div>

          {/* Amount input */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
              Montant a envoyer
            </p>
            <input
              ref={amountRef}
              type="number"
              inputMode="numeric"
              value={amountCfa}
              onChange={e => setAmountCfa(e.target.value)}
              placeholder="0"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: WHITE, fontSize: 52, fontWeight: 300, letterSpacing: '-2px',
                textAlign: 'center', width: '100%', maxWidth: 280, lineHeight: 1,
              }}
            />
            <p style={{ color: FAINT, fontSize: 13, marginTop: 6 }}>CFA</p>
          </div>

          {/* Frais + total (recap live) */}
          {cfa > 0 && (
            <div style={{
              ...glassCard, padding: '14px 18px', marginBottom: 20,
              animation: 'fadeIn 0.25s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: DIM, fontSize: 13 }}>Envoye au destinataire</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>
                  {nf.format(cfa)} CFA · {usdtAmount} USDT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: DIM, fontSize: 13 }}>Frais Terex (1 % · min 100 CFA)</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(feeCfa)} CFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>Total a payer</span>
                <span style={{ color: WHITE, fontSize: 15, fontWeight: 700 }}>{nf.format(totalCfa)} CFA</span>
              </div>
            </div>
          )}

          {/* Quick amounts */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {[5000, 10000, 25000, 50000].map(v => {
              const selected = amountCfa === String(v);
              return (
                <button
                  key={v}
                  onClick={() => setAmountCfa(String(v))}
                  style={{
                    background: selected ? 'rgba(255,255,255,0.12)' : SUBTLE,
                    color: selected ? WHITE : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${selected ? 'rgba(255,255,255,0.2)' : BORDER}`,
                    borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseDown={press} onMouseUp={release} onMouseLeave={release}
                  onTouchStart={press} onTouchEnd={release}
                >
                  {nf.format(v)}
                </button>
              );
            })}
          </div>

          {/* Message optionnel */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
              Message (optionnel)
            </p>
            <input
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 120))}
              placeholder="Un petit mot pour le destinataire..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                color: WHITE,
                border: `1.5px solid ${BORDER}`,
                borderRadius: 14,
                padding: '12px 14px',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
            />
          </div>

          <button
            onClick={() => { if (cfa > 0) setStep('confirm'); }}
            disabled={!cfa}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: cfa > 0 ? WHITE : SUBTLE,
              color: cfa > 0 ? '#000' : 'rgba(255,255,255,0.2)',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: cfa > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onMouseDown={e => { if (cfa > 0) press(e); }}
            onMouseUp={release}
            onTouchStart={e => { if (cfa > 0) press(e); }}
            onTouchEnd={release}
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 3 : Confirmation & paiement ───
  if (step === 'confirm') {
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('amount')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Confirmation</h1>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ ...glassCard, padding: '24px 20px', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: SUBTLE,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                <Send size={22} color={DIM} strokeWidth={1.6} />
              </div>
              <p style={{ color: WHITE, fontSize: 32, fontWeight: 300, letterSpacing: '-1px', margin: '0 0 4px' }}>
                {nf.format(cfa)} <span style={{ fontSize: 16, color: DIM }}>CFA</span>
              </p>
              <p style={{ color: DIM, fontSize: 14, margin: 0 }}>
                = {usdtAmount} USDT au destinataire
              </p>
            </div>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Terex ID</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{recipient?.terex_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Taux applique</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(rate)} CFA/USDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Frais Terex</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(feeCfa)} CFA</span>
              </div>
              {message.trim() && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: DIM, fontSize: 13, flexShrink: 0 }}>Message</span>
                  <span style={{ color: WHITE, fontSize: 13, fontStyle: 'italic', textAlign: 'right' }}>{message}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
                <span style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>Total a payer</span>
                <span style={{ color: WHITE, fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>{nf.format(totalCfa)} CFA</span>
              </div>
            </div>
          </div>

          {/* Banniere labo — c'est une simulation, pas de vrai paiement */}
          <div style={{
            background: 'rgba(251,191,36,0.06)',
            border: `1px solid rgba(251,191,36,0.15)`,
            borderRadius: 14, padding: '12px 14px', marginBottom: 20,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Info size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: 'rgba(251,191,36,0.9)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              <strong>Mode labo :</strong> le paiement est simule. Aucun fonds reel n'est debite. Le transfert est directement pret a etre reclame par le destinataire.
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: WHITE, color: '#000',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: sending ? 'wait' : 'pointer',
              opacity: sending ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
            onMouseDown={e => { if (!sending) press(e); }}
            onMouseUp={release}
            onTouchStart={e => { if (!sending) press(e); }}
            onTouchEnd={release}
          >
            <Send size={18} strokeWidth={2} />
            {sending ? 'Envoi en cours...' : `Envoyer ${nf.format(cfa)} CFA`}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 4 : Succes — sender voit que le transfert attend d'etre reclame ───
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
        Transfert envoye
      </h2>
      <p style={{ color: DIM, fontSize: 15, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6, maxWidth: 380 }}>
        {nf.format(cfa)} CFA prets a etre reclames par <strong style={{ color: WHITE }}>{recipient?.full_name}</strong>.
      </p>

      {/* Etape suivante — le destinataire doit reclamer */}
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
            En attente de reception
          </p>
          <p style={{ color: DIM, fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>
            Le destinataire sera notifie et choisira ou recevoir ses USDT (wallet externe, Binance...).
          </p>
        </div>
      </div>

      <div style={{ ...glassCard, padding: '18px 20px', width: '100%', maxWidth: 420, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Reference</span>
            <span style={{ color: WHITE, fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              {transferId?.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Montant</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(cfa)} CFA · {usdtAmount} USDT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Frais</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(feeCfa)} CFA</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 420 }}>
        <button
          onClick={() => {
            // Reset et retour
            setStep('recipient');
            setIdentifier(''); setRecipient(null); setAmountCfa(''); setMessage(''); setTransferId(null);
          }}
          style={{
            flex: 1, padding: '14px', borderRadius: 14,
            background: SUBTLE, color: WHITE,
            border: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          onTouchStart={press} onTouchEnd={release}
        >
          Nouvel envoi
        </button>
        <button
          onClick={() => { onBack?.(); }}
          style={{
            flex: 1, padding: '14px', borderRadius: 14,
            background: WHITE, color: '#000',
            border: 'none', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          onTouchStart={press} onTouchEnd={release}
        >
          Terminer
        </button>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
