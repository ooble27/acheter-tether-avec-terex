import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { KYCForm } from '@/components/features/KYCForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTransactions } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useKYC } from '@/hooks/useKYC';
import { useUserProfile } from '@/hooks/useUserProfile';
import { User, History, Settings, Shield, Share2, Edit, Lock, LogOut, Trash2, CheckCircle, AlertCircle, Copy, Clock, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout?: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showKYCForm, setShowKYCForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    language: 'Français'
  });
  
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { kycData, loading: kycLoading, refetch: refetchKYC } = useKYC();
  const { profile, loading: profileLoading, updateProfile, updateEmail } = useUserProfile();

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || 'Français'
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.name || '',
        email: user.email || ''
      }));
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'kyc', label: 'Vérification', icon: Shield },
    { id: 'transactions', label: 'Historique', icon: History },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleShareTerex = async () => {
    const shareLink = `https://terex.app?ref=${user?.email?.split('@')[0] || 'user123'}`;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans votre presse-papiers",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
        className: "bg-red-600 text-white border-red-600",
      });
      if (onLogout) onLogout();
    }, 2000);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      console.log('Profile: Starting logout process...');
      
      await signOut();
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      
    } catch (error) {
      console.error('Profile: Logout error:', error);
      
      toast({
        title: "Erreur",
        description: "Problème lors de la déconnexion, vous allez être redirigé",
        variant: "destructive",
      });
      
      // Force redirect even on error
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveProfile = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // Update profile data
      const profileResult = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      });

      if (profileResult.error) {
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
        if (emailResult.error) {
          toast({
            title: "Erreur email",
            description: emailResult.error,
            variant: "destructive",
          });
        }
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getKYCStatus = () => {
    if (kycLoading) {
      return {
        status: 'Chargement...',
        icon: Clock,
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10',
        description: 'Chargement des informations'
      };
    }

    if (!kycData) {
      return {
        status: 'Non vérifié',
        icon: AlertCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        description: 'Vérification requise pour utiliser nos services'
      };
    }

    switch (kycData.status) {
      case 'approved':
        return {
          status: 'Vérifié',
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          description: 'Votre identité a été vérifiée avec succès'
        };
      case 'submitted':
      case 'under_review':
        return {
          status: 'En cours d\'examen',
          icon: Clock,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          description: 'Vos documents sont en cours de vérification'
        };
      case 'rejected':
        return {
          status: 'Rejeté',
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          description: kycData.rejection_reason || 'Documents non conformes'
        };
      default:
        return {
          status: 'Non vérifié',
          icon: AlertCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          description: 'Vérification d\'identité requise'
        };
    }
  };

  const kycStatus = getKYCStatus();
  const StatusIcon = kycStatus.icon;

  const handleKYCFormComplete = () => {
    setShowKYCForm(false);
    refetchKYC();
    setActiveTab('profile');
  };

  const EditInfoSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-terex-gray text-gray-300 hover:bg-terex-gray w-full sm:w-auto">
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className="bg-terex-darker border-terex-gray">
        <SheetHeader>
          <SheetTitle className="text-white">Modifier mes informations</SheetTitle>
          <SheetDescription className="text-gray-400">
            Mettez à jour vos informations personnelles
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <Label className="text-gray-400 text-sm block mb-2">Nom complet</Label>
            <Input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="w-full bg-terex-gray border border-terex-gray rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-terex-accent focus:border-transparent"
            />
          </div>
          <div>
            <Label className="text-gray-400 text-sm block mb-2">Email</Label>
            <Input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-terex-gray border border-terex-gray rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-terex-accent focus:border-transparent"
            />
          </div>
          <div>
            <Label className="text-gray-400 text-sm block mb-2">Téléphone</Label>
            <Input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Votre numéro de téléphone"
              className="w-full bg-terex-gray border border-terex-gray rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-terex-accent focus:border-transparent"
            />
          </div>
          <div>
            <Label className="text-gray-400 text-sm block mb-2">Pays</Label>
            <Input 
              type="text" 
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Votre pays"
              className="w-full bg-terex-gray border border-terex-gray rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-terex-accent focus:border-transparent"
            />
          </div>
          <div>
            <Label className="text-gray-400 text-sm block mb-2">Langue</Label>
            <select 
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full bg-terex-gray border border-terex-gray rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-terex-accent focus:border-transparent"
            >
              <option value="Français">Français</option>
              <option value="English">English</option>
              <option value="Español">Español</option>
            </select>
          </div>
          <Button 
            className="w-full bg-terex-accent hover:bg-terex-accent/90 mt-6" 
            onClick={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-1 sm:px-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Gérez votre compte et consultez vos informations
        </p>
      </div>

      {/* Mobile optimized navigation */}
      {isMobile ? (
        <div className="flex space-x-1 bg-terex-darker rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center space-y-1 px-2 py-3 rounded-md transition-colors text-xs ${
                  activeTab === tab.id
                    ? 'bg-terex-accent text-white'
                    : 'text-gray-300 hover:bg-terex-gray hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex space-x-6">
          <div className="flex flex-col space-y-2 w-64 flex-shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-terex-accent text-white'
                      : 'text-gray-300 hover:bg-terex-gray hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex-1">
            {/* Desktop Content */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* KYC Status */}
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${kycStatus.bgColor} rounded-full flex items-center justify-center`}>
                          <StatusIcon className={`w-6 h-6 ${kycStatus.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">Statut de vérification</CardTitle>
                          <CardDescription className="text-gray-400 text-sm">{kycStatus.description}</CardDescription>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${kycStatus.color} ${kycStatus.bgColor}`}>
                        {kycStatus.status}
                      </span>
                    </div>
                    {kycData?.status === 'pending' && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => setActiveTab('kyc')}
                          className="bg-terex-accent hover:bg-terex-accent/90"
                        >
                          Commencer la vérification
                        </Button>
                      </div>
                    )}
                    {kycData?.status === 'rejected' && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => setActiveTab('kyc')}
                          variant="outline"
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                        >
                          Soumettre à nouveau
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                </Card>

                {/* Personal Information */}
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Informations personnelles</CardTitle>
                      <EditInfoSheet />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm">Nom complet</label>
                        <p className="text-white font-medium">{formData.full_name || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Email</label>
                        <p className="text-white font-medium break-all">{formData.email}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Téléphone</label>
                        <p className="text-white font-medium">{formData.phone || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Pays</label>
                        <p className="text-white font-medium">{formData.country || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Langue</label>
                        <p className="text-white font-medium">{formData.language}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Inscription</label>
                        <p className="text-white font-medium">15 janvier 2024</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader>
                    <CardTitle className="text-white">Dernières transactions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Vos 3 dernières opérations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Aucune transaction récente</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 3).map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-terex-gray rounded-lg">
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium truncate">{transaction.type}</p>
                              <p className="text-gray-400 text-sm">{transaction.date}</p>
                            </div>
                            <span className={`font-medium ${
                              transaction.type.includes('Achat') ? 'text-green-400' : 'text-blue-400'
                            }`}>
                              {transaction.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Share Terex */}
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Share2 className="w-5 h-5 mr-2" />
                      Partager Terex
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Invitez vos proches à découvrir Terex
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleShareTerex}
                      className="w-full bg-terex-accent hover:bg-terex-accent/90 h-12"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Partager Terex
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Vérification d'identité KYC
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Vérifiez votre identité pour accéder à tous nos services
                    </CardDescription>
                  </CardHeader>
                </Card>

                {kycData?.status === 'approved' ? (
                  <Card className="bg-green-600/10 border-green-600/50">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-white text-xl font-medium mb-2">Identité vérifiée</h3>
                      <p className="text-green-400">
                        Votre identité a été vérifiée avec succès. Vous pouvez maintenant utiliser tous nos services.
                      </p>
                    </CardContent>
                  </Card>
                ) : kycData?.status === 'submitted' || kycData?.status === 'under_review' ? (
                  <Card className="bg-yellow-600/10 border-yellow-600/50">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-white text-xl font-medium mb-2">Vérification en cours</h3>
                      <p className="text-yellow-400">
                        Vos documents sont en cours d'examen. Nous vous contacterons sous 1-3 jours ouvrables.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <KYCForm onComplete={handleKYCFormComplete} />
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <>
                {transactions.length === 0 ? (
                  <Card className="bg-terex-darker border-terex-gray">
                    <CardContent className="p-8 text-center">
                      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">Aucune transaction</h3>
                      <p className="text-gray-400 text-sm">
                        Vos transactions apparaîtront ici une fois que vous aurez effectué votre première opération.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <TransactionHistory transactions={transactions} />
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader>
                    <CardTitle className="text-white">Paramètres du compte</CardTitle>
                    <CardDescription className="text-gray-400">
                      Gérez vos préférences et paramètres de sécurité
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray h-12"
                    >
                      <Lock className="w-4 h-4 mr-3" />
                      Changer mon mot de passe
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray h-12"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-terex-darker border-red-600/50">
                  <CardHeader>
                    <CardTitle className="text-red-400">Zone de danger</CardTitle>
                    <CardDescription className="text-gray-400">
                      Actions irréversibles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start h-12"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Supprimer mon compte
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-terex-darker border-terex-gray mx-4 max-w-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Êtes-vous absolument sûr ?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte 
                            et toutes vos données de nos serveurs.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
                          <AlertDialogCancel className="border-terex-gray text-gray-300 hover:bg-terex-gray w-full sm:w-auto">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                          >
                            {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Content */}
      {isMobile && (
        <div>
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in px-1 sm:px-0">
              {/* KYC Status */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kycStatus.bgColor} rounded-full flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${kycStatus.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Statut de vérification</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{kycStatus.description}</CardDescription>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${kycStatus.color} ${kycStatus.bgColor} text-center`}>
                      {kycStatus.status}
                    </span>
                  </div>
                  {kycData?.status === 'pending' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => setActiveTab('kyc')}
                        className="bg-terex-accent hover:bg-terex-accent/90 w-full"
                      >
                        Commencer la vérification
                      </Button>
                    </div>
                  )}
                  {kycData?.status === 'rejected' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => setActiveTab('kyc')}
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 w-full"
                      >
                        Soumettre à nouveau
                      </Button>
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Personal Information */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <CardTitle className="text-white">Informations personnelles</CardTitle>
                    <EditInfoSheet />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Nom complet</label>
                      <p className="text-white font-medium">{formData.full_name || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium break-all">{formData.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Téléphone</label>
                      <p className="text-white font-medium">{formData.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Pays</label>
                      <p className="text-white font-medium">{formData.country || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Langue</label>
                      <p className="text-white font-medium">{formData.language}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Inscription</label>
                      <p className="text-white font-medium">15 janvier 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Dernières transactions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Vos 3 dernières opérations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <History className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Aucune transaction récente</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 3).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-terex-gray rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{transaction.type}</p>
                            <p className="text-gray-400 text-sm">{transaction.date}</p>
                          </div>
                          <span className={`font-medium text-sm sm:text-base ${
                            transaction.type.includes('Achat') ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share Terex */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Partager Terex
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Invitez vos proches à découvrir Terex
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleShareTerex}
                    className="w-full bg-terex-accent hover:bg-terex-accent/90 h-12"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Partager Terex
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Vérification KYC
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Vérifiez votre identité pour accéder à tous nos services
                  </CardDescription>
                </CardHeader>
              </Card>

              {kycData?.status === 'approved' ? (
                <Card className="bg-green-600/10 border-green-600/50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Identité vérifiée</h3>
                    <p className="text-green-400 text-sm">
                      Votre identité a été vérifiée avec succès.
                    </p>
                  </CardContent>
                </Card>
              ) : kycData?.status === 'submitted' || kycData?.status === 'under_review' ? (
                <Card className="bg-yellow-600/10 border-yellow-600/50">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">En cours d'examen</h3>
                    <p className="text-yellow-400 text-sm">
                      Vos documents sont en cours de vérification.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <KYCForm onComplete={handleKYCFormComplete} />
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in px-1 sm:px-0">
              {transactions.length === 0 ? (
                <Card className="bg-terex-darker border-terex-gray">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <History className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Aucune transaction</h3>
                    <p className="text-gray-400 text-sm">
                      Vos transactions apparaîtront ici une fois que vous aurez effectué votre première opération.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <TransactionHistory transactions={transactions} />
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in px-1 sm:px-0">
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Paramètres du compte</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gérez vos préférences et paramètres de sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray h-12"
                  >
                    <Lock className="w-4 h-4 mr-3" />
                    Changer mon mot de passe
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray h-12"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-red-600/50">
                <CardHeader>
                  <CardTitle className="text-red-400">Zone de danger</CardTitle>
                  <CardDescription className="text-gray-400">
                    Actions irréversibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start h-12"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-terex-darker border-terex-gray mx-4 max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte 
                          et toutes vos données de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
                        <AlertDialogCancel className="border-terex-gray text-gray-300 hover:bg-terex-gray w-full sm:w-auto">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        >
                          {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
