import { Search, MessageCircle, User, HandCoins, Shield, Coins, HelpCircle, Globe, ChevronDown, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#141414';
const CARD = '#1a1a1a';
const CARD2 = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const FAQPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('demarrage');
  const [openKey, setOpenKey] = useState<string | null>('demarrage-0');

  const faqCategories = [
    { id: 'demarrage', title: 'Démarrage et Compte', icon: User, description: 'Création de compte, vérification KYC' },
    { id: 'achat', title: "Achat d'USDT", icon: Coins, description: 'Comment acheter des cryptomonnaies' },
    { id: 'vente', title: "Vente d'USDT", icon: HandCoins, description: 'Vendre vos cryptomonnaies' },
    { id: 'transferts', title: 'Transferts Internationaux', icon: Globe, description: "Envoyer de l'argent" },
    { id: 'securite', title: 'Sécurité et Conformité', icon: Shield, description: 'Protection des données et fonds' },
    { id: 'support', title: 'Support et Assistance', icon: HelpCircle, description: 'Contacter notre équipe' },
  ];

  const faqSections = [
    {
      id: 'demarrage', title: 'Démarrage et Compte',
      faqs: [
        { question: "Qu'est-ce que Terex et comment ça marche ?", answer: "Terex est la première plateforme d'échange crypto-fiat dédiée à l'Afrique francophone. Nous permettons d'acheter, vendre et transférer des cryptomonnaies (principalement USDT) en utilisant les monnaies locales (CFA). Notre plateforme connecte les écosystèmes financiers traditionnels aux marchés des cryptomonnaies avec des délais ultra-rapides de 5 minutes maximum." },
        { question: 'Comment créer un compte sur Terex ?', answer: "Pour créer votre compte : 1) Cliquez sur 'S'inscrire' et entrez votre email et mot de passe, 2) Vérifiez votre email via le lien reçu, 3) Complétez votre profil, 4) Soumettez vos documents KYC. L'inscription est gratuite et prend moins de 10 minutes." },
        { question: "Qu'est-ce que la vérification KYC ?", answer: "KYC (Know Your Customer) est un processus de vérification d'identité obligatoire. Vous devez fournir : une pièce d'identité valide, un justificatif de domicile récent, et un selfie. Cette étape garantit la sécurité de tous les utilisateurs." },
        { question: 'Combien de temps prend la vérification KYC ?', answer: 'La vérification prend 24-48 heures ouvrables. Vous recevrez un email de confirmation une fois votre compte vérifié.' },
        { question: 'Puis-je utiliser Terex sans KYC ?', answer: 'Oui, vous pouvez commencer à effectuer des transactions immédiatement. La vérification KYC reste recommandée pour des limites plus élevées.' },
      ],
    },
    {
      id: 'achat', title: "Achat d'USDT",
      faqs: [
        { question: 'Comment acheter des USDT sur Terex ?', answer: "1) Allez dans 'Acheter USDT', 2) Choisissez votre devise, 3) Entrez le montant, 4) Sélectionnez votre réseau blockchain, 5) Fournissez votre adresse USDT, 6) Choisissez votre méthode de paiement, 7) Suivez les instructions. Vos USDT sont livrés sous 5 minutes." },
        { question: 'Quels réseaux blockchain sont supportés ?', answer: 'TRC20 (Tron) - le plus économique, BEP20 (BSC) - rapide, ERC20 (Ethereum) - sécurisé, Arbitrum, Polygon, Solana, Aptos.' },
        { question: 'Quels sont les montants min/max ?', answer: 'Minimum : 50,000 CFA ou 100 CAD. Maximum : 2M CFA (non vérifié), 10M CFA (vérifié KYC).' },
        { question: 'Quelles méthodes de paiement ?', answer: 'Mobile Money (Orange Money, Wave), cartes Visa/Mastercard, virements bancaires, QR code.' },
        { question: 'Comment fonctionne le taux de change ?', answer: 'Taux mis à jour en temps réel, sans frais cachés. Le taux est bloqué pendant 15 minutes une fois la commande créée.' },
      ],
    },
    {
      id: 'vente', title: "Vente d'USDT",
      faqs: [
        { question: 'Comment vendre mes USDT ?', answer: "1) Allez dans 'Vendre USDT', 2) Entrez le montant, 3) Choisissez votre réseau, 4) Sélectionnez la méthode de réception, 5) Envoyez vos USDT, 6) Recevez votre paiement sous 5 minutes." },
        { question: 'Puis-je vendre depuis Binance ?', answer: 'Oui ! Créez une commande de vente sur Terex, copiez l\'adresse fournie, puis faites un retrait depuis Binance vers cette adresse.' },
        { question: 'Combien de temps prend une vente ?', answer: '5-15 minutes : 1-3 min confirmation blockchain + 2-5 min traitement + envoi immédiat vers votre compte.' },
      ],
    },
    {
      id: 'transferts', title: 'Transferts Internationaux',
      faqs: [
        { question: 'Vers quels pays ?', answer: "Sénégal, Côte d'Ivoire, Mali, Burkina Faso et Niger via Mobile Money (Orange Money, Wave, Free Money)." },
        { question: 'Comment effectuer un transfert ?', answer: '1) Choisissez le pays, 2) Entrez le montant, 3) Sélectionnez la méthode, 4) Informations du bénéficiaire, 5) Payez, 6) Réception sous 10 minutes.' },
        { question: 'Le bénéficiaire a-t-il besoin d\'un compte ?', answer: 'Non, il suffit d\'avoir un compte Mobile Money. Il recevra l\'argent directement avec notification SMS.' },
      ],
    },
    {
      id: 'securite', title: 'Sécurité et Conformité',
      faqs: [
        { question: 'Terex est-il non-custodial ?', answer: 'Oui, Terex ne détient JAMAIS vos fonds. Vos USDT sont envoyés directement à votre wallet. Nous agissons uniquement comme intermédiaire de transaction.' },
        { question: 'Comment sont protégées mes données ?', answer: 'Chiffrement SSL/TLS 256-bit, 2FA, surveillance 24/7, conformité RGPD, audits réguliers.' },
        { question: 'Terex est-il régulé ?', answer: 'Oui, nous respectons les réglementations financières, directives AML, règles KYC dans toutes nos juridictions.' },
      ],
    },
    {
      id: 'support', title: 'Support et Assistance',
      faqs: [
        { question: 'Comment contacter le support ?', answer: 'Chat en direct (< 5 min), Email terangaexchange@gmail.com (< 2h), Téléphone +1 (418) 261-9091, WhatsApp. Disponible 24/7.' },
        { question: 'Dans quelles langues ?', answer: 'Français et anglais, avec assistance en wolof et arabe selon les besoins.' },
        { question: 'Comment faire une réclamation ?', answer: 'Contactez notre service via email ou chat avec tous les documents. Réponse sous 5 jours ouvrables, 95% de satisfaction.' },
      ],
    },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const search = searchTerm.trim().toLowerCase();
  const matches = (q: string, a: string) => q.toLowerCase().includes(search) || a.toLowerCase().includes(search);

  // When searching: flatten all matching faqs across categories. Otherwise: show active category.
  const searchResults = search
    ? faqSections
        .map(s => ({ ...s, faqs: s.faqs.filter(f => matches(f.question, f.answer)) }))
        .filter(s => s.faqs.length > 0)
    : [];

  const totalQuestions = faqSections.reduce((n, s) => n + s.faqs.length, 0);
  const activeSection = faqSections.find(s => s.id === activeCategory);
  const activeMeta = faqCategories.find(c => c.id === activeCategory);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes tx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .tx-fade { animation: tx-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .tx-fade-2 { animation: tx-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .tx-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .tx-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .tx-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.06) !important; }
        .tx-input::placeholder { color: rgba(255,255,255,0.3); }
        .tx-cta { transition: transform 0.15s ease; }
        .tx-cta:hover { transform: translateY(-1px); }
        .tx-nav-item { transition: color 0.18s ease, background 0.18s ease; }
        .tx-nav-item:hover { background: rgba(255,255,255,0.03); }
        .tx-acc { transition: border-color 0.25s ease, background 0.25s ease; }
        .tx-acc:hover { border-color: rgba(255,255,255,0.13) !important; }
        @keyframes tx-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.82); } }
        .tx-live-dot { animation: tx-pulse 1.6s ease-in-out infinite; }
        @keyframes tx-typing { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        .tx-dot1 { animation: tx-typing 1.3s ease-in-out infinite; }
        .tx-dot2 { animation: tx-typing 1.3s ease-in-out 0.18s infinite; }
        .tx-dot3 { animation: tx-typing 1.3s ease-in-out 0.36s infinite; }
        @media (max-width: 1100px) { .tx-vline { display: none !important; } }
        @media (max-width: 960px) {
          .tx-layout { grid-template-columns: 1fr !important; }
          .tx-nav { position: static !important; }
          .tx-nav-list { display: flex !important; flex-wrap: wrap; gap: 8px; }
          .tx-nav-item { border-radius: 999px !important; }
          .tx-hero { grid-template-columns: 1fr !important; }
          .tx-hero-card { display: none !important; }
        }
        @media (max-width: 560px) {
          .tx-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .tx-nav-list { flex-wrap: nowrap !important; overflow-x: auto; }
        }
      `}</style>

      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div style={{ height: 64 }} />

      {/* HERO — editorial split */}
      <header className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="tx-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <div className="tx-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 18px' }}>Centre d'aide · FAQ</p>
            <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.3rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04, margin: '0 0 20px' }}>
              Des réponses claires,<br />sans détour.
            </h1>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.6, margin: '0 0 30px', maxWidth: 460 }}>
              {totalQuestions} questions classées par thème pour acheter, vendre et transférer vos USDT en toute confiance.
            </p>
            <div style={{ position: 'relative', maxWidth: 440 }}>
              <Search size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input
                className="tx-input"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, color: '#fff', fontSize: 14.5, padding: '0 14px 0 44px', height: 52, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Crafted visual: assistant card with live rate + typing bubble */}
          <div className="tx-hero-card tx-fade-2" style={{ position: 'relative' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Assistance Terex</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ position: 'relative', width: 6, height: 6 }}>
                        <span className="tx-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff' }} />
                      </span>
                      <span style={{ fontSize: 11, color: MUTED2 }}>En ligne · 24/7</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9.5, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>USDT / CFA</div>
                  {rateDisplay
                    ? <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{rateDisplay} <span style={{ fontSize: 10, color: MUTED2, fontWeight: 600 }}>CFA</span></div>
                    : <div style={{ width: 62, height: 16, borderRadius: 6, background: ICON_BG, marginTop: 2 }} />}
                </div>
              </div>

              {/* Chat thread mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ alignSelf: 'flex-end', maxWidth: '82%', background: '#fff', color: '#141414', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
                  Combien de temps prend un achat d'USDT ?
                </div>
                <div style={{ alignSelf: 'flex-start', maxWidth: '88%', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: '14px 14px 14px 4px', padding: '11px 14px', fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.55 }}>
                  En moyenne <strong style={{ color: '#fff' }}>moins de 5 minutes</strong>. Vos USDT arrivent directement sur votre wallet, sans frais cachés.
                </div>
                <div style={{ alignSelf: 'flex-start', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: '14px 14px 14px 4px', padding: '13px 16px', display: 'inline-flex', gap: 5 }}>
                  <span className="tx-dot1" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                  <span className="tx-dot2" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                  <span className="tx-dot3" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY — two-column editorial: sticky nav + accordion */}
      <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 72px', position: 'relative', zIndex: 1, borderTop: `1px solid ${BORDER}`, paddingTop: 56 }}>
        {search ? (
          searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0' }}>
              <Search size={28} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Aucun résultat</p>
              <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>Essayez d'autres mots-clés</p>
            </div>
          ) : (
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 30 }}>
              <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Résultats pour « <span style={{ color: '#fff', fontWeight: 600 }}>{searchTerm}</span> »</p>
              {searchResults.map(section => (
                <div key={section.id}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 14px' }}>{section.title}</p>
                  <Accordion section={section.id} faqs={section.faqs} openKey={openKey} setOpenKey={setOpenKey} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="tx-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'start' }}>
            {/* Sticky category nav */}
            <nav className="tx-nav" style={{ position: 'sticky', top: 96 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 16px' }}>Catégories</p>
              <div className="tx-nav-list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {faqCategories.map(cat => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  const count = faqSections.find(s => s.id === cat.id)?.faqs.length || 0;
                  return (
                    <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setOpenKey(`${cat.id}-0`); }}
                      className="tx-nav-item"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 11, flexShrink: 0,
                        background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                        color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                        border: 'none', borderRadius: 12, padding: '11px 12px', cursor: 'pointer',
                        fontSize: 13.5, fontWeight: active ? 600 : 500, textAlign: 'left', width: '100%',
                        position: 'relative',
                      }}>
                      <span style={{ width: 30, height: 30, borderRadius: 9, background: active ? '#fff' : ICON_BG, color: active ? '#141414' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s ease' }}>
                        <Icon size={15} strokeWidth={1.9} color={active ? '#141414' : 'rgba(255,255,255,0.85)'} />
                      </span>
                      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{cat.title}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: MUTED2 }}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live rate mini strip under nav */}
              <div style={{ marginTop: 22, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <span style={{ position: 'relative', width: 7, height: 7 }}>
                    <span className="tx-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff' }} />
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: MUTED2 }}>Taux en direct</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minHeight: 24 }}>
                  {rateDisplay ? (
                    <>
                      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{rateDisplay}</span>
                      <span style={{ color: MUTED2, fontSize: 12, fontWeight: 600 }}>CFA / USDT</span>
                    </>
                  ) : (
                    <span style={{ display: 'inline-block', width: 90, height: 22, borderRadius: 7, background: 'rgba(255,255,255,0.06)' }} />
                  )}
                </div>
              </div>
            </nav>

            {/* Accordion column */}
            <div className="tx-fade-2" style={{ minWidth: 0 }}>
              {activeMeta && (
                <div style={{ marginBottom: 26 }}>
                  <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px', lineHeight: 1.1 }}>{activeMeta.title}</h2>
                  <p style={{ fontSize: 14.5, color: MUTED, margin: 0 }}>{activeMeta.description}</p>
                </div>
              )}
              {activeSection && <Accordion section={activeSection.id} faqs={activeSection.faqs} openKey={openKey} setOpenKey={setOpenKey} />}

              {/* Still need help? — crafted contact prompt */}
              <div className="tx-tile" style={{ marginTop: 28, background: 'linear-gradient(135deg, #1e1e1e 0%, #1a1a1a 100%)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 26px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 120% at 90% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
                {/* Mock chat bubble cluster */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.35)' }}>
                    <MessageCircle size={24} color="#141414" />
                  </div>
                  <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `3px solid ${CARD}`, }} />
                </div>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Toujours bloqué ?</h3>
                  <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>Notre équipe répond en direct en moins de 5 minutes, 24h/24 et 7j/7.</p>
                </div>
                <button onClick={() => navigate('/support')} className="tx-cta" style={{ position: 'relative', background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 48, padding: '0 22px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Send size={15} /> Contacter le support
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <FooterSection />
    </div>
  );
};

function Accordion({ section, faqs, openKey, setOpenKey }: {
  section: string;
  faqs: { question: string; answer: string }[];
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {faqs.map((faq, i) => {
        const key = `${section}-${i}`;
        const open = openKey === key;
        return (
          <div key={key} className="tx-acc" style={{ background: open ? CARD2 : CARD, border: `1px solid ${open ? 'rgba(255,255,255,0.16)' : BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <button onClick={() => setOpenKey(open ? null : key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: MUTED2, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: open ? '#fff' : 'rgba(255,255,255,0.85)' }}>{faq.question}</span>
              </span>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChevronDown size={16} color="rgba(255,255,255,0.6)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)' }} />
              </span>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, margin: 0, padding: '0 20px 20px 54px', whiteSpace: 'pre-line' }}>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FAQPage;
