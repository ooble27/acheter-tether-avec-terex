
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Info } from 'lucide-react';
import { PWAInstallInstructions } from './PWAInstallInstructions';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Vérifier si on est déjà en mode standalone (PWA installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Afficher les instructions si pas encore installé et pas de prompt automatique
    if (!isStandalone && !deferredPrompt) {
      // Attendre un peu avant d'afficher les instructions
      setTimeout(() => {
        setShowInstructions(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismissInstructions = () => {
    setShowInstructions(false);
    // Sauvegarder que l'utilisateur a vu les instructions
    localStorage.setItem('terex-install-instructions-seen', 'true');
  };

  // Vérifier si les instructions ont déjà été vues
  useEffect(() => {
    const instructionsSeen = localStorage.getItem('terex-install-instructions-seen');
    if (instructionsSeen) {
      setShowInstructions(false);
    }
  }, []);

  // Prompt d'installation automatique (Android/Chrome)
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <Card className="bg-terex-darker border-terex-accent/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img 
                  src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                  alt="Terex" 
                  className="w-8 h-8 rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">
                  Installer Terex
                </h3>
                <p className="text-gray-300 text-xs mt-1">
                  Ajoutez Terex à votre écran d'accueil pour un accès rapide
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="bg-terex-accent text-black hover:bg-terex-accent/90 h-8 px-3 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Installer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-white h-8 px-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Instructions manuelles pour iOS et autres navigateurs
  if (showInstructions) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <Card className="bg-terex-darker border-blue-500/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">
                  Installer l'app Terex
                </h3>
                <p className="text-gray-300 text-xs mt-1">
                  Accédez plus rapidement à Terex depuis votre écran d'accueil
                </p>
                <div className="flex space-x-2 mt-3">
                  <PWAInstallInstructions />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismissInstructions}
                    className="text-gray-400 hover:text-white h-8 px-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
