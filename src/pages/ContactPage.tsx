import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContactMessages } from '@/hooks/useContactMessages';

const ContactPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createContactMessage } = useContactMessages();

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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      content: "Dakar, Sénégal\nPlateau, Avenue Léopold Sédar Senghor",
      subtext: "Siège social et bureau principal"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+221 77 123 4567\n+221 70 987 6543",
      subtext: "Disponible 24/7"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@terex.com\nsupport@terex.com",
      subtext: "Réponse sous 2h"
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "24/7 Support\nBureau: 8h - 18h WAT",
      subtext: "Lun - Dim"
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
              <MessageCircle className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Contactez-Nous</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Parlons de votre <span className="text-terex-accent">projet</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans vos opérations crypto-fiat.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Informations de Contact</h2>
                <p className="text-gray-300 text-lg mb-8">
                  Nous sommes disponibles pour vous aider à tout moment. N'hésitez pas à nous contacter.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-terex-accent" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                        <p className="text-gray-300 whitespace-pre-line">{info.content}</p>
                        <p className="text-terex-accent text-sm mt-1">{info.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-terex-gray/30">
                <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                    <Button key={social} variant="outline" size="sm" className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent hover:text-black">
                      {social}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Envoyez-nous un Message</h3>
                  <p className="text-gray-300">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
                </div>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Prénom *</label>
                      <Input className="bg-terex-dark border-terex-gray text-white" placeholder="Votre prénom" />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Nom *</label>
                      <Input className="bg-terex-dark border-terex-gray text-white" placeholder="Votre nom" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Email *</label>
                      <Input type="email" className="bg-terex-dark border-terex-gray text-white" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Téléphone</label>
                      <Input className="bg-terex-dark border-terex-gray text-white" placeholder="+221 XX XXX XXXX" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Sujet *</label>
                    <Input className="bg-terex-dark border-terex-gray text-white" placeholder="Objet de votre message" />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Message *</label>
                    <Textarea 
                      className="bg-terex-dark border-terex-gray text-white min-h-32" 
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                  
                  <Button className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold h-12">
                    Envoyer le Message
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
