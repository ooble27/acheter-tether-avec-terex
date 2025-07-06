
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  SlidersHorizontal,
  Grid3X3,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketplaceHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onFiltersClick: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function MarketplaceHeader({
  searchTerm,
  onSearchChange,
  cartItemsCount,
  onCartClick,
  onWishlistClick,
  onFiltersClick,
  viewMode,
  onViewModeChange
}: MarketplaceHeaderProps) {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-40 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Button>
            <div className="hidden md:block text-slate-400 text-sm">
              Boutique Terex
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'w-80' : 'w-64'
            } hidden md:block`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-terex-accent focus:ring-terex-accent/20"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={onFiltersClick}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>

              <div className="hidden md:flex border-l border-slate-600 pl-2 ml-2">
                <Button
                  onClick={() => onViewModeChange('grid')}
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-terex-accent text-black' : 'text-slate-300'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onViewModeChange('list')}
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' ? 'bg-terex-accent text-black' : 'text-slate-300'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={onWishlistClick}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Heart className="w-4 h-4" />
              </Button>

              <Button
                onClick={onCartClick}
                variant="outline"
                size="sm"
                className="relative border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-terex-accent text-black px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
