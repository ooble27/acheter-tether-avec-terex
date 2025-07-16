
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { 
  User, 
  HelpCircle, 
  LogOut, 
  Shield, 
  UserCheck, 
  History,
  Star,
  Gift,
  Phone,
  Share2,
  FileText,
  Settings
} from 'lucide-react';
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
    { id: 'history', label: 'Historique', icon: History, description: 'Mes transactions' },
  ];

  const supportItems = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Questions fréquentes' },
    { id: 'contact', label: 'Nous Contacter', icon: Phone, description: 'Support client 24/7' },
    { id: 'feedback', label: 'Avis & Suggestions', icon: Star, description: 'Donnez votre avis' },
  ];

  const moreItems = [
    { id: 'referral', label: 'Parrainage', icon: Gift, description: 'Invitez vos amis' },
    { id: 'share-app', label: 'Partager l\'App', icon: Share2, description: 'Partager Terex' },
    { id: 'terms', label: 'Conditions d\'Utilisation', icon: FileText, description: 'CGU et politique' },
  ];

  const adminItems = [
    { id: 'kyc-admin', label: 'Administration KYC', icon: Shield, description: 'Vérifications d\'identité' },
    { id: 'orders-admin', label: 'Gestion Commandes', icon: Shield, description: 'Ordres et transactions' },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck, description: 'Gestion des candidatures' },
  ];

  const renderMenuSection = (title: string, items: any[]) => (
    <>
      <div className="pt-4 pb-2">
        <div className="flex items-center space-x-2 px-4">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className="h-px bg-border flex-1"></div>
        </div>
      </div>
      
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleItemClick(item.id)}
            className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-terex-accent to-terex-accent-light text-white shadow-lg shadow-terex-accent/25' 
                : 'text-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-muted/30'}`}>
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
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 bg-card/95 backdrop-blur-sm border border-border text-foreground hover:bg-accent/80 shadow-lg rounded-xl w-12 h-12 mt-safe transition-colors duration-300"
        >
          <User className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-80 bg-card border-r border-border p-0 shadow-2xl no-scrollbar transition-colors duration-300"
      >
        <div className="flex flex-col h-full pt-safe">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent-light rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Menu Profil</h2>
                  <p className="text-muted-foreground text-sm">Paramètres & Options</p>
                </div>
              </div>
            </div>
            
            {/* Switch de thème dans le header */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Thème</span>
              </div>
              <ThemeSwitch variant="minimal" />
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 no-scrollbar">
            <div className="p-4">
              <div className="space-y-2">
                {/* Section Profil */}
                {renderMenuSection('Profil', profileItems)}

                {/* Section Support */}
                {renderMenuSection('Support', supportItems)}

                {/* Section Plus */}
                {renderMenuSection('Plus', moreItems)}

                {/* Section Administration */}
                {isKYCReviewer() && renderMenuSection('Administration', adminItems)}
              </div>
            </div>
          </ScrollArea>

          {/* Footer avec bouton de déconnexion */}
          <div className="p-4 border-t border-border pb-safe">
            <Button 
              onClick={handleLogout}
              className="w-full h-14 bg-destructive/20 hover:bg-destructive border border-destructive/30 text-destructive hover:text-destructive-foreground transition-all duration-200 rounded-xl font-medium text-sm"
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
