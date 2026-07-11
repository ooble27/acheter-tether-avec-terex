import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { UnifiedOrder } from '@/hooks/useOrders';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Hash,
  Coins,
  HandCoins,
  Send,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MailCheck,
  ArrowRight,
  ArrowLeft,
  Globe,
  FileText,
  Hand,
  History,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { parseOrderNotes } from '@/lib/orderNotesParser';
import { useOrderOps, useOrderEvents, EVENT_LABELS } from '@/hooks/useOrderOps';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderDetailsPageProps {
  order: UnifiedOrder | null;
  onBack: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Carte bancaire',
  mobile: 'Mobile Money',
  wave: 'Wave',
  orange_money: 'Orange Money',
  bank: 'Virement bancaire',
  bank_transfer: 'Virement bancaire',
  interac: 'Interac',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En traitement',
  completed: 'Terminé',
  cancelled: 'Annulé',
  failed: 'Échoué',
};

const STATUS_PILL_STYLES: Record<string, React.CSSProperties> = {
  pending: { background: 'rgba(251,191,36,0.10)', color: '#fbbf24' },
  processing: { background: 'rgba(96,165,250,0.10)', color: '#60a5fa' },
  completed: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' },
  cancelled: { background: 'rgba(248,113,113,0.10)', color: '#f87171' },
  failed: { background: 'rgba(248,113,113,0.10)', color: '#f87171' },
};

