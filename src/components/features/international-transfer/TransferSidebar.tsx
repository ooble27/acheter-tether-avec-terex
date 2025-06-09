
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransferSidebarProps {
  exchangeRate: number;
  ratesLoading: boolean;
  ratesError: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  setSendAmount: (value: string) => void;
}

export function TransferSidebar({
  exchangeRate,
  ratesLoading,
  ratesError,
  lastUpdated,
  refresh,
  setSendAmount
}: TransferSidebarProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Taux du jour */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base md:text-lg flex items-center">
              <Globe className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
              <span>Taux du jour</span>
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
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
        <CardContent className="space-y-3 p-4 pt-0">
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
              <span className="text-gray-400 text-sm">1 CAD vers CFA</span>
              <span className="text-terex-accent font-bold">{exchangeRate} CFA</span>
            </div>
            <div className="text-xs text-gray-500">
              * Taux en temps réel - Aucune commission TRX
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Montants rapides */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-base md:text-lg">Montants rapides (CAD)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-2">
            {['100', '250', '500', '1000'].map((value) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                onClick={() => setSendAmount(value)}
                className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
              >
                {value} CAD
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-base md:text-lg flex items-center">
            <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm font-medium">Chiffrement 256-bit</p>
              <p className="text-gray-400 text-xs">Vos données sont protégées</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm font-medium">Régulé au Sénégal</p>
              <p className="text-gray-400 text-xs">Conforme aux normes locales</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm font-medium">Suivi en temps réel</p>
              <p className="text-gray-400 text-xs">Suivez votre transfert à tout moment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Délais de transfert */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-base md:text-lg flex items-center">
            <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
            Délais de transfert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Tous les pays</span>
            <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
              3-5 minutes
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
