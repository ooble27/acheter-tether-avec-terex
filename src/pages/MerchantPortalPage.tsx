import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Key, Webhook, BarChart3, FileText, Code2, QrCode, Scan } from 'lucide-react';
import { MerchantAPIKeys } from '@/components/merchant/MerchantAPIKeys';
import { MerchantWebhooks } from '@/components/merchant/MerchantWebhooks';
import { MerchantTransactions } from '@/components/merchant/MerchantTransactions';
import { MerchantAnalytics } from '@/components/merchant/MerchantAnalytics';
import { MerchantDocumentation } from '@/components/merchant/MerchantDocumentation';
import { MerchantAPI } from '@/components/merchant/MerchantAPI';
import { MerchantQRCodes } from '@/components/merchant/MerchantQRCodes';
import { MerchantPaymentQR } from '@/components/merchant/MerchantPaymentQR';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function MerchantPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [merchantAccount, setMerchantAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payment-qr');
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


  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'ecommerce',
    business_email: '',
    business_phone: '',
    business_address: ''
  });

  // Update email when user is loaded
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, business_email: user.email }));
    }
  }, [user]);

  const createMerchantAccount = async () => {
    if (!user) return;

    if (!formData.business_name || !formData.business_type) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    const { data, error } = await supabase
      .from('merchant_accounts')
      .insert([{
        user_id: user.id,
        business_name: formData.business_name,
        business_email: formData.business_email,
        business_type: formData.business_type,
        business_phone: formData.business_phone || null,
        business_address: formData.business_address || null
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
      title: 'Compte marchand créé !',
      description: 'Votre compte marchand a été créé avec succès. Vous pouvez maintenant accéder à votre QR code et aux APIs.',
      className: "bg-green-600 text-white border-green-600"
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-20 pb-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>

          <Card className="border-border">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Devenir Marchand Terex
                  </CardTitle>
                  <CardDescription className="text-base">
                    Intégrez les paiements USDT dans votre business
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Pourquoi devenir marchand ?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Acceptez des paiements USDT instantanés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>API complète pour intégration facile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>QR code permanent pour votre boutique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Webhooks pour automatiser vos processus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Commissions compétitives (0.5%)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Nom de votre entreprise <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Ex: Ma Boutique SARL"
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Type d'entreprise <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="ecommerce">E-commerce</option>
                    <option value="retail">Commerce de détail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="services">Services</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Email professionnel <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.business_email}
                    onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                    placeholder="contact@monentreprise.com"
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Téléphone professionnel (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={formData.business_phone}
                    onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Adresse (optionnel)
                  </label>
                  <textarea
                    value={formData.business_address}
                    onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                    placeholder="Adresse complète de votre entreprise"
                    rows={3}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <Button 
                onClick={createMerchantAccount}
                className="w-full"
                size="lg"
              >
                <Code2 className="mr-2 h-5 w-5" />
                Créer mon compte marchand
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                En créant votre compte marchand, vous acceptez nos{' '}
                <span className="text-primary cursor-pointer hover:underline">conditions d'utilisation</span>
                {' '}et notre{' '}
                <span className="text-primary cursor-pointer hover:underline">politique de confidentialité</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
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
                <SelectItem value="payment-qr">
                  <div className="flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    <span>Mon QR de Paiement</span>
                  </div>
                </SelectItem>
                <SelectItem value="api-keys">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span>API Keys</span>
                  </div>
                </SelectItem>
                <SelectItem value="api">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    <span>API</span>
                  </div>
                </SelectItem>
                <SelectItem value="qr-codes">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <span>QR Codes</span>
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
            <TabsList className="grid w-full grid-cols-8 bg-muted">
              <TabsTrigger value="payment-qr" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Scan className="mr-2 h-4 w-4" />
                Mon QR
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Code2 className="mr-2 h-4 w-4" />
                API
              </TabsTrigger>
              <TabsTrigger value="qr-codes" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <QrCode className="mr-2 h-4 w-4" />
                QR Codes
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="docs" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payment-qr" className="mt-6">
              <MerchantPaymentQR merchantAccount={merchantAccount} />
            </TabsContent>

            <TabsContent value="api-keys" className="mt-6">
              <MerchantAPIKeys merchantAccount={merchantAccount} onUpdate={loadMerchantAccount} />
            </TabsContent>
            
            <TabsContent value="api" className="mt-6">
              <MerchantAPI merchantAccount={merchantAccount} />
            </TabsContent>
            
            <TabsContent value="qr-codes" className="mt-6">
              <MerchantQRCodes merchantId={merchantAccount.id} />
            </TabsContent>
            
            <TabsContent value="webhooks" className="mt-6">
              <MerchantWebhooks merchantAccount={merchantAccount} onUpdate={loadMerchantAccount} />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-6">
              <MerchantTransactions merchantId={merchantAccount.id} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <MerchantAnalytics merchantId={merchantAccount.id} />
            </TabsContent>
            
            <TabsContent value="docs" className="mt-6">
              <MerchantDocumentation />
            </TabsContent>
          </Tabs>
        )}

        {/* Mobile: Content */}
        {isMobile && (
          <div className="mt-6">
            {activeTab === 'payment-qr' && (
              <MerchantPaymentQR merchantAccount={merchantAccount} />
            )}
            {activeTab === 'api-keys' && (
              <MerchantAPIKeys merchantAccount={merchantAccount} onUpdate={loadMerchantAccount} />
            )}
            {activeTab === 'api' && (
              <MerchantAPI merchantAccount={merchantAccount} />
            )}
            {activeTab === 'qr-codes' && (
              <MerchantQRCodes merchantId={merchantAccount.id} />
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
        )}
      </div>
    </div>
  );
}
