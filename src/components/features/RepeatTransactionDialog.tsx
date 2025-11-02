import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

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
  recipient_name?: string;
  recipient_phone?: string;
  payment_method?: string;
}

interface RepeatTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onConfirm: () => void;
}

export function RepeatTransactionDialog({ open, onOpenChange, transaction, onConfirm }: RepeatTransactionDialogProps) {
  if (!transaction) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'buy': return 'Achat';
      case 'sell': return 'Vente';
      case 'transfer': return 'Transfert';
      default: return type;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-terex-darker border-terex-gray">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            🔄 Répéter cette transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Les données suivantes seront pré-remplies dans le formulaire. Vous pourrez les modifier avant de confirmer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Type:</span>
            <Badge variant="secondary">{getTypeLabel(transaction.type)}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Montant:</span>
            <span className="text-white font-medium">{transaction.amount} {transaction.currency}</span>
          </div>

          {transaction.usdtAmount && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">USDT:</span>
              <span className="text-terex-accent font-medium">{transaction.usdtAmount} USDT</span>
            </div>
          )}

          {transaction.network && transaction.type !== 'transfer' && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Réseau:</span>
              <span className="text-white">{transaction.network}</span>
            </div>
          )}

          {transaction.recipient_name && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Destinataire:</span>
              <span className="text-white">{transaction.recipient_name}</span>
            </div>
          )}

          {transaction.payment_method && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Méthode:</span>
              <span className="text-white">{transaction.payment_method}</span>
            </div>
          )}
        </div>

        <div className="bg-terex-gray/20 p-3 rounded-lg border border-terex-accent/30">
          <p className="text-sm text-gray-300">
            💡 <span className="font-medium">Note:</span> Les taux de change peuvent avoir changé depuis la dernière transaction.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-terex-gray hover:bg-terex-gray/80 text-white border-terex-gray">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-terex-accent hover:bg-terex-accent/90 text-white"
          >
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
