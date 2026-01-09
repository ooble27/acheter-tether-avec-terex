
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Amadou Diallo",
    location: "Dakar, Sénégal",
    rating: 5,
    text: "Terex a révolutionné mes transferts d'argent. En 5 minutes, j'ai pu envoyer de l'argent à ma famille au Canada. Service exceptionnel !",
    transaction: "Virement international CAD → CFA"
  },
  {
    id: 2,
    name: "Fatou Ba",
    location: "Montréal, Canada",
    rating: 5,
    text: "Interface très intuitive pour acheter des USDT. Les taux sont compétitifs et les transactions sont sécurisées. Je recommande vivement !",
    transaction: "Achat USDT - 500 CAD"
  },
  {
    id: 3,
    name: "Moussa Traoré",
    location: "Bamako, Mali",
    rating: 5,
    text: "Enfin une plateforme qui comprend nos besoins en Afrique. Rapide, fiable et sans commission cachée. Parfait pour mes échanges USDT !",
    transaction: "Vente USDT - 2000 XOF"
  },
  {
    id: 4,
    name: "Aissatou Sow",
    location: "Thiès, Sénégal",
    rating: 5,
    text: "Support client réactif et processus KYC simple. J'utilise Terex pour tous mes virements vers le Canada. Service de qualité !",
    transaction: "Virement international CFA → CAD"
  },
  {
    id: 5,
    name: "Ibrahima Ndiaye",
    location: "Abidjan, Côte d'Ivoire",
    rating: 5,
    text: "La meilleure plateforme pour convertir mes USDT en mobile money. Transfert instantané sur Orange Money !",
    transaction: "Vente USDT - 150 000 XOF"
  },
  {
    id: 6,
    name: "Mariama Keita",
    location: "Toronto, Canada",
    rating: 5,
    text: "Je peux enfin envoyer de l'argent à ma famille sans frais exorbitants. Terex a changé ma vie !",
    transaction: "Virement international CAD → CFA"
  }
];

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  const initials = testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <Card className="bg-white/5 border-terex-gray/20 w-[280px] sm:w-[300px] flex-shrink-0 rounded-2xl">
      <CardContent className="p-5">
        <p className="text-gray-300 text-sm leading-relaxed font-light mb-5">
          "{testimonial.text}"
        </p>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terex-dark rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">{initials}</span>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
            <p className="text-gray-400 text-xs">{testimonial.transaction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection() {
  // Duplicate testimonials for seamless infinite scroll
  const row1Extended = [...row1, ...row1, ...row1, ...row1];
  const row2Extended = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="py-20 bg-terex-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Ils nous font <span className="text-terex-accent">confiance</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Découvrez ce que nos utilisateurs disent de leur expérience avec Terex
          </p>
        </div>
      </div>
      
      {/* Row 1 - Scrolling Left */}
      <div className="relative mb-4 sm:mb-6">
        <div 
          className="flex gap-3 sm:gap-4 md:gap-5 animate-scroll-left"
          style={{
            width: 'max-content',
          }}
        >
          {row1Extended.map((testimonial, index) => (
            <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
      
      {/* Row 2 - Scrolling Right */}
      <div className="relative">
        <div 
          className="flex gap-3 sm:gap-4 md:gap-5 animate-scroll-right"
          style={{
            width: 'max-content',
          }}
        >
          {row2Extended.map((testimonial, index) => (
            <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
      
      {/* Badge de confiance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6 bg-terex-darker/50 border border-terex-gray/30 rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="text-2xl font-light text-terex-accent">4.9/5</div>
              <div className="text-sm text-gray-400 font-light">Note moyenne</div>
            </div>
            <div className="w-px h-8 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-2xl font-light text-terex-accent">1000+</div>
              <div className="text-sm text-gray-400 font-light">Clients satisfaits</div>
            </div>
            <div className="w-px h-8 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-2xl font-light text-terex-accent">24/7</div>
              <div className="text-sm text-gray-400 font-light">Support client</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 50s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 50s linear infinite;
        }
        
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
