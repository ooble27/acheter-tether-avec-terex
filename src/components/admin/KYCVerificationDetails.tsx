
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, Calendar, Eye, MapPin, Phone, CreditCard } from 'lucide-react';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'submitted': return 'Soumis';
      case 'under_review': return 'En révision';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return status;
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
      <div className="mx-auto max-w-6xl space-y-6">
        {/* En-tête */}
        <div className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-white hover:bg-terex-accent/20 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          
          <Card className="bg-terex-card border-terex-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <CardTitle className="text-2xl text-white">
                    {verification.first_name} {verification.last_name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    ID: {verification.user_id.slice(0, 12)}...
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(verification.status)}`}></div>
                  <Badge variant="secondary" className="text-sm">
                    {getStatusText(verification.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Actions rapides */}
        {canTakeAction && (
          <Card className="bg-terex-card border-terex-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Actions disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {verification.status === 'submitted' && (
                  <Button
                    onClick={handleSetUnderReview}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mettre en révision
                  </Button>
                )}
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
            </CardContent>
          </Card>
        )}

        {/* Grille des informations */}
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
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Nom complet</p>
                    <p className="text-white font-medium">
                      {verification.first_name} {verification.last_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date de naissance</p>
                    <p className="text-white font-medium">
                      {verification.date_of_birth || 'Non fournie'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Nationalité</p>
                    <p className="text-white font-medium">
                      {verification.nationality || 'Non fournie'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Téléphone</p>
                    <p className="text-white font-medium">
                      {verification.phone_number || 'Non fourni'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="bg-terex-card border-terex-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-terex-dark rounded-lg">
                {verification.address ? (
                  <div className="space-y-2">
                    <p className="text-white font-medium">{verification.address}</p>
                    <p className="text-gray-400">
                      {verification.city}, {verification.postal_code}
                    </p>
                    <p className="text-gray-400">{verification.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune adresse fournie</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document d'identité */}
          <Card className="bg-terex-card border-terex-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Document d'identité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Type de document</p>
                  <p className="text-white font-medium">
                    {verification.identity_document_type === 'passport' && 'Passeport'}
                    {verification.identity_document_type === 'national_id' && 'Carte d\'identité'}
                    {verification.identity_document_type === 'drivers_license' && 'Permis de conduire'}
                    {!verification.identity_document_type && 'Non fourni'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-terex-dark rounded-lg">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Numéro de document</p>
                  <p className="text-white font-medium break-all">
                    {verification.identity_document_number || 'Non fourni'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates importantes */}
          <Card className="bg-terex-card border-terex-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-terex-dark rounded-lg">
                <p className="text-xs text-gray-400">Créé le</p>
                <p className="text-white">{formatDate(verification.created_at)}</p>
              </div>
              
              {verification.submitted_at && (
                <div className="p-3 bg-terex-dark rounded-lg">
                  <p className="text-xs text-gray-400">Soumis le</p>
                  <p className="text-white">{formatDate(verification.submitted_at)}</p>
                </div>
              )}
              
              {verification.reviewed_at && (
                <div className="p-3 bg-terex-dark rounded-lg">
                  <p className="text-xs text-gray-400">Révisé le</p>
                  <p className="text-white">{formatDate(verification.reviewed_at)}</p>
                </div>
              )}
              
              {verification.rejection_reason && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-400 mb-1">Raison du rejet</p>
                  <p className="text-white text-sm">{verification.rejection_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents fournis */}
        <Card className="bg-terex-card border-terex-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Documents fournis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Dialogs d'action */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-terex-card border-terex-border">
          <DialogHeader>
            <DialogTitle className="text-white">Approuver la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Vous êtes sur le point d'approuver cette vérification d'identité.
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

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-terex-card border-terex-border">
          <DialogHeader>
            <DialogTitle className="text-white">Rejeter la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Veuillez indiquer la raison du rejet.
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
