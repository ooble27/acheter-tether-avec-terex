
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  gradient: string;
  iconColor: string;
}

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  gradient, 
  iconColor 
}: QuickActionCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer group
        bg-gradient-to-br ${gradient}
        border-0 shadow-sm hover:shadow-md
        transition-all duration-300 ease-out
        transform hover:scale-[1.02] hover:-translate-y-1
        active:scale-[0.98] active:translate-y-0
      `}
    >
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center
            bg-white/20 backdrop-blur-sm
            group-hover:bg-white/30 transition-colors duration-300
          `}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/60 transition-colors" />
        </div>
        
        <div>
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-white/80 text-sm group-hover:translate-x-1 transition-transform duration-300 delay-75">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700 delay-100" />
      </div>
    </Card>
  );
}
