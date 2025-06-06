
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, LogIn, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Vérifier si l'utilisateur a les droits admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id);

        const userRoles = roles?.map(r => r.role) || [];
        const hasAdminAccess = userRoles.includes('admin') || userRoles.includes('kyc_reviewer');

        if (!hasAdminAccess) {
          setError('Accès refusé : privilèges administrateur requis');
          await supabase.auth.signOut();
          return;
        }

        // Connexion réussie avec droits admin
        console.log('Connexion admin réussie');
      }
    } catch (error: any) {
      setError('Erreur de connexion : ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-terex-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">TEREX Admin</h1>
          <p className="text-gray-400 mt-2">Portail d'administration sécurisé</p>
        </div>

        {/* Login Form */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white">Connexion Administrateur</CardTitle>
            <CardDescription className="text-gray-400">
              Accès réservé aux utilisateurs autorisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email administrateur
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@terangaexchange.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-terex-accent hover:bg-terex-accent/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 Teranga Exchange - Portail Administrateur</p>
          <p className="mt-1">Accès sécurisé et chiffré</p>
        </div>
      </div>
    </div>
  );
}
