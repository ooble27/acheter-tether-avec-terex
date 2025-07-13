
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ShoppingCart, 
  FileCheck, 
  Settings,
  BarChart3,
  Shield,
  UserCheck,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { FraudDetectionDashboard } from '@/components/admin/FraudDetectionDashboard';
import { TwoFactorAuth } from '@/components/admin/TwoFactorAuth';
import { useUserRole } from '@/hooks/useUserRole';

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState('orders');
  const { isAdmin, isKYCReviewer } = useUserRole();

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <Card className="bg-terex-darker border-terex-gray p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-white mb-2">Accès non autorisé</h2>
            <p className="text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portail Administrateur</h1>
          <p className="text-gray-400">Gérez votre plateforme Terex avec des outils avancés</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="bg-terex-gray grid grid-cols-6 w-full min-w-max">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Commandes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fraud" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Anti-Fraude</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kyc" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>KYC</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Candidatures</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sécurité 2FA</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders">
            <OrdersDashboardNew />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="fraud">
            <FraudDetectionDashboard />
          </TabsContent>

          <TabsContent value="kyc">
            <KYCAdmin />
          </TabsContent>

          <TabsContent value="applications">
            <JobApplicationsAdmin />
          </TabsContent>

          <TabsContent value="security">
            <TwoFactorAuth />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
