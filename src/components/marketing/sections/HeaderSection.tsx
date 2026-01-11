
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, LogOut, Menu, Home, Building2, Briefcase, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Force reload on error to ensure clean state
      window.location.reload();
    }
  };

  const navigationItems = [
    { label: 'Accueil', href: '/', icon: Home, description: 'Page d\'accueil' },
    { label: 'À propos', href: '/about', icon: Building2, description: 'Découvrez Terex' },
    { label: 'Carrières', href: '/careers', icon: Briefcase, description: 'Rejoignez l\'équipe' },
  ];

  const supportItems = [
    { label: 'Support', href: '/support', icon: HelpCircle, description: 'Centre d\'aide' },
    { label: 'Contact', href: '/contact', icon: Phone, description: 'Nous contacter' },
    { label: 'FAQ', href: '/faq', icon: MessageCircle, description: 'Questions fréquentes' }
  ];

  return (
    <header className="pt-safe relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Floating navbar container - Prismo style */}
        {!isMobile ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg shadow-black/5 px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-9 h-9 rounded-lg cursor-pointer"
                onClick={() => navigate('/')}
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">Terex</span>
            </div>

            {/* Navigation Links - Center */}
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              {supportItems.slice(0, 2).map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Actions - Right */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    onClick={onShowDashboard}
                    variant="outline"
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 px-5"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-5"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 px-5"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-5"
                  >
                    Commencer
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Logo seul */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-10 h-10 rounded-lg cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Mobile Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-terex-accent/20"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-terex-darker border-none p-0">
                <ScrollArea className="h-full">
                  <div className="flex flex-col min-h-full pt-safe">
                    {/* Header avec logo */}
                    <div className="p-6 border-b border-terex-gray/20">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                          alt="Terex Logo" 
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <h2 className="text-lg font-semibold text-white">Navigation</h2>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="p-4 space-y-2">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => navigate(item.href)}
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-300 hover:bg-terex-gray/50 hover:text-white transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-terex-gray/30">
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
                    </div>

                    {/* Support Section */}
                    <div className="px-4 pb-4 space-y-2">
                      <div className="pt-4 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-px bg-terex-gray/40 flex-1"></div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Support</span>
                          <div className="h-px bg-terex-gray/40 flex-1"></div>
                        </div>
                      </div>
                      {supportItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => navigate(item.href)}
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-300 hover:bg-terex-gray/50 hover:text-white transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-terex-gray/30">
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
                    </div>

                    {/* Footer avec bouton de connexion */}
                    <div className="p-4 border-t border-terex-gray/20 mt-auto pb-safe">
                      {user ? (
                        <div className="space-y-2">
                          <Button
                            onClick={onShowDashboard}
                            variant="ghost"
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-300 hover:bg-terex-gray/50 hover:text-white transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-terex-gray/30">
                                <User className="h-5 w-5" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">Mon Dashboard</div>
                                <div className="text-xs opacity-75">Accéder à mon compte</div>
                              </div>
                            </div>
                          </Button>
                          <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-terex-gray/30">
                                <LogOut className="h-5 w-5" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">Déconnexion</div>
                                <div className="text-xs opacity-75">Se déconnecter</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => navigate('/auth')}
                          className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-medium py-6 rounded-xl shadow-lg shadow-terex-accent/25"
                        >
                          Se Connecter
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
