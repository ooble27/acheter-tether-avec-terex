import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Send, CheckCircle2, ArrowUpRight, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useToast } from '@/hooks/use-toast';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const GLASS = 'rgba(30,30,30,0.85)';
const ACCENT = '#1B6EF3';

const nf = new Intl.NumberFormat('fr-FR');

interface Recipient {
  id: string;
  full_name: string | null;
  phone: string | null;
  email?: string;
}

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

export function SendMoney({ onBack }: { onBack?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexRateCfa, marketRateCfa } = useTerexRates(2.5);
  const rate = marketRateCfa || 0;

  const [step, setStep] = useState<Step>('recipient');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipient[]>([]);
  const [searching, setSearching] = useState(false);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amountCfa, setAmountCfa] = useState('');
  const [sending, setSending] = useState(false);
  const [transferId, setTransferId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const usdtAmount = useMemo(() => {
    const cfa = parseFloat(amountCfa) || 0;
    if (!cfa || !rate) return 0;
    return Math.round((cfa / rate) * 100) / 100;
  }, [amountCfa, rate]);

  useEffect(() => {
    if (step === 'recipient') inputRef.current?.focus();
    if (step === 'amount') amountRef.current?.focus();
  }, [step]);

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const term = `%${q}%`;
    const { data } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, phone')
      .or(`full_name.ilike.${term},phone.ilike.${term}`)
      .neq('id', user?.id)
      .limit(8);
    setResults((data as Recipient[]) || []);
    setSearching(false);
  }, [user?.id]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchUsers(val), 300);
  };

  const selectRecipient = (r: Recipient) => {
    setRecipient(r);
    setStep('amount');
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

  // -- Shared styles --
  const glassCard: React.CSSProperties = {
    background: GLASS,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    border: `1.5px solid ${BORDER}`,
    borderRadius: 14,
    padding: '14px 16px 14px 44px',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    letterSpacing: '-0.01em',
  };

  // -- STEP 1: Recipient --
  if (step === 'recipient') {
    return (
      <div style={{ minHeight: '100vh', background: BG, padding: '0 0 100px' }}>
        {/* Header translucent */}
        <div style={{
          ...glassCard, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none',
          position: 'sticky', top: 0, zIndex: 10,
          padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {onBack && (
            <button onClick={onBack} style={{
              width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
          )}
          <div>
            <h1 style={{ color: '#fff', fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Envoyer</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '1px 0 0' }}>Transfert instantane entre utilisateurs Terex</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {/* Search field */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder="Nom ou telephone"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}25`; }}
              onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); }} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={13} color="rgba(255,255,255,0.6)" />
              </button>
            )}
          </div>

          {/* Results */}
          {searching && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Recherche...</p>}

          {!searching && results.length === 0 && query.length >= 2 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <User size={24} color="rgba(255,255,255,0.25)" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Aucun utilisateur trouve</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 }}>Verifiez le nom ou le numero de telephone</p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => selectRecipient(r)}
                  style={{
                    ...glassCard,
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                  onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ color: ACCENT, fontSize: 17, fontWeight: 700 }}>
                      {(r.full_name || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>
                      {r.full_name || 'Utilisateur'}
                    </p>
                    {r.phone && (
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '2px 0 0' }}>{r.phone}</p>
                    )}
                  </div>
                  <ArrowUpRight size={16} color="rgba(255,255,255,0.2)" />
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT}05)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
              }}>
                <Send size={26} color={ACCENT} strokeWidth={1.6} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, lineHeight: 1.6 }}>
                Cherchez un utilisateur Terex<br />par nom ou numero de telephone
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -- STEP 2: Amount --
  if (step === 'amount') {
    return (
      <div style={{ minHeight: '100vh', background: BG, padding: '0 0 100px' }}>
        <div style={{
          ...glassCard, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none',
          position: 'sticky', top: 0, zIndex: 10,
          padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={() => setStep('recipient')} style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Montant</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '1px 0 0' }}>
              Envoyer a {recipient?.full_name || 'destinataire'}
            </p>
          </div>
        </div>

        <div style={{ padding: '24px 16px' }}>
          {/* Recipient chip */}
          <div style={{
            ...glassCard, padding: '12px 16px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: ACCENT, fontSize: 16, fontWeight: 700 }}>
                {(recipient?.full_name || '?')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{recipient?.full_name}</p>
              {recipient?.phone && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '1px 0 0' }}>{recipient.phone}</p>}
            </div>
            <button onClick={() => setStep('recipient')} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
              padding: '6px 10px', fontSize: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600,
            }}>
              Changer
            </button>
          </div>

          {/* Amount input -- big, centered, Apple style */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
              Montant en CFA
            </p>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
              <input
                ref={amountRef}
                type="number"
                inputMode="numeric"
                value={amountCfa}
                onChange={e => setAmountCfa(e.target.value)}
                placeholder="0"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontSize: 52, fontWeight: 300, letterSpacing: '-2px',
                  textAlign: 'center', width: '100%', maxWidth: 280,
                  lineHeight: 1,
                }}
              />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 8 }}>CFA</p>
          </div>

          {/* Conversion preview */}
          {usdtAmount > 0 && (
            <div style={{
              ...glassCard, padding: '16px 20px', marginBottom: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              animation: 'fadeIn 0.25s ease',
            }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                  Equivalent
                </p>
                <p style={{ color: '#fff', fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>
                  {usdtAmount.toLocaleString('fr-FR')} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}>USDT</span>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11.5, margin: 0 }}>
                  Taux : {rate ? nf.format(rate) : '...'} CFA
                </p>
              </div>
            </div>
          )}

          {/* Quick amounts */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            {[5000, 10000, 25000, 50000].map(v => (
              <button
                key={v}
                onClick={() => setAmountCfa(String(v))}
                style={{
                  background: amountCfa === String(v) ? ACCENT : 'rgba(255,255,255,0.04)',
                  color: amountCfa === String(v) ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${amountCfa === String(v) ? ACCENT : BORDER}`,
                  borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
                onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
                onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                {nf.format(v)}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => { if (usdtAmount > 0) setStep('confirm'); }}
            disabled={!usdtAmount}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: usdtAmount > 0 ? ACCENT : 'rgba(255,255,255,0.04)',
              color: usdtAmount > 0 ? '#fff' : 'rgba(255,255,255,0.2)',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: usdtAmount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.02em',
            }}
            onMouseDown={e => { if (usdtAmount > 0) (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { if (usdtAmount > 0) (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // -- STEP 3: Confirm --
  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: BG, padding: '0 0 100px' }}>
        <div style={{
          ...glassCard, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none',
          position: 'sticky', top: 0, zIndex: 10,
          padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={() => setStep('amount')} style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Confirmation</h1>
        </div>

        <div style={{ padding: '24px 16px' }}>
          {/* Summary card */}
          <div style={{ ...glassCard, padding: '24px 20px', marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                <Send size={24} color={ACCENT} strokeWidth={1.6} />
              </div>
              <p style={{ color: '#fff', fontSize: 32, fontWeight: 300, letterSpacing: '-1px', margin: '0 0 4px' }}>
                {nf.format(parseFloat(amountCfa))} <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>CFA</span>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
                = {usdtAmount.toLocaleString('fr-FR')} USDT
              </p>
            </div>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Destinataire</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
              </div>
              {recipient?.phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Telephone</span>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{recipient.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Taux</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{nf.format(rate)} CFA/USDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Frais</span>
                <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>Gratuit</span>
              </div>
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={sending}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: ACCENT, color: '#fff',
              border: 'none', fontSize: 16, fontWeight: 700,
              cursor: sending ? 'wait' : 'pointer',
              opacity: sending ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              letterSpacing: '-0.02em',
            }}
            onMouseDown={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            <Send size={18} strokeWidth={2} />
            {sending ? 'Envoi en cours...' : 'Confirmer et envoyer'}
          </button>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Le transfert est instantane et gratuit entre utilisateurs Terex.
          </p>
        </div>
      </div>
    );
  }

  // -- STEP 4: Success --
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(74,222,128,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <CheckCircle2 size={40} color="#4ade80" strokeWidth={1.6} />
      </div>

      <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px', textAlign: 'center' }}>
        Transfert reussi
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6 }}>
        {nf.format(parseFloat(amountCfa))} CFA envoyes a {recipient?.full_name}
      </p>

      <div style={{ ...glassCard, padding: '20px', width: '100%', maxWidth: 360, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Montant</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{nf.format(parseFloat(amountCfa))} CFA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Equivalent</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{usdtAmount} USDT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Destinataire</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{recipient?.full_name}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { onBack?.(); }}
        style={{
          padding: '14px 32px', borderRadius: 14,
          background: 'rgba(255,255,255,0.06)', color: '#fff',
          border: `1px solid ${BORDER}`, fontSize: 15, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.15s ease',
          letterSpacing: '-0.01em',
        }}
        onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
        onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
        onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        Retour a l'accueil
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
