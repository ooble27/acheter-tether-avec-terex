
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTransactions } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { User, History, Settings, Shield, Share2, Edit, Lock, LogOut, Trash2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
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

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout?: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();
  const { toast } = useToast();

  // Mock user data - in real app this would come from backend
  const userProfile = {
    fullName: user?.name || 'Utilisateur',
    email: user?.email || '',
    phone: '+1 234 567 8900',
    country: 'Canada',
    language: 'Français',
    joinDate: '15 janvier 2024',
    isKYCVerified: true, // This would come from backend
    hasKYCDocuments: true
  };

  const tabs = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'transactions', label: 'Transactions', icon: History },
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

  const getKYCStatus = () => {
    if (userProfile.isKYCVerified) {
      return {
        status: 'Vérifié',
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        description: 'Votre identité a été vérifiée'
      };
    } else if (userProfile.hasKYCDocuments) {
      return {
        status: 'En attente',
        icon: AlertCircle,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        description: 'Vérification en cours'
      };
    } else {
      return {
        status: 'Non vérifié',
        icon: AlertCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        description: 'Vérification requise'
      };
    }
  };

  const kycStatus = getKYCStatus();
  const StatusIcon = kycStatus.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-gray-400">
          Gérez votre compte et consultez vos informations
        </p>
      </div>

      <div className={`${isMobile ? 'space-y-4' : 'flex space-x-6'}`}>
        {/* Navigation Tabs */}
        <div className={`${isMobile ? 'flex overflow-x-auto' : 'flex flex-col'} space-x-2 ${isMobile ? '' : 'space-x-0 space-y-2'} ${isMobile ? 'pb-2' : 'w-64'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
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

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* KYC Status */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${kycStatus.bgColor} rounded-full flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 ${kycStatus.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white">Statut de vérification</CardTitle>
                        <CardDescription className="text-gray-400">{kycStatus.description}</CardDescription>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${kycStatus.color} ${kycStatus.bgColor}`}>
                      {kycStatus.status}
                    </span>
                  </div>
                </CardHeader>
              </Card>

              {/* Personal Information */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Informations personnelles</CardTitle>
                    <Button variant="outline" size="sm" className="border-terex-gray text-gray-300 hover:bg-terex-gray">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier mes infos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Nom complet</label>
                      <p className="text-white">{userProfile.fullName}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Adresse email</label>
                      <p className="text-white">{userProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Numéro de téléphone</label>
                      <p className="text-white">{userProfile.phone}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Pays</label>
                      <p className="text-white">{userProfile.country}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Langue préférée</label>
                      <p className="text-white">{userProfile.language}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Date d'inscription</label>
                      <p className="text-white">{userProfile.joinDate}</p>
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
                          <div>
                            <p className="text-white font-medium">{transaction.type}</p>
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
                    Partager Terex avec mes amis
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Invitez vos proches à découvrir Terex
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleShareTerex}
                    className="w-full bg-terex-accent hover:bg-terex-accent/90"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Partager Terex
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'transactions' && (
            <>
              {transactions.length === 0 ? (
                <Card className="bg-terex-darker border-terex-gray">
                  <CardContent className="p-8 text-center">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Aucune transaction</h3>
                    <p className="text-gray-400">
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
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Changer mon mot de passe
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-terex-gray text-gray-300 hover:bg-terex-gray"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
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
                        className="w-full justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-terex-darker border-terex-gray">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte 
                          et toutes vos données de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-terex-gray text-gray-300 hover:bg-terex-gray">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
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
    </div>
  );
}
