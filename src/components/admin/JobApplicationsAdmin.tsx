
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign
} from 'lucide-react';
import { useJobApplicationsAdmin } from '@/hooks/useJobApplicationsAdmin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InterviewScheduleDialog } from './InterviewScheduleDialog';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'En attente', bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  reviewing: { label: "En cours d'examen", bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  interview: { label: 'Entretien programmé', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  accepted: { label: 'Acceptée', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' },
  rejected: { label: 'Rejetée', bg: 'rgba(248,113,113,0.10)', color: '#f87171' }
};

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
};

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

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Gestion des Candidatures</h2>
            <p style={{ color: '#9ca3af', margin: '4px 0 0' }}>{applications.length} candidature(s) au total</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users className="w-5 h-5" style={{ color: '#9ca3af' }} />
            <span style={{ color: '#fff', fontWeight: 500 }}>{filteredApplications.length} candidature(s) affichée(s)</span>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#fff', fontWeight: 500 }}>Filtrer par statut :</span>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList style={{ background: '#2d2d2d', flexWrap: 'wrap', height: 'auto' }}>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="reviewing">En examen</TabsTrigger>
                <TabsTrigger value="interview">Entretien</TabsTrigger>
                <TabsTrigger value="accepted">Acceptées</TabsTrigger>
                <TabsTrigger value="rejected">Rejetées</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Table des candidatures */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: BORDER }}>
                  <TableHead style={{ color: '#9ca3af' }}>Candidat</TableHead>
                  <TableHead style={{ color: '#9ca3af' }}>Poste</TableHead>
                  <TableHead style={{ color: '#9ca3af' }}>Statut</TableHead>
                  <TableHead style={{ color: '#9ca3af' }}>Date</TableHead>
                  <TableHead style={{ color: '#9ca3af' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id} style={{ borderColor: BORDER }}>
                    <TableCell>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 500 }}>
                          {application.first_name} {application.last_name}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: 13 }}>{application.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ color: '#fff' }}>{application.position}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell>
                      <div style={{ color: '#9ca3af' }}>
                        {format(new Date(application.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(application);
                                setAdminNotes(application.admin_notes || '');
                              }}
                              style={{ color: '#fff' }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
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

                        {application.cv_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadCV(application.cv_url, application.first_name, application.last_name)}
                            style={{ color: '#fff' }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#6b7280' }} />
              <p style={{ color: '#9ca3af', margin: 0 }}>Aucune candidature trouvée</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
