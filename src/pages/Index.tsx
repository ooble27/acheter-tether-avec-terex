
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';
import { PublicHome } from '@/components/marketing/PublicHome';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const isAdminDomain = window.location.hostname.includes('admin.');
    
    if (isAdminDomain) {
      navigate('/admin');
    }
  }, [navigate]);

  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  useEffect(() => {
    if (isPWA && !loading) {
      if (!user) {
        navigate('/auth');
      } else {
        setShowDashboard(true);
      }
    }
  }, [isPWA, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Chargement...</div>
      </div>
    );
  }

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

  if (isPWA && userWithName) {
    return <Dashboard user={userWithName} onLogout={handleBackToHome} />;
  }

  if (userWithName && showDashboard && !isPWA) {
    return <Dashboard user={userWithName} onLogout={handleBackToHome} />;
  }

  if (isPWA && !userWithName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Redirection...</div>
      </div>
    );
  }

  return <PublicHome onGetStarted={handleGetStarted} user={userWithName} onShowDashboard={handleShowDashboard} />;
};

export default Index;
