
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Globe, CreditCard, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnersPage = () => {
  const navigate = useNavigate();

  const bankingPartners = [
    {
      name: "Banque Atlantique",
      description: "Transferts vers l'Afrique de l'Ouest",
      countries: ["Sénégal", "Côte d'Ivoire", "Mali"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "UBA Group",
      description: "Réseau panafricain de référence",
      countries: ["Nigeria", "Ghana", "Cameroun"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "Ecobank",
      description: "Leader bancaire africain",
      countries: ["Burkina Faso", "Togo", "Bénin"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    }
  ];

  const cryptoPartners = [
    {
      name: "Binance",
      description: "Plateforme d'échange crypto mondiale",
      services: ["USDT/EUR", "P2P Trading"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "Coinbase",
      description: "Exchange institutionnel",
      services: ["Custody", "API Trading"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
    },
    {
      name: "Tether",
      description: "Émetteur officiel USDT",
      services: ["Réserves", "Audit"],
      logo: "/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
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
              <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <img src={partner.logo} alt={partner.name} className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-white">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{partner.description}</p>
                  <div className="space-y-2">
                    <p className="text-terex-accent font-medium">Pays desservis :</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.countries.map((country, idx) => (
                        <span key={idx} className="bg-terex-accent/20 text-terex-accent px-2 py-1 rounded text-sm">
                          {country}
                        </span>
                      ))}
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
              <Card key={index} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <img src={partner.logo} alt={partner.name} className="w-10 h-10" />
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
