
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFastAuth } from '@/hooks/useFastAuth';
import { Mail, Loader2, Zap } from 'lucide-react';

export function FastLoginForm() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { sendFastLoginEmail, sendFastSignupEmail, loading } = useFastAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    if (mode === 'signup') {
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
        <p className="text-gray-400">Connexion ultra-rapide par email</p>
      </div>

      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-terex-accent" />
          </div>
          <CardTitle className="text-white text-xl">
            {mode === 'signup' ? 'Créer un compte' : 'Se connecter'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === 'signup' 
              ? 'Recevez votre lien d\'activation en quelques secondes'
              : 'Recevez votre lien de connexion instantanément'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                disabled={loading}
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading || !isValidEmail(email)}
              className="w-full bg-terex-accent hover:bg-terex-accent/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {mode === 'signup' ? 'Créer mon compte' : 'Envoyer le lien'}
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-gray-400 hover:text-white"
              disabled={loading}
            >
              {mode === 'signup' 
                ? 'Déjà un compte ? Se connecter'
                : 'Nouveau ? Créer un compte'
              }
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Zap className="w-3 h-3 text-green-500" />
              <span>Livraison optimisée pour l'Afrique</span>
            </div>
            <p>Emails reçus en moins de 30 secondes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
