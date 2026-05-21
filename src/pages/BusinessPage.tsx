import { useAuth } from '@/contexts/AuthContext';
import { BusinessDashboard } from '@/components/business/BusinessDashboard';
import { BusinessLanding } from '@/components/marketing/BusinessLanding';
import { BusinessKYBWizard } from '@/components/business/BusinessKYBWizard';
import { useBusinessKYB } from '@/hooks/useBusinessKYB';

// ─── Pending review inline screen ─────────────────────────────────────────────
function PendingReviewScreen() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#3B968F]/15 border border-[#3B968F]/30 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#3B968F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Dossier en cours d'examen</h1>
          <p className="text-[#888] text-sm leading-relaxed">
            Notre équipe examine votre dossier. Vous serez notifié par email sous 24–48h.
          </p>
        </div>
        <div className="bg-[#181818] border border-[#222] rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-[#3B968F] uppercase tracking-wider mb-3">
            Ce qui est vérifié
          </p>
          {[
            "Informations de l'entreprise",
            'Identité du représentant légal',
            'Documents RCCM & NINEA',
            'Justificatif de domicile',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#3B968F]/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-[#3B968F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#ccc] text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Inner component that has access to user id ────────────────────────────────
function BusinessPageInner({ userId }: { userId: string }) {
  const { data, loading, refetch } = useBusinessKYB(userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#3B968F] flex items-center justify-center">
            <span className="text-black font-black text-xs">TB</span>
          </div>
          <p className="text-[#666] text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (data.status === 'approved') {
    return <BusinessDashboard user={{ id: userId, email: '', name: '' }} />;
  }

  if (data.status === 'submitted' || data.status === 'under_review') {
    return <PendingReviewScreen />;
  }

  // 'pending' or 'rejected'
  return (
    <BusinessKYBWizard
      userId={userId}
      onComplete={() => { refetch(); }}
    />
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
const BusinessPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#3B968F] flex items-center justify-center">
            <span className="text-black font-black text-xs">TB</span>
          </div>
          <p className="text-[#666] text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return <BusinessLanding />;

  return <BusinessPageInner userId={user.id} />;
};

export default BusinessPage;
