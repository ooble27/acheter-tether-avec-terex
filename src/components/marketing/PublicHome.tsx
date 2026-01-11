
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { HeaderSection } from './sections/HeaderSection';
import { CurrencyConverterSection } from './sections/CurrencyConverterSection';
import { WhyChooseTerexSection } from './sections/WhyChooseTerexSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { PaymentMethodsSection } from './sections/PaymentMethodsSection';
import { CTASection } from './sections/CTASection';
import { FooterSection } from './sections/FooterSection';
import { NetworksSection } from './sections/NetworksSection';
import { DashboardPreviewSection } from './sections/DashboardPreviewSection';
import { BuyUSDTShowcase, NetworkSelectionShowcase, ConfirmationShowcase } from './sections/FeatureShowcaseSection';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function PublicHome({ onGetStarted, user, onShowDashboard }: PublicHomeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleBlockchainInfo = () => {
    navigate('/blockchain');
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
    <div className="min-h-screen bg-terex-dark relative">
      {/* Grid background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(#3B968F 1px, transparent 1px),
                          linear-gradient(90deg, #3B968F 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      <PWAInstallPrompt />
      
      <HeaderSection 
        user={user}
        onShowDashboard={onShowDashboard}
        onLogout={handleLogout}
      />
      
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
      
      <HeroSection user={user} onShowDashboard={onShowDashboard} />
      
      <CurrencyConverterSection />

      {/* Feature showcases avant "Nos avantages" */}
      <BuyUSDTShowcase />
      <NetworkSelectionShowcase />
      <ConfirmationShowcase />

      <WhyChooseTerexSection />

      <DashboardPreviewSection />

      <NetworksSection />

      <HowItWorksSection onBlockchainInfoClick={handleBlockchainInfo} />

      <StatsSection />
      
      <PaymentMethodsSection />

      <TestimonialsSection />
      
      <CTASection user={user} onGetStarted={handleGetStarted} />

      <FooterSection />
    </div>
  );
}
