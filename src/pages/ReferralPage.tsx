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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const REWARDS = [
  { Icon: Users, kicker: 'Pour vous', value: '5%', sub: 'de bonus sur chaque transaction' },
  { Icon: Gift, kicker: 'Pour votre filleul', value: '3%', sub: 'de bonus sur sa première transaction' },
  { Icon: TrendingUp, kicker: 'Sans limite', value: '∞', sub: 'parrainez autant que vous voulez' },
];

const STEPS = [
  { n: '1', title: 'Partagez votre code', desc: 'Envoyez votre code de parrainage à vos amis.' },
  { n: '2', title: 'Inscription', desc: "Votre ami s'inscrit avec votre code." },
  { n: '3', title: 'Gagnez ensemble', desc: 'Vous recevez tous les deux des bonus sur vos transactions.' },
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
        .rf-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .rf-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .rf-cta { transition: transform 0.15s ease, opacity 0.2s ease; }
        .rf-cta:hover { transform: translateY(-1px); }
        @keyframes rf-skel { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .rf-skel { animation: rf-skel 1.4s ease-in-out infinite; }
        @media (max-width: 1100px) { .rf-vline { display: none !important; } }
        @media (max-width: 860px) {
          .rf-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .rf-rewards { grid-template-columns: 1fr !important; }
          .rf-steps { grid-template-columns: 1fr !important; }
          .rf-stats { grid-template-columns: 1fr !important; }
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

        {/* HERO */}
        <div className="rf-fade" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>Parrainage</p>
          <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 16px' }}>
            Invitez vos amis,<br />gagnez ensemble
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
            Partagez votre code et recevez des bonus à chaque fois qu'un proche rejoint Terex.
            <span style={{ display: 'inline-block', marginLeft: 6 }}>
              Taux actuel{' '}
              {rateDisplay ? (
                <span style={{ color: '#fff', fontWeight: 600 }}>{rateDisplay} CFA</span>
              ) : (
                <span className="rf-skel" style={{ display: 'inline-block', width: 70, height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.08)', verticalAlign: 'middle' }} />
              )}{' '}
              / USDT.
            </span>
          </p>
        </div>

        {/* Carte code de parrainage */}
        <div className="rf-fade" style={{ marginTop: 44, border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: 'clamp(24px,4vw,36px)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 18px' }}>Votre code unique</p>

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

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>Lien de parrainage</p>
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

        {/* Récompenses */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Avantages</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <Award size={22} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Vos récompenses</h2>
          </div>
          <div className="rf-rewards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {REWARDS.map(({ Icon, kicker, value, sub }) => (
              <div key={kicker} className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', fontWeight: 500 }}>{kicker}</p>
                <p style={{ fontSize: 'clamp(1.8rem,4vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 8px' }}>{value}</p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment ça marche */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Comment ça marche</p>
          <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Trois étapes simples</h2>
          <div className="rf-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 15, fontWeight: 700 }}>{n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Suivi</p>
          <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Vos parrainages</h2>
          <div className="rf-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 26px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Filleuls actifs</p>
              <p style={{ fontSize: 'clamp(2rem,5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>0</p>
            </div>
            <div className="rf-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 26px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Bonus gagnés</p>
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
