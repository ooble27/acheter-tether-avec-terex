
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-terex-darker border-terex-accent/30 text-white">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent className="bg-terex-darker border-terex-accent/30">
          <SelectItem value="newest">Plus récents</SelectItem>
          <SelectItem value="oldest">Plus anciens</SelectItem>
          <SelectItem value="price-low">Prix croissant</SelectItem>
          <SelectItem value="price-high">Prix décroissant</SelectItem>
          <SelectItem value="name-asc">Nom A-Z</SelectItem>
          <SelectItem value="name-desc">Nom Z-A</SelectItem>
          <SelectItem value="popular">Plus populaires</SelectItem>
          <SelectItem value="rating">Mieux notés</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
