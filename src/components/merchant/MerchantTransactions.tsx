import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MerchantTransactionsProps {
  merchantId: string;
}

export function MerchantTransactions({ merchantId }: MerchantTransactionsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [merchantId]);

  const loadTransactions = async () => {
    const { data, error } = await supabase
      .from('terex_payments')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      expired: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <p className="text-gray-600">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-black">Historique des transactions</CardTitle>
        <CardDescription className="text-gray-600">
          Les 50 dernières transactions via l'API
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            Aucune transaction pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-black">Référence</TableHead>
                  <TableHead className="text-black">Montant</TableHead>
                  <TableHead className="text-black">USDT</TableHead>
                  <TableHead className="text-black">Statut</TableHead>
                  <TableHead className="text-black">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-mono text-sm text-black">
                      {tx.reference_number}
                    </TableCell>
                    <TableCell className="text-black">
                      {tx.amount.toLocaleString()} {tx.currency}
                    </TableCell>
                    <TableCell className="text-black">
                      {tx.usdt_amount} USDT
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tx.status)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDistanceToNow(new Date(tx.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
