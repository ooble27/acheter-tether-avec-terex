
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Globe, CreditCard, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnersPage = () => {
  const navigate = useNavigate();

  const bankingPartners = [
    {
      name: "Banque Atlantique",
      description: "Premier réseau bancaire de l'Afrique de l'Ouest avec plus de 140 agences",
      countries: ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Bénin", "Togo"],
      logo: "/partners/banque-atlantique-logo.png",
      features: ["Virements SWIFT", "Mobile Banking", "Cartes Visa", "Crédit commercial"],
      volume: "2.5M+ clients"
    },
    {
      name: "UBA Group",
      description: "United Bank for Africa - Leader panafricain présent dans 20 pays africains",
      countries: ["Nigeria", "Ghana", "Cameroun", "Sénégal", "Côte d'Ivoire", "Kenya"],
      logo: "/partners/uba-logo.png",
      features: ["UBA Mobile", "Leo AI Assistant", "Diaspora Banking", "Trade Finance"],
      volume: "25M+ clients"
    },
    {
      name: "Ecobank",
      description: "Première banque panafricaine avec présence dans 33 pays africains",
      countries: ["Burkina Faso", "Togo", "Bénin", "Ghana", "Nigeria", "Cameroun"],
      logo: "/partners/ecobank-logo.png",
      features: ["Rapidtransfer", "Xpresspoint", "Omni Lite", "Corporate Banking"],
      volume: "32M+ clients"
    }
  ];

  const cryptoPartners = [
    {
      name: "Binance",
      description: "Plus grande plateforme d'échange crypto au monde - Volume quotidien $76B+",
      services: ["USDT/EUR Trading", "P2P Marketplace", "Binance Pay", "Custody Solutions"],
      logo: "/partners/binance-logo.png",
      stats: "120M+ utilisateurs, 350+ cryptos"
    },
    {
      name: "Coinbase",
      description: "Plateforme institutionnelle leader basée aux États-Unis - Cotée NASDAQ",
      services: ["Professional Trading", "Custody", "Prime Services", "Coinbase Pay"],
      logo: "/partners/coinbase-logo.png",
      stats: "110M+ utilisateurs vérifiés"
    },
    {
      name: "Tether",
      description: "Émetteur officiel d'USDT - Première stablecoin mondiale par capitalisation",
      services: ["USDT Issuance", "Reserves Attestation", "Multi-chain Support", "Institutional API"],
      logo: "/partners/tether-logo.png",
      stats: "$120B+ de capitalisation"
    }
  ];

  const techPartners = [
    {
      name: "Chainalysis",
      description: "Conformité blockchain",
      services: ["AML/KYC", "Surveillance"],
      icon: Shield
    },
    {
      name: "Sumsub",
      description: "Vérification d'identité",
      services: ["KYC", "Détection fraude"],
      icon: CheckCircle
    },
    {
      name: "Plaid",
      description: "Connectivité bancaire",
      services: ["Open Banking", "Verification"],
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <div className="bg-terex-darker border-b border-terex-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Nos <span className="text-terex-accent">Partenaires</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Terex collabore avec les leaders mondiaux de la finance, de la crypto et de la technologie 
              pour vous offrir les meilleurs services de change et de transfert.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Partenaires Bancaires */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Building className="w-12 h-12 text-terex-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Partenaires Bancaires</h2>
            <p className="text-gray-300 text-lg">
              Réseau bancaire panafricain pour vos transferts d'argent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bankingPartners.map((partner, index) => (
              <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-terex-accent/10">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center p-2 shadow-lg">
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                  </div>
                  <CardTitle className="text-white text-xl">{partner.name}</CardTitle>
                  <p className="text-terex-accent font-medium text-sm">{partner.volume}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">{partner.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-terex-accent font-medium mb-2">Pays desservis :</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.countries.map((country, idx) => (
                          <span key={idx} className="bg-terex-accent/20 text-terex-accent px-3 py-1 rounded-full text-sm font-medium">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white font-medium mb-2">Services :</p>
                      <div className="grid grid-cols-2 gap-2">
                        {partner.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-terex-accent rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partenaires Crypto */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Globe className="w-12 h-12 text-terex-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Partenaires Crypto</h2>
            <p className="text-gray-300 text-lg">
              Collaborations avec les plus grandes plateformes crypto mondiales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cryptoPartners.map((partner, index) => (
              <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-terex-accent/10">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-xl mx-auto mb-4 flex items-center justify-center p-2">
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                  </div>
                  <CardTitle className="text-white text-xl">{partner.name}</CardTitle>
                  <p className="text-terex-accent font-medium text-sm">{partner.stats}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">{partner.description}</p>
                  <div className="space-y-3">
                    <p className="text-white font-medium">Services intégrés :</p>
                    <div className="grid grid-cols-1 gap-2">
                      {partner.services.map((service, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 text-sm bg-terex-gray/30 rounded-lg px-3 py-2">
                          <div className="w-2 h-2 bg-terex-accent rounded-full mr-3"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partenaires Technologiques */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-terex-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Partenaires Technologiques</h2>
            <p className="text-gray-300 text-lg">
              Technologies de pointe pour la sécurité et la conformité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techPartners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-terex-accent" />
                    </div>
                    <CardTitle className="text-white">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{partner.description}</p>
                    <div className="space-y-2">
                      <p className="text-terex-accent font-medium">Services :</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.map((service, idx) => (
                          <span key={idx} className="bg-terex-accent/20 text-terex-accent px-2 py-1 rounded text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 border-terex-accent/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Intéressé par un partenariat ?
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Rejoignez notre écosystème et développons ensemble l'avenir des échanges crypto-fiat en Afrique.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-8 py-3 text-lg"
              >
                Nous Contacter
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PartnersPage;
