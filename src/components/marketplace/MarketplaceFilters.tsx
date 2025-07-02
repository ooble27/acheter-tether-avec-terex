
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface MarketplaceFiltersProps {
  categories: any[];
  brands: string[];
  priceRange: [number, number];
  maxPrice: number;
  onFiltersChange: (filters: any) => void;
  selectedFilters: any;
  onClearFilters: () => void;
}

export function MarketplaceFilters({
  categories,
  brands,
  priceRange,
  maxPrice,
  onFiltersChange,
  selectedFilters,
  onClearFilters
}: MarketplaceFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...(selectedFilters.categories || []), categoryId]
      : (selectedFilters.categories || []).filter((id: string) => id !== categoryId);
    
    onFiltersChange({ ...selectedFilters, categories: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...(selectedFilters.brands || []), brand]
      : (selectedFilters.brands || []).filter((b: string) => b !== brand);
    
    onFiltersChange({ ...selectedFilters, brands: newBrands });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    onFiltersChange({ ...selectedFilters, priceRange: localPriceRange });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const activeFiltersCount = 
    (selectedFilters.categories?.length || 0) + 
    (selectedFilters.brands?.length || 0) + 
    (selectedFilters.priceRange ? 1 : 0);

  return (
    <Card className="bg-terex-darker border-terex-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-terex-accent text-black">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              onClick={onClearFilters}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix */}
        <div>
          <h4 className="text-white font-medium mb-3">Prix (CFA)</h4>
          <div className="space-y-3">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatPrice(localPriceRange[0])} CFA</span>
              <span>{formatPrice(localPriceRange[1])} CFA</span>
            </div>
            <Button
              onClick={applyPriceFilter}
              size="sm"
              className="w-full bg-terex-accent text-black hover:bg-terex-accent/90"
            >
              Appliquer
            </Button>
          </div>
        </div>

        {/* Catégories */}
        <div>
          <h4 className="text-white font-medium mb-3">Catégories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedFilters.categories?.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                />
                <label
                  htmlFor={category.id}
                  className="text-sm text-gray-300 cursor-pointer flex-1"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Marques */}
        <div>
          <h4 className="text-white font-medium mb-3">Marques</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedFilters.brands?.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                />
                <label
                  htmlFor={brand}
                  className="text-sm text-gray-300 cursor-pointer flex-1"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div>
          <h4 className="text-white font-medium mb-3">Disponibilité</h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={selectedFilters.inStock}
              onCheckedChange={(checked) => 
                onFiltersChange({ ...selectedFilters, inStock: !!checked })
              }
            />
            <label htmlFor="in-stock" className="text-sm text-gray-300 cursor-pointer">
              En stock uniquement
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
