
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, ShoppingCart, ArrowLeft, Star, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceCart } from '@/components/marketplace/MarketplaceCart';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { CheckoutPage } from '@/components/marketplace/CheckoutPage';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { ProductSort, type SortOption } from '@/components/marketplace/ProductSort';
import { ProductViewToggle, type ViewMode } from '@/components/marketplace/ProductViewToggle';
import { CategoryGrid } from '@/components/marketplace/CategoryGrid';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { WishlistButton } from '@/components/marketplace/WishlistButton';

export function MarketplacePage() {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    cartItems, 
    wishlistItems,
    loading, 
    fetchProducts, 
    addToCart,
    toggleWishlist 
  } = useMarketplace();

  // États pour les filtres et l'affichage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // États pour le tri et l'affichage
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');
  
  // États pour les modals
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Calculs pour les filtres
  const brands = useMemo(() => {
    return [...new Set(products.map(p => p.brand).filter(Boolean))];
  }, [products]);

  const priceRange: [number, number] = useMemo(() => {
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>(priceRange);

  // Mise à jour de la plage de prix quand les produits changent
  useEffect(() => {
    setSelectedPriceRange(priceRange);
  }, [priceRange]);

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
      const matchesPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
      const matchesStock = !inStockOnly || product.stock_quantity > 0;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'stock-high':
          return b.stock_quantity - a.stock_quantity;
        case 'stock-low':
          return a.stock_quantity - b.stock_quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrands, selectedPriceRange, inStockOnly, sortBy]);

  // Produits recommandés
  const recommendedProducts = useMemo(() => {
    return products
      .filter(p => p.isPopular || p.rating && p.rating > 4.5)
      .slice(0, 4);
  }, [products]);

  // Nouveaux produits
  const newProducts = useMemo(() => {
    return products
      .filter(p => p.isNew)
      .slice(0, 4);
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setSelectedPriceRange(priceRange);
    setInStockOnly(false);
    setSearchTerm('');
  };

  // Classes CSS pour les différentes vues
  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid-4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'grid-3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'grid-2':
        return 'grid-cols-1 md:grid-cols-2';
      case 'list':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (showCheckout) {
    return <CheckoutPage />;
  }

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-bold text-white">
                Terex <span className="text-terex-accent">Shop</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowCart(true)}
                variant="outline"
                className="relative border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Panier
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-terex-accent text-black px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section des catégories */}
        {!selectedCategory && (
          <CategoryGrid 
            categories={categories} 
            onCategorySelect={setSelectedCategory}
          />
        )}

        {/* Produits recommandés */}
        {!selectedCategory && recommendedProducts.length > 0 && (
          <RecommendedProducts
            products={recommendedProducts}
            title="Produits populaires"
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
          />
        )}

        {/* Nouveaux produits */}
        {!selectedCategory && newProducts.length > 0 && (
          <RecommendedProducts
            products={newProducts}
            title="Nouveautés"
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
          />
        )}

        <div className="flex gap-8">
          {/* Filtres (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <MarketplaceFilters
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              selectedCategory={selectedCategory}
              selectedBrands={selectedBrands}
              selectedPriceRange={selectedPriceRange}
              inStockOnly={inStockOnly}
              onCategoryChange={setSelectedCategory}
              onBrandsChange={setSelectedBrands}
              onPriceRangeChange={setSelectedPriceRange}
              onStockFilterChange={setInStockOnly}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre de recherche et contrôles */}
            <div className="mb-6 space-y-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits, marques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terex-darker border-terex-accent/30 text-white placeholder-gray-400 h-12"
                />
              </div>

              {/* Contrôles de tri et d'affichage */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                  
                  {/* Filtres mobile */}
                  <Button
                    variant="outline"
                    className="lg:hidden border-terex-accent/30 text-terex-accent"
                    onClick={() => setShowFilters(true)}
                  >
                    Filtres
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <ProductViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                  <span className="text-gray-400 text-sm">
                    {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">Chargement des produits...</p>
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className={`grid ${getGridClasses()} gap-6`}>
                {filteredAndSortedProducts.map(product => (
                  <Card 
                    key={product.id}
                    className={`bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
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
                              Stock limité ({product.stock_quantity})
                            </Badge>
                          )}
                          {product.stock_quantity === 0 && (
                            <Badge className="bg-gray-600 text-white text-xs px-2 py-1">
                              Rupture
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist */}
                        <WishlistButton
                          productId={product.id}
                          isInWishlist={wishlistItems.includes(product.id)}
                          onToggle={toggleWishlist}
                          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
                        />

                        <div className="aspect-square bg-terex-dark rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
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
                            <div className="text-gray-500 text-4xl">📦</div>
                          )}
                        </div>
                      </CardHeader>
                    </div>

                    <div className={`flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2 mb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-white text-sm group-hover:text-terex-accent transition-colors line-clamp-2">
                              {product.name}
                            </CardTitle>
                            {product.rating && (
                              <div className="flex items-center space-x-1 ml-2">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-400">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {product.brand && (
                            <Badge variant="secondary" className="w-fit">
                              {product.brand}
                            </Badge>
                          )}

                          {viewMode === 'list' && (
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-terex-accent font-bold text-lg">
                              {formatPrice(product.price)} {product.currency}
                            </span>
                            <p className="text-gray-500 text-xs">
                              Stock: {product.stock_quantity}
                            </p>
                            {product.reviewCount && (
                              <p className="text-gray-400 text-xs">
                                {product.reviewCount} avis
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            size="sm"
                            className="bg-terex-accent text-black hover:bg-terex-accent/90"
                            disabled={product.stock_quantity === 0}
                          >
                            {product.stock_quantity === 0 ? 'Rupture' : 'Ajouter'}
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun produit trouvé</p>
                <p className="text-gray-500 text-sm mt-2">
                  Essayez d'ajuster vos filtres ou votre recherche
                </p>
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4 border-terex-accent/30 text-terex-accent"
                >
                  Effacer tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panier modal */}
      <MarketplaceCart
        open={showCart}
        onOpenChange={setShowCart}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      {/* Modal produit */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
