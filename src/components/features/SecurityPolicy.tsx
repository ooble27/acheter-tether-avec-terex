
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Zap, Users, Globe, FileText, Key, Camera, Monitor } from 'lucide-react';

interface SecurityPolicyProps {
  onBack: () => void;
}

export function SecurityPolicy({ onBack }: SecurityPolicyProps) {
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
          <h1 className="text-3xl font-light text-white mb-2">Politique de sécurité complète Terex</h1>
          <p className="text-gray-400">
            Découvrez en détail comment nous protégeons vos fonds, vos données et votre vie privée
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              Notre engagement sécurité de niveau bancaire
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Chez Terex, la sécurité de vos fonds et de vos données personnelles est notre priorité absolue et notre responsabilité première. 
              Nous mettons en place les meilleures pratiques de l'industrie financière internationale pour vous offrir une expérience 
              sécurisée, fiable et conforme aux standards les plus élevés.
            </p>
            <p>
              Cette politique détaille exhaustivement les mesures techniques, organisationnelles et humaines que nous déployons 
              pour protéger votre compte, sécuriser vos transactions et préserver la confidentialité de vos informations personnelles. 
              Nous nous engageons à la transparence totale concernant nos pratiques de sécurité.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-terex-darker p-4 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium">🛡️ Conformité Réglementaire</h4>
                <p className="text-sm mt-2">Standards KYC/AML internationaux respectés</p>
              </div>
              <div className="bg-terex-darker p-4 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium">🔒 Chiffrement Militaire</h4>
                <p className="text-sm mt-2">AES-256 et protocoles bancaires certifiés</p>
              </div>
              <div className="bg-terex-darker p-4 rounded-lg border border-purple-500/20">
                <h4 className="text-purple-400 font-medium">👥 Équipe Dédiée</h4>
                <p className="text-sm mt-2">Spécialistes sécurité 24/7 en surveillance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-terex-accent" />
              Chiffrement et cryptographie avancée
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Architecture de sécurité multicouche:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Chiffrement SSL/TLS 1.3</h5>
                  <p className="text-sm mb-2">Toutes les communications sont protégées par le protocole TLS 1.3 avec chiffrement AES-256</p>
                  <div className="bg-terex-gray p-3 rounded border-l-4 border-green-500">
                    <ul className="text-xs space-y-1">
                      <li>• Perfect Forward Secrecy (PFS) activé</li>
                      <li>• Certificats EV (Extended Validation) pour l'authentification</li>
                      <li>• HSTS (HTTP Strict Transport Security) forcé</li>
                      <li>• Pinning de certificats pour prévenir les attaques MITM</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Chiffrement des données sensibles</h5>
                  <p className="text-sm mb-2">Vos informations personnelles et financières sont chiffrées avec les standards les plus avancés</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium text-sm">🗃️ Base de données</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• AES-256 au repos</li>
                        <li>• Clés de chiffrement rotatives</li>
                        <li>• Séparation des données critiques</li>
                        <li>• Hachage irréversible des mots de passe</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium text-sm">🔐 Stockage sécurisé</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• HSM (Hardware Security Modules)</li>
                        <li>• Multi-signature pour les fonds</li>
                        <li>• Cold storage pour 95% des crypto</li>
                        <li>• Sauvegardes chiffrées géodistribuées</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Protection contre les cyberattaques</h5>
                  <p className="text-sm mb-2">Systèmes de détection et prévention des menaces en temps réel</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-red-400 font-medium text-sm">🛡️ Anti-DDoS</h6>
                      <p className="text-xs">Protection contre les attaques par déni de service distribuées</p>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-orange-400 font-medium text-sm">🚫 Anti-Phishing</h6>
                      <p className="text-xs">Détection des tentatives d'hameçonnage et sites frauduleux</p>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-purple-400 font-medium text-sm">🔍 WAF</h6>
                      <p className="text-xs">Firewall applicatif filtrant les requêtes malveillantes</p>
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
              <Server className="w-5 h-5 mr-2 text-terex-accent" />
              Infrastructure sécurisée et redondante
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Architecture de l'infrastructure:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Centres de données certifiés</h5>
                  <p className="text-sm mb-2">Hébergement dans des centres de données de niveau Tier 3+ avec certifications internationales</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-blue-400 font-medium text-sm">🏢 Certifications</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• ISO 27001 (Sécurité de l'information)</li>
                        <li>• SOC 2 Type II (Contrôles organisationnels)</li>
                        <li>• PCI DSS Level 1 (Données de cartes)</li>
                        <li>• Conformité RGPD/CCPA</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-green-400 font-medium text-sm">🔒 Sécurité physique</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Accès biométrique multicouche</li>
                        <li>• Surveillance vidéo 24/7/365</li>
                        <li>• Détecteurs de mouvement et d'intrusion</li>
                        <li>• Cages de sécurité individuelles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Séparation et isolation des fonds</h5>
                  <p className="text-sm mb-2">Gestion stricte et séparée des fonds clients conformément aux réglementations financières</p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                    <h6 className="text-yellow-200 font-medium mb-2">🏦 Modèle de custodie bancaire</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">Fonds clients (95%)</p>
                        <ul className="text-yellow-100 text-xs mt-1 space-y-1">
                          <li>• Stockage à froid (cold storage)</li>
                          <li>• Comptes bancaires séparés</li>
                          <li>• Multi-signature obligatoire</li>
                          <li>• Audit quotidien des soldes</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">Fonds opérationnels (5%)</p>
                        <ul className="text-yellow-100 text-xs mt-1 space-y-1">
                          <li>• Hot wallets pour liquidité</li>
                          <li>• Limites automatiques strictes</li>
                          <li>• Surveillance temps réel</li>
                          <li>• Transferts automatisés sécurisés</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Redondance et continuité de service</h5>
                  <p className="text-sm mb-2">Architecture hautement disponible avec basculement automatique</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium text-sm">⚡ Disponibilité</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• SLA 99.9% de disponibilité</li>
                        <li>• Serveurs redondants</li>
                        <li>• Load balancing intelligent</li>
                        <li>• Failover automatique</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium text-sm">💾 Sauvegardes</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Sauvegardes toutes les 6 heures</li>
                        <li>• Réplication géographique</li>
                        <li>• Rétention 7 ans minimum</li>
                        <li>• Tests de restauration mensuels</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-terex-accent font-medium text-sm">🌍 Géolocalisation</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Serveurs multi-continents</li>
                        <li>• CDN global pour performance</li>
                        <li>• Réplication en temps réel</li>
                        <li>• Plan de reprise d'activité</li>
                      </ul>
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
              Surveillance et détection des fraudes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Systèmes de monitoring avancés:</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Intelligence artificielle anti-fraude</h5>
                  <p className="text-sm mb-2">Algorithmes d'apprentissage automatique pour détecter les comportements suspects en temps réel</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-purple-400 font-medium text-sm">🤖 Machine Learning</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Analyse comportementale des utilisateurs</li>
                        <li>• Détection d'anomalies transactionnelles</li>
                        <li>• Reconnaissance de patterns frauduleux</li>
                        <li>• Scoring de risque automatique</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-orange-400 font-medium text-sm">📊 Analyses prédictives</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Modèles prédictifs de fraude</li>
                        <li>• Alertes proactives</li>
                        <li>• Évaluation des risques géographiques</li>
                        <li>• Corrélation multi-sources</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Conformité KYC/AML renforcée</h5>
                  <p className="text-sm mb-2">Procédures de vérification d'identité conformes aux standards internationaux FATF et directives européennes</p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                    <h6 className="text-blue-200 font-medium mb-2">🔍 Processus de vérification multicouche</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Niveau 1 - Basique</p>
                        <ul className="text-blue-100 text-xs mt-1 space-y-1">
                          <li>• Vérification email/téléphone</li>
                          <li>• Informations personnelles</li>
                          <li>• Limite: 1,000 CAD/mois</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Niveau 2 - Intermédiaire</p>
                        <ul className="text-blue-100 text-xs mt-1 space-y-1">
                          <li>• Document d'identité officiel</li>
                          <li>• Reconnaissance faciale biométrique</li>
                          <li>• Limite: 10,000 CAD/mois</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Niveau 3 - Avancé</p>
                        <ul className="text-blue-100 text-xs mt-1 space-y-1">
                          <li>• Justificatif de domicile</li>
                          <li>• Source de revenus</li>
                          <li>• Limite: 50,000+ CAD/mois</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium">Traçabilité et audit complètement</h5>
                  <p className="text-sm mb-2">Enregistrement détaillé et horodaté de toutes les activités pour la conformité réglementaire</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-green-400 font-medium text-sm">📋 Logs d'audit</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Toutes les actions utilisateur</li>
                        <li>• Modifications de données</li>
                        <li>• Accès et connexions</li>
                        <li>• Transactions blockchain</li>
                      </ul>
                    </div>
                    <div className="bg-terex-gray p-3 rounded">
                      <h6 className="text-blue-400 font-medium text-sm">🔒 Intégrité des données</h6>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Signatures cryptographiques</li>
                        <li>• Hash des enregistrements</li>
                        <li>• Timestamps irréfutables</li>
                        <li>• Chaîne de custody complète</li>
                      </ul>
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
              <Key className="w-5 h-5 mr-2 text-terex-accent" />
              Authentification et contrôle d'accès
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Sécurité des comptes utilisateurs:</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-terex-gray p-4 rounded-lg">
                  <h5 className="text-terex-accent font-medium mb-2">🔐 Authentification multi-facteurs (2FA)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Applications TOTP (Google Authenticator, Authy)</li>
                    <li>• SMS de vérification sécurisés</li>
                    <li>• Email de confirmation pour actions sensibles</li>
                    <li>• Questions de sécurité personnalisées</li>
                  </ul>
                </div>
                <div className="bg-terex-gray p-4 rounded-lg">
                  <h5 className="text-terex-accent font-medium mb-2">🛡️ Politique de mots de passe</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Minimum 8 caractères complexes</li>
                    <li>• Majuscules, minuscules, chiffres, symboles</li>
                    <li>• Vérification contre dictionnaires de mots de passe compromis</li>
                    <li>• Rotation recommandée tous les 90 jours</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h5 className="text-purple-200 font-medium mb-2">🧠 Biométrie et intelligence comportementale</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-purple-100 font-medium text-sm">👤 Reconnaissance biométrique</h6>
                    <ul className="text-purple-100 text-xs mt-1 space-y-1">
                      <li>• Reconnaissance faciale pour KYC</li>
                      <li>• Détection de documents falsifiés</li>
                      <li>• Correspondance photo-document</li>
                      <li>• Détection de deepfakes</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-purple-100 font-medium text-sm">🔍 Analyse comportementale</h6>
                    <ul className="text-purple-100 text-xs mt-1 space-y-1">
                      <li>• Patterns de navigation uniques</li>
                      <li>• Vitesse de frappe caractéristique</li>
                      <li>• Habitudes de connexion</li>
                      <li>• Géolocalisation et fuseaux horaires</li>
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
              <Monitor className="w-5 h-5 mr-2 text-terex-accent" />
              Surveillance 24/7 et équipe sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">👥 Security Operations Center (SOC)</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-green-400">🟢 Surveillance 24/7/365</span> - Équipe dédiée en permanence</li>
                  <li>• <span className="text-blue-400">🔵 Analystes experts</span> - Spécialistes cybersécurité certifiés</li>
                  <li>• <span className="text-purple-400">🟣 Temps de réponse</span> - Incidents traités sous 15 minutes</li>
                  <li>• <span className="text-orange-400">🟠 Escalade automatique</span> - Alertes critiques immédiates</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-terex-accent font-medium mb-3">🎯 Centre de réponse aux incidents (CSIRT)</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-red-400">🔴 Isolation automatique</span> - Comptes suspects gelés</li>
                  <li>• <span className="text-yellow-400">🟡 Investigation forensique</span> - Analyse approfondie des incidents</li>
                  <li>• <span className="text-green-400">🟢 Communication proactive</span> - Notification clients affectés</li>
                  <li>• <span className="text-blue-400">🔵 Amélioration continue</span> - Lessons learned intégrées</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
              <h5 className="text-red-200 font-medium mb-2">🚨 Plan de réponse aux incidents</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="bg-red-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-300 font-bold">1</span>
                  </div>
                  <p className="text-red-100 text-sm font-medium">Détection</p>
                  <p className="text-red-200 text-xs">{'< 60 secondes'}</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-300 font-bold">2</span>
                  </div>
                  <p className="text-orange-100 text-sm font-medium">Confinement</p>
                  <p className="text-orange-200 text-xs">{'< 5 minutes'}</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-300 font-bold">3</span>
                  </div>
                  <p className="text-yellow-100 text-sm font-medium">Éradication</p>
                  <p className="text-yellow-200 text-xs">{'< 30 minutes'}</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-300 font-bold">4</span>
                  </div>
                  <p className="text-green-100 text-sm font-medium">Récupération</p>
                  <p className="text-green-200 text-xs">{'< 2 heures'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-terex-accent" />
              Vos responsabilités et bonnes pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-white font-medium mb-3">La sécurité est une responsabilité partagée. Voici comment protéger votre compte:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="text-green-400 font-medium">✅ Bonnes pratiques recommandées</h5>
                <div className="space-y-2">
                  <p><span className="text-terex-accent">🔒 Mot de passe unique:</span> Utilisez un gestionnaire de mots de passe</p>
                  <p><span className="text-terex-accent">🔐 2FA activé:</span> Authentification à deux facteurs obligatoire</p>
                  <p><span className="text-terex-accent">✅ Vérification systématique:</span> Contrôlez toujours les adresses crypto</p>
                  <p><span className="text-terex-accent">🌐 Connexion sécurisée:</span> Toujours via https://terex.com officiel</p>
                  <p><span className="text-terex-accent">📱 Appareils sécurisés:</span> Antivirus à jour et systèmes patché</p>
                  <p><span className="text-terex-accent">🚨 Signalement immédiat:</span> Activité suspecte à signaler</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="text-red-400 font-medium">❌ Pratiques à éviter absolument</h5>
                <div className="space-y-2">
                  <p><span className="text-red-400">🚫 Partage d'identifiants:</span> Ne jamais divulguer vos codes</p>
                  <p><span className="text-red-400">📧 Emails frauduleux:</span> Terex ne demande jamais de mots de passe</p>
                  <p><span className="text-red-400">📞 Appels suspects:</span> Nous ne demandons pas d'infos par téléphone</p>
                  <p><span className="text-red-400">🔗 Liens douteux:</span> Tapez toujours l'URL manuellement</p>
                  <p><span className="text-red-400">💰 Offres miraculeuses:</span> Méfiez-vous des taux irréalistes</p>
                  <p><span className="text-red-400">📶 WiFi public:</span> Évitez pour les transactions importantes</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h5 className="text-orange-200 font-medium mb-2">🎯 Checklist de sécurité personnelle</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h6 className="text-orange-100 font-medium text-sm">Configuration du compte</h6>
                  <ul className="text-orange-100 text-xs mt-1 space-y-1">
                    <li>□ 2FA activé avec app authentificateur</li>
                    <li>□ Email de récupération configuré</li>
                    <li>□ Notifications activées pour connexions</li>
                    <li>□ Adresses de retrait pré-autorisées</li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-orange-100 font-medium text-sm">Maintenance régulière</h6>
                  <ul className="text-orange-100 text-xs mt-1 space-y-1">
                    <li>□ Vérification mensuelle des sessions actives</li>
                    <li>□ Revue des transactions récentes</li>
                    <li>□ Mise à jour des informations de contact</li>
                    <li>□ Test périodique de la récupération de compte</li>
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
              Procédures d'urgence et signalement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h5 className="text-red-200 font-medium mb-3">🚨 En cas d'incident de sécurité</h5>
              <p className="text-red-100 mb-3">
                Si vous soupçonnez une compromission de votre compte ou détectez une activité frauduleuse, 
                suivez immédiatement cette procédure d'urgence:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-red-200 font-medium mb-2">🔒 Actions immédiates (première minute)</h6>
                  <ol className="text-red-100 text-sm space-y-1">
                    <li>1. Changez immédiatement votre mot de passe</li>
                    <li>2. Déconnectez toutes les sessions actives</li>
                    <li>3. Vérifiez votre historique de transactions</li>
                    <li>4. Notez l'heure et la nature du problème</li>
                  </ol>
                </div>
                <div>
                  <h6 className="text-red-200 font-medium mb-2">📞 Contact d'urgence (dans les 5 minutes)</h6>
                  <div className="space-y-2">
                    <p className="text-red-100 text-sm"><span className="font-medium">Email prioritaire:</span> terangaexchange@gmail.com</p>
                    <p className="text-red-100 text-sm"><span className="font-medium">Support 24/7:</span> terangaexchange@gmail.com</p>
                    <p className="text-red-100 text-sm"><span className="font-medium">WhatsApp urgence:</span> +1 4182619091</p>
                    <p className="text-red-100 text-sm"><span className="font-medium">Temps de réponse:</span> {'< 15 minutes garanti'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h6 className="text-terex-accent font-medium mb-2">🛡️ Protection immédiate</h6>
                <ul className="text-sm space-y-1">
                  <li>• Gel temporaire du compte</li>
                  <li>• Blocage des retraits suspects</li>
                  <li>• Investigation forensique</li>
                  <li>• Rapport d'incident détaillé</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h6 className="text-terex-accent font-medium mb-2">🔍 Investigation</h6>
                <ul className="text-sm space-y-1">
                  <li>• Analyse des logs d'accès</li>
                  <li>• Traçage des transactions</li>
                  <li>• Corrélation avec autres incidents</li>
                  <li>• Collaboration avec autorités si nécessaire</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h6 className="text-terex-accent font-medium mb-2">🔄 Récupération</h6>
                <ul className="text-sm space-y-1">
                  <li>• Restauration sécurisée du compte</li>
                  <li>• Récupération des fonds si possible</li>
                  <li>• Renforcement des mesures de sécurité</li>
                  <li>• Suivi post-incident</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Conformité réglementaire et certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-blue-400 font-medium mb-3">🏛️ Réglementations respectées</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-terex-accent">BCEAO:</span> Conformité réglementaire</li>
                  <li>• <span className="text-terex-accent">RGPD (Europe):</span> Protection des données</li>
                  <li>• <span className="text-terex-accent">FATF/GAFI:</span> Standards anti-blanchiment</li>
                  <li>• <span className="text-terex-accent">CCPA (Californie):</span> Confidentialité des consommateurs</li>
                </ul>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h5 className="text-green-400 font-medium mb-3">🏆 Certifications obtenues</h5>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-terex-accent">ISO 27001:</span> Management de la sécurité</li>
                  <li>• <span className="text-terex-accent">SOC 2 Type II:</span> Contrôles organisationnels</li>
                  <li>• <span className="text-terex-accent">PCI DSS:</span> Sécurité des données de cartes</li>
                  <li>• <span className="text-terex-accent">Penetration Testing:</span> Tests mensuels</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h5 className="text-purple-200 font-medium mb-2">🔍 Audits et transparence</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <h6 className="text-purple-100 font-medium text-sm">Audits externes</h6>
                  <ul className="text-purple-100 text-xs mt-1 space-y-1">
                    <li>• Audits annuels par tiers indépendants</li>
                    <li>• Certification par organismes reconnus</li>
                    <li>• Publication des rapports de conformité</li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-purple-100 font-medium text-sm">Tests de pénétration</h6>
                  <ul className="text-purple-100 text-xs mt-1 space-y-1">
                    <li>• Tests mensuels par experts en cybersécurité</li>
                    <li>• Simulation d'attaques réelles</li>
                    <li>• Correction immédiate des vulnérabilités</li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-purple-100 font-medium text-sm">Transparence</h6>
                  <ul className="text-purple-100 text-xs mt-1 space-y-1">
                    <li>• Rapport de sécurité trimestriel</li>
                    <li>• Notification des incidents majeurs</li>
                    <li>• Bug bounty program actif</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-terex-accent mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <p className="text-white font-medium text-lg">Engagement de transparence et amélioration continue</p>
                <p className="text-gray-300">
                  Cette politique de sécurité est un document vivant, régulièrement mis à jour pour refléter 
                  les dernières menaces et les meilleures pratiques de l'industrie. Nous nous engageons à 
                  maintenir les plus hauts standards de sécurité et à communiquer de manière transparente 
                  sur nos pratiques et procédures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="text-sm">
                    <p className="text-terex-accent font-medium">📧 Contact sécurité:</p>
                    <p className="text-gray-300">terangaexchange@gmail.com</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-terex-accent font-medium">📋 Dernière mise à jour:</p>
                    <p className="text-gray-300">Décembre 2024 - Version 3.2</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