export function OrderDetailsPage({
  order,
  onBack,
  onStatusUpdate,
}: OrderDetailsPageProps) {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  // — Multi-employés : prise en charge + journal d'activité —
  const { claimOrder, releaseOrder, logOrderEvent, currentUserId } = useOrderOps();
  const { events, reload: reloadEvents } = useOrderEvents(order?.id);
  const [assignedTo, setAssignedTo] = useState<string | null>(order?.assigned_to ?? null);
  const [assignedName, setAssignedName] = useState<string>('');

  // État de prise en charge TOUJOURS lu frais depuis la base (la prop peut être périmée)
  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      const table = order.type === 'transfer' ? 'international_transfers' : 'orders';
      const { data } = await (supabase as any)
        .from(table).select('assigned_to').eq('id', order.id).maybeSingle();
      if (cancelled) return;
      const uid = (data as any)?.assigned_to ?? null;
      setAssignedTo(uid);
      if (uid && uid !== currentUserId) {
        const { data: p } = await supabase.from('profiles').select('full_name').eq('id', uid).maybeSingle();
        if (!cancelled) setAssignedName((p as any)?.full_name || 'un membre de l\'équipe');
      }
    })();
    return () => { cancelled = true; };
  }, [order?.id, currentUserId]);

  const isActive = order ? (order.status === 'pending' || order.status === 'processing') : false;
  const iOwnIt = assignedTo !== null && assignedTo === currentUserId;
  const ownedByOther = assignedTo !== null && assignedTo !== currentUserId;
  const canAct = !isActive || iOwnIt; // les actions exigent la prise en charge quand la commande est active

  const handleClaim = async () => {
    if (!order) return;
    if (await claimOrder(order.id, order.type)) { setAssignedTo(currentUserId || null); reloadEvents(); }
    else { // déjà prise : rafraîchir l'état réel
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

  // Infos client (nom, email, téléphone) via la fonction admin get-client-infos.
  // L'ancienne version appelait auth.admin depuis le navigateur → interdit,
  // échec silencieux → la carte Client restait vide (ID seulement).
  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-client-infos', {
          body: { userIds: [order.user_id] },
        });
        if (cancelled || error) return;
        const info = (data?.infos || [])[0];
        if (info) {
          setUserName(info.full_name || '');
          setUserEmail(info.email || '');
          setUserPhone(info.phone || '');
        }
      } catch (e) {
        console.error('Error fetching user info:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [order?.user_id]);

  if (!order) return null;

  const parsedNotes = parseOrderNotes(order.notes);

  const orderTypeMeta = (() => {
    switch (order.type) {
      case 'buy':
        return { Icon: Coins, label: 'Achat USDT' };
      case 'sell':
        return { Icon: HandCoins, label: 'Vente USDT' };
      case 'transfer':
        return { Icon: Send, label: 'Transfert international' };
      default:
        return { Icon: Hash, label: 'Transaction' };
    }
  })();

  const copy = (value: string, label = 'Copié') => {
    navigator.clipboard.writeText(value);
    toast({ title: label, description: value.length > 40 ? `${value.slice(0, 40)}…` : value });
  };

  const statusBadge = (status: string) => (
    <span
      className="inline-flex items-center font-semibold"
      style={{
        borderRadius: 999,
        padding: '3px 10px',
        fontSize: 11,
        ...(STATUS_PILL_STYLES[status] || {
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.65)',
        }),
      }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );

  const Icon = orderTypeMeta.Icon;

  const sendCancellationEmail = async () => {
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: order.user_id,
          orderId: order.id,
          emailAddress: null,
          emailType: 'cancellation_confirmation',
          transactionType: order.type,
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

  const formattedAmount = order.type === 'sell'
    ? `${order.usdt_amount} USDT`
    : `${order.amount.toLocaleString()} ${order.currency}`;
  const formattedSub = order.type === 'sell'
    ? `→ ${order.amount.toLocaleString()} ${order.currency}`
    : `→ ${order.usdt_amount} USDT`;

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }} className="text-white w-full overflow-x-hidden">
      {/* HEADER */}
      <div
        className="px-4 sm:px-6 pb-4"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                aria-label="Retour"
                className="rounded-full flex items-center justify-center flex-shrink-0 transition hover:opacity-80"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <ArrowLeft className="w-4.5 h-4.5 text-white" />
              </button>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-white tracking-tight leading-tight">
                  {orderTypeMeta.label}
                </h1>
                <button
                  onClick={() => copy(`TEREX-${order.id.slice(-8).toUpperCase()}`, 'Référence copiée')}
                  className="flex items-center gap-1.5 mt-1 text-xs text-[#9ca3af] hover:text-white transition font-mono"
                >
                  <Hash className="w-3 h-3" />
                  TEREX-{order.id.slice(-8).toUpperCase()}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {statusBadge(order.status)}
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-white leading-none tracking-tight">{formattedAmount}</div>
                <div className="text-xs text-[#9ca3af] mt-1">{formattedSub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BANDEAU PRISE EN CHARGE — anti-double-traitement */}
      {isActive && (
        <div className="px-4 sm:px-6 pt-4">
          <div className="max-w-5xl mx-auto">
            {ownedByOther ? (
              <div className="flex items-center gap-3 rounded-xl p-3.5"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <p className="text-sm m-0" style={{ color: '#fbbf24' }}>
                  <strong>{assignedName}</strong> traite déjà cette commande — ne la traitez pas en double.
                </p>
              </div>
            ) : iOwnIt ? (
              <div className="flex items-center justify-between gap-3 rounded-xl p-3.5 flex-wrap"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex items-center gap-3">
                  <Hand className="w-4 h-4 flex-shrink-0 text-white" />
                  <p className="text-sm text-white m-0">Vous traitez cette commande — elle est verrouillée pour le reste de l'équipe.</p>
                </div>
                <Button onClick={handleRelease} size="sm"
                  style={{ background: '#2d2d2d', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.07)' }}>
                  Libérer
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl p-3.5 flex-wrap"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                  <p className="text-sm m-0" style={{ color: '#9ca3af' }}>Commande libre — prenez-la en charge avant de la traiter.</p>
                </div>
                <Button onClick={handleClaim} size="sm" className="hover:opacity-90"
                  style={{ background: '#fff', color: '#141414', fontWeight: 700 }}>
                  <Hand className="w-4 h-4 mr-2" /> Prendre en charge
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BODY — 2 colonnes sur desktop */}
      <div className="px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

          {/* ACTION REQUISE — pleine largeur, prioritaire */}
          {order.type === 'buy' && order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="lg:col-span-2">
              <ActionCard title="Action à effectuer" subtitle="Envoyer l'USDT au wallet du client">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Stat label="Montant USDT" value={`${order.usdt_amount} USDT`} />
                  <Stat label="Réseau" value={order.network || 'TRC20'} />
                </div>
                {order.wallet_address && (
                  <AddressBlock label="Adresse de réception" value={order.wallet_address} onCopy={() => copy(order.wallet_address!, 'Adresse copiée')} />
                )}
                <div className="mt-3 flex items-start gap-2 text-xs text-[#9ca3af]">
                  <AlertCircle className="w-3.5 h-3.5 text-white mt-0.5 flex-shrink-0" />
                  <p>
                    Le client a payé <span className="text-white font-medium">{order.amount.toLocaleString()} {order.currency}</span> via{' '}
                    <span className="text-white font-medium">{PAYMENT_LABELS[order.payment_method || ''] || order.payment_method}</span> au taux de{' '}
                    <span className="text-white font-medium">{order.exchange_rate} {order.currency}/USDT</span>.
                  </p>
                </div>
              </ActionCard>
            </div>
          )}

          {order.type === 'sell' && order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="lg:col-span-2">
              <ActionCard title="Action à effectuer" subtitle="Envoyer les fonds au client">
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Montant à envoyer" value={`${order.amount.toLocaleString()} ${order.currency}`} />
                  <Stat label="Méthode" value={PAYMENT_LABELS[order.payment_method || ''] || order.payment_method || '—'} />
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-[#9ca3af]">
                  <AlertCircle className="w-3.5 h-3.5 text-white mt-0.5 flex-shrink-0" />
                  <p>
                    Le client envoie <span className="text-white font-medium">{order.usdt_amount} USDT</span> au taux de{' '}
                    <span className="text-white font-medium">{order.exchange_rate} {order.currency}/USDT</span>.
                  </p>
                </div>
              </ActionCard>
            </div>
          )}

          {/* CLIENT */}
          <Card title="Client" icon={<User className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field icon={<User className="w-3.5 h-3.5" />} label="Nom complet" value={userName || '—'} />
              <Field icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={userEmail || '—'} onCopy={userEmail ? () => copy(userEmail, 'Email copié') : undefined} />
              <Field icon={<Phone className="w-3.5 h-3.5" />} label="Téléphone" value={userPhone || '—'} onCopy={userPhone ? () => copy(userPhone, 'Téléphone copié') : undefined} />
              <Field icon={<Hash className="w-3.5 h-3.5" />} label="ID utilisateur" value={`${order.user_id.slice(0, 8)}…${order.user_id.slice(-4)}`} mono onCopy={() => copy(order.user_id, 'ID copié')} />
            </div>
          </Card>

          {/* TRANSACTION */}
          <Card title="Transaction" icon={<ArrowRight className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label={`Montant ${order.currency}`} value={order.amount.toLocaleString()} />
              <Stat label="USDT" value={String(order.usdt_amount || 0)} />
              <Stat label="Taux" value={String(order.exchange_rate)} />
              {order.payment_method && (
                <Stat label="Méthode de paiement" value={PAYMENT_LABELS[order.payment_method] || order.payment_method} />
              )}
              {order.network && <Stat label="Réseau blockchain" value={order.network} />}
              {order.payment_reference && <Stat label="Référence paiement" value={order.payment_reference} mono />}
            </div>
          </Card>

          {/* DESTINATION (achat) */}
          {order.type === 'buy' && order.wallet_address && (
            <div className="lg:col-span-2">
              <Card title="Destination crypto" icon={<Wallet className="w-4 h-4" />}>
                <AddressBlock label={`Adresse wallet (${order.network || 'TRC20'})`} value={order.wallet_address} onCopy={() => copy(order.wallet_address!, 'Adresse copiée')} />
              </Card>
            </div>
          )}

          {/* TRANSFERT INTERNATIONAL */}
          {order.type === 'transfer' && (
            <Card title="Bénéficiaire du transfert" icon={<Globe className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.recipient_name && <Field label="Nom" value={order.recipient_name} />}
                {order.recipient_country && <Field label="Pays" value={order.recipient_country} />}
                {order.recipient_phone && <Field label="Téléphone" value={order.recipient_phone} onCopy={() => copy(order.recipient_phone!, 'Téléphone copié')} />}
                {order.recipient_email && <Field label="Email" value={order.recipient_email} />}
                {order.fees !== undefined && order.fees > 0 && <Field label="Frais" value={`${order.fees} ${order.currency}`} />}
                {order.total_amount !== undefined && <Field label="Montant à recevoir" value={`${order.total_amount} ${order.to_currency || ''}`} />}
              </div>
            </Card>
          )}

          {/* HISTORIQUE */}
          <Card title="Historique" icon={<Calendar className="w-4 h-4" />}>
            <div className="space-y-2">
              <TimelineRow label="Création" date={order.created_at} icon={<Clock className="w-3.5 h-3.5 text-[#9ca3af]" />} />
              {order.processed_at && (
                <TimelineRow label="Traitement" date={order.processed_at} icon={<CheckCircle className="w-3.5 h-3.5 text-white" />} />
              )}
            </div>
          </Card>

          {/* NOTES PARSÉES — pleine largeur */}
          {parsedNotes.sections.length > 0 && (
            <div className="lg:col-span-2">
              <Card title="Détails de la commande" icon={<FileText className="w-4 h-4" />}>
                <div className="space-y-4">
                  {parsedNotes.sections.map((section, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />}
                      <div className="text-[11px] uppercase tracking-wider text-[#6b7280] mb-2.5 font-medium">
                        {section.title}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                        {section.fields.map((field, j) => (
                          <div key={j}>
                            <div className="text-[11px] uppercase tracking-wider text-[#6b7280] mb-0.5">{field.label}</div>
                            <div className="flex items-center justify-between gap-2">
                              <div className={`text-sm break-all ${field.highlight ? 'text-white font-semibold' : 'text-white font-medium'}`}>{field.value}</div>
                              {field.copyable && (
                                <button onClick={() => copy(field.value, `${field.label} copié`)} className="flex-shrink-0 p-1 rounded transition text-[#9ca3af] hover:text-white">
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* CANCELLATION FORM — pleine largeur */}
          {(order.status === 'cancelled' || showCancellationForm) && (
            <div className="lg:col-span-2">
              <Card title="Email d'annulation" icon={<MailCheck className="w-4 h-4 text-[#f87171]" />}>
                <Textarea
                  placeholder="Motif d'annulation (optionnel)…"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="bg-[#1a1a1a] border-[rgba(255,255,255,0.07)] text-white placeholder:text-[#6b7280] min-h-[80px]"
                />
                <Button
                  onClick={sendCancellationEmail}
                  disabled={sendingEmail}
                  className="w-full mt-3 border"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', borderColor: 'rgba(248,113,113,0.30)' }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {sendingEmail ? 'Envoi…' : "Envoyer l'email d'annulation"}
                </Button>
              </Card>
            </div>
          )}
          {/* JOURNAL D'ACTIVITÉ — qui a fait quoi, quand (append-only) */}
          <div className="lg:col-span-2 rounded-2xl p-4"
            style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4" style={{ color: '#9ca3af' }} />
              <p className="text-sm font-semibold text-white m-0">Journal d'activité</p>
              <span className="text-xs" style={{ color: '#6b7280' }}>{events.length} événement(s)</span>
            </div>
            {events.length === 0 ? (
              <p className="text-sm m-0" style={{ color: '#6b7280' }}>
                Aucun événement pour l'instant — les prises en charge et changements de statut apparaîtront ici.
              </p>
            ) : (
              <div className="flex flex-col">
                {events.map((ev, i) => (
                  <div key={ev.id} className="flex gap-3">
                    {/* rail */}
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: ev.action.includes('cancel') ? '#f87171' : ev.action === 'status_completed' ? '#fff' : 'rgba(255,255,255,0.45)' }} />
                      {i < events.length - 1 && <div className="w-px flex-1 my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-sm text-white m-0">
                        {EVENT_LABELS[ev.action] || ev.action}
                        {ev.actor_name && <span style={{ color: '#9ca3af' }}> — {ev.actor_name}</span>}
                      </p>
                      {ev.details && <p className="text-xs m-0 mt-0.5 break-words" style={{ color: '#6b7280' }}>{ev.details}</p>}
                      <p className="text-[11px] m-0 mt-0.5" style={{ color: '#4b5563' }}>
                        {format(new Date(ev.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STICKY FOOTER ACTIONS */}
      <div
        className="px-4 sm:px-6 py-4 sticky bottom-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#1a1a1a' }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 sm:justify-end">
          {isActive && !canAct && (
            <div className="flex-1 flex items-center justify-center sm:justify-end gap-2 text-sm py-2" style={{ color: '#9ca3af' }}>
              <Lock className="w-4 h-4" />
              {ownedByOther
                ? <>Actions verrouillées — commande traitée par <strong className="text-white">{assignedName}</strong></>
                : <>Prenez la commande en charge (bandeau ci-dessus) pour débloquer les actions</>}
            </div>
          )}
          {order.status === 'pending' && canAct && (
            <>
              <Button
                onClick={() => doStatusUpdate('processing')}
                className="flex-1 sm:flex-none sm:min-w-[180px] hover:opacity-90"
                style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
              >
                <Clock className="w-4 h-4 mr-2" /> Mettre en traitement
              </Button>
              <Button
                onClick={() => { doStatusUpdate('cancelled'); setShowCancellationForm(true); }}
                className="flex-1 sm:flex-none sm:min-w-[140px] border hover:opacity-90"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', borderColor: 'rgba(248,113,113,0.30)' }}
              >
                <XCircle className="w-4 h-4 mr-2" /> Annuler
              </Button>
            </>
          )}
          {order.status === 'processing' && canAct && (
            <>
              <Button
                onClick={() => doStatusUpdate('completed', 'paid')}
                className="flex-1 sm:flex-none sm:min-w-[180px] hover:opacity-90"
                style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Marquer comme terminé
              </Button>
              <Button
                onClick={() => { doStatusUpdate('cancelled'); setShowCancellationForm(true); }}
                className="flex-1 sm:flex-none sm:min-w-[140px] border hover:opacity-90"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', borderColor: 'rgba(248,113,113,0.30)' }}
              >
                <XCircle className="w-4 h-4 mr-2" /> Annuler
              </Button>
            </>
          )}
          {(order.status === 'completed' || order.status === 'cancelled') && (
            <div className="flex-1 text-center sm:text-right text-sm text-[#9ca3af] py-2">
              Cette commande est {order.status === 'completed' ? 'terminée' : 'annulée'}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressBlock({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#6b7280] mb-1.5">
        <Wallet className="w-3 h-3" /> {label}
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs font-mono text-white break-all">{value}</code>
        <button onClick={onCopy} className="flex-shrink-0 p-1.5 rounded transition text-[#9ca3af] hover:text-white">
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* — Sub-components — */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        {icon && <span className="text-[#9ca3af]">{icon}</span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

function ActionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Send className="w-4 h-4 text-white" />
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6b7280] font-medium">{title}</div>
          <div className="text-sm font-semibold text-white">{subtitle}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  icon,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#6b7280] mb-1">
        {icon} {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className={`text-sm text-white break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</div>
        {onCopy && value !== '—' && (
          <button
            onClick={onCopy}
            className="flex-shrink-0 p-1 rounded transition text-[#9ca3af] hover:text-white"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[#6b7280] mb-1">{label}</div>
      <div className={`text-lg font-semibold break-all text-white leading-tight ${mono ? 'font-mono text-sm' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function TimelineRow({ label, date, icon }: { label: string; date: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
        {icon}
        {label}
      </div>
      <div className="text-sm text-white font-medium">
        {format(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr })}
      </div>
    </div>
  );
}
