
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Globe, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(94,234,212,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(94,234,212,0.05),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Logo et titre principal */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 rounded-xl shadow-2xl"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-xl blur opacity-60"></div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent">
                TEREX
              </span>
            </h1>
          </div>
          
          <p className="text-lg text-terex-accent/80 font-medium mb-4 uppercase tracking-wider">
            Teranga Exchange
          </p>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            L'échange crypto et les virements
            <br />
            <span className="text-terex-accent">sans frontières</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Achetez et vendez des USDT facilement, effectuez des virements internationaux instantanés. 
            Rapide, sécurisé et sans commission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
            >
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-8 py-4 text-lg rounded-xl"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités principales */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-terex-darker/50 border-terex-gray/30 backdrop-blur-sm hover:bg-terex-darker/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Échange USDT</h3>
                <p className="text-gray-400 text-sm">Achetez et vendez vos USDT au meilleur taux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/50 border-terex-gray/30 backdrop-blur-sm hover:bg-terex-darker/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Virements internationaux</h3>
                <p className="text-gray-400 text-sm">Transférez de l'argent partout dans le monde</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/50 border-terex-gray/30 backdrop-blur-sm hover:bg-terex-darker/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Instantané</h3>
                <p className="text-gray-400 text-sm">Transactions rapides en 3-5 minutes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/50 border-terex-gray/30 backdrop-blur-sm hover:bg-terex-darker/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">100% Sécurisé</h3>
                <p className="text-gray-400 text-sm">Chiffrement 256-bit et conformité réglementaire</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
