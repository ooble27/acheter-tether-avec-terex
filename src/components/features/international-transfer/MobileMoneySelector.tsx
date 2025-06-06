
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Smartphone } from 'lucide-react';

interface MobileMoneySelectorProps {
  onComplete: (selectedProvider: string, phoneNumber: string) => void;
  onBack: () => void;
  recipientCountry: string;
}

export function MobileMoneySelector({ onComplete, onBack, recipientCountry }: MobileMoneySelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const methods = [
    {
      id: 'orange-money',
      name: 'Orange Money',
      logo: '/lovable-uploads/dcdbab59-4f03-4bdc-b592-160b3d1f0aec.png',
      countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Niger']
    },
    {
      id: 'wave',
      name: 'Wave',
      logo: '/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png',
      countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod && phoneNumber) {
      onComplete(selectedMethod, phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Sélection Mobile Money</h1>
          <p className="text-gray-400">Choisissez votre service de Mobile Money</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-terex-accent" />
              Services disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {methods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'bg-terex-accent/20 border-terex-accent ring-2 ring-terex-accent/50'
                        : 'bg-terex-darker border-terex-gray hover:border-terex-accent/50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img 
                          src={method.logo} 
                          alt={method.name}
                          className="w-8 h-8 rounded"
                        />
                        <h3 className="text-white font-semibold">{method.name}</h3>
                      </div>
                      <div className="text-sm text-gray-300">
                        <p className="mb-2">Disponible dans:</p>
                        <div className="flex flex-wrap gap-1">
                          {method.countries.map((country, index) => (
                            <span 
                              key={country}
                              className="px-2 py-1 bg-terex-gray rounded text-xs"
                            >
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedMethod && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Numéro de téléphone {selectedMethod === 'orange-money' ? 'Orange Money' : 'Wave'}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: +221 77 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Numéro associé à votre compte {selectedMethod === 'orange-money' ? 'Orange Money' : 'Wave'}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                disabled={!selectedMethod || !phoneNumber}
              >
                Continuer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
