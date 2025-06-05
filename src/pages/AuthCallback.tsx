
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: "Erreur de vérification",
            description: "Impossible de vérifier votre email. Veuillez réessayer.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (data.session) {
          toast({
            title: "Email vérifié !",
            description: "Votre compte a été activé avec succès",
            className: "bg-green-600 text-white border-green-600",
          });
          navigate('/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terex-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Vérification de votre email...</div>
          <div className="text-gray-400 text-sm mt-2">Veuillez patienter</div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
