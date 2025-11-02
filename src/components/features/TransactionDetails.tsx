
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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

interface TransactionDetailsProps {
  transaction: Transaction;
}

const USDTLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const isMobile = useIsMobile();
  const { setTransactionToRepeat } = useTransactionRepeat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const handleRepeatClick = () => {
    setDetailsOpen(false);
    setRepeatDialogOpen(true);
  };

  const handleConfirmRepeat = () => {
    setTransactionToRepeat(transaction);
    setRepeatDialogOpen(false);
    
    toast({
      title: "🔄 Transaction prête à être répétée",
      description: "Les données ont été pré-remplies. Redirection...",
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const detailsContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-400">ID Transaction:</span>
        <span className="text-white text-sm">{transaction.id.slice(0, 8)}...</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-400">Type:</span>
        <span className={`font-medium ${
          transaction.type === 'buy' ? 'text-terex-accent' : 
          transaction.type === 'sell' ? 'text-red-400' : 
          'text-orange-400'
        }`}>
          {transaction.type === 'buy' ? 'Achat' : 
           transaction.type === 'sell' ? 'Vente' : 
           'Transfert'}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-400">Montant envoyé:</span>
        <span className="text-white">
          {transaction.amount} {transaction.currency}
        </span>
      </div>

      {transaction.type === 'buy' && transaction.usdtAmount && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">USDT reçu:</span>
          <div className="flex items-center space-x-1">
            <USDTLogo className="w-4 h-4" />
            <span className="text-terex-accent">{transaction.usdtAmount} USDT</span>
          </div>
        </div>
      )}

      {(transaction.type === 'sell' || transaction.type === 'transfer') && transaction.fiatAmount && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Montant reçu:</span>
          <span className="text-white">
            {transaction.fiatAmount} {transaction.receiveCurrency}
          </span>
        </div>
      )}

      {transaction.recipient_name && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Destinataire:</span>
          <span className="text-white">{transaction.recipient_name}</span>
        </div>
      )}

      {transaction.recipient_phone && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Téléphone:</span>
          <span className="text-white">{transaction.recipient_phone}</span>
        </div>
      )}

      {transaction.payment_method && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Méthode de paiement:</span>
          <span className="text-white">{transaction.payment_method}</span>
        </div>
      )}

      {transaction.type !== 'transfer' && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Réseau:</span>
          <span className="text-white">{transaction.network}</span>
        </div>
      )}

      {transaction.address && (
        <div className="flex justify-between items-start">
          <span className="text-gray-400">Adresse:</span>
          <span className="text-white text-xs text-right max-w-[200px] break-all">
            {transaction.address}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-gray-400">Statut:</span>
        {getStatusBadge(transaction.status)}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-400">Date:</span>
        <span className="text-white text-sm">{formatDate(transaction.date)}</span>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <RepeatTransactionDialog
          open={repeatDialogOpen}
          onOpenChange={setRepeatDialogOpen}
          transaction={transaction}
          onConfirm={handleConfirmRepeat}
        />
        
        <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
          <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-terex-accent hover:bg-terex-gray/20">
            <Eye className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="bg-terex-darker border-terex-gray rounded-t-3xl border-t-2 border-x-2 border-b-0 max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="text-white text-center">Détails de la transaction</SheetTitle>
          </SheetHeader>
          <div className="px-2">
            {detailsContent}
          </div>
          <SheetFooter className="pt-4">
            <Button
              onClick={handleRepeatClick}
              className="w-full bg-terex-accent hover:bg-terex-accent/90 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Répéter cette transaction
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      </>
    );
  }

  return (
    <>
      <RepeatTransactionDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        transaction={transaction}
        onConfirm={handleConfirmRepeat}
      />
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-terex-accent hover:bg-terex-gray/20">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-terex-darker border-terex-gray max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Détails de la transaction</DialogTitle>
        </DialogHeader>
        {detailsContent}
        <DialogFooter>
          <Button
            onClick={handleRepeatClick}
            className="w-full bg-terex-accent hover:bg-terex-accent/90 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Répéter cette transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
