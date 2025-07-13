
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Shield, 
  FileText, 
  Info, 
  LogOut,
  ChevronRight,
  UserCircle
} from 'lucide-react';

interface ProfileMenuProps {
  user: { email: string; name: string } | null;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const menuSections = [
  {
    title: 'Mon Compte',
    items: [
      { id: 'profile', label: 'Mon Profil', icon: User, description: 'Informations personnelles' },
      { id: 'kyc', label: 'Vérification d\'identité', icon: Shield, description: 'KYC et sécurité' },
    ]
  },
  {
    title: 'Aide & Support',
    items: [
      { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Questions fréquentes' },
      { id: 'user-guide', label: 'Guide utilisateur', icon: FileText, description: 'Mode d\'emploi' },
      { id: 'about-terex', label: 'À propos de Terex', icon: Info, description: 'Notre entreprise' },
    ]
  }
];

export function ProfileMenu({ user, activeSection, setActiveSection, onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 z-40 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12 mt-safe"
        >
          <UserCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-80 bg-terex-darker border-l border-terex-gray/30 p-0 shadow-2xl"
        style={{
          height: '100dvh',
          maxHeight: '100dvh',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 9999
        }}
      >
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }} className="pt-safe">
          {/* Header utilisateur */}
          <SheetHeader className="p-6 border-b border-terex-gray/30 bg-terex-darker">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <SheetTitle className="text-white text-lg font-semibold">
                  {user?.name || 'Utilisateur'}
                </SheetTitle>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
          </SheetHeader>

          {/* Menu */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3 px-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full h-auto p-4 justify-start rounded-xl transition-all duration-200 ${
                          activeSection === item.id 
                            ? 'bg-terex-accent/20 text-terex-accent' 
                            : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`p-2 rounded-lg ${
                            activeSection === item.id ? 'bg-terex-accent/20' : 'bg-terex-gray/30'
                          }`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton déconnexion */}
          <div className="p-4 border-t border-terex-gray/30 mt-auto flex-shrink-0 pb-safe">
            <Button 
              onClick={onLogout}
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
