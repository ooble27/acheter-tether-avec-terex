
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Search, Eye } from 'lucide-react';
import { useKYCAdmin } from '@/hooks/useKYCAdmin';
import { KYCVerificationDetails } from './KYCVerificationDetails';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export function KYCAdmin() {
  const { verifications, loading, stats, refetch } = useKYCAdmin();
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
      pending: { label: 'En attente', bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
      submitted: { label: 'Soumis', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
      under_review: { label: 'En révision', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
      approved: { label: 'Approuvé', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' },
      rejected: { label: 'Rejeté', bg: 'rgba(248,113,113,0.10)', color: '#f87171' },
    };

    const config = statusConfig[status] || { label: status, bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' };

    return (
      <span
        style={{
          display: 'inline-block',
          borderRadius: 999,
          padding: '3px 10px',
          fontSize: 11,
          fontWeight: 600,
          background: config.bg,
          color: config.color,
          whiteSpace: 'nowrap',
        }}
      >
        {config.label}
      </span>
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

  const statCards = [
    { label: 'En attente', value: stats.pending, Icon: Clock },
    { label: 'Soumis', value: stats.submitted, Icon: AlertCircle },
    { label: 'En révision', value: stats.under_review, Icon: Clock },
    { label: 'Approuvés', value: stats.approved, Icon: CheckCircle },
    { label: 'Rejetés', value: stats.rejected, Icon: XCircle },
  ];

  const cardStyle: React.CSSProperties = {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 16,
  };

  const renderRow = (verification: typeof filteredVerifications[number]) => (
    <div
      key={verification.id}
      onClick={() => setSelectedVerification(verification.id)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 14,
        background: INPUT_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        cursor: 'pointer',
        width: '100%',
        minWidth: 0,
      }}
    >
      <div style={{ minWidth: 0, flex: '1 1 200px' }}>
        <h3 style={{ color: '#fff', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {verification.first_name && verification.last_name
            ? `${verification.first_name} ${verification.last_name}`
            : 'Nom non fourni'}
        </h3>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0 0' }}>ID: {verification.user_id.slice(0, 8)}...</p>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '2px 0 0' }}>
          Soumis le: {verification.submitted_at
            ? new Date(verification.submitted_at).toLocaleDateString('fr-FR')
            : 'Non soumis'}
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {getStatusBadge(verification.status)}
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#2d2d2d',
            border: `1px solid ${BORDER}`,
            color: '#fff',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Eye className="h-4 w-4" />
          Voir détails
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', minWidth: 0 }}>
      {/* Statistiques */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}
      >
        {statCards.map(({ label, value, Icon }) => (
          <div key={label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{label}</p>
                <p style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '4px 0 0' }}>{value}</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: ICON_BG,
                  flexShrink: 0,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: '#9ca3af' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#6b7280' }} />
              <Input
                placeholder="Rechercher par nom ou ID utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-white"
                style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-full md:w-48 text-white"
              style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }}
            >
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
      </div>

      {/* Vérifications prioritaires */}
      {priorityVerifications.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle className="h-5 w-5" style={{ color: '#60a5fa' }} />
            Vérifications à traiter en priorité ({priorityVerifications.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {priorityVerifications.map(renderRow)}
          </div>
        </div>
      )}

      {/* Liste des autres vérifications */}
      <div style={cardStyle}>
        <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>
          {priorityVerifications.length > 0 ? 'Autres vérifications' : 'Toutes les vérifications KYC'}
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div style={{ color: '#fff', fontSize: 18 }}>Chargement...</div>
          </div>
        ) : otherVerifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Users className="h-16 w-16 mx-auto mb-4" style={{ color: '#6b7280' }} />
            <div style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>Aucune vérification trouvée</div>
            <p style={{ color: '#9ca3af', margin: 0 }}>Aucune vérification ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {otherVerifications.map(renderRow)}
          </div>
        )}
      </div>
    </div>
  );
}
