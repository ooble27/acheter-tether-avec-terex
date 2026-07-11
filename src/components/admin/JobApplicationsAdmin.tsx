
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  Download,
  Eye,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ExternalLink,
  Clock,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useJobApplicationsAdmin } from '@/hooks/useJobApplicationsAdmin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InterviewScheduleDialog } from './InterviewScheduleDialog';
import { PageHeader, StatusText, Avatar, FilterChip, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente',
  reviewing: "En examen",
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

const innerCardStyle: React.CSSProperties = {
  background: INPUT_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};

export function JobApplicationsAdmin() {
  const { applications, loading, updating, updateApplicationStatus, downloadCV } = useJobApplicationsAdmin();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [applicationForInterview, setApplicationForInterview] = useState<any>(null);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => (
    <StatusText status={status} label={STATUS_LABEL[status] || status} />
  );

  const handleStatusUpdate = async () => {
    if (selectedApplication && newStatus) {
      await updateApplicationStatus(selectedApplication.id, newStatus, adminNotes);
      setSelectedApplication({ ...selectedApplication, status: newStatus, admin_notes: adminNotes });
      setNewStatus('');
      setAdminNotes('');
    }
  };

  const handleDownloadCV = (cvUrl: string, firstName: string, lastName: string) => {
    downloadCV(cvUrl, `${firstName}_${lastName}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div style={{ color: '#fff' }}>Chargement des candidatures...</div>
      </div>
    );
  }

  return (
    <>
      <InterviewScheduleDialog
        open={interviewDialogOpen}
        onOpenChange={setInterviewDialogOpen}
        application={applicationForInterview}
        onScheduled={() => {
          setInterviewDialogOpen(false);
          window.location.reload();
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', minWidth: 0 }}>
        <style>{drillStyles}</style>

        <PageHeader
          title="Candidatures"
          sub={`${applications.length} candidature(s) · ${filteredApplications.length} affichée(s)`}
        />

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => {
            const count = f.id === 'all' ? applications.length : applications.filter(a => a.status === f.id).length;
            return (
              <FilterChip key={f.id} label={f.label} count={count} selected={filter === f.id}
                onClick={() => setFilter(f.id)} />
            );
          })}
        </div>

        {/* Table des candidatures */}
        <div className="crm-table crm-fade">
          <div className="crm-thead cols-team">
            <span className="crm-th">Candidat</span>
            <span className="crm-th">Poste · Statut</span>
            <span className="crm-th">Date</span>
            <span className="crm-th" />
          </div>
          {filteredApplications.map((application) => (
            <Dialog key={application.id}>
              <DialogTrigger asChild>
                <div className="crm-row cols-team clickable"
                  onClick={() => { setSelectedApplication(application); setAdminNotes(application.admin_notes || ''); }}>
                  {/* Candidat */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <Avatar name={`${application.first_name} ${application.last_name}`} size={32} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {application.first_name} {application.last_name}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{application.email}</p>
                      <span className="only-m" style={{ marginTop: 4, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af', fontSize: 12 }}>{application.position}</span>
                        {getStatusBadge(application.status)}
                      </span>
                    </div>
                  </div>
                  {/* Poste · statut (desktop) */}
                  <div className="only-d" style={{ minWidth: 0 }}>
                    <p style={{ color: '#e5e7eb', fontSize: 12.5, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{application.position}</p>
                    <span style={{ display: 'inline-flex', marginTop: 2 }}>{getStatusBadge(application.status)}</span>
                  </div>
                  {/* Date (desktop) */}
                  <div className="only-d" style={{ minWidth: 0 }}>
                    <span style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {format(new Date(application.created_at), 'd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <ChevronRight size={15} color="rgba(255,255,255,0.25)" style={{ justifySelf: 'end' }} />
                </div>
              </DialogTrigger>
              <DialogContent
                className="max-w-4xl max-h-[80vh] overflow-y-auto"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <DialogHeader>
                              <DialogTitle style={{ color: '#fff' }}>
                                Candidature - {selectedApplication?.first_name} {selectedApplication?.last_name}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informations personnelles */}
                                <Card style={innerCardStyle}>
                                  <CardHeader>
                                    <CardTitle style={{ color: '#fff', fontSize: 18 }}>Informations personnelles</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                      <span style={{ color: '#9ca3af' }}>{selectedApplication.email}</span>
                                    </div>
                                    {selectedApplication.phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                        <span style={{ color: '#9ca3af' }}>{selectedApplication.phone}</span>
                                      </div>
                                    )}
                                    {selectedApplication.location && (
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                        <span style={{ color: '#9ca3af' }}>{selectedApplication.location}</span>
                                      </div>
                                    )}
                                    {selectedApplication.experience_years && (
                                      <div className="flex items-center space-x-2">
                                        <Briefcase className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                        <span style={{ color: '#9ca3af' }}>{selectedApplication.experience_years} années d'expérience</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Détails candidature */}
                                <Card style={innerCardStyle}>
                                  <CardHeader>
                                    <CardTitle style={{ color: '#fff', fontSize: 18 }}>Détails candidature</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <span style={{ color: '#fff', fontWeight: 500 }}>Poste : </span>
                                      <span style={{ color: '#9ca3af' }}>{selectedApplication.position}</span>
                                    </div>
                                    {selectedApplication.availability && (
                                      <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                        <span style={{ color: '#9ca3af' }}>{selectedApplication.availability}</span>
                                      </div>
                                    )}
                                    {selectedApplication.salary_expectation && (
                                      <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                        <span style={{ color: '#9ca3af' }}>{selectedApplication.salary_expectation}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                      <span style={{ color: '#9ca3af' }}>Candidature du {format(new Date(selectedApplication.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Liens */}
                                <Card style={innerCardStyle}>
                                  <CardHeader>
                                    <CardTitle style={{ color: '#fff', fontSize: 18 }}>Documents et liens</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    {selectedApplication.cv_url && (
                                      <Button
                                        onClick={() => handleDownloadCV(selectedApplication.cv_url, selectedApplication.first_name, selectedApplication.last_name)}
                                        className="w-full"
                                        style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Télécharger le CV
                                      </Button>
                                    )}
                                    {selectedApplication.linkedin_profile && (
                                      <a
                                        href={selectedApplication.linkedin_profile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2"
                                        style={{ color: '#fff' }}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Profil LinkedIn</span>
                                      </a>
                                    )}
                                    {selectedApplication.portfolio_url && (
                                      <a
                                        href={selectedApplication.portfolio_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2"
                                        style={{ color: '#fff' }}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Portfolio</span>
                                      </a>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Lettre de motivation */}
                                {selectedApplication.cover_letter && (
                                  <Card style={innerCardStyle} className="md:col-span-2">
                                    <CardHeader>
                                      <CardTitle style={{ color: '#fff', fontSize: 18 }}>Lettre de motivation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p style={{ color: '#9ca3af', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {selectedApplication.cover_letter}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Gestion du statut */}
                                <Card style={innerCardStyle} className="md:col-span-2">
                                  <CardHeader>
                                    <CardTitle style={{ color: '#fff', fontSize: 18 }}>Gestion de la candidature</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Statut actuel :</label>
                                      {getStatusBadge(selectedApplication.status)}
                                    </div>

                                    <div>
                                      <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Nouveau statut :</label>
                                      <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger
                                          className="text-white"
                                          style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }}
                                        >
                                          <SelectValue placeholder="Choisir un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">En attente</SelectItem>
                                          <SelectItem value="reviewing">En cours d'examen</SelectItem>
                                          <SelectItem value="interview">Entretien programmé</SelectItem>
                                          <SelectItem value="accepted">Acceptée</SelectItem>
                                          <SelectItem value="rejected">Rejetée</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Notes administratives :</label>
                                      <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="text-white"
                                        style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }}
                                        placeholder="Ajouter des notes internes..."
                                        rows={4}
                                      />
                                    </div>

                                    <Button
                                      onClick={handleStatusUpdate}
                                      disabled={updating || !newStatus}
                                      className="w-full"
                                      style={{ background: '#fff', color: '#141414', fontWeight: 700 }}
                                    >
                                      {updating ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
              </DialogContent>
            </Dialog>
          ))}

          {filteredApplications.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Users size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucune candidature trouvée.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
