
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const handleShowDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Notre <span className="text-terex-accent">Support</span> est là pour vous
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Contactez notre équipe d'assistance dédiée pour toute question ou problème. 
            Nous sommes disponibles 24h/7j pour vous aider.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-foreground mb-4">Comment pouvons-nous vous aider ?</h2>
            <p className="text-muted-foreground">Choisissez l'option qui vous convient le mieux</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                description: 'Contactez-nous directement sur WhatsApp pour une assistance rapide.',
                badge: 'Réponse immédiate',
                buttonText: '+1 (418) 261-9091',
                onClick: () => window.open('https://wa.me/+14182619091', '_blank'),
              },
              {
                icon: Mail,
                title: 'Support par email',
                description: 'Envoyez-nous un email et nous vous répondrons rapidement.',
                badge: 'Réponse en 24 heures',
                buttonText: 'terangaexchange@gmail.com',
                onClick: () => window.location.href = 'mailto:terangaexchange@gmail.com',
              },
              {
                icon: Phone,
                title: 'Support téléphonique',
                description: 'Appelez-nous pour une assistance immédiate (Canada/International).',
                badge: 'Disponible 24/7',
                buttonText: '+1 (418) 261-9091',
                onClick: () => window.location.href = 'tel:+14182619091',
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="rounded-2xl p-8 border border-terex-gray/30 hover:border-terex-accent/40 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-terex-accent/10 rounded-xl flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-terex-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <Badge className="bg-terex-accent/10 text-terex-accent border-terex-accent/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.badge}
                  </Badge>
                  
                  <Button 
                    className="mt-6 bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-6 py-3 w-full"
                    onClick={item.onClick}
                  >
                    {item.buttonText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
