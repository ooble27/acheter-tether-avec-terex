
import { DashboardMockup } from '../DashboardMockup';
import { TradingGraphMockup } from '../TradingGraphMockup';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';

export function FeaturesShowcaseSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Feature */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 mb-6 border border-terex-accent/20">
              <Shield className="w-4 h-4 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium text-sm">Dashboard Professionnel</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Gérez tous vos <span className="text-terex-accent">échanges</span> en un clic
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Interface intuitive pour suivre vos transactions USDT, visualiser vos gains et gérer vos transferts vers l'Afrique en temps réel.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-4 h-4 text-terex-accent" />
                </div>
                <span>Transactions en temps réel</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <span>Historique complet et détaillé</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
            >
              Découvrir le dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <div className="absolute inset-0 bg-terex-accent/10 rounded-3xl blur-3xl scale-110 animate-pulse"></div>
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* Trading Graph Feature */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <div className="absolute inset-0 bg-terex-accent/10 rounded-3xl blur-3xl scale-110 animate-pulse"></div>
              <TradingGraphMockup />
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 mb-6 border border-terex-accent/20">
              <ArrowRight className="w-4 h-4 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium text-sm">Taux en Temps Réel</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Les meilleurs <span className="text-terex-accent">taux du marché</span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Suivez l'évolution des taux USDT/CAD en direct et effectuez vos transactions au moment optimal pour maximiser vos gains.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-accent/20">
                <div className="text-2xl font-bold text-terex-accent mb-1">0%</div>
                <div className="text-sm text-gray-400">Frais cachés</div>
              </div>
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-accent/20">
                <div className="text-2xl font-bold text-terex-accent mb-1">24/7</div>
                <div className="text-sm text-gray-400">Disponibilité</div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="lg" 
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-8 py-4 text-base rounded-xl backdrop-blur-sm"
            >
              Voir les taux actuels
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
