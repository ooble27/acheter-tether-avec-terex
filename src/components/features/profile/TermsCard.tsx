
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function TermsCard() {
  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <div className="flex items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Conditions d'Utilisation</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-gray-300 space-y-4">
        <div>
          <h3 className="text-white font-semibold mb-2">1. Acceptation des conditions</h3>
          <p className="text-sm">
            En utilisant Terex, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-2">2. Services proposés</h3>
          <p className="text-sm">
            Terex propose des services d'échange de cryptomonnaies (USDT) et de transferts internationaux d'argent.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-2">3. Vérification d'identité</h3>
          <p className="text-sm">
            Une vérification KYC (Know Your Customer) est requise pour accéder à nos services, conformément aux réglementations en vigueur.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-2">4. Sécurité</h3>
          <p className="text-sm">
            Nous utilisons les meilleures pratiques de sécurité pour protéger vos fonds et données personnelles.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-2">5. Responsabilités</h3>
          <p className="text-sm">
            L'utilisateur est responsable de la sécurité de ses identifiants et de la véracité des informations fournies.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-2">6. Support client</h3>
          <p className="text-sm">
            Notre équipe support est disponible 24/7 pour vous accompagner. Contactez-nous à terangaexchange@gmail.com
          </p>
        </div>
        
        <div className="pt-4 border-t border-terex-gray/30">
          <p className="text-xs text-gray-400">
            Dernière mise à jour : Janvier 2025
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
