import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ChevronRight, GraduationCap, FileText, Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// ── Geometric SVG illustrations (Attio-style) ──────────────────────────

const illustrations: Record<string, JSX.Element> = {
  circles: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <circle cx="90" cy="90" r="50" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="90" cy="90" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <line x1="140" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
      <circle cx="210" cy="90" r="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="210" cy="90" r="5" fill="currentColor" opacity="0.15" />
      <text x="230" y="75" fontSize="14" fill="currentColor" opacity="0.2">+</text>
    </svg>
  ),
  rectangles: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="40" y="30" rx="12" ry="12" width="80" height="60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="60" y="50" rx="8" ry="8" width="80" height="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="150" y="70" rx="12" ry="12" width="80" height="80" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <text x="183" y="115" fontSize="14" fill="currentColor" opacity="0.2">+</text>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <path d="M140 20 L200 50 L200 110 Q200 150 140 170 Q80 150 80 110 L80 50 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M140 45 L175 62 L175 100 Q175 125 140 140 Q105 125 105 100 L105 62 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <circle cx="140" cy="95" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
    </svg>
  ),
  arrows: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <circle cx="60" cy="90" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="220" cy="90" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="95" y1="80" x2="185" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <polyline points="175,72 185,80 175,88" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="185" y1="100" x2="95" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <polyline points="105,92 95,100 105,108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
    </svg>
  ),
  blocks: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="30" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="85" y1="82" x2="112" y2="82" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="112" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="167" y1="82" x2="194" y2="82" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="194" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="57" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="139" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="221" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="100" y="20" rx="16" ry="16" width="80" height="140" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="115" y="45" rx="4" ry="4" width="50" height="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <rect x="115" y="60" rx="4" ry="4" width="35" height="8" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <rect x="115" y="80" rx="4" ry="4" width="50" height="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <circle cx="140" cy="145" r="6" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="50" y="40" rx="14" ry="14" width="160" height="100" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="150" y="70" rx="10" ry="10" width="70" height="40" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <circle cx="175" cy="90" r="8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="175" cy="90" r="3" fill="currentColor" opacity="0.15" />
      <line x1="70" y1="65" x2="130" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.15" />
      <line x1="70" y1="80" x2="110" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.12" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <line x1="40" y1="150" x2="240" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="40" y1="150" x2="40" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <polyline points="60,130 100,100 130,110 160,60 200,40 230,55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="160" cy="60" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="200" cy="40" r="3" fill="currentColor" opacity="0.2" />
      <line x1="60" y1="150" x2="60" y2="130" stroke="currentColor" strokeWidth="8" opacity="0.08" strokeLinecap="round" />
      <line x1="100" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="8" opacity="0.08" strokeLinecap="round" />
      <line x1="160" y1="150" x2="160" y2="60" stroke="currentColor" strokeWidth="8" opacity="0.08" strokeLinecap="round" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <circle cx="140" cy="90" r="60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="140" cy="90" rx="30" ry="60" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="80" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <ellipse cx="140" cy="65" rx="50" ry="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.15" />
      <ellipse cx="140" cy="115" rx="50" ry="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.15" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="100" y="75" rx="10" ry="10" width="80" height="70" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M115 75 L115 55 Q115 30 140 30 Q165 30 165 55 L165 75" stroke="currentColor" strokeWidth="1.5" opacity="0.25" fill="none" />
      <circle cx="140" cy="105" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <line x1="140" y1="113" x2="140" y2="125" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <path d="M140 40 L220 80 L140 120 L60 80 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      <path d="M60 100 L140 140 L220 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" fill="none" />
      <path d="M60 120 L140 160 L220 120" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
    </svg>
  ),
  coins: (
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <ellipse cx="120" cy="100" rx="45" ry="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="120" cy="85" rx="45" ry="20" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <ellipse cx="120" cy="70" rx="45" ry="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="75" y1="70" x2="75" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <line x1="165" y1="70" x2="165" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <circle cx="200" cy="70" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <text x="192" y="76" fontSize="18" fill="currentColor" opacity="0.2">$</text>
    </svg>
  ),
};

const GeometricIllustration = ({ name }: { name: string }) => (
  <div className="text-foreground">{illustrations[name] || illustrations.circles}</div>
);

// ── Sidebar categories ──────────────────────────────────────────────────

