import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, HelpCircle, FileText, ArrowRight, ExternalLink } from 'lucide-react';
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
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ SUPPORT</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Notre équipe est disponible 24h/7j
          </p>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* Contact channels */}
      <section className="py-8 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Canaux de contact</p>
          
          <div className="space-y-3">
            {/* WhatsApp */}
            <button
              onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
              className="w-full group flex items-center gap-4 p-4 md:p-5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm md:text-base">WhatsApp</p>
                <p className="text-muted-foreground text-xs md:text-sm">+1 (418) 261-9091 · Réponse immédiate</p>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
            </button>

            {/* Email */}
            <button
              onClick={() => window.location.href = 'mailto:terangaexchange@gmail.com'}
              className="w-full group flex items-center gap-4 p-4 md:p-5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm md:text-base">Email</p>
                <p className="text-muted-foreground text-xs md:text-sm truncate">terangaexchange@gmail.com · Réponse sous 2h</p>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
            </button>

            {/* Téléphone */}
            <button
              onClick={() => window.location.href = 'tel:+14182619091'}
              className="w-full group flex items-center gap-4 p-4 md:p-5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm md:text-base">Téléphone</p>
                <p className="text-muted-foreground text-xs md:text-sm">+1 (418) 261-9091 · Disponible 24/7</p>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* Resources */}
      <section className="py-8 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Ressources utiles</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/faq')}
              className="group p-5 md:p-8 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground mb-3" />
              <p className="text-foreground font-medium text-sm md:text-base">FAQ</p>
              <p className="text-muted-foreground text-xs mt-1">Questions fréquentes</p>
            </button>
            <button
              onClick={() => navigate('/guide')}
              className="group p-5 md:p-8 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
            >
              <FileText className="w-5 h-5 text-muted-foreground mb-3" />
              <p className="text-foreground font-medium text-sm md:text-base">Guide</p>
              <p className="text-muted-foreground text-xs mt-1">Comment utiliser Terex</p>
            </button>
          </div>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* CTA */}
      <section className="py-10 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-3">
            Besoin d'une aide immédiate ?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Ouvrez une conversation WhatsApp avec notre équipe
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/+14182619091', '_blank')}
            className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11"
          >
            Contacter sur WhatsApp
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
