import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Key, Webhook, BarChart3, FileText, ChevronDown } from 'lucide-react';
import { MerchantAPIKeys } from '@/components/merchant/MerchantAPIKeys';
import { MerchantWebhooks } from '@/components/merchant/MerchantWebhooks';
import { MerchantTransactions } from '@/components/merchant/MerchantTransactions';
import { MerchantAnalytics } from '@/components/merchant/MerchantAnalytics';
import { MerchantDocumentation } from '@/components/merchant/MerchantDocumentation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function MerchantPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [merchantAccount, setMerchantAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('api-keys');
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    await loadMerchantAccount(session.user.id);
  };

  const loadMerchantAccount = async (userId: string) => {
    const { data, error } = await supabase
      .from('merchant_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le compte marchand',
        variant: 'destructive'
      });
    }

    setMerchantAccount(data);
    setLoading(false);
  };

  const createMerchantAccount = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('merchant_accounts')
      .insert([{
        user_id: user.id,
        business_name: user.email?.split('@')[0] || 'Mon entreprise',
        business_email: user.email,
        business_type: 'ecommerce'
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    setMerchantAccount(data);
    toast({
      title: 'Compte marchand créé',
      description: 'Votre compte marchand a été créé avec succès'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!merchantAccount) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Portail Marchand Terex</CardTitle>
              <CardDescription>
                Créez votre compte marchand pour accéder aux APIs de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Le portail marchand vous permet d'intégrer Terex dans vos applications via API.
                Vous pourrez accepter des paiements en USDT, gérer des transactions et suivre vos revenus.
              </p>
              <Button onClick={createMerchantAccount}>
                Créer mon compte marchand
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au dashboard
            </Button>
            <h1 className="text-3xl font-bold">Portail Marchand</h1>
            <p className="text-muted-foreground">{merchantAccount.business_name}</p>
          </div>
        </div>

        {/* Mobile: DropdownSelector */}
        {isMobile && (
          <div className="mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="api-keys">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span>API Keys</span>
                  </div>
                </SelectItem>
                <SelectItem value="webhooks">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4" />
                    <span>Webhooks</span>
                  </div>
                </SelectItem>
                <SelectItem value="transactions">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Transactions</span>
                  </div>
                </SelectItem>
                <SelectItem value="analytics">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </div>
                </SelectItem>
                <SelectItem value="docs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Documentation</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Desktop: Tabs */}
        {!isMobile && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="api-keys">
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="webhooks">
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <FileText className="mr-2 h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="docs">
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'api-keys' && (
            <MerchantAPIKeys merchantAccount={merchantAccount} onUpdate={loadMerchantAccount} />
          )}
          {activeTab === 'webhooks' && (
            <MerchantWebhooks merchantAccount={merchantAccount} onUpdate={loadMerchantAccount} />
          )}
          {activeTab === 'transactions' && (
            <MerchantTransactions merchantId={merchantAccount.id} />
          )}
          {activeTab === 'analytics' && (
            <MerchantAnalytics merchantId={merchantAccount.id} />
          )}
          {activeTab === 'docs' && (
            <MerchantDocumentation />
          )}
        </div>
      </div>
    </div>
  );
}
