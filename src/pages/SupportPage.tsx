
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, Clock, FileText, HelpCircle, Search, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Chat en Direct",
      description: "Obtenez une aide immédiate via notre chat 24/7",
      action: "Démarrer le chat",
      available: true
    },
    {
      icon: Phone,
      title: "Support Téléphonique",
      description: "Appelez-nous pour une assistance personnalisée",
      action: "+221 77 123 4567",
      available: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Envoyez-nous vos questions détaillées",
      action: "support@terex.com",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <HelpCircle className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Centre d'Aide</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Comment pouvons-nous <span className="text-terex-accent">vous aider</span> ?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Notre équipe de support est disponible 24/7 pour vous accompagner dans toutes vos opérations crypto-fiat.
            </p>
            
            <div className="flex justify-center">
              <div className="relative max-w-2xl w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Rechercher dans notre base de connaissances..."
                  className="bg-terex-darker border-terex-accent/30 text-white placeholder:text-gray-400 pl-12 h-14 text-lg"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-terex-accent hover:bg-terex-accent/90 text-black">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Contactez Notre Support</h2>
            <p className="text-gray-300 text-lg">Choisissez le moyen qui vous convient le mieux</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 p-8 text-center hover:border-terex-accent/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-terex-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{option.title}</h3>
                  <p className="text-gray-300 mb-6">{option.description}</p>
                  <Button className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold">
                    {option.action}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Envoyez-nous un Message</h3>
                <p className="text-gray-300">Notre équipe vous répondra dans les plus brefs délais</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white font-medium mb-2">Nom complet</label>
                  <Input className="bg-terex-dark border-terex-gray text-white" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <Input type="email" className="bg-terex-dark border-terex-gray text-white" placeholder="votre@email.com" />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Sujet</label>
                <Input className="bg-terex-dark border-terex-gray text-white" placeholder="Objet de votre message" />
              </div>
              
              <div className="mb-8">
                <label className="block text-white font-medium mb-2">Message</label>
                <Textarea 
                  className="bg-terex-dark border-terex-gray text-white min-h-32" 
                  placeholder="Décrivez votre problème en détail..."
                />
              </div>
              
              <Button className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold h-14 text-lg">
                Envoyer le Message
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
