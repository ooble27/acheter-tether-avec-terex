import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const MIN_CFA = 20000;
const MAX_CFA = 2000000;

const networks = [
  { id: 'TRC20', label: 'TRC20', subtitle: 'Tron', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png' },
  { id: 'BEP20', label: 'BEP20', subtitle: 'BNB Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
  { id: 'ERC20', label: 'ERC20', subtitle: 'Ethereum', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { id: 'SOL', label: 'SOL', subtitle: 'Solana', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
  { id: 'POLYGON', label: 'Polygon', subtitle: 'Matic', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
  { id: 'APTOS', label: 'Aptos', subtitle: 'APT', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
];

const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

export function HeroBuyForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { terexRateCfa } = useTerexRates(2);

  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const rate = terexRateCfa;
  const numericAmount = parseFloat(amount) || 0;
  const usdtAmount = numericAmount > 0 ? (numericAmount / rate).toFixed(2) : '0.00';

  const isBelowMin = numericAmount > 0 && numericAmount < MIN_CFA;
  const isAboveMax = numericAmount > MAX_CFA;
  const isValidAmount = numericAmount >= MIN_CFA && numericAmount <= MAX_CFA;

  const handleAmountChange = (value: string) => {
    const num = parseFloat(value) || 0;
    if (num > MAX_CFA) {
      setAmount(MAX_CFA.toString());
    } else {
      setAmount(value);
    }
  };

  const handleProceed = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/dashboard', { state: { action: 'buy', amount, currency: 'CFA', network, walletAddress } });
  };

  const canGoStep2 = isValidAmount;
  const canGoStep3 = walletAddress.length > 10;

  return (
    <div className="w-[340px] sm:w-[360px] lg:w-[420px] max-w-[92vw]">
      <div className="relative bg-gradient-to-b from-terex-darker/98 to-terex-dark/95 backdrop-blur-2xl border border-terex-gray/20 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Subtle accent glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent" />
        
        {/* Header */}
        <div className="px-5 lg:px-6 pt-5 lg:pt-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 border border-terex-accent/20 flex items-center justify-center">
                <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <span className="text-foreground font-bold text-sm lg:text-base block leading-tight">Acheter USDT</span>
                <span className="text-muted-foreground text-[10px] lg:text-xs flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-terex-accent" />
                  Rapide & sécurisé
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-terex-accent/10 border border-terex-accent/15">
              <Zap className="w-2.5 h-2.5 text-terex-accent" />
              <span className="text-terex-accent text-[9px] lg:text-[10px] font-semibold">LIVE</span>
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="px-5 lg:px-6 pb-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-[3px] rounded-full transition-all duration-500 ${
                  step >= s 
                    ? 'bg-gradient-to-r from-terex-accent to-terex-accent/70' 
                    : 'bg-terex-gray/15'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5 mb-1">
            <span className={`text-[9px] lg:text-[10px] font-medium transition-colors ${step >= 1 ? 'text-terex-accent' : 'text-muted-foreground/30'}`}>Montant</span>
            <span className={`text-[9px] lg:text-[10px] font-medium transition-colors ${step >= 2 ? 'text-terex-accent' : 'text-muted-foreground/30'}`}>Réseau</span>
            <span className={`text-[9px] lg:text-[10px] font-medium transition-colors ${step >= 3 ? 'text-terex-accent' : 'text-muted-foreground/30'}`}>Adresse</span>
          </div>
        </div>

        <div className="px-5 lg:px-6 pb-5 lg:pb-6">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              {/* Pay input */}
              <div className="relative rounded-2xl p-4 lg:p-5 border border-terex-gray/15 bg-terex-dark/40 hover:border-terex-gray/25 transition-colors">
                <label className="text-[10px] lg:text-xs text-muted-foreground mb-2 block font-medium uppercase tracking-wider">Vous payez</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="50 000"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="bg-transparent border-0 outline-none text-foreground text-2xl lg:text-3xl font-bold w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-muted-foreground/20"
                  />
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-terex-gray/20 border border-terex-gray/15 shrink-0">
                    <span className="text-foreground text-xs lg:text-sm font-bold">CFA</span>
                  </div>
                </div>
                {/* Min/Max hint */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-terex-gray/10">
                  <span className="text-muted-foreground/50 text-[9px] lg:text-[10px]">Min: {MIN_CFA.toLocaleString()} CFA</span>
                  <span className="text-muted-foreground/50 text-[9px] lg:text-[10px]">Max: {MAX_CFA.toLocaleString()} CFA</span>
                </div>
              </div>

              {/* Validation message */}
              {isBelowMin && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
                  <span className="text-destructive text-[10px] lg:text-xs">Montant minimum : {MIN_CFA.toLocaleString()} CFA</span>
                </div>
              )}

              {/* Quick amounts */}
              <div className="flex flex-wrap gap-1.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q.toString())}
                    className={`px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-medium transition-all border ${
                      numericAmount === q
                        ? 'bg-terex-accent/15 border-terex-accent/40 text-terex-accent'
                        : 'bg-terex-dark/30 border-terex-gray/15 text-muted-foreground hover:border-terex-gray/30 hover:text-foreground'
                    }`}
                  >
                    {q >= 1000000 ? `${q / 1000000}M` : `${q / 1000}K`}
                  </button>
                ))}
              </div>

              {/* Receive output */}
              <div className="relative rounded-2xl p-4 lg:p-5 border border-terex-accent/15 bg-gradient-to-br from-terex-accent/[0.03] to-transparent">
                <label className="text-[10px] lg:text-xs text-muted-foreground mb-2 block font-medium uppercase tracking-wider">Vous recevez</label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-2xl lg:text-3xl font-bold">{usdtAmount}</span>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-terex-accent/10 border border-terex-accent/20 shrink-0">
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-4 h-4" />
                    <span className="text-terex-accent text-xs lg:text-sm font-bold">USDT</span>
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="flex items-center justify-between px-1 text-[10px] lg:text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">Taux <span className="text-foreground font-medium">{rate.toLocaleString()} CFA</span></span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground">Frais <span className="text-terex-accent font-medium">2%</span></span>
                </div>
              </div>

              <Button
                onClick={() => canGoStep2 && setStep(2)}
                disabled={!canGoStep2}
                className="w-full h-11 lg:h-12 bg-gradient-to-r from-terex-accent to-terex-accent/85 hover:from-terex-accent/95 hover:to-terex-accent/75 text-black font-bold text-sm lg:text-base rounded-xl shadow-lg shadow-terex-accent/20 transition-all duration-300 disabled:opacity-30 disabled:shadow-none group"
              >
                Continuer
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          )}

          {/* Step 2: Network */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-muted-foreground text-xs lg:text-sm">Choisissez le réseau de réception</p>
              <div className="grid grid-cols-3 gap-2">
                {networks.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNetwork(n.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 lg:p-3.5 rounded-xl border transition-all duration-200 ${
                      network === n.id
                        ? 'bg-terex-accent/10 border-terex-accent/40 shadow-lg shadow-terex-accent/10 scale-[1.02]'
                        : 'bg-terex-dark/30 border-terex-gray/15 hover:border-terex-gray/30 hover:bg-terex-dark/50'
                    }`}
                  >
                    <img src={n.logo} alt={n.label} className="w-7 h-7 lg:w-8 lg:h-8 rounded-full" />
                    <span className={`text-[10px] lg:text-xs font-bold ${network === n.id ? 'text-terex-accent' : 'text-foreground'}`}>{n.label}</span>
                    <span className="text-[8px] lg:text-[9px] text-muted-foreground/60 leading-none">{n.subtitle}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-10 lg:h-11 border-terex-gray/25 text-muted-foreground hover:bg-terex-gray/10 rounded-xl text-xs"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 h-10 lg:h-11 bg-gradient-to-r from-terex-accent to-terex-accent/85 hover:from-terex-accent/95 hover:to-terex-accent/75 text-black font-bold rounded-xl text-sm shadow-lg shadow-terex-accent/20 group"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Wallet Address */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              {/* Summary */}
              <div className="rounded-xl p-3 lg:p-4 border border-terex-gray/15 bg-terex-dark/30 space-y-2">
                <div className="flex justify-between text-[10px] lg:text-xs">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="text-foreground font-semibold">{numericAmount.toLocaleString()} CFA → {usdtAmount} USDT</span>
                </div>
                <div className="flex items-center justify-between text-[10px] lg:text-xs">
                  <span className="text-muted-foreground">Réseau</span>
                  <div className="flex items-center gap-1.5">
                    <img src={networks.find(n => n.id === network)?.logo} alt="" className="w-4 h-4 rounded-full" />
                    <span className="text-foreground font-semibold">{networks.find(n => n.id === network)?.label}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4 lg:p-5 border border-terex-gray/15 bg-terex-dark/40 hover:border-terex-gray/25 transition-colors">
                <label className="text-[10px] lg:text-xs text-muted-foreground mb-2 block font-medium uppercase tracking-wider">
                  Adresse {networks.find(n => n.id === network)?.label}
                </label>
                <input
                  type="text"
                  placeholder={`Collez votre adresse ${network}`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-transparent border-0 outline-none text-foreground text-sm lg:text-base w-full placeholder:text-muted-foreground/25 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 h-10 lg:h-12 border-terex-gray/25 text-muted-foreground hover:bg-terex-gray/10 rounded-xl text-xs"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={!canGoStep3}
                  className="flex-1 h-10 lg:h-12 bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold rounded-xl text-sm lg:text-base shadow-lg shadow-terex-accent/25 transition-all duration-300 disabled:opacity-30 disabled:shadow-none group"
                >
                  Acheter
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>

              {!user && (
                <p className="text-center text-[9px] lg:text-[10px] text-muted-foreground/40 mt-1">
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
