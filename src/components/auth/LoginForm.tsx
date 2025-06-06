
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

interface UserData {
  email: string;
  name: string;
}

interface LoginFormProps {
  onUserData?: (userData: UserData) => void;
}

export function LoginForm({ onUserData }: LoginFormProps = {}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data: { user }, error } = await signIn(email, password);
        
        if (error) {
          throw error;
        }

        if (user) {
          const userData = {
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
          };
          
          onUserData?.(userData);
          
          toast({
            title: "Connexion réussie !",
            description: `Bienvenue ${userData.name}`,
          });
        }
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Erreur",
            description: "Les mots de passe ne correspondent pas",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, {
          full_name: fullName,
          phone: phoneNumber
        });
        
        if (error) {
          throw error;
        }

        toast({
          title: "Inscription réussie !",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Erreur d\'authentification:', error);
      
      let errorMessage = "Une erreur est survenue";
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "Cet email est déjà utilisé";
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Adresse email invalide";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-terex-dark flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Header Style Binance */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative logo-glow">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-14 h-14 rounded-xl shadow-2xl"
              />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="terex-brand">TEREX</span>
              </h1>
              <p className="text-xs font-semibold text-terex-accent/80 uppercase tracking-wider">
                Teranga Exchange
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            {isLogin ? 'Connectez-vous à votre plateforme de trading' : 'Créez votre compte pour commencer'}
          </p>
        </div>

        <Card className="bg-terex-darker border-terex-gray shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-terex-accent to-transparent flex-1"></div>
              <span className="text-terex-accent font-medium px-4 text-sm">
                {isLogin ? 'Connexion' : 'Inscription'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-terex-accent to-transparent flex-1"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Nom complet"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400 focus:border-terex-accent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-button text-white font-semibold py-6 text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Connexion...' : 'Inscription...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Se connecter' : 'S\'inscrire'
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-terex-accent transition-colors"
              >
                {isLogin ? (
                  <>Pas encore de compte ? <span className="text-terex-accent font-medium">S'inscrire</span></>
                ) : (
                  <>Déjà un compte ? <span className="text-terex-accent font-medium">Se connecter</span></>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
