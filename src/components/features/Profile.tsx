
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTransactions } from '@/contexts/TransactionContext';
import { User, History, Settings } from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
}

export function Profile({ user }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('transactions');
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-gray-400">
          Gérez votre compte et consultez vos transactions
        </p>
      </div>

      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-terex-accent rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">{user?.name || 'Utilisateur'}</CardTitle>
              <CardDescription className="text-gray-400">{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

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
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Paramètres du compte</CardTitle>
                <CardDescription className="text-gray-400">
                  Gérez vos préférences et paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-terex-gray rounded-lg">
                    <h3 className="text-white font-medium mb-2">Notifications</h3>
                    <p className="text-gray-400 text-sm">
                      Configuration des notifications par email disponible prochainement
                    </p>
                  </div>
                  <div className="p-4 bg-terex-gray rounded-lg">
                    <h3 className="text-white font-medium mb-2">Sécurité</h3>
                    <p className="text-gray-400 text-sm">
                      Authentification à deux facteurs disponible prochainement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
