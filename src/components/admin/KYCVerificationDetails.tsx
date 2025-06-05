
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, Image, Calendar } from 'lucide-react';
import { useKYCAdmin, KYCVerificationWithHistory } from '@/hooks/useKYCAdmin';

interface KYCVerificationDetailsProps {
  verification: KYCVerificationWithHistory;
  onBack: () => void;
  onUpdate: () => void;
}

export function KYCVerificationDetails({ verification, onBack, onUpdate }: KYCVerificationDetailsProps) {
  const { approveVerification, rejectVerification, setUnderReview } = useKYCAdmin();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    setSubmitting(true);
    const result = await approveVerification(verification.id, approvalComment);
    setSubmitting(false);
    
    if (result.success) {
      setShowApproveDialog(false);
      setApprovalComment('');
      onUpdate();
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setSubmitting(true);
    const result = await rejectVerification(verification.id, rejectionReason);
    setSubmitting(false);
    
    if (result.success) {
      setShowRejectDialog(false);
      setRejectionReason('');
      onUpdate();
    }
  };

  const handleSetUnderReview = async () => {
    await setUnderReview(verification.id);
    onUpdate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-orange-500';
      case 'submitted': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec retour */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-terex-accent/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Vérification KYC - {verification.first_name} {verification.last_name}
          </h1>
          <p className="text-gray-400">ID utilisateur: {verification.user_id}</p>
        </div>
      </div>

      {/* Actions rapides */}
      {verification.status === 'submitted' && (
        <div className="flex space-x-4">
          <Button
            onClick={handleSetUnderReview}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            Mettre en révision
          </Button>
          <Button
            onClick={() => setShowApproveDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      )}

      {verification.status === 'under_review' && (
        <div className="flex space-x-4">
          <Button
            onClick={() => setShowApproveDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Prénom</label>
                <p className="text-white">{verification.first_name || 'Non fourni'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nom</label>
                <p className="text-white">{verification.last_name || 'Non fourni'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Date de naissance</label>
                <p className="text-white">{verification.date_of_birth || 'Non fournie'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nationalité</label>
                <p className="text-white">{verification.nationality || 'Non fournie'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-400">Téléphone</label>
                <p className="text-white">{verification.phone_number || 'Non fourni'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-400">Adresse</label>
                <p className="text-white">
                  {verification.address ? (
                    `${verification.address}, ${verification.city} ${verification.postal_code}, ${verification.country}`
                  ) : (
                    'Non fournie'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents d'identité */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documents d'identité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Type de document</label>
              <p className="text-white">{verification.identity_document_type || 'Non fourni'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Numéro de document</label>
              <p className="text-white">{verification.identity_document_number || 'Non fourni'}</p>
            </div>
            
            {/* Images des documents */}
            <div className="space-y-4">
              {verification.identity_document_front_url && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Document recto</label>
                  <img
                    src={verification.identity_document_front_url}
                    alt="Document recto"
                    className="w-full h-48 object-cover rounded-lg border border-terex-border"
                  />
                </div>
              )}
              
              {verification.identity_document_back_url && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Document verso</label>
                  <img
                    src={verification.identity_document_back_url}
                    alt="Document verso"
                    className="w-full h-48 object-cover rounded-lg border border-terex-border"
                  />
                </div>
              )}
              
              {verification.selfie_url && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Selfie</label>
                  <img
                    src={verification.selfie_url}
                    alt="Selfie"
                    className="w-full h-48 object-cover rounded-lg border border-terex-border"
                  />
                </div>
              )}
              
              {verification.proof_of_address_url && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Justificatif de domicile</label>
                  <img
                    src={verification.proof_of_address_url}
                    alt="Justificatif de domicile"
                    className="w-full h-48 object-cover rounded-lg border border-terex-border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut et historique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-terex-card border-terex-border">
          <CardHeader>
            <CardTitle className="text-white">Statut actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(verification.status)}`}></div>
                <Badge variant="secondary" className="text-lg">
                  {verification.status === 'pending' && 'En attente'}
                  {verification.status === 'submitted' && 'Soumis'}
                  {verification.status === 'under_review' && 'En révision'}
                  {verification.status === 'approved' && 'Approuvé'}
                  {verification.status === 'rejected' && 'Rejeté'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Créé le: </span>
                  <span className="text-white">{formatDate(verification.created_at)}</span>
                </div>
                {verification.submitted_at && (
                  <div>
                    <span className="text-gray-400">Soumis le: </span>
                    <span className="text-white">{formatDate(verification.submitted_at)}</span>
                  </div>
                )}
                {verification.reviewed_at && (
                  <div>
                    <span className="text-gray-400">Révisé le: </span>
                    <span className="text-white">{formatDate(verification.reviewed_at)}</span>
                  </div>
                )}
              </div>
              
              {verification.rejection_reason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Raison du rejet:</p>
                  <p className="text-white">{verification.rejection_reason}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-card border-terex-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verification.history && verification.history.length > 0 ? (
                verification.history.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-terex-dark rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(entry.action)}`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {entry.action === 'approved' && 'Approuvé'}
                        {entry.action === 'rejected' && 'Rejeté'}
                        {entry.action === 'submitted' && 'Soumis'}
                        {entry.action === 'under_review' && 'Mis en révision'}
                      </p>
                      <p className="text-gray-400 text-xs">{formatDate(entry.created_at)}</p>
                      {entry.reason && (
                        <p className="text-gray-300 text-xs mt-1">{entry.reason}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Aucun historique disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog d'approbation */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-terex-card border-terex-border">
          <DialogHeader>
            <DialogTitle className="text-white">Approuver la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Vous êtes sur le point d'approuver cette vérification d'identité. Cette action donnera accès complet à l'utilisateur.
            </p>
            <Textarea
              placeholder="Commentaire optionnel..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="bg-terex-dark border-terex-border text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Traitement...' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-terex-card border-terex-border">
          <DialogHeader>
            <DialogTitle className="text-white">Rejeter la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Veuillez indiquer la raison du rejet. L'utilisateur recevra cette information.
            </p>
            <Textarea
              placeholder="Raison du rejet (obligatoire)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-terex-dark border-terex-border text-white"
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleReject}
              disabled={submitting || !rejectionReason.trim()}
              variant="destructive"
            >
              {submitting ? 'Traitement...' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
