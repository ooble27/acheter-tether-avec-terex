
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TradingSidebarProps {
  exchangeRates: {
    CFA: number;
    CAD: number;
  };
  marketRates: {
    CFA: number;
    CAD: number;
  };
  ratesLoading: boolean;
  ratesError: string | null;
  lastUpdated: Date | null;
  refreshRates: () => void;
}

export function TradingSidebar({
  exchangeRates,
  marketRates,
  ratesLoading,
  ratesError,
  lastUpdated,
  refreshRates
}: TradingSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-4 md:space-y-6 w-full">
      {/* Taux du jour */}
      <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
              <img 
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                alt="USDT" 
                className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
              />
              <span className="truncate">Taux du jour</span>
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshRates}
              disabled={ratesLoading}
              className="h-8 w-8 p-0 text-terex-accent hover:bg-terex-accent/10"
            >
              <RefreshCw className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              Mis à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
          {ratesError && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-yellow-200 text-xs">
                {ratesError}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">Marché USDT/CFA</span>
              <span className="text-gray-300 font-medium text-xs sm:text-sm">{marketRates.CFA.toLocaleString()} CFA</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">Marché USDT/CAD</span>
              <span className="text-gray-300 font-medium text-xs sm:text-sm">${marketRates.CAD} CAD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nos taux TEREX */}
      <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
              alt="USDT" 
              className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
            />
            <span className="truncate">Nos taux TEREX</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">USDT/CFA</span>
            <span className="text-white font-bold text-xs sm:text-sm">{exchangeRates.CFA.toLocaleString()} CFA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">USDT/CAD</span>
            <span className="text-terex-accent font-bold text-xs sm:text-sm">${exchangeRates.CAD} CAD</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * Taux marché + 2% de commission
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
            <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent flex-shrink-0" />
            <span className="truncate">Sécurité</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs sm:text-sm font-medium">Cryptage SSL 256-bit</p>
              <p className="text-gray-400 text-xs">Vos données sont protégées</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs sm:text-sm font-medium">Fonds sécurisés</p>
              <p className="text-gray-400 text-xs">Protection des transactions</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs sm:text-sm font-medium">Support 24/7</p>
              <p className="text-gray-400 text-xs">Aide disponible en permanence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Time */}
      <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
            <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent flex-shrink-0" />
            <span className="truncate">Délais de traitement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">Mobile Money</span>
            <Badge variant="outline" className="text-green-500 border-green-500 text-xs whitespace-nowrap">
              5-10 min
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">Carte bancaire</span>
            <Badge variant="outline" className="text-green-500 border-green-500 text-xs whitespace-nowrap">
              Instantané
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
