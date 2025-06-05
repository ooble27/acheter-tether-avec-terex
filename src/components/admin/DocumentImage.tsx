
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!url) {
    return (
      <div className="space-y-2">
        <label className="text-sm text-gray-400 block">{title}</label>
        <Card className="w-full h-48 bg-gray-800 border-gray-600 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Aucun document fourni</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 block">{title}</label>
      {imageError ? (
        <Card className="w-full h-48 bg-red-900/20 border-red-600 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-2">Erreur de chargement</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Voir le document dans un nouvel onglet
            </a>
          </div>
        </Card>
      ) : (
        <div className="relative">
          {imageLoading && (
            <Card className="absolute inset-0 w-full h-48 bg-gray-800 border-gray-600 flex items-center justify-center z-10">
              <p className="text-gray-400 text-sm">Chargement...</p>
            </Card>
          )}
          <img
            src={url}
            alt={alt}
            className="w-full h-48 object-cover rounded-lg border border-terex-border cursor-pointer hover:opacity-80 transition-opacity"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onClick={() => window.open(url, '_blank')}
          />
        </div>
      )}
    </div>
  );
}
