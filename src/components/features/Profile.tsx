
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKYC } from '@/hooks/useKYC';
import { PersonalInfoCard } from '@/components/features/profile/PersonalInfoCard';
import { ContactCard } from '@/components/features/profile/ContactCard';
import { SecuritySettingsCard } from '@/components/features/profile/SecuritySettingsCard';
import { ProfileStatsCard } from '@/components/features/profile/ProfileStatsCard';
import { ShareAndContactCard } from '@/components/features/profile/ShareAndContactCard';
import { useScrollToTop } from '@/components/ScrollToTop';

export function Profile() {
  const scrollToTop = useScrollToTop();
  const { user, logout } = useAuth();
  const { kycData, loading } = useKYC();

  // Scroll to top when component mounts
  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  const handleLogout = async () => {
    await logout();
  };

  const handleStartKYC = () => {
    // Logic to start KYC process
    console.log('Starting KYC process...');
  };

  const isKYCVerified = kycData?.status === 'approved';

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PersonalInfoCard user={user} />
          <ContactCard user={user ? { 
            email: user.email || '', 
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '' 
          } : null} />
        </div>
        
        <div className="space-y-6">
          <ProfileStatsCard />
          <SecuritySettingsCard 
            onLogout={handleLogout}
            onStartKYC={handleStartKYC}
            kycData={kycData}
            isKYCVerified={isKYCVerified}
          />
        </div>
      </div>
      
      <ShareAndContactCard />
    </div>
  );
}
