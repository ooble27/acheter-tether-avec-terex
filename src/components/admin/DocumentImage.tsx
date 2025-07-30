
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url && url.includes('kyc-documents/')) {
      // Extraire le chemin du fichier depuis l'URL Supabase
      const urlParts = url.split('/storage/v1/object/public/kyc-documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        loadDocumentFromStorage(filePath);
      }
    } else if (url) {
      // Si c'est déjà une URL complète, l'utiliser directement
      setImageUrl(url);
      setDownloadUrl(url);
    }
  }, [url]);

  const loadDocumentFromStorage = async (filePath: string) => {
    try {
      // Récupérer le fichier depuis le storage privé
      const { data, error: storageError } = await supabase.storage
        .from('kyc-documents')
        .download(filePath);

      if (storageError) {
        console.error('Erreur lors du téléchargement:', storageError);
        setError(true);
        return;
      }

      // Créer une URL blob pour l'affichage
      const fileUrl = URL.createObjectURL(data);
      setImageUrl(fileUrl);
      setDownloadUrl(fileUrl);
    } catch (err) {
      console.error('Erreur lors du chargement du document:', err);
      setError(true);
    }
  };

  const handleImageClick = () => {
    if (!imageUrl) return;
    setShowModal(true);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
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
            disabled={loading || error || !imageUrl}
            className="w-full bg-terex-accent hover:bg-terex-accent/80 disabled:opacity-50 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? 'Chargement...' : error ? 'Erreur de chargement' : 'Voir le document'}
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={!downloadUrl}
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
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-terex-card border-terex-border">
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            {imageUrl && !error && (
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt={alt}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={() => setError(true)}
                />
              </div>
            )}
            {error && (
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-red-400">Impossible de charger l'image</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
