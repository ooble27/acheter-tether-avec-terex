import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import {
  Share2,
  ArrowLeft,
  MessageCircle,
  Mail,
  Link2,
  Facebook,
  Twitter,
  Linkedin,
  Users,
  Heart,
  Sparkles,
  ArrowUpRight,
  Check,
  ArrowDownLeft,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const CARD2 = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';
const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';

const SOCIALS: { id: string; label: string; sub: string; Icon: typeof MessageCircle }[] = [
  { id: 'whatsapp', label: 'WhatsApp', sub: 'Conversation', Icon: MessageCircle },
  { id: 'facebook', label: 'Facebook', sub: 'Publication', Icon: Facebook },
  { id: 'twitter', label: 'Twitter', sub: 'Tweet', Icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', sub: 'Réseau pro', Icon: Linkedin },
  { id: 'email', label: 'Email', sub: 'Message direct', Icon: Mail },
];

const WHY = [
  { Icon: Heart, title: 'Aidez vos proches', desc: "Permettez à votre entourage d'accéder facilement aux cryptomonnaies." },
  { Icon: Users, title: 'Faites grandir la communauté', desc: 'Plus nous sommes nombreux, plus Terex peut s\'améliorer.' },
  { Icon: Sparkles, title: 'Simplifiez les transactions', desc: 'Facilitez les échanges USDT avec vos amis et votre famille.' },
];

export default function SharePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  const appUrl = 'https://terangaexchange.com';
  const shareMessage = "Découvrez Terex - La plateforme pour acheter et vendre des USDT en Afrique de l'Ouest facilement et en toute sécurité !";

  const handleShare = async (platform?: string) => {
    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title: 'Terex - Plateforme USDT',
          text: shareMessage,
          url: appUrl,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Lien copié !',
      description: 'Le lien a été copié dans le presse-papier',
    });
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(appUrl);
    const encodedMessage = encodeURIComponent(shareMessage);

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Découvrez Terex')}&body=${encodedMessage}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes sp-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .sp-fade { animation: sp-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .sp-fade-2 { animation: sp-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .sp-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .sp-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .sp-cta { transition: transform 0.15s ease, opacity 0.2s ease; }
        .sp-cta:hover { transform: translateY(-1px); }
        @keyframes sp-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
        .sp-live-dot { animation: sp-pulse 1.6s ease-in-out infinite; }
        @media (max-width: 1100px) { .sp-vline { display: none !important; } }
        @media (max-width: 920px) {
          .sp-hero { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .sp-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .sp-why { grid-template-columns: 1fr !important; }
          .sp-socials { grid-template-columns: 1fr 1fr !important; }
          .sp-actions { flex-direction: column !important; }
          .sp-actions > button { width: 100% !important; }
        }
      `}</style>

      {/* Guides verticaux */}
      <div className="sp-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="sp-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="sp-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 32px 96px', position: 'relative', zIndex: 1 }}>
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="sp-cta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 48 }}
        >
          <ArrowLeft size={16} /> Retour
        </button>

        {/* HERO — éditorial + mockup carte de partage */}
        <div className="sp-hero" style={{ display: 'grid', gridTemplateColumns: '1fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div className="sp-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 14px' }}>Partage</p>
            <h1 style={{ fontSize: 'clamp(2rem,4.4vw,2.9rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 16px' }}>
              Faites découvrir<br />Terex à vos proches
            </h1>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.6, margin: '0 0 30px', maxWidth: 440 }}>
              En un clic, partagez la plateforme la plus simple pour acheter et vendre des USDT en CFA — voici l'aperçu que vos proches recevront.
            </p>
            <div className="sp-actions" style={{ display: 'flex', gap: 12, maxWidth: 420 }}>
              <button
                onClick={() => handleShare()}
                className="sp-cta"
                style={{ flex: 1, background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Share2 size={17} /> Partager
              </button>
              <button
                onClick={handleCopyLink}
                className="sp-cta"
                style={{ flex: 1, background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {copied ? <Check size={17} /> : <Link2 size={17} />} {copied ? 'Copié !' : 'Copier le lien'}
              </button>
            </div>
          </div>

          {/* MOCKUP — carte de partage / aperçu de l'app */}
          <div className="sp-fade-2" style={{ position: 'relative' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: 14, boxShadow: '0 30px 80px -30px rgba(0,0,0,0.7)' }}>
              {/* Aperçu enrichi (style social card) */}
              <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                {/* Bandeau visuel */}
                <div style={{ position: 'relative', height: 150, background: 'radial-gradient(120% 140% at 80% 0%, rgba(255,255,255,0.08) 0%, transparent 55%), #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ position: 'relative', width: 7, height: 7 }}>
                      <span className="sp-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} />
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Taux en direct</span>
                  </div>
                  <img src={TETHER} alt="USDT" style={{ width: 64, height: 64, opacity: 0.95 }} />
                </div>
                {/* Corps de la carte */}
                <div style={{ background: CARD2, padding: '20px 22px' }}>
                  <p style={{ fontSize: 11, color: MUTED2, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>terangaexchange.com</p>
                  <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Achetez et vendez des USDT</h3>
                  <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.5, margin: '0 0 16px' }}>
                    La façon la plus simple d'échanger des USDT en CFA en Afrique de l'Ouest.
                  </p>
                  {/* Taux live + actions miniatures de l'app */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '12px 16px' }}>
                    <div>
                      <div style={{ fontSize: 10, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>1 USDT</div>
                      {rateDisplay
                        ? <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{rateDisplay} <span style={{ fontSize: 11, color: MUTED2, fontWeight: 600 }}>CFA</span></div>
                        : <div style={{ width: 90, height: 20, borderRadius: 6, background: ICON_BG, marginTop: 2 }} />}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fff', color: '#141414', borderRadius: 10, padding: '7px 11px', fontSize: 11.5, fontWeight: 700 }}>
                        <ArrowDownLeft size={12} /> Acheter
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: ICON_BG, color: '#fff', borderRadius: 10, padding: '7px 11px', fontSize: 11.5, fontWeight: 600 }}>
                        <ArrowUpRight size={12} /> Vendre
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Étiquette "aperçu partagé" */}
            <div style={{ position: 'absolute', top: -12, right: 22, background: '#fff', color: '#141414', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '5px 12px', boxShadow: '0 8px 20px -6px rgba(0,0,0,0.6)' }}>Aperçu partagé</div>
          </div>
        </div>

        {/* Réseaux sociaux — tuiles neutres */}
        <div style={{ marginTop: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>Réseaux</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Partager sur</h2>
          <div className="sp-socials" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {SOCIALS.map(({ id, label, sub, Icon }) => (
              <button
                key={id}
                onClick={() => handleSocialShare(id)}
                className="sp-tile"
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 16px', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={19} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight size={15} color="rgba(255,255,255,0.2)" />
                </div>
                <p style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 12, color: MUTED2, margin: 0 }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message suggéré + Pourquoi (éditorial 2 colonnes) */}
        <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
          <div style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '26px 28px', position: 'relative' }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 14px' }}>Message suggéré</p>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 10px', fontWeight: 500 }}>{shareMessage}</p>
            <p style={{ fontSize: 14, color: MUTED2, margin: 0, fontFamily: 'ui-monospace, Menlo, monospace' }}>{appUrl}</p>
          </div>
        </div>

        {/* Pourquoi partager — bento (une tuile vedette communauté) */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>Pourquoi partager</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Chaque partage compte</h2>
          <div className="sp-why" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 14, alignItems: 'stretch' }}>
            {/* Vedette communauté avec étoiles */}
            <div className="sp-tile" style={{ gridColumn: '1 / 2', gridRow: '1 / 3', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, color: MUTED2, margin: '0 0 6px' }}>Rejoignez</p>
                <p style={{ fontSize: 'clamp(2.4rem,6vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 8px' }}>10 000+</p>
                <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>utilisateurs satisfaits qui échangent au meilleur taux.</p>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 22 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="rgba(255,255,255,0.85)" color="rgba(255,255,255,0.85)" />
                ))}
              </div>
            </div>
            {WHY.map(({ Icon, title, desc }, idx) => (
              <div key={title} className="sp-tile" style={{ gridColumn: idx === 2 ? '2 / 4' : 'auto', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '24px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
