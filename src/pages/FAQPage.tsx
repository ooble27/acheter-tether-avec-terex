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

  const faqs = [
    {
      question: "Qu'est-ce que Terex et comment ça marche ?",
      answer: "Terex est une plateforme d'échange crypto-fiat qui permet aux utilisateurs d'acheter, de vendre et de transférer des cryptomonnaies en utilisant les monnaies locales africaines. Nous offrons une solution simple et sécurisée pour accéder aux marchés des cryptomonnaies."
    },
    {
      question: "Quelles cryptomonnaies puis-je échanger sur Terex ?",
      answer: "Nous supportons les principales cryptomonnaies telles que Bitcoin, Ethereum, USDT et d'autres. La liste complète est disponible sur notre plateforme."
    },
    {
      question: "Quels sont les frais de transaction sur Terex ?",
      answer: "Nos frais de transaction sont transparents et compétitifs. Ils varient en fonction de la paire de devises et du volume d'échange. Consultez notre page de tarification pour plus de détails."
    },
    {
      question: "Comment puis-je sécuriser mon compte Terex ?",
      answer: "Nous utilisons des mesures de sécurité avancées, notamment l'authentification à deux facteurs (2FA), le cryptage des données et la surveillance constante des transactions. Activez 2FA et utilisez un mot de passe fort pour protéger votre compte."
    },
    {
      question: "Comment puis-je déposer et retirer des fonds de mon compte Terex ?",
      answer: "Vous pouvez déposer et retirer des fonds en utilisant les méthodes de paiement locales disponibles dans votre pays, telles que les virements bancaires, les paiements mobiles et les cartes de crédit/débit."
    },
    {
      question: "Terex est-il disponible dans mon pays ?",
      answer: "Nous sommes en expansion constante en Afrique. Consultez notre liste de pays pris en charge sur notre site web."
    },
    {
      question: "Comment puis-je contacter le support client de Terex ?",
      answer: "Vous pouvez contacter notre support client par e-mail, chat en direct ou téléphone. Consultez notre page de contact pour plus d'informations."
    },
    {
      question: "Terex est-il réglementé ?",
      answer: "Nous sommes conformes aux réglementations locales et internationales en matière de cryptomonnaies et de services financiers. Nous travaillons en étroite collaboration avec les autorités pour assurer la sécurité et la transparence de nos opérations."
    },
    {
      question: "Comment puis-je devenir partenaire de Terex ?",
      answer: "Si vous êtes intéressé par un partenariat, veuillez nous contacter via notre page de partenariat. Nous sommes toujours à la recherche de partenaires stratégiques pour développer notre réseau."
    },
    {
      question: "Comment puis-je suivre l'actualité de Terex ?",
      answer: "Suivez-nous sur nos réseaux sociaux et consultez notre blog pour les dernières nouvelles, mises à jour et annonces."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Foire aux Questions (FAQ)</h2>
            <p className="text-gray-300 text-lg">
              Trouvez les réponses aux questions les plus fréquemment posées sur Terex.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher une question..."
                className="bg-terex-darker text-white border-terex-accent/30 rounded-full py-3 px-6 focus:border-terex-accent focus-visible:ring-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 right-5 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-white font-semibold text-lg hover:no-underline flex items-center justify-between px-4 py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 py-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center mt-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Aucune question ne correspond à votre recherche.</p>
            </div>
          )}

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-gray-300 mb-6">
              Contactez notre équipe de support pour obtenir de l'aide personnalisée.
            </p>
            <Button onClick={() => navigate('/contact')} className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold">
              Contactez-nous <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default FAQPage;
