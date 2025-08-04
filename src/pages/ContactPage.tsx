
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock } from 'lucide-react';
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
  const { sendMessage, loading } = useContactMessages();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const messageData = {
      subject: formData.subject,
      message: formData.message,
      user_email: formData.email,
      user_name: `${formData.firstName} ${formData.lastName}`,
      user_phone: formData.phone || undefined
    };

    const result = await sendMessage(messageData);

    if (!result.error) {
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      content: "Dakar, Sénégal\nPlateau, Avenue Léopold Sédar Senghor",
      subtext: "Siège social"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+221 77 397 27 49\nWhatsApp disponible",
      subtext: "Disponible 24/7"
    },
    {
      icon: Mail,
      title: "Email",
      content: "terangaexchange@gmail.com",
      subtext: "Réponse sous 2h"
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "24/7 Support\nService client continu",
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
                <h3 className="text-white font-semibold mb-4">Contactez-nous directement</h3>
                <div className="flex flex-col space-y-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white justify-start"
                    onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp: +1 (418) 261-9091
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent hover:text-black justify-start"
                    onClick={() => window.location.href = 'mailto:terangaexchange@gmail.com'}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    terangaexchange@gmail.com
                  </Button>
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
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Prénom *</label>
                      <Input 
                        className="bg-terex-dark border-terex-gray text-white" 
                        placeholder="Votre prénom" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Nom *</label>
                      <Input 
                        className="bg-terex-dark border-terex-gray text-white" 
                        placeholder="Votre nom" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Email *</label>
                      <Input 
                        type="email" 
                        className="bg-terex-dark border-terex-gray text-white" 
                        placeholder="votre@email.com" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Téléphone</label>
                      <Input 
                        className="bg-terex-dark border-terex-gray text-white" 
                        placeholder="+221 77 397 27 49" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Sujet *</label>
                    <Input 
                      className="bg-terex-dark border-terex-gray text-white" 
                      placeholder="Objet de votre message" 
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Message *</label>
                    <Textarea 
                      className="bg-terex-dark border-terex-gray text-white min-h-32" 
                      placeholder="Décrivez votre demande en détail..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold h-12"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
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
