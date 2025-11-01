import { BlogArticle } from "@/components/blog/BlogArticle";
import blogTransfertsImage from "@/assets/blog-transferts.png";

export default function TransfertsInternationauxArticle() {
  const content = (
    <div className="prose prose-invert max-w-none">
      <p className="lead text-lg text-gray-300">
        Les transferts d'argent internationaux en Afrique ont longtemps été coûteux et lents. 
        Découvrez comment Terex révolutionne ces transactions grâce à la technologie blockchain.
      </p>

      <h2>Les défis des transferts traditionnels</h2>
      <p>
        L'Afrique reçoit chaque année des milliards de dollars en transferts de fonds de la diaspora. 
        Cependant, les méthodes traditionnelles présentent plusieurs problèmes majeurs :
      </p>
      <ul>
        <li><strong>Frais élevés</strong> : Jusqu'à 10% du montant envoyé</li>
        <li><strong>Délais importants</strong> : 3 à 5 jours ouvrables en moyenne</li>
        <li><strong>Documentation complexe</strong> : Nombreux formulaires à remplir</li>
        <li><strong>Accès limité</strong> : Nécessité de se déplacer physiquement</li>
        <li><strong>Taux de change défavorables</strong> : Marges importantes appliquées</li>
      </ul>

      <h2>La solution Terex</h2>
      <p>
        Terex utilise l'USDT (Tether) et le réseau blockchain pour offrir une alternative moderne et efficace :
      </p>

      <h3>1. Frais réduits</h3>
      <p>
        Nos frais sont jusqu'à 90% moins chers que les services traditionnels. En utilisant la blockchain, 
        nous éliminons les intermédiaires coûteux.
      </p>

      <h3>2. Rapidité</h3>
      <p>
        Les transferts sont traités en quelques minutes au lieu de plusieurs jours. Votre famille reçoit 
        l'argent presque instantanément.
      </p>

      <h3>3. Accessibilité</h3>
      <p>
        Envoyez et recevez de l'argent depuis votre smartphone, 24/7, sans vous déplacer.
      </p>

      <h2>Comment effectuer un transfert international avec Terex</h2>
      
      <h3>Étape 1 : Créer un compte</h3>
      <p>
        Inscrivez-vous sur Terex et complétez le processus de vérification KYC. Cette étape assure 
        la sécurité de tous nos utilisateurs.
      </p>

      <h3>Étape 2 : Acheter de l'USDT</h3>
      <p>
        Achetez de l'USDT avec votre monnaie locale via Mobile Money (Orange Money, MTN, etc.) ou 
        virement bancaire. Le taux de change est transparent et compétitif.
      </p>

      <h3>Étape 3 : Envoyer l'USDT</h3>
      <p>
        Transférez l'USDT vers le wallet du destinataire ou directement vers son compte Terex. 
        Les frais de transaction sont minimes (environ 1-2 USDT).
      </p>

      <h3>Étape 4 : Conversion en monnaie locale</h3>
      <p>
        Le destinataire peut immédiatement convertir l'USDT en monnaie locale et retirer via 
        Mobile Money ou virement bancaire.
      </p>

      <h2>Cas d'usage réels</h2>
      
      <h3>Envoi de fonds familiaux</h3>
      <p>
        <em>Exemple :</em> Marie travaille en France et envoie 500€ à sa famille au Sénégal. 
        Avec Terex, elle paie seulement 3€ de frais et sa famille reçoit l'équivalent en FCFA 
        en moins de 30 minutes.
      </p>

      <h3>Paiement de fournisseurs</h3>
      <p>
        <em>Exemple :</em> Une entreprise à Lagos doit payer un fournisseur à Abidjan. Le transfert 
        USDT via Terex est instantané et évite les complications bancaires transfrontalières.
      </p>

      <h3>Études à l'étranger</h3>
      <p>
        <em>Exemple :</em> Des parents envoient régulièrement de l'argent à leur enfant étudiant 
        au Canada. Terex leur permet d'économiser des centaines de dollars en frais chaque année.
      </p>

      <h2>Avantages spécifiques pour l'Afrique</h2>
      
      <h3>Inclusion financière</h3>
      <p>
        Terex permet aux personnes non bancarisées d'accéder aux services financiers internationaux 
        grâce au Mobile Money.
      </p>

      <h3>Transparence</h3>
      <p>
        Tous les frais sont affichés clairement avant la transaction. Pas de surprises ni de frais cachés.
      </p>

      <h3>Sécurité</h3>
      <p>
        La blockchain assure la traçabilité de chaque transaction. Vous pouvez vérifier le statut 
        en temps réel.
      </p>

      <h3>Autonomie</h3>
      <p>
        Gardez le contrôle total de votre argent. Plus besoin d'attendre les horaires d'ouverture 
        des agences.
      </p>

      <h2>Pays supportés</h2>
      <p>
        Terex est actuellement disponible dans plusieurs pays africains :
      </p>
      <ul>
        <li>🇸🇳 Sénégal</li>
        <li>🇨🇮 Côte d'Ivoire</li>
        <li>🇧🇯 Bénin</li>
        <li>🇹🇬 Togo</li>
        <li>🇧🇫 Burkina Faso</li>
        <li>🇲🇱 Mali</li>
        <li>🇳🇬 Nigeria</li>
        <li>🇬🇭 Ghana</li>
        <li>🇰🇪 Kenya</li>
        <li>🇹🇿 Tanzanie</li>
      </ul>
      <p>Et nous nous étendons continuellement vers de nouveaux marchés.</p>

      <h2>Comparaison avec les alternatives</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Service</th>
            <th>Frais moyens</th>
            <th>Délai</th>
            <th>Accessibilité</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Western Union</td>
            <td>8-10%</td>
            <td>Instantané à 3 jours</td>
            <td>Agences physiques</td>
          </tr>
          <tr>
            <td>Virement bancaire</td>
            <td>5-8%</td>
            <td>3-5 jours</td>
            <td>Nécessite un compte</td>
          </tr>
          <tr>
            <td>MoneyGram</td>
            <td>7-9%</td>
            <td>Instantané à 2 jours</td>
            <td>Agences physiques</td>
          </tr>
          <tr>
            <td><strong>Terex</strong></td>
            <td><strong>0.5-2%</strong></td>
            <td><strong>Minutes</strong></td>
            <td><strong>100% mobile</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>FAQ Transferts internationaux</h2>
      
      <h3>Quels sont les montants minimum et maximum ?</h3>
      <p>
        Minimum : 10 USD | Maximum : 10 000 USD par transaction. Pour des montants supérieurs, 
        contactez notre équipe commerciale.
      </p>

      <h3>Le destinataire doit-il avoir un compte Terex ?</h3>
      <p>
        Non, vous pouvez envoyer directement vers n'importe quel wallet USDT. Cependant, avoir un 
        compte Terex facilite la conversion en monnaie locale.
      </p>

      <h3>Combien de temps prend la conversion en monnaie locale ?</h3>
      <p>
        La conversion est instantanée. Le retrait via Mobile Money prend généralement 5-15 minutes.
      </p>

      <h2>Conclusion</h2>
      <p>
        Les transferts internationaux via Terex représentent une véritable révolution pour l'Afrique. 
        Rapides, économiques et accessibles, ils permettent à des millions de personnes d'envoyer et 
        recevoir de l'argent en toute simplicité. Rejoignez la nouvelle ère des transferts d'argent !
      </p>

      <div className="bg-terex-accent/10 border border-terex-accent/20 rounded-lg p-6 my-8">
        <p className="text-terex-accent font-medium mb-2">
          🚀 Commencez maintenant
        </p>
        <p className="text-gray-300 mb-0">
          Créez votre compte Terex gratuitement et effectuez votre premier transfert international 
          en quelques minutes. Profitez de frais réduits de 50% sur votre première transaction !
        </p>
      </div>
    </div>
  );

  return (
    <BlogArticle
      title="Transferts internationaux en Afrique : La révolution Terex"
      date="12 janvier 2025"
      readTime="10 min"
      category="Transferts"
      image={blogTransfertsImage}
      content={content}
    />
  );
}
