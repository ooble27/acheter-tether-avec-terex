import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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

  useEffect(() => {
    if (order) {
      // Fetch user profile information
      const fetchUserInfo = async () => {
        try {
          // Get user email from auth
          const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id);
          if (user?.email) {
            setUserEmail(user.email);
          }

          // Get user profile for full name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.user_id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
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
  };

  const typeInfo = getOrderTypeInfo();
  const TypeIcon = typeInfo.icon;

  const getPaymentMethodLabel = (method?: string) => {
    const methods: Record<string, string> = {
      card: 'Carte bancaire',
      mobile: 'Mobile Money',
      wave: 'Wave',
      orange_money: 'Orange Money',
      bank: 'Virement bancaire',
      bank_transfer: 'Virement bancaire',
      interac: 'Interac'
    };
    return methods[method || ''] || method || 'Non spécifié';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-terex-dark border-terex-gray">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Détails de la transaction
            </DialogTitle>
            {getStatusBadge(order.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Transaction Type & ID */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 ${typeInfo.bgColor} rounded-xl flex items-center justify-center`}>
                <TypeIcon className={`w-8 h-8 ${typeInfo.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{typeInfo.label}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-400 text-sm">#TEREX-{order.id.slice(-8)}</span>
                  <button
                    onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                    className="text-gray-400 hover:text-terex-accent transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Montant</p>
                <p className="text-2xl font-bold text-white">
                  {order.amount.toLocaleString('fr-FR')} {order.currency}
                </p>
              </div>
              {order.usdt_amount && (
                <div className="bg-terex-dark rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Montant USDT</p>
                  <p className="text-2xl font-bold text-terex-highlight">
                    {order.usdt_amount.toLocaleString('fr-FR')} USDT
                  </p>
                </div>
              )}
              {order.total_amount && (
                <div className="bg-terex-dark rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Montant Total</p>
                  <p className="text-2xl font-bold text-white">
                    {order.total_amount.toLocaleString('fr-FR')} {order.to_currency}
                  </p>
                </div>
              )}
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Taux de change</p>
                <p className="text-xl font-semibold text-terex-highlight">
                  {order.exchange_rate.toLocaleString('fr-FR')} {order.currency}/USDT
                </p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-terex-accent" />
              Informations du client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userName && (
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Nom complet</p>
                    <p className="text-white font-medium">{userName}</p>
                  </div>
                </div>
              )}
              {userEmail && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{userEmail}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">ID Client</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-mono text-xs">{order.user_id.slice(0, 16)}...</p>
                    <button
                      onClick={() => copyToClipboard(order.user_id)}
                      className="text-gray-400 hover:text-terex-accent transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Wallet Information */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-terex-accent" />
              Informations de paiement
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Méthode de paiement</p>
                  <p className="text-white font-medium">{getPaymentMethodLabel(order.payment_method)}</p>
                </div>
              </div>

              {order.payment_reference && (
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Référence de paiement</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-mono text-sm">{order.payment_reference}</p>
                      <button
                        onClick={() => copyToClipboard(order.payment_reference!)}
                        className="text-gray-400 hover:text-terex-accent transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {order.wallet_address && (
                <div className="flex items-start space-x-3">
                  <Wallet className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Adresse du portefeuille</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-mono text-sm break-all">{order.wallet_address}</p>
                      <button
                        onClick={() => copyToClipboard(order.wallet_address!)}
                        className="text-gray-400 hover:text-terex-accent transition-colors flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {order.network && (
                <div className="flex items-start space-x-3">
                  <Network className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Réseau</p>
                    <p className="text-white font-medium">{order.network}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transfer-specific Information */}
          {order.type === 'transfer' && (
            <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-terex-accent" />
                Informations du bénéficiaire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.recipient_name && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Nom du bénéficiaire</p>
                      <p className="text-white font-medium">{order.recipient_name}</p>
                    </div>
                  </div>
                )}
                {order.recipient_phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Téléphone</p>
                      <p className="text-white font-medium">{order.recipient_phone}</p>
                    </div>
                  </div>
                )}
                {order.recipient_country && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Pays</p>
                      <p className="text-white font-medium">{order.recipient_country}</p>
                    </div>
                  </div>
                )}
                {order.recipient_email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{order.recipient_email}</p>
                    </div>
                  </div>
                )}
                {order.recipient_address && (
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <Hash className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Compte/Banque</p>
                      <p className="text-white font-medium">{order.recipient_address}</p>
                    </div>
                  </div>
                )}
                {order.fees && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Frais</p>
                      <p className="text-white font-medium">{order.fees} {order.to_currency}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sell-specific Information */}
          {order.type === 'sell' && order.recipient_phone && (
            <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-terex-accent" />
                Informations de réception
              </h3>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Numéro de téléphone</p>
                  <p className="text-white font-medium">{order.recipient_phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline & Dates */}
          <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-terex-accent" />
              Historique
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">Date de création</p>
                  <p className="text-white font-medium">
                    {format(new Date(order.created_at), 'PPP à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
              {order.processed_at && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de traitement</p>
                    <p className="text-white font-medium">
                      {format(new Date(order.processed_at), 'PPP à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-terex-darker rounded-xl p-6 border border-terex-gray/50">
              <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          {order.status === 'pending' && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onStatusUpdate(order.id, 'processing')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Passer en traitement
              </Button>
              <Button
                onClick={() => onStatusUpdate(order.id, 'cancelled')}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          )}
          
          {order.status === 'processing' && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onStatusUpdate(order.id, 'completed')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marquer comme terminé
              </Button>
              <Button
                onClick={() => onStatusUpdate(order.id, 'cancelled')}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
