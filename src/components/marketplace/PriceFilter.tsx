
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  priceRange: [number, number];
}

export function PriceFilter({ 
  minPrice, 
  maxPrice, 
  onPriceChange, 
  priceRange 
}: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(priceRange[0].toString());
  const [localMax, setLocalMax] = useState(priceRange[1].toString());

  const handleSliderChange = (values: number[]) => {
    onPriceChange(values[0], values[1]);
    setLocalMin(values[0].toString());
    setLocalMax(values[1].toString());
  };

  const handleInputChange = () => {
    const min = Math.max(minPrice, parseInt(localMin) || 0);
    const max = Math.min(maxPrice, parseInt(localMax) || maxPrice);
    onPriceChange(min, max);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          💰 Prix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handleSliderChange}
            max={maxPrice}
            min={minPrice}
            step={1000}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={handleInputChange}
            className="bg-slate-800 border-slate-600 text-white text-sm"
            placeholder="Min"
          />
          <span className="text-slate-400">-</span>
          <Input
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={handleInputChange}
            className="bg-slate-800 border-slate-600 text-white text-sm"
            placeholder="Max"
          />
        </div>
        
        <div className="flex justify-between text-sm text-slate-400">
          <span>{formatPrice(priceRange[0])} CFA</span>
          <span>{formatPrice(priceRange[1])} CFA</span>
        </div>
        
        <Button
          onClick={() => onPriceChange(minPrice, maxPrice)}
          variant="outline"
          size="sm"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Réinitialiser
        </Button>
      </CardContent>
    </Card>
  );
}
