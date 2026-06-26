import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  User, Mail, Phone, MapPin, Shield, CheckCircle, Clock, XCircle, AlertTriangle,
  LogOut, ChevronRight, ArrowLeft, Key, Lock, Trash2, Eye, EyeOff,
  Globe, Bell, Activity, TrendingUp, Edit2, Save, X
} from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

type Section = null | 'informations' | 'securite' | 'preferences' | 'activite';

const ACCENT = '#3B968F';
const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [section, setSection] = useState<Section>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { profile, updateProfile, loading } = useUserProfile();
  const { kycData, loading: kycLoading } = useKYC();

  const [formData, setFormData] = useState({ name: '', phone: '', country: '', language: 'fr' });

  useEffect(() => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr',
    });
  }, [profile, user]);

  if (loading || kycLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: BG }}>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>Chargement...</span>
      </div>
    );
  }

  if (showKYC) return <KYCPage onBack={() => setShowKYC(false)} />;

  const isKYCVerified = kycData?.status === 'approved';
  const kycStatus = (() => {
    if (isKYCVerified) return { icon: CheckCircle, text: 'Vérifié', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' };
    if (kycData?.status === 'submitted' || kycData?.status === 'under_review') return { icon: Clock, text: 'En cours', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' };
    if (kycData?.status === 'rejected') return { icon: XCircle, text: 'Rejeté', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' };
    return { icon: AlertTriangle, text: 'Non vérifié', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' };
  })();
  const KYCIcon = kycStatus.icon;

  const initials = (formData.name || user?.email || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    const result = await updateProfile({ full_name: formData.name, phone: formData.phone, country: formData.country, language: formData.language });
    if (result.error) { toast({ title: 'Erreur', description: result.error, variant: 'destructive' }); return; }
    setIsEditing(false);
    toast({ title: 'Profil mis à jour', description: 'Vos informations ont été sauvegardées', className: 'bg-green-600 text-white' });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas', variant: 'destructive' }); return; }
    if (newPassword.length < 6) { toast({ title: 'Erreur', description: 'Minimum 6 caractères', variant: 'destructive' }); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Mot de passe modifié', className: 'bg-green-600 text-white' });
    setShowPasswordDialog(false); setNewPassword(''); setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.functions.invoke('delete-user-account');
    if (error) { toast({ title: 'Erreur', description: 'Impossible de supprimer le compte', variant: 'destructive' }); return; }
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  // ── Sub-section views ────────────────────────────────────────────────────

  const SubHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => { setSection(null); setIsEditing(false); }} style={{ width: '36px', height: '36px', borderRadius: '50%', background: CARD, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <ArrowLeft size={16} color="#fff" />
      </button>
      <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 600, margin: 0 }}>{title}</h2>
    </div>
  );

  const Field = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <Icon size={13} color="#6b7280" />
        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <p style={{ color: value ? '#fff' : '#4b5563', fontSize: '15px', margin: 0, fontWeight: 400 }}>{value || 'Non renseigné'}</p>
    </div>
  );

  if (section === 'informations') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Informations personnelles" />
        <div style={{ padding: '0 20px' }}>
          {!isEditing ? (
            <>
              <Field label="Nom complet" value={formData.name} icon={User} />
              <Field label="Email" value={user?.email || ''} icon={Mail} />
              <Field label="Téléphone" value={formData.phone} icon={Phone} />
              <Field label="Pays" value={formData.country} icon={MapPin} />
              <Field label="Langue" value={formData.language === 'fr' ? 'Français' : 'English'} icon={Globe} />
              <div style={{ paddingTop: '24px' }}>
                <button onClick={() => setIsEditing(true)} style={{ width: '100%', padding: '14px', background: ACCENT, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Edit2 size={16} /> Modifier mes informations
                </button>
              </div>
            </>
          ) : (
            <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Label className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1 mb-2"><User size={12} /> Nom complet</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-terex-gray border-terex-gray-light text-white" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1 mb-2"><Phone size={12} /> Téléphone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+221 XX XXX XX XX" className="bg-terex-gray border-terex-gray-light text-white" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1 mb-2"><MapPin size={12} /> Pays</Label>
                <Select value={formData.country} onValueChange={v => setFormData({ ...formData, country: v })}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray z-50">
                    <SelectItem value="senegal">Sénégal</SelectItem>
                    <SelectItem value="mali">Mali</SelectItem>
                    <SelectItem value="burkina">Burkina Faso</SelectItem>
                    <SelectItem value="cote_ivoire">Côte d'Ivoire</SelectItem>
                    <SelectItem value="niger">Niger</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1 mb-2"><Globe size={12} /> Langue</Label>
                <Select value={formData.language} onValueChange={v => setFormData({ ...formData, language: v })}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray z-50">
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '14px', background: ACCENT, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={15} /> Sauvegarder
                </button>
                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '14px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', color: '#9ca3af', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (section === 'securite') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Sécurité" />
        <div style={{ padding: '20px' }}>
          {/* KYC status card */}
          <div style={{ background: kycStatus.bg, border: `1px solid ${kycStatus.border}`, borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: kycStatus.bg, border: `1px solid ${kycStatus.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KYCIcon size={20} color={kycStatus.color} />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>Vérification KYC</p>
                <p style={{ color: kycStatus.color, fontSize: '12px', margin: 0 }}>{kycStatus.text}</p>
              </div>
            </div>
            {!isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review' && (
              <button onClick={() => setShowKYC(true)} style={{ padding: '8px 16px', background: ACCENT, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Vérifier
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden' }}>
            <button onClick={() => setShowPasswordDialog(true)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,150,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={16} color={ACCENT} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>Changer le mot de passe</p>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Mettre à jour vos identifiants</p>
              </div>
              <ChevronRight size={16} color="#4b5563" />
            </button>
            <button onClick={() => setShowDeleteDialog(true)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={16} color="#ef4444" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>Supprimer mon compte</p>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Action irréversible</p>
              </div>
              <ChevronRight size={16} color="#4b5563" />
            </button>
          </div>

          {/* Security tips */}
          <div style={{ marginTop: '20px', background: 'rgba(59,150,143,0.07)', border: `1px solid rgba(59,150,143,0.15)`, borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={15} color={ACCENT} />
              <span style={{ color: ACCENT, fontSize: '13px', fontWeight: 600 }}>Conseils de sécurité</span>
            </div>
            {['Ne partagez jamais vos identifiants de connexion', 'Vérifiez toujours les adresses avant d\'envoyer', 'Utilisez un réseau sécurisé pour vos transactions'].map((tip, i) => (
              <p key={i} style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px', paddingLeft: '4px' }}>· {tip}</p>
            ))}
          </div>
        </div>

        {/* Password dialog */}
        <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <AlertDialogContent className="bg-terex-darker border-terex-gray">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2"><Key className="w-4 h-4 text-terex-accent" /> Nouveau mot de passe</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">Minimum 6 caractères</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-2">
              {[{ label: 'Nouveau', val: newPassword, setVal: setNewPassword, show: showNewPassword, setShow: setShowNewPassword }, { label: 'Confirmer', val: confirmPassword, setVal: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword }].map(({ label, val, setVal, show, setShow }) => (
                <div key={label} className="space-y-2">
                  <Label className="text-gray-400"><Lock className="inline w-3 h-3 mr-1" />{label}</Label>
                  <div className="relative">
                    <Input type={show ? 'text' : 'password'} value={val} onChange={e => setVal(e.target.value)} className="bg-terex-dark border-terex-gray text-white pr-10" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-terex-dark border-terex-gray text-white">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleChangePassword} className="bg-terex-accent hover:bg-terex-accent/90 text-black">Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-terex-darker border-terex-gray">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Supprimer mon compte</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">Cette action est irréversible. Toutes vos données seront supprimées définitivement.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-terex-dark border-terex-gray text-white">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">Supprimer définitivement</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (section === 'activite') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Activité" />
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Transactions totales', value: '0', icon: Activity, color: '#3B968F' },
            { label: 'Volume total', value: '0 CFA', icon: TrendingUp, color: '#60a5fa' },
            { label: 'Membre depuis', value: 'Nouveau membre', icon: Clock, color: '#a78bfa' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 4px' }}>{label}</p>
                <p style={{ color: '#fff', fontSize: '20px', fontWeight: 600, margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'preferences') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Préférences" />
        <div style={{ padding: '20px' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { label: 'Notifications email', desc: 'Recevoir les confirmations de transaction' },
              { label: 'Alertes de transaction', desc: 'Notifié à chaque mouvement' },
              { label: 'Actualités Terex', desc: 'Nouvelles fonctionnalités et offres' },
            ].map(({ label, desc }, i, arr) => (
              <div key={label} style={{ padding: '16px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{desc}</p>
                </div>
                <div style={{ width: '44px', height: '24px', background: ACCENT, borderRadius: '12px', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', right: '3px', top: '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Main profile view ───────────────────────────────────────────────────

  const menuGroups = [
    {
      title: 'Compte',
      items: [
        { id: 'informations', label: 'Informations personnelles', desc: 'Nom, téléphone, pays', icon: User },
        { id: 'activite', label: 'Activité', desc: 'Transactions et volume', icon: Activity },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        { id: 'securite', label: 'Sécurité', desc: 'KYC, mot de passe', icon: Shield },
        { id: 'preferences', label: 'Préférences', desc: 'Notifications, langue', icon: Bell },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #1e1e1e 0%, #252525 50%, #1a1a1a 100%)', padding: '40px 24px 28px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #2d7a75)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', border: '3px solid rgba(59,150,143,0.3)' }}>
            {initials}
          </div>
          {/* Name + email + KYC */}
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              {formData.name || 'Utilisateur'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 10px' }}>{user?.email}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: kycStatus.bg, border: `1px solid ${kycStatus.border}`, borderRadius: '999px', padding: '4px 10px' }}>
              <KYCIcon size={12} color={kycStatus.color} />
              <span style={{ color: kycStatus.color, fontSize: '11px', fontWeight: 600 }}>KYC {kycStatus.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu groups */}
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {menuGroups.map(group => (
          <div key={group.title}>
            <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 4px' }}>{group.title}</p>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
              {group.items.map(({ id, label, desc, icon: Icon }, i, arr) => (
                <button
                  key={id}
                  onClick={() => setSection(id as Section)}
                  style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,150,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={ACCENT} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{desc}</p>
                  </div>
                  <ChevronRight size={16} color="#4b5563" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div>
          <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 4px' }}>Session</p>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
            <button onClick={onLogout} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={18} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ef4444', fontSize: '15px', fontWeight: 500, margin: '0 0 2px' }}>Déconnexion</p>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Quitter votre session</p>
              </div>
              <ChevronRight size={16} color="#4b5563" />
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '8px' }}>Terex · v1.0</p>
      </div>
    </div>
  );
}
