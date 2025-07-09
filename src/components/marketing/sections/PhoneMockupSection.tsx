
import { PhoneMockup } from '../PhoneMockup';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Globe } from 'lucide-react';

export function PhoneMockupSection() {
  return (
    <div className="py-16 md:py-24 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 mb-4 md:mb-6 border border-terex-accent/20">
              <Smartphone className="w-4 h-4 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium text-sm">Interface Mobile</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              L'expérience <span className="text-terex-accent">Terex</span> dans votre poche
            </h2>

            {/* Phone Mockup - Only visible on mobile between title and subtitle */}
            <div className="flex justify-center mb-6 md:mb-8 lg:hidden">
              <div className="relative scale-75">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-terex-accent/20 rounded-full blur-3xl scale-110 animate-pulse"></div>
                <PhoneMockup />
              </div>
            </div>
            
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-md lg:max-w-none mx-auto lg:mx-0">
              <span className="block md:hidden">
                Découvrez notre interface intuitive conçue pour simplifier vos transactions USDT.
              </span>
              <span className="hidden md:block">
                Découvrez notre interface intuitive conçue pour simplifier vos transactions USDT. 
                Un design moderne et fonctionnel pour tous vos besoins de trading et de transferts.
              </span>
            </p>
            
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 max-w-md lg:max-w-none mx-auto lg:mx-0">
              <div className="flex items-center text-gray-300 text-sm md:text-base">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <Globe className="w-3 h-3 md:w-4 md:h-4 text-terex-accent" />
                </div>
                <span>Accessible depuis n'importe où dans le monde</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm md:text-base">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <Smartphone className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                </div>
                <span>Interface optimisée pour mobile et desktop</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm md:text-base">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <Download className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                </div>
                <span>Installation progressive web app (PWA)</span>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
          
          {/* Right side - Phone Mockup - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:flex justify-center lg:justify-end order-1 lg:order-2">
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
