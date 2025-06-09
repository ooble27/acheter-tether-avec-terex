
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
    text: "Support client réactif et processus KYC simple. J'utilise Terex pour tous mes virements vers l'Europe. Service de qualité !",
    transaction: "Virement international CFA → EUR"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ils nous font <span className="text-terex-accent">confiance</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs disent de leur expérience avec Terex
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-terex-darker border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <Quote className="w-8 h-8 text-terex-accent flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-terex-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-terex-accent text-sm">{testimonial.location}</p>
                    <p className="text-gray-400 text-xs mt-1">{testimonial.transaction}</p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Badge de confiance */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6 bg-terex-darker/50 border border-terex-gray/30 rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent">4.9/5</div>
              <div className="text-sm text-gray-400">Note moyenne</div>
            </div>
            <div className="w-px h-8 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent">1000+</div>
              <div className="text-sm text-gray-400">Clients satisfaits</div>
            </div>
            <div className="w-px h-8 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent">24/7</div>
              <div className="text-sm text-gray-400">Support client</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
