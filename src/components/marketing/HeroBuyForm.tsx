import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Wallet, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const networks = [
  { id: 'TRC20', label: 'TRC20 (Tron)' },
  { id: 'BEP20', label: 'BEP20 (BSC)' },
  { id: 'ERC20', label: 'ERC20 (Ethereum)' },
  { id: 'SOL', label: 'Solana' },
  { id: 'POLYGON', label: 'Polygon' },
];

export function HeroBuyForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { terexRateCfa, terexRateCad } = useTerexRates(2);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'CFA' | 'CAD'>('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [showNetworks, setShowNetworks] = useState(false);

  const rate = currency === 'CFA' ? terexRateCfa : terexRateCad;
  const usdtAmount = amount ? (parseFloat(amount) / rate).toFixed(2) : '0.00';

  const handleProceed = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Navigate to dashboard buy page with pre-filled data
    navigate('/dashboard', { state: { action: 'buy', amount, currency, network, walletAddress } });
  };

  const isValid = amount && parseFloat(amount) > 0 && walletAddress.length > 10;

  return (
    <div className="w-full max-w-md">
      <div className="bg-terex-darker/90 backdrop-blur-xl border border-terex-gray/30 rounded-2xl p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-6 h-6" />
          <span className="text-foreground font-medium text-sm">Acheter USDT</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">En ligne</span>
        </div>

        {/* Amount input */}
        <div className="space-y-3 mb-4">
          <div className="bg-terex-dark/60 rounded-xl p-3 border border-terex-gray/20">
            <label className="text-[11px] text-muted-foreground mb-1 block">Vous payez</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-0 text-foreground text-xl font-medium p-0 h-auto focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setCurrency(currency === 'CFA' ? 'CAD' : 'CFA')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-terex-gray/30 text-foreground text-xs font-medium hover:bg-terex-gray/50 transition-colors shrink-0"
              >
                {currency}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-terex-dark/60 rounded-xl p-3 border border-terex-accent/20">
            <label className="text-[11px] text-muted-foreground mb-1 block">Vous recevez</label>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-xl font-medium">{usdtAmount}</span>
              <span className="ml-auto text-xs text-muted-foreground px-2.5 py-1 rounded-lg bg-terex-gray/20">USDT</span>
            </div>
          </div>
        </div>

        {/* Rate info */}
        <div className="flex justify-between text-[11px] text-muted-foreground mb-4 px-1">
          <span>Taux: 1 USDT = {rate} {currency}</span>
          <span className="text-terex-accent">0% frais</span>
        </div>

        {/* Network selector */}
        <div className="mb-3">
          <button
            onClick={() => setShowNetworks(!showNetworks)}
            className="w-full flex items-center justify-between bg-terex-dark/60 rounded-xl p-3 border border-terex-gray/20 text-sm hover:border-terex-gray/40 transition-colors"
          >
            <span className="text-muted-foreground text-xs">Réseau</span>
            <span className="text-foreground text-xs font-medium flex items-center gap-1">
              {networks.find(n => n.id === network)?.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${showNetworks ? 'rotate-180' : ''}`} />
            </span>
          </button>
          {showNetworks && (
            <div className="mt-1 bg-terex-dark border border-terex-gray/30 rounded-xl overflow-hidden">
              {networks.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setNetwork(n.id); setShowNetworks(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-terex-gray/20 transition-colors ${network === n.id ? 'text-terex-accent bg-terex-accent/5' : 'text-foreground'}`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet address */}
        <div className="mb-4">
          <div className="bg-terex-dark/60 rounded-xl p-3 border border-terex-gray/20">
            <label className="text-[11px] text-muted-foreground mb-1 block">Adresse {network}</label>
            <Input
              type="text"
              placeholder="Collez votre adresse wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-transparent border-0 text-foreground text-xs p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleProceed}
          disabled={!isValid}
          className="w-full h-11 bg-terex-accent hover:bg-terex-accent/90 text-black font-medium text-sm rounded-xl shadow-lg shadow-terex-accent/20 transition-all duration-300 disabled:opacity-40 disabled:shadow-none group"
        >
          {user ? 'Acheter maintenant' : 'Créer un compte'}
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
        </Button>

        {!user && (
          <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
            Connectez-vous pour finaliser votre achat
          </p>
        )}
      </div>
    </div>
  );
}
