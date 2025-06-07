
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { CircleDollarSign, ArrowUp, ArrowDown, ArrowLeftRight, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  currency: string;
  usdtAmount?: string;
  fiatAmount?: string;
  receiveCurrency?: string;
  network: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  date: string;
  recipient_name?: string;
  recipient_phone?: string;
  payment_method?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock },
      confirmed: { label: 'Confirmée', variant: 'default', icon: CheckCircle },
      completed: { label: 'Terminée', variant: 'default', icon: CheckCircle },
      failed: { label: 'Échouée', variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDown className="w-4 h-4 text-green-500" />;
      case 'sell':
        return <ArrowUp className="w-4 h-4 text-blue-500" />;
      case 'transfer':
        return <ArrowLeftRight className="w-4 h-4 text-purple-500" />;
      default:
        return <ArrowDown className="w-4 h-4 text-green-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Achat';
      case 'sell':
        return 'Vente';
      case 'transfer':
        return 'Transfert';
      default:
        return 'Achat';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white">Historique des transactions</CardTitle>
          <CardDescription className="text-gray-400">
            Consultez toutes vos transactions passées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">Aucune transaction pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Historique des transactions</CardTitle>
            <CardDescription className="text-gray-400">
              Consultez toutes vos transactions passées
            </CardDescription>
          </CardHeader>
        </Card>

        {transactions.map((transaction) => (
          <Card key={transaction.id} className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-white font-medium">
                      {getTransactionLabel(transaction.type)}
                    </span>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant:</span>
                    <span className="text-white">
                      {transaction.amount} {transaction.currency}
                    </span>
                  </div>
                  
                  {transaction.type === 'buy' && transaction.usdtAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">USDT reçu:</span>
                      <div className="flex items-center space-x-1">
                        <CircleDollarSign className="w-4 h-4 text-terex-accent" />
                        <span className="text-terex-accent">{transaction.usdtAmount} USDT</span>
                      </div>
                    </div>
                  )}

                  {(transaction.type === 'sell' || transaction.type === 'transfer') && transaction.fiatAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Montant reçu:</span>
                      <span className="text-white">
                        {transaction.fiatAmount} {transaction.receiveCurrency}
                      </span>
                    </div>
                  )}

                  {transaction.type === 'transfer' && transaction.recipient_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Destinataire:</span>
                      <span className="text-white">{transaction.recipient_name}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Réseau:</span>
                    <span className="text-white">{transaction.network}</span>
                  </div>

                  {transaction.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Adresse:</span>
                      <span className="text-white text-xs">{transaction.address}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white text-sm">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white">Historique des transactions</CardTitle>
        <CardDescription className="text-gray-400">
          Consultez toutes vos transactions passées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-terex-gray">
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Montant</TableHead>
              <TableHead className="text-gray-300">USDT/Reçu</TableHead>
              <TableHead className="text-gray-300">Réseau</TableHead>
              <TableHead className="text-gray-300">Statut</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-terex-gray hover:bg-terex-gray/20">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-white">
                      {getTransactionLabel(transaction.type)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {transaction.amount} {transaction.currency}
                </TableCell>
                <TableCell>
                  {transaction.type === 'buy' && transaction.usdtAmount ? (
                    <div className="flex items-center space-x-1">
                      <CircleDollarSign className="w-4 h-4 text-terex-accent" />
                      <span className="text-terex-accent">{transaction.usdtAmount} USDT</span>
                    </div>
                  ) : transaction.fiatAmount ? (
                    <span className="text-white">{transaction.fiatAmount} {transaction.receiveCurrency}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-white">{transaction.network}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-white text-sm">{formatDate(transaction.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
