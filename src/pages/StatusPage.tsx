
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StatusPage = () => {
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

  const systemStatus = {
    overall: 'operational',
    lastUpdated: new Date().toLocaleString('fr-FR')
  };

  const services = [
    {
      name: 'API Terex',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      icon: Server,
      description: 'API principale pour les transactions'
    },
    {
      name: 'Base de Données',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '12ms',
      icon: Database,
      description: 'Stockage des données utilisateurs'
    },
    {
      name: 'Système de Paiement',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '234ms',
      icon: Shield,
      description: 'Traitement des paiements'
    },
    {
      name: 'Échange USDT',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '89ms',
      icon: Activity,
      description: 'Système d\'échange crypto'
    },
    {
      name: 'Transferts Internationaux',
      status: 'maintenance',
      uptime: '98.5%',
      responseTime: '456ms',
      icon: Clock,
      description: 'Service de transferts vers l\'Afrique'
    },
    {
      name: 'Authentification',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '23ms',
      icon: Shield,
      description: 'Système de connexion utilisateur'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'maintenance': return 'text-yellow-400';
      case 'degraded': return 'text-orange-400';
      case 'outage': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'maintenance': return AlertTriangle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      default: return Clock;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'degraded': return 'bg-orange-600';
      case 'outage': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Opérationnel';
      case 'maintenance': return 'Maintenance';
      case 'degraded': return 'Dégradé';
      case 'outage': return 'Panne';
      default: return 'Inconnu';
    }
  };

  const recentIncidents = [
    {
      date: '2024-01-15 14:30',
      title: 'Maintenance programmée - Transferts internationaux',
      status: 'resolved',
      description: 'Mise à jour du système de transferts vers l\'Afrique'
    },
    {
      date: '2024-01-10 09:15',
      title: 'Ralentissement des API',
      status: 'resolved',
      description: 'Temps de réponse élevé résolu en 45 minutes'
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
              <Activity className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Statut Système</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              État des <span className="text-terex-accent">Systèmes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Surveillez en temps réel l'état de nos services et systèmes.
            </p>

            {/* Overall Status */}
            <div className="inline-flex items-center space-x-3 bg-terex-darker/80 rounded-full px-8 py-4 border border-terex-accent/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-lg">Tous les systèmes sont opérationnels</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Dernière mise à jour: {systemStatus.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">État des Services</h2>
          
          <div className="grid gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const StatusIcon = getStatusIcon(service.status);
              
              return (
                <Card key={index} className="bg-gradient-to-r from-terex-darker to-terex-gray/30 border-terex-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-terex-accent" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{service.name}</h3>
                          <p className="text-gray-400 text-sm">{service.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Disponibilité</p>
                          <p className="text-white font-medium">{service.uptime}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Temps de réponse</p>
                          <p className="text-white font-medium">{service.responseTime}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                          <Badge className={`${getStatusBadge(service.status)} text-white`}>
                            {getStatusText(service.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Incidents */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Incidents Récents</h2>
            <div className="space-y-4">
              {recentIncidents.map((incident, index) => (
                <Card key={index} className="bg-terex-darker/80 border-terex-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className="bg-green-600 text-white">Résolu</Badge>
                          <span className="text-gray-400 text-sm">{incident.date}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{incident.title}</h3>
                        <p className="text-gray-300">{incident.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default StatusPage;
