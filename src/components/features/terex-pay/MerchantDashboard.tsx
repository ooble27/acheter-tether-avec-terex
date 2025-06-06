
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, ExternalLink, Code, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type MerchantAccount = Database['public']['Tables']['merchant_accounts']['Row'];

interface MerchantDashboardProps {
  merchantAccount: MerchantAccount;
}

export const MerchantDashboard = ({ merchantAccount }: MerchantDashboardProps) => {
  const { toast } = useToast();

  const copyApiKey = () => {
    navigator.clipboard.writeText(merchantAccount.api_key);
    toast({
      title: "Copié",
      description: "Clé API copiée dans le presse-papiers",
    });
  };

  const integrationExamples = [
    {
      title: "JavaScript/Node.js",
      code: `// Installation: npm install axios
const axios = require('axios');

const payment = await axios.post('https://api.terex.com/payments', {
  amount: 10000, // 10,000 CFA
  currency: 'CFA',
  description: 'Achat produit',
  customer_email: 'client@email.com'
}, {
  headers: {
    'Authorization': 'Bearer ${merchantAccount.api_key}',
    'Content-Type': 'application/json'
  }
});

console.log('Paiement créé:', payment.data);`
    },
    {
      title: "PHP",
      code: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.terex.com/payments');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'amount' => 10000,
    'currency' => 'CFA',
    'description' => 'Achat produit',
    'customer_email' => 'client@email.com'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ${merchantAccount.api_key}',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$payment = json_decode($response, true);
echo 'Paiement créé: ' . $payment['reference_number'];
?>`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Informations du compte */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Informations du compte</CardTitle>
          <CardDescription className="text-gray-400">
            Détails de votre compte marchand Terex Pay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Entreprise</label>
              <p className="text-white">{merchantAccount.business_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Type</label>
              <p className="text-white capitalize">{merchantAccount.business_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <p className="text-white">{merchantAccount.business_email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Commission</label>
              <p className="text-white">{(merchantAccount.commission_rate * 100).toFixed(2)}%</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300">Clé API</label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 p-3 bg-gray-900 rounded border border-gray-600">
                <code className="text-green-400 text-sm">{merchantAccount.api_key}</code>
              </div>
              <Button size="sm" variant="outline" onClick={copyApiKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guides d'intégration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <QrCode className="h-8 w-8 text-blue-400 mb-2" />
            <CardTitle className="text-white">QR Code</CardTitle>
            <CardDescription className="text-gray-400">
              Paiements rapides en scannant un QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Générer QR Code
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <Code className="h-8 w-8 text-green-400 mb-2" />
            <CardTitle className="text-white">API Web</CardTitle>
            <CardDescription className="text-gray-400">
              Intégrez les paiements dans votre site web
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Documentation API
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <Smartphone className="h-8 w-8 text-purple-400 mb-2" />
            <CardTitle className="text-white">App Mobile</CardTitle>
            <CardDescription className="text-gray-400">
              Terminal de paiement mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Télécharger App
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Exemples d'intégration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Exemples d'intégration</CardTitle>
          <CardDescription className="text-gray-400">
            Code d'exemple pour intégrer Terex Pay dans votre application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {integrationExamples.map((example, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{example.title}</h4>
                <Button size="sm" variant="ghost" onClick={() => {
                  navigator.clipboard.writeText(example.code);
                  toast({ title: "Code copié", description: "Exemple copié dans le presse-papiers" });
                }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-gray-900 p-4 rounded border border-gray-600 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{example.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
