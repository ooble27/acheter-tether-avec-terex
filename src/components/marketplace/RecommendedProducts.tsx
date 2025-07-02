
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  brand?: string;
  images: string[];
  stock_quantity: number;
}

interface RecommendedProductsProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export function RecommendedProducts({ products, onAddToCart, onProductClick }: RecommendedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Produits recommandés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map(product => (
          <Card 
            key={product.id}
            className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => onProductClick(product)}
          >
            <CardHeader className="p-4">
              <div className="aspect-square bg-terex-dark rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">📦</div>
                )}
              </div>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400 text-xs">(4.8)</span>
              </div>
              <CardTitle className="text-white text-sm group-hover:text-terex-accent transition-colors line-clamp-2">
                {product.name}
              </CardTitle>
              {product.brand && (
                <Badge variant="secondary" className="w-fit text-xs">
                  {product.brand}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-terex-accent font-bold">
                    {formatPrice(product.price)} {product.currency}
                  </span>
                  <p className="text-gray-500 text-xs">
                    Stock: {product.stock_quantity}
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product.id);
                  }}
                  size="sm"
                  className="bg-terex-accent text-black hover:bg-terex-accent/90"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
