
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface OrdersStatsGridProps {
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  totalVolume: number;
  totalOrders: number;
}

export function OrdersStatsGrid({ 
  pendingCount, 
  processingCount, 
  completedCount, 
  totalVolume,
  totalOrders 
}: OrdersStatsGridProps) {
  const stats = [
    {
      title: 'En attente',
      value: pendingCount,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      change: '+12%'
    },
    {
      title: 'En traitement',
      value: processingCount,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+8%'
    },
    {
      title: 'Terminées',
      value: completedCount,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+24%'
    },
    {
      title: 'Volume total',
      value: `${totalVolume.toLocaleString()} CFA`,
      icon: DollarSign,
      color: 'text-terex-accent',
      bgColor: 'bg-terex-accent/10',
      change: '+15%'
    },
    {
      title: 'Total commandes',
      value: totalOrders,
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: '+18%'
    },
    {
      title: 'Taux de réussite',
      value: totalOrders > 0 ? `${Math.round((completedCount / totalOrders) * 100)}%` : '0%',
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      change: '+3%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-terex-darker border-terex-gray hover:bg-terex-gray/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.change}</span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm text-gray-400 font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
