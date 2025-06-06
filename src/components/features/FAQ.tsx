import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQProps {
  onNavigate?: (section: string) => void;
}

export function FAQ({ onNavigate }: FAQProps) {
  const faqItems = [
    {
      id: "item-1",
      question: "Comment acheter des USDT sur Terex ?",
      answer: "Pour acheter des USDT, rendez-vous dans la section 'Acheter USDT', choisissez votre devise (CFA ou CAD), entrez le montant, sélectionnez votre réseau de réception et votre adresse USDT. Suivez ensuite les instructions de paiement."
    },
    {
      id: "item-2",
      question: "Quels sont les réseaux supportés ?",
      answer: "Nous supportons les réseaux TRC20 (Tron), BEP20 (BSC), ERC20 (Ethereum), Arbitrum et Polygon. Chaque réseau a ses propres frais et temps de confirmation."
    },
    {
      id: "item-3",
      question: "Combien de temps prend une transaction ?",
      answer: "Les achats d'USDT sont traités sous 15 minutes après confirmation du paiement. Les ventes d'USDT et virements internationaux sont traités sous 5 à 15 minutes."
    },
    {
      id: "item-4",
      question: "Quels sont les frais de transaction ?",
      answer: "Nos frais sont transparents et compétitifs. Les frais de réseau blockchain sont inclus dans nos taux de change. Aucun frais caché."
    },
    {
      id: "item-5",
      question: "Comment vendre mes USDT ?",
      answer: "Dans la section 'Vendre USDT', entrez le montant que vous souhaitez vendre, choisissez votre réseau d'envoi, et fournissez les informations de réception (Orange Money ou Wave). Vous recevrez votre argent sous 5 minutes."
    },
    {
      id: "item-6",
      question: "Vers quels pays puis-je envoyer de l'argent ?",
      answer: "Nous supportons les transferts vers le Sénégal, la Côte d'Ivoire, le Mali, le Burkina Faso et le Niger. D'autres pays seront ajoutés prochainement."
    },
    {
      id: "item-7",
      question: "Quels sont les montants minimum et maximum ?",
      answer: "Minimum : 10,000 CFA ou 15 CAD pour l'achat d'USDT, 10 USDT pour la vente, 25 CAD pour les virements internationaux. Les maximums dépendent de votre niveau de vérification."
    },
    {
      id: "item-8",
      question: "La plateforme est-elle sécurisée ?",
      answer: "Oui, Terex utilise les dernières technologies de sécurité, le chiffrement SSL, et respecte les normes de sécurité bancaire. Vos fonds et données personnelles sont protégés."
    },
    {
      id: "item-9",
      question: "Comment contacter le support client ?",
      answer: "Notre équipe support est disponible 24/7 par email, chat en direct, ou téléphone. Nous nous engageons à répondre sous 30 minutes maximum."
    },
    {
      id: "item-10",
      question: "Puis-je annuler une transaction ?",
      answer: "Une fois une transaction confirmée et en cours de traitement, elle ne peut pas être annulée. Assurez-vous de vérifier toutes les informations avant de confirmer."
    }
  ];

  const handleResourceClick = (resource: string) => {
    if (onNavigate) {
      onNavigate(resource);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Questions Fréquentes</h1>
        <p className="text-gray-400">
          Trouvez rapidement les réponses à vos questions sur Terex
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">FAQ Terex</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    className="border-terex-gray"
                  >
                    <AccordionTrigger className="text-white hover:text-terex-accent text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Support Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-terex-gray rounded-lg">
                <h3 className="text-terex-accent font-medium mb-1">📧 Email</h3>
                <p className="text-gray-300 text-sm">Terangaexchange@gmail.com</p>
              </div>
              <div className="p-3 bg-terex-gray rounded-lg">
                <h3 className="text-terex-accent font-medium mb-1">💬 Chat en direct</h3>
                <p className="text-gray-300 text-sm">Disponible 24/7</p>
              </div>
              <div className="p-3 bg-terex-gray rounded-lg">
                <h3 className="text-terex-accent font-medium mb-1">📞 Téléphone</h3>
                <p className="text-gray-300 text-sm">+1 (418) 261-9091</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Heures d'ouverture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Lundi - Vendredi</span>
                <span className="text-terex-accent">24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Weekend</span>
                <span className="text-terex-accent">24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Support urgent</span>
                <span className="text-terex-accent">Toujours</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Ressources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button 
                onClick={() => handleResourceClick('user-guide')}
                className="block text-terex-accent hover:text-terex-accent-light transition-colors text-sm w-full text-left"
              >
                📖 Guide d'utilisation
              </button>
              <button 
                onClick={() => handleResourceClick('security-policy')}
                className="block text-terex-accent hover:text-terex-accent-light transition-colors text-sm w-full text-left"
              >
                🔒 Politique de sécurité
              </button>
              <button 
                onClick={() => handleResourceClick('terms-of-service')}
                className="block text-terex-accent hover:text-terex-accent-light transition-colors text-sm w-full text-left"
              >
                📋 Conditions d'utilisation
              </button>
              <button 
                onClick={() => handleResourceClick('about-terex')}
                className="block text-terex-accent hover:text-terex-accent-light transition-colors text-sm w-full text-left"
              >
                💡 À propos de Terex
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
