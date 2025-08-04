
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Smartphone, ArrowLeft } from 'lucide-react';

interface MobileMoneyProvider {
  id: string;
  name: string;
  logo: string;
  countries: string[];
}

interface MobileMoneyProps {
  onComplete: (provider: string, phoneNumber: string) => void;
  onBack: () => void;
  recipientCountry: string;
}

export function MobileMoneySelector({ onComplete, onBack, recipientCountry }: MobileMoneyProps) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const providers: MobileMoneyProvider[] = [
    {
      id: 'wave',
      name: 'Wave',
      logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png',
      countries: ['SN', 'CI', 'ML', 'BF']
    },
    {
      id: 'orange',
      name: 'Orange Money',
      logo: '/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png',
      countries: ['SN', 'CI', 'ML', 'BF', 'NG', 'BJ']
    }
  ];

  const availableProviders = providers.filter(provider => 
    provider.countries.includes(recipientCountry)
  );

  const handleContinue = () => {
    if (selectedProvider && phoneNumber) {
      onComplete(selectedProvider, phoneNumber);
    }
  };

  const getCountryPrefix = (country: string) => {
    const prefixes = {
      'SN': '+221',
      'CI': '+225',
      'ML': '+223',
      'BF': '+226',
      'NG': '+234',
      'BJ': '+229'
    };
    return prefixes[country as keyof typeof prefixes] || '+221';
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="w-full max-w-2xl mx-auto px-2 md:px-0">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Choisir le service Mobile Money</h1>
          <p className="text-gray-400 text-sm md:text-base">Sélectionnez le service que le destinataire utilise</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-terex-accent" />
              Services disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-white text-sm font-medium">Service Mobile Money</Label>
              <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider}>
                {availableProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={provider.id} 
                      id={provider.id}
                      className="border-terex-gray text-terex-accent"
                    />
                    <Label 
                      htmlFor={provider.id} 
                      className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-terex-gray transition-colors flex-1"
                    >
                      <img 
                        src={provider.logo} 
                        alt={provider.name} 
                        className="w-8 h-8 rounded-full object-contain"
                      />
                      <div>
                        <p className="text-white font-medium">{provider.name}</p>
                        <p className="text-gray-400 text-sm">
                          Disponible dans {provider.countries.length} pays
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {selectedProvider && (
              <div className="space-y-4 animate-fade-in">
                <Label className="text-white text-sm font-medium">
                  Numéro de téléphone du destinataire
                </Label>
                <div className="flex space-x-2">
                  <div className="bg-terex-gray border border-terex-gray-light text-white h-12 px-3 flex items-center rounded">
                    {getCountryPrefix(recipientCountry)}
                  </div>
                  <Input
                    type="tel"
                    placeholder="77 397 27 49"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-terex-gray border-terex-gray-light text-white flex-1 h-12"
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  Entrez le numéro sans l'indicatif pays
                </p>
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={!selectedProvider || !phoneNumber}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12"
            >
              Continuer
            </Button>
          </CardContent>
        </Card>

        {availableProviders.length === 0 && (
          <Card className="bg-red-500/10 border-red-500/20 mt-6">
            <CardContent className="p-4">
              <p className="text-red-200">
                Aucun service Mobile Money n'est disponible pour ce pays. 
                Veuillez choisir une autre méthode de réception.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
