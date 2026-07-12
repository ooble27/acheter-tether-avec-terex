
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
  exchangeRate?: string;
  provider?: string;
}

// Toujours le vrai prestataire (Wave / Orange Money), jamais un générique « mobile ».
const PROVIDER_LABELS: Record<string, string> = {
  wave: 'Wave', orange: 'Orange Money', orange_money: 'Orange Money', om: 'Orange Money',
  card: 'Carte bancaire', bank: 'Virement bancaire', bank_transfer: 'Virement bancaire', interac: 'Interac',
};
function methodLabel(t: Transaction): string | undefined {
  const key = t.provider || t.payment_method;
  if (!key) return undefined;
  if (PROVIDER_LABELS[key]) return PROVIDER_LABELS[key];
  if (key === 'mobile' || key === 'mobile_money') return undefined; // générique inutile → on masque
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

  // Charge une image (logo) en dataURL pour l'intégrer au PDF.
  const toDataURL = (url: string): Promise<string | null> =>
    fetch(url).then(r => r.blob()).then(b => new Promise<string>((res) => {
      const fr = new FileReader(); fr.onloadend = () => res(fr.result as string); fr.readAsDataURL(b);
    })).catch(() => null);

  // Reçu PDF — justificatif complet, propre et à l'image de Terex.
  const downloadReceipt = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;
    const contentW = W - M * 2;

    // ── En-tête : bandeau sombre + logo + wordmark ──
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, W, 130, 'F');
    const logo = await toDataURL('/terex-icon.png?v=11');
    let textX = M;
    if (logo) { try { doc.addImage(logo, 'PNG', M, 40, 44, 44); textX = M + 58; } catch { /* ignore */ } }
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text('Terex', textX, 64);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
    doc.setTextColor(190, 190, 190);
    doc.text('Reçu de transaction', textX, 82);
    doc.setFontSize(9); doc.setTextColor(160, 160, 160);
    doc.text('Teranga Exchange · terangaexchange.com', W - M, 64, { align: 'right' });
    doc.text('USDT / CFA', W - M, 80, { align: 'right' });

    // ── Bloc résumé : le flux (payé → reçu) ──
    let y = 170;
    const isBuy = transaction.type === 'buy';
    const isTransfer = transaction.type === 'transfer';
    const paidLabel = isBuy ? 'Vous avez payé' : isTransfer ? 'Vous avez envoyé' : 'Vous avez vendu';
    const paidVal = isBuy ? `${transaction.amount} ${transaction.currency}`
      : isTransfer ? `${transaction.amount} ${transaction.currency}`
      : `${transaction.usdtAmount || transaction.amount} USDT`;
    const recvLabel = isBuy ? 'Vous avez reçu' : 'Le bénéficiaire reçoit';
    const recvVal = isBuy ? `${transaction.usdtAmount || ''} USDT`
      : `${transaction.fiatAmount || transaction.amount} ${transaction.receiveCurrency || transaction.currency}`;

    doc.setDrawColor(235, 235, 235); doc.setLineWidth(1);
    doc.roundedRect(M, y, contentW, 78, 10, 10, 'S');
    const half = contentW / 2;
    doc.setFontSize(9); doc.setTextColor(140, 140, 140);
    doc.text(paidLabel.toUpperCase(), M + 18, y + 28);
    doc.text(recvLabel.toUpperCase(), M + half + 18, y + 28);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(20, 20, 20);
    doc.text(paidVal, M + 18, y + 54);
    doc.text(recvVal, M + half + 18, y + 54);
    doc.setTextColor(180, 180, 180); doc.setFont('helvetica', 'normal'); doc.setFontSize(14);
    doc.text('→', M + half - 6, y + 50, { align: 'center' });

    // ── Détails ──
    y += 78 + 34;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(120, 120, 120);
    doc.text('DÉTAILS', M, y);
    y += 8;

    const rows: [string, string][] = [];
    rows.push(['Référence', `TEREX-${transaction.id.slice(-8).toUpperCase()}`]);
    rows.push(['Date', formatDate(transaction.date)]);
    rows.push(['Type', typeLabel(transaction.type)]);
    if (transaction.exchangeRate) rows.push(['Taux appliqué', `${transaction.exchangeRate} ${transaction.currency}/USDT`]);
    const ml = methodLabel(transaction);
    if (ml) rows.push(['Méthode de paiement', ml]);
    if (!isTransfer && transaction.network) rows.push(['Réseau', transaction.network]);
    if (isBuy && transaction.address) rows.push(['Adresse de réception', transaction.address]);
    if (transaction.recipient_name) rows.push(['Destinataire', transaction.recipient_name]);
    if (transaction.recipient_phone) rows.push(['Téléphone', transaction.recipient_phone]);
    rows.push(['Statut', isDone(transaction.status) ? 'Terminée' : transaction.status]);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    rows.forEach(([k, v]) => {
      y += 6; doc.setDrawColor(240, 240, 240); doc.line(M, y, W - M, y); y += 22;
      doc.setTextColor(130, 130, 130); doc.text(k, M, y);
      doc.setTextColor(20, 20, 20);
      // Valeurs longues (adresse) : police plus petite, ancrée à droite, tronquée si besoin.
      const long = String(v).length > 34;
      if (long) { doc.setFontSize(9); doc.text(String(v), W - M, y, { align: 'right' }); doc.setFontSize(11); }
      else doc.text(String(v), W - M, y, { align: 'right' });
    });
    y += 6; doc.setDrawColor(240, 240, 240); doc.line(M, y, W - M, y);

    // ── Pied de page ──
    doc.setDrawColor(235, 235, 235); doc.line(M, 760, W - M, 760);
    doc.setTextColor(150, 150, 150); doc.setFontSize(9);
    doc.text('Merci d\'utiliser Terex. Ce reçu confirme votre transaction sur Teranga Exchange.', M, 782);
    doc.text('Support : terangaexchange@gmail.com', M, 796);
    doc.text('terangaexchange.com', W - M, 796, { align: 'right' });

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

      {methodLabel(transaction) && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Méthode de paiement:</span>
          <span className="text-white">{methodLabel(transaction)}</span>
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
