import { BlogArticle } from "@/components/blog/BlogArticle";
import blogBlockchainImage from "@/assets/blog-blockchain.png";

export default function BlockchainSimpleArticle() {
  const content = (
    <div className="prose prose-invert max-w-none">
      <p className="lead text-lg text-gray-300">
        La blockchain est souvent perçue comme une technologie complexe. Dans cet article, 
        nous vous expliquons simplement comment elle fonctionne et pourquoi elle révolutionne 
        la finance mondiale.
      </p>

      <h2>Qu'est-ce que la blockchain ?</h2>
      <p>
        Imaginez un grand livre de comptes que tout le monde peut consulter, mais que personne 
        ne peut modifier seul. C'est essentiellement ce qu'est une blockchain : un registre numérique 
        distribué et sécurisé.
      </p>

      <h3>L'analogie du livre de comptes partagé</h3>
      <p>
        Dans un village, chaque transaction est notée dans un grand livre public. Tout le monde 
        possède une copie identique de ce livre. Pour ajouter une nouvelle page, la majorité du 
        village doit être d'accord. C'est impossible de tricher car tout le monde vérifie.
      </p>

      <h2>Les composants de la blockchain</h2>
      
      <h3>1. Les blocs</h3>
      <p>
        Chaque "bloc" contient :
      </p>
      <ul>
        <li>Des transactions (transferts d'argent, contrats, etc.)</li>
        <li>Un timestamp (date et heure)</li>
        <li>Un lien vers le bloc précédent</li>
        <li>Un code de vérification unique (hash)</li>
      </ul>

      <h3>2. La chaîne</h3>
      <p>
        Les blocs sont liés entre eux comme les maillons d'une chaîne. Chaque nouveau bloc 
        référence le précédent, créant une séquence immuable.
      </p>

      <h3>3. Le réseau</h3>
      <p>
        Des milliers d'ordinateurs (nœuds) à travers le monde conservent une copie identique 
        de la blockchain. Cette distribution assure la sécurité et la résilience du système.
      </p>

      <h2>Comment fonctionne une transaction ?</h2>
      
      <p>Prenons l'exemple d'un transfert de 100 USDT de Marie à Paul :</p>

      <h3>Étape 1 : Initiation</h3>
      <p>
        Marie crée une transaction : "Envoyer 100 USDT à Paul". Elle la signe avec sa clé privée 
        (comme une signature numérique unique).
      </p>

      <h3>Étape 2 : Diffusion</h3>
      <p>
        La transaction est diffusée sur le réseau blockchain. Tous les nœuds la reçoivent et 
        vérifient qu'elle est valide (Marie a bien les fonds, la signature est correcte, etc.).
      </p>

      <h3>Étape 3 : Validation</h3>
      <p>
        Les "mineurs" ou "validateurs" regroupent plusieurs transactions dans un nouveau bloc 
        et le proposent au réseau. D'autres nœuds vérifient ce bloc.
      </p>

      <h3>Étape 4 : Ajout à la chaîne</h3>
      <p>
        Si le bloc est validé par la majorité du réseau, il est ajouté à la blockchain. 
        La transaction est maintenant permanente et irréversible.
      </p>

      <h3>Étape 5 : Confirmation</h3>
      <p>
        Paul voit les 100 USDT arriver dans son wallet. La transaction est confirmée et 
        enregistrée pour toujours.
      </p>

      <h2>Les avantages de la blockchain</h2>
      
      <h3>Décentralisation</h3>
      <p>
        Aucune entité unique ne contrôle la blockchain. Cela élimine les points de défaillance 
        et réduit la dépendance envers les institutions centralisées.
      </p>

      <h3>Transparence</h3>
      <p>
        Toutes les transactions sont visibles publiquement (bien que les identités soient anonymes). 
        Cette transparence rend la fraude très difficile.
      </p>

      <h3>Sécurité</h3>
      <p>
        Grâce à la cryptographie et à la distribution, modifier une transaction passée nécessiterait 
        de contrôler plus de 50% du réseau - pratiquement impossible sur les grandes blockchains.
      </p>

      <h3>Rapidité et disponibilité</h3>
      <p>
        La blockchain fonctionne 24/7, sans jours fériés. Les transactions internationales prennent 
        quelques minutes au lieu de plusieurs jours.
      </p>

      <h3>Réduction des coûts</h3>
      <p>
        En éliminant les intermédiaires, la blockchain réduit considérablement les frais de transaction, 
        particulièrement pour les transferts internationaux.
      </p>

      <h2>Types de blockchain</h2>
      
      <h3>Blockchain publique</h3>
      <p>
        Accessible à tous, comme Bitcoin ou Ethereum. N'importe qui peut consulter les transactions 
        et participer au réseau.
      </p>

      <h3>Blockchain privée</h3>
      <p>
        Contrôlée par une organisation spécifique. Utilisée par les entreprises pour des applications 
        internes nécessitant confidentialité.
      </p>

      <h3>Blockchain hybride</h3>
      <p>
        Combine éléments publics et privés. Offre un équilibre entre transparence et confidentialité.
      </p>

      <h2>Applications concrètes de la blockchain</h2>
      
      <h3>1. Cryptomonnaies</h3>
      <p>
        Bitcoin, Ethereum, USDT : des monnaies numériques fonctionnant sur blockchain, permettant 
        des transferts de valeur sans intermédiaires bancaires.
      </p>

      <h3>2. Transferts d'argent</h3>
      <p>
        Services comme Terex utilisent la blockchain pour offrir des transferts internationaux 
        rapides et économiques, particulièrement en Afrique.
      </p>

      <h3>3. Traçabilité</h3>
      <p>
        Suivi de produits de leur origine à la vente finale. Utile pour l'agriculture (café, cacao), 
        produits pharmaceutiques, diamants, etc.
      </p>

      <h3>4. Identité numérique</h3>
      <p>
        Stockage sécurisé de documents officiels : diplômes, certificats de naissance, titres de 
        propriété. L'Estonie utilise déjà cette technologie.
      </p>

      <h3>5. Contrats intelligents</h3>
      <p>
        Des "programmes" sur la blockchain qui s'exécutent automatiquement quand certaines conditions 
        sont remplies. Exemple : un paiement automatique quand une livraison est confirmée.
      </p>

      <h3>6. Vote électronique</h3>
      <p>
        Système de vote transparent et inviolable. Plusieurs pays expérimentent cette application 
        pour les élections.
      </p>

      <h2>Blockchain et USDT sur Terex</h2>
      <p>
        Terex utilise principalement la blockchain TRON (TRC20) pour les transactions USDT :
      </p>
      <ul>
        <li><strong>Rapidité</strong> : Transactions en quelques secondes</li>
        <li><strong>Frais minimes</strong> : Moins de 1 USDT par transaction</li>
        <li><strong>Fiabilité</strong> : Réseau éprouvé avec des millions de transactions quotidiennes</li>
        <li><strong>Compatibilité</strong> : Supporté par les principales plateformes d'échange</li>
      </ul>

      <h2>Les limites actuelles</h2>
      
      <h3>Évolutivité</h3>
      <p>
        Certaines blockchains sont limitées en nombre de transactions par seconde. Des solutions 
        de "layer 2" sont en développement.
      </p>

      <h3>Consommation énergétique</h3>
      <p>
        Le minage de certaines cryptomonnaies consomme beaucoup d'énergie. De nouvelles méthodes 
        plus écologiques comme le "Proof of Stake" émergent.
      </p>

      <h3>Régulation</h3>
      <p>
        Le cadre juridique évolue encore. Différents pays adoptent des approches variées vis-à-vis 
        des cryptomonnaies.
      </p>

      <h3>Adoption</h3>
      <p>
        Bien qu'en croissance, l'utilisation grand public nécessite encore plus d'éducation et 
        d'interfaces simplifiées.
      </p>

      <h2>L'avenir de la blockchain</h2>
      <p>
        La blockchain continue d'évoluer avec des innovations constantes :
      </p>
      <ul>
        <li>Interopérabilité entre différentes blockchains</li>
        <li>Solutions plus écologiques et scalables</li>
        <li>Intégration avec l'intelligence artificielle et l'IoT</li>
        <li>Monnaies numériques de banques centrales (CBDC)</li>
        <li>Applications en santé, éducation, gouvernance</li>
      </ul>

      <h2>Comment commencer ?</h2>
      <p>
        Vous n'avez pas besoin d'être expert en technologie pour utiliser la blockchain :
      </p>
      <ol>
        <li>Commencez par une plateforme simple comme Terex</li>
        <li>Effectuez de petites transactions pour comprendre le processus</li>
        <li>Apprenez progressivement les concepts de base</li>
        <li>Explorez les différentes applications à votre rythme</li>
      </ol>

      <h2>Conclusion</h2>
      <p>
        La blockchain n'est pas juste une technologie pour les experts en informatique. C'est un outil 
        qui peut bénéficier à tous en rendant les transactions plus rapides, moins chères et plus 
        transparentes. Avec des plateformes comme Terex, profiter des avantages de la blockchain 
        devient accessible à tous les Africains.
      </p>

      <div className="bg-terex-accent/10 border border-terex-accent/20 rounded-lg p-6 my-8">
        <p className="text-terex-accent font-medium mb-2">
          🎓 Pour aller plus loin
        </p>
        <p className="text-gray-300 mb-0">
          Consultez nos autres articles sur l'USDT et les transferts internationaux pour découvrir 
          comment utiliser concrètement la blockchain dans votre quotidien avec Terex.
        </p>
      </div>
    </div>
  );

  return (
    <BlogArticle
      title="La blockchain expliquée simplement"
      date="10 janvier 2025"
      readTime="12 min"
      category="Technologie"
      image={blogBlockchainImage}
      content={content}
    />
  );
}
