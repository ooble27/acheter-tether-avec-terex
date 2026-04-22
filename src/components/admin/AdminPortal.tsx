
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Menu,
  ArrowLeft,
  Calculator,
  Mail,
  Sparkles
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';
import { useUserRole } from '@/hooks/useUserRole';

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState('orders');
  const { isAdmin, isKYCReviewer } = useUserRole();
  const navigate = useNavigate();

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
        {/* Header avec bouton retour */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Portail Administrateur</h1>
            <p className="text-gray-400">Gérez votre plateforme Terex</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="bg-terex-gray/50 border-terex-gray hover:bg-terex-gray text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-terex-gray grid grid-cols-3 sm:grid-cols-6 w-full h-auto">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accounting" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Comptabilité</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kyc" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">KYC</span>
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Candidatures</span>
            </TabsTrigger>
            <TabsTrigger 
              value="newsletter" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger 
              value="neobank" 
              className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Vision</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersDashboardNew />
          </TabsContent>

          <TabsContent value="accounting">
            <AccountingAdmin />
          </TabsContent>

          <TabsContent value="kyc">
            <KYCAdmin />
          </TabsContent>

          <TabsContent value="applications">
            <JobApplicationsAdmin />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterAdmin />
          </TabsContent>

          <TabsContent value="neobank">
            <NeobankVision />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
