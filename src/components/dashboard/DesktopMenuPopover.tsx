import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, History, HelpCircle, Phone, Star, Gift, Share2, FileText, Shield, UserCheck, LogOut } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface DesktopMenuPopoverProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export function DesktopMenuPopover({
  activeSection,
  setActiveSection,
  onLogout,
  isOpen,
  onOpenChange,
  trigger
}: DesktopMenuPopoverProps) {
  const { isKYCReviewer, isAdmin } = useUserRole();

  const handleItemClick = (section: string) => {
    setActiveSection(section);
    onOpenChange(false);
  };

  const handleLogout = () => {
    onOpenChange(false);
    onLogout();
  };

  const profileItems = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'history', label: 'Historique', icon: History },
  ];

  const supportItems = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Nous Contacter', icon: Phone },
    { id: 'feedback', label: 'Avis & Suggestions', icon: Star },
  ];

  const moreItems = [
    { id: 'referral', label: 'Parrainage', icon: Gift },
    { id: 'share-app', label: 'Partager l\'App', icon: Share2 },
    { id: 'terms', label: 'Conditions d\'Utilisation', icon: FileText },
  ];

  const adminItems = [
    { id: 'kyc-admin', label: 'Administration KYC', icon: Shield },
    { id: 'orders-admin', label: 'Gestion Commandes', icon: Shield },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck },
  ];

  const renderMenuSection = (title: string, items: any[]) => (
    <>
      <div className="px-2 py-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
      
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleItemClick(item.id)}
            className={`w-full justify-start p-3 h-auto rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-terex-accent/20 text-terex-accent' 
                : 'text-gray-300 hover:bg-terex-gray/30 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3 w-full">
              <IconComponent className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          </Button>
        );
      })}
    </>
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-3 bg-terex-darker/95 backdrop-blur-md border-terex-gray/30 shadow-2xl z-[200]"
        sideOffset={8}
      >
        <div className="space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Section Profil */}
          {renderMenuSection('Profil', profileItems)}

          <div className="h-px bg-terex-gray/20 my-2"></div>

          {/* Section Support */}
          {renderMenuSection('Support', supportItems)}

          <div className="h-px bg-terex-gray/20 my-2"></div>

          {/* Section Plus */}
          {renderMenuSection('Plus', moreItems)}

          {/* Section Administration */}
          {isKYCReviewer() && (
            <>
              <div className="h-px bg-terex-gray/20 my-2"></div>
              {renderMenuSection('Administration', adminItems)}
            </>
          )}

          <div className="h-px bg-terex-gray/20 my-2"></div>

          {/* Bouton de déconnexion */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start p-3 h-auto rounded-lg transition-all duration-200 text-red-400 hover:bg-red-600/20 hover:text-red-300"
          >
            <div className="flex items-center space-x-3 w-full">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-sm">Déconnexion</span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
