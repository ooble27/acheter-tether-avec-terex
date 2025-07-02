
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketplaceCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarketplaceCart({ open, onOpenChange }: MarketplaceCartProps) {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useMarketplace();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/marketplace/checkout');
  };

  const total = getCartTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-terex-darker border-terex-accent/30 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-terex-accent">
            Votre Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Votre panier est vide</p>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-terex-accent text-black hover:bg-terex-accent/90"
            >
              Continuer les achats
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="bg-terex-dark border-terex-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-terex-darker rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {item.product?.name}
                      </h3>
                      {item.product?.brand && (
                        <Badge variant="secondary" className="text-xs">
                          {item.product.brand}
                        </Badge>
                      )}
                      <p className="text-terex-accent font-bold">
                        {formatPrice(item.product?.price || 0)} {item.product?.currency}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-terex-accent/30"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-terex-accent/30"
                        disabled={(item.product?.stock_quantity || 0) <= item.quantity}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="border-t border-terex-accent/20 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-terex-accent">
                  {formatPrice(total)} CFA
                </span>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Procéder au paiement
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="w-full border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                >
                  Continuer les achats
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
