import { useState } from 'react';
import { Users, Search, ChevronRight, RefreshCw } from 'lucide-react';
import { useKYCAdmin } from '@/hooks/useKYCAdmin';
import { KYCVerificationDetails } from './KYCVerificationDetails';
import { PageHeader, StatusText, Avatar, FilterChip, drillStyles } from '@/components/admin/AdminDrill';

const BORDER = 'rgba(255,255,255,0.07)';

const FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'submitted', label: 'À traiter' },
  { id: 'pending', label: 'En attente' },
  { id: 'under_review', label: 'En révision' },
  { id: 'approved', label: 'Approuvés' },
  { id: 'rejected', label: 'Rejetés' },
];

export function KYCAdmin() {
  const { verifications, loading, stats, refetch } = useKYCAdmin();
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const q = searchTerm.toLowerCase();
  const filtered = verifications
    .filter(v => statusFilter === 'all' || v.status === statusFilter)
    .filter(v =>
      !q ||
      v.first_name?.toLowerCase().includes(q) ||
      v.last_name?.toLowerCase().includes(q) ||
      v.user_id.toLowerCase().includes(q)
    )
    // les dossiers « soumis » (à traiter) remontent en tête
    .sort((a, b) => (a.status === 'submitted' ? -1 : 0) - (b.status === 'submitted' ? -1 : 0));

  const countOf = (id: string) => id === 'all' ? verifications.length : verifications.filter(v => v.status === id).length;

  const Row = (v: typeof filtered[number]) => {
    const name = v.first_name && v.last_name ? `${v.first_name} ${v.last_name}` : 'Nom non fourni';
    return (
      <div key={v.id} className="crm-row cols-team clickable" onClick={() => setSelectedVerification(v.id)}>
        {/* Personne */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Avatar name={name} size={32} />
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
            <p style={{ color: '#6b7280', fontSize: 11.5, margin: '1px 0 0', fontFamily: 'ui-monospace,Menlo,monospace' }}>ID {v.user_id.slice(0, 8)}…</p>
            <span className="only-m" style={{ marginTop: 4, display: 'inline-flex' }}>
              <StatusText status={v.status} size={11.5} />
            </span>
          </div>
        </div>
        {/* Statut (desktop) */}
        <div className="only-d" style={{ minWidth: 0 }}>
          <StatusText status={v.status} />
        </div>
        {/* Date (desktop) */}
        <div className="only-d" style={{ minWidth: 0 }}>
          <span style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'nowrap' }}>
            {v.submitted_at ? new Date(v.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Non soumis'}
          </span>
        </div>
        <ChevronRight size={15} color="rgba(255,255,255,0.25)" style={{ justifySelf: 'end' }} />
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>

      <PageHeader
        title="Vérifications KYC"
        sub={`${verifications.length} dossier(s) · ${stats.submitted} à traiter`}
        right={
          <button className="ghost-btn" onClick={() => refetch()} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        }
      />

      {/* Recherche + filtres (les compteurs des filtres remplacent la bande de KPI) */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
          <input
            placeholder="Rechercher : nom, ID utilisateur…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '9px 14px 9px 36px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <FilterChip key={f.id} label={f.label} count={countOf(f.id)} selected={statusFilter === f.id}
              onClick={() => setStatusFilter(f.id)} />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="crm-table crm-fade">
        <div className="crm-thead cols-team">
          <span className="crm-th">Personne</span>
          <span className="crm-th">Statut</span>
          <span className="crm-th">Soumis le</span>
          <span className="crm-th" />
        </div>
        {loading ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Users size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucune vérification ne correspond aux filtres.</p>
          </div>
        ) : (
          filtered.map(Row)
        )}
      </div>
    </div>
  );
}
