import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArticleCover } from "@/components/blog/articleCovers";

const BG = "#1a1a1a";
const CARD = "#1e1e1e";
const BORDER = "rgba(255,255,255,0.07)";
const ICON_BG = "rgba(255,255,255,0.06)";
const MUTED = "rgba(255,255,255,0.55)";
const MUTED2 = "rgba(255,255,255,0.4)";

interface BlogArticleProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  coverSlug?: string;
  content: React.ReactNode;
  author?: string;
  authorRole?: string;
  authorInitials?: string;
}

const styles = `
  @keyframes ba-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .ba-fade { animation: ba-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
  .ba-fade-2 { animation: ba-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .ba-fade-3 { animation: ba-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
  .ba-cta { transition: transform 0.15s ease, border-color 0.25s ease, background 0.25s ease; }
  .ba-cta:hover { transform: translateY(-2px); }
  .ba-back { transition: color 0.2s ease, gap 0.2s ease; }
  .ba-back:hover { color: #fff !important; }

  /* Editorial typography — scoped to article body */
  .ba-content { font-size: 16.5px; line-height: 1.75; color: rgba(255,255,255,0.72); }
  .ba-content > *:first-child { margin-top: 0 !important; }
  .ba-content h2 {
    font-size: clamp(1.4rem, 3vw, 1.75rem); font-weight: 800; letter-spacing: -0.025em;
    color: #fff; margin: 48px 0 16px; line-height: 1.2;
  }
  .ba-content h3 {
    font-size: 1.15rem; font-weight: 700; letter-spacing: -0.015em;
    color: #fff; margin: 34px 0 12px;
  }
  .ba-content p { margin: 0 0 20px; color: rgba(255,255,255,0.72); }
  .ba-content strong { color: #fff; font-weight: 650; }
  .ba-content a { color: #fff; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(255,255,255,0.3); }
  .ba-content ul, .ba-content ol { margin: 0 0 22px; padding: 0; list-style: none; }
  .ba-content ul li, .ba-content ol li {
    position: relative; padding-left: 26px; margin: 0 0 12px; color: rgba(255,255,255,0.72);
  }
  .ba-content ul li::before {
    content: ''; position: absolute; left: 4px; top: 11px; width: 6px; height: 6px;
    border-radius: 50%; background: rgba(255,255,255,0.4);
  }
  .ba-content ol { counter-reset: ba-c; }
  .ba-content ol li { counter-increment: ba-c; }
  .ba-content ol li::before {
    content: counter(ba-c); position: absolute; left: 0; top: 1px;
    font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5);
    width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  }
  .ba-content blockquote {
    margin: 28px 0; padding: 4px 0 4px 22px; border-left: 2px solid rgba(255,255,255,0.2);
    font-size: 1.05rem; color: rgba(255,255,255,0.85); font-style: normal;
  }
  /* Callout blocks authored inline keep their box; normalise inner spacing */
  .ba-content .bg-\\[\\#1e1e1e\\] h3 { margin-top: 0; }

  @media (max-width: 1100px) { .ba-vline { display: none !important; } }
  @media (max-width: 640px) { .ba-pad { padding-left: 20px !important; padding-right: 20px !important; } }
`;

export function BlogArticle({
  title,
  date,
  readTime,
  category,
  image,
  coverSlug,
  content,
  author = "L'équipe Terex",
  authorRole = "Rédaction",
  authorInitials = "TX",
}: BlogArticleProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <style>{styles}</style>

      {/* Reading progress */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: "transparent" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "#fff", transition: "width 0.1s linear" }} />
      </div>

      {/* Fixed vertical guides */}
      <div className="ba-vline" style={{ position: "fixed", top: 0, bottom: 0, left: "calc(50% - 560px)", width: 1, background: "rgba(255,255,255,0.05)", pointerEvents: "none", zIndex: 0 }} />
      <div className="ba-vline" style={{ position: "fixed", top: 0, bottom: 0, right: "calc(50% - 560px)", width: 1, background: "rgba(255,255,255,0.05)", pointerEvents: "none", zIndex: 0 }} />

      <HeaderSection
        user={user ? { email: user.email || "", name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur" } : null}
        onShowDashboard={() => navigate("/")}
        onLogout={handleLogout}
      />
      <div style={{ height: 64 }} />

      {/* HEADER */}
      <header className="ba-pad" style={{ maxWidth: 760, margin: "0 auto", padding: "56px 32px 0", position: "relative", zIndex: 1 }}>
        <button
          onClick={() => navigate("/blog")}
          className="ba-back"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: MUTED, fontSize: 13.5, cursor: "pointer", padding: 0, marginBottom: 30 }}
        >
          <ArrowLeft size={15} /> Retour au blog
        </button>

        <div className="ba-fade">
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 13px", borderRadius: 999, background: ICON_BG, border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.7)", marginBottom: 22 }}>
            {category}
          </span>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08, margin: "0 0 26px" }}>
            {title}
          </h1>

          {/* Author byline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#1e1e1e", border: `1px solid rgba(255,255,255,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0, letterSpacing: "-0.02em" }}>
                {authorInitials}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{author}</p>
                <p style={{ fontSize: 12.5, color: MUTED2, margin: 0 }}>{authorRole}</p>
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: BORDER }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
                <Calendar size={14} strokeWidth={1.8} /> {date}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
                <Clock size={14} strokeWidth={1.8} /> {readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* HERO IMAGE */}
      <div className="ba-pad ba-fade-2" style={{ maxWidth: 900, margin: "40px auto 0", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", border: `1px solid ${BORDER}`, aspectRatio: "16 / 9", background: CARD }}>
          {coverSlug ? (
            <ArticleCover slug={coverSlug} size="lg" />
          ) : image ? (
            <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : null}
        </div>
      </div>

      {/* BODY */}
      <article className="ba-pad ba-fade-3 ba-content" style={{ maxWidth: 720, margin: "0 auto", padding: "52px 32px 0", position: "relative", zIndex: 1 }}>
        {content}
      </article>

      {/* CTA */}
      <section className="ba-pad" style={{ maxWidth: 720, margin: "0 auto", padding: "56px 32px 88px", position: "relative", zIndex: 1 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: "clamp(28px, 4vw, 40px)", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: MUTED2, margin: "0 0 12px" }}>Passer à l'action</p>
          <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 10px" }}>
            Prêt à échanger vos USDT ?
          </h3>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, margin: "0 auto 26px", maxWidth: 420 }}>
            Achetez, vendez et transférez en quelques minutes, au meilleur taux, avec Wave et Orange Money.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/auth")} className="ba-cta" style={{ background: "#fff", color: "#141414", border: "none", borderRadius: 12, height: 50, padding: "0 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Commencer maintenant <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/blog")} className="ba-cta" style={{ background: "#2d2d2d", color: "#fff", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 50, padding: "0 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Voir tous les articles
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
