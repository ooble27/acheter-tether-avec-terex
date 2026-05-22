import { useAuth } from '@/contexts/AuthContext';
import { BusinessDashboard } from '@/components/business/BusinessDashboard';
import { BusinessLanding } from '@/components/marketing/BusinessLanding';

const BusinessPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#3B968F] flex items-center justify-center">
            <span className="text-black font-black text-xs">TB</span>
          </div>
          <p className="text-[#666] text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return <BusinessLanding />;

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
