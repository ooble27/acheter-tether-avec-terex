
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-terex-accent/10 rounded-full blur-[150px]" />
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terex-accent/20 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Sparkle badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terex-accent/10 border border-terex-accent/20 mb-8">
          <Sparkles className="w-4 h-4 text-terex-accent" />
          <span className="text-terex-accent text-sm">Rejoignez-nous aujourd'hui</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
          {user ? (
            <>
              Continuez votre expérience avec{' '}
              <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
                Terex
              </span>
            </>
          ) : (
            <>
              Prêt à commencer avec{' '}
              <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
                Terex
              </span>
              {' '}?
            </>
          )}
        </h2>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          {user ? (
            "Explorez nos services d'échange USDT et de transferts vers l'Afrique."
          ) : (
            "Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique."
          )}
        </p>
        
        {!user && (
          <div className="space-y-6">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="group bg-terex-accent hover:bg-terex-accent/90 text-black px-10 py-7 text-xl rounded-2xl shadow-[0_0_60px_rgba(59,150,143,0.4)] hover:shadow-[0_0_80px_rgba(59,150,143,0.6)] transition-all duration-500"
            >
              Créer mon compte gratuitement
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-terex-accent rounded-full" />
                Inscription gratuite
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-terex-accent rounded-full" />
                Vérification en 24h
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-terex-accent rounded-full" />
                Support 24/7
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
