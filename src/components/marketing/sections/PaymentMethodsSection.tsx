import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import waveImage from "@/assets/wave-logo.png";
import orangeMoneyImage from "@/assets/orange-money-logo.png";
import bankCardImage from "@/assets/bank-card-logo.png";

const paymentMethods = [
  {
    id: 1,
    category: "Mobile Money",
    title: "Wave",
    description: "Envoyez et recevez de l'argent instantanément avec Wave, la solution de mobile money la plus rapide d'Afrique.",
    image: waveImage,
  },
  {
    id: 2,
    category: "Mobile Money",
    title: "Orange Money",
    description: "Profitez de la puissance d'Orange Money pour vos transactions sécurisées partout en Afrique.",
    image: orangeMoneyImage,
  },
  {
    id: 3,
    category: "Banking",
    title: "Cartes bancaires",
    description: "Utilisez vos cartes Visa et Mastercard pour des paiements sécurisés et instantanés.",
    image: bankCardImage,
  }
];

export function PaymentMethodsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? paymentMethods.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === paymentMethods.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 sm:py-16 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
            Méthodes de <span className="text-terex-accent">paiement</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Plusieurs options sécurisées pour vos transactions
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="w-full flex-shrink-0 px-2">
                  <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl bg-terex-dark/50 border border-terex-accent/20">
                    {/* Left Block - Image */}
                    <div className="relative bg-transparent flex items-center justify-center p-8 md:p-10 min-h-[200px] md:min-h-[250px]">
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                          src={method.image} 
                          alt={method.title}
                          className="w-full h-auto max-w-[160px] object-contain"
                        />
                      </div>
                    </div>

                    {/* Right Block - Content */}
                    <div className="bg-transparent p-6 md:p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-terex-accent/20 text-terex-accent uppercase tracking-wide">
                          {method.category}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                        {method.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-12 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="h-10 w-10 rounded-full bg-background shadow-lg hover:bg-background/90 border-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-12 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-background shadow-lg hover:bg-background/90 border-2"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {paymentMethods.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? "w-8 bg-terex-accent" 
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Aller à la méthode ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