const sidebarCategories = [
  {
    section: "GUIDES",
    items: [
      { label: "Comprendre l'USDT", slug: "comprendre-usdt-stablecoin" },
      { label: "Acheter de l'USDT", slug: "acheter-usdt-terex-guide" },
      { label: "Vendre de l'USDT", slug: "vendre-usdt" },
      { label: "Mobile Money & Crypto", slug: "mobile-money-crypto" },
      { label: "KYC & Vérification", slug: "kyc-verification" },
    ]
  },
  {
    section: "SÉCURITÉ",
    items: [
      { label: "Sécurité crypto", slug: "securite-crypto" },
      { label: "Protéger son wallet", slug: "proteger-wallet" },
      { label: "Éviter les arnaques", slug: "eviter-arnaques" },
    ]
  },
  {
    section: "TECHNOLOGIE",
    items: [
      { label: "Blockchain expliquée", slug: "blockchain-simple" },
      { label: "Réseaux & Tokens", slug: "reseaux-tokens" },
      { label: "Smart contracts", slug: "smart-contracts" },
      { label: "Web3 & DeFi", slug: "web3-defi" },
    ]
  },
  {
    section: "FINANCE",
    items: [
      { label: "Stablecoins", slug: "stablecoins-guide" },
      { label: "Marchés crypto", slug: "marches-crypto" },
      { label: "Épargne en crypto", slug: "epargne-crypto" },
      { label: "Fiscalité crypto", slug: "fiscalite-crypto" },
    ]
  },
  {
    section: "RESSOURCES",
    items: [
      { label: "FAQ", slug: "/faq", external: true },
      { label: "Guide Terex", slug: "/guide", external: true },
      { label: "Support", slug: "/support", external: true },
      { label: "Sécurité", slug: "/security", external: true },
    ]
  }
];

// ── Academy courses ─────────────────────────────────────────────────────

const academyCourses = [
  // Existing articles (with routes)
  {
    title: "Comprendre l'USDT",
    description: "Le stablecoin le plus utilisé au monde. Découvrez pourquoi l'USDT est idéale pour les paiements et comment elle maintient sa valeur.",
    lessons: 4, duration: "15 min", slug: "comprendre-usdt-stablecoin", illustration: "circles", category: "Guides",
  },
  {
    title: "Acheter de l'USDT sur Terex",
    description: "Guide complet pour acheter vos premiers USDT. Paiement par Orange Money, Wave ou carte bancaire. Simple, rapide et sécurisé.",
    lessons: 3, duration: "12 min", slug: "acheter-usdt-terex-guide", illustration: "rectangles", category: "Guides",
  },
  {
    title: "Sécurité des transactions crypto",
    description: "Les meilleures pratiques pour protéger vos actifs numériques et effectuer des transactions en toute sérénité sur la blockchain.",
    lessons: 5, duration: "20 min", slug: "securite-crypto", illustration: "shield", category: "Sécurité",
  },
  {
    title: "La blockchain expliquée simplement",
    description: "Comprenez comment fonctionne la blockchain, les blocs, le minage et pourquoi elle transforme la finance mondiale.",
    lessons: 6, duration: "25 min", slug: "blockchain-simple", illustration: "blocks", category: "Technologie",
  },
  {
    title: "Mobile Money & Crypto en Afrique",
    description: "L'union du Mobile Money et des cryptomonnaies crée de nouvelles opportunités pour l'inclusion financière sur le continent.",
    lessons: 3, duration: "14 min", slug: "mobile-money-crypto", illustration: "phone", category: "Guides",
  },
  // New articles (no dedicated route yet — link to blog for now)
  {
    title: "Wallets crypto : le guide complet",
    description: "Hot wallet, cold wallet, custodial ou non-custodial. Apprenez à choisir et sécuriser le portefeuille qui vous convient.",
    lessons: 5, duration: "22 min", slug: "wallets-guide", illustration: "wallet", category: "Guides",
  },
  {
    title: "Stablecoins : USDT, USDC et au-delà",
    description: "Comprendre les différents stablecoins, leurs mécanismes de stabilité et lequel choisir pour vos opérations quotidiennes.",
    lessons: 4, duration: "18 min", slug: "stablecoins-guide", illustration: "coins", category: "Finance",
  },
  {
    title: "Web3 & Finance décentralisée",
    description: "Le Web3 et la DeFi redéfinissent la finance. Découvrez les protocoles, le yield farming et les opportunités émergentes.",
    lessons: 7, duration: "30 min", slug: "web3-defi", illustration: "layers", category: "Technologie",
  },
  {
    title: "Réseaux blockchain : TRC20, ERC20, BEP20",
    description: "Chaque réseau a ses avantages. Apprenez à choisir le bon réseau pour envoyer vos USDT avec des frais minimaux.",
    lessons: 3, duration: "10 min", slug: "reseaux-tokens", illustration: "arrows", category: "Technologie",
  },
  {
    title: "Éviter les arnaques crypto",
    description: "Phishing, faux projets, rug pulls… Identifiez les signaux d'alerte et protégez-vous contre les escroqueries les plus courantes.",
    lessons: 4, duration: "16 min", slug: "eviter-arnaques", illustration: "lock", category: "Sécurité",
  },
  {
    title: "Marchés crypto : lire les tendances",
    description: "Analyse technique de base, indicateurs clés et comment interpréter les mouvements du marché pour prendre de meilleures décisions.",
    lessons: 5, duration: "24 min", slug: "marches-crypto", illustration: "chart", category: "Finance",
  },
  {
    title: "KYC & Vérification d'identité",
    description: "Pourquoi le KYC est essentiel, comment vérifier votre identité sur Terex et les avantages d'un compte vérifié.",
    lessons: 2, duration: "8 min", slug: "kyc-verification", illustration: "shield", category: "Guides",
  },
  {
    title: "Smart contracts expliqués",
    description: "Les contrats intelligents automatisent les transactions sans intermédiaire. Découvrez leur fonctionnement et leurs applications concrètes.",
    lessons: 4, duration: "19 min", slug: "smart-contracts", illustration: "blocks", category: "Technologie",
  },
  {
    title: "Épargner en crypto",
    description: "Staking, lending, comptes d'épargne crypto. Explorez les moyens de faire fructifier vos actifs numériques en toute sécurité.",
    lessons: 3, duration: "15 min", slug: "epargne-crypto", illustration: "coins", category: "Finance",
  },
  {
    title: "Protéger son wallet",
    description: "Phrases de récupération, authentification 2FA, bonnes pratiques de stockage. Le guide ultime pour sécuriser vos fonds.",
    lessons: 4, duration: "17 min", slug: "proteger-wallet", illustration: "lock", category: "Sécurité",
  },
  {
    title: "Vendre de l'USDT sur Terex",
    description: "Comment convertir vos USDT en francs CFA via Orange Money ou Wave. Processus simple avec réception instantanée.",
    lessons: 3, duration: "10 min", slug: "vendre-usdt", illustration: "arrows", category: "Guides",
  },
  {
    title: "Fiscalité crypto en Afrique",
    description: "Ce que vous devez savoir sur la réglementation et la fiscalité des cryptomonnaies dans les pays africains francophones.",
    lessons: 3, duration: "13 min", slug: "fiscalite-crypto", illustration: "globe", category: "Finance",
  },
  {
    title: "L'Afrique et la révolution crypto",
    description: "Comment l'Afrique adopte les cryptomonnaies plus rapidement que tout autre continent et ce que cela signifie pour l'avenir.",
    lessons: 4, duration: "20 min", slug: "afrique-crypto", illustration: "globe", category: "Finance",
  },
];

