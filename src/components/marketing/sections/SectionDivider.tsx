
interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`w-full relative ${className}`}>
      {/* Main horizontal line */}
      <div className="w-full h-px bg-white/10" />
      
      {/* Vertical tick marks at intervals */}
      <div className="absolute inset-0 flex justify-between pointer-events-none" style={{
        marginLeft: 'calc((100% - 40px * floor(100% / 40px)) / 2)',
        marginRight: 'calc((100% - 40px * floor(100% / 40px)) / 2)',
      }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ width: '40px' }}>
            <div className="absolute left-0 top-0 w-px h-2 bg-white/10 -translate-y-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionDividerWithLabel({ 
  leftLabel, 
  rightLabel,
  className = '' 
}: { 
  leftLabel?: string; 
  rightLabel?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Main horizontal dashed line */}
      <div className="w-full border-t border-dashed border-white/10" />
      
      {/* Labels */}
      {leftLabel && (
        <span className="absolute left-4 md:left-8 top-4 text-xs text-white/30 font-mono tracking-wider">
          {leftLabel}
        </span>
      )}
      {rightLabel && (
        <span className="absolute right-4 md:right-8 top-4 text-xs text-white/30 font-mono tracking-wider">
          {rightLabel}
        </span>
      )}
    </div>
  );
}

// Vertical lines overlay component for Attio-style grid structure
export function VerticalGridLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Container with max-width matching content */}
      <div className="max-w-7xl mx-auto h-full relative px-4 md:px-8">
        {/* Main vertical dividers - creates 3 column structure */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.04]" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/[0.04] hidden md:block" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/[0.04] hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.04]" />
        
        {/* Secondary subtle lines for more density on desktop */}
        <div className="absolute left-1/6 top-0 bottom-0 w-px bg-white/[0.02] hidden lg:block" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03] hidden md:block" />
        <div className="absolute left-5/6 top-0 bottom-0 w-px bg-white/[0.02] hidden lg:block" />
      </div>
    </div>
  );
}

// Section wrapper with side vertical borders
export function SectionWithVerticalBorders({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Left vertical line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden sm:block" />
      {/* Right vertical line */}
      <div className="absolute right-4 md:right-8 top-0 bottom-0 w-px bg-white/[0.06] hidden sm:block" />
      {children}
    </div>
  );
}
