
import React from 'react';
import { Home, TrendingDown, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TetherLogo = ({ className, isActive }: { className?: string; isActive?: boolean }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" 
    alt="Tether Logo" 
    className={`${className} usdt-icon-force-visible`}
    style={{ filter: 'none' }}
  />
);

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'buy', icon: TetherLogo, label: 'Acheter', isCustomIcon: true },
    { id: 'sell', icon: TrendingDown, label: 'Vendre' },
    { id: 'transfer', icon: Globe, label: 'Virement' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-terex-darker/95 backdrop-blur-lg border-t border-terex-gray/20 pb-safe shadow-2xl">
      <style>
        {`
          .usdt-icon-force-visible {
            filter: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: inline-block !important;
            background: none !important;
            -webkit-filter: none !important;
            backdrop-filter: none !important;
          }
        `}
      </style>
      
      <div className="flex justify-around items-center px-2 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveSection(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 h-auto py-2 px-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-br from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/30 scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-terex-gray/30 active:scale-95'
              }`}
            >
              {/* Indicateur actif en haut */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg" />
              )}
              
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-terex-gray/20'
              }`}>
                {item.isCustomIcon ? (
                  <IconComponent className="h-5 w-5" isActive={isActive} />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>
              
              <span className={`text-[10px] font-medium transition-all duration-300 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
