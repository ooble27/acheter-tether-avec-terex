
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
    <header className={`${isMobile ? 'relative bg-white' : 'bg-white border-b border-gray-100'} pt-safe`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-10 h-10 rounded-lg cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              <nav className="flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-light"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-4 ml-8 border-l border-gray-100 pl-8">
                {user ? (
                  <>
                    <Button
                      onClick={onShowDashboard}
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">{user.name}</span>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-light rounded-lg"
                  >
                    Connexion
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white border-none p-0">
                <ScrollArea className="h-full">
                  <div className="flex flex-col min-h-full pt-safe">
                    {/* Header avec logo */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                          alt="Terex Logo" 
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="p-4 space-y-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => navigate(item.href)}
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-gray-400">{item.description}</div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>

                    {/* Support Section */}
                    <div className="px-4 pb-4 space-y-1">
                      <div className="pt-4 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-px bg-gray-100 flex-1"></div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Support</span>
                          <div className="h-px bg-gray-100 flex-1"></div>
                        </div>
                      </div>
                      {supportItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => navigate(item.href)}
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-gray-400">{item.description}</div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 mt-auto pb-safe">
                      {user ? (
                        <div className="space-y-2">
                          <Button
                            onClick={onShowDashboard}
                            variant="ghost"
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">Mon Dashboard</div>
                                <div className="text-xs text-gray-400">Accéder à mon compte</div>
                              </div>
                            </div>
                          </Button>
                          <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start p-4 h-auto rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="p-2 rounded-lg bg-gray-100">
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
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 rounded-xl"
                        >
                          Se Connecter
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
