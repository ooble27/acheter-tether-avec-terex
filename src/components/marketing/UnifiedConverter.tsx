
import { useState } from 'react';
import { CurrencyConverter } from './CurrencyConverter';

export function UnifiedConverter() {
  const [activeTab, setActiveTab] = useState<'usdt' | 'transfer'>('usdt');

  return (
    <div className="max-w-md mx-auto">
      {/* Sélecteur de type - Attio style */}
      <div className="bg-white border border-gray-100 rounded-t-xl p-1 mb-0 shadow-sm">
        <div className="flex rounded-lg bg-gray-50 p-1">
          <button
            onClick={() => setActiveTab('usdt')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'usdt' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            USDT
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'transfer' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Virement International</span>
            <span className="sm:hidden">Virement Intl</span>
          </button>
        </div>
      </div>

      {/* Convertisseur selon la sélection */}
      <div className="[&>*]:rounded-t-none [&>*]:border-t-0 [&>*]:mx-0">
        {activeTab === 'usdt' ? (
          <CurrencyConverter />
        ) : (
          <div className="bg-white border border-gray-100 rounded-b-xl p-8 text-center shadow-sm">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-gray-900 text-xl font-medium mb-2">Bientôt disponible</h3>
              <p className="text-gray-500 text-sm">
                Les virements internationaux seront bientôt disponibles sur Terex. Restez connecté !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
