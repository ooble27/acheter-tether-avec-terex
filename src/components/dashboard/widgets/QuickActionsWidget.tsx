import { Card } from '@/components/ui/card';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Globe, 
  Handshake,
  ArrowRight
} from 'lucide-react';

interface QuickActionsWidgetProps {
  onNavigate?: (section: string) => void;
}

export function QuickActionsWidget({ onNavigate }: QuickActionsWidgetProps) {
  const actions = [
    {
      id: 'buy',
      icon: ArrowDownCircle,
      title: 'Acheter',
      subtitle: 'USDT',
      description: 'Achat rapide et sécurisé',
      gradient: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30 hover:border-green-500/50'
    },
    {
      id: 'sell',
      icon: ArrowUpCircle,
      title: 'Vendre',
      subtitle: 'USDT',
      description: 'Conversion instantanée',
      gradient: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30 hover:border-red-500/50'
    },
    {
      id: 'transfer',
      icon: Globe,
      title: 'Transfert',
      subtitle: 'International',
      description: 'Envoi vers 15+ pays',
      gradient: 'from-terex-accent/20 to-terex-teal/10',
      iconColor: 'text-terex-accent',
      borderColor: 'border-terex-accent/30 hover:border-terex-accent/50'
    },
    {
      id: 'otc',
      icon: Handshake,
      title: 'OTC',
      subtitle: 'Trading',
      description: 'Gros volumes',
      gradient: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30 hover:border-purple-500/50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Card
          key={action.id}
          onClick={() => onNavigate?.(action.id)}
          className={`
            bg-gradient-to-br ${action.gradient} 
            ${action.borderColor}
            cursor-pointer transition-all duration-300
            hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20
            group relative overflow-hidden
          `}
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-4 relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-terex-dark/50 flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-base">
                {action.title}
                <span className={`ml-1 ${action.iconColor}`}>{action.subtitle}</span>
              </h3>
              <p className="text-gray-400 text-xs mt-1">{action.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
