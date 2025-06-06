
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { useTerexPayments } from '@/hooks/useTerexPayments';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const PaymentsList = () => {
  const { payments, loading, refreshPayments } = useTerexPayments();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const },
      confirmed: { label: "Confirmé", variant: "default" as const },
      completed: { label: "Complété", variant: "default" as const },
      failed: { label: "Échoué", variant: "destructive" as const },
      refunded: { label: "Remboursé", variant: "outline" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: "secondary" as const };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    toast({
      title: "Référence copiée",
      description: "Référence de paiement copiée dans le presse-papiers",
    });
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="text-white">Chargement des paiements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Historique des paiements</CardTitle>
            <CardDescription className="text-gray-400">
              Liste de tous vos paiements Terex Pay
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPayments}
            className="border-gray-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucun paiement trouvé</p>
            <p className="text-sm text-gray-500 mt-2">
              Créez votre premier paiement pour commencer
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Référence</TableHead>
                  <TableHead className="text-gray-300">Montant</TableHead>
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300">Statut</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-900 px-2 py-1 rounded">
                          {payment.reference_number}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyReference(payment.reference_number)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">
                          {payment.amount} {payment.currency}
                        </div>
                        <div className="text-sm text-gray-400">
                          {payment.usdt_amount.toFixed(6)} USDT
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        {payment.customer_email ? (
                          <div className="text-sm">{payment.customer_email}</div>
                        ) : (
                          <span className="text-gray-500">Anonyme</span>
                        )}
                        {payment.customer_phone && (
                          <div className="text-xs text-gray-400">{payment.customer_phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(payment.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </div>
                      {payment.paid_at && (
                        <div className="text-xs text-green-400">
                          Payé {formatDistanceToNow(new Date(payment.paid_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`https://pay.terex.com/${payment.reference_number}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
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
};
