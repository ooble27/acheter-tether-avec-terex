import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  User, Mail, Phone, MapPin, Shield, CheckCircle, Clock, XCircle, AlertTriangle,
  LogOut, ChevronRight, ArrowLeft, Key, Lock, Trash2, Eye, EyeOff,
  Globe, Bell, Activity, TrendingUp, Edit2, Save, Gift, Share2, HelpCircle,
  MessageCircle, Copy, ExternalLink
} from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
}

type Section = null | 'informations' | 'securite' | 'preferences' | 'activite' | 'parrainage' | 'partager' | 'contact' | 'faq';

const BG     = '#141414';
const CARD   = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const BTN    = '#2d2d2d';
const ICON_BG = 'rgba(255,255,255,0.06)';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
  borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '5px',
  fontSize: '11px', color: '#6b7280', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
};

export function Profile({ user, onLogout, onNavigate }: ProfileProps) {
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
    if (isKYCVerified) return { icon: CheckCircle, text: 'Vérifié', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)' };
    if (kycData?.status === 'submitted' || kycData?.status === 'under_review') return { icon: Clock, text: 'En cours', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.15)' };
    if (kycData?.status === 'rejected') return { icon: XCircle, text: 'Rejeté', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' };
    return { icon: AlertTriangle, text: 'Non vérifié', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.15)' };
  })();
  const KYCIcon = kycStatus.icon;

  const initials = (formData.name || user?.email || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    const result = await updateProfile({ full_name: formData.name, phone: formData.phone, country: formData.country, language: formData.language });
    if (result.error) { toast({ title: 'Erreur', description: result.error, variant: 'destructive' }); return; }
    setIsEditing(false);
    toast({ title: 'Profil mis à jour', description: 'Vos informations ont été sauvegardées.' });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas', variant: 'destructive' }); return; }
    if (newPassword.length < 6) { toast({ title: 'Erreur', description: 'Minimum 6 caractères', variant: 'destructive' }); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Mot de passe modifié' });
    setShowPasswordDialog(false); setNewPassword(''); setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.functions.invoke('delete-user-account');
    if (error) { toast({ title: 'Erreur', description: 'Impossible de supprimer le compte', variant: 'destructive' }); return; }
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  // ── Sub-section header ───────────────────────────────────────────────────

  const SubHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => { setSection(null); setIsEditing(false); }}
        style={{ width: '36px', height: '36px', borderRadius: '50%', background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
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
      <p style={{ color: value ? '#fff' : '#4b5563', fontSize: '15px', margin: 0 }}>{value || 'Non renseigné'}</p>
    </div>
  );

  // ── Informations ────────────────────────────────────────────────────────

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
                <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: BTN, border: `1px solid rgba(255,255,255,0.10)`, borderRadius: '14px', padding: '13px 22px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  <Edit2 size={15} /> Modifier mes informations
                </button>
              </div>
            </>
          ) : (
            <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Nom complet', icon: User, key: 'name', placeholder: 'Votre nom' },
                { label: 'Téléphone', icon: Phone, key: 'phone', placeholder: '+221 XX XXX XX XX' },
              ].map(({ label, icon: Icon, key, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}><Icon size={12} />{label}</label>
                  <input value={(formData as any)[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}><MapPin size={12} />Pays</label>
                <Select value={formData.country} onValueChange={v => setFormData({ ...formData, country: v })}>
                  <SelectTrigger className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] z-50">
                    {['senegal:Sénégal','mali:Mali','burkina:Burkina Faso','cote_ivoire:Côte d\'Ivoire','niger:Niger','canada:Canada'].map(s => {
                      const [v, l] = s.split(':');
                      return <SelectItem key={v} value={v} className="text-white focus:bg-[rgba(255,255,255,0.06)] focus:text-white">{l}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label style={labelStyle}><Globe size={12} />Langue</label>
                <Select value={formData.language} onValueChange={v => setFormData({ ...formData, language: v })}>
                  <SelectTrigger className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] z-50">
                    <SelectItem value="fr" className="text-white focus:bg-[rgba(255,255,255,0.06)] focus:text-white">Français</SelectItem>
                    <SelectItem value="en" className="text-white focus:bg-[rgba(255,255,255,0.06)] focus:text-white">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: 'none', borderRadius: '14px', padding: '13px 22px', color: '#141414', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  <Save size={15} /> Sauvegarder
                </button>
                <button onClick={() => setIsEditing(false)} style={{ background: BTN, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '13px 22px', color: '#9ca3af', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Sécurité ────────────────────────────────────────────────────────────

  if (section === 'securite') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Sécurité" />
        <div style={{ padding: '20px' }}>
          {/* KYC status */}
          <div style={{ background: kycStatus.bg, border: `1px solid ${kycStatus.border}`, borderRadius: '16px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              <button onClick={() => setShowKYC(true)} style={{ padding: '9px 16px', background: BTN, border: `1px solid ${BORDER}`, borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Vérifier
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden' }}>
            <button onClick={() => setShowPasswordDialog(true)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={16} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>Changer le mot de passe</p>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Mettre à jour vos identifiants</p>
              </div>
              <ChevronRight size={16} color="#4b5563" />
            </button>
            <button onClick={() => setShowDeleteDialog(true)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={15} color="rgba(255,255,255,0.55)" />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: 600 }}>Conseils de sécurité</span>
            </div>
            {["Ne partagez jamais vos identifiants de connexion", "Vérifiez toujours les adresses avant d'envoyer", "Utilisez un réseau sécurisé pour vos transactions"].map((tip, i) => (
              <p key={i} style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 4px', paddingLeft: '4px' }}>· {tip}</p>
            ))}
          </div>
        </div>

        {/* Password dialog */}
        <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2"><Key className="w-4 h-4 opacity-60" /> Nouveau mot de passe</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">Minimum 6 caractères</AlertDialogDescription>
            </AlertDialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
              {[
                { label: 'Nouveau', val: newPassword, setVal: setNewPassword, show: showNewPassword, setShow: setShowNewPassword },
                { label: 'Confirmer', val: confirmPassword, setVal: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword },
              ].map(({ label, val, setVal, show, setShow }) => (
                <div key={label}>
                  <label style={labelStyle}><Lock size={11} />{label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={show ? 'text' : 'password'} value={val} onChange={e => setVal(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '44px' }} />
                    <button type="button" onClick={() => setShow(!show)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2d2d2d] border-[rgba(255,255,255,0.07)] text-white hover:bg-[#2d2d2d]">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleChangePassword} className="bg-white text-[#141414] hover:bg-white/90">Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Supprimer mon compte</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">Cette action est irréversible. Toutes vos données seront supprimées définitivement.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2d2d2d] border-[rgba(255,255,255,0.07)] text-white hover:bg-[#2d2d2d]">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">Supprimer définitivement</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ── Activité ────────────────────────────────────────────────────────────

  if (section === 'activite') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Activité" />
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Transactions totales', value: '0', icon: Activity },
            { label: 'Volume total', value: '0 CFA', icon: TrendingUp },
            { label: 'Membre depuis', value: 'Nouveau membre', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color="rgba(255,255,255,0.7)" />
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

  // ── Préférences ────────────────────────────────────────────────────────

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
                {/* Toggle — activé par défaut, neutre */}
                <div style={{ width: '44px', height: '24px', background: BTN, borderRadius: '12px', position: 'relative', flexShrink: 0, border: `1px solid rgba(255,255,255,0.12)` }}>
                  <div style={{ position: 'absolute', right: '3px', top: '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Parrainage ───────────────────────────────────────────────────────────

  if (section === 'parrainage') {
    const referralCode = user?.email?.split('@')[0]?.toUpperCase().slice(0, 8) + 'TX' || 'TEREXTX';
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Parrainage" />
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px', margin: '0 auto' }}>
          {/* Hero */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Gift size={28} color="rgba(255,255,255,0.7)" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Invitez vos amis</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Partagez votre code et recevez des avantages exclusifs pour chaque ami qui rejoint Terex.</p>
          </div>

          {/* Referral code */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
            <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Votre code de parrainage</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.10)`, borderRadius: '14px', padding: '14px 18px' }}>
                <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '2px' }}>{referralCode}</span>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(referralCode); toast({ title: 'Code copié !' }); }}
                style={{ width: '48px', height: '48px', borderRadius: '14px', background: BTN, border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Copy size={18} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
          </div>

          {/* How it works */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Comment ça marche</p>
            </div>
            {[
              { step: '1', text: 'Partagez votre code unique à vos contacts' },
              { step: '2', text: 'Ils s\'inscrivent et effectuent leur premier achat' },
              { step: '3', text: 'Vous recevez vos avantages automatiquement' },
            ].map(({ step, text }, i, arr) => (
              <div key={step} style={{ padding: '14px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 700 }}>{step}</span>
                </div>
                <p style={{ color: '#d1d5db', fontSize: '13px', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Partager ─────────────────────────────────────────────────────────────

  if (section === 'partager') {
    const shareUrl = 'https://terex.app';
    const shareText = 'Achetez et vendez du USDT facilement en CFA avec Terex ! 🚀';
    const handleShare = async () => {
      if (navigator.share) {
        try { await navigator.share({ title: 'Terex', text: shareText, url: shareUrl }); } catch {}
      } else {
        navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
        toast({ title: 'Lien copié !' });
      }
    };
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Partager l'App" />
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Share2 size={28} color="rgba(255,255,255,0.7)" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Partagez Terex</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 24px', lineHeight: 1.6 }}>Faites découvrir Terex à vos proches — la façon la plus simple d'acheter et vendre du USDT en CFA.</p>
            <button onClick={handleShare}
              style={{ background: '#fff', border: 'none', borderRadius: '14px', padding: '14px 28px', color: '#141414', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={16} /> Partager maintenant
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '10px', padding: '10px 14px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareUrl}</p>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(shareUrl); toast({ title: 'Lien copié !' }); }}
              style={{ width: '40px', height: '40px', borderRadius: '10px', background: BTN, border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Copy size={16} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Contact ───────────────────────────────────────────────────────────────

  if (section === 'contact') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Nous contacter" />
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageCircle size={28} color="rgba(255,255,255,0.7)" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Support 24/7</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Notre équipe est disponible pour vous aider à tout moment.</p>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { label: 'WhatsApp', desc: 'Réponse immédiate', icon: MessageCircle, action: () => window.open('https://wa.me/message/terex', '_blank') },
              { label: 'Email', desc: 'support@terex.app', icon: Mail, action: () => window.open('mailto:support@terex.app', '_blank') },
              { label: 'Telegram', desc: '@TerexSupport', icon: ExternalLink, action: () => window.open('https://t.me/terexsupport', '_blank') },
            ].map(({ label, desc, icon: Icon, action }, i, arr) => (
              <button key={label} onClick={action}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="rgba(255,255,255,0.7)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{desc}</p>
                </div>
                <ChevronRight size={16} color="#4b5563" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── FAQ (redirect to dashboard faq section) ───────────────────────────────

  if (section === 'faq') {
    if (onNavigate) {
      onNavigate('faq');
      return null;
    }
  }

  // ── Main view ────────────────────────────────────────────────────────────

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
    {
      title: 'Plus',
      items: [
        { id: 'parrainage', label: 'Parrainage', desc: 'Invitez vos amis', icon: Gift },
        { id: 'partager', label: 'Partager l\'App', desc: 'Partagez Terex', icon: Share2 },
        { id: 'faq', label: 'FAQ', desc: 'Questions fréquentes', icon: HelpCircle },
        { id: 'contact', label: 'Nous contacter', desc: 'Support 24/7', icon: MessageCircle },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>

      {/* Avatar hero */}
      <div style={{ padding: '48px 24px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#2d2d2d', border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>
            {initials}
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              {formData.name || 'Utilisateur'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 12px' }}>{user?.email}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: kycStatus.bg, border: `1px solid ${kycStatus.border}`, borderRadius: '999px', padding: '5px 12px' }}>
              <KYCIcon size={12} color={kycStatus.color} />
              <span style={{ color: kycStatus.color, fontSize: '11px', fontWeight: 600 }}>KYC {kycStatus.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu groups */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '560px', margin: '0 auto' }}>
        {menuGroups.map(group => (
          <div key={group.title}>
            <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 4px' }}>{group.title}</p>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
              {group.items.map(({ id, label, desc, icon: Icon }, i, arr) => (
                <button key={id} onClick={() => setSection(id as Section)}
                  style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="rgba(255,255,255,0.7)" />
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
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
