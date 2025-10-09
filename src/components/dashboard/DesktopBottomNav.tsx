import { Home, ArrowDownUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TetherIcon = ({ className, isActive }: { className?: string; isActive?: boolean }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" 
    alt="USDT" 
    className={`${className} ${isActive ? 'brightness-0 invert' : ''}`}
  />
);

interface DesktopBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DesktopBottomNav({ activeSection, setActiveSection }: DesktopBottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'buy', label: 'Acheter', icon: TetherIcon, isCustomIcon: true },
    { id: 'sell', label: 'Vendre', icon: ArrowDownUp },
    { id: 'transfer', label: 'Virements', icon: Globe },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-terex-darker/95 backdrop-blur-md border-t border-terex-gray/30 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center h-full px-6 rounded-none transition-all ${
                  isActive 
                    ? 'text-terex-accent border-t-2 border-terex-accent bg-terex-accent/10' 
                    : 'text-gray-400 hover:text-white hover:bg-terex-gray/30'
                }`}
              >
                {item.isCustomIcon ? (
                  <Icon className="h-6 w-6 mb-1" isActive={isActive} />
                ) : (
                  <Icon className="h-6 w-6 mb-1" />
                )}
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
