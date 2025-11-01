import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export function BlogCard({ title, excerpt, image, date, readTime, category, slug }: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`}>
      <Card className="group bg-terex-darker/80 border-terex-gray/50 hover:border-terex-accent/50 hover:bg-terex-darker transition-all duration-500 overflow-hidden h-full hover:shadow-[0_8px_30px_rgb(0,245,160,0.12)]">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs font-semibold text-terex-accent bg-terex-accent/10 px-3 py-1.5 rounded-full border border-terex-accent/20">
              {category}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-terex-accent transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
