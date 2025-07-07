
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Globe, Shield, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Utilisateurs Actifs", value: "10K+", icon: Users },
    { label: "Pays Desservis", value: "25+", icon: Globe },
    { label: "Volume Mensuel", value: "$5M+", icon: TrendingUp },
    { label: "Taux de Satisfaction", value: "98%", icon: Award }
  ];

  const team = [
    {
      name: "Amadou Diallo",
      role: "CEO & Fondateur",
      bio: "Expert fintech avec 15 ans d'expérience dans les services financiers en Afrique",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "Fatou Sow",
      role: "CTO",
      bio: "Ingénieure blockchain spécialisée dans les solutions de paiement décentralisées",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "Omar Ba",
      role: "Head of Compliance",
      bio: "Expert en réglementation financière et conformité AML/KYC",
      image: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
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

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Hero Section */}
      <div className="bg-terex-darker border-b border-terex-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 rounded-xl mr-4"
              />
              <h1 className="text-4xl font-bold text-white">
                À propos de <span className="text-terex-accent">Terex</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Terex (Teranga Exchange) révolutionne les échanges crypto-fiat et les transferts d'argent 
              vers l'Afrique. Notre mission : rendre les services financiers numériques accessibles, 
              sécurisés et abordables pour tous.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section avec statistiques */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Notre Mission</h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Chez Terex, nous croyons que chaque africain mérite un accès simple et sécurisé aux 
                services financiers numériques. Notre plateforme connecte les crypto-monnaies aux 
                monnaies traditionnelles, facilitant les échanges et les transferts internationaux.
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Fondée en 2024, Terex s'appuie sur la technologie blockchain pour offrir des solutions 
                innovantes qui répondent aux besoins spécifiques du marché africain.
              </p>
              
              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-terex-darker rounded-xl p-4 border border-terex-accent/20">
                  <div className="text-2xl font-bold text-terex-accent">99.9%</div>
                  <div className="text-gray-300 text-sm">Disponibilité</div>
                </div>
                <div className="bg-terex-darker rounded-xl p-4 border border-terex-accent/20">
                  <div className="text-2xl font-bold text-terex-accent">24/7</div>
                  <div className="text-gray-300 text-sm">Support Client</div>
                </div>
                <div className="bg-terex-darker rounded-xl p-4 border border-terex-accent/20">
                  <div className="text-2xl font-bold text-terex-accent">&lt; 5min</div>
                  <div className="text-gray-300 text-sm">Temps moyen</div>
                </div>
                <div className="bg-terex-darker rounded-xl p-4 border border-terex-accent/20">
                  <div className="text-2xl font-bold text-terex-accent">ISO 27001</div>
                  <div className="text-gray-300 text-sm">Certification</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl p-8 border border-terex-accent/30">
                <Target className="w-16 h-16 text-terex-accent mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Vision 2030</h3>
                <p className="text-gray-300 mb-6">
                  Devenir la référence africaine pour les échanges crypto-fiat et 
                  les transferts d'argent, en servant plus de 1 million d'utilisateurs 
                  à travers 50 pays africains.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mr-3"></div>
                    50+ pays couverts
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mr-3"></div>
                    1M+ utilisateurs actifs
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mr-3"></div>
                    $1B+ de volume traité
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Terex en chiffres</h2>
            <p className="text-gray-300 text-lg">Des résultats qui parlent d'eux-mêmes</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-terex-darker border-terex-gray text-center hover:border-terex-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-terex-accent/10">
                  <CardContent className="p-8">
                    <IconComponent className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nos Valeurs</h2>
            <p className="text-gray-300 text-lg">
              Les principes qui guident chaque décision chez Terex
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="w-10 h-10 text-terex-accent mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Notre Équipe</h2>
            <p className="text-gray-300 text-lg">
              Des experts passionnés qui construisent l'avenir de la fintech africaine
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-terex-darker border-terex-gray">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                  <p className="text-terex-accent text-sm mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 border-terex-accent/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Rejoignez la révolution Terex
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Découvrez nos services et commencez à échanger vos USDT dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-8 py-3"
                >
                  Créer un Compte
                </Button>
                <Button 
                  onClick={() => navigate('/careers')}
                  variant="outline"
                  className="border-terex-accent text-terex-accent hover:bg-terex-accent/10 px-8 py-3"
                >
                  Nous Rejoindre
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
