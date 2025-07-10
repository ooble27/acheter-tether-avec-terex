
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Smartphone, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTerexRates } from '@/hooks/useTerexRates';

interface ImmersiveHeroProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function ImmersiveHero({ user, onShowDashboard }: ImmersiveHeroProps) {
  const navigate = useNavigate();
  const { terexRateCfa, loading } = useTerexRates();
  const [animatedRate, setAnimatedRate] = useState(600);

  // Animation du taux en temps réel
  useEffect(() => {
    if (!loading && terexRateCfa !== animatedRate) {
      const interval = setInterval(() => {
        setAnimatedRate(prev => {
          const diff = terexRateCfa - prev;
          if (Math.abs(diff) < 1) {
            clearInterval(interval);
            return terexRateCfa;
          }
          return prev + (diff > 0 ? Math.ceil(diff * 0.1) : Math.floor(diff * 0.1));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [terexRateCfa, loading, animatedRate]);

  const handleGetStarted = () => {
    if (user && onShowDashboard) {
      onShowDashboard();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-terex-dark">
      {/* Background Video/Image avec effet parallax */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Image de fond ultra réaliste - paiement QR code */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
            </div>
          </div>
          
          {/* Scène de paiement simulée */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-4xl mx-auto px-8">
              {/* Commerce local simulé */}
              <div className="absolute top-1/4 right-1/4 transform rotate-12 opacity-30">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-terex-accent rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="h-3 bg-white/40 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-white/20 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-20 h-20 text-gray-800" />
                  </div>
                  <div className="text-center text-white/80 text-sm">
                    Scanner pour payer
                  </div>
                </div>
              </div>

              {/* Téléphone simulé */}
              <div className="absolute bottom-1/4 left-1/4 transform -rotate-6 opacity-40">
                <div className="bg-gray-900 rounded-3xl p-2 border-2 border-gray-700">
                  <div className="bg-terex-dark rounded-2xl p-4 w-48 h-96">
                    <div className="bg-terex-accent rounded-xl h-12 flex items-center justify-center mb-4">
                      <div className="text-white font-bold text-sm">TEREX PAY</div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 bg-terex-gray rounded-lg flex items-center px-3">
                        <div className="text-terex-accent text-xs">1 USDT</div>
                      </div>
                      <div className="h-16 bg-terex-gray rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-terex-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay gradient sombre */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Colonne de gauche - Contenu textuel */}
            <div className="text-center lg:text-left">
              {/* Badge premium */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">Plateforme certifiée</span>
              </div>

              {/* Titre principal */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                La monnaie stable,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-cyan-400">
                  à portée de main.
                </span>
              </h1>
              
              {/* Sous-titre */}
              <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                Révolutionnez vos transactions avec USDT. 
                Échangez, transférez et payez en toute sécurité, partout en Afrique.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-cyan-500 hover:from-terex-accent/90 hover:to-cyan-500/90 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 group"
                >
                  {user ? 'Accéder au Dashboard' : 'Commencer maintenant'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrir
                </Button>
              </div>
            </div>
            
            {/* Colonne de droite - Animation interactive des taux */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Carte principale des taux */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <div className="text-center mb-6">
                    <div className="text-white/60 text-sm uppercase tracking-wider mb-2">Taux en direct</div>
                    <div className="text-white font-bold text-2xl">XOF ↔ USDT</div>
                  </div>
                  
                  {/* Affichage du taux animé */}
                  <div className="bg-gradient-to-r from-terex-accent/20 to-cyan-500/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">1</div>
                        <div className="text-terex-accent text-sm">USDT</div>
                      </div>
                      <div className="text-white/60 text-2xl">=</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-cyan-400">
                          {animatedRate.toLocaleString()}
                        </div>
                        <div className="text-cyan-400 text-sm">XOF</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicateurs de tendance */}
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Tendance stable</span>
                  </div>
                </div>

                {/* Éléments décoratifs flottants */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-terex-accent/30 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
          
          {/* Stats rapides en bas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 lg:mt-24">
            {[
              { value: "5min", label: "Transfert instantané" },
              { value: "24/7", label: "Disponibilité" },
              { value: "6+", label: "Pays supportés" },
              { value: "0%", label: "Frais cachés" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-terex-accent/50 rounded-full animate-ping" style={{ top: '60%', right: '15%', animationDelay: '2s' }}></div>
        <div className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ bottom: '30%', left: '20%', animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}
