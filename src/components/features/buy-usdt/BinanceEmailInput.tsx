
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, Plus, Trash2, Edit3, Wallet } from 'lucide-react';
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
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editWalletName, setEditWalletName] = useState('');
  const [editWalletEmail, setEditWalletEmail] = useState('');
  const [editWalletUsername, setEditWalletUsername] = useState('');
  const [editWalletId, setEditWalletId] = useState('');
  const [showInputFields, setShowInputFields] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  
  const { 
    binanceWallets, 
    loading, 
    saveWallet, 
    deleteWallet,
    updateWallet 
  } = useUserWallets();

  // Déterminer si on doit afficher les champs par défaut
  const shouldShowInputFields = binanceWallets.length === 0 || showInputFields;

  const handleSaveWallet = async () => {
    if (!email || !username || !binanceId || !walletName) return;

    try {
      await saveWallet({
        wallet_type: 'binance',
        wallet_name: walletName,
        email,
        username,
        wallet_id: binanceId,
        address: null,
        network: null,
        is_default: binanceWallets.length === 0
      });
      
      setWalletName('');
      setShowSaveDialog(false);
      setShowInputFields(false);
      setEditingMode(false);
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

  const handleStartEditWallet = (wallet: any) => {
    setEditingWallet(wallet.id);
    setEditWalletName(wallet.wallet_name);
    setEditWalletEmail(wallet.email || '');
    setEditWalletUsername(wallet.username || '');
    setEditWalletId(wallet.wallet_id || '');
  };

  const handleSaveEditWallet = async (walletId: string) => {
    if (!editWalletName.trim() || !editWalletEmail || !editWalletUsername || !editWalletId) return;
    
    try {
      await updateWallet(walletId, { 
        wallet_name: editWalletName,
        email: editWalletEmail,
        username: editWalletUsername,
        wallet_id: editWalletId
      });
      
      // Mettre à jour les champs principaux si c'est le wallet sélectionné
      if (selectedWalletId === walletId) {
        setEmail(editWalletEmail);
        setUsername(editWalletUsername);
        setBinanceId(editWalletId);
      }
      
      setEditingWallet(null);
      setEditWalletName('');
      setEditWalletEmail('');
      setEditWalletUsername('');
      setEditWalletId('');
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
    setEditWalletName('');
    setEditWalletEmail('');
    setEditWalletUsername('');
    setEditWalletId('');
  };

  const handleNewWallet = () => {
    setEmail('');
    setUsername('');
    setBinanceId('');
    setSelectedWalletId('');
    setShowInputFields(true);
    setEditingMode(false);
  };

  const handleEditExistingWallet = (wallet: any) => {
    setEmail(wallet.email || '');
    setUsername(wallet.username || '');
    setBinanceId(wallet.wallet_id || '');
    setSelectedWalletId(wallet.id);
    setShowInputFields(true);
    setEditingMode(true);
  };

  const handleCancelInputEdit = () => {
    setShowInputFields(false);
    setEditingMode(false);
    if (selectedWalletId) {
      const wallet = binanceWallets.find(w => w.id === selectedWalletId);
      if (wallet) {
        setEmail(wallet.email || '');
        setUsername(wallet.username || '');
        setBinanceId(wallet.wallet_id || '');
      }
    } else {
      setEmail('');
      setUsername('');
      setBinanceId('');
    }
  };

  const canSave = email && username && binanceId && !binanceWallets.some(w => 
    w.email === email && w.username === username && w.wallet_id === binanceId && w.id !== selectedWalletId
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

      {/* Section des wallets sauvegardés */}
      {binanceWallets.length > 0 && (
        <div className="bg-terex-gray/30 rounded-lg p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white text-sm font-medium flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Comptes Binance sauvegardés ({binanceWallets.length})</span>
              <span className="sm:hidden">Comptes ({binanceWallets.length})</span>
            </Label>
            {!showInputFields && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewWallet}
                className="text-terex-accent border-terex-accent hover:bg-terex-accent hover:text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Nouveau</span>
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {binanceWallets.map((wallet) => (
              <div key={wallet.id} className={`
                flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg border transition-colors cursor-pointer
                ${selectedWalletId === wallet.id 
                  ? 'border-terex-accent bg-terex-accent/10' 
                  : 'border-terex-gray-light hover:border-terex-accent/50'
                }
              `}>
                {editingWallet === wallet.id ? (
                  <div className="w-full space-y-3">
                    <div className="space-y-2">
                      <Input
                        value={editWalletName}
                        onChange={(e) => setEditWalletName(e.target.value)}
                        className="bg-terex-darker border-terex-gray-light text-white h-8 text-sm"
                        placeholder="Nom du wallet"
                      />
                      <Input
                        value={editWalletEmail}
                        onChange={(e) => setEditWalletEmail(e.target.value)}
                        className="bg-terex-darker border-terex-gray-light text-white h-8 text-sm"
                        placeholder="Email Binance"
                      />
                      <Input
                        value={editWalletUsername}
                        onChange={(e) => setEditWalletUsername(e.target.value)}
                        className="bg-terex-darker border-terex-gray-light text-white h-8 text-sm"
                        placeholder="Pseudo Binance"
                      />
                      <Input
                        value={editWalletId}
                        onChange={(e) => setEditWalletId(e.target.value)}
                        className="bg-terex-darker border-terex-gray-light text-white h-8 text-sm"
                        placeholder="ID Binance"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEditWallet(wallet.id)}
                        className="bg-terex-accent hover:bg-terex-accent/90 text-white h-8 text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-gray-400 border-terex-gray-light hover:bg-terex-gray hover:text-white h-8 text-xs"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelectWallet(wallet.id)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm truncate">{wallet.wallet_name}</span>
                        {wallet.is_default && (
                          <span className="text-xs bg-terex-accent text-white px-2 py-0.5 rounded">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs space-y-1 sm:space-y-0">
                        <div className="truncate">{wallet.email}</div>
                        <div className="truncate">ID: {wallet.wallet_id}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-1 mt-2 sm:mt-0">
                      {!showInputFields && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEditWallet(wallet)}
                          className="text-gray-400 hover:text-white h-8 w-8 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-terex-darker border-terex-gray">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Supprimer le wallet Binance
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Êtes-vous sûr de vouloir supprimer "{wallet.wallet_name}" ? 
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-white border-terex-gray-light">
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteWallet(wallet.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Champs de saisie - affichés conditionnellement */}
      {shouldShowInputFields && (
        <div className="space-y-3">
          {binanceWallets.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <Label className="text-white text-sm font-medium">
                {editingMode ? 'Modifier le compte Binance' : 'Nouveau compte Binance'}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelInputEdit}
                className="text-gray-400 border-terex-gray-light hover:bg-terex-gray hover:text-white text-xs"
              >
                Annuler
              </Button>
            </div>
          )}

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
      )}

      {/* Bouton de sauvegarde - Plus visible */}
      {canSave && shouldShowInputFields && (
        <div className="bg-terex-accent/10 border border-terex-accent/30 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <p className="text-white text-sm font-medium">
                {editingMode ? 'Mettre à jour ce compte Binance' : 'Sauvegarder ce compte Binance'}
              </p>
              <p className="text-gray-400 text-xs">
                Pour ne plus avoir à retaper ces informations
              </p>
            </div>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button
                  className="bg-terex-accent hover:bg-terex-accent/90 text-white w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingMode ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-terex-darker border-terex-gray">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingMode ? 'Mettre à jour le compte Binance' : 'Sauvegarder le compte Binance'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Donnez un nom à ce compte</Label>
                    <Input
                      placeholder="Ex: Mon compte principal, Compte trading, etc."
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Choisissez un nom qui vous permettra de reconnaître facilement ce compte
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={handleSaveWallet}
                      disabled={!walletName || loading}
                      className="flex-1 bg-terex-accent hover:bg-terex-accent/90 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Sauvegarde...' : editingMode ? 'Mettre à jour' : 'Sauvegarder'}
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
          </div>
        </div>
      )}

      {!shouldShowInputFields && binanceWallets.length > 0 && (
        <p className="text-gray-400 text-xs">
          Sélectionnez un compte Binance sauvegardé ou créez-en un nouveau
        </p>
      )}

      {shouldShowInputFields && (
        <p className="text-gray-400 text-xs">
          Entrez les informations de votre compte Binance pour recevoir vos USDT directement
        </p>
      )}
    </div>
  );
}
