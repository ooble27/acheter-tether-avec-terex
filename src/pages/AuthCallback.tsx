
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const type = searchParams.get('type');
        
        // Gérer le callback d'authentification
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur callback auth:', error);
          toast({
            title: "Erreur d'authentification",
            description: error.message,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Si c'est une réinitialisation de mot de passe
        if (type === 'recovery' && data.session) {
          console.log('Redirection vers réinitialisation mot de passe');
          navigate('/password-reset');
          return;
        }

        // Si c'est une confirmation d'email
        if (type === 'signup' && data.session) {
          console.log('Email confirmé, redirection vers dashboard');
          toast({
            title: "Email confirmé !",
            description: "Votre compte a été activé avec succès.",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
          return;
        }

        // Si c'est une session normale
        if (data.session) {
          console.log('Session active, redirection vers dashboard');
          navigate('/');
          return;
        }

        // Aucune session - rediriger vers login
        console.log('Aucune session, redirection vers login');
        navigate('/');

      } catch (error) {
        console.error('Erreur inattendue:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen bg-terex-dark flex items-center justify-center">
      <div className="text-white text-lg">Vérification en cours...</div>
    </div>
  );
};

export default AuthCallback;
