
import { useState, useEffect } from "react";
import waveImage from "@/assets/wave-logo.png";
import orangeMoneyImage from "@/assets/orange-money-logo.png";
import bankCardImage from "@/assets/bank-card-logo.png";

const paymentMethods = [
  {
    id: 1,
    category: "Mobile Money",
    title: "Wave",
    description: "La solution de mobile money la plus rapide et sécurisée d'Afrique pour vos transactions quotidiennes.",
    image: waveImage,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    category: "Mobile Money",
    title: "Orange Money",
    description: "Une solution mobile fiable et accessible dans toute l'Afrique francophone.",
    image: orangeMoneyImage,
    color: "from-orange-500 to-amber-500"
  },
  {
    id: 3,
    category: "Banking",
    title: "Cartes bancaires",
    description: "Paiements instantanés et protégés avec Visa et Mastercard.",
    image: bankCardImage,
    color: "from-violet-500 to-purple-500"
  }
];

export function PaymentMethodsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % paymentMethods.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-terex-dark via-terex-darker/50 to-terex-dark" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-terex-accent text-sm uppercase tracking-[0.2em] mb-4">
            Moyens de paiement
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Méthodes de{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              paiement
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Plusieurs options sécurisées pour vos transactions
          </p>
        </div>

        {/* Payment methods display */}
        <div className="max-w-4xl mx-auto">
          {/* Main display */}
          <div className="relative h-80 sm:h-96 flex items-center justify-center mb-12">
            {paymentMethods.map((method, index) => (
              <div
                key={method.id}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                  index === activeIndex 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Logo with glow */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} blur-3xl opacity-30 scale-150`} />
                  <img 
                    src={method.image} 
                    alt={method.title}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain"
                  />
                </div>
                
                {/* Category badge */}
                <span className={`inline-block text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 bg-gradient-to-r ${method.color} text-white`}>
                  {method.category}
                </span>
                
                {/* Title */}
                <h3 className="text-3xl sm:text-4xl text-white mb-4">{method.title}</h3>
                
                {/* Description */}
                <p className="text-gray-400 text-center max-w-md px-4">
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3">
            {paymentMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActiveIndex(index)}
                className={`relative transition-all duration-300 ${
                  index === activeIndex ? 'w-12' : 'w-3'
                } h-3 rounded-full overflow-hidden bg-white/10`}
              >
                {index === activeIndex && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.color}`} />
                )}
              </button>
            ))}
          </div>

          {/* All logos at bottom */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 opacity-60">
            {paymentMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${
                  index === activeIndex ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img 
                  src={method.image} 
                  alt={method.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain grayscale hover:grayscale-0 transition-all"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
