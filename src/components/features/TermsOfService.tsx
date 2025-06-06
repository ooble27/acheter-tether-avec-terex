
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Scale, AlertCircle, Users, CreditCard, Ban, Shield, Globe, Gavel, CheckCircle, XCircle, Info } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Conditions d'utilisation complètes - Terex</h1>
          <p className="text-gray-400">
            Termes et conditions juridiques détaillés régissant l'utilisation de nos services
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Préambule et acceptation des conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Les présentes Conditions Générales d'Utilisation (« CGU ») constituent un contrat juridiquement contraignant 
              entre vous (« Utilisateur », « Vous », « Client ») et Terex Exchange Inc. (« Terex », « Nous », « Notre société », « La plateforme »).
            </p>
            <p>
              En créant un compte, en accédant à notre plateforme ou en utilisant nos services de change de cryptomonnaies 
              et de virements internationaux, vous déclarez avoir lu, compris et accepté sans réserve l'intégralité de ces conditions. 
              Si vous n'acceptez pas ces termes dans leur totalité, vous devez immédiatement cesser d'utiliser nos services.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-200 font-medium">Important - Accord juridique</p>
                  <p className="text-yellow-100 text-sm mt-1">
                    Ces conditions constituent un accord légalement contraignant. En continuant à utiliser Terex, 
                    vous confirmez votre accord avec tous les termes et acceptez d'être lié par ces conditions. 
                    Si vous agissez au nom d'une entreprise, vous garantissez avoir l'autorité pour engager cette entité.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terex-accent" />
              Éligibilité, inscription et vérification d'identité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Conditions d'éligibilité strictes:</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-terex-gray p-4 rounded-lg">
                  <h5 className="text-green-400 font-medium mb-2">✅ Exigences minimales</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Âge minimum: 18 ans révolus (majorité légale)</li>
                    <li>• Capacité juridique pleine pour contracter</li>
                    <li>• Résidence dans un pays où nos services sont légaux</li>
                    <li>• Possession d'une adresse email valide et active</li>
                    <li>• Accès à un numéro de téléphone pour vérifications</li>
                    <li>• Documents d'identité officiels valides</li>
                  </ul>
                </div>
                <div className="bg-terex-gray p-4 rounded-lg">
                  <h5 className="text-red-400 font-medium mb-2">❌ Exclusions automatiques</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Mineurs de moins de 18 ans</li>
                    <li>• Résidents de pays sous sanctions internationales</li>
                    <li>• Personnes politiquement exposées (PEP) non déclarées</li>
                    <li>• Individus sur listes de sanctions (OFAC, ONU, UE)</li>
                    <li>• Comptes précédemment suspendus pour violation</li>
                    <li>• Entités impliquées dans des activités illégales</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h5 className="text-blue-200 font-medium mb-3">🔍 Procédure de vérification KYC (Know Your Customer)</h5>
                <p className="text-blue-100 text-sm mb-3">
                  Conformément aux réglementations internationales KYC/AML, tous les utilisateurs doivent subir 
                  une procédure de vérification d'identité progressive selon les montants transactionnels.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-500/10 p-3 rounded">
                    <h6 className="text-blue-300 font-medium text-sm">Niveau 1 - Basique</h6>
                    <ul className="text-blue-200 text-xs mt-2 space-y-1">
                      <li>• Email et téléphone vérifiés</li>
                      <li>• Informations personnelles de base</li>
                      <li>• Limite: 1,000 CAD/mois</li>
                      <li>• Validation immédiate</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded">
                    <h6 className="text-blue-300 font-medium text-sm">Niveau 2 - Intermédiaire</h6>
                    <ul className="text-blue-200 text-xs mt-2 space-y-1">
                      <li>• Document d'identité avec photo</li>
                      <li>• Vérification biométrique faciale</li>
                      <li>• Limite: 10,000 CAD/mois</li>
                      <li>• Délai: 24-48 heures</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded">
                    <h6 className="text-blue-300 font-medium text-sm">Niveau 3 - Avancé</h6>
                    <ul className="text-blue-200 text-xs mt-2 space-y-1">
                      <li>• Justificatif de domicile récent</li>
                      <li>• Déclaration source de revenus</li>
                      <li>• Limite: 50,000+ CAD/mois</li>
                      <li>• Délai: 72-96 heures</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h5 className="text-orange-200 font-medium mb-2">📋 Documents acceptés pour la vérification</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-orange-100 font-medium text-sm">Documents d'identité primaire</h6>
                    <ul className="text-orange-100 text-xs mt-1 space-y-1">
                      <li>• Passeport biométrique en cours de validité</li>
                      <li>• Carte nationale d'identité avec photo</li>
                      <li>• Permis de conduire gouvernemental</li>
                      <li>• Carte de résident permanent</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-orange-100 font-medium text-sm">Justificatifs de domicile (< 3 mois)</h6>
                    <ul className="text-orange-100 text-xs mt-1 space-y-1">
                      <li>• Facture d'électricité, gaz ou eau</li>
                      <li>• Relevé bancaire officiel</li>
                      <li>• Facture de téléphone fixe ou internet</li>
                      <li>• Avis d'imposition ou taxe foncière</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-terex-accent" />
              Description détaillée des services
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-white font-medium">
              Terex propose une gamme complète de services financiers digitaux spécialisés dans les cryptomonnaies 
              et les transferts internationaux, conçus spécifiquement pour connecter l'Afrique au monde digital.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">💰 Achat et vente d'USDT (Tether)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-white font-medium text-sm">Service d'achat d'USDT</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Conversion CFA/CAD vers USDT</li>
                      <li>• Réseaux: TRC20, BEP20, ERC20, Arbitrum, Polygon</li>
                      <li>• Minimum: 10,000 CFA ou 15 CAD</li>
                      <li>• Taux de change en temps réel</li>
                      <li>• Livraison sous 15 minutes maximum</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-white font-medium text-sm">Service de vente d'USDT</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Conversion USDT vers CFA/CAD</li>
                      <li>• Réception Orange Money, Wave, Interac</li>
                      <li>• Minimum: 10 USDT</li>
                      <li>• Traitement: 5-15 minutes</li>
                      <li>• Vérification blockchain automatique</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🌍 Virements internationaux</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <h6 className="text-white font-medium text-sm">Pays source</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• 🇨🇦 Canada (CAD)</li>
                      <li>• Paiement par Interac e-Transfer</li>
                      <li>• Minimum: 25 CAD</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-white font-medium text-sm">Pays de destination</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• 🇸🇳 S̩énégal</li>
                      <li>• 🇨🇮 Côte d'Ivoire</li>
                      <li>• 🇲🇱 Mali</li>
                      <li>• 🇧🇫 Burkina Faso</li>
                      <li>• 🇳🇪 Niger</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-white font-medium text-sm">Méthodes de réception</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Orange Money (tous pays pris en charge)</li>
                      <li>• Wave (Sénégal, Côte d'Ivoire)</li>
                      <li>• Traitement sous 15 minutes</li>
                      <li>• Notification au bénéficiaire</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">💼 Services additionnels</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-white font-medium text-sm">Service OTC (Over-The-Counter)</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Transactions personnalisées grand volume</li>
                      <li>• Minimum: 5,000+ USDT ou équivalent</li>
                      <li>• Taux préférentiels négociés</li>
                      <li>• Prise en charge dédiée</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-white font-medium text-sm">Support client premium</h6>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Assistance personnelle 24/7</li>
                      <li>• Email, chat et téléphone</li>
                      <li>• Suivi prioritaire des transactions</li>
                      <li>• Résolution sous 30 minutes maximum</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-purple-200 font-medium">Évolution des services</h5>
                  <p className="text-purple-100 text-sm mt-1">
                    Terex se réserve le droit de modifier, ajouter ou retirer des services à sa discrétion. 
                    Les utilisateurs seront informés de tout changement substantiel par email 30 jours avant 
                    son entrée en vigueur. L'utilisation continue des services après modification constitue 
                    l'acceptation des nouvelles conditions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scale className="w-5 h-5 mr-2 text-terex-accent" />
              Frais, tarification et paiements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-terex-gray p-4 rounded-lg">
              <h5 className="text-terex-accent font-medium mb-3">💸 Structure tarifaire transparente</h5>
              <p className="text-sm mb-3">
                Terex s'engage à offrir une tarification claire et sans frais cachés pour tous ses services.
                Nos frais sont intégrés directement dans nos taux de change en temps réel et sont toujours 
                affichés avant confirmation de toute transaction.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-green-400 font-medium text-sm">Achat d'USDT</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Spread: 1.5-3% inclus dans le taux</li>
                    <li>• Frais blockchain inclus</li>
                    <li>• Aucun frais de traitement additionnel</li>
                    <li>• Volume > 1,000 USDT: taux préférentiels</li>
                  </ul>
                </div>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-blue-400 font-medium text-sm">Vente d'USDT</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Spread: 2-4% inclus dans le taux</li>
                    <li>• Frais des opérateurs mobiles inclus</li>
                    <li>• Pas de frais cachés pour le destinataire</li>
                    <li>• Montants reçus garantis</li>
                  </ul>
                </div>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-purple-400 font-medium text-sm">Virements internationaux</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Frais totaux: 4-6% inclus dans taux</li>
                    <li>• Comparaison: 8-12% par banques traditionnelles</li>
                    <li>• Frais opérateurs mobiles inclus</li>
                    <li>• Montant reçu garanti affiché</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-terex-gray p-4 rounded-lg">
              <h5 className="text-terex-accent font-medium mb-3">💳 Méthodes de paiement acceptées</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-white font-medium text-sm">Pour les transactions en CFA (Afrique)</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-terex-darker p-3 rounded">
                      <p className="text-orange-400 font-medium">Orange Money</p>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Disponible dans tous les pays supportés</li>
                        <li>• Confirmation automatique</li>
                        <li>• Délai: Instantané</li>
                      </ul>
                    </div>
                    <div className="bg-terex-darker p-3 rounded">
                      <p className="text-blue-400 font-medium">Wave</p>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Sénégal et Côte d'Ivoire</li>
                        <li>• Confirmation automatique</li>
                        <li>• Délai: Instantané</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h6 className="text-white font-medium text-sm">Pour les transactions en CAD (Canada)</h6>
                  <div className="bg-terex-darker p-3 rounded mt-2">
                    <p className="text-green-400 font-medium">Interac e-Transfer</p>
                    <ul className="text-xs mt-1 space-y-1">
                      <li>• Email de réception fourni par Terex</li>
                      <li>• Question/réponse sécurisée</li>
                      <li>• Délai: 15-30 minutes</li>
                      <li>• Toutes banques canadiennes supportées</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-yellow-200 font-medium">Fluctuations de taux et volatilité</h5>
                  <p className="text-yellow-100 text-sm mt-1">
                    Les taux de change affichés sont garantis pendant 15 minutes après la création d'un ordre. 
                    Passé ce délai, un nouveau taux pourra être appliqué en fonction des conditions du marché. 
                    Terex ne peut être tenu responsable de la volatilité des marchés de cryptomonnaies ou des 
                    variations des taux de change des devises traditionnelles.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Ban className="w-5 h-5 mr-2 text-terex-accent" />
              Utilisations strictement interdites
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-white font-medium">
              En utilisant Terex, vous vous engagez formellement à ne jamais utiliser nos services pour les activités suivantes, 
              strictement interdites et potentiellement passibles de poursuites judiciaires:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <h5 className="text-red-300 font-medium mb-3">⛔ Activités criminelles et frauduleuses</h5>
                <ul className="text-sm space-y-1">
                  <li>• Blanchiment d'argent ou tentative de blanchiment</li>
                  <li>• Financement du terrorisme ou d'organisations terroristes</li>
                  <li>• Fraude, extorsion ou escroquerie sous toutes formes</li>
                  <li>• Trafic d'êtres humains ou exploitation de mineurs</li>
                  <li>• Commerce de biens et substances illicites</li>
                  <li>• Contrefaçon, contrebande ou marchandises illégales</li>
                  <li>• Corruption, pots-de-vin ou détournement de fonds</li>
                  <li>• Évasion fiscale ou contournement de contrôles de capitaux</li>
                  <li>• Violation de sanctions économiques internationales</li>
                  <li>• Toute autre activité constituant un crime ou délit</li>
                </ul>
              </div>
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <h5 className="text-orange-300 font-medium mb-3">⚠️ Comportements et abus prohibés</h5>
                <ul className="text-sm space-y-1">
                  <li>• Usurpation d'identité ou utilisation d'identités fictives</li>
                  <li>• Fourniture délibérée d'informations fausses ou trompeuses</li>
                  <li>• Tentatives de contournement des mesures de sécurité</li>
                  <li>• Exploitation de vulnérabilités techniques ou bugs</li>
                  <li>• Violation de droits de propriété intellectuelle</li>
                  <li>• Harcèlement, menaces ou intimidation d'employés</li>
                  <li>• Création de comptes multiples pour une même personne</li>
                  <li>• Utilisation de VPN/proxys pour masquer votre localisation</li>
                  <li>• Organisation de transactions fractionnées pour éviter les limites</li>
                  <li>• Revente ou partage commercial de nos services</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h5 className="text-red-200 font-medium mb-2">🚨 Sanctions en cas de violations</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-red-500/10 p-3 rounded">
                  <h6 className="text-red-200 font-medium text-sm">Mesures immédiates</h6>
                  <ul className="text-red-100 text-xs mt-1 space-y-1">
                    <li>• Suspension temporaire du compte</li>
                    <li>• Gel des fonds pendant l'enquête</li>
                    <li>• Annulation des transactions en cours</li>
                    <li>• Blocage des adresses crypto associées</li>
                  </ul>
                </div>
                <div className="bg-red-500/20 p-3 rounded">
                  <h6 className="text-red-200 font-medium text-sm">Sanctions sévères</h6>
                  <ul className="text-red-100 text-xs mt-1 space-y-1">
                    <li>• Résiliation définitive du compte</li>
                    <li>• Confiscation des fonds illicites</li>
                    <li>• Interdiction permanente d'utilisation</li>
                    <li>• Facturation des coûts d'investigation</li>
                  </ul>
                </div>
                <div className="bg-red-500/30 p-3 rounded">
                  <h6 className="text-red-200 font-medium text-sm">Conséquences légales</h6>
                  <ul className="text-red-100 text-xs mt-1 space-y-1">
                    <li>• Signalement aux autorités compétentes</li>
                    <li>• Transmission des preuves et logs</li>
                    <li>• Coopération avec enquêtes officielles</li>
                    <li>• Poursuites judiciaires civiles/pénales</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              Confidentialité et protection des données
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-blue-400 font-medium mb-3">🔒 Informations collectées</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-white font-medium">Informations personnelles:</span> nom, adresse email, numéro de téléphone, photo d'identité</li>
                  <li>• <span className="text-white font-medium">Données transactionnelles:</span> historique des transactions, adresses blockchain, montants</li>
                  <li>• <span className="text-white font-medium">Données techniques:</span> adresse IP, appareil, navigateur, logs de connexion</li>
                  <li>• <span className="text-white font-medium">Informations KYC:</span> documents d'identité, justificatifs de domicile</li>
                  <li>• <span className="text-white font-medium">Données de communication:</span> messages avec le support, enquêtes de satisfaction</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-green-400 font-medium mb-3">🛡️ Protection et sécurité</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-white font-medium">Chiffrement:</span> Encryption AES-256 pour toutes les données stockées</li>
                  <li>• <span className="text-white font-medium">Communication:</span> Protocole SSL/TLS pour transmissions</li>
                  <li>• <span className="text-white font-medium">Segmentation:</span> Données sensibles stockées séparément</li>
                  <li>• <span className="text-white font-medium">Accès limité:</span> Authentification multi-facteurs pour le personnel</li>
                  <li>• <span className="text-white font-medium">Audits:</span> Contrôles réguliers et tests de pénétration</li>
                </ul>
              </div>
            </div>

            <div className="bg-terex-gray p-4 rounded-lg">
              <h5 className="text-terex-accent font-medium mb-3">📊 Utilisation des données</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-white font-medium text-sm">Utilisations autorisées</h6>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Traitement des transactions demandées</li>
                    <li>• Vérification d'identité (KYC/AML)</li>
                    <li>• Service client et assistance technique</li>
                    <li>• Amélioration des services et de l'expérience</li>
                    <li>• Communications importantes liées au service</li>
                    <li>• Détection et prévention des fraudes</li>
                    <li>• Obligations légales et réglementaires</li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-white font-medium text-sm">Engagements stricts</h6>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Jamais de vente de données personnelles à des tiers</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Aucun partage avec des partenaires marketing</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Conservation uniquement pour la durée nécessaire</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Droit d'accès et de rectification à tout moment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-blue-200 font-medium">Politique de confidentialité détaillée</h5>
                  <p className="text-blue-100 text-sm mt-1">
                    Notre Politique de Confidentialité complète détaille exhaustivement comment nous collectons, 
                    utilisons, stockons et protégeons vos données personnelles. Ce document peut être consulté 
                    à tout moment sur notre site. Toute modification importante de cette politique vous sera 
                    notifiée 30 jours avant son entrée en vigueur.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Limitations de responsabilité et risques
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-terex-gray p-4 rounded-lg">
              <h5 className="text-terex-accent font-medium mb-3">⚠️ Risques inhérents aux cryptomonnaies</h5>
              <p className="text-sm mb-3">
                L'utilisation de cryptomonnaies comporte des risques inhérents que vous reconnaissez et acceptez pleinement:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-yellow-400 font-medium text-sm">Volatilité du marché</h6>
                  <p className="text-xs mt-1">
                    Les cryptomonnaies, y compris l'USDT, peuvent subir des fluctuations rapides et significatives de valeur. 
                    Bien que l'USDT soit conçu pour maintenir une parité avec le dollar américain, des écarts temporaires peuvent 
                    survenir. Terex ne peut garantir la stabilité absolue de la valeur des cryptomonnaies.
                  </p>
                </div>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-orange-400 font-medium text-sm">Risques technologiques</h6>
                  <p className="text-xs mt-1">
                    Les blockchains peuvent connaître des retards, congestions ou défaillances techniques. 
                    Des erreurs dans les adresses wallet peuvent entraîner des pertes irréversibles. 
                    Les smart contracts peuvent contenir des vulnérabilités. Terex ne contrôle pas les 
                    infrastructure blockchain sous-jacentes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-terex-gray p-4 rounded-lg">
              <h5 className="text-terex-accent font-medium mb-3">🛑 Limitations de responsabilité</h5>
              <p className="text-sm mb-3">
                Dans toute la mesure permise par la loi applicable, Terex décline expressément toute responsabilité pour:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-red-400 font-medium text-sm">Pertes financières</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Fluctuations des prix du marché</li>
                    <li>• Dévaluation des cryptomonnaies</li>
                    <li>• Opportunités d'investissement manquées</li>
                    <li>• Décisions d'investissement de l'utilisateur</li>
                  </ul>
                </div>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-red-400 font-medium text-sm">Erreurs extérieures</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Erreurs d'adresses fournies par l'utilisateur</li>
                    <li>• Défaillances des réseaux blockchain</li>
                    <li>• Problèmes liés aux fournisseurs tiers</li>
                    <li>• Attaques contre les blockchains</li>
                  </ul>
                </div>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-red-400 font-medium text-sm">Autres limitations</h6>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Pertes résultant de force majeure</li>
                    <li>• Interruptions temporaires du service</li>
                    <li>• Dommages indirects ou consécutifs</li>
                    <li>• Perte de données ou de réputation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-red-200 font-medium">Limitation du montant de responsabilité</h5>
                  <p className="text-red-100 text-sm mt-1">
                    Dans tous les cas où notre responsabilité ne pourrait être totalement exclue, la responsabilité 
                    maximale agrégée de Terex envers un utilisateur particulier, quelle qu'en soit la cause et 
                    la forme de l'action, sera limitée au plus élevé entre (a) le montant des frais effectivement 
                    payés par l'utilisateur à Terex au cours des trois (3) mois précédant l'événement donnant lieu 
                    à la responsabilité ou (b) 100 CAD.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-terex-accent" />
              Propriété intellectuelle et licences
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">©️ Droits de Terex</h5>
                <p className="text-sm mb-3">
                  Tous les droits de propriété intellectuelle relatifs à la plateforme Terex sont 
                  et demeurent la propriété exclusive de Terex ou de ses concédants de licence:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Marques déposées et logos</li>
                  <li>• Interface utilisateur et design</li>
                  <li>• Code source et logiciels</li>
                  <li>• Contenu textuel et graphique</li>
                  <li>• Algorithmes et processus techniques</li>
                  <li>• Documentation et guides d'utilisation</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🔓 Licence limitée d'utilisation</h5>
                <p className="text-sm mb-3">
                  Terex vous accorde une licence limitée, non exclusive, non transférable et révocable pour:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Accéder à la plateforme pour votre usage personnel uniquement</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Utiliser les services conformément à nos conditions</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Interdiction de copier, modifier ou dériver des œuvres</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Interdiction de désassembler ou faire de l'ingénierie inverse</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scale className="w-5 h-5 mr-2 text-terex-accent" />
              Résolution des litiges et droit applicable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">⚖️ Procédure de résolution des litiges</h5>
                <ol className="text-sm space-y-3">
                  <li>
                    <span className="text-white font-medium">1. Résolution amiable</span>
                    <p className="text-xs mt-1">
                      Tout différend doit d'abord faire l'objet d'une tentative de résolution amiable.
                      Contactez notre service client avec tous les détails pertinents.
                      Délai de traitement: 15 jours ouvrables maximum.
                    </p>
                  </li>
                  <li>
                    <span className="text-white font-medium">2. Médiation</span>
                    <p className="text-xs mt-1">
                      Si la résolution amiable échoue, les parties peuvent recourir à un médiateur indépendant 
                      mutuellement accepté. Les frais de médiation seront partagés équitablement.
                    </p>
                  </li>
                  <li>
                    <span className="text-white font-medium">3. Arbitrage contraignant</span>
                    <p className="text-xs mt-1">
                      En dernier recours, tout litige sera résolu par arbitrage contraignant conformément aux 
                      règles du Centre canadien d'arbitrage commercial (CCAC). La sentence arbitrale sera définitive.
                    </p>
                  </li>
                </ol>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🏛️ Juridiction et droit applicable</h5>
                <p className="text-sm mb-3">
                  Les présentes conditions sont régies par les lois de la province du Québec et les lois fédérales 
                  du Canada applicables, sans égard aux principes de conflits de lois.
                </p>
                <div className="space-y-3">
                  <div className="bg-terex-darker p-3 rounded">
                    <h6 className="text-white font-medium text-sm">Juridiction exclusive</h6>
                    <p className="text-xs mt-1">
                      Vous acceptez la compétence exclusive des tribunaux de la province du Québec, district de 
                      Québec, pour tout litige qui ne pourrait être résolu par les étapes précédentes.
                    </p>
                  </div>
                  <div className="bg-terex-darker p-3 rounded">
                    <h6 className="text-white font-medium text-sm">Exception pour consommateurs</h6>
                    <p className="text-xs mt-1">
                      Si vous êtes considéré comme un consommateur selon la loi applicable, vous bénéficiez 
                      de toutes les protections obligatoires prévues par la loi de votre pays de résidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-blue-200 font-medium">Renonciation au recours collectif</h5>
                  <p className="text-blue-100 text-sm mt-1">
                    Dans toute la mesure permise par la loi applicable, vous renoncez expressément à tout droit 
                    de participer à une action collective ou à un arbitrage collectif contre Terex. Tout litige 
                    doit être traité sur une base individuelle. Cette disposition est essentielle à notre offre 
                    de services et ne peut être dissociée des autres termes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Dispositions générales et modifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">📝 Intégralité de l'accord</h5>
                <p className="text-sm mb-3">
                  Ces conditions générales constituent l'intégralité de l'accord entre vous et Terex concernant 
                  l'utilisation de nos services et remplacent tous accords antérieurs sur ce sujet.
                </p>
                <div className="bg-terex-darker p-3 rounded">
                  <h6 className="text-white font-medium text-sm">Hiérarchie des documents</h6>
                  <p className="text-xs mt-1">
                    En cas de conflit entre ces CGU et d'autres documents spécifiques (politique de confidentialité, 
                    termes spécifiques à certains services), les dispositions les plus spécifiques prévalent sur 
                    les dispositions générales.
                  </p>
                </div>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🔄 Modifications des conditions</h5>
                <p className="text-sm mb-3">
                  Terex se réserve le droit de modifier ces conditions à sa seule discrétion. Les modifications 
                  importantes suivront ce processus:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Notification par email 30 jours avant entrée en vigueur</li>
                  <li>• Publication des nouvelles conditions sur notre site</li>
                  <li>• Mise en évidence des changements significatifs</li>
                  <li>• Option de refus impliquant la cessation du service</li>
                </ul>
                <p className="text-sm mt-2">
                  L'utilisation continue des services après la date d'entrée en vigueur constitue 
                  l'acceptation des nouvelles conditions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🔍 Divisibilité</h5>
                <p className="text-sm">
                  Si une disposition de ces conditions est jugée invalide ou inapplicable par un tribunal compétent, 
                  cette disposition sera modifiée pour être applicable dans toute la mesure permise par la loi, 
                  et les dispositions restantes demeureront pleinement en vigueur.
                </p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🤝 Non-renonciation</h5>
                <p className="text-sm">
                  Le fait pour Terex de ne pas exercer un droit ou une disposition des présentes conditions ne constitue 
                  pas une renonciation à ce droit. Aucune renonciation à une disposition ne sera valide à moins 
                  d'être écrite et signée par Terex.
                </p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">📨 Notifications</h5>
                <p className="text-sm">
                  Toutes les notifications destinées à Terex doivent être envoyées à l'adresse email Terangaexchange@gmail.com. 
                  Les notifications que nous vous adressons seront considérées comme reçues et valides immédiatement après leur 
                  envoi à l'email associé à votre compte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Gavel className="w-6 h-6 text-terex-accent mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-white font-medium text-lg">Contact juridique</p>
                <p className="text-gray-300">
                  Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à:
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-300"><span className="text-terex-accent">📧 Email:</span> Terangaexchange@gmail.com</p>
                  <p className="text-gray-300"><span className="text-terex-accent">📞 Téléphone:</span> +1 (418) 261-9091</p>
                  <p className="text-gray-300"><span className="text-terex-accent">📝 Version:</span> 3.0 - Dernière mise à jour: Décembre 2024</p>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  © 2024 Terex Exchange Inc. Tous droits réservés.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
