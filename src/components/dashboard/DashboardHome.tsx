import { Coins, HandCoins, Zap, Shield, Clock, HeadphonesIcon, Gift, HelpCircle, TrendingUp } from 'lucide-react';
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

function PersonWaving() {
  return (
    <>
      <style>{`
        @keyframes tx-wave {
          0%,100% { transform: rotate(0deg); }
          20%     { transform: rotate(-38deg); }
          50%     { transform: rotate(18deg); }
          80%     { transform: rotate(-32deg); }
        }
      `}</style>
      <svg
        width="30" height="36"
        viewBox="0 0 30 36"
        fill="none"
        aria-hidden="true"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      >
        {/* Head */}
        <circle cx="15" cy="6.5" r="6" fill="rgba(255,255,255,0.92)" />
        {/* Eyes */}
        <circle cx="12.7" cy="5.5" r="0.85" fill="#111" />
        <circle cx="17.3" cy="5.5" r="0.85" fill="#111" />
        {/* Smile */}
        <path d="M12.5 8.3 Q15 10.3 17.5 8.3" stroke="#111" strokeWidth="0.8" strokeLinecap="round" fill="none" />
        {/* Torso */}
        <rect x="10" y="13.5" width="10" height="9" rx="2.5" fill="rgba(255,255,255,0.82)" />
        {/* Left arm */}
        <line x1="10" y1="15.5" x2="4" y2="21" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="3.4" cy="21.6" r="1.4" fill="rgba(255,255,255,0.78)" />
        {/* Right arm - waving */}
        <g style={{ transformBox: 'fill-box' as any, transformOrigin: 'left bottom', animation: 'tx-wave 2.4s ease-in-out 0.5s 2' }}>
          <line x1="20" y1="15.5" x2="26.5" y2="9.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="27" cy="9" r="1.4" fill="rgba(255,255,255,0.78)" />
        </g>
        {/* Left leg */}
        <line x1="12.5" y1="22.5" x2="9.5" y2="32" stroke="rgba(255,255,255,0.82)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="9.5" y1="32" x2="7" y2="34.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Right leg */}
        <line x1="17.5" y1="22.5" x2="20.5" y2="32" stroke="rgba(255,255,255,0.82)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20.5" y1="32" x2="23" y2="34.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
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
      <div style={{ minHeight: '100vh', background: '#1a1a1a', overflowY: 'auto', paddingBottom: '110px' }}>

        {/* Greeting */}
        <div style={{ padding: '4px 20px 8px' }}>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{getGreeting()},</p>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {firstName}
            <PersonWaving />
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

  // ── Desktop ──────────────────────────────────────────────────────────────
  const trustPoints = [
    { icon: Clock,          title: '~3 minutes',      sub: 'Traitement moyen' },
    { icon: Shield,         title: 'KYC vérifié',      sub: 'Compte sécurisé' },
    { icon: Zap,            title: 'Wave · Orange',    sub: 'Paiement Mobile Money' },
    { icon: HeadphonesIcon, title: 'Support 24/7',     sub: 'Équipe humaine' },
  ];

  const steps = [
    { n: 1, title: 'Choisissez le montant', sub: 'CFA ou USDT, taux du jour affiché en temps réel.' },
    { n: 2, title: 'Sélectionnez le réseau', sub: 'Tron, BNB Chain, Ethereum, Polygon, Solana, Aptos, Binance.' },
    { n: 3, title: 'Payez avec Wave',        sub: 'Réception des USDT sous ~3 minutes après confirmation.' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 8rem)', padding: '40px 32px 120px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Bandeau supérieur : greeting + rate hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'stretch', marginBottom: '28px' }}>
        {/* Greeting hero */}
        <div style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{getGreeting()}</p>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {firstName}
              <PersonWaving />
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {quickActions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                style={{ flex: 1, background: '#252525', borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.15s', outline: 'none', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2d2d2d'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#252525'; }}
              >
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={ICON_COLOR} strokeWidth={1.7} />
                </span>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rate hero — grosse carte avec taux du jour */}
        <div style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Taux du jour</span>
            <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '36px', height: '36px', opacity: 0.85 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ color: '#fff', fontSize: '44px', fontWeight: 300, letterSpacing: '-1.5px', lineHeight: 1 }}>
                {rateDisplay}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', fontWeight: 500 }}>CFA</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={12} strokeWidth={2} /> pour 1 USDT · Terex
            </p>
          </div>
        </div>
      </div>

      {/* Corps principal : grille 2 colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Trust strip : 4 KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {trustPoints.map(({ icon: Icon, title, sub }) => (
              <div key={title} style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '18px 16px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', background: ICON_BG, marginBottom: '12px' }}>
                  <Icon size={16} color={ICON_COLOR} strokeWidth={1.7} />
                </span>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Recevez sur X réseaux */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 12px' }}>
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

          {/* Comment ça marche — 3 étapes */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 12px' }}>
              Comment ça marche
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {steps.map(({ n, title, sub }) => (
                <div key={n} style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#252525', color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{n}</span>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 6px' }}>{title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bas de page : cartes CTA parrainage + aide */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => onNavigate?.('referral')}
              style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background 0.15s', outline: 'none', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#252525'; }}
              onMouseLeave={e => { e.currentTarget.style.background = CARD; }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, flexShrink: 0 }}>
                <Gift size={18} color={ICON_COLOR} strokeWidth={1.7} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>Parrainez vos amis</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: 0 }}>Faites-leur découvrir Terex</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate?.('faq')}
              style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background 0.15s', outline: 'none', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#252525'; }}
              onMouseLeave={e => { e.currentTarget.style.background = CARD; }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, flexShrink: 0 }}>
                <HelpCircle size={18} color={ICON_COLOR} strokeWidth={1.7} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>Centre d'aide</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: 0 }}>FAQ · guides · support</p>
              </div>
            </button>
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
