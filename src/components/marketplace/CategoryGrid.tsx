
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  productCount?: number;
}

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
}

export function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  const categoryIcons: Record<string, string> = {
    'wallets': '🔐',
    'clothing': '👕',
    'accessories': '⚡',
    'training': '📚',
    'mining': '⛏️',
    'books': '📖',
    'staking': '💰'
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Parcourir par catégorie</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {categories.map(category => (
          <Card 
            key={category.id}
            className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center text-2xl">
                {categoryIcons[category.id] || '📦'}
              </div>
              <h3 className="text-white font-medium text-sm mb-1 group-hover:text-terex-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                {category.description}
              </p>
              {category.productCount && (
                <Badge variant="secondary" className="text-xs">
                  {category.productCount} produits
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
