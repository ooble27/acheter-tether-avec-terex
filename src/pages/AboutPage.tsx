import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Heart, Users, Shield, Zap, Globe } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Chiffrement 256-bit et conformité réglementaire pour protéger vos fonds"
    },
    {
      icon: Zap,
      title: "Rapidité",
      description: "Transactions instantanées et interface utilisateur ultra-réactive"
    },
    {
      icon: Heart,
      title: "Accessibilité",
      description: "Solutions financières démocratisées pour tous en Afrique"
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Technologies blockchain de pointe pour l'avenir de la finance"
    }
  ];

  const team = [
    {
      name: "Amadou Diallo",
      role: "CEO & Fondateur",
      description: "Expert en fintech avec 10+ ans d'expérience en Afrique",
      image: "/lovable-uploads/abd0d53b-cb36-4edb-91e5-e55da1466079.png"
    },
    {
      name: "Fatou Sow",
      role: "CTO",
      description: "Architecte blockchain spécialisée en sécurité crypto",
      image: "/lovable-uploads/ae10f8c7-fb15-4996-8f3e-d8a28fe8f89e.png"
    },
    {
      name: "Ousmane Ndiaye",
      role: "Head of Partnerships",
      description: "Développement des relations bancaires et institutionnelles",
      image: "/lovable-uploads/72ce0703-a66b-4a87-869b-8e9b7a022eb4.png"
    }
  ];

  const stats = [
    { number: "50K+", label: "Utilisateurs actifs" },
    { number: "15", label: "Pays couverts" },
    { number: "$2M+", label: "Volume échangé" },
    { number: "99.9%", label: "Disponibilité" }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                  alt="Terex Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-xl font-bold text-white">Terex</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            À propos de <span className="text-terex-accent">Terex</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Révolutionner les échanges financiers en Afrique grâce à la technologie blockchain et aux cryptomonnaies.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-terex-darker border-terex-accent/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Target className="w-10 h-10 text-terex-accent" />
                <h2 className="text-3xl font-bold text-white">Notre Mission</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Démocratiser l'accès aux services financiers en Afrique en offrant des solutions d'échange USDT 
                et de transferts d'argent rapides, sécurisés et abordables. Nous connectons l'Afrique au monde 
                de la finance numérique.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-accent/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Eye className="w-10 h-10 text-terex-accent" />
                <h2 className="text-3xl font-bold text-white">Notre Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Devenir la plateforme de référence pour les échanges crypto-fiat en Afrique, 
                en créant un écosystème financier inclusif qui autonomise les individus et 
                stimule le développement économique du continent.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Terex en chiffres</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-terex-accent mb-2">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Valeurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Équipe */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Users className="w-8 h-8 text-terex-accent" />
            <h2 className="text-3xl font-bold text-white">Notre Équipe</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-terex-accent font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Histoire */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 border-terex-accent/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Notre Histoire</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Fondée en 2023, Terex est née de la conviction que l'Afrique mérite des solutions 
                  financières modernes et accessibles. Nos fondateurs, frustrés par la complexité 
                  et les coûts élevés des transferts d'argent traditionnels, ont décidé de créer 
                  une alternative révolutionnaire.
                </p>
                <p>
                  En combinant l'expertise locale avec les dernières innovations blockchain, 
                  nous avons développé une plateforme qui simplifie l'échange d'USDT et les 
                  transferts internationaux, tout en maintenant les plus hauts standards de sécurité.
                </p>
                <p>
                  Aujourd'hui, Terex continue de grandir et d'innover, avec pour objectif de 
                  démocratiser l'accès aux cryptomonnaies et de connecter l'Afrique à l'économie 
                  numérique mondiale.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Rejoignez la révolution financière
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Découvrez comment Terex peut transformer votre façon de gérer et d'échanger de l'argent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold"
            >
              Commencer maintenant
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
            >
              Nous contacter
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}