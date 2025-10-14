import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface MerchantAPIProps {
  merchantAccount: any;
}

export function MerchantAPI({ merchantAccount }: MerchantAPIProps) {
  const apiBaseUrl = `https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/merchant-api-payments`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API de Paiement Terex</CardTitle>
          <CardDescription>
            Intégrez notre API pour accepter des paiements USDT dans vos applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">URL de Base</p>
            <code className="block p-3 bg-muted rounded-md text-sm">
              {apiBaseUrl}
            </code>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Authentification</p>
            <p className="text-sm text-muted-foreground mb-2">
              Utilisez votre clé API dans le header Authorization :
            </p>
            <code className="block p-3 bg-muted rounded-md text-sm">
              Authorization: Bearer VOTRE_CLE_API
            </code>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="create" className="data-[state=active]:bg-background">Créer</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-background">Lister</TabsTrigger>
          <TabsTrigger value="confirm" className="data-[state=active]:bg-background">Confirmer</TabsTrigger>
          <TabsTrigger value="refund" className="data-[state=active]:bg-background">Rembourser</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default">POST</Badge>
                <CardTitle className="text-lg">/</CardTitle>
              </div>
              <CardDescription>Créer un nouveau paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Requête</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X POST ${apiBaseUrl} \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "CFA",
    "description": "Achat de produit",
    "customer_email": "client@example.com",
    "customer_phone": "+22501020304",
    "metadata": {
      "order_id": "ORD-123"
    }
  }'`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Réponse</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "payment": {
    "id": "uuid",
    "reference_number": "TPY-XXXXXXXXXXXX",
    "amount": 50000,
    "currency": "CFA",
    "usdt_amount": 85.47,
    "exchange_rate": 585,
    "status": "pending",
    "payment_url": "https://terex.app/pay/uuid",
    "expires_at": "2024-01-01T12:30:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">GET</Badge>
                <CardTitle className="text-lg">/</CardTitle>
              </div>
              <CardDescription>Lister les paiements avec pagination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Paramètres</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <code className="bg-muted px-1 rounded">page</code> - Numéro de page (défaut: 1)</li>
                  <li>• <code className="bg-muted px-1 rounded">limit</code> - Résultats par page (défaut: 10)</li>
                  <li>• <code className="bg-muted px-1 rounded">status</code> - Filtrer par statut (pending, completed, refunded)</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Requête</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X GET "${apiBaseUrl}?page=1&limit=10&status=completed" \\
  -H "Authorization: Bearer VOTRE_CLE_API"`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Réponse</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "payments": [
    {
      "id": "uuid",
      "reference_number": "TPY-XXXXXXXXXXXX",
      "amount": 50000,
      "currency": "CFA",
      "usdt_amount": 85.47,
      "status": "completed",
      "paid_at": "2024-01-01T12:15:00Z",
      "created_at": "2024-01-01T12:00:00Z",
      "expires_at": "2024-01-01T12:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">PUT</Badge>
                <CardTitle className="text-lg">/:payment_id/confirm</CardTitle>
              </div>
              <CardDescription>Confirmer un paiement manuellement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Requête</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X PUT ${apiBaseUrl}/PAYMENT_ID/confirm \\
  -H "Authorization: Bearer VOTRE_CLE_API"`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Réponse</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "payment": {
    "id": "uuid",
    "reference_number": "TPY-XXXXXXXXXXXX",
    "amount": 50000,
    "status": "completed",
    "paid_at": "2024-01-01T12:15:00Z"
  }
}`}
                </pre>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Cette action déclenche un webhook <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">payment.completed</code> si configuré.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refund" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default">POST</Badge>
                <CardTitle className="text-lg">/:payment_id/refund</CardTitle>
              </div>
              <CardDescription>Créer un remboursement (partiel ou total)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Requête</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X POST ${apiBaseUrl}/PAYMENT_ID/refund \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "reason": "Remboursement partiel demandé par le client"
  }'`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Paramètres</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <code className="bg-muted px-1 rounded">amount</code> - Montant à rembourser (optionnel, défaut: montant total)</li>
                  <li>• <code className="bg-muted px-1 rounded">reason</code> - Raison du remboursement (optionnel)</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Réponse</p>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "refund": {
    "id": "uuid",
    "payment_id": "uuid",
    "amount": 25000,
    "reason": "Remboursement partiel demandé par le client",
    "status": "pending",
    "created_at": "2024-01-01T13:00:00Z"
  }
}`}
                </pre>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Important:</strong> Les remboursements multiples sont autorisés tant que le total ne dépasse pas le montant du paiement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Codes d'Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">401</Badge>
              <div>
                <p className="font-medium">Unauthorized</p>
                <p className="text-muted-foreground">Clé API manquante ou invalide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="destructive">404</Badge>
              <div>
                <p className="font-medium">Not Found</p>
                <p className="text-muted-foreground">Paiement introuvable</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="destructive">400</Badge>
              <div>
                <p className="font-medium">Bad Request</p>
                <p className="text-muted-foreground">Paramètres manquants ou invalides</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="destructive">500</Badge>
              <div>
                <p className="font-medium">Internal Server Error</p>
                <p className="text-muted-foreground">Erreur serveur</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}