
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, CreditCard, Banknote } from 'lucide-react';

export function PaymentMethodsSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Méthodes de <span className="text-terex-accent">paiement</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Plusieurs options sécurisées pour vos transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virement bancaire</h3>
              <p className="text-gray-400 text-xs">Virements SEPA et vers l'Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Mobile Money</h3>
              <p className="text-gray-400 text-xs">Orange Money, Wave, Free Money</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <Banknote className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Espèces</h3>
              <p className="text-gray-400 text-xs">Points de retrait partenaires</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
