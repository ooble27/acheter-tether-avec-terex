/**
 * P2PTestPage — Envoi/reception USDT entre utilisateurs Terex.
 *
 * Utilise le design system Terex (couleurs, cards, boutons) — identique
 * au reste de la plateforme (Profile, BuyUSDT, etc.).
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

const CARD    = '#1e1e1e';
const BORDER  = 'rgba(255,255,255,0.07)';
const BTN     = '#2d2d2d';
const ICON_BG = 'rgba(255,255,255,0.06)';
const GREEN   = '#4ade80';
const AMBER   = '#fbbf24';
const RED     = '#f87171';

const nfCfa  = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
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

const STATUS: Record<string, { label: string; color: string; Icon: any }> = {
  pending_payment: { label: 'Attente paiement', color: AMBER, Icon: Clock },
  pending_claim:   { label: 'À réclamer',       color: AMBER, Icon: Inbox },
  claimed:         { label: 'Réclamé',          color: AMBER, Icon: Clock },
  processing:      { label: 'En livraison',     color: AMBER, Icon: Clock },
  completed:       { label: 'Terminé',          color: GREEN, Icon: CheckCircle2 },
  cancelled:       { label: 'Annulé',           color: RED,   Icon: XCircle },
  refunded:        { label: 'Remboursé',        color: '#9ca3af', Icon: XCircle },
};

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

    const { data: transfers } = await (supabase as any)
      .from('p2p_transfers')
      .select('id, created_at, sender_id, amount_usdt, amount_cfa, exchange_rate, message')
      .eq('receiver_id', user.id)
      .eq('status', 'pending_claim')
      .order('created_at', { ascending: false });

    if (transfers && transfers.length > 0) {
      const senderIds = [...new Set(transfers.map((t: any) => t.sender_id))];
      const { data: senders } = await (supabase as any)
        .from('profiles').select('id, full_name, terex_id').in('id', senderIds);
      const senderMap = new Map((senders || []).map((s: any) => [s.id, s]));
      setPending(transfers.map((t: any) => {
        const s = senderMap.get(t.sender_id) as any;
        return { ...t, sender_name: s?.full_name || null, sender_terex_id: s?.terex_id || null };
      }));
    } else {
      setPending([]);
    }

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

  if (mode === 'send') {
    return <SendMoney onBack={() => { setMode('home'); loadData(); }} />;
  }
  if (mode === 'claim' && claiming) {
    return <ClaimTransfer transfer={claiming} onBack={() => { setMode('home'); setClaiming(null); loadData(); }} />;
  }

  // ─── Composants ────────────────────────────────────────────────────

  const TerexIdCard = (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
      padding: '18px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          color: '#6b7280', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px',
        }}>
          Mon Terex ID
        </p>
        <p style={{
          color: '#fff', fontSize: 24, fontWeight: 700, margin: 0,
          letterSpacing: '3px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>
          {profile?.terex_id || '········'}
        </p>
      </div>
      <button
        onClick={copyMyId}
        aria-label="Copier le Terex ID"
        style={{
          width: 42, height: 42, borderRadius: 12,
          background: copied ? 'rgba(74,222,128,0.14)' : BTN,
          border: `1px solid ${copied ? 'rgba(74,222,128,0.30)' : 'rgba(255,255,255,0.10)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          transition: 'transform 0.15s ease, background 0.2s ease, border-color 0.2s ease',
        }}
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
      >
        {copied ? <Check size={17} color={GREEN} strokeWidth={2.4} /> : <Copy size={16} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />}
      </button>
    </div>
  );

  const StatsRow = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { label: 'Reçu', value: stats.received, color: GREEN, Icon: ArrowDownLeft },
        { label: 'Envoyé', value: stats.sent, color: '#fff', Icon: ArrowUpRight },
      ].map(({ label, value, color, Icon }) => (
        <div key={label} style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, background: ICON_BG,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={13} color={color} strokeWidth={2} />
            </div>
            <span style={{
              color: '#6b7280', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>{label}</span>
          </div>
          <p style={{
            color: '#fff', fontSize: 20, fontWeight: 700, margin: 0,
            letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums',
          }}>
            {nfUsdt.format(value)}
            <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>USDT</span>
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
        background: '#fff', color: '#141414',
        border: 'none', borderRadius: 14,
        padding: '15px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        fontSize: 15, fontWeight: 700,
        cursor: 'pointer', transition: 'transform 0.15s ease',
      }}
      onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    >
      <Send size={16} strokeWidth={2.2} />
      Envoyer des USDT
    </button>
  );

  const PendingBanner = pending.length > 0 && (
    <div style={{
      background: 'rgba(251,191,36,0.06)',
      border: '1px solid rgba(251,191,36,0.18)',
      borderRadius: 18, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(251,191,36,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Inbox size={16} color={AMBER} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>
            {pending.length} transfert{pending.length > 1 ? 's' : ''} à réclamer
          </p>
          <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>
            Choisissez où recevoir vos USDT
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pending.map(t => (
          <button
            key={t.id}
            onClick={() => { setClaiming(t); setMode('claim'); }}
            style={{
              background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '13px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%',
              transition: 'transform 0.15s ease',
            }}
            onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: '#fff', fontSize: 14.5, fontWeight: 700, margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {nfUsdt.format(t.amount_usdt)} USDT
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                de {t.sender_name || `Terex ID ${t.sender_terex_id || '?'}`}
                {t.message ? ` · « ${t.message} »` : ''}
              </p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
          </button>
        ))}
      </div>
    </div>
  );

  const HistorySection = (
    <div>
      <div style={{ padding: '0 4px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>Historique</h2>
        {history.length > 0 && (
          <span style={{ color: '#6b7280', fontSize: 12 }}>
            {history.length} transfert{history.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
          padding: '48px 20px', textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: ICON_BG,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
          }}>
            <Send size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
            Aucun transfert pour l'instant.<br />
            <span style={{ color: '#4b5563' }}>Envoyez-en un pour commencer.</span>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(([day, items]) => (
            <div key={day}>
              <p style={{
                color: '#4b5563', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                margin: '0 0 10px 4px',
              }}>
                {day}
              </p>
              <div style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
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
                      <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: isSender ? ICON_BG : 'rgba(74,222,128,0.10)',
                        border: `1px solid ${isSender ? BORDER : 'rgba(74,222,128,0.22)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isSender
                          ? <ArrowUpRight size={16} color="#fff" strokeWidth={2.2} />
                          : <ArrowDownLeft size={16} color={GREEN} strokeWidth={2.2} />
                        }
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: '#fff', fontSize: 14.5, fontWeight: 600, margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {isSender ? 'Envoyé' : 'Reçu'} · <span style={{ fontVariantNumeric: 'tabular-nums' }}>{nfUsdt.format(t.amount_usdt)} USDT</span>
                        </p>
                        <p style={{ color: '#6b7280', fontSize: 11.5, margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>
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

  // ─── Layout ─────────────────────────────────────────────────────────

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header simple, meme style que Profile.tsx SubHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 20px' }}>
        <button
          onClick={onBack}
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
        <div>
          <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Transfert P2P
          </h1>
          <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>
            Envoyer et recevoir des USDT entre utilisateurs Terex
          </p>
        </div>
      </div>

      {/* Contenu principal — meme conteneur max-width que les autres sous-pages */}
      <div style={{ maxWidth: isMobile ? '100%' : 1000, margin: '0 auto' }}>
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TerexIdCard}
            {StatsRow}
            {PendingBanner}
            {SendButton}
            {HistorySection}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TerexIdCard}
              {StatsRow}
              {SendButton}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {PendingBanner}
              {HistorySection}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
