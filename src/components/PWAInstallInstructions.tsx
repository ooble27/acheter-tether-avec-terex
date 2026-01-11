
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, Share, Plus, Download } from 'lucide-react';

interface PWAInstallInstructionsProps {
  trigger?: ReactNode;
}

export function PWAInstallInstructions({ trigger }: PWAInstallInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm"
      className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      Installer l'app
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-terex-darker border-terex-gray text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-terex-accent">
            Installer Terex sur votre téléphone
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Instructions générales */}
          <div className="text-center">
            <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-terex-accent" />
            </div>
            <p className="text-sm text-gray-300">
              Ajoutez Terex à votre écran d'accueil pour une expérience app native
            </p>
          </div>

          {/* Instructions iOS */}
          {isIOS() && (
            <Card className="bg-terex-gray/50 border-terex-gray">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-terex-accent flex items-center">
                  <Share className="w-4 h-4 mr-2" />
                  Instructions iPhone/iPad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                  <p className="text-gray-300">
                    Appuyez sur le bouton <Share className="w-4 h-4 inline mx-1" /> "Partager" en bas de Safari
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                  <p className="text-gray-300">
                    Sélectionnez <Plus className="w-4 h-4 inline mx-1" /> "Ajouter à l'écran d'accueil"
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                  <p className="text-gray-300">
                    Confirmez en appuyant sur "Ajouter"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions Android */}
          {isAndroid() && (
            <Card className="bg-terex-gray/50 border-terex-gray">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-terex-accent flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Instructions Android
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                  <p className="text-gray-300">
                    Appuyez sur le menu <span className="font-mono">⋮</span> en haut à droite de Chrome
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                  <p className="text-gray-300">
                    Sélectionnez "Ajouter à l'écran d'accueil"
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                  <p className="text-gray-300">
                    Confirmez en appuyant sur "Ajouter"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions génériques pour autres navigateurs */}
          {!isIOS() && !isAndroid() && (
            <Card className="bg-terex-gray/50 border-terex-gray">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-terex-accent">
                  Instructions générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-gray-300">
                  1. Cherchez l'option "Ajouter à l'écran d'accueil" dans le menu de votre navigateur
                </p>
                <p className="text-gray-300">
                  2. Ou utilisez le bouton d'installation qui apparaît dans la barre d'adresse
                </p>
              </CardContent>
            </Card>
          )}

          <div className="bg-terex-accent/20 p-3 rounded-lg border border-terex-accent/30">
            <p className="text-xs text-terex-accent font-medium text-center">
              ✨ Une fois installée, Terex s'ouvrira comme une vraie application !
            </p>
          </div>

          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-terex-accent text-black hover:bg-terex-accent/90"
          >
            Compris !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
