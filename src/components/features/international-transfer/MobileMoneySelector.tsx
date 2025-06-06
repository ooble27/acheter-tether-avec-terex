
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MobileMoneySelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export function MobileMoneySelector({ selectedMethod, onSelect }: MobileMoneySelectorProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <Card 
          key={method.id}
          className={`cursor-pointer transition-all duration-200 ${
            selectedMethod === method.id
              ? 'bg-terex-accent/20 border-terex-accent ring-2 ring-terex-accent/50'
              : 'bg-terex-darker border-terex-gray hover:border-terex-accent/50'
          }`}
          onClick={() => onSelect(method.id)}
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
  );
}
