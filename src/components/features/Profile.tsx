
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileTabs } from './profile/ProfileTabs';

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
        <div className="text-gray-900 dark:text-white">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  const isKYCVerified = kycData?.status === 'approved';
  const showKYCAlert = !isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-terex-dark dark:via-terex-darker dark:to-terex-dark">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header modernisé */}
        <ProfileHeader user={user} isKYCVerified={isKYCVerified} />

        {/* KYC Alert - Seulement si pas vérifié et pas en cours */}
        {showKYCAlert && (
          <div className="mb-6">
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
      </div>
    </div>
  );
}
