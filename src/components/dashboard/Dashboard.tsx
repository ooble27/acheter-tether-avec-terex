
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
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { UserGuide } from '@/components/features/UserGuide';
import { SecurityPolicy } from '@/components/features/SecurityPolicy';
import { TermsOfService } from '@/components/features/TermsOfService';
import { AboutTerex } from '@/components/features/AboutTerex';
import { TransactionHistoryPage } from '@/components/features/TransactionHistoryPage';
import { NotificationPermissionPrompt } from '@/components/notifications/NotificationPermissionPrompt';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { HighVolumeRequest } from '@/components/features/HighVolumeRequest';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home');
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { signOut } = useAuth();
  const { isKYCReviewer, isAdmin } = useUserRole();

  // Effet pour remonter en haut à chaque changement de section
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleBackToHome = () => {
    setActiveSection('home');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome user={user} onNavigate={setActiveSection} />;
      case 'buy':
        return <BuyUSDT />;
      case 'sell':
        return <SellUSDT />;
      case 'transfer':
        return <InternationalTransfer />;
      case 'otc':
        // Redirecter vers le formulaire de demande de gros volume avec un montant par défaut
        return <HighVolumeRequest onBack={() => setActiveSection('home')} requestedAmount="" />;
      case 'history':
        return <TransactionHistoryPage />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      case 'kyc':
        return <KYCPage onBack={() => setActiveSection('profile')} />;
      case 'faq':
        return <FAQ onNavigate={setActiveSection} />;
      case 'user-guide':
        return <UserGuide onBack={() => setActiveSection('faq')} />;
      case 'security-policy':
        return <SecurityPolicy onBack={() => setActiveSection('faq')} />;
      case 'terms-of-service':
        return <TermsOfService onBack={() => setActiveSection('faq')} />;
      case 'about-terex':
        return <AboutTerex onBack={() => setActiveSection('faq')} />;
      case 'kyc-admin':
        return isKYCReviewer() ? <KYCAdmin /> : <div className="text-white">Accès non autorisé</div>;
      case 'orders-admin':
        return isKYCReviewer() ? <OrdersDashboardNew /> : <div className="text-white">Accès non autorisé</div>;
      case 'job-applications':
        return (isAdmin() || isKYCReviewer()) ? <JobApplicationsAdmin /> : <div className="text-white">Accès non autorisé</div>;
      default:
        return <DashboardHome user={user} onNavigate={setActiveSection} />;
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
          <main className={`flex-1 ${isMobile ? 'p-4 pt-16' : 'p-6'} relative`}>
            <MobileMenu 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onLogout={handleLogout}
            />
            
            {/* Bouton de déconnexion flottant uniquement sur tablette */}
            {isTablet && (
              <Button 
                onClick={handleLogout}
                className="fixed top-6 right-6 z-50 h-14 px-6 bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white transition-all duration-200 rounded-xl font-medium text-sm shadow-lg"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion
              </Button>
            )}
            
            {renderContent()}
          </main>
          
          {/* Prompt de permission pour les notifications push */}
          <NotificationPermissionPrompt />
        </div>
      </SidebarProvider>
    </TransactionProvider>
  );
}
