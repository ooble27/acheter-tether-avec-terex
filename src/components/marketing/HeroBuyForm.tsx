import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const networks = [
  { id: 'TRC20', label: 'TRC20', subtitle: 'Tron', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png' },
  { id: 'BEP20', label: 'BEP20', subtitle: 'BNB Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
  { id: 'ERC20', label: 'ERC20', subtitle: 'Ethereum', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { id: 'SOL', label: 'SOL', subtitle: 'Solana', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
  { id: 'POLYGON', label: 'Polygon', subtitle: 'Matic', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
  { id: 'APTOS', label: 'Aptos', subtitle: 'APT', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
];

export function HeroBuyForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { terexRateCfa } = useTerexRates(2);

  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const rate = terexRateCfa;
  const usdtAmount = amount ? (parseFloat(amount) / rate).toFixed(2) : '0.00';

  const handleProceed = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/dashboard', { state: { action: 'buy', amount, currency: 'CFA', network, walletAddress } });
  };

  const canGoStep2 = amount && parseFloat(amount) > 0;
  const canGoStep3 = walletAddress.length > 10;

  return (
    <div className="w-[300px] xs:w-[320px] sm:w-[360px] lg:w-[420px] max-w-full">
      <div className="bg-terex-darker/95 backdrop-blur-xl border border-terex-gray/25 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden min-h-[340px] sm:min-h-[360px] lg:min-h-[400px]">
        
        {/* Header */}
        <div className="px-4 lg:px-5 pt-4 lg:pt-5 pb-2.5 border-b border-terex-gray/15">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-terex-accent/15 flex items-center justify-center">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <span className="text-foreground font-semibold text-xs lg:text-sm block leading-tight">Acheter USDT</span>
              <span className="text-muted-foreground text-[9px] lg:text-[10px]">Achat rapide et sécurisé</span>
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="px-4 lg:px-5 pt-2.5 pb-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-terex-accent' : 'bg-terex-gray/20'}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 mb-1.5">
            <span className={`text-[8px] lg:text-[9px] ${step >= 1 ? 'text-terex-accent' : 'text-muted-foreground/40'}`}>Montant</span>
            <span className={`text-[8px] lg:text-[9px] ${step >= 2 ? 'text-terex-accent' : 'text-muted-foreground/40'}`}>Réseau</span>
            <span className={`text-[8px] lg:text-[9px] ${step >= 3 ? 'text-terex-accent' : 'text-muted-foreground/40'}`}>Adresse</span>
          </div>
        </div>

        <div className="px-4 lg:px-5 pb-4 lg:pb-5">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-2.5 animate-fade-in">
              <div className="bg-terex-dark/50 rounded-xl p-3 lg:p-4 border border-terex-gray/15">
                <label className="text-[10px] lg:text-[11px] text-muted-foreground mb-1.5 block font-medium">Vous payez</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="50 000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent border-0 outline-none text-foreground text-xl lg:text-2xl font-semibold w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-muted-foreground/30"
                  />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-terex-gray/25 shrink-0">
                    <span className="text-foreground text-xs font-semibold">CFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-terex-dark/50 rounded-xl p-3 lg:p-4 border border-terex-accent/15">
                <label className="text-[10px] lg:text-[11px] text-muted-foreground mb-1.5 block font-medium">Vous recevez</label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-xl lg:text-2xl font-semibold">{usdtAmount}</span>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-terex-accent/10 border border-terex-accent/20 shrink-0">
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-3.5 h-3.5" />
                    <span className="text-terex-accent text-xs font-semibold">USDT</span>
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="bg-terex-dark/30 rounded-lg p-2.5 space-y-1">
                <div className="flex justify-between text-[10px] lg:text-[11px]">
                  <span className="text-muted-foreground">Taux</span>
                  <span className="text-foreground font-medium">1 USDT = {rate.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between text-[10px] lg:text-[11px]">
                  <span className="text-muted-foreground">Frais</span>
                  <span className="text-foreground font-medium">2%</span>
                </div>
              </div>

              <Button
                onClick={() => canGoStep2 && setStep(2)}
                disabled={!canGoStep2}
                className="w-full h-10 lg:h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold text-xs lg:text-sm rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 disabled:opacity-30 disabled:shadow-none group"
              >
                Continuer
                <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          )}

          {/* Step 2: Network */}
          {step === 2 && (
            <div className="space-y-2.5 animate-fade-in">
              <p className="text-muted-foreground text-[10px] lg:text-xs mb-1">Choisissez le réseau de réception</p>
              <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
                {networks.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNetwork(n.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 lg:p-3 rounded-xl border transition-all duration-200 ${
                      network === n.id
                        ? 'bg-terex-accent/15 border-terex-accent/50 shadow-md shadow-terex-accent/10'
                        : 'bg-terex-dark/40 border-terex-gray/20 hover:border-terex-gray/40'
                    }`}
                  >
                    <img src={n.logo} alt={n.label} className="w-6 h-6 lg:w-7 lg:h-7 rounded-full" />
                    <span className={`text-[10px] lg:text-[11px] font-semibold ${network === n.id ? 'text-terex-accent' : 'text-foreground'}`}>{n.label}</span>
                    <span className="text-[8px] lg:text-[9px] text-muted-foreground leading-none">{n.subtitle}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-9 lg:h-11 border-terex-gray/30 text-muted-foreground hover:bg-terex-gray/15 rounded-xl text-[10px] lg:text-xs"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 h-9 lg:h-11 bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold rounded-xl text-xs lg:text-sm shadow-lg shadow-terex-accent/25 group"
                >
                  Continuer
                  <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Wallet Address */}
          {step === 3 && (
            <div className="space-y-2.5 animate-fade-in">
              {/* Summary */}
              <div className="bg-terex-dark/50 rounded-xl p-2.5 lg:p-3 border border-terex-gray/15 space-y-1.5">
                <div className="flex justify-between text-[10px] lg:text-[11px]">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="text-foreground font-medium">{parseInt(amount).toLocaleString()} CFA → {usdtAmount} USDT</span>
                </div>
                <div className="flex items-center justify-between text-[10px] lg:text-[11px]">
                  <span className="text-muted-foreground">Réseau</span>
                  <div className="flex items-center gap-1.5">
                    <img src={networks.find(n => n.id === network)?.logo} alt="" className="w-3.5 h-3.5 rounded-full" />
                    <span className="text-foreground font-medium">{networks.find(n => n.id === network)?.label}</span>
                  </div>
                </div>
              </div>

              <div className="bg-terex-dark/50 rounded-xl p-3 lg:p-4 border border-terex-gray/15">
                <label className="text-[10px] lg:text-[11px] text-muted-foreground mb-1.5 block font-medium">
                  Adresse {networks.find(n => n.id === network)?.label}
                </label>
                <input
                  type="text"
                  placeholder={`Collez votre adresse ${network}`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-transparent border-0 outline-none text-foreground text-xs lg:text-sm w-full placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 h-9 lg:h-12 border-terex-gray/30 text-muted-foreground hover:bg-terex-gray/15 rounded-xl text-[10px] lg:text-xs"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={!canGoStep3}
                  className="flex-1 h-9 lg:h-12 bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold rounded-xl text-xs lg:text-sm shadow-lg shadow-terex-accent/25 transition-all duration-300 disabled:opacity-30 disabled:shadow-none group"
                >
                  Acheter
                  <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>

              {!user && (
                <p className="text-center text-[9px] lg:text-[10px] text-muted-foreground/50 mt-1">
                  Vous serez invité à vous connecter pour finaliser
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
