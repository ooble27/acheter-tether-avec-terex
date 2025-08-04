
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const marketSizeData = [
  { country: 'Nigeria', size: 25000, population: 220, mobile: 85 },
  { country: 'Ghana', size: 8500, population: 32, mobile: 78 },
  { country: 'Sénégal', size: 3200, population: 17, mobile: 82 },
  { country: 'Côte d\'Ivoire', size: 4800, population: 28, mobile: 75 },
  { country: 'Mali', size: 1800, population: 21, mobile: 68 },
  { country: 'Burkina Faso', size: 1200, population: 22, mobile: 65 },
];

const competitionData = [
  { name: 'Western Union', market: 35, fees: 8.5 },
  { name: 'MoneyGram', market: 25, fees: 9.2 },
  { name: 'Wave', market: 15, fees: 3.5 },
  { name: 'Remitly', market: 10, fees: 4.8 },
  { name: 'Wise', market: 8, fees: 2.1 },
  { name: 'Autres', market: 7, fees: 6.5 },
];

const cryptoAdoptionData = [
  { year: '2020', adoption: 5, volume: 2.1 },
  { year: '2021', adoption: 12, volume: 8.5 },
  { year: '2022', adoption: 18, volume: 15.2 },
  { year: '2023', adoption: 28, volume: 32.8 },
  { year: '2024', adoption: 42, volume: 58.3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const MarketStudy = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-8 bg-white" id="market-study-content">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Étude de Marché - Transferts d'Argent en Afrique</h1>
        <p className="text-xl text-gray-600">Analyse complète du marché des transferts et opportunités crypto</p>
        <p className="text-lg text-gray-500">Rapport Terex - 2024</p>
      </div>

      {/* Résumé Exécutif */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Exécutif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Marché des Transferts en Afrique</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Taille du marché:</strong> $95 milliards en 2024</li>
                <li>• <strong>Croissance annuelle:</strong> 8.5% (CAGR)</li>
                <li>• <strong>Population cible:</strong> 400M d'adultes bancarisés</li>
                <li>• <strong>Pénétration mobile:</strong> 78% en moyenne</li>
                <li>• <strong>Frais moyens actuels:</strong> 8-15%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Opportunité Crypto</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Adoption crypto:</strong> +150% en 3 ans</li>
                <li>• <strong>Volume crypto Afrique:</strong> $58.3B en 2024</li>
                <li>• <strong>Avantage USDT:</strong> Stabilité vs devises locales</li>
                <li>• <strong>Segment cible:</strong> Transferts internationaux</li>
                <li>• <strong>Réduction de coûts:</strong> Jusqu'à 85%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taille du Marché par Pays */}
      <Card>
        <CardHeader>
          <CardTitle>Taille du Marché par Pays (en millions $)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={marketSizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}M`, 'Volume annuel']} />
              <Bar dataKey="size" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Analyse Concurrentielle */}
      <Card>
        <CardHeader>
          <CardTitle>Paysage Concurrentiel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Parts de Marché</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={competitionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, market }) => `${name} ${market}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="market"
                  >
                    {competitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Comparaison des Frais</h3>
              <div className="space-y-3">
                {competitionData.map((competitor, index) => (
                  <div key={competitor.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{competitor.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{competitor.fees}%</div>
                      <div className="text-sm text-gray-500">{competitor.market}% market</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adoption Crypto en Afrique */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'Adoption Crypto en Afrique</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cryptoAdoptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="adoption" fill="#8884d8" name="Adoption (%)" />
              <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume ($B)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pénétration Mobile Money */}
      <Card>
        <CardHeader>
          <CardTitle>Pénétration Mobile Money par Pays</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={marketSizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Pénétration mobile']} />
              <Bar dataKey="mobile" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Analyse SWOT */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse SWOT - Marché des Transferts Crypto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-bold text-green-800 mb-2">Forces</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Coûts réduits avec USDT</li>
                  <li>• Transferts instantanés 24h/7j</li>
                  <li>• Infrastructure blockchain robuste</li>
                  <li>• Équipe locale expérimentée</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-bold text-blue-800 mb-2">Opportunités</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Marché sous-desservi</li>
                  <li>• Adoption crypto croissante</li>
                  <li>• Partenariats avec banques locales</li>
                  <li>• Expansion vers nouveaux pays</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-bold text-yellow-800 mb-2">Faiblesses</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Nouvelle marque sur le marché</li>
                  <li>• Besoin d'éducation utilisateurs</li>
                  <li>• Dépendance technologique</li>
                  <li>• Capital initial limité</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-bold text-red-800 mb-2">Menaces</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Incertitudes réglementaires</li>
                  <li>• Concurrence établie</li>
                  <li>• Volatilité crypto</li>
                  <li>• Barrières bancaires</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segments de Marché */}
      <Card>
        <CardHeader>
          <CardTitle>Segmentation du Marché Cible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg mb-3">Diaspora Africaine</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Taille:</strong> 40M personnes</li>
                <li><strong>Envois moyens:</strong> $300/mois</li>
                <li><strong>Fréquence:</strong> 2x/mois</li>
                <li><strong>Sensibilité prix:</strong> Élevée</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg mb-3">Entreprises PME</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Nombre:</strong> 500K entreprises</li>
                <li><strong>Volume moyen:</strong> $5K/mois</li>
                <li><strong>Usage:</strong> Paiements fournisseurs</li>
                <li><strong>Critère clé:</strong> Rapidité</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg mb-3">Freelancers Tech</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Population:</strong> 2M personnes</li>
                <li><strong>Revenus moyens:</strong> $800/mois</li>
                <li><strong>Adoption crypto:</strong> 65%</li>
                <li><strong>Besoin:</strong> Paiements internationaux</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barrières à l'Entrée */}
      <Card>
        <CardHeader>
          <CardTitle>Barrières à l'Entrée et Stratégies de Contournement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Principales Barrières</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-red-600">1.</span>
                    <div>
                      <strong>Conformité Réglementaire</strong>
                      <p className="text-sm text-gray-600">Licences et certifications requises dans chaque pays</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-red-600">2.</span>
                    <div>
                      <strong>Capital Requis</strong>
                      <p className="text-sm text-gray-600">Réserves de liquidité importantes nécessaires</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-red-600">3.</span>
                    <div>
                      <strong>Réseau de Partenaires</strong>
                      <p className="text-sm text-gray-600">Relations avec banques et institutions locales</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Nos Avantages Concurrentiels</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-green-600">✓</span>
                    <div>
                      <strong>Équipe Locale</strong>
                      <p className="text-sm text-gray-600">Connaissance approfondie des marchés africains</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-green-600">✓</span>
                    <div>
                      <strong>Innovation Technologique</strong>
                      <p className="text-sm text-gray-600">Solution USDT native optimisée pour l'Afrique</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-bold text-green-600">✓</span>
                    <div>
                      <strong>Focus Régional</strong>
                      <p className="text-sm text-gray-600">Spécialisation sur l'écosystème africain</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle>Conclusions et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Opportunité de Marché</h3>
              <p className="text-gray-700">
                Le marché des transferts d'argent en Afrique présente une opportunité exceptionnelle avec un TAM de $95B 
                et une croissance soutenue de 8.5% par an. L'adoption croissante des cryptomonnaies (+150% en 3 ans) 
                crée une fenêtre d'opportunité unique pour Terex.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Stratégie Recommandée</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Phase 1 (6-12 mois)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Focus sur 3 pays prioritaires (Sénégal, Ghana, Nigeria)</li>
                    <li>• Partenariats avec 2-3 banques par pays</li>
                    <li>• Acquisition de 50K utilisateurs actifs</li>
                    <li>• Volume cible: $25M annuel</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phase 2 (12-24 mois)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Expansion vers 5 nouveaux pays</li>
                    <li>• Services premium et API entreprises</li>
                    <li>• 200K utilisateurs actifs</li>
                    <li>• Break-even opérationnel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
