import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MobileMenu } from '@/components/dashboard/AppSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { DodoSidebar } from '@/components/dashboard/DodoSidebar';
import { MobileProfileMenu } from '@/components/dashboard/MobileProfileMenu';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
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
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { HighVolumeRequest } from '@/components/features/HighVolumeRequest';
import { cn } from '@/lib/utils';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { isKYCReviewer, isAdmin } = useUserRole();

  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  useEffect(() => {
    const state = location.state as { action?: string } | null;
    if (state?.action === 'buy') {
      setActiveSection('buy');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (isPWA && isMobile) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [activeSection, isPWA, isMobile]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Dashboard logout error:', error);
    }
  };

  const handleNavigate = (section: string) => {
    const routes: Record<string, string> = {
      contact: '/contact', feedback: '/feedback', referral: '/referral',
      'share-app': '/share', terms: '/terms',
    };
    if (routes[section]) {
      navigate(routes[section]);
    } else {
      setActiveSection(section);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':             return <DashboardHome user={user} onNavigate={setActiveSection} />;
      case 'buy':              return <BuyUSDT />;
      case 'sell':             return <SellUSDT />;
      case 'transfer':
        return (
          <div className="max-w-2xl mx-auto mt-8 text-center p-6">
            <div className="w-20 h-20 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-white text-2xl font-light mb-3">Virements Internationaux</h2>
            <p className="text-gray-400 text-base mb-6">Cette fonctionnalité sera bientôt disponible sur Terex.</p>
            <p className="text-gray-500 text-sm">Nous travaillons activement pour vous offrir le meilleur service de virements internationaux.</p>
          </div>
        );
      case 'otc':              return <HighVolumeRequest onBack={() => setActiveSection('home')} requestedAmount="" />;
      case 'history':          return <TransactionHistoryPage />;
      case 'profile':          return <Profile user={user} onLogout={handleLogout} />;
      case 'kyc':              return <KYCPage onBack={() => setActiveSection('profile')} />;
      case 'faq':              return <FAQ onNavigate={setActiveSection} />;
      case 'user-guide':       return <UserGuide onBack={() => setActiveSection('faq')} />;
      case 'security-policy':  return <SecurityPolicy onBack={() => setActiveSection('faq')} />;
      case 'terms-of-service': return <TermsOfService onBack={() => setActiveSection('faq')} />;
      case 'about-terex':      return <AboutTerex onBack={() => setActiveSection('faq')} />;
      case 'kyc-admin':        return isKYCReviewer() ? <KYCAdmin /> : <div className="text-white p-8">Accès non autorisé</div>;
      case 'orders-admin':     return isKYCReviewer() ? <OrdersDashboardNew /> : <div className="text-white p-8">Accès non autorisé</div>;
      case 'job-applications':
        return (isAdmin() || isKYCReviewer()) ? <JobApplicationsAdmin /> : <div className="text-white p-8">Accès non autorisé</div>;
      default:                 return <DashboardHome user={user} onNavigate={setActiveSection} />;
    }
  };

  return (
    <TransactionProvider>
      <SidebarProvider
        style={{ '--sidebar-width': '240px' } as React.CSSProperties}
        className="h-screen overflow-hidden"
      >
        {!isMobile && (
          <DodoSidebar
            activeSection={activeSection}
            onSectionChange={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        <SidebarInset className={cn(
          'bg-[#141414] flex flex-col',
          isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'
        )}>

          {isMobile && !isPWA && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              className="fixed top-4 right-4 z-50 text-white hover:bg-white/10 rounded-xl border border-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <MobileMenu
            activeSection={activeSection}
            setActiveSection={handleNavigate}
            onLogout={handleLogout}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

          <main className={cn(
            'flex-1 overflow-hidden relative',
            isMobile
              ? isPWA ? 'p-4 pt-16 pb-24' : 'p-4 pt-4 pb-24'
              : 'p-0 h-full'
          )}>
            {isMobile && isPWA && (
              <MobileProfileMenu
                activeSection={activeSection}
                setActiveSection={handleNavigate}
                onLogout={handleLogout}
              />
            )}
            {renderContent()}
          </main>

          {isMobile && (
            <MobileBottomNav
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}
        </SidebarInset>

        <NotificationPermissionPrompt />
        <PWAUpdatePrompt />
      </SidebarProvider>
    </TransactionProvider>
  );
}
