/**
 * P2PTestPage — Envoi/reception USDT entre utilisateurs Terex.
 *
 * Design principles applied (Apple):
 *   - Translucent glass header with backdrop-filter (§12 Materials & depth)
 *   - Continuous scale(0.97) feedback on pointer-down (§1 Response)
 *   - Typography with size-specific tracking (§15) — tight on the big Terex ID
 *   - Hierarchy through weight + size, not decoration
 *   - Single-column mobile / two-column desktop layout — no wasted space
 *   - Distinct visual language for Sent vs Received (color, icon direction)
 *   - History grouped by day (Aujourd'hui / Hier / date)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Send, ChevronRight, Inbox, Copy, Check,
  ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { SendMoney } from './SendMoney';
import { ClaimTransfer, PendingTransfer } from './ClaimTransfer';

const BG_DEEP = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_HOVER = 'rgba(255,255,255,0.14)';
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
const RED = '#f87171';

const nfCfa = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const nfUsdt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

function press(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
}
function release(e: React.PointerEvent | React.MouseEvent | React.TouchEvent) {
  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
}

type HistoryItem = {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  amount_usdt: number;
  amount_cfa: number;
  status: string;
};

// ─── Status meta ───────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; color: string; Icon: any }> = {
  pending_payment: { label: 'Attente paiement', color: AMBER, Icon: Clock },
  pending_claim:   { label: 'A reclamer',       color: AMBER, Icon: Inbox },
  claimed:         { label: 'Reclame',          color: AMBER, Icon: Clock },
  processing:      { label: 'En livraison',     color: AMBER, Icon: Clock },
  completed:       { label: 'Termine',          color: GREEN, Icon: CheckCircle2 },
  cancelled:       { label: 'Annule',           color: RED,   Icon: XCircle },
  refunded:        { label: 'Rembourse',        color: FADE,  Icon: XCircle },
};

// ─── Date grouping ─────────────────────────────────────────────────────
function dayKey(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (same(d, now)) return "Aujourd'hui";
  if (same(d, yest)) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}
function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function P2PTestPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  const [mode, setMode] = useState<'home' | 'send' | 'claim'>('home');
  const [claiming, setClaiming] = useState<PendingTransfer | null>(null);
  const [pending, setPending] = useState<PendingTransfer[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
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

    // Historique complet
    const { data: recent } = await (supabase as any)
      .from('p2p_transfers')
      .select('id, created_at, sender_id, receiver_id, amount_usdt, amount_cfa, status')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(30);
    setHistory((recent || []) as HistoryItem[]);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const copyMyId = () => {
    if (!profile?.terex_id) return;
    navigator.clipboard.writeText(profile.terex_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Grouper l'historique par jour
  const groups = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    for (const h of history) {
      const k = dayKey(h.created_at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(h);
    }
    return Array.from(map.entries());
  }, [history]);

  const stats = useMemo(() => {
    let sent = 0, received = 0;
    for (const h of history) {
      if (h.status !== 'completed') continue;
      if (h.sender_id === user?.id) sent += Number(h.amount_usdt);
      else received += Number(h.amount_usdt);
    }
    return { sent, received };
  }, [history, user?.id]);

  // Sub-views full-screen
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

  // ─── Composants inline ────────────────────────────────────────────────

  const TerexIdCard = (
    <div style={{
      background: `linear-gradient(180deg, ${CARD_ELEVATED} 0%, ${CARD} 100%)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 24,
      padding: isMobile ? '22px 22px' : '26px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Halo subtil */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 60% at 100% 0%, rgba(255,255,255,0.06) 0%, transparent 50%)',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            color: FADE, fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px',
          }}>
            Mon Terex ID
          </p>
          <p style={{
            color: WHITE,
            fontSize: isMobile ? 30 : 34,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '0.16em',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {profile?.terex_id || '········'}
          </p>
          <p style={{ color: DIM, fontSize: 12.5, margin: '14px 0 0', lineHeight: 1.55, maxWidth: 360 }}>
            Partagez cet identifiant pour recevoir des USDT d'autres utilisateurs Terex.
          </p>
        </div>

        <button
          onClick={copyMyId}
          aria-label="Copier le Terex ID"
          style={{
            width: 44, height: 44, borderRadius: 14,
            background: copied ? 'rgba(52,211,153,0.14)' : SUBTLE,
            border: `1px solid ${copied ? 'rgba(52,211,153,0.35)' : BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'transform 0.15s ease, background 0.2s ease, border-color 0.2s ease',
          }}
          onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        >
          {copied ? <Check size={17} color={GREEN} strokeWidth={2.4} /> : <Copy size={16} color={DIM} strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  );

  const StatsRow = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { label: 'Recu', value: stats.received, color: GREEN, Icon: ArrowDownLeft },
        { label: 'Envoye', value: stats.sent, color: WHITE, Icon: ArrowUpRight },
      ].map(({ label, value, color, Icon }) => (
        <div key={label} style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, background: SUBTLE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={13} color={color} strokeWidth={2} />
            </div>
            <span style={{ color: FADE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {label}
            </span>
          </div>
          <p style={{
            color: WHITE, fontSize: 20, fontWeight: 700, margin: 0,
            letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
          }}>
            {nfUsdt.format(value)} <span style={{ color: FADE, fontSize: 12, fontWeight: 500 }}>USDT</span>
          </p>
        </div>
      ))}
    </div>
  );

  const SendButton = (
    <button
      onClick={() => setMode('send')}
      style={{
        width: '100%',
        background: WHITE, color: '#0a0a0a',
        border: 'none', borderRadius: 18,
        padding: '17px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        boxShadow: '0 8px 24px -12px rgba(255,255,255,0.15)',
      }}
      onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    >
      <Send size={17} strokeWidth={2.2} />
      Envoyer des USDT
    </button>
  );

  const PendingBanner = pending.length > 0 && (
    <div style={{
      background: 'linear-gradient(135deg, rgba(251,191,36,0.09) 0%, rgba(251,191,36,0.04) 100%)',
      border: '1px solid rgba(251,191,36,0.22)',
      borderRadius: 22, padding: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'rgba(251,191,36,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Inbox size={17} color={AMBER} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: WHITE, fontSize: 14.5, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {pending.length} transfert{pending.length > 1 ? 's' : ''} a reclamer
          </p>
          <p style={{ color: DIM, fontSize: 12, margin: '2px 0 0' }}>
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
              background: 'rgba(0,0,0,0.32)', border: `1px solid rgba(255,255,255,0.05)`,
              borderRadius: 14, padding: '13px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%',
              transition: 'transform 0.15s ease, background 0.2s ease',
            }}
            onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: WHITE, fontSize: 14.5, fontWeight: 700, margin: 0,
                letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
              }}>
                {nfUsdt.format(t.amount_usdt)} USDT
              </p>
              <p style={{ color: DIM, fontSize: 12, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                de {t.sender_name || `Terex ID ${t.sender_terex_id || '?'}`}
                {t.message ? ` · « ${t.message} »` : ''}
              </p>
            </div>
            <ChevronRight size={16} color={FADE} />
          </button>
        ))}
      </div>
    </div>
  );

  const HistorySection = (
    <div>
      <div style={{ padding: '0 4px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{
          color: WHITE, fontSize: 15, fontWeight: 700, margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Historique
        </h2>
        <span style={{ color: FADE, fontSize: 12, fontWeight: 500 }}>
          {history.length ? `${history.length} transfert${history.length > 1 ? 's' : ''}` : ''}
        </span>
      </div>

      {history.length === 0 ? (
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20,
          padding: '48px 20px', textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: SUBTLE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
          }}>
            <Send size={18} color={FADE} strokeWidth={1.8} />
          </div>
          <p style={{ color: DIM, fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
            Aucun transfert pour l'instant.<br />
            <span style={{ color: FADE }}>Envoyez-en un pour commencer.</span>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(([day, items]) => (
            <div key={day}>
              <p style={{
                color: FADE, fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                margin: '0 0 10px 4px',
              }}>
                {day}
              </p>
              <div style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20,
                overflow: 'hidden',
              }}>
                {items.map((t, i) => {
                  const isSender = t.sender_id === user?.id;
                  const meta = STATUS[t.status] || STATUS.completed;
                  const StatusIcon = meta.Icon;

                  return (
                    <div
                      key={t.id}
                      style={{
                        padding: '14px 16px',
                        borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : 'none',
                        display: 'flex', alignItems: 'center', gap: 14,
                      }}
                    >
                      {/* Directional icon: up-right for sent, down-left for received */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: isSender ? SUBTLE : 'rgba(52,211,153,0.12)',
                        border: `1px solid ${isSender ? BORDER : 'rgba(52,211,153,0.22)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isSender
                          ? <ArrowUpRight size={16} color={WHITE} strokeWidth={2.2} />
                          : <ArrowDownLeft size={16} color={GREEN} strokeWidth={2.2} />
                        }
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: WHITE, fontSize: 14.5, fontWeight: 600, margin: 0,
                          letterSpacing: '-0.01em',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {isSender ? 'Envoye' : 'Recu'} · <span style={{ fontVariantNumeric: 'tabular-nums' }}>{nfUsdt.format(t.amount_usdt)} USDT</span>
                        </p>
                        <p style={{ color: FADE, fontSize: 11.5, margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                          {timeStr(t.created_at)} · {nfCfa.format(t.amount_cfa)} CFA
                        </p>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        color: meta.color, flexShrink: 0,
                      }}>
                        <StatusIcon size={11} strokeWidth={2.4} />
                        <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── Layout ───────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: BG_DEEP, padding: '0 0 120px' }}>
      {/* Header translucide — le contenu passe dessous */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: GLASS,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: `1px solid ${BORDER}`,
        padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 20px 14px',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
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
            <h1 style={{
              color: WHITE, fontSize: 20, fontWeight: 700, margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Transfert P2P
            </h1>
            <p style={{ color: DIM, fontSize: 12.5, margin: '2px 0 0' }}>
              Envoyer et recevoir des USDT entre utilisateurs Terex
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{
        maxWidth: 960, margin: '0 auto',
        padding: isMobile ? '20px 16px 0' : '32px 32px 0',
      }}>
        {isMobile ? (
          // ─── Mobile : colonne unique ───────────────────────────────────
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {TerexIdCard}
            {StatsRow}
            {PendingBanner}
            {SendButton}
            {HistorySection}
          </div>
        ) : (
          // ─── Desktop : 2 colonnes ─────────────────────────────────────
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>
            {/* Colonne gauche : identite + actions (sticky) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 100 }}>
              {TerexIdCard}
              {StatsRow}
              {SendButton}
            </div>

            {/* Colonne droite : pending + history */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {PendingBanner}
              {HistorySection}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
