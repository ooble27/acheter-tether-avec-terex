
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Grid2X2 } from 'lucide-react';

export type ViewType = 'grid' | 'list' | 'compact';

interface ProductViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ProductViewToggle({ currentView, onViewChange }: ProductViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-terex-darker rounded-lg p-1">
      <Button
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`px-3 ${
          currentView === 'grid' 
            ? 'bg-terex-accent text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={currentView === 'compact' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('compact')}
        className={`px-3 ${
          currentView === 'compact' 
            ? 'bg-terex-accent text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Grid2X2 className="w-4 h-4" />
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`px-3 ${
          currentView === 'list' 
            ? 'bg-terex-accent text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
