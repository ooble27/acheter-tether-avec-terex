
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { CryptoPrices } from '@/components/home/CryptoPrices';
import { CryptoNews } from '@/components/home/CryptoNews';

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
      <div className="min-h-screen bg-terex-dark">
        <LoginForm onLogin={handleLogin} />
        
        {/* Section des fonctionnalités crypto en bas de la page */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <CryptoPrices />
            <CryptoNews />
          </div>
          
          {/* Footer avec informations */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Données en temps réel • Plateforme sécurisée • Support 24/7
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
