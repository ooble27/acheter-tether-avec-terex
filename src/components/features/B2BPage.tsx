import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2, Plus, History, BookUser, ArrowLeft,
  Send, CheckCircle, Clock, XCircle, Copy, Trash2,
  ChevronRight, Briefcase, Globe, Phone, Mail,
  AlertCircle, Download, RefreshCw
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────────────────

interface BusinessProfile {
  companyName: string;
  businessType: string;
  sector: string;
  country: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  walletAddress: string;
  network: string;
  reference: string;
  note: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  supplierName?: string;
}

interface Supplier {
  id: string;
  name: string;
  walletAddress: string;
  network: string;
  country: string;
  createdAt: string;
}

type Tab = 'profile' | 'new-payment' | 'payments' | 'suppliers';

// ─── Storage helpers ─────────────────────────────────────────────────────────────────

const storageKey = (userId: string, key: string) => `terex_b2b_${userId}_${key}`;

function loadData<T>(userId: string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(userId, key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveData<T>(userId: string, key: string, data: T) {
  localStorage.setItem(storageKey(userId, key), JSON.stringify(data));
}

// ─── Sub-components ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PaymentRequest['status'] }) {
  const map = {
    pending:    { label: 'En attente',   className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    processing: { label: 'En cours',     className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    completed:  { label: 'Complété',     className: 'bg-[#ffffff]/15 text-[#ffffff] border-[#ffffff]/20' },
    failed:     { label: 'Échoué',       className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  };
  const { label, className } = map[status];
  return <Badge className={`text-[10px] font-medium px-2 py-0.5 border ${className}`}>{label}</Badge>;
}

function StatusIcon({ status }: { status: PaymentRequest['status'] }) {
  if (status === 'completed')  return <CheckCircle className="w-4 h-4 text-[#ffffff]" />;
  if (status === 'processing') return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
  if (status === 'failed')     return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-amber-400" />;
}

// ─── Main component ─────────────────────────────────────────────────────────────────

interface B2BPageProps {
  onBack?: () => void;
}

export function B2BPage({ onBack }: B2BPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const uid = user?.id || 'guest';

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [pForm, setPForm] = useState({ companyName: '', businessType: '', sector: '', country: '', phone: '', email: '' });
  const [pSaving, setPSaving] = useState(false);

  const [payForm, setPayForm] = useState({ amount: '', currency: 'USDT', walletAddress: '', network: 'TRC20', reference: '', note: '', supplierName: '' });
  const [paySaving, setPaySaving] = useState(false);

  const [supForm, setSupForm] = useState({ name: '', walletAddress: '', network: 'TRC20', country: '' });
  const [supSaving, setSupSaving] = useState(false);
  const [showSupForm, setShowSupForm] = useState(false);

  useEffect(() => {
    const p = loadData<BusinessProfile | null>(uid, 'profile', null);
    const py = loadData<PaymentRequest[]>(uid, 'payments', []);
    const s = loadData<Supplier[]>(uid, 'suppliers', []);
    setProfile(p);
    setPayments(py);
    setSuppliers(s);
    if (p) setPForm({ companyName: p.companyName, businessType: p.businessType, sector: p.sector, country: p.country, phone: p.phone, email: p.email });
  }, [uid]);

  const handleSaveProfile = async () => {
    if (!pForm.companyName.trim()) {
      toast({ title: 'Champ requis', description: 'Le nom de l\'entreprise est obligatoire.', variant: 'destructive' });
      return;
    }
    setPSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const newProfile: BusinessProfile = { ...pForm, createdAt: profile?.createdAt || new Date().toISOString() };
    setProfile(newProfile);
    saveData(uid, 'profile', newProfile);
    setPSaving(false);
    toast({ title: 'Profil Business sauvegardé', description: 'Votre profil entreprise a été mis à jour.', className: 'bg-[#ffffff] text-white border-[#ffffff]' });
  };

  const handleNewPayment = async () => {
    if (!payForm.amount || !payForm.walletAddress) {
      toast({ title: 'Champs requis', description: 'Montant et adresse wallet sont obligatoires.', variant: 'destructive' });
      return;
    }
    setPaySaving(true);
    await new Promise(r => setTimeout(r, 800));
    const newPay: PaymentRequest = {
      id: `PAY-${Date.now()}`,
      amount: parseFloat(payForm.amount),
      currency: payForm.currency,
      walletAddress: payForm.walletAddress,
      network: payForm.network,
      reference: payForm.reference || `REF-${Date.now()}`,
      note: payForm.note,
      supplierName: payForm.supplierName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newPay, ...payments];
    setPayments(updated);
    saveData(uid, 'payments', updated);
    setPayForm({ amount: '', currency: 'USDT', walletAddress: '', network: 'TRC20', reference: '', note: '', supplierName: '' });
    setPaySaving(false);
    setActiveTab('payments');
    toast({ title: 'Demande envoyée !', description: `${newPay.id} — en attente de traitement.`, className: 'bg-[#ffffff] text-white border-[#ffffff]' });
  };

  const handleAddSupplier = async () => {
    if (!supForm.name.trim() || !supForm.walletAddress.trim()) {
      toast({ title: 'Champs requis', description: 'Nom et adresse wallet sont obligatoires.', variant: 'destructive' });
      return;
    }
    setSupSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const newSup: Supplier = { id: `SUP-${Date.now()}`, ...supForm, createdAt: new Date().toISOString() };
    const updated = [newSup, ...suppliers];
    setSuppliers(updated);
    saveData(uid, 'suppliers', updated);
    setSupForm({ name: '', walletAddress: '', network: 'TRC20', country: '' });
    setShowSupForm(false);
    setSupSaving(false);
    toast({ title: 'Fournisseur ajouté', className: 'bg-[#ffffff] text-white border-[#ffffff]' });
  };

  const handleDeletePayment = (id: string) => {
    const updated = payments.filter(p => p.id !== id);
    setPayments(updated);
    saveData(uid, 'payments', updated);
  };

  const handleDeleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    setSuppliers(updated);
    saveData(uid, 'suppliers', updated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié !', description: text.slice(0, 30) + '…' });
  };

  const useSupplierAddress = (sup: Supplier) => {
    setPayForm(f => ({ ...f, walletAddress: sup.walletAddress, network: sup.network, supplierName: sup.name }));
    setActiveTab('new-payment');
  };

  const inputCls = "h-10 bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder:text-[#3a3a3a] rounded-md focus:border-[#ffffff] focus:ring-1 focus:ring-[#ffffff]/30 transition-colors text-sm";
  const selectCls = "h-10 bg-[#1a1a1a] border border-[#2e2e2e] text-white rounded-md focus:border-[#ffffff] text-sm px-3 w-full cursor-pointer";

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile',     label: 'Profil',      icon: Building2 },
    { id: 'new-payment', label: 'Paiement',    icon: Plus },
    { id: 'payments',    label: 'Historique',  icon: History },
    { id: 'suppliers',   label: 'Fournisseurs', icon: BookUser },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">

      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-white">Compte Business</h1>
            <Badge className="bg-[#ffffff]/15 text-[#ffffff] border border-[#ffffff]/20 text-[10px] font-semibold px-2 py-0.5">
              B2B
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Paiements professionnels USDT pour vos fournisseurs</p>
        </div>
      </div>

      {!profile && activeTab !== 'profile' && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-300 font-medium">Profil entreprise non configuré</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Configurez votre profil Business pour accéder à toutes les fonctionnalités.{' '}
              <button onClick={() => setActiveTab('profile')} className="underline hover:text-amber-300">
                Configurer maintenant
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: active ? '#ffffff' : 'transparent',
                color: active ? '#fff' : '#6b6b6b',
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <Card className="bg-[#141414] border-[#2e2e2e]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ffffff]" />
              Informations de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Nom de l'entreprise <span className="text-red-400">*</span></Label>
              <Input placeholder="Ex: Diallo Import Export SARL" value={pForm.companyName} onChange={e => setPForm(f => ({ ...f, companyName: e.target.value }))} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Type d'entreprise</Label>
                <select value={pForm.businessType} onChange={e => setPForm(f => ({ ...f, businessType: e.target.value }))} className={selectCls}>
                  <option value="">Sélectionner</option>
                  <option value="import-export">Import / Export</option>
                  <option value="commerce">Commerce général</option>
                  <option value="freelance">Freelance / Digital</option>
                  <option value="btp">BTP / Construction</option>
                  <option value="agroalimentaire">Agroalimentaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Secteur d'activité</Label>
                <Input placeholder="Ex: Électronique, textile…" value={pForm.sector} onChange={e => setPForm(f => ({ ...f, sector: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Pays</Label>
                <select value={pForm.country} onChange={e => setPForm(f => ({ ...f, country: e.target.value }))} className={selectCls}>
                  <option value="">Sélectionner</option>
                  <option value="SN">Sénégal</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="ML">Mali</option>
                  <option value="BF">Burkina Faso</option>
                  <option value="GN">Guinée</option>
                  <option value="TG">Togo</option>
                  <option value="BJ">Bénin</option>
                  <option value="NE">Niger</option>
                  <option value="CM">Cameroun</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Téléphone professionnel</Label>
                <Input placeholder="+221 77 000 00 00" value={pForm.phone} onChange={e => setPForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Email professionnel</Label>
              <Input type="email" placeholder="contact@monentreprise.com" value={pForm.email} onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
            </div>
            <Separator className="bg-[#2e2e2e]" />
            <div className="bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-lg p-3">
              <p className="text-xs text-[#ffffff] font-medium mb-1">Tarifs Business Terex</p>
              <div className="space-y-1">
                {[
                  ['0 – 500 000 FCFA / mois', '2.5%'],
                  ['500k – 2M FCFA / mois', '2.0%'],
                  ['2M – 10M FCFA / mois', '1.5%'],
                  ['+ 10M FCFA / mois', 'Sur devis'],
                ].map(([range, rate]) => (
                  <div key={range} className="flex justify-between text-xs">
                    <span className="text-gray-400">{range}</span>
                    <span className="text-white font-medium">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={pSaving} className="w-full h-10 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-sm font-medium">
              {pSaving ? 'Sauvegarde…' : profile ? 'Mettre à jour' : 'Créer mon profil Business'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'new-payment' && (
        <Card className="bg-[#141414] border-[#2e2e2e]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#ffffff]" />
              Nouvelle demande de paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suppliers.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Choisir un fournisseur enregistré</Label>
                <div className="flex flex-wrap gap-2">
                  {suppliers.map(s => (
                    <button
                      key={s.id}
                      onClick={() => useSupplierAddress(s)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] text-gray-300 hover:border-[#ffffff]/50 hover:text-white transition-all"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <Separator className="bg-[#2e2e2e] mt-1" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Nom du fournisseur</Label>
              <Input placeholder="Ex: Ali Textile Shanghai" value={payForm.supplierName} onChange={e => setPayForm(f => ({ ...f, supplierName: e.target.value }))} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Montant <span className="text-red-400">*</span></Label>
                <Input type="number" placeholder="0.00" min="1" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Devise</Label>
                <select value={payForm.currency} onChange={e => setPayForm(f => ({ ...f, currency: e.target.value }))} className={selectCls}>
                  <option value="USDT">USDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Adresse wallet du fournisseur <span className="text-red-400">*</span></Label>
              <Input placeholder="Ex: TRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={payForm.walletAddress} onChange={e => setPayForm(f => ({ ...f, walletAddress: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Réseau blockchain</Label>
              <select value={payForm.network} onChange={e => setPayForm(f => ({ ...f, network: e.target.value }))} className={selectCls}>
                <option value="TRC20">TRC20 (TRON) — Frais bas</option>
                <option value="ERC20">ERC20 (Ethereum)</option>
                <option value="BEP20">BEP20 (Binance Smart Chain)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Référence commande</Label>
                <Input placeholder="Ex: INV-2025-0042" value={payForm.reference} onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Note (optionnel)</Label>
                <Input placeholder="Commentaire interne…" value={payForm.note} onChange={e => setPayForm(f => ({ ...f, note: e.target.value }))} className={inputCls} />
              </div>
            </div>
            {payForm.amount && payForm.currency && (
              <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Résumé</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white font-medium">{payForm.amount} {payForm.currency}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Réseau</span>
                  <span className="text-gray-300">{payForm.network}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Frais Terex (2.5%)</span>
                  <span className="text-gray-300">{(parseFloat(payForm.amount || '0') * 0.025).toFixed(2)} {payForm.currency}</span>
                </div>
              </div>
            )}
            <Button onClick={handleNewPayment} disabled={paySaving} className="w-full h-10 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-sm font-medium">
              {paySaving ? 'Envoi en cours…' : 'Soumettre la demande'}
            </Button>
            <p className="text-[11px] text-gray-600 text-center">
              Votre demande sera traitée par l'équipe Terex sous 24h ouvrées.
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{payments.length} demande{payments.length !== 1 ? 's' : ''}</p>
            <Button onClick={() => setActiveTab('new-payment')} size="sm" className="h-8 px-3 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Nouvelle
            </Button>
          </div>
          {payments.length === 0 ? (
            <Card className="bg-[#141414] border-[#2e2e2e]">
              <CardContent className="py-12 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  <History className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">Aucune demande de paiement</p>
                <Button onClick={() => setActiveTab('new-payment')} size="sm" className="h-8 px-4 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-xs">
                  Créer ma première demande
                </Button>
              </CardContent>
            </Card>
          ) : (
            payments.map(pay => (
              <Card key={pay.id} className="bg-[#141414] border-[#2e2e2e] hover:border-[#ffffff]/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0">
                        <StatusIcon status={pay.status} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{pay.supplierName || 'Fournisseur'}</p>
                          <StatusBadge status={pay.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{pay.id} · {pay.network} · {new Date(pay.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white whitespace-nowrap">{pay.amount} {pay.currency}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#2e2e2e] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[11px] text-gray-600 shrink-0">Wallet:</span>
                      <span className="text-[11px] text-gray-400 truncate font-mono">{pay.walletAddress}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => copyToClipboard(pay.walletAddress)} className="p-1.5 rounded-md hover:bg-[#2e2e2e] text-gray-500 hover:text-gray-300 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {pay.status === 'pending' && (
                        <button onClick={() => handleDeletePayment(pay.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {pay.reference && (
                    <p className="text-[11px] text-gray-600 mt-1">Réf: {pay.reference}{pay.note ? ` · ${pay.note}` : ''}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{suppliers.length} fournisseur{suppliers.length !== 1 ? 's' : ''}</p>
            <Button onClick={() => setShowSupForm(s => !s)} size="sm" className="h-8 px-3 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter
            </Button>
          </div>
          {showSupForm && (
            <Card className="bg-[#141414] border-[#ffffff]/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white">Nouveau fournisseur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400">Nom <span className="text-red-400">*</span></Label>
                    <Input placeholder="Ex: Ali Textile Shanghai" value={supForm.name} onChange={e => setSupForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400">Pays</Label>
                    <Input placeholder="Ex: Chine, Dubaï…" value={supForm.country} onChange={e => setSupForm(f => ({ ...f, country: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Adresse wallet <span className="text-red-400">*</span></Label>
                  <Input placeholder="TRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={supForm.walletAddress} onChange={e => setSupForm(f => ({ ...f, walletAddress: e.target.value }))} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Réseau préféré</Label>
                  <select value={supForm.network} onChange={e => setSupForm(f => ({ ...f, network: e.target.value }))} className={selectCls}>
                    <option value="TRC20">TRC20 (TRON)</option>
                    <option value="ERC20">ERC20 (Ethereum)</option>
                    <option value="BEP20">BEP20 (BSC)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddSupplier} disabled={supSaving} className="flex-1 h-9 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-sm">
                    {supSaving ? 'Ajout…' : 'Sauvegarder'}
                  </Button>
                  <Button onClick={() => setShowSupForm(false)} variant="outline" className="h-9 border-[#2e2e2e] bg-transparent text-gray-400 hover:text-white text-sm">
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {suppliers.length === 0 && !showSupForm ? (
            <Card className="bg-[#141414] border-[#2e2e2e]">
              <CardContent className="py-12 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  <BookUser className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">Aucun fournisseur enregistré</p>
                <p className="text-xs text-gray-600 text-center max-w-xs">Sauvegardez les adresses wallets de vos fournisseurs pour les réutiliser facilement.</p>
                <Button onClick={() => setShowSupForm(true)} size="sm" className="h-8 px-4 bg-[#ffffff] hover:bg-[#ffffff]/90 text-white border-0 text-xs">
                  Ajouter un fournisseur
                </Button>
              </CardContent>
            </Card>
          ) : (
            suppliers.map(sup => (
              <Card key={sup.id} className="bg-[#141414] border-[#2e2e2e] hover:border-[#ffffff]/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ffffff]/10 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-[#ffffff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{sup.name}</p>
                        <Badge className="bg-[#2e2e2e] text-gray-400 border-0 text-[10px] px-1.5 py-0">{sup.network}</Badge>
                        {sup.country && <span className="text-[11px] text-gray-500">{sup.country}</span>}
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{sup.walletAddress}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#2e2e2e] flex gap-2">
                    <Button onClick={() => useSupplierAddress(sup)} size="sm" className="flex-1 h-8 bg-[#ffffff]/10 hover:bg-[#ffffff]/20 text-[#ffffff] border border-[#ffffff]/20 text-xs">
                      Utiliser pour un paiement
                    </Button>
                    <button onClick={() => copyToClipboard(sup.walletAddress)} className="px-2.5 h-8 rounded-md border border-[#2e2e2e] hover:bg-[#2e2e2e] text-gray-500 hover:text-gray-300 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteSupplier(sup.id)} className="px-2.5 h-8 rounded-md border border-[#2e2e2e] hover:bg-red-500/10 hover:border-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

    </div>
  );
}
