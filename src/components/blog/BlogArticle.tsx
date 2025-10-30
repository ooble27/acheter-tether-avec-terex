import { HeaderSection } from "@/components/marketing/sections/HeaderSection";
import { FooterSection } from "@/components/marketing/sections/FooterSection";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogArticleProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: React.ReactNode;
}

export function BlogArticle({ title, date, readTime, category, image, content }: BlogArticleProps) {
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="text-gray-400 hover:text-terex-accent mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Button>

        <div className="mb-8">
          <span className="text-sm font-medium text-terex-accent bg-terex-accent/10 px-4 py-2 rounded-full">
            {category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
          {title}
        </h1>

        <div className="flex items-center gap-6 text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{readTime}</span>
          </div>
        </div>

        <div className="aspect-video mb-12 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {content}
        </div>

        <div className="mt-12 pt-8 border-t border-terex-gray">
          <Button
            onClick={() => navigate("/blog")}
            className="bg-terex-accent hover:bg-terex-accent/90 text-black"
          >
            Voir tous les articles
          </Button>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
