
import { TransferFlowMockup } from '../TransferFlowMockup';
import { CreditCardMockup } from '../CreditCardMockup';
import { Button } from '@/components/ui/button';
import { Send, ArrowRight } from 'lucide-react';

export function TransferProcessSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 mb-6 border border-terex-accent/20">
            <Send className="w-4 h-4 text-terex-accent mr-2" />
            <span className="text-terex-accent font-medium text-sm">Processus de Transfert</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Du Canada vers l'Afrique en <span className="text-terex-accent">3 étapes</span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Un processus simple et transparent pour envoyer de l'argent à vos proches, 
            avec un suivi en temps réel à chaque étape.
          </p>
        </div>

        {/* Transfer Flow Visualization */}
        <div className="mb-16">
          <TransferFlowMockup />
        </div>

        {/* Payment Methods Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Payez comme vous <span className="text-terex-accent">voulez</span>
            </h3>
            
            <p className="text-lg text-gray-300 mb-8">
              Choisissez parmi nos différentes méthodes de paiement sécurisées 
              et effectuez vos transferts en toute confiance.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between bg-terex-darker/50 rounded-xl p-4 border border-terex-accent/20">
                <span className="text-white font-medium">Carte bancaire</span>
                <span className="text-terex-accent font-semibold">Instantané</span>
              </div>
              <div className="flex items-center justify-between bg-terex-darker/50 rounded-xl p-4 border border-terex-accent/20">
                <span className="text-white font-medium">Virement bancaire</span>
                <span className="text-terex-accent font-semibold">1-2 heures</span>
              </div>
              <div className="flex items-center justify-between bg-terex-darker/50 rounded-xl p-4 border border-terex-accent/20">
                <span className="text-white font-medium">Portefeuille numérique</span>
                <span className="text-terex-accent font-semibold">Instantané</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
            >
              Commencer un transfert
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <div className="absolute inset-0 bg-terex-accent/10 rounded-3xl blur-3xl scale-110 animate-pulse"></div>
              <CreditCardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
