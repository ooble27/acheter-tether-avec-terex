
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Store, CreditCard, Smartphone, Users } from 'lucide-react';
import { useMerchantAccount } from '@/hooks/useMerchantAccount';

export const MerchantAccountSetup = () => {
  const { createMerchantAccount } = useMerchantAccount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    webhook_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createMerchantAccount(formData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section héroïque */}
      <div className="text-center mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-b from-blue-900 to-blue-800 border-blue-700">
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Commerce physique</h3>
              <p className="text-blue-200 text-sm">
                Acceptez les paiements crypto dans votre boutique
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-green-900 to-green-800 border-green-700">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">E-commerce</h3>
              <p className="text-green-200 text-sm">
                Intégrez les paiements crypto sur votre site web
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-purple-900 to-purple-800 border-purple-700">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Services</h3>
              <p className="text-purple-200 text-sm">
                Facturez vos clients en cryptomonnaies
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulaire de création */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Créer votre compte marchand</CardTitle>
          <CardDescription className="text-gray-400">
            Remplissez les informations de votre entreprise pour commencer à accepter les paiements crypto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business_name" className="text-gray-300">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="Ex: Boutique Teranga"
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type" className="text-gray-300">
                  Type d'entreprise *
                </Label>
                <Select onValueChange={(value) => handleInputChange('business_type', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="retail">Commerce de détail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_email" className="text-gray-300">
                  Email professionnel *
                </Label>
                <Input
                  id="business_email"
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                  placeholder="contact@monentreprise.com"
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_phone" className="text-gray-300">
                  Téléphone
                </Label>
                <Input
                  id="business_phone"
                  value={formData.business_phone}
                  onChange={(e) => handleInputChange('business_phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address" className="text-gray-300">
                Adresse de l'entreprise
              </Label>
              <Textarea
                id="business_address"
                value={formData.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                placeholder="Adresse complète de votre entreprise"
                className="bg-gray-900 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook_url" className="text-gray-300">
                URL Webhook (optionnel)
              </Label>
              <Input
                id="webhook_url"
                type="url"
                value={formData.webhook_url}
                onChange={(e) => handleInputChange('webhook_url', e.target.value)}
                placeholder="https://monsite.com/webhook"
                className="bg-gray-900 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                URL pour recevoir les notifications de paiement en temps réel
              </p>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !formData.business_name || !formData.business_type || !formData.business_email}
                className="bg-terex-orange hover:bg-terex-orange/90"
              >
                {loading ? "Création..." : "Créer mon compte marchand"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
