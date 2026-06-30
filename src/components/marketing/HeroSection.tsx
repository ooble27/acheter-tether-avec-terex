import { ArrowRight, Shield, Globe, Zap, Coins, HandCoins, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroBuyForm } from './HeroBuyForm';
import { AnimatedSection } from '@/hooks/useScrollAnimation';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';

// Petits badges crypto flottants — illustration neutre
const COINS = [
  { sym: '₿',  label: 'BTC',  top: '6%',  left: '4%',  size: 46, delay: 0,   dur: 6 },
  { sym: 'Ξ',  label: 'ETH',  top: '62%', left: '2%',  size: 38, delay: 1.2, dur: 7 },
  { sym: '$',  label: 'USDC', top: '12%', left: '88%', size: 40, delay: 0.6, dur: 6.5 },
  { sym: '₮',  label: 'USDT', top: '70%', left: '90%', size: 44, delay: 1.8, dur: 7.5 },
];

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');
  const handleDashboard = () => onShowDashboard?.();
  const handleHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });

  const trust = [
    { Icon: Shield, text: 'Sécurisé · KYC' },
    { Icon: Zap, text: 'En moins de 5 min' },
    { Icon: Globe, text: '6 pays d\'Afrique' },
  ];

  return (
    <div className="relative overflow-hidden" style={{ background: '#141414' }}>
      <style>{`
        @keyframes hero-float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-16px) rotate(4deg); }
        }
      `}</style>

      {/* Halo doux derrière le contenu */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)',
      }} />

      {/* Badges crypto flottants (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {COINS.map((c) => (
          <div key={c.label} style={{ position: 'absolute', top: c.top, left: c.left, animation: `hero-float ${c.dur}s ${c.delay}s ease-in-out infinite` }}>
            <div style={{
              width: c.size, height: c.size, borderRadius: '50%',
              background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.75)', fontSize: c.size * 0.42, fontWeight: 700,
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}>{c.sym}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Texte ── */}
          <AnimatedSection className="text-center lg:text-left" delay={100}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: '#fff' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#fff' }} />
              </span>
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Teranga Exchange · USDT en CFA</span>
            </div>

            <h1 className="font-bold tracking-[-0.02em] text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
              Achetez et vendez<br className="hidden sm:block" /> des{' '}
              <span className="inline-flex items-center gap-2 align-middle">USDT
                <img src={TETHER} alt="USDT" style={{ width: '0.9em', height: '0.9em', display: 'inline-block', opacity: 0.9 }} />
              </span><br className="hidden sm:block" /> en toute simplicité
            </h1>

            <p className="mt-5 text-base lg:text-lg max-w-xl mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Échangez vos stablecoins et envoyez de l'argent vers l'Afrique en quelques minutes. Rapide, sécurisé, au meilleur taux CFA.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={user ? handleDashboard : handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 text-[15px] font-bold transition-transform hover:scale-[1.02]"
                style={{ background: '#ffffff', color: '#141414' }}>
                {user ? 'Tableau de bord' : 'Commencer'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={handleHowItWorks}
                className="inline-flex items-center justify-center rounded-xl px-7 h-12 text-[15px] font-semibold transition-colors"
                style={{ background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
                Comment ça marche
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
              {trust.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ── Formulaire ── */}
          <AnimatedSection className="flex justify-center lg:justify-end" delay={250} direction="right">
            <HeroBuyForm />
          </AnimatedSection>
        </div>

        {/* ── Cartes fonctionnalités ── */}
        <AnimatedSection className="mt-16 lg:mt-24" delay={350}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: Coins,     title: 'Achat USDT',  items: ['Achat instantané', 'Meilleur taux CFA', '5 réseaux supportés'] },
              { Icon: Send,      title: 'Transferts',  items: ['6 pays d\'Afrique', 'Mobile Money', 'En moins de 5 min'], highlight: true },
              { Icon: HandCoins, title: 'Vente rapide', items: ['Wave & Orange Money', 'Paiement immédiat', 'Sans commission'] },
            ].map(({ Icon, title, items, highlight }) => (
              <div key={title} style={{
                background: '#1e1e1e',
                border: `1px solid ${highlight ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px', padding: '22px',
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.85)' }} />
                  </div>
                  <span className="font-semibold text-white text-[15px]">{title}</span>
                  {highlight && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>Live</span>}
                </div>
                <div className="space-y-2">
                  {items.map((it) => (
                    <div key={it} className="flex items-center gap-2.5">
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
