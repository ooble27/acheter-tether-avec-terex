
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type DocumentType = 'pitch-deck' | 'financial-projections' | 'market-study';

export const useInvestorDocuments = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentType | null>(null);

  const generatePDF = async (elementId: string, filename: string) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Projections financières
    const financialData = [
      ['Métriques', '2024', '2025', '2026', '2027'],
      ['Revenus ($)', 500000, 2500000, 8000000, 20000000],
      ['Utilisateurs Actifs', 15000, 75000, 200000, 450000],
      ['Transactions/Mois', 125000, 600000, 1800000, 4200000],
      ['Volume Mensuel ($M)', 2.3, 12, 35, 85],
      ['Marge Brute (%)', '25%', '30%', '35%', '40%'],
      ['Pays Couverts', 8, 12, 15, 20]
    ];

    // Répartition des coûts
    const costData = [
      ['Catégorie', 'Montant ($)', 'Pourcentage (%)'],
      ['Personnel', 800000, 40],
      ['Infrastructure', 400000, 20],
      ['Marketing', 300000, 15],
      ['Compliance', 200000, 10],
      ['Opérations', 300000, 15]
    ];

    // Marché par pays
    const marketData = [
      ['Pays', 'Taille Marché ($M)', 'Population (M)', 'Pénétration Mobile (%)'],
      ['Nigeria', 25000, 220, 85],
      ['Ghana', 8500, 32, 78],
      ['Sénégal', 3200, 17, 82],
      ['Côte d\'Ivoire', 4800, 28, 75],
      ['Mali', 1800, 21, 68],
      ['Burkina Faso', 1200, 22, 65]
    ];

    const financialSheet = XLSX.utils.aoa_to_sheet(financialData);
    const costSheet = XLSX.utils.aoa_to_sheet(costData);
    const marketSheet = XLSX.utils.aoa_to_sheet(marketData);

    XLSX.utils.book_append_sheet(workbook, financialSheet, 'Projections Financières');
    XLSX.utils.book_append_sheet(workbook, costSheet, 'Répartition Coûts');
    XLSX.utils.book_append_sheet(workbook, marketSheet, 'Marché par Pays');

    return workbook;
  };

  const uploadToStorage = async (blob: Blob, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('investor-documents')
        .upload(`documents/${filename}`, blob, {
          upsert: true,
          contentType: blob.type
        });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('investor-documents')
        .getPublicUrl(`documents/${filename}`);

      return publicUrl.publicUrl;
    } catch (error) {
      console.error('Error uploading to storage:', error);
      throw error;
    }
  };

  const downloadDocument = async (type: DocumentType) => {
    setIsGenerating(true);
    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case 'pitch-deck':
          const pitchPdf = await generatePDF('pitch-deck-content', 'Terex_Pitch_Deck.pdf');
          blob = pitchPdf.output('blob');
          filename = 'Terex_Pitch_Deck.pdf';
          break;

        case 'financial-projections':
          const workbook = generateExcel();
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          filename = 'Terex_Projections_Financieres.xlsx';
          break;

        case 'market-study':
          const marketPdf = await generatePDF('market-study-content', 'Terex_Etude_Marche.pdf');
          blob = marketPdf.output('blob');
          filename = 'Terex_Etude_Marche.pdf';
          break;

        default:
          throw new Error('Type de document invalide');
      }

      // Upload to storage
      const url = await uploadToStorage(blob, filename);

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Document ${filename} téléchargé avec succès!`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Erreur lors du téléchargement du document');
    } finally {
      setIsGenerating(false);
    }
  };

  const openPreview = (type: DocumentType) => {
    setPreviewDocument(type);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  return {
    isGenerating,
    previewDocument,
    downloadDocument,
    openPreview,
    closePreview,
  };
};
