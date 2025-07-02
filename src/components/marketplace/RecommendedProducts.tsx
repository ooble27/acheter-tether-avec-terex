
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  brand?: string;
  stock_quantity: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
}

interface RecommendedProductsProps {
  products: Product[];
  title: string;
  onAddToCart: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistItems?: string[];
}

export function RecommendedProducts({ 
  products, 
  title, 
  onAddToCart, 
  onToggleWishlist,
  wishlistItems = []
}: RecommendedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 4).map(product => (
          <Card 
            key={product.id}
            className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 group hover:scale-105"
          >
            <CardHeader className="p-4 relative">
              {/* Badges */}
              <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                {product.isNew && (
                  <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                    Nouveau
                  </Badge>
                )}
                {product.isPopular && (
                  <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
                    Populaire
                  </Badge>
                )}
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                    Stock limité
                  </Badge>
                )}
              </div>

              {/* Wishlist */}
              {onToggleWishlist && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      wishlistItems.includes(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400'
                    }`} 
                  />
                </Button>
              )}

              <div className="aspect-square bg-terex-dark rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">📦</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm group-hover:text-terex-accent transition-colors line-clamp-1">
                    {product.name}
                  </CardTitle>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-400">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                {product.brand && (
                  <Badge variant="secondary" className="w-fit text-xs">
                    {product.brand}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-terex-accent font-bold text-lg">
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
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>

              {product.reviewCount && (
                <p className="text-gray-400 text-xs">
                  {product.reviewCount} avis client{product.reviewCount > 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
