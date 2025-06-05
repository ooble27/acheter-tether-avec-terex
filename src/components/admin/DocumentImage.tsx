
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = async () => {
    if (!url) return;
    
    setLoading(true);
    
    try {
      // Si l'URL contient déjà le domaine complet, l'utiliser directement
      if (url.includes('supabase.co') || url.includes('http')) {
        setImageUrl(url);
      } else {
        // Sinon, construire l'URL publique depuis le storage
        const { data } = supabase.storage
          .from('kyc-documents')
          .getPublicUrl(url);
        
        setImageUrl(data.publicUrl);
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!url) {
    return (
      <div className="border border-dashed border-gray-600 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs mt-1">Aucun document fourni</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-600 rounded-lg overflow-hidden">
        <div className="p-3 bg-terex-gray">
          <p className="text-white text-sm font-medium">{title}</p>
        </div>
        <div className="p-4">
          <button
            onClick={handleImageClick}
            disabled={loading}
            className="w-full bg-terex-accent hover:bg-terex-accent/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Chargement...' : 'Voir le document'}
          </button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-terex-darker border-terex-border">
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
                    e.currentTarget.src = '/placeholder.svg';
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
