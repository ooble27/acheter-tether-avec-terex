
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CryptoPrices } from '@/components/home/CryptoPrices';
import { CryptoNews } from '@/components/home/CryptoNews';
import { USDTLivePrice } from '@/components/home/USDTLivePrice';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue, <span className="text-terex-accent">{user?.name}</span> !
        </h1>
        <p className="text-gray-400">
          Gérez vos transactions USDT et vos transferts internationaux en toute simplicité.
        </p>
      </div>

      {/* Section prix USDT en temps réel */}
      <USDTLivePrice />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <span className="mr-2 text-2xl">💰</span>
              Acheter USDT
            </CardTitle>
            <CardDescription className="text-gray-400">
              Achetez des USDT avec des francs CFA ou des dollars canadiens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-terex-accent font-medium">Taux compétitifs • Transactions sécurisées</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <span className="mr-2 text-2xl">💸</span>
              Vendre USDT
            </CardTitle>
            <CardDescription className="text-gray-400">
              Convertissez vos USDT en francs CFA instantanément
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-terex-accent font-medium">Réception rapide • Orange Money & Wave</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <span className="mr-2 text-2xl">🌍</span>
              Virement International
            </CardTitle>
            <CardDescription className="text-gray-400">
              Envoyez de l'argent vers l'Afrique depuis le Canada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-terex-accent font-medium">Frais réduits • Transfert rapide</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Statistiques</CardTitle>
            <CardDescription className="text-gray-400">
              Vos activités récentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Transactions ce mois</span>
              <span className="text-terex-accent font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Volume total échangé</span>
              <span className="text-terex-accent font-bold">0 USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Dernière transaction</span>
              <span className="text-gray-400">Aucune</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Informations importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-lg">
              <p className="text-terex-accent text-sm">
                ✓ Plateforme sécurisée et régulée
              </p>
            </div>
            <div className="p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-lg">
              <p className="text-terex-accent text-sm">
                ✓ Support client 24/7 disponible
              </p>
            </div>
            <div className="p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-lg">
              <p className="text-terex-accent text-sm">
                ✓ Transactions traitées en temps réel
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section des fonctionnalités crypto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CryptoPrices />
        <CryptoNews />
      </div>
    </div>
  );
}
