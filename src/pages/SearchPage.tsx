
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, Filter, ArrowLeft, SlidersHorizontal, Star } from 'lucide-react';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, categories, loading } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category_id);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`);
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
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terex-darker border-terex-accent/30 text-white"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <div className={`w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Catégories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                    />
                    <label htmlFor={category.id} className="text-gray-300 text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Marques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                    />
                    <label htmlFor={brand} className="text-gray-300 text-sm">
                      {brand}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Prix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatPrice(priceRange[0])} CFA</span>
                  <span>{formatPrice(priceRange[1])} CFA</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-300">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-terex-darker border border-terex-accent/30 text-white rounded-md px-3 py-2"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto"></div>
                <p className="text-gray-300 mt-4">Recherche en cours...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id}
                    className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all cursor-pointer group"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="aspect-square bg-terex-dark rounded-lg mb-3 overflow-hidden">
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
                      <div className="flex items-center justify-between">
                        <span className="text-terex-accent font-bold">
                          {formatPrice(product.price)} {product.currency}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          <span className="text-xs text-gray-400">4.5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Aucun produit ne correspond à vos critères</p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange([0, 200000]);
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
