
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpDown, 
  Send, 
  Globe, 
  User, 
  CreditCard,
  Smartphone,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react';

interface ScreenSlidesProps {
  currentSlide: number;
  deviceType: 'desktop' | 'mobile';
}

export function ScreenSlides({ currentSlide, deviceType }: ScreenSlidesProps) {
  const slides = [
    { id: 'dashboard', component: DashboardSlide },
    { id: 'buy', component: BuyUSDTSlide },
    { id: 'sell', component: SellUSDTSlide },
    { id: 'transfer', component: TransferSlide },
    { id: 'profile', component: ProfileSlide },
  ];

  return (
    <div className="relative w-full h-full bg-terex-dark">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 transform translate-x-0'
              : index < currentSlide
              ? 'opacity-0 transform -translate-x-full'
              : 'opacity-0 transform translate-x-full'
          }`}
        >
          <slide.component deviceType={deviceType} />
        </div>
      ))}
    </div>
  );
}

function DashboardSlide({ deviceType }: { deviceType: 'desktop' | 'mobile' }) {
  const isDesktop = deviceType === 'desktop';
  
  return (
    <div className={`p-${isDesktop ? '8' : '4'} bg-terex-dark text-white h-full overflow-y-auto`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${isDesktop ? 'text-2xl' : 'text-lg'} font-bold text-white`}>
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Bienvenue sur Terex</p>
        </div>
        <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
      </div>

      {/* Quick stats */}
      <div className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'} gap-4 mb-6`}>
        <Card className="bg-terex-darker/60 border-terex-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-terex-accent" />
              <div>
                <p className="text-sm text-gray-400">Balance USDT</p>
                <p className="text-xl font-bold text-white">1,250.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isDesktop && (
          <>
            <Card className="bg-terex-darker/60 border-terex-accent/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Transactions</p>
                    <p className="text-xl font-bold text-white">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/60 border-terex-accent/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Statut KYC</p>
                    <p className="text-sm font-medium text-green-400">Vérifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Service cards */}
      <div className={`grid ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        <Card className="bg-terex-darker/60 border-terex-accent/30 hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-terex-accent" />
              </div>
              <h3 className="font-semibold text-white">Échanger USDT</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Achetez et vendez vos USDT</p>
            <Button size="sm" className="bg-terex-accent text-black hover:bg-terex-accent/90">
              Commencer
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-terex-accent/30 hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">Virements</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Transférez vers l'Afrique</p>
            <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Envoyer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BuyUSDTSlide({ deviceType }: { deviceType: 'desktop' | 'mobile' }) {
  const isDesktop = deviceType === 'desktop';
  
  return (
    <div className={`p-${isDesktop ? '8' : '4'} bg-terex-dark text-white h-full`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
          <ArrowUpDown className="w-4 h-4 text-terex-accent" />
        </div>
        <h1 className={`${isDesktop ? 'text-2xl' : 'text-lg'} font-bold`}>Acheter USDT</h1>
      </div>

      <div className="space-y-6">
        <Card className="bg-terex-darker/60 border-terex-accent/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Montant à acheter</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Montant (CAD)</label>
                <div className="mt-1 relative">
                  <input 
                    type="text" 
                    value="500.00"
                    className="w-full bg-terex-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-lg font-medium"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-terex-dark rounded-lg">
                <span className="text-gray-400">Vous recevez</span>
                <span className="text-terex-accent font-bold text-lg">≈ 500.00 USDT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-terex-accent/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Méthode de paiement</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-terex-accent/10 border border-terex-accent/30 rounded-lg">
                <CreditCard className="w-5 h-5 text-terex-accent" />
                <div className="flex-1">
                  <p className="font-medium text-white">Carte bancaire</p>
                  <p className="text-sm text-gray-400">Visa, Mastercard</p>
                </div>
                <CheckCircle className="w-5 h-5 text-terex-accent" />
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg opacity-50">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-300">Mobile Money</p>
                  <p className="text-sm text-gray-500">Bientôt disponible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-terex-accent text-black font-bold py-3 hover:bg-terex-accent/90">
          Continuer l'achat
        </Button>
      </div>
    </div>
  );
}

function SellUSDTSlide({ deviceType }: { deviceType: 'desktop' | 'mobile' }) {
  const isDesktop = deviceType === 'desktop';
  
  return (
    <div className={`p-${isDesktop ? '8' : '4'} bg-terex-dark text-white h-full`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
          <ArrowUpDown className="w-4 h-4 text-green-400" />
        </div>
        <h1 className={`${isDesktop ? 'text-2xl' : 'text-lg'} font-bold`}>Vendre USDT</h1>
      </div>

      <div className="space-y-6">
        <Card className="bg-terex-darker/60 border-green-500/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Montant à vendre</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Montant (USDT)</label>
                <div className="mt-1 relative">
                  <input 
                    type="text" 
                    value="750.00"
                    className="w-full bg-terex-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-lg font-medium"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-terex-dark rounded-lg">
                <span className="text-gray-400">Vous recevez</span>
                <span className="text-green-400 font-bold text-lg">≈ 750.00 CAD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-green-500/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Réseau blockchain</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">T</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">TRON (TRC20)</p>
                  <p className="text-sm text-gray-400">Frais faibles</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg opacity-50">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">E</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-300">Ethereum (ERC20)</p>
                  <p className="text-sm text-gray-500">Frais élevés</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-green-500 text-white font-bold py-3 hover:bg-green-500/90">
          Continuer la vente
        </Button>
      </div>
    </div>
  );
}

function TransferSlide({ deviceType }: { deviceType: 'desktop' | 'mobile' }) {
  const isDesktop = deviceType === 'desktop';
  
  return (
    <div className={`p-${isDesktop ? '8' : '4'} bg-terex-dark text-white h-full`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Globe className="w-4 h-4 text-blue-400" />
        </div>
        <h1 className={`${isDesktop ? 'text-2xl' : 'text-lg'} font-bold`}>Virement International</h1>
      </div>

      <div className="space-y-6">
        <Card className="bg-terex-darker/60 border-blue-500/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Destination</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">🇨🇲</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Cameroun</p>
                  <p className="text-sm text-gray-400">Mobile Money • Orange</p>
                </div>
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-blue-500/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Destinataire</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg border border-gray-600">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-white">Jean Mballa</p>
                  <p className="text-sm text-gray-400">+1 4182619091</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Montant à envoyer</p>
                <p className="text-xl font-bold text-white">500.00 CAD</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Destinataire reçoit</p>
                <p className="text-xl font-bold text-blue-400">≈ 285,000 XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-blue-500 text-white font-bold py-3 hover:bg-blue-500/90">
          Envoyer le virement
        </Button>
      </div>
    </div>
  );
}

function ProfileSlide({ deviceType }: { deviceType: 'desktop' | 'mobile' }) {
  const isDesktop = deviceType === 'desktop';
  
  return (
    <div className={`p-${isDesktop ? '8' : '4'} bg-terex-dark text-white h-full`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-purple-400" />
        </div>
        <h1 className={`${isDesktop ? 'text-2xl' : 'text-lg'} font-bold`}>Profil & KYC</h1>
      </div>

      <div className="space-y-6">
        <Card className="bg-terex-darker/60 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Marie Dubois</h3>
                <p className="text-sm text-gray-400">marie.dubois@email.com</p>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Compte vérifié</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker/60 border-purple-500/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Statut de vérification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Identité vérifiée</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Approuvé</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Adresse vérifiée</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Approuvé</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Selfie vérifié</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Approuvé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Niveau 2 - Vérifié</p>
              <p className="text-sm text-gray-400">Limite quotidienne : 10,000 CAD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
