
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { DashboardHome } from './DashboardHome';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { InternationalTransfer } from '@/components/features/InternationalTransfer';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { KYCPage } from '@/components/features/KYCPage';
import { Profile } from '@/components/features/Profile';
import { FAQ } from '@/components/features/FAQ';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { useTransactions } from '@/contexts/TransactionContext';

interface DashboardContentProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

export function DashboardContent({ user, onLogout }: DashboardContentProps) {
  const [activeSection, setActiveSection] = useState('home');
  const { transactions } = useTransactions();

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome user={user} />;
      case 'buy':
        return <BuyUSDT />;
      case 'sell':
        return <SellUSDT />;
      case 'transfer':
        return <InternationalTransfer />;
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'kyc':
        return <KYCPage onBack={() => setActiveSection('profile')} />;
      case 'profile':
        return <Profile user={user} onLogout={onLogout} />;
      case 'faq':
        return <FAQ />;
      case 'admin-kyc':
        return <KYCAdmin />;
      case 'admin-orders':
        return <OrderManagement />;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-terex-dark">
        <AppSidebar 
          user={user} 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 bg-terex-darker border-b border-terex-gray p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="text-white" />
              <h1 className="text-xl font-semibold text-white">
                {activeSection === 'home' && 'Tableau de bord'}
                {activeSection === 'buy' && 'Acheter USDT'}
                {activeSection === 'sell' && 'Vendre USDT'}
                {activeSection === 'transfer' && 'Virement international'}
                {activeSection === 'history' && 'Historique des transactions'}
                {activeSection === 'kyc' && 'Vérification KYC'}
                {activeSection === 'profile' && 'Profil'}
                {activeSection === 'faq' && 'Questions fréquentes'}
                {activeSection === 'admin-kyc' && 'Administration KYC'}
                {activeSection === 'admin-orders' && 'Gestion des commandes'}
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
