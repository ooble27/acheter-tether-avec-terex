import { Check, Wallet, Globe, Shield, Zap } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import buyUsdtScreen from '@/assets/dashboard-buy-usdt.jpeg';
import destinationScreen from '@/assets/dashboard-destination.jpeg';
import confirmScreen from '@/assets/dashboard-confirm.jpeg';

// Composant Phone Frame réutilisable
function PhoneFrame({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[320px] lg:w-[400px]">
      <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-2xl border border-white/30">
        <div className="w-full h-full bg-black rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
          <img 
            src={image} 
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// Section 1: Achat simplifié
export function BuyUSDTShowcase() {
  const features = [
    { icon: Wallet, text: "Entrez le montant en CFA" },
    { icon: Zap, text: "Conversion instantanée en USDT" },
    { icon: Check, text: "Taux de change transparent" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Text content - Left */}
          <AnimatedSection direction="right" className="order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 bg-terex-gray/50 border border-white/10 rounded-full text-white text-sm font-medium mb-4">
              Achat USDT
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Achetez vos USDT <br />
              <span className="text-terex-teal">en quelques secondes</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Entrez simplement le montant que vous souhaitez dépenser et recevez instantanément vos USDT.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <AnimatedItem key={index} index={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-terex-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{feature.text}</span>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>

          {/* Phone mockup - Right */}
          <AnimatedSection direction="left" className="order-1 lg:order-2 flex justify-center">
            <PhoneFrame image={buyUsdtScreen} alt="Écran d'achat USDT Terex" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Section 2: Réseaux Blockchain
export function NetworkSelectionShowcase() {
  const features = [
    { icon: Globe, text: "7+ réseaux blockchain supportés" },
    { icon: Zap, text: "Sélection rapide et intuitive" },
    { icon: Shield, text: "Tous les réseaux majeurs disponibles" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Phone mockup - Left */}
          <AnimatedSection direction="right" className="flex justify-center">
            <PhoneFrame image={destinationScreen} alt="Sélection du réseau blockchain" />
          </AnimatedSection>

          {/* Text content - Right */}
          <AnimatedSection direction="left">
            <span className="inline-block px-4 py-1.5 bg-terex-gray/50 border border-white/10 rounded-full text-white text-sm font-medium mb-4">
              Multi-réseaux
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Choisissez votre <br />
              <span className="text-terex-teal">réseau préféré</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              TRC20, BEP20, ERC20, Polygon, Solana, Aptos, Binance... Recevez vos USDT sur le réseau de votre choix.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <AnimatedItem key={index} index={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-terex-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{feature.text}</span>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Section 3: Confirmation sécurisée
export function ConfirmationShowcase() {
  const features = [
    { icon: Shield, text: "Vérification complète avant paiement" },
    { icon: Check, text: "Détails de transaction clairs" },
    { icon: Wallet, text: "Adresse de réception affichée" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Text content - Left */}
          <AnimatedSection direction="right" className="order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 bg-terex-gray/50 border border-white/10 rounded-full text-white text-sm font-medium mb-4">
              Sécurité
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Confirmez en <br />
              <span className="text-terex-teal">toute confiance</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Vérifiez tous les détails de votre transaction avant de confirmer. Montant, taux, destination - tout est transparent.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <AnimatedItem key={index} index={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-terex-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{feature.text}</span>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>

          {/* Phone mockup - Right */}
          <AnimatedSection direction="left" className="order-1 lg:order-2 flex justify-center">
            <PhoneFrame image={confirmScreen} alt="Écran de confirmation Terex" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
