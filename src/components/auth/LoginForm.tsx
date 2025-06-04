
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    onLogin(email, password);
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
            <Tabs defaultValue="login" className="space-y-4">
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
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                  >
                    Se connecter
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
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-white font-medium"
                  >
                    Créer un compte
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
