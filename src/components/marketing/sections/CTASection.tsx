
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 mb-8 font-light">
          {t('cta.subtitle')}
        </p>
        {!user && (
          <>
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-light px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full max-w-80 sm:max-w-none sm:w-auto mx-auto"
            >
              <span className="truncate">{t('cta.button')}</span>
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
