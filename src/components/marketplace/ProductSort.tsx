
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'price-low' 
  | 'price-high' 
  | 'name-asc' 
  | 'name-desc' 
  | 'popular';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
    { value: 'oldest', label: 'Plus anciens' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-terex-darker border-terex-accent/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-terex-darker border-terex-accent/30">
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-white hover:bg-terex-accent/10"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
