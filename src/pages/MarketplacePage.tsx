
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/hooks/useMarketplace';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { PriceFilter } from '@/components/marketplace/PriceFilter';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { MarketplaceCart } from '@/components/marketplace/MarketplaceCart';
import { CheckoutPage } from '@/components/marketplace/CheckoutPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, Star, Filter, X } from 'lucide-react';

export function MarketplacePage() {
  const navigate = useNavigate();
  const { products, categories, cartItems, loading, fetchProducts, addToCart } = useMarketplace();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('terex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Checkout mode
  if (showCheckout) {
    return <CheckoutPage />;
  }

  // Get unique brands
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  
  // Calculate price bounds
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default: return 0;
    }
  });

  // Calculate product counts by category
  const productCounts = {
    all: products.length,
    ...categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: products.filter(p => p.category_id === cat.id).length
    }), {})
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAddToWishlist = (productId: string) => {
    const updated = wishlistItems.includes(productId)
      ? wishlistItems.filter(id => id !== productId)
      : [...wishlistItems, productId];
    setWishlistItems(updated);
    localStorage.setItem('terex_wishlist', JSON.stringify(updated));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchTerm('');
  };

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    selectedBrands.length + 
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <MarketplaceHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onWishlistClick={() => navigate('/marketplace/wishlist')}
        onFiltersClick={() => setShowFilters(!showFilters)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="bg-terex-accent text-black">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h2>
              {activeFiltersCount > 0 && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(id) => {
                setSelectedCategory(id);
                fetchProducts(id || undefined);
              }}
              productCounts={productCounts}
            />

            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />

            {/* Brand Filter */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  🏢 Marques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                    />
                    <label htmlFor={brand} className="text-slate-300 text-sm cursor-pointer flex-1">
                      {brand}
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {products.filter(p => p.brand === brand).length}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Products */}
            <Card className="bg-gradient-to-br from-terex-accent/10 to-slate-900/50 border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-terex-accent" />
                  Populaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {products.slice(0, 3).map(product => (
                  <div 
                    key={product.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.name}</p>
                      <p className="text-terex-accent text-sm font-bold">
                        {new Intl.NumberFormat('fr-FR').format(product.price)} CFA
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {selectedCategory ? 
                    categories.find(c => c.id === selectedCategory)?.name || 'Boutique' : 
                    'Boutique Terex'
                  }
                </h1>
                <p className="text-slate-400">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-terex-accent focus:ring-1 focus:ring-terex-accent"
              >
                <option value="relevance">Pertinence</option>
                <option value="newest">Plus récents</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>

            <Separator className="bg-slate-700 mb-8" />

            {/* Products */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onAddToCart={addToCart}
              onAddToWishlist={handleAddToWishlist}
              wishlistItems={wishlistItems}
            />
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <MarketplaceCart
        open={showCart}
        onOpenChange={setShowCart}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />
    </div>
  );
}
