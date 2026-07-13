import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle2, Send } from 'lucide-react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobApplicationForm } from '@/components/features/JobApplicationForm';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const JobApplicationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  // Le poste voyage dans l'URL (?poste=...) → survit à un rafraîchissement.
  const position = params.get('poste') || 'Candidature spontanée';

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .ja-wrap { padding-left: 16px !important; padding-right: 16px !important; }
          .ja-card { padding: 20px 16px !important; border-radius: 18px !important; }
          .ja-title { font-size: 24px !important; }
        }
      `}</style>

      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div style={{ height: 64 }} />

      <div className="ja-wrap" style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Retour */}
        <button
          onClick={() => navigate('/careers')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: MUTED, fontSize: 14, cursor: 'pointer', padding: '4px 0', marginBottom: 20 }}
        >
          <ArrowLeft size={16} /> Retour aux offres
        </button>

        {submitted ? (
          /* ── Écran de confirmation ── */
          <div className="ja-card" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={30} color="#34d399" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px' }}>Candidature envoyée !</h1>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
              Merci pour votre intérêt. Notre équipe examine votre candidature pour le poste de <strong style={{ color: '#fff', fontWeight: 600 }}>{position}</strong> et vous recontactera par email.
            </p>
            <button
              onClick={() => navigate('/careers')}
              style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 48, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Voir les autres offres
            </button>
          </div>
        ) : (
          <>
            {/* En-tête du poste */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Briefcase size={22} color="#fff" strokeWidth={1.8} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 4px' }}>Candidature</p>
                <h1 className="ja-title" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{position}</h1>
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.6, margin: '0 0 28px' }}>
              Remplissez le formulaire ci-dessous. Les champs marqués d'un astérisque (*) sont obligatoires.
            </p>

            {/* Formulaire */}
            <div className="ja-card" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: '28px 26px' }}>
              <JobApplicationForm
                position={position}
                onClose={() => navigate('/careers')}
                onSubmitted={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          </>
        )}
      </div>

      <FooterSection />
    </div>
  );
};

export default JobApplicationPage;
