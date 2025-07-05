
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';

interface Review {
  id: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: 'Alexandre M.',
    rating: 5,
    title: 'Excellent produit, très satisfait',
    comment: 'Ce wallet hardware est parfait pour sécuriser mes cryptomonnaies. Interface intuitive et construction solide.',
    date: '2024-03-15',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    user: 'Sophie L.',
    rating: 4,
    title: 'Très bon achat',
    comment: 'Bon produit dans l\'ensemble. La livraison était rapide et l\'emballage soigné.',
    date: '2024-03-10',
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    user: 'Jean-Paul D.',
    rating: 5,
    title: 'Recommandé',
    comment: 'Parfait pour débuter dans les cryptomonnaies. Le support client est également très réactif.',
    date: '2024-03-05',
    verified: false,
    helpful: 5
  }
];

export function ReviewsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products } = useMarketplace();
  const [reviews] = useState<Review[]>(mockReviews);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Produit non trouvé</p>
          <Button onClick={() => navigate('/marketplace')}>
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  // Calculate product average rating from reviews
  const productAvgRating = averageRating;

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={() => navigate(`/marketplace/product/${productId}`)}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au produit
            </Button>
            
            <h1 className="text-xl font-bold text-white">Avis clients</h1>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                className="bg-terex-darker border border-terex-accent/30 text-white rounded-md px-3 py-1 text-sm"
              >
                <option value="">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Produit */}
        <Card className="bg-terex-darker border-terex-accent/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-terex-dark rounded-lg overflow-hidden">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-lg">📦</div>';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">📦</div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold">{product.name}</h2>
                <p className="text-gray-400 text-sm">{product.brand}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(Math.round(productAvgRating))}
                  <span className="text-yellow-400 font-semibold">{productAvgRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({reviews.length} avis)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Résumé des avis */}
          <div className="lg:col-span-1">
            <Card className="bg-terex-darker border-terex-accent/30 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Note moyenne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-terex-accent mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  {renderStars(Math.round(averageRating))}
                  <p className="text-gray-400 text-sm mt-2">
                    Basé sur {reviews.length} avis
                  </p>
                </div>
                
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-300 w-8">{rating}★</span>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-400 w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Laisser un avis */}
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Laisser un avis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Note</label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Titre</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-terex-dark border border-terex-accent/30 rounded-md px-3 py-2 text-white text-sm"
                    placeholder="Résumez votre expérience"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Commentaire</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="bg-terex-dark border-terex-accent/30 text-white"
                    placeholder="Partagez votre expérience avec ce produit"
                    rows={4}
                  />
                </div>
                
                <Button className="w-full bg-terex-accent text-black hover:bg-terex-accent/90">
                  Publier l'avis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des avis */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredReviews.map(review => (
                <Card key={review.id} className="bg-terex-darker border-terex-accent/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-terex-accent text-black">
                          {review.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-semibold">{review.user}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Achat vérifié
                            </Badge>
                          )}
                          <span className="text-gray-400 text-sm">{review.date}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        
                        <h4 className="text-white font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {review.comment}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Utile ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            Signaler
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
