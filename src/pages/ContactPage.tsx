import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock, ExternalLink } from 'lucide-react';
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
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: ''
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }
    const result = await sendMessage({
      subject: formData.subject,
      message: formData.message,
      user_email: formData.email,
      user_name: `${formData.firstName} ${formData.lastName}`,
      user_phone: formData.phone || undefined
    });
    if (!result.error) {
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    }
  };

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
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ CONTACT</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">
            Parlons de votre projet
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Notre équipe répond à toutes vos questions
          </p>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-4">Informations</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Siège social</p>
                      <p className="text-muted-foreground text-xs">Dakar, Sénégal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Horaires</p>
                      <p className="text-muted-foreground text-xs">Support disponible 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-white/10 pt-6">
                <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-4">Contact direct</p>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
                    className="w-full group flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium">WhatsApp</p>
                      <p className="text-muted-foreground text-[11px]">+1 (418) 261-9091</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 flex-shrink-0" />
                  </button>

                  <button
                    onClick={() => window.location.href = 'mailto:terangaexchange@gmail.com'}
                    className="w-full group flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium">Email</p>
                      <p className="text-muted-foreground text-[11px] truncate">terangaexchange@gmail.com</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 flex-shrink-0" />
                  </button>

                  <button
                    onClick={() => window.location.href = 'tel:+14182619091'}
                    className="w-full group flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium">Téléphone</p>
                      <p className="text-muted-foreground text-[11px]">+1 (418) 261-9091</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-4">Envoyez un message</p>
              <div className="p-5 md:p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-foreground text-xs font-medium mb-1.5">Prénom *</label>
                      <Input 
                        className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm" 
                        placeholder="Prénom" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-foreground text-xs font-medium mb-1.5">Nom *</label>
                      <Input 
                        className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm" 
                        placeholder="Nom" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-foreground text-xs font-medium mb-1.5">Email *</label>
                    <Input 
                      type="email" 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm" 
                      placeholder="votre@email.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground text-xs font-medium mb-1.5">Téléphone</label>
                    <Input 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm" 
                      placeholder="+1 418 261 9091" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground text-xs font-medium mb-1.5">Sujet *</label>
                    <Input 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm" 
                      placeholder="Objet de votre message" 
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground text-xs font-medium mb-1.5">Message *</label>
                    <Textarea 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground min-h-[100px] text-sm resize-none" 
                      placeholder="Décrivez votre demande..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-medium h-11"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
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
