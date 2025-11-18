
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-500', variant: 'secondary' as const },
  reviewing: { label: 'En cours d\'examen', color: 'bg-blue-500', variant: 'default' as const },
  interview: { label: 'Entretien programmé', color: 'bg-purple-500', variant: 'default' as const },
  accepted: { label: 'Acceptée', color: 'bg-green-500', variant: 'default' as const },
  rejected: { label: 'Rejetée', color: 'bg-red-500', variant: 'destructive' as const }
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
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={`${config.color} text-white`}>
        {config.label}
      </Badge>
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
        <div className="text-white">Chargement des candidatures...</div>
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
      
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Candidatures</h2>
          <p className="text-gray-400">{applications.length} candidature(s) au total</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-terex-accent" />
          <span className="text-white font-medium">{filteredApplications.length} candidature(s) affichée(s)</span>
        </div>
      </div>

      {/* Filtres */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Filtrer par statut :</span>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="bg-terex-gray">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="reviewing">En examen</TabsTrigger>
                <TabsTrigger value="interview">Entretien</TabsTrigger>
                <TabsTrigger value="accepted">Acceptées</TabsTrigger>
                <TabsTrigger value="rejected">Rejetées</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Table des candidatures */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-terex-gray">
                <TableHead className="text-gray-300">Candidat</TableHead>
                <TableHead className="text-gray-300">Poste</TableHead>
                <TableHead className="text-gray-300">Statut</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id} className="border-terex-gray hover:bg-terex-gray/50">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">
                        {application.first_name} {application.last_name}
                      </div>
                      <div className="text-gray-400 text-sm">{application.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{application.position}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-300">
                      {format(new Date(application.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setAdminNotes(application.admin_notes || '');
                            }}
                            className="text-terex-accent hover:text-terex-accent/80"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-terex-darker border-terex-gray max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Candidature - {selectedApplication?.first_name} {selectedApplication?.last_name}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Informations personnelles */}
                              <Card className="bg-terex-gray border-terex-gray/50">
                                <CardHeader>
                                  <CardTitle className="text-white text-lg">Informations personnelles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-terex-accent" />
                                    <span className="text-gray-300">{selectedApplication.email}</span>
                                  </div>
                                  {selectedApplication.phone && (
                                    <div className="flex items-center space-x-2">
                                      <Phone className="w-4 h-4 text-terex-accent" />
                                      <span className="text-gray-300">{selectedApplication.phone}</span>
                                    </div>
                                  )}
                                  {selectedApplication.location && (
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4 text-terex-accent" />
                                      <span className="text-gray-300">{selectedApplication.location}</span>
                                    </div>
                                  )}
                                  {selectedApplication.experience_years && (
                                    <div className="flex items-center space-x-2">
                                      <Briefcase className="w-4 h-4 text-terex-accent" />
                                      <span className="text-gray-300">{selectedApplication.experience_years} années d'expérience</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Détails candidature */}
                              <Card className="bg-terex-gray border-terex-gray/50">
                                <CardHeader>
                                  <CardTitle className="text-white text-lg">Détails candidature</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <span className="text-terex-accent font-medium">Poste : </span>
                                    <span className="text-gray-300">{selectedApplication.position}</span>
                                  </div>
                                  {selectedApplication.availability && (
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-terex-accent" />
                                      <span className="text-gray-300">{selectedApplication.availability}</span>
                                    </div>
                                  )}
                                  {selectedApplication.salary_expectation && (
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="w-4 h-4 text-terex-accent" />
                                      <span className="text-gray-300">{selectedApplication.salary_expectation}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-terex-accent" />
                                    <span className="text-gray-300">Candidature du {format(new Date(selectedApplication.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Liens */}
                              <Card className="bg-terex-gray border-terex-gray/50">
                                <CardHeader>
                                  <CardTitle className="text-white text-lg">Documents et liens</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {selectedApplication.cv_url && (
                                    <Button
                                      onClick={() => handleDownloadCV(selectedApplication.cv_url, selectedApplication.first_name, selectedApplication.last_name)}
                                      className="w-full bg-terex-accent hover:bg-terex-accent/80"
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
                                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
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
                                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      <span>Portfolio</span>
                                    </a>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Lettre de motivation */}
                              {selectedApplication.cover_letter && (
                                <Card className="bg-terex-gray border-terex-gray/50 md:col-span-2">
                                  <CardHeader>
                                    <CardTitle className="text-white text-lg">Lettre de motivation</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                      {selectedApplication.cover_letter}
                                    </p>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Gestion du statut */}
                              <Card className="bg-terex-gray border-terex-gray/50 md:col-span-2">
                                <CardHeader>
                                  <CardTitle className="text-white text-lg">Gestion de la candidature</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <label className="text-white font-medium mb-2 block">Statut actuel :</label>
                                    {getStatusBadge(selectedApplication.status)}
                                  </div>
                                  
                                  <div>
                                    <label className="text-white font-medium mb-2 block">Nouveau statut :</label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger className="bg-terex-darker border-terex-gray text-white">
                                        <SelectValue placeholder="Choisir un statut" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-terex-darker border-terex-gray">
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="reviewing">En cours d'examen</SelectItem>
                                        <SelectItem value="interview">Entretien programmé</SelectItem>
                                        <SelectItem value="accepted">Acceptée</SelectItem>
                                        <SelectItem value="rejected">Rejetée</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <label className="text-white font-medium mb-2 block">Notes administratives :</label>
                                    <Textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      className="bg-terex-darker border-terex-gray text-white"
                                      placeholder="Ajouter des notes internes..."
                                      rows={4}
                                    />
                                  </div>

                                  <Button
                                    onClick={handleStatusUpdate}
                                    disabled={updating || !newStatus}
                                    className="w-full bg-terex-accent hover:bg-terex-accent/80"
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
                          className="text-blue-400 hover:text-blue-300"
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

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Aucune candidature trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
