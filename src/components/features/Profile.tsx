
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTransactions } from '@/contexts/TransactionContext';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { TransactionHistory } from './TransactionHistory';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const { loading } = useUserProfile();
  const { transactions } = useTransactions();

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-gray-400">Gérez vos informations personnelles et préférences</p>
      </div>

      <KYCAlert status="pending" onStartKYC={handleStartKYC} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoCard user={user} />
        <ShareAndContactCard />
      </div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}
