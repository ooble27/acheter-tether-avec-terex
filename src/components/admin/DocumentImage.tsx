
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, FileText, Download, AlertCircle } from 'lucide-react';
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
      <div
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', width: 44, height: 44 }}
          >
            <FileText className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{title}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Aucun document fourni</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          className="p-3"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
        <div className="p-4 space-y-2">
          {/* Aperçu / placeholder neutre */}
          <div
            className="flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              minHeight: 96,
              overflow: 'hidden',
            }}
          >
            {imageUrl && !error ? (
              <button
                type="button"
                onClick={handleImageClick}
                className="w-full"
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img
                  src={imageUrl}
                  alt={alt}
                  className="w-full object-cover"
                  style={{ maxHeight: 140 }}
                  onError={() => setError(true)}
                />
              </button>
            ) : error ? (
              <div className="flex flex-col items-center gap-1 p-3">
                <AlertCircle className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <p className="text-xs text-center" style={{ color: '#6b7280' }}>
                  Erreur de chargement
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 p-3">
                <FileText className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  {loading ? 'Chargement...' : 'Aperçu'}
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={handleImageClick}
            disabled={loading || error || !imageUrl}
            className="w-full disabled:opacity-50"
            style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none' }}
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? 'Chargement...' : error ? 'Erreur de chargement' : 'Voir le document'}
          </Button>

          <Button
            onClick={handleDownload}
            disabled={!downloadUrl}
            className="w-full"
            style={{
              background: '#2d2d2d',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#fff',
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>

          {error && (
            <div className="text-center">
              <p className="text-xs" style={{ color: '#f87171' }}>
                Erreur lors du chargement du document
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            {imageUrl && !error && (
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt={alt}
                  className="max-w-full max-h-[70vh] object-contain"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}
                  onError={() => setError(true)}
                />
              </div>
            )}
            {error && (
              <div
                className="flex flex-col items-center gap-2 p-4"
                style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}
              >
                <AlertCircle className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <p style={{ color: '#9ca3af' }}>Impossible de charger l'image</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
