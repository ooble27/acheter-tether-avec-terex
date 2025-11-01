import { BlogHero } from "@/components/blog/BlogHero";
import { BlogTopics } from "@/components/blog/BlogTopics";
import { BlogCard } from "@/components/blog/BlogCard";
import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { useNavigate } from "react-router-dom";

import blogUsdtImage from "@/assets/blog-usdt-stablecoin.png";
import blogAcheterImage from "@/assets/blog-acheter-usdt.png";
import blogSecuriteImage from "@/assets/blog-securite.png";
import blogTransfertsImage from "@/assets/blog-transferts.png";
import blogBlockchainImage from "@/assets/blog-blockchain.png";
import blogMobileMoneyImage from "@/assets/blog-mobile-money.png";
import blogKycImage from "@/assets/blog-kyc.png";
import blogAfriqueImage from "@/assets/blog-afrique-crypto.png";

const blogArticles = [
  {
    id: 1,
    title: "Comprendre l'USDT : Le stablecoin pour vos transferts",
    excerpt: "L'USDT (Tether) est la cryptomonnaie stable la plus utilisée au monde. Découvrez pourquoi elle est idéale pour les transferts internationaux en Afrique et comment elle maintient sa valeur.",
    image: blogUsdtImage,
    date: "15 Oct 2025",
    readTime: "5 min",
    category: "Crypto",
    slug: "comprendre-usdt-stablecoin"
  },
  {
    id: 2,
    title: "Comment acheter de l'USDT sur Terex en 3 étapes",
    excerpt: "Guide complet pour acheter vos premiers USDT sur Terex. Paiement par mobile money, carte bancaire ou virement. Simple, rapide et sécurisé.",
    image: blogAcheterImage,
    date: "12 Oct 2025",
    readTime: "7 min",
    category: "Guide",
    slug: "acheter-usdt-terex-guide"
  },
  {
    id: 3,
    title: "Sécurité des transactions crypto : Guide complet",
    excerpt: "La sécurité est primordiale dans l'univers des cryptomonnaies. Découvrez les meilleures pratiques pour protéger vos actifs numériques et effectuer des transactions en toute sérénité.",
    image: blogSecuriteImage,
    date: "15 Jan 2025",
    readTime: "8 min",
    category: "Sécurité",
    slug: "securite-crypto"
  },
  {
    id: 4,
    title: "Transferts internationaux en Afrique : La révolution Terex",
    excerpt: "Les transferts d'argent internationaux en Afrique ont longtemps été coûteux et lents. Découvrez comment Terex révolutionne ces transactions grâce à la blockchain.",
    image: blogTransfertsImage,
    date: "12 Jan 2025",
    readTime: "10 min",
    category: "Transferts",
    slug: "transferts-internationaux"
  },
  {
    id: 5,
    title: "La blockchain expliquée simplement",
    excerpt: "La blockchain est souvent perçue comme une technologie complexe. Nous vous expliquons simplement comment elle fonctionne et pourquoi elle révolutionne la finance mondiale.",
    image: blogBlockchainImage,
    date: "10 Jan 2025",
    readTime: "12 min",
    category: "Technologie",
    slug: "blockchain-simple"
  },
  {
    id: 6,
    title: "Mobile Money et crypto en Afrique : La révolution financière",
    excerpt: "Le Mobile Money a révolutionné les paiements en Afrique. Aujourd'hui, sa combinaison avec les cryptomonnaies ouvre de nouvelles possibilités pour l'inclusion financière.",
    image: blogMobileMoneyImage,
    date: "8 Jan 2025",
    readTime: "11 min",
    category: "Finance mobile",
    slug: "mobile-money-crypto"
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
      
      <BlogTopics />

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
