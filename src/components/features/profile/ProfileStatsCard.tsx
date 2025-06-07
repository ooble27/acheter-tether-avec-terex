
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

export function ProfileStatsCard() {
  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
          Aperçu de votre activité
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-terex-gray/30 rounded-xl hover:bg-terex-gray/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">0</p>
            <p className="text-gray-400 text-sm">Transactions</p>
          </div>
          
          <div className="text-center p-4 bg-terex-gray/30 rounded-xl hover:bg-terex-gray/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">0 CFA</p>
            <p className="text-gray-400 text-sm">Volume total</p>
          </div>
          
          <div className="text-center p-4 bg-terex-gray/30 rounded-xl hover:bg-terex-gray/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">-</p>
            <p className="text-gray-400 text-sm">Dernière activité</p>
          </div>
          
          <div className="text-center p-4 bg-terex-gray/30 rounded-xl hover:bg-terex-gray/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">Nouveau</p>
            <p className="text-gray-400 text-sm">Statut</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
