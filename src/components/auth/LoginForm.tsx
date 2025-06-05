
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Info, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
  };

  const passwordRequirements = validatePassword(password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false // Ne pas créer d'utilisateur automatiquement
        }
      });

      if (error) {
        if (error.message.includes("User not found") || error.message.includes("Invalid email")) {
          toast({
            title: "Compte introuvable",
            description: "Aucun compte n'existe avec cet email. Veuillez créer un compte d'abord.",
            variant: "destructive",
          });
          setActiveTab('register');
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setMagicLinkSent(true);
        toast({
          title: "Email envoyé !",
          description: "Vérifiez votre boîte mail pour vous connecter. Le lien est valable 5 minutes.",
          className: "bg-green-600 text-white border-green-600",
        });
      }
    } catch (error) {
      console.error('Erreur Magic Link:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, name);
      
      if (signUpError) {
        if (signUpError.message.includes("User already registered") || 
            signUpError.message.includes("already registered")) {
          toast({
            title: "Email déjà utilisé",
            description: "Ce mail est déjà utilisé. Utilisez la connexion par email.",
            variant: "destructive",
          });
          setActiveTab('login');
        } else {
          toast({
            title: "Erreur d'inscription",
            description: signUpError.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Vérifiez votre email pour activer votre compte",
          className: "bg-green-600 text-white border-green-600",
        });
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-terex-accent">Terex</span>
            </h1>
            <p className="text-gray-400">Email de connexion envoyé</p>
          </div>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-terex-accent/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-terex-accent" />
              </div>
              <CardTitle className="text-2xl text-white">Vérifiez votre email</CardTitle>
              <CardDescription className="text-gray-400">
                Nous avons envoyé un lien de connexion à <strong className="text-white">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-terex-gray/50 p-4 rounded-lg border border-terex-gray-light">
                <p className="text-sm text-gray-300 text-center">
                  ⏰ Le lien est valable pendant <strong className="text-terex-accent">5 minutes</strong>
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => handleMagicLinkLogin({ preventDefault: () => {} } as React.FormEvent)}
                  className="w-full gradient-button text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Renvoi en cours...
                    </>
                  ) : (
                    'Renvoyer le lien'
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full bg-transparent border-terex-gray text-white hover:bg-terex-gray"
                  onClick={() => {
                    setMagicLinkSent(false);
                    setEmail('');
                  }}
                >
                  Utiliser un autre email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-terex-accent">Terex</span>
          </h1>
          <p className="text-gray-400">Plateforme d'échange USDT et transferts internationaux</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Bienvenue</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Connectez-vous ou créez votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-terex-gray">
                <TabsTrigger value="login" className="data-[state=active]:bg-terex-accent">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-terex-accent">
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="bg-terex-gray/50 p-3 rounded-md border border-terex-gray-light">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-terex-accent" />
                      <span className="text-sm font-medium text-white">Connexion simplifiée :</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Entrez votre email et recevez un lien de connexion sécurisé. 
                      Plus besoin de retenir votre mot de passe !
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi du lien...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Recevoir le lien de connexion
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Nom complet</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register" className="text-white">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register" className="text-white">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password-register"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500 pr-10"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="bg-terex-gray/50 p-3 rounded-md border border-terex-gray-light">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-terex-accent" />
                        <span className="text-sm font-medium text-white">Exigences du mot de passe :</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>•</span>
                          <span>Au moins 6 caractères</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>•</span>
                          <span>Une lettre majuscule</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>•</span>
                          <span>Une lettre minuscule</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>•</span>
                          <span>Un chiffre</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
                          <span>•</span>
                          <span>Un caractère spécial (!@#$%^&*...)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/20 p-3 rounded-md border border-blue-600/30">
                    <p className="text-xs text-blue-300">
                      <strong>Note :</strong> Le mot de passe n'est requis que pour la création du compte. 
                      Après inscription, vous vous connecterez uniquement avec votre email.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                    disabled={isLoading || !isPasswordValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      'Créer un compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
