
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  productId: string;
  isInWishlist: boolean;
  onToggle: (productId: string) => void;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function WishlistButton({ 
  productId, 
  isInWishlist, 
  onToggle, 
  size = 'sm',
  className = ''
}: WishlistButtonProps) {
  const { toast } = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(productId);
    
    toast({
      title: isInWishlist ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isInWishlist 
        ? "Le produit a été retiré de votre liste de souhaits" 
        : "Le produit a été ajouté à votre liste de souhaits",
      className: isInWishlist 
        ? "bg-orange-600 text-white border-orange-600" 
        : "bg-green-600 text-white border-green-600",
    });
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={`p-2 hover:bg-terex-accent/20 ${className}`}
      title={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={`w-4 h-4 ${
          isInWishlist 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-400'
        }`} 
      />
    </Button>
  );
}
