
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {user ? (
            <>Continuez votre expérience avec <span className="text-terex-accent">Terex</span></>
          ) : (
            <>Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?</>
          )}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          {user ? (
            "Explorez nos services d'échange USDT et de transferts vers l'Afrique, ou découvrez notre boutique crypto."
          ) : (
            "Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique."
          )}
        </p>
        {!user && (
          <>
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full max-w-80 sm:max-w-none sm:w-auto mx-auto"
            >
              <span className="truncate">Créer mon compte gratuitement</span>
              <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0" />
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Inscription gratuite • Vérification en 24h • Support 24/7
            </p>
          </>
        )}
      </div>
    </section>
  );
}
