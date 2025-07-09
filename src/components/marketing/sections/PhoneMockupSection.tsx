
import { PhoneMockup } from '../PhoneMockup';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Globe } from 'lucide-react';

export function PhoneMockupSection() {
  return (
    <div className="py-24 bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <Smartphone className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Interface Mobile</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              L'expérience <span className="text-terex-accent">Terex</span> dans votre poche
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Découvrez notre interface intuitive conçue pour simplifier vos transactions USDT. 
              Un design moderne et fonctionnel pour tous vos besoins de trading et de transferts.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-4 h-4 text-terex-accent" />
                </div>
                <span>Accessible depuis n'importe où dans le monde</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Smartphone className="w-4 h-4 text-green-400" />
                </div>
                <span>Interface optimisée pour mobile et desktop</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Download className="w-4 h-4 text-blue-400" />
                </div>
                <span>Installation progressive web app (PWA)</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
          
          {/* Right side - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
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
