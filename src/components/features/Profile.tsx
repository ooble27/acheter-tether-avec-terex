import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  LogOut,
  Edit2,
  Save,
  X,
  TrendingUp,
  Activity,
  Bell,
  Globe,
  Lock,
  Trash2,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

type Section = 'informations' | 'activite' | 'securite' | 'preferences';

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('informations');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { profile, updateProfile, loading } = useUserProfile();
  const { kycData, loading: kycLoading } = useKYC();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    language: 'fr'
  });

  useEffect(() => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr'
    });
  }, [profile, user]);

  if (loading || kycLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-terex-dark">
        <div className="text-white font-light">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  const isKYCVerified = kycData?.status === 'approved';

  const getKYCStatus = () => {
    if (isKYCVerified) {
      return { icon: CheckCircle, text: 'Vérifié', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    }
    if (kycData?.status === 'submitted' || kycData?.status === 'under_review') {
      return { icon: Clock, text: 'En cours', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    }
    if (kycData?.status === 'rejected') {
      return { icon: XCircle, text: 'Rejeté', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    }
    return { icon: AlertTriangle, text: 'Non vérifié', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  };

  const kycStatus = getKYCStatus();
  const KYCIcon = kycStatus.icon;

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      });

      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr'
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour avec succès",
      className: "bg-green-600 text-white",
    });
    setShowPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(user?.email || '');

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé avec succès",
      className: "bg-green-600 text-white",
    });
    onLogout();
  };

  const sections = [
    { value: 'informations', label: 'Informations personnelles', icon: User },
    { value: 'activite', label: 'Activité', icon: TrendingUp },
    { value: 'securite', label: 'Sécurité', icon: Shield },
    { value: 'preferences', label: 'Préférences', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header avec bouton de déconnexion */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">Mon Profil</h1>
            <p className="text-sm text-gray-400 font-light">{user?.email}</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-terex-gray text-white hover:bg-terex-gray/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>

        {/* Avatar et sélecteur de section */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-light text-white mb-2">
                  {formData.name || user?.name || 'Utilisateur'}
                </h2>
                <div className={`inline-flex items-center gap-2 ${kycStatus.bg} ${kycStatus.border} border px-3 py-1 rounded-full`}>
                  <KYCIcon className={`w-4 h-4 ${kycStatus.color}`} />
                  <span className={`${kycStatus.color} text-xs font-light`}>KYC {kycStatus.text}</span>
                </div>
              </div>
            </div>

            {/* Dropdown de navigation */}
            <div className="mb-6">
              <Select value={currentSection} onValueChange={(value: Section) => setCurrentSection(value)}>
                <SelectTrigger className="bg-terex-dark border-terex-gray text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray z-50">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <SelectItem key={section.value} value={section.value} className="text-white">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {section.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Contenu des sections */}
            {currentSection === 'informations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-light text-white">Informations personnelles</h3>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 font-light flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Nom complet
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-terex-dark border-terex-gray text-white"
                      />
                    ) : (
                      <p className="text-white font-light p-3 bg-terex-dark rounded-lg">
                        {formData.name || 'Non renseigné'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 font-light flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <p className="text-white font-light p-3 bg-terex-dark rounded-lg opacity-60">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 font-light flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+221 XX XXX XX XX"
                        className="bg-terex-dark border-terex-gray text-white"
                      />
                    ) : (
                      <p className="text-white font-light p-3 bg-terex-dark rounded-lg">
                        {formData.phone || 'Non renseigné'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 font-light flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      Pays
                    </Label>
                    {isEditing ? (
                      <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger className="bg-terex-dark border-terex-gray text-white">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent className="bg-terex-darker border-terex-gray z-50">
                          <SelectItem value="senegal">Sénégal</SelectItem>
                          <SelectItem value="mali">Mali</SelectItem>
                          <SelectItem value="burkina">Burkina Faso</SelectItem>
                          <SelectItem value="cote_ivoire">Côte d'Ivoire</SelectItem>
                          <SelectItem value="niger">Niger</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white font-light p-3 bg-terex-dark rounded-lg">
                        {formData.country || 'Non renseigné'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 font-light flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      Langue
                    </Label>
                    {isEditing ? (
                      <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                        <SelectTrigger className="bg-terex-dark border-terex-gray text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-terex-darker border-terex-gray z-50">
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white font-light p-3 bg-terex-dark rounded-lg">
                        {formData.language === 'fr' ? 'Français' : 'English'}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-terex-accent hover:bg-terex-accent/90 text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-terex-gray text-white hover:bg-terex-gray/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentSection === 'activite' && (
              <div className="space-y-4">
                <h3 className="text-lg font-light text-white mb-4">Activité</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-terex-dark rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm font-light">Transactions</span>
                      <Activity className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-light text-white">0</p>
                  </div>
                  
                  <div className="bg-terex-dark rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm font-light">Volume total</span>
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-2xl font-light text-white">0 CFA</p>
                  </div>

                  <div className="bg-terex-dark rounded-lg p-4 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm font-light">Membre depuis</span>
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-lg font-light text-white">Nouveau membre</p>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'securite' && (
              <div className="space-y-4">
                <h3 className="text-lg font-light text-white mb-4">Sécurité</h3>
                
                <div className={`${kycStatus.bg} border ${kycStatus.border} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <KYCIcon className={`w-5 h-5 ${kycStatus.color}`} />
                      <div>
                        <p className="text-white font-light">Vérification KYC</p>
                        <p className={`${kycStatus.color} text-sm font-light`}>{kycStatus.text}</p>
                      </div>
                    </div>
                    {!isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review' && (
                      <Button
                        onClick={() => setShowKYC(true)}
                        size="sm"
                        className="bg-terex-accent hover:bg-terex-accent/90 text-black"
                      >
                        Vérifier
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowPasswordDialog(true)}
                    variant="outline"
                    className="w-full justify-start border-terex-gray text-white hover:bg-terex-gray/20"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>

                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    className="w-full justify-start border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                  <h4 className="text-white font-light mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Conseils de sécurité
                  </h4>
                  <ul className="text-gray-400 text-sm font-light space-y-1">
                    <li>• Ne partagez jamais vos informations de connexion</li>
                    <li>• Vérifiez toujours les adresses avant d'envoyer</li>
                    <li>• Utilisez des réseaux sécurisés</li>
                  </ul>
                </div>
              </div>
            )}

            {currentSection === 'preferences' && (
              <div className="space-y-4">
                <h3 className="text-lg font-light text-white mb-4">Préférences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-terex-dark rounded-lg">
                    <span className="text-white text-sm font-light">Notifications email</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-terex-dark rounded-lg">
                    <span className="text-white text-sm font-light">Alertes de transaction</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-terex-dark rounded-lg">
                    <span className="text-white text-sm font-light">Actualités Terex</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog changement de mot de passe */}
        <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <AlertDialogContent className="bg-terex-darker border-terex-gray">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-terex-accent" />
                Changer le mot de passe
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Entrez votre nouveau mot de passe (minimum 6 caractères)
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-terex-dark border-terex-gray text-white">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleChangePassword}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black"
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog suppression de compte */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-terex-darker border-terex-gray">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Supprimer mon compte</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                Êtes-vous sûr de vouloir continuer ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-terex-dark border-terex-gray text-white">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
