
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';
import { ProfileStatsCard } from './profile/ProfileStatsCard';
import { SecuritySettingsCard } from './profile/SecuritySettingsCard';
import { User, Shield, Settings, Share2, Star, Award } from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const { loading } = useUserProfile();

  const handleStartKYC = () => {
    setShowKYC(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark animate-fade-in">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-transparent rounded-2xl mb-8 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
              <p className="text-gray-300 text-lg">Bienvenue {user?.name || 'Utilisateur'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-terex-darker/50 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-terex-accent" />
              <span className="text-white text-sm">Membre Terex</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Compte Actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Alert */}
      <div className="mb-8">
        <KYCAlert status="pending" onStartKYC={handleStartKYC} />
      </div>

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Statistiques du profil */}
          <ProfileStatsCard />
          
          {/* Informations personnelles */}
          <PersonalInfoCard user={user} />
        </div>

        {/* Colonne secondaire */}
        <div className="space-y-8">
          {/* Paramètres de sécurité */}
          <SecuritySettingsCard onStartKYC={handleStartKYC} />
          
          {/* Partage et contact */}
          <ShareAndContactCard />
        </div>
      </div>
    </div>
  );
}
