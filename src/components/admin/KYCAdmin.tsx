
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Search, Eye } from 'lucide-react';
import { useKYCAdmin } from '@/hooks/useKYCAdmin';
import { KYCVerificationDetails } from './KYCVerificationDetails';

export function KYCAdmin() {
  const { verifications, loading, stats, refetch } = useKYCAdmin();
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-500' },
      submitted: { label: 'Soumis', variant: 'default' as const, icon: AlertCircle, color: 'text-blue-500' },
      under_review: { label: 'En révision', variant: 'default' as const, icon: Clock, color: 'text-orange-500' },
      approved: { label: 'Approuvé', variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;

    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config?.color || 'text-gray-500'}`} />
        {config?.label || status}
      </Badge>
    );
  };

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = 
      verification.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Séparer les vérifications par priorité
  const priorityVerifications = filteredVerifications.filter(v => v.status === 'submitted');
  const otherVerifications = filteredVerifications.filter(v => v.status !== 'submitted');

  if (selectedVerification) {
    const verification = verifications.find(v => v.id === selectedVerification);
    if (verification) {
      return (
        <KYCVerificationDetails
          verification={verification}
          onBack={() => setSelectedVerification(null)}
          onUpdate={refetch}
        />
      );
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* En-tête */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Administration KYC</h1>
        <p className="text-gray-400 mt-2">Gérez les vérifications d'identité des utilisateurs</p>
      </div>

      {/* Statistiques - responsive */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">En attente</p>
                <p className="text-lg md:text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border border-blue-500/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Soumis</p>
                <p className="text-lg md:text-2xl font-bold text-blue-400">{stats.submitted}</p>
                <p className="text-xs text-blue-400 hidden md:block">Action requise</p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">En révision</p>
                <p className="text-lg md:text-2xl font-bold text-white">{stats.under_review}</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Approuvés</p>
                <p className="text-lg md:text-2xl font-bold text-white">{stats.approved}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border col-span-2 md:col-span-1">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Rejetés</p>
                <p className="text-lg md:text-2xl font-bold text-white">{stats.rejected}</p>
              </div>
              <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche - responsive */}
      <Card className="bg-terex-card border-terex-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou ID utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terex-dark border-terex-border text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-terex-dark border-terex-border text-white">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="under_review">En révision</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vérifications prioritaires */}
      {priorityVerifications.length > 0 && (
        <Card className="bg-terex-card border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              Vérifications à traiter en priorité ({priorityVerifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer space-y-3 md:space-y-0"
                  onClick={() => setSelectedVerification(verification.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-medium">
                        {verification.first_name && verification.last_name
                          ? `${verification.first_name} ${verification.last_name}`
                          : 'Nom non fourni'}
                      </h3>
                      <p className="text-gray-400 text-sm">ID: {verification.user_id.slice(0, 8)}...</p>
                      <p className="text-gray-400 text-sm">
                        Soumis le: {verification.submitted_at 
                          ? new Date(verification.submitted_at).toLocaleDateString('fr-FR')
                          : 'Non soumis'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    {getStatusBadge(verification.status)}
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500/20">
                      <Eye className="h-4 w-4 mr-2" />
                      Examiner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des autres vérifications - responsive */}
      <Card className="bg-terex-card border-terex-border">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl">
            {priorityVerifications.length > 0 ? 'Autres vérifications' : 'Toutes les vérifications KYC'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-white text-lg">Chargement...</div>
            </div>
          ) : otherVerifications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <div className="text-white text-lg mb-2">Aucune vérification trouvée</div>
              <p className="text-gray-400">Aucune vérification ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-terex-dark rounded-lg border border-terex-border hover:border-terex-accent/50 transition-colors cursor-pointer space-y-3 md:space-y-0"
                  onClick={() => setSelectedVerification(verification.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-medium">
                        {verification.first_name && verification.last_name
                          ? `${verification.first_name} ${verification.last_name}`
                          : 'Nom non fourni'}
                      </h3>
                      <p className="text-gray-400 text-sm">ID: {verification.user_id.slice(0, 8)}...</p>
                      <p className="text-gray-400 text-sm">
                        Soumis le: {verification.submitted_at 
                          ? new Date(verification.submitted_at).toLocaleDateString('fr-FR')
                          : 'Non soumis'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    {getStatusBadge(verification.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
