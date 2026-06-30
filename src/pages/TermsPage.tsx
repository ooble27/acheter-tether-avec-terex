import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const tocItems = [
  { id: "preambule", label: "1. Préambule et Identification" },
  { id: "definitions", label: "2. Définitions" },
  { id: "champ-application", label: "3. Champ d'Application" },
  { id: "description-services", label: "4. Description des Services" },
  { id: "eligibilite", label: "5. Conditions d'Éligibilité" },
  { id: "gestion-compte", label: "6. Gestion du Compte" },
  { id: "kyc-aml", label: "7. Vérification KYC/AML" },
  { id: "utilisation", label: "8. Utilisation des Services" },
  { id: "transactions", label: "9. Commandes et Transactions" },
  { id: "tarifs", label: "10. Tarifs et Commissions" },
  { id: "remboursement", label: "11. Politique de Remboursement" },
  { id: "securite-compte", label: "12. Sécurité et Authentification" },
  { id: "propriete-intellectuelle", label: "13. Propriété Intellectuelle" },
  { id: "donnees-personnelles", label: "14. Protection des Données" },
  { id: "confidentialite", label: "15. Confidentialité" },
  { id: "risques", label: "16. Risques Cryptomonnaies" },
  { id: "comportements-prohibes", label: "17. Comportements Prohibés" },
  { id: "suspension-resiliation", label: "18. Suspension et Résiliation" },
  { id: "limitation-responsabilite", label: "19. Limitation de Responsabilité" },
  { id: "indemnisation", label: "20. Indemnisation" },
  { id: "force-majeure", label: "21. Force Majeure" },
  { id: "modifications", label: "22. Modifications des Conditions" },
  { id: "divisibilite", label: "23. Divisibilité" },
  { id: "droit-applicable", label: "24. Droit Applicable et Juridiction" },
  { id: "contact", label: "25. Contact et Réclamations" },
];

const TermsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt" });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-20 md:pb-10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-[0.25em] mb-4">/ CONDITIONS D'UTILISATION</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-4 leading-tight">Conditions Générales<br className="hidden md:block" /> d'Utilisation</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-xs">
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">Version 3.0</span>
            <span>Dernière mise à jour : janvier 2025</span>
            <span>Terex — Teranga Exchange, Dakar, Sénégal</span>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <div className="bg-white/[0.03] border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-white/60 flex flex-wrap gap-2 items-center">
          <span className="font-semibold">Important :</span>
          <span>En utilisant les services Terex, vous acceptez l'intégralité des présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement avant toute utilisation de la plateforme.</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-10 py-12 md:py-16">

        {/* TOC sticky sidebar — desktop only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4">Table des matières</p>
            <nav className="space-y-0.5">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1.5 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.03] rounded-md transition-all leading-snug"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl space-y-14">

          {/* Section 1 */}
          <section id="preambule">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              1. Préambule et Identification
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les présentes Conditions Générales d'Utilisation (ci-après « CGU » ou « Conditions ») sont conclues entre Terex, opérant sous la dénomination commerciale Teranga Exchange (ci-après « Terex », « nous » ou « la Société »), société établie au Plateau, Avenue Léopold Sédar Senghor, Dakar, République du Sénégal, et toute personne physique ou morale (ci-après « l'Utilisateur » ou « vous ») souhaitant accéder et utiliser les services proposés par la plateforme Terex.</p>
              <p>Terex est une plateforme de services financiers numériques spécialisée dans l'échange de cryptomonnaies contre des devises fiduciaires, et notamment dans la conversion d'USDT (Tether) en monnaies locales africaines, avec un accent particulier sur les pays de l'espace UEMOA (Union Économique et Monétaire Ouest-Africaine). La Société opère en conformité avec les lois et réglementations applicables au Sénégal, notamment la loi uniforme relative à la lutte contre le blanchiment de capitaux et le financement du terrorisme de la BCEAO.</p>
              <p>La Société peut être contactée à l'adresse électronique suivante : terangaexchange@gmail.com. Pour toute question d'ordre juridique ou réglementaire, nous vous invitons à nous adresser un courrier à l'adresse physique susmentionnée ou à nous contacter via notre service de support en ligne disponible sur la plateforme.</p>
              <p>Les présentes CGU constituent un accord juridiquement contraignant entre vous et Terex. Elles définissent les droits et obligations respectifs des parties dans le cadre de l'utilisation des Services. Toute utilisation des Services implique l'acceptation pleine et entière des présentes CGU dans leur version en vigueur au moment de l'accès à la plateforme.</p>
              <p>En cas de divergence entre une version traduite des présentes CGU et la version française, la version française fait foi. Terex se réserve le droit de modifier les présentes CGU à tout moment, sous réserve du respect du délai de préavis stipulé à l'article 22 ci-après.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="definitions">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              2. Définitions
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Aux fins des présentes CGU, les termes suivants ont la signification qui leur est attribuée ci-dessous :</p>
              <p><strong className="text-foreground/80">« Compte »</strong> désigne le compte personnel créé par l'Utilisateur sur la Plateforme Terex, permettant l'accès aux Services. Chaque Utilisateur ne peut détenir qu'un seul Compte actif à la fois. Le Compte est strictement personnel et non cessible.</p>
              <p><strong className="text-foreground/80">« Cryptomonnaie » ou « Actif numérique »</strong> désigne toute représentation numérique d'une valeur reposant sur un protocole de registre distribué (blockchain), notamment les stablecoins tels que l'USDT (Tether), l'USDC (USD Coin), et tout autre actif numérique disponible sur la Plateforme.</p>
              <p><strong className="text-foreground/80">« USDT » ou « Tether »</strong> désigne le stablecoin émis par Tether Operations Limited, dont la valeur est indexée sur le dollar américain (USD) sur les réseaux TRC20 (Tron), ERC20 (Ethereum) et BEP20 (Binance Smart Chain). L'USDT constitue l'actif numérique principal traité sur la Plateforme Terex.</p>
              <p><strong className="text-foreground/80">« Mobile Money »</strong> désigne les services de paiement mobile disponibles en Afrique de l'Ouest, notamment Orange Money (Orange), Wave (Wave Mobile Money), Free Money (Free Sénégal), Wizall Money et tout autre service de paiement mobile compatible avec la Plateforme Terex.</p>
              <p><strong className="text-foreground/80">« KYC »</strong> (Know Your Customer — Connaissance Client) désigne l'ensemble des procédures de vérification et d'identification des Utilisateurs mises en place par Terex en conformité avec ses obligations légales en matière de lutte contre le blanchiment de capitaux et le financement du terrorisme (LCB-FT).</p>
              <p><strong className="text-foreground/80">« Transaction »</strong> désigne toute opération d'achat, de vente, de conversion ou de transfert d'actifs numériques effectuée par l'Utilisateur via la Plateforme Terex, incluant les transferts de cryptomonnaies vers des adresses de portefeuille externes et les conversions en monnaie fiduciaire.</p>
              <p><strong className="text-foreground/80">« Plateforme »</strong> désigne l'ensemble des interfaces numériques de Terex, incluant le site web accessible à l'adresse principale de la Société, l'application mobile (le cas échéant), ainsi que toutes les API et interfaces techniques permettant d'accéder aux Services.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="champ-application">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              3. Champ d'Application et Acceptation
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les présentes CGU s'appliquent à l'ensemble des services proposés par Terex, accessibles via la Plateforme en ligne. Elles régissent la relation contractuelle entre Terex et tout Utilisateur qui crée un Compte ou accède aux Services, y compris à titre occasionnel ou exploratoire.</p>
              <p>L'acceptation des présentes CGU intervient de manière expresse lors de la création du Compte, par le biais d'une case à cocher dédiée. Elle intervient également de manière tacite par toute utilisation des Services, même sans création formelle de Compte pour les fonctionnalités accessibles sans authentification. Cette acceptation vaut pour l'intégralité des présentes CGU, sans réserve ni exception.</p>
              <p>Les présentes CGU s'appliquent sans préjudice des conditions particulières susceptibles de régir certains Services spécifiques. En cas de contradiction entre les présentes CGU et des conditions particulières applicables à un Service donné, les conditions particulières prévalent sur les CGU pour ce Service spécifique uniquement.</p>
              <p>L'accès aux Services peut être conditionné à l'acceptation de politiques complémentaires, notamment la Politique de Confidentialité de Terex, la Politique de Lutte contre le Blanchiment de Capitaux, et toute autre politique sectorielle publiée sur la Plateforme. Ces politiques sont incorporées par référence aux présentes CGU et en font partie intégrante.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="description-services">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              4. Description des Services Terex
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex est une plateforme d'échange de cryptomonnaies contre devises fiduciaires (« crypto-to-fiat » et « fiat-to-crypto »), spécialement conçue pour les utilisateurs africains. Les Services proposés comprennent notamment l'achat d'USDT et d'autres cryptomonnaies sélectionnées via des moyens de paiement locaux (Mobile Money, virement bancaire, carte bancaire), ainsi que la vente de cryptomonnaies avec reversement des fonds en monnaie locale via Mobile Money ou virement bancaire.</p>
              <p>Terex propose également des services de transferts de cryptomonnaies vers des adresses de portefeuilles tiers, la conservation temporaire des actifs numériques dans le cadre du traitement des transactions, et des outils d'information sur les cours et les marchés des cryptomonnaies. La Plateforme met à disposition un système de suivi en temps réel des transactions en cours.</p>
              <p>Les Services de Terex sont accessibles dans les pays suivants : Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, et dans tous les pays où Terex est susceptible d'étendre son activité. La disponibilité des moyens de paiement spécifiques peut varier selon le pays de résidence de l'Utilisateur. Terex se réserve le droit de modifier la liste des pays desservis à tout moment, sous réserve de notification préalable aux Utilisateurs concernés.</p>
              <p>Terex n'est pas un établissement bancaire, un établissement de monnaie électronique, ni un prestataire de services d'investissement au sens strict de la réglementation applicable. Les Services proposés sont de nature opérationnelle et consistent à faciliter les échanges de valeur entre cryptomonnaies et monnaies fiduciaires. Terex ne garantit pas de rendement sur les actifs numériques et ne fournit pas de conseil en investissement.</p>
              <p>Les horaires de disponibilité des Services sont en principe continus (24h/24, 7j/7), sous réserve des interruptions nécessaires pour maintenance, mise à jour ou force majeure. Terex s'engage à notifier les Utilisateurs de toute interruption planifiée dans un délai raisonnable et à minimiser la durée des interruptions non planifiées.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="eligibilite">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              5. Conditions d'Éligibilité
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>L'accès aux Services Terex est réservé aux personnes physiques majeures, c'est-à-dire âgées d'au moins dix-huit (18) ans révolus à la date de création du Compte, et jouissant de leur pleine capacité juridique à contracter. Aucune dérogation à cette règle ne sera accordée, quelles que soient les circonstances. Toute tentative de fraude relative à l'âge entraînera la résiliation immédiate du Compte et la suspension des fonds le cas échéant.</p>
              <p>Les personnes morales (sociétés, associations, fondations, etc.) peuvent également accéder aux Services Terex, sous réserve de fournir les documents justificatifs requis dans le cadre de la procédure KYC/KYB (Know Your Business) applicable aux entités juridiques. Le représentant légal de la personne morale doit être dûment habilité à contracter au nom de celle-ci et être lui-même en conformité avec les conditions d'éligibilité applicables aux personnes physiques.</p>
              <p>L'accès aux Services est interdit aux personnes résidant dans des pays faisant l'objet de sanctions internationales, notamment ceux figurant sur les listes de l'Office of Foreign Assets Control (OFAC) des États-Unis, du Conseil de l'Union Européenne, des Nations Unies, ou de tout autre organisme de sanctions pertinent. L'Utilisateur déclare et garantit ne pas être soumis à de telles sanctions lors de son inscription et tout au long de l'utilisation des Services.</p>
              <p>L'Utilisateur doit disposer d'un accès à Internet stable et d'un terminal compatible (ordinateur, smartphone ou tablette) pour accéder à la Plateforme. Il est responsable des frais de connexion et d'équipement nécessaires à l'accès aux Services. Terex décline toute responsabilité en cas de dégradation du service liée à une connexion Internet insuffisante ou à un équipement non compatible.</p>
              <p>En accédant aux Services, l'Utilisateur déclare et garantit : (i) avoir l'âge légal requis et la capacité juridique nécessaire ; (ii) ne pas être sous tutelle ou curatelle ; (iii) agir en son nom propre et pour son compte personnel, ou, s'agissant d'une personne morale, être dûment autorisé à la représenter ; (iv) ne pas avoir fait l'objet d'une décision de suspension ou d'exclusion de la part de Terex par le passé.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="gestion-compte">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              6. Création et Gestion du Compte
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>La création d'un Compte sur la Plateforme Terex nécessite la fourniture d'informations exactes, complètes et à jour. L'Utilisateur s'engage à renseigner son nom complet tel qu'il figure sur ses documents d'identité officiels, son adresse e-mail valide (qui servira d'identifiant principal), son numéro de téléphone mobile actif, et sa date de naissance. Toute information fausse ou inexacte fournie lors de l'inscription est susceptible d'entraîner la résiliation immédiate du Compte.</p>
              <p>Chaque Utilisateur ne peut détenir qu'un seul et unique Compte sur la Plateforme. La création de comptes multiples, que ce soit sous des identités différentes ou en utilisant des informations partiellement modifiées, est strictement prohibée et constitue une violation grave des présentes CGU. Terex se réserve le droit de procéder à des vérifications croisées pour détecter les comptes multiples et de les suspendre sans préavis.</p>
              <p>L'Utilisateur est responsable de la confidentialité de ses identifiants de connexion (adresse e-mail et mot de passe) et de toute activité effectuée depuis son Compte. Il s'engage à choisir un mot de passe robuste, composé d'au moins douze (12) caractères incluant des lettres majuscules et minuscules, des chiffres et des caractères spéciaux, et à le modifier régulièrement. Il est fortement recommandé d'activer l'authentification à deux facteurs (2FA) dès la création du Compte.</p>
              <p>En cas de perte, de vol ou de compromission des identifiants de connexion, l'Utilisateur doit immédiatement en informer Terex via les canaux de support disponibles sur la Plateforme. Terex procédera sans délai à la sécurisation du Compte. La responsabilité de Terex ne saurait être engagée pour les dommages résultant d'une utilisation non autorisée du Compte avant la notification de la compromission.</p>
              <p>L'Utilisateur s'engage à maintenir ses informations de profil à jour, notamment son adresse e-mail, son numéro de téléphone et son adresse de résidence. Tout changement significatif devra être communiqué à Terex dans les plus brefs délais et pourra nécessiter la production de nouveaux justificatifs dans le cadre du processus KYC.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="kyc-aml">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              7. Vérification d'Identité (KYC/AML)
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Conformément aux obligations légales imposées par la loi uniforme relative à la lutte contre le blanchiment de capitaux et le financement du terrorisme adoptée par les États membres de l'UEMOA, ainsi qu'aux directives de la BCEAO (Banque Centrale des États de l'Afrique de l'Ouest) et aux meilleures pratiques internationales du Groupe d'Action Financière (GAFI), Terex est tenu de mettre en place et d'appliquer rigoureusement des procédures de Connaissance Client (KYC) et de vigilance anti-blanchiment (AML).</p>
              <p>La vérification d'identité est obligatoire pour accéder à l'ensemble des fonctionnalités de la Plateforme. Elle comprend obligatoirement : la fourniture d'une pièce d'identité officielle en cours de validité (carte nationale d'identité, passeport biométrique ou titre de séjour), un justificatif de domicile de moins de trois (3) mois (facture d'électricité, d'eau, relevé bancaire ou tout document officiel comportant l'adresse), et une photo de l'Utilisateur tenant sa pièce d'identité (procédure dite « selfie avec document »).</p>
              <p>Les niveaux de vérification sont progressifs. Le niveau 1 (identité de base) permet d'effectuer des transactions jusqu'à 500 000 FCFA par mois. Le niveau 2 (vérification complète avec justificatif de domicile) permet des transactions jusqu'à 5 000 000 FCFA par mois. Des niveaux supplémentaires peuvent être requis pour les volumes plus importants, impliquant la fourniture de documents supplémentaires tels qu'une déclaration de revenus, des relevés bancaires ou un justificatif de la source des fonds.</p>
              <p>Terex se réserve le droit de demander des documents complémentaires à tout moment, notamment en cas de transaction atypique, de changement dans le profil d'utilisation ou de doute quant à l'identité de l'Utilisateur. En cas de refus de l'Utilisateur de se conformer à ces demandes, Terex est en droit de suspendre le Compte et de bloquer les transactions en cours jusqu'à résolution de la situation.</p>
              <p>Les informations collectées dans le cadre du KYC sont traitées conformément à la Politique de Confidentialité de Terex et aux dispositions légales applicables. Elles ne sont communiquées qu'aux autorités compétentes en cas d'obligation légale et aux prestataires de services de vérification d'identité mandatés par Terex, dans le strict cadre contractuel et sous couvert d'engagements de confidentialité.</p>
              <p>Terex applique des procédures de surveillance continue des transactions afin de détecter toute activité suspecte. En cas de détection d'une telle activité, Terex est tenu de procéder à une déclaration de soupçon auprès des autorités compétentes (CENTIF — Cellule Nationale de Traitement des Informations Financières du Sénégal), conformément à ses obligations légales, sans en informer préalablement l'Utilisateur concerné.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="utilisation">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              8. Utilisation des Services
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>L'Utilisateur s'engage à utiliser les Services Terex de manière loyale, légale et conforme aux présentes CGU. L'utilisation des Services est strictement personnelle et ne peut faire l'objet d'une cession, d'une sous-licence ou d'un transfert à titre onéreux ou gratuit à un tiers, sauf autorisation expresse et préalable de Terex. L'Utilisateur ne peut notamment pas permettre à un tiers d'accéder à son Compte ou d'utiliser ses identifiants de connexion.</p>
              <p>Terex met à disposition de l'Utilisateur un tableau de bord permettant de visualiser son solde, l'historique de ses transactions, le statut de ses vérifications KYC et les taux de change en vigueur. Ces informations sont fournies à titre indicatif et peuvent être sujettes à des délais de mise à jour. L'Utilisateur est invité à vérifier les informations critiques (taux de change, frais) avant de confirmer toute transaction.</p>
              <p>L'Utilisateur reconnaît que les taux de change des cryptomonnaies sont volatils et peuvent évoluer significativement dans un délai très court. Terex applique un taux de change indicatif au moment de l'initiation de la transaction, qui peut légèrement différer du taux définitif au moment de l'exécution, en raison des fluctuations du marché. Un slippage maximum est indiqué pour chaque transaction.</p>
              <p>L'accès aux Services peut être restreint ou interrompu temporairement en cas de maintenance programmée, de mise à jour des systèmes, de problèmes techniques imprévus ou de force majeure. Terex s'efforce de notifier les Utilisateurs au préalable en cas de maintenance planifiée et de réduire au minimum les interruptions de service. Terex décline toute responsabilité pour les pertes ou préjudices résultant d'une interruption de service indépendante de sa volonté.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="transactions">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              9. Commandes et Transactions
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Toute transaction initiée sur la Plateforme Terex suit un processus en plusieurs étapes. L'Utilisateur sélectionne le type d'opération souhaité (achat ou vente de cryptomonnaies), le montant et le moyen de paiement. Un récapitulatif détaillé de la transaction — incluant le taux de change applicable, les frais de service et le montant net — est présenté à l'Utilisateur avant confirmation. La transaction n'est initiée qu'après confirmation explicite de l'Utilisateur.</p>
              <p>Une fois confirmée, la transaction est engageante et ne peut être annulée que dans les conditions strictement définies à l'article 11 (Politique de Remboursement). L'Utilisateur reconnaît que les transactions en cryptomonnaies, une fois diffusées sur la blockchain, sont irréversibles par nature. Terex ne peut en aucun cas annuler ou inverser une transaction blockchain confirmée, même en cas de demande expresse de l'Utilisateur.</p>
              <p>Les délais de traitement des transactions varient selon le moyen de paiement utilisé et les conditions du réseau blockchain. Pour les achats via Mobile Money, le délai habituel est de cinq (5) à trente (30) minutes. Pour les ventes avec reversement via Mobile Money, le délai habituel est de cinq (5) à soixante (60) minutes. Ces délais sont fournis à titre indicatif et peuvent être prolongés en cas de congestion du réseau blockchain, de problème technique avec l'opérateur de paiement ou de nécessité de vérification supplémentaire.</p>
              <p>Terex se réserve le droit de refuser ou de suspendre une transaction si elle présente des caractéristiques susceptibles d'indiquer une activité frauduleuse, un blanchiment de capitaux ou une violation des présentes CGU. En cas de suspension, l'Utilisateur en sera informé et pourra être invité à fournir des justificatifs complémentaires. Les fonds liés à une transaction suspendue seront soit restitués, soit transmis aux autorités compétentes selon les circonstances.</p>
              <p>Les limites de transaction applicables à chaque niveau de compte sont affichées dans l'espace utilisateur et peuvent être modifiées par Terex en fonction des exigences réglementaires ou des politiques internes. L'Utilisateur s'engage à respecter ces limites et reconnaît que toute tentative de contournement (notamment par la fragmentation artificielle des transactions, dite « smurfing ») constitue une violation grave des CGU et des lois anti-blanchiment.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="tarifs">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              10. Tarifs, Frais et Commissions
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex applique une grille tarifaire transparente, disponible en permanence sur la Plateforme. Les frais de service sont calculés en pourcentage du montant de la transaction et sont clairement affichés avant toute confirmation. L'Utilisateur accepte expressément les frais applicables à chaque transaction au moment de sa confirmation.</p>
              <p>Les frais standard applicables aux opérations courantes sont les suivants : pour l'achat d'USDT, une commission de service de 1% à 2% du montant total de la transaction est appliquée selon le moyen de paiement utilisé. Pour la vente d'USDT avec reversement en Mobile Money, une commission de 1% à 1,5% est appliquée. Ces taux sont susceptibles d'évoluer en fonction des conditions du marché et des coûts opérationnels, dans le respect du délai de notification préalable.</p>
              <p>Des frais de réseau blockchain (« gas fees » ou frais de transaction) s'ajoutent aux frais de service Terex pour les transactions impliquant un transfert sur la blockchain. Ces frais sont déterminés par les conditions du réseau (Tron, Ethereum, Binance Smart Chain) au moment de la transaction et ne sont pas contrôlés par Terex. Ils sont estimés et présentés à l'Utilisateur avant confirmation de la transaction.</p>
              <p>Des frais spéciaux peuvent s'appliquer dans certaines circonstances : frais d'urgence pour traitement prioritaire des transactions, frais de vérification d'identité accélérée, ou frais liés à des demandes de services exceptionnels. Ces frais additionnels sont systématiquement communiqués à l'Utilisateur avant tout engagement de sa part.</p>
              <p>Terex se réserve le droit de modifier sa grille tarifaire à tout moment. Toute modification des tarifs sera communiquée aux Utilisateurs par e-mail et par notification sur la Plateforme au moins trente (30) jours avant son entrée en vigueur. L'utilisation des Services après cette période vaut acceptation des nouveaux tarifs. Si l'Utilisateur n'accepte pas les nouveaux tarifs, il lui appartient de clôturer son Compte avant l'entrée en vigueur des modifications.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="remboursement">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              11. Politique de Remboursement
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>En raison de la nature irréversible des transactions en cryptomonnaies et des contraintes techniques inhérentes aux réseaux blockchain, la politique de remboursement de Terex est strictement encadrée. En règle générale, toute transaction confirmée et exécutée est définitive et ne peut faire l'objet d'un remboursement. L'Utilisateur est invité à vérifier attentivement tous les détails de sa transaction avant de la confirmer.</p>
              <p>Des remboursements peuvent être accordés dans les cas limitatifs suivants : (i) erreur technique avérée de la part de Terex ayant conduit à une exécution incorrecte de la transaction (montant erroné, taux de change incorrect non annoncé) ; (ii) double débit constaté sur le compte de paiement de l'Utilisateur suite à un dysfonctionnement technique ; (iii) transaction annulée par l'Utilisateur avant son exécution effective, dans un délai de quinze (15) minutes suivant la confirmation, si l'opération n'a pas encore été initiée sur la blockchain.</p>
              <p>Pour demander un remboursement, l'Utilisateur doit contacter le service support de Terex dans un délai maximum de quarante-huit (48) heures suivant la date de la transaction litigieuse, en fournissant l'identifiant de la transaction, le montant concerné, une description précise du problème et tout justificatif disponible (capture d'écran, relevé de Mobile Money). Les demandes de remboursement reçues au-delà de ce délai ne pourront être traitées.</p>
              <p>Terex s'engage à traiter les demandes de remboursement éligibles dans un délai de cinq (5) à dix (10) jours ouvrables suivant la réception et validation de la demande. Le remboursement s'effectue vers le même moyen de paiement utilisé lors de la transaction initiale. Les frais de service initialement perçus sont remboursés uniquement en cas d'erreur technique de Terex ; ils restent acquis à Terex dans tous les autres cas.</p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="securite-compte">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              12. Sécurité du Compte et Authentification
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>La sécurité des comptes Utilisateurs est une priorité absolue pour Terex. La Société déploie des mesures de sécurité techniques et organisationnelles de niveau professionnel, incluant le chiffrement des données en transit (TLS 1.3) et au repos (AES-256), la surveillance continue des systèmes, des audits de sécurité réguliers réalisés par des prestataires indépendants, et des procédures de détection et de réponse aux incidents.</p>
              <p>L'authentification à deux facteurs (2FA) est fortement recommandée et peut être rendue obligatoire pour certaines opérations sensibles (modifications des paramètres de compte, retraits importants). Le 2FA peut être mis en place via une application d'authentification (Google Authenticator, Authy) ou par SMS. Terex déconseille l'utilisation du 2FA par SMS dans les zones à risque élevé de SIM-swapping et recommande l'utilisation d'une application d'authentification.</p>
              <p>L'Utilisateur est responsable de la sécurité de ses appareils et de son environnement informatique. Il s'engage à ne pas accéder aux Services depuis des réseaux Wi-Fi publics non sécurisés, à maintenir ses appareils à jour avec les derniers correctifs de sécurité, à utiliser un logiciel antivirus actif, et à ne jamais partager ses identifiants avec quiconque, y compris le personnel prétendu de Terex.</p>
              <p>Terex ne demandera jamais à l'Utilisateur de communiquer son mot de passe, son code 2FA ou ses clés privées de portefeuille par e-mail, téléphone ou message instantané. Toute demande en ce sens doit être considérée comme une tentative de phishing et signalée immédiatement à Terex via les canaux officiels de support.</p>
              <p>En cas de détection d'une activité suspecte sur le Compte (connexion depuis un pays inhabituellement, tentatives d'authentification répétées), Terex se réserve le droit de bloquer temporairement l'accès au Compte et d'exiger une vérification d'identité renforcée avant de rétablir l'accès. Cette mesure de protection, même si elle peut s'avérer contraignante, vise à protéger les actifs de l'Utilisateur.</p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="propriete-intellectuelle">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              13. Propriété Intellectuelle
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>La Plateforme Terex, son contenu, son code source, ses interfaces graphiques, ses logos, ses marques, ses slogans, sa charte graphique, ses bases de données, ses algorithmes et l'ensemble des éléments qui la composent sont la propriété exclusive de Terex ou de ses concédants de licence. Ils sont protégés par les lois et conventions internationales relatives à la propriété intellectuelle, notamment les droits d'auteur, les droits sur les marques et les droits sui generis sur les bases de données.</p>
              <p>Terex accorde à l'Utilisateur une licence non exclusive, non transférable, limitée et révocable d'accès et d'utilisation de la Plateforme aux fins strictement personnelles et non commerciales décrites dans les présentes CGU. Cette licence ne constitue en aucun cas un transfert de propriété et ne confère à l'Utilisateur aucun droit sur les éléments de propriété intellectuelle de Terex, au-delà du droit d'usage limité ci-dessus.</p>
              <p>Il est strictement interdit de reproduire, copier, modifier, créer des œuvres dérivées, distribuer, vendre, concéder sous licence, décompiler, désassembler, procéder à de l'ingénierie inverse ou tenter d'extraire le code source de la Plateforme Terex, en tout ou en partie, sans l'autorisation écrite préalable de Terex. Toute violation de ces dispositions expose le contrevenant à des poursuites civiles et pénales.</p>
              <p>Les marques « Terex » et « Teranga Exchange », ainsi que tous les logos et signes distinctifs associés, sont des marques déposées ou en cours de dépôt de Terex. Leur utilisation sans autorisation écrite préalable est prohibée. Toute utilisation abusive ou contrefaisante de ces marques sera poursuivie devant les juridictions compétentes.</p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="donnees-personnelles">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              14. Protection des Données Personnelles
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex accorde une importance fondamentale à la protection des données personnelles de ses Utilisateurs. Le traitement des données personnelles est encadré par la Politique de Confidentialité de Terex, disponible sur la Plateforme, qui constitue un document contractuel faisant partie intégrante des présentes CGU. L'Utilisateur est invité à consulter attentivement cette politique avant de créer son Compte.</p>
              <p>Terex collecte et traite les données personnelles des Utilisateurs dans le cadre de l'exécution du contrat de services, du respect de ses obligations légales (notamment en matière de KYC/AML), de ses intérêts légitimes (prévention de la fraude, amélioration des services, sécurité informatique) et, le cas échéant, du consentement de l'Utilisateur pour les traitements optionnels (communications marketing).</p>
              <p>En accord avec la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel et les principes du Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne, les Utilisateurs bénéficient de droits d'accès, de rectification, d'effacement, de portabilité et d'opposition relatifs à leurs données personnelles, dans les conditions précisées dans la Politique de Confidentialité.</p>
              <p>Terex s'engage à ne jamais vendre les données personnelles de ses Utilisateurs à des tiers à des fins commerciales. Le partage de données avec des tiers est strictement limité aux cas nécessaires à l'exécution des services (prestataires techniques, opérateurs de paiement) et aux cas d'obligation légale (autorités judiciaires et administratives compétentes).</p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="confidentialite">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              15. Confidentialité et Secret Professionnel
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex est soumis à une obligation de confidentialité professionnelle concernant toutes les informations relatives aux transactions et à la situation financière de ses Utilisateurs. Cette obligation s'étend à l'ensemble du personnel de Terex et à ses sous-traitants, qui sont liés par des clauses de confidentialité contractuelles strictes. Le secret professionnel ne peut être levé qu'en cas d'obligation légale ou judiciaire expressément prévue par la loi.</p>
              <p>L'Utilisateur reconnaît que Terex peut être tenu de divulguer des informations confidentielles aux autorités compétentes dans le cadre de ses obligations légales en matière de lutte contre le blanchiment de capitaux et le financement du terrorisme, de contrôle fiscal, ou de toute autre procédure judiciaire ou administrative. Dans ces cas, Terex n'est pas autorisé à informer préalablement l'Utilisateur concerné de cette divulgation.</p>
              <p>De même, l'Utilisateur s'engage à maintenir la confidentialité des informations techniques (notamment les détails de l'API, les procédures internes communiquées par Terex) dont il pourrait prendre connaissance dans le cadre de l'utilisation des Services. Il s'engage également à ne pas divulguer publiquement des informations susceptibles de nuire à la réputation ou aux intérêts légitimes de Terex.</p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="risques">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              16. Risques liés aux Cryptomonnaies
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>L'Utilisateur reconnaît expressément que les cryptomonnaies, y compris les stablecoins tels que l'USDT, comportent des risques spécifiques et inhérents à leur nature. Ces risques incluent, sans s'y limiter : la volatilité des prix (particulièrement marquée pour les cryptomonnaies non indexées), le risque technologique lié aux failles potentielles des protocoles blockchain, le risque de contrepartie lié à la solvabilité des émetteurs de stablecoins, et le risque réglementaire lié à l'évolution des cadres juridiques nationaux et internationaux applicables aux actifs numériques.</p>
              <p>Les stablecoins comme l'USDT sont conçus pour maintenir une parité avec le dollar américain, mais cette stabilité n'est pas garantie absolument. Des événements exceptionnels (problèmes de liquidité de l'émetteur, crises de marché, attaques informatiques) peuvent entraîner une dépréciation temporaire ou permanente de la valeur d'un stablecoin. L'Utilisateur accepte ce risque résiduel en utilisant les Services Terex.</p>
              <p>Les transactions en cryptomonnaies sont diffusées sur des réseaux blockchain publics et décentralisés. Une fois confirmée par le réseau, une transaction est irréversible. L'envoi de cryptomonnaies à une adresse incorrecte entraîne une perte définitive et irrécupérable des fonds. Terex ne peut en aucun cas annuler ou inverser une transaction blockchain confirmée. L'Utilisateur est donc invité à vérifier minutieusement l'adresse de destination avant de confirmer tout envoi de cryptomonnaies.</p>
              <p>Le cadre réglementaire applicable aux cryptomonnaies est en constante évolution dans la plupart des pays, y compris au Sénégal et dans l'espace UEMOA. Des changements réglementaires peuvent avoir un impact significatif sur la disponibilité des Services, les conditions d'utilisation ou la valeur des actifs numériques. Terex ne peut être tenu responsable des conséquences de tels changements réglementaires sur la situation de l'Utilisateur.</p>
              <p>Terex ne fournit aucun conseil en investissement, fiscal ou juridique. Les informations disponibles sur la Plateforme (cours, analyses de marché, articles de blog) sont fournies à titre purement informatif et ne constituent pas des recommandations d'investissement. L'Utilisateur prend ses décisions d'investissement sous sa seule et entière responsabilité, après avoir consulté les conseillers professionnels appropriés le cas échéant.</p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="comportements-prohibes">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              17. Comportements Prohibés
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>L'utilisation des Services Terex est strictement interdite pour les activités suivantes, qui sont contraires aux lois applicables et aux présentes CGU : le blanchiment de capitaux sous toutes ses formes, le financement du terrorisme ou d'organisations terroristes, le financement de la prolifération d'armes de destruction massive, et toute autre activité liée à des groupes criminels organisés ou des entités sous sanctions internationales.</p>
              <p>Il est également prohibé d'utiliser les Services pour : la fraude fiscale et toute tentative d'évasion fiscale illégale ; les activités liées au trafic de stupéfiants, d'armes, d'êtres humains ou d'espèces protégées ; le piratage informatique, la cybercriminalité et toute activité portant atteinte à des systèmes informatiques tiers ; la diffusion de contenus illégaux (pédopornographie, incitation à la haine raciale, etc.) ; et plus généralement, toute activité contraire à l'ordre public et aux bonnes mœurs.</p>
              <p>Sur le plan technique, sont prohibés : toute tentative de contournement des mesures de sécurité de la Plateforme ; l'utilisation de bots, scripts automatisés ou robots d'exploration non autorisés ; les attaques de type déni de service (DDoS) ou toute autre forme d'attaque informatique ; la manipulation des cours ou la création de fausses transactions pour créer une apparence de liquidité artificielle ; et l'utilisation d'informations privilégiées ou confidentielles pour réaliser des transactions.</p>
              <p>La création de comptes multiples pour contourner les limites de transaction, l'utilisation de l'identité d'un tiers ou de faux documents, et le partage de son Compte avec des tiers sont également strictement prohibés. Terex se réserve le droit de détecter ces comportements par des moyens techniques avancés et de prendre les mesures appropriées, incluant la suspension immédiate du Compte et le signalement aux autorités compétentes.</p>
            </div>
          </section>

          {/* Section 18 */}
          <section id="suspension-resiliation">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              18. Suspension et Résiliation
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex se réserve le droit de suspendre temporairement ou de résilier définitivement le Compte d'un Utilisateur dans les cas suivants : violation des présentes CGU ; fournissement d'informations fausses lors de l'inscription ou du processus KYC ; activité suspecte au regard des règles LCB-FT ; non-respect des demandes de documents complémentaires dans un délai raisonnable ; décision judiciaire ou administrative requérant la suspension ou la clôture du Compte ; et à la suite de toute procédure de faillite ou d'insolvabilité impliquant l'Utilisateur.</p>
              <p>En cas de suspension pour suspicion d'activité frauduleuse ou illégale, Terex n'est pas tenu d'informer préalablement l'Utilisateur. Dans tous les autres cas, Terex s'efforce de notifier l'Utilisateur par e-mail avant de procéder à la suspension, en indiquant les motifs et la durée prévisible. L'Utilisateur dispose d'un délai de quinze (15) jours pour faire valoir ses observations et régulariser sa situation.</p>
              <p>En cas de résiliation définitive du Compte pour violation grave des CGU (fraude avérée, blanchiment de capitaux, etc.), les fonds présents sur le Compte peuvent être conservés dans l'attente des décisions judiciaires ou administratives compétentes. Terex ne procède pas à la restitution de fonds dont l'origine illicite est avérée ou fortement suspectée.</p>
              <p>L'Utilisateur peut clôturer son Compte à tout moment, sans frais, en adressant une demande écrite au service support de Terex. La clôture du Compte entraîne la cessation immédiate de l'accès aux Services. Les obligations légales de conservation des données (notamment dans le cadre du KYC/AML) restent applicables postérieurement à la clôture du Compte, conformément aux dispositions de la Politique de Confidentialité.</p>
              <p>En cas de clôture du Compte à l'initiative de Terex pour motif non lié à une activité frauduleuse, les fonds éventuellement présents sur la Plateforme sont restitués à l'Utilisateur dans un délai raisonnable, déduction faite des frais éventuellement dus. Les modalités de restitution sont déterminées en concertation avec l'Utilisateur.</p>
            </div>
          </section>

          {/* Section 19 */}
          <section id="limitation-responsabilite">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              19. Limitation de Responsabilité
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Dans toute la mesure permise par le droit applicable, Terex exclut toute responsabilité pour les dommages indirects, consécutifs, accessoires, spéciaux ou exemplaires, incluant notamment la perte de profits, la perte de revenus, la perte de données, les dommages à la réputation, ou toute autre perte immatérielle, même si Terex a été informé de la possibilité de tels dommages.</p>
              <p>La responsabilité totale de Terex, toutes causes confondues, est limitée au montant des frais de service effectivement payés par l'Utilisateur au titre de la transaction à l'origine du dommage, ou, en l'absence d'une telle transaction identifiable, à un montant maximum de cinquante mille (50 000) FCFA. Cette limitation de responsabilité s'applique dans toute la mesure autorisée par le droit sénégalais applicable.</p>
              <p>Terex n'est pas responsable des interruptions de service dues à des facteurs indépendants de sa volonté, notamment les pannes des réseaux de télécommunications, les coupures d'électricité, les congestions des réseaux blockchain, les défaillances des opérateurs de paiement tiers, ou les attaques informatiques de grande ampleur. Terex s'engage à déployer tous les efforts raisonnables pour minimiser ces interruptions et leurs conséquences.</p>
              <p>Terex n'est pas responsable des pertes résultant de l'utilisation non autorisée du Compte de l'Utilisateur due à une négligence de celui-ci dans la protection de ses identifiants. Terex n'est pas non plus responsable des pertes résultant de décisions d'investissement prises par l'Utilisateur sur la base des informations disponibles sur la Plateforme, celles-ci étant fournies à titre purement informatif.</p>
            </div>
          </section>

          {/* Section 20 */}
          <section id="indemnisation">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              20. Indemnisation
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>L'Utilisateur s'engage à indemniser, défendre et tenir Terex, ses dirigeants, employés, partenaires et agents indemnes de toute réclamation, poursuite, dommage, perte, responsabilité, coût et dépense (y compris les honoraires d'avocat raisonnables) résultant de : (i) la violation par l'Utilisateur des présentes CGU ou de toute loi applicable ; (ii) l'utilisation des Services en violation des présentes CGU ; (iii) la fourniture d'informations fausses ou inexactes lors de l'inscription ou à tout moment de l'utilisation des Services.</p>
              <p>Cette obligation d'indemnisation couvre notamment les dommages causés à des tiers en relation avec l'utilisation des Services par l'Utilisateur, les frais de procédure judiciaire ou administrative engagés par Terex en raison du comportement de l'Utilisateur, et les amendes ou pénalités infligées à Terex par des autorités de régulation en raison d'une violation imputable à l'Utilisateur.</p>
              <p>Terex se réserve le droit d'assurer à ses propres frais la défense et le contrôle exclusif de toute affaire susceptible de donner lieu à une obligation d'indemnisation de la part de l'Utilisateur. Dans ce cas, l'Utilisateur coopère pleinement avec Terex pour faire valoir tous les moyens de défense disponibles.</p>
            </div>
          </section>

          {/* Section 21 */}
          <section id="force-majeure">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              21. Force Majeure
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex n'est pas responsable de tout retard ou manquement dans l'exécution de ses obligations résultant d'un événement de force majeure, c'est-à-dire tout événement extérieur, imprévisible et irrésistible au sens du droit sénégalais applicable. Constituent notamment des cas de force majeure : les catastrophes naturelles (tremblements de terre, inondations, tempêtes), les pandémies, les actes de guerre ou de terrorisme, les émeutes et troubles civils, les décisions gouvernementales (embargos, interdictions réglementaires), les pannes massives des infrastructures Internet, et les attaques informatiques de grande ampleur sur les infrastructures critiques.</p>
              <p>En cas d'événement de force majeure, Terex en informe l'Utilisateur dès que possible et s'efforce de reprendre l'exécution normale des Services dans les meilleurs délais. Si l'événement de force majeure se prolonge au-delà de trente (30) jours consécutifs, chacune des parties peut résilier le contrat de services par notification écrite, sans indemnité de part et d'autre, sous réserve de la restitution des fonds déjà versés pour des services non encore exécutés.</p>
              <p>Les perturbations des réseaux blockchain (congestion, hard fork, attaques sur le consensus), bien que susceptibles d'affecter l'exécution des transactions, ne sont en principe pas constitutives d'un cas de force majeure au sens strict, mais constituent des aléas inhérents à la nature des cryptomonnaies que l'Utilisateur accepte expressément en utilisant les Services Terex.</p>
            </div>
          </section>

          {/* Section 22 */}
          <section id="modifications">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              22. Modifications des Conditions
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex se réserve le droit de modifier les présentes CGU à tout moment, afin de les adapter à l'évolution de ses Services, aux changements réglementaires applicables, ou à toute autre nécessité opérationnelle ou juridique. Toute modification substantielle des CGU est portée à la connaissance des Utilisateurs par notification par e-mail envoyée à l'adresse enregistrée sur leur Compte, et par affichage d'un avis bien visible sur la Plateforme.</p>
              <p>Le délai de préavis applicable aux modifications substantielles est de trente (30) jours à compter de la date de notification. Les modifications mineures (corrections orthographiques, clarifications rédactionnelles n'affectant pas les droits et obligations des parties) peuvent entrer en vigueur sans délai. La version en vigueur des CGU est toujours accessible sur la Plateforme, avec indication de la date de la dernière mise à jour et du numéro de version.</p>
              <p>À l'expiration du délai de préavis, la poursuite de l'utilisation des Services par l'Utilisateur vaut acceptation des nouvelles CGU. Si l'Utilisateur n'accepte pas les modifications apportées aux CGU, il dispose de la faculté de clôturer son Compte sans frais ni pénalité avant l'entrée en vigueur des nouvelles dispositions.</p>
            </div>
          </section>

          {/* Section 23 */}
          <section id="divisibilite">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              23. Divisibilité
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Si l'une quelconque des dispositions des présentes CGU est déclarée nulle, invalide ou inapplicable par une juridiction compétente, cette disposition sera réputée non écrite, et les autres dispositions resteront en vigueur et conserveront leur plein effet entre les parties. Les parties conviennent de négocier de bonne foi une clause de remplacement qui reflète au mieux l'intention initiale des parties et soit conforme au droit applicable.</p>
              <p>Le fait pour Terex de ne pas exercer ou de tarder à exercer un droit ou un recours prévu par les présentes CGU ne constitue pas une renonciation à ce droit ou recours. De même, l'exercice partiel d'un droit ou d'un recours ne fait pas obstacle à son exercice ultérieur. Les droits et recours prévus dans les présentes CGU sont cumulatifs et non exclusifs de tout autre droit ou recours prévu par la loi.</p>
            </div>
          </section>

          {/* Section 24 */}
          <section id="droit-applicable">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              24. Droit Applicable et Juridiction Compétente
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les présentes CGU sont régies, interprétées et appliquées conformément au droit sénégalais, sans égard aux règles de conflit de lois qui pourraient conduire à l'application d'une autre législation. Les dispositions du Code des Obligations Civiles et Commerciales (COCC) du Sénégal, ainsi que les actes uniformes de l'OHADA (Organisation pour l'Harmonisation en Afrique du Droit des Affaires) applicables, constituent la loi de référence pour l'interprétation des présentes CGU.</p>
              <p>En cas de litige relatif à l'interprétation, l'exécution ou la résiliation des présentes CGU, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À cette fin, l'Utilisateur adresse une réclamation écrite à Terex par e-mail à terangaexchange@gmail.com. Terex dispose d'un délai de trente (30) jours à compter de la réception de la réclamation pour y répondre et proposer une solution amiable.</p>
              <p>À défaut de règlement amiable dans le délai susmentionné, tout litige découlant des présentes CGU sera soumis à la compétence exclusive des tribunaux de Dakar, République du Sénégal, nonobstant la pluralité de défendeurs ou l'appel en garantie, même pour les procédures d'urgence ou les procédures conservatoires, en référé ou par requête. Les parties renoncent expressément à toute autre attribution de compétence.</p>
              <p>Les parties peuvent convenir, d'un commun accord, de soumettre leur différend à un arbitrage selon les règles de l'arbitrage OHADA ou de tout autre centre d'arbitrage reconnu, dans la mesure où cela est permis par le droit applicable. Tout accord d'arbitrage doit faire l'objet d'une convention séparée signée par les parties.</p>
            </div>
          </section>

          {/* Section 25 */}
          <section id="contact">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">
              25. Contact et Réclamations
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Pour toute question relative aux présentes CGU, à l'utilisation des Services ou à votre Compte, vous pouvez contacter le service support de Terex par les moyens suivants :</p>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <span className="text-foreground/60 font-medium">Société</span>
                  <span>Terex — Teranga Exchange</span>
                  <span className="text-foreground/60 font-medium">Adresse</span>
                  <span>Plateau, Avenue Léopold Sédar Senghor, Dakar, République du Sénégal</span>
                  <span className="text-foreground/60 font-medium">E-mail</span>
                  <a href="mailto:terangaexchange@gmail.com" className="text-white hover:underline">terangaexchange@gmail.com</a>
                  <span className="text-foreground/60 font-medium">Version</span>
                  <span>3.0 — janvier 2025</span>
                </div>
              </div>
              <p>Les réclamations formelles doivent être adressées par écrit (e-mail ou courrier postal) avec mention de l'objet de la réclamation, du numéro de Compte concerné, des faits constitutifs du litige et des documents justificatifs disponibles. Terex accuse réception de toute réclamation dans un délai de quarante-huit (48) heures ouvrables et s'engage à y répondre dans un délai de trente (30) jours calendaires.</p>
              <p>Si vous estimez que la réponse apportée par Terex n'est pas satisfaisante, vous pouvez saisir la Direction de la Protection des Consommateurs du Ministère du Commerce du Sénégal, ou toute autre autorité de règlement des litiges de consommation compétente selon votre pays de résidence.</p>
              <p>Terex s'engage à traiter toutes les réclamations avec sérieux, équité et dans les meilleurs délais, dans l'objectif de maintenir une relation de confiance durable avec l'ensemble de ses Utilisateurs. La satisfaction de nos clients est au cœur de notre mission d'inclusion financière en Afrique de l'Ouest.</p>
            </div>
          </section>

        </main>
      </div>

      <FooterSection />
    </div>
  );
};

export default TermsPage;
