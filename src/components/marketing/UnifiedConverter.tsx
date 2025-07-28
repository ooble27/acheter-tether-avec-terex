
import { useState } from 'react';
import { CurrencyConverter } from './CurrencyConverter';
import { InternationalTransferConverter } from './InternationalTransferConverter';

export function UnifiedConverter() {
  const [activeTab, setActiveTab] = useState<'usdt' | 'transfer'>('usdt');

  return (
    <div className="max-w-md mx-auto">
      {/* Sélecteur de type - Optimisé pour mobile */}
      <div className="bg-terex-darker/80 border border-terex-accent/30 backdrop-blur-sm rounded-t-lg p-1 mb-0">
        <div className="flex rounded-lg bg-terex-gray p-1">
          <button
            onClick={() => setActiveTab('usdt')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'usdt' 
                ? 'bg-terex-accent text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            USDT
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'transfer' 
                ? 'bg-terex-accent text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Virement International</span>
            <span className="sm:hidden">Virement Intl</span>
          </button>
        </div>
      </div>

      {/* Convertisseur selon la sélection */}
      <div className="[&>*]:rounded-t-none [&>*]:border-t-0">
        {activeTab === 'usdt' ? (
          <CurrencyConverter />
        ) : (
          <InternationalTransferConverter />
        )}
      </div>
    </div>
  );
}
