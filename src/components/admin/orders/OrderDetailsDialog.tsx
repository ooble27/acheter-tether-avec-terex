import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Globe,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { parseOrderNotes } from '@/lib/orderNotesParser';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderDetailsDialogProps {
  order: UnifiedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusUpdate,
}: OrderDetailsDialogProps) {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.admin.getUserById(order.user_id);
        if (!cancelled && data?.user?.email) setUserEmail(data.user.email);
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', order.user_id)
          .single();
        if (!cancelled) {
          setUserName(profile?.full_name || '');
          setUserPhone(profile?.phone || '');
        }
      } catch (e) {
        console.error('Error fetching user info:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [order]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white w-[calc(100vw-1rem)] max-w-3xl lg:max-w-5xl h-[92vh] sm:h-auto sm:max-h-[92vh] p-0 overflow-hidden flex flex-col gap-0">
        {/* HEADER */}
        <div
          className="px-5 sm:px-6 py-4 sm:py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <DialogHeader className="space-y-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-lg font-semibold text-white tracking-tight leading-tight">
                    {orderTypeMeta.label}
                  </DialogTitle>
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
          </DialogHeader>
        </div>

        {/* BODY — scrollable, 2 colonnes sur desktop */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {section.fields.map((field, j) => (
                            <div
                              key={j}
                              className="rounded-xl px-3 py-2"
                              style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: field.highlight ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
                              }}
                            >
                              <div className="text-[11px] uppercase tracking-wider text-[#6b7280] mb-0.5">{field.label}</div>
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium break-all text-white">{field.value}</div>
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
                    className="bg-[#141414] border-[rgba(255,255,255,0.07)] text-white placeholder:text-[#6b7280] min-h-[80px]"
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
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div
          className="px-5 sm:px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {order.status === 'pending' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'processing')}
                  className="flex-1 sm:flex-none sm:min-w-[180px] hover:opacity-90"
                  style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
                >
                  <Clock className="w-4 h-4 mr-2" /> Mettre en traitement
                </Button>
                <Button
                  onClick={() => { onStatusUpdate(order.id, 'cancelled'); setShowCancellationForm(true); }}
                  className="flex-1 sm:flex-none sm:min-w-[140px] border hover:opacity-90"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', borderColor: 'rgba(248,113,113,0.30)' }}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Annuler
                </Button>
              </>
            )}
            {order.status === 'processing' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'completed', 'paid')}
                  className="flex-1 sm:flex-none sm:min-w-[180px] hover:opacity-90"
                  style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Marquer comme terminé
                </Button>
                <Button
                  onClick={() => { onStatusUpdate(order.id, 'cancelled'); setShowCancellationForm(true); }}
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
      </DialogContent>
    </Dialog>
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
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
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
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="text-[11px] uppercase tracking-wider text-[#6b7280] mb-1">{label}</div>
      <div className={`text-base font-semibold break-all text-white ${mono ? 'font-mono text-sm' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function TimelineRow({ label, date, icon }: { label: string; date: string; icon: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
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
