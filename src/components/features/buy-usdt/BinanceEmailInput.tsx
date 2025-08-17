
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface BinanceEmailInputProps {
  binanceEmail: string;
  onBinanceEmailChange: (email: string) => void;
  onValidation: (isValid: boolean) => void;
}

export function BinanceEmailInput({ 
  binanceEmail, 
  onBinanceEmailChange, 
  onValidation 
}: BinanceEmailInputProps) {
  const [isValid, setIsValid] = useState(false);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    setIsValid(valid);
    onValidation(valid);
    return valid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onBinanceEmailChange(email);
    validateEmail(email);
  };

  return (
    <div className="space-y-2">
      <Label className="text-white text-sm font-medium">Email Binance</Label>
      <div className="relative">
        <Input
          type="email"
          placeholder="votre.email@exemple.com"
          value={binanceEmail}
          onChange={handleEmailChange}
          className="bg-terex-gray border-terex-gray-light text-white h-12 pr-10"
        />
        {binanceEmail && (
          <div className="absolute right-3 top-3">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-xs">
        Entrez l'email associé à votre compte Binance
      </p>
    </div>
  );
}
