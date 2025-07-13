
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { useFraudDetection, FraudAlert } from '@/hooks/useFraudDetection';
import { useAuth } from '@/contexts/AuthContext';

export function FraudDetectionDashboard() {
  const { alerts, stats, loading, updateAlertStatus } = useFraudDetection();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAlertTypeLabel = (type: FraudAlert['alert_type']) => {
    switch (type) {
      case 'suspicious_amount': return 'Montant suspect';
      case 'rapid_transactions': return 'Transactions rapides';
      case 'unusual_pattern': return 'Motif inhabituel';
      case 'blacklisted_address': return 'Adresse blacklistée';
      case 'kyc_mismatch': return 'Problème KYC';
      default: return type;
    }
  };

  const handleAlertAction = async (alertId: string, action: FraudAlert['status']) => {
    if (!user) return;
    await updateAlertStatus(alertId, action, user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement du système de détection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-terex-accent" />
            Détection de Fraude
          </h1>
          <p className="text-gray-400">Surveillance et analyse des activités suspectes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Alertes Totales</p>
                <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.pendingAlerts}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critiques</p>
                <p className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taux Détection</p>
                <p className="text-2xl font-bold text-green-500">{stats.detectionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-terex-gray">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="patterns">Motifs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Alertes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-terex-gray rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {getAlertTypeLabel(alert.alert_type)}
                          </span>
                        </div>
                        <p className="text-white text-sm">{alert.description}</p>
                      </div>
                      <Badge variant={alert.status === 'pending' ? 'destructive' : 'secondary'}>
                        {alert.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Analyse des Tendances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transactions bloquées</span>
                    <span className="text-white font-semibold">{stats.blockedTransactions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Faux positifs</span>
                    <span className="text-white font-semibold">{stats.falsePositives}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Efficacité système</span>
                    <span className="text-green-500 font-semibold">95.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Toutes les Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-terex-gray rounded-lg border border-terex-gray">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-white font-medium">
                          {getAlertTypeLabel(alert.alert_type)}
                        </span>
                        <Badge variant={alert.status === 'pending' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{alert.description}</p>
                    
                    {alert.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'reviewed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'dismissed')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'escalated')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Escalader
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Analyse des Motifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-white mb-2">Analyse des Motifs</h3>
                <p className="text-gray-400">
                  Les motifs de fraude détectés seront affichés ici avec des graphiques détaillés.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
