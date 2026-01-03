
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { SpiceHeader } from './sections/SpiceHeader';
import { SpiceHero } from './sections/SpiceHero';
import { SpiceFeatures } from './sections/SpiceFeatures';
import { SpiceStats } from './sections/SpiceStats';
import { TestimonialsSection } from './TestimonialsSection';
import { SpiceCTA } from './sections/SpiceCTA';
import { SpiceFooter } from './sections/SpiceFooter';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function PublicHome({ onGetStarted, user, onShowDashboard }: PublicHomeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <PWAInstallPrompt />
      
      <SpiceHeader 
        user={user}
        onShowDashboard={onShowDashboard}
        onLogout={handleLogout}
      />
      
      <SpiceHero user={user} onShowDashboard={onShowDashboard} />
      
      <SpiceFeatures />

      <SpiceStats />
      
      <TestimonialsSection />
      
      <SpiceCTA user={user} />

      <SpiceFooter />
    </div>
  );
}
