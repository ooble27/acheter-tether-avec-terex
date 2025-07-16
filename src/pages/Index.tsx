
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';
import { PublicHome } from '@/components/marketing/PublicHome';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Vérifier si on est sur le sous-domaine admin
    const isAdminDomain = window.location.hostname.includes('admin.');
    
    if (isAdminDomain) {
      // Rediriger vers la route admin
      navigate('/admin');
    }
  }, [navigate]);

  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  useEffect(() => {
    // Si on est en mode PWA et pas de chargement
    if (isPWA && !loading) {
      if (!user) {
        // Pas d'utilisateur connecté, rediriger vers l'authentification
        navigate('/auth');
      } else {
        // Utilisateur connecté, afficher directement le dashboard
        setShowDashboard(true);
      }
    }
  }, [isPWA, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  // Créer l'objet utilisateur avec le nom extrait des métadonnées
  const userWithName = user ? {
    email: user.email || '',
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  } : null;

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToHome = () => {
    setShowDashboard(false);
  };

  // Si on est en mode PWA et utilisateur connecté, afficher le dashboard directement
  if (isPWA && userWithName) {
    return <Dashboard user={userWithName} onLogout={handleBackToHome} />;
  }

  // Si l'utilisateur est connecté et veut voir le dashboard (mode web)
  if (userWithName && showDashboard && !isPWA) {
    return <Dashboard user={userWithName} onLogout={handleBackToHome} />;
  }

  // Si on est en mode PWA sans utilisateur, ne pas afficher la landing page
  // (la redirection vers /auth se fera via l'useEffect ci-dessus)
  if (isPWA && !userWithName) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Redirection...</div>
      </div>
    );
  }

  // Sinon, afficher la landing page (mode navigateur web normal)
  return <PublicHome onGetStarted={handleGetStarted} user={userWithName} onShowDashboard={handleShowDashboard} />;
};

export default Index;
