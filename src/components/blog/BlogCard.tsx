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
      <Card className="group bg-terex-darker border-terex-gray hover:border-terex-accent transition-all duration-300 overflow-hidden h-full hover:transform hover:scale-[1.02]">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs font-medium text-terex-accent bg-terex-accent/10 px-3 py-1 rounded-full">
              {category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{readTime}</span>
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-3 group-hover:text-terex-accent transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
