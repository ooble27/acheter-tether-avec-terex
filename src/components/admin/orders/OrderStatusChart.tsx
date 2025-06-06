
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';

interface OrderStatusChartProps {
  orders: UnifiedOrder[];
}

export function OrderStatusChart({ orders }: OrderStatusChartProps) {
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'En attente', value: statusCounts.pending || 0, color: '#EAB308' },
    { name: 'En traitement', value: statusCounts.processing || 0, color: '#3B82F6' },
    { name: 'Terminé', value: statusCounts.completed || 0, color: '#10B981' },
    { name: 'Annulé', value: statusCounts.cancelled || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-terex-accent" />
          Répartition par statut
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucune donnée à afficher</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
