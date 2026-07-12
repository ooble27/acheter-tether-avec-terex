import { Textarea } from '@/components/ui/textarea';
import { UnifiedOrder } from '@/hooks/useOrders';
import {
  Coins, HandCoins, Send, Copy, CheckCircle, XCircle, Clock, ArrowLeft,
  Hand, Lock, ArrowRight, Hash, Mail, Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { parseOrderNotes } from '@/lib/orderNotesParser';
import { useOrderOps, useOrderEvents, EVENT_LABELS } from '@/hooks/useOrderOps';
import { StatusText, Avatar, drillStyles } from '@/components/admin/AdminDrill';
import { ClientProfile } from '@/components/admin/ClientProfile';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderDetailsPageProps {
  order: UnifiedOrder | null;
  onBack: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
  /** Archive silencieuse : retire la commande de la file SANS email (tests, spam, ventes jamais payées). */
  onArchive?: (orderId: string) => void;
}

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const RED = '#e07a7a';

// Toujours afficher le vrai prestataire (Wave, Orange Money…), jamais un
// générique « Mobile Money ».
const PAYMENT_LABELS: Record<string, string> = {
  card: 'Carte bancaire', wave: 'Wave', orange: 'Orange Money', orange_money: 'Orange Money', om: 'Orange Money',
  bank: 'Virement bancaire', bank_transfer: 'Virement bancaire', interac: 'Interac',
};
const prettyMethod = (pm?: string | null) =>
  (pm && PAYMENT_LABELS[pm]) || (pm ? pm.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—');

const TYPE_META: Record<string, { label: string; Icon: any }> = {
  buy: { label: 'Achat USDT', Icon: Coins },
  sell: { label: 'Vente USDT', Icon: HandCoins },
  transfer: { label: 'Transfert international', Icon: Send },
};

// ── Ligne label/valeur (design des pages Acheter/Vendre) ──────────────────────
function Row({ label, value, mono, copyable, onCopy, stacked, last }: {
  label: string; value: React.ReactNode; mono?: boolean; copyable?: boolean; onCopy?: () => void; stacked?: boolean; last?: boolean;
}) {
  const border = last ? 'none' : `1px solid ${BORDER}`;
  if (stacked) {
    return (
      <div style={{ padding: '13px 16px', borderBottom: border }}>
        <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 6px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, color: '#fff', fontSize: mono ? 12 : 13.5, fontWeight: 500, fontFamily: mono ? 'ui-monospace,Menlo,monospace' : undefined, wordBreak: 'break-all', minWidth: 0 }}>{value}</span>
          {copyable && onCopy && <button onClick={onCopy} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex' }}><Copy size={13} /></button>}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: border }}>
      <span style={{ color: '#6b7280', fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, justifyContent: 'flex-end' }}>
        <span style={{ color: '#fff', fontSize: mono ? 12 : 13.5, fontWeight: 500, textAlign: 'right', wordBreak: 'break-all', fontFamily: mono ? 'ui-monospace,Menlo,monospace' : undefined }}>{value}</span>
        {copyable && onCopy && <button onClick={onCopy} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex' }}><Copy size={13} /></button>}
      </span>
    </div>
  );
}

function GroupLabel({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div style={{ padding: '11px 16px 7px', borderTop: first ? 'none' : `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.018)' }}>
      <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{children}</p>
    </div>
  );
}

export function OrderDetailsPage({ order, onBack, onStatusUpdate, onArchive }: OrderDetailsPageProps) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [section, setSection] = useState('client');
  const [showClient, setShowClient] = useState(false);
  const { toast } = useToast();

  const { claimOrder, releaseOrder, logOrderEvent, currentUserId } = useOrderOps();
  const { events, reload: reloadEvents } = useOrderEvents(order?.id);
  const [assignedTo, setAssignedTo] = useState<string | null>(order?.assigned_to ?? null);
  const [assignedName, setAssignedName] = useState('');

  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      const table = order.type === 'transfer' ? 'international_transfers' : 'orders';
      const { data } = await (supabase as any).from(table).select('assigned_to').eq('id', order.id).maybeSingle();
      if (cancelled) return;
      const uid = (data as any)?.assigned_to ?? null;
      setAssignedTo(uid);
      if (uid && uid !== currentUserId) {
        const { data: p } = await supabase.from('profiles').select('full_name').eq('id', uid).maybeSingle();
        if (!cancelled) setAssignedName((p as any)?.full_name || "un membre de l'équipe");
      }
    })();
    return () => { cancelled = true; };
  }, [order?.id, currentUserId]);

  const isActive = order ? (order.status === 'pending' || order.status === 'processing') : false;
  const iOwnIt = assignedTo !== null && assignedTo === currentUserId;
  const ownedByOther = assignedTo !== null && assignedTo !== currentUserId;
  const canAct = !isActive || iOwnIt;

  const handleClaim = async () => {
    if (!order) return;
    if (await claimOrder(order.id, order.type)) { setAssignedTo(currentUserId || null); reloadEvents(); }
    else {
      const t2 = order.type === 'transfer' ? 'international_transfers' : 'orders';
      const { data } = await (supabase as any).from(t2).select('assigned_to').eq('id', order.id).maybeSingle();
      setAssignedTo((data as any)?.assigned_to ?? null);
    }
  };
  const handleRelease = async () => {
    if (!order) return;
    if (await releaseOrder(order.id, order.type)) { setAssignedTo(null); reloadEvents(); }
  };
  const doStatusUpdate = (status: OrderStatus, paymentStatus?: string) => {
    if (!order) return;
    onStatusUpdate(order.id, status, paymentStatus);
    logOrderEvent(order.id, `status_${status}`).then(reloadEvents);
  };

  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-client-infos', { body: { userIds: [order.user_id] } });
        if (cancelled || error) return;
        const info = (data?.infos || [])[0];
        if (info) { setUserName(info.full_name || ''); setUserEmail(info.email || ''); setUserPhone(info.phone || ''); }
      } catch (e) { console.error('Error fetching user info:', e); }
    })();
    return () => { cancelled = true; };
  }, [order?.user_id]);

  if (!order) return null;

  if (showClient) {
    return <div style={{ background: '#1a1a1a', minHeight: '100vh' }} className="px-4 sm:px-6 py-5">
      <div className="max-w-3xl mx-auto"><ClientProfile userId={order.user_id} onBack={() => setShowClient(false)} /></div>
    </div>;
  }

  const meta = TYPE_META[order.type] || { label: 'Transaction', Icon: Hash };
  const parsedNotes = parseOrderNotes(order.notes);
  const ref = `TEREX-${order.id.slice(-8).toUpperCase()}`;
  const copy = (value: string, label = 'Copié') => {
    navigator.clipboard.writeText(value);
    toast({ title: label, description: value.length > 40 ? `${value.slice(0, 40)}…` : value });
  };

  const sendCancellationEmail = async () => {
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: order.user_id, orderId: order.id, emailAddress: null,
          emailType: 'cancellation_confirmation', transactionType: order.type,
          orderData: { ...order, cancellation_reason: cancellationReason, status: 'cancelled' },
        },
      });
      if (error) throw error;
      toast({ title: 'Email envoyé', description: 'Le client a reçu la confirmation' });
      logOrderEvent(order.id, 'cancellation_email_sent', cancellationReason).then(reloadEvents);
      setShowCancellationForm(false);
      setCancellationReason('');
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: "Impossible d'envoyer l'email", variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  };

  const clientName = userName || 'Client';
  const amountLine = `${Number(order.amount).toLocaleString('fr-FR')} ${order.currency}`;
  const usdtLine = `${Number(order.usdt_amount || 0).toLocaleString('fr-FR')} USDT`;
  const openActive = order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'failed';

  // Numéro + prestataire de PAYOUT saisis DANS la commande (jamais le téléphone du compte) :
  // le client peut vouloir recevoir sur un autre numéro Wave/Orange que celui de son compte.
  let payoutNumber = '';
  let payoutProvider = '';
  if (parsedNotes.isJson) {
    try {
      const n = JSON.parse(parsedNotes.raw);
      payoutNumber = n.phoneNumber || '';
      payoutProvider = n.provider ? prettyMethod(n.provider) : '';
    } catch { /* notes illisibles */ }
  }
  const method = payoutProvider || prettyMethod(order.payment_method);

  // Onglets (pastilles) — on ne défile plus : on choisit une section.
  const TABS: { id: string; label: string }[] = [
    { id: 'client', label: 'Client' },
    { id: 'transaction', label: 'Transaction' },
    { id: 'paiement', label: 'Paiement' },
    ...(order.type === 'buy' && order.wallet_address ? [{ id: 'destination', label: 'Destination' }] : []),
    ...(order.type === 'transfer' ? [{ id: 'beneficiaire', label: 'Bénéficiaire' }] : []),
    { id: 'historique', label: 'Historique' },
  ];
  const activeSection = TABS.some(t => t.id === section) ? section : 'client';

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }} className="text-white w-full overflow-x-hidden">
      <style>{drillStyles}</style>

      {/* EN-TÊTE */}
      <div className="px-4 sm:px-6 pb-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={onBack} aria-label="Retour" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowLeft size={16} color="#fff" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
              <meta.Icon size={15} color="rgba(255,255,255,0.6)" />
              <span style={{ color: '#9ca3af', fontSize: 12.5, fontWeight: 600 }}>{meta.label}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
              <StatusText status={order.status} size={12.5} />
            </div>
            <button onClick={() => copy(ref, 'Référence copiée')} className="flex items-center gap-1.5 mt-0.5 hover:text-white transition" style={{ color: '#6b7280', fontSize: 11.5, fontFamily: 'ui-monospace,Menlo,monospace', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              {ref} <Copy size={11} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* RÉSUMÉ CLIENT + FLUX */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Avatar name={clientName} size={40} />
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clientName}</p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0' }}>{format(new Date(order.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 130px', minWidth: 0 }}>
                <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{order.type === 'sell' ? 'Le client envoie' : 'Le client paie'}</p>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{order.type === 'sell' ? usdtLine : amountLine}</p>
              </div>
              <ArrowRight size={16} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
              <div style={{ flex: '1 1 130px', minWidth: 0, textAlign: 'right' }}>
                <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Le client reçoit</p>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{order.type === 'sell' ? amountLine : usdtLine}</p>
              </div>
            </div>
          </div>

          {/* BANDEAU PRISE EN CHARGE */}
          {isActive && (
            ownedByOther ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 14, padding: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.14)` }}>
                <Lock size={15} color="#9ca3af" style={{ flexShrink: 0 }} />
                <p style={{ color: '#d1d5db', fontSize: 13, margin: 0 }}><strong style={{ color: '#fff' }}>{assignedName}</strong> traite déjà cette commande — ne la traitez pas en double.</p>
              </div>
            ) : iOwnIt ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.15)`, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 13 }}><Hand size={15} /> Vous traitez cette commande — verrouillée pour l'équipe.</span>
                <button onClick={handleRelease} style={{ background: '#2d2d2d', color: '#9ca3af', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Libérer</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px dashed rgba(255,255,255,0.16)`, flexWrap: 'wrap' }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Commande libre — prenez-la en charge avant de la traiter.</span>
                <button onClick={handleClaim} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><Hand size={14} /> Prendre en charge</button>
              </div>
            )
          )}

          {/* À FAIRE — instruction claire pour l'opérateur */}
          {openActive && (order.type === 'buy' || order.type === 'sell') && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
                <Send size={15} color="#fff" />
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>À faire — {order.type === 'buy' ? 'envoyer les USDT' : 'envoyer les fonds'}</p>
              </div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderBottom: (order.type === 'buy' && order.wallet_address) ? `1px solid ${BORDER}` : 'none' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Montant à envoyer</p>
                  <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{order.type === 'buy' ? usdtLine : amountLine}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{order.type === 'buy' ? 'Réseau' : 'Numéro du client'}</p>
                  {order.type === 'buy' ? (
                    <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{order.network || 'TRC20'}</p>
                  ) : (
                    <>
                      <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>{payoutNumber || '—'}</p>
                      {method !== '—' && <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>{method}</p>}
                    </>
                  )}
                </div>
              </div>
              {order.type === 'buy' && order.wallet_address && (
                <Row label="Adresse de réception" value={order.wallet_address} mono copyable onCopy={() => copy(order.wallet_address!, 'Adresse copiée')} stacked last />
              )}
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderTop: `1px solid ${BORDER}` }}>
                <p style={{ color: '#6b7280', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  {order.type === 'buy'
                    ? <>Le client a payé <span style={{ color: '#fff' }}>{amountLine}</span> via <span style={{ color: '#fff' }}>{method}</span> au taux de <span style={{ color: '#fff' }}>{order.exchange_rate} {order.currency}/USDT</span>.</>
                    : <>Le client envoie <span style={{ color: '#fff' }}>{usdtLine}</span> au taux de <span style={{ color: '#fff' }}>{order.exchange_rate} {order.currency}/USDT</span>.</>}
                </p>
              </div>
            </div>
          )}

          {/* SÉLECTEUR SEGMENTÉ — même composant que la landing Business */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(t => {
              const sel = activeSection === t.id;
              return (
                <button key={t.id} onClick={() => setSection(t.id)}
                  style={{
                    flexShrink: 0, whiteSpace: 'nowrap', padding: '8px 18px', borderRadius: 9, cursor: 'pointer',
                    fontSize: 13, fontWeight: sel ? 600 : 400, transition: 'all 0.15s', border: 'none',
                    background: sel ? '#2d2d2d' : 'transparent',
                    color: sel ? '#fff' : '#9ca3af', outline: 'none', WebkitTapHighlightColor: 'transparent',
                  }}>
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* CONTENU DE LA SECTION ACTIVE */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            {activeSection === 'client' && (
              <>
                <Row label="Nom complet" value={userName || '—'} />
                <Row label="Email" value={userEmail || '—'} copyable={!!userEmail} onCopy={() => copy(userEmail, 'Email copié')} />
                <Row label="Téléphone" value={userPhone || '—'} copyable={!!userPhone} onCopy={() => copy(userPhone, 'Téléphone copié')} />
                <Row label="ID utilisateur" value={`${order.user_id.slice(0, 8)}…${order.user_id.slice(-4)}`} mono copyable onCopy={() => copy(order.user_id, 'ID copié')} />
                <button onClick={() => setShowClient(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', borderTop: `1px solid ${BORDER}`, padding: '13px 16px', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  Voir la fiche complète du client
                  <ArrowRight size={15} color="rgba(255,255,255,0.4)" />
                </button>
              </>
            )}
            {activeSection === 'transaction' && (
              <>
                <Row label={`Montant ${order.currency}`} value={Number(order.amount).toLocaleString('fr-FR')} />
                <Row label="USDT" value={String(order.usdt_amount || 0)} />
                <Row label="Taux" value={`${order.exchange_rate} ${order.currency}/USDT`} />
                <Row label="Créée le" value={format(new Date(order.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })} last />
              </>
            )}
            {activeSection === 'paiement' && (
              <>
                <Row label="Méthode" value={method} last={parsedNotes.sections.length === 0 && !order.payment_reference} />
                {order.payment_reference && <Row label="Référence" value={order.payment_reference} mono last={parsedNotes.sections.length === 0} />}
                {/* Les détails saisis par le client (type de service, numéro mobile…) vivent ici */}
                {parsedNotes.sections.map((ns, si) => (
                  <div key={si}>
                    <GroupLabel>{ns.title}</GroupLabel>
                    {ns.fields.map((field, fi) => (
                      <Row key={fi} label={field.label} value={field.value}
                        mono={field.copyable} copyable={field.copyable} onCopy={() => copy(field.value, `${field.label} copié`)}
                        last={si === parsedNotes.sections.length - 1 && fi === ns.fields.length - 1} />
                    ))}
                  </div>
                ))}
              </>
            )}
            {activeSection === 'destination' && order.wallet_address && (
              <>
                <Row label="Réseau" value={order.network || 'TRC20'} />
                <Row label="Adresse wallet" value={order.wallet_address} mono copyable onCopy={() => copy(order.wallet_address!, 'Adresse copiée')} stacked last />
              </>
            )}
            {activeSection === 'beneficiaire' && (
              <>
                {order.recipient_name && <Row label="Nom" value={order.recipient_name} />}
                {order.recipient_country && <Row label="Pays" value={order.recipient_country} />}
                {order.recipient_phone && <Row label="Téléphone" value={order.recipient_phone} copyable onCopy={() => copy(order.recipient_phone!, 'Téléphone copié')} />}
                {order.recipient_email && <Row label="Email" value={order.recipient_email} />}
                {order.fees !== undefined && order.fees > 0 && <Row label="Frais" value={`${order.fees} ${order.currency}`} />}
                {order.total_amount !== undefined && <Row label="Montant à recevoir" value={`${order.total_amount} ${order.to_currency || ''}`} last />}
              </>
            )}
            {activeSection === 'historique' && (
              <div style={{ padding: 16 }}>
                {events.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucun événement — les prises en charge et changements de statut apparaîtront ici.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {events.map((ev, i) => (
                      <div key={ev.id} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: ev.action.includes('cancel') ? RED : ev.action === 'status_completed' ? '#fff' : 'rgba(255,255,255,0.45)' }} />
                          {i < events.length - 1 && <span style={{ width: 1, flex: 1, margin: '4px 0', background: 'rgba(255,255,255,0.08)' }} />}
                        </div>
                        <div style={{ paddingBottom: 14, minWidth: 0 }}>
                          <p style={{ color: '#fff', fontSize: 13, margin: 0 }}>
                            {EVENT_LABELS[ev.action] || ev.action}
                            {ev.actor_name && <span style={{ color: '#9ca3af' }}> — {ev.actor_name}</span>}
                          </p>
                          {ev.details && <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0', wordBreak: 'break-word' }}>{ev.details}</p>}
                          <p style={{ color: '#4b5563', fontSize: 11, margin: '2px 0 0' }}>{format(new Date(ev.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EMAIL D'ANNULATION */}
          {(order.status === 'cancelled' || showCancellationForm) && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Mail size={15} color="#9ca3af" />
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>Email d'annulation</p>
              </div>
              <Textarea placeholder="Motif d'annulation (optionnel)…" value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)}
                className="bg-[#1a1a1a] border-[rgba(255,255,255,0.07)] text-white placeholder:text-[#6b7280] min-h-[80px]" />
              <button onClick={sendCancellationEmail} disabled={sendingEmail}
                style={{ marginTop: 12, width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '10px 14px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', opacity: sendingEmail ? 0.6 : 1 }}>
                <Mail size={15} /> {sendingEmail ? 'Envoi…' : "Envoyer l'email d'annulation"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS (barre collante) */}
      <div className="px-4 sm:px-6 py-4 sticky bottom-0" style={{ borderTop: `1px solid ${BORDER}`, background: '#1a1a1a' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 sm:justify-end">
          {isActive && !canAct && (
            <div className="flex-1 flex items-center justify-center sm:justify-end gap-2 text-sm py-2" style={{ color: '#9ca3af' }}>
              <Lock size={15} />
              {ownedByOther ? <>Verrouillée — traitée par <strong className="text-white">{assignedName}</strong></> : <>Prenez la commande en charge pour débloquer les actions</>}
            </div>
          )}
          {order.status === 'pending' && canAct && (
            <>
              <button onClick={() => doStatusUpdate('processing')} style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 11, padding: '11px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', minWidth: 170 }}>
                <Clock size={16} /> Mettre en traitement
              </button>
              <button onClick={() => { doStatusUpdate('cancelled'); setShowCancellationForm(true); }} style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', color: RED, border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 11, padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minWidth: 130 }}>
                <XCircle size={16} /> Annuler
              </button>
            </>
          )}
          {order.status === 'processing' && canAct && (
            <>
              <button onClick={() => doStatusUpdate('completed', 'paid')} style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 11, padding: '11px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', minWidth: 170 }}>
                <CheckCircle size={16} /> Marquer comme terminé
              </button>
              <button onClick={() => { doStatusUpdate('cancelled'); setShowCancellationForm(true); }} style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', color: RED, border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 11, padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minWidth: 130 }}>
                <XCircle size={16} /> Annuler
              </button>
            </>
          )}
          {/* Archive silencieuse — retirer de la file sans email (tests / ventes jamais payées) */}
          {isActive && canAct && onArchive && (
            <button onClick={() => { onArchive(order.id); onBack(); }}
              style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', color: '#9ca3af', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '11px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', minWidth: 150 }}>
              <Trash2 size={15} /> Retirer de la file
            </button>
          )}
          {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'failed') && (
            <div className="flex-1 text-center sm:text-right text-sm py-2" style={{ color: '#9ca3af' }}>
              Cette commande est <StatusText status={order.status} size={13} />.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
