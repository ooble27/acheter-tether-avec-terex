
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryGridProps {
  categories: any[];
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string;
}

export function CategoryGrid({ categories, onCategoryClick, selectedCategory }: CategoryGridProps) {
  const categoryImages = {
    'wallets': '/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png',
    'clothing': '/lovable-uploads/29969ee7-eb01-43e8-9722-d2aa5b959735.png',
    'accessories': '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
    'training': '/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png',
    'mining': '/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png',
    'books': '/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png'
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Catégories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card
          className={`bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group ${!selectedCategory ? 'border-terex-accent bg-terex-accent/10' : ''}`}
          onClick={() => onCategoryClick('')}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌟</span>
            </div>
            <p className="text-white text-sm font-medium">Tout</p>
            <Badge variant="secondary" className="mt-1 text-xs">Populaire</Badge>
          </CardContent>
        </Card>
        
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group ${selectedCategory === category.id ? 'border-terex-accent bg-terex-accent/10' : ''}`}
            onClick={() => onCategoryClick(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-terex-dark rounded-xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img 
                  src={categoryImages[category.id as keyof typeof categoryImages] || '/placeholder.svg'} 
                  alt={category.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <p className="text-white text-sm font-medium">{category.name}</p>
              <p className="text-gray-400 text-xs mt-1">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
