import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ChevronRight, BookOpen, Shield, ArrowLeftRight, Cpu, Smartphone, GraduationCap, Wallet, FileText, HelpCircle, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

// Geometric SVG illustrations inspired by Attio Academy
const GeometricIllustration = ({ variant }: { variant: number }) => {
  const illustrations = [
    // Circles with dashed connector
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <circle cx="90" cy="90" r="50" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="90" cy="90" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <line x1="140" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
      <circle cx="210" cy="90" r="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="210" cy="90" r="5" fill="currentColor" opacity="0.15" />
      <text x="230" y="75" fontSize="14" fill="currentColor" opacity="0.2">+</text>
    </svg>,
    // Rounded rectangles
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="40" y="30" rx="12" ry="12" width="80" height="60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="60" y="50" rx="8" ry="8" width="80" height="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="150" y="70" rx="12" ry="12" width="80" height="80" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <text x="183" y="115" fontSize="14" fill="currentColor" opacity="0.2">+</text>
    </svg>,
    // Shield shape
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <path d="M140 20 L200 50 L200 110 Q200 150 140 170 Q80 150 80 110 L80 50 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M140 45 L175 62 L175 100 Q175 125 140 140 Q105 125 105 100 L105 62 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <circle cx="140" cy="95" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
    </svg>,
    // Arrows / transfer
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <circle cx="60" cy="90" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="220" cy="90" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="95" y1="80" x2="185" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <polyline points="175,72 185,80 175,88" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="185" y1="100" x2="95" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <polyline points="105,92 95,100 105,108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
    </svg>,
    // Blockchain blocks
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="30" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="85" y1="82" x2="112" y2="82" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="112" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="167" y1="82" x2="194" y2="82" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <rect x="194" y="55" rx="8" ry="8" width="55" height="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="57" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="139" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="221" cy="82" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>,
    // Phone / mobile
    <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
      <rect x="100" y="20" rx="16" ry="16" width="80" height="140" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="115" y="45" rx="4" ry="4" width="50" height="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <rect x="115" y="60" rx="4" ry="4" width="35" height="8" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <rect x="115" y="80" rx="4" ry="4" width="50" height="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <circle cx="140" cy="145" r="6" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <text x="125" y="35" fontSize="8" fill="currentColor" opacity="0.2">___</text>
    </svg>,
  ];
  return <div className="text-foreground">{illustrations[variant % illustrations.length]}</div>;
};

// Academy content categories
const academyCategories = [
  {
    section: "APPRENDRE",
    items: [
      { label: "USDT & Stablecoins", slug: "comprendre-usdt-stablecoin" },
      { label: "Acheter de l'USDT", slug: "acheter-usdt-terex-guide" },
      { label: "Sécurité crypto", slug: "securite-crypto" },
      { label: "Transferts", slug: "transferts-internationaux" },
      { label: "Blockchain", slug: "blockchain-simple" },
      { label: "Mobile Money & Crypto", slug: "mobile-money-crypto" },
    ]
  },
  {
    section: "RESSOURCES",
    items: [
      { label: "FAQ", slug: "/faq", external: true },
      { label: "Guide d'utilisation", slug: "/guide", external: true },
      { label: "Support", slug: "/support", external: true },
    ]
  }
];

const academyCourses = [
  {
    title: "USDT & Stablecoins",
    description: "Découvrez comment les stablecoins révolutionnent les transferts d'argent en Afrique et pourquoi l'USDT est la solution idéale.",
    lessons: 4,
    duration: "15 min",
    slug: "comprendre-usdt-stablecoin",
    illustration: 0,
  },
  {
    title: "Acheter de l'USDT",
    description: "Guide étape par étape pour acheter vos premiers USDT avec mobile money, carte bancaire ou virement.",
    lessons: 3,
    duration: "12 min",
    slug: "acheter-usdt-terex-guide",
    illustration: 1,
  },
  {
    title: "Sécurité crypto",
    description: "Les meilleures pratiques pour protéger vos actifs numériques et effectuer des transactions en toute sérénité.",
    lessons: 5,
    duration: "20 min",
    slug: "securite-crypto",
    illustration: 2,
  },
  {
    title: "Transferts internationaux",
    description: "Envoyez de l'argent partout dans le monde rapidement et à moindre coût grâce à la blockchain.",
    lessons: 4,
    duration: "18 min",
    slug: "transferts-internationaux",
    illustration: 3,
  },
  {
    title: "La blockchain expliquée",
    description: "Comprenez comment fonctionne la blockchain et pourquoi elle transforme l'économie mondiale.",
    lessons: 6,
    duration: "25 min",
    slug: "blockchain-simple",
    illustration: 4,
  },
  {
    title: "Mobile Money & Crypto",
    description: "L'union du Mobile Money et des cryptomonnaies crée de nouvelles opportunités pour l'inclusion financière en Afrique.",
    lessons: 3,
    duration: "14 min",
    slug: "mobile-money-crypto",
    illustration: 5,
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background */}
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
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24 self-start pr-8 py-12">
          {academyCategories.map((cat, ci) => (
            <div key={ci} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  {ci === 0 ? <GraduationCap className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} /> : <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />}
                </div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-[0.15em]">{cat.section}</p>
              </div>
              <div className="space-y-0.5 pl-1">
                {cat.items.map((item, ii) => (
                  <Link
                    key={ii}
                    to={item.external ? item.slug : `/blog/${item.slug}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="-ml-5 group-hover:ml-0 transition-all">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
              {academyCategories.map((cat, ci) => (
                <div key={ci} className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                      {ci === 0 ? <GraduationCap className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} /> : <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />}
                    </div>
                    <p className="text-muted-foreground text-[10px] font-medium tracking-[0.15em]">{cat.section}</p>
                  </div>
                  <div className="space-y-0.5 pl-1">
                    {cat.items.map((item, ii) => (
                      <Link
                        key={ii}
                        to={item.external ? item.slug : `/blog/${item.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 opacity-40" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 py-12 lg:py-16 lg:pl-4">
          {/* Hero */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.1] mb-4">
              Terex Academy
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Apprenez tout sur la crypto, l'USDT, les transferts internationaux et la blockchain. Des guides simples et pratiques pour maîtriser la finance numérique en Afrique.
            </p>
          </div>

          {/* Course grid — Attio-style cards with geometric illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {academyCourses.map((course, i) => (
              <Link key={i} to={`/blog/${course.slug}`} className="group">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.15] transition-all">
                  {/* Illustration area */}
                  <div className="aspect-[16/10] p-8 md:p-10 flex items-center justify-center border-b border-white/[0.06] bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors">
                    <div className="w-full max-w-[240px]">
                      <GeometricIllustration variant={course.illustration} />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-foreground text-lg md:text-xl font-normal mb-2 group-hover:text-white transition-colors">{course.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                    <p className="text-muted-foreground/60 text-xs">
                      {course.lessons} articles <span className="mx-1.5">|</span> {course.duration}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <FooterSection />
    </div>
  );
}
