import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
  DollarSign,
  Activity,
  Bell,
  Globe
} from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  return (
    <div className="min-h-screen bg-terex-dark p-3 md:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">Mon Profil</h1>
            <p className="text-sm md:text-base text-gray-400 font-light">Gérez vos informations personnelles</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-terex-gray text-white hover:bg-terex-gray/20 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Profile Card */}
            <Card className="bg-terex-darker border-terex-gray overflow-hidden">
              <CardContent className="p-4 md:p-6">
                {/* Avatar & Name */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-light text-white mb-2 truncate">
                      {formData.name || user?.name || 'Utilisateur'}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="font-light truncate">{user?.email}</span>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black w-full sm:w-auto"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>

                {/* KYC Status */}
                <div className={`${kycStatus.bg} border ${kycStatus.border} rounded-lg p-4 mb-6`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <KYCIcon className={`w-5 h-5 ${kycStatus.color} flex-shrink-0`} />
                      <div>
                        <p className="text-white font-light text-sm md:text-base">Statut KYC</p>
                        <p className={`${kycStatus.color} text-xs md:text-sm font-light`}>{kycStatus.text}</p>
                      </div>
                    </div>
                    {!isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review' && (
                      <Button
                        onClick={() => setShowKYC(true)}
                        size="sm"
                        className="bg-terex-accent hover:bg-terex-accent/90 text-black w-full sm:w-auto"
                      >
                        Vérifier
                      </Button>
                    )}
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4 md:space-y-6">
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
                        <p className="text-white font-light p-3 bg-terex-dark rounded-lg text-sm md:text-base">
                          {formData.name || 'Non renseigné'}
                        </p>
                      )}
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
                        <p className="text-white font-light p-3 bg-terex-dark rounded-lg text-sm md:text-base">
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
                        <p className="text-white font-light p-3 bg-terex-dark rounded-lg text-sm md:text-base">
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
                        <p className="text-white font-light p-3 bg-terex-dark rounded-lg text-sm md:text-base">
                          {formData.language === 'fr' ? 'Français' : 'English'}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white font-light flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-terex-accent" />
                  Conseils de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-400 text-sm font-light space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Ne partagez jamais vos informations de connexion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Vérifiez toujours les adresses de portefeuille avant d'envoyer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Utilisez des réseaux sécurisés pour vos transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Activez la vérification KYC pour plus de sécurité</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Colonne secondaire */}
          <div className="space-y-4 md:space-y-6">
            {/* Statistiques */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white font-light flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-terex-accent" />
                  Activité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-terex-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-light">Transactions</span>
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-light text-white">0</p>
                </div>
                
                <div className="bg-terex-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-light">Volume total</span>
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-light text-white">0 CFA</p>
                </div>

                <div className="bg-terex-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-light">Membre depuis</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-lg font-light text-white">Nouveau</p>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white font-light flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-terex-accent" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
