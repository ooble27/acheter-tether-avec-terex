
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, TrendingUp, Globe, Shield, Users, Target, ChevronRight } from "lucide-react";
import { useInvestorDocuments } from '@/hooks/useInvestorDocuments';
import { DocumentPreviewModal } from '@/components/features/investor-documents/DocumentPreviewModal';

const InvestorsPage = () => {
  const { 
    isGenerating, 
    previewDocument, 
    downloadDocument, 
    openPreview, 
    closePreview 
  } = useInvestorDocuments();

  return (
    <div className="min-h-screen bg-terex-dark text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-dark via-terex-gray to-terex-dark">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center bg-terex-accent/10 border border-terex-accent/20 rounded-full px-6 py-2">
              <TrendingUp className="w-4 h-4 mr-2 text-terex-accent" />
              <span className="text-terex-accent text-sm font-medium">Opportunité d'investissement</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Révolutionner les
              <span className="text-terex-accent"> transferts d'argent</span>
              <br />en Afrique
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Terex transforme l'écosystème financier africain en rendant les transferts internationaux 
              instantanés, abordables et sécurisés grâce à la technologie USDT.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-terex-accent hover:bg-terex-accent/90 text-white px-8 py-4 text-lg"
                onClick={() => openPreview('pitch-deck')}
              >
                <FileText className="w-5 h-5 mr-2" />
                Voir le Pitch Deck
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white px-8 py-4 text-lg"
              >
                Planifier un Rendez-vous
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <Card className="bg-terex-card border-terex-border">
            <CardContent className="p-6 text-center">
              <Globe className="w-12 h-12 text-terex-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$95B</div>
              <p className="text-gray-400">Marché total des transferts en Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-card border-terex-border">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-terex-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">400M</div>
              <p className="text-gray-400">Adultes potentiellement adressables</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-card border-terex-border">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-terex-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <p className="text-gray-400">Réduction des frais de transfert</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-card border-terex-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-terex-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">8.5%</div>
              <p className="text-gray-400">Croissance annuelle du marché</p>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi investir dans <span className="text-terex-accent">Terex</span> ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une opportunité unique de participer à la révolution fintech en Afrique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-terex-card border-terex-border">
              <CardContent className="p-8">
                <Shield className="w-16 h-16 text-terex-accent mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Marché sous-exploité</h3>
                <p className="text-gray-400 leading-relaxed">
                  Les solutions existantes facturent 8-15% de frais et prennent plusieurs jours. 
                  Nous réduisons cela à moins de 2% avec des transferts instantanés.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-card border-terex-border">
              <CardContent className="p-8">
                <Globe className="w-16 h-16 text-terex-accent mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Équipe locale experte</h3>
                <p className="text-gray-400 leading-relaxed">
                  Notre équipe possède plus de 30 ans d'expérience combinée dans la fintech 
                  africaine et comprend parfaitement les défis locaux.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-card border-terex-border">
              <CardContent className="p-8">
                <TrendingUp className="w-16 h-16 text-terex-accent mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Croissance prouvée</h3>
                <p className="text-gray-400 leading-relaxed">
                  15K+ utilisateurs actifs et $2.3M de volume mensuel en moins d'un an, 
                  avec 95% de satisfaction client.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investment Opportunity */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-terex-card to-terex-gray border-terex-accent/20">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Levée de fonds <span className="text-terex-accent">$2M</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Rejoignez notre Série A pour accélérer notre expansion à travers l'Afrique 
                  et capturer une part significative de ce marché en croissance rapide.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-terex-accent mb-2">40%</div>
                    <p className="text-sm text-gray-400">Développement produit</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-terex-accent mb-2">30%</div>
                    <p className="text-sm text-gray-400">Expansion géographique</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-terex-accent mb-2">20%</div>
                    <p className="text-sm text-gray-400">Marketing & Acquisition</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-terex-accent mb-2">10%</div>
                    <p className="text-sm text-gray-400">Conformité & Licences</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Documents <span className="text-terex-accent">investisseurs</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Téléchargez notre documentation complète pour en savoir plus sur Terex et l'opportunité d'investissement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-terex-card border-terex-border hover:border-terex-accent/50 transition-colors">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-terex-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Pitch Deck</h3>
                <p className="text-gray-400 mb-6">
                  Présentation complète de Terex, notre vision, modèle économique et opportunité d'investissement
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-terex-accent hover:bg-terex-accent/90"
                    onClick={() => openPreview('pitch-deck')}
                  >
                    Prévisualiser
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
                    onClick={() => downloadDocument('pitch-deck')}
                    disabled={isGenerating}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Génération...' : 'Télécharger PDF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-card border-terex-border hover:border-terex-accent/50 transition-colors">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-terex-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Projections Financières</h3>
                <p className="text-gray-400 mb-6">
                  Prévisions détaillées 2024-2027 avec analyse de croissance et projections de revenus
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-terex-accent hover:bg-terex-accent/90"
                    onClick={() => openPreview('financial-projections')}
                  >
                    Prévisualiser
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
                    onClick={() => downloadDocument('financial-projections')}
                    disabled={isGenerating}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Génération...' : 'Télécharger Excel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-card border-terex-border hover:border-terex-accent/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Globe className="w-16 h-16 text-terex-accent mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Étude de Marché</h3>
                <p className="text-gray-400 mb-6">
                  Analyse complète du marché des transferts en Afrique et opportunités de croissance
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-terex-accent hover:bg-terex-accent/90"
                    onClick={() => openPreview('market-study')}
                  >
                    Prévisualiser
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
                    onClick={() => downloadDocument('market-study')}
                    disabled={isGenerating}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Génération...' : 'Télécharger PDF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/20 border-terex-accent/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Prêt à investir dans l'avenir ?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Contactez notre équipe pour discuter des opportunités d'investissement et planifier une présentation personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-terex-accent hover:bg-terex-accent/90 text-white px-8 py-4"
                >
                  Contacter l'équipe
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white px-8 py-4"
                >
                  Planifier une démo
                </Button>
              </div>
              <div className="mt-8 text-gray-400">
                <p>Email: invest@terex.sn | Téléphone: +221 77 397 27 49</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewDocument !== null}
        onClose={closePreview}
        documentType={previewDocument}
        onDownload={downloadDocument}
        isDownloading={isGenerating}
      />
    </div>
  );
};

export default InvestorsPage;
