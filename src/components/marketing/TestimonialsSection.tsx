
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
    text: "La meilleure plateforme pour acheter des cryptos en Afrique de l'Ouest. Transactions rapides et sécurisées. Top !",
    transaction: "Achat USDT - 100 000 XOF"
  },
  {
    id: 6,
    name: "Marie Koné",
    location: "Toronto, Canada",
    rating: 5,
    text: "J'envoie de l'argent à ma famille au Sénégal chaque mois. Terex est devenu indispensable. Merci pour ce service !",
    transaction: "Virement international CAD → CFA"
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Card className="bg-white border border-gray-100 min-w-[320px] max-w-[400px] flex-shrink-0 mx-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start space-x-3 mb-4">
        <Quote className="w-6 h-6 text-terex-accent flex-shrink-0 mt-1" />
        <p className="text-gray-600 text-sm leading-relaxed italic font-light line-clamp-3">
          "{testimonial.text}"
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-900 font-medium text-sm truncate">{testimonial.name}</h4>
          <p className="text-terex-accent text-xs font-light">{testimonial.location}</p>
        </div>
        <div className="flex space-x-0.5">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export function TestimonialsSection() {
  // Dupliquer les témoignages pour l'effet infini
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Ils nous font <span className="text-terex-accent">confiance</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Découvrez ce que nos utilisateurs disent de leur expérience avec Terex
          </p>
        </div>
      </div>
      
      {/* Ligne 1 - Défilement vers la gauche */}
      <div className="relative mb-6">
        <div className="flex animate-scroll-left">
          {row1.map((testimonial, index) => (
            <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
      
      {/* Ligne 2 - Défilement vers la droite */}
      <div className="relative">
        <div className="flex animate-scroll-right">
          {row2.map((testimonial, index) => (
            <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
      
      {/* Badge de confiance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="text-2xl font-medium text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-500 font-light">Note moyenne</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-medium text-gray-900">1000+</div>
              <div className="text-sm text-gray-500 font-light">Clients satisfaits</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-medium text-gray-900">24/7</div>
              <div className="text-sm text-gray-500 font-light">Support client</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
