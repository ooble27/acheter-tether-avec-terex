
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Wallet, GraduationCap, ShoppingBag } from 'lucide-react';

interface MarketplaceCryptoSectionProps {
  onMarketplaceClick: () => void;
}

export function MarketplaceCryptoSection({ onMarketplaceClick }: MarketplaceCryptoSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Boutique <span className="text-terex-accent">Crypto</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Découvrez notre sélection de wallets hardware, accessoires crypto et formations pour sécuriser vos investissements
          </p>
        </div>
        
        {/* Image du Trezor Safe 5 en PNG pur */}
        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png" 
            alt="Trezor Safe 5 - Wallet Hardware Sécurisé"
            className="w-auto h-64 object-contain"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Wallets Hardware</h3>
              <p className="text-gray-400 text-sm">Trezor Safe 5, Ledger et autres portefeuilles sécurisés</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Formations</h3>
              <p className="text-gray-400 text-sm">Guides complets pour maîtriser la crypto</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Accessoires</h3>
              <p className="text-gray-400 text-sm">Cartes crypto et gadgets essentiels</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onMarketplaceClick}
            size="lg"
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
          >
            <span>Découvrir la boutique</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
