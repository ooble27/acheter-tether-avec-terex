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
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des transactions</CardTitle>
        <CardDescription>
          Les 50 dernières transactions via l'API
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune transaction pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>USDT</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-sm">
                      {tx.reference_number}
                    </TableCell>
                    <TableCell>
                      {tx.amount.toLocaleString()} {tx.currency}
                    </TableCell>
                    <TableCell>
                      {tx.usdt_amount} USDT
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tx.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
