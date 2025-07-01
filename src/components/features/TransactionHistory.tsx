
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransactionDetails } from './TransactionDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowUp, ArrowDown, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

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

// Logo USDT component
const USDTLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>En attente</span>
          </Badge>
        );
      case 'confirmed':
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center space-x-1 border-green-500 text-green-500">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmée</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="flex items-center space-x-1 border-red-500 text-red-500">
            <XCircle className="w-3 h-3" />
            <span>Échouée</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{status}</span>
          </Badge>
        );
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDown className="w-4 h-4 text-terex-accent" />;
      case 'sell':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'transfer':
        return <Send className="w-4 h-4 text-orange-600" />;
      default:
        return <ArrowDown className="w-4 h-4 text-terex-accent" />;
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

  const getTransactionLabelColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-terex-accent';
      case 'sell':
        return 'text-red-600';
      case 'transfer':
        return 'text-orange-600';
      default:
        return 'text-terex-accent';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return 'Date invalide';
    }
  };

  // Handle empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className={isMobile ? "p-4" : ""}>
          <CardTitle className={`text-white ${isMobile ? "text-lg" : ""}`}>Historique des transactions</CardTitle>
          <CardDescription className={`text-gray-400 ${isMobile ? "text-sm" : ""}`}>
            Consultez toutes vos transactions passées
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-0" : ""}>
          <div className="text-center py-6">
            <p className={`text-gray-400 ${isMobile ? "text-sm" : ""}`}>Aucune transaction pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-white text-lg">Historique des transactions</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Consultez toutes vos transactions passées
            </CardDescription>
          </CardHeader>
        </Card>

        {transactions.map((transaction) => (
          <Card key={transaction.id} className="bg-terex-darker border-terex-gray">
            <CardContent className="p-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className={`font-medium text-sm ${getTransactionLabelColor(transaction.type)}`}>
                      {getTransactionLabel(transaction.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(transaction.status)}
                    <TransactionDetails transaction={transaction} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Montant envoyé:</span>
                    <span className="text-white text-sm font-medium">
                      {transaction.amount} {transaction.currency}
                    </span>
                  </div>
                  
                  {transaction.type === 'buy' && transaction.usdtAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">USDT reçu:</span>
                      <div className="flex items-center space-x-1">
                        <USDTLogo className="w-3 h-3" />
                        <span className="text-terex-accent text-sm font-medium">{transaction.usdtAmount} USDT</span>
                      </div>
                    </div>
                  )}

                  {(transaction.type === 'sell' || transaction.type === 'transfer') && transaction.fiatAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Montant reçu:</span>
                      <span className="text-white text-sm font-medium">
                        {transaction.fiatAmount} {transaction.receiveCurrency}
                      </span>
                    </div>
                  )}

                  {transaction.type === 'transfer' && transaction.recipient_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Destinataire:</span>
                      <span className="text-white text-sm truncate max-w-[140px]">{transaction.recipient_name}</span>
                    </div>
                  )}

                  {transaction.type !== 'transfer' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Réseau:</span>
                      <span className="text-white text-sm">{transaction.network}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 border-t border-terex-gray/30">
                    <span className="text-gray-400 text-xs">Date:</span>
                    <span className="text-white text-xs">{formatDate(transaction.date)}</span>
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
              <TableHead className="text-gray-300">Montant envoyé</TableHead>
              <TableHead className="text-gray-300">Reçu</TableHead>
              <TableHead className="text-gray-300">Détails</TableHead>
              <TableHead className="text-gray-300">Statut</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-terex-gray hover:bg-terex-gray/20">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className={getTransactionLabelColor(transaction.type)}>
                      {getTransactionLabel(transaction.type)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-white">
                    {transaction.amount} {transaction.currency}
                  </span>
                </TableCell>
                <TableCell>
                  {transaction.type === 'buy' && transaction.usdtAmount ? (
                    <div className="flex items-center space-x-1">
                      <USDTLogo className="w-4 h-4" />
                      <span className="text-terex-accent">{transaction.usdtAmount} USDT</span>
                    </div>
                  ) : transaction.fiatAmount ? (
                    <span className="text-white">{transaction.fiatAmount} {transaction.receiveCurrency}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-white text-sm">
                  {transaction.type === 'transfer' && transaction.recipient_name ? 
                    transaction.recipient_name : 
                    transaction.type !== 'transfer' ? transaction.network : 
                    'Transfert'
                  }
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-white text-sm">{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <TransactionDetails transaction={transaction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
