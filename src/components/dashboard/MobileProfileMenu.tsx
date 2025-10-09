
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  FileText
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
          <div className="h-px bg-terex-gray/40 flex-1"></div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
          <div className="h-px bg-terex-gray/40 flex-1"></div>
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
    </>
  );

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12 mt-safe"
      >
        <User className="h-6 w-6" />
      </Button>

      {/* Full Screen Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-terex-dark animate-in fade-in duration-200">
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header with Back Button */}
            <div className="flex items-center justify-start p-4 border-b border-terex-gray/30 bg-terex-dark">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-terex-gray/30 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 bg-terex-dark">
              <div className="p-4 space-y-2">
                {/* Section Profil */}
                {renderMenuSection('Profil', profileItems)}

                {/* Section Support */}
                {renderMenuSection('Support', supportItems)}

                {/* Section Plus */}
                {renderMenuSection('Plus', moreItems)}

                {/* Section Administration */}
                {isKYCReviewer() && renderMenuSection('Administration', adminItems)}

                {/* Bouton de déconnexion */}
                <div className="pt-6 pb-4">
                  <Button 
                    onClick={handleLogout}
                    className="w-full h-14 bg-white hover:bg-gray-100 text-black transition-all duration-200 rounded-xl font-medium text-base"
                  >
                    <LogOut className="mr-3 h-6 w-6" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}
