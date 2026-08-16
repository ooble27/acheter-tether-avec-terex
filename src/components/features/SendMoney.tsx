import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Copy, Check, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useToast } from '@/hooks/use-toast';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const GLASS = 'rgba(30,30,30,0.85)';
const SUBTLE = 'rgba(255,255,255,0.06)';
const WHITE = '#ffffff';
const DIM = 'rgba(255,255,255,0.4)';
const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#4ade80';

const nf = new Intl.NumberFormat('fr-FR');

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
  const { toast } = useToast();
  const { marketRateCfa } = useTerexRates(2.5);
  const rate = marketRateCfa || 0;

  const [step, setStep] = useState<Step>('recipient');
  const [identifier, setIdentifier] = useState('');
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [looking, setLooking] = useState(false);
  const [amountCfa, setAmountCfa] = useState('');
  const [sending, setSending] = useState(false);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [myTerexId, setMyTerexId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const usdtAmount = useMemo(() => {
    const cfa = parseFloat(amountCfa) || 0;
    if (!cfa || !rate) return 0;
    return Math.round((cfa / rate) * 100) / 100;
  }, [amountCfa, rate]);

  useEffect(() => {
    if (step === 'recipient') inputRef.current?.focus();
    if (step === 'amount') amountRef.current?.focus();
  }, [step]);

  // Charger son propre Terex ID
  useEffect(() => {
    if (!user) return;
    (supabase as any).from('profiles').select('terex_id').eq('id', user.id).single()
      .then(({ data }: any) => { if (data?.terex_id) setMyTerexId(data.terex_id); });
  }, [user]);

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
          amount_cfa: parseFloat(amountCfa),
          exchange_rate: rate,
          note: null,
          status: 'completed',
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

  const copyId = () => {
    if (!myTerexId) return;
    navigator.clipboard.writeText(myTerexId);
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

        <div style={{ padding: '20px 16px' }}>
          {/* Mon Terex ID */}
          {myTerexId && (
            <div style={{
              ...glassCard, padding: '16px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: DIM, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                  Mon Terex ID
                </p>
                <p style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '2px', fontFamily: 'monospace' }}>
                  {myTerexId}
                </p>
              </div>
              <button
                onClick={copyId}
                style={{
                  background: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: '10px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s ease',
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

          {/* Entrer ID ou email */}
          <p style={{ color: DIM, fontSize: 13, fontWeight: 500, margin: '0 0 10px' }}>
            Entrez le Terex ID ou l'email du destinataire
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
                padding: '0 20px', fontSize: 14, fontWeight: 700,
                cursor: identifier.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                flexShrink: 0,
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

          {/* Instructions */}
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, background: SUBTLE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
            }}>
              <Send size={26} color={DIM} strokeWidth={1.6} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
              Demandez a votre destinataire son <strong style={{ color: WHITE }}>Terex ID</strong> (8 chiffres) ou utilisez son <strong style={{ color: WHITE }}>email</strong> de connexion.
            </p>
            <p style={{ color: FAINT, fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
              Partagez votre ID ci-dessus pour recevoir des transferts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 : Montant ───
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
              Envoyer a {recipient?.full_name || 'destinataire'}
            </p>
          </div>
        </div>

        <div style={{ padding: '24px 16px' }}>
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
            <div style={{ flex: 1 }}>
              <p style={{ color: WHITE, fontSize: 14, fontWeight: 600, margin: 0 }}>{recipient?.full_name}</p>
              <p style={{ color: FAINT, fontSize: 12, margin: '2px 0 0', fontFamily: 'monospace', letterSpacing: '1px' }}>
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
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ color: DIM, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
              Montant en CFA
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
            <p style={{ color: FAINT, fontSize: 13, marginTop: 8 }}>CFA</p>
          </div>

          {/* Conversion preview */}
          {usdtAmount > 0 && (
            <div style={{
              ...glassCard, padding: '16px 20px', marginBottom: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              animation: 'fadeIn 0.25s ease',
            }}>
              <div>
                <p style={{ color: DIM, fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                  Equivalent
                </p>
                <p style={{ color: WHITE, fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>
                  {usdtAmount.toLocaleString('fr-FR')} <span style={{ color: DIM, fontSize: 14, fontWeight: 500 }}>USDT</span>
                </p>
              </div>
              <p style={{ color: FAINT, fontSize: 11.5, margin: 0, textAlign: 'right' }}>
                Taux : {rate ? nf.format(rate) : '...'} CFA
              </p>
            </div>
          )}

          {/* Quick amounts */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
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
                    borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 600,
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

          <button
            onClick={() => { if (usdtAmount > 0) setStep('confirm'); }}
            disabled={!usdtAmount}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: usdtAmount > 0 ? WHITE : SUBTLE,
              color: usdtAmount > 0 ? '#000' : 'rgba(255,255,255,0.2)',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: usdtAmount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onMouseDown={e => { if (usdtAmount > 0) press(e); }}
            onMouseUp={release}
            onTouchStart={e => { if (usdtAmount > 0) press(e); }}
            onTouchEnd={release}
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 3 : Confirmation ───
  if (step === 'confirm') {
    return (
      <div style={{ padding: '0 0 100px' }}>
        <div style={header}>
          <button onClick={() => setStep('amount')} style={backBtn}>
            <ArrowLeft size={18} color={WHITE} />
          </button>
          <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Confirmation</h1>
        </div>

        <div style={{ padding: '24px 16px' }}>
          <div style={{ ...glassCard, padding: '24px 20px', marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: SUBTLE,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                <Send size={24} color={DIM} strokeWidth={1.6} />
              </div>
              <p style={{ color: WHITE, fontSize: 32, fontWeight: 300, letterSpacing: '-1px', margin: '0 0 4px' }}>
                {nf.format(parseFloat(amountCfa))} <span style={{ fontSize: 16, color: DIM }}>CFA</span>
              </p>
              <p style={{ color: DIM, fontSize: 14, margin: 0 }}>
                = {usdtAmount.toLocaleString('fr-FR')} USDT
              </p>
            </div>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Terex ID</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{recipient?.terex_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Taux</span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(rate)} CFA/USDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: DIM, fontSize: 13 }}>Frais</span>
                <span style={{ color: GREEN, fontSize: 13, fontWeight: 600 }}>Gratuit</span>
              </div>
            </div>
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
            {sending ? 'Envoi en cours...' : 'Confirmer et envoyer'}
          </button>

          <p style={{ color: FAINT, fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Transfert instantane et gratuit entre utilisateurs Terex.
          </p>
        </div>
      </div>
    );
  }

  // ─── STEP 4 : Succes ───
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px' }}>
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
        Transfert reussi
      </h2>
      <p style={{ color: DIM, fontSize: 15, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6 }}>
        {nf.format(parseFloat(amountCfa))} CFA envoyes a {recipient?.full_name}
      </p>

      <div style={{ ...glassCard, padding: '20px', width: '100%', maxWidth: 360, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Montant</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{nf.format(parseFloat(amountCfa))} CFA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Equivalent</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{usdtAmount} USDT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: DIM, fontSize: 13 }}>Destinataire</span>
            <span style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { onBack?.(); }}
        style={{
          padding: '14px 32px', borderRadius: 14,
          background: SUBTLE, color: WHITE,
          border: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 600,
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
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
