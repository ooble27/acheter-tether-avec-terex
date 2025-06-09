import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';
import { PublicHome } from '@/components/marketing/PublicHome';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
    // Faire défiler vers le composant de connexion ou déclencher l'ouverture du modal
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
      loginForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Si l'utilisateur est connecté, afficher le dashboard
  if (userWithName) {
    return <Dashboard user={userWithName} onLogout={() => {}} />;
  }

  // Sinon, afficher la landing page publique avec le formulaire de connexion
  return (
    <div>
      <PublicHome onGetStarted={handleGetStarted} />
      <div className="login-form bg-terex-darker py-20">
        <div className="max-w-md mx-auto px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
