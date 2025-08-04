
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { PitchDeckViewer } from './PitchDeckViewer';
import { FinancialProjections } from './FinancialProjections';
import { MarketStudy } from './MarketStudy';

type DocumentType = 'pitch-deck' | 'financial-projections' | 'market-study';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType | null;
  onDownload: (type: DocumentType) => void;
  isDownloading: boolean;
}

const documentTitles = {
  'pitch-deck': 'Pitch Deck Terex',
  'financial-projections': 'Projections Financières',
  'market-study': 'Étude de Marché Afrique'
};

export const DocumentPreviewModal = ({ 
  isOpen, 
  onClose, 
  documentType, 
  onDownload, 
  isDownloading 
}: DocumentPreviewModalProps) => {
  if (!documentType) return null;

  const renderDocument = () => {
    switch (documentType) {
      case 'pitch-deck':
        return <PitchDeckViewer />;
      case 'financial-projections':
        return <FinancialProjections />;
      case 'market-study':
        return <MarketStudy />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    if (documentType) {
      onDownload(documentType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] bg-terex-card border-terex-border">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-xl">
            {documentTitles[documentType]}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-terex-accent hover:bg-terex-accent/80 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Téléchargement...' : 'Télécharger'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderDocument()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
