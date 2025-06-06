
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Copy, ExternalLink } from 'lucide-react';
import { useTerexPayments } from '@/hooks/useTerexPayments';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type MerchantAccount = Database['public']['Tables']['merchant_accounts']['Row'];

interface PaymentCreatorProps {
  merchantAccount: MerchantAccount;
}

export const PaymentCreator = ({ merchantAccount }: PaymentCreatorProps) => {
  const { createPayment } = useTerexPayments();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [createdPayment, setCreatedPayment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'CFA',
    description: '',
    customer_email: '',
    customer_phone: '',
    expires_in_minutes: '30'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payment = await createPayment({
        merchantId: merchantAccount.id,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description || undefined,
        customerEmail: formData.customer_email || undefined,
        customerPhone: formData.customer_phone || undefined,
        expiresInMinutes: parseInt(formData.expires_in_minutes)
      });

      if (payment) {
        setCreatedPayment(payment);
        // Reset form
        setFormData({
          amount: '',
          currency: 'CFA',
          description: '',
          customer_email: '',
          customer_phone: '',
          expires_in_minutes: '30'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyPaymentLink = () => {
    if (createdPayment) {
      const link = `https://pay.terex.com/${createdPayment.reference_number}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Lien copié",
        description: "Lien de paiement copié dans le presse-papiers",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de création */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Créer un nouveau paiement</CardTitle>
          <CardDescription className="text-gray-400">
            Générez un lien de paiement ou un QR code pour vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Montant *
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-900 border-gray-600 text-white pr-16"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {formData.currency}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-300">
                  Devise
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="CFA">CFA (Franc CFA)</SelectItem>
                    <SelectItem value="USD">USD (Dollar US)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email" className="text-gray-300">
                  Email client (optionnel)
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  placeholder="client@email.com"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_phone" className="text-gray-300">
                  Téléphone client (optionnel)
                </Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du produit ou service"
                className="bg-gray-900 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_in_minutes" className="text-gray-300">
                Expiration (minutes)
              </Label>
              <Select value={formData.expires_in_minutes} onValueChange={(value) => handleInputChange('expires_in_minutes', value)}>
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="1440">24 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !formData.amount}
                className="bg-terex-orange hover:bg-terex-orange/90"
              >
                {loading ? "Création..." : "Créer le paiement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Paiement créé */}
      {createdPayment && (
        <Card className="bg-green-900/20 border-green-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Paiement créé avec succès
            </CardTitle>
            <CardDescription className="text-green-200">
              Référence: {createdPayment.reference_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-green-200">Montant</label>
                <p className="text-white">{createdPayment.amount} {createdPayment.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-green-200">Équivalent USDT</label>
                <p className="text-white">{createdPayment.usdt_amount.toFixed(6)} USDT</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-200">Lien de paiement</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-gray-900 rounded border border-green-600">
                  <code className="text-green-400 text-sm break-all">
                    https://pay.terex.com/{createdPayment.reference_number}
                  </code>
                </div>
                <Button size="sm" variant="outline" onClick={copyPaymentLink} className="border-green-600">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-green-600">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-900 rounded border border-green-600">
              <p className="text-green-200 text-sm">
                💡 <strong>Conseil:</strong> Partagez ce lien avec votre client ou générez un QR code 
                pour un paiement rapide en magasin.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
