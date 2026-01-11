import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Globe, Lock, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BlockchainPage = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-terex-dark relative">
      {/* Grid background pattern (mode sombre uniquement) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none hidden dark:block" style={{
        backgroundImage: `linear-gradient(#3B968F 1px, transparent 1px),
                          linear-gradient(90deg, #3B968F 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      {/* Hero Section */}
      <section className="py-12 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 rounded-xl shadow-2xl"
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent">
                  BLOCKCHAIN
                </span>
              </h1>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              La technologie qui révolutionne
              <br />
              <span className="text-terex-accent">les transferts d'argent</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Découvrez comment la blockchain et les stablecoins comme USDT Tether 
              transforment les virements internationaux en les rendant plus rapides, 
              moins chers et plus sécurisés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-3 rounded-xl"
              >
                Commencer avec Terex
              </Button>
              <Button 
                onClick={handleHome}
                variant="outline" 
                size="lg"
                className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-3 rounded-xl"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Qu'est-ce que la blockchain */}
      <section className="py-8 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Qu'est-ce que la <span className="text-terex-accent">blockchain</span> ?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                La blockchain est une technologie de stockage et de transmission d'informations 
                qui fonctionne sans organe central de contrôle. Elle permet de créer un registre 
                distribué et sécurisé de toutes les transactions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-terex-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Sécurité maximale</h3>
                    <p className="text-gray-400 text-sm">Chaque transaction est cryptée et vérifiée par le réseau</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-terex-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Rapidité</h3>
                    <p className="text-gray-400 text-sm">Transferts instantanés 24h/24 et 7j/7</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-terex-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Global</h3>
                    <p className="text-gray-400 text-sm">Accessible partout dans le monde sans frontières</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl p-8">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-terex-darker/50 rounded-lg p-4 text-center">
                      <Lock className="w-6 h-6 text-terex-accent mx-auto mb-2" />
                      <div className="text-xs text-gray-400">Bloc {i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USDT Tether */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pourquoi <span className="text-terex-accent">USDT Tether</span> ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              USDT est un stablecoin adossé au dollar américain qui combine les avantages 
              de la blockchain avec la stabilité d'une monnaie fiduciaire.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Stabilité du prix</h3>
                <p className="text-gray-300 text-sm">
                  1 USDT = 1 USD en permanence, éliminant la volatilité des cryptomonnaies traditionnelles.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-terex-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Transparence</h3>
                <p className="text-gray-300 text-sm">
                  Toutes les transactions sont visibles sur la blockchain et vérifiables publiquement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-terex-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Adoption mondiale</h3>
                <p className="text-gray-300 text-sm">
                  Accepté par des millions d'utilisateurs et d'entreprises dans le monde entier.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Avantages pour l'Afrique */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              La blockchain au service de <span className="text-terex-accent">l'Afrique</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comment cette technologie transforme les transferts d'argent 
              et l'inclusion financière en Afrique de l'Ouest.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-terex-darker/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Réduction des coûts</h3>
                <p className="text-gray-300 mb-4">
                  Les transferts traditionnels coûtent souvent 5-10% du montant envoyé. 
                  Avec la blockchain, ces frais sont réduits à moins de 1%.
                </p>
                <div className="bg-terex-accent/10 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Exemple : Envoi de 500 CAD vers le Sénégal</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-red-400 text-sm">Virement traditionnel</div>
                      <div className="text-white font-bold">25-50 CAD de frais</div>
                    </div>
                    <div>
                      <div className="text-terex-accent text-sm">Avec Terex (USDT)</div>
                      <div className="text-white font-bold">2-5 CAD de frais</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-terex-darker/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Rapidité des transferts</h3>
                <p className="text-gray-300 mb-4">
                  Fini les délais de 3-7 jours ouvrables. Les transferts USDT 
                  arrivent en quelques minutes, même le weekend.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-terex-accent">3-5 min</div>
                    <div className="text-xs text-gray-400">USDT Terex</div>
                  </div>
                  <div className="text-gray-500">vs</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">3-7 jours</div>
                    <div className="text-xs text-gray-400">Banque traditionnelle</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-terex-darker/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Inclusion financière</h3>
                <p className="text-gray-300 mb-4">
                  La blockchain permet aux personnes non bancarisées d'accéder 
                  aux services financiers avec seulement un smartphone.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                    <span className="text-gray-300 text-sm">Pas besoin de compte bancaire</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                    <span className="text-gray-300 text-sm">Accessible 24h/24</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                    <span className="text-gray-300 text-sm">Interface simple en français</span>
                  </div>
                </div>
              </div>

              <div className="bg-terex-darker/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Sécurité renforcée</h3>
                <p className="text-gray-300 mb-4">
                  La cryptographie blockchain offre un niveau de sécurité 
                  supérieur aux systèmes bancaires traditionnels.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center bg-terex-accent/10 rounded-lg p-3">
                    <Shield className="w-6 h-6 text-terex-accent mx-auto mb-1" />
                    <div className="text-xs text-gray-300">Chiffrement AES-256</div>
                  </div>
                  <div className="text-center bg-terex-accent/10 rounded-lg p-3">
                    <Lock className="w-6 h-6 text-terex-accent mx-auto mb-1" />
                    <div className="text-xs text-gray-300">Clés privées</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à découvrir l'avenir des <span className="text-terex-accent">transferts d'argent</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez la révolution blockchain avec Terex et profitez de transferts 
            plus rapides, moins chers et plus sécurisés.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl"
          >
            Commencer avec Terex
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BlockchainPage;
