
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  FileCheck, 
  Shield,
  UserCheck,
  ArrowLeft,
  Calculator
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState('orders');
  const { isAdmin, isKYCReviewer } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
        <Card className="bg-terex-darker border-terex-gray p-6 sm:p-8 max-w-sm w-full">
          <div className="text-center">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Accès non autorisé</h2>
            <p className="text-gray-400 text-sm">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-3 sm:p-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Portail Administrateur</h1>
            <p className="text-gray-400 text-sm">Gérez votre plateforme Terex</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="bg-terex-gray/50 border-terex-gray hover:bg-terex-gray text-white w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-terex-gray grid grid-cols-4 w-full h-auto p-1">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-terex-accent flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Commandes</span>
              <span className="sm:hidden text-[10px]">Cmd</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accounting" 
              className="data-[state=active]:bg-terex-accent flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Comptabilité</span>
              <span className="sm:hidden text-[10px]">Compta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kyc" 
              className="data-[state=active]:bg-terex-accent flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm"
            >
              <FileCheck className="w-4 h-4" />
              <span>KYC</span>
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-terex-accent flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 text-xs sm:text-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Candidatures</span>
              <span className="sm:hidden text-[10px]">Cand</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <OrdersDashboardNew />
          </TabsContent>

          <TabsContent value="accounting" className="mt-4">
            <AccountingAdmin />
          </TabsContent>

          <TabsContent value="kyc" className="mt-4">
            <KYCAdmin />
          </TabsContent>

          <TabsContent value="applications" className="mt-4">
            <JobApplicationsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
