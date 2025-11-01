
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, ArrowRight } from 'lucide-react';
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

  const faqSections = [
    {
      title: "Démarrage et Compte",
      icon: "👤",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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
          answer: "Non, la vérification KYC est obligatoire pour utiliser Terex. Cela nous permet de respecter les réglementations financières et de protéger tous nos utilisateurs contre la fraude et le blanchiment d'argent. Sans KYC, vous ne pourrez pas effectuer de transactions."
        }
      ]
    },
    {
      title: "Achat d'USDT",
      icon: "💰",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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
      title: "Vente d'USDT",
      icon: "💸",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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
      title: "Transferts Internationaux",
      icon: "🌍",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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
      title: "Sécurité et Conformité",
      icon: "🔒",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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
      title: "Support et Assistance",
      icon: "🎧",
      color: "from-terex-accent/20 to-terex-accent-light/20",
      borderColor: "border-terex-accent/30",
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

  const allFaqs = faqSections.flatMap(section => 
    section.faqs.map(faq => ({
      ...faq,
      category: section.title
    }))
  );

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
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-terex-accent/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terex-accent-light/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terex-accent/5 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center bg-gradient-to-r from-terex-accent/20 to-terex-accent-light/20 backdrop-blur-sm rounded-full px-6 py-3 border border-terex-accent/30 shadow-lg shadow-terex-accent/10">
              <MessageCircle className="w-5 h-5 text-terex-accent mr-2 animate-pulse" />
              <span className="text-terex-accent font-medium">Foire aux Questions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
              Tout ce que vous devez<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light">savoir sur Terex</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Des réponses complètes et détaillées à toutes vos questions
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-terex-accent/70 group-hover:text-terex-accent transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-6 py-6 md:py-7 bg-terex-darker/70 backdrop-blur-xl border-2 border-terex-accent/20 focus:border-terex-accent/50 text-white placeholder:text-gray-400 rounded-2xl text-lg shadow-2xl shadow-terex-accent/5 hover:shadow-terex-accent/10 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="py-16 md:py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredSections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex} 
                className="group animate-fade-in hover-scale" 
                style={{ animationDelay: `${sectionIndex * 0.1}s` }}
              >
                <div className={`h-full rounded-3xl p-8 bg-gradient-to-br ${section.color} backdrop-blur-sm border ${section.borderColor} shadow-xl hover:shadow-2xl hover:shadow-terex-accent/10 transition-all duration-500 relative overflow-hidden`}>
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 via-transparent to-terex-accent-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">{section.icon}</div>
                      <h2 className="text-3xl font-light text-white group-hover:text-terex-accent transition-colors duration-300">
                        {section.title}
                      </h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="space-y-4">
                      {section.faqs.map((faq, faqIndex) => (
                        <AccordionItem 
                          key={faqIndex}
                          value={`section-${sectionIndex}-item-${faqIndex}`}
                          className="border-b border-terex-accent/20 last:border-0 hover:border-terex-accent/40 transition-colors"
                        >
                          <AccordionTrigger className="text-white hover:text-terex-accent text-left py-5 text-lg font-light transition-all group/item">
                            <span className="pr-4">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-300 leading-relaxed pb-6 pt-2 text-base font-light">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-20 col-span-2">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-terex-accent/20 to-terex-accent-light/20 backdrop-blur-sm mb-8 border border-terex-accent/30">
                <Search className="w-12 h-12 text-terex-accent" />
              </div>
              <h3 className="text-3xl font-light text-white mb-4">Aucun résultat trouvé</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                Essayez d'autres mots-clés ou contactez notre support pour plus d'aide.
              </p>
              <Button 
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent-light hover:to-terex-accent text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-terex-accent/30 hover:shadow-terex-accent/50 transition-all duration-300 border-0"
              >
                Voir toutes les questions
              </Button>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-16 md:mt-32 col-span-1 lg:col-span-2">
            <div className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/30 via-terex-accent-light/20 to-terex-accent/30 animate-pulse"></div>
              <div className="absolute inset-0 backdrop-blur-2xl"></div>
              
              {/* Content */}
              <div className="relative p-8 md:p-16 lg:p-20 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terex-accent/20 backdrop-blur-sm border border-terex-accent/30 mb-4">
                    <MessageCircle className="w-10 h-10 text-terex-accent animate-pulse" />
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                    Vous ne trouvez pas<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light">votre réponse ?</span>
                  </h3>
                  
                  <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                    Notre équipe support est disponible 24/7 pour répondre à toutes vos questions
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/contact')}
                      className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent-light hover:to-terex-accent text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-terex-accent/30 hover:shadow-terex-accent/50 transition-all duration-300 group border-0"
                    >
                      <MessageCircle className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                      Contacter le Support
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => window.location.href = 'tel:+14182619091'}
                      className="bg-terex-darker/50 backdrop-blur-sm border-2 border-terex-accent/50 text-white hover:bg-terex-accent hover:border-terex-accent px-10 py-7 text-lg rounded-2xl transition-all duration-300 group"
                    >
                      <span className="mr-3 text-2xl group-hover:animate-pulse">📞</span>
                      +1 (418) 261-9091
                    </Button>
                  </div>
                </div>
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
