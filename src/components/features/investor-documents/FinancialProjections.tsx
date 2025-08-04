
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const revenueData = [
  { year: '2024', revenue: 500000, users: 15000, transactions: 125000 },
  { year: '2025', revenue: 2500000, users: 75000, transactions: 600000 },
  { year: '2026', revenue: 8000000, users: 200000, transactions: 1800000 },
  { year: '2027', revenue: 20000000, users: 450000, transactions: 4200000 },
];

const costBreakdown = [
  { category: 'Personnel', amount: 800000, percentage: 40 },
  { category: 'Infrastructure', amount: 400000, percentage: 20 },
  { category: 'Marketing', amount: 300000, percentage: 15 },
  { category: 'Compliance', amount: 200000, percentage: 10 },
  { category: 'Operations', amount: 300000, percentage: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const FinancialProjections = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-8 bg-white" id="financial-projections-content">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Projections Financières Terex</h1>
        <p className="text-xl text-gray-600">Prévisions 2024-2027</p>
      </div>

      {/* Résumé Exécutif */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Exécutif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$31M</div>
              <p>Revenus cumulés sur 4 ans</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">450K</div>
              <p>Utilisateurs cibles en 2027</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">35%</div>
              <p>Marge brute projetée</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">18 mois</div>
              <p>Délai pour break-even</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Croissance des Revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Croissance des Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(Number(value)), 
                name
              ]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenus ($)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Croissance Utilisateurs vs Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" name="Utilisateurs actifs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Volume de Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#ffc658" name="Transactions mensuelles" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des Coûts */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Coûts Opérationnels 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [
                  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(Number(value)),
                  'Coût'
                ]} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Détail des Coûts</h3>
              {costBreakdown.map((item, index) => (
                <div key={item.category} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.category}</span>
                  </div>
                  <span className="font-semibold">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau Détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Projections Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Métriques</th>
                  <th className="border border-gray-300 p-3 text-center">2024</th>
                  <th className="border border-gray-300 p-3 text-center">2025</th>
                  <th className="border border-gray-300 p-3 text-center">2026</th>
                  <th className="border border-gray-300 p-3 text-center">2027</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Revenus ($)</td>
                  <td className="border border-gray-300 p-3 text-center">500,000</td>
                  <td className="border border-gray-300 p-3 text-center">2,500,000</td>
                  <td className="border border-gray-300 p-3 text-center">8,000,000</td>
                  <td className="border border-gray-300 p-3 text-center">20,000,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Utilisateurs Actifs</td>
                  <td className="border border-gray-300 p-3 text-center">15,000</td>
                  <td className="border border-gray-300 p-3 text-center">75,000</td>
                  <td className="border border-gray-300 p-3 text-center">200,000</td>
                  <td className="border border-gray-300 p-3 text-center">450,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Transactions/Mois</td>
                  <td className="border border-gray-300 p-3 text-center">125,000</td>
                  <td className="border border-gray-300 p-3 text-center">600,000</td>
                  <td className="border border-gray-300 p-3 text-center">1,800,000</td>
                  <td className="border border-gray-300 p-3 text-center">4,200,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Volume Mensuel ($M)</td>
                  <td className="border border-gray-300 p-3 text-center">2.3</td>
                  <td className="border border-gray-300 p-3 text-center">12</td>
                  <td className="border border-gray-300 p-3 text-center">35</td>
                  <td className="border border-gray-300 p-3 text-center">85</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Marge Brute (%)</td>
                  <td className="border border-gray-300 p-3 text-center">25%</td>
                  <td className="border border-gray-300 p-3 text-center">30%</td>
                  <td className="border border-gray-300 p-3 text-center">35%</td>
                  <td className="border border-gray-300 p-3 text-center">40%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Pays Couverts</td>
                  <td className="border border-gray-300 p-3 text-center">8</td>
                  <td className="border border-gray-300 p-3 text-center">12</td>
                  <td className="border border-gray-300 p-3 text-center">15</td>
                  <td className="border border-gray-300 p-3 text-center">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hypothèses Clés */}
      <Card>
        <CardHeader>
          <CardTitle>Hypothèses Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Croissance</h3>
              <ul className="space-y-2">
                <li>• Croissance utilisateurs: 400% par an</li>
                <li>• Rétention utilisateurs: 85%</li>
                <li>• Fréquence moyenne: 8 transactions/mois</li>
                <li>• Ticket moyen: $185</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Revenus</h3>
              <ul className="space-y-2">
                <li>• Commission moyenne: 1.8%</li>
                <li>• Spread de change: 0.4%</li>
                <li>• Services premium: 15% adoption</li>
                <li>• Partenariats: 8% des revenus</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
