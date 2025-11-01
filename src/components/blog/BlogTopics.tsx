import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import usdtImage from "@/assets/blog-topic-usdt.png";
import buyImage from "@/assets/blog-topic-buy.png";
import securityImage from "@/assets/blog-topic-security.png";
import transferImage from "@/assets/blog-topic-transfer.png";
import blockchainImage from "@/assets/blog-topic-blockchain.png";
import mobileMoneyImage from "@/assets/blog-topic-mobile-money.png";

const topics = [
  {
    id: 1,
    category: "Stablecoins",
    title: "USDT & Stablecoins : Le guide complet",
    description: "Découvrez comment les stablecoins révolutionnent les transferts d'argent en Afrique et pourquoi l'USDT est la solution idéale.",
    image: usdtImage,
    color: "from-yellow-400/20 to-yellow-600/5"
  },
  {
    id: 2,
    category: "Guides Pratiques",
    title: "Comment acheter de l'USDT facilement",
    description: "Guide étape par étape pour acheter vos premiers USDT avec mobile money, carte bancaire ou virement bancaire.",
    image: buyImage,
    color: "from-blue-400/20 to-purple-500/5"
  },
  {
    id: 3,
    category: "Sécurité",
    title: "Protégez vos cryptomonnaies",
    description: "Les meilleures pratiques pour sécuriser vos actifs numériques et éviter les arnaques dans l'univers crypto.",
    image: securityImage,
    color: "from-orange-400/20 to-orange-600/5"
  },
  {
    id: 4,
    category: "Transferts",
    title: "Transferts internationaux simplifiés",
    description: "Envoyez de l'argent partout dans le monde rapidement et à moindre coût grâce à la blockchain.",
    image: transferImage,
    color: "from-purple-400/20 to-pink-500/5"
  },
  {
    id: 5,
    category: "Technologie",
    title: "La blockchain expliquée simplement",
    description: "Comprenez comment fonctionne la blockchain et pourquoi elle transforme l'économie mondiale.",
    image: blockchainImage,
    color: "from-teal-400/20 to-green-500/5"
  },
  {
    id: 6,
    category: "Finance Mobile",
    title: "Mobile Money & Crypto en Afrique",
    description: "L'union du Mobile Money et des cryptomonnaies crée de nouvelles opportunités pour l'inclusion financière.",
    image: mobileMoneyImage,
    color: "from-pink-400/20 to-pink-600/5"
  }
];

export function BlogTopics() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? topics.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === topics.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="py-8 md:py-12 container mx-auto px-4">
      <div className="relative max-w-6xl mx-auto">
        {/* Main Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {topics.map((topic) => (
              <div key={topic.id} className="w-full flex-shrink-0 px-2">
                <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Left Block - Image with Gradient Background */}
                  <div className={`relative bg-gradient-to-br ${topic.color} flex items-center justify-center p-12 md:p-16 min-h-[320px] md:min-h-[400px]`}>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <img 
                        src={topic.image} 
                        alt={topic.title}
                        className="w-full h-auto max-w-[280px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                      />
                    </div>
                  </div>

                  {/* Right Block - Content */}
                  <div className="bg-card p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="inline-block text-xs font-semibold px-4 py-2 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                        {topic.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                      {topic.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-16 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-12 w-12 rounded-full bg-background shadow-lg hover:bg-background/90 border-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-16 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-12 w-12 rounded-full bg-background shadow-lg hover:bg-background/90 border-2"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "w-10 bg-primary" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Aller au sujet ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
