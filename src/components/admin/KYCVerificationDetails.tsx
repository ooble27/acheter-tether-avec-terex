import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const CARD_STYLE = {
  background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
};

const FIELD_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
};

const ICON_BG_STYLE = {
  background: 'rgba(255,255,255,0.06)',
};

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

  // Monochrome (design système Terex) : aucun jaune ni bleu.
  // Actif = clair, terminé = estompé, négatif = rouge.
  const getStatusBadgeStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'approved':
        return { color: 'rgba(255,255,255,0.45)' };
      case 'rejected':
        return { color: '#e07a7a' };
      case 'under_review':
        return { color: '#9ca3af' };
      case 'submitted':
        return { color: '#f2f2f2' };
      default:
        return { color: '#9ca3af' };
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

  const statusBadge = (
    <span
      style={{
        ...getStatusBadgeStyle(verification.status),
        fontSize: 12.5,
        fontWeight: 600,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {getStatusText(verification.status)}
    </span>
  );

  const fieldBlock = (Icon: typeof User, label: string, value: React.ReactNode, breakAll = false) => (
    <div className="flex items-center gap-3 p-3" style={FIELD_STYLE}>
      <Icon className="h-4 w-4 shrink-0" style={{ color: '#9ca3af' }} />
      <div className="min-w-0">
        <p style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p className={`text-white font-medium ${breakAll ? 'break-all' : ''}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 pb-safe overflow-x-hidden" style={{ background: '#1a1a1a' }}>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* En-tête */}
        <div className="flex flex-col space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white self-start hover:bg-[rgba(255,255,255,0.06)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>

          <Card style={CARD_STYLE}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-2xl text-white break-words">
                    {verification.first_name} {verification.last_name}
                  </CardTitle>
                  <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                    ID: {verification.user_id.slice(0, 12)}...
                  </p>
                </div>
                <div className="flex items-center shrink-0">
                  {statusBadge}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Actions rapides */}
        {canTakeAction && (
          <Card style={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Actions disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                {verification.status === 'submitted' && (
                  <Button
                    onClick={handleSetUnderReview}
                    className="flex-1 min-w-[160px]"
                    style={{ background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mettre en révision
                  </Button>
                )}
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  className="flex-1 min-w-[160px]"
                  style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none' }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  className="flex-1 min-w-[160px] hover:bg-[rgba(248,113,113,0.16)]"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}
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
          <Card style={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {fieldBlock(User, 'Nom complet', `${verification.first_name} ${verification.last_name}`)}
                {fieldBlock(Calendar, 'Date de naissance', verification.date_of_birth || 'Non fournie')}
                {fieldBlock(MapPin, 'Nationalité', verification.nationality || 'Non fournie')}
                {fieldBlock(Phone, 'Téléphone', verification.phone_number || 'Non fourni')}
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card style={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4" style={FIELD_STYLE}>
                {verification.address ? (
                  <div className="space-y-2">
                    <p className="text-white font-medium">{verification.address}</p>
                    <p style={{ color: '#9ca3af' }}>
                      {verification.city}, {verification.postal_code}
                    </p>
                    <p style={{ color: '#9ca3af' }}>{verification.country}</p>
                  </div>
                ) : (
                  <p style={{ color: '#9ca3af' }}>Aucune adresse fournie</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document d'identité */}
          <Card style={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Document d'identité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fieldBlock(
                FileText,
                'Type de document',
                <>
                  {verification.identity_document_type === 'passport' && 'Passeport'}
                  {verification.identity_document_type === 'national_id' && 'Carte d\'identité'}
                  {verification.identity_document_type === 'drivers_license' && 'Permis de conduire'}
                  {!verification.identity_document_type && 'Non fourni'}
                </>
              )}
              {fieldBlock(CreditCard, 'Numéro de document', verification.identity_document_number || 'Non fourni', true)}
            </CardContent>
          </Card>

          {/* Dates importantes */}
          <Card style={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3" style={FIELD_STYLE}>
                <p style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Créé le</p>
                <p className="text-white">{formatDate(verification.created_at)}</p>
              </div>

              {verification.submitted_at && (
                <div className="p-3" style={FIELD_STYLE}>
                  <p style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Soumis le</p>
                  <p className="text-white">{formatDate(verification.submitted_at)}</p>
                </div>
              )}

              {verification.reviewed_at && (
                <div className="p-3" style={FIELD_STYLE}>
                  <p style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Révisé le</p>
                  <p className="text-white">{formatDate(verification.reviewed_at)}</p>
                </div>
              )}

              {verification.rejection_reason && (
                <div className="p-3" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.20)', borderRadius: 12 }}>
                  <p className="mb-1" style={{ color: '#f87171', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raison du rejet</p>
                  <p className="text-white text-sm">{verification.rejection_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents fournis */}
        <Card style={CARD_STYLE}>
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Documents fournis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Approuver la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p style={{ color: '#9ca3af' }}>
              Vous êtes sur le point d'approuver cette vérification d'identité.
            </p>
            <Textarea
              placeholder="Commentaire optionnel..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, outline: 'none' }}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowApproveDialog(false)}
              style={{ background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submitting}
              style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none' }}
            >
              {submitting ? 'Traitement...' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Rejeter la vérification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p style={{ color: '#9ca3af' }}>
              Veuillez indiquer la raison du rejet.
            </p>
            <Textarea
              placeholder="Raison du rejet (obligatoire)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, outline: 'none' }}
              required
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowRejectDialog(false)}
              style={{ background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleReject}
              disabled={submitting || !rejectionReason.trim()}
              className="hover:bg-[rgba(248,113,113,0.16)]"
              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}
            >
              {submitting ? 'Traitement...' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
