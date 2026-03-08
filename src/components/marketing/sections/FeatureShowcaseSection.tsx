import { Check, Wallet, Globe, Shield, Zap } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import buyUsdtScreen from '@/assets/dashboard-buy-usdt.jpeg';
import destinationScreen from '@/assets/dashboard-destination.jpeg';
import confirmScreen from '@/assets/dashboard-confirm.jpeg';

/** iMac-style desktop frame for feature showcases */
function DesktopShowcaseFrame({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative mx-auto w-[320px] sm:w-[360px] lg:w-[400px]">
      <div className="bg-gradient-to-b from-[hsl(0,0%,35%)] to-[hsl(0,0%,22%)] rounded-xl p-2 border-2 border-[hsl(0,0%,45%)] shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center mb-1.5 px-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <div className="w-2 h-2 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-2 h-2 bg-[hsl(0,0%,50%)] rounded-full" />
          </div>
          <div className="flex gap-1 opacity-0">
            <div className="w-2 h-2" />
            <div className="w-2 h-2" />
            <div className="w-2 h-2" />
          </div>
        </div>
        <div className="w-full bg-black rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      {/* Stand */}
      <div className="flex justify-center mt-0">
        <div className="w-20 h-3 bg-gradient-to-b from-[hsl(0,0%,35%)] to-[hsl(0,0%,25%)] rounded-b-lg border-x-2 border-b-2 border-[hsl(0,0%,45%)]" />
      </div>
      <div className="flex justify-center -mt-0.5">
        <div className="w-32 h-1.5 bg-[hsl(0,0%,30%)] rounded-full border border-[hsl(0,0%,40%)]" />
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

          {/* Desktop mockup - Right */}
          <AnimatedSection direction="left" className="order-1 lg:order-2 flex justify-center">
            <DesktopShowcaseFrame image={buyUsdtScreen} alt="Écran d'achat USDT Terex" />
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
          {/* Desktop mockup - Left */}
          <AnimatedSection direction="right" className="flex justify-center">
            <DesktopShowcaseFrame image={destinationScreen} alt="Sélection du réseau blockchain" />
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

          {/* Desktop mockup - Right */}
          <AnimatedSection direction="left" className="order-1 lg:order-2 flex justify-center">
            <DesktopShowcaseFrame image={confirmScreen} alt="Écran de confirmation Terex" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
