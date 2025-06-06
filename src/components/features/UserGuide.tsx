
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, FileText, Users, BookOpen } from 'lucide-react';

interface UserGuideProps {
  onBack: () => void;
}

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-terex-accent hover:text-terex-accent-light hover:bg-terex-gray/50 p-2 h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documentation Terex</h1>
          <p className="text-gray-400">
            Tout ce que vous devez savoir sur Terex
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guide d'utilisation */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-terex-accent" />
              <span>Guide d'utilisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-terex-accent mb-3">Comment utiliser Terex</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">🔐 1. Inscription et vérification</h4>
                  <p className="text-sm">Créez votre compte et complétez votre vérification KYC pour accéder à toutes les fonctionnalités.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">💰 2. Acheter des USDT</h4>
                  <p className="text-sm">Utilisez la section "Acheter USDT" pour convertir vos CFA ou CAD en USDT. Choisissez votre réseau (TRC20, BEP20, ERC20) et suivez les instructions de paiement.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">💸 3. Vendre des USDT</h4>
                  <p className="text-sm">Dans "Vendre USDT", envoyez vos USDT et recevez des fonds sur Orange Money ou Wave sous 5 minutes.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">🌍 4. Virements internationaux</h4>
                  <p className="text-sm">Transférez de l'argent vers l'Afrique de l'Ouest depuis le Canada via Interac ou virement bancaire.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">🤝 5. Trading OTC</h4>
                  <p className="text-sm">Pour les gros volumes, utilisez notre service OTC avec des taux préférentiels et un support dédié.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-terex-gray p-4 rounded-lg">
              <h4 className="font-medium text-terex-accent mb-2">⚡ Conseils rapides</h4>
              <ul className="text-sm space-y-1">
                <li>• Vérifiez toujours l'adresse de réception avant d'envoyer</li>
                <li>• Les transactions TRC20 sont les plus rapides et économiques</li>
                <li>• Gardez vos informations de compte à jour</li>
                <li>• Contactez le support en cas de problème</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Politique de sécurité */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-500" />
              <span>Politique de sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-green-500 mb-3">Votre sécurité est notre priorité</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">🔒 Chiffrement des données</h4>
                  <p className="text-sm">Toutes vos données sont chiffrées avec les protocoles SSL/TLS les plus récents. Vos informations personnelles et financières sont protégées.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">👤 Vérification d'identité (KYC)</h4>
                  <p className="text-sm">Notre processus KYC conforme aux réglementations garantit la sécurité de tous les utilisateurs et prévient la fraude.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">💳 Sécurité des transactions</h4>
                  <p className="text-sm">Chaque transaction est vérifiée et sécurisée. Nous utilisons des portefeuilles multi-signatures pour protéger vos fonds.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">📧 Communications sécurisées</h4>
                  <p className="text-sm">Nous ne demandons jamais vos mots de passe par email. Méfiez-vous des tentatives de phishing.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
              <h4 className="font-medium text-green-400 mb-2">🛡️ Bonnes pratiques</h4>
              <ul className="text-sm space-y-1">
                <li>• Utilisez un mot de passe fort et unique</li>
                <li>• Ne partagez jamais vos identifiants</li>
                <li>• Vérifiez toujours l'URL du site</li>
                <li>• Contactez-nous en cas de doute</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Conditions d'utilisation */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-500" />
              <span>Conditions d'utilisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-blue-500 mb-3">Termes et conditions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">📋 Acceptation des conditions</h4>
                  <p className="text-sm">En utilisant Terex, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">✅ Éligibilité</h4>
                  <p className="text-sm">Vous devez être majeur et résider dans un pays où nos services sont autorisés pour utiliser Terex.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">💼 Utilisation du service</h4>
                  <p className="text-sm">Terex est destiné aux échanges légitimes de cryptomonnaies et virements internationaux. Toute activité illégale est interdite.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">📊 Limites de transaction</h4>
                  <p className="text-sm">Des limites s'appliquent selon votre niveau de vérification. Les montants élevés peuvent nécessiter une vérification supplémentaire.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <h4 className="font-medium text-blue-400 mb-2">⚖️ Responsabilités</h4>
              <ul className="text-sm space-y-1">
                <li>• Fournir des informations exactes</li>
                <li>• Respecter les lois locales</li>
                <li>• Signaler toute activité suspecte</li>
                <li>• Maintenir la sécurité de votre compte</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Bloc Terex */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Users className="h-6 w-6 text-terex-accent" />
              <span>À propos de Terex</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-terex-accent mb-3">Teranga Exchange</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">🌍 Notre mission</h4>
                  <p className="text-sm">Faciliter les échanges financiers entre le Canada et l'Afrique de l'Ouest grâce à la technologie blockchain.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">🚀 Innovation</h4>
                  <p className="text-sm">Nous utilisons les dernières technologies pour offrir des services rapides, sécurisés et abordables.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">🤝 Communauté</h4>
                  <p className="text-sm">Terex connecte les diaspora africaines au Canada avec leurs familles et leurs entreprises en Afrique.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">📞 Support 24/7</h4>
                  <p className="text-sm">Notre équipe est disponible 24h/24 et 7j/7 pour vous accompagner dans toutes vos transactions.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-terex-accent/10 border border-terex-accent/30 p-4 rounded-lg">
              <h4 className="font-medium text-terex-accent mb-2">📧 Contact</h4>
              <div className="text-sm space-y-1">
                <p>Email: TerangaExchange@gmail.com</p>
                <p>Téléphone: +1 (418) 261-9091</p>
                <p>Support: 24/7 via chat en direct</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
