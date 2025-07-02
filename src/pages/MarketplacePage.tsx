
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, ShoppingCart, ArrowLeft, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceCart } from '@/components/marketplace/MarketplaceCart';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { CheckoutPage } from '@/components/marketplace/CheckoutPage';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { ProductViewToggle, ViewType } from '@/components/marketplace/ProductViewToggle';
import { ProductSort, SortOption } from '@/components/marketplace/ProductSort';
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
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Si on est en mode checkout
  if (showCheckout) {
    return <CheckoutPage />;
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
    const matchesStock = !inStockOnly || product.stock_quantity > 0;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesStock;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'popular': return b.stock_quantity - a.stock_quantity;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category_id === cat.id).length
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId || undefined);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 500000]);
    setSelectedBrands([]);
    setInStockOnly(false);
    fetchProducts();
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderProductCard = (product: any) => {
    const isInWishlist = wishlist.includes(product.id);
    
    if (viewType === 'list') {
      return (
        <Card 
          key={product.id}
          className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-terex-dark rounded-lg flex items-center justify-center flex-shrink-0">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-500 text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium hover:text-terex-accent transition-colors">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <Badge variant="secondary" className="mt-1">
                        {product.brand}
                      </Badge>
                    )}
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-terex-accent font-bold text-lg">
                      {formatPrice(product.price)} {product.currency}
                    </div>
                    <p className="text-gray-500 text-xs">Stock: {product.stock_quantity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">(4.8)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className={`p-2 ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      size="sm"
                      className="bg-terex-accent text-black hover:bg-terex-accent/90"
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Vue grille et compacte
    const cardClass = viewType === 'compact' 
      ? 'bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group'
      : 'bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group hover:scale-105';

    return (
      <Card 
        key={product.id}
        className={cardClass}
        onClick={() => setSelectedProduct(product)}
      >
        <CardHeader className={viewType === 'compact' ? 'p-3' : 'p-4'}>
          <div className="relative">
            <div className={`aspect-square bg-terex-dark rounded-lg mb-3 flex items-center justify-center overflow-hidden ${
              viewType === 'compact' ? 'mb-2' : ''
            }`}>
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
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 ${
                isInWishlist ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-gray-400 text-xs">(4.8)</span>
          </div>
          
          <CardTitle className={`text-white group-hover:text-terex-accent transition-colors ${
            viewType === 'compact' ? 'text-sm line-clamp-1' : 'text-sm line-clamp-2'
          }`}>
            {product.name}
          </CardTitle>
          
          {product.brand && (
            <Badge variant="secondary" className="w-fit text-xs">
              {product.brand}
            </Badge>
          )}
          
          {product.stock_quantity === 0 && (
            <Badge variant="destructive" className="w-fit text-xs">
              Rupture de stock
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className={viewType === 'compact' ? 'p-3 pt-0' : 'p-4 pt-0'}>
          {viewType !== 'compact' && (
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
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
                addToCart(product.id);
              }}
              size="sm"
              className="bg-terex-accent text-black hover:bg-terex-accent/90"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
        {/* Grille de catégories */}
        <CategoryGrid 
          categories={categoriesWithCount}
          onCategorySelect={handleCategorySelect}
        />

        {/* Produits recommandés */}
        <RecommendedProducts 
          products={products.slice(0, 4)}
          onAddToCart={addToCart}
          onProductClick={setSelectedProduct}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres sidebar */}
          <div className="lg:col-span-1">
            <MarketplaceFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategorySelect}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandToggle={(brand) => {
                setSelectedBrands(prev => 
                  prev.includes(brand) 
                    ? prev.filter(b => b !== brand)
                    : [...prev, brand]
                );
              }}
              availableBrands={availableBrands}
              inStockOnly={inStockOnly}
              onInStockToggle={setInStockOnly}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Barre de recherche et contrôles */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terex-darker border-terex-accent/30 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                  <span className="text-gray-400 text-sm">
                    {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
                  </span>
                </div>
                <ProductViewToggle currentView={viewType} onViewChange={setViewType} />
              </div>
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">Chargement des produits...</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewType === 'list' 
                  ? 'grid-cols-1' 
                  : viewType === 'compact'
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {sortedProducts.map(renderProductCard)}
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucun produit trouvé</p>
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
