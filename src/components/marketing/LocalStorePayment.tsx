
import { QrCode, Smartphone, Store, CheckCircle } from 'lucide-react';

export function LocalStorePayment() {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-2xl">
      {/* Store Counter Scene */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Store Counter */}
        <div className="relative">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="flex items-center mb-4">
              <Store className="w-6 h-6 text-terex-accent mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Épicerie Mamadou</h3>
            </div>
            
            {/* Receipt */}
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm mb-4">
              <div className="text-center border-b border-gray-300 pb-2 mb-2">
                <p className="font-bold">FACTURE #2024-001</p>
                <p className="text-xs text-gray-600">Dakar, Sénégal</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Riz 5kg</span>
                  <span>2,500 CFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Huile 1L</span>
                  <span>1,200 CFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Pain</span>
                  <span>300 CFA</span>
                </div>
                <div className="border-t border-gray-300 pt-1 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>4,000 CFA</span>
                  </div>
                  <div className="flex justify-between text-terex-accent">
                    <span>≈ 6.5 USDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant's QR Code Display */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="w-32 h-32 mx-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 ${
                        Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Scannez pour payer</p>
              <p className="text-sm font-semibold text-terex-accent">6.5 USDT</p>
            </div>
          </div>
        </div>

        {/* Right Side - Customer's Phone */}
        <div className="relative">
          {/* Phone Mockup */}
          <div className="relative mx-auto w-64 h-[500px] bg-black rounded-[3rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="w-full h-full bg-terex-dark rounded-[2.5rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10"></div>
              
              {/* Status Bar */}
              <div className="h-8 bg-terex-darker flex items-center justify-between px-4 text-xs text-white pt-6">
                <span>9:41</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>

              {/* App Content */}
              <div className="p-4 text-white h-full">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-terex-accent mb-2">Terex Pay</h2>
                  <p className="text-sm text-gray-400">Paiement USDT</p>
                </div>

                {/* QR Scanner View */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-800 rounded-lg border-2 border-terex-accent relative overflow-hidden">
                    {/* Scanner overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terex-accent/20 to-transparent"></div>
                    
                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-terex-accent"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-terex-accent"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-terex-accent"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-terex-accent"></div>
                    
                    {/* Scanning line animation */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-terex-accent animate-bounce"></div>
                    
                    <div className="flex items-center justify-center h-full">
                      <QrCode className="w-16 h-16 text-terex-accent/60" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Scannez le code QR du marchand
                  </p>
                </div>

                {/* Payment Details */}
                <div className="bg-terex-darker rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Montant:</span>
                    <span className="text-xl font-bold text-terex-accent">6.5 USDT</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Marchand:</span>
                    <span className="text-white">Épicerie Mamadou</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Frais:</span>
                    <span className="text-green-400">Gratuit</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 text-black font-bold py-3 rounded-lg shadow-lg">
                  Confirmer le paiement
                </button>
              </div>
            </div>
          </div>

          {/* Success Animation */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Transaction Flow Steps */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <QrCode className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">1. Scanner</h4>
          <p className="text-sm text-gray-600">Le client scanne le QR code du marchand</p>
        </div>

        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="w-12 h-12 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Smartphone className="w-6 h-6 text-terex-accent" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">2. Confirmer</h4>
          <p className="text-sm text-gray-600">Vérification du montant et confirmation</p>
        </div>

        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">3. Validé</h4>
          <p className="text-sm text-gray-600">Paiement instantané et sécurisé</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2 text-center">Avantages du paiement USDT</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <span className="text-terex-accent font-semibold">✓ Instantané</span>
            <p className="text-gray-600">Transaction en temps réel</p>
          </div>
          <div className="text-center">
            <span className="text-terex-accent font-semibold">✓ Sans frais</span>
            <p className="text-gray-600">0% de commission</p>
          </div>
          <div className="text-center">
            <span className="text-terex-accent font-semibold">✓ Sécurisé</span>
            <p className="text-gray-600">Blockchain sécurisée</p>
          </div>
        </div>
      </div>
    </div>
  );
}
