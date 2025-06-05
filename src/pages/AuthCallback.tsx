
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
        console.log('Callback URL params:', Object.fromEntries(searchParams.entries()));
        
        // Récupérer les paramètres de l'URL
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        console.log('Type de callback:', type);
        console.log('Access token présent:', !!accessToken);
        
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

        console.log('Session data:', data);

        // Si c'est une réinitialisation de mot de passe ET qu'il y a un token d'accès
        if (type === 'recovery' || (accessToken && refreshToken)) {
          console.log('Redirection vers réinitialisation mot de passe');
          
          // Vérifier qu'il y a bien une session active pour la réinitialisation
          if (data.session) {
            toast({
              title: "Lien de réinitialisation valide",
              description: "Vous pouvez maintenant créer un nouveau mot de passe.",
              className: "bg-blue-600 text-white border-blue-600",
            });
            navigate('/password-reset');
            return;
          } else {
            toast({
              title: "Lien expiré",
              description: "Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
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
