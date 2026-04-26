import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  TrendingDown,
  Send,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MailCheck,
  ArrowRight,
  Globe,
  CreditCard,
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

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30',
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
        return { Icon: TrendingUp, label: 'Achat USDT', accent: 'text-terex-accent', bg: 'bg-terex-accent/15' };
      case 'sell':
        return { Icon: TrendingDown, label: 'Vente USDT', accent: 'text-orange-400', bg: 'bg-orange-500/15' };
      case 'transfer':
        return { Icon: Send, label: 'Transfert international', accent: 'text-purple-400', bg: 'bg-purple-500/15' };
      default:
        return { Icon: Hash, label: 'Transaction', accent: 'text-gray-400', bg: 'bg-gray-500/15' };
    }
  })();

  const copy = (value: string, label = 'Copié') => {
    navigator.clipboard.writeText(value);
    toast({ title: label, description: value.length > 40 ? `${value.slice(0, 40)}…` : value });
  };

  const statusBadge = (status: string) => (
    <Badge variant="outline" className={STATUS_STYLES[status] || 'bg-gray-500/10 text-gray-400'}>
      {STATUS_LABELS[status] || status}
    </Badge>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-terex-darker border-terex-gray/40 p-0">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-terex-darker/95 backdrop-blur border-b border-terex-gray/30 px-6 py-5">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${orderTypeMeta.bg}`}>
                  <Icon className={`w-5 h-5 ${orderTypeMeta.accent}`} />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-white tracking-tight">
                    {orderTypeMeta.label}
                  </DialogTitle>
                  <button
                    onClick={() => copy(`TEREX-${order.id.slice(-8).toUpperCase()}`, 'Référence copiée')}
                    className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400 hover:text-terex-accent transition"
                  >
                    <Hash className="w-3 h-3" />
                    TEREX-{order.id.slice(-8).toUpperCase()}
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {statusBadge(order.status)}
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* CLIENT — toujours en premier, toujours visible */}
          <Card title="Client" icon={<User className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field icon={<User className="w-3.5 h-3.5" />} label="Nom complet" value={userName || '—'} />
              <Field
                icon={<Mail className="w-3.5 h-3.5" />}
                label="Email"
                value={userEmail || '—'}
                onCopy={userEmail ? () => copy(userEmail, 'Email copié') : undefined}
              />
              <Field
                icon={<Phone className="w-3.5 h-3.5" />}
                label="Téléphone"
                value={userPhone || '—'}
                onCopy={userPhone ? () => copy(userPhone, 'Téléphone copié') : undefined}
              />
              <Field
                icon={<Hash className="w-3.5 h-3.5" />}
                label="ID utilisateur"
                value={`${order.user_id.slice(0, 8)}…${order.user_id.slice(-4)}`}
                mono
                onCopy={() => copy(order.user_id, 'ID copié')}
              />
            </div>
          </Card>

          {/* ACTION REQUISE */}
          {order.type === 'buy' && order.status !== 'completed' && order.status !== 'cancelled' && (
            <ActionCard
              title="Action à effectuer"
              subtitle="Envoyer l'USDT au wallet du client"
              accent="terex"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Stat label="Montant USDT" value={`${order.usdt_amount} USDT`} accent />
                <Stat label="Réseau" value={order.network || 'TRC20'} />
              </div>
              {order.wallet_address && (
                <div className="bg-terex-darker/60 border border-terex-accent/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                    <Wallet className="w-3 h-3" /> Adresse de réception
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono text-white break-all">
                      {order.wallet_address}
                    </code>
                    <button
                      onClick={() => copy(order.wallet_address!, 'Adresse copiée')}
                      className="flex-shrink-0 p-1.5 hover:bg-terex-accent/20 rounded transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-terex-accent" />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-400">
                <AlertCircle className="w-3.5 h-3.5 text-terex-accent mt-0.5 flex-shrink-0" />
                <p>
                  Le client a payé <span className="text-white font-medium">{order.amount.toLocaleString()} {order.currency}</span> via{' '}
                  <span className="text-white font-medium">{PAYMENT_LABELS[order.payment_method || ''] || order.payment_method}</span> au taux de{' '}
                  <span className="text-terex-accent font-medium">{order.exchange_rate} {order.currency}/USDT</span>.
                </p>
              </div>
            </ActionCard>
          )}

          {order.type === 'sell' && order.status !== 'completed' && order.status !== 'cancelled' && (
            <ActionCard
              title="Action à effectuer"
              subtitle="Envoyer les fonds au client"
              accent="orange"
            >
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Montant à envoyer" value={`${order.amount.toLocaleString()} ${order.currency}`} accent />
                <Stat
                  label="Méthode"
                  value={PAYMENT_LABELS[order.payment_method || ''] || order.payment_method || '—'}
                />
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-400">
                <AlertCircle className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                <p>
                  Le client envoie <span className="text-white font-medium">{order.usdt_amount} USDT</span> au taux de{' '}
                  <span className="text-orange-400 font-medium">{order.exchange_rate} {order.currency}/USDT</span>.
                </p>
              </div>
            </ActionCard>
          )}

          {/* TRANSACTION */}
          <Card title="Transaction" icon={<ArrowRight className="w-4 h-4" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label={`Montant ${order.currency}`} value={order.amount.toLocaleString()} />
              <Stat label="USDT" value={String(order.usdt_amount || 0)} accent />
              <Stat label="Taux" value={String(order.exchange_rate)} />
              {order.payment_method && (
                <Stat
                  label="Méthode de paiement"
                  value={PAYMENT_LABELS[order.payment_method] || order.payment_method}
                />
              )}
              {order.network && <Stat label="Réseau blockchain" value={order.network} />}
              {order.payment_reference && (
                <Stat label="Référence paiement" value={order.payment_reference} mono />
              )}
            </div>
          </Card>

          {/* DESTINATION (achat) */}
          {order.type === 'buy' && order.wallet_address && (
            <Card title="Destination crypto" icon={<Wallet className="w-4 h-4" />}>
              <div className="bg-terex-dark/60 border border-terex-gray/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1.5">Adresse wallet ({order.network || 'TRC20'})</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-white break-all">
                    {order.wallet_address}
                  </code>
                  <button
                    onClick={() => copy(order.wallet_address!, 'Adresse copiée')}
                    className="flex-shrink-0 p-1.5 hover:bg-terex-accent/20 rounded transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-terex-accent" />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* TRANSFERT INTERNATIONAL */}
          {order.type === 'transfer' && (
            <Card title="Bénéficiaire du transfert" icon={<Globe className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.recipient_name && <Field label="Nom" value={order.recipient_name} />}
                {order.recipient_country && <Field label="Pays" value={order.recipient_country} />}
                {order.recipient_phone && (
                  <Field
                    label="Téléphone"
                    value={order.recipient_phone}
                    onCopy={() => copy(order.recipient_phone!, 'Téléphone copié')}
                  />
                )}
                {order.recipient_email && <Field label="Email" value={order.recipient_email} />}
                {order.fees !== undefined && order.fees > 0 && (
                  <Field label="Frais" value={`${order.fees} ${order.currency}`} />
                )}
                {order.total_amount !== undefined && (
                  <Field
                    label="Montant à recevoir"
                    value={`${order.total_amount} ${order.to_currency || ''}`}
                  />
                )}
              </div>
            </Card>
          )}

          {/* NOTES PARSÉES */}
          {parsedNotes.sections.length > 0 && (
            <Card title="Détails de la commande" icon={<FileText className="w-4 h-4" />}>
              <div className="space-y-4">
                {parsedNotes.sections.map((section, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="bg-terex-gray/30 mb-4" />}
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2.5 font-medium">
                      {section.title}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {section.fields.map((field, j) => (
                        <div
                          key={j}
                          className={`bg-terex-dark/50 border border-terex-gray/20 rounded-md px-3 py-2 ${
                            field.highlight ? 'ring-1 ring-terex-accent/30' : ''
                          }`}
                        >
                          <div className="text-[11px] text-gray-500 mb-0.5">{field.label}</div>
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className={`text-sm font-medium break-all ${
                                field.highlight ? 'text-terex-accent' : 'text-white'
                              }`}
                            >
                              {field.value}
                            </div>
                            {field.copyable && (
                              <button
                                onClick={() => copy(field.value, `${field.label} copié`)}
                                className="flex-shrink-0 p-1 hover:bg-terex-gray/40 rounded transition"
                              >
                                <Copy className="w-3 h-3 text-gray-400" />
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
          )}

          {/* HISTORIQUE */}
          <Card title="Historique" icon={<Calendar className="w-4 h-4" />}>
            <div className="space-y-2">
              <TimelineRow
                label="Création"
                date={order.created_at}
                icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
              />
              {order.processed_at && (
                <TimelineRow
                  label="Traitement"
                  date={order.processed_at}
                  icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                />
              )}
            </div>
          </Card>

          {/* CANCELLATION FORM */}
          {(order.status === 'cancelled' || showCancellationForm) && (
            <Card title="Email d'annulation" icon={<MailCheck className="w-4 h-4 text-red-400" />}>
              <Textarea
                placeholder="Motif d'annulation (optionnel)…"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="bg-terex-dark border-terex-gray/40 text-white placeholder:text-gray-500 min-h-[80px]"
              />
              <Button
                onClick={sendCancellationEmail}
                disabled={sendingEmail}
                className="w-full mt-3 bg-red-600 hover:bg-red-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                {sendingEmail ? 'Envoi…' : "Envoyer l'email d'annulation"}
              </Button>
            </Card>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="sticky bottom-0 bg-terex-darker/95 backdrop-blur border-t border-terex-gray/30 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {order.status === 'pending' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'processing')}
                  className="flex-1 min-w-[140px] bg-terex-accent hover:bg-terex-accent/90"
                >
                  <Clock className="w-4 h-4 mr-2" /> Mettre en traitement
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate(order.id, 'cancelled');
                    setShowCancellationForm(true);
                  }}
                  variant="destructive"
                  className="flex-1 min-w-[140px]"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Annuler
                </Button>
              </>
            )}
            {order.status === 'processing' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'completed', 'paid')}
                  className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Marquer comme terminé
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate(order.id, 'cancelled');
                    setShowCancellationForm(true);
                  }}
                  variant="destructive"
                  className="flex-1 min-w-[140px]"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Annuler
                </Button>
              </>
            )}
            {(order.status === 'completed' || order.status === 'cancelled') && (
              <div className="flex-1 text-center text-sm text-gray-400 py-2">
                Cette commande est {order.status === 'completed' ? 'terminée' : 'annulée'}.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    <section className="bg-terex-dark/40 border border-terex-gray/30 rounded-xl p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        {icon && <span className="text-terex-accent">{icon}</span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

function ActionCard({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: 'terex' | 'orange';
  children: React.ReactNode;
}) {
  const styles =
    accent === 'terex'
      ? 'border-terex-accent/40 bg-gradient-to-br from-terex-accent/10 to-transparent'
      : 'border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-transparent';
  const iconColor = accent === 'terex' ? 'text-terex-accent' : 'text-orange-400';
  return (
    <section className={`border rounded-xl p-5 ${styles}`}>
      <div className="flex items-center gap-2 mb-3">
        <Send className={`w-4 h-4 ${iconColor}`} />
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">{title}</div>
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
    <div className="bg-terex-dark/50 border border-terex-gray/20 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
        {icon} {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className={`text-sm text-white break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</div>
        {onCopy && value !== '—' && (
          <button
            onClick={onCopy}
            className="flex-shrink-0 p-1 hover:bg-terex-gray/40 rounded transition"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="bg-terex-dark/50 border border-terex-gray/20 rounded-lg px-3 py-2.5">
      <div className="text-[11px] text-gray-500 mb-1">{label}</div>
      <div
        className={`text-base font-semibold break-all ${
          accent ? 'text-terex-accent' : 'text-white'
        } ${mono ? 'font-mono text-sm' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}

function TimelineRow({ label, date, icon }: { label: string; date: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between bg-terex-dark/50 border border-terex-gray/20 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {icon}
        {label}
      </div>
      <div className="text-sm text-white font-medium">
        {format(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr })}
      </div>
    </div>
  );
}
