import {
  ArrowDownCircle, ArrowUpCircle, Send, BarChart3, Clock,
  ChevronRight, TrendingUp, Wifi
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useEffect } from 'react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const ACCENT  = '#3B968F';
const RED     = '#F6465D';
const BLUE    = '#60a5fa';
const PURPLE  = '#a78bfa';
const AMBER   = '#f59e0b';
const BG      = '#0B0B0B';
const CARD    = '#141414';
const CARD2   = '#1a1a1a';
const BORDER  = 'rgba(255,255,255,0.07)';
const TEXT    = '#EAECEF';
const MUTED   = 'rgba(255,255,255,0.45)';
const DIM     = 'rgba(255,255,255,0.25)';

const UsdtLogo = ({ size = 36 }: { size?: number }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    style={{ width: size, height: size, objectFit: 'contain', display: 'block', flexShrink: 0 }}
  />
);

// ── Hero rate card ────────────────────────────────────────────────────────────
function HeroCard({
  loading, buyRate, sellRate, onNavigate,
}: {
  loading: boolean;
  buyRate: number;
  sellRate: number;
  onNavigate?: (s: string) => void;
}) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #0e1f1d 0%, #111918 60%, #0a0f0e 100%)',
      border: `1px solid rgba(59,150,143,0.2)`,
      borderRadius: 22,
      padding: '22px 22px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 15% 40%, rgba(59,150,143,0.12) 0%, transparent 70%)',
      }} />

      {/* top row: label + usdt icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ color: DIM, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            Cours USDT · CFA
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, display: 'inline-block', boxShadow: `0 0 6px ${ACCENT}` }} />
            <span style={{ color: ACCENT, fontSize: 11, fontWeight: 500 }}>En direct</span>
          </div>
        </div>
        <UsdtLogo size={38} />
      </div>

      {/* big rate number */}
      <div style={{ marginBottom: 6 }}>
        {loading ? (
          <div style={{ height: 48, width: 160, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: TEXT, fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {buyRate.toLocaleString('fr-FR')}
            </span>
            <span style={{ color: MUTED, fontSize: 16, fontWeight: 400 }}>CFA</span>
          </div>
        )}
      </div>
      <p style={{ color: DIM, fontSize: 12, marginBottom: 20 }}>Taux d'achat Terex</p>

      {/* sell rate pill */}
      {!loading && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(246,70,93,0.08)',
          border: '1px solid rgba(246,70,93,0.2)',
          borderRadius: 100,
          padding: '5px 12px',
          marginBottom: 22,
        }}>
          <span style={{ color: RED, fontSize: 11, fontWeight: 600 }}>Vente :</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
            {sellRate.toLocaleString('fr-FR')} CFA / USDT
          </span>
        </div>
      )}

      {/* action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => onNavigate?.('buy')}
          style={{
            flex: 1, padding: '13px 0',
            background: ACCENT,
            border: 'none', borderRadius: 14,
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: `0 4px 20px rgba(59,150,143,0.35)`,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ArrowDownCircle size={17} strokeWidth={2.2} />
          Acheter
        </button>
        <button
          onClick={() => onNavigate?.('sell')}
          style={{
            flex: 1, padding: '13px 0',
            background: 'rgba(246,70,93,0.12)',
            border: '1px solid rgba(246,70,93,0.3)',
            borderRadius: 14,
            color: RED, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ArrowUpCircle size={17} strokeWidth={2.2} />
          Vendre
        </button>
      </div>
    </div>
  );
}

// ── Quick actions row ─────────────────────────────────────────────────────────
const QUICK = [
  { id: 'buy',      label: 'Acheter',    Icon: ArrowDownCircle, color: ACCENT,  bg: 'rgba(59,150,143,0.13)'  },
  { id: 'sell',     label: 'Vendre',     Icon: ArrowUpCircle,   color: RED,     bg: 'rgba(246,70,93,0.11)'   },
  { id: 'transfer', label: 'Virement',   Icon: Send,            color: BLUE,    bg: 'rgba(96,165,250,0.11)'  },
  { id: 'otc',      label: 'OTC',        Icon: BarChart3,       color: PURPLE,  bg: 'rgba(167,139,250,0.11)' },
  { id: 'history',  label: 'Historique', Icon: Clock,           color: AMBER,   bg: 'rgba(245,158,11,0.11)'  },
];

function QuickActions({ onNavigate }: { onNavigate?: (s: string) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
      {QUICK.map(({ id, label, Icon, color, bg }) => (
        <button
          key={id}
          onClick={() => onNavigate?.(id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 2px',
            WebkitTapHighlightColor: 'transparent',
          }}
          onTouchStart={e => (e.currentTarget.style.opacity = '0.6')}
          onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: bg, border: `1px solid ${color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color={color} strokeWidth={1.8} />
          </div>
          <span style={{ color: MUTED, fontSize: 10, fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Market info cards ─────────────────────────────────────────────────────────
function MarketCards({ loading, buyRate, sellRate }: { loading: boolean; buyRate: number; sellRate: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {/* Buy rate */}
      <div style={{
        background: CARD, border: BORDER, borderLeft: `3px solid ${ACCENT}`,
        borderRadius: 14, padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <ArrowDownCircle size={13} color={ACCENT} strokeWidth={2} />
          <span style={{ color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Vous achetez
          </span>
        </div>
        {loading ? (
          <div style={{ height: 24, width: 80, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
        ) : (
          <span style={{ color: ACCENT, fontSize: 20, fontWeight: 700 }}>
            {buyRate.toLocaleString('fr-FR')}<span style={{ fontSize: 12, fontWeight: 400, color: MUTED, marginLeft: 4 }}>CFA</span>
          </span>
        )}
        <p style={{ color: DIM, fontSize: 10, marginTop: 4 }}>par USDT</p>
      </div>

      {/* Sell rate */}
      <div style={{
        background: CARD, border: BORDER, borderLeft: `3px solid ${RED}`,
        borderRadius: 14, padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <ArrowUpCircle size={13} color={RED} strokeWidth={2} />
          <span style={{ color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Vous vendez
          </span>
        </div>
        {loading ? (
          <div style={{ height: 24, width: 80, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
        ) : (
          <span style={{ color: RED, fontSize: 20, fontWeight: 700 }}>
            {sellRate.toLocaleString('fr-FR')}<span style={{ fontSize: 12, fontWeight: 400, color: MUTED, marginLeft: 4 }}>CFA</span>
          </span>
        )}
        <p style={{ color: DIM, fontSize: 10, marginTop: 4 }}>par USDT</p>
      </div>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ color: MUTED, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>{label}</span>
      {action && (
        <button
          onClick={onAction}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: ACCENT, fontSize: 12, fontWeight: 500,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {action}<ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: DIM, fontSize: 12, margin: 0, marginBottom: 2 }}>Bonjour 👋</p>
          <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {firstName}
          </h1>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <UsdtLogo size={24} />
        </div>
      </div>

      {/* hero card */}
      <HeroCard
        loading={loading}
        buyRate={terexRateCfa}
        sellRate={terexBuyRateCfa}
        onNavigate={onNavigate}
      />

      {/* quick actions */}
      <div>
        <SectionLabel label="Services" />
        <QuickActions onNavigate={onNavigate} />
      </div>

      {/* market info */}
      <div>
        <SectionLabel label="Marché en temps réel" />
        <MarketCards loading={loading} buyRate={terexRateCfa} sellRate={terexBuyRateCfa} />
      </div>

      {/* recent activity */}
      <div>
        <SectionLabel label="Activité récente" action="Voir tout" onAction={() => onNavigate?.('history')} />
        <RecentTransactions onNavigate={onNavigate} />
      </div>

    </div>
  );

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: BG, padding: '8px 0 24px', overflowY: 'auto' }}>
        {inner}
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 10rem)', display: 'flex', justifyContent: 'center', padding: '36px 24px' }}>
      <div style={{ width: '100%', maxWidth: 580 }}>
        {inner}
      </div>
    </div>
  );
}
