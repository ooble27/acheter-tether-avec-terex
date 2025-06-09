
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
        console.log('AuthCallback: URL complète:', window.location.href);
        console.log('AuthCallback: Paramètres URL:', Object.fromEntries(searchParams.entries()));
        
        // Récupérer les paramètres de l'URL
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        console.log('AuthCallback: Analyse des paramètres:', {
          type,
          error,
          errorDescription,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken
        });
        
        // Vérifier s'il y a une erreur dans l'URL
        if (error) {
          console.error('AuthCallback: Erreur dans l\'URL:', error, errorDescription);
          
          if (error === 'access_denied') {
            toast({
              title: "Connexion annulée",
              description: "Vous avez annulé la connexion.",
              variant: "destructive",
            });
          } else if (errorDescription?.includes('expired') || error.includes('expired')) {
            toast({
              title: "Lien expiré",
              description: "Le lien de connexion a expiré. Veuillez demander un nouveau lien.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erreur de connexion",
              description: errorDescription || error,
              variant: "destructive",
            });
          }
          navigate('/');
          return;
        }
        
        // Si nous avons des tokens dans l'URL, essayer de les utiliser
        if (accessToken && refreshToken) {
          console.log('AuthCallback: Tokens trouvés dans l\'URL, tentative de session...');
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (sessionError) {
            console.error('AuthCallback: Erreur lors de la création de session:', sessionError);
            toast({
              title: "Erreur de session",
              description: "Impossible de créer la session. Le lien a peut-être expiré.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
          
          if (data.session) {
            console.log('AuthCallback: Session créée avec succès');
            
            // Marquer la session comme active pour PWA avec plus d'informations
            localStorage.setItem('terex-session-active', 'true');
            localStorage.setItem('terex-last-session-update', Date.now().toString());
            localStorage.setItem('terex-auth-method', 'email-link');
            
            toast({
              title: "Connexion réussie !",
              description: "Vous êtes maintenant connecté à Terex.",
              className: "bg-green-600 text-white border-green-600",
            });

            // Attendre un peu puis rediriger et donner des instructions PWA
            setTimeout(() => {
              toast({
                title: "💡 Astuce PWA",
                description: "Retournez maintenant à l'app Terex sur votre écran d'accueil pour une session synchronisée !",
                className: "bg-blue-600 text-white border-blue-600",
                duration: 8000,
              });
            }, 2000);
            
            navigate('/');
            return;
          }
        }
        
        // Récupérer la session actuelle
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthCallback: Erreur récupération session:', sessionError);
          toast({
            title: "Erreur d'authentification",
            description: sessionError.message,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log('AuthCallback: Données de session:', data);

        // Si c'est une confirmation d'email (première inscription)
        if (type === 'signup' && data.session) {
          console.log('AuthCallback: Email confirmé lors de l\'inscription');
          
          // Marquer la session comme active pour PWA
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-auth-method', 'signup-confirmation');
          
          toast({
            title: "Email confirmé !",
            description: "Votre compte a été activé avec succès.",
            className: "bg-green-600 text-white border-green-600",
          });
          
          setTimeout(() => {
            toast({
              title: "💡 Conseil",
              description: "Ouvrez maintenant l'app Terex depuis votre écran d'accueil !",
              className: "bg-blue-600 text-white border-blue-600",
              duration: 6000,
            });
          }, 2000);
          
          navigate('/');
          return;
        }

        // Si c'est un Magic Link (connexion par email)
        if (type === 'magiclink' && data.session) {
          console.log('AuthCallback: Magic Link utilisé avec succès');
          
          // Marquer la session comme active pour PWA
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-auth-method', 'magic-link');
          
          toast({
            title: "Connexion réussie !",
            description: "Vous êtes maintenant connecté.",
            className: "bg-green-600 text-white border-green-600",
          });
          
          setTimeout(() => {
            toast({
              title: "🚀 Retournez à l'app Terex",
              description: "Ouvrez l'app Terex depuis votre écran d'accueil pour continuer !",
              className: "bg-blue-600 text-white border-blue-600",
              duration: 8000,
            });
          }, 2000);
          
          navigate('/');
          return;
        }

        // Si nous avons une session active
        if (data.session) {
          console.log('AuthCallback: Session active détectée');
          
          // Marquer la session comme active pour PWA
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-auth-method', 'existing-session');
          
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue sur Terex.",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
          return;
        }

        // Aucune session - rediriger vers login
        console.log('AuthCallback: Aucune session trouvée');
        toast({
          title: "Lien invalide",
          description: "Le lien de connexion est invalide ou a expiré. Veuillez demander un nouveau lien.",
          variant: "destructive",
        });
        navigate('/');

      } catch (error) {
        console.error('AuthCallback: Erreur inattendue:', error);
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
        <div className="text-gray-400 text-sm mt-2">Vérification du lien de connexion...</div>
        <div className="text-gray-400 text-xs mt-4 max-w-xs mx-auto">
          💡 Astuce : Une fois connecté, retournez à l'app Terex sur votre écran d'accueil pour une expérience optimale
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
