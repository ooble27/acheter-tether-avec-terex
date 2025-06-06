
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Handshake, TrendingUp, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { OTCRequestForm } from './otc/OTCRequestForm';
import { OTCOrdersList } from './otc/OTCOrdersList';
import { OTCMarketData } from './otc/OTCMarketData';

export function OTC() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-terex-dark text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-terex-accent/20 rounded-xl">
              <Handshake className="h-8 w-8 text-terex-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trading OTC</h1>
              <p className="text-gray-400">Négociation de gros volumes avec des conditions préférentielles</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30">
            Pro Trading
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Volume 24h</p>
                  <p className="text-2xl font-bold text-white">$2.4M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Ordres actifs</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Contreparties</p>
                  <p className="text-2xl font-bold text-white">43</p>
                </div>
                <Users className="h-8 w-8 text-terex-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-terex-darker border border-terex-gray/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="request" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white">
              Nouvelle demande
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white">
              Mes ordres
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white">
              Marché
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-terex-darker border-terex-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">Qu'est-ce que le Trading OTC ?</CardTitle>
                  <CardDescription className="text-gray-400">
                    Over-The-Counter pour vos transactions importantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-white font-medium">Volumes importants</p>
                        <p className="text-sm text-gray-400">À partir de 100 000 USDT</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-white font-medium">Tarifs préférentiels</p>
                        <p className="text-sm text-gray-400">Commissions réduites selon le volume</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-white font-medium">Exécution prioritaire</p>
                        <p className="text-sm text-gray-400">Traitement en moins de 30 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-white font-medium">Support dédié</p>
                        <p className="text-sm text-gray-400">Accompagnement personnalisé 24/7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">Commissions OTC</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tarification dégressive selon le volume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white">100K - 500K USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30">0.15%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white">500K - 1M USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30">0.12%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white">1M - 5M USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30">0.10%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white">5M+ USDT</span>
                      <Badge variant="outline" className="text-green-500 border-green-500/30">Sur mesure</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-terex-darker border-terex-gray/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span>Prérequis pour le Trading OTC</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2">KYC Vérifié</h4>
                    <p className="text-sm text-gray-400">Votre identité doit être vérifiée au niveau KYC 2</p>
                  </div>
                  <div className="p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Volume minimum</h4>
                    <p className="text-sm text-gray-400">Transactions à partir de 100 000 USDT</p>
                  </div>
                  <div className="p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Garanties</h4>
                    <p className="text-sm text-gray-400">Dépôt de garantie selon les conditions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="request">
            <OTCRequestForm />
          </TabsContent>

          <TabsContent value="orders">
            <OTCOrdersList />
          </TabsContent>

          <TabsContent value="market">
            <OTCMarketData />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
