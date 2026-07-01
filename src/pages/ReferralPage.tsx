import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';
import {
  Gift,
  Copy,
  Share2,
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  Check,
  UserPlus,
  Coins,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const CARD2 = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const STEPS = [
  { n: '1', title: 'Partagez votre code', desc: 'Envoyez votre code de parrainage à vos amis.' },
  { n: '2', title: 'Inscription', desc: "Votre ami s'inscrit avec votre code." },
  { n: '3', title: 'Gagnez ensemble', desc: 'Vous recevez tous les deux des bonus sur vos transactions.' },
];

// Activité simulée du tableau de bord (aperçu réaliste de l'app)
const INVITES = [
  { initials: 'AD', name: 'Aminata D.', status: 'Actif', when: 'il y a 2 j' },
  { initials: 'MK', name: 'Moussa K.', status: 'Inscrit', when: 'il y a 5 j' },
  { initials: 'FS', name: 'Fatou S.', status: 'En attente', when: 'il y a 1 sem' },
];

export default function ReferralPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  // Génération d'un code de parrainage basé sur l'ID utilisateur
  const referralCode = user?.id ? `TEREX-${user.id.slice(0, 8).toUpperCase()}` : 'TEREX-XXXXX';
  const referralLink = `https://terangaexchange.com/auth?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({ title: 'Code copié !', description: 'Votre code de parrainage a été copié' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({ title: 'Lien copié !', description: 'Votre lien de parrainage a été copié' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoignez Terex',
          text: `Utilisez mon code de parrainage ${referralCode} pour rejoindre Terex et profiter d'avantages exclusifs !`,
          url: referralLink,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes rf-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rf-fade { animation: rf-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .rf-fade-2 { animation: rf-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .rf-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .rf-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .rf-cta { transition: transform 0.15s ease, opacity 0.2s ease; }
        .rf-cta:hover { transform: translateY(-1px); }
        @keyframes rf-skel { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .rf-skel { animation: rf-skel 1.4s ease-in-out infinite; }
        @keyframes rf-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
        .rf-live-dot { animation: rf-pulse 1.6s ease-in-out infinite; }
        @media (max-width: 1100px) { .rf-vline { display: none !important; } }
        @media (max-width: 920px) {
          .rf-dash { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .rf-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .rf-rewards { grid-template-columns: 1fr !important; grid-auto-rows: auto !important; }
          .rf-reward-feat { grid-column: auto !important; grid-row: auto !important; }
          .rf-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="rf-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="rf-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="rf-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 32px 96px', position: 'relative', zIndex: 1 }}>
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="rf-cta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 48 }}
        >
          <ArrowLeft size={16} /> Retour
        </button>

        {/* HERO + MOCKUP tableau de bord parrainage */}
        <div className="rf-dash" style={{ display: 'grid', gridTemplateColumns: '1fr 1.02fr', gap: 56, alignItems: 'center' }}>
          <div className="rf-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 14px' }}>Parrainage</p>
            <h1 style={{ fontSize: 'clamp(2rem,4.4vw,2.9rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 16px' }}>
              Invitez vos amis,<br />gagnez ensemble
            </h1>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.6, margin: '0 0 14px', maxWidth: 440 }}>
              Partagez votre code et recevez des bonus à chaque fois qu'un proche rejoint Terex.
            </p>
            <p style={{ fontSize: 14, color: MUTED2, margin: 0 }}>
              Taux actuel{' '}
              {rateDisplay ? (
                <span style={{ color: '#fff', fontWeight: 600 }}>{rateDisplay} CFA</span>
              ) : (
                <span className="rf-skel" style={{ display: 'inline-block', width: 70, height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.08)', verticalAlign: 'middle' }} />
              )}{' '}
              / USDT.
            </p>
          </div>

          {/* MOCKUP — panneau tableau de bord (style app) */}
          <div className="rf-fade-2" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 20 }}>
            {/* En-tête panneau */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift size={18} color="#fff" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Mon parrainage</span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: MUTED }}>
                <span style={{ position: 'relative', width: 7, height: 7 }}>
                  <span className="rf-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} />
                </span>
                Actif
              </span>
            </div>

            {/* Bloc code (style app) */}
            <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px', marginBottom: 14 }}>
              <p style={{ fontSize: 10.5, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Votre code</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'ui-monospace, Menlo, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralCode}</span>
                <button onClick={handleCopyCode} className="rf-cta" style={{ flexShrink: 0, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, height: 36, padding: '0 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
            </div>

            {/* Strip statistiques */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { Icon: UserPlus, label: 'Invités', value: '3' },
                { Icon: Users, label: 'Actifs', value: '1' },
                { Icon: Coins, label: 'Bonus', value: '12 USDT' },
              ].map(({ Icon, label, value }) => (
                <div key={label} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 12px' }}>
                  <Icon size={15} color="rgba(255,255,255,0.55)" strokeWidth={1.8} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10.5, color: MUTED2, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Liste d'invitations */}
            <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '6px 6px' }}>
              {INVITES.map((inv, i) => (
                <div key={inv.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderTop: i === 0 ? 'none' : `1px solid ${BORDER}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: ICON_BG, border: `1px solid rgba(255,255,255,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.name}</div>
                    <div style={{ fontSize: 11, color: MUTED2 }}>{inv.when}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: inv.status === 'Actif' ? 'rgba(255,255,255,0.55)' : MUTED, background: inv.status === 'Actif' ? 'rgba(74,222,128,0.1)' : ICON_BG, borderRadius: 999, padding: '4px 10px' }}>{inv.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carte code de parrainage (réelle, avec handlers) */}
        <div className="rf-fade" style={{ marginTop: 56, border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: 'clamp(24px,4vw,36px)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 18px' }}>Votre code unique</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px', background: 'rgba(255,255,255,0.02)', marginBottom: 16 }}>
            <span style={{ fontSize: 'clamp(1.4rem,3.5vw,2rem)', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{referralCode}</span>
            <button
              onClick={handleCopyCode}
              className="rf-cta"
              style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 44, padding: '0 20px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copié !' : 'Copier le code'}
            </button>
          </div>

          <p style={{ fontSize: 13, color: MUTED2, margin: '0 0 8px' }}>Lien de parrainage</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', minWidth: 0, border: `1px solid ${BORDER}`, borderRadius: 12, height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', background: BG, fontSize: 13.5, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="rf-cta"
              style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 44, padding: '0 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {linkCopied ? <Check size={16} /> : <Copy size={16} />} {linkCopied ? 'Copié' : 'Copier'}
            </button>
            <button
              onClick={handleShare}
              className="rf-cta"
              style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 44, padding: '0 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Share2 size={16} /> Partager
            </button>
          </div>
        </div>

        {/* Récompenses — bento (une vedette) */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>Avantages</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <Award size={22} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Vos récompenses</h2>
          </div>
          <div className="rf-rewards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 14 }}>
            {/* Vedette : 5% pour vous */}
            <div className="rf-reward-feat rf-tile" style={{ gridColumn: '1 / 2', gridRow: '1 / 3', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Users size={22} color="#fff" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: 12, color: MUTED2, margin: '0 0 8px', fontWeight: 500 }}>Pour vous</p>
                <p style={{ fontSize: 'clamp(2.6rem,6vw,3.4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 10px' }}>5%</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>de bonus sur chaque transaction de vos filleuls.</p>
              </div>
              <div style={{ marginTop: 24, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: MUTED }}>Sur 1 000 USDT échangés</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>+50 USDT</span>
              </div>
            </div>

            {[
              { Icon: Gift, kicker: 'Pour votre filleul', value: '3%', sub: 'de bonus sur sa première transaction.' },
              { Icon: TrendingUp, kicker: 'Sans limite', value: '∞', sub: 'parrainez autant de proches que vous le souhaitez.' },
            ].map(({ Icon, kicker, value, sub }) => (
              <div key={kicker} className="rf-tile" style={{ gridColumn: '2 / 4', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '24px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: MUTED2, margin: '0 0 4px', fontWeight: 500 }}>{kicker}</p>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>{sub}</p>
                </div>
                <p style={{ fontSize: 'clamp(2rem,4vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: 0, flexShrink: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment ça marche — étapes numérotées en timeline horizontale */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>Comment ça marche</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Trois étapes simples</h2>
          <div className="rf-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="rf-tile" style={{ position: 'relative', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', color: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{n}</div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: BORDER }} />}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suivi — réels (0 pour l'utilisateur) */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>Suivi</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Vos parrainages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="rf-steps">
            <div className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 26px' }}>
              <p style={{ fontSize: 13, color: MUTED2, margin: '0 0 10px' }}>Filleuls actifs</p>
              <p style={{ fontSize: 'clamp(2rem,5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>0</p>
            </div>
            <div className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 26px' }}>
              <p style={{ fontSize: 13, color: MUTED2, margin: '0 0 10px' }}>Bonus gagnés</p>
              <p style={{ fontSize: 'clamp(2rem,5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                0 <span style={{ fontSize: '0.45em', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>CFA</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
