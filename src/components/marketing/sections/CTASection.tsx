
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
          {user ? (
            <>Continuez votre expérience avec <span className="text-terex-accent">Terex</span></>
          ) : (
            <>Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?</>
          )}
        </h2>
        <p className="text-lg sm:text-xl text-gray-500 mb-8 font-light">
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
              className="bg-gray-900 hover:bg-gray-800 text-white font-light px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 w-full max-w-80 sm:max-w-none sm:w-auto mx-auto group"
            >
              <span>Créer mon compte gratuitement</span>
              <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
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
