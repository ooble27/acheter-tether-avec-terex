import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TransactionData {
  id: string;
  transaction_date: string;
  client_name?: string | null;
  client_phone?: string | null;
  crypto_amount: number;
  crypto_currency: string;
  buy_price: number;
  sell_price: number;
  amount: number;
  currency: string;
  profit: number;
  profit_percentage: number;
  payment_method?: string | null;
  notes?: string | null;
}

export const generateInvoicePDF = (transaction: TransactionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Company Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 150, 143); // Terex accent color
  doc.text('Ooble Technologies Inc.', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Services de change crypto', 20, 32);
  
  // Invoice Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('FACTURE', pageWidth - 20, 25, { align: 'right' });
  
  // Invoice Number and Date
  const invoiceNumber = `FAC-${transaction.id.slice(0, 8).toUpperCase()}`;
  const invoiceDate = format(new Date(transaction.transaction_date), 'dd MMMM yyyy', { locale: fr });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${invoiceNumber}`, pageWidth - 20, 32, { align: 'right' });
  doc.text(`Date: ${invoiceDate}`, pageWidth - 20, 38, { align: 'right' });
  
  // Separator line
  doc.setDrawColor(59, 150, 143);
  doc.setLineWidth(0.5);
  doc.line(20, 45, pageWidth - 20, 45);
  
  // Client Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Facturé à:', 20, 58);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.client_name || 'Client', 20, 65);
  if (transaction.client_phone) {
    doc.text(transaction.client_phone, 20, 71);
  }
  
  // Transaction Details Table
  autoTable(doc, {
    startY: 85,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: [
      [
        `${transaction.crypto_currency} - Achat/Vente`,
        `${transaction.crypto_amount.toFixed(2)} ${transaction.crypto_currency}`,
        `${transaction.sell_price.toFixed(4)} ${transaction.currency}`,
        `${transaction.amount.toFixed(2)} ${transaction.currency}`
      ]
    ],
    headStyles: {
      fillColor: [59, 150, 143],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 20, right: 20 }
  });
  
  // Get the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Summary Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 90, finalY, 70, 45, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Prix d\'achat:', pageWidth - 85, finalY + 12);
  doc.text('Prix de vente:', pageWidth - 85, finalY + 22);
  doc.text('Marge:', pageWidth - 85, finalY + 32);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`${transaction.buy_price.toFixed(4)}`, pageWidth - 25, finalY + 12, { align: 'right' });
  doc.text(`${transaction.sell_price.toFixed(4)}`, pageWidth - 25, finalY + 22, { align: 'right' });
  doc.setTextColor(59, 150, 143);
  doc.text(`${transaction.profit_percentage.toFixed(2)}%`, pageWidth - 25, finalY + 32, { align: 'right' });
  
  // Total Box
  doc.setFillColor(59, 150, 143);
  doc.roundedRect(pageWidth - 90, finalY + 50, 70, 25, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', pageWidth - 85, finalY + 62);
  doc.text(`${transaction.amount.toFixed(2)} ${transaction.currency}`, pageWidth - 25, finalY + 68, { align: 'right' });
  
  // Payment Method
  if (transaction.payment_method) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Méthode de paiement: ${transaction.payment_method}`, 20, finalY + 20);
  }
  
  // Notes
  if (transaction.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Notes: ${transaction.notes}`, 20, finalY + 30);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Ooble Technologies Inc. - Services de change crypto', pageWidth / 2, footerY + 8, { align: 'center' });
  doc.text('Merci pour votre confiance!', pageWidth / 2, footerY + 14, { align: 'center' });
  
  // Download the PDF
  doc.save(`Facture_${invoiceNumber}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
