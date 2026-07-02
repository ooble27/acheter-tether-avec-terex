import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

// ── Article images (only real articles with routes) ────────────────────
const articleImages: Record<string, string> = {
  "comprendre-usdt-stablecoin": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
  "acheter-usdt-terex-guide": "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1200&q=80",
  "mobile-money-crypto": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80",
  "transferts-internationaux": "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
  "securite-crypto": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
  "blockchain-simple": "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80",
};

// ── The 6 real articles (each has a /blog/{slug} route) ─────────────────
type Article = { slug: string; title: string; excerpt: string; category: string; readTime: string };

const ARTICLES: Article[] = [
  {
    slug: "comprendre-usdt-stablecoin",
    title: "Comprendre l'USDT, le stablecoin",
    excerpt: "Qu'est-ce qu'un stablecoin et pourquoi l'USDT est la porte d'entrée la plus simple vers la crypto.",
    category: "Guides",
    readTime: "6 min",
  },
  {
    slug: "acheter-usdt-terex-guide",
    title: "Acheter de l'USDT sur Terex",
    excerpt: "Le guide pas à pas pour acheter vos premiers USDT en CFA, en quelques minutes.",
    category: "Guides",
    readTime: "5 min",
  },
  {
    slug: "mobile-money-crypto",
    title: "Mobile Money & Crypto",
    excerpt: "Comment Wave et Orange Money rendent l'achat de crypto accessible à tous.",
    category: "Guides",
    readTime: "5 min",
  },
  {
    slug: "transferts-internationaux",
    title: "Transferts internationaux",
    excerpt: "Envoyer de l'argent vers l'Afrique de l'Ouest, plus vite et moins cher avec l'USDT.",
    category: "Usages",
    readTime: "7 min",
  },
  {
    slug: "securite-crypto",
    title: "Sécurité crypto",
    excerpt: "Les bonnes pratiques pour protéger vos fonds et vos données.",
    category: "Sécurité",
    readTime: "6 min",
  },
  {
    slug: "blockchain-simple",
    title: "La blockchain, simplement",
    excerpt: "Comprendre la blockchain et les réseaux (TRC20, BEP20, ERC20…) sans jargon.",
    category: "Tech",
    readTime: "8 min",
  },
];

const RESOURCES = [
  { label: "FAQ", to: "/faq" },
  { label: "Guide Terex", to: "/guide" },
  { label: "Support", to: "/support" },
  { label: "Sécurité", to: "/security" },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt" });
      window.location.reload();
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const matches = (a: Article) =>
    !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);

  const filtered = ARTICLES.filter(matches);

  // Featured = article #2 "Acheter de l'USDT sur Terex" (only when not searching)
  const featured = !q ? ARTICLES[1] : null;
  const gridArticles = featured ? filtered.filter(a => a.slug !== featured.slug) : filtered;

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes bp-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .bp-fade { animation: bp-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .bp-fade-2 { animation: bp-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .bp-tile { transition: border-color 0.25s ease, transform 0.25s ease; }
        .bp-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
        .bp-tile:hover .bp-img { transform: scale(1.04); }
        .bp-img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .bp-arrow { transition: gap 0.2s ease, transform 0.2s ease; }
        .bp-tile:hover .bp-arrow { transform: translateX(3px); }
        @media (max-width: 1100px) { .bp-vline { display: none !important; } }
        @media (max-width: 920px) {
          .bp-feat { grid-template-columns: 1fr !important; }
          .bp-feat-img { min-height: 240px !important; }
          .bp-grid { grid-template-columns: 1fr 1fr !important; }
          .bp-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 620px) {
          .bp-grid { grid-template-columns: 1fr !important; }
          .bp-hero-title { font-size: 34px !important; }
        }
      `}</style>

      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div style={{ height: 64 }} />

      <div className="bp-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="bp-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO */}
      <header className="bp-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px 56px', position: 'relative', zIndex: 1 }}>
        <div className="bp-fade" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 18px' }}>Blog · Terex</p>
          <h1 className="bp-hero-title" style={{ fontSize: 'clamp(2.3rem,5.5vw,3.6rem)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Apprendre la crypto,<br />simplement.
          </h1>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 30px', maxWidth: 520 }}>
            Guides, usages et bonnes pratiques pour acheter, envoyer et protéger vos USDT en Afrique de l'Ouest.
          </p>
          <div style={{ position: 'relative', maxWidth: 380 }}>
            <Search size={16} strokeWidth={1.8} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: MUTED2 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article…"
              style={{ width: '100%', height: 48, borderRadius: 12, background: CARD, border: `1px solid ${BORDER}`, color: '#fff', fontSize: 14, padding: '0 16px 0 44px', outline: 'none' }}
            />
          </div>
        </div>
      </header>

      {/* FEATURED — asymmetric */}
      {featured && (
        <section className="bp-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 20px', position: 'relative', zIndex: 1 }}>
          <Link to={`/blog/${featured.slug}`} className="bp-tile bp-fade-2" style={{ display: 'block', textDecoration: 'none', color: 'inherit', border: `1px solid ${BORDER}`, borderRadius: 22, overflow: 'hidden', background: CARD }}>
            <div className="bp-feat" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
              <div className="bp-feat-img" style={{ position: 'relative', overflow: 'hidden', minHeight: 380 }}>
                <img className="bp-img" src={articleImages[featured.slug]} alt={featured.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '5px 11px', borderRadius: 999, background: '#fff', color: '#141414' }}>À la une</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.7)' }}>{featured.category}</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 14px' }}>{featured.title}</h2>
                <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: '0 0 26px', maxWidth: 440 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#fff' }} className="bp-arrow">Lire l'article <ArrowRight size={16} /></span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: MUTED2 }}><Clock size={13} /> {featured.readTime} de lecture</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ARTICLE GRID */}
      <section className="bp-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 34 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: MUTED2 }}>
            {q ? 'Résultats' : 'Tous les articles'}
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {gridArticles.length > 0 ? (
          <div className="bp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {gridArticles.map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="bp-tile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                  <img className="bp-img" src={articleImages[a.slug]} alt={a.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ alignSelf: 'flex-start', fontSize: 10.5, fontWeight: 500, padding: '4px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>{a.category}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 8px' }}>{a.title}</h3>
                  <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>{a.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED2 }}><Clock size={12} /> {a.readTime}</span>
                    <ArrowRight size={16} className="bp-arrow" color="rgba(255,255,255,0.7)" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 14, color: MUTED }}>Aucun résultat pour « {searchQuery} »</p>
          </div>
        )}
      </section>

      {/* RESSOURCES — footer-style row (real routes only) */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bp-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 8px' }}>Ressources</p>
            <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>Besoin d'aide pour aller plus loin ?</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {RESOURCES.map((r) => (
              <Link key={r.to} to={r.to} className="bp-tile" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '10px 18px', fontSize: 13.5, fontWeight: 500 }}>{r.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
