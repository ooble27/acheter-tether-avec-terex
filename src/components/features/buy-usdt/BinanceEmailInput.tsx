import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Plus, Trash2, Edit3, Wallet, Check } from 'lucide-react';
import { useUserWallets } from '@/hooks/useUserWallets';

const BORDER = 'rgba(255,255,255,0.09)';
const SEL_BG = 'rgba(255,255,255,0.06)';
const SEL_BORDER = 'rgba(255,255,255,0.20)';
const BTN = '#2d2d2d';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${BORDER}`,
  borderRadius: '12px',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '6px',
  letterSpacing: '0.04em',
};

interface BinanceEmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  binanceId: string;
  setBinanceId: (binanceId: string) => void;
}

export function BinanceEmailInput({
  email, setEmail, username, setUsername, binanceId, setBinanceId
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

  const { binanceWallets, loading, saveWallet, deleteWallet, updateWallet } = useUserWallets();

  const shouldShowInputFields = binanceWallets.length === 0 || showInputFields;

  const handleSaveWallet = async () => {
    if (!email || !username || !binanceId || !walletName) return;
    try {
      await saveWallet({ wallet_type: 'binance', wallet_name: walletName, email, username, wallet_id: binanceId, address: null, network: null, is_default: binanceWallets.length === 0 });
      setWalletName(''); setShowSaveDialog(false); setShowInputFields(false); setEditingMode(false);
    } catch (error) { console.error('Error saving wallet:', error); }
  };

  const handleSelectWallet = (walletId: string) => {
    const wallet = binanceWallets.find(w => w.id === walletId);
    if (wallet) { setEmail(wallet.email || ''); setUsername(wallet.username || ''); setBinanceId(wallet.wallet_id || ''); setSelectedWalletId(walletId); }
  };

  const handleDeleteWallet = async (walletId: string) => {
    try {
      await deleteWallet(walletId);
      if (selectedWalletId === walletId) { setSelectedWalletId(''); setEmail(''); setUsername(''); setBinanceId(''); }
    } catch (error) { console.error('Error deleting wallet:', error); }
  };

  const handleSaveEditWallet = async (walletId: string) => {
    if (!editWalletName.trim() || !editWalletEmail || !editWalletUsername || !editWalletId) return;
    try {
      await updateWallet(walletId, { wallet_name: editWalletName, email: editWalletEmail, username: editWalletUsername, wallet_id: editWalletId });
      if (selectedWalletId === walletId) { setEmail(editWalletEmail); setUsername(editWalletUsername); setBinanceId(editWalletId); }
      setEditingWallet(null); setEditWalletName(''); setEditWalletEmail(''); setEditWalletUsername(''); setEditWalletId('');
    } catch (error) { console.error('Error updating wallet:', error); }
  };

  const handleNewWallet = () => { setEmail(''); setUsername(''); setBinanceId(''); setSelectedWalletId(''); setShowInputFields(true); setEditingMode(false); };

  const handleEditExistingWallet = (wallet: any) => { setEmail(wallet.email || ''); setUsername(wallet.username || ''); setBinanceId(wallet.wallet_id || ''); setSelectedWalletId(wallet.id); setShowInputFields(true); setEditingMode(true); };

  const handleCancelInputEdit = () => {
    setShowInputFields(false); setEditingMode(false);
    if (selectedWalletId) {
      const wallet = binanceWallets.find(w => w.id === selectedWalletId);
      if (wallet) { setEmail(wallet.email || ''); setUsername(wallet.username || ''); setBinanceId(wallet.wallet_id || ''); }
    } else { setEmail(''); setUsername(''); setBinanceId(''); }
  };

  const canSave = email && username && binanceId && !binanceWallets.some(w => w.email === email && w.username === username && w.wallet_id === binanceId && w.id !== selectedWalletId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Section wallets sauvegardés */}
      {binanceWallets.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={15} color="rgba(255,255,255,0.5)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>Wallets ({binanceWallets.length})</span>
            </div>
            {!showInputFields && (
              <button
                onClick={handleNewWallet}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: BTN, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '6px 12px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
              >
                <Plus size={13} /> Nouveau
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {binanceWallets.map((wallet) => (
              <div key={wallet.id}
                style={{ borderRadius: '12px', border: `1px solid ${selectedWalletId === wallet.id ? SEL_BORDER : BORDER}`, background: selectedWalletId === wallet.id ? SEL_BG : 'rgba(255,255,255,0.02)', overflow: 'hidden' }}
              >
                {editingWallet === wallet.id ? (
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { val: editWalletName, set: setEditWalletName, ph: 'Nom du wallet' },
                      { val: editWalletEmail, set: setEditWalletEmail, ph: 'Email Binance' },
                      { val: editWalletUsername, set: setEditWalletUsername, ph: 'Pseudo Binance' },
                      { val: editWalletId, set: setEditWalletId, ph: 'ID Binance' }
                    ].map(f => (
                      <input key={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                        style={{ ...inputStyle, padding: '8px 12px', fontSize: '13px' }} />
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button onClick={() => handleSaveEditWallet(wallet.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: BTN, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '7px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                        <Save size={12} /> Sauvegarder
                      </button>
                      <button onClick={() => setEditingWallet(null)}
                        style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '7px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer' }}
                    onClick={() => handleSelectWallet(wallet.id)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{wallet.wallet_name}</span>
                        {wallet.is_default && (
                          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.6)', padding: '2px 7px', borderRadius: '6px', letterSpacing: '0.03em' }}>
                            Défaut
                          </span>
                        )}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{wallet.email}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>ID: {wallet.wallet_id}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
                      {selectedWalletId === wallet.id && <Check size={14} color="rgba(255,255,255,0.7)" />}
                      {!showInputFields && (
                        <button onClick={(e) => { e.stopPropagation(); setEditingWallet(wallet.id); setEditWalletName(wallet.wallet_name); setEditWalletEmail(wallet.email || ''); setEditWalletUsername(wallet.username || ''); setEditWalletId(wallet.wallet_id || ''); }}
                          style={{ padding: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                          <Edit3 size={13} />
                        </button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button onClick={(e) => e.stopPropagation()}
                            style={{ padding: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#f87171', display: 'flex' }}>
                            <Trash2 size={13} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.09)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Supprimer le wallet Binance</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Êtes-vous sûr de vouloir supprimer "{wallet.wallet_name}" ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-white border-[rgba(255,255,255,0.12)]">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteWallet(wallet.id)} className="bg-red-500 hover:bg-red-600 text-white">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Champs de saisie */}
      {shouldShowInputFields && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {binanceWallets.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>
                {editingMode ? 'Modifier le compte' : 'Nouveau compte Binance'}
              </span>
              <button onClick={handleCancelInputEdit}
                style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '5px 12px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          )}

          <div>
            <label style={labelStyle}>EMAIL BINANCE</label>
            <input type="email" placeholder="votre-email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PSEUDO BINANCE</label>
            <input type="text" placeholder="VotrePseudo" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>ID BINANCE</label>
            <input type="text" placeholder="123456789" value={binanceId} onChange={(e) => setBinanceId(e.target.value)} style={inputStyle} />
          </div>
        </div>
      )}

      {/* Save prompt */}
      {canSave && shouldShowInputFields && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>
              {editingMode ? 'Mettre à jour ce compte' : 'Sauvegarder ce compte'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Pour ne plus retaper ces infos</div>
          </div>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: BTN, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '8px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                <Save size={13} /> {editingMode ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.09)]">
              <DialogHeader>
                <DialogTitle className="text-white">{editingMode ? 'Mettre à jour le compte' : 'Sauvegarder le compte Binance'}</DialogTitle>
              </DialogHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                <div>
                  <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.5)' }}>NOM DU COMPTE</label>
                  <input placeholder="Ex: Mon compte principal" value={walletName} onChange={(e) => setWalletName(e.target.value)}
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px' }}>Un nom pour reconnaître ce compte facilement</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSaveWallet} disabled={!walletName || loading}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: !walletName || loading ? 'rgba(255,255,255,0.05)' : '#fff', border: 'none', borderRadius: '12px', padding: '11px', color: !walletName || loading ? '#6b7280' : '#141414', fontSize: '13px', fontWeight: 600, cursor: !walletName || loading ? 'not-allowed' : 'pointer' }}>
                    <Save size={14} /> {loading ? 'Sauvegarde...' : editingMode ? 'Mettre à jour' : 'Sauvegarder'}
                  </button>
                  <button onClick={() => setShowSaveDialog(false)}
                    style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '11px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {!shouldShowInputFields && binanceWallets.length > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Sélectionnez un compte Binance ou créez-en un nouveau
        </p>
      )}

      {shouldShowInputFields && (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Entrez les informations de votre compte Binance pour recevoir vos USDT directement
        </p>
      )}
    </div>
  );
}
