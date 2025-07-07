
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar, Target, Zap, Shield, Globe, TrendingUp, Heart, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      window.location.reload();
    }
  };

  const handleShowDashboard = () => {
    navigate('/');
  };

  const teamMembers = [
    {
      name: "Amadou Diallo",
      role: "CEO & Fondateur",
      experience: "15+ ans en fintech",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png",
      bio: "Ancien directeur chez Orange Money, pionnier des services financiers mobiles en Afrique de l'Ouest."
    },
    {
      name: "Fatou Sow",
      role: "CTO",
      experience: "12+ ans blockchain",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png",
      bio: "Experte en cryptomonnaies et architectures distribuées, ex-ingénieure senior chez Binance."
    },
    {
      name: "Moussa Traoré",
      role: "Head of Compliance",
      experience: "10+ ans régulation",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png",
      bio: "Spécialiste des réglementations financières africaines, ancien conseiller BCEAO."
    }
  ];

  const milestones = [
    { year: "2021", event: "Fondation de Terex", description: "Création de la société à Dakar" },
    { year: "2022", event: "Première licence", description: "Obtention de la licence PSF au Sénégal" },
    { year: "2023", event: "Expansion régionale", description: "Lancement dans 5 pays africains" },
    { year: "2024", event: "Série A", description: "Levée de fonds de 15M€" }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <Users className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">À Propos de Nous</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              L'avenir de la <span className="text-terex-accent">fintech africaine</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Terex révolutionne les échanges crypto-fiat en Afrique avec des solutions sécurisées, 
              rapides et conformes aux réglementations locales.
            </p>
            
            <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">2021</div>
                <div className="text-gray-400">Fondée</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">15+</div>
                <div className="text-gray-400">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">500K+</div>
                <div className="text-gray-400">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">€15M</div>
                <div className="text-gray-400">Levée Série A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-terex-accent mr-4" />
                <h2 className="text-3xl font-bold text-white">Notre Mission</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Démocratiser l'accès aux cryptomonnaies en Afrique en créant un pont sécurisé 
                entre l'économie traditionnelle et l'économie numérique. Nous permettons à 
                chaque africain d'acheter, vendre et utiliser des cryptomonnaies simplement.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-terex-accent mr-4" />
                <h2 className="text-3xl font-bold text-white">Notre Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Devenir la première plateforme crypto-fiat d'Afrique, facilitant l'inclusion 
                financière et permettant aux Africains de participer pleinement à l'économie 
                numérique mondiale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-24 bg-gradient-to-b from-terex-dark to-terex-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Notre Parcours</h2>
            <p className="text-gray-300 text-lg">Les étapes clés de notre développement</p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center group">
                <div className="flex-shrink-0 w-24 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-terex-accent/20 rounded-full border-4 border-terex-accent group-hover:scale-110 transition-transform duration-300">
                    <span className="text-terex-accent font-bold text-lg">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 ml-8 bg-gradient-to-r from-terex-darker to-terex-gray/30 rounded-xl p-6 border border-terex-accent/20 group-hover:border-terex-accent/50 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.event}</h3>
                  <p className="text-gray-300">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Notre Équipe</h2>
            <p className="text-gray-300 text-lg">Les experts qui dirigent Terex</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 p-6 text-center hover:border-terex-accent/50 transition-all duration-300 group">
                <div className="w-24 h-24 bg-terex-accent rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-terex-accent font-medium mb-2">{member.role}</p>
                <Badge className="bg-terex-accent/20 text-terex-accent border-terex-accent/30 mb-4">
                  {member.experience}
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 bg-gradient-to-b from-terex-darker to-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nos Valeurs</h2>
            <p className="text-gray-300 text-lg">Ce qui guide notre action au quotidien</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Sécurité", desc: "Protection maximale des fonds et données utilisateurs" },
              { icon: Heart, title: "Confiance", desc: "Transparence totale dans toutes nos opérations" },
              { icon: Globe, title: "Inclusion", desc: "Accès équitable aux services financiers numériques" },
              { icon: Zap, title: "Innovation", desc: "Technologies de pointe pour une meilleure expérience" },
              { icon: Star, title: "Excellence", desc: "Qualité de service irréprochable 24/7" },
              { icon: Award, title: "Impact", desc: "Contribution positive au développement africain" }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-terex-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-terex-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
