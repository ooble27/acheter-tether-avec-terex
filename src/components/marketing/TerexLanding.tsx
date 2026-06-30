import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Coins, HandCoins, Handshake,
  Shield, Zap, Repeat, Wallet, Clock, ChevronDown,
} from 'lucide-react';
import { FooterSection } from './sections/FooterSection';
import { useTerexRates } from '@/hooks/useTerexRates';
import waveLogo from '@/assets/wave-logo.png';
import orangeLogo from '@/assets/orange-money-logo.png';

const BG = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';
const LOGO = '/terex-logo.png';

const NETWORKS = [
  { name: 'Tron',     sub: 'TRC20',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png' },
  { name: 'BNB Chain', sub: 'BEP20',   logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
  { name: 'Ethereum', sub: 'ERC20',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { name: 'Polygon',  sub: 'MATIC',    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
  { name: 'Solana',   sub: 'SPL',      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
  { name: 'Aptos',    sub: 'APT',      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
];

const ACTIONS = [
  { Icon: Coins,     label: 'Acheter',  sub: 'Achat rapide' },
  { Icon: HandCoins, label: 'Vendre',   sub: 'Vente rapide' },
  { Icon: Handshake, label: 'OTC',      sub: 'Gros volumes' },
];

const FEATURES = [
  { Icon: Zap,        title: 'Transactions instantanées', desc: 'Achats et ventes traités en moins de 5 minutes après confirmation du paiement.' },
  { Icon: Wallet,     title: 'Multi-réseaux',             desc: 'Recevez vos USDT sur TRC20, BEP20, ERC20, Polygon, Solana ou Aptos.' },
  { Icon: Handshake,  title: 'OTC · Gros volumes',        desc: 'Un accompagnement dédié et des taux préférentiels pour vos transactions importantes.' },
  { Icon: Repeat,     title: 'Meilleur taux CFA',         desc: 'Un taux USDT/CFA transparent et compétitif, mis à jour en temps réel.' },
  { Icon: Shield,     title: 'Sécurité & KYC',            desc: 'Chiffrement, vérification d\'identité et conformité pour protéger vos fonds.' },
  { Icon: Clock,      title: 'Support 24/7',              desc: 'Une équipe disponible à tout moment par WhatsApp, téléphone ou email.' },
];

const WHY = [
  { Icon: Zap,        title: 'Transactions instantanées', desc: 'Achats et ventes confirmés en moins de 5 minutes, à toute heure.' },
  { Icon: Repeat,     title: 'Liquidité élevée',          desc: 'Achetez ou vendez de gros montants sans friction, au meilleur taux.' },
  { Icon: Coins,      title: 'Prix compétitifs',          desc: 'Un taux USDT/CFA transparent, sans frais cachés.' },
  { Icon: Shield,     title: 'KYC rapide',                desc: 'Vérification d\'identité simple et rapide pour démarrer en minutes.' },
  { Icon: Wallet,     title: 'Interface intuitive',       desc: 'Une expérience claire et fluide, pensée pour aller à l\'essentiel.' },
  { Icon: Clock,      title: 'Support réactif',           desc: 'Une équipe disponible 24/7 par WhatsApp, téléphone ou email.' },
];

const STEPS = [
  { n: '1', title: 'Créez votre compte', desc: 'Inscription en quelques secondes, vérification rapide de votre identité.' },
  { n: '2', title: 'Choisissez votre opération', desc: 'Achat ou vente — entrez le montant et sélectionnez votre réseau.' },
  { n: '3', title: 'Recevez en 5 minutes', desc: 'Vos USDT ou votre argent arrivent immédiatement après confirmation.' },
];

const PAYMENTS = [
  { name: 'Wave',          logo: waveLogo },
  { name: 'Orange Money',  logo: orangeLogo },
];

const FAQ = [
  { q: 'Comment acheter des USDT ?', a: "Entrez le montant en CFA, choisissez votre réseau et votre adresse wallet, puis payez via Mobile Money. Vos USDT arrivent en moins de 5 minutes." },
  { q: 'Quels réseaux sont supportés ?', a: 'TRC20 (Tron), BEP20 (BNB Chain), ERC20 (Ethereum), Polygon, Solana et Aptos.' },
  { q: 'Comment vendre mes USDT ?', a: "Indiquez le montant, votre réseau d'envoi et vos coordonnées Wave ou Orange Money. Vous recevez votre argent immédiatement." },
  { q: 'Quels sont les frais ?', a: 'Des frais transparents et compétitifs, sans coûts cachés. Le taux affiché est celui appliqué.' },
  { q: 'La plateforme est-elle sécurisée ?', a: 'Oui — chiffrement, KYC et conformité bancaire protègent vos fonds et vos données.' },
];

export function TerexLanding({ user, onShowDashboard }: { user?: { email: string; name: string } | null; onShowDashboard?: () => void }) {
  const navigate = useNavigate();
  const goAuth = () => navigate('/auth');
  const goPrimary = () => (user ? onShowDashboard?.() : navigate('/auth'));
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes tx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .tx-fade { animation: tx-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .tx-cta { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .tx-cta:hover { transform: translateY(-1px); }
        @keyframes tx-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tx-marquee { display: flex; gap: 56px; width: max-content; animation: tx-marquee 28s linear infinite; }
        .tx-mask { -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
        .tx-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .tx-tile:hover { transform: translateY(-2px); }
        @media (max-width: 1100px) { .tx-vline { display: none !important; } }
        @media (max-width: 860px) {
          .tx-hero-title { font-size: 38px !important; }
          .tx-two { grid-template-columns: 1fr !important; }
          .tx-feat { grid-template-columns: 1fr 1fr !important; }
          .tx-nets { grid-template-columns: repeat(3,1fr) !important; }
          .tx-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .tx-hero-title { font-size: 30px !important; }
          .tx-nav-links { display: none !important; }
          .tx-feat { grid-template-columns: 1fr !important; }
          .tx-nets { grid-template-columns: 1fr 1fr !important; }
          .tx-actions { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Lignes verticales guides */}
      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO} alt="Terex" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Terex</span>
          </button>
          <div className="tx-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[['Fonctionnalités', 'features'], ['Réseaux', 'networks'], ['Comment ça marche', 'how'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={goPrimary} style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 10, height: 38, padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {user ? 'Tableau de bord' : 'Commencer'} <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="tx-two" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          {/* Texte */}
          <div className="tx-fade">
            <h1 className="tx-hero-title" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.035em', margin: '0 0 18px' }}>
              Achetez et vendez<br />des USDT en CFA
            </h1>
            <p style={{ fontSize: 17.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: 440 }}>
              Achat et vente de USDT en quelques minutes. Rapide, sécurisé et au meilleur taux CFA.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={goPrimary} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {user ? 'Mon tableau de bord' : 'Commencer gratuitement'} <ArrowRight size={16} />
              </button>
              <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, height: 50, padding: '0 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Comment ça marche
              </button>
            </div>
          </div>

          {/* App directement sur le fond — taux (temps réel) + actions (aucune ombre, aucun cadre) */}
          <div>
            <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Taux USDT / CFA · en direct</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minHeight: 52 }}>
                {rateDisplay ? (
                  <>
                    <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1 }}>{rateDisplay}</span>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, fontWeight: 600 }}>CFA</span>
                  </>
                ) : (
                  <span style={{ display: 'inline-block', width: 140, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
              <img src={TETHER} alt="USDT" style={{ width: 48, height: 48, opacity: 0.9 }} />
            </div>
            <div className="tx-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {ACTIONS.map(({ Icon, label, sub }) => (
                <button key={label} onClick={goAuth}
                  style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, background 0.15s', gridColumn: label === 'OTC' ? '1 / -1' : undefined }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                    </div>
                    <ArrowUpRight size={15} color="rgba(255,255,255,0.2)" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>{sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Fonctionnalités" title="Tout ce qu'il vous faut pour vos USDT" sub="Une plateforme simple pour acheter et vendre vos USDT." />
          <div className="tx-feat" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderLeft: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}` }}>
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} style={{ padding: '30px 28px', borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORKS */}
      <section id="networks" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Réseaux" title="6 réseaux blockchain supportés" sub="Recevez vos USDT sur le réseau de votre choix." />
          <div className="tx-nets" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {NETWORKS.map(({ name, sub, logo }) => (
              <div key={name} style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 14px', textAlign: 'center' }}>
                <img src={logo} alt={name} style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 2px' }}>{name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIEMENTS */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Paiements" title="Payez avec Mobile Money" sub="Wave et Orange Money pour acheter ou recevoir vos fonds." />
          <div className="tx-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {PAYMENTS.map(({ name, logo }) => (
              <div key={name} style={{ border: `1px solid ${BORDER}`, borderRadius: 18, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={logo} alt={name} style={{ width: 38, height: 38, objectFit: 'contain' }} />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 2px' }}>{name}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Dépôt et retrait instantanés</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI TEREX — valeur */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Pourquoi Terex" title="L'échange de USDT, simplifié" sub="Une plateforme pensée pour la rapidité, la liquidité et la simplicité." />
          <div className="tx-feat" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {WHY.map(({ Icon, title, desc }) => (
              <div key={title} className="tx-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OTC — gros volumes */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <div className="tx-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>OTC · Gros volumes</p>
              <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 16px' }}>Des transactions importantes ?<br />Un service dédié.</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: '0 0 26px', maxWidth: 440 }}>
                Pour les montants élevés, bénéficiez d'un accompagnement personnalisé, de taux préférentiels et d'un règlement rapide et sécurisé.
              </p>
              <button onClick={goAuth} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 48, padding: '0 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Demander un devis OTC <ArrowRight size={16} />
              </button>
            </div>
            <div className="tx-feat" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { Icon: Handshake, t: 'Accompagnement dédié' },
                { Icon: Repeat,    t: 'Taux préférentiels' },
                { Icon: Zap,       t: 'Règlement rapide' },
                { Icon: Shield,    t: 'Sécurité renforcée' },
              ].map(({ Icon, t }) => (
                <div key={t} className="tx-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 18px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={19} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Comment ça marche" title="Démarrez en 3 étapes" sub="De l'inscription à la réception, tout est pensé pour aller vite." />
          <div className="tx-feat" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 15, fontWeight: 700 }}>{n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 760, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="FAQ" title="Questions fréquentes" sub="" center />
          <div>
            {FAQ.map((item, i) => {
              const open = faqOpen === i;
              return (
                <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <button onClick={() => setFaqOpen(open ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: open ? '#fff' : 'rgba(255,255,255,0.8)' }}>{item.q}</span>
                    <ChevronDown size={17} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {open && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 20px' }}>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Prêt à commencer ?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px' }}>Créez votre compte et échangez vos premiers USDT en quelques minutes.</p>
          <button onClick={goPrimary} style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {user ? 'Mon tableau de bord' : 'Commencer gratuitement'} <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div style={{ marginBottom: 36, textAlign: center ? 'center' : 'left' }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>{eyebrow}</p>
      <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '12px 0 0', maxWidth: center ? 'none' : 520 }}>{sub}</p>}
    </div>
  );
}
