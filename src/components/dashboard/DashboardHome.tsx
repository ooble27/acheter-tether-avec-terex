import { Globe, ArrowDownLeft, ArrowUpRight, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useEffect } from 'react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const UsdtIcon = ({ size = 40 }: { size?: number }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
  />
);

function RateCard({ loading, rate, buyRate }: { loading: boolean; rate: number; buyRate: number }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a2f2e 0%, #0f1f1e 50%, #0a1615 100%)',
        borderRadius: 20,
        padding: '20px 22px',
        border: '1px solid rgba(59,150,143,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 130, height: 130,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,150,143,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Cours USDT · Achat
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {loading ? (
              <div style={{ height: 36, width: 120, borderRadius: 8, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
                  {rate.toLocaleString('fr-FR')}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 400 }}>CFA</span>
              </>
            )}
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: 'rgba(59,150,143,0.15)',
              border: '1px solid rgba(59,150,143,0.3)',
              borderRadius: 100,
              padding: '3px 10px',
              color: '#3B968F',
              fontSize: 11,
              fontWeight: 600,
            }}>
              Vente {loading ? '…' : buyRate.toLocaleString('fr-FR')} CFA
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>TRC-20</span>
          </div>
        </div>
        <div style={{
          width: 52, height: 52,
          borderRadius: 16,
          background: 'rgba(59,150,143,0.12)',
          border: '1px solid rgba(59,150,143,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <UsdtIcon size={30} />
        </div>
      </div>
    </div>
  );
}

const actions = [
  {
    id: 'buy',
    label: 'Acheter',
    icon: ArrowDownLeft,
    iconColor: '#3B968F',
    bg: 'rgba(59,150,143,0.12)',
    border: 'rgba(59,150,143,0.25)',
    dot: '#3B968F',
  },
  {
    id: 'sell',
    label: 'Vendre',
    icon: ArrowUpRight,
    iconColor: '#f87171',
    bg: 'rgba(248,113,113,0.1)',
    border: 'rgba(248,113,113,0.2)',
    dot: '#f87171',
  },
  {
    id: 'transfer',
    label: 'Virement',
    icon: Globe,
    iconColor: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.2)',
    dot: '#60a5fa',
  },
  {
    id: 'otc',
    label: 'OTC',
    icon: Handshake,
    iconColor: '#c084fc',
    bg: 'rgba(192,132,252,0.1)',
    border: 'rgba(192,132,252,0.2)',
    dot: '#c084fc',
  },
];

function QuickActions({ onNavigate }: { onNavigate?: (s: string) => void }) {
  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
        Services
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => onNavigate?.(a.id)}
              style={{
                background: a.bg,
                border: `1px solid ${a.border}`,
                borderRadius: 16,
                padding: '14px 6px 12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'transform 0.15s, opacity 0.15s',
                WebkitTapHighlightColor: 'transparent',
              }}
              onTouchStart={e => (e.currentTarget.style.opacity = '0.7')}
              onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: 42, height: 42,
                borderRadius: 13,
                background: 'rgba(0,0,0,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={a.iconColor} strokeWidth={1.8} />
              </div>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 500, letterSpacing: '0.01em' }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();
  const { terexRateCfa, terexBuyRateCfa, loading } = useTerexRates(2);
  const firstName = user?.name?.split(' ')[0] || 'vous';

  const isPWA =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://');

  useEffect(() => {
    if (isPWA && isMobile) {
      window.scrollTo(0, 0);
      const t = setTimeout(() => window.scrollTo(0, 0), 100);
      return () => clearTimeout(t);
    }
  }, [isPWA, isMobile]);

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 400, marginBottom: 2 }}>
          Bonjour,
        </p>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1.15, margin: 0 }}>
          {firstName}&nbsp;
          <span style={{ color: '#3B968F' }}>👋</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3, fontWeight: 400 }}>
          Terex · Plateforme USDT
        </p>
      </div>

      {/* Rate card */}
      <RateCard loading={loading} rate={terexRateCfa} buyRate={terexBuyRateCfa} />

      {/* Quick actions */}
      <QuickActions onNavigate={onNavigate} />

      {/* Recent transactions */}
      <div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          Activité récente
        </p>
        <RecentTransactions onNavigate={onNavigate} />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-terex-dark overflow-y-auto scrollbar-hide" style={{ padding: '4px 0 16px' }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 10rem)', display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {content}
      </div>
    </div>
  );
}
