
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

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
    <Card
      className="w-[300px] sm:w-[340px] flex-shrink-0 rounded-2xl transition-colors duration-300"
      style={{
        backgroundColor: "#1e1e1e",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-white" fill="currentColor" />
          ))}
        </div>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          "{testimonial.text}"
        </p>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: "#2d2d2d",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <span className="text-white text-xs font-medium">{initials}</span>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              {testimonial.transaction}
            </p>
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
    <section className="py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <p
            className="text-xs sm:text-sm font-medium uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Témoignages
          </p>
          <h2
            className="font-bold text-white tracking-tight mb-5"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.6rem)" }}
          >
            Ils nous font confiance
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Découvrez ce que nos utilisateurs disent de leur expérience avec Terex
          </p>
        </div>
      </div>

      {/* Row 1 - Scrolling Left */}
      <div className="relative mb-5 sm:mb-6">
        <div
          className="flex gap-4 sm:gap-5 animate-scroll-left"
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
          className="flex gap-4 sm:gap-5 animate-scroll-right"
          style={{
            width: 'max-content',
          }}
        >
          {row2Extended.map((testimonial, index) => (
            <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
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
