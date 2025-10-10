import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

interface PendingTransfer {
  id: string;
  type: string;
  amount: number;
  usdt_amount: number;
  wallet_address: string;
  network: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

export function ManualTransfersAdmin() {
  const [pendingBuyOrders, setPendingBuyOrders] = useState<PendingTransfer[]>([]);
  const [pendingSellOrders, setPendingSellOrders] = useState<PendingTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTransfers();
  }, []);

  const fetchPendingTransfers = async () => {
    try {
      const { data: buyOrders, error: buyError } = await supabase
        .from('orders')
        .select('id, type, amount, usdt_amount, wallet_address, network, payment_status, created_at, user_id')
        .eq('type', 'buy')
        .eq('payment_status', 'confirmed')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      const { data: sellOrders, error: sellError } = await supabase
        .from('orders')
        .select('id, type, amount, usdt_amount, wallet_address, network, payment_status, created_at, user_id')
        .eq('type', 'sell')
        .eq('payment_status', 'confirmed')
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
          <CardTitle>Achats USDT - Transferts manuels à effectuer</CardTitle>
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
                    <Badge>{order.network}</Badge>
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

                  <Button
                    onClick={() => markAsCompleted(order.id)}
                    className="w-full"
                  >
                    Marquer comme envoyé
                  </Button>
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
