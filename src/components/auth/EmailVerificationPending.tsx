
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, RefreshCw, LogOut } from 'lucide-react';

interface EmailVerificationPendingProps {
  user: User;
}

export function EmailVerificationPending({ user }: EmailVerificationPendingProps) {
  const [isResending, setIsResending] = useState(false);
  const { resendVerification, signOut } = useAuth();
  const { toast } = useToast();

  const handleResendVerification = async () => {
    if (!user.email) return;
    
    setIsResending(true);
    const { error } = await resendVerification(user.email);
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'email de vérification",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email envoyé !",
        description: "Un nouvel email de vérification a été envoyé",
        className: "bg-green-600 text-white border-green-600",
      });
    }
    
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-terex-accent">Terex</span>
          </h1>
          <p className="text-gray-400">Vérification de votre email</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-terex-accent" />
            </div>
            <CardTitle className="text-white text-xl">Vérifiez votre email</CardTitle>
            <CardDescription className="text-gray-400">
              Nous avons envoyé un lien de vérification à <br />
              <span className="text-white font-medium">{user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-400">
              Cliquez sur le lien dans l'email pour activer votre compte.
              Si vous ne voyez pas l'email, vérifiez votre dossier spam.
            </div>
            
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline"
              className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer l'email
                </>
              )}
            </Button>

            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-terex-gray"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
