
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  QrCode, 
  Key, 
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw
} from 'lucide-react';

interface TwoFactorSettings {
  id: string;
  user_id: string;
  secret: string;
  backup_codes: string[];
  is_enabled: boolean;
  enabled_at?: string;
  created_at: string;
  updated_at: string;
}

export function TwoFactorAuth() {
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres 2FA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = () => {
    // Générer un secret 2FA basique (dans un vrai app, utiliser une lib comme speakeasy)
    const secret = Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
    
    return secret;
  };

  const generateBackupCodes = () => {
    return Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  };

  const setup2FA = async () => {
    if (!user) return;

    try {
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();
      
      // Créer ou mettre à jour les paramètres 2FA
      const { data, error } = user && settings ? 
        await supabase
          .from('user_2fa_settings')
          .update({
            secret,
            backup_codes: backupCodes,
            is_enabled: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single()
        :
        await supabase
          .from('user_2fa_settings')
          .insert({
            user_id: user.id,
            secret,
            backup_codes: backupCodes,
            is_enabled: false
          })
          .select()
          .single();

      if (error) throw error;

      setSettings(data);
      
      // Générer l'URL du QR code
      const appName = 'Terex';
      const accountName = user.email || 'user';
      const qrUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(appName)}`;
      setQrCodeUrl(qrUrl);

      toast({
        title: "Configuration 2FA initiée",
        description: "Scannez le QR code avec votre app d'authentification",
        className: "bg-blue-600 text-white border-blue-600",
      });

    } catch (error) {
      console.error('Erreur lors de la configuration 2FA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de configurer l'authentification à deux facteurs",
        variant: "destructive",
      });
    }
  };

  const enable2FA = async () => {
    if (!user || !settings || !verificationCode) return;

    try {
      setIsEnabling(true);
      
      // Dans un vrai app, vérifier le code TOTP ici
      // Pour cette démo, on accepte n'importe quel code de 6 chiffres
      if (!/^\d{6}$/.test(verificationCode)) {
        throw new Error('Code de vérification invalide');
      }

      const { data, error } = await supabase
        .from('user_2fa_settings')
        .update({
          is_enabled: true,
          enabled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      setVerificationCode('');
      setQrCodeUrl('');

      toast({
        title: "2FA Activé",
        description: "L'authentification à deux facteurs a été activée avec succès",
        className: "bg-green-600 text-white border-green-600",
      });

    } catch (error) {
      console.error('Erreur lors de l\'activation 2FA:', error);
      toast({
        title: "Erreur",
        description: "Code de vérification invalide",
        variant: "destructive",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const disable2FA = async () => {
    if (!user || !settings) return;

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .update({
          is_enabled: false,
          enabled_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);

      toast({
        title: "2FA Désactivé",
        description: "L'authentification à deux facteurs a été désactivée",
        className: "bg-orange-600 text-white border-orange-600",
      });

    } catch (error) {
      console.error('Erreur lors de la désactivation 2FA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver l'authentification à deux facteurs",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Code copié dans le presse-papiers",
      className: "bg-blue-600 text-white border-blue-600",
    });
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement des paramètres de sécurité...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-terex-accent" />
            Authentification à Deux Facteurs (2FA)
          </h1>
          <p className="text-gray-400">Renforcez la sécurité de votre compte administrateur</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration 2FA */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Configuration 2FA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Statut 2FA:</span>
              <Badge 
                className={settings?.is_enabled ? 
                  "bg-green-600 text-white" : 
                  "bg-red-600 text-white"
                }
              >
                {settings?.is_enabled ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activé
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Désactivé
                  </>
                )}
              </Badge>
            </div>

            {!settings?.is_enabled && (
              <div className="space-y-4">
                {!qrCodeUrl ? (
                  <Button 
                    onClick={setup2FA}
                    className="w-full bg-terex-accent hover:bg-terex-accent/80"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Configurer l'authentification 2FA
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-terex-gray rounded-lg">
                      <h4 className="text-white font-medium mb-2">1. Scannez ce QR Code</h4>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <QrCode className="w-32 h-32 text-black" />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Utilisez Google Authenticator, Authy ou une autre app compatible TOTP
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code" className="text-gray-300">
                        2. Entrez le code de vérification
                      </Label>
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        maxLength={6}
                      />
                    </div>

                    <Button 
                      onClick={enable2FA}
                      disabled={isEnabling || verificationCode.length !== 6}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isEnabling ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Activer 2FA
                    </Button>
                  </div>
                )}
              </div>
            )}

            {settings?.is_enabled && (
              <Button 
                onClick={disable2FA}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Désactiver 2FA
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Codes de sauvegarde */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Codes de Sauvegarde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.backup_codes && settings.backup_codes.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Conservez ces codes en lieu sûr. Ils vous permettront d'accéder à votre compte si vous perdez votre appareil d'authentification.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {settings.backup_codes.map((code, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-terex-gray p-2 rounded"
                    >
                      <span className="font-mono text-white">{code}</span>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(code)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator className="bg-terex-gray" />
                
                <Button 
                  onClick={setup2FA}
                  variant="outline"
                  className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Régénérer les codes de sauvegarde
                </Button>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                Aucun code de sauvegarde généré. Configurez d'abord l'authentification 2FA.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations de sécurité */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Conseils de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Utilisez une application d'authentification reconnue comme Google Authenticator ou Authy</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Conservez vos codes de sauvegarde dans un lieu sûr, séparé de votre appareil principal</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Ne partagez jamais vos codes 2FA avec qui que ce soit</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Activez 2FA sur tous vos comptes critiques, pas seulement sur Terex</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
