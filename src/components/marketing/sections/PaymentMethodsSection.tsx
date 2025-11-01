import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import waveImage from "@/assets/payment-wave.png";
import orangeMoneyImage from "@/assets/payment-orange-money.png";
import bankCardImage from "@/assets/payment-bank-card.png";
import cashImage from "@/assets/payment-cash.png";

const paymentMethods = [
  {
    id: 1,
    category: "Mobile Money",
    title: "Wave",
    description: "Envoyez et recevez de l'argent instantanément avec Wave, la solution de mobile money la plus rapide d'Afrique.",
    image: waveImage,
    color: "from-blue-400/20 to-cyan-500/5"
  },
  {
    id: 2,
    category: "Mobile Money",
    title: "Orange Money",
    description: "Profitez de la puissance d'Orange Money pour vos transactions sécurisées partout en Afrique.",
    image: orangeMoneyImage,
    color: "from-orange-400/20 to-orange-600/5"
  },
  {
    id: 3,
    category: "Banking",
    title: "Cartes bancaires",
    description: "Utilisez vos cartes Visa et Mastercard pour des paiements sécurisés et instantanés.",
    image: bankCardImage,
    color: "from-blue-500/20 to-purple-500/5"
  },
  {
    id: 4,
    category: "Cash",
    title: "Argent liquide",
    description: "Retirez ou déposez de l'argent liquide dans nos points de retrait partenaires.",
    image: cashImage,
    color: "from-green-400/20 to-emerald-500/5"
  }
];

export function PaymentMethodsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (emblaApi) {
      // Autoplay will start automatically
    }
  }, [emblaApi]);

  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Méthodes de <span className="text-terex-accent">paiement</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Plusieurs options sécurisées pour vos transactions
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex-[0_0_100%] min-w-0 px-2 md:flex-[0_0_50%]">
                  <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Left Block - Image with Gradient Background */}
                    <div className={`relative bg-gradient-to-br ${method.color} flex items-center justify-center p-12 md:p-16 min-h-[320px] md:min-h-[400px]`}>
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                          src={method.image} 
                          alt={method.title}
                          className="w-full h-auto max-w-[280px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                    </div>

                    {/* Right Block - Content */}
                    <div className="bg-card p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <span className="inline-block text-xs font-semibold px-4 py-2 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                          {method.category}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                        {method.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {paymentMethods.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
