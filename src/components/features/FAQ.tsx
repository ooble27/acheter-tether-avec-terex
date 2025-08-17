import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, MessageCircle, Phone, Mail, ExternalLink, Book, Shield, DollarSign, Zap, Users, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/components/ScrollToTop';

interface FAQProps {
  onNavigate: (section: string) => void;
}

export function FAQ({ onNavigate }: FAQProps) {
  const scrollToTop = useScrollToTop();
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  const faqData = [
    {
      question: "Qu'est-ce que Terex et comment ça marche ?",
      answer: "Terex est une plateforme qui facilite l'achat, la vente et le transfert d'USDT. Elle fonctionne en mettant en relation les utilisateurs avec des fournisseurs de liquidités vérifiés.",
      category: "Général"
    },
    {
      question: "Comment puis-je acheter des USDT sur Terex ?",
      answer: "Pour acheter des USDT, vous devez d'abord créer un compte et vérifier votre identité. Ensuite, vous pouvez choisir le montant d'USDT que vous souhaitez acheter et sélectionner votre méthode de paiement préférée.",
      category: "Achat"
    },
    {
      question: "Quelles sont les méthodes de paiement acceptées ?",
      answer: "Nous acceptons les paiements par carte bancaire, virement bancaire et mobile money. Les options disponibles peuvent varier en fonction de votre pays.",
      category: "Paiement"
    },
    {
      question: "Comment puis-je vendre des USDT sur Terex ?",
      answer: "Pour vendre des USDT, vous devez d'abord créer un compte et vérifier votre identité. Ensuite, vous pouvez choisir le montant d'USDT que vous souhaitez vendre et sélectionner votre méthode de réception préférée.",
      category: "Vente"
    },
    {
      question: "Comment puis-je transférer de l'argent à l'international avec Terex ?",
      answer: "Pour transférer de l'argent à l'international, vous devez d'abord créer un compte et vérifier votre identité. Ensuite, vous pouvez saisir les informations du destinataire et choisir la méthode de réception préférée.",
      category: "Transfert"
    },
    {
      question: "Quels sont les frais de transaction sur Terex ?",
      answer: "Les frais de transaction varient en fonction du type de transaction et de votre niveau de vérification. Vous pouvez consulter les frais en vigueur sur notre page de tarification.",
      category: "Frais"
    },
    {
      question: "Comment puis-je contacter le support client de Terex ?",
      answer: "Vous pouvez contacter notre support client par email, téléphone ou chat en direct. Les informations de contact sont disponibles sur notre page de contact.",
      category: "Support"
    },
    {
      question: "Comment puis-je sécuriser mon compte Terex ?",
      answer: "Nous vous recommandons d'activer l'authentification à deux facteurs (2FA) et de choisir un mot de passe fort. Vous pouvez également consulter notre guide de sécurité pour plus de conseils.",
      category: "Sécurité"
    },
    {
      question: "Comment fonctionne le programme de parrainage de Terex ?",
      answer: "Notre programme de parrainage vous permet de gagner des récompenses en invitant vos amis à utiliser Terex. Vous pouvez trouver votre lien de parrainage sur votre page de profil.",
      category: "Parrainage"
    },
    {
      question: "Comment puis-je vérifier mon identité (KYC) sur Terex ?",
      answer: "Pour vérifier votre identité, vous devez fournir une copie de votre pièce d'identité et un justificatif de domicile. Vous pouvez effectuer la vérification sur votre page de profil.",
      category: "KYC"
    }
  ];

  const filteredFaqData = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-terex-dark">
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
              <span className="text-terex-accent font-medium">Foire aux Questions</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Besoin d'aide ? Trouvez les <span className="text-terex-accent">réponses</span> ici
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Consultez notre FAQ pour trouver rapidement les réponses aux questions les plus fréquentes.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une question ou un mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-terex-darker border-terex-accent/30 text-white placeholder:text-gray-400 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-terex-accent/20">
                <AccordionTrigger className="flex items-center justify-between py-4 text-xl text-white hover:text-terex-accent data-[state=open]:text-terex-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="py-4 text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* No Results */}
          {filteredFaqData.length === 0 && (
            <div className="text-center mt-12">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Aucun résultat</h2>
              <p className="text-gray-300">
                Nous n'avons pas trouvé de questions correspondant à votre recherche.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Contactez notre équipe de support pour obtenir de l'aide personnalisée.
            </p>
            <Button 
              onClick={() => onNavigate('contact')}
              className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Nous Contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
