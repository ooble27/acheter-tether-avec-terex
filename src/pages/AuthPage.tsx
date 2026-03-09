
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user && !loading) {
      // Check if there's a pending buy order from the Hero form
      const pendingBuy = localStorage.getItem('pendingBuyOrder');
      if (pendingBuy) {
        navigate('/dashboard', { state: { action: 'buy' } });
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <LoginForm />
    </div>
  );
};

export default AuthPage;
