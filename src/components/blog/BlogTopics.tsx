import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const topics = [
  {
    id: 1,
    category: "Stablecoins",
    title: "USDT & Stablecoins : Le guide complet",
    description: "Découvrez comment les stablecoins révolutionnent les transferts d'argent en Afrique et pourquoi l'USDT est la solution idéale.",
    image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png",
    color: "from-terex-primary/20 to-terex-primary/5"
  },
  {
    id: 2,
    category: "Guides Pratiques",
    title: "Comment acheter de l'USDT facilement",
    description: "Guide étape par étape pour acheter vos premiers USDT avec mobile money, carte bancaire ou virement bancaire.",
    image: "/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    id: 3,
    category: "Sécurité",
    title: "Protégez vos cryptomonnaies",
    description: "Les meilleures pratiques pour sécuriser vos actifs numériques et éviter les arnaques dans l'univers crypto.",
    image: "/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png",
    color: "from-orange-500/20 to-orange-500/5"
  },
  {
    id: 4,
    category: "Transferts",
    title: "Transferts internationaux simplifiés",
    description: "Envoyez de l'argent partout dans le monde rapidement et à moindre coût grâce à la blockchain.",
    image: "/lovable-uploads/62ebb1fa-b6ad-4de9-b63e-14b9a3baaf99.png",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    id: 5,
    category: "Technologie",
    title: "La blockchain expliquée simplement",
    description: "Comprenez comment fonctionne la blockchain et pourquoi elle transforme l'économie mondiale.",
    image: "/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png",
    color: "from-green-500/20 to-green-500/5"
  },
  {
    id: 6,
    category: "Finance Mobile",
    title: "Mobile Money & Crypto en Afrique",
    description: "L'union du Mobile Money et des cryptomonnaies crée de nouvelles opportunités pour l'inclusion financière.",
    image: "/lovable-uploads/abd0d53b-cb36-4edb-91e5-e55da1466079.png",
    color: "from-pink-500/20 to-pink-500/5"
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
      <div className="relative max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {topics.map((topic) => (
              <div key={topic.id} className="w-full flex-shrink-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden">
                  <div className="grid md:grid-cols-[300px,1fr] gap-0">
                    {/* Image Side */}
                    <div className={`relative bg-gradient-to-br ${topic.color} p-8 md:p-12 flex items-center justify-center`}>
                      <img 
                        src={topic.image} 
                        alt={topic.title}
                        className="w-full h-auto max-w-[200px] object-contain"
                      />
                    </div>

                    {/* Content Side */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="inline-block mb-4">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                        {topic.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-12">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-12">
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Aller au sujet ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
