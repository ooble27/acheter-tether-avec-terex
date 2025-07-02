
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { HeaderSection } from './sections/HeaderSection';
import { MarketplaceCryptoSection } from './sections/MarketplaceCryptoSection';
import { CurrencyConverterSection } from './sections/CurrencyConverterSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { PaymentMethodsSection } from './sections/PaymentMethodsSection';
import { CTASection } from './sections/CTASection';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function PublicHome({ onGetStarted, user, onShowDashboard }: PublicHomeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleBlockchainInfo = () => {
    navigate('/blockchain');
  };

  const handleMarketplace = () => {
    navigate('/marketplace');
  };

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
    <div className="min-h-screen bg-terex-dark">
      <PWAInstallPrompt />
      
      <HeaderSection 
        user={user}
        onShowDashboard={onShowDashboard}
        onMarketplace={handleMarketplace}
        onLogout={handleLogout}
      />
      
      <HeroSection />
      
      <MarketplaceCryptoSection onMarketplaceClick={handleMarketplace} />
      
      <CurrencyConverterSection />

      <HowItWorksSection onBlockchainInfoClick={handleBlockchainInfo} />

      <StatsSection />
      
      <PaymentMethodsSection />

      <TestimonialsSection />
      
      <CTASection user={user} onGetStarted={handleGetStarted} />
    </div>
  );
}
