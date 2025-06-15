
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { DashboardHome } from './DashboardHome';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { InternationalTransfer } from '@/components/features/InternationalTransfer';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { Profile } from '@/components/features/Profile';
import { AboutTerex } from '@/components/features/AboutTerex';
import { FAQ } from '@/components/features/FAQ';
import { UserGuide } from '@/components/features/UserGuide';
import { SecurityPolicy } from '@/components/features/SecurityPolicy';
import { TermsOfService } from '@/components/features/TermsOfService';
import { HighVolumeRequest } from '@/components/features/HighVolumeRequest';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AIAssistantWidget } from '@/components/features/AIAssistantWidget';

export interface DashboardUser {
  email: string;
  name: string;
}

interface DashboardProps {
  user: DashboardUser;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState('home');
  const { signOut } = useAuth();

  // Activer les notifications push
  useNotificationTrigger();

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'buy':
        return <BuyUSDT />;
      case 'sell':
        return <SellUSDT />;
      case 'transfer':
        return <InternationalTransfer />;
      case 'history':
        return <TransactionHistory />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      case 'about':
        return <AboutTerex />;
      case 'faq':
        return <FAQ />;
      case 'guide':
        return <UserGuide />;
      case 'security':
        return <SecurityPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'volume':
        return <HighVolumeRequest />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-terex-dark">
        <AppSidebar 
          user={user} 
          activeView={activeView} 
          onViewChange={setActiveView}
          onLogout={handleLogout}
        />
        <SidebarInset className="flex-1">
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
        <AIAssistantWidget />
      </div>
    </SidebarProvider>
  );
}
