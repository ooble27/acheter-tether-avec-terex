
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { BuyUSDT } from "@/components/features/BuyUSDT";
import { EnhancedBuyUSDT } from "@/components/features/EnhancedBuyUSDT";
import { SellUSDT } from "@/components/features/SellUSDT";
import { TransactionHistory } from "@/components/features/TransactionHistory";
import { InternationalTransfer } from "@/components/features/InternationalTransfer";
import { FAQ } from "@/components/features/FAQ";
import { Profile } from "@/components/features/Profile";
import { KYCPage } from "@/components/features/KYCPage";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { EnhancedOrdersAdmin } from "@/components/admin/EnhancedOrdersAdmin";
import { KYCAdmin } from "@/components/admin/KYCAdmin";
import { AuthProvider } from '@/contexts/AuthContext';

interface DashboardProps {
  user: {
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'buy-usdt':
        return <EnhancedBuyUSDT />;
      case 'sell-usdt':
        return <SellUSDT />;
      case 'transactions':
        return <TransactionHistory />;
      case 'transfer':
        return <InternationalTransfer />;
      case 'faq':
        return <FAQ />;
      case 'profile':
        return <Profile />;
      case 'kyc':
        return <KYCPage />;
      case 'orders-admin':
        return <EnhancedOrdersAdmin />;
      case 'kyc-admin':
        return <KYCAdmin />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-terex-dark">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1">
            <div className="p-2">
              <SidebarTrigger className="mb-4" />
            </div>
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
