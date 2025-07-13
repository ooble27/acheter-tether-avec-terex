
import { Home, TrendingDown, Globe, History, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TetherLogo = ({
  className,
  isActive,
}: {
  className?: string;
  isActive?: boolean;
}) => <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="Tether Logo" className={`${className} ${isActive ? 'brightness-0 invert' : ''}`} />;

interface BottomNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'buy', icon: TetherLogo, label: 'Acheter', isCustomIcon: true },
  { id: 'sell', icon: TrendingDown, label: 'Vendre' },
  { id: 'transfer', icon: Globe, label: 'Virement' },
  { id: 'history', icon: History, label: 'Historique' },
];

export function BottomNavigation({ activeSection, setActiveSection }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-terex-darker/95 backdrop-blur-sm border-t border-terex-gray/30 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-terex-accent/20 text-terex-accent' 
                  : 'text-gray-400 hover:text-white hover:bg-terex-gray/50'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-terex-accent/20' : ''}`}>
                {item.isCustomIcon ? (
                  <IconComponent className="h-5 w-5" isActive={isActive} />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
