import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { DashboardHome } from './DashboardHome';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { InternationalTransfer } from '@/components/features/InternationalTransfer';
import { TerexPay } from '@/components/features/TerexPay';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { KYCPage } from '@/components/features/KYCPage';
import { Profile } from '@/components/features/Profile';
import { FAQ } from '@/components/features/FAQ';

interface DashboardProps {
  user: {
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "buy":
        return <BuyUSDT />;
      case "sell":
        return <SellUSDT />;
      case "transfer":
        return <InternationalTransfer />;
      case "terex-pay":
        return <TerexPay />;
      case "history":
        return <TransactionHistory />;
      case "kyc":
        return <KYCPage />;
      case "profile":
        return <Profile user={user} />;
      case "faq":
        return <FAQ />;
      case "support":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Support Client</h2>
            <p className="text-gray-300">Contactez notre équipe support pour toute assistance.</p>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-terex-dark text-white">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-x-hidden">
          {/* Main content area */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
