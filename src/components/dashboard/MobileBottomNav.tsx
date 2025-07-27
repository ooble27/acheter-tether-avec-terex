
import React from 'react';
import { Home, TrendingDown, Globe, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TetherLogo = ({ className, isActive }: { className?: string; isActive?: boolean }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" 
    alt="Tether Logo" 
    className={`${className}`}
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
    { id: 'history', icon: History, label: 'Historique' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-terex-darker border-t border-terex-gray/30 pb-safe">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center h-12 w-12 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/25' 
                  : 'text-gray-400 hover:text-white hover:bg-terex-gray/50'
              }`}
            >
              {item.isCustomIcon ? (
                <IconComponent className="h-5 w-5" isActive={isActive} />
              ) : (
                <IconComponent className="h-5 w-5" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
