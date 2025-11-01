
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
    <div className="min-h-screen w-full bg-terex-dark">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0a2f2f] via-[#0d1f1f] to-[#000000]">
          {/* Subtle background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-terex-accent/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-terex-accent-light/5 rounded-full blur-[100px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-start p-16 max-w-xl">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-12">
                <img 
                  src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" 
                  alt="Terex Logo" 
                  className="w-16 h-16 drop-shadow-2xl"
                />
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-terex-accent to-terex-accent-light bg-clip-text text-transparent">
                    TEREX
                  </h1>
                  <p className="text-xs font-semibold text-terex-accent/70 uppercase tracking-widest">Teranga Exchange</p>
                </div>
              </div>

              <h2 className="text-5xl font-light leading-tight">
                <span className="text-terex-accent font-normal">Rejoignez</span>
                <br />
                <span className="text-terex-accent font-normal">Terex,</span>
                <br />
                <span className="text-white">la plateforme</span>
                <br />
                <span className="text-white">d'échange USDT</span>
                <br />
                <span className="text-white">en Afrique</span>
              </h2>

              <div className="space-y-4 text-gray-400 text-sm pt-8">
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-terex-accent"></span>
                  Transactions rapides et sécurisées
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-terex-accent"></span>
                  Transferts internationaux simplifiés
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-terex-accent"></span>
                  Support client dédié 24/7
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex flex-col bg-terex-dark">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-terex-gray">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" 
                alt="Terex Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-black text-terex-accent">TEREX</h1>
                <p className="text-[10px] text-terex-accent/70 uppercase tracking-wider">Teranga Exchange</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="flex gap-8 border-b border-terex-gray pb-1">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`text-sm font-medium pb-3 transition-colors relative ${
                      activeTab === 'login'
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Se connecter
                    {activeTab === 'login' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terex-accent"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`text-sm font-medium pb-3 transition-colors relative ${
                      activeTab === 'register'
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    S'inscrire
                    {activeTab === 'register' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terex-accent"></div>
                    )}
                  </button>
                </div>
              
                <TabsContent value="login" className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-light text-white mb-2">CONNEXION</h2>
                    <p className="text-gray-400 text-sm">Entrez vos identifiants pour vous connecter.</p>
                  </div>

                  <form onSubmit={handlePasswordLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 text-sm font-normal">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300 text-sm font-normal">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0 pr-10"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-terex-accent transition-colors"
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
                      className="w-full h-14 bg-gray-300 hover:bg-white text-black font-semibold rounded-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        'CONTINUER'
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                      Vous n'avez pas de compte?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-terex-accent hover:underline font-medium"
                      >
                        S'inscrire
                      </button>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-light text-white mb-2">CRÉER VOTRE COMPTE</h2>
                    <p className="text-gray-400 text-sm">Entrez votre email pour commencer.</p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300 text-sm font-normal">
                        Nom complet
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Votre nom complet"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-register" className="text-gray-300 text-sm font-normal">
                        Email
                      </Label>
                      <Input
                        id="email-register"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-register" className="text-gray-300 text-sm font-normal">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password-register"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0 pr-10"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-terex-accent transition-colors"
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

                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('referral-code-input');
                        if (input) input.classList.toggle('hidden');
                      }}
                      className="text-sm text-gray-400 hover:text-terex-accent transition-colors underline"
                    >
                      Avez-vous un code de parrainage?
                    </button>

                    <div id="referral-code-input" className="hidden space-y-2">
                      <Label htmlFor="referral-code" className="text-gray-300 text-sm font-normal">
                        Code de parrainage
                      </Label>
                      <Input
                        id="referral-code"
                        type="text"
                        placeholder="TEREX-XXXXXXXX"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="bg-transparent border-0 border-b border-gray-700 text-white placeholder:text-gray-600 rounded-none focus:border-terex-accent focus:ring-0 h-12 px-0"
                        disabled={isLoading}
                      />
                    </div>

                    {password && (
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className={passwordRequirements.minLength ? 'text-green-400' : ''}>
                          • Au moins 6 caractères
                        </div>
                        <div className={passwordRequirements.hasUppercase ? 'text-green-400' : ''}>
                          • Une lettre majuscule
                        </div>
                        <div className={passwordRequirements.hasLowercase ? 'text-green-400' : ''}>
                          • Une lettre minuscule
                        </div>
                        <div className={passwordRequirements.hasNumber ? 'text-green-400' : ''}>
                          • Un chiffre
                        </div>
                        <div className={passwordRequirements.hasSpecialChar ? 'text-green-400' : ''}>
                          • Un caractère spécial
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      En continuant, vous acceptez nos{' '}
                      <a href="/terms" className="text-terex-accent hover:underline">Conditions d'utilisation</a>
                      {' '}et{' '}
                      <a href="/privacy" className="text-terex-accent hover:underline">Politique de confidentialité</a>.
                    </p>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gray-300 hover:bg-white text-black font-semibold rounded-lg transition-all duration-300"
                      disabled={isLoading || !isPasswordValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Création du compte...
                        </>
                      ) : (
                        'CONTINUER'
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                      Vous avez déjà un compte?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-terex-accent hover:underline font-medium"
                      >
                        Se connecter
                      </button>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-terex-gray">
            <p className="text-center text-sm text-gray-500">
              Propulsé par{' '}
              <span className="text-terex-accent font-semibold">Terex</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
