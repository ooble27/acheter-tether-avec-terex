import { useToast } from '@/hooks/use-toast';
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
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
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
        .sp-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .sp-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .sp-cta { transition: transform 0.15s ease, opacity 0.2s ease; }
        .sp-cta:hover { transform: translateY(-1px); }
        @media (max-width: 1100px) { .sp-vline { display: none !important; } }
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

        {/* HERO */}
        <div className="sp-fade" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>Partage</p>
          <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 16px' }}>
            Faites découvrir Terex<br />à vos proches
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
            En un clic, partagez la plateforme la plus simple pour acheter et vendre des USDT en CFA.
          </p>
        </div>

        {/* Carte de partage principale */}
        <div className="sp-fade" style={{ marginTop: 44, border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: 'clamp(24px,4vw,36px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={TETHER} alt="USDT" style={{ width: 30, height: 30, opacity: 0.9 }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 3px' }}>terangaexchange.com</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>Acheter & vendre des USDT en CFA</p>
            </div>
          </div>

          <div className="sp-actions" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
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

        {/* Réseaux sociaux — tuiles neutres */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Réseaux</p>
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
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message suggéré */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Message</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Message suggéré</h2>
          <div style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 16, padding: '24px 26px' }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, margin: '0 0 10px' }}>{shareMessage}</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{appUrl}</p>
          </div>
        </div>

        {/* Pourquoi partager */}
        <div style={{ marginTop: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Pourquoi partager</p>
          <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 28px' }}>Chaque partage compte</h2>
          <div className="sp-why" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {WHY.map(({ Icon, title, desc }) => (
              <div key={title} className="sp-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bandeau communauté */}
        <div style={{ marginTop: 28, border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: 'clamp(28px,4vw,40px)', textAlign: 'center' }}>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', margin: '0 0 8px' }}>Rejoignez</p>
          <p style={{ fontSize: 'clamp(2.4rem,6vw,3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 8px' }}>10 000+</p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: 0 }}>utilisateurs satisfaits qui échangent au meilleur taux</p>
        </div>
      </div>
    </div>
  );
}
