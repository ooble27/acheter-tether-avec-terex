import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, ArrowLeft, User, ShoppingCart, Shield, DollarSign, HelpCircle, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const FAQPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<{question: string, answer: string, category: string} | null>(null);

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
      id: 'demarrage', title: "Démarrage et Compte",
      faqs: [
        { question: "Qu'est-ce que Terex et comment ça marche ?", answer: "Terex est la première plateforme d'échange crypto-fiat dédiée à l'Afrique francophone. Nous permettons d'acheter, vendre et transférer des cryptomonnaies (principalement USDT) en utilisant les monnaies locales (CFA). Notre plateforme connecte les écosystèmes financiers traditionnels aux marchés des cryptomonnaies avec des délais ultra-rapides de 5 minutes maximum." },
        { question: "Comment créer un compte sur Terex ?", answer: "Pour créer votre compte : 1) Cliquez sur 'S'inscrire' et entrez votre email et mot de passe, 2) Vérifiez votre email via le lien reçu, 3) Complétez votre profil, 4) Soumettez vos documents KYC. L'inscription est gratuite et prend moins de 10 minutes." },
        { question: "Qu'est-ce que la vérification KYC ?", answer: "KYC (Know Your Customer) est un processus de vérification d'identité obligatoire. Vous devez fournir : une pièce d'identité valide, un justificatif de domicile récent, et un selfie. Cette étape garantit la sécurité de tous les utilisateurs." },
        { question: "Combien de temps prend la vérification KYC ?", answer: "La vérification prend 24-48 heures ouvrables. Vous recevrez un email de confirmation une fois votre compte vérifié." },
        { question: "Puis-je utiliser Terex sans KYC ?", answer: "Oui, vous pouvez commencer à effectuer des transactions immédiatement. La vérification KYC reste recommandée pour des limites plus élevées." }
      ]
    },
    {
      id: 'achat', title: "Achat d'USDT",
      faqs: [
        { question: "Comment acheter des USDT sur Terex ?", answer: "1) Allez dans 'Acheter USDT', 2) Choisissez votre devise, 3) Entrez le montant, 4) Sélectionnez votre réseau blockchain, 5) Fournissez votre adresse USDT, 6) Choisissez votre méthode de paiement, 7) Suivez les instructions. Vos USDT sont livrés sous 5 minutes." },
        { question: "Quels réseaux blockchain sont supportés ?", answer: "TRC20 (Tron) - le plus économique, BEP20 (BSC) - rapide, ERC20 (Ethereum) - sécurisé, Arbitrum, Polygon, Solana, Aptos." },
        { question: "Quels sont les montants min/max ?", answer: "Minimum : 50,000 CFA ou 100 CAD. Maximum : 2M CFA (non vérifié), 10M CFA (vérifié KYC)." },
        { question: "Quelles méthodes de paiement ?", answer: "Mobile Money (Orange Money, Wave), cartes Visa/Mastercard, virements bancaires, QR code." },
        { question: "Comment fonctionne le taux de change ?", answer: "Taux mis à jour en temps réel, sans frais cachés. Le taux est bloqué pendant 15 minutes une fois la commande créée." },
      ]
    },
    {
      id: 'vente', title: "Vente d'USDT",
      faqs: [
        { question: "Comment vendre mes USDT ?", answer: "1) Allez dans 'Vendre USDT', 2) Entrez le montant, 3) Choisissez votre réseau, 4) Sélectionnez la méthode de réception, 5) Envoyez vos USDT, 6) Recevez votre paiement sous 5 minutes." },
        { question: "Puis-je vendre depuis Binance ?", answer: "Oui ! Créez une commande de vente sur Terex, copiez l'adresse fournie, puis faites un retrait depuis Binance vers cette adresse." },
        { question: "Combien de temps prend une vente ?", answer: "5-15 minutes : 1-3 min confirmation blockchain + 2-5 min traitement + envoi immédiat vers votre compte." },
      ]
    },
    {
      id: 'transferts', title: "Transferts Internationaux",
      faqs: [
        { question: "Vers quels pays ?", answer: "Sénégal, Côte d'Ivoire, Mali, Burkina Faso et Niger via Mobile Money (Orange Money, Wave, Free Money)." },
        { question: "Comment effectuer un transfert ?", answer: "1) Choisissez le pays, 2) Entrez le montant, 3) Sélectionnez la méthode, 4) Informations du bénéficiaire, 5) Payez, 6) Réception sous 10 minutes." },
        { question: "Le bénéficiaire a-t-il besoin d'un compte ?", answer: "Non, il suffit d'avoir un compte Mobile Money. Il recevra l'argent directement avec notification SMS." },
      ]
    },
    {
      id: 'securite', title: "Sécurité et Conformité",
      faqs: [
        { question: "Terex est-il non-custodial ?", answer: "Oui, Terex ne détient JAMAIS vos fonds. Vos USDT sont envoyés directement à votre wallet. Nous agissons uniquement comme intermédiaire de transaction." },
        { question: "Comment sont protégées mes données ?", answer: "Chiffrement SSL/TLS 256-bit, 2FA, surveillance 24/7, conformité RGPD, audits réguliers." },
        { question: "Terex est-il régulé ?", answer: "Oui, nous respectons les réglementations financières, directives AML, règles KYC dans toutes nos juridictions." },
      ]
    },
    {
      id: 'support', title: "Support et Assistance",
      faqs: [
        { question: "Comment contacter le support ?", answer: "Chat en direct (< 5 min), Email terangaexchange@gmail.com (< 2h), Téléphone +1 (418) 261-9091, WhatsApp. Disponible 24/7." },
        { question: "Dans quelles langues ?", answer: "Français et anglais, avec assistance en wolof et arabe selon les besoins." },
        { question: "Comment faire une réclamation ?", answer: "Contactez notre service via email ou chat avec tous les documents. Réponse sous 5 jours ouvrables, 95% de satisfaction." },
      ]
    }
  ];

  const filteredSections = searchTerm 
    ? faqSections.map(s => ({ ...s, faqs: s.faqs.filter(f => f.question.toLowerCase().includes(searchTerm.toLowerCase()) || f.answer.toLowerCase().includes(searchTerm.toLowerCase())) })).filter(s => s.faqs.length > 0)
    : faqSections;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" }); window.location.reload(); }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ FAQ</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSelectedCategory(null); setSelectedFaq(null); }}
                className="pl-10 h-11 bg-white/[0.03] border-white/[0.08] text-foreground text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {!selectedCategory && !searchTerm ? (
            <>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Collections</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  const count = faqSections.find(s => s.id === cat.id)?.faqs.length || 0;
                  return (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="group p-4 md:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all text-left">
                      <Icon className="w-5 h-5 text-muted-foreground mb-3" />
                      <p className="text-foreground text-sm font-medium mb-0.5">{cat.title}</p>
                      <p className="text-muted-foreground text-[11px]">{count} articles</p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : selectedCategory && !selectedFaq ? (
            <>
              <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="text-muted-foreground hover:text-foreground mb-4 -ml-2 h-8 text-xs">
                <ArrowLeft className="w-3 h-3 mr-1.5" /> Retour
              </Button>
              <p className="text-foreground font-medium text-base md:text-lg mb-4">
                {faqCategories.find(c => c.id === selectedCategory)?.title}
              </p>
              <div className="space-y-2">
                {faqSections.find(s => s.id === selectedCategory)?.faqs.map((faq, i) => (
                  <button key={i} onClick={() => setSelectedFaq({...faq, category: faqSections.find(s => s.id === selectedCategory)?.title || ''})} className="w-full group flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all text-left">
                    <span className="text-foreground text-sm flex-1">{faq.question}</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-3 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </>
          ) : searchTerm ? (
            <>
              <Button variant="ghost" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }} className="text-muted-foreground hover:text-foreground mb-4 -ml-2 h-8 text-xs">
                <ArrowLeft className="w-3 h-3 mr-1.5" /> Effacer
              </Button>
              {filteredSections.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-foreground text-sm">Aucun résultat</p>
                  <p className="text-muted-foreground text-xs mt-1">Essayez d'autres mots-clés</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSections.map((section) => (
                    <div key={section.id}>
                      <p className="text-muted-foreground text-xs uppercase tracking-[0.1em] mb-3">{section.title}</p>
                      <div className="space-y-2">
                        {section.faqs.map((faq, i) => (
                          <button key={i} onClick={() => setSelectedFaq({...faq, category: section.title})} className="w-full group flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all text-left">
                            <span className="text-foreground text-sm flex-1">{faq.question}</span>
                            <ChevronRight className="w-4 h-4 text-white/20 ml-3 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}

          {/* CTA */}
          {!selectedCategory && !searchTerm && (
            <>
              <div className="border-t border-dashed border-white/10 mt-12 mb-8" />
              <div className="text-center py-6">
                <p className="text-foreground text-sm mb-2">Vous ne trouvez pas votre réponse ?</p>
                <Button onClick={() => navigate('/support')} className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium h-10 text-sm px-5">
                  <MessageCircle className="w-4 h-4 mr-2" /> Contacter le support
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Detail Modal */}
      {selectedFaq && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedFaq(null)}>
          <div className="bg-terex-dark rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-white/[0.08]" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-terex-dark border-b border-white/[0.06] px-5 py-4 flex items-center justify-between z-10">
              <Button variant="ghost" onClick={() => setSelectedFaq(null)} className="text-muted-foreground hover:text-foreground h-8 text-xs -ml-2">
                <ArrowLeft className="w-3 h-3 mr-1.5" /> Retour
              </Button>
              <span className="text-muted-foreground text-[11px]">{selectedFaq.category}</span>
            </div>
            <div className="px-5 py-6 md:px-8 md:py-8">
              <h1 className="text-lg md:text-xl font-medium text-foreground mb-4">{selectedFaq.question}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{selectedFaq.answer}</p>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default FAQPage;
