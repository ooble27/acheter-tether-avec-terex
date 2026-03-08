import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, ArrowRight, ChevronRight } from 'lucide-react';
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

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Réponse immédiate',
      value: '+1 (418) 261-9091',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      onClick: () => window.open('https://wa.me/+14182619091', '_blank'),
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Réponse sous 24h',
      value: 'terangaexchange@gmail.com',
      color: 'from-terex-accent to-yellow-500',
      bgColor: 'bg-terex-accent/10',
      borderColor: 'border-terex-accent/20',
      onClick: () => window.location.href = 'mailto:terangaexchange@gmail.com',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      description: 'Disponible 24/7',
      value: '+1 (418) 261-9091',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      onClick: () => window.location.href = 'tel:+14182619091',
    },
  ];

  const quickLinks = [
    { icon: HelpCircle, title: 'FAQ', description: 'Questions fréquentes', path: '/faq' },
    { icon: FileText, title: 'Guide', description: "Comment utiliser Terex", path: '/guide' },
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
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

      <div className="h-16 md:h-20" />

      {/* Hero Section - Compact on mobile */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-terex-accent/10 border border-terex-accent/20 rounded-full text-terex-accent text-xs font-medium mb-4">
              Support 24/7
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground mb-3 md:mb-6">
              Comment pouvons-nous <span className="text-terex-accent">vous aider</span> ?
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est disponible 24h/7j pour répondre à vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels - Stack on mobile */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 md:space-y-4">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <button
                  key={index}
                  onClick={channel.onClick}
                  className={`w-full group p-4 md:p-6 rounded-2xl ${channel.bgColor} border ${channel.borderColor} hover:scale-[1.02] transition-all duration-300 text-left`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-white font-semibold text-base md:text-lg">{channel.title}</h3>
                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/70 hidden md:inline-block">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {channel.description}
                        </span>
                      </div>
                      <p className="text-terex-accent font-medium text-sm md:text-base truncate">{channel.value}</p>
                      <p className="text-muted-foreground text-xs md:hidden mt-0.5">{channel.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Ressources utiles</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="group p-4 md:p-6 rounded-xl bg-terex-darker/50 border border-terex-gray/20 hover:border-terex-accent/40 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-terex-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <IconComponent className="w-5 h-5 text-terex-accent" />
                  </div>
                  <h3 className="text-white font-medium text-sm md:text-base">{link.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm mt-0.5">{link.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-10 rounded-2xl bg-gradient-to-br from-terex-accent/10 to-transparent border border-terex-accent/20 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3">
              Besoin d'une aide personnalisée ?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-5 md:mb-6 max-w-lg mx-auto">
              Contactez-nous directement sur WhatsApp pour une assistance immédiate
            </p>
            <Button 
              onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 h-12"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ouvrir WhatsApp
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
