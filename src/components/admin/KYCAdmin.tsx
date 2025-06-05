
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { useKYCAdmin } from '@/hooks/useKYCAdmin';
import { KYCVerificationDetails } from './KYCVerificationDetails';

export function KYCAdmin() {
  const { verifications, loading, stats, refetch } = useKYCAdmin();
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
      submitted: { label: 'Soumis', variant: 'default' as const, icon: AlertCircle },
      under_review: { label: 'En révision', variant: 'default' as const, icon: Clock },
      approved: { label: 'Approuvé', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;

    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
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
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-white">Administration KYC</h1>
        <p className="text-gray-400">Gérez les vérifications d'identité des utilisateurs</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Soumis</p>
                <p className="text-2xl font-bold text-white">{stats.submitted}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">En révision</p>
                <p className="text-2xl font-bold text-white">{stats.under_review}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approuvés</p>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rejetés</p>
                <p className="text-2xl font-bold text-white">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
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

      {/* Liste des vérifications */}
      <Card className="bg-terex-card border-terex-border">
        <CardHeader>
          <CardTitle className="text-white">Vérifications KYC</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white text-lg">Chargement...</div>
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <div className="text-white text-lg mb-2">Aucune vérification trouvée</div>
              <p className="text-gray-400">Aucune vérification ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-4 bg-terex-dark rounded-lg border border-terex-border hover:border-terex-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedVerification(verification.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-medium">
                        {verification.first_name && verification.last_name
                          ? `${verification.first_name} ${verification.last_name}`
                          : 'Nom non fourni'}
                      </h3>
                      <p className="text-gray-400 text-sm">ID: {verification.user_id}</p>
                      <p className="text-gray-400 text-sm">
                        Soumis le: {verification.submitted_at 
                          ? new Date(verification.submitted_at).toLocaleDateString('fr-FR')
                          : 'Non soumis'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(verification.status)}
                    <Button variant="outline" size="sm">
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
