
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { useBlogPosts } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, TrendingUp } from 'lucide-react';

const BlogPage = () => {
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
    tag?: string;
  }>({});
  
  const [page, setPage] = useState(0);
  const limit = 9;

  const { data: posts, isLoading } = useBlogPosts({
    ...filters,
    limit,
    offset: page * limit,
  });

  const { data: featuredPosts } = useBlogPosts({
    featured: true,
    limit: 3,
  });

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <>
      <Helmet>
        <title>Blog - Guides et Actualités Crypto | Terex</title>
        <meta 
          name="description" 
          content="Découvrez nos guides complets, analyses et actualités sur les cryptomonnaies, blockchain et finance décentralisée. Restez informé avec Terex." 
        />
        <meta name="keywords" content="blog crypto, guides bitcoin, actualités blockchain, analyses USDT, tutoriels crypto" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Blog Terex
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos guides complets, analyses et actualités pour maîtriser l'univers des cryptomonnaies
            </p>
          </div>

          {/* Articles vedettes */}
          {featuredPosts && featuredPosts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Articles vedettes</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filtres */}
              <BlogFilters 
                onFiltersChange={setFilters}
                currentFilters={filters}
              />

              {/* Liste des articles */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {/* Bouton charger plus */}
                  {posts.length === limit && (
                    <div className="text-center mt-8">
                      <Button onClick={loadMore} variant="outline" size="lg">
                        Charger plus d'articles
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos filtres de recherche.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
