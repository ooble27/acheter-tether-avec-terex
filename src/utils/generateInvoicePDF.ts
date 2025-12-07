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
}

const companyInfo: CompanyInfo = {
  name: 'Ooble Technologies Inc.',
  address: '1234 Boulevard Technologique',
  city: 'Montréal, QC H3A 1A1, Canada',
  phone: '+1 (514) 555-0123',
  email: 'facturation@oobletechnologies.com',
  website: 'www.oobletechnologies.com'
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
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(companyInfo.name, 20, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Services informatiques et consultation technologique', 20, 28);
  doc.text(companyInfo.address, 20, 35);
  doc.text(companyInfo.city, 20, 41);
  doc.text(`Tél: ${companyInfo.phone}`, 20, 47);
  
  // Invoice Title (right side)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FACTURE', pageWidth - 20, 22, { align: 'right' });
  
  // Invoice Number and Date
  const invoiceNumber = `FAC-${format(new Date(transaction.transaction_date), 'yyyyMMdd')}-${transaction.id.slice(0, 6).toUpperCase()}`;
  const invoiceDate = format(new Date(transaction.transaction_date), 'dd MMMM yyyy', { locale: fr });
  const dueDate = format(new Date(new Date(transaction.transaction_date).getTime() + 30 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('N° Facture:', pageWidth - 60, 33);
  doc.text('Date:', pageWidth - 60, 40);
  doc.text('Échéance:', pageWidth - 60, 47);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(invoiceNumber, pageWidth - 20, 33, { align: 'right' });
  doc.text(invoiceDate, pageWidth - 20, 40, { align: 'right' });
  doc.text(dueDate, pageWidth - 20, 47, { align: 'right' });
  
  // ============ SEPARATOR ============
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // ============ CLIENT SECTION ============
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, 62, 80, 35, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FACTURÉ À', 25, 72);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(transaction.client_name || 'Client', 25, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  if (transaction.client_phone) {
    doc.text(`Tél: ${transaction.client_phone}`, 25, 87);
  }
  if (transaction.payment_method) {
    doc.text(`Mode: ${transaction.payment_method}`, 25, 94);
  }
  
  // Payment Status Box
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - 75, 62, 55, 25, 3, 3, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('STATUT', pageWidth - 70, 72);
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYÉE', pageWidth - 70, 82);
  
  // ============ SERVICE DETAILS TABLE ============
  autoTable(doc, {
    startY: 105,
    head: [['Description du service', 'Qté', 'Prix unitaire', 'Total']],
    body: [
      [
        'Services informatiques et consultation technologique\nPrestation de services incluant support technique et traitement de données',
        '1',
        `${transaction.amount.toFixed(2)} ${transaction.currency}`,
        `${transaction.amount.toFixed(2)} ${transaction.currency}`
      ]
    ],
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 5
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 9,
      cellPadding: 6
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { halign: 'center', cellWidth: 20 },
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
  const totalsX = pageWidth - 85;
  const totalsWidth = 65;
  
  // Total Box
  doc.setFillColor(...primaryColor);
  doc.roundedRect(totalsX, tableEndY, totalsWidth, 25, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', totalsX + 5, tableEndY + 11);
  doc.setFontSize(13);
  doc.text(`${transaction.amount.toFixed(2)} ${transaction.currency}`, totalsX + totalsWidth - 5, tableEndY + 18, { align: 'right' });
  
  // ============ NOTES SECTION ============
  let notesEndY = tableEndY;
  if (transaction.notes) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Notes:', 20, tableEndY + 10);
    
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...grayColor);
    const splitNotes = doc.splitTextToSize(transaction.notes, 75);
    doc.text(splitNotes, 20, tableEndY + 18);
    notesEndY = tableEndY + 18 + (splitNotes.length * 5);
  }
  
  // ============ PAYMENT TERMS ============
  const termsY = Math.max(tableEndY + 35, notesEndY + 15);
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, termsY, pageWidth - 40, 30, 3, 3, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONDITIONS DE PAIEMENT', 25, termsY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('• Paiement à réception de facture', 25, termsY + 18);
  doc.text('• Virement Interac, chèque ou virement bancaire acceptés', 25, termsY + 25);
  
  // ============ FOOTER ============
  const footerY = pageHeight - 25;
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(companyInfo.name, pageWidth / 2, footerY + 2, { align: 'center' });
  doc.text(`${companyInfo.website} | ${companyInfo.email}`, pageWidth / 2, footerY + 8, { align: 'center' });
  
  doc.setFontSize(7);
  doc.text('Merci pour votre confiance!', pageWidth / 2, footerY + 16, { align: 'center' });
  
  // Download the PDF
  doc.save(`Facture_${invoiceNumber}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
