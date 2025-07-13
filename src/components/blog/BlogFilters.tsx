
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlogCategories, useBlogTags } from '@/hooks/useBlog';

interface BlogFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    category?: string;
    tag?: string;
  }) => void;
  currentFilters: {
    search?: string;
    category?: string;
    tag?: string;
  };
}

export const BlogFilters = ({ onFiltersChange, currentFilters }: BlogFiltersProps) => {
  const [searchInput, setSearchInput] = useState(currentFilters.search || '');
  const { data: categories } = useBlogCategories();
  const { data: tags } = useBlogTags();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...currentFilters, search: searchInput });
  };

  const clearFilter = (filterType: 'search' | 'category' | 'tag') => {
    const newFilters = { ...currentFilters };
    delete newFilters[filterType];
    onFiltersChange(newFilters);
    
    if (filterType === 'search') {
      setSearchInput('');
    }
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = !!(currentFilters.search || currentFilters.category || currentFilters.tag);

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher dans les articles..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-12"
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtres :</span>
        </div>

        {/* Filtre par catégorie */}
        <Select
          value={currentFilters.category || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ 
              ...currentFilters, 
              category: value === 'all' ? undefined : value
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par tag */}
        <Select
          value={currentFilters.tag || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ 
              ...currentFilters, 
              tag: value === 'all' ? undefined : value
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les tags</SelectItem>
            {tags?.map((tag) => (
              <SelectItem key={tag.id} value={tag.slug}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bouton pour effacer tous les filtres */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Affichage des filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentFilters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: "{currentFilters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('search')}
              />
            </Badge>
          )}
          {currentFilters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Catégorie: {categories?.find(c => c.slug === currentFilters.category)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('category')}
              />
            </Badge>
          )}
          {currentFilters.tag && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tag: {tags?.find(t => t.slug === currentFilters.tag)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('tag')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
