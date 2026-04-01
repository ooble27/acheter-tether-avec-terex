
import React from 'react';
import { Home, TrendingDown, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

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
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t.bottomNav.home },
    { id: 'buy', icon: TetherLogo, label: t.bottomNav.buy, isCustomIcon: true },
    { id: 'sell', icon: TrendingDown, label: t.bottomNav.sell },
    { id: 'transfer', icon: Globe, label: t.bottomNav.transfer },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
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
      
      <div className="mx-3 mb-3 bg-terex-darker/95 backdrop-blur-lg rounded-[1.5rem] shadow-2xl border border-terex-gray/20 p-2">
        <div className="flex justify-around items-center gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center gap-1 h-auto py-2 px-3 rounded-[1rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-terex-accent to-terex-accent/90 text-white shadow-lg shadow-terex-accent/40' 
                    : 'text-gray-400 hover:text-gray-300 hover:bg-transparent'
                }`}
              >
                <div className="relative">
                  {item.isCustomIcon ? (
                    <IconComponent className="h-5 w-5" isActive={isActive} />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                
                <span className={`text-[10px] font-medium whitespace-nowrap transition-all duration-300 ${
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
