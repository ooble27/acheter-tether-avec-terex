
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MessageCircle, ArrowLeft, User, ShoppingCart, Shield, DollarSign, HelpCircle, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const FAQPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<{question: string, answer: string, category: string} | null>(null);

  const faqCategories = [
    {
      id: 'demarrage',
      title: 'Démarrage et Compte',
      icon: User,
      description: 'Création de compte, vérification KYC',
    },
    {
      id: 'achat',
      title: 'Achat d\'USDT',
      icon: ShoppingCart,
      description: 'Comment acheter des cryptomonnaies',
    },
    {
      id: 'vente',
      title: 'Vente d\'USDT',
      icon: DollarSign,
      description: 'Vendre vos cryptomonnaies',
    },
    {
      id: 'transferts',
      title: 'Transferts Internationaux',
      icon: Globe,
      description: 'Envoyer de l\'argent à l\'étranger',
    },
    {
      id: 'securite',
      title: 'Sécurité et Conformité',
      icon: Shield,
      description: 'Protection de vos données et fonds',
    },
    {
      id: 'support',
      title: 'Support et Assistance',
      icon: HelpCircle,
      description: 'Contactez notre équipe',
    },
  ];

  const faqSections = [
    {
      id: 'demarrage',
      title: "Démarrage et Compte",
      icon: "👤",
      faqs: [
        {
          question: "Qu'est-ce que Terex et comment ça marche ?",
          answer: "Terex est la première plateforme d'échange crypto-fiat dédiée à l'Afrique francophone. Nous permettons d'acheter, vendre et transférer des cryptomonnaies (principalement USDT) en utilisant les monnaies locales (CFA). Notre plateforme connecte les écosystèmes financiers traditionnels aux marchés des cryptomonnaies avec des délais ultra-rapides de 5 minutes maximum."
        },
        {
          question: "Comment créer un compte sur Terex ?",
          answer: "Pour créer votre compte : 1) Cliquez sur 'S'inscrire' et entrez votre email et mot de passe, 2) Vérifiez votre email via le lien reçu, 3) Complétez votre profil avec vos informations personnelles, 4) Soumettez vos documents KYC pour la vérification d'identité. L'inscription est gratuite et prend moins de 10 minutes."
        },
        {
          question: "Qu'est-ce que la vérification KYC et pourquoi est-elle nécessaire ?",
          answer: "KYC (Know Your Customer) est un processus de vérification d'identité obligatoire pour respecter les réglementations financières. Vous devez fournir : une pièce d'identité valide (passeport, CNI), un justificatif de domicile récent, et un selfie pour vérification. Cette étape garantit la sécurité de tous les utilisateurs et permet d'accéder à toutes les fonctionnalités de la plateforme."
        },
        {
          question: "Combien de temps prend la vérification KYC ?",
          answer: "La vérification KYC prend généralement 24-48 heures ouvrables. Nos équipes examinent manuellement chaque dossier pour garantir la sécurité. Vous recevrez un email de confirmation une fois votre compte vérifié. En cas de documents manquants ou illisibles, nous vous contacterons pour compléter votre dossier."
        },
        {
          question: "Puis-je utiliser Terex sans vérification KYC ?",
          answer: "Oui, vous pouvez désormais utiliser Terex sans vérification KYC ! Nous avons simplifié notre processus pour vous permettre de commencer à effectuer des transactions immédiatement. Cependant, la vérification KYC reste recommandée pour débloquer des limites de transaction plus élevées et accéder à des fonctionnalités premium."
        }
      ]
    },
    {
      id: 'achat',
      title: "Achat d'USDT",
      icon: "💰",
      faqs: [
        {
          question: "Comment acheter des USDT sur Terex ?",
          answer: "Pour acheter des USDT : 1) Allez dans 'Acheter USDT', 2) Choisissez votre devise (CFA ou CAD), 3) Entrez le montant désiré, 4) Sélectionnez votre réseau blockchain (TRC20, BEP20, ERC20, Arbitrum, Polygon), 5) Fournissez votre adresse USDT de réception, 6) Choisissez votre méthode de paiement (Mobile Money, carte bancaire), 7) Suivez les instructions de paiement. Vos USDT sont livrés sous 5 minutes."
        },
        {
          question: "Quels sont les montants minimum et maximum pour acheter des USDT ?",
          answer: "Montant minimum : 50,000 CFA (environ 76€) ou 100 CAD pour Mobile Money et carte bancaire. Montants maximum : 2,000,000 CFA (3,050€) par transaction pour les comptes non vérifiés, jusqu'à 10,000,000 CFA (15,250€) pour les comptes KYC vérifiés. Pas de limite mensuelle pour les utilisateurs vérifiés."
        },
        {
          question: "Quels réseaux blockchain sont supportés ?",
          answer: "Nous supportons 5 réseaux principaux : TRC20 (Tron) - le plus économique, BEP20 (Binance Smart Chain) - rapide et peu cher, ERC20 (Ethereum) - le plus sécurisé mais plus cher, Arbitrum - Ethereum Layer 2 économique, Polygon - rapide et économique. Choisissez selon votre wallet et vos préférences de frais."
        },
        {
          question: "Quelles méthodes de paiement acceptez-vous ?",
          answer: "Nous acceptons : Mobile Money (Orange Money, Free Money, Wave, Moov Money) dans tous les pays CFA, cartes bancaires Visa/Mastercard, virements bancaires locaux, et paiements par QR code. Chaque méthode a ses propres délais : Mobile Money (instantané), cartes (1-3 minutes), virements (5-15 minutes)."
        },
        {
          question: "Comment fonctionne le taux de change ?",
          answer: "Nos taux sont mis à jour en temps réel et incluent tous les frais (réseau blockchain, traitement). Nous affichons toujours le taux final que vous payez, sans frais cachés. Le taux est bloqué pendant 15 minutes une fois votre commande créée, vous protégeant des fluctuations du marché pendant le paiement."
        },
        {
          question: "Que faire si je n'ai pas reçu mes USDT ?",
          answer: "Si vous n'avez pas reçu vos USDT après 10 minutes : 1) Vérifiez que vous avez payé le montant exact, 2) Confirmez que votre adresse USDT est correcte, 3) Vérifiez le bon réseau dans votre wallet, 4) Contactez notre support avec votre référence de transaction. Notre équipe résout 99% des problèmes en moins de 30 minutes."
        }
      ]
    },
    {
      id: 'vente',
      title: "Vente d'USDT",
      icon: "💸",
      faqs: [
        {
          question: "Comment vendre mes USDT sur Terex ?",
          answer: "Pour vendre vos USDT : 1) Allez dans 'Vendre USDT', 2) Entrez le montant d'USDT à vendre, 3) Choisissez votre réseau d'envoi, 4) Sélectionnez votre méthode de réception (Orange Money, Wave, compte bancaire), 5) Fournissez vos informations de réception, 6) Envoyez vos USDT à l'adresse fournie, 7) Recevez votre paiement sous 5 minutes après confirmation blockchain."
        },
        {
          question: "Y a-t-il un montant minimum pour vendre des USDT ?",
          answer: "Il n'y a pas de montant minimum pour vendre des USDT, mais nous recommandons au moins 20 USDT pour rentabiliser les frais de réseau blockchain. Le montant maximum dépend de votre niveau de vérification : 1,000 USDT/jour pour les comptes standards, 5,000 USDT/jour pour les comptes premium vérifiés."
        },
        {
          question: "Combien de temps prend une vente d'USDT ?",
          answer: "Une vente d'USDT prend 5-15 minutes au total : 1-3 minutes pour la confirmation blockchain (dépend du réseau), 2-5 minutes pour notre traitement interne, envoi immédiat vers votre compte Mobile Money ou bancaire. Les ventes via TRC20 sont généralement les plus rapides."
        },
        {
          question: "Comment sont calculés les taux de vente ?",
          answer: "Nos taux de vente sont basés sur les prix du marché international avec une marge compétitive. Le taux affiché inclut tous les frais et correspond exactement à ce que vous recevrez en CFA ou CAD. Nous garantissons des taux parmi les meilleurs du marché africain."
        },
        {
          question: "Puis-je annuler une vente d'USDT ?",
          answer: "Une fois que vous avez envoyé vos USDT à notre adresse, la transaction ne peut plus être annulée car elle est enregistrée sur la blockchain. Vérifiez toujours soigneusement toutes les informations avant d'envoyer. En cas d'erreur dans vos coordonnées de réception, contactez immédiatement notre support."
        }
      ]
    },
    {
      id: 'transferts',
      title: "Transferts Internationaux",
      icon: "🌍",
      faqs: [
        {
          question: "Vers quels pays puis-je envoyer de l'argent ?",
          answer: "Nous couvrons 5 pays d'Afrique de l'Ouest : Sénégal, Côte d'Ivoire, Mali, Burkina Faso et Niger via Mobile Money (Orange Money, Wave, Free Money). Nous ajoutons régulièrement de nouveaux pays et méthodes de réception selon la demande de nos utilisateurs."
        },
        {
          question: "Comment effectuer un transfert international ?",
          answer: "Pour envoyer de l'argent : 1) Allez dans 'Transfert International', 2) Choisissez le pays de destination, 3) Entrez le montant à envoyer, 4) Sélectionnez la méthode de réception, 5) Remplissez les informations du bénéficiaire, 6) Payez par Mobile Money ou carte, 7) Le bénéficiaire reçoit l'argent sous 10 minutes."
        },
        {
          question: "Quels sont les frais de transfert international ?",
          answer: "Nos frais sont transparents et compétitifs : 2-3% du montant envoyé (selon le corridor), montant minimum de 10 CAD ou 7,000 CFA. Pas de frais cachés, le montant affiché inclut tous les coûts. Nous sommes jusqu'à 5x moins chers que Western Union ou MoneyGram."
        },
        {
          question: "Combien de temps prend un transfert international ?",
          answer: "Nos transferts sont ultra-rapides : 5-10 minutes vers Mobile Money en Afrique de l'Ouest. 95% de nos transferts sont complétés en moins de 15 minutes. Vous recevez des notifications en temps réel à chaque étape."
        },
        {
          question: "Le bénéficiaire doit-il avoir un compte Terex ?",
          answer: "Non, le bénéficiaire n'a pas besoin de compte Terex. Il suffit qu'il ait un compte Mobile Money (Orange Money, Wave, Free Money) dans l'un de nos pays couverts. Il recevra l'argent directement sur son compte existant avec une notification SMS."
        },
        {
          question: "Puis-je suivre mon transfert en temps réel ?",
          answer: "Oui, vous pouvez suivre votre transfert en temps réel via : votre tableau de bord Terex, SMS de confirmation à chaque étape, email de notification, numéro de référence unique pour le suivi. Vous et le bénéficiaire recevez des notifications instantanées."
        }
      ]
    },
    {
      id: 'securite',
      title: "Sécurité et Conformité",
      icon: "🔒",
      faqs: [
        {
          question: "Comment Terex protège-t-il mes fonds et données ?",
          answer: "Nous utilisons un système de sécurité multi-niveaux : chiffrement SSL/TLS 256-bit, stockage des cryptos dans des wallets multi-signatures, authentification à 2 facteurs (2FA), surveillance 24/7 des transactions suspectes, conformité aux normes bancaires internationales, et audits de sécurité réguliers par des tiers."
        },
        {
          question: "Terex est-il régulé et licencié ?",
          answer: "Oui, Terex opère en conformité avec les réglementations financières de tous nos marchés. Nous respectons les directives anti-blanchiment (AML), les règles KYC, et collaborons avec les autorités locales. Nous sommes enregistrés comme prestataire de services de paiement dans nos juridictions d'opération."
        },
        {
          question: "Comment activer l'authentification à 2 facteurs (2FA) ?",
          answer: "Pour activer 2FA : 1) Allez dans Paramètres > Sécurité, 2) Téléchargez Google Authenticator ou Authy, 3) Scannez le QR code affiché, 4) Entrez le code à 6 chiffres généré, 5) Sauvegardez les codes de récupération. 2FA ajoute une couche de sécurité essentielle à votre compte."
        },
        {
          question: "Que faire si mon compte est compromis ?",
          answer: "Si vous suspectez une compromission : 1) Changez immédiatement votre mot de passe, 2) Contactez notre support d'urgence 24/7, 3) Nous bloquerons temporairement votre compte, 4) Vérifiez vos transactions récentes, 5) Nous vous aiderons à sécuriser votre compte. Notre équipe de sécurité intervient en moins de 15 minutes."
        },
        {
          question: "Comment signaler une transaction suspecte ?",
          answer: "Pour signaler une activité suspecte : contactez immédiatement notre support via chat, email ou téléphone, fournissez tous les détails (références, montants, dates), nous enquêterons dans les 24h. Nous prenons très au sérieux la sécurité de notre écosystème et récompensons les signalements légitimes."
        }
      ]
    },
    {
      id: 'support',
      title: "Support et Assistance",
      icon: "🎧",
      faqs: [
        {
          question: "Comment contacter le support client ?",
          answer: "Notre support est disponible 24/7 via : Chat en direct sur la plateforme (réponse < 5 min), Email à Terangaexchange@gmail.com (réponse < 2h), Téléphone au +1 (418) 261-9091 (7j/7), WhatsApp Business pour un support rapide. Nous parlons français, anglais, et wolof."
        },
        {
          question: "Quels sont vos horaires de support ?",
          answer: "Notre support client fonctionne 24h/24, 7j/7 toute l'année, y compris les weekends et jours fériés. L'équipe technique est disponible en permanence pour les urgences. Les réponses par chat sont généralement instantanées, par email sous 2h maximum."
        },
        {
          question: "Dans quelles langues le support est-il disponible ?",
          answer: "Nous offrons un support complet en français et anglais, avec une assistance de base en wolof, arabe, et autres langues locales selon les besoins. Notre équipe multiculturelle comprend les spécificités de chaque marché que nous servons."
        },
        {
          question: "Comment faire une réclamation ?",
          answer: "Pour faire une réclamation : 1) Rassemblez tous les documents pertinents, 2) Contactez notre service réclamations via email ou chat, 3) Décrivez précisément le problème, 4) Nous accusons réception sous 24h, 5) Investigation et réponse sous 5 jours ouvrables maximum. Nous résolvons 95% des réclamations à la satisfaction du client."
        },
        {
          question: "Proposez-vous des formations pour les nouveaux utilisateurs ?",
          answer: "Oui, nous proposons : tutoriels vidéo étape par étape, guide d'utilisation complet avec captures d'écran, webinaires gratuits hebdomadaires, support personnalisé pour les premiers utilisateurs, documentation complète en ligne. Notre objectif est que chaque utilisateur maîtrise parfaitement la plateforme."
        }
      ]
    }
  ];

  const filteredSections = searchTerm 
    ? faqSections.map(section => ({
        ...section,
        faqs: section.faqs.filter(faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => section.faqs.length > 0)
    : faqSections;

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
      <div className="bg-terex-darker border-b border-terex-accent/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Voici quelques questions fréquemment posées...
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher ici..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedCategory(null);
                    setSelectedFaq(null);
                  }}
                  className="pl-12 py-6 text-base bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-400 focus:border-terex-accent focus:ring-terex-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections or Category View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedCategory && !searchTerm ? (
          <>
            {/* Collections Title */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Collections</h2>
              <p className="text-gray-300">Parcourir les articles par catégorie</p>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                const articleCount = faqSections.find(s => s.id === category.id)?.faqs.length || 0;
                
                return (
                  <Card
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="group p-6 cursor-pointer bg-terex-darker hover:bg-terex-gray border-terex-accent/20 transition-all duration-200 hover:shadow-lg hover:shadow-terex-accent/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-terex-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-terex-accent/20 transition-colors">
                        <Icon className="w-6 h-6 text-terex-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-terex-accent transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-3">
                          {category.description}
                        </p>
                        <div className="text-xs text-gray-400">
                          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : selectedCategory && !selectedFaq ? (
          <>
            {/* Category View with Back Button */}
            <div className="mb-10">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="mb-6 text-gray-300 hover:text-white hover:bg-terex-gray"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux collections
              </Button>
              
              {(() => {
                const category = faqCategories.find(c => c.id === selectedCategory);
                const section = faqSections.find(s => s.id === selectedCategory);
                const Icon = category?.icon;
                
                return (
                  <div className="flex items-center gap-4 mb-6">
                    {Icon && (
                      <div className="w-16 h-16 rounded-xl bg-terex-accent/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-terex-accent" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-bold text-white">{category?.title}</h2>
                      <p className="text-gray-300">{section?.faqs.length} {section?.faqs.length === 1 ? 'article' : 'articles'}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {(() => {
                const section = faqSections.find(s => s.id === selectedCategory);
                return section?.faqs.map((faq, index) => (
                  <Card 
                    key={index}
                    onClick={() => setSelectedFaq({...faq, category: section.title})}
                    className="group p-5 cursor-pointer bg-terex-darker hover:bg-terex-gray border-terex-accent/20 transition-all duration-200 hover:shadow-md hover:shadow-terex-accent/10"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-white group-hover:text-terex-accent transition-colors flex-1">
                        {faq.question}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-terex-accent group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>
                  </Card>
                ));
              })()}
            </div>
          </>
        ) : searchTerm ? (
          <>
            {/* Search Results */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="text-gray-300 hover:text-white hover:bg-terex-gray"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Effacer la recherche
              </Button>
            </div>
            
            {filteredSections.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-terex-gray flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Aucun résultat trouvé</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Essayez d'autres mots-clés ou parcourez nos collections
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredSections.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                    <div className="space-y-3">
                      {section.faqs.map((faq, index) => (
                        <Card 
                          key={index}
                          onClick={() => setSelectedFaq({...faq, category: section.title})}
                          className="group p-5 cursor-pointer bg-terex-darker hover:bg-terex-gray border-terex-accent/20 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-white group-hover:text-terex-accent transition-colors flex-1">
                              {faq.question}
                            </h4>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-terex-accent group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {/* Contact Support Section */}
        {!selectedCategory && !searchTerm && (
          <div className="mt-20 bg-gradient-to-br from-terex-accent/5 to-terex-accent/10 rounded-2xl p-10 text-center border border-terex-accent/20">
            <div className="w-20 h-20 rounded-full bg-terex-accent/20 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-terex-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Notre équipe support est disponible 24/7 pour vous aider
            </p>
            <Button 
              onClick={() => navigate('/support')}
              size="lg"
              className="bg-terex-accent hover:bg-terex-accent-light text-white"
            >
              Contacter le support
            </Button>
          </div>
        )}
      </div>

      {/* Article Detail Modal/View */}
      {selectedFaq && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-terex-darker rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-terex-accent/20">
            <div className="sticky top-0 bg-terex-darker border-b border-terex-accent/20 px-8 py-6 flex items-center justify-between z-10">
              <Button
                variant="ghost"
                onClick={() => setSelectedFaq(null)}
                className="text-gray-300 hover:text-white hover:bg-terex-gray"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <span className="text-sm text-gray-400">{selectedFaq.category}</span>
            </div>
            
            <div className="px-8 py-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {selectedFaq.question}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedFaq.answer}
                </p>
              </div>

              {/* Placeholder for future video */}
              <div className="mt-10 p-6 bg-terex-gray/30 rounded-xl border border-terex-accent/20">
                <p className="text-sm text-gray-400 text-center">
                  📹 Tutoriel vidéo disponible prochainement
                </p>
              </div>
            </div>

            <div className="border-t border-terex-accent/20 px-8 py-6 bg-terex-gray/20">
              <p className="text-sm text-gray-300 text-center mb-4">Cet article vous a-t-il été utile ?</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" className="border-terex-accent/20 text-gray-300 hover:bg-terex-gray hover:text-white">👍 Oui</Button>
                <Button variant="outline" size="sm" className="border-terex-accent/20 text-gray-300 hover:bg-terex-gray hover:text-white">👎 Non</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default FAQPage;
