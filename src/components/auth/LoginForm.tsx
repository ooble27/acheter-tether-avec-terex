

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Essayer de se connecter avec un mot de passe manifestement incorrect
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: '___invalid_password_check___'
      });
      
      // Si l'erreur est "Invalid login credentials", l'email existe
      if (error && error.message === "Invalid login credentials") {
        return true;
      }
      
      // Si une autre erreur ou pas d'erreur, considérer que l'email n'existe pas
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Erreur de connexion",
            description: error.message === "Invalid login credentials" 
              ? "Email ou mot de passe incorrect" 
              : error.message,
            variant: "destructive",
          });
        }
      } else {
        // Vérifier si l'email existe avant l'inscription
        console.log('Vérification de l\'email:', email);
        
        const emailExists = await checkIfEmailExists(email);
        
        if (emailExists) {
          console.log('Email existe déjà détecté');
          toast({
            title: "Erreur d'inscription",
            description: "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Si l'email n'existe pas, procéder à l'inscription
        console.log('Tentative d\'inscription pour:', email);
        
        const { error } = await signUp(email, password, name);
        
        if (error) {
          console.log('Erreur inscription:', error);
          
          let errorMessage = error.message;
          
          // Gestion des erreurs spécifiques de Supabase
          if (error.message.includes("User already registered") || 
              error.message.includes("already registered") ||
              error.message.includes("already exists") ||
              error.message.includes("Email already in use") ||
              error.message.includes("email already taken") ||
              error.message.includes("duplicate") ||
              error.code === "email_address_invalid" ||
              error.code === "user_already_exists" ||
              error.code === "signup_disabled" ||
              error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("already")) {
            errorMessage = "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.";
          } else if (error.message.includes("Password should be at least")) {
            errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
          } else if (error.message.includes("Invalid email")) {
            errorMessage = "Format d'email invalide.";
          } else if (error.message.includes("weak password")) {
            errorMessage = "Le mot de passe est trop faible. Utilisez au moins 6 caractères.";
          }
          
          toast({
            title: "Erreur d'inscription",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        
        // Message de succès seulement si pas d'erreur
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
                <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
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
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      required
                      disabled={isLoading}
                    />
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
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
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
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                    disabled={isLoading}
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
