
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, HelpCircle, Settings, LogOut, Shield, UserCheck } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface MobileProfileMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

export function MobileProfileMenu({ activeSection, setActiveSection, onLogout }: MobileProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isKYCReviewer, isAdmin } = useUserRole();

  const handleItemClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const profileItems = [
    { id: 'profile', label: 'Mon Profil', icon: User, description: 'Informations personnelles' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Centre d\'aide' },
  ];

  const adminItems = [
    { id: 'kyc-admin', label: 'Administration KYC', icon: Shield, description: 'Vérifications d\'identité' },
    { id: 'orders-admin', label: 'Gestion Commandes', icon: Settings, description: 'Ordres et transactions' },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck, description: 'Gestion des candidatures' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 z-50 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12 mt-safe"
        >
          <User className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-80 bg-terex-darker border-l border-terex-gray/30 p-0 shadow-2xl"
      >
        <div className="flex flex-col h-full pt-safe">
          {/* Header */}
          <div className="p-6 border-b border-terex-gray/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Menu Profil</h2>
                <p className="text-gray-400 text-sm">Paramètres & Options</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {profileItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/25' 
                        : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-terex-gray/30'}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}

              {/* Section Administration */}
              {isKYCReviewer() && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center space-x-2 px-4">
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Administration</span>
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                    </div>
                  </div>
                  
                  {adminItems.map((item) => {
                    if (item.id === 'job-applications' && !isAdmin() && !isKYCReviewer()) return null;
                    
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                            : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4 w-full">
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-terex-gray/30'}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Footer avec bouton de déconnexion */}
          <div className="p-4 border-t border-terex-gray/30 pb-safe">
            <Button 
              onClick={handleLogout}
              className="w-full h-14 bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white transition-all duration-200 rounded-xl font-medium text-sm"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
