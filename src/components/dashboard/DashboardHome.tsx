import { ArrowUpRight, Coins, Banknote, Send, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useEffect } from 'react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const ACCENT = '#3B968F';
const ACCENT_LIGHT = '#4BA89F';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const ICON_COLOR = 'rgba(255,255,255,0.85)';

const quickActions = [
  { id: 'buy',      label: 'Acheter',  icon: Coins,    sub: 'Achat rapide'   },
  { id: 'sell',     label: 'Vendre',   icon: Banknote, sub: 'Vente rapide'   },
  { id: 'transfer', label: 'Virement', icon: Send,     sub: 'International'  },
  { id: 'otc',      label: 'OTC',      icon: Handshake,sub: 'Gros volumes'   },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Bonne nuit';
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

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#141414', overflowY: 'auto', paddingBottom: '110px' }}>

        {/* Greeting */}
        <div style={{ padding: '24px 20px 8px' }}>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            {firstName} <span style={{ color: ACCENT_LIGHT }}>👋</span>
          </h1>
        </div>

        {/* Rate banner */}
        <div style={{ margin: '16px 20px', background: `linear-gradient(135deg, #1a3330 0%, #1e3d39 60%, #16302e 100%)`, borderRadius: '20px', padding: '20px', border: `1px solid rgba(59,150,143,0.2)`, boxShadow: '0 8px 32px rgba(59,150,143,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Taux USDT / CFA</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: '#fff', fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>
                  {terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : '—'}
                </span>
                <span style={{ color: ACCENT_LIGHT, fontSize: '14px', fontWeight: 600 }}>CFA</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '6px 0 0' }}>pour 1 USDT</p>
            </div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '36px', height: '36px' }} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 500 }}>Taux en direct · Terex</span>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '4px 20px 0' }}>
          <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Actions rapides</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map(({ id, label, icon: Icon, sub }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ background: CARD, borderRadius: '18px', border: `1px solid ${BORDER}`, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.15s ease', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={ICON_COLOR} strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight size={14} color="rgba(255,255,255,0.2)" />
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>{sub}</p>
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

  // Desktop
  return (
    <div style={{ minHeight: 'calc(100vh - 10rem)', display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              {firstName} <span style={{ color: ACCENT_LIGHT }}>👋</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(59,150,143,0.08)', border: `1px solid rgba(59,150,143,0.18)`, borderRadius: '14px', padding: '10px 16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0 }} />
            <div>
              <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>1 USDT</p>
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                {terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : '—'} <span style={{ color: ACCENT_LIGHT, fontSize: '12px', fontWeight: 500 }}>CFA</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Actions rapides</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {quickActions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'transform 0.15s ease, background 0.15s ease', outline: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#252525'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = CARD; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={ICON_COLOR} strokeWidth={1.8} />
                </div>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0, textAlign: 'center' }}>{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <RecentTransactions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
