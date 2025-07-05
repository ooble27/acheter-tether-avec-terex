
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  brand?: string;
  stock_quantity: number;
  images: string[];
}

interface ProductRecommendationsProps {
  products: Product[];
  title: string;
}

export function ProductRecommendations({ products, title }: ProductRecommendationsProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card 
            key={product.id}
            className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group"
            onClick={() => handleProductClick(product.id)}
          >
            <CardHeader className="p-4">
              <div className="aspect-square bg-terex-dark rounded-lg mb-3 overflow-hidden">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                    📦
                  </div>
                )}
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
                    handleProductClick(product.id);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 text-xs"
                >
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
