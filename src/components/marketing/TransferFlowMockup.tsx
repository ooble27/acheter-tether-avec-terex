
import { ArrowRight, Check, Clock, Send } from 'lucide-react';

export function TransferFlowMockup() {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Flow Container */}
      <div className="flex items-center justify-between space-x-4">
        
        {/* Step 1: Sender */}
        <div className="flex-1 max-w-xs">
          <div className="bg-gradient-to-br from-terex-darker to-terex-gray rounded-2xl p-6 border border-terex-accent/20 shadow-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-terex-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Envoi</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-terex-accent">1,000 CAD</div>
                  <div className="text-xs text-gray-400">Canada → Sénégal</div>
                  <div className="text-xs text-green-400">Frais: 0% avec Terex</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-terex-accent" />
          </div>
        </div>

        {/* Step 2: Processing */}
        <div className="flex-1 max-w-xs">
          <div className="bg-gradient-to-br from-terex-darker to-terex-gray rounded-2xl p-6 border border-yellow-500/20 shadow-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Traitement</h3>
                <div className="space-y-2">
                  <div className="text-sm text-yellow-400">En cours...</div>
                  <div className="text-xs text-gray-400">Taux: 1 CAD = 432 CFA</div>
                  <div className="w-full bg-terex-gray rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-terex-accent" />
          </div>
        </div>

        {/* Step 3: Receiver */}
        <div className="flex-1 max-w-xs">
          <div className="bg-gradient-to-br from-terex-darker to-terex-gray rounded-2xl p-6 border border-green-500/20 shadow-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Réception</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">432,000 CFA</div>
                  <div className="text-xs text-gray-400">Orange Money</div>
                  <div className="text-xs text-green-400">Reçu en 3 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8 bg-terex-darker/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-green-400">
            <Check className="w-4 h-4" />
            <span>Demande reçue</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <Check className="w-4 h-4" />
            <span>Paiement confirmé</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <Clock className="w-4 h-4" />
            <span>Transfert en cours</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
            <span>Livraison</span>
          </div>
        </div>
      </div>
    </div>
  );
}
