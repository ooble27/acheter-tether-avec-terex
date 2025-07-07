
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Zap, Heart, Trophy, Mail, ArrowRight, Star, Globe, Code, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CareersPage = () => {
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

  const openPositions = [
    {
      title: "Développeur Full-Stack Senior",
      department: "Technique",
      location: "Dakar / Remote",
      type: "CDI",
      experience: "5+ ans",
      salary: "€60k - €80k",
      description: "Développement de nouvelles fonctionnalités sur notre plateforme d'échange crypto-fiat avec des technologies de pointe",
      skills: ["React", "Node.js", "PostgreSQL", "Blockchain", "AWS"]
    },
    {
      title: "Responsable Conformité",
      department: "Compliance",
      location: "Dakar",
      type: "CDI",
      experience: "3+ ans",
      salary: "€45k - €60k",
      description: "Supervision des processus KYC/AML et conformité réglementaire pour l'expansion africaine",
      skills: ["AML/KYC", "Réglementation", "Audit", "Risk Management", "BCEAO"]
    },
    {
      title: "Chef de Produit Crypto",
      department: "Produit",
      location: "Remote",
      type: "CDI",
      experience: "4+ ans",
      salary: "€55k - €75k",
      description: "Pilotage de la roadmap produit et stratégie crypto pour les marchés africains",
      skills: ["Product Management", "Crypto", "Analytics", "UX", "Agile"]
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
              <Users className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Rejoignez Notre Équipe</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Carrières chez <span className="text-terex-accent">Terex</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Rejoignez notre équipe et construisons ensemble l'avenir de la fintech africaine. 
              Nous recherchons des talents passionnés pour révolutionner les services financiers numériques.
            </p>
            
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">Series A</div>
                <div className="text-gray-400">Financement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">15+</div>
                <div className="text-gray-400">Pays d'activité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">500%</div>
                <div className="text-gray-400">Croissance annuelle</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Postes Ouverts</h2>
            <p className="text-gray-300 text-lg">Découvrez nos opportunités actuelles</p>
          </div>
          
          <div className="grid gap-8">
            {openPositions.map((position, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-white mb-3">{position.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-terex-accent/20 text-terex-accent border-terex-accent/30">
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
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {position.salary}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-8 py-3"
                      onClick={() => window.location.href = 'mailto:careers@terex.com?subject=Candidature - ' + position.title}
                    >
                      Postuler
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{position.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-terex-accent font-medium mb-2">Expérience requise : {position.experience}</p>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-3">Compétences clés :</p>
                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, idx) => (
                          <span key={idx} className="bg-terex-accent/20 text-terex-accent px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default CareersPage;
