
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenu } from '@/components/dashboard/AppSidebar';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { InternationalTransfer } from '@/components/features/InternationalTransfer';
import { FAQ } from '@/components/features/FAQ';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { Profile } from '@/components/features/Profile';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home');
  const isMobile = useIsMobile();

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
      case 'profile':
        return <Profile user={user} />;
      case 'faq':
        return <FAQ />;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <TransactionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-terex-dark">
          <div className="hidden md:flex flex-col w-64 bg-terex-darker border-r border-terex-gray">
            <AppSidebar 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onLogout={onLogout}
            />
            <div className="mt-auto p-4">
              <Separator className="mb-4 bg-terex-gray" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Thème</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
          <main className={`flex-1 ${isMobile ? 'p-4 pt-16' : 'p-6'}`}>
            <MobileMenu 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onLogout={onLogout}
            />
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </TransactionProvider>
  );
}
