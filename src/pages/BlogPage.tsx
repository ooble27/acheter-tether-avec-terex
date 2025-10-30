import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate } from "react-router-dom";

import blogCryptoIllustration from "@/assets/blog-crypto-illustration.png";
import blogCollaborationIllustration from "@/assets/blog-collaboration-illustration.png";
import blogSecurityIllustration from "@/assets/blog-security-illustration.png";
import blogSpeedIllustration from "@/assets/blog-speed-illustration.png";

const blogArticles = [
  {
    id: 1,
    title: "Comprendre l'USDT : Le stablecoin pour vos transferts",
    excerpt: "L'USDT (Tether) est la cryptomonnaie stable la plus utilisée au monde. Découvrez pourquoi elle est idéale pour les transferts internationaux en Afrique et comment elle maintient sa valeur.",
    image: blogCryptoIllustration,
    date: "15 Oct 2025",
    readTime: "5 min",
    category: "Crypto",
    slug: "comprendre-usdt-stablecoin"
  },
  {
    id: 2,
    title: "Comment acheter de l'USDT sur Terex en 3 étapes",
    excerpt: "Guide complet pour acheter vos premiers USDT sur Terex. Paiement par mobile money, carte bancaire ou virement. Simple, rapide et sécurisé.",
    image: blogSpeedIllustration,
    date: "12 Oct 2025",
    readTime: "7 min",
    category: "Guide",
    slug: "acheter-usdt-terex-guide"
  },
  {
    id: 3,
    title: "Sécurité des transactions : Nos garanties",
    excerpt: "La sécurité est notre priorité. Découvrez comment Terex protège vos fonds avec le KYC, la vérification en deux étapes et nos partenariats bancaires certifiés.",
    image: blogSecurityIllustration,
    date: "8 Oct 2025",
    readTime: "6 min",
    category: "Sécurité",
    slug: "securite-transactions-terex"
  },
  {
    id: 4,
    title: "Transferts internationaux : Économisez jusqu'à 80%",
    excerpt: "Comparez les frais des services traditionnels vs Terex. Envoyez de l'argent vers l'Afrique sans frais cachés et avec un taux de change transparent.",
    image: blogCollaborationIllustration,
    date: "5 Oct 2025",
    readTime: "8 min",
    category: "Transferts",
    slug: "economiser-transferts-internationaux"
  },
  {
    id: 5,
    title: "La blockchain expliquée simplement",
    excerpt: "Qu'est-ce que la blockchain ? Comment fonctionne-t-elle ? Découvrez la technologie derrière Bitcoin, Ethereum et l'USDT dans un langage accessible.",
    image: blogCryptoIllustration,
    date: "1 Oct 2025",
    readTime: "10 min",
    category: "Technologie",
    slug: "blockchain-expliquee-simplement"
  },
  {
    id: 6,
    title: "Mobile Money et Crypto : L'alliance gagnante en Afrique",
    excerpt: "Orange Money, MTN Mobile Money, Moov Money... Découvrez comment Terex connecte les services de paiement mobile africains à l'économie crypto mondiale.",
    image: blogSpeedIllustration,
    date: "28 Sep 2025",
    readTime: "6 min",
    category: "Innovation",
    slug: "mobile-money-crypto-afrique"
  }
];

export default function BlogPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        onShowDashboard={() => navigate("/dashboard")}
        onLogout={handleLogout}
      />
      
      <BlogHero />

      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Derniers Articles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Restez informé des dernières actualités crypto et découvrez nos guides pratiques
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogArticles.map((article) => (
            <BlogCard key={article.id} {...article} />
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
