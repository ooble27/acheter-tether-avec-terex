
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
          description: "L'email ou le mot de passe que vous avez saisi est incorrect.",
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
          title: "Erreur de connexion",
          description: "Impossible de se connecter. Vérifiez vos identifiants.",
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
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-terex-accent-light/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terex-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-terex-accent via-terex-accent-light to-terex-accent rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-4 p-5 bg-gradient-to-br from-terex-darker/90 to-terex-gray/50 rounded-2xl border border-terex-accent/30 backdrop-blur-xl shadow-2xl">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" 
                      alt="Terex Logo" 
                      className="w-14 h-14 drop-shadow-2xl animate-float"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-4xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-terex-accent via-terex-accent-light to-terex-accent bg-clip-text text-transparent drop-shadow-lg">
                        TEREX
                      </span>
                    </h1>
                    <p className="text-xs font-semibold text-terex-accent/80 uppercase tracking-widest">Teranga Exchange</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-lg font-light">Votre passerelle crypto en Afrique</p>
              <p className="text-gray-500 text-sm mt-2">Échange USDT • Transferts internationaux • Sécurisé</p>
            </div>
          </div>

          <Card className="bg-terex-darker/80 border-terex-accent/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-3xl text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-bold">
                Bienvenue
              </CardTitle>
              <CardDescription className="text-center text-gray-400 text-base">
                Connectez-vous ou créez votre compte pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-terex-gray/50 p-1 rounded-xl backdrop-blur-sm border border-terex-accent/10">
                  <TabsTrigger 
                    value="login" 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-terex-accent data-[state=active]:to-terex-accent-light data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-terex-accent data-[state=active]:to-terex-accent-light data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Inscription
                  </TabsTrigger>
                </TabsList>
              
              <TabsContent value="login" className="space-y-6 animate-fade-in">
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent to-terex-accent-light rounded-full"></span>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent to-terex-accent-light rounded-full"></span>
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl pr-12 backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-terex-accent transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent-light hover:to-terex-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-terex-accent/50 transition-all duration-300 hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-6 animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent to-terex-accent-light rounded-full"></span>
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom complet"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email-register" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent to-terex-accent-light rounded-full"></span>
                      Email
                    </Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="password-register" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent to-terex-accent-light rounded-full"></span>
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password-register"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl pr-12 backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-terex-accent transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="bg-gradient-to-br from-terex-gray/40 to-terex-darker/40 p-4 rounded-xl border border-terex-accent/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-terex-accent/20 rounded-lg">
                            <Info className="h-4 w-4 text-terex-accent" />
                          </div>
                          <span className="text-sm font-semibold text-white">Sécurité du mot de passe</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className={`flex items-center gap-2.5 transition-colors ${passwordRequirements.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.minLength ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span>Au moins 6 caractères</span>
                          </div>
                          <div className={`flex items-center gap-2.5 transition-colors ${passwordRequirements.hasUppercase ? 'text-green-400' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span>Une lettre majuscule</span>
                          </div>
                          <div className={`flex items-center gap-2.5 transition-colors ${passwordRequirements.hasLowercase ? 'text-green-400' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span>Une lettre minuscule</span>
                          </div>
                          <div className={`flex items-center gap-2.5 transition-colors ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span>Un chiffre</span>
                          </div>
                          <div className={`flex items-center gap-2.5 transition-colors ${passwordRequirements.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <span>Un caractère spécial</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="referral-code" className="text-white font-medium text-base flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-terex-accent/50 to-terex-accent-light/50 rounded-full"></span>
                      Code de parrainage 
                      <span className="text-gray-500 text-sm font-normal">(optionnel)</span>
                    </Label>
                    <Input
                      id="referral-code"
                      type="text"
                      placeholder="TEREX-XXXXXXXX"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="bg-terex-gray/50 border-terex-accent/20 text-white placeholder:text-gray-500 h-12 rounded-xl backdrop-blur-sm focus:border-terex-accent focus:ring-2 focus:ring-terex-accent/20 transition-all"
                      disabled={isLoading}
                    />
                    <p className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-terex-accent mt-0.5">💡</span>
                      <span>Bénéficiez d'avantages en entrant un code de parrainage</span>
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent-light hover:to-terex-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-terex-accent/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={isLoading || !isPasswordValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
