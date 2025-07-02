
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/use-toast';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useMarketplace();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sénégal'
  });

  const total = getCartTotal();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleBack = () => {
    navigate('/marketplace');
  };

  const handlePayment = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir toutes les informations de livraison",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer la commande
      const orderData = {
        items: cartItems,
        total: total,
        paymentMethod: paymentMethod,
        shippingInfo: shippingInfo,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Sauvegarder la commande localement (en attendant la base de données)
      const existingOrders = JSON.parse(localStorage.getItem('terex_orders') || '[]');
      existingOrders.push({ ...orderData, id: Date.now().toString() });
      localStorage.setItem('terex_orders', JSON.stringify(existingOrders));
      
      toast({
        title: "Commande confirmée !",
        description: `Paiement via ${paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'orange' ? 'Orange Money' : 'USDT'} réussi. Numéro de commande: #${Date.now()}`,
        className: "bg-green-600 text-white border-green-600",
      });

      // Vider le panier
      if (clearCart) {
        await clearCart();
      }
      
      navigate('/marketplace');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter le paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-terex-dark p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-terex-darker border-terex-accent/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Panier vide</h3>
            <p className="text-gray-400 mb-6">Votre panier est vide</p>
            <Button onClick={handleBack} className="bg-terex-accent text-black">
              Retourner à la boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations de livraison */}
          <Card className="bg-terex-darker border-terex-accent/30">
            <CardHeader>
              <CardTitle className="text-white">Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Nom complet *</Label>
                  <Input
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="bg-terex-dark border-terex-accent/30 text-white"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Téléphone *</Label>
                  <Input
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="bg-terex-dark border-terex-accent/30 text-white"
                    placeholder="+221 77 123 45 67"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Adresse *</Label>
                <Input
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className="bg-terex-dark border-terex-accent/30 text-white"
                  placeholder="Votre adresse complète"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Ville</Label>
                  <Input
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="bg-terex-dark border-terex-accent/30 text-white"
                    placeholder="Dakar"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Pays</Label>
                  <Input
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="bg-terex-dark border-terex-accent/30 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement et récap */}
          <div className="space-y-6">
            {/* Récapitulatif */}
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-300">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="text-white font-semibold">
                      {formatPrice((item.product?.price || 0) * item.quantity)} CFA
                    </span>
                  </div>
                ))}
                <div className="border-t border-terex-accent/30 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-terex-accent font-bold">
                      {formatPrice(total)} CFA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Méthodes de paiement */}
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Méthode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Wave */}
                    <div className="flex items-center space-x-2 p-4 border border-terex-accent/30 rounded-lg">
                      <RadioGroupItem value="wave" id="wave" />
                      <label htmlFor="wave" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <img 
                          src="/lovable-uploads/52b82a09-1493-4fdf-8589-0e3497357f07.png" 
                          alt="Wave" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">Wave</p>
                          <p className="text-gray-400 text-sm">Paiement mobile instantané</p>
                        </div>
                      </label>
                    </div>

                    {/* Orange Money */}
                    <div className="flex items-center space-x-2 p-4 border border-terex-accent/30 rounded-lg">
                      <RadioGroupItem value="orange" id="orange" />
                      <label htmlFor="orange" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <img 
                          src="/lovable-uploads/62ebb1fa-b6ad-4de9-b63e-14b9a3baaf99.png" 
                          alt="Orange Money" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">Orange Money</p>
                          <p className="text-gray-400 text-sm">Paiement mobile sécurisé</p>
                        </div>
                      </label>
                    </div>

                    {/* USDT */}
                    <div className="flex items-center space-x-2 p-4 border border-terex-accent/30 rounded-lg">
                      <RadioGroupItem value="usdt" id="usdt" />
                      <label htmlFor="usdt" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <img 
                          src="https://cryptologos.cc/logos/tether-usdt-logo.png" 
                          alt="USDT Tether" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">USDT (Tether)</p>
                          <p className="text-gray-400 text-sm">Paiement en cryptomonnaie</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full mt-6 bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold h-12"
                >
                  {loading ? 'Traitement...' : `Payer ${formatPrice(total)} CFA`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
