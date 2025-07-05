
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { ProductImageGallery } from '@/components/marketplace/ProductImageGallery';
import { ProductRecommendations } from '@/components/marketplace/ProductRecommendations';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useMarketplace();
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<string>('');

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (!product) {
      navigate('/marketplace');
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terex-accent mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const relatedProducts = products.filter(p => 
    p.id !== product.id && 
    (p.category_id === product.category_id || p.brand === product.brand)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-40 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={() => navigate('/marketplace')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la boutique
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galerie d'images */}
          <div>
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <Badge variant="secondary" className="mb-2">
                  {product.brand}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-terex-accent">
                {formatPrice(product.price)} {product.currency}
              </span>
              <span className="text-gray-500 text-lg">
                Stock: {product.stock_quantity} disponibles
              </span>
            </div>

            {/* Spécifications */}
            {product.specifications && (
              <Card className="bg-terex-darker border-terex-accent/30">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Spécifications</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantité et ajout au panier */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-white font-medium">Quantité:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-terex-accent/30 text-white hover:bg-terex-accent/10"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-white font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="border-terex-accent/30 text-white hover:bg-terex-accent/10"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold py-4"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock_quantity === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-terex-accent" />
                <span className="text-gray-300">Livraison gratuite dès 50 000 CFA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-terex-accent" />
                <span className="text-gray-300">Garantie constructeur incluse</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-terex-accent" />
                <span className="text-gray-300">Retour gratuit sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-terex-accent/20 mb-12" />

        {/* Description détaillée */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Description détaillée</h2>
          <Card className="bg-terex-darker border-terex-accent/30">
            <CardContent className="p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.description}
                </p>
                {product.category_id === 'wallets' && (
                  <div className="mt-6 space-y-4 text-gray-300">
                    <h3 className="text-white font-semibold">Sécurité et fonctionnalités</h3>
                    <ul className="space-y-2">
                      <li>• Stockage sécurisé de vos clés privées hors ligne</li>
                      <li>• Interface intuitive et facile d'utilisation</li>
                      <li>• Compatible avec les principales cryptomonnaies</li>
                      <li>• Authentification à deux facteurs intégrée</li>
                      <li>• Sauvegarde et récupération simplifiées</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produits recommandés */}
        {relatedProducts.length > 0 && (
          <ProductRecommendations 
            products={relatedProducts}
            title="Produits similaires"
          />
        )}
      </div>
    </div>
  );
}
