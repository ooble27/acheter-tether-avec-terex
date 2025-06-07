
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTransactions } from '@/contexts/TransactionContext';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { TransactionHistory } from './TransactionHistory';
import { PersonalInfoCard } from './profile/PersonalInfoCard';
import { ShareAndContactCard } from './profile/ShareAndContactCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, History, Shield, Settings } from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [showKYC, setShowKYC] = useState(false);
  const { loading } = useUserProfile();
  const { transactions, loading: transactionsLoading } = useTransactions();

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

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-terex-darker border-terex-gray">
          <TabsTrigger 
            value="personal" 
            className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-300"
          >
            <User className="w-4 h-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-300"
          >
            <History className="w-4 h-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoCard user={user} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          {transactionsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-white">Chargement des transactions...</div>
            </div>
          ) : (
            <TransactionHistory transactions={transactions} />
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <KYCAlert status="pending" onStartKYC={handleStartKYC} />
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <ShareAndContactCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
