import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Briefcase, Heart, Zap, Globe, Coffee } from 'lucide-react';

export default function CareersPage() {
  const navigate = useNavigate();

  const jobs = [
    {
      title: "Développeur Full Stack Senior",
      department: "Engineering",
      location: "Dakar, Sénégal",
      type: "CDI",
      experience: "3-5 ans",
      description: "Rejoignez notre équipe technique pour développer les prochaines fonctionnalités de notre plateforme d'échange crypto.",
      skills: ["React", "Node.js", "TypeScript", "Blockchain", "PostgreSQL"],
      salary: "2.5M - 4M XOF"
    },
    {
      title: "Responsable Conformité",
      department: "Legal & Compliance",
      location: "Abidjan, Côte d'Ivoire",
      type: "CDI",
      experience: "5+ ans",
      description: "Assurez la conformité réglementaire de nos opérations dans tous les pays où nous opérons.",
      skills: ["Droit financier", "KYC/AML", "Conformité crypto", "BCEAO"],
      salary: "3M - 5M XOF"
    },
    {
      title: "Spécialiste Marketing Digital",
      department: "Marketing",
      location: "Remote/Bamako",
      type: "CDI",
      experience: "2-4 ans",
      description: "Développez notre présence digitale et nos campagnes marketing à travers l'Afrique francophone.",
      skills: ["Marketing digital", "SEO/SEM", "Social Media", "Analytics"],
      salary: "1.8M - 3M XOF"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Experience",
      location: "Ouagadougou, Burkina Faso",
      type: "CDI",
      experience: "2-3 ans",
      description: "Accompagnez nos utilisateurs dans leur découverte des cryptomonnaies et optimisez leur expérience.",
      skills: ["Support client", "Crypto", "Communication", "Formation"],
      salary: "1.5M - 2.5M XOF"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Assurance Santé",
      description: "Couverture santé complète pour vous et votre famille"
    },
    {
      icon: Zap,
      title: "Formation Continue",
      description: "Budget formation et certifications blockchain"
    },
    {
      icon: Globe,
      title: "Télétravail Flexible",
      description: "Travail hybride et équipes distribuées"
    },
    {
      icon: Coffee,
      title: "Environnement Startup",
      description: "Culture d'innovation et prise d'initiatives"
    },
    {
      icon: Users,
      title: "Équipe Multiculturelle",
      description: "Collaboration avec des talents de toute l'Afrique"
    },
    {
      icon: Briefcase,
      title: "Participation aux Bénéfices",
      description: "Stock options et primes de performance"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "Nous repoussons les limites de la fintech africaine"
    },
    {
      title: "Inclusion",
      description: "Nous croyons en l'accès égal aux services financiers"
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous faisons"
    },
    {
      title: "Impact",
      description: "Nous créons un impact positif sur l'économie africaine"
    }
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
            Rejoignez <span className="text-terex-accent">Terex</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Construisons ensemble l'avenir de la finance en Afrique. Découvrez nos opportunités de carrière et rejoignez une équipe passionnée.
          </p>
        </div>

        {/* Nos Valeurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Pourquoi Terex ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((value, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 text-center">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-terex-accent mb-3">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Avantages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nos Avantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <benefit.icon className="w-8 h-8 text-terex-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Postes Ouverts */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Briefcase className="w-8 h-8 text-terex-accent" />
            <h2 className="text-3xl font-bold text-white">Postes Ouverts</h2>
          </div>
          
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-white mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-terex-accent/20 text-terex-accent">
                          {job.department}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-terex-accent">{job.salary}</div>
                      <div className="text-sm text-gray-400">par mois</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Compétences requises :</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{job.experience} d'expérience</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold"
                      >
                        Postuler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process de Recrutement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Notre Processus</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Candidature", desc: "Envoyez votre CV et lettre de motivation" },
              { step: "2", title: "Entretien RH", desc: "Discussion sur votre profil et motivations" },
              { step: "3", title: "Test Technique", desc: "Évaluation de vos compétences pratiques" },
              { step: "4", title: "Entretien Final", desc: "Rencontre avec l'équipe et décision finale" }
            ].map((phase, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-terex-accent text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
                  <p className="text-gray-400 text-sm">{phase.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-2xl p-8 border border-terex-accent/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Nous sommes toujours à la recherche de talents exceptionnels. 
            Envoyez-nous votre candidature spontanée !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold"
            >
              Candidature spontanée
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
            >
              Nous suivre sur LinkedIn
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}