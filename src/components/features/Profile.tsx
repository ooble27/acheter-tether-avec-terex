
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileTabs } from './profile/ProfileTabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark animate-fade-in">
      {/* Header redesigné */}
      <ProfileHeader user={user} isKYCVerified={isKYCVerified} />

      {/* KYC Alert - Seulement si pas vérifié et pas en cours */}
      {showKYCAlert && (
        <div className="mb-8">
          <KYCAlert status={kycData?.status || 'pending'} onStartKYC={handleStartKYC} />
        </div>
      )}

      {/* Navigation par onglets */}
      <ProfileTabs 
        user={user}
        onStartKYC={handleStartKYC}
        kycData={kycData}
        isKYCVerified={isKYCVerified}
      />

      {/* Bouton de déconnexion */}
      <div className="mt-8 pt-8 border-t border-terex-gray/50">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full md:w-auto border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
