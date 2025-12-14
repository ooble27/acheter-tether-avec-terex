import { ArrowDownToLine, ArrowUpFromLine, Send, Briefcase, ChevronRight } from 'lucide-react';

interface QuickActionsWidgetProps {
  onNavigate?: (section: string) => void;
}

export function QuickActionsWidget({ onNavigate }: QuickActionsWidgetProps) {
  const actions = [
    {
      id: 'buy',
      icon: ArrowDownToLine,
      label: 'Acheter',
      description: 'USDT',
      gradient: 'from-terex-teal/20 to-terex-teal/5',
      iconBg: 'bg-terex-teal',
      border: 'border-terex-teal/30',
    },
    {
      id: 'sell',
      icon: ArrowUpFromLine,
      label: 'Vendre',
      description: 'USDT',
      gradient: 'from-terex-accent/20 to-terex-accent/5',
      iconBg: 'bg-terex-accent',
      border: 'border-terex-accent/30',
    },
    {
      id: 'transfer',
      icon: Send,
      label: 'Transfert',
      description: 'International',
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconBg: 'bg-blue-500',
      border: 'border-blue-500/30',
    },
    {
      id: 'otc',
      icon: Briefcase,
      label: 'OTC',
      description: 'Gros volume',
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconBg: 'bg-purple-500',
      border: 'border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onNavigate?.(action.id)}
          className={`relative overflow-hidden flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${action.gradient} border ${action.border} hover:border-opacity-60 transition-all group`}
        >
          <div className={`w-9 h-9 rounded-lg ${action.iconBg} flex items-center justify-center shadow-lg`}>
            <action.icon className="w-4 h-4 text-terex-dark" />
          </div>
          <div className="text-left flex-1">
            <span className="text-white text-sm font-semibold block">{action.label}</span>
            <span className="text-gray-400 text-xs">{action.description}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </button>
      ))}
    </div>
  );
}
