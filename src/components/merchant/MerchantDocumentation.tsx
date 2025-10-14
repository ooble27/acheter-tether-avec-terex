import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export function MerchantDocumentation() {
  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Documentation API Terex</CardTitle>
          <CardDescription className="text-gray-600">
            Guide d'intégration et exemples de code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="payment" className="text-xs md:text-sm whitespace-nowrap">Paiements</TabsTrigger>
              <TabsTrigger value="examples" className="text-xs md:text-sm whitespace-nowrap">Exemples</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Introduction</h3>
                <p className="text-gray-600 mb-4">
                  L'API Terex vous permet d'accepter des paiements en USDT directement dans vos applications.
                  Toutes les requêtes doivent inclure votre clé API dans le header Authorization.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Base URL</h3>
                <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                  <code className="text-xs md:text-sm break-all text-black">https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Authentification</h3>
                <p className="text-gray-600 mb-2">
                  Incluez votre clé API dans chaque requête :
                </p>
                <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                  <code className="text-xs md:text-sm break-all text-black">Authorization: Bearer VOTRE_CLE_API</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Rate Limits</h3>
                <p className="text-gray-600">
                  100 requêtes par minute par clé API
                </p>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Créer un paiement</h3>
                <p className="text-gray-600 mb-4">
                  Créez un nouveau paiement et recevez une URL de paiement pour votre client.
                </p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2 text-black">Endpoint</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                    <code className="text-xs md:text-sm break-all text-black">POST /merchant-api-payments</code>
                  </pre>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2 text-black">Request Body</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                    <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`{
  "amount": 50000,
  "currency": "CFA",
  "description": "Commande #123",
  "customer_email": "client@example.com",
  "customer_phone": "+237600000000",
  "metadata": {
    "order_id": "123",
    "customer_name": "John Doe"
  }
}`}</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 text-black">Response</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                    <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`{
  "success": true,
  "payment": {
    "id": "uuid",
    "reference_number": "TPY-ABC123",
    "amount": 50000,
    "currency": "CFA",
    "usdt_amount": 85.47,
    "exchange_rate": 585,
    "status": "pending",
    "payment_url": "https://terex.app/pay/uuid",
    "expires_at": "2025-01-14T12:00:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-black">Vérifier un paiement</h3>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2 text-black">Endpoint</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                    <code className="text-xs md:text-sm break-all text-black">{`GET /merchant-api-payments/{payment_id}`}</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 text-black">Response</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto border border-gray-200">
                    <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`{
  "success": true,
  "payment": {
    "id": "uuid",
    "status": "completed",
    "paid_at": "2025-01-14T10:30:00Z",
    ...
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
                  <Code className="h-5 w-5" />
                  JavaScript / Node.js
                </h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`const createPayment = async () => {
  const response = await fetch(
    'https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/merchant-api-payments',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer VOTRE_CLE_API',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50000,
        currency: 'CFA',
        description: 'Commande #123',
        customer_email: 'client@example.com',
      })
    }
  );

  const data = await response.json();
  console.log(data.payment.payment_url);
};`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
                  <Code className="h-5 w-5" />
                  Python
                </h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`import requests

def create_payment():
    url = "https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/merchant-api-payments"
    headers = {
        "Authorization": "Bearer VOTRE_CLE_API",
        "Content-Type": "application/json"
    }
    data = {
        "amount": 50000,
        "currency": "CFA",
        "description": "Commande #123",
        "customer_email": "client@example.com"
    }
    
    response = requests.post(url, headers=headers, json=data)
    payment = response.json()
    print(payment["payment"]["payment_url"])`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
                  <Code className="h-5 w-5" />
                  PHP
                </h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/merchant-api-payments",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer VOTRE_CLE_API",
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "amount" => 50000,
    "currency" => "CFA",
    "description" => "Commande #123",
    "customer_email" => "client@example.com"
  ])
]);

$response = curl_exec($curl);
$data = json_decode($response, true);
echo $data["payment"]["payment_url"];
?>`}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
