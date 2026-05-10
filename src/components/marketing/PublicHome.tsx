
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { HeaderSection } from './sections/HeaderSection';
import { CurrencyConverterSection } from './sections/CurrencyConverterSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { CTASection } from './sections/CTASection';
import { FooterSection } from './sections/FooterSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Shield, Globe, TrendingUp, Users, Clock } from 'lucide-react';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

/* ── Section fonctionnalités (style Supabase feature grid) ── */
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Achat en quelques minutes',
      desc: 'Payez en CFA via Wave ou Orange Money et recevez vos USDT immédiatement sur votre wallet.',
      color: '#3b968f',
    },
    {
      icon: Shield,
      title: 'Sécurité maximale',
      desc: 'Chaque transaction est vérifiée manuellement par notre équipe. Votre argent est toujours protégé.',
      color: '#3b968f',
    },
    {
      icon: Globe,
      title: '6 pays africains',
      desc: 'Disponible au Sénégal, Côte d\'Ivoire, Mali, Burkina Faso, Niger et au Canada pour la diaspora.',
      color: '#3b968f',
    },
    {
      icon: TrendingUp,
      title: 'Meilleur taux du marché',
      desc: 'Notre taux est mis à jour en temps réel et battra celui de tous vos bureaux de change locaux.',
      color: '#3b968f',
    },
    {
      icon: Users,
      title: 'Trading OTC',
      desc: 'Pour les gros volumes, bénéficiez d\'un traitement prioritaire et d\'un taux négocié personnellement.',
      color: '#3b968f',
    },
    {
      icon: Clock,
      title: 'Support 24/7',
      desc: 'Notre équipe est disponible tous les jours par WhatsApp pour répondre à toutes vos questions.',
      color: '#3b968f',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: '#0f0f0f' }}>
      <div className="mx-auto max-w-7xl">
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: '#3b968f' }}>
            Fonctionnalités
          </span>
        </div>
        <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="font-light leading-tight max-w-lg"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fafafa' }}
          >
            Tout ce dont vous avez besoin pour échanger en toute confiance.
          </h2>
          <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: '#666' }}>
            Une plateforme complète construite pour les utilisateurs africains de crypto.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <Card
              key={title}
              className="rounded-2xl transition-colors group"
              style={{ background: '#111', border: '1px solid #1f1f1f' }}
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,150,143,0.1)', border: '1px solid rgba(59,150,143,0.15)' }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-white mb-2">{title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#666' }}>{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section stats ── */
function StatsBar() {
  const stats = [
    { value: '5 000+', label: 'Utilisateurs actifs' },
    { value: '< 5 min', label: 'Délai moyen' },
    { value: '6 pays', label: 'Couverts' },
    { value: '24/7', label: 'Support disponible' },
  ];

  return (
    <div style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-light text-white mb-1">{value}</p>
              <p className="text-[13px]" style={{ color: '#555' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Séparateur de section ── */
function SectionDivider() {
  return (
    <div
      className="mx-auto max-w-7xl px-6"
      style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #1f1f1f 20%, #1f1f1f 80%, transparent)' }}
    />
  );
}

/* ── Composant principal ── */
export function PublicHome({ onGetStarted, user, onShowDashboard }: PublicHomeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de se déconnecter', variant: 'destructive' });
    } else {
      toast({ title: 'Déconnecté', description: 'À bientôt !', className: 'bg-[#3b968f] text-white' });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f' }}>
      <PWAInstallPrompt />

      <HeaderSection user={user} onShowDashboard={onShowDashboard} onLogout={handleLogout} />

      {/* Espace pour la navbar fixe */}
      <div className="h-16" />

      {/* Hero */}
      <HeroSection user={user} onShowDashboard={onShowDashboard} />

      {/* Stats */}
      <StatsBar />

      {/* Features */}
      <FeaturesSection />

      <SectionDivider />

      {/* Convertisseur */}
      <section className="py-24 px-6" style={{ background: '#0f0f0f' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-3">
            <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: '#3b968f' }}>
              Convertisseur
            </span>
          </div>
          <h2
            className="font-light mb-14"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fafafa' }}
          >
            Calculez votre échange instantanément.
          </h2>
          <CurrencyConverterSection />
        </div>
      </section>

      <SectionDivider />

      {/* Comment ça marche */}
      <section className="py-24 px-6" style={{ background: '#0a0a0a' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-3">
            <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: '#3b968f' }}>
              Processus
            </span>
          </div>
          <h2
            className="font-light mb-14"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fafafa' }}
          >
            Trois étapes, c'est tout.
          </h2>
          <HowItWorksSection onBlockchainInfoClick={() => navigate('/blockchain')} />
        </div>
      </section>

      <SectionDivider />

      {/* Témoignages */}
      <section className="py-24 overflow-hidden" style={{ background: '#0f0f0f' }}>
        <div className="mx-auto max-w-7xl px-6 mb-14">
          <div className="mb-3">
            <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: '#3b968f' }}>
              Témoignages
            </span>
          </div>
          <h2
            className="font-light"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fafafa' }}
          >
            Ils nous font confiance.
          </h2>
        </div>
        <TestimonialsSection />
      </section>

      <SectionDivider />

      {/* CTA */}
      <CTASection user={user} onGetStarted={() => navigate('/auth')} />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
