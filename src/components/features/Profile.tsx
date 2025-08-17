
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKYC } from '@/hooks/useKYC';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { ContactCard } from './profile/ContactCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';
import { SecuritySettingsCard } from './profile/SecuritySettingsCard';
import { ProfileStatsCard } from './profile/ProfileStatsCard';
import { ProfileHeaderCard } from './profile/ProfileHeaderCard';
import { User, Star, Award, Sparkles } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="text-white text-lg font-medium">Chargement de votre profil...</div>
          <div className="text-gray-400 text-sm">Préparation de vos données</div>
        </div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  const isKYCVerified = kycData?.status === 'approved';
  const showKYCAlert = !isKYCVerified && kycData?.status !== 'submitted' && kycData?.status !== 'under_review';

  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-terex-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 animate-fade-in">
        {/* Header Profile Card */}
        <div className="mb-8">
          <ProfileHeaderCard user={user} kycData={kycData} isKYCVerified={isKYCVerified} />
        </div>

        {/* KYC Alert */}
        {showKYCAlert && (
          <div className="mb-8 animate-slide-in-right">
            <KYCAlert status={kycData?.status || 'pending'} onStartKYC={handleStartKYC} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <ProfileStatsCard />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="animate-fade-in animation-delay-200">
              <PersonalInfoCard user={user} />
            </div>
            
            <div className="animate-fade-in animation-delay-400">
              <ContactCard user={user} />
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            <div className="animate-fade-in animation-delay-600">
              <SecuritySettingsCard 
                onStartKYC={handleStartKYC} 
                kycData={kycData}
                isKYCVerified={isKYCVerified}
              />
            </div>
            
            <div className="animate-fade-in animation-delay-800">
              <ShareAndContactCard />
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
