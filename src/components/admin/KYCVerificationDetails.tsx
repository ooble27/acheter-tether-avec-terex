
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, Calendar, Eye } from 'lucide-react';
import { useKYCAdmin, KYCVerificationWithHistory } from '@/hooks/useKYCAdmin';
import { DocumentImage } from './DocumentImage';

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

  const canTakeAction = verification.status === 'submitted' || verification.status === 'under_review';

  return (
    <div className="min-h-screen bg-terex-dark p-4 pb-safe">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* En-tête avec retour - mobile optimized */}
        <div className="flex flex-col space-y-3">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-white hover:bg-terex-accent/20 self-start"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold text-white leading-tight">
              Vérification KYC
            </h1>
            <p className="text-lg font-medium text-white">
              {verification.first_name} {verification.last_name}
            </p>
            <p className="text-sm text-gray-400 break-all">
              ID: {verification.user_id.slice(0, 12)}...
            </p>
            
            <div className="flex items-center space-x-3 pt-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(verification.status)}`}></div>
              <Badge variant="secondary" className="text-sm">
                {verification.status === 'pending' && 'En attente'}
                {verification.status === 'submitted' && 'Soumis'}
                {verification.status === 'under_review' && 'En révision'}
                {verification.status === 'approved' && 'Approuvé'}
                {verification.status === 'rejected' && 'Rejeté'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions rapides - mobile optimized */}
        {canTakeAction && (
          <Card className="bg-terex-card border-terex-border">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                {verification.status === 'submitted' && (
                  <Button
                    onClick={handleSetUnderReview}
                    className="bg-orange-600 hover:bg-orange-700 w-full"
                    size="sm"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mettre en révision
                  </Button>
                )}
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  className="bg-green-600 hover:bg-green-700 w-full"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                  className="w-full"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations personnelles - mobile optimized */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <User className="h-4 w-4 mr-2" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Prénom</label>
                <p className="text-white font-medium break-words">{verification.first_name || 'Non fourni'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nom</label>
                <p className="text-white font-medium break-words">{verification.last_name || 'Non fourni'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Date de naissance</label>
                <p className="text-white font-medium">{verification.date_of_birth || 'Non fournie'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nationalité</label>
                <p className="text-white font-medium break-words">{verification.nationality || 'Non fournie'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Téléphone</label>
                <p className="text-white font-medium break-words">{verification.phone_number || 'Non fourni'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Adresse</label>
                <p className="text-white font-medium break-words">
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

        {/* Informations du document - mobile optimized */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <FileText className="h-4 w-4 mr-2" />
              Informations du document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Type de document</label>
              <p className="text-white font-medium">
                {verification.identity_document_type === 'passport' && 'Passeport'}
                {verification.identity_document_type === 'national_id' && 'Carte d\'identité nationale'}
                {verification.identity_document_type === 'drivers_license' && 'Permis de conduire'}
                {!verification.identity_document_type && 'Non fourni'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Numéro de document</label>
              <p className="text-white font-medium break-all">{verification.identity_document_number || 'Non fourni'}</p>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Dates importantes</label>
              <div className="space-y-2 text-xs">
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
            </div>
            
            {verification.rejection_reason && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Raison du rejet:</p>
                <p className="text-white text-xs break-words">{verification.rejection_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents d'identité - mobile optimized */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <Eye className="h-4 w-4 mr-2" />
              Documents fournis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <DocumentImage
                url={verification.identity_document_front_url}
                alt="Document recto"
                title="Document d'identité (recto)"
              />
              
              <DocumentImage
                url={verification.identity_document_back_url}
                alt="Document verso"
                title="Document d'identité (verso)"
              />
              
              <DocumentImage
                url={verification.selfie_url}
                alt="Selfie"
                title="Photo selfie"
              />
              
              <DocumentImage
                url={verification.proof_of_address_url}
                alt="Justificatif de domicile"
                title="Justificatif de domicile"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog d'approbation */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-terex-card border-terex-border mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Approuver la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Vous êtes sur le point d'approuver cette vérification d'identité. Cette action donnera accès complet à l'utilisateur.
            </p>
            <Textarea
              placeholder="Commentaire optionnel..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="bg-terex-dark border-terex-border text-white text-sm"
              rows={3}
            />
          </div>
          <DialogFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              onClick={() => setShowApproveDialog(false)}
              className="w-full"
              size="sm"
            >
              Annuler
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 w-full"
              size="sm"
            >
              {submitting ? 'Traitement...' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-terex-card border-terex-border mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Rejeter la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Veuillez indiquer la raison du rejet. L'utilisateur recevra cette information.
            </p>
            <Textarea
              placeholder="Raison du rejet (obligatoire)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-terex-dark border-terex-border text-white text-sm"
              required
              rows={3}
            />
          </div>
          <DialogFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              className="w-full"
              size="sm"
            >
              Annuler
            </Button>
            <Button
              onClick={handleReject}
              disabled={submitting || !rejectionReason.trim()}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              {submitting ? 'Traitement...' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
