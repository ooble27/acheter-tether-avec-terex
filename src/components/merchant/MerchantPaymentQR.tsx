import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Copy, Download, Printer } from 'lucide-react';

interface MerchantPaymentQRProps {
  merchantAccount: any;
}

export function MerchantPaymentQR({ merchantAccount }: MerchantPaymentQRProps) {
  const { toast } = useToast();
  const [qrSize, setQrSize] = useState<'small' | 'medium' | 'large'>('medium');

  const qrCode = merchantAccount.merchant_qr_code;
  const paymentUrl = `https://terex.app/pay/merchant/${qrCode}`;

  // Générer une URL de QR code via une API externe (QR Code Generator API)
  const getQRCodeUrl = (size: number) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(paymentUrl)}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copié !',
      description: `${label} copié dans le presse-papiers`,
    });
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = getQRCodeUrl(1000);
    link.download = `terex-qr-${merchantAccount.business_name}.png`;
    link.click();
    toast({
      title: 'Téléchargement lancé',
      description: 'Votre QR code est en cours de téléchargement',
    });
  };

  const printQR = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${merchantAccount.business_name}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                padding: 40px;
              }
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              img {
                border: 2px solid #ddd;
                padding: 20px;
                background: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .info {
                margin-top: 30px;
                color: #666;
              }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${merchantAccount.business_name}</h1>
              <p>Scannez pour payer en USDT</p>
              <img src="${getQRCodeUrl(500)}" alt="QR Code de paiement" />
              <div class="info">
                <p><strong>Code:</strong> ${qrCode}</p>
                <p><strong>URL:</strong> ${paymentUrl}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const sizeMap = {
    small: 200,
    medium: 300,
    large: 400,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code de Paiement Permanent</CardTitle>
          <CardDescription>
            Ce QR code unique permet à vos clients de vous payer directement en USDT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* QR Code Display */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <img
                  src={getQRCodeUrl(sizeMap[qrSize])}
                  alt="QR Code de paiement"
                  className="w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button
                  variant={qrSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQrSize('small')}
                >
                  Petit
                </Button>
                <Button
                  variant={qrSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQrSize('medium')}
                >
                  Moyen
                </Button>
                <Button
                  variant={qrSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQrSize('large')}
                >
                  Grand
                </Button>
              </div>
            </div>

            {/* Information and Actions */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Nom de l'entreprise
                </p>
                <p className="text-lg font-semibold">{merchantAccount.business_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Code QR
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                    {qrCode}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(qrCode, 'Code QR')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  URL de paiement
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-xs break-all">
                    {paymentUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(paymentUrl, 'URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={downloadQR} className="w-full" variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le QR Code
                </Button>
                <Button onClick={printQR} className="w-full" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer le QR Code
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>💡 Conseil:</strong> Affichez ce QR code dans votre boutique, 
                  sur votre site web ou sur vos factures pour permettre à vos clients 
                  de payer facilement en USDT.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comment utiliser ce QR Code ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-semibold">Affichez le QR</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Imprimez ou affichez le QR code à un endroit visible pour vos clients
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-semibold">Client scanne</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Vos clients scannent le QR code avec leur smartphone
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-semibold">Paiement USDT</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ils entrent le montant et paient directement en USDT
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques du QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Scans totaux</p>
              <p className="text-2xl font-bold mt-1">-</p>
              <p className="text-xs text-muted-foreground mt-1">Prochainement</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Paiements reçus</p>
              <p className="text-2xl font-bold mt-1">-</p>
              <p className="text-xs text-muted-foreground mt-1">Prochainement</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold mt-1">-</p>
              <p className="text-xs text-muted-foreground mt-1">Prochainement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}