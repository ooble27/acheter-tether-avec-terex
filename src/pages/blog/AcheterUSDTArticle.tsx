import { BlogArticle } from "@/components/blog/BlogArticle";
import blogAcheterImage from "@/assets/blog-acheter-usdt.png";

export default function AcheterUSDTArticle() {
  const content = (
    <>
      <p className="text-gray-300 text-xl">
        Acheter de l'USDT sur Terex est simple et rapide. Suivez ce guide pas à pas pour effectuer votre première transaction.
      </p>

      <h2 className="text-white">Étape 1 : Créez votre compte Terex</h2>
      <p className="text-gray-300">
        Rendez-vous sur <a href="/" className="text-terex-accent hover:underline">terangaexchange.com</a> et cliquez sur "Se Connecter". 
        Vous recevrez un lien de connexion magique par email - pas besoin de mot de passe !
      </p>
      <p className="text-gray-300">
        Pour des raisons de sécurité et de conformité, vous devrez compléter votre KYC (vérification d'identité) :
      </p>
      <ul className="text-gray-300">
        <li>Carte d'identité nationale ou passeport</li>
        <li>Selfie de vérification</li>
        <li>Coordonnées de contact</li>
      </ul>
      <p className="text-gray-300">
        La vérification prend généralement moins de 2 heures pendant les jours ouvrables.
      </p>

      <h2 className="text-white">Étape 2 : Choisissez votre montant</h2>
      <p className="text-gray-300">
        Une fois connecté, cliquez sur "Acheter USDT" depuis votre dashboard. Entrez le montant que vous souhaitez acheter :
      </p>
      <ul className="text-gray-300">
        <li><strong className="text-white">Minimum</strong> : 10 000 FCFA (environ 15 USDT)</li>
        <li><strong className="text-white">Maximum</strong> : 5 000 000 FCFA (environ 8 000 USDT) par transaction</li>
      </ul>
      <p className="text-gray-300">
        Le montant en USDT que vous recevrez s'affiche automatiquement selon le taux de change actuel.
      </p>

      <div className="bg-terex-darker border border-terex-accent/20 rounded-lg p-6 my-8">
        <h3 className="text-white mb-3">💰 Exemple de calcul</h3>
        <p className="text-gray-300 mb-2">
          Vous voulez acheter pour 100 000 FCFA d'USDT.
        </p>
        <ul className="text-gray-300 mb-0">
          <li>Taux de change : 1 USDT = 620 FCFA</li>
          <li>Frais Terex : 2% (2 000 FCFA)</li>
          <li>Vous recevrez : 158,06 USDT</li>
        </ul>
      </div>

      <h2 className="text-white">Étape 3 : Choisissez votre méthode de paiement</h2>
      <p className="text-gray-300">
        Terex accepte plusieurs méthodes de paiement en Afrique de l'Ouest :
      </p>
      
      <h3 className="text-white text-xl mt-6">Mobile Money (Recommandé)</h3>
      <ul className="text-gray-300">
        <li><strong className="text-white">Orange Money</strong> : Disponible au Sénégal, Côte d'Ivoire, Mali, Burkina Faso</li>
        <li><strong className="text-white">Wave</strong> : Disponible au Sénégal, Côte d'Ivoire, Mali, Burkina Faso</li>
      </ul>
      <p className="text-gray-300">
        Processus : Après validation de votre commande, vous recevrez une notification de paiement sur votre téléphone. 
        Entrez votre code PIN pour confirmer le paiement.
      </p>

      <h3 className="text-white text-xl mt-6">Virement bancaire</h3>
      <p className="text-gray-300">
        Pour les montants importants (plus de 500 000 FCFA), le virement bancaire est une excellente option :
      </p>
      <ul className="text-gray-300">
        <li>Frais réduits pour les gros montants</li>
        <li>Sécurisé par nos partenaires bancaires (Ecobank, UBA, Banque Atlantique)</li>
        <li>Délai de traitement : 1-3 heures après confirmation du virement</li>
      </ul>

      <h3 className="text-white text-xl mt-6">Carte bancaire</h3>
      <p className="text-gray-300">
        Utilisez votre Visa ou Mastercard pour un achat instantané :
      </p>
      <ul className="text-gray-300">
        <li>Transaction immédiate</li>
        <li>Accepté dans tous les pays</li>
        <li>Frais : 3% du montant</li>
      </ul>

      <h2 className="text-white">Après le paiement</h2>
      <p className="text-gray-300">
        Dès réception de votre paiement :
      </p>
      <ol className="text-gray-300">
        <li>Votre commande passe en statut "Paiement Confirmé"</li>
        <li>Terex prépare l'envoi de vos USDT (5-15 minutes)</li>
        <li>Vous recevez une notification quand les USDT sont envoyés</li>
        <li>Les USDT arrivent dans votre wallet en quelques minutes</li>
      </ol>

      <div className="bg-terex-darker border border-terex-accent/20 rounded-lg p-6 my-8">
        <h3 className="text-white mb-3">⚡ Astuce Rapide</h3>
        <p className="text-gray-300 mb-0">
          Vous n'avez pas encore de wallet USDT ? Pas de problème ! Terex peut créer une adresse wallet pour vous 
          lors de votre première transaction. Nous vous recommandons Trust Wallet ou Binance pour stocker vos USDT.
        </p>
      </div>

      <h2 className="text-white">Réseau blockchain recommandé</h2>
      <p className="text-gray-300">
        Lors de la commande, vous choisirez le réseau blockchain pour recevoir vos USDT :
      </p>
      <ul className="text-gray-300">
        <li><strong className="text-white">TRC-20 (Tron)</strong> : Idéal pour l'Afrique, frais très bas (~1$)</li>
        <li><strong className="text-white">BEP-20 (BSC)</strong> : Rapide et économique (~0.50$)</li>
        <li><strong className="text-white">ERC-20 (Ethereum)</strong> : Le plus universel mais frais élevés (10-50$)</li>
      </ul>

      <h2 className="text-white">Questions fréquentes</h2>
      
      <h3 className="text-white text-xl mt-6">Combien de temps prend une transaction ?</h3>
      <p className="text-gray-300">
        Avec Mobile Money : 15-30 minutes en moyenne. Avec virement bancaire : 1-3 heures.
      </p>

      <h3 className="text-white text-xl mt-6">Y a-t-il des frais cachés ?</h3>
      <p className="text-gray-300">
        Non ! Tous les frais sont affichés clairement avant votre validation. Chez Terex, nous croyons en la transparence totale.
      </p>

      <h3 className="text-white text-xl mt-6">Puis-je annuler ma commande ?</h3>
      <p className="text-gray-300">
        Oui, tant que vous n'avez pas effectué le paiement. Une fois le paiement reçu, la transaction ne peut plus être annulée.
      </p>

      <div className="bg-terex-accent/10 border border-terex-accent rounded-lg p-6 my-8">
        <h3 className="text-white mb-3">🚀 Prêt à commencer ?</h3>
        <p className="text-gray-300 mb-4">
          Créez votre compte Terex maintenant et achetez vos premiers USDT en moins de 15 minutes.
        </p>
        <a 
          href="/auth" 
          className="inline-block bg-terex-accent text-black px-6 py-3 rounded-lg font-medium hover:bg-terex-accent/90 transition-colors"
        >
          Créer mon compte
        </a>
      </div>
    </>
  );

  return (
    <BlogArticle
      title="Comment acheter de l'USDT sur Terex en 3 étapes"
      date="12 Oct 2025"
      readTime="7 min"
      category="Guide"
      image={blogAcheterImage}
      content={content}
    />
  );
}
