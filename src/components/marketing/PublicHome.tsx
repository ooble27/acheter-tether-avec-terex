
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { LiveSocialProof } from './LiveSocialProof';
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
import { FounderSection } from './sections/FounderSection';
import { SectionDividerWithLabel } from './sections/SectionDivider';

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
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
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
      
      <SectionDividerWithLabel leftLabel="[01] CONVERTISSEUR" rightLabel="/ FCFA ↔ USDT" className="mt-8" />
      <CurrencyConverterSection />

      {/* Feature showcases avant "Nos avantages" */}
      <SectionDividerWithLabel leftLabel="[02] FONCTIONNALITÉS" rightLabel="/ ACHAT SIMPLIFIÉ" className="mt-8" />
      <BuyUSDTShowcase />
      <NetworkSelectionShowcase />
      <ConfirmationShowcase />

      <SectionDividerWithLabel leftLabel="[03] AVANTAGES" rightLabel="/ POURQUOI TEREX" className="mt-8" />
      <WhyChooseTerexSection />

      <SectionDividerWithLabel leftLabel="[04] APERÇU" rightLabel="/ TABLEAU DE BORD" className="mt-8" />
      <DashboardPreviewSection />

      <SectionDividerWithLabel leftLabel="[05] RÉSEAUX" rightLabel="/ BLOCKCHAIN" className="mt-8" />
      <NetworksSection />

      <SectionDividerWithLabel leftLabel="[06] PROCESSUS" rightLabel="/ COMMENT ÇA MARCHE" className="mt-8" />
      <HowItWorksSection onBlockchainInfoClick={handleBlockchainInfo} />

      <SectionDividerWithLabel leftLabel="[07] EN DIRECT" rightLabel="/ ACTIVITÉ LIVE" className="mt-8" />
      <LiveSocialProof />

      <SectionDividerWithLabel leftLabel="[08] STATISTIQUES" rightLabel="/ PERFORMANCES" className="mt-8" />
      <StatsSection />
      
      <SectionDividerWithLabel leftLabel="[09] PAIEMENTS" rightLabel="/ MÉTHODES ACCEPTÉES" className="mt-8" />
      <PaymentMethodsSection />

      <SectionDividerWithLabel leftLabel="[10] TÉMOIGNAGES" rightLabel="/ AVIS CLIENTS" className="mt-8" />
      <TestimonialsSection />

      <SectionDividerWithLabel leftLabel="[11] FONDATEUR" rightLabel="/ NOTRE HISTOIRE" className="mt-8" />
      <FounderSection />
      
      <SectionDividerWithLabel leftLabel="[12] DÉMARRER" rightLabel="/ REJOIGNEZ-NOUS" className="mt-8" />
      <CTASection user={user} onGetStarted={handleGetStarted} />

      <FooterSection />
    </div>
  );
}
