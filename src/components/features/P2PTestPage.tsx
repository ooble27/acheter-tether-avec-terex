/**
 * P2PTestPage — Point d'entree du transfert P2P.
 *
 * Vue "prod-ready" (pas de wrapper labo) — c'est ainsi qu'elle sera
 * affichee dans le dashboard grand public plus tard. Pour l'instant,
 * seuls les admins y accedent via Profil → Test → Transfert P2P.
 *
 * Contient :
 *   - Bandeau des transferts en attente de reception (cote receveur)
 *   - Bouton principal "Envoyer"
 *   - Ouvre SendMoney / ClaimTransfer en plein ecran
 */
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Send, ChevronRight, Inbox, Wallet, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { SendMoney } from './SendMoney';
import { ClaimTransfer, PendingTransfer } from './ClaimTransfer';

const BG = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.07)';
const GLASS = 'rgba(30,30,30,0.85)';
const SUBTLE = 'rgba(255,255,255,0.06)';
const WHITE = '#ffffff';
const DIM = 'rgba(255,255,255,0.4)';
const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#4ade80';
const AMBER = '#fbbf24';

const nf = new Intl.NumberFormat('fr-FR');

function press(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

export function P2PTestPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const [mode, setMode] = useState<'home' | 'send' | 'claim'>('home');
  const [claiming, setClaiming] = useState<PendingTransfer | null>(null);
  const [pending, setPending] = useState<PendingTransfer[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;

    // Transferts a reclamer
    const { data: transfers } = await (supabase as any)
      .from('p2p_transfers')
      .select('id, created_at, sender_id, amount_usdt, amount_cfa, exchange_rate, message')
      .eq('receiver_id', user.id)
      .eq('status', 'pending_claim')
      .order('created_at', { ascending: false });

    if (transfers && transfers.length > 0) {
      const senderIds = [...new Set(transfers.map((t: any) => t.sender_id))];
      const { data: senders } = await (supabase as any)
        .from('profiles')
        .select('id, full_name, terex_id')
        .in('id', senderIds);
      const senderMap = new Map((senders || []).map((s: any) => [s.id, s]));
      setPending(transfers.map((t: any) => {
        const s = senderMap.get(t.sender_id) as any;
        return { ...t, sender_name: s?.full_name || null, sender_terex_id: s?.terex_id || null };
      }));
    } else {
      setPending([]);
    }

    // Historique — tous les transferts recents (envoyes ou recus)
    const { data: recent } = await (supabase as any)
      .from('p2p_transfers')
      .select('id, created_at, sender_id, receiver_id, amount_usdt, amount_cfa, status')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory(recent || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

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

  const backBtn: React.CSSProperties = {
    width: 38, height: 38, borderRadius: '50%', background: SUBTLE,
    border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  };

  // Sous-vues plein-ecran
  if (mode === 'send') {
    return <SendMoney onBack={() => { setMode('home'); loadData(); }} />;
  }
  if (mode === 'claim' && claiming) {
    return (
      <ClaimTransfer
        transfer={claiming}
        onBack={() => { setMode('home'); setClaiming(null); loadData(); }}
      />
    );
  }

  const statusLabel = (s: string) => ({
    pending_payment: 'En attente paiement',
    pending_claim: 'A reclamer',
    claimed: 'Reclame',
    processing: 'En cours de livraison',
    completed: 'Termine',
    cancelled: 'Annule',
    refunded: 'Rembourse',
  } as any)[s] || s;

  const statusColor = (s: string) => {
    if (s === 'completed') return GREEN;
    if (s === 'pending_claim' || s === 'claimed' || s === 'processing') return AMBER;
    if (s === 'cancelled' || s === 'refunded') return '#f87171';
    return DIM;
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '0 0 100px' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: GLASS,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: `1px solid ${BORDER}`,
        padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={backBtn}>
          <ArrowLeft size={18} color={WHITE} />
        </button>
        <div>
          <h1 style={{ color: WHITE, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
            Transfert P2P
          </h1>
          <p style={{ color: DIM, fontSize: 12, margin: '1px 0 0' }}>
            Envoyer et recevoir des USDT entre utilisateurs Terex
          </p>
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Mon Terex ID */}
        {profile?.terex_id && (
          <div style={{
            ...glassCard, padding: '18px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: DIM, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                Mon Terex ID
              </p>
              <p style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '3px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                {profile.terex_id}
              </p>
            </div>
            <button
              onClick={copyMyId}
              style={{
                background: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 12,
                padding: '10px 14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'transform 0.15s ease', flexShrink: 0,
              }}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            >
              {copied ? <Check size={15} color={GREEN} /> : <Copy size={15} color={DIM} />}
              <span style={{ color: copied ? GREEN : DIM, fontSize: 12, fontWeight: 600 }}>
                {copied ? 'Copie' : 'Copier'}
              </span>
            </button>
          </div>
        )}

        {/* Transferts en attente de reception (badge principal) */}
        {pending.length > 0 && (
          <div style={{
            background: 'rgba(251,191,36,0.06)',
            border: `1px solid rgba(251,191,36,0.18)`,
            borderRadius: 20, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: 'rgba(251,191,36,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Inbox size={16} color={AMBER} />
              </div>
              <div>
                <p style={{ color: WHITE, fontSize: 14, fontWeight: 700, margin: 0 }}>
                  {pending.length} transfert{pending.length > 1 ? 's' : ''} a reclamer
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0' }}>
                  Choisissez ou recevoir vos USDT
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setClaiming(t); setMode('claim'); }}
                  style={{
                    background: 'rgba(0,0,0,0.35)', border: `1px solid rgba(255,255,255,0.06)`,
                    borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseDown={press} onMouseUp={release} onMouseLeave={release}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: WHITE, fontSize: 14, fontWeight: 700, margin: 0 }}>
                      {nf.format(t.amount_usdt)} USDT
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      de {t.sender_name || `Terex ID ${t.sender_terex_id || '?'}`}
                      {t.message ? ' · ' + t.message : ''}
                    </p>
                  </div>
                  <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action principale : envoyer */}
        <button
          onClick={() => setMode('send')}
          style={{
            ...glassCard,
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
            cursor: 'pointer', width: '100%',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
        >
          <div style={{
            width: 46, height: 46, borderRadius: 14, background: SUBTLE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Send size={20} color={WHITE} strokeWidth={1.7} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: WHITE, fontSize: 15, fontWeight: 700, margin: 0 }}>Envoyer des USDT</p>
            <p style={{ color: DIM, fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>
              A un autre utilisateur via son Terex ID ou email
            </p>
          </div>
          <ChevronRight size={17} color={FAINT} />
        </button>

        {/* Historique */}
        {history.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <p style={{ color: DIM, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 4px 10px' }}>
              Historique recent
            </p>
            <div style={{ ...glassCard, overflow: 'hidden' }}>
              {history.map((t: any, i: number) => {
                const isSender = t.sender_id === user?.id;
                return (
                  <div
                    key={t.id}
                    style={{
                      padding: '14px 16px',
                      borderBottom: i < history.length - 1 ? `1px solid ${BORDER}` : 'none',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 11, background: SUBTLE,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isSender ? (
                        <Send size={14} color={DIM} />
                      ) : (
                        <Wallet size={14} color={GREEN} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: WHITE, fontSize: 13.5, fontWeight: 600, margin: 0 }}>
                        {isSender ? 'Envoye' : 'Recu'} · {nf.format(t.amount_usdt)} USDT
                      </p>
                      <p style={{ color: DIM, fontSize: 11.5, margin: '2px 0 0' }}>
                        {new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{
                      color: statusColor(t.status),
                      fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {statusLabel(t.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vide */}
        {history.length === 0 && pending.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 20px 0' }}>
            <p style={{ color: DIM, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              Aucun transfert pour l'instant.<br />Envoyez-en un pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
