import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users, Download, Calendar, Mail, Briefcase,
  ExternalLink, ChevronRight, User, FileText, CalendarClock,
} from 'lucide-react';
import { useJobApplicationsAdmin } from '@/hooks/useJobApplicationsAdmin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InterviewScheduleDialog } from './InterviewScheduleDialog';
import {
  PageHeader, DrillPage, DetailSection, Field, StatusText, Avatar, FilterChip, drillStyles,
} from '@/components/admin/AdminDrill';

const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente',
  reviewing: 'En examen',
  interview: 'Entretien',
  accepted: 'Acceptée',
  rejected: 'Rejetée',
};

const FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'reviewing', label: 'En examen' },
  { id: 'interview', label: 'Entretien' },
  { id: 'accepted', label: 'Acceptées' },
  { id: 'rejected', label: 'Rejetées' },
];

const linkStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13.5, fontWeight: 600,
  textDecoration: 'none', padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${BORDER}`,
};

export function JobApplicationsAdmin() {
  const { applications, loading, updating, updateApplicationStatus, downloadCV } = useJobApplicationsAdmin();
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [applicationForInterview, setApplicationForInterview] = useState<any>(null);

  const filtered = applications.filter(app => filter === 'all' || app.status === filter);

  const open = (app: any) => { setSelected(app); setAdminNotes(app.admin_notes || ''); setNewStatus(''); };

  const handleStatusUpdate = async () => {
    if (selected && newStatus) {
      await updateApplicationStatus(selected.id, newStatus, adminNotes);
      setSelected({ ...selected, status: newStatus, admin_notes: adminNotes });
      setNewStatus('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Chargement des candidatures…</div>
      </div>
    );
  }

  // ── PAGE DE DÉTAIL (plein écran, plus de popup) ──────────────────────────────
  if (selected) {
    const a = selected;
    const name = `${a.first_name} ${a.last_name}`;
    return (
      <>
        <style>{drillStyles}</style>
        <InterviewScheduleDialog
          open={interviewDialogOpen}
          onOpenChange={setInterviewDialogOpen}
          application={applicationForInterview}
          onScheduled={() => { setInterviewDialogOpen(false); window.location.reload(); }}
        />
        <DrillPage
          title={name}
          sub={a.position}
          onBack={() => setSelected(null)}
          right={<StatusText status={a.status} label={STATUS_LABEL[a.status] || a.status} />}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, alignItems: 'start' }}>

            {/* Coordonnées */}
            <DetailSection title="Coordonnées" icon={User}>
              <div style={{ display: 'grid', gap: 12 }}>
                <Field label="Email" value={a.email} copyable onCopy={() => navigator.clipboard.writeText(a.email)} />
                {a.phone && <Field label="Téléphone" value={a.phone} copyable onCopy={() => navigator.clipboard.writeText(a.phone)} />}
                {a.location && <Field label="Localisation" value={a.location} />}
                {a.experience_years && <Field label="Expérience" value={`${a.experience_years} année(s)`} />}
              </div>
            </DetailSection>

            {/* Candidature */}
            <DetailSection title="Candidature" icon={Briefcase}>
              <div style={{ display: 'grid', gap: 12 }}>
                <Field label="Poste" value={a.position} />
                {a.availability && <Field label="Disponibilité" value={a.availability} />}
                {a.salary_expectation && <Field label="Prétentions salariales" value={a.salary_expectation} />}
                <Field label="Candidature reçue" value={format(new Date(a.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })} />
              </div>
            </DetailSection>

            {/* Documents & liens */}
            <DetailSection title="Documents & liens" icon={FileText}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {a.cv_url ? (
                  <button onClick={() => downloadCV(a.cv_url, `${a.first_name}_${a.last_name}`)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                    <Download size={15} /> Télécharger le CV
                  </button>
                ) : <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucun CV fourni.</p>}
                {a.linkedin_profile && <a href={a.linkedin_profile} target="_blank" rel="noopener noreferrer" style={linkStyle}><ExternalLink size={14} /> Profil LinkedIn</a>}
                {a.portfolio_url && <a href={a.portfolio_url} target="_blank" rel="noopener noreferrer" style={linkStyle}><ExternalLink size={14} /> Portfolio</a>}
              </div>
            </DetailSection>

            {/* Lettre de motivation — pleine largeur */}
            {a.cover_letter && (
              <div style={{ gridColumn: '1 / -1' }}>
                <DetailSection title="Lettre de motivation" icon={Mail}>
                  <p style={{ color: '#d1d5db', fontSize: 13.5, whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{a.cover_letter}</p>
                </DetailSection>
              </div>
            )}

            {/* Décision — pleine largeur */}
            <div style={{ gridColumn: '1 / -1' }}>
              <DetailSection title="Décision" icon={CalendarClock}
                right={
                  <button onClick={() => { setApplicationForInterview(a); setInterviewDialogOpen(true); }}
                    className="ghost-btn"><Calendar size={13} /> Planifier un entretien</button>
                }>
                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Changer le statut</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="text-white" style={{ flex: '1 1 200px', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 11 }}>
                          <SelectValue placeholder="Choisir un statut…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="reviewing">En examen</SelectItem>
                          <SelectItem value="interview">Entretien programmé</SelectItem>
                          <SelectItem value="accepted">Acceptée</SelectItem>
                          <SelectItem value="rejected">Rejetée</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleStatusUpdate} disabled={updating || !newStatus}
                        style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none' }}>
                        {updating ? 'Mise à jour…' : 'Enregistrer'}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Notes internes</p>
                    <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={4}
                      className="text-white" placeholder="Notes réservées à l'équipe…"
                      style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }} />
                  </div>
                </div>
              </DetailSection>
            </div>
          </div>
        </DrillPage>
      </>
    );
  }

  // ── LISTE ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', minWidth: 0 }}>
      <style>{drillStyles}</style>

      <PageHeader title="Candidatures" sub={`${applications.length} candidature(s) · ${filtered.length} affichée(s)`} />

      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => {
          const count = f.id === 'all' ? applications.length : applications.filter(a => a.status === f.id).length;
          return <FilterChip key={f.id} label={f.label} count={count} selected={filter === f.id} onClick={() => setFilter(f.id)} />;
        })}
      </div>

      <div className="crm-table crm-fade">
        <div className="crm-thead cols-team">
          <span className="crm-th">Candidat</span>
          <span className="crm-th">Poste · Statut</span>
          <span className="crm-th">Date</span>
          <span className="crm-th" />
        </div>
        {filtered.map((a) => (
          <div key={a.id} className="crm-row cols-team clickable" onClick={() => open(a)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Avatar name={`${a.first_name} ${a.last_name}`} size={32} />
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.first_name} {a.last_name}</p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</p>
                <span className="only-m" style={{ marginTop: 4, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af', fontSize: 12 }}>{a.position}</span>
                  <StatusText status={a.status} label={STATUS_LABEL[a.status]} size={11.5} />
                </span>
              </div>
            </div>
            <div className="only-d" style={{ minWidth: 0 }}>
              <p style={{ color: '#e5e7eb', fontSize: 12.5, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.position}</p>
              <span style={{ display: 'inline-flex', marginTop: 2 }}><StatusText status={a.status} label={STATUS_LABEL[a.status]} /></span>
            </div>
            <div className="only-d" style={{ minWidth: 0 }}>
              <span style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'nowrap' }}>{format(new Date(a.created_at), 'd MMM yyyy', { locale: fr })}</span>
            </div>
            <ChevronRight size={15} color="rgba(255,255,255,0.25)" style={{ justifySelf: 'end' }} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Users size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucune candidature trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
