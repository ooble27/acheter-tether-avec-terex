
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
  const categoryImages = {
    'wallets': '/lovable-uploads/6a172626-e81f-4a46-b547-c09040acb9a9.png',
    'clothing': '/lovable-uploads/29969ee7-eb01-43e8-9722-d2aa5b959735.png',
    'accessories': '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
    'training': '/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png',
    'mining': '/lovable-uploads/631f288e-7499-4396-b3dc-936d11ae8c00.png',
    'books': '/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png'
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Catégories populaires</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <Card 
            key={category.id}
            className="bg-terex-darker border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-terex-dark overflow-hidden">
                <img 
                  src={categoryImages[category.id as keyof typeof categoryImages] || '/placeholder.svg'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-medium text-sm mb-1 group-hover:text-terex-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-xs mb-2">
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
