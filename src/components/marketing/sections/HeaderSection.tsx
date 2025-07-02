
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onMarketplace: () => void;
  onLogout: () => void;
}

export function HeaderSection({ user, onShowDashboard, onMarketplace, onLogout }: HeaderSectionProps) {
  if (!user) return null;

  return (
    <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              <span className="text-terex-accent">Terex</span> Exchange
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onMarketplace}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              Boutique
            </Button>
            <Button
              onClick={onShowDashboard}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-sm">{user.name}</span>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
