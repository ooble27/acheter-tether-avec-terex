import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, User, FileText, Calendar, Eye, MapPin, Phone, CreditCard } from 'lucide-react';
import { useKYCAdmin, KYCVerificationWithHistory } from '@/hooks/useKYCAdmin';
import { DocumentImage } from './DocumentImage';
import { DrillPage, DetailSection, Field, StatusText, drillStyles } from '@/components/admin/AdminDrill';

interface KYCVerificationDetailsProps {
  verification: KYCVerificationWithHistory;
  onBack: () => void;
  onUpdate: () => void;
}

const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', submitted: 'Soumis', under_review: 'En révision',
  approved: 'Approuvé', rejected: 'Rejeté',
};

const DOC_TYPE: Record<string, string> = {
  passport: 'Passeport', national_id: "Carte d'identité", drivers_license: 'Permis de conduire',
};

export function KYCVerificationDetails({ verification: v, onBack, onUpdate }: KYCVerificationDetailsProps) {
  const { approveVerification, rejectVerification, setUnderReview } = useKYCAdmin();
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    setSubmitting(true);
    const result = await approveVerification(v.id, approvalComment);
    setSubmitting(false);
    if (result.success) { setShowApprove(false); setApprovalComment(''); onUpdate(); }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setSubmitting(true);
    const result = await rejectVerification(v.id, rejectionReason);
    setSubmitting(false);
    if (result.success) { setShowReject(false); setRejectionReason(''); onUpdate(); }
  };

  const fmtDate = (d?: string) => d
    ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Non défini';

  const canAct = v.status === 'submitted' || v.status === 'under_review';

  return (
    <>
      <style>{drillStyles}</style>
      <DrillPage
        title={`${v.first_name || ''} ${v.last_name || ''}`.trim() || 'Vérification'}
        sub={`ID ${v.user_id.slice(0, 12)}…`}
        onBack={onBack}
        right={<StatusText status={v.status} label={STATUS_LABEL[v.status] || v.status} />}
      >
        {/* Actions */}
        {canAct && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {v.status === 'submitted' && (
              <Button onClick={async () => { await setUnderReview(v.id); onUpdate(); }}
                style={{ background: '#2d2d2d', border: `1px solid ${BORDER}`, color: '#fff', flex: '1 1 150px' }}>
                <Clock className="h-4 w-4 mr-2" /> Mettre en révision
              </Button>
            )}
            <Button onClick={() => setShowApprove(true)}
              style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none', flex: '1 1 150px' }}>
              <CheckCircle className="h-4 w-4 mr-2" /> Approuver
            </Button>
            <Button onClick={() => setShowReject(true)}
              style={{ background: 'transparent', color: '#e07a7a', border: `1px solid rgba(255,255,255,0.12)`, flex: '1 1 150px' }}>
              <XCircle className="h-4 w-4 mr-2" /> Rejeter
            </Button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, alignItems: 'start' }}>
          {/* Informations personnelles */}
          <DetailSection title="Informations personnelles" icon={User}>
            <div style={{ display: 'grid', gap: 12 }}>
              <Field label="Nom complet" value={`${v.first_name || ''} ${v.last_name || ''}`.trim() || 'Non fourni'} />
              <Field label="Date de naissance" value={v.date_of_birth || 'Non fournie'} />
              <Field label="Nationalité" value={v.nationality || 'Non fournie'} />
              <Field label="Téléphone" value={v.phone_number || 'Non fourni'} copyable={!!v.phone_number} onCopy={() => navigator.clipboard.writeText(v.phone_number || '')} />
            </div>
          </DetailSection>

          {/* Adresse */}
          <DetailSection title="Adresse" icon={MapPin}>
            {v.address ? (
              <div style={{ display: 'grid', gap: 12 }}>
                <Field label="Adresse" value={v.address} />
                <Field label="Ville / Code postal" value={`${v.city || '—'}${v.postal_code ? `, ${v.postal_code}` : ''}`} />
                <Field label="Pays" value={v.country || '—'} />
              </div>
            ) : <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Aucune adresse fournie.</p>}
          </DetailSection>

          {/* Document d'identité */}
          <DetailSection title="Document d'identité" icon={CreditCard}>
            <div style={{ display: 'grid', gap: 12 }}>
              <Field label="Type" value={DOC_TYPE[v.identity_document_type || ''] || 'Non fourni'} />
              <Field label="Numéro" value={v.identity_document_number || 'Non fourni'} mono copyable={!!v.identity_document_number} onCopy={() => navigator.clipboard.writeText(v.identity_document_number || '')} />
            </div>
          </DetailSection>

          {/* Historique */}
          <DetailSection title="Historique" icon={Calendar}>
            <div style={{ display: 'grid', gap: 12 }}>
              <Field label="Créé le" value={fmtDate(v.created_at)} />
              {v.submitted_at && <Field label="Soumis le" value={fmtDate(v.submitted_at)} />}
              {v.reviewed_at && <Field label="Révisé le" value={fmtDate(v.reviewed_at)} />}
              {v.rejection_reason && (
                <div>
                  <p style={{ color: '#e07a7a', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 3px' }}>Raison du rejet</p>
                  <p style={{ color: '#fff', fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>{v.rejection_reason}</p>
                </div>
              )}
            </div>
          </DetailSection>
        </div>

        {/* Documents fournis */}
        <DetailSection title="Documents fournis" icon={Eye}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <DocumentImage url={v.identity_document_front_url} alt="Document recto" title="Pièce d'identité (recto)" />
            <DocumentImage url={v.identity_document_back_url} alt="Document verso" title="Pièce d'identité (verso)" />
            <DocumentImage url={v.selfie_url} alt="Selfie" title="Photo selfie" />
            <DocumentImage url={v.proof_of_address_url} alt="Justificatif de domicile" title="Justificatif de domicile" />
          </div>
        </DetailSection>
      </DrillPage>

      {/* Dialog Approuver */}
      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent className="w-[95vw] max-w-lg bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <DialogHeader><DialogTitle className="text-white">Approuver la vérification</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Vous êtes sur le point d'approuver cette vérification d'identité.</p>
            <Textarea placeholder="Commentaire optionnel…" value={approvalComment} onChange={(e) => setApprovalComment(e.target.value)}
              className="text-white" style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }} />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => setShowApprove(false)} style={{ background: '#2d2d2d', border: `1px solid ${BORDER}`, color: '#fff' }}>Annuler</Button>
            <Button onClick={handleApprove} disabled={submitting} style={{ background: '#fff', color: '#141414', fontWeight: 700, border: 'none' }}>
              {submitting ? 'Traitement…' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rejeter */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="w-[95vw] max-w-lg bg-[#1e1e1e] border-[rgba(255,255,255,0.07)] text-white">
          <DialogHeader><DialogTitle className="text-white">Rejeter la vérification</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Veuillez indiquer la raison du rejet.</p>
            <Textarea placeholder="Raison du rejet (obligatoire)…" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
              className="text-white" style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12 }} required />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => setShowReject(false)} style={{ background: '#2d2d2d', border: `1px solid ${BORDER}`, color: '#fff' }}>Annuler</Button>
            <Button onClick={handleReject} disabled={submitting || !rejectionReason.trim()}
              style={{ background: 'transparent', color: '#e07a7a', border: `1px solid rgba(255,255,255,0.12)` }}>
              {submitting ? 'Traitement…' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
