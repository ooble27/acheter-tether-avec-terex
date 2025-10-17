
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Connexion par mot de passe pour:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "✅ Connexion réussie !",
        description: "Vous êtes maintenant connecté à Terex.",
        className: "bg-green-600 text-white border-green-600",
      });

    } catch (error: any) {
      console.error('Erreur connexion par mot de passe:', error);
      if (error.message.includes("Invalid login credentials") || 
          error.message.includes("Email not confirmed")) {
        toast({
          title: "Identifiants incorrects",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      } else if (error.message.includes("For security purposes")) {
        toast({
          title: "Trop de tentatives",
          description: "Veuillez attendre quelques minutes avant de réessayer.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error: signUpError, data } = await signUp(email, password, name, referralCode);
      
      if (signUpError) {
        if (signUpError.message.includes("User already registered") || 
            signUpError.message.includes("already registered") ||
            signUpError.message.includes("already been registered")) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà enregistré. Veuillez vous connecter.",
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
        // Vérifier si l'utilisateur existe déjà (identities vide = email déjà utilisé)
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà enregistré. Veuillez vous connecter.",
            variant: "destructive",
          });
          setActiveTab('login');
        } else {
          toast({
            title: "Inscription réussie !",
            description: "Vérifiez votre email pour activer votre compte",
            className: "bg-green-600 text-white border-green-600",
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      
      // Détecter si c'est une erreur liée à un utilisateur existant
      if (error?.message?.includes("duplicate") || 
          error?.message?.includes("unique") ||
          error?.message?.includes("already")) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré. Veuillez vous connecter.",
          variant: "destructive",
        });
        setActiveTab('login');
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-terex-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative flex items-center gap-4 p-4 bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 rounded-2xl border border-terex-accent/20 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" 
                  alt="Terex Logo" 
                  className="w-12 h-12 drop-shadow-lg"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-lg blur opacity-60"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight text-white">
                  <span className="bg-gradient-to-r from-terex-accent to-terex-accent/80 bg-clip-text text-transparent">
                    TEREX
                  </span>
                </h1>
                <p className="text-xs font-medium text-terex-accent/70 uppercase tracking-wider">Teranga Exchange</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400">Plateforme d'échange USDT et transferts internationaux</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray backdrop-blur-sm">
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
                <form onSubmit={handlePasswordLogin} className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500 pr-10"
                        required
                        disabled={isLoading}
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
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
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

                  <div className="space-y-2">
                    <Label htmlFor="referral-code" className="text-white">
                      Code de parrainage <span className="text-gray-500 text-sm">(optionnel)</span>
                    </Label>
                    <Input
                      id="referral-code"
                      type="text"
                      placeholder="TEREX-XXXXXXXX"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                      Si vous avez été parrainé, entrez le code ici pour bénéficier d'avantages
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
