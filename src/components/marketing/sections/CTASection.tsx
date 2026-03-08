
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  const isMobile = useIsMobile();

  // Hidden on mobile
  if (isMobile) return null;

  return (
    <section className="py-24 sm:py-32 bg-terex-dark relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-terex-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 lg:p-16 text-center backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-terex-accent/10 border border-terex-accent/20 rounded-full text-terex-accent text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Rejoignez Terex
          </div>

          <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 leading-tight">
            {user ? (
              <>Continuez avec <span className="text-terex-accent">Terex</span></>
            ) : (
              <>Prêt à commencer<br />avec <span className="text-terex-accent">Terex</span> ?</>
            )}
          </h2>
          <p className="text-xl text-gray-400 mb-10 font-light max-w-2xl mx-auto">
            {user ? (
              "Explorez nos services d'échange USDT et de transferts vers l'Afrique."
            ) : (
              "Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique."
            )}
          </p>
          {!user && (
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-10 py-6 text-lg rounded-2xl shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/30 hover:scale-[1.02]"
              >
                Créer mon compte gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-gray-500 text-sm">
                Inscription gratuite • Vérification en 24h • Support 24/7
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
