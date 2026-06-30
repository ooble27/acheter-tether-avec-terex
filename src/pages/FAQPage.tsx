import { Search, MessageCircle, User, ShoppingCart, Shield, DollarSign, HelpCircle, Globe, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#141414';
const CARD = '#1e1e1e';
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
    { id: 'achat', title: "Achat d'USDT", icon: ShoppingCart, description: 'Comment acheter des cryptomonnaies' },
    { id: 'vente', title: "Vente d'USDT", icon: DollarSign, description: 'Vendre vos cryptomonnaies' },
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

  const activeSection = faqSections.find(s => s.id === activeCategory);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes tx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .tx-fade { animation: tx-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .tx-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .tx-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .tx-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.06) !important; }
        .tx-input::placeholder { color: rgba(255,255,255,0.3); }
        .tx-cta { transition: transform 0.15s ease; }
        .tx-cta:hover { transform: translateY(-1px); }
        @media (max-width: 1100px) { .tx-vline { display: none !important; } }
        @media (max-width: 860px) {
          .tx-faq-grid { grid-template-columns: 1fr !important; }
          .tx-cat-scroll { overflow-x: auto; }
        }
        @media (max-width: 560px) {
          .tx-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .tx-chips { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 4px; }
        }
      `}</style>

      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div style={{ height: 72 }} />

      {/* HERO */}
      <header className="tx-pad tx-fade" style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px 0', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 12px' }}>FAQ</p>
        <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 14px' }}>
          Questions fréquentes
        </h1>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: '0 auto 28px', maxWidth: 480 }}>
          Tout ce qu'il faut savoir pour acheter, vendre et transférer vos USDT sur Terex.
        </p>
        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
          <input
            className="tx-input"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, color: '#fff', fontSize: 14, padding: '0 14px 0 42px', height: 48, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </header>

      {/* BODY */}
      <section className="tx-pad" style={{ maxWidth: 900, margin: '0 auto', padding: '44px 32px 56px', position: 'relative', zIndex: 1 }}>
        {search ? (
          searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Search size={28} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Aucun résultat</p>
              <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>Essayez d'autres mots-clés</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {searchResults.map(section => (
                <div key={section.id}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 12px' }}>{section.title}</p>
                  <Accordion section={section.id} faqs={section.faqs} openKey={openKey} setOpenKey={setOpenKey} />
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {/* Category chips */}
            <div className="tx-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {faqCategories.map(cat => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                const count = faqSections.find(s => s.id === cat.id)?.faqs.length || 0;
                return (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setOpenKey(`${cat.id}-0`); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 9, flexShrink: 0,
                      background: active ? '#fff' : CARD,
                      color: active ? '#141414' : 'rgba(255,255,255,0.8)',
                      border: `1px solid ${active ? '#fff' : BORDER}`,
                      borderRadius: 999, padding: '9px 16px', cursor: 'pointer',
                      fontSize: 13.5, fontWeight: 600, transition: 'all 0.18s ease',
                    }}>
                    <Icon size={15} strokeWidth={1.9} />
                    {cat.title}
                    <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.55 }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {activeSection && <Accordion section={activeSection.id} faqs={activeSection.faqs} openKey={openKey} setOpenKey={setOpenKey} />}
          </>
        )}

        {/* Live rate strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 20px', marginTop: 36 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 6px' }}>Taux USDT / CFA · en direct</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, minHeight: 28 }}>
              {rateDisplay ? (
                <>
                  <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>{rateDisplay}</span>
                  <span style={{ color: MUTED2, fontSize: 13, fontWeight: 600 }}>CFA</span>
                </>
              ) : (
                <span style={{ display: 'inline-block', width: 100, height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          </div>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', opacity: 0.85, boxShadow: '0 0 0 4px rgba(255,255,255,0.08)' }} />
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', borderTop: `1px solid ${BORDER}`, marginTop: 44, paddingTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>Vous ne trouvez pas votre réponse ?</h2>
          <p style={{ fontSize: 14, color: MUTED, margin: '0 0 22px' }}>Notre équipe est disponible 24/7 pour vous aider.</p>
          <button onClick={() => navigate('/support')} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 48, padding: '0 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <MessageCircle size={16} /> Contacter le support
          </button>
        </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {faqs.map((faq, i) => {
        const key = `${section}-${i}`;
        const open = openKey === key;
        return (
          <div key={key} className="tx-tile" style={{ background: CARD, border: `1px solid ${open ? 'rgba(255,255,255,0.16)' : BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <button onClick={() => setOpenKey(open ? null : key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: open ? '#fff' : 'rgba(255,255,255,0.85)' }}>{faq.question}</span>
              <ChevronDown size={17} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
            </button>
            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.28s cubic-bezier(0.22,1,0.36,1)' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0, padding: '0 20px 20px', whiteSpace: 'pre-line' }}>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FAQPage;
