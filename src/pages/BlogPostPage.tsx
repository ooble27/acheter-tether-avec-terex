
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlog';
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard';
import { BlogShareButtons } from '@/components/blog/BlogShareButtons';
import { BlogCard } from '@/components/blog/BlogCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Eye, Heart, ArrowLeft, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug!);
  const { data: relatedPosts } = useBlogPosts({ 
    category: post?.category?.slug,
    limit: 3 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | Terex Blog</title>
        <meta 
          name="description" 
          content={post.meta_description || post.excerpt || ''} 
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:image" content={post.featured_image || ''} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ''} />
        <meta name="twitter:image" content={post.featured_image || ''} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
              <Link to="/blog" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Link>
            </div>

            {/* Header de l'article */}
            <article className="bg-card rounded-lg shadow-lg overflow-hidden mb-8">
              {/* Image vedette */}
              {post.featured_image && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {post.category && (
                    <Badge 
                      className="absolute top-6 left-6 text-white"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>
              )}

              <div className="p-8">
                {/* Métadonnées */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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
                    <span>{post.reading_time} min de lecture</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views_count} vues</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes_count} j'aime</span>
                  </div>
                </div>

                {/* Titre */}
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Boutons de partage */}
                <BlogShareButtons title={post.title} url={currentUrl} />
              </div>
            </article>

            {/* Contenu de l'article */}
            <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Auteur */}
            <BlogAuthorCard 
              name={post.author_name}
              bio={post.author_bio}
              avatar={post.author_avatar}
            />

            {/* Articles connexes */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Articles connexes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts
                    .filter(relatedPost => relatedPost.id !== post.id)
                    .slice(0, 3)
                    .map((relatedPost) => (
                      <BlogCard key={relatedPost.id} post={relatedPost} />
                    ))
                  }
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
