
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Zap, Heart, Trophy, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareersPage = () => {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: "Développeur Full-Stack Senior",
      department: "Technique",
      location: "Dakar / Remote",
      type: "CDI",
      experience: "5+ ans",
      description: "Développement de nouvelles fonctionnalités sur notre plateforme d'échange crypto-fiat",
      skills: ["React", "Node.js", "PostgreSQL", "Blockchain"]
    },
    {
      title: "Responsable Conformité",
      department: "Compliance",
      location: "Dakar",
      type: "CDI",
      experience: "3+ ans",
      description: "Supervision des processus KYC/AML et conformité réglementaire",
      skills: ["AML/KYC", "Réglementation", "Audit", "Risk Management"]
    },
    {
      title: "Chef de Produit Crypto",
      department: "Produit",
      location: "Remote",
      type: "CDI",
      experience: "4+ ans",
      description: "Pilotage de la roadmap produit et stratégie crypto",
      skills: ["Product Management", "Crypto", "Analytics", "UX"]
    },
    {
      title: "Développeur Blockchain",
      department: "Technique",
      location: "Dakar / Remote",
      type: "CDI",
      experience: "3+ ans",
      description: "Développement de smart contracts et intégrations blockchain",
      skills: ["Solidity", "Web3", "DeFi", "Smart Contracts"]
    },
    {
      title: "Responsable Marketing Digital",
      department: "Marketing",
      location: "Remote",
      type: "CDI",
      experience: "3+ ans",
      description: "Stratégie marketing digital et acquisition utilisateurs",
      skills: ["Marketing Digital", "SEO/SEM", "Social Media", "Analytics"]
    },
    {
      title: "Support Client Senior",
      department: "Support",
      location: "Dakar",
      type: "CDI",
      experience: "2+ ans",
      description: "Support technique et accompagnement des utilisateurs",
      skills: ["Support Client", "Crypto", "Multilingue", "CRM"]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Innovation Continue",
      description: "Travaillez sur des technologies de pointe dans l'écosystème blockchain et crypto"
    },
    {
      icon: Users,
      title: "Équipe Diverse",
      description: "Rejoignez une équipe multiculturelle passionnée par la fintech africaine"
    },
    {
      icon: Heart,
      title: "Impact Social",
      description: "Contribuez à l'inclusion financière et au développement économique africain"
    },
    {
      icon: Trophy,
      title: "Croissance Rapide",
      description: "Évoluez dans une startup en forte croissance avec de nombreuses opportunités"
    }
  ];

  const perks = [
    "Salaire compétitif + equity",
    "Télétravail flexible",
    "Formation continue",
    "Assurance santé",
    "Budget conférences",
    "Team building réguliers",
    "Matériel de travail fourni",
    "Congés flexibles"
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <div className="bg-terex-darker border-b border-terex-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Carrières chez <span className="text-terex-accent">Terex</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Rejoignez notre équipe et construisons ensemble l'avenir de la fintech africaine. 
              Nous recherchons des talents passionnés pour révolutionner les services financiers numériques.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Join Us */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Pourquoi Terex ?</h2>
            <p className="text-gray-300 text-lg">
              Une mission inspirante, des défis techniques passionnants et un impact réel sur l'Afrique
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-terex-accent/10">
                  <CardContent className="p-8 text-center">
                    <IconComponent className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-3 text-lg">{benefit.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Company Culture Highlight */}
          <div className="mt-16 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-2xl p-8 border border-terex-accent/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Une startup qui change la donne</h3>
              <p className="text-gray-300 text-lg mb-6">
                Rejoignez une équipe qui révolutionne les services financiers en Afrique avec des technologies de pointe
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-terex-accent mb-2">Series A</div>
                  <p className="text-gray-300">Financement levé</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-terex-accent mb-2">15+</div>
                  <p className="text-gray-300">Pays d'activité</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-terex-accent mb-2">500%</div>
                  <p className="text-gray-300">Croissance annuelle</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Postes Ouverts</h2>
            <p className="text-gray-300 text-lg">
              Découvrez nos opportunités actuelles et trouvez votre prochain défi
            </p>
          </div>
          
          <div className="grid gap-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <CardTitle className="text-white text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-terex-accent/20 text-terex-accent">
                          {position.department}
                        </Badge>
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                      onClick={() => window.location.href = 'mailto:careers@terex.com?subject=Candidature - ' + position.title}
                    >
                      Postuler
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{position.description}</p>
                  <div className="mb-4">
                    <p className="text-terex-accent font-medium mb-2">Expérience requise : {position.experience}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Compétences clés :</p>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, idx) => (
                        <span key={idx} className="bg-terex-gray text-gray-300 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Avantages & Bénéfices</h2>
              <p className="text-gray-300 text-lg mb-8">
                Nous prenons soin de notre équipe avec des avantages compétitifs et un environnement 
                de travail stimulant qui favorise l'épanouissement professionnel.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mr-3"></div>
                    <span className="text-gray-300">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 border-terex-accent/30">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-terex-accent mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">Culture d'Entreprise</h3>
                  <p className="text-gray-300 mb-6">
                    Chez Terex, nous cultivons une culture d'innovation, de collaboration et 
                    d'excellence. Nous encourageons la prise d'initiative et valorisons la 
                    diversité des perspectives.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Autonomie et responsabilisation</li>
                    <li>• Feedback continu et transparent</li>
                    <li>• Apprentissage et développement</li>
                    <li>• Work-life balance respecté</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <Card className="bg-terex-darker border-terex-accent/30">
            <CardContent className="p-8">
              <Mail className="w-12 h-12 text-terex-accent mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Vous ne trouvez pas le poste idéal ?
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Nous sommes toujours à la recherche de talents exceptionnels. 
                Envoyez-nous votre candidature spontanée !
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:careers@terex.com?subject=Candidature Spontanée'}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-8 py-3"
              >
                Candidature Spontanée
                <Mail className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CareersPage;
