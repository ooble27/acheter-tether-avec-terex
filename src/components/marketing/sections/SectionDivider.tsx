
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
