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
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Configuration des Webhooks</CardTitle>
          <CardDescription className="text-gray-600">
            Recevez des notifications en temps réel pour les événements importants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-black">URL du Webhook</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://votre-site.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="text-sm break-all bg-white border-gray-200 text-black"
            />
            <p className="text-xs text-gray-600">
              Cette URL recevra les notifications POST pour tous les événements
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Button onClick={saveWebhookUrl} disabled={saving} className="w-full md:w-auto bg-primary text-white hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              variant="outline"
              onClick={testWebhook}
              disabled={testing || !webhookUrl}
              className="w-full md:w-auto border-gray-300 text-black hover:bg-gray-100 hover:text-black"
            >
              <TestTube className="mr-2 h-4 w-4" />
              {testing ? 'Test...' : 'Tester'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Événements disponibles</CardTitle>
          <CardDescription className="text-gray-600">
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
              <div key={item.event} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono bg-gray-200 text-black px-2 py-1 rounded break-all">
                    {item.event}
                  </code>
                  <p className="text-sm text-gray-700 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Format des webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
            <code className="text-xs md:text-sm whitespace-pre-wrap break-all text-black">{`{
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
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
