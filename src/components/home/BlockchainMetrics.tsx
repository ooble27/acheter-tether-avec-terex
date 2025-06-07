
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Blocks, TrendingUp, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BlockchainMetrics() {
  const [blockHeight, setBlockHeight] = useState(1234567);
  const [hashRate, setHashRate] = useState(89.5);
  const [difficulty, setDifficulty] = useState(45.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + Math.floor(Math.random() * 3));
      setHashRate(prev => prev + (Math.random() - 0.5) * 2);
      setDifficulty(prev => prev + (Math.random() - 0.5) * 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 150, 143, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 150, 143, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      <CardHeader className="relative z-10 border-b border-terex-gray/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
            <Blocks className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Métriques Blockchain</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Réseau actif</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-terex-dark/50 rounded-xl border border-terex-accent/20 hover:border-terex-accent/40 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-terex-accent" />
              <span className="text-gray-400 text-sm">Hauteur de bloc</span>
            </div>
            <div className="text-2xl font-bold text-terex-accent">
              #{blockHeight.toLocaleString()}
            </div>
          </div>
          
          <div className="p-4 bg-terex-dark/50 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Hash Rate (TH/s)</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {hashRate.toFixed(1)}
            </div>
          </div>
          
          <div className="p-4 bg-terex-dark/50 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Difficulté (T)</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {difficulty.toFixed(1)}
            </div>
          </div>
          
          <div className="p-4 bg-terex-dark/50 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
              <span className="text-gray-400 text-sm">Nœuds actifs</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              15,247
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-xl">
          <div className="text-center text-terex-accent text-sm">
            Réseau décentralisé sécurisé 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
