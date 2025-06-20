
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AcademySection() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    // Pour l'instant, rediriger vers l'auth, mais cela pourrait être une page dédiée à l'académie
    navigate('/auth');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu texte */}
          <div className="text-left">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="w-8 h-8 text-black" />
              <h3 className="text-black font-bold text-lg uppercase tracking-wider">
                TEREX ACADEMY
              </h3>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
              DEFI COURS
              <br />
              <span className="block">ACCÉLÉRÉ</span>
              <span className="block">DE TEREX</span>
              <span className="block">ACADEMY</span>
            </h2>
            
            <p className="text-black/80 text-lg mb-8 font-medium">
              Complétez tous les cours de la
              <br />
              Terex Academy pour partager
              <br />
              <span className="font-bold">des récompenses exclusives.</span>
            </p>
            
            <Button 
              onClick={handleStartLearning}
              size="lg" 
              className="bg-black text-yellow-400 font-bold px-8 py-4 text-lg rounded-full hover:bg-gray-900 transition-all duration-300 hover:scale-105 border-2 border-black"
            >
              COMMENCEZ À APPRENDRE
            </Button>
            
            <div className="mt-8 text-black/60 text-sm">
              <p className="font-medium">AVERTISSEMENT DE RISQUE :</p>
              <p>Les prix des actifs numériques peuvent être volatils. La valeur de votre investissement peut diminuer ou augmenter et vous pourriez ne pas récupérer le montant investi. Ceci ne constitue pas un conseil financier. Pour plus d'informations, consultez nos Conditions d'Utilisation et Avertissement de Risque.</p>
            </div>
          </div>

          {/* Section smartphone et main */}
          <div className="relative flex justify-center">
            {/* Forme géométrique bleue en arrière-plan */}
            <div className="absolute -right-20 -top-10 w-80 h-80 bg-blue-500 rounded-full opacity-80"></div>
            <div className="absolute -right-32 top-20 w-60 h-60 bg-cyan-400 rounded-full opacity-60"></div>
            
            {/* Main tenant le smartphone */}
            <div className="relative z-10">
              <div className="w-64 h-96 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-end justify-center pb-8 shadow-2xl">
                {/* Smartphone */}
                <div className="w-40 h-72 bg-black rounded-3xl shadow-2xl p-2 transform rotate-12">
                  <div className="w-full h-full bg-gray-900 rounded-2xl p-4 flex flex-col">
                    {/* Barre de statut */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-terex-accent rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      </div>
                      <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                    </div>
                    
                    {/* Contenu écran */}
                    <div className="flex-1">
                      <div className="text-white text-xs font-bold mb-2">Blockchain & Crypto</div>
                      <div className="text-gray-400 text-[8px] leading-tight mb-4">
                        Learn all about blockchain technology, cryptocurrencies, DeFi, and more with our comprehensive courses.
                      </div>
                      
                      {/* Icônes crypto */}
                      <div className="flex space-x-2 mb-4">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold">₿</span>
                        </div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold">Ξ</span>
                        </div>
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold">₮</span>
                        </div>
                      </div>
                      
                      <div className="text-yellow-400 text-[8px] font-bold">COMMENCER →</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Icône graduation flottante */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistiques en bas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div className="text-2xl font-bold text-black">50+</div>
            <div className="text-black/70 text-sm">Cours disponibles</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div className="text-2xl font-bold text-black">10K+</div>
            <div className="text-black/70 text-sm">Certificats délivrés</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div className="text-2xl font-bold text-black">95%</div>
            <div className="text-black/70 text-sm">Taux de satisfaction</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div className="text-2xl font-bold text-black">24/7</div>
            <div className="text-black/70 text-sm">Support disponible</div>
          </div>
        </div>
      </div>
    </section>
  );
}
