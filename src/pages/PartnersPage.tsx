import { Button } from '@/components/ui/button';
import { Shield, Globe, CreditCard, Building, ArrowRight, CheckCircle, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FooterSection } from '@/components/marketing/sections/FooterSection';

const PartnersPage = () => {
  const navigate = useNavigate();

  const bankingPartners = [
    {
      name: "Banque Atlantique",
      description: "Premier réseau bancaire de l'Afrique de l'Ouest avec plus de 140 agences dans 7 pays",
      countries: ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Bénin", "Togo"],
      logo: "/partners/banque-atlantique-logo.png",
      features: ["Virements SWIFT", "Mobile Banking", "Cartes Visa", "Crédit commercial"],
      volume: "2.5M+ clients",
      established: "1978",
      rating: 4.8
    },
    {
      name: "UBA Group",
      description: "United Bank for Africa - Leader panafricain présent dans 20 pays africains avec une forte présence digitale",
      countries: ["Nigeria", "Ghana", "Cameroun", "Sénégal", "Côte d'Ivoire", "Kenya"],
      logo: "/partners/uba-logo.png",
      features: ["UBA Mobile", "Leo AI Assistant", "Diaspora Banking", "Trade Finance"],
      volume: "25M+ clients",
      established: "1961",
      rating: 4.9
    },
    {
      name: "Ecobank",
      description: "Première banque panafricaine avec présence dans 33 pays africains et solutions fintech innovantes",
      countries: ["Burkina Faso", "Togo", "Bénin", "Ghana", "Nigeria", "Cameroun"],
      logo: "/partners/ecobank-logo.png",
      features: ["Rapidtransfer", "Xpresspoint", "Omni Lite", "Corporate Banking"],
      volume: "32M+ clients",
      established: "1985",
      rating: 4.7
    }
  ];

  const cryptoPartners = [
    {
      name: "Binance",
      description: "Plus grande plateforme d'échange crypto au monde avec un volume quotidien dépassant $76 milliards",
      services: ["USDT/EUR Trading", "P2P Marketplace", "Binance Pay", "Custody Solutions", "Futures Trading"],
      logo: "/partners/binance-logo.png",
      stats: "120M+ utilisateurs, 350+ cryptos",
      founded: "2017",
      security: "SAFU Insurance Fund",
      volume: "$76B+ daily"
    },
    {
      name: "Coinbase",
      description: "Plateforme institutionnelle leader basée aux États-Unis, cotée au NASDAQ avec licence complète",
      services: ["Professional Trading", "Custody", "Prime Services", "Coinbase Pay", "Institutional Services"],
      logo: "/partners/coinbase-logo.png",
      stats: "110M+ utilisateurs vérifiés",
      founded: "2012",
      security: "FDIC Insurance",
      volume: "$217B+ in assets"
    },
    {
      name: "Tether",
      description: "Émetteur officiel d'USDT, première stablecoin mondiale par capitalisation avec réserves auditées",
      services: ["USDT Issuance", "Reserves Attestation", "Multi-chain Support", "Institutional API", "Treasury Management"],
      logo: "/partners/tether-logo.png",
      stats: "$120B+ de capitalisation",
      founded: "2014",
      security: "Monthly Attestations",
      volume: "Leader stablecoin market"
    }
  ];

  const techPartners = [
    {
      name: "Chainalysis",
      description: "Leader mondial de l'analyse blockchain et solutions de conformité crypto",
      services: ["AML Compliance", "Transaction Monitoring", "Sanctions Screening", "Investigation Tools"],
      icon: Shield,
      partnership: "Surveillance transactions"
    },
    {
      name: "Sumsub",
      description: "Plateforme de vérification d'identité et KYC avec IA avancée",
      services: ["Identity Verification", "Document Analysis", "Biometric Checks", "Fraud Detection"],
      icon: CheckCircle,
      partnership: "Vérification KYC"
    },
    {
      name: "Plaid",
      description: "Infrastructure API pour connectivité bancaire et services financiers",
      services: ["Account Linking", "Balance Verification", "Payment Initiation", "Transaction Data"],
      icon: Building,
      partnership: "Connectivité bancaire"
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Hero Section - Dynamic gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/10 via-transparent to-terex-accent/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-terex-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/6 w-96 h-96 bg-terex-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-terex-accent/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <Globe className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Réseau Mondial de Partenaires</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Nos <span className="text-terex-accent">Partenaires</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Terex collabore avec les leaders mondiaux de la finance, de la crypto et de la technologie 
              pour vous offrir les meilleurs services de change et de transfert, partout en Afrique.
            </p>
            
            {/* Partnership stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">50+</div>
                <div className="text-gray-400">Partenaires Actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">25+</div>
                <div className="text-gray-400">Pays Couverts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Réseau</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banking Partners - Asymmetric Layout */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-16">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-2xl flex items-center justify-center">
                <Building className="w-8 h-8 text-terex-accent" />
              </div>
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-bold text-white mb-2">Partenaires Bancaires</h2>
              <p className="text-gray-300 text-lg">Réseau bancaire panafricain pour vos transferts d'argent</p>
            </div>
          </div>
          
          <div className="space-y-12">
            {bankingPartners.map((partner, index) => (
              <div key={index} className={`grid lg:grid-cols-5 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:col-start-4' : ''}`}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-accent/20 group-hover:border-terex-accent/50 transition-all duration-500">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-white rounded-xl p-2 mr-4 flex items-center justify-center">
                          <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{partner.name}</h3>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-yellow-400 font-medium">{partner.rating}</span>
                            <span className="text-gray-400 ml-2">• Depuis {partner.established}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-terex-accent font-bold text-lg mb-2">{partner.volume}</div>
                    </div>
                  </div>
                </div>
                
                <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">{partner.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Pays desservis :</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.countries.map((country, idx) => (
                        <span key={idx} className="bg-terex-accent/20 text-terex-accent px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Services intégrés :</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {partner.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-terex-accent mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crypto Partners - Hexagonal Layout */}
      <div className="py-24 bg-gradient-to-b from-terex-darker to-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-6 border border-terex-accent/20">
              <Zap className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Écosystème Crypto</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Partenaires Crypto</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Collaborations avec les plus grandes plateformes crypto mondiales pour une liquidité optimale
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {cryptoPartners.map((partner, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-terex-darker rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50 transition-all duration-500">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl mx-auto mb-4 p-3 group-hover:scale-110 transition-transform duration-300">
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{partner.name}</h3>
                    <p className="text-terex-accent font-medium">{partner.stats}</p>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{partner.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Fondé:</span>
                      <span className="text-white font-medium">{partner.founded}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Sécurité:</span>
                      <span className="text-green-400 font-medium">{partner.security}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-terex-accent font-medium">{partner.volume}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Services intégrés :</h4>
                    <div className="space-y-2">
                      {partner.services.map((service, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 text-sm bg-terex-gray/20 rounded-lg px-3 py-2 hover:bg-terex-accent/10 transition-colors duration-200">
                          <div className="w-2 h-2 bg-terex-accent rounded-full mr-3 flex-shrink-0"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Partners - Flowing layout */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Partenaires Technologiques</h2>
              <p className="text-gray-300 text-lg">Technologies de pointe pour la sécurité et la conformité</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-terex-accent" />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {techPartners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/10 to-transparent rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-accent/20 group-hover:border-terex-accent/50 transition-all duration-500 transform group-hover:-rotate-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-xl flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-terex-accent" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">{partner.name}</h3>
                        <p className="text-terex-accent text-sm font-medium">{partner.partnership}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">{partner.description}</p>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-3">Solutions :</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.map((service, idx) => (
                          <span key={idx} className="bg-terex-accent/20 text-terex-accent px-3 py-1 rounded-full text-xs font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partnership Benefits Section */}
      <div className="py-24 bg-gradient-to-r from-terex-accent/5 via-transparent to-terex-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Pourquoi Nos Partenaires Nous Font Confiance</h2>
            <p className="text-gray-300 text-lg">Des relations durables basées sur l'excellence et l'innovation</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Sécurité Maximale", desc: "Protocoles de sécurité stricts et audits réguliers" },
              { icon: Zap, title: "Innovation Continue", desc: "Technologies de pointe et développement agile" },
              { icon: Globe, title: "Portée Mondiale", desc: "Réseau étendu couvrant l'Afrique et au-delà" },
              { icon: Star, title: "Excellence Opérationnelle", desc: "99.9% uptime et support 24/7" }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-terex-accent" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker border-t border-terex-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-6 border border-terex-accent/20">
              <ArrowRight className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Rejoignez Notre Écosystème</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Intéressé par un partenariat ?
            </h3>
            <p className="text-gray-300 mb-8 text-xl leading-relaxed">
              Rejoignez notre écosystème et développons ensemble l'avenir des échanges crypto-fiat en Afrique. 
              Nos équipes partenariats sont à votre disposition.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-12 py-4 text-lg rounded-xl"
            >
              Nous Contacter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/about')}
              variant="outline"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent/10 px-12 py-4 text-lg rounded-xl"
            >
              En Savoir Plus
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default PartnersPage;