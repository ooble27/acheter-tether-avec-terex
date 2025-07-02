
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  brand: string;
  stock_quantity: number;
  images: string[];
  specifications: any;
}

interface ProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductModal({ product, open, onOpenChange, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    onOpenChange(false);
  };

  const specifications = product.specifications || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-terex-darker border-terex-accent/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-terex-accent text-xl">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-terex-dark rounded-lg overflow-hidden">
              {product.images[selectedImage] ? (
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">
                  📦
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-terex-accent' 
                        : 'border-terex-accent/30 hover:border-terex-accent/60'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <Badge className="bg-terex-accent text-black mb-2">
                  {product.brand}
                </Badge>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">
                {product.name}
              </h2>
              <p className="text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(4.8/5 - 24 avis)</span>
            </div>

            <div className="bg-terex-dark p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-terex-accent">
                  {formatPrice(product.price)} {product.currency}
                </span>
                <span className="text-gray-400">
                  Stock: {product.stock_quantity} disponible{product.stock_quantity > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Spécifications */}
            {Object.keys(specifications).length > 0 && (
              <div className="bg-terex-dark p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Spécifications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-white font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantité et achat */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-white">Quantité:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 border-terex-accent/30"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-white min-w-[3rem] text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 border-terex-accent/30"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold"
                size="lg"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier - {formatPrice(product.price * quantity)} {product.currency}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
