
import { useState, useEffect } from 'react';
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

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

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
        setShowIcon(false);
      }

      setDeferredPrompt(null);
    }
  };

  if (!showIcon) {
    return null;
  }

  const fabStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'hsl(var(--terex-accent))',
    color: 'hsl(var(--terex-accent-fg))',
    border: 'none',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (deferredPrompt) {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 50 }}>
        <button onClick={handleInstall} style={fabStyle} aria-label="Installer l'application">
          <Download size={20} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 50 }}>
      <PWAInstallInstructions
        trigger={
          <button style={fabStyle} aria-label="Installer l'application">
            <Download size={20} />
          </button>
        }
      />
    </div>
  );
}
