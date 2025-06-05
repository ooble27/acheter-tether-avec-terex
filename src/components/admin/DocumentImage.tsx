
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Eye, FileText } from 'lucide-react';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleImageClick = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(false);
    
    try {
      let finalUrl = url;
      
      // Si l'URL ne contient pas déjà le domaine complet, construire l'URL publique
      if (!url.includes('supabase.co') && !url.includes('http')) {
        const { data } = supabase.storage
          .from('kyc-documents')
          .getPublicUrl(url);
        
        finalUrl = data.publicUrl;
      }
      
      // Tester si l'URL est accessible
      const response = await fetch(finalUrl, { method: 'HEAD' });
      if (response.ok) {
        setImageUrl(finalUrl);
        setShowModal(true);
      } else {
        setError(true);
        console.error('Image non accessible:', finalUrl);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      setError(true);
    } finally {
      setLoading(false);
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
        <div className="p-4">
          <button
            onClick={handleImageClick}
            disabled={loading}
            className="w-full bg-terex-accent hover:bg-terex-accent/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{loading ? 'Chargement...' : 'Voir le document'}</span>
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-2 text-center">
              Erreur lors du chargement du document
            </p>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-terex-card border-terex-border">
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            {imageUrl && (
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt={alt}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Erreur de chargement de l\'image:', e);
                    setError(true);
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
