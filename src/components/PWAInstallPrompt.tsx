
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowIcon(true);
    };

    // Vérifier si on est déjà en mode standalone (PWA installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    // Vérifier si l'utilisateur a déjà fermé l'icône
    const iconDismissed = localStorage.getItem('terex-install-icon-dismissed');

    if (!isStandalone && !iconDismissed) {
      setShowIcon(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowIcon(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowIcon(false);
    localStorage.setItem('terex-install-icon-dismissed', 'true');
  };

  if (!showIcon) {
    return null;
  }

  // Si on a le prompt natif (Android/Chrome), l'utiliser directement
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-6 right-4 z-50">
        <Button
          onClick={handleInstall}
          className="w-12 h-12 rounded-full bg-terex-accent text-black hover:bg-terex-accent/90 shadow-lg"
          size="icon"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Sinon, afficher l'icône qui ouvre les instructions
  return (
    <div className="fixed bottom-6 right-4 z-50 flex items-center gap-2">
      <PWAInstallInstructions 
        trigger={
          <Button
            className="w-12 h-12 rounded-full bg-terex-accent text-black hover:bg-terex-accent/90 shadow-lg"
            size="icon"
          >
            <Download className="w-5 h-5" />
          </Button>
        }
      />
    </div>
  );
}
