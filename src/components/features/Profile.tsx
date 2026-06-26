import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FAQ } from './FAQ';
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
  const { user: authUser } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const { kycData } = useKYC();
  const [formData, setFormData] = useState({ name: '', phone: '', country: '', language: 'fr' });

  useEffect(() => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr',
    });
  }, [profile, user]);

  // Remonter en haut à chaque changement de sous-section (sinon la page
  // s'ouvre à la position de scroll précédente — souvent tout en bas).
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [section]);

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
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 20px 16px', position: 'sticky', top: 0, zIndex: 10, background: BG }}>
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
    const referralCode = authUser?.id ? `TEREX-${authUser.id.slice(0, 8).toUpperCase()}` : 'TEREX-XXXXXX';
    const referralLink = `https://terangaexchange.com/auth?ref=${referralCode}`;
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

          {/* Rewards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Pour vous', value: '5% de bonus', desc: 'sur chaque transaction' },
              { label: 'Pour votre filleul', value: '3% de bonus', desc: 'sur sa 1ère transaction' },
            ].map(({ label, value, desc }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 6px' }}>{label}</p>
                <p style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 2px' }}>{value}</p>
                <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Referral code */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
            <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Votre code de parrainage</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.10)`, borderRadius: '14px', padding: '14px 18px' }}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>{referralCode}</span>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(referralCode); toast({ title: 'Code copié !' }); }}
                style={{ width: '48px', height: '48px', borderRadius: '14px', background: BTN, border: `1px solid rgba(255,255,255,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Copy size={18} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
            <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>Lien : {referralLink}</p>
          </div>

          {/* Share button */}
          <button
            onClick={async () => {
              if (navigator.share) {
                try { await navigator.share({ title: 'Rejoignez Terex', text: `Utilisez mon code ${referralCode} pour rejoindre Terex !`, url: referralLink }); } catch {}
              } else {
                navigator.clipboard?.writeText(referralLink);
                toast({ title: 'Lien copié !' });
              }
            }}
            style={{ background: '#fff', border: 'none', borderRadius: '14px', padding: '15px', color: '#141414', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Share2 size={16} /> Partager mon code
          </button>

          {/* How it works */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Comment ça marche</p>
            </div>
            {[
              { step: '1', text: 'Partagez votre code unique à vos contacts' },
              { step: '2', text: 'Ils s\'inscrivent avec votre code et effectuent leur premier achat' },
              { step: '3', text: 'Vous recevez tous les deux vos bonus automatiquement' },
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
    const appUrl = 'https://terangaexchange.com';
    const shareText = "Découvrez Terex — La plateforme pour acheter et vendre des USDT en Afrique de l'Ouest facilement et en toute sécurité !";
    const encodedUrl = encodeURIComponent(appUrl);
    const encodedText = encodeURIComponent(shareText);
    const platforms = [
      { label: 'WhatsApp',  bg: '#25D366', textColor: '#fff', url: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
      { label: 'Facebook',  bg: '#1877F2', textColor: '#fff', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
      { label: 'X (Twitter)', bg: '#000',  textColor: '#fff', url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
      { label: 'Email',     bg: BTN,       textColor: '#fff', url: `mailto:?subject=${encodeURIComponent('Découvrez Terex')}&body=${encodedText}%20${encodedUrl}` },
    ];
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Partager l'App" />
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Share2 size={28} color="rgba(255,255,255,0.7)" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>Partagez Terex</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>Faites découvrir la façon la plus simple d'acheter et vendre du USDT en CFA.</p>
            {/* Native share + copy link */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={async () => {
                if (navigator.share) {
                  try { await navigator.share({ title: 'Terex', text: shareText, url: appUrl }); } catch {}
                } else { navigator.clipboard?.writeText(appUrl); toast({ title: 'Lien copié !' }); }
              }} style={{ background: '#fff', border: 'none', borderRadius: '12px', padding: '11px 20px', color: '#141414', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={14} /> Partager
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(appUrl); toast({ title: 'Lien copié !' }); }}
                style={{ background: BTN, border: `1px solid rgba(255,255,255,0.10)`, borderRadius: '12px', padding: '11px 20px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Copy size={14} /> Copier
              </button>
            </div>
          </div>
          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {platforms.map(({ label, bg, textColor, url }) => (
              <button key={label} onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                style={{ background: bg, border: 'none', borderRadius: '14px', padding: '13px 16px', color: textColor, fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {label}
              </button>
            ))}
          </div>
          {/* App URL */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '12px 16px' }}>
            <p style={{ color: '#4b5563', fontSize: '11px', margin: '0 0 2px' }}>Lien direct</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>{appUrl}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Contact ───────────────────────────────────────────────────────────────

  if (section === 'contact') {
    const WAIcon = () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,0.7)">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    );
    const TGIcon = () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,0.7)">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    );
    const IGIcon = () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,0.7)">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    );
    const FBIcon = () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,0.7)">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
    const XIcon = () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,0.7)">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
    const contacts = [
      { label: 'WhatsApp', desc: '+1 (418) 261-9091', IconEl: WAIcon, action: () => window.open('https://wa.me/+14182619091', '_blank') },
      { label: 'Téléphone', desc: '+1 (418) 261-9091', IconEl: () => <Phone size={18} color="rgba(255,255,255,0.7)" />, action: () => window.open('tel:+14182619091') },
      { label: 'Email', desc: 'terangaexchange@gmail.com', IconEl: () => <Mail size={18} color="rgba(255,255,255,0.7)" />, action: () => window.open('mailto:terangaexchange@gmail.com', '_blank') },
      { label: 'Telegram', desc: '@teraborange', IconEl: TGIcon, action: () => window.open('https://t.me/teraborange', '_blank') },
      { label: 'Instagram', desc: '@teraborange', IconEl: IGIcon, action: () => window.open('https://www.instagram.com/teraborange', '_blank') },
      { label: 'X (Twitter)', desc: '@teraborange', IconEl: XIcon, action: () => window.open('https://x.com/teraborange', '_blank') },
      { label: 'Facebook', desc: '/teraborange', IconEl: FBIcon, action: () => window.open('https://www.facebook.com/teraborange', '_blank') },
    ];
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="Nous contacter" />
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px 24px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Support 24/7</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Notre équipe est disponible à tout moment.</p>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
            {contacts.map(({ label, desc, IconEl, action }, i, arr) => (
              <button key={label} onClick={action}
                style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconEl />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '0 0 1px' }}>{label}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{desc}</p>
                </div>
                <ChevronRight size={15} color="#4b5563" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── FAQ inline ────────────────────────────────────────────────────────────

  if (section === 'faq') {
    return (
      <div style={{ minHeight: '100vh', background: BG, paddingBottom: '100px' }}>
        <SubHeader title="FAQ" />
        <FAQ onNavigate={onNavigate} />
      </div>
    );
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
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{user?.email}</p>
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
