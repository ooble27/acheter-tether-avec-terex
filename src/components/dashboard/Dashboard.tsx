
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenu } from '@/components/dashboard/AppSidebar';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { InternationalTransfer } from '@/components/features/InternationalTransfer';
import { FAQ } from '@/components/features/FAQ';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { Profile } from '@/components/features/Profile';
import { KYCPage } from '@/components/features/KYCPage';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { OrdersDashboard } from '@/components/admin/orders/OrdersDashboard';
import { AdminPortal } from '@/components/admin/AdminPortal';
import { OTC } from '@/components/features/OTC';
import { UserGuide } from '@/components/features/UserGuide';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home');
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { isKYCReviewer, isAdmin } = useUserRole();

  // Effet pour remonter en haut à chaque changement de section
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const handleLogout = async () => {
    try {
      console.log('Dashboard: Starting logout...')
      await signOut();
      console.log('Dashboard: Logout completed')
      // No need to manually redirect, the auth state change will handle it
    } catch (error) {
      console.error('Dashboard: Logout error:', error)
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome user={user} />;
      case 'buy':
        return <BuyUSDT />;
      case 'sell':
        return <SellUSDT />;
      case 'otc':
        return <OTC />;
      case 'transfer':
        return <InternationalTransfer />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      case 'kyc':
        return <KYCPage onBack={() => setActiveSection('profile')} />;
      case 'faq':
        return <FAQ />;
      case 'user-guide':
        return <UserGuide onBack={() => setActiveSection('faq')} />;
      case 'kyc-admin':
        return isKYCReviewer() ? <KYCAdmin /> : <div className="text-white">Accès non autorisé</div>;
      case 'orders-admin':
        return isKYCReviewer() ? <OrdersDashboard /> : <div className="text-white">Accès non autorisé</div>;
      case 'admin-portal':
        return (isAdmin() || isKYCReviewer()) ? <AdminPortal /> : <div className="text-white">Accès non autorisé</div>;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <TransactionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-terex-dark">
          <AppSidebar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
          />
          <main className={`flex-1 ${isMobile ? 'p-4 pt-16' : 'p-6'}`}>
            <MobileMenu 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onLogout={handleLogout}
            />
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </TransactionProvider>
  );
}
