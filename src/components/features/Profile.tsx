import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCPage } from './KYCPage';
import { Card, CardContent } from '@/components/ui/card';
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
  X
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
    name: profile?.full_name || user?.name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    language: profile?.language || 'fr'
  });

  if (loading || kycLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-terex-dark">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  const isKYCVerified = kycData?.status === 'approved';

  const getKYCStatus = () => {
    if (isKYCVerified) {
      return { icon: CheckCircle, text: 'Vérifié', color: 'text-green-400', bg: 'bg-green-500/10' };
    }
    if (kycData?.status === 'submitted' || kycData?.status === 'under_review') {
      return { icon: Clock, text: 'En cours', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    }
    if (kycData?.status === 'rejected') {
      return { icon: XCircle, text: 'Rejeté', color: 'text-red-400', bg: 'bg-red-500/10' };
    }
    return { icon: AlertTriangle, text: 'Non vérifié', color: 'text-orange-400', bg: 'bg-orange-500/10' };
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

  return (
    <div className="min-h-screen bg-terex-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white mb-1">Mon Profil</h1>
            <p className="text-gray-400 font-light">Gérez vos informations personnelles</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-terex-gray text-white hover:bg-terex-gray/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6 md:p-8">
            {/* Avatar & Name */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-2">
                  {formData.name || user?.name || 'Utilisateur'}
                </h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="font-light">{user?.email}</span>
                </div>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>

            {/* KYC Status */}
            <div className={`${kycStatus.bg} border border-${kycStatus.color.replace('text-', '')}/20 rounded-lg p-4 mb-8`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KYCIcon className={`w-5 h-5 ${kycStatus.color}`} />
                  <div>
                    <p className="text-white font-light">Statut KYC</p>
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

            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-400 font-light flex items-center gap-2">
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
                  <Label className="text-gray-400 font-light flex items-center gap-2">
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
                  <Label className="text-gray-400 font-light flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pays
                  </Label>
                  {isEditing ? (
                    <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                      <SelectTrigger className="bg-terex-dark border-terex-gray text-white">
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                      <SelectContent className="bg-terex-darker border-terex-gray">
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
                  <Label className="text-gray-400 font-light">Langue</Label>
                  {isEditing ? (
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                      <SelectTrigger className="bg-terex-dark border-terex-gray text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-terex-darker border-terex-gray">
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
                    onClick={() => {
                      setFormData({
                        name: profile?.full_name || user?.name || '',
                        phone: profile?.phone || '',
                        country: profile?.country || '',
                        language: profile?.language || 'fr'
                      });
                      setIsEditing(false);
                    }}
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
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-terex-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-light mb-2">Conseils de sécurité</h3>
                <ul className="text-gray-400 text-sm font-light space-y-1">
                  <li>• Ne partagez jamais vos informations de connexion</li>
                  <li>• Vérifiez toujours les adresses de portefeuille</li>
                  <li>• Utilisez des réseaux sécurisés pour vos transactions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
