
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Users, Globe, Shield, Target, Award, CheckCircle, Download, Calendar, Mail, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useContactMessages } from '@/hooks/useContactMessages';

const InvestorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendMessage, loading: sendingMessage } = useContactMessages();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    investmentAmount: '',
    message: ''
  });

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour envoyer votre demande d'investissement",
        variant: "destructive",
      });
      return;
    }

    const messageContent = `
DEMANDE D'INVESTISSEMENT TEREX

Nom: ${contactForm.name}
Email: ${contactForm.email}
Téléphone: ${contactForm.phone}
Société/Fonds: ${contactForm.company}
Montant d'investissement envisagé: ${contactForm.investmentAmount}

Message:
${contactForm.message}
    `;

    const result = await sendMessage({
      subject: `Demande d'investissement - ${contactForm.name}`,
      message: messageContent,
      user_email: contactForm.email,
      user_name: contactForm.name,
      user_phone: contactForm.phone
    });

    if (!result.error) {
      setContactForm({ 
        name: '', 
        email: '', 
        phone: '', 
        company: '', 
        investmentAmount: '', 
        message: '' 
      });
    }
  };

  const stats = [
    {
      icon: TrendingUp,
      value: "10M+ CFA",
      label: "Volume mensuel",
      description: "En croissance constante de 40% par mois"
    },
    {
      icon: Users,
      value: "1,000+",
      label: "Utilisateurs actifs",
      description: "Base d'utilisateurs en expansion rapide"
    },
    {
      icon: Globe,
      value: "6",
      label: "Pays couverts",
      description: "Sénégal, Mali, Burkina Faso, Côte d'Ivoire..."
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Disponibilité",
      description: "Infrastructure robuste et sécurisée"
    }
  ];

  const opportunities = [
    {
      title: "Marché addressable de +40 milliards USD",
      description: "Les transferts d'argent vers l'Afrique représentent un marché énorme en croissance constante avec un potentiel de disruption majeur"
    },
    {
      title: "Pont crypto-fiat unique en Afrique",
      description: "Positionnement unique entre les cryptomonnaies et les systèmes de paiement traditionnels africains - un marché sous-exploité"
    },
    {
      title: "Équipe expérimentée + technologie éprouvée",
      description: "Combinaison rare d'expertise du marché africain, maîtrise technologique blockchain et vision entrepreneuriale"
    }
  ];

  const investmentHighlights = [
    {
      title: "Croissance rapide",
      description: "40% de croissance mensuelle avec une trajectoire de scalabilité internationale"
    },
    {
      title: "Modèle économique rentable",
      description: "Revenus récurrents sur chaque transaction avec des marges attractives"
    },
    {
      title: "Barrières à l'entrée élevées",
      description: "Expertise réglementaire, partenariats locaux et infrastructure technique complexe"
    },
    {
      title: "Timing optimal",
      description: "Adoption croissante des crypto en Afrique et digitalisation des paiements"
    }
  ];

  const team = [
    {
      name: "Mohamed Lo",
      role: "CEO & Fondateur",
      description: "Entrepreneur expérimenté avec une vision claire pour révolutionner la finance africaine"
    },
    {
      name: "Sidy Ndiaye",
      role: "CTO & Co-fondateur",
      description: "Expert en blockchain et systèmes financiers décentralisés avec +5 ans d'expérience"
    }
  ];

  const investmentTypes = [
    {
      type: "Seed Round",
      amount: "100K - 500K USD",
      description: "Pour l'expansion en Afrique de l'Ouest et développement produit"
    },
    {
      type: "Series A",
      amount: "1M - 5M USD",
      description: "Pour l'expansion continentale et partenariats stratégiques"
    },
    {
      type: "Investisseurs individuels",
      amount: "À partir de 10K USD",
      description: "Pour les investisseurs privés et family offices"
    }
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
              <TrendingUp className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Opportunité d'Investissement</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Investissez dans l'avenir de la <span className="text-terex-accent">finance africaine</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Rejoignez-nous pour révolutionner les échanges financiers en Afrique grâce à la technologie blockchain. 
              Une opportunité unique dans un marché en pleine expansion de +40 milliards USD.
            </p>
            
            <div className="bg-terex-accent/10 rounded-2xl p-6 mb-12 border border-terex-accent/20">
              <p className="text-terex-accent font-semibold text-lg mb-2">🚀 Nous recherchons activement des investisseurs</p>
              <p className="text-gray-300">Levée de fonds en cours pour accélérer notre expansion en Afrique</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-terex-accent" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-terex-accent font-medium mb-1">{stat.label}</div>
                    <div className="text-gray-400 text-sm">{stat.description}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Investir maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-8 py-4 text-lg rounded-xl"
                onClick={() => document.getElementById('opportunity')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir l'opportunité
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Opportunity Section */}
      <section id="opportunity" className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pourquoi investir dans <span className="text-terex-accent">Terex</span> ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une opportunité unique de participer à la révolution financière en Afrique
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {opportunities.map((opportunity, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-6 h-6 text-terex-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{opportunity.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{opportunity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentHighlights.map((highlight, index) => (
              <div key={index} className="bg-terex-darker rounded-xl p-6 border border-terex-accent/20">
                <h4 className="text-lg font-semibold text-white mb-3">{highlight.title}</h4>
                <p className="text-gray-300 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section className="py-20 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Opportunités d'<span className="text-terex-accent">investissement</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Différents niveaux d'investissement pour tous types d'investisseurs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {investmentTypes.map((investment, index) => (
              <Card key={index} className="bg-terex-dark border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{investment.type}</CardTitle>
                  <div className="text-3xl font-bold text-terex-accent">{investment.amount}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">{investment.description}</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Contactez-nous
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Modèle économique <span className="text-terex-accent">rentable</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des revenus récurrents avec des marges attractives et une scalabilité prouvée
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Sources de revenus</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-terex-accent mr-3" />
                  <span className="text-gray-300">Frais de change sur les échanges USDT (0.5-1%)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-terex-accent mr-3" />
                  <span className="text-gray-300">Commissions sur les transferts internationaux (2-3%)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-terex-accent mr-3" />
                  <span className="text-gray-300">Services premium pour les gros volumes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-terex-accent mr-3" />
                  <span className="text-gray-300">Partenariats avec institutions financières</span>
                </div>
              </div>
            </div>
            
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Projections 2024-2027</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Volume mensuel actuel</span>
                    <span className="text-terex-accent font-bold">10M CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Objectif fin 2024</span>
                    <span className="text-terex-accent font-bold">100M CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Objectif 2025</span>
                    <span className="text-terex-accent font-bold">500M CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Objectif 2026</span>
                    <span className="text-terex-accent font-bold">1B CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Objectif 2027</span>
                    <span className="text-terex-accent font-bold">5B CFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Une équipe <span className="text-terex-accent">expérimentée</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dirigée par des entrepreneurs avec une vision claire et une expertise technique solide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-terex-dark border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-terex-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-terex-accent font-medium mb-4">{member.role}</p>
                  <p className="text-gray-300 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-terex-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à investir dans <span className="text-terex-accent">Terex</span> ?
            </h2>
            <p className="text-xl text-gray-300">
              Contactez-nous pour discuter de votre investissement et recevoir notre pitch deck
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Informations de contact</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-terex-accent mr-4" />
                  <div>
                    <p className="text-white font-medium">Email investisseurs</p>
                    <p className="text-gray-300">terangaexchange@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-terex-accent mr-4" />
                  <div>
                    <p className="text-white font-medium">Téléphone</p>
                    <p className="text-gray-300">+1 4182619091</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-terex-accent mr-4" />
                  <div>
                    <p className="text-white font-medium">Disponibilité</p>
                    <p className="text-gray-300">Lundi - Vendredi, 9h - 18h WAT</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Documents pour investisseurs</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                    <Download className="w-4 h-4 mr-2" />
                    Pitch Deck Terex 2024 (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                    <Download className="w-4 h-4 mr-2" />
                    Prévisions Financières (Excel)
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                    <Download className="w-4 h-4 mr-2" />
                    Étude de Marché Afrique (PDF)
                  </Button>
                </div>
              </div>
            </div>
            
            <Card className="bg-terex-darker border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Demande d'investissement</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="+1 4182619091"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Société / Fonds
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Nom de votre société ou fonds"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Montant d'investissement envisagé
                    </label>
                    <input
                      type="text"
                      value={contactForm.investmentAmount}
                      onChange={(e) => setContactForm({...contactForm, investmentAmount: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Ex: 50,000 USD"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-3 bg-terex-dark border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Parlez-nous de votre intérêt pour investir dans Terex, votre expérience en investissement, et vos objectifs..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={sendingMessage}
                    className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold py-3 rounded-lg disabled:opacity-50"
                  >
                    {sendingMessage ? 'Envoi en cours...' : 'Envoyer ma demande d\'investissement'}
                    {!sendingMessage && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Nous répondons généralement dans les 24-48h pour les demandes d'investissement
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default InvestorsPage;
