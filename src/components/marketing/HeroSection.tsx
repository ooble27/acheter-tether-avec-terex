
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, ArrowRightLeft, Send, Banknote, TrendingUp, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Synchronisation avec DeviceMockups
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    if (onShowDashboard) {
      onShowDashboard();
    }
  };

  const handleHowItWorks = () => {
    // Scroll to "Comment ça marche" section
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Contenu dynamique pour le téléphone selon le slide actuel
  const getPhoneContent = () => {
    switch (currentSlide) {
      case 0: // "L'échange USDT Tether et les transferts vers l'Afrique"
        return (
          <>
            {/* Header de l'app */}
            <div className="bg-terex-darker p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Terex Exchange</h2>
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
            
            {/* Interface d'échange USDT */}
            <div className="p-4 space-y-3">
              <div className="bg-terex-darker rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Vous vendez</span>
                  <span className="text-terex-accent text-xs">Balance: 1,250.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">₮</span>
                    </div>
                    <span className="text-white font-medium text-sm">USDT</span>
                  </div>
                  <span className="text-white font-bold">100.00</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-terex-accent rotate-90" />
                </div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Vous recevez</span>
                  <span className="text-terex-accent text-xs">1 USDT = 650 CFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                    <span className="text-white font-medium text-sm">XOF</span>
                  </div>
                  <span className="text-white font-bold">65,000</span>
                </div>
              </div>

              <Button className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-medium py-2 text-sm">
                Échanger maintenant
              </Button>
            </div>
          </>
        );

      case 1: // "Achetez des USDT facilement avec Terex"
        return (
          <>
            {/* Header de l'app */}
            <div className="bg-terex-darker p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Acheter USDT</h2>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Interface d'achat USDT */}
            <div className="p-4 space-y-3">
              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-1">Montant à acheter</label>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    value="500" 
                    className="bg-transparent text-white font-bold text-lg flex-1" 
                    readOnly 
                  />
                  <span className="text-terex-accent font-medium">USDT</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">≈ 325,000 XOF</div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-2">Méthode de paiement</label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💳</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Mobile Money</div>
                    <div className="text-gray-400 text-xs">Orange Money, MTN</div>
                  </div>
                </div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-1">Adresse de réception</label>
                <input 
                  type="text" 
                  value="TQn9Y2khEsLJW1ChVWFMSMeRDow..." 
                  className="bg-transparent text-white text-sm w-full" 
                  readOnly 
                />
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 text-sm">
                Acheter 500 USDT
              </Button>
            </div>
          </>
        );

      case 2: // "Vendez vos stablecoins en toute sécurité"
        return (
          <>
            {/* Header de l'app */}
            <div className="bg-terex-darker p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Vendre USDT</h2>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Interface de vente USDT */}
            <div className="p-4 space-y-3">
              <div className="bg-terex-darker rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Montant à vendre</span>
                  <span className="text-terex-accent text-xs">Balance: 2,450 USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    value="1,000" 
                    className="bg-transparent text-white font-bold text-lg flex-1" 
                    readOnly 
                  />
                  <span className="text-white font-medium">USDT</span>
                </div>
                <div className="text-green-400 text-xs mt-1">≈ 650,000 XOF</div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-2">Méthode de réception</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-terex-dark rounded border border-terex-accent">
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📱</span>
                    </div>
                    <span className="text-white text-sm">Mobile Money</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-xs">Transaction sécurisée</span>
                </div>
                <p className="text-gray-300 text-xs">Fonds protégés par notre système de garantie</p>
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 text-sm">
                Vendre 1,000 USDT
              </Button>
            </div>
          </>
        );

      case 3: // "Envoyez de l'argent à vos proches en Afrique"
        return (
          <>
            {/* Header de l'app */}
            <div className="bg-terex-darker p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Transfert International</h2>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Interface de transfert */}
            <div className="p-4 space-y-3">
              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-1">Montant à envoyer</label>
                <div className="flex items-center justify-between">
                  <input 
                    type="text" 
                    value="250" 
                    className="bg-transparent text-white font-bold text-lg flex-1" 
                    readOnly 
                  />
                  <span className="text-white font-medium">USD</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">Frais: 5 USD • Le destinataire recevra: 162,500 XOF</div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-2">Destinataire</label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value="Amadou Diallo" 
                    placeholder="Nom complet" 
                    className="w-full bg-terex-dark text-white text-sm p-2 rounded border border-gray-600" 
                    readOnly 
                  />
                  <input 
                    type="text" 
                    value="+223 76 43 21 98" 
                    placeholder="Numéro de téléphone" 
                    className="w-full bg-terex-dark text-white text-sm p-2 rounded border border-gray-600" 
                    readOnly 
                  />
                </div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <label className="text-gray-400 text-xs block mb-2">Méthode de réception</label>
                <div className="flex items-center space-x-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded">
                  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">📱</span>
                  </div>
                  <div>
                    <span className="text-white text-sm">Orange Money Mali</span>
                    <div className="text-gray-400 text-xs">Livraison instantanée</div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 text-sm">
                Envoyer 250 USD
              </Button>
            </div>
          </>
        );

      case 4: // "Plateforme 100% sécurisée et réglementée"
        return (
          <>
            {/* Header de l'app */}
            <div className="bg-terex-darker p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Sécurité Terex</h2>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Interface de sécurité */}
            <div className="p-4 space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Compte vérifié</span>
                </div>
                <p className="text-gray-300 text-xs">Votre identité a été vérifiée avec succès</p>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <h3 className="text-white font-medium text-sm mb-2">Mesures de sécurité</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-xs">Chiffrement AES-256</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-xs">Authentification 2FA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-xs">Conformité RGPD</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-xs">Licence réglementaire</span>
                  </div>
                </div>
              </div>

              <div className="bg-terex-darker rounded-lg p-3">
                <h3 className="text-white font-medium text-sm mb-2">Statistiques de sécurité</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-terex-accent font-bold text-lg">99.9%</div>
                    <div className="text-gray-400 text-xs">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">0</div>
                    <div className="text-gray-400 text-xs">Incidents</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-medium text-xs">Plateforme certifiée</span>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-terex-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Layout principal en grid pour desktop, stack pour mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <div className="order-2 lg:order-1">
            <DeviceMockups />
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
                >
                  Aller au Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
                >
                  Commencer maintenant
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-terex-gray px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Voir comment ça marche
              </Button>
            </div>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-terex-accent">5min</div>
                <div className="text-sm text-gray-400">Transfert rapide</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-terex-accent">6</div>
                <div className="text-sm text-gray-400">Pays supportés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-terex-accent">24/7</div>
                <div className="text-sm text-gray-400">Disponibilité</div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - Maquette de téléphone avec contenu dynamique */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative mx-auto">
              {/* Phone Frame - Reduced size on desktop */}
              <div className="relative w-[280px] h-[560px] lg:w-[300px] lg:h-[600px] bg-gradient-to-br from-gray-800 to-black rounded-[2.8rem] p-2 shadow-2xl border border-gray-700">
                {/* Screen bezel */}
                <div className="w-full h-full bg-black rounded-[2.3rem] p-1 relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 border border-gray-800"></div>
                  
                  {/* Screen content */}
                  <div className="w-full h-full bg-terex-dark rounded-[2rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="h-8 bg-terex-darker flex items-center justify-between px-4 text-xs text-white">
                      <span>9:41</span>
                      <div className="flex space-x-1 items-center">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 bg-green-400 rounded-sm ml-2"></div>
                      </div>
                    </div>

                    {/* Screen content with dynamic content based on current slide */}
                    <div className="text-xs overflow-y-auto h-full pb-8">
                      {getPhoneContent()}
                    </div>
                  </div>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités - en bas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-16 lg:mt-24">
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {/* Logo USDT correct */}
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7_819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Transferts vers l'Afrique</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout en Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1 shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">100% Sécurisé</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Chiffrement 256-bit et conformité réglementaire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
