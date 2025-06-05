
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { EmailVerificationPending } from '@/components/auth/EmailVerificationPending';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, session, loading } = useAuth();

  console.log('Index: Auth state:', { user: !!user, session: !!session, loading })

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  // User is logged in but email not verified
  if (user && !user.email_confirmed_at) {
    console.log('Index: User logged in but email not verified')
    return (
      <div className="min-h-screen bg-terex-dark">
        <EmailVerificationPending user={user} />
      </div>
    );
  }

  // User is logged in and email is verified
  if (user && session) {
    console.log('Index: User fully authenticated, showing dashboard')
    const userData = {
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'
    };
    
    return <Dashboard user={userData} onLogout={() => {}} />;
  }

  // User is not logged in - show login form
  console.log('Index: User not authenticated, showing login form')
  return (
    <div className="min-h-screen bg-terex-dark">
      <LoginForm />
    </div>
  );
};

export default Index;
