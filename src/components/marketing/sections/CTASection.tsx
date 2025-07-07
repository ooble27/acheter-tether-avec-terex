import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, CheckCircle } from 'lucide-react';

interface CTASectionProps {
  user?: { email: string; name: string } | null;
  onGetStarted: () => void;
}

export function CTASection({ user, onGetStarted }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-terex-accent/5 via-transparent to-terex-accent/10"></div>
        
        {/* Animated elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-terex-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-terex-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating icons */}
        <div className="absolute top-16 right-16 opacity-10">
          <Sparkles className="w-8 h-8 text-terex-accent animate-spin" style={{animationDuration: '8s'}} />
        </div>
        <div className="absolute bottom-24 left-16 opacity-10">
          <Zap className="w-6 h-6 text-terex-accent animate-bounce" />
        </div>
        <div className="absolute top-1/3 left-20 opacity-10">
          <Shield className="w-10 h-10 text-terex-accent animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 relative">
            {user ? (
              <>
                Continuez votre expérience avec{' '}
                <span className="text-terex-accent relative">
                  Terex
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent animate-pulse"></div>
                </span>
              </>
            ) : (
              <>
                Prêt à commencer avec{' '}
                <span className="text-terex-accent relative">
                  Terex
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent animate-pulse"></div>
                </span>
                {' '}?
              </>
            )}
          </h2>
        </div>
        
        <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
          {user ? (
            "Explorez nos services d'échange USDT et de transferts vers l'Afrique, ou découvrez notre boutique crypto."
          ) : (
            <>
              Rejoignez des <span className="text-terex-accent font-semibold">milliers d'utilisateurs</span> qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique.
            </>
          )}
        </p>
        
        {!user && (
          <>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-terex-accent/20 via-terex-accent/30 to-terex-accent/20 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
              
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="group relative bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full max-w-80 sm:max-w-none sm:w-auto mx-auto overflow-hidden"
              >
                <span className="relative z-10 truncate">Créer mon compte gratuitement</span>
                <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Inscription gratuite</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-terex-accent" />
                <span>Vérification en 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Support 24/7</span>
              </div>
            </div>
          </>
        )}
        
        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-terex-accent/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">10K+</div>
              <div className="text-xs text-gray-400">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">25+</div>
              <div className="text-xs text-gray-400">Pays couverts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">$5M+</div>
              <div className="text-xs text-gray-400">Volume mensuel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">99.9%</div>
              <div className="text-xs text-gray-400">Disponibilité</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
