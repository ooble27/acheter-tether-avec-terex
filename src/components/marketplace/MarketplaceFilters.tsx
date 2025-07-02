
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface MarketplaceFiltersProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  availableBrands: string[];
  inStockOnly: boolean;
  onInStockToggle: (checked: boolean) => void;
  onClearFilters: () => void;
}

export function MarketplaceFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandToggle,
  availableBrands,
  inStockOnly,
  onInStockToggle,
  onClearFilters
}: MarketplaceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    selectedBrands.length + 
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0);

  return (
    <Card className="bg-terex-darker border-terex-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-terex-accent" />
            <CardTitle className="text-white text-lg">Filtres</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge className="bg-terex-accent text-black">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white md:hidden"
          >
            {isExpanded ? 'Masquer' : 'Afficher'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Bouton Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="w-full border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer les filtres
          </Button>
        )}

        {/* Catégories */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Catégories</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!selectedCategory}
                onChange={() => onCategoryChange('')}
                className="text-terex-accent"
              />
              <span className="text-gray-300">Toutes les catégories</span>
            </label>
            {categories.map(category => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => onCategoryChange(category.id)}
                  className="text-terex-accent"
                />
                <span className="text-gray-300">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Prix */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Prix (CFA)</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={500000}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatPrice(priceRange[0])} CFA</span>
              <span>{formatPrice(priceRange[1])} CFA</span>
            </div>
          </div>
        </div>

        {/* Marques */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Marques</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableBrands.map(brand => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => onBrandToggle(brand)}
                  className="border-terex-accent/30"
                />
                <span className="text-gray-300">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Disponibilité</h4>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={inStockOnly}
              onCheckedChange={onInStockToggle}
              className="border-terex-accent/30"
            />
            <span className="text-gray-300">En stock uniquement</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
