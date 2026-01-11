
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, DollarSign, Briefcase, Heart, ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobApplicationForm } from '@/components/features/JobApplicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CareersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState<Set<number>>(new Set());

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

  const handleApply = (position: string) => {
    setSelectedPosition(position);
    setShowApplicationForm(true);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedPositions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPositions(newExpanded);
  };

  const openPositions = [
    {
      title: "Community Manager",
      type: "Temps plein",
      location: "Dakar / Remote",
      description: "Nous recherchons un(e) Community Manager passionné(e) pour développer et animer notre communauté crypto en Afrique francophone.",
      responsibilities: [
        "Gérer et animer nos réseaux sociaux (Twitter, LinkedIn, Telegram, Discord)",
        "Créer du contenu éducatif sur les cryptomonnaies et DeFi",
        "Organiser des événements virtuels et AMA (Ask Me Anything)",
        "Répondre aux questions de la communauté et fournir un support client",
        "Collaborer avec l'équipe marketing pour les campagnes",
        "Analyser les métriques d'engagement et proposer des améliorations"
      ],
      requirements: [
        "2+ années d'expérience en community management",
        "Excellente maîtrise du français et de l'anglais",
        "Connaissance approfondie des cryptomonnaies et blockchain",
        "Expérience avec les outils de gestion de réseaux sociaux",
        "Créativité et capacité à créer du contenu engageant",
        "Disponibilité pour travailler en horaires flexibles"
      ],
      benefits: [
        "Salaire compétitif + bonus performance",
        "Formation continue sur les technologies blockchain",
        "Opportunité de voyager pour des événements crypto",
        "Équipe internationale et dynamique",
        "Participation aux profits de l'entreprise"
      ]
    },
    {
      title: "Spécialiste Opérations Crypto",
      type: "Temps plein",
      location: "Dakar / Remote",
      description: "Rejoignez notre équipe opérationnelle pour traiter et superviser les transactions crypto-fiat en temps réel.",
      responsibilities: [
        "Traiter les ordres d'achat et de vente d'USDT",
        "Vérifier et valider les paiements Mobile Money et virements",
        "Superviser les transferts internationaux",
        "Gérer les portefeuilles crypto et les adresses de réception",
        "Assurer le support client pour les transactions",
        "Maintenir les registres et rapports de transactions"
      ],
      requirements: [
        "Expérience en finance ou en opérations bancaires",
        "Connaissance des cryptomonnaies et wallets",
        "Maîtrise des systèmes de paiement Mobile Money",
        "Attention aux détails et rigueur",
        "Capacité à travailler sous pression",
        "Disponibilité 6j/7 (rotation d'équipes)"
      ],
      benefits: [
        "Formation complète aux opérations crypto",
        "Horaires flexibles avec rotation",
        "Prime de performance mensuelle",
        "Évolution vers des postes de supervision",
        "Assurance santé complète"
      ]
    },
    {
      title: "Développeur Frontend React",
      type: "Temps plein",
      location: "Remote / Dakar",
      description: "Développez l'interface utilisateur de notre plateforme d'échange crypto avec les dernières technologies web.",
      responsibilities: [
        "Développer des interfaces utilisateur modernes avec React/TypeScript",
        "Intégrer les API de blockchain et de paiement",
        "Optimiser les performances et l'expérience utilisateur",
        "Maintenir et améliorer l'architecture frontend",
        "Collaborer avec l'équipe design et backend",
        "Implémenter les tests unitaires et d'intégration"
      ],
      requirements: [
        "3+ années d'expérience en développement React",
        "Maîtrise de TypeScript, JavaScript ES6+",
        "Expérience avec les API REST et WebSocket",
        "Connaissance des outils de build (Vite, Webpack)",
        "Familiarité avec les cryptomonnaies et DeFi",
        "Capacité à travailler en équipe agile"
      ],
      benefits: [
        "Environnement de travail moderne",
        "Formation continue aux nouvelles technologies",
        "Équipement de développement fourni",
        "Horaires flexibles et télétravail",
        "Participation aux projets innovants"
      ]
    },
    {
      title: "Responsable Marketing Digital",
      type: "Temps plein",
      location: "Dakar / Remote",
      description: "Pilotez la stratégie marketing digital de Terex pour conquérir le marché africain des cryptomonnaies.",
      responsibilities: [
        "Développer et exécuter la stratégie marketing digital",
        "Gérer les campagnes publicitaires multi-canaux",
        "Analyser les performances et optimiser le ROI",
        "Créer du contenu marketing pour différents supports",
        "Gérer les partenariats et collaborations",
        "Superviser l'équipe marketing et community"
      ],
      requirements: [
        "5+ années d'expérience en marketing digital",
        "Excellente connaissance des réseaux sociaux",
        "Maîtrise des outils d'analytics et de tracking",
        "Expérience dans le secteur fintech ou crypto",
        "Capacités de leadership et de gestion d'équipe",
        "Créativité et sens stratégique"
      ],
      benefits: [
        "Poste à responsabilités avec autonomie",
        "Budget marketing conséquent",
        "Formation aux dernières tendances marketing",
        "Opportunités de networking internationales",
        "Participation à la croissance de l'entreprise"
      ]
    },
    {
      title: "Analyste Financier Crypto",
      type: "Temps plein",
      location: "Dakar / Remote",
      description: "Analysez les marchés crypto et optimisez les stratégies financières pour maximiser la rentabilité.",
      responsibilities: [
        "Analyser les tendances et mouvements des marchés crypto",
        "Établir les stratégies de pricing et de liquidité",
        "Suivre et optimiser les performances financières",
        "Préparer les rapports financiers réguliers",
        "Gérer les risques de change et de marché",
        "Proposer des améliorations des processus financiers"
      ],
      requirements: [
        "Formation en finance, économie ou mathématiques",
        "2+ années d'expérience en analyse financière",
        "Connaissance approfondie des marchés crypto",
        "Maîtrise des outils d'analyse (Excel, Python, R)",
        "Capacités analytiques et de synthèse",
        "Rigueur et attention aux détails"
      ],
      benefits: [
        "Accès aux données de marché en temps réel",
        "Formation continue sur les marchés financiers",
        "Environnement de travail stimulant",
        "Opportunités d'évolution rapide",
        "Bonus liés aux performances"
      ]
    }
  ];

  const companyValues = [
    {
      icon: <Heart className="w-8 h-8 text-terex-accent" />,
      title: "Innovation",
      description: "Nous révolutionnons les transferts d'argent en Afrique avec les technologies blockchain les plus avancées."
    },
    {
      icon: <Users className="w-8 h-8 text-terex-accent" />,
      title: "Diversité",
      description: "Notre équipe multiculturelle reflète la richesse de nos marchés africains."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-terex-accent" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque transaction et chaque interaction avec nos clients."
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative">
      {/* Grid background pattern (mode sombre uniquement) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none hidden dark:block" style={{
        backgroundImage: `linear-gradient(#3B968F 1px, transparent 1px),
                          linear-gradient(90deg, #3B968F 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
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
          <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 border border-terex-accent/20">
              <Briefcase className="w-4 md:w-5 h-4 md:h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium text-sm md:text-base">Carrières chez Terex</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 px-4">
              Construisons l'avenir de la <span className="text-terex-accent">finance digitale</span> ensemble
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-12 px-4">
              Rejoignez l'équipe qui révolutionne les transferts d'argent entre l'Afrique et le monde. Nous recherchons des talents passionnés pour notre croissance.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-center px-4">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terex-accent">5</div>
                <div className="text-gray-300 text-sm md:text-base">Postes ouverts</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terex-accent">5+</div>
                <div className="text-gray-300 text-sm md:text-base">Pays couverts</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-terex-accent">24/7</div>
                <div className="text-gray-300 text-sm md:text-base">Service continu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valeurs de l'entreprise */}
      <div className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Nos Valeurs</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez l'esprit Terex et ce qui nous unit dans notre mission de transformation financière.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-terex-accent/10 rounded-full w-fit">
                    {value.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Postes ouverts */}
      <div className="py-24 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Postes Ouverts</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez nos opportunités actuelles et rejoignez une équipe qui façonne l'avenir de la finance en Afrique.
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Collapsible 
                key={index} 
                open={expandedPositions.has(index)}
                onOpenChange={() => toggleExpanded(index)}
              >
                <Card className="bg-gradient-to-br from-terex-dark to-terex-gray/20 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-terex-accent/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <CardTitle className="text-white text-xl md:text-2xl">{position.title}</CardTitle>
                            <Badge className="bg-terex-accent text-black font-medium w-fit">{position.type}</Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-300 mb-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm md:text-base">{position.location}</span>
                            </div>
                          </div>
                          
                          <CardDescription className="text-gray-300 text-sm md:text-base">
                            {position.description}
                          </CardDescription>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-0 sm:ml-6">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(position.title);
                            }}
                            className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold w-full sm:w-auto"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Postuler
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 w-full sm:w-auto"
                          >
                            {expandedPositions.has(index) ? 'Réduire' : 'Détails'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Responsabilités :</h4>
                        <ul className="space-y-2 text-gray-300">
                          {position.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3">Prérequis :</h4>
                        <ul className="space-y-2 text-gray-300">
                          {position.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3">Avantages :</h4>
                        <ul className="space-y-2 text-gray-300">
                          {position.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Contact HR */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/20 border-terex-accent/20 p-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl mb-4">Questions sur nos postes ?</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Notre équipe RH est là pour répondre à toutes vos questions sur les opportunités chez Terex.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => window.location.href = 'mailto:Terangaexchange@gmail.com?subject=Question%20Carrières%20Terex'}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                >
                  Contacter les RH
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog pour le formulaire de candidature */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-terex-dark border-terex-accent/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Candidature - {selectedPosition}</DialogTitle>
          </DialogHeader>
          {selectedPosition && (
            <JobApplicationForm 
              position={selectedPosition} 
              onClose={() => setShowApplicationForm(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <FooterSection />
    </div>
  );
};

export default CareersPage;
