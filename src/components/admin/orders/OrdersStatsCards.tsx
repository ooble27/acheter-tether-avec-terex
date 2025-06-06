
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface OrdersStatsCardsProps {
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  dailyVolume: number;
  dailyUSDT: number;
}

export function OrdersStatsCards({ 
  pendingCount = 0, 
  processingCount = 0, 
  completedCount = 0, 
  dailyVolume = 0, 
  dailyUSDT = 0 
}: OrdersStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En traitement</p>
              <p className="text-2xl font-bold text-gray-900">{processingCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-terex-accent/10 rounded-lg">
              <Calendar className="w-5 h-5 text-terex-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Volume jour</p>
              <p className="text-lg font-bold text-gray-900">
                {(dailyVolume || 0).toLocaleString()} CFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">USDT jour</p>
              <p className="text-lg font-bold text-gray-900">{(dailyUSDT || 0).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
