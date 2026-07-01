import { ArrowRight, Shield, Zap, Globe, Coins, HandCoins, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from '@/hooks/useScrollAnimation';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');
  const handleDashboard = () => onShowDashboard?.();
  const handleHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative" style={{ background: '#1a1a1a' }}>
      {/* Halo doux, centré, très subtil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px]" style={{
        background: 'radial-gradient(50% 60% at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 75%)',
      }} />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center">

        {/* Badge */}
        <AnimatedSection delay={60}>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-7"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: '#fff' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#fff' }} />
            </span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Teranga Exchange</span>
          </div>
        </AnimatedSection>

        {/* Titre */}
        <AnimatedSection delay={120}>
          <h1 className="font-bold tracking-[-0.025em] text-white mx-auto"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)', lineHeight: 1.05, maxWidth: '16ch' }}>
            Le moyen le plus simple d'échanger des{' '}
            <span className="inline-flex items-center gap-2 align-middle">USDT
              <img src={TETHER} alt="USDT" style={{ width: '0.82em', height: '0.82em', display: 'inline-block', opacity: 0.92 }} />
            </span>
          </h1>
        </AnimatedSection>

        {/* Sous-titre */}
        <AnimatedSection delay={180}>
          <p className="mt-6 mx-auto text-base lg:text-lg" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: '46ch' }}>
            Achetez, vendez et transférez de l'argent vers l'Afrique en quelques minutes. Rapide, sécurisé, au meilleur taux CFA.
          </p>
        </AnimatedSection>

        {/* CTAs */}
        <AnimatedSection delay={240}>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={user ? handleDashboard : handleGetStarted}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 text-[15px] font-bold transition-transform hover:scale-[1.02]"
              style={{ background: '#ffffff', color: '#141414' }}>
              {user ? 'Tableau de bord' : 'Commencer gratuitement'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={handleHowItWorks}
              className="inline-flex items-center justify-center rounded-xl px-7 h-12 text-[15px] font-semibold transition-colors"
              style={{ background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
              Comment ça marche
            </button>
          </div>
        </AnimatedSection>

        {/* Trust */}
        <AnimatedSection delay={300}>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {[{ Icon: Shield, text: 'Sécurisé · KYC' }, { Icon: Zap, text: 'En moins de 5 min' }, { Icon: Globe, text: '6 pays d\'Afrique' }].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Aperçu produit — la vraie UI de l'app */}
        <AnimatedSection delay={380}>
          <div className="mt-16 lg:mt-20">
            <ProductPreview />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Aperçu de l'app dans un cadre élégant (design system réel)
function ProductPreview() {
  const actions = [
    { Icon: Coins, label: 'Acheter', sub: 'Achat rapide' },
    { Icon: HandCoins, label: 'Vendre', sub: 'Vente rapide' },
    { Icon: Send, label: 'Virement', sub: 'International' },
  ];
  return (
    <div className="mx-auto text-left" style={{
      maxWidth: '780px', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px', padding: '10px', boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
    }}>
      {/* Barre fenêtre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px 14px' }}>
        {['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.08)'].map((c, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Rate card */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '18px', marginBottom: '14px' }}>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Taux USDT / CFA</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: '#fff', fontSize: 34, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>660</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 600 }}>CFA</span>
            </div>
            <img src={TETHER} alt="USDT" style={{ width: 38, height: 38, opacity: 0.9 }} />
          </div>
        </div>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {actions.map(({ Icon, label, sub }) => (
            <div key={label} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '14px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon className="w-[18px] h-[18px]" style={{ color: 'rgba(255,255,255,0.85)' }} />
              </div>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>{label}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
