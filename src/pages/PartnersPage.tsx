import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Wallet, CreditCard, Globe, Shield, Star } from 'lucide-react';

export default function PartnersPage() {
  const navigate = useNavigate();

  const bankPartners = [
    {
      name: "Ecobank",
      logo: "/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png",
      description: "Leader bancaire en Afrique de l'Ouest",
      services: ["Virements", "Mobile Money", "Cartes"],
      countries: ["Sénégal", "Mali", "Burkina Faso", "Côte d'Ivoire"]
    },
    {
      name: "Orange Money",
      logo: "/lovable-uploads/52b82a09-1493-4fdf-8589-0e3497357f07.png",
      description: "Solution de paiement mobile de référence",
      services: ["Transferts", "Paiements", "Retraits"],
      countries: ["14 pays d'Afrique"]
    },
    {
      name: "Wave",
      logo: "/lovable-uploads/6399d0b4-abb9-4b62-97ad-516c0213a601.png",
      description: "Fintech moderne pour l'Afrique",
      services: ["Transferts rapides", "Faibles frais"],
      countries: ["Sénégal", "Mali", "Burkina Faso"]
    }
  ];

  const walletPartners = [
    {
      name: "Binance",
      description: "Plus grande plateforme d'échange crypto mondiale",
      integration: "API directe",
      features: ["Trading", "P2P", "Custody"]
    },
    {
      name: "Trust Wallet",
      description: "Portefeuille mobile sécurisé",
      integration: "WalletConnect",
      features: ["Multi-crypto", "DeFi", "NFTs"]
    },
    {
      name: "MetaMask",
      description: "Portefeuille Ethereum leader",
      integration: "Web3",
      features: ["DeFi", "Swaps", "dApps"]
    }
  ];

  const techPartners = [
    {
      name: "Supabase",
      description: "Backend-as-a-Service",
      role: "Infrastructure base de données"
    },
    {
      name: "Lovable",
      description: "Plateforme de développement IA",
      role: "Développement application"
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                  alt="Terex Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-xl font-bold text-white">Terex</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Nos <span className="text-terex-accent">Partenaires</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Terex collabore avec les leaders du secteur financier pour vous offrir les meilleures solutions d'échange et de transfert.
          </p>
        </div>

        {/* Partenaires Bancaires */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-8 h-8 text-terex-accent" />
            <h2 className="text-3xl font-bold text-white">Partenaires Bancaires</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankPartners.map((partner, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{partner.name}</CardTitle>
                    <img src={partner.logo} alt={partner.name} className="w-12 h-12 rounded-lg" />
                  </div>
                  <p className="text-gray-400">{partner.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-terex-accent font-semibold mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-terex-accent/20 text-terex-accent">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-terex-accent font-semibold mb-2">Disponible</h4>
                    <p className="text-gray-300 text-sm">{partner.countries.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partenaires Wallets */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="w-8 h-8 text-terex-accent" />
            <h2 className="text-3xl font-bold text-white">Portefeuilles Crypto</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walletPartners.map((partner, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30 hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{partner.name}</CardTitle>
                  <p className="text-gray-400">{partner.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-terex-accent font-semibold mb-2">Intégration</h4>
                    <Badge variant="outline" className="border-terex-accent text-terex-accent">
                      {partner.integration}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-terex-accent font-semibold mb-2">Fonctionnalités</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-terex-accent/20 text-terex-accent">
                          {feature}
                        </Badge>
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
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-terex-accent" />
            <h2 className="text-3xl font-bold text-white">Partenaires Technologiques</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techPartners.map((partner, index) => (
              <Card key={index} className="bg-terex-darker border-terex-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{partner.name}</h3>
                      <p className="text-gray-400 mb-3">{partner.description}</p>
                      <p className="text-terex-accent font-medium">{partner.role}</p>
                    </div>
                    <Star className="w-6 h-6 text-terex-accent" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-2xl p-8 border border-terex-accent/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Envie de devenir partenaire ?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Rejoignez notre écosystème et développons ensemble l'avenir des paiements en Afrique.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold"
            >
              Nous contacter
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}