
import React from 'react';
import { TrendingUp, Users, Globe, DollarSign, Shield, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PitchDeckViewer = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-8 bg-white text-black" id="pitch-deck-content">
      {/* Page de couverture */}
      <div className="text-center space-y-6 min-h-screen flex flex-col justify-center">
        <div className="text-6xl font-bold text-terex-accent">TEREX</div>
        <h1 className="text-4xl font-bold">La révolution des transferts d'argent en Afrique</h1>
        <p className="text-xl text-gray-600">Plateforme de transfert rapide et sécurisé avec USDT</p>
        <div className="text-lg text-gray-500">Pitch Deck - 2024</div>
      </div>

      {/* Problème & Solution */}
      <div className="min-h-screen flex flex-col justify-center space-y-8">
        <h2 className="text-3xl font-bold text-center mb-8">Problème & Solution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Le Problème</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>• Transferts internationaux coûteux (8-15% de frais)</p>
              <p>• Délais de traitement longs (3-7 jours)</p>
              <p>• Processus complexes et bureaucratiques</p>
              <p>• Accès limité aux services financiers</p>
              <p>• Volatilité des devises locales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Notre Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>• Frais réduits à moins de 2%</p>
              <p>• Transferts instantanés 24h/7j</p>
              <p>• Interface simple et intuitive</p>
              <p>• Accessible via smartphone</p>
              <p>• Stabilité avec USDT</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Marché */}
      <div className="min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">Marché Addressable</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                TAM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-terex-accent">$95B</div>
              <p>Marché total des transferts en Afrique</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2" />
                SAM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-terex-accent">$12B</div>
              <p>Transferts crypto en Afrique de l'Ouest</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                SOM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-terex-accent">$500M</div>
              <p>Notre marché cible initial</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modèle économique */}
      <div className="min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">Modèle Économique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sources de Revenus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Frais de transaction</span>
                <span className="font-bold">1.5-2%</span>
              </div>
              <div className="flex justify-between">
                <span>Spread de change</span>
                <span className="font-bold">0.3-0.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Services premium</span>
                <span className="font-bold">$5-20/mois</span>
              </div>
              <div className="flex justify-between">
                <span>Partenariats</span>
                <span className="font-bold">5-10%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avantages Concurrentiels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Première plateforme USDT dédiée à l'Afrique</p>
              <p>• Partenariats avec banques locales</p>
              <p>• Interface multilingue</p>
              <p>• Support client 24h/7j</p>
              <p>• Conformité réglementaire</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traction */}
      <div className="min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">Traction & Métriques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-4xl font-bold text-terex-accent">15K+</div>
              <p>Utilisateurs actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-4xl font-bold text-terex-accent">$2.3M</div>
              <p>Volume mensuel</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-4xl font-bold text-terex-accent">95%</div>
              <p>Satisfaction client</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-4xl font-bold text-terex-accent">8</div>
              <p>Pays couverts</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Équipe */}
      <div className="min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">Équipe Fondatrice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="text-center p-6">
              <div className="w-20 h-20 bg-terex-accent rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">CEO - Amadou Diallo</h3>
              <p className="text-sm text-gray-600">10+ ans Fintech Afrique</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="w-20 h-20 bg-terex-accent rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">CTO - Fatou Sow</h3>
              <p className="text-sm text-gray-600">Expert blockchain & crypto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="w-20 h-20 bg-terex-accent rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">COO - Omar Ba</h3>
              <p className="text-sm text-gray-600">Operations & Partnerships</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demande de financement */}
      <div className="min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">Opportunité d'Investissement</h2>
        <div className="text-center space-y-8">
          <div>
            <div className="text-6xl font-bold text-terex-accent">$2M</div>
            <p className="text-xl">Levée de fonds Série A</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation des Fonds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Développement produit</span>
                  <span>40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Expansion géographique</span>
                  <span>30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketing & Acquisition</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conformité & Licences</span>
                  <span>10%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Objectifs 18 mois</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• 100K+ utilisateurs actifs</p>
                <p>• $50M volume mensuel</p>
                <p>• 15 pays couverts</p>
                <p>• Break-even opérationnel</p>
                <p>• Préparation Série B</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="min-h-screen flex flex-col justify-center text-center">
        <h2 className="text-3xl font-bold mb-8">Rejoignez la Révolution</h2>
        <div className="space-y-6">
          <p className="text-xl">contact@terex.sn</p>
          <p className="text-xl">+221 77 397 27 49</p>
          <p className="text-lg text-gray-600">www.terex.sn</p>
          <div className="text-4xl font-bold text-terex-accent">MERCI</div>
        </div>
      </div>
    </div>
  );
};
