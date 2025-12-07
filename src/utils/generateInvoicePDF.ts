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

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  taxNumber?: string;
}

const companyInfo: CompanyInfo = {
  name: 'Ooble Technologies Inc.',
  address: '1234 Boulevard Technologique',
  city: 'Montréal, QC H3A 1A1, Canada',
  phone: '+1 (514) 555-0123',
  email: 'facturation@oobletechnologies.com',
  website: 'www.oobletechnologies.com',
  taxNumber: 'TPS: 123456789 RT0001 | TVQ: 1234567890 TQ0001'
};

export const generateInvoicePDF = (transaction: TransactionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [59, 150, 143] as [number, number, number];
  const darkColor = [33, 37, 41] as [number, number, number];
  const grayColor = [108, 117, 125] as [number, number, number];
  const lightGray = [248, 249, 250] as [number, number, number];
  
  // ============ HEADER SECTION ============
  // Company Logo Area (left side)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 8, 50, 'F');
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(companyInfo.name, 20, 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(companyInfo.address, 20, 30);
  doc.text(companyInfo.city, 20, 35);
  doc.text(`Tél: ${companyInfo.phone}`, 20, 40);
  doc.text(`Email: ${companyInfo.email}`, 20, 45);
  
  // Invoice Title (right side)
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FACTURE', pageWidth - 20, 25, { align: 'right' });
  
  // Invoice Number and Date
  const invoiceNumber = `FAC-${format(new Date(transaction.transaction_date), 'yyyyMMdd')}-${transaction.id.slice(0, 6).toUpperCase()}`;
  const invoiceDate = format(new Date(transaction.transaction_date), 'dd MMMM yyyy', { locale: fr });
  const dueDate = format(new Date(new Date(transaction.transaction_date).getTime() + 30 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('N° Facture:', pageWidth - 70, 35);
  doc.text('Date:', pageWidth - 70, 42);
  doc.text('Échéance:', pageWidth - 70, 49);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNumber, pageWidth - 20, 35, { align: 'right' });
  doc.text(invoiceDate, pageWidth - 20, 42, { align: 'right' });
  doc.text(dueDate, pageWidth - 20, 49, { align: 'right' });
  
  // ============ SEPARATOR ============
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // ============ CLIENT SECTION ============
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, 62, 85, 40, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FACTURÉ À', 25, 72);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(transaction.client_name || 'Client', 25, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  if (transaction.client_phone) {
    doc.text(`Tél: ${transaction.client_phone}`, 25, 87);
  }
  if (transaction.payment_method) {
    doc.text(`Paiement: ${transaction.payment_method}`, 25, 94);
  }
  
  // Payment Status Box
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - 85, 62, 65, 25, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('STATUT', pageWidth - 80, 72);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYÉE', pageWidth - 80, 82);
  
  // ============ SERVICE DETAILS TABLE ============
  const serviceDescription = 'Services informatiques et consultation technologique';
  const serviceDetails = `Prestation de services informatiques incluant:\n- Consultation et support technique\n- Services de traitement de données\n- Assistance à la gestion financière`;
  
  autoTable(doc, {
    startY: 110,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total HT']],
    body: [
      [
        {
          content: serviceDescription,
          styles: { fontStyle: 'bold' }
        },
        '1',
        `${transaction.amount.toFixed(2)} ${transaction.currency}`,
        `${transaction.amount.toFixed(2)} ${transaction.currency}`
      ]
    ],
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: 6
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 10,
      cellPadding: 8
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 }
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    margin: { left: 20, right: 20 },
    theme: 'grid',
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.5
    }
  });
  
  // Get the Y position after the table
  const tableEndY = (doc as any).lastAutoTable.finalY + 10;
  
  // ============ TOTALS SECTION ============
  const totalsX = pageWidth - 90;
  const totalsWidth = 70;
  
  // Subtotal
  doc.setFillColor(...lightGray);
  doc.roundedRect(totalsX, tableEndY, totalsWidth, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  
  const subtotal = transaction.amount;
  const tps = subtotal * 0.05; // 5% TPS
  const tvq = subtotal * 0.09975; // 9.975% TVQ
  const total = subtotal + tps + tvq;
  
  doc.text('Sous-total HT:', totalsX + 5, tableEndY + 12);
  doc.text('TPS (5%):', totalsX + 5, tableEndY + 22);
  doc.text('TVQ (9.975%):', totalsX + 5, tableEndY + 32);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(`${subtotal.toFixed(2)} ${transaction.currency}`, totalsX + totalsWidth - 5, tableEndY + 12, { align: 'right' });
  doc.text(`${tps.toFixed(2)} ${transaction.currency}`, totalsX + totalsWidth - 5, tableEndY + 22, { align: 'right' });
  doc.text(`${tvq.toFixed(2)} ${transaction.currency}`, totalsX + totalsWidth - 5, tableEndY + 32, { align: 'right' });
  
  // Total Box
  doc.setFillColor(...primaryColor);
  doc.roundedRect(totalsX, tableEndY + 55, totalsWidth, 25, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL TTC', totalsX + 5, tableEndY + 66);
  doc.setFontSize(14);
  doc.text(`${total.toFixed(2)} ${transaction.currency}`, totalsX + totalsWidth - 5, tableEndY + 73, { align: 'right' });
  
  // ============ NOTES SECTION ============
  if (transaction.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Notes:', 20, tableEndY + 15);
    
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...grayColor);
    const splitNotes = doc.splitTextToSize(transaction.notes, 80);
    doc.text(splitNotes, 20, tableEndY + 23);
  }
  
  // ============ PAYMENT TERMS ============
  const termsY = tableEndY + 90;
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, termsY, pageWidth - 40, 35, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONDITIONS DE PAIEMENT', 25, termsY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.text('• Paiement à réception de facture', 25, termsY + 18);
  doc.text('• Virement Interac, chèque ou virement bancaire acceptés', 25, termsY + 25);
  doc.text('• Toute facture impayée après 30 jours entraînera des frais de retard de 2% par mois', 25, termsY + 32);
  
  // ============ FOOTER ============
  const footerY = pageHeight - 30;
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(companyInfo.name, pageWidth / 2, footerY + 2, { align: 'center' });
  doc.text(`${companyInfo.website} | ${companyInfo.email}`, pageWidth / 2, footerY + 8, { align: 'center' });
  if (companyInfo.taxNumber) {
    doc.text(companyInfo.taxNumber, pageWidth / 2, footerY + 14, { align: 'center' });
  }
  
  doc.setFontSize(7);
  doc.text('Merci pour votre confiance!', pageWidth / 2, footerY + 22, { align: 'center' });
  
  // Download the PDF
  doc.save(`Facture_${invoiceNumber}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
