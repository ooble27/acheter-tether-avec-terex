
import { Button } from '@/components/ui/button';
import { UserPlus, MousePointerClick, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Inscription gratuite",
    description: "Créez votre compte en moins de 2 minutes. Processus KYC simple et rapide.",
    tag: "100% gratuit"
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Choisissez votre service",
    description: "Achat/vente USDT ou transfert vers l'Afrique. Taux en temps réel.",
    tag: "Taux live"
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Transaction sécurisée",
    description: "Confirmez et finalisez. Suivi en temps réel jusqu'à la réception.",
    tag: "3-5 minutes"
  }
];

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-terex-accent/30 to-terex-accent/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-terex-accent text-sm uppercase tracking-[0.2em] mb-4">
            Simple & Rapide
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Comment ça{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              marche
            </span>
            {' '}?
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Trois étapes simples pour commencer vos échanges et transferts
          </p>
        </div>
        
        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terex-accent/20 to-transparent -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative group">
                  {/* Step container */}
                  <div className="relative text-center lg:text-left">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-terex-accent/20 to-terex-teal/10 border border-terex-accent/20 mb-8 group-hover:scale-110 group-hover:border-terex-accent/40 transition-all duration-500">
                      <span className="text-3xl text-terex-accent">{step.number}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                      <IconComponent className="w-5 h-5 text-terex-accent" />
                      <h3 className="text-2xl text-white">{step.title}</h3>
                    </div>
                    
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 text-terex-accent text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{step.tag}</span>
                    </div>
                  </div>
                  
                  {/* Arrow to next step - desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-4 text-terex-accent/30">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-20">
          <Button 
            onClick={onBlockchainInfoClick}
            variant="ghost"
            size="lg"
            className="text-gray-400 hover:text-terex-accent hover:bg-terex-accent/5 px-8 py-6 text-lg rounded-2xl border border-white/5 hover:border-terex-accent/20 transition-all duration-300 group"
          >
            En savoir plus sur la blockchain
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
