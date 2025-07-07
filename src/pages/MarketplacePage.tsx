
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, ShoppingCart, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceCart } from '@/components/marketplace/MarketplaceCart';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { CheckoutPage } from '@/components/marketplace/CheckoutPage';

export function MarketplacePage() {
  const navigate = useNavigate();
  const { products, categories, cartItems, loading, fetchProducts, addToCart } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Si on est en mode checkout
  if (showCheckout) {
    return <CheckoutPage />;
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleProductClick = (product: any) => {
    console.log('Navigating to product:', product.id);
    navigate(`/marketplace/product/${product.id}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-4xl bg-terex-dark rounded-lg">📦</div>';
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-40 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/marketplace/search')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Recherche
              </Button>
              <Button
                onClick={() => navigate('/marketplace/wishlist')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                ❤️ Liste
              </Button>
              <Button
                onClick={() => navigate('/marketplace/compare')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                📊 Comparer
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe">
        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-terex-darker border-terex-accent/30 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchProducts(e.target.value || undefined);
              }}
              className="bg-terex-darker border border-terex-accent/30 text-white rounded-md px-3 py-2"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto"></div>
            <p className="text-gray-300 mt-4">Chargement des produits...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id}
                className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                <CardHeader className="p-4">
                  <div className="aspect-square bg-terex-dark rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl bg-terex-dark rounded-lg">📦</div>
                    )}
                  </div>
                  <CardTitle className="text-white text-sm group-hover:text-terex-accent transition-colors">
                    {product.name}
                  </CardTitle>
                  {product.brand && (
                    <Badge variant="secondary" className="w-fit">
                      {product.brand}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {product.description}
                  </p>
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
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Panier modal avec bouton checkout */}
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
