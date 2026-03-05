import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UnifiedOrder } from '@/hooks/useOrders';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Wallet,
  Network,
  Hash,
  TrendingUp,
  TrendingDown,
  Send,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MailCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderDetailsDialogProps {
  order: UnifiedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange, onStatusUpdate }: OrderDetailsDialogProps) {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (order) {
      const fetchUserInfo = async () => {
        try {
          const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id);
          if (user?.email) {
            setUserEmail(user.email);
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', order.user_id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
          }
          if (profile?.phone) {
            setUserPhone(profile.phone);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      fetchUserInfo();
    }
  }, [order]);

  if (!order) return null;

  const getOrderTypeInfo = () => {
    switch (order.type) {
      case 'buy':
        return {
          icon: TrendingUp,
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          label: 'Achat USDT'
        };
      case 'sell':
        return {
          icon: TrendingDown,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          label: 'Vente USDT'
        };
      case 'transfer':
        return {
          icon: Send,
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          label: 'Transfert International'
        };
      default:
        return {
          icon: Hash,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/20',
          label: 'Transaction'
        };
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const statusLabels = {
      pending: 'En attente',
      processing: 'En traitement',
      completed: 'Terminé',
      cancelled: 'Annulé',
      failed: 'Échoué'
    };

    return (
      <Badge 
        variant="outline" 
        className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500/10 text-gray-500'}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Texte copié dans le presse-papier",
    });
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      card: 'Carte bancaire',
      mobile: 'Mobile Money',
      wave: 'Wave',
      orange_money: 'Orange Money',
      bank: 'Virement bancaire',
      bank_transfer: 'Virement bancaire',
      interac: 'Interac'
    };
    return method ? labels[method] || method : 'Non spécifié';
  };

  const orderType = getOrderTypeInfo();
  const OrderIcon = orderType.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-terex-dark border-terex-gray">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${orderType.bgColor} rounded-xl flex items-center justify-center`}>
                <OrderIcon className={`w-6 h-6 ${orderType.color}`} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {orderType.label}
                </DialogTitle>
                <p className="text-gray-400 text-sm">
                  Référence: TEREX-{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Action à effectuer - Section principale */}
          {order.type === 'buy' && (
            <div className="bg-gradient-to-br from-terex-accent/10 via-terex-dark to-terex-dark border-2 border-terex-accent/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Action à effectuer</h3>
              </div>
              
              <div className="bg-terex-darker/50 backdrop-blur rounded-xl p-5 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💸</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg mb-2">Envoyer l'USDT au client</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-terex-dark/50 rounded-lg p-3">
                        <span className="text-gray-400">Montant à envoyer</span>
                        <span className="text-2xl font-bold text-terex-accent">{order.usdt_amount} USDT</span>
                      </div>
                      <div className="flex items-center justify-between bg-terex-dark/50 rounded-lg p-3">
                        <span className="text-gray-400">Réseau blockchain</span>
                        <span className="text-white font-semibold">{order.network || 'TRC20'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.wallet_address && (
                  <div className="bg-terex-dark rounded-xl p-4 border border-terex-accent/20">
                    <p className="text-gray-400 text-sm mb-2 flex items-center">
                      <Wallet className="w-4 h-4 mr-2" />
                      Adresse de destination du client
                    </p>
                    <div className="flex items-center space-x-2 bg-terex-darker/50 p-3 rounded-lg">
                      <code className="text-white font-mono text-sm flex-1 break-all">{order.wallet_address}</code>
                      <button
                        onClick={() => copyToClipboard(order.wallet_address!)}
                        className="flex-shrink-0 p-2 hover:bg-terex-accent/20 rounded-lg transition-colors"
                      >
                        <Copy className="w-5 h-5 text-terex-accent" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-terex-accent/5 border border-terex-accent/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-terex-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-300">
                        Le client a payé <span className="text-white font-bold">{order.amount.toLocaleString()} {order.currency}</span> via <span className="text-white font-semibold">{getPaymentMethodLabel(order.payment_method)}</span>
                      </p>
                      <p className="text-gray-400 mt-1">
                        Taux appliqué: <span className="text-terex-accent font-semibold">{order.exchange_rate} {order.currency}/USDT</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.type === 'sell' && (
            <div className="bg-gradient-to-br from-blue-500/10 via-terex-dark to-terex-dark border-2 border-blue-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Action à effectuer</h3>
              </div>
              
              <div className="bg-terex-darker/50 backdrop-blur rounded-xl p-5 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg mb-2">Envoyer les fonds au client</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-terex-dark/50 rounded-lg p-3">
                        <span className="text-gray-400">Montant à envoyer</span>
                        <span className="text-2xl font-bold text-blue-400">{order.amount.toLocaleString()} {order.currency}</span>
                      </div>
                      <div className="flex items-center justify-between bg-terex-dark/50 rounded-lg p-3">
                        <span className="text-gray-400">Méthode de paiement</span>
                        <span className="text-white font-semibold">{getPaymentMethodLabel(order.payment_method)}</span>
                      </div>
                      {order.recipient_phone && (
                        <div className="bg-terex-dark rounded-xl p-4 border border-blue-500/20">
                          <p className="text-gray-400 text-sm mb-2 flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Numéro du client pour le transfert
                          </p>
                          <div className="flex items-center space-x-2 bg-terex-darker/50 p-3 rounded-lg">
                            <code className="text-white font-mono text-lg flex-1">{order.recipient_phone}</code>
                            <button
                              onClick={() => copyToClipboard(order.recipient_phone!)}
                              className="flex-shrink-0 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              <Copy className="w-5 h-5 text-blue-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-300">
                        Le client nous envoie <span className="text-white font-bold">{order.usdt_amount} USDT</span> sur notre adresse
                      </p>
                      <p className="text-gray-400 mt-1">
                        Taux appliqué: <span className="text-blue-400 font-semibold">{order.exchange_rate} {order.currency}/USDT</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations du client */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-terex-accent" />
              Informations du client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-dark rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Nom complet</span>
                </div>
                <p className="text-white font-semibold text-lg">{userName || 'Non renseigné'}</p>
              </div>

              <div className="bg-terex-dark rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Email</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{userEmail || 'Non renseigné'}</p>
                  {userEmail && (
                    <button
                      onClick={() => copyToClipboard(userEmail)}
                      className="p-1 hover:bg-terex-gray/30 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-terex-dark rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Téléphone</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{userPhone || 'Non renseigné'}</p>
                  {userPhone && (
                    <button
                      onClick={() => copyToClipboard(userPhone)}
                      className="p-1 hover:bg-terex-gray/30 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-terex-dark rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">ID Client</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white font-mono text-xs">{order.user_id.slice(0, 16)}...</p>
                  <button
                    onClick={() => copyToClipboard(order.user_id)}
                    className="p-1 hover:bg-terex-gray/30 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Détails de la transaction */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Hash className="w-5 h-5 mr-2 text-terex-accent" />
              Détails de la transaction
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Montant {order.currency}</p>
                <p className="text-white font-bold text-xl">{order.amount.toLocaleString()}</p>
              </div>
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Montant USDT</p>
                <p className="text-terex-accent font-bold text-xl">{order.usdt_amount}</p>
              </div>
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Taux de change</p>
                <p className="text-white font-semibold">{order.exchange_rate}</p>
              </div>
            </div>
          </div>

          {/* Transfert international details */}
          {order.type === 'transfer' && (
            <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-purple-500" />
                Détails du transfert international
              </h3>
              <div className="space-y-3">
                {order.recipient_name && (
                  <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                    <span className="text-gray-400">Bénéficiaire</span>
                    <span className="text-white font-medium">{order.recipient_name}</span>
                  </div>
                )}
                {order.recipient_country && (
                  <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                    <span className="text-gray-400">Pays</span>
                    <span className="text-white font-medium">{order.recipient_country}</span>
                  </div>
                )}
                {order.recipient_phone && (
                  <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                    <span className="text-gray-400">Téléphone</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{order.recipient_phone}</span>
                      <button
                        onClick={() => copyToClipboard(order.recipient_phone!)}
                        className="text-gray-400 hover:text-terex-accent"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                {order.fees && (
                  <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                    <span className="text-gray-400">Frais</span>
                    <span className="text-white font-medium">{order.fees} {order.currency}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-terex-accent" />
              Historique
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                <span className="text-gray-400">Date de création</span>
                <span className="text-white font-medium">
                  {format(new Date(order.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
              {order.processed_at && (
                <div className="flex items-center justify-between bg-terex-dark rounded-lg p-3">
                  <span className="text-gray-400">Date de traitement</span>
                  <span className="text-white font-medium">
                    {format(new Date(order.processed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
              <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-terex-gray/50">
            {/* Cancellation email form */}
            {(order.status === 'cancelled' || showCancellationForm) && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-red-400" />
                  Envoyer un email d'annulation au client
                </h4>
                <Textarea
                  placeholder="Motif d'annulation (optionnel)..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-500 min-h-[80px]"
                />
                <Button
                  onClick={async () => {
                    setSendingEmail(true);
                    try {
                      const { error } = await supabase.functions.invoke('send-email-notification', {
                        body: {
                          userId: order.user_id,
                          orderId: order.id,
                          emailAddress: null,
                          emailType: 'cancellation_confirmation',
                          transactionType: order.type,
                          orderData: {
                            ...order,
                            cancellation_reason: cancellationReason,
                            status: 'cancelled'
                          }
                        }
                      });
                      if (error) throw error;
                      toast({
                        title: "Email envoyé",
                        description: "Le client a reçu la confirmation d'annulation",
                      });
                      setShowCancellationForm(false);
                      setCancellationReason('');
                    } catch (err) {
                      console.error('Erreur envoi email annulation:', err);
                      toast({
                        title: "Erreur",
                        description: "Impossible d'envoyer l'email",
                        variant: "destructive"
                      });
                    } finally {
                      setSendingEmail(false);
                    }
                  }}
                  disabled={sendingEmail}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {sendingEmail ? 'Envoi en cours...' : 'Envoyer l\'email d\'annulation'}
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
            {order.status === 'pending' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'processing')}
                  className="flex-1 bg-terex-accent hover:bg-terex-accent/80"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mettre en traitement
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate(order.id, 'cancelled');
                    setShowCancellationForm(true);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
            
            {order.status === 'processing' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(order.id, 'completed', 'paid')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer comme terminé
                </Button>
                <Button
                  onClick={() => {
                    onStatusUpdate(order.id, 'cancelled');
                    setShowCancellationForm(true);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}