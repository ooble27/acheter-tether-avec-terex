
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Calendar, Share2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const certificates = [
  {
    id: 'blockchain-fundamentals',
    title: 'Fondamentaux de la Blockchain',
    description: 'Certification des connaissances de base en blockchain',
    dateEarned: '2024-01-15',
    status: 'earned',
    requirements: 'Compléter le module débutant avec 80% de réussite au quiz',
    credentialId: 'TRX-BF-2024-001',
    skills: ['Blockchain', 'Bitcoin', 'Portefeuilles crypto', 'Transactions']
  },
  {
    id: 'defi-specialist',
    title: 'Spécialiste DeFi',
    description: 'Maîtrise des protocoles de finance décentralisée',
    dateEarned: null,
    status: 'in-progress',
    requirements: 'Compléter le module intermédiaire et réussir le projet pratique',
    progress: 65,
    credentialId: 'TRX-DS-2024-002',
    skills: ['DeFi', 'Stablecoins', 'Yield Farming', 'Protocoles de prêt']
  },
  {
    id: 'security-expert',
    title: 'Expert en Sécurité Crypto',
    description: 'Certification en sécurité des actifs numériques',
    dateEarned: '2024-01-10',
    status: 'earned',
    requirements: 'Compléter le module sécurité avec 90% de réussite',
    credentialId: 'TRX-SE-2024-003',
    skills: ['Sécurité', 'Hardware Wallets', 'Détection des arnaques', 'Backup']
  },
  {
    id: 'trading-analyst',
    title: 'Analyste Trading Crypto',
    description: 'Expertise en analyse technique et stratégies de trading',
    dateEarned: null,
    status: 'locked',
    requirements: 'Compléter tous les modules précédents et le module avancé',
    progress: 15,
    credentialId: 'TRX-TA-2024-004',
    skills: ['Analyse technique', 'Gestion des risques', 'Stratégies', 'Psychologie']
  }
];

export function CertificateDisplay() {
  const { toast } = useToast();

  const handleDownload = (certificate: any) => {
    toast({
      title: "Certificat téléchargé",
      description: `Le certificat "${certificate.title}" a été téléchargé en PDF.`,
    });
  };

  const handleShare = (certificate: any) => {
    toast({
      title: "Lien partagé",
      description: "Le lien de vérification du certificat a été copié dans le presse-papier.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'earned':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">✓ Obtenu</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">En cours</Badge>;
      case 'locked':
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/30">🔒 Verrouillé</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <span>Mes certificats</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Vos certifications Terex Academy - Reconnues dans l'industrie crypto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <p className="text-2xl font-bold text-terex-accent">
                {certificates.filter(c => c.status === 'earned').length}
              </p>
              <p className="text-sm text-gray-400">Certificats obtenus</p>
            </div>
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <p className="text-2xl font-bold text-white">
                {certificates.filter(c => c.status === 'in-progress').length}
              </p>
              <p className="text-sm text-gray-400">En cours d'obtention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((certificate) => (
          <Card 
            key={certificate.id} 
            className={`border transition-all duration-200 ${
              certificate.status === 'earned' 
                ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                : certificate.status === 'in-progress'
                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30'
                : 'bg-terex-darker border-gray-500/30'
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Award className={`h-5 w-5 ${
                      certificate.status === 'earned' ? 'text-yellow-500' : 
                      certificate.status === 'in-progress' ? 'text-blue-500' : 'text-gray-500'
                    }`} />
                    <span>{certificate.title}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {certificate.description}
                  </CardDescription>
                </div>
                {getStatusBadge(certificate.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificate.dateEarned && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Obtenu le {formatDate(certificate.dateEarned)}</span>
                </div>
              )}

              {certificate.status === 'in-progress' && certificate.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progression</span>
                    <span className="text-white">{certificate.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${certificate.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Compétences validées :</p>
                <div className="flex flex-wrap gap-1">
                  {certificate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-terex-accent/10 text-terex-accent border-terex-accent/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Prérequis :</p>
                <p className="text-xs text-gray-300">{certificate.requirements}</p>
              </div>

              {certificate.status === 'earned' && (
                <div className="space-y-3 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    ID de certification : <span className="text-terex-accent font-mono">{certificate.credentialId}</span>
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(certificate)}
                      className="flex-1 bg-terex-accent hover:bg-terex-accent-light"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Télécharger
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleShare(certificate)}
                      className="flex-1 border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                    >
                      <Share2 className="mr-1 h-3 w-3" />
                      Partager
                    </Button>
                  </div>
                </div>
              )}

              {certificate.status === 'locked' && (
                <div className="p-3 bg-gray-500/10 rounded-lg">
                  <p className="text-xs text-gray-400 text-center">
                    🔒 Complétez les certifications précédentes pour débloquer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information sur la reconnaissance */}
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Reconnaissance de nos certificats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-gray-300">Reconnus par les principales plateformes d'échange</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-gray-300">Vérifiables via blockchain (certificats NFT)</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-gray-300">Partenariat avec des entreprises du secteur crypto</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-gray-300">Validés par des experts de l'industrie</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
