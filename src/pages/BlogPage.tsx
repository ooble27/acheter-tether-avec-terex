
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { useBlogPosts } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, Users, Clock, Award, ArrowRight, Lightbulb } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-terex-dark/5">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-terex-accent via-terex-accent-light to-terex-accent bg-terex-dark/95 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/20 to-terex-accent-light/20" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Centre d'expertise crypto
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Blog <span className="text-terex-accent-light">Terex</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                Votre source d'expertise en cryptomonnaies. Guides pratiques, analyses de marché et actualités pour naviguer dans l'écosystème crypto avec confiance.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-terex-accent-light" />
                    <span className="text-2xl font-bold">50K+</span>
                  </div>
                  <p className="text-white/80">Lecteurs mensuels</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-terex-accent-light" />
                    <span className="text-2xl font-bold">200+</span>
                  </div>
                  <p className="text-white/80">Articles publiés</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-terex-accent-light" />
                    <span className="text-2xl font-bold">5+</span>
                  </div>
                  <p className="text-white/80">Années d'expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">

          {/* Categories populaires */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-terex-accent" />
                <h2 className="text-3xl font-bold text-foreground">Explorez nos catégories</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos contenus organisés par thématiques pour approfondir vos connaissances
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="group hover:shadow-lg transition-all duration-300 border-terex-accent/20 hover:border-terex-accent/40">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terex-accent/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-terex-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Analyses de marché</h3>
                  <p className="text-sm text-muted-foreground">Suivez les tendances crypto et les prévisions d'experts</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-terex-accent/20 hover:border-terex-accent/40">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terex-accent/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-terex-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Guides pratiques</h3>
                  <p className="text-sm text-muted-foreground">Tutoriels step-by-step pour maîtriser les cryptos</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-terex-accent/20 hover:border-terex-accent/40">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terex-accent/20 transition-colors">
                    <Clock className="h-6 w-6 text-terex-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Actualités</h3>
                  <p className="text-sm text-muted-foreground">Les dernières news et évolutions du secteur</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-terex-accent/20 hover:border-terex-accent/40">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terex-accent/20 transition-colors">
                    <Award className="h-6 w-6 text-terex-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Expertise Terex</h3>
                  <p className="text-sm text-muted-foreground">Insights exclusifs de notre équipe d'experts</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Articles vedettes */}
          {featuredPosts && featuredPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terex-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-terex-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Articles vedettes</h2>
                    <p className="text-muted-foreground">Nos contenus les plus populaires</p>
                  </div>
                </div>
                <Button variant="outline" className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                  Voir tout <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Section titre */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Tous nos articles</h2>
                  <p className="text-muted-foreground">Explorez notre bibliothèque complète de contenus crypto</p>
                </div>
              </div>
              
              {/* Filtres */}
              <Card className="border-terex-accent/20">
                <CardContent className="p-6">
                  <BlogFilters 
                    onFiltersChange={setFilters}
                    currentFilters={filters}
                  />
                </CardContent>
              </Card>

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
                    <div className="text-center mt-12">
                      <Button 
                        onClick={loadMore} 
                        size="lg"
                        className="bg-terex-accent hover:bg-terex-accent-light text-white px-8 py-3"
                      >
                        Charger plus d'articles
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card className="border-terex-accent/20">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="h-10 w-10 text-terex-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Aucun article trouvé</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Essayez de modifier vos filtres de recherche ou explorez d'autres catégories.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({})}
                      className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
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
