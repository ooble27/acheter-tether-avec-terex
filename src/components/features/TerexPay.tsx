
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Store, QrCode, TrendingUp, Users, Wallet } from 'lucide-react';
import { useMerchantAccount } from '@/hooks/useMerchantAccount';
import { MerchantAccountSetup } from './terex-pay/MerchantAccountSetup';
import { MerchantDashboard } from './terex-pay/MerchantDashboard';
import { PaymentCreator } from './terex-pay/PaymentCreator';
import { PaymentsList } from './terex-pay/PaymentsList';

export const TerexPay = () => {
  const { merchantAccount, loading } = useMerchantAccount();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  // Si pas de compte marchand, afficher le setup
  if (!merchantAccount) {
    return (
      <div className="min-h-screen bg-terex-dark p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Terex Pay - Solution de Paiement
            </h1>
            <p className="text-gray-300 text-lg">
              Acceptez les paiements en USDT et cryptomonnaies dans votre commerce
            </p>
          </div>
          
          <MerchantAccountSetup />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Terex Pay</h1>
              <p className="text-gray-300">
                Dashboard marchand - {merchantAccount.business_name}
              </p>
            </div>
            <Badge 
              variant={merchantAccount.is_active ? "default" : "secondary"}
              className="text-sm"
            >
              {merchantAccount.is_active ? "Actif" : "Inactif"}
            </Badge>
          </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Commission</p>
                    <p className="text-lg font-bold text-white">
                      {(merchantAccount.commission_rate * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Aujourd'hui</p>
                    <p className="text-lg font-bold text-white">0 CFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Transactions</p>
                    <p className="text-lg font-bold text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Ce mois</p>
                    <p className="text-lg font-bold text-white">0 CFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contenu principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
              <Store className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-gray-300 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="create" className="text-gray-300 data-[state=active]:text-white">
              <QrCode className="h-4 w-4 mr-2" />
              Créer
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MerchantDashboard merchantAccount={merchantAccount} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsList />
          </TabsContent>

          <TabsContent value="create">
            <PaymentCreator merchantAccount={merchantAccount} />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Paramètres du compte</CardTitle>
                <CardDescription className="text-gray-400">
                  Gérez les paramètres de votre compte marchand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Clé API</label>
                    <div className="mt-1 p-3 bg-gray-900 rounded border border-gray-600">
                      <code className="text-green-400 text-sm">{merchantAccount.api_key}</code>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">URL Webhook</label>
                    <div className="mt-1 p-3 bg-gray-900 rounded border border-gray-600">
                      <span className="text-gray-400 text-sm">
                        {merchantAccount.webhook_url || "Non configuré"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
