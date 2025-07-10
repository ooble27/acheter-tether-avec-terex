
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AfricanYouthHeroProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function AfricanYouthHero({ user, onShowDashboard }: AfricanYouthHeroProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    if (onShowDashboard) {
      onShowDashboard();
    }
  };

  const handleHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-terex-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                L'avenir des 
                <br />
                <span className="text-terex-accent bg-gradient-to-r from-terex-accent to-terex-accent-light bg-clip-text text-transparent">
                  paiements digitaux
                </span>
                <br />
                en Afrique
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Rejoignez des milliers de jeunes Africains qui transforment leur façon de 
                gérer l'argent avec USDT. Rapide, sécurisé et accessible partout.
              </p>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent/90 hover:to-terex-accent-light/90 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
                >
                  Accéder au Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent/90 hover:to-terex-accent-light/90 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
                >
                  Commencer maintenant
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-2 border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 hover:border-terex-accent/50 px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Découvrir comment
              </Button>
            </div>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-terex-accent">50K+</div>
                <div className="text-sm text-gray-400">Utilisateurs actifs</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-terex-accent">15</div>
                <div className="text-sm text-gray-400">Pays supportés</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-terex-accent">24/7</div>
                <div className="text-sm text-gray-400">Support client</div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - Image moderne */}
          <div className="relative">
            {/* Container principal avec effet de profondeur */}
            <div className="relative">
              {/* Arrière-plan futuriste avec gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/20 via-purple-500/10 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="absolute inset-4 bg-gradient-to-tl from-terex-accent/10 via-transparent to-cyan-500/10 rounded-2xl blur-2xl"></div>
              
              {/* Image principale */}
              <div className="relative bg-gradient-to-br from-terex-darker/80 to-terex-gray/60 rounded-3xl p-8 backdrop-blur-sm border border-terex-accent/20 shadow-2xl">
                {/* Simulation d'une image de groupe de jeunes Africains */}
                <div className="aspect-[4/3] bg-gradient-to-br from-terex-accent/30 via-purple-500/20 to-blue-500/30 rounded-2xl relative overflow-hidden">
                  {/* Éléments décoratifs représentant des personnes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 w-full h-full p-6">
                      {/* Représentation stylisée de personnes */}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-gradient-to-br from-white/20 to-white/5 rounded-full aspect-square flex items-center justify-center backdrop-blur-sm border border-white/10">
                          <div className="w-8 h-8 bg-terex-accent/60 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Overlay avec texte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-lg">Coworking & Innovation Hub</p>
                    <p className="text-white/80 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
                
                {/* Éléments tech flottants */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent-light rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités en bas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Échange USDT</h3>
              <p className="text-gray-400 text-sm">Convertissez facilement vos devises locales en USDT</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Transferts rapides</h3>
              <p className="text-gray-400 text-sm">Envoyez de l'argent partout en Afrique en quelques secondes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sécurité maximale</h3>
              <p className="text-gray-400 text-sm">Protection avancée et conformité réglementaire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
