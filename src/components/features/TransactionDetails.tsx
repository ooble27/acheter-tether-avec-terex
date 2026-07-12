
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

const typeLabel = (t: string) => (t === 'buy' ? 'Achat USDT' : t === 'sell' ? 'Vente USDT' : 'Transfert international');
const isDone = (s: string) => s === 'completed' || s === 'confirmed';

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const isMobile = useIsMobile();

  // Reçu PDF — un justificatif propre et téléchargeable pour le client.
  const downloadReceipt = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;

    // Bandeau d'en-tête
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, W, 110, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text('TEREX', M, 58);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.setTextColor(190, 190, 190);
    doc.text('Reçu de transaction', M, 78);
    doc.setFontSize(9);
    doc.text('terangaexchange.com', W - M, 78, { align: 'right' });

    // Référence + date
    let y = 150;
    doc.setTextColor(120, 120, 120); doc.setFontSize(9);
    doc.text('RÉFÉRENCE', M, y);
    doc.text('DATE', W - M, y, { align: 'right' });
    doc.setTextColor(20, 20, 20); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text(`TEREX-${transaction.id.slice(-8).toUpperCase()}`, M, y + 18);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.text(formatDate(transaction.date), W - M, y + 18, { align: 'right' });

    // Montant principal
    y += 62;
    doc.setDrawColor(230, 230, 230); doc.line(M, y, W - M, y);
    y += 30;
    doc.setTextColor(120, 120, 120); doc.setFontSize(9);
    doc.text(typeLabel(transaction.type).toUpperCase(), M, y);
    doc.setTextColor(20, 20, 20); doc.setFont('helvetica', 'bold'); doc.setFontSize(24);
    const mainAmount = `${transaction.amount} ${transaction.currency}`;
    doc.text(mainAmount, M, y + 30);

    // Lignes de détail
    const rows: [string, string][] = [];
    if (transaction.type === 'buy' && transaction.usdtAmount) rows.push(['USDT reçu', `${transaction.usdtAmount} USDT`]);
    if ((transaction.type === 'sell' || transaction.type === 'transfer') && transaction.fiatAmount) rows.push(['Montant reçu', `${transaction.fiatAmount} ${transaction.receiveCurrency || ''}`]);
    if (transaction.payment_method) rows.push(['Méthode de paiement', transaction.payment_method]);
    if (transaction.type !== 'transfer' && transaction.network) rows.push(['Réseau', transaction.network]);
    if (transaction.recipient_name) rows.push(['Destinataire', transaction.recipient_name]);
    rows.push(['Statut', isDone(transaction.status) ? 'Terminée' : transaction.status]);

    y += 66;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    rows.forEach(([k, v]) => {
      doc.setDrawColor(238, 238, 238); doc.line(M, y, W - M, y);
      y += 24;
      doc.setTextColor(120, 120, 120); doc.text(k, M, y);
      doc.setTextColor(20, 20, 20); doc.text(String(v), W - M, y, { align: 'right' });
      y += 12;
    });
    doc.setDrawColor(238, 238, 238); doc.line(M, y, W - M, y);

    // Pied de page
    doc.setTextColor(150, 150, 150); doc.setFontSize(9);
    doc.text("Ce reçu confirme votre transaction sur Terex (Teranga Exchange).", M, 780);
    doc.text("Pour toute question : terangaexchange@gmail.com", M, 794);

    doc.save(`terex-recu-${transaction.id.slice(-8).toUpperCase()}.pdf`);
  };

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
          <Badge variant="outline" className="flex items-center space-x-1 border-white/15 text-white">
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

      {isDone(transaction.status) && (
        <button
          onClick={downloadReceipt}
          className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold"
          style={{ background: '#fff', color: '#141414' }}
        >
          <Download className="w-4 h-4" /> Télécharger le reçu (PDF)
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
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
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
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
      </DialogContent>
    </Dialog>
  );
}
