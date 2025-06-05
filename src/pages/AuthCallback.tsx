
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
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        console.log('Type de callback:', type);
        console.log('Error:', error);
        
        // Vérifier s'il y a une erreur dans l'URL
        if (error) {
          console.error('Erreur dans l\'URL:', error, errorDescription);
          toast({
            title: "Erreur d'authentification",
            description: errorDescription || error,
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Récupérer la session actuelle
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erreur callback auth:', sessionError);
          toast({
            title: "Erreur d'authentification",
            description: sessionError.message,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log('Session data:', data);

        // Si c'est une confirmation d'email (première inscription)
        if (type === 'signup' && data.session) {
          console.log('Email confirmé lors de l\'inscription, redirection vers dashboard');
          toast({
            title: "Email confirmé !",
            description: "Votre compte a été activé avec succès.",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
          return;
        }

        // Si c'est un Magic Link (connexion par email)
        if (type === 'magiclink' && data.session) {
          console.log('Magic Link utilisé, redirection vers dashboard');
          toast({
            title: "Connexion réussie !",
            description: "Vous êtes maintenant connecté.",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
          return;
        }

        // Si c'est une session normale (token dans l'URL)
        if (data.session) {
          console.log('Session active, redirection vers dashboard');
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue sur Terex.",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
          return;
        }

        // Aucune session - rediriger vers login
        console.log('Aucune session, redirection vers login');
        toast({
          title: "Lien expiré",
          description: "Le lien de connexion a expiré. Veuillez demander un nouveau lien.",
          variant: "destructive",
        });
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
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terex-accent mx-auto mb-4"></div>
        <div className="text-white text-lg">Connexion en cours...</div>
      </div>
    </div>
  );
};

export default AuthCallback;
