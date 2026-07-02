import { ArrowRight, ArrowDown, Handshake, Lock, ShieldCheck, Headphones, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';
const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';
const WHATSAPP = 'https://wa.me/+14182619091';

// Paliers OTC — plus le volume est grand, plus la marge est faible (meilleur taux)
const OTC_TIERS = [
  { min: 0,        margin: 2.0, name: 'Standard',     label: '< 50K',       adv: 0.34 },
  { min: 50000,    margin: 1.7, name: 'Préférentiel', label: '50K – 200K',  adv: 0.58 },
  { min: 200000,   margin: 1.0, name: 'Avancé',       label: '200K – 1M',   adv: 0.85 },
  { min: 1000000,  margin: 1.0, name: 'Sur mesure',   label: '1M +',        adv: 1.0 },
];

const OTCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { marketRateCfa, loading: rateLoading } = useTerexRates(2);
  const market = !rateLoading && marketRateCfa ? marketRateCfa : null;

  const [side, setSide] = useState<'buy' | 'sell'>('sell'); // sell = donne USDT, reçoit CFA
  const [give, setGive] = useState<string>('50000');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const giveNum = parseFloat(give.replace(/\s/g, '')) || 0;
  const giveUnit = side === 'buy' ? 'CFA' : 'USDT';
  const recvUnit = side === 'buy' ? 'USDT' : 'CFA';

  // Volume estimé en USDT → détermine le palier (marge dégressive)
  const volumeUSDT = market ? (side === 'buy' ? giveNum / market : giveNum) : giveNum;
  const tier = [...OTC_TIERS].reverse().find(t => volumeUSDT >= t.min) || OTC_TIERS[0];
  // Taux effectif : marge plus faible = meilleur taux pour le client
  const effRate = market ? (side === 'buy' ? market * (1 + tier.margin / 100) : market * (1 - tier.margin / 100)) : null;

  const recvNum = effRate ? (side === 'buy' ? giveNum / effRate : giveNum * effRate) : null;
  const recvDisplay = recvNum != null
    ? (side === 'buy' ? recvNum.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : Math.round(recvNum).toLocaleString('fr-FR'))
    : null;
  const rateDisplay = effRate ? Math.round(effRate).toLocaleString('fr-FR') : null;
  const marginDisplay = tier.margin.toLocaleString('fr-FR');

  const switchSide = (s: 'buy' | 'sell') => { setSide(s); setGive(s === 'buy' ? '5000000' : '50000'); };

  const quoteMsg = encodeURIComponent(
    `Bonjour, je souhaite un devis OTC : ${side === 'buy' ? 'ACHAT' : 'VENTE'} de ${giveNum.toLocaleString('fr-FR')} ${giveUnit}.`
  );

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes otc-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .otc-fade { animation: otc-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .otc-fade-2 { animation: otc-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .otc-cta { transition: transform 0.15s ease; }
        .otc-cta:hover { transform: translateY(-1px); }
        @keyframes otc-bar { from { transform: scaleX(0); } to { transform: scaleX(var(--w)); } }
        .otc-barfill { transform-origin: left; animation: otc-bar 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .otc-input { background: transparent; border: none; outline: none; color: #fff; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; width: 100%; }
        .otc-input::-webkit-outer-spin-button, .otc-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        @media (max-width: 1100px) { .otc-vline { display: none !important; } }
        @media (max-width: 940px) {
          .otc-hero { grid-template-columns: 1fr !important; }
          .otc-tiers { grid-template-columns: 1fr !important; }
          .otc-profiles { grid-template-columns: 1fr !important; }
          .otc-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) { .otc-hero-title { font-size: 34px !important; } }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="otc-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="otc-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO — éditorial + terminal de devis */}
      <header className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '78px 32px 72px', position: 'relative', zIndex: 1 }}>
        <div className="otc-hero" style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 56, alignItems: 'center' }}>
          <div className="otc-fade">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, marginBottom: 22 }}>
              <Handshake size={14} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Terex OTC Desk</span>
            </div>
            <h1 className="otc-hero-title" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.04em', margin: '0 0 22px' }}>
              Le desk pour vos<br />gros volumes.
            </h1>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 30px', maxWidth: 460 }}>
              Achetez ou vendez de grandes quantités de USDT à un taux ferme et préférentiel, avec un règlement rapide et un accompagnement dédié.
            </p>
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              {[{ Icon: Lock, t: 'Confidentiel' }, { Icon: ShieldCheck, t: 'Sécurisé & KYC' }, { Icon: Headphones, t: 'Interlocuteur dédié' }].map(({ Icon, t }) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={15} color="rgba(255,255,255,0.5)" />
                  <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TERMINAL DE DEVIS */}
          <div className="otc-fade-2" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: 20 }}>
            {/* Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: '#161616', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 4, marginBottom: 18 }}>
              {(['buy', 'sell'] as const).map(s => (
                <button key={s} onClick={() => switchSide(s)} style={{
                  height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  background: side === s ? '#fff' : 'transparent', color: side === s ? '#141414' : MUTED, transition: 'all 0.15s ease',
                }}>{s === 'buy' ? 'Acheter USDT' : 'Vendre USDT'}</button>
              ))}
            </div>

            {/* Vous donnez */}
            <div style={{ background: '#161616', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: MUTED2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vous donnez</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input className="otc-input" inputMode="numeric" value={give}
                  onChange={e => setGive(e.target.value.replace(/[^\d]/g, ''))} />
                <Unit unit={giveUnit} />
              </div>
            </div>

            {/* Flèche */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '-9px 0' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#242424', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <ArrowDown size={16} color="rgba(255,255,255,0.7)" />
              </div>
            </div>

            {/* Vous recevez */}
            <div style={{ background: '#161616', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '14px 16px' }}>
              <span style={{ fontSize: 11, color: MUTED2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vous recevez (estimation)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <span className="otc-input" style={{ opacity: recvDisplay ? 1 : 0.5 }}>{recvDisplay ?? '—'}</span>
                <Unit unit={recvUnit} />
              </div>
            </div>

            {/* Palier de volume appliqué */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 2px 4px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, fontSize: 11 }}>{tier.name}</span>
                marge {marginDisplay}%
              </span>
              <span style={{ fontSize: 12, color: MUTED2 }}>
                {rateDisplay ? `≈ ${rateDisplay} CFA / USDT` : <span style={{ display: 'inline-block', width: 84, height: 12, borderRadius: 4, background: ICON_BG }} />}
              </span>
            </div>

            <button onClick={() => window.open(`${WHATSAPP}?text=${quoteMsg}`, '_blank')} className="otc-cta"
              style={{ width: '100%', marginTop: 10, background: '#fff', color: '#141414', border: 'none', borderRadius: 14, height: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Demander ce devis <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: 11.5, color: MUTED2, textAlign: 'center', margin: '10px 0 0' }}>Taux ferme confirmé par notre desk sous quelques minutes.</p>
          </div>
        </div>
      </header>

      {/* AVANTAGE VOLUME — visuel original */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ maxWidth: 620, marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 12px' }}>L'avantage du volume</p>
            <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, margin: '0 0 14px' }}>Plus vous échangez, plus c'est avantageux.</h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: 0 }}>Nos conditions s'améliorent avec la taille de votre transaction. Voici comment se structure votre avantage.</p>
          </div>

          <div className="otc-tiers" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: 'hidden' }}>
            {OTC_TIERS.map((t, i) => {
              const active = tier.name === t.name;
              return (
                <div key={t.name} style={{ padding: '28px 26px', borderRight: i < OTC_TIERS.length - 1 ? `1px solid ${BORDER}` : 'none', background: active ? 'rgba(255,255,255,0.04)' : 'transparent', transition: 'background 0.2s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>
                      {t.name}
                      {active && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#141414', background: '#fff', borderRadius: 999, padding: '2px 7px' }}>Votre palier</span>}
                    </span>
                    <span style={{ fontSize: 11, color: MUTED2, fontFamily: 'monospace' }}>{t.label} USDT</span>
                  </div>
                  {/* barre : marge plus faible = barre plus longue */}
                  <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 14 }}>
                    <div className="otc-barfill" style={{ ['--w' as any]: t.adv, height: '100%', borderRadius: 999, background: active ? '#fff' : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{t.margin.toLocaleString('fr-FR')}%</span>
                    <span style={{ fontSize: 12.5, color: MUTED }}>de marge</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: MUTED2, margin: '14px 4px 0', display: 'flex', alignItems: 'center', gap: 7 }}>
            <TrendingUp size={13} color="rgba(255,255,255,0.5)" /> Le palier s'applique automatiquement selon le volume saisi ci-dessus. Taux exact confirmé sur devis.
          </p>
        </div>
      </section>

      {/* POUR QUI — liste éditoriale (pas de box) */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <div className="otc-profiles" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 12px' }}>Pour qui</p>
              <h2 style={{ fontSize: 'clamp(1.7rem,3.4vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, margin: 0 }}>Un desk pensé pour les échanges d'envergure.</h2>
            </div>
            <div>
              {[
                { t: 'Traders & investisseurs', d: 'Exécutez de gros ordres en une fois, sans impact sur le marché ni slippage.' },
                { t: 'Entreprises & importateurs', d: 'Réglez vos fournisseurs et gérez votre trésorerie USDT avec des taux négociés.' },
                { t: 'Institutions', d: 'Un règlement dédié, confidentiel et conforme, adapté aux montants importants.' },
              ].map((p, i, arr) => (
                <div key={p.t} style={{ display: 'flex', gap: 20, padding: '22px 0', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: MUTED2, minWidth: 28, fontFamily: 'monospace', paddingTop: 3 }}>{`0${i + 1}`}</span>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 600, margin: '0 0 5px' }}>{p.t}</p>
                    <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.6, margin: 0, maxWidth: 480 }}>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad" style={{ maxWidth: 820, margin: '0 auto', padding: '96px 32px', textAlign: 'center', position: 'relative' }}>
          <img src={TETHER} alt="USDT" style={{ width: 48, height: 48, opacity: 0.9, margin: '0 auto 22px', display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 14px' }}>Parlez à notre desk OTC.</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 auto 30px', maxWidth: 520 }}>Réponse rapide, devis ferme et accompagnement de bout en bout, en toute confidentialité.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.open(WHATSAPP, '_blank')} className="otc-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 30px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <MessageCircle size={17} /> Contacter le desk
            </button>
            <button onClick={() => navigate('/contact')} style={{ background: '#2d2d2d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, height: 52, padding: '0 26px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Nous écrire
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

function Unit({ unit }: { unit: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#242424', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '6px 12px 6px 8px', flexShrink: 0 }}>
      {unit === 'USDT'
        ? <img src={TETHER} alt="USDT" style={{ width: 20, height: 20 }} />
        : <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>F</span>}
      <span style={{ fontSize: 13, fontWeight: 700 }}>{unit}</span>
    </div>
  );
}

export default OTCPage;
