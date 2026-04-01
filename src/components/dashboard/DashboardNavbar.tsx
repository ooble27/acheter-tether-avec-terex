import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesktopMenuPopover } from './DesktopMenuPopover';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface DashboardNavbarProps {
  onMenuClick: () => void;
  activeSection: string;
  setActiveSection?: (section: string) => void;
  onLogout?: () => void;
}

export function DashboardNavbar({ onMenuClick, activeSection, setActiveSection, onLogout }: DashboardNavbarProps) {
  const isMobile = useIsMobile();
  const [menuPopoverOpen, setMenuPopoverOpen] = useState(false);

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      'home': 'Tableau de bord',
      'buy': 'Acheter USDT',
      'sell': 'Vendre USDT',
      'transfer': 'Virement International',
      'history': 'Historique',
      'profile': 'Mon Profil',
      'faq': 'FAQ',
      'kyc': 'Vérification KYC',
      'kyc-admin': 'Administration KYC',
      'orders-admin': 'Gestion des commandes',
      'job-applications': 'Candidatures',
      'otc': 'Gros Volume',
      'user-guide': 'Guide Utilisateur',
      'security-policy': 'Politique de Sécurité',
      'terms-of-service': 'Conditions d\'utilisation',
      'about-terex': 'À propos de Terex'
    };
    return titles[section] || 'Terex';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-terex-darker/95 backdrop-blur-md border-b border-terex-gray/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {isMobile ? (
            /* Mobile: uniquement le bouton hamburger centré */
            <div className="w-full flex items-center justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="text-white hover:bg-terex-gray/80 rounded-xl border border-terex-gray/50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            /* Desktop: layout complet */
            <>
              {/* Logo et titre de section */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center gap-2">
                    <div className="relative">
                      <img 
                        src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                        alt="Terex Logo" 
                        className="w-8 h-8 rounded-lg shadow-lg"
                      />
                      <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-lg blur opacity-40"></div>
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <h1 className="text-lg font-black tracking-tight text-white">
                        <span className="bg-gradient-to-r from-terex-accent to-terex-accent/80 bg-clip-text text-transparent">
                          TEREX
                        </span>
                      </h1>
                      <p className="text-[8px] font-medium text-terex-accent/70 uppercase tracking-wider">
                        Teranga Exchange
                      </p>
                    </div>
                  </div>
                </div>

                {/* Titre de la section active - visible sur desktop */}
                <div className="hidden md:block h-8 w-px bg-terex-gray/30"></div>
                <h2 className="hidden md:block text-sm font-medium text-gray-300">
                  {getSectionTitle(activeSection)}
                </h2>
              </div>

              {/* Actions à droite */}
              <div className="flex items-center space-x-2">
                {/* Bouton notifications (optionnel) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-300 hover:text-white hover:bg-terex-gray/50 rounded-xl"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-terex-accent rounded-full"></span>
                </Button>

                {/* Bouton Menu Hamburger Desktop */}
                <DesktopMenuPopover
                  activeSection={activeSection}
                  setActiveSection={setActiveSection || (() => {})}
                  onLogout={onLogout || (() => {})}
                  isOpen={menuPopoverOpen}
                  onOpenChange={setMenuPopoverOpen}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-terex-gray/80 rounded-xl border border-terex-gray/50"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
