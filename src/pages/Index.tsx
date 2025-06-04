
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulation de l'authentification
    setUser({ email, name: email.split('@')[0] });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
