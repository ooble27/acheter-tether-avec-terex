
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleImageClick = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(false);
    
    try {
      console.log('Ouverture du document:', url);
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      setError(true);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url) return;
    
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  if (!url) {
    return (
      <div className="bg-terex-card border border-terex-border rounded-lg p-4">
        <div className="flex items-center space-x-3 text-gray-500">
          <FileText className="h-8 w-8" />
          <div>
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-gray-400">Aucun document fourni</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-terex-card border border-terex-border rounded-lg overflow-hidden">
        <div className="p-3 bg-terex-gray border-b border-terex-border">
          <p className="text-white text-sm font-medium">{title}</p>
        </div>
        <div className="p-4 space-y-2">
          <Button
            onClick={handleImageClick}
            disabled={loading}
            className="w-full bg-terex-accent hover:bg-terex-accent/80 disabled:opacity-50 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? 'Chargement...' : 'Voir le document'}
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          
          {error && (
            <div className="text-center">
              <p className="text-red-400 text-xs">
                Erreur lors du chargement du document
              </p>
              <p className="text-gray-500 text-xs mt-1">
                URL: {url}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-terex-card border-terex-border">
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            {url && (
              <div className="flex justify-center">
                <img
                  src={url}
                  alt={alt}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Erreur de rendu de l\'image dans la modal:', e);
                    setError(true);
                  }}
                />
              </div>
            )}
            {error && (
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-red-400">Impossible de charger l'image</p>
                <p className="text-gray-400 text-sm mt-2">URL: {url}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
