import { ArrowUpRight, Coins, HandCoins, Send, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useEffect } from 'react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const ACCENT_LIGHT = '#4BA89F';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const ICON_COLOR = 'rgba(255,255,255,0.85)';

const quickActions = [
  { id: 'buy',      label: 'Acheter',  icon: Coins,     sub: 'Achat rapide'  },
  { id: 'sell',     label: 'Vendre',   icon: HandCoins, sub: 'Vente rapide'  },
  { id: 'transfer', label: 'Virement', icon: Send,      sub: 'International' },
  { id: 'otc',      label: 'OTC',      icon: Handshake, sub: 'Gros volumes'  },
];

function WavingIcon() {
  return (
    <>
      <style>{`
        @keyframes wave-hand {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(18deg); }
          30%  { transform: rotate(-8deg); }
          45%  { transform: rotate(14deg); }
          60%  { transform: rotate(-4deg); }
          75%  { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        .wave-hand {
          display: inline-flex;
          align-items: center;
          animation: wave-hand 2.2s ease-in-out 0.3s 1;
          transform-origin: 70% 80%;
        }
      `}</style>
      <span className="wave-hand" style={{ fontSize: '26px', lineHeight: 1 }}>👋</span>
    </>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();
  const { terexRateCfa } = useTerexRates(2);

  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://');

  useEffect(() => {
    if (isPWA && isMobile) {
      window.scrollTo(0, 0);
      const t = setTimeout(() => window.scrollTo(0, 0), 100);
      return () => clearTimeout(t);
    }
  }, [isPWA, isMobile]);

  const firstName = user?.name?.split(' ')[0] || 'vous';
  const rateDisplay = terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : '—';

  // ── Mobile ──────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#141414', overflowY: 'auto', paddingBottom: '110px' }}>

        {/* Greeting */}
        <div style={{ padding: '24px 20px 8px' }}>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            {firstName}
          </h1>
        </div>

        {/* Rate card — neutre, pas de couleur */}
        <div style={{ margin: '16px 20px', background: CARD, borderRadius: '20px', padding: '20px', border: `1px solid ${BORDER}` }}>
          <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Taux USDT / CFA</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ color: '#fff', fontSize: '34px', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>
                {rateDisplay}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: 600 }}>CFA</span>
            </div>
            <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '40px', height: '40px', opacity: 0.85 }} />
          </div>
          <p style={{ color: '#374151', fontSize: '11px', margin: '8px 0 0' }}>pour 1 USDT · Terex</p>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '4px 20px 0' }}>
          <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Actions rapides</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map(({ id, label, icon: Icon, sub }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ background: CARD, borderRadius: '18px', border: `1px solid ${BORDER}`, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.12s ease', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={ICON_COLOR} strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight size={14} color="rgba(255,255,255,0.18)" />
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', margin: 0 }}>{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div style={{ padding: '24px 20px 0' }}>
          <RecentTransactions onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  // ── Desktop ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: 'calc(100vh - 8rem)', padding: '40px 32px 120px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Greeting + Rate */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
              <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {firstName}
                <WavingIcon />
              </h1>
            </div>

            {/* Rate pill — neutre */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '32px', height: '32px', opacity: 0.85 }} />
              <div>
                <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>1 USDT</p>
                <p style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                  {rateDisplay} <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 500 }}>CFA</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions 2x2 */}
          <div>
            <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Actions rapides</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {quickActions.map(({ id, label, icon: Icon, sub }) => (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, padding: '22px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.15s, transform 0.15s', outline: 'none', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#252525'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = CARD; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={ICON_COLOR} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 3px' }}>{label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>{sub}</p>
                  </div>
                  <ArrowUpRight size={15} color="rgba(255,255,255,0.15)" style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — recent transactions */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <RecentTransactions onNavigate={onNavigate} />
        </div>

      </div>
    </div>
  );
}
