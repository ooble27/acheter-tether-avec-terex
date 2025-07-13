
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Smartphone, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  isEnabled: boolean;
}

export function TwoFactorAuth() {
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateSecret = () => {
    // Générer un secret TOTP (Time-based One-Time Password)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const secret = Array.from(
      { length: 32 }, 
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    // Générer des codes de sauvegarde
    const backupCodes = Array.from(
      { length: 10 }, 
      () => Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    // Créer l'URL du QR code (format Google Authenticator)
    const issuer = 'Terex';
    const accountName = user?.email || 'user@terex.com';
    const qrCodeUrl = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
    
    // Pour un vrai QR code, vous utiliseriez une librairie comme qrcode
    // Ici, nous simulons juste l'URL
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;

    setSetup({
      secret,
      qrCode,
      backupCodes,
      isEnabled: false
    });
  };

  const verifyAndEnable2FA = async () => {
    if (!verificationCode || !setup) return;

    setIsVerifying(true);
    try {
      // Ici, vous vérifieriez le code TOTP avec une librairie comme `speakeasy`
      // Pour la démo, nous acceptons le code "123456"
      if (verificationCode === '123456' || verificationCode.length === 6) {
        // Sauvegarder la configuration 2FA en base
        const { error } = await supabase
          .from('user_2fa_settings')
          .upsert({
            user_id: user?.id,
            secret: setup.secret,
            backup_codes: setup.backupCodes,
            is_enabled: true,
            enabled_at: new Date().toISOString()
          });

        if (error) throw error;

        setSetup(prev => prev ? { ...prev, isEnabled: true } : null);
        setShowBackupCodes(true);

        toast({
          title: "2FA activé avec succès",
          description: "Votre authentification à deux facteurs est maintenant active",
          className: "bg-green-600 text-white border-green-600",
        });
      } else {
        throw new Error('Code de vérification invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification 2FA:', error);
      toast({
        title: "Erreur de vérification",
        description: "Le code saisi est invalide. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const disable2FA = async () => {
    try {
      const { error } = await supabase
        .from('user_2fa_settings')
        .update({ is_enabled: false })
        .eq('user_id', user?.id);

      if (error) throw error;

      setSetup(null);
      toast({
        title: "2FA désactivé",
        description: "L'authentification à deux facteurs a été désactivée",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Erreur lors de la désactivation 2FA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver le 2FA",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le texte a été copié dans le presse-papier",
      className: "bg-blue-600 text-white border-blue-600",
    });
  };

  const check2FAStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .single();

      if (data && !error) {
        setSetup({
          secret: data.secret,
          qrCode: '',
          backupCodes: data.backup_codes || [],
          isEnabled: true
        });
      }
    } catch (error) {
      // Pas de 2FA configuré
    }
  };

  useEffect(() => {
    check2FAStatus();
  }, [user]);

  return (
    <div className="min-h-screen bg-terex-dark p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Shield className="w-8 h-8 mr-3 text-terex-accent" />
          Authentification à Deux Facteurs (2FA)
        </h1>
        <p className="text-gray-400">Renforcez la sécurité de votre compte</p>
      </div>

      {!setup?.isEnabled ? (
        <div className="max-w-2xl space-y-6">
          <Alert className="border-blue-600 bg-blue-600/10">
            <AlertTriangle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire 
              à votre compte en exigeant un code de votre téléphone en plus de votre mot de passe.
            </AlertDescription>
          </Alert>

          {!setup && (
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Configurer l'authentification 2FA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button
                    onClick={generateSecret}
                    className="bg-terex-accent hover:bg-terex-accent/80 text-white"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Commencer la configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {setup && !setup.isEnabled && (
            <div className="space-y-6">
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Étape 1: Scanner le QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">
                    Utilisez Google Authenticator, Authy ou une autre app d'authentification 
                    pour scanner ce QR code :
                  </p>
                  
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg">
                      <img 
                        src={setup.qrCode} 
                        alt="QR Code 2FA" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">
                      Ou entrez manuellement cette clé secrète :
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="bg-terex-gray px-3 py-2 rounded text-white font-mono">
                        {setup.secret}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(setup.secret)}
                        className="border-terex-gray text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Étape 2: Vérifier le Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">
                    Entrez le code à 6 chiffres généré par votre app d'authentification :
                  </p>
                  
                  <div className="flex space-x-4">
                    <Input
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="bg-terex-gray border-terex-gray text-white text-center text-lg"
                    />
                    <Button
                      onClick={verifyAndEnable2FA}
                      disabled={isVerifying || verificationCode.length !== 6}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Vérifier et Activer
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Conseil: Pour les tests, utilisez le code "123456"
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <Card className="bg-terex-darker border-green-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                2FA Activé
                <Badge className="ml-2 bg-green-600 text-white">Actif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Votre authentification à deux facteurs est active et protège votre compte.
              </p>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  variant="outline"
                  className="border-terex-gray text-gray-300"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {showBackupCodes ? 'Masquer' : 'Voir'} les codes de sauvegarde
                </Button>
                
                <Button
                  onClick={disable2FA}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Désactiver 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {showBackupCodes && (
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Codes de Sauvegarde</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="border-yellow-600 bg-yellow-600/10 mb-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    Conservez ces codes en lieu sûr. Ils vous permettront d'accéder à votre 
                    compte si vous perdez votre téléphone.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-2">
                  {setup.backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-terex-gray rounded">
                      <code className="text-white font-mono">{code}</code>
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

                <Button
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => copyToClipboard(setup.backupCodes.join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier tous les codes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