// Existing article slugs that have dedicated pages
const existingSlugs = new Set([
  "comprendre-usdt-stablecoin",
  "acheter-usdt-terex-guide",
  "securite-crypto",
  "transferts-internationaux",
  "blockchain-simple",
  "mobile-money-crypto",
]);

// ── Component ───────────────────────────────────────────────────────────

export default function BlogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
    }
  };

  const filteredCourses = academyCourses.filter(c => {
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(academyCourses.map(c => c.category))];

  const SidebarContent = () => (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-white/[0.03] border-white/[0.08] text-foreground h-9 rounded-lg pl-9 text-sm placeholder:text-white/25 focus:border-white/20"
        />
      </div>

      {sidebarCategories.map((cat, ci) => (
        <div key={ci} className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              {ci < 4 ? <GraduationCap className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} /> : <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />}
            </div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-[0.15em]">{cat.section}</p>
          </div>
          <div className="space-y-0.5 pl-1">
            {cat.items.map((item, ii) => (
              <Link
                key={ii}
                to={item.external ? item.slug : `/blog/${item.slug}`}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <span className="-ml-5 group-hover:ml-0 transition-all">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div className="h-16 md:h-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex relative">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24 self-start pr-6 py-12 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <aside className="absolute left-0 top-0 h-full w-[280px] bg-terex-dark border-r border-white/[0.08] p-6 pt-24 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 py-12 lg:py-16 lg:pl-6">
          {/* Hero */}
          <div className="mb-10 md:mb-14">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.1] mb-4">
              Terex Academy
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Apprenez tout sur la crypto, l'USDT, la sécurité, les wallets, la DeFi et bien plus. Des guides simples et pratiques pour maîtriser la finance numérique.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                !activeCategory 
                  ? 'bg-foreground text-background' 
                  : 'bg-white/[0.04] text-muted-foreground border border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              Tout
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-foreground text-background' 
                    : 'bg-white/[0.04] text-muted-foreground border border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {filteredCourses.map((course, i) => {
              const hasPage = existingSlugs.has(course.slug);
              const linkTo = hasPage ? `/blog/${course.slug}` : `/blog`;
              return (
                <Link key={i} to={linkTo} className="group">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.15] transition-all">
                    <div className="aspect-[16/10] p-8 md:p-10 flex items-center justify-center border-b border-white/[0.06] bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors">
                      <div className="w-full max-w-[240px]">
                        <GeometricIllustration name={course.illustration} />
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-muted-foreground">{course.category}</span>
                        {!hasPage && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-terex-accent/10 text-terex-accent">Bientôt</span>}
                      </div>
                      <h3 className="text-foreground text-lg md:text-xl font-normal mb-2 group-hover:text-white transition-colors">{course.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                      <p className="text-muted-foreground/60 text-xs">
                        {course.lessons} articles <span className="mx-1.5">|</span> {course.duration}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">Aucun résultat pour "{searchQuery}"</p>
            </div>
          )}
        </main>
      </div>

      <FooterSection />
    </div>
  );
}
