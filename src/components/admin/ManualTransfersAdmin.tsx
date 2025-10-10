import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface PendingTransfer {
  id: string;
  type: string;
  amount: number;
  usdt_amount: number;
  wallet_address: string;
  network: string;
  payment_status: string;
  payment_reference?: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

export function ManualTransfersAdmin() {
  const [pendingBuyOrders, setPendingBuyOrders] = useState<PendingTransfer[]>([]);
  const [pendingSellOrders, setPendingSellOrders] = useState<PendingTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTransfers();
  }, []);

  const fetchPendingTransfers = async () => {
    try {
      // Récupérer les commandes avec paiement confirmé OU en attente de vérification
      const { data: buyOrders, error: buyError } = await supabase
        .from('orders')
        .select('id, type, amount, usdt_amount, wallet_address, network, payment_status, payment_reference, created_at, user_id')
        .eq('type', 'buy')
        .in('payment_status', ['confirmed', 'pending'])
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      const { data: sellOrders, error: sellError } = await supabase
        .from('orders')
        .select('id, type, amount, usdt_amount, wallet_address, network, payment_status, payment_reference, created_at, user_id')
        .eq('type', 'sell')
        .in('payment_status', ['confirmed', 'pending'])
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (buyError) throw buyError;
      if (sellError) throw sellError;

      // Fetch user names separately
      const buyOrdersWithNames = await Promise.all(
        (buyOrders || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.user_id)
            .single();
          
          return {
            ...order,
            user_name: profile?.full_name || 'N/A'
          };
        })
      );

      const sellOrdersWithNames = await Promise.all(
        (sellOrders || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.user_id)
            .single();
          
          return {
            ...order,
            user_name: profile?.full_name || 'N/A'
          };
        })
      );

      setPendingBuyOrders(buyOrdersWithNames);
      setPendingSellOrders(sellOrdersWithNames);
    } catch (error) {
      console.error('Error fetching pending transfers:', error);
      toast.error('Erreur lors du chargement des transferts');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copié!');
  };

  const checkPaymentStatus = async (orderId: string, paymentReference?: string) => {
    if (!paymentReference) {
      toast.error('Aucune référence de paiement NabooPay');
      return;
    }

    setCheckingPayment(orderId);
    try {
      const { data, error } = await supabase.functions.invoke('naboopay-check-status', {
        body: { naboopayOrderId: paymentReference }
      });

      if (error) throw error;

      console.log('NabooPay status response:', data);

      const status = data?.transactionData?.transaction_status;
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        // Mettre à jour directement dans la base de données
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'confirmed',
            status: 'processing',
            processed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
          toast.error('Erreur lors de la mise à jour');
        } else {
          toast.success('✅ Paiement confirmé! La commande est maintenant validée.');
          await fetchPendingTransfers();
        }
      } else {
        toast.warning(`⏳ Paiement en attente - Statut: ${status || 'inconnu'}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Erreur lors de la vérification du paiement');
    } finally {
      setCheckingPayment(null);
    }
  };

  const markAsCompleted = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Transfert marqué comme complété');
      fetchPendingTransfers();
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Achats USDT - Transferts manuels à effectuer</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPendingTransfers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pendingBuyOrders.length === 0 ? (
            <p className="text-muted-foreground">Aucun transfert en attente</p>
          ) : (
            <div className="space-y-4">
              {pendingBuyOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{order.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={order.payment_status === 'confirmed' ? 'default' : 'secondary'}>
                        {order.payment_status === 'confirmed' ? 'Payé' : 'En attente'}
                      </Badge>
                      <Badge>{order.network}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Montant payé</p>
                      <p className="font-medium">{order.amount} XOF</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">USDT à envoyer</p>
                      <p className="font-medium">{order.usdt_amount} USDT</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Adresse de destination:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                        {order.wallet_address}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(order.wallet_address, order.id)}
                      >
                        {copiedId === order.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.payment_status === 'pending' && order.payment_reference && (
                      <Button
                        variant="outline"
                        onClick={() => checkPaymentStatus(order.id, order.payment_reference)}
                        disabled={checkingPayment === order.id}
                        className="flex-1"
                      >
                        {checkingPayment === order.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Vérifier le paiement
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => markAsCompleted(order.id)}
                      className={order.payment_status === 'pending' ? 'flex-1' : 'w-full'}
                      disabled={order.payment_status === 'pending'}
                    >
                      Marquer comme envoyé
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ventes USDT - Paiements manuels à effectuer</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSellOrders.length === 0 ? (
            <p className="text-muted-foreground">Aucun paiement en attente</p>
          ) : (
            <div className="space-y-4">
              {pendingSellOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{order.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant="secondary">{order.network}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">USDT reçus</p>
                      <p className="font-medium">{order.usdt_amount} USDT</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">À payer via Mobile Money</p>
                      <p className="font-medium">{order.amount} XOF</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => markAsCompleted(order.id)}
                    className="w-full"
                  >
                    Marquer comme payé
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
