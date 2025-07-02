
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

interface RecommendedProductsProps {
  products: any[];
  onProductClick: (product: any) => void;
  onAddToCart: (productId: string) => void;
}

export function RecommendedProducts({ products, onProductClick, onAddToCart }: RecommendedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const recommendedProducts = products.slice(0, 4);

  return (
    <Card className="bg-terex-darker border-terex-accent/30 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
          Produits Recommandés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-terex-dark rounded-lg p-4 hover:bg-terex-dark/80 transition-colors cursor-pointer group"
              onClick={() => onProductClick(product)}
            >
              <div className="aspect-square bg-terex-darker rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="text-gray-500 text-2xl">📦</div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white text-sm font-medium truncate group-hover:text-terex-accent transition-colors">
                  {product.name}
                </h4>
                
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">(4.8)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-terex-accent font-semibold text-sm">
                      {formatPrice(product.price)} CFA
                    </span>
                    {product.brand && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {product.brand}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product.id);
                  }}
                  size="sm"
                  className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 text-xs"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
