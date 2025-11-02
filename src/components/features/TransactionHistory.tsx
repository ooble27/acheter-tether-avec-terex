
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransactionDetails } from './TransactionDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowUp, ArrowDown, Send, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTransactionRepeat } from '@/contexts/TransactionRepeatContext';
import { RepeatTransactionDialog } from './RepeatTransactionDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { setTransactionToRepeat } = useTransactionRepeat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const handleRepeatClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleConfirmRepeat = () => {
    if (selectedTransaction) {
      setTransactionToRepeat(selectedTransaction);
      setDialogOpen(false);
      
      toast({
        title: "🔄 Transaction prête à être répétée",
        description: "Les données ont été pré-remplies. Redirection...",
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  // Handle empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className={isMobile ? "p-4" : ""}>
          <CardTitle className={`text-white font-light ${isMobile ? "text-lg" : ""}`}>Historique des transactions</CardTitle>
          <CardDescription className={`text-gray-400 font-light ${isMobile ? "text-sm" : ""}`}>
            Consultez toutes vos transactions passées
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-0" : ""}>
          <div className="text-center py-6">
            <p className={`text-gray-400 font-light ${isMobile ? "text-sm" : ""}`}>Aucune transaction pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <>
        <RepeatTransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transaction={selectedTransaction}
          onConfirm={handleConfirmRepeat}
        />
        
        <div className="space-y-3">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-white text-lg font-light">Historique des transactions</CardTitle>
            <CardDescription className="text-gray-400 text-sm font-light">
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
                    <span className={`font-light text-sm ${getTransactionLabelColor(transaction.type)}`}>
                      {getTransactionLabel(transaction.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(transaction.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRepeatClick(transaction)}
                      className="p-1 h-auto text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
                      title="Répéter cette transaction"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <TransactionDetails transaction={transaction} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Montant envoyé:</span>
                    <span className="text-white text-sm font-light">
                      {transaction.amount} {transaction.currency}
                    </span>
                  </div>
                  
                  {transaction.type === 'buy' && transaction.usdtAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">USDT reçu:</span>
                      <div className="flex items-center space-x-1">
                        <USDTLogo className="w-3 h-3" />
                        <span className="text-terex-accent text-sm font-light">{transaction.usdtAmount} USDT</span>
                      </div>
                    </div>
                  )}

                  {(transaction.type === 'sell' || transaction.type === 'transfer') && transaction.fiatAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Montant reçu:</span>
                      <span className="text-white text-sm font-light">
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
      </>
    );
  }

  return (
    <>
      <RepeatTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        onConfirm={handleConfirmRepeat}
      />
      
      <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white font-light">Historique des transactions</CardTitle>
        <CardDescription className="text-gray-400 font-light">
          Consultez toutes vos transactions passées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-terex-gray">
              <TableHead className="text-gray-300 font-light">Type</TableHead>
              <TableHead className="text-gray-300 font-light">Montant envoyé</TableHead>
              <TableHead className="text-gray-300 font-light">Reçu</TableHead>
              <TableHead className="text-gray-300 font-light">Détails</TableHead>
              <TableHead className="text-gray-300 font-light">Statut</TableHead>
              <TableHead className="text-gray-300 font-light">Date</TableHead>
              <TableHead className="text-gray-300 font-light">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-terex-gray hover:bg-terex-gray/20">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className={`font-light ${getTransactionLabelColor(transaction.type)}`}>
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
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRepeatClick(transaction)}
                      className="text-terex-accent hover:bg-terex-accent/10"
                      title="Répéter cette transaction"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <TransactionDetails transaction={transaction} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
