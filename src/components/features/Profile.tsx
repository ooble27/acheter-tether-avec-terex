
import React, { useState } from 'react';
import { MobileProfileMenu } from '@/components/dashboard/MobileProfileMenu';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { SecuritySettingsCard } from './profile/SecuritySettingsCard';
import { ProfileStatsCard } from './profile/ProfileStatsCard';
import { ContactCard } from './profile/ContactCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';
import { TermsCard } from './profile/TermsCard';
import { TransactionHistoryPage } from './TransactionHistoryPage';
import { FAQ } from './FAQ';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useKYC } from '@/hooks/useKYC';

interface ProfileProps {
  user: { email: string; name: string } | null;
}

export function Profile({ user }: ProfileProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const { profile } = useUserProfile();
  const { signOut } = useAuth();
  const { kycData, isKYCVerified } = useKYC();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleStartKYC = () => {
    setActiveSection('kyc');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <PersonalInfoCard user={user} />
            <SecuritySettingsCard 
              onStartKYC={handleStartKYC}
              kycData={kycData}
              isKYCVerified={isKYCVerified}
            />
            <ProfileStatsCard />
          </div>
        );
      case 'history':
        return <TransactionHistoryPage />;
      case 'faq':
        return <FAQ onNavigate={setActiveSection} />;
      case 'contact':
        return <ContactCard user={user} />;
      case 'share-app':
        return <ShareAndContactCard />;
      case 'terms':
        return <TermsCard />;
      case 'kyc-admin':
        return <KYCAdmin />;
      case 'orders-admin':
        return <AdminDashboard />;
      case 'job-applications':
        return <JobApplicationsAdmin />;
      default:
        return (
          <div className="space-y-6">
            <PersonalInfoCard user={user} />
            <SecuritySettingsCard 
              onStartKYC={handleStartKYC}
              kycData={kycData}
              isKYCVerified={isKYCVerified}
            />
            <ProfileStatsCard />
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      <MobileProfileMenu 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className="pb-20 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
