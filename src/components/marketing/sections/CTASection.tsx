
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
    <section className="py-24 sm:py-28" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center"
          style={{
            backgroundColor: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6" style={{ color: '#fff' }}>
            {user ? 'Continuez avec Terex' : 'Prêt à commencer avec Terex ?'}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {user
              ? "Explorez nos services d'échange USDT et de transferts vers l'Afrique."
              : "Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique."}
          </p>

          <div className="flex flex-col items-center gap-5">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="h-12 px-8 rounded-xl text-base hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
            >
              {user ? 'Accéder au tableau de bord' : 'Créer mon compte gratuitement'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {!user && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Inscription gratuite • Vérification en 24h • Support 24/7
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
