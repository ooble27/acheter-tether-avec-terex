
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  brand: string;
  stock_quantity: number;
  images: string[];
  specifications: any;
  is_active: boolean;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onAddToCart, onAddToWishlist, isInWishlist }: ProductCardProps) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleProductClick = () => {
    navigate(`/marketplace/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  return (
    <Card 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div className="relative">
        {/* Image Container */}
        <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <div className="text-6xl">📦</div>
            </div>
          )}
          
          {/* Overlay with actions */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-none"
                onClick={handleAddToWishlist}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-none"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock_quantity === 0 ? 'Rupture' : 'Ajouter'}
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.brand && (
              <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                {product.brand}
              </Badge>
            )}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <Badge variant="destructive" className="bg-red-600/80 backdrop-blur-sm">
                Stock faible
              </Badge>
            )}
            {product.stock_quantity === 0 && (
              <Badge variant="destructive" className="bg-red-800/80 backdrop-blur-sm">
                Épuisé
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Rating */}
          <div>
            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-terex-accent transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-600'
                  }`}
                />
              ))}
              <span className="text-xs text-slate-400 ml-1">(24)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-xs line-clamp-2">
            {product.description}
          </p>

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-terex-accent font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              <span className="text-terex-accent text-sm ml-1">
                {product.currency}
              </span>
            </div>
            <span className="text-slate-500 text-xs">
              {product.stock_quantity} en stock
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={handleProductClick}
            >
              Détails
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-terex-accent hover:bg-terex-accent/90 text-black"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              Acheter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
