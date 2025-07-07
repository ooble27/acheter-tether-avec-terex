
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, CreditCard, Banknote, Zap, CheckCircle, Globe } from 'lucide-react';

export function PaymentMethodsSection() {
  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Virement bancaire",
      description: "Virements SEPA et vers l'Afrique",
      features: ["Sécurisé", "Rapide", "International"],
      gradient: "from-blue-500/10 to-cyan-500/5"
    },
    {
      icon: Smartphone,
      title: "Mobile Money",
      description: "Orange Money, Wave, Free Money",
      features: ["Instantané", "Mobile", "Local"],
      gradient: "from-green-500/10 to-emerald-500/5"
    },
    {
      icon: Banknote,
      title: "Espèces",
      description: "Points de retrait partenaires",
      features: ["Accessible", "Partout", "Pratique"],
      gradient: "from-purple-500/10 to-violet-500/5"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-terex-dark relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-2 h-16 bg-gradient-to-b from-terex-accent/30 to-transparent animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-12 bg-gradient-to-b from-terex-accent/40 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-3 h-20 bg-gradient-to-t from-terex-accent/20 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating payment icons */}
        <div className="absolute top-24 right-1/4 opacity-5">
          <Globe className="w-12 h-12 text-terex-accent animate-spin" style={{animationDuration: '15s'}} />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-5">
          <Zap className="w-8 h-8 text-terex-accent animate-bounce" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-6 border border-terex-accent/20">
            <Zap className="w-5 h-5 text-terex-accent mr-2" />
            <span className="text-terex-accent font-medium">Paiements Flexibles</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Méthodes de <span className="text-terex-accent relative">
              paiement
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent animate-pulse"></div>
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Plusieurs options sécurisées pour vos transactions, adaptées à vos besoins
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paymentMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-terex-accent/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <Card className={`relative bg-gradient-to-br ${method.gradient} backdrop-blur-sm border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 rounded-xl`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                      <IconComponent className="w-8 h-8 text-terex-accent" />
                      <div className="absolute -inset-2 border border-terex-accent/20 rounded-2xl animate-pulse opacity-50"></div>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-3 text-lg group-hover:text-terex-accent transition-colors">{method.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{method.description}</p>
                    
                    <div className="space-y-2">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-terex-accent" />
                          <span className="text-xs text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-terex-accent/20">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-500 font-medium">Disponible 24/7</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-400 text-sm">Conformité PCI DSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-400 text-sm">Chiffrement 256-bit</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-400 text-sm">Licence ACPR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
