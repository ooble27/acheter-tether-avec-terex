
import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, Share, Plus, Download, X } from 'lucide-react';

interface PWAInstallInstructionsProps {
  trigger?: ReactNode;
}

export function PWAInstallInstructions({ trigger }: PWAInstallInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = () => /Android/.test(navigator.userAgent);

  const defaultTrigger = (
    <button
      style={{
        background: 'hsl(var(--terex-accent) / 0.08)',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--terex-accent) / 0.15)',
        borderRadius: 10,
        height: 36,
        padding: '0 14px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Smartphone size={15} />
      Installer l'app
    </button>
  );

  const stepBadge = (n: number) => (
    <span style={{
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'hsl(var(--terex-accent) / 0.1)',
      color: 'hsl(var(--foreground))',
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {n}
    </span>
  );

  const stepText: React.CSSProperties = {
    margin: 0,
    fontSize: 13.5,
    color: 'hsl(var(--terex-accent) / 0.7)',
    lineHeight: 1.5,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent
        style={{
          background: 'hsl(var(--terex-darker))',
          border: '1px solid hsl(var(--terex-accent) / 0.1)',
          borderRadius: 20,
          maxWidth: 380,
          padding: 0,
          overflow: 'hidden',
        }}
        className="[&>button]:hidden"
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))' }}>
              Installer Terex
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'hsl(var(--terex-accent) / 0.5)' }}>
              Accédez à Terex depuis votre écran d'accueil
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'hsl(var(--terex-accent) / 0.4)',
              marginTop: -2,
            }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Icon */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'hsl(var(--terex-accent) / 0.06)',
            border: '1px solid hsl(var(--terex-accent) / 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Smartphone size={26} style={{ color: 'hsl(var(--terex-accent) / 0.6)' }} />
          </div>
        </div>

        {/* Instructions */}
        <div style={{ padding: '0 24px 20px' }}>
          {isIOS() && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(1)}
                <p style={stepText}>
                  Appuyez sur <Share size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> Partager en bas de Safari
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(2)}
                <p style={stepText}>
                  Sélectionnez <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> Ajouter à l'écran d'accueil
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(3)}
                <p style={stepText}>Confirmez en appuyant sur Ajouter</p>
              </div>
            </div>
          )}

          {isAndroid() && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(1)}
                <p style={stepText}>
                  Appuyez sur le menu <span style={{ fontFamily: 'monospace' }}>&#8942;</span> en haut à droite de Chrome
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(2)}
                <p style={stepText}>Sélectionnez Ajouter à l'écran d'accueil</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(3)}
                <p style={stepText}>Confirmez en appuyant sur Ajouter</p>
              </div>
            </div>
          )}

          {!isIOS() && !isAndroid() && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(1)}
                <p style={stepText}>
                  Cherchez l'option Ajouter à l'écran d'accueil dans le menu de votre navigateur
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {stepBadge(2)}
                <p style={stepText}>
                  Ou utilisez le bouton d'installation dans la barre d'adresse
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{
          margin: '0 24px',
          padding: '12px 14px',
          borderRadius: 12,
          background: 'hsl(var(--terex-accent) / 0.04)',
          border: '1px solid hsl(var(--terex-accent) / 0.06)',
        }}>
          <p style={{ margin: 0, fontSize: 12.5, color: 'hsl(var(--terex-accent) / 0.5)', textAlign: 'center' }}>
            Terex s'ouvrira comme une application native sur votre appareil.
          </p>
        </div>

        {/* Button */}
        <div style={{ padding: '16px 24px 24px' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 12,
              background: 'hsl(var(--terex-accent))',
              color: 'hsl(var(--terex-accent-fg))',
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Compris
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
