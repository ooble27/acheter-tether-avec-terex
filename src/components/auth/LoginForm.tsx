import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useFastAuth } from '@/hooks/useFastAuth';
import { Mail, Loader2, Zap, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { sendFastLoginEmail, sendFastSignupEmail, loading: fastLoading } = useFastAuth();
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, 'New User');

    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'inscription: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Compte créé !",
        description: "Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.",
        className: "bg-green-600 text-white border-green-600",
      });
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, 'New User');

    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la connexion: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email envoyé !",
        description: "Un lien de connexion a été envoyé. Veuillez vérifier votre boîte de réception.",
        className: "bg-green-600 text-white border-green-600",
      });
    }
    setLoading(false);
  };

  const handleFastAuth = async (type: 'login' | 'signup') => {
    if (!email.trim()) return;

    if (type === 'signup') {
      await sendFastSignupEmail(email);
    } else {
      await sendFastLoginEmail(email);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-terex-accent">Terex</span>
        </h1>
        <p className="text-gray-400">Votre plateforme d'échange USDT</p>
      </div>

      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Connexion</CardTitle>
          <CardDescription className="text-gray-400">
            Choisissez votre méthode de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fast" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-terex-dark">
              <TabsTrigger value="fast" className="data-[state=active]:bg-terex-accent">
                <Zap className="w-4 h-4 mr-2" />
                Connexion rapide
              </TabsTrigger>
              <TabsTrigger value="classic" className="data-[state=active]:bg-terex-accent">
                <Lock className="w-4 h-4 mr-2" />
                Classique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fast" className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-1 text-sm text-green-500 mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Optimisé pour l'Afrique - Email en 30s</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                  disabled={fastLoading}
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleFastAuth('login')}
                  disabled={fastLoading || !isValidEmail(email)}
                  className="w-full bg-terex-accent hover:bg-terex-accent/90"
                >
                  {fastLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Lien de connexion
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleFastAuth('signup')}
                  disabled={fastLoading || !isValidEmail(email)}
                  variant="outline"
                  className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray"
                >
                  {fastLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Créer un compte
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="classic" className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-terex-accent hover:bg-terex-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
              <Button
                onClick={handleMagicLink}
                disabled={loading}
                variant="outline"
                className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Se connecter avec un lien magique
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
