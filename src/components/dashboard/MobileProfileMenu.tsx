
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface MobileProfileMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

export function MobileProfileMenu({ setActiveSection }: MobileProfileMenuProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setActiveSection('profile')}
      className="fixed top-4 right-4 z-50 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12 mt-safe"
    >
      <User className="h-6 w-6" />
    </Button>
  );
}
