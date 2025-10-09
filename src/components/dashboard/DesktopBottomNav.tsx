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

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'buy', icon: TetherLogo, label: 'Acheter', isCustomIcon: true },
    { id: 'sell', icon: TrendingDown, label: 'Vendre' },
    { id: 'transfer', icon: Globe, label: 'Virement' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
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
      
      <div className="bg-terex-darker/95 backdrop-blur-lg rounded-[2rem] shadow-2xl border border-terex-gray/30 px-4 py-3">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center gap-1.5 h-auto py-3 px-5 rounded-[1.25rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-terex-accent to-terex-accent/90 text-white shadow-lg shadow-terex-accent/40' 
                    : 'text-gray-400 hover:text-gray-300 hover:bg-terex-gray/30'
                }`}
              >
                <div className="relative">
                  {item.isCustomIcon ? (
                    <IconComponent className="h-5 w-5" isActive={isActive} />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                
                <span className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
