import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FileText, Download, AlertCircle, ImageOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentImageProps {
  url?: string;
  alt: string;
  title: string;
}

/**
 * Vignette de document — une seule tuile cliquable (aperçu + titre en légende).
 * On tape → la pièce s'ouvre en grand avec un bouton de téléchargement.
 * Fini les cartes lourdes à deux boutons : léger, surtout sur mobile.
 */
export function DocumentImage({ url, alt, title }: DocumentImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url && url.includes('kyc-documents/')) {
      const parts = url.split('/storage/v1/object/public/kyc-documents/');
      if (parts.length > 1) loadFromStorage(parts[1]);
    } else if (url) {
      setImageUrl(url);
    }
  }, [url]);

  const loadFromStorage = async (filePath: string) => {
    try {
      const { data, error: e } = await supabase.storage.from('kyc-documents').download(filePath);
      if (e) { setError(true); return; }
      setImageUrl(URL.createObjectURL(data));
    } catch { setError(true); }
  };

  const download = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '_')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const caption = (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 10px 8px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
      color: '#fff', fontSize: 11.5, fontWeight: 600, lineHeight: 1.2,
    }}>{title}</div>
  );

  // Pas de document
  if (!url) {
    return (
      <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <ImageOff size={20} color="rgba(255,255,255,0.3)" />
        <span style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', padding: '0 8px' }}>{title}</span>
        <span style={{ color: '#4b5563', fontSize: 10 }}>Non fourni</span>
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => imageUrl && !error && setShowModal(true)}
        style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: 0, cursor: imageUrl && !error ? 'pointer' : 'default', width: '100%', display: 'block' }}>
        {imageUrl && !error ? (
          <>
            <img src={imageUrl} alt={alt} onError={() => setError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {caption}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {error ? <AlertCircle size={20} color="rgba(255,255,255,0.4)" /> : <FileText size={20} color="rgba(255,255,255,0.4)" />}
            <span style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', padding: '0 8px' }}>{title}</span>
          </div>
        )}
      </button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-white text-base font-semibold">{title}</h3>
            <button onClick={download}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Download size={14} /> Télécharger
            </button>
          </div>
          {imageUrl && !error ? (
            <div className="flex justify-center mt-3">
              <img src={imageUrl} alt={alt} onError={() => setError(true)}
                className="max-w-full max-h-[70vh] object-contain"
                style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 mt-3" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <AlertCircle size={22} color="rgba(255,255,255,0.5)" />
              <p style={{ color: '#9ca3af' }}>Impossible de charger l'image</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
