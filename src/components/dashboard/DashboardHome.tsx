

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, TrendingUp, Users, Globe } from 'lucide-react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  const stats = [
    {
      title: 'Transactions USDT',
      value: '1,234',
      description: 'Ce mois',
      icon: CircleDollarSign,
      color: 'text-terex-accent'
    },
    {
      title: 'Utilisateurs actifs',
      value: '892',
      description: 'Cette semaine',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Pays desservis',
      value: '45+',
      description: 'Dans le monde',
      icon: Globe,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-gray-400">
          Gérez vos transactions USDT en toute sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-terex-darker border-terex-gray">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-terex-accent" />
              <span>Services populaires</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Les services les plus utilisés cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Achat USDT</span>
              <span className="text-terex-accent font-bold">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Vente USDT</span>
              <span className="text-terex-accent font-bold">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Virement International</span>
              <span className="text-terex-accent font-bold">10%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Annonces importantes</CardTitle>
            <CardDescription className="text-gray-400">
              Restez informé des dernières actualités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-terex-gray rounded-lg">
              <h4 className="text-white font-medium mb-2">
                Nouveaux taux de change
              </h4>
              <p className="text-gray-400 text-sm">
                Profitez de nos nouveaux taux compétitifs pour vos transactions USDT.
              </p>
            </div>
            <div className="p-4 bg-terex-gray rounded-lg">
              <h4 className="text-white font-medium mb-2">
                Maintenance programmée
              </h4>
              <p className="text-gray-400 text-sm">
                Maintenance technique prévue le dimanche de 2h à 4h (UTC).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

