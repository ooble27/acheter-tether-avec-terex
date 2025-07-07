
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpCircle, Search, ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const FAQPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

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

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Général",
      questions: [
        {
          question: "Qu'est-ce que Terex ?",
          answer: "Terex est une plateforme d'échange crypto-fiat leader en Afrique qui permet d'acheter et vendre des USDT contre des devises locales africaines en toute sécurité."
        },
        {
          question: "Dans quels pays Terex est-il disponible ?",
          answer: "Terex est actuellement disponible dans 15+ pays africains incluant le Sénégal, la Côte d'Ivoire, le Mali, le Burkina Faso, et continue d'étendre sa couverture."
        },
        {
          question: "Comment Terex assure-t-il la sécurité des transactions ?",
          answer: "Nous utilisons un système de vérification KYC/AML, des portefeuilles multi-signatures, et nous sommes régulés par les autorités financières locales."
        }
      ]
    },
    {
      title: "Achat & Vente",
      questions: [
        {
          question: "Comment acheter des USDT sur Terex ?",
          answer: "Créez un compte, complétez votre vérification KYC, choisissez le montant d'USDT à acheter, sélectionnez votre méthode de paiement et suivez les instructions."
        },
        {
          question: "Quels sont les frais de transaction ?",
          answer: "Nos frais sont transparents : 1.5% pour l'achat d'USDT, 1.2% pour la vente, et des frais de réseau variables selon la blockchain utilisée."
        },
        {
          question: "Combien de temps prennent les transactions ?",
          answer: "Les achats sont généralement traités en 5-15 minutes après confirmation du paiement. Les ventes peuvent prendre 10-30 minutes selon la méthode de retrait."
        }
      ]
    },
    {
      title: "Vérification & Sécurité",
      questions: [
        {
          question: "Pourquoi dois-je compléter la vérification KYC ?",
          answer: "La vérification KYC est obligatoire pour respecter les réglementations financières et assurer la sécurité de tous les utilisateurs de la plateforme."
        },
        {
          question: "Quels documents sont requis pour le KYC ?",
          answer: "Vous devez fournir une pièce d'identité valide (passeport ou carte d'identité), un justificatif de domicile récent, et prendre un selfie."
        },
        {
          question: "Que faire si ma vérification KYC est rejetée ?",
          answer: "Contactez notre support avec des documents plus clairs. Notre équipe vous guidera pour résoudre les problèmes et finaliser votre vérification."
        }
      ]
    },
    {
      title: "Paiements & Retraits",
      questions: [
        {
          question: "Quelles méthodes de paiement acceptez-vous ?",
          answer: "Nous acceptons les virements bancaires, Mobile Money (Orange Money, MTN Money, Moov Money), et les cartes bancaires selon votre pays."
        },
        {
          question: "Y a-t-il des limites de transaction ?",
          answer: "Oui, les limites varient selon votre niveau de vérification : 500€/jour pour les comptes basiques, 5000€/jour pour les comptes vérifiés."
        },
        {
          question: "Comment retirer mes fonds ?",
          answer: "Allez dans votre portefeuille, sélectionnez 'Retirer', choisissez votre méthode (banque ou Mobile Money), entrez le montant et confirmez."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <HelpCircle className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Questions Fréquentes</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Foire Aux <span className="text-terex-accent">Questions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Trouvez rapidement les réponses à vos questions sur Terex et les échanges crypto-fiat.
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="relative max-w-2xl w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-terex-darker border-terex-accent/30 text-white placeholder:text-gray-400 pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-terex-accent/20">
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 100 + index;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 overflow-hidden">
                      <Collapsible open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
                        <CollapsibleTrigger className="w-full p-6 text-left hover:bg-terex-accent/5 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                            <ChevronDown className={`w-5 h-5 text-terex-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-6 pb-6">
                          <div className="pt-4 border-t border-terex-gray/30">
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-400 mb-6">Essayez avec d'autres mots-clés ou contactez notre support.</p>
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
              >
                Contacter le Support
              </Button>
            </div>
          )}

          {/* Contact Support Section */}
          <div className="mt-16 pt-12 border-t border-terex-accent/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Vous ne trouvez pas votre réponse ?</h3>
              <p className="text-gray-300 mb-8">Notre équipe de support est là pour vous aider 24/7</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Button 
                  onClick={() => navigate('/contact')}
                  variant="outline" 
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent hover:text-black h-16"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat en Direct
                </Button>
                <Button 
                  variant="outline" 
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent hover:text-black h-16"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </Button>
                <Button 
                  variant="outline" 
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent hover:text-black h-16"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  +221 77 123 4567
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default FAQPage;
