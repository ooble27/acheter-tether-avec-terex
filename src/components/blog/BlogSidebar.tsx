
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBlogCategories, useBlogPosts, useSubscribeNewsletter } from '@/hooks/useBlog';
import { useState } from 'react';
import { toast } from 'sonner';

export const BlogSidebar = () => {
  const { data: categories } = useBlogCategories();
  const { data: popularPosts } = useBlogPosts({ limit: 5 });
  const [email, setEmail] = useState('');
  const { subscribe } = useSubscribeNewsletter();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe(email);
      toast.success('Merci ! Vous êtes maintenant abonné à notre newsletter.');
      setEmail('');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Recevez nos derniers articles directement dans votre boîte email.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              S'abonner
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/blog?category=${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Articles populaires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts?.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <img
                    src={post.featured_image || '/placeholder.svg'}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {post.reading_time} min
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.views_count} vues
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aide */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe support est là pour vous accompagner.
          </p>
          <Link to="/support">
            <Button variant="outline" size="sm" className="w-full">
              Contacter le support
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
