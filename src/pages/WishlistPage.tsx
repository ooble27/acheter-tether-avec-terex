
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';

export function WishlistPage() {
  const navigate = useNavigate();
  const { products, addToCart } = useMarketplace();
  const [wishlistItems, setWishlistItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('terex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const wishlistProducts = products.filter(p => wishlistItems.includes(p.id));

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter(id => id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('terex_wishlist', JSON.stringify(updated));
  };

  const addToWishlist = (productId: string) => {
    if (!wishlistItems.includes(productId)) {
      const updated = [...wishlistItems, productId];
      setWishlistItems(updated);
      localStorage.setItem('terex_wishlist', JSON.stringify(updated));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('terex_wishlist');
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={() => navigate('/marketplace')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Boutique
            </Button>
            
            <h1 className="text-xl font-bold text-white">Ma Liste de Souhaits</h1>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
              {wishlistItems.length > 0 && (
                <Button 
                  onClick={clearWishlist}
                  variant="outline" 
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vider
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Votre liste est vide</h2>
            <p className="text-gray-400 mb-6">Ajoutez des produits à votre liste de souhaits pour les retrouver facilement</p>
            <Button onClick={() => navigate('/marketplace')}>
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {wishlistProducts.length} produit{wishlistProducts.length > 1 ? 's' : ''} dans votre liste
              </h2>
              <Button 
                onClick={() => {
                  wishlistProducts.forEach(product => addToCart(product.id));
                }}
                className="bg-terex-accent text-black hover:bg-terex-accent/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tout ajouter au panier
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map(product => (
                <Card 
                  key={product.id}
                  className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all group"
                >
                  <CardHeader className="p-4">
                    <div className="relative">
                      <div 
                        className="aspect-square bg-terex-dark rounded-lg mb-3 overflow-hidden cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-4xl">📦</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">📦</div>
                        )}
                      </div>
                      <Button
                        onClick={() => removeFromWishlist(product.id)}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/20 text-red-400"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    
                    <CardTitle 
                      className="text-white text-sm group-hover:text-terex-accent transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </CardTitle>
                    {product.brand && (
                      <Badge variant="secondary" className="w-fit">
                        {product.brand}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-terex-accent font-bold text-lg">
                        {formatPrice(product.price)} {product.currency}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <Button
                      onClick={() => addToCart(product.id)}
                      size="sm"
                      className="w-full bg-terex-accent text-black hover:bg-terex-accent/90"
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
