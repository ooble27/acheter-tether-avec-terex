
import { ProductCard } from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  wishlistItems?: string[];
}

export function ProductGrid({ 
  products, 
  loading, 
  onAddToCart, 
  onAddToWishlist, 
  wishlistItems = [] 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg animate-pulse">
            <div className="aspect-square bg-slate-700 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-3 bg-slate-700 rounded w-3/4"></div>
              <div className="h-6 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl text-slate-600 mb-4">🛍️</div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
        <p className="text-slate-400">
          Essayez de modifier vos filtres ou explorez d'autres catégories
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={wishlistItems.includes(product.id)}
        />
      ))}
    </div>
  );
}
