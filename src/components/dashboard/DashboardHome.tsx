import { Coins, HandCoins } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';
import { NETWORK_LOGOS } from '@/components/features/shared/NetworkPill';
import { useEffect } from 'react';

// Réseaux affichés sur la home dans la bande "Recevez sur X réseaux".
// On garde les blockchains publiques (pas Binance CEX qui est un cas à part).
const HOME_NETWORKS: Array<{ id: string; name: string }> = [
  { id: 'TRC20',   name: 'Tron' },
  { id: 'BEP20',   name: 'BNB Chain' },
  { id: 'ERC20',   name: 'Ethereum' },
  { id: 'Polygon', name: 'Polygon' },
  { id: 'Solana',  name: 'Solana' },
  { id: 'Aptos',   name: 'Aptos' },
];

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const ACCENT_LIGHT = '#e5e5e5';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const ICON_COLOR = 'rgba(255,255,255,0.85)';

// Style Ooble Dashboard : uniquement Acheter et Vendre (pas de virement,
// pas d'OTC). L'OTC reste accessible via le profil / menu latéral.
const quickActions = [
  { id: 'buy',  label: 'Acheter', icon: Coins },
  { id: 'sell', label: 'Vendre',  icon: HandCoins },
];

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
      <div style={{ minHeight: '100vh', background: '#1a1a1a', overflowY: 'auto', paddingBottom: '110px' }}>

        {/* Greeting */}
        <div style={{ padding: '4px 20px 8px' }}>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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

        {/* Quick actions — style Ooble Dashboard : grid 2 cols, chip
            horizontal avec icône ronde + label, sans texture "carte grande". */}
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ background: CARD, borderRadius: '16px', border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={ICON_COLOR} strokeWidth={1.6} />
                </span>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recevez sur X réseaux — style Ooble Dashboard */}
        <div style={{ padding: '24px 20px 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 10px' }}>
            Recevez sur {HOME_NETWORKS.length} réseaux
          </p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', margin: '0 -20px', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
            {HOME_NETWORKS.map(n => (
              <div key={n.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px 8px 8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.10)', background: CARD, flexShrink: 0 }}>
                <img src={NETWORK_LOGOS[n.id]} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap' }}>{n.name}</span>
              </div>
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

  // ── Desktop — version compacte + zoom global ─────────────────────────────
  // Même layout que la version précédente compacte : rate card + actions/
  // réseaux en haut, activité récente en bas à gauche. Tout est juste un
  // peu plus grand (proportionnel) pour combler l'espace vide.
  return (
    <div style={{ minHeight: 'calc(100vh - 8rem)', padding: '40px 40px 120px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header greeting */}
      <div style={{ marginBottom: '26px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 500 }}>{getGreeting()}</p>
        <h1 style={{ color: '#fff', fontSize: '30px', fontWeight: 600, margin: 0, letterSpacing: '-0.4px' }}>
          {firstName}
        </h1>
      </div>

      {/* Row 1 : Rate card + (Actions + Networks) — grid 2 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Rate card — taux + logo USDT */}
        <section style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '18px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Taux du jour</span>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#fff', fontSize: '38px', fontWeight: 300, lineHeight: 1, letterSpacing: '-1px' }}>{rateDisplay}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', fontWeight: 500 }}>CFA</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '8px 0 0' }}>pour 1 USDT · Terex</p>
            </div>
            <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '44px', height: '44px', opacity: 0.9, flexShrink: 0 }} />
          </div>
        </section>

        {/* Actions + Réseaux */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ background: CARD, borderRadius: '16px', border: `1px solid ${BORDER}`, padding: '17px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s', outline: 'none', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#252525'; }}
                onMouseLeave={e => { e.currentTarget.style.background = CARD; }}
              >
                <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={ICON_COLOR} strokeWidth={1.6} />
                </span>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>

          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 10px' }}>
              Recevez sur {HOME_NETWORKS.length} réseaux
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {HOME_NETWORKS.map(n => (
                <div key={n.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px 8px 8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.10)', background: CARD }}>
                  <img src={NETWORK_LOGOS[n.id]} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap' }}>{n.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 : Activité récente à gauche, même largeur qu'une carte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <RecentTransactions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
