
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface MarketplaceFiltersProps {
  categories: Array<{ id: string; name: string; }>;
  brands: string[];
  priceRange: [number, number];
  selectedCategory: string;
  selectedBrands: string[];
  selectedPriceRange: [number, number];
  inStockOnly: boolean;
  onCategoryChange: (category: string) => void;
  onBrandsChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onStockFilterChange: (inStock: boolean) => void;
  onClearFilters: () => void;
}

export function MarketplaceFilters({
  categories,
  brands,
  priceRange,
  selectedCategory,
  selectedBrands,
  selectedPriceRange,
  inStockOnly,
  onCategoryChange,
  onBrandsChange,
  onPriceRangeChange,
  onStockFilterChange,
  onClearFilters
}: MarketplaceFiltersProps) {
  const [showCategories, setShowCategories] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      onBrandsChange([...selectedBrands, brand]);
    } else {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    }
  };

  const activeFiltersCount = [
    selectedCategory !== '',
    selectedBrands.length > 0,
    selectedPriceRange[0] !== priceRange[0] || selectedPriceRange[1] !== priceRange[1],
    inStockOnly
  ].filter(Boolean).length;

  return (
    <Card className="bg-terex-darker border-terex-accent/30 sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-terex-accent" />
            <CardTitle className="text-white text-lg">Filtres</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-terex-accent text-black">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* En stock seulement */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={onStockFilterChange}
          />
          <Label htmlFor="inStock" className="text-white text-sm">
            En stock seulement
          </Label>
        </div>

        {/* Catégories */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowCategories(!showCategories)}
            className="w-full justify-between p-0 h-auto text-white hover:text-terex-accent"
          >
            <span className="font-medium">Catégories</span>
            {showCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showCategories && (
            <div className="mt-3 space-y-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange('')}
                className={`w-full justify-start text-sm ${
                  selectedCategory === '' 
                    ? 'bg-terex-accent text-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Toutes les catégories
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full justify-start text-sm ${
                    selectedCategory === category.id 
                      ? 'bg-terex-accent text-black' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Marques */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowBrands(!showBrands)}
            className="w-full justify-between p-0 h-auto text-white hover:text-terex-accent"
          >
            <span className="font-medium">Marques</span>
            {showBrands ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showBrands && (
            <div className="mt-3 space-y-2">
              {brands.map(brand => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`brand-${brand}`} 
                    className="text-gray-300 text-sm cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prix */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowPrice(!showPrice)}
            className="w-full justify-between p-0 h-auto text-white hover:text-terex-accent"
          >
            <span className="font-medium">Prix</span>
            {showPrice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showPrice && (
            <div className="mt-3 space-y-4">
              <div className="px-2">
                <Slider
                  value={selectedPriceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={priceRange[1]}
                  min={priceRange[0]}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label className="text-gray-400 text-xs">Min</Label>
                  <Input
                    type="number"
                    value={selectedPriceRange[0]}
                    onChange={(e) => onPriceRangeChange([
                      parseInt(e.target.value) || priceRange[0],
                      selectedPriceRange[1]
                    ])}
                    className="bg-terex-dark border-terex-accent/30 text-white text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-gray-400 text-xs">Max</Label>
                  <Input
                    type="number"
                    value={selectedPriceRange[1]}
                    onChange={(e) => onPriceRangeChange([
                      selectedPriceRange[0],
                      parseInt(e.target.value) || priceRange[1]
                    ])}
                    className="bg-terex-dark border-terex-accent/30 text-white text-sm"
                    placeholder={priceRange[1].toString()}
                  />
                </div>
              </div>
              <div className="text-center text-sm text-gray-400">
                {formatPrice(selectedPriceRange[0])} - {formatPrice(selectedPriceRange[1])} CFA
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
