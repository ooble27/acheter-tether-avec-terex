
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/i18n/LanguageContext';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (isMobile) return null;

  return (
    <section className="py-24 sm:py-32 bg-terex-dark relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 lg:p-16 text-center backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-terex-accent/10 border border-terex-accent/20 rounded-full text-terex-accent text-sm font-medium mb-8">
            {t.cta.joinTerex}
          </div>

          <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 leading-tight">
            {user ? (
              <>{t.cta.continueWith} <span className="text-terex-accent">Terex</span></>
            ) : (
              <>{t.cta.readyToStart}<br />{t.cta.with} <span className="text-terex-accent">Terex</span> {t.cta.questionMark}</>
            )}
          </h2>
          <p className="text-xl text-gray-400 mb-10 font-light max-w-2xl mx-auto">
            {user ? t.cta.loggedInDesc : t.cta.loggedOutDesc}
          </p>
          {!user && (
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-10 py-6 text-lg rounded-2xl shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/30 hover:scale-[1.02]"
              >
                {t.cta.createAccount}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-gray-500 text-sm">
                {t.cta.freeSignup}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
