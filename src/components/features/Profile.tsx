
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCForm } from './KYCForm';
import { User, Settings, CheckCircle, FileText, Phone, Globe, Mail, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormData {
  full_name: string;
  phone: string;
  country: string;
  language: string;
  email: string;
}

const getKYCStatusInfo = (status?: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'En attente',
        color: 'bg-yellow-500',
        icon: Clock,
        description: 'Commencez votre vérification d\'identité'
      };
    case 'submitted':
      return {
        label: 'Soumis',
        color: 'bg-blue-500',
        icon: FileText,
        description: 'Votre dossier est en cours d\'examen'
      };
    case 'under_review':
      return {
        label: 'En révision',
        color: 'bg-orange-500',
        icon: AlertCircle,
        description: 'Vérification en cours par notre équipe'
      };
    case 'approved':
      return {
        label: 'Vérifié',
        color: 'bg-green-500',
        icon: CheckCircle,
        description: 'Votre identité a été vérifiée avec succès'
      };
    case 'rejected':
      return {
        label: 'Rejeté',
        color: 'bg-red-500',
        icon: AlertCircle,
        description: 'Votre dossier a été rejeté. Veuillez le resoummettre.'
      };
    default:
      return {
        label: 'Non démarré',
        color: 'bg-gray-500',
        icon: FileText,
        description: 'Commencez votre vérification d\'identité'
      };
  }
};

export function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Initialize form data with user data
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
    country: '',
    language: 'Français',
    email: ''
  });

  const { profile, loading: profileLoading, updateProfile, updateEmail } = useUserProfile();
  const { kycData, loading: kycLoading } = useKYC();

  // Update form data when profile loads
  useEffect(() => {
    if (profile && user) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || 'Français',
        email: user.email || ''
      });
    }
  }, [profile, user]);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'kyc', label: 'Vérification KYC', icon: FileText }
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update profile information
      const profileResult = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      });

      if (profileResult?.error) {
        toast({
          title: "Erreur",
          description: profileResult.error,
          variant: "destructive",
        });
        return;
      }

      // Update email if changed
      if (formData.email !== user?.email) {
        const emailResult = await updateEmail(formData.email);
        if (emailResult?.error) {
          toast({
            title: "Erreur email",
            description: emailResult.error,
            variant: "destructive",
          });
          return;
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleKYCFormComplete = () => {
    // Refresh KYC data or show success message
    toast({
      title: "Vérification soumise",
      description: "Votre dossier KYC a été soumis avec succès",
      className: "bg-green-600 text-white border-green-600",
    });
  };

  const kycStatus = getKYCStatusInfo(kycData?.status);
  const StatusIcon = kycStatus.icon;

  if (profileLoading || kycLoading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* En-tête profil */}
      <div className="bg-gradient-to-r from-terex-darker to-terex-accent/20 border-b border-terex-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-terex-accent/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 md:w-10 md:h-10 text-terex-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                </h1>
                <p className="text-gray-400 text-sm md:text-base">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full ${kycStatus.color} mr-2`}></div>
                  <span className="text-sm text-gray-400">KYC: {kycStatus.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-auto bg-terex-card border border-terex-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-terex-accent"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            {/* Informations personnelles */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div>
                  <CardTitle className="text-white flex items-center text-xl">
                    <User className="w-5 h-5 mr-3" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Gérez vos informations de profil et de contact
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-terex-accent hover:bg-terex-accent/90"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (profile && user) {
                          setFormData({
                            full_name: profile.full_name || '',
                            phone: profile.phone || '',
                            country: profile.country || '',
                            language: profile.language || 'Français',
                            email: user.email || ''
                          });
                        }
                      }}
                      disabled={saving}
                      className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  // Mode affichage
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Nom complet</Label>
                      <p className="text-white text-base">
                        {profile?.full_name || 'Non défini'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Téléphone</Label>
                      <p className="text-white text-base flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {profile?.phone || 'Non défini'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Pays</Label>
                      <p className="text-white text-base flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        {profile?.country || 'Non défini'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Langue</Label>
                      <p className="text-white text-base">
                        {profile?.language || 'Français'}
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-400 text-sm">Email</Label>
                      <p className="text-white text-base flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Mode édition
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-gray-300">Nom complet</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-300">Pays</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        placeholder="Votre pays"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-gray-300">Langue</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange('language', value)}
                      >
                        <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Français">Français</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Español">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="mt-6">
            {/* Statut KYC */}
            <Card className="bg-terex-darker border-terex-gray mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <StatusIcon className={`w-5 h-5 mr-3 ${kycStatus.color.replace('bg-', 'text-')}`} />
                  Vérification d'identité KYC
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Vérifiez votre identité pour accéder à tous nos services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-terex-gray/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${kycStatus.color}`}></div>
                    <div>
                      <p className="text-white font-medium">{kycStatus.label}</p>
                      <p className="text-gray-400 text-sm">{kycStatus.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${kycStatus.color} text-white border-none`}>
                    {kycStatus.label}
                  </Badge>
                </div>
                {kycData?.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Raison du rejet:</p>
                    <p className="text-white">{kycData.rejection_reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulaire KYC ou statut */}
            {kycData?.status === 'approved' ? (
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Identité vérifiée avec succès !
                  </h3>
                  <p className="text-gray-400">
                    Votre compte est maintenant entièrement vérifié. Vous avez accès à tous nos services.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="w-full">
                <KYCForm onComplete={handleKYCFormComplete} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
