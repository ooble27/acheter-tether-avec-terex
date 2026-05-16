import { useAuth } from '@/contexts/AuthContext';
import { BusinessDashboard } from '@/components/business/BusinessDashboard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BusinessPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#3B968F] flex items-center justify-center">
            <span className="text-white font-black text-xs">TB</span>
          </div>
          <p className="text-gray-600 text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userData = {
    id: user.id,
    email: user.email || '',
    name:
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Utilisateur',
  };

  return <BusinessDashboard user={userData} />;
};

export default BusinessPage;
