import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';

/**
 * Page publique partageable de la vision Néobanque Terex.
 * Accessible via /neobank-vision (lien direct partageable, pas d'auth requise pour visualiser le moodboard interne).
 */
const NeobankVisionPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Terex · Vision Néobanque', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Lien copié', description: 'Tu peux maintenant le partager.' });
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="outline" asChild className="bg-terex-gray/50 border-terex-gray hover:bg-terex-gray text-white">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
          <Button onClick={handleShare} className="bg-primary hover:bg-primary/90 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
        <NeobankVision />
      </div>
    </div>
  );
};

export default NeobankVisionPage;
