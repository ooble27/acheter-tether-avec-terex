
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, ShoppingCart, ArrowLeft, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceCart } from '@/components/marketplace/MarketplaceCart';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { CheckoutPage } from '@/components/marketplace/CheckoutPage';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { ProductViewToggle } from '@/components/marketplace/ProductViewToggle';
import { ProductSort } from '@/components/marketplace/ProductSort';
import { CategoryGrid } from '@/components/marketplace/CategoryGrid';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';

export function MarketplacePage() {
  const navigate = useNavigate();
  const { products, categories, cartItems, loading, fetchProducts, addToCart } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [view, setView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: null,
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Si on est en mode checkout
  if (showCheckout) {
    return <CheckoutPage />;
  }

  // Obtenir toutes les marques uniques
  const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const maxPrice = Math.max(...products.map(p => p.price));

  // Filtrer et trier les produits
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesFilters = 
      (!filters.categories.length || filters.categories.includes(product.category_id)) &&
      (!filters.brands.length || filters.brands.includes(product.brand)) &&
      (!filters.priceRange || (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1])) &&
      (!filters.inStock || product.stock_quantity > 0);
    
    return matchesSearch && matchesCategory && matchesFilters;
  });

  // Appliquer le tri
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'newest':
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: null,
      inStock: false
    });
    setSelectedCategory('');
    setSearchTerm('');
  };

  const getGridClasses = () => {
    switch (view) {
      case 'list': return 'grid grid-cols-1 gap-4';
      case 'compact': return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3';
      case 'grid':
      default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Catégories */}
        <CategoryGrid
          categories={categories}
          onCategoryClick={(categoryId) => {
            setSelectedCategory(categoryId);
            fetchProducts(categoryId || undefined);
          }}
          selectedCategory={selectedCategory}
        />

        {/* Produits recommandés */}
        <RecommendedProducts
          products={products}
          onProductClick={setSelectedProduct}
          onAddToCart={addToCart}
        />

        <div className="flex gap-8">
          {/* Sidebar des filtres */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <MarketplaceFilters
              categories={categories}
              brands={allBrands}
              priceRange={[0, maxPrice]}
              maxPrice={maxPrice}
              onFiltersChange={setFilters}
              selectedFilters={filters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre de recherche et contrôles */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher des produits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-terex-darker border-terex-accent/30 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                  <ProductViewToggle view={view} onViewChange={setView} />
                </div>
              </div>
              
              {/* Résultats et filtres actifs */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="lg:hidden border-terex-accent/30 text-terex-accent"
                >
                  Filtres
                </Button>
              </div>
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">Chargement des produits...</p>
              </div>
            ) : (
              <div className={getGridClasses()}>
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id}
                    className={`bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group ${
                      view === 'list' ? 'flex flex-row' : ''
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <CardHeader className={`${view === 'compact' ? 'p-3' : 'p-4'} ${view === 'list' ? 'w-1/3' : ''}`}>
                      <div className={`${view === 'compact' ? 'aspect-square' : 'aspect-square'} bg-terex-dark rounded-lg mb-3 flex items-center justify-center relative overflow-hidden`}>
                        {product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="text-gray-500 text-4xl">📦</div>
                        )}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Ajouter à la wishlist
                          }}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </Button>
                        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                          <Badge className="absolute top-2 left-2 bg-orange-600 text-white">
                            Stock limité
                          </Badge>
                        )}
                        {product.stock_quantity === 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                            Épuisé
                          </Badge>
                        )}
                      </div>
                      {view !== 'list' && (
                        <>
                          <CardTitle className={`text-white ${view === 'compact' ? 'text-xs' : 'text-sm'} group-hover:text-terex-accent transition-colors line-clamp-2`}>
                            {product.name}
                          </CardTitle>
                          {product.brand && (
                            <Badge variant="secondary" className="w-fit">
                              {product.brand}
                            </Badge>
                          )}
                        </>
                      )}
                    </CardHeader>
                    <CardContent className={`${view === 'compact' ? 'p-3 pt-0' : 'p-4 pt-0'} ${view === 'list' ? 'flex-1' : ''}`}>
                      {view === 'list' && (
                        <div className="mb-3">
                          <CardTitle className="text-white text-lg group-hover:text-terex-accent transition-colors">
                            {product.name}
                          </CardTitle>
                          {product.brand && (
                            <Badge variant="secondary" className="w-fit mt-1">
                              {product.brand}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {(view === 'grid' || view === 'list') && (
                        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">(4.8)</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className={`text-terex-accent font-bold ${view === 'compact' ? 'text-sm' : 'text-lg'}`}>
                            {formatPrice(product.price)} CFA
                          </span>
                          <p className="text-gray-500 text-xs">
                            Stock: {product.stock_quantity}
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          size={view === 'compact' ? 'sm' : 'default'}
                          className="bg-terex-accent text-black hover:bg-terex-accent/90 ml-2"
                          disabled={product.stock_quantity === 0}
                        >
                          {view === 'compact' ? '+' : 'Ajouter'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">Aucun produit trouvé</p>
                <Button onClick={clearFilters} className="bg-terex-accent text-black">
                  Effacer tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtres mobiles */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-terex-dark p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Filtres</h3>
              <Button
                onClick={() => setShowFilters(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400"
              >
                ✕
              </Button>
            </div>
            <MarketplaceFilters
              categories={categories}
              brands={allBrands}
              priceRange={[0, maxPrice]}
              maxPrice={maxPrice}
              onFiltersChange={setFilters}
              selectedFilters={filters}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      )}

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
