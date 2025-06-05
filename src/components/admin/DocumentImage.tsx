
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, Download } from 'lucide-react';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);

  if (!url) {
    return (
      <div className="space-y-2">
        <label className="text-sm text-gray-400 block font-medium">{title}</label>
        <Card className="w-full h-48 bg-gray-800 border-gray-600 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Aucun document fourni</p>
        </Card>
      </div>
    );
  }

  const handleImageClick = () => {
    setShowFullImage(true);
  };

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="space-y-3">
        <label className="text-sm text-gray-400 block font-medium">{title}</label>
        
        {imageError ? (
          <Card className="w-full h-48 bg-red-900/20 border-red-600 flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <p className="text-red-400 text-sm mb-3">Erreur de chargement de l'image</p>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir le lien
                </Button>
                <p className="text-xs text-gray-500 break-all">{url}</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="relative">
            {imageLoading && (
              <Card className="absolute inset-0 w-full h-48 bg-gray-800 border-gray-600 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Chargement...</p>
                </div>
              </Card>
            )}
            
            <div className="group relative">
              <img
                src={url}
                alt={alt}
                className="w-full h-48 object-cover rounded-lg border border-terex-border cursor-pointer hover:opacity-90 transition-all duration-200"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onClick={handleImageClick}
              />
              
              {/* Overlay avec boutons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleImageClick}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Agrandir
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour l'image en plein écran */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white border-white/30 hover:bg-black/70"
            >
              ✕ Fermer
            </Button>
            <img
              src={url}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
