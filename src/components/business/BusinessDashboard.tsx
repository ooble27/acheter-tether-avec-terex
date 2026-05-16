import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BusinessAppSidebar } from './BusinessAppSidebar';
import { BusinessOverview } from './BusinessOverview';
import { BusinessPayments } from './BusinessPayments';
import { BusinessSuppliers } from './BusinessSuppliers';
import { BusinessHistory } from './BusinessHistory';
import { BusinessProfile } from './BusinessProfile';
import { BusinessSupport } from './BusinessSupport';
import { BusinessTreasury } from './BusinessTreasury';
import { BusinessAnalytics } from './BusinessAnalytics';
import { BusinessBatch } from './BusinessBatch';
import { BusinessTeam } from './BusinessTeam';
import { BusinessCompliance } from './BusinessCompliance';

interface BusinessDashboardProps {
  user: { id?: string; email: string; name: string } | null;
}

export function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':    return <BusinessOverview user={user} onNavigate={setActiveSection} />;
      case 'payment':     return <BusinessPayments user={user} onBack={() => setActiveSection('overview')} />;
      case 'treasury':    return <BusinessTreasury user={user} />;
      case 'history':     return <BusinessHistory user={user} />;
      case 'suppliers':   return <BusinessSuppliers user={user} />;
      case 'batch':       return <BusinessBatch user={user} />;
      case 'analytics':   return <BusinessAnalytics user={user} />;
      case 'team':        return <BusinessTeam user={user} />;
      case 'compliance':  return <BusinessCompliance user={user} />;
      case 'profile':     return <BusinessProfile user={user} />;
      case 'support':     return <BusinessSupport />;
      default:            return <BusinessOverview user={user} onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        '--sidebar-background': '0 0% 7.8%',
        '--sidebar-foreground': '0 0% 94%',
        '--sidebar-accent': '176 30% 13%',
        '--sidebar-accent-foreground': '0 0% 94%',
        '--sidebar-border': '0 0% 16%',
        '--sidebar-primary': '176 43% 41%',
        '--sidebar-primary-foreground': '0 0% 100%',
        '--sidebar-ring': '176 43% 41%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1a1a1a',
      } as React.CSSProperties}
    >
      <BusinessAppSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />

      <SidebarInset style={{ background: '#1a1a1a', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Bouton trigger flottant — seul, sans barre */}
        <SidebarTrigger
          className="fixed z-40"
          style={{
            top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
            left: 24,
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#282828',
            border: '1px solid #2a2a2a',
            color: '#888888',
          }}
        />

        {/* Contenu scrollable */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#1a1a1a' }}>
          <div
            className="p-4 md:p-8"
            style={{
              maxWidth: 1040,
              margin: '0 auto',
              width: '100%',
              paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 68px), 68px)',
            }}
          >
            {renderContent()}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
