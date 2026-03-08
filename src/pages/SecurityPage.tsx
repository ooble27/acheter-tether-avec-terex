
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const securityFeatures = [
    {
      title: "Chiffrement de Bout en Bout",
      description: "Toutes vos données sont chiffrées avec AES-256, le même standard utilisé par les banques.",
      icon: Lock,
      level: "Élevé"
    },
    {
      title: "Authentification à 2 Facteurs",
      description: "Protection supplémentaire avec codes SMS, applications authenticator ou clés physiques.",
      icon: Shield,
      level: "Élevé"
    },
    {
      title: "Stockage Sécurisé des Fonds",
      description: "95% des fonds sont stockés hors ligne dans des cold wallets multi-signatures.",
      icon: Server,
      level: "Maximum"
    },
    {
      title: "Surveillance Continue",
      description: "Monitoring 24/7 avec détection automatique des activités suspectes.",
      icon: Eye,
      level: "Élevé"
    },
    {
      title: "Conformité Réglementaire",
      description: "Respect des normes KYC/AML et des réglementations financières internationales.",
      icon: FileCheck,
      level: "Maximum"
    },
    {
      title: "Audits de Sécurité",
      description: "Audits réguliers par des sociétés de cybersécurité reconnues.",
      icon: AlertTriangle,
      level: "Élevé"
    }
  ];

  const certifications = [
    {
      name: "ISO 27001",
      description: "Certification de sécurité de l'information",
      status: "Certifié"
    },
    {
      name: "SOC 2 Type II",
      description: "Audit des contrôles de sécurité",
      status: "Certifié"
    },
    {
      name: "PCI DSS",
      description: "Sécurité des données de cartes de paiement",
      status: "Conforme"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Maximum': return 'bg-red-600';
      case 'Élevé': return 'bg-orange-600';
      case 'Moyen': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <Shield className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Politique de Sécurité</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Sécurité de <span className="text-terex-accent">Niveau Bancaire</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Votre sécurité est notre priorité absolue. Découvrez les mesures que nous prenons pour protéger vos fonds et vos données.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-terex-accent">
              <div className="text-center">
                <div className="text-3xl font-bold">256-bit</div>
                <div className="text-sm text-gray-400">Chiffrement AES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-gray-400">Fonds hors ligne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-gray-400">Surveillance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Mesures de Sécurité</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-terex-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                        </div>
                      </div>
                      <Badge className={`${getLevelColor(feature.level)} text-white`}>
                        {feature.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="bg-gradient-to-r from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-accent/20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Certifications et Conformité</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-8 h-8 text-terex-accent" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{cert.name}</h4>
                  <p className="text-gray-300 text-sm mb-3">{cert.description}</p>
                  <Badge className="bg-green-600 text-white">{cert.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Conseils de Sécurité</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-terex-darker/80 border-terex-accent/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-terex-accent" />
                    Pour votre Compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Utilisez un mot de passe unique et complexe</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Activez l'authentification à deux facteurs</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Ne partagez jamais vos identifiants</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Déconnectez-vous après chaque session</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker/80 border-terex-accent/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-terex-accent" />
                    Vigilance contre les Fraudes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Vérifiez toujours l'URL officielle</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Méfiez-vous des emails de phishing</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Ne donnez jamais vos codes par téléphone</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Contactez-nous en cas de doute</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default SecurityPage;
