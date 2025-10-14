import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, QrCode, Copy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface MerchantQRCodesProps {
  merchantId: string;
}

export function MerchantQRCodes({ merchantId }: MerchantQRCodesProps) {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQRCodes();
  }, [merchantId]);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      
      // Get QR codes with payment info
      const { data, error } = await supabase
        .from('payment_qr_codes')
        .select(`
          *,
          payment:terex_payments!inner(
            id,
            reference_number,
            amount,
            currency,
            usdt_amount,
            status,
            created_at,
            expires_at
          )
        `)
        .eq('payment.merchant_id', merchantId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setQrCodes(data || []);
    } catch (error: any) {
      console.error('Error loading QR codes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les QR codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copié !',
      description: `${label} copié dans le presse-papiers`,
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>QR Codes de Paiement</CardTitle>
              <CardDescription>
                Gérez les QR codes générés pour vos paiements
              </CardDescription>
            </div>
            <Button onClick={loadQRCodes} variant="outline" size="sm">
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucun QR code généré. Utilisez l'API pour créer des QR codes de paiement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {qrCodes.map((qr) => {
                const payment = qr.payment;
                const expired = isExpired(qr.expires_at);

                return (
                  <Card key={qr.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={expired ? "secondary" : "default"}>
                              {expired ? 'Expiré' : 'Actif'}
                            </Badge>
                            <Badge variant="outline">
                              {payment.status === 'pending' ? 'En attente' :
                               payment.status === 'completed' ? 'Payé' :
                               payment.status === 'refunded' ? 'Remboursé' : payment.status}
                            </Badge>
                            {qr.scanned_at && (
                              <Badge variant="secondary">Scanné</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Code QR</p>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {qr.qr_code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(qr.qr_code, 'Code QR')}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Référence Paiement</p>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono">
                                  {payment.reference_number}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(payment.reference_number, 'Référence')}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Montant</p>
                              <p className="font-medium">
                                {payment.amount.toLocaleString()} {payment.currency} 
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({payment.usdt_amount} USDT)
                                </span>
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Créé le</p>
                              <p className="text-sm">
                                {format(new Date(qr.created_at), 'dd/MM/yyyy à HH:mm')}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Expire le</p>
                              <p className={`text-sm ${expired ? 'text-destructive' : ''}`}>
                                {format(new Date(qr.expires_at), 'dd/MM/yyyy à HH:mm')}
                              </p>
                            </div>

                            {qr.scanned_at && (
                              <div>
                                <p className="text-sm text-muted-foreground">Scanné le</p>
                                <p className="text-sm">
                                  {format(new Date(qr.scanned_at), 'dd/MM/yyyy à HH:mm')}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(
                                `https://terangaexchange.com/pay/qr/${qr.qr_code}`,
                                'URL de paiement'
                              )}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copier l'URL
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a 
                                href={`https://terangaexchange.com/pay/qr/${qr.qr_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ouvrir
                              </a>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center w-32 h-32 bg-muted rounded-lg">
                          <QrCode className="h-16 w-16 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générer un QR Code via API</CardTitle>
          <CardDescription>
            Utilisez l'endpoint suivant pour générer un QR code pour un paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Endpoint</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">POST</Badge>
                <code className="flex-1 p-3 bg-muted rounded-md text-sm">
                  /:payment_id/qr
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Exemple de requête</p>
              <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X POST https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/merchant-api-payments/PAYMENT_ID/qr \\
  -H "Authorization: Bearer VOTRE_CLE_API"`}
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Réponse</p>
              <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "qr_code": {
    "id": "uuid",
    "qr_code": "TRXQR-XXXXX",
    "payment_id": "uuid",
    "payment_url": "https://terangaexchange.com/pay/qr/TRXQR-XXXXX",
    "expires_at": "2024-01-01T12:30:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}