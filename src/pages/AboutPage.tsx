
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Users, Globe, TrendingUp, Shield, Zap, Award, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const stats = [
    { label: "Volume Traité", value: "10M+", icon: TrendingUp },
    { label: "Utilisateurs", value: "500+", icon: Users },
    { label: "Pays Desservis", value: "5", icon: Globe },
    { label: "Disponibilité", value: "99.9%", icon: Award }
  ];

  const team = [
    {
      name: "Mohamed Lo",
      role: "CEO & Fondateur", 
      bio: "Expert fintech avec plus de 10 ans d'expérience dans les services financiers numériques en Afrique et au Canada",
      specialties: ["Leadership", "Fintech", "Vision Stratégique"]
    },
    {
      name: "Sidy Ndiaye",
      role: "CTO",
      bio: "Expert en fintech spécialisé dans le développement de solutions financières innovantes",
      specialties: ["Fintech", "Architecture", "Innovation"]
    },
    {
      name: "Adéchina Olaitan",
      role: "Head of Marketing",
      bio: "Spécialiste du marketing digital et de la communication pour les entreprises fintech",
      specialties: ["Marketing", "Communication", "Digital"]
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection maximale de vos fonds et données personnelles avec les dernières technologies de chiffrement."
    },
    {
      icon: Target,
      title: "Transparence", 
      description: "Tarifs clairs, processus transparent et communication honnête avec nos utilisateurs."
    },
    {
      icon: Globe,
      title: "Accessibilité",
      description: "Démocratiser l'accès aux services financiers numériques partout en Afrique."
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Construire une communauté forte autour de l'inclusion financière africaine."
    }
  ];

  const milestones = [
    { year: "2024", title: "Fondation de Terex", desc: "Lancement officiel avec l'équipe fondatrice" },
    { year: "Q2 2024", title: "Première levée de fonds", desc: "Seed round de $2M pour le développement" },
    { year: "Q3 2024", title: "Lancement MVP", desc: "Version bêta pour les premiers utilisateurs" },
    { year: "Q4 2024", title: "Expansion régionale", desc: "Ouverture vers 5 pays africains" },
    { year: "2025", title: "Série A", desc: "Objectif de $10M pour l'expansion" }
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

      {/* Hero Section avec parallax effect */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 via-transparent to-terex-accent/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-2">
                À propos de <span className="text-terex-accent">Terex</span>
              </h1>
              <p className="text-terex-accent text-lg font-medium">Teranga Exchange</p>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Terex révolutionne les échanges crypto-fiat et les transferts d'argent vers l'Afrique. 
              Notre mission : rendre les services financiers numériques accessibles, sécurisés et abordables pour tous.
            </p>
            
            {/* Live metrics */}
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Systèmes opérationnels
              </div>
              <div>99.9% de disponibilité</div>
              <div>Support 24/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section - Fluid Layout */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3">
              <div className="flex items-center mb-8">
                <div className="w-1 h-16 bg-gradient-to-b from-terex-accent to-transparent mr-6"></div>
                <h2 className="text-4xl font-bold text-white">Notre Mission</h2>
              </div>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Chez Terex, nous croyons que chaque africain mérite un accès simple et sécurisé aux 
                services financiers numériques. Notre plateforme connecte les crypto-monnaies aux 
                monnaies traditionnelles, facilitant les échanges et les transferts internationaux.
              </p>
              
              <p className="text-gray-300 text-lg mb-12 leading-relaxed">
                Fondée en 2024, Terex s'appuie sur la technologie blockchain pour offrir des solutions 
                innovantes qui répondent aux besoins spécifiques du marché africain.
              </p>

              {/* Compact metrics */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { metric: "99.9%", label: "Disponibilité" },
                  { metric: "24/7", label: "Support Client" },
                  { metric: "< 5min", label: "Temps moyen" },
                  { metric: "ISO 27001", label: "Certification" }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-terex-accent/10 to-transparent rounded-xl border border-terex-accent/20">
                    <div className="text-2xl font-bold text-terex-accent mb-1">{item.metric}</div>
                    <div className="text-gray-300 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-terex-accent/20 via-terex-accent/10 to-transparent rounded-3xl p-8 backdrop-blur-sm border border-terex-accent/30">
                  <Target className="w-16 h-16 text-terex-accent mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Vision 2030</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Devenir la référence africaine pour les échanges crypto-fiat et 
                    les transferts d'argent, en servant plus de 1 million d'utilisateurs 
                    à travers 50 pays africains.
                  </p>
                  
                  <div className="space-y-4">
                    {["50+ pays couverts", "1M+ utilisateurs actifs", "$1B+ de volume traité"].map((goal, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-terex-accent rounded-full mr-4"></div>
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Same green color scheme */}
      <div className="py-20 bg-gradient-to-r from-terex-darker via-terex-dark to-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Terex en chiffres</h2>
            <p className="text-gray-300 text-lg">Des résultats qui parlent d'eux-mêmes</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group text-center">
                  <div className="bg-gradient-to-br from-terex-accent/10 to-transparent backdrop-blur-sm rounded-2xl p-4 lg:p-8 border border-terex-accent/20 group-hover:border-terex-accent/50 transition-all duration-500 group-hover:scale-105 h-full flex flex-col justify-center min-h-[160px] lg:min-h-[200px]">
                    <IconComponent className="w-8 h-8 lg:w-12 lg:h-12 text-terex-accent mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2 group-hover:text-terex-accent transition-colors duration-300 leading-tight">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 font-medium text-sm lg:text-base leading-tight px-1">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Notre Parcours</h2>
            <p className="text-gray-300 text-lg">L'évolution de Terex depuis sa création</p>
          </div>
          
          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-terex-accent via-terex-accent/50 to-transparent hidden md:block"></div>
            
            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:space-y-0 space-y-0`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} text-left px-4 md:px-0`}>
                    <div className="bg-gradient-to-br from-terex-accent/10 to-transparent rounded-xl p-6 border border-terex-accent/20 max-w-md mx-auto md:mx-0">
                      <div className="text-terex-accent font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-white font-semibold text-xl mb-2 leading-tight">{milestone.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{milestone.desc}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot - hidden on mobile */}
                  <div className="flex-shrink-0 w-4 h-4 bg-terex-accent rounded-full border-4 border-terex-dark hidden md:block"></div>
                  
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section - Same green color scheme */}
      <div className="py-24 bg-gradient-to-b from-terex-darker to-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nos Valeurs</h2>
            <p className="text-gray-300 text-lg">Les principes qui guident chaque décision chez Terex</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-terex-accent/10 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-terex-accent/20 hover:border-terex-accent/50 transition-all duration-500 hover:scale-[1.02]">
                  <IconComponent className="w-12 h-12 text-terex-accent mb-6" />
                  <h3 className="text-white font-bold text-xl mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section - Using person icons */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Notre Équipe</h2>
            <p className="text-gray-300 text-lg">Des experts passionnés qui construisent l'avenir de la fintech africaine</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group h-full">
                <div className="bg-gradient-to-br from-terex-accent/10 to-transparent rounded-2xl p-8 border border-terex-accent/20 hover:border-terex-accent/50 transition-all duration-500 hover:scale-105 h-full flex flex-col">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="w-12 h-12 text-terex-accent" />
                    </div>
                  </div>
                  
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-xl mb-2">{member.name}</h3>
                    <p className="text-terex-accent font-medium mb-4">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">{member.bio}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-auto">
                      {member.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-terex-accent/20 text-terex-accent text-xs px-3 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Full Width Gradient */}
      <div className="py-24 bg-gradient-to-r from-terex-accent/10 via-terex-accent/5 to-terex-accent/10 border-t border-terex-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Rejoignez la révolution Terex
          </h3>
          <p className="text-gray-300 mb-8 text-xl leading-relaxed">
            Découvrez nos services et commencez à échanger vos USDT dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-12 py-4 text-lg rounded-xl"
            >
              Créer un Compte
            </Button>
            <Button 
              onClick={() => navigate('/careers')}
              variant="outline"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent/10 px-12 py-4 text-lg rounded-xl"
            >
              Nous Rejoindre
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
