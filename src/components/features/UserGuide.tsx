
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CreditCard, Send, Smartphone, Shield, Clock, CheckCircle, AlertTriangle, Users, Globe, Zap, Camera, Eye, Download } from 'lucide-react';

interface UserGuideProps {
  onBack: () => void;
}

export function UserGuide({ onBack }: UserGuideProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Guide d'utilisation complet Terex</h1>
          <p className="text-gray-400">
            Maîtrisez toutes les fonctionnalités de Terex étape par étape
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-terex-accent" />
              Bienvenue sur Terex - Votre passerelle crypto
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Terex révolutionne l'accès aux cryptomonnaies en Afrique. Notre plateforme intuitive 
              vous permet d'acheter, vendre des USDT et d'effectuer des virements internationaux 
              en quelques clics seulement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-darker p-4 rounded-lg">
                <h4 className="text-terex-accent font-medium mb-2">🚀 Rapidité</h4>
                <p className="text-sm">Transactions traitées en moins de 15 minutes</p>
              </div>
              <div className="bg-terex-darker p-4 rounded-lg">
                <h4 className="text-terex-accent font-medium mb-2">🔒 Sécurité</h4>
                <p className="text-sm">Chiffrement bancaire et fonds sécurisés</p>
              </div>
              <div className="bg-terex-darker p-4 rounded-lg">
                <h4 className="text-terex-accent font-medium mb-2">💰 Transparence</h4>
                <p className="text-sm">Aucun frais caché, taux équitables</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 1: Création de compte et vérification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Inscription sur Terex:</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="text-white font-medium">Accédez à la page d'inscription</h5>
                  <p className="text-sm">Cliquez sur "S'inscrire" depuis la page d'accueil</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="text-white font-medium">Remplissez vos informations</h5>
                  <p className="text-sm">Email valide, mot de passe sécurisé (8+ caractères, majuscules, chiffres)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="text-white font-medium">Vérifiez votre email</h5>
                  <p className="text-sm">Cliquez sur le lien de confirmation envoyé dans votre boîte mail</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h5 className="text-white font-medium">Première connexion</h5>
                  <p className="text-sm">Connectez-vous avec vos identifiants pour accéder au tableau de bord</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-blue-200 font-medium">Vérification KYC (Know Your Customer)</h5>
                  <p className="text-blue-100 text-sm mt-2">
                    Pour des transactions de montants élevés, une vérification d'identité sera requise:
                  </p>
                  <ul className="text-blue-100 text-sm mt-2 space-y-1">
                    <li>• Pièce d'identité valide (CNI, passeport, permis de conduire)</li>
                    <li>• Selfie avec votre pièce d'identité</li>
                    <li>• Justificatif de domicile récent (facture, relevé bancaire)</li>
                    <li>• Délai de validation: 24-48 heures ouvrées</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 2: Acheter des USDT - Guide détaillé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-green-200 font-medium mb-2">💡 Qu'est-ce que l'USDT?</h4>
              <p className="text-green-100 text-sm">
                L'USDT (Tether) est une cryptomonnaie stable indexée sur le dollar américain (1 USDT = 1 USD). 
                Elle permet de stocker de la valeur sans la volatilité des autres cryptomonnaies.
              </p>
            </div>

            <h4 className="text-white font-medium">Processus d'achat étape par étape:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Accédez à la section "Acheter USDT"</h5>
                  <p className="text-sm mb-2">Dans le menu latéral, cliquez sur "Acheter USDT"</p>
                  <div className="bg-terex-gray p-3 rounded border-l-4 border-terex-accent">
                    <p className="text-xs text-gray-400">💡 Astuce: Vous pouvez aussi utiliser le raccourci depuis le tableau de bord</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Sélectionnez votre devise locale</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium">🌍 CFA (Afrique de l'Ouest)</h6>
                      <p className="text-xs">Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger</p>
                      <p className="text-xs text-terex-accent">Minimum: 10,000 CFA</p>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium">🍁 CAD (Canada)</h6>
                      <p className="text-xs">Dollar canadien</p>
                      <p className="text-xs text-terex-accent">Minimum: 15 CAD</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Entrez le montant à convertir</h5>
                  <p className="text-sm mb-2">Le calculateur affiche automatiquement le montant d'USDT que vous recevrez</p>
                  <div className="bg-terex-gray p-3 rounded">
                    <p className="text-xs">Exemple: 50,000 CFA ≈ 76.92 USDT (taux en temps réel)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Choisissez le réseau blockchain</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-red-400 font-medium">TRC20 (Tron)</h6>
                      <p className="text-xs">• Frais très bas (~1 TRX)</p>
                      <p className="text-xs">• Rapide (1-3 minutes)</p>
                      <p className="text-xs text-green-400">⭐ Recommandé</p>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-yellow-400 font-medium">BEP20 (BSC)</h6>
                      <p className="text-xs">• Frais modérés (~0.001 BNB)</p>
                      <p className="text-xs">• Rapide (1-5 minutes)</p>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-blue-400 font-medium">ERC20 (Ethereum)</h6>
                      <p className="text-xs">• Frais élevés (variable)</p>
                      <p className="text-xs">• Plus lent (5-15 minutes)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Saisissez votre adresse de portefeuille USDT</h5>
                  <div className="space-y-2">
                    <p className="text-sm">Copiez l'adresse de réception depuis votre portefeuille (MetaMask, Trust Wallet, Binance, etc.)</p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-red-200 text-sm font-medium">⚠️ ATTENTION CRITIQUE</p>
                          <ul className="text-red-100 text-xs mt-1 space-y-1">
                            <li>• Vérifiez 3 fois l'adresse avant de confirmer</li>
                            <li>• L'adresse doit correspondre au réseau choisi</li>
                            <li>• Une erreur = perte définitive des fonds</li>
                            <li>• Testez avec un petit montant d'abord</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Confirmez et procédez au paiement</h5>
                  <p className="text-sm mb-2">Vérifiez tous les détails dans le résumé de commande</p>
                  <div className="space-y-2">
                    <h6 className="text-terex-accent font-medium">Méthodes de paiement disponibles:</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-orange-400 font-medium">Orange Money</h6>
                        <p className="text-xs">Sénégal, Mali, Côte d'Ivoire</p>
                        <p className="text-xs">Code: #144*4*montant*code_marchand#</p>
                      </div>
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-blue-400 font-medium">Wave</h6>
                        <p className="text-xs">Sénégal, Côte d'Ivoire</p>
                        <p className="text-xs">Scan QR code ou envoi direct</p>
                      </div>
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-green-400 font-medium">Virement Interac (Canada)</h6>
                        <p className="text-xs">Email de transfert fourni</p>
                        <p className="text-xs">Question/Réponse sécurisée</p>
                      </div>
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-purple-400 font-medium">Crypto (BTC/ETH)</h6>
                        <p className="text-xs">Pour les utilisateurs avancés</p>
                        <p className="text-xs">Conversion automatique</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Réception des USDT</h5>
                  <p className="text-sm">Une fois le paiement confirmé (5-15 minutes maximum), vos USDT sont envoyés automatiquement</p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mt-2">
                    <p className="text-green-200 text-sm">
                      💚 Vous recevrez un email de confirmation avec le hash de transaction pour suivre l'envoi sur la blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 3: Vendre des USDT - Convertir en monnaie locale
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-200 font-medium mb-2">💰 Pourquoi vendre ses USDT?</h4>
              <p className="text-blue-100 text-sm">
                Convertissez vos USDT en CFA ou CAD pour utiliser votre argent localement, 
                payer des factures ou effectuer des achats dans votre devise locale.
              </p>
            </div>

            <h4 className="text-white font-medium">Guide de vente détaillé:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Accédez à "Vendre USDT"</h5>
                  <p className="text-sm">Menu principal → Vendre USDT</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Entrez le montant d'USDT à vendre</h5>
                  <div className="space-y-2">
                    <p className="text-sm">Minimum: 10 USDT • Maximum: selon votre limite KYC</p>
                    <div className="bg-terex-gray p-3 rounded">
                      <p className="text-xs">Exemple: 100 USDT ≈ 65,000 CFA (taux en temps réel)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Sélectionnez le réseau d'envoi</h5>
                  <p className="text-sm mb-2">Choisissez le réseau où se trouvent vos USDT</p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                    <p className="text-yellow-200 text-sm">
                      ⚠️ Le réseau doit correspondre à celui de votre portefeuille source
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Choisissez votre méthode de réception</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-orange-400 font-medium">📱 Orange Money</h6>
                      <p className="text-xs mb-2">Réception instantanée</p>
                      <ul className="text-xs space-y-1">
                        <li>• Numéro de téléphone</li>
                        <li>• Nom complet du titulaire</li>
                        <li>• Pays (Sénégal, Mali, CI...)</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-blue-400 font-medium">🌊 Wave</h6>
                      <p className="text-xs mb-2">Transfert rapide</p>
                      <ul className="text-xs space-y-1">
                        <li>• Numéro Wave</li>
                        <li>• Nom du bénéficiaire</li>
                        <li>• Pays de réception</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Confirmez et obtenez l'adresse de dépôt</h5>
                  <p className="text-sm mb-2">Terex génère une adresse unique pour votre transaction</p>
                  <div className="space-y-2">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium">📋 Informations fournies:</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Adresse de dépôt Terex</li>
                        <li>• QR code pour scan rapide</li>
                        <li>• Montant exact à envoyer</li>
                        <li>• ID de transaction unique</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Envoyez vos USDT</h5>
                  <p className="text-sm mb-2">Depuis votre portefeuille, envoyez le montant exact</p>
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-200 text-sm font-medium">Points critiques:</p>
                        <ul className="text-red-100 text-xs mt-1 space-y-1">
                          <li>• Envoyez exactement le montant demandé</li>
                          <li>• Utilisez le bon réseau</li>
                          <li>• Ne fermez pas la page pendant le processus</li>
                          <li>• Délai limite: 30 minutes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Réception de votre argent</h5>
                  <p className="text-sm">Une fois la blockchain confirmée (1-3 confirmations), votre argent est envoyé</p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mt-2">
                    <p className="text-green-200 text-sm">
                      ⚡ Délai moyen: 5-15 minutes après confirmation blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 4: Virements internationaux - Envoi d'argent rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="text-purple-200 font-medium mb-2">🌍 Service de virement international</h4>
              <p className="text-purple-100 text-sm">
                Envoyez de l'argent depuis le Canada vers l'Afrique de l'Ouest en quelques minutes, 
                bien plus rapide et moins cher que les banques traditionnelles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-2">💸 Pays de départ</h5>
                <p className="text-sm">🇨🇦 Canada (CAD)</p>
                <p className="text-xs text-gray-400">Minimum: 25 CAD</p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-2">🎯 Pays de destination</h5>
                <div className="space-y-1 text-sm">
                  <p>🇸🇳 Sénégal • 🇨🇮 Côte d'Ivoire</p>
                  <p>🇲🇱 Mali • 🇧🇫 Burkina Faso • 🇳🇪 Niger</p>
                </div>
              </div>
            </div>

            <h4 className="text-white font-medium">Processus de virement étape par étape:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Accédez au service de virement</h5>
                  <p className="text-sm">Menu → Virement International</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Sélectionnez les pays</h5>
                  <div className="space-y-2">
                    <p className="text-sm">Pays d'envoi: Canada • Pays de réception: Au choix</p>
                    <div className="bg-terex-gray p-3 rounded">
                      <p className="text-xs">Taux de change affiché en temps réel CAD → CFA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Entrez le montant à envoyer</h5>
                  <div className="space-y-2">
                    <p className="text-sm">Indiquez le montant en CAD ou le montant à recevoir en CFA</p>
                    <div className="bg-terex-gray p-3 rounded">
                      <p className="text-xs">Exemple: 100 CAD → 48,500 CFA (incluant nos frais)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Informations du bénéficiaire</h5>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-terex-accent font-medium text-sm">Informations requises:</h6>
                        <ul className="text-xs mt-1 space-y-1">
                          <li>• Nom complet du bénéficiaire</li>
                          <li>• Numéro de téléphone mobile</li>
                          <li>• Service (Orange Money/Wave)</li>
                          <li>• Pays de réception</li>
                        </ul>
                      </div>
                      <div className="bg-terex-gray p-3 rounded">
                        <h6 className="text-terex-accent font-medium text-sm">Vérifications:</h6>
                        <ul className="text-xs mt-1 space-y-1">
                          <li>• Nom exact sur le compte mobile</li>
                          <li>• Numéro actif et correct</li>
                          <li>• Compte mobile money existant</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Méthode de paiement (Canada)</h5>
                  <div className="bg-terex-gray p-3 rounded">
                    <h6 className="text-green-400 font-medium">💳 Virement Interac e-Transfer</h6>
                    <ul className="text-xs mt-2 space-y-1">
                      <li>• Email de transfert fourni par Terex</li>
                      <li>• Question de sécurité personnalisée</li>
                      <li>• Réponse fournie dans les instructions</li>
                      <li>• Confirmation automatique</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Transfert et réception</h5>
                  <div className="space-y-2">
                    <p className="text-sm">Une fois votre paiement reçu, le virement est traité immédiatement</p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-green-200 text-sm font-medium">⚡ Délais typiques:</p>
                          <ul className="text-green-100 text-xs mt-1 space-y-1">
                            <li>• Orange Money: 2-5 minutes</li>
                            <li>• Wave: 1-3 minutes</li>
                            <li>• Maximum: 15 minutes</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-green-200 text-sm font-medium">📱 Notifications:</p>
                          <ul className="text-green-100 text-xs mt-1 space-y-1">
                            <li>• SMS au bénéficiaire</li>
                            <li>• Email de confirmation</li>
                            <li>• Suivi en temps réel</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Eye className="w-5 h-5 mr-2 text-terex-accent" />
              Suivi des transactions et historique
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-2">📊 Tableau de bord</h5>
                <ul className="text-sm space-y-1">
                  <li>• Transactions récentes</li>
                  <li>• Statuts en temps réel</li>
                  <li>• Montants totaux</li>
                  <li>• Graphiques de l'activité</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-2">📜 Historique complet</h5>
                <ul className="text-sm space-y-1">
                  <li>• Toutes vos transactions</li>
                  <li>• Filtres par date/type</li>
                  <li>• Export PDF/Excel</li>
                  <li>• Recherche avancée</li>
                </ul>
              </div>
            </div>

            <h5 className="text-white font-medium">États des transactions:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
                <p className="text-yellow-400 font-medium text-sm">🟡 En attente</p>
                <p className="text-xs">Paiement en cours de traitement</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                <p className="text-blue-400 font-medium text-sm">🔵 En cours</p>
                <p className="text-xs">Transaction confirmée, envoi en cours</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded">
                <p className="text-green-400 font-medium text-sm">🟢 Complétée</p>
                <p className="text-xs">Transaction réussie</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                <p className="text-red-400 font-medium text-sm">🔴 Échouée</p>
                <p className="text-xs">Erreur, contactez le support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              Sécurité et bonnes pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="text-terex-accent font-medium">🔐 Sécurité du compte</h5>
                <ul className="text-sm space-y-1">
                  <li>• Mot de passe unique et complexe</li>
                  <li>• Activation de l'authentification 2FA</li>
                  <li>• Déconnexion sur appareils publics</li>
                  <li>• Vérification régulière des sessions</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="text-terex-accent font-medium">💰 Sécurité des fonds</h5>
                <ul className="text-sm space-y-1">
                  <li>• Vérification triple des adresses</li>
                  <li>• Tests avec petits montants</li>
                  <li>• Sauvegarde des informations importantes</li>
                  <li>• Contacts officiels uniquement</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h5 className="text-red-200 font-medium mb-2">🚨 Signaux d'alerte - Ne jamais:</h5>
              <ul className="text-red-100 text-sm space-y-1">
                <li>• Partager vos identifiants de connexion</li>
                <li>• Envoyer de l'argent à des inconnus</li>
                <li>• Cliquer sur des liens suspects par email</li>
                <li>• Faire confiance aux offres trop avantageuses</li>
                <li>• Utiliser des réseaux WiFi publics pour des transactions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-terex-accent" />
              Support client et assistance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg text-center">
                <h5 className="text-terex-accent font-medium mb-2">📧 Email</h5>
                <p className="text-sm">Terangaexchange@gmail.com</p>
                <p className="text-xs text-gray-400">Réponse sous 30 minutes</p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg text-center">
                <h5 className="text-terex-accent font-medium mb-2">📞 Téléphone</h5>
                <p className="text-sm">+1 (418) 261-9091</p>
                <p className="text-xs text-gray-400">Disponible 24/7</p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg text-center">
                <h5 className="text-terex-accent font-medium mb-2">💬 Chat</h5>
                <p className="text-sm">Chat en direct</p>
                <p className="text-xs text-gray-400">Support instantané</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h5 className="text-blue-200 font-medium mb-2">💡 Conseils pour un support efficace</h5>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• Gardez votre ID de transaction à portée de main</li>
                <li>• Décrivez le problème de manière détaillée</li>
                <li>• Joignez des captures d'écran si nécessaire</li>
                <li>• Indiquez l'heure et la date du problème</li>
                <li>• Restez courtois, notre équipe est là pour vous aider</li>
              </ul>
            </div>

            <div className="text-center bg-gradient-to-r from-terex-accent/10 to-blue-500/10 rounded-lg p-6">
              <h5 className="text-white font-medium mb-2">🎯 Notre engagement</h5>
              <p className="text-gray-300 text-sm">
                Résolution de 95% des problèmes en moins de 2 heures. 
                Votre satisfaction est notre priorité absolue.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
