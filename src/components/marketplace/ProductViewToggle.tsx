
import { Button } from '@/components/ui/button';
import { Grid3x3, List, LayoutGrid } from 'lucide-react';

interface ProductViewToggleProps {
  view: 'grid' | 'list' | 'compact';
  onViewChange: (view: 'grid' | 'list' | 'compact') => void;
}

export function ProductViewToggle({ view, onViewChange }: ProductViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-terex-darker rounded-lg p-1">
      <Button
        onClick={() => onViewChange('grid')}
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className={view === 'grid' ? 'bg-terex-accent text-black' : 'text-gray-400 hover:text-white'}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => onViewChange('compact')}
        variant={view === 'compact' ? 'default' : 'ghost'}
        size="sm"
        className={view === 'compact' ? 'bg-terex-accent text-black' : 'text-gray-400 hover:text-white'}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => onViewChange('list')}
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        className={view === 'list' ? 'bg-terex-accent text-black' : 'text-gray-400 hover:text-white'}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
