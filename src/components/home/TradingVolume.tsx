
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TradingVolume() {
  const [volume24h, setVolume24h] = useState(2847639);
  const [totalUsers, setTotalUsers] = useState(12847);
  const [transactions, setTransactions] = useState(94523);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume24h(prev => prev + Math.floor(Math.random() * 10000));
      setTotalUsers(prev => prev + Math.floor(Math.random() * 5));
      setTransactions(prev => prev + Math.floor(Math.random() * 20));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
      
      {/* Animated floating elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-terex-accent/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>

      <CardHeader className="relative z-10 border-b border-terex-gray/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Volume de Trading</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-sm">+12.5% aujourd'hui</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/20">
            <div>
              <div className="text-sm text-gray-400 mb-1">Volume 24h</div>
              <div className="text-2xl font-bold text-orange-400">
                ${volume24h.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-terex-dark/50 rounded-xl border border-terex-accent/20">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-terex-accent" />
                <span className="text-gray-400 text-sm">Utilisateurs</span>
              </div>
              <div className="text-xl font-bold text-terex-accent">
                {totalUsers.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 bg-terex-dark/50 rounded-xl border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">Transactions</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {transactions.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 border border-terex-accent/20 rounded-xl">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
              <span className="text-terex-accent text-sm">Plateforme en croissance continue</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
