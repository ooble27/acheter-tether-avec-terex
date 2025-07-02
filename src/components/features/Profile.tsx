
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { ContactCard } from './profile/ContactCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';
import { SecuritySettingsCard } from './profile/SecuritySettingsCard';
import { User, Star, Award } from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const { loading } = useUserProfile();
  const { kycData, loading: kycLoading } = useKYC();

  const handleStartKYC = () => {
    setShowKYC(true);
  };

  if (loading || kycLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  const isKYCVerified = kycData?.status === 'approved';
  const showKYCAlert = !isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review';

  return (
    <div className="min-h-screen bg-terex-dark p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Header avec design uniforme */}
      <div className="bg-gradient-to-br from-terex-darker/95 to-terex-dark/95 border border-white/10 rounded-2xl mb-8 p-8 shadow-2xl backdrop-blur-sm">
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
              <p className="text-gray-300 text-lg">Bienvenue {user?.name || 'Utilisateur'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-terex-darker/80 backdrop-blur-sm rounded-full px-4 py-2 border border-terex-gray/20">
              <Star className="w-4 h-4 text-terex-accent" />
              <span className="text-white text-sm">Membre Terex</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/30">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Compte Actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Alert - Seulement si pas vérifié et pas en cours */}
      {showKYCAlert && (
        <div className="mb-8">
          <KYCAlert status={kycData?.status || 'pending'} onStartKYC={handleStartKYC} />
        </div>
      )}

      {/* Grille des cartes avec hiérarchie des tailles - 12 colonnes pour plus de contrôle */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Colonne principale - Blocs plus larges (8 colonnes sur 12) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Informations personnelles - Plus large */}
          <PersonalInfoCard user={user} />
          
          {/* Contact - Plus large */}
          <ContactCard user={user} />
        </div>

        {/* Colonne secondaire - Blocs plus petits (4 colonnes sur 12) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Paramètres de sécurité */}
          <SecuritySettingsCard 
            onStartKYC={handleStartKYC} 
            kycData={kycData}
            isKYCVerified={isKYCVerified}
          />
          
          {/* Partage et contact */}
          <ShareAndContactCard />
        </div>
      </div>
    </div>
  );
}
