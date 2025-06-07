
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminPortal } from '@/components/admin/AdminPortal';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isKYCReviewer, loading: roleLoading } = useUserRole();
  const [showLogin, setShowLogin] = useState(false);

  const loading = authLoading || roleLoading;

  useEffect(() => {
    // Vérifier si on est sur le sous-domaine admin
    const isAdminDomain = window.location.hostname.includes('admin.');
    
    if (!loading) {
      if (!user) {
        setShowLogin(true);
      } else if (!isAdmin() && !isKYCReviewer()) {
        // Utilisateur connecté mais pas admin
        setShowLogin(false);
      } else {
        setShowLogin(false);
      }
    }
  }, [user, loading, isAdmin, isKYCReviewer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement du portail admin...</span>
        </div>
      </div>
    );
  }

  // Si pas connecté, afficher la page de connexion admin
  if (!user || showLogin) {
    return <AdminLogin />;
  }

  // Si connecté mais pas admin
  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center p-4">
        <Card className="bg-terex-darker border-terex-gray max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-white mb-2">Accès Refusé</h2>
            <p className="text-gray-400 mb-4">
              Ce portail administrateur est réservé aux utilisateurs autorisés.
            </p>
            <div className="text-sm text-gray-500">
              Votre compte ne dispose pas des privilèges administrateur requis.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Afficher le portail admin avec la nouvelle page de gestion des commandes
  return <AdminPortal />;
}
