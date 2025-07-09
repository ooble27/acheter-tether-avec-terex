
import { PhoneMockup } from '../PhoneMockup';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Globe } from 'lucide-react';

export function PhoneMockupSection() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 mb-6 border border-terex-accent/20">
              <Smartphone className="w-4 h-4 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium text-sm">Interface Mobile</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              L'expérience <span className="text-terex-accent">Terex</span> dans votre poche
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 leading-relaxed">
              Découvrez notre interface intuitive conçue pour simplifier vos transactions USDT. 
              Un design moderne et fonctionnel pour tous vos besoins de trading et de transferts.
            </p>
            
            <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
              <div className="flex items-center text-gray-300 text-sm lg:text-base">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                  <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-terex-accent" />
                </div>
                <span>Accessible depuis n'importe où dans le monde</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm lg:text-base">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                  <Smartphone className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                </div>
                <span>Interface optimisée pour mobile et desktop</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm lg:text-base">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                  <Download className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                </div>
                <span>Installation progressive web app (PWA)</span>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
          
          {/* Right side - Phone Mockup */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-terex-accent/20 rounded-full blur-3xl scale-110 animate-pulse"></div>
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
