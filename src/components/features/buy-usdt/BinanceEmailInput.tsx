
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useUserWallets } from '@/hooks/useUserWallets';

interface BinanceEmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  binanceId: string;
  setBinanceId: (binanceId: string) => void;
}

export function BinanceEmailInput({ 
  email, 
  setEmail, 
  username, 
  setUsername, 
  binanceId, 
  setBinanceId 
}: BinanceEmailInputProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  
  const { 
    binanceWallets, 
    loading, 
    saveWallet, 
    deleteWallet 
  } = useUserWallets();

  const handleSaveWallet = async () => {
    if (!email || !username || !binanceId || !walletName) return;

    try {
      await saveWallet({
        wallet_type: 'binance',
        wallet_name: walletName,
        email,
        username,
        wallet_id: binanceId,
        is_default: binanceWallets.length === 0 // Premier wallet = défaut
      });
      
      setWalletName('');
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  const handleSelectWallet = (walletId: string) => {
    const wallet = binanceWallets.find(w => w.id === walletId);
    if (wallet) {
      setEmail(wallet.email || '');
      setUsername(wallet.username || '');
      setBinanceId(wallet.wallet_id || '');
      setSelectedWalletId(walletId);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    try {
      await deleteWallet(walletId);
      if (selectedWalletId === walletId) {
        setSelectedWalletId('');
        setEmail('');
        setUsername('');
        setBinanceId('');
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  const canSave = email && username && binanceId && !binanceWallets.some(w => 
    w.email === email && w.username === username && w.wallet_id === binanceId
  );

  return (
    <div className="space-y-4">
      <Label className="text-white text-sm font-medium flex items-center space-x-2">
        <img 
          src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
          alt="Binance" 
          className="w-4 h-4 rounded"
        />
        <span>Informations de votre compte Binance</span>
      </Label>

      {/* Sélection des wallets sauvegardés */}
      {binanceWallets.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white text-xs">Comptes Binance sauvegardés</Label>
          <div className="flex items-center space-x-2">
            <Select value={selectedWalletId} onValueChange={handleSelectWallet}>
              <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                <SelectValue placeholder="Sélectionner un compte sauvegardé" />
              </SelectTrigger>
              <SelectContent>
                {binanceWallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{wallet.wallet_name}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {wallet.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWalletId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteWallet(selectedWalletId)}
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Champs de saisie */}
      <div className="space-y-3">
        <div>
          <Label className="text-white text-xs">Email Binance</Label>
          <Input
            type="email"
            placeholder="votre-email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>

        <div>
          <Label className="text-white text-xs">Pseudo Binance</Label>
          <Input
            type="text"
            placeholder="VotrePseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>

        <div>
          <Label className="text-white text-xs">ID Binance</Label>
          <Input
            type="text"
            placeholder="123456789"
            value={binanceId}
            onChange={(e) => setBinanceId(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      {canSave && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-terex-accent border-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder ce compte Binance
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-terex-darker border-terex-gray">
            <DialogHeader>
              <DialogTitle className="text-white">Sauvegarder le compte Binance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Nom du compte</Label>
                <Input
                  placeholder="Ex: Mon compte principal"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveWallet}
                  disabled={!walletName || loading}
                  className="flex-1 bg-terex-accent hover:bg-terex-accent/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="text-white border-terex-gray-light"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <p className="text-gray-400 text-xs">
        Entrez les informations de votre compte Binance pour recevoir vos USDT directement
      </p>
    </div>
  );
}
