import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Wallet, Building2 } from 'lucide-react';
import { BuyAmountInput } from './BuyAmountInput';
import { DestinationSelector } from './DestinationSelector';
import { NetworkSelector } from './NetworkSelector';
import { WalletAddressInput } from './WalletAddressInput';
import { BinanceEmailInput } from './BinanceEmailInput';

interface SimplifiedBuyFormProps {
  fiatAmount: string;
  setFiatAmount: (value: string) => void;
  usdtAmount: string;
  currency: string;
  setCurrency: (value: string) => void;
  destination: 'wallet' | 'binance';
  setDestination: (value: 'wallet' | 'binance') => void;
  network: string;
  setNetwork: (value: string) => void;
  walletAddress: string;
  setWalletAddress: (value: string) => void;
  binanceEmail: string;
  setBinanceEmail: (value: string) => void;
  exchangeRate: number;
  onContinue: () => void;
}

export function SimplifiedBuyForm({
  fiatAmount,
  setFiatAmount,
  usdtAmount,
  currency,
  setCurrency,
  destination,
  setDestination,
  network,
  setNetwork,
  walletAddress,
  setWalletAddress,
  binanceEmail,
  setBinanceEmail,
  exchangeRate,
  onContinue
}: SimplifiedBuyFormProps) {
  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    if (num === Math.floor(num)) return num.toString();
    return parseFloat(num.toFixed(2)).toString();
  };

  const isFormValid = () => {
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) return false;
    if (destination === 'wallet' && !walletAddress) return false;
    if (destination === 'binance' && !binanceEmail) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Montant Section */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <BuyAmountInput
              fiatAmount={fiatAmount}
              setFiatAmount={setFiatAmount}
              usdtAmount={usdtAmount}
              currency={currency}
              setCurrency={setCurrency}
              exchangeRate={exchangeRate}
              paymentMethod="mobile"
              processingTime="2-5 min"
              fee="0%"
            />

            <div className="flex items-center justify-center py-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
            </div>

            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Taux TEREX</span>
                <span className="text-foreground font-medium">1 USDT = {exchangeRate} {currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Frais</span>
                <span className="text-primary font-medium">0%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Temps de traitement</span>
                <span className="text-primary font-medium">2-5 min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destination Section */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-6 space-y-4">
          <Label className="text-foreground font-medium">Où souhaitez-vous recevoir vos USDT ?</Label>
          
          <DestinationSelector 
            destination={destination}
            setDestination={setDestination}
          />

          {destination === 'wallet' && (
            <div className="space-y-4 animate-fade-in">
              <NetworkSelector 
                network={network}
                setNetwork={setNetwork}
              />
              <WalletAddressInput 
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                network={network}
              />
            </div>
          )}

          {destination === 'binance' && (
            <div className="animate-fade-in space-y-3">
              <Label className="text-foreground font-medium">Email Binance</Label>
              <Input
                type="email"
                placeholder="votre-email@exemple.com"
                value={binanceEmail}
                onChange={(e) => setBinanceEmail(e.target.value)}
                className="bg-muted border-border text-foreground h-12"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        disabled={!isFormValid()}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        Continuer
      </Button>
    </div>
  );
}
