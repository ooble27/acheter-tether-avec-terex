
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Globe, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTerexRates } from '@/hooks/useTerexRates';

interface DiasporaHeroProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function DiasporaHero({ user, onShowDashboard }: DiasporaHeroProps) {
  const navigate = useNavigate();
  const { terexRateCfa, loading } = useTerexRates();
  const [activeRoute, setActiveRoute] = useState(0);

  // Routes d'envoi d'argent populaires
  const transferRoutes = [
    { from: 'Paris', to: 'Dakar', fromCountry: 'France', toCountry: 'Sénégal', currency: 'XOF' },
    { from: 'Montréal', to: 'Abidjan', fromCountry: 'Canada', toCountry: 'Côte d\'Ivoire', currency: 'XOF' },
    { from: 'Londres', to: 'Lagos', fromCountry: 'UK', toCountry: 'Nigeria', currency: 'NGN' },
    { from: 'New York', to: 'Accra', fromCountry: 'USA', toCountry: 'Ghana', currency: 'GHS' }
  ];

  // Animation des routes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute((prev) => (prev + 1) % transferRoutes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (user && onShowDashboard) {
      onShowDashboard();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-terex-dark">
      {/* Background avec split effect */}
      <div className="absolute inset-0 z-0">
        {/* Partie gauche - Diaspora (Paris/Montréal) */}
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Simulation d'une ville européenne/nord-américaine */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat"></div>
            </div>
            
            {/* Personne en diaspora */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <div className="w-24 h-24 bg-terex-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-terex-accent" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg mb-1">Diaspora</div>
                  <div className="text-white/70 text-sm">{transferRoutes[activeRoute].from}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partie droite - Afrique */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full bg-gradient-to-bl from-terex-accent/20 to-terex-dark">
            {/* Simulation d'une ville africaine */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjM0I5NjhGIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] bg-repeat"></div>
            </div>
            
            {/* Famille en Afrique */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
              <div className="bg-terex-accent/20 backdrop-blur-sm rounded-3xl p-6 border border-terex-accent/30">
                <div className="w-24 h-24 bg-terex-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-terex-accent" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg mb-1">Famille</div>
                  <div className="text-terex-accent text-sm">{transferRoutes[activeRoute].to}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation avec animation */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-terex-accent to-transparent transform -translate-x-1/2">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-terex-accent rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Flèche animée de transfert */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
            <Send className="w-5 h-5 text-terex-accent animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-r from-terex-accent to-cyan-400"></div>
            <ArrowRight className="w-5 h-5 text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Badge international */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Transferts internationaux</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Envoyez de l'argent à vos proches
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-cyan-400">
                en stablecoins.
              </span>
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connectez l'Afrique au monde. Transférez instantanément avec USDT, 
              sans frais cachés, vers plus de 6 pays africains.
            </p>

            {/* Route active */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/10">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{transferRoutes[activeRoute].from}</div>
                  <div className="text-white/60 text-sm">{transferRoutes[activeRoute].fromCountry}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-terex-accent"></div>
                  <Send className="w-5 h-5 text-terex-accent" />
                  <div className="w-8 h-px bg-terex-accent"></div>
                </div>
                <div className="text-center">
                  <div className="text-terex-accent font-bold text-lg">{transferRoutes[activeRoute].to}</div>
                  <div className="text-terex-accent/80 text-sm">{transferRoutes[activeRoute].toCountry}</div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-cyan-500 hover:from-terex-accent/90 hover:to-cyan-500/90 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 group"
              >
                {user ? 'Envoyer de l\'argent' : 'Commencer un transfert'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comment ça marche
              </Button>
            </div>
          </div>
          
          {/* Mini-carte des transferts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {transferRoutes.map((route, index) => (
              <div 
                key={index} 
                className={`text-center p-4 rounded-xl border transition-all duration-300 ${
                  index === activeRoute 
                    ? 'bg-terex-accent/20 border-terex-accent text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium mb-1">{route.from}</div>
                <ArrowRight className={`w-4 h-4 mx-auto mb-1 ${index === activeRoute ? 'text-terex-accent' : 'text-white/40'}`} />
                <div className="text-sm font-medium">{route.to}</div>
              </div>
            ))}
          </div>

          {/* Stats de performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: "2min", label: "Transfert moyen" },
              { value: "6+", label: "Pays africains" },
              { value: "0.5%", label: "Frais seulement" },
              { value: "24/7", label: "Disponibilité" }
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
        <div className="absolute w-1 h-1 bg-terex-accent/50 rounded-full animate-ping" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ top: '70%', right: '20%', animationDelay: '2s' }}></div>
        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ bottom: '40%', left: '80%', animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}
