
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';
import { PublicHome } from '@/components/marketing/PublicHome';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  // Redirection automatique vers dashboard si utilisateur connecté
  useEffect(() => {
    if (!loading && user) {
      // Utilisateur connecté -> toujours rediriger vers dashboard
      // Que ce soit en PWA ou navigateur web
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!loading && !user && isPWA) {
      // Pas d'utilisateur en PWA -> rediriger vers auth
      navigate('/auth');
    }
  }, [user, loading, navigate, isPWA]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  // Si utilisateur connecté, afficher un état de redirection
  if (user) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Redirection vers le dashboard...</div>
      </div>
    );
  }

  // Si on est en PWA sans utilisateur
  if (isPWA && !user) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Redirection...</div>
      </div>
    );
  }

  // Sinon, afficher la landing page (utilisateur non connecté en mode web)
  const handleGetStarted = () => {
    navigate('/auth');
  };

  return <PublicHome onGetStarted={handleGetStarted} user={null} onShowDashboard={() => {}} />;
};

export default Index;
