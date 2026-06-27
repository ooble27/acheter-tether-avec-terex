import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ChevronRight, GraduationCap, FileText, Menu, Search, Clock, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// ── Article images map ─────────────────────────────────────────────────

const articleImages: Record<string, string> = {
  "comprendre-usdt-stablecoin": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
  "acheter-usdt-terex-guide": "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80",
  "securite-crypto": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80",
  "blockchain-simple": "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
  "mobile-money-crypto": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
  "transferts-internationaux": "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=80",
  "wallets-guide": "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
  "stablecoins-guide": "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?auto=format&fit=crop&w=800&q=80",
  "web3-defi": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=800&q=80",
  "reseaux-tokens": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  "eviter-arnaques": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
  "marches-crypto": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "kyc-verification": "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&q=80",
  "smart-contracts": "https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?auto=format&fit=crop&w=800&q=80",
  "epargne-crypto": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
  "proteger-wallet": "https://images.unsplash.com/photo-1618044619888-009e412ff12a?auto=format&fit=crop&w=800&q=80",
  "vendre-usdt": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
  "fiscalite-crypto": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
  "afrique-crypto": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
};

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

// ── Category color map ────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  "Guides": "bg-[#3B968F]/20 text-[#3B968F]",
  "Sécurité": "bg-amber-500/20 text-amber-400",
  "Technologie": "bg-blue-500/20 text-blue-400",
  "Finance": "bg-purple-500/20 text-purple-400",
};

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
      toast({ title: "Déconnexion réussie", description: "À bientôt" });
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

  // Featured = first 3 articles that have pages (when no filter/search active)
  const featuredArticles = academyCourses.filter(c => existingSlugs.has(c.slug)).slice(0, 3);
  const remainingArticles = filteredCourses.filter(c => {
    if (searchQuery || activeCategory) return true;
    return !featuredArticles.includes(c);
  });

  const showFeatured = !searchQuery && !activeCategory;
  const heroArticle = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);

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
        <aside className="hidden lg:block w-[240px] flex-shrink-0 pr-6 py-12">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden fixed bottom-20 left-4 z-50 w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-terex-dark border-r border-white/[0.08] p-6 pt-12 overflow-y-auto z-[60]">
            <SheetTitle className="sr-only">Navigation Blog</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-10 lg:py-14 lg:pl-6">

          {/* Page header */}
          <div className="mb-8 md:mb-10">
            <p className="text-[#3B968F] text-[11px] font-medium tracking-[0.2em] uppercase mb-3">Terex Blog</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.1] mb-3">
              Guides &amp; Analyses
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Guides, analyses et actualités crypto pour l'Afrique
            </p>
          </div>

          {/* Featured hero */}
          {showFeatured && heroArticle && (
            <Link
              to={existingSlugs.has(heroArticle.slug) ? `/blog/${heroArticle.slug}` : `/blog`}
              className="group block mb-8"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] group-hover:border-white/20 transition-all">
                <div className="relative aspect-[21/9] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80"
                    alt={heroArticle.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#3B968F] text-white uppercase tracking-wider">À la Une</span>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${categoryColors[heroArticle.category] || "bg-white/10 text-white/60"}`}>{heroArticle.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-light text-white mb-2 leading-snug max-w-2xl">
                    {heroArticle.title}
                  </h2>
                  <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed mb-4 line-clamp-2">
                    {heroArticle.description}
                  </p>
                  <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{heroArticle.duration} de lecture</span>
                    <span>{heroArticle.lessons} articles</span>
                    <span className="flex items-center gap-1 text-[#3B968F] group-hover:gap-2 transition-all font-medium">Lire <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Secondary featured — 2-column */}
          {showFeatured && secondaryFeatured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {secondaryFeatured.map((article, i) => (
                <Link
                  key={i}
                  to={existingSlugs.has(article.slug) ? `/blog/${article.slug}` : `/blog`}
                  className="group block"
                >
                  <div className="rounded-2xl overflow-hidden border border-white/[0.08] group-hover:border-white/20 transition-all h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={articleImages[article.slug] || `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80`}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-white/10 text-white/60"}`}>{article.category}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-foreground text-lg font-normal mb-2 group-hover:text-white transition-colors leading-snug">{article.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center gap-3 text-muted-foreground/50 text-xs">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.duration}</span>
                        <span>{article.lessons} articles</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Section divider */}
          {showFeatured && (
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-muted-foreground text-[11px] font-medium tracking-[0.15em] uppercase">Tous les articles</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          )}

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

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {remainingArticles.map((course, i) => {
              const hasPage = existingSlugs.has(course.slug);
              const linkTo = hasPage ? `/blog/${course.slug}` : `/blog`;
              const imgSrc = articleImages[course.slug] || `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80`;
              return (
                <Link key={i} to={linkTo} className="group block">
                  <article className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.01] group-hover:border-white/20 transition-all h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryColors[course.category] || "bg-white/10 text-white/70"}`}>
                          {course.category}
                        </span>
                        {!hasPage && (
                          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm bg-[#3B968F]/20 text-[#3B968F]">
                            Bientôt
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-foreground text-base md:text-lg font-normal mb-2 group-hover:text-white transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-muted-foreground/50 text-xs">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                          <span>{course.lessons} articles</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-[#3B968F] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </article>
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
