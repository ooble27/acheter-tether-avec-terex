import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, Send } from 'lucide-react';
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

      {/* Hero - monumental */}
      <section className="pt-20 pb-10 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-5 tracking-tight">
            Contactez notre équipe
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            Nous vous aiderons à trouver la solution adaptée à vos besoins.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            
            {/* Left: Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">Prénom *</label>
                    <Input 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground h-10 text-sm rounded-lg"
                      placeholder="Prénom" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">Nom *</label>
                    <Input 
                      className="bg-white/[0.03] border-white/[0.08] text-foreground h-12 text-sm rounded-lg" 
                      placeholder="Nom" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">Email *</label>
                  <Input 
                    type="email" 
                    className="bg-white/[0.03] border-white/[0.08] text-foreground h-12 text-sm rounded-lg" 
                    placeholder="votre@email.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">Téléphone</label>
                  <Input 
                    className="bg-white/[0.03] border-white/[0.08] text-foreground h-12 text-sm rounded-lg" 
                    placeholder="+1 (418) 261-9091" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">Sujet *</label>
                  <Input 
                    className="bg-white/[0.03] border-white/[0.08] text-foreground h-12 text-sm rounded-lg" 
                    placeholder="Objet de votre message" 
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">Message *</label>
                  <Textarea 
                    className="bg-white/[0.03] border-white/[0.08] text-foreground min-h-[160px] text-sm resize-none rounded-lg" 
                    placeholder="Décrivez votre demande..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-12 rounded-lg"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Right: Contact info */}
            <div className="lg:col-span-2 space-y-10">

              {/* Chat with us */}
              <div>
                <h3 className="text-foreground font-semibold text-base mb-1.5">Discutez avec nous</h3>
                <p className="text-muted-foreground text-sm mb-4">Contactez notre équipe directement.</p>
                <div className="space-y-3">
                  <a href="https://wa.me/+14182619091" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a href="mailto:terangaexchange@gmail.com"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <Mail className="w-[18px] h-[18px] flex-shrink-0" />
                    terangaexchange@gmail.com
                  </a>
                  <a href="https://t.me/teraborange" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    Telegram
                  </a>
                  <a href="https://www.instagram.com/teraborange" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    Instagram
                  </a>
                  <a href="https://x.com/teraborange" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </a>
                  <a href="https://www.facebook.com/teraborange" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>

              {/* Call us */}
              <div>
                <h3 className="text-foreground font-semibold text-base mb-1.5">Appelez-nous</h3>
                <p className="text-muted-foreground text-sm mb-4">Support disponible 24/7.</p>
                <div className="space-y-3">
                  <a href="tel:+14182619091"
                    className="flex items-center gap-2.5 text-sm text-foreground hover:underline underline-offset-4">
                    <Phone className="w-[18px] h-[18px] flex-shrink-0" />
                    +1 (418) 261-9091
                  </a>
                </div>
              </div>

              {/* Trust */}
              <div>
                <h3 className="text-foreground font-semibold text-base mb-1.5">+2 000 utilisateurs</h3>
                <p className="text-muted-foreground text-sm">
                  La plateforme de confiance pour acheter, vendre et transférer de l'USDT en Afrique.
                </p>
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
