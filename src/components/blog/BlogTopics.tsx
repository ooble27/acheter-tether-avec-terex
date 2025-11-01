import { ChevronRight } from "lucide-react";

const topics = [
  {
    id: 1,
    title: "USDT & Stablecoins",
    description: "Tout savoir sur l'USDT et les cryptomonnaies stables",
    image: "/lovable-uploads/067fb4dd-d38f-4df7-8fe0-b983a7dd2c55.png",
    color: "from-emerald-500/20 to-green-500/20"
  },
  {
    id: 2,
    title: "Guides Pratiques",
    description: "Tutoriels étape par étape pour débuter",
    image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 3,
    title: "Sécurité Crypto",
    description: "Protégez vos actifs numériques",
    image: "/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 4,
    title: "Transferts Internationaux",
    description: "Envoyez de l'argent partout en Afrique",
    image: "/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 5,
    title: "Blockchain & Tech",
    description: "Comprendre la technologie blockchain",
    image: "/lovable-uploads/62ebb1fa-b6ad-4de9-b63e-14b9a3baaf99.png",
    color: "from-indigo-500/20 to-blue-500/20"
  },
  {
    id: 6,
    title: "Finance Mobile",
    description: "L'avenir des paiements en Afrique",
    image: "/lovable-uploads/ae10f8c7-fb15-4996-8f3e-d8a28fe8f89e.png",
    color: "from-green-500/20 to-teal-500/20"
  }
];

export function BlogTopics() {
  return (
    <section className="py-8 md:py-12 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Explorer par thème
        </h2>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex-none w-[280px] md:w-[320px] snap-start group cursor-pointer"
            >
              <div className="relative h-[160px] md:h-[180px] rounded-xl overflow-hidden bg-card border border-border">
                {/* Image de fond */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${topic.image})` }}
                />
                
                {/* Overlay gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} backdrop-blur-[2px]`} />
                
                {/* Contenu */}
                <div className="relative h-full p-6 flex flex-col justify-end">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2 drop-shadow-lg">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-white/90 drop-shadow-md line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade sur les côtés pour indiquer le scroll */}
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-terex-dark to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
