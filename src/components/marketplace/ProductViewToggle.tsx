
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Grid2X2 } from 'lucide-react';

export type ViewMode = 'grid-4' | 'grid-3' | 'grid-2' | 'list';

interface ProductViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProductViewToggle({ viewMode, onViewModeChange }: ProductViewToggleProps) {
  const viewOptions = [
    { mode: 'grid-4' as ViewMode, icon: Grid3X3, tooltip: 'Grille 4 colonnes' },
    { mode: 'grid-3' as ViewMode, icon: Grid3X3, tooltip: 'Grille 3 colonnes' },
    { mode: 'grid-2' as ViewMode, icon: Grid2X2, tooltip: 'Grille 2 colonnes' },
    { mode: 'list' as ViewMode, icon: List, tooltip: 'Vue liste' },
  ];

  return (
    <div className="flex items-center space-x-1 border border-terex-accent/30 rounded-lg p-1">
      {viewOptions.map(({ mode, icon: Icon, tooltip }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange(mode)}
          className={`p-2 ${
            viewMode === mode 
              ? 'bg-terex-accent text-black' 
              : 'text-gray-400 hover:text-white hover:bg-terex-accent/20'
          }`}
          title={tooltip}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}
