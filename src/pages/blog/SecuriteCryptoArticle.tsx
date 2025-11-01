import { BlogArticle } from "@/components/blog/BlogArticle";
import blogSecuriteImage from "@/assets/blog-securite.png";

export default function SecuriteCryptoArticle() {
  const content = (
    <div className="prose prose-invert max-w-none">
      <p className="lead text-lg text-gray-300">
        La sécurité est primordiale dans l'univers des cryptomonnaies. Découvrez les meilleures pratiques 
        pour protéger vos actifs numériques et effectuer des transactions en toute sérénité.
      </p>

      <h2>Pourquoi la sécurité est-elle cruciale ?</h2>
      <p>
        Les cryptomonnaies représentent une nouvelle forme de propriété numérique où vous êtes votre propre 
        banque. Cette liberté s'accompagne d'une responsabilité importante : celle de protéger vos actifs. 
        Contrairement aux comptes bancaires traditionnels, les transactions crypto sont irréversibles.
      </p>

      <h2>Les menaces principales</h2>
      <h3>1. Le phishing</h3>
      <p>
        Les attaquants créent de faux sites web ressemblant à des plateformes légitimes pour voler vos 
        identifiants. Vérifiez toujours l'URL et utilisez uniquement les liens officiels.
      </p>

      <h3>2. Les malwares</h3>
      <p>
        Des logiciels malveillants peuvent voler vos clés privées ou modifier les adresses de destination 
        lors des transferts. Maintenez vos appareils à jour et utilisez un antivirus fiable.
      </p>

      <h3>3. Les arnaques</h3>
      <p>
        Méfiez-vous des promesses de rendements garantis, des schémas pyramidaux et des offres trop belles 
        pour être vraies. Si c'est trop beau, c'est probablement une arnaque.
      </p>

      <h2>Les bonnes pratiques de sécurité</h2>
      
      <h3>Protection des mots de passe</h3>
      <ul>
        <li>Utilisez des mots de passe uniques et complexes (minimum 12 caractères)</li>
        <li>Activez l'authentification à deux facteurs (2FA) partout où c'est possible</li>
        <li>Utilisez un gestionnaire de mots de passe sécurisé</li>
        <li>Ne partagez jamais vos identifiants</li>
      </ul>

      <h3>Sécurisation des wallets</h3>
      <ul>
        <li>Conservez vos clés privées hors ligne (cold storage) pour les montants importants</li>
        <li>Notez votre phrase de récupération et stockez-la en lieu sûr</li>
        <li>Ne prenez jamais de photo de vos clés privées</li>
        <li>Utilisez plusieurs wallets pour diversifier les risques</li>
      </ul>

      <h3>Vérification des transactions</h3>
      <ul>
        <li>Vérifiez toujours l'adresse de destination avant d'envoyer</li>
        <li>Commencez par un petit montant test pour les nouvelles adresses</li>
        <li>Utilisez le bon réseau (TRC20, ERC20, etc.)</li>
        <li>Conservez les preuves de toutes vos transactions</li>
      </ul>

      <h2>Comment Terex protège vos transactions</h2>
      <p>
        Chez Terex, nous prenons la sécurité très au sérieux :
      </p>
      <ul>
        <li><strong>Vérification KYC</strong> : Nous vérifions l'identité de tous nos utilisateurs</li>
        <li><strong>Surveillance 24/7</strong> : Nos systèmes détectent les activités suspectes</li>
        <li><strong>Cryptage des données</strong> : Toutes vos informations sont cryptées</li>
        <li><strong>Équipe support</strong> : Notre équipe est disponible pour vous aider</li>
        <li><strong>Assurance des fonds</strong> : Vos dépôts sont protégés</li>
      </ul>

      <h2>Que faire en cas de problème ?</h2>
      <p>
        Si vous suspectez une activité frauduleuse ou avez été victime d'une arnaque :
      </p>
      <ol>
        <li>Changez immédiatement tous vos mots de passe</li>
        <li>Contactez notre équipe support via le chat en ligne</li>
        <li>Documentez tout : captures d'écran, emails, numéros de transaction</li>
        <li>Signalez l'incident aux autorités compétentes si nécessaire</li>
      </ol>

      <h2>Conseils pour débutants</h2>
      <ul>
        <li>Commencez avec de petits montants pour vous familiariser</li>
        <li>Éduquez-vous continuellement sur les nouvelles menaces</li>
        <li>Ne faites confiance qu'aux plateformes régulées comme Terex</li>
        <li>Méfiez-vous des conseils financiers non sollicités</li>
        <li>Ne cédez jamais à la pression ou à l'urgence</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        La sécurité dans le monde crypto repose principalement sur votre vigilance et vos bonnes pratiques. 
        En suivant ces recommandations et en utilisant une plateforme fiable comme Terex, vous pouvez 
        profiter des avantages des cryptomonnaies en minimisant les risques.
      </p>

      <div className="bg-terex-accent/10 border border-terex-accent/20 rounded-lg p-6 my-8">
        <p className="text-terex-accent font-medium mb-2">
          💡 Rappel important
        </p>
        <p className="text-gray-300 mb-0">
          Terex ne vous demandera JAMAIS vos mots de passe, clés privées ou codes 2FA. 
          Toute personne vous demandant ces informations est un escroc.
        </p>
      </div>
    </div>
  );

  return (
    <BlogArticle
      title="Sécurité des transactions crypto : Guide complet"
      date="15 janvier 2025"
      readTime="8 min"
      category="Sécurité"
      image={blogSecuriteImage}
      content={content}
    />
  );
}
