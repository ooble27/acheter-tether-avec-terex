
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, X, Plus, ShoppingCart, Star } from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';

export function ComparePage() {
  const navigate = useNavigate();
  const { products, addToCart } = useMarketplace();
  const [compareItems, setCompareItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('terex_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const compareProducts = products.filter(p => compareItems.includes(p.id));
  const availableProducts = products.filter(p => !compareItems.includes(p.id));

  const addToCompare = (productId: string) => {
    if (compareItems.length < 4 && !compareItems.includes(productId)) {
      const updated = [...compareItems, productId];
      setCompareItems(updated);
      localStorage.setItem('terex_compare', JSON.stringify(updated));
    }
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareItems.filter(id => id !== productId);
    setCompareItems(updated);
    localStorage.setItem('terex_compare', JSON.stringify(updated));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getAllSpecs = () => {
    const allSpecs = new Set<string>();
    compareProducts.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allSpecs.add(key));
      }
    });
    return Array.from(allSpecs);
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
            
            <h1 className="text-xl font-bold text-white">Comparaison de Produits</h1>
            
            <div className="text-sm text-gray-400">
              {compareProducts.length}/4 produits
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {compareProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-terex-darker rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-terex-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Aucun produit à comparer</h2>
            <p className="text-gray-400 mb-6">Ajoutez des produits pour les comparer côte à côte</p>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Produits populaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableProducts.slice(0, 6).map(product => (
                  <Card 
                    key={product.id}
                    className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all cursor-pointer"
                    onClick={() => addToCompare(product.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="aspect-square bg-terex-dark rounded-lg mb-2 overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-2xl">📦</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">📦</div>
                        )}
                      </div>
                      <CardTitle className="text-white text-sm">{product.name}</CardTitle>
                      <p className="text-terex-accent font-bold">
                        {formatPrice(product.price)} {product.currency}
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Grille de comparaison */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {compareProducts.map(product => (
                    <Card key={product.id} className="bg-terex-darker border-terex-accent/30">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {product.brand}
                          </Badge>
                          <Button
                            onClick={() => removeFromCompare(product.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="aspect-square bg-terex-dark rounded-lg mb-3 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-3xl">📦</div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl">📦</div>
                          )}
                        </div>
                        
                        <CardTitle className="text-white text-sm mb-2">
                          {product.name}
                        </CardTitle>
                        
                        <div className="text-2xl font-bold text-terex-accent mb-4">
                          {formatPrice(product.price)} {product.currency}
                        </div>
                        
                        <Button
                          onClick={() => addToCart(product.id)}
                          size="sm"
                          className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 mb-4"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400 text-xs">Stock:</span>
                            <span className="text-white text-sm ml-2">{product.stock_quantity}</span>
                          </div>
                          
                          {getAllSpecs().map(spec => (
                            <div key={spec}>
                              <span className="text-gray-400 text-xs capitalize">
                                {spec.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-white text-sm ml-2">
                                {product.specifications?.[spec] || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Ajouter un produit */}
                  {compareProducts.length < 4 && (
                    <Card className="bg-terex-darker border-terex-accent/30 border-dashed">
                      <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                        <div className="w-16 h-16 bg-terex-accent/10 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-terex-accent" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Ajouter un produit</h3>
                        <p className="text-gray-400 text-sm text-center mb-4">
                          Sélectionnez un produit pour le comparer
                        </p>
                        <Button
                          onClick={() => navigate('/marketplace')}
                          variant="outline"
                          className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                        >
                          Parcourir
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
