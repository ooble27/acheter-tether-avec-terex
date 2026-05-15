import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onBack: () => void;
}

const NETWORKS = ['TRC20 (TRON)', 'BEP20 (BSC)', 'ERC20 (Ethereum)', 'Polygon (MATIC)'];
const STEPS = ['Montant & réseau', 'Fournisseur', 'Confirmation'];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-[#3B968F]/8 border border-[#3B968F]/20' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all ${
                isDone ? 'bg-[#3B968F] text-white' :
                isActive ? 'bg-[#3B968F] text-white' :
                'bg-[#1e1e1e] text-gray-600 border border-[#2a2a2a]'
              }`}>
                {isDone ? <Check className="w-3 h-3" /> : n}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 mx-1 transition-all ${step > n ? 'bg-[#3B968F]/40' : 'bg-[#1e1e1e]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BusinessPayments({ user, onBack }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20 (TRON)');
  const [note, setNote] = useState('');

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [useManual, setUseManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualWallet, setManualWallet] = useState('');

  useEffect(() => {
    try {
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
    } catch {}
  }, [userId]);

  const supplierName = useManual ? manualName : (selected?.name || '');
  const walletAddress = useManual ? manualWallet : (selected?.walletAddress || '');
  const reference = `TRX-${Date.now().toString(36).toUpperCase()}`;

  const step1Valid = amount && parseFloat(amount) >= 100;
  const step2Valid = selected || (manualName && manualWallet);

  const fee = parseFloat(amount || '0') * 0.025;
  const total = parseFloat(amount || '0') + fee;

  const handleSubmit = () => {
    const payment = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency: 'USDT',
      walletAddress,
      network,
      reference,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
      supplierName,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(key('payments')) || '[]');
      localStorage.setItem(key('payments'), JSON.stringify([payment, ...existing]));
    } catch {}
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
        <Check className="w-7 h-7 text-emerald-400" />
      </div>
      <h2 className="text-white text-xl font-bold mb-2">Paiement soumis</h2>
      <p className="text-gray-500 text-sm mb-1">
        Référence : <span className="text-white font-mono text-xs">{reference}</span>
      </p>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Notre équipe va traiter votre demande. Vous recevrez une confirmation sous 2–24h.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
        >
          Dashboard
        </Button>
        <Button
          onClick={() => {
            setStep(1); setSubmitted(false);
            setAmount(''); setNote(''); setSelected(null);
            setManualName(''); setManualWallet(''); setUseManual(false);
          }}
          className="bg-[#3B968F] hover:bg-[#3B968F]/90 text-white h-9 text-sm"
        >
          Nouveau paiement
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-white text-sm mb-7 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="mb-2">
        <h2 className="text-white text-lg font-bold">Nouveau paiement</h2>
        <p className="text-gray-600 text-sm mt-0.5">Transfert USDT vers un fournisseur</p>
      </div>

      <div className="h-px bg-[#1c1c1c] my-5" />

      <StepBar step={step} />

      {/* Step 1 */}
      {step === 1 && (
        <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Montant en USDT
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="100"
                className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-4 text-white text-2xl font-bold placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50 pr-20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B968F] font-semibold text-sm">USDT</span>
            </div>
            {amount && parseFloat(amount) > 0 && parseFloat(amount) < 100 && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-amber-400 text-xs">Montant minimum : 100 USDT</p>
              </div>
            )}
            {amount && parseFloat(amount) >= 100 && (
              <div className="mt-3 p-3 rounded-lg bg-[#161616] border border-[#1e1e1e] space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Montant</span>
                  <span className="text-gray-300">{parseFloat(amount).toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Frais plateforme (2.5%)</span>
                  <span className="text-gray-300">{fee.toFixed(2)} USDT</span>
                </div>
                <div className="h-px bg-[#222]" />
                <div className="flex justify-between text-xs">
                  <span className="text-white font-semibold">Total à envoyer</span>
                  <span className="text-[#3B968F] font-bold">{total.toFixed(2)} USDT</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Réseau blockchain
            </label>
            <div className="grid grid-cols-2 gap-2">
              {NETWORKS.map(net => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all text-left ${
                    network === net
                      ? 'bg-[#3B968F]/10 border-[#3B968F]/35 text-[#3B968F]'
                      : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2e2e2e] hover:text-gray-300'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Note interne <span className="text-gray-600 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ex : Commande #4521 – Textile Guangzhou"
              className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            className="w-full bg-[#3B968F] hover:bg-[#3B968F]/90 text-white disabled:opacity-30 h-11 text-sm gap-2"
          >
            Continuer <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-6 space-y-5">
          <div className="flex gap-2">
            <button
              onClick={() => { setUseManual(false); setManualName(''); setManualWallet(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                !useManual
                  ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                  : 'bg-[#161616] border-[#222] text-gray-500 hover:text-gray-300'
              }`}
            >
              Mes fournisseurs ({suppliers.length})
            </button>
            <button
              onClick={() => { setUseManual(true); setSelected(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                useManual
                  ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                  : 'bg-[#161616] border-[#222] text-gray-500 hover:text-gray-300'
              }`}
            >
              Nouveau / Manuel
            </button>
          </div>

          {!useManual && (
            suppliers.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-600 text-sm mb-2">Aucun fournisseur enregistré</p>
                <button onClick={() => setUseManual(true)} className="text-[#3B968F] text-xs hover:underline">
                  Entrer les coordonnées manuellement →
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {suppliers.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left ${
                      selected?.id === s.id
                        ? 'bg-[#3B968F]/8 border-[#3B968F]/25'
                        : 'bg-[#161616] border-[#1e1e1e] hover:border-[#2a2a2a]'
                    }`}
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{s.country} · {s.network}</p>
                      <p className="text-gray-700 text-[10px] font-mono mt-0.5">
                        {s.walletAddress.slice(0, 14)}...{s.walletAddress.slice(-8)}
                      </p>
                    </div>
                    {selected?.id === s.id && (
                      <div className="w-5 h-5 rounded-full bg-[#3B968F] flex items-center justify-center flex-shrink-0 ml-3">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )
          )}

          {useManual && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Nom du fournisseur
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="Ex : Shenzhen Trading Co."
                  className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Adresse wallet USDT
                </label>
                <input
                  type="text"
                  value={manualWallet}
                  onChange={e => setManualWallet(e.target.value)}
                  placeholder={`Adresse ${network.split(' ')[0]}`}
                  className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm font-mono placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="border-[#222] text-gray-500 hover:text-white hover:bg-white/5 h-11 flex-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="bg-[#3B968F] hover:bg-[#3B968F]/90 text-white disabled:opacity-30 h-11 flex-1 text-sm gap-2"
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-6 space-y-5">
          <div>
            <h3 className="text-white font-semibold">Récapitulatif</h3>
            <p className="text-gray-600 text-sm mt-0.5">Vérifiez avant de confirmer</p>
          </div>

          <div className="rounded-lg bg-[#161616] border border-[#1e1e1e] overflow-hidden divide-y divide-[#1e1e1e]">
            {[
              { label: 'Fournisseur', value: supplierName },
              { label: 'Réseau', value: network },
              { label: 'Wallet destinataire', value: `${walletAddress.slice(0, 16)}...${walletAddress.slice(-8)}`, mono: true },
              { label: 'Montant', value: `${parseFloat(amount).toLocaleString()} USDT`, accent: true },
              { label: 'Frais (2.5%)', value: `${fee.toFixed(2)} USDT` },
              { label: 'Total à envoyer', value: `${total.toFixed(2)} USDT`, bold: true },
              { label: 'Référence', value: reference, mono: true },
              ...(note ? [{ label: 'Note', value: note }] : []),
            ].map((row: any) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-600 text-xs">{row.label}</span>
                <span className={`text-xs ${row.bold ? 'text-white font-bold' : row.accent ? 'text-[#3B968F] font-semibold' : 'text-gray-300'} ${row.mono ? 'font-mono' : ''}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/12">
            <Info className="w-4 h-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
            <p className="text-amber-500/70 text-xs leading-relaxed">
              Après confirmation, notre équipe traitera votre demande. Le paiement est effectif sous 2–24h ouvrées. Vous recevrez une notification par email.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="border-[#222] text-gray-500 hover:text-white hover:bg-white/5 h-11 flex-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#3B968F] hover:bg-[#3B968F]/90 text-white h-11 flex-1 text-sm gap-2 shadow-sm shadow-[#3B968F]/20"
            >
              <Send className="w-4 h-4" /> Confirmer le paiement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
