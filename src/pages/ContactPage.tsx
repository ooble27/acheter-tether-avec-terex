import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock, ArrowRight } from 'lucide-react';
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
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+1 (418) 261-9091',
      description: 'Réponse immédiate',
      color: 'from-green-500 to-green-600',
      onClick: () => window.open('https://wa.me/+14182619091', '_blank'),
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'terangaexchange@gmail.com',
      description: 'Réponse sous 2h',
      color: 'from-terex-accent to-yellow-500',
      onClick: () => window.location.href = 'mailto:terangaexchange@gmail.com',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+1 (418) 261-9091',
      description: 'Disponible 24/7',
      color: 'from-blue-500 to-blue-600',
      onClick: () => window.location.href = 'tel:+14182619091',
    },
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
              Contact
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground mb-3 md:mb-6">
              Parlons de votre <span className="text-terex-accent">projet</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre équipe répond à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods - Horizontal scroll on mobile */}
      <section className="pb-8 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={index}
                  onClick={method.onClick}
                  className="flex-shrink-0 w-[260px] md:w-auto group p-4 md:p-6 rounded-2xl bg-terex-darker/50 border border-terex-gray/20 hover:border-terex-accent/40 transition-all duration-300 text-left"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 md:mb-4`}>
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1">{method.title}</h3>
                  <p className="text-terex-accent text-xs md:text-sm font-medium mb-1">{method.value}</p>
                  <p className="text-muted-foreground text-xs">{method.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content - Stack on mobile */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Contact Form - Full width on mobile */}
            <div className="order-1 lg:order-2">
              <div className="bg-terex-darker/50 border border-terex-gray/20 rounded-2xl p-5 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Envoyez un message</h2>
                <p className="text-muted-foreground text-sm mb-6">Nous vous répondrons rapidement</p>
                
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1.5">Prénom *</label>
                      <Input 
                        className="bg-terex-dark/50 border-terex-gray/30 text-white h-11" 
                        placeholder="Prénom" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1.5">Nom *</label>
                      <Input 
                        className="bg-terex-dark/50 border-terex-gray/30 text-white h-11" 
                        placeholder="Nom" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">Email *</label>
                    <Input 
                      type="email" 
                      className="bg-terex-dark/50 border-terex-gray/30 text-white h-11" 
                      placeholder="votre@email.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">Téléphone</label>
                    <Input 
                      className="bg-terex-dark/50 border-terex-gray/30 text-white h-11" 
                      placeholder="+1 418 261 9091" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">Sujet *</label>
                    <Input 
                      className="bg-terex-dark/50 border-terex-gray/30 text-white h-11" 
                      placeholder="Objet de votre message" 
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-1.5">Message *</label>
                    <Textarea 
                      className="bg-terex-dark/50 border-terex-gray/30 text-white min-h-[100px] md:min-h-[120px] resize-none" 
                      placeholder="Décrivez votre demande..."
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
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Informations</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-terex-darker/30 border border-terex-gray/10">
                    <div className="w-10 h-10 bg-terex-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-terex-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">Siège social</h3>
                      <p className="text-muted-foreground text-sm">Dakar, Sénégal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-terex-darker/30 border border-terex-gray/10">
                    <div className="w-10 h-10 bg-terex-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-terex-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">Horaires</h3>
                      <p className="text-muted-foreground text-sm">Support disponible 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 border border-terex-accent/20">
                <h3 className="text-white font-semibold text-base md:text-lg mb-2">Besoin d'aide urgente ?</h3>
                <p className="text-muted-foreground text-sm mb-4">Contactez-nous directement sur WhatsApp pour une réponse immédiate.</p>
                <Button 
                  onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ouvrir WhatsApp
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
