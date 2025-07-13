
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BlogPost } from '@/hooks/useBlog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const cardClass = featured 
    ? "group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    : "group hover:shadow-lg transition-all duration-300";

  return (
    <Card className={cardClass}>
      <CardHeader className="p-0">
        <Link to={`/blog/${post.slug}`} className="block">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={post.featured_image || '/placeholder.svg'}
              alt={post.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                featured ? 'h-64' : 'h-48'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-white">
                Article vedette
              </Badge>
            )}
            {post.category && (
              <Badge 
                className="absolute top-4 right-4 text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </Badge>
            )}
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className={featured ? "p-8" : "p-6"}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(post.published_at), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.reading_time} min</span>
          </div>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className={`font-bold mb-3 group-hover:text-primary transition-colors ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes_count}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
