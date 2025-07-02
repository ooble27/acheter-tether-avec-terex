
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'newest' 
  | 'popular' 
  | 'stock-high' 
  | 'stock-low';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  const sortOptions = [
    { value: 'popular', label: 'Plus populaires' },
    { value: 'newest', label: 'Plus récents' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
    { value: 'stock-high', label: 'Stock élevé' },
    { value: 'stock-low', label: 'Stock faible' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-terex-darker border-terex-accent/30 text-white">
          <SelectValue placeholder="Trier par..." />
        </SelectTrigger>
        <SelectContent className="bg-terex-darker border-terex-accent/30">
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-white hover:bg-terex-accent/20 focus:bg-terex-accent/20"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
