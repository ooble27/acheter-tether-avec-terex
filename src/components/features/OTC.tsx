
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
    <div className="min-h-screen bg-terex-dark text-white overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-6 py-3 md:py-6">
        {/* Header */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
            <div className="p-2 md:p-3 bg-terex-accent/20 rounded-xl flex-shrink-0">
              <Handshake className="h-5 w-5 md:h-8 md:w-8 text-terex-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-3xl font-bold text-white truncate">Trading OTC</h1>
              <p className="text-gray-400 text-xs md:text-base leading-tight">Négociation de gros volumes avec des conditions préférentielles</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30 self-start md:self-auto text-xs flex-shrink-0">
            Pro Trading
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 truncate">Volume 24h</p>
                  <p className="text-sm md:text-2xl font-bold text-white">$2.4M</p>
                </div>
                <TrendingUp className="h-4 w-4 md:h-8 md:w-8 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 truncate">Ordres actifs</p>
                  <p className="text-sm md:text-2xl font-bold text-white">12</p>
                </div>
                <Clock className="h-4 w-4 md:h-8 md:w-8 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 truncate">Completed</p>
                  <p className="text-sm md:text-2xl font-bold text-white">156</p>
                </div>
                <CheckCircle className="h-4 w-4 md:h-8 md:w-8 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 truncate">Contreparties</p>
                  <p className="text-sm md:text-2xl font-bold text-white">43</p>
                </div>
                <Users className="h-4 w-4 md:h-8 md:w-8 text-terex-accent flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 md:space-y-6 w-full">
          <div className="w-full">
            <TabsList className="bg-terex-darker border border-terex-gray/30 grid grid-cols-4 w-full h-auto p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-1 md:px-4 py-2 whitespace-nowrap"
              >
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="request" 
                className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-1 md:px-4 py-2 whitespace-nowrap"
              >
                Nouvelle demande
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-1 md:px-4 py-2 whitespace-nowrap"
              >
                Mes ordres
              </TabsTrigger>
              <TabsTrigger 
                value="market" 
                className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-1 md:px-4 py-2 whitespace-nowrap"
              >
                Marché
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-3 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
              <Card className="bg-terex-darker border-terex-gray/30">
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-white text-sm md:text-xl">Qu'est-ce que le Trading OTC ?</CardTitle>
                  <CardDescription className="text-gray-400 text-xs md:text-base">
                    Over-The-Counter pour vos transactions importantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-4">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <CheckCircle className="h-3 w-3 md:h-5 md:w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-xs md:text-base">Volumes importants</p>
                        <p className="text-xs text-gray-400">À partir de 100 000 USDT</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <CheckCircle className="h-3 w-3 md:h-5 md:w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-xs md:text-base">Tarifs préférentiels</p>
                        <p className="text-xs text-gray-400">Commissions réduites selon le volume</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <CheckCircle className="h-3 w-3 md:h-5 md:w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-xs md:text-base">Exécution prioritaire</p>
                        <p className="text-xs text-gray-400">Traitement en moins de 30 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <CheckCircle className="h-3 w-3 md:h-5 md:w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-xs md:text-base">Support dédié</p>
                        <p className="text-xs text-gray-400">Accompagnement personnalisé 24/7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray/30">
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-white text-sm md:text-xl">Commissions OTC</CardTitle>
                  <CardDescription className="text-gray-400 text-xs md:text-base">
                    Tarification dégressive selon le volume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-4">
                  <div className="space-y-1 md:space-y-3">
                    <div className="flex justify-between items-center p-2 md:p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white text-xs md:text-base">100K - 500K USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30 text-xs">0.15%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white text-xs md:text-base">500K - 1M USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30 text-xs">0.12%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white text-xs md:text-base">1M - 5M USDT</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent/30 text-xs">0.10%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 md:p-3 bg-terex-gray/20 rounded-lg">
                      <span className="text-white text-xs md:text-base">5M+ USDT</span>
                      <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs">Sur mesure</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-terex-darker border-terex-gray/30">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-white flex items-center space-x-2 text-sm md:text-xl">
                  <AlertCircle className="h-3 w-3 md:h-5 md:w-5 text-yellow-500 flex-shrink-0" />
                  <span>Prérequis pour le Trading OTC</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                  <div className="p-2 md:p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-xs md:text-base">KYC Vérifié</h4>
                    <p className="text-xs text-gray-400">Votre identité doit être vérifiée au niveau KYC 2</p>
                  </div>
                  <div className="p-2 md:p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-xs md:text-base">Volume minimum</h4>
                    <p className="text-xs text-gray-400">Transactions à partir de 100 000 USDT</p>
                  </div>
                  <div className="p-2 md:p-4 bg-terex-gray/20 rounded-lg">
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-xs md:text-base">Garanties</h4>
                    <p className="text-xs text-gray-400">Dépôt de garantie selon les conditions</p>
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
