
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  productCounts?: Record<string, number>;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  productCounts = {}
}: CategoryFilterProps) {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'wallets': return '🔐';
      case 'clothing': return '👕';
      case 'accessories': return '🛡️';
      case 'training': return '📚';
      default: return '📦';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          🏷️ Catégories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => onCategoryChange('')}
          variant={selectedCategory === '' ? 'default' : 'ghost'}
          className={`w-full justify-start ${
            selectedCategory === '' 
              ? 'bg-terex-accent text-black hover:bg-terex-accent/90' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="mr-2">🛍️</span>
          Toutes les catégories
          {productCounts['all'] && (
            <Badge variant="secondary" className="ml-auto">
              {productCounts['all']}
            </Badge>
          )}
        </Button>
        
        {categories.map(category => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              selectedCategory === category.id
                ? 'bg-terex-accent text-black hover:bg-terex-accent/90'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="mr-2">{getCategoryIcon(category.id)}</span>
            {category.name}
            {productCounts[category.id] && (
              <Badge variant="secondary" className="ml-auto">
                {productCounts[category.id]}
              </Badge>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
