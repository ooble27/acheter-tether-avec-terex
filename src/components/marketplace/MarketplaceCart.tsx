
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface MarketplaceCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout?: () => void;
}

export function MarketplaceCart({ open, onOpenChange, onCheckout }: MarketplaceCartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useMarketplace();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const total = getCartTotal();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 bg-terex-darker border-l border-terex-accent/20">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Panier ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Votre panier est vide</p>
              </div>
            </div>
          ) : (
            <>
              {/* Articles du panier */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-terex-dark p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-terex-darker rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-500 text-2xl">📦</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm mb-1 truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-terex-accent font-semibold text-sm">
                          {formatPrice(item.product?.price || 0)} CFA
                        </p>
                        
                        {/* Contrôles quantité */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              variant="outline"
                              size="sm"
                              className="w-7 h-7 p-0 border-terex-accent/30"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-white text-sm min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              variant="outline"
                              size="sm"
                              className="w-7 h-7 p-0 border-terex-accent/30"
                              disabled={item.quantity >= (item.product?.stock_quantity || 0)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total et checkout */}
              <div className="border-t border-terex-accent/20 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-terex-accent font-bold text-lg">
                    {formatPrice(total)} CFA
                  </span>
                </div>
                
                <Button
                  onClick={onCheckout}
                  className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold"
                  size="lg"
                >
                  Procéder au paiement
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
