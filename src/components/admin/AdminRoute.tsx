
import { useUserRole } from '@/hooks/useUserRole';
import { AdminPortal } from './AdminPortal';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

export function AdminRoute() {
  const { isAdmin, isKYCReviewer, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Vérification des permissions...</div>
      </div>
    );
  }

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
              Contactez l'administrateur système si vous pensez qu'il s'agit d'une erreur.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminPortal />;
}
