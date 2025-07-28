
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

const InvestorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
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
    toast({
      title: "Message envoyé",
      description: "Nous vous recontacterons dans les plus brefs délais",
      className: "bg-green-600 text-white border-green-600",
    });
    setContactForm({ name: '', email: '', company: '', message: '' });
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
      description: "Les transferts d'argent vers l'Afrique représentent un marché énorme en croissance constante"
    },
    {
      title: "Pont crypto-fiat unique",
      description: "Positionnement unique entre les cryptomonnaies et les systèmes de paiement traditionnels africains"
    },
    {
      title: "Expertise locale + technologie blockchain",
      description: "Combinaison rare d'expertise du marché africain et de maîtrise technologique blockchain"
    }
  ];

  const team = [
    {
      name: "Sidy Ndiaye",
      role: "CTO & Co-fondateur",
      description: "Expert en blockchain et systèmes financiers décentralisés"
    },
    {
      name: "Adéchina Olaitan",
      role: "CMO & Co-fondateur",
      description: "Spécialiste marketing digital et expansion africaine"
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
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Rejoignez-nous pour révolutionner les échanges financiers en Afrique grâce à la technologie blockchain. 
              Une opportunité unique dans un marché en pleine expansion.
            </p>
            
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
                Contactez-nous
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

      {/* Opportunity Section */}
      <section id="opportunity" className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Une opportunité <span className="text-terex-accent">exceptionnelle</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Le marché des transferts d'argent vers l'Afrique est en pleine expansion. 
              Terex se positionne comme le leader de cette révolution financière.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-20 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Modèle économique <span className="text-terex-accent">robuste</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des revenus récurrents générés par chaque transaction avec des marges attractives
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
            
            <Card className="bg-terex-dark border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Projections 2024-2026</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Volume mensuel actuel</span>
                    <span className="text-terex-accent font-bold">10M CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Objectif 2024</span>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Une équipe <span className="text-terex-accent">expérimentée</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dirigée par des experts reconnus dans leurs domaines respectifs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
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
      <section id="contact" className="py-20 bg-terex-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Contactez notre équipe <span className="text-terex-accent">investisseurs</span>
            </h2>
            <p className="text-xl text-gray-300">
              Discutons de cette opportunité d'investissement exceptionnelle
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
                    <p className="text-gray-300">investors@terex.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-terex-accent mr-4" />
                  <div>
                    <p className="text-white font-medium">Téléphone</p>
                    <p className="text-gray-300">+221 77 123 4567</p>
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
                <h4 className="text-lg font-semibold text-white mb-4">Documents disponibles</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                    <Download className="w-4 h-4 mr-2" />
                    Pitch Deck (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                    <Download className="w-4 h-4 mr-2" />
                    Prévisions Financières (PDF)
                  </Button>
                </div>
              </div>
            </div>
            
            <Card className="bg-terex-dark border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white">Demande d'information</CardTitle>
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
                      className="w-full px-4 py-3 bg-terex-darker border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
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
                      className="w-full px-4 py-3 bg-terex-darker border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="votre@email.com"
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
                      className="w-full px-4 py-3 bg-terex-darker border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Nom de votre société"
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
                      className="w-full px-4 py-3 bg-terex-darker border border-terex-gray rounded-lg text-white focus:border-terex-accent focus:outline-none"
                      placeholder="Parlez-nous de votre intérêt pour investir dans Terex..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold py-3 rounded-lg"
                  >
                    Envoyer la demande
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
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
