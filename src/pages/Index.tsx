
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

  // Si l'utilisateur est connecté et veut voir le dashboard
  if (userWithName && showDashboard) {
    return <Dashboard user={userWithName} onLogout={handleBackToHome} />;
  }

  // Sinon, afficher la landing page (même pour les utilisateurs connectés)
  return <PublicHome onGetStarted={handleGetStarted} user={userWithName} onShowDashboard={handleShowDashboard} />;
};

export default Index;
