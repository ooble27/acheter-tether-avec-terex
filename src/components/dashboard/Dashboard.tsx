
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenu } from '@/components/dashboard/AppSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { MobileProfileMenu } from '@/components/dashboard/MobileProfileMenu';
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
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { signOut } = useAuth();
  const { isKYCReviewer, isAdmin } = useUserRole();

  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  // Effet pour remonter en haut à chaque changement de section
  useEffect(() => {
    // Pour le PWA mobile, scroll immédiatement et de façon synchrone
    if (isPWA && isMobile) {
      window.scrollTo(0, 0);
      // Force aussi le scroll du body au cas où
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection, isPWA, isMobile]);

  // Effet spécial pour s'assurer que la page home scroll bien en haut
  useEffect(() => {
    if (activeSection === 'home' && isPWA && isMobile) {
      // Double vérification pour la page d'accueil
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
    }
  }, [activeSection, isPWA, isMobile]);

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

  const handleNavigate = (section: string) => {
    // Pages qui doivent ouvrir une nouvelle route
    const externalPages = ['contact', 'feedback', 'referral', 'share-app', 'terms'];
    
    if (externalPages.includes(section)) {
      switch (section) {
        case 'contact':
          navigate('/contact');
          break;
        case 'feedback':
          navigate('/feedback');
          break;
        case 'referral':
          navigate('/referral');
          break;
        case 'share-app':
          navigate('/share');
          break;
        case 'terms':
          navigate('/terms');
          break;
      }
    } else {
      // Pages internes au dashboard
      setActiveSection(section);
    }
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
          {/* Sidebar desktop ou menu mobile classique si pas PWA */}
          {!isMobile && (
            <AppSidebar 
              activeSection={activeSection}
              setActiveSection={handleNavigate}
              onLogout={handleLogout}
            />
          )}
          
          {/* Menu mobile classique pour navigation web (pas PWA) */}
          {isMobile && !isPWA && (
            <MobileMenu 
              activeSection={activeSection}
              setActiveSection={handleNavigate}
              onLogout={handleLogout}
            />
          )}

          <main className={`flex-1 ${isMobile ? 'p-4 pt-16' : 'p-6'} relative ${isMobile ? 'pb-20' : ''}`}>
            {/* Menu profil mobile pour PWA */}
            {isMobile && isPWA && (
              <MobileProfileMenu
                activeSection={activeSection}
                setActiveSection={handleNavigate}
                onLogout={handleLogout}
              />
            )}
            
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
          
          {/* Navigation en bas pour mobile */}
          {isMobile && (
            <MobileBottomNav
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}
          
          {/* Prompt de permission pour les notifications push */}
          <NotificationPermissionPrompt />
          
          {/* Prompt de mise à jour PWA */}
          <PWAUpdatePrompt />
        </div>
      </SidebarProvider>
    </TransactionProvider>
  );
}
