import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, TestTube } from 'lucide-react';

interface MerchantWebhooksProps {
  merchantAccount: any;
  onUpdate: (userId: string) => void;
}

export function MerchantWebhooks({ merchantAccount, onUpdate }: MerchantWebhooksProps) {
  const [webhookUrl, setWebhookUrl] = useState(merchantAccount.webhook_url || '');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const saveWebhookUrl = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('merchant_accounts')
      .update({ webhook_url: webhookUrl })
      .eq('id', merchantAccount.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Webhook configuré',
        description: 'Votre URL de webhook a été enregistrée'
      });
      onUpdate(merchantAccount.user_id);
    }

    setSaving(false);
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: 'URL manquante',
        description: 'Veuillez d\'abord configurer une URL de webhook',
        variant: 'destructive'
      });
      return;
    }

    setTesting(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'test',
          test: true,
          timestamp: new Date().toISOString(),
          merchant_id: merchantAccount.id
        })
      });

      if (response.ok) {
        toast({
          title: 'Test réussi',
          description: 'Votre webhook a répondu correctement'
        });
      } else {
        toast({
          title: 'Test échoué',
          description: `Le webhook a répondu avec le code ${response.status}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de se connecter à votre webhook',
        variant: 'destructive'
      });
    }

    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des Webhooks</CardTitle>
          <CardDescription>
            Recevez des notifications en temps réel pour les événements importants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL du Webhook</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://votre-site.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Cette URL recevra les notifications POST pour tous les événements
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveWebhookUrl} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              variant="outline"
              onClick={testWebhook}
              disabled={testing || !webhookUrl}
            >
              <TestTube className="mr-2 h-4 w-4" />
              {testing ? 'Test en cours...' : 'Tester le webhook'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Événements disponibles</CardTitle>
          <CardDescription>
            Votre webhook recevra ces types d'événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { event: 'payment.created', description: 'Un nouveau paiement a été créé' },
              { event: 'payment.pending', description: 'Un paiement est en attente' },
              { event: 'payment.completed', description: 'Un paiement a été complété' },
              { event: 'payment.failed', description: 'Un paiement a échoué' },
              { event: 'payment.expired', description: 'Un paiement a expiré' },
            ].map((item) => (
              <div key={item.event} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {item.event}
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Format des webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "event": "payment.completed",
  "payment_id": "uuid",
  "merchant_id": "uuid",
  "amount": 50000,
  "currency": "CFA",
  "usdt_amount": 85.47,
  "status": "completed",
  "reference_number": "TPY-XXX",
  "timestamp": "2025-01-14T10:00:00Z",
  "signature": "sha256_hmac_signature"
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
