
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Send, Shield } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" 
    alt="USDT Tether Logo" 
    className={className} 
  />
);

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  const steps = [
    {
      icon: <TetherLogo className="w-6 h-6" />,
      title: "Échanger USDT-Tether",
      description: "Acheter et vendre du USDT au meilleur taux",
      color: "from-green-500/20 to-green-500/5",
      iconBg: "bg-green-500/20"
    },
    {
      icon: <Send className="w-6 h-6 text-blue-400" />,
      title: "Transférer l'argent",
      description: "Virements internationaux rapides et sécurisés",
      color: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/20"
    },
    {
      icon: <Shield className="w-6 h-6 text-terex-accent" />,
      title: "100% sécurisé",
      description: "Plateforme protégée avec les plus hauts standards",
      color: "from-terex-accent/20 to-terex-accent/5",
      iconBg: "bg-terex-accent/20"
    }
  ];

  return (
    <section className="py-20 bg-terex-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Comment ça <span className="text-terex-accent">fonctionne</span> ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez notre processus simple et sécurisé en 3 étapes pour 
            échanger vos USDT et effectuer vos transferts internationaux
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="bg-terex-dark/50 border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform ${step.iconBg}`}>
                  {step.icon}
                </div>
                
                <div className="inline-flex items-center justify-center w-8 h-8 bg-terex-accent/20 rounded-full mb-4">
                  <span className="text-terex-accent font-bold text-sm">{index + 1}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={onBlockchainInfoClick}
            className="border-terex-gray hover:border-terex-accent text-white hover:text-terex-accent px-8 py-4 rounded-xl transition-all duration-300 bg-transparent hover:bg-terex-accent/5"
          >
            En savoir plus sur la blockchain
          </Button>
        </div>
      </div>
    </section>
  );
}
