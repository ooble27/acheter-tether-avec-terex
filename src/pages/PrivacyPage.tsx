import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const tocItems = [
  { id: "introduction", label: "1. Introduction et Identité du Responsable" },
  { id: "definitions-bases", label: "2. Définitions et Bases Légales" },
  { id: "donnees-collectees", label: "3. Données Personnelles Collectées" },
  { id: "modalites-collecte", label: "4. Modalités de Collecte" },
  { id: "finalites", label: "5. Finalités et Bases Légales du Traitement" },
  { id: "kyc-aml", label: "6. Traitement des Données KYC/AML" },
  { id: "donnees-financieres", label: "7. Données Financières et Transactionnelles" },
  { id: "partage-destinataires", label: "8. Partage et Destinataires des Données" },
  { id: "transferts-internationaux", label: "9. Transferts Internationaux" },
  { id: "securite", label: "10. Sécurité et Confidentialité" },
  { id: "durees-conservation", label: "11. Durées de Conservation" },
  { id: "vos-droits", label: "12. Vos Droits (RGPD et CEDEAO)" },
  { id: "exercice-droits", label: "13. Exercice de vos Droits" },
  { id: "cookies", label: "14. Cookies et Technologies Similaires" },
  { id: "marketing", label: "15. Marketing Direct et Communications" },
  { id: "profilage", label: "16. Profilage et Décisions Automatisées" },
  { id: "mineurs", label: "17. Données des Mineurs" },
  { id: "sous-traitants", label: "18. Sous-traitants et Partenaires" },
  { id: "incidents", label: "19. Incident de Sécurité et Violations" },
  { id: "dpo", label: "20. Délégué à la Protection des Données" },
  { id: "autorite-controle", label: "21. Autorité de Contrôle" },
  { id: "modifications", label: "22. Modifications de la Politique" },
];

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
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

      <section className="pt-12 pb-6 md:pt-20 md:pb-10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#3B968F] text-[11px] font-semibold uppercase tracking-[0.25em] mb-4">/ CONFIDENTIALITÉ</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-4 leading-tight">Politique de<br className="hidden md:block" /> Confidentialité</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-xs">
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">RGPD &amp; Loi sénégalaise 2008-12</span>
            <span>Dernière mise à jour : mars 2025</span>
            <span>Terex — Teranga Exchange, Dakar, Sénégal</span>
          </div>
        </div>
      </section>

      <div className="bg-[#3B968F]/10 border-b border-[#3B968F]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-[#3B968F]/90 flex flex-wrap gap-2 items-center">
          <span className="font-semibold">Protection de vos données :</span>
          <span>Terex s'engage à protéger vos données personnelles conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 et aux principes du RGPD de l'Union Européenne.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-10 py-12 md:py-16">

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

        <main className="flex-1 min-w-0 max-w-3xl space-y-14">

          <section id="introduction">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">1. Introduction et Identité du Responsable de Traitement</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>La présente Politique de Confidentialité (ci-après « la Politique ») est établie par Terex, opérant sous la dénomination commerciale Teranga Exchange (ci-après « Terex », « nous » ou « le Responsable de Traitement »), dont le siège social est établi au Plateau, Avenue Léopold Sédar Senghor, Dakar, République du Sénégal. Terex est le responsable de traitement au sens de la législation applicable en matière de protection des données personnelles.</p>
              <p>La présente Politique a pour objet d'informer les Utilisateurs de la Plateforme Terex de la manière dont leurs données personnelles sont collectées, traitées, stockées, protégées et partagées dans le cadre de la fourniture des Services de la plateforme. Elle décrit également les droits dont disposent les Utilisateurs concernant leurs données personnelles et les modalités d'exercice de ces droits.</p>
              <p>Terex reconnaît que la protection de la vie privée et des données personnelles de ses Utilisateurs est un enjeu fondamental. La Société s'engage à traiter les données personnelles dans le respect des principes de licéité, de loyauté, de transparence, de limitation des finalités, de minimisation des données, d'exactitude, de limitation de la conservation, d'intégrité et de confidentialité, tels qu'ils sont définis par le RGPD et la loi sénégalaise n° 2008-12 du 25 janvier 2008.</p>
              <p>En utilisant les Services Terex, l'Utilisateur reconnaît avoir pris connaissance de la présente Politique et en accepte le contenu. Si l'Utilisateur n'accepte pas les termes de la présente Politique, il ne doit pas utiliser les Services de Terex.</p>
              <p>Pour toute question relative au traitement de vos données personnelles, vous pouvez contacter notre Délégué à la Protection des Données (DPO) à l'adresse électronique suivante : dpo@terex.sn, ou par courrier postal à l'adresse du siège social de Terex, avec la mention « DPO — Protection des données personnelles ».</p>
            </div>
          </section>

          <section id="definitions-bases">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">2. Définitions et Bases Légales</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Aux fins de la présente Politique, on entend par <strong className="text-foreground/80">« données personnelles »</strong> toute information se rapportant à une personne physique identifiée ou identifiable. Est réputée identifiable une personne physique qui peut être identifiée, directement ou indirectement, notamment par référence à un identifiant (nom, numéro d'identification, données de localisation, identifiant en ligne) ou à un ou plusieurs éléments spécifiques propres à son identité.</p>
              <p><strong className="text-foreground/80">« Traitement »</strong> désigne toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données personnelles, telles que la collecte, l'enregistrement, l'organisation, la structuration, la conservation, l'adaptation ou la modification, l'extraction, la consultation, l'utilisation, la communication, la diffusion ou tout autre forme de mise à disposition, le rapprochement, la limitation, l'effacement ou la destruction.</p>
              <p>Les bases légales sur lesquelles repose le traitement des données personnelles par Terex sont : (i) <strong className="text-foreground/80">l'exécution d'un contrat</strong> (article 6(1)(b) du RGPD) ; (ii) <strong className="text-foreground/80">le respect d'une obligation légale</strong> (article 6(1)(c) du RGPD) ; (iii) <strong className="text-foreground/80">l'intérêt légitime</strong> (article 6(1)(f) du RGPD) pour la prévention de la fraude et la sécurité ; (iv) le <strong className="text-foreground/80">consentement</strong> (article 6(1)(a) du RGPD) pour les traitements optionnels tels que le marketing direct.</p>
              <p>S'agissant des données sensibles (données biométriques collectées dans le cadre du KYC), Terex fonde leur traitement sur l'article 9(2)(g) du RGPD (intérêt public substantiel), l'article 9(2)(b) (obligations en matière de droit du travail) et l'article 9(2)(f) (constatation, exercice ou défense de droits en justice), selon les circonstances spécifiques du traitement.</p>
            </div>
          </section>

          <section id="donnees-collectees">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">3. Données Personnelles Collectées</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex collecte différentes catégories de données personnelles en fonction de la nature des Services fournis et du niveau de vérification du Compte :</p>
              <p><strong className="text-foreground/80">Données d'identification :</strong> nom complet, prénom(s), date de naissance, lieu de naissance, nationalité, numéro de la pièce d'identité, date d'expiration et pays d'émission du document. Ces données sont collectées lors de l'inscription et lors de la procédure de vérification KYC.</p>
              <p><strong className="text-foreground/80">Données de contact :</strong> adresse e-mail, numéro de téléphone mobile, adresse postale complète (rue, ville, code postal, pays). Ces données sont nécessaires pour la création du Compte, la communication avec l'Utilisateur et la vérification de son lieu de résidence.</p>
              <p><strong className="text-foreground/80">Données documentaires et biométriques :</strong> copies des pièces d'identité officielles (recto-verso), justificatifs de domicile, photographies de l'Utilisateur (selfies avec ou sans document d'identité) dans le cadre du processus de vérification d'identité en ligne (liveness check). Ces données sont de nature particulièrement sensible et font l'objet d'une protection renforcée.</p>
              <p><strong className="text-foreground/80">Données financières et transactionnelles :</strong> historique des transactions (achats, ventes, transferts), montants des opérations, moyens de paiement utilisés (numéros de téléphone Mobile Money, coordonnées bancaires partielles), adresses de portefeuilles cryptomonnaies associées aux transactions.</p>
              <p><strong className="text-foreground/80">Données techniques et de navigation :</strong> adresse IP, type et version du navigateur, système d'exploitation, identifiant de l'appareil, cookies et identifiants similaires, données de localisation approximative, journaux d'accès et d'utilisation de la Plateforme.</p>
            </div>
          </section>

          <section id="modalites-collecte">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">4. Modalités de Collecte</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex collecte les données personnelles des Utilisateurs par plusieurs canaux et modalités. La collecte directe intervient lors de l'inscription sur la Plateforme (formulaire de création de Compte), lors du processus de vérification KYC (téléchargement de documents, prise de photos), lors des interactions avec le service support, et lors de la réalisation des transactions.</p>
              <p>La collecte automatique intervient lors de l'utilisation de la Plateforme via des technologies standard telles que les cookies, les pixels de suivi, les journaux de serveur et les SDK d'applications mobiles. Ces technologies permettent de collecter des données techniques et de navigation. L'utilisation de ces technologies est encadrée par notre politique en matière de cookies détaillée à l'article 14.</p>
              <p>Terex peut également collecter des données personnelles provenant de sources tierces dans des cas spécifiques : vérification des données d'identité auprès de prestataires de services de vérification certifiés, vérification des données d'adresse, et vérification des Utilisateurs par rapport aux listes de sanctions internationales (OFAC, ONU, UE) auprès de prestataires spécialisés en conformité.</p>
              <p>L'Utilisateur est toujours informé, au point de collecte, du caractère obligatoire ou facultatif de la fourniture des données, des finalités pour lesquelles les données sont collectées, et des conséquences d'un refus de fournir les données obligatoires. Les champs obligatoires sont clairement identifiés dans les formulaires de collecte.</p>
            </div>
          </section>

          <section id="finalites">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">5. Finalités et Bases Légales du Traitement</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les données personnelles collectées par Terex sont traitées pour les finalités suivantes :</p>
              <p><strong className="text-foreground/80">Création et gestion du Compte Utilisateur</strong> (base légale : exécution du contrat) : traitement des données nécessaires à l'ouverture, la gestion, la mise à jour et la clôture du Compte.</p>
              <p><strong className="text-foreground/80">Fourniture des Services</strong> (base légale : exécution du contrat) : traitement des données nécessaires à l'exécution des transactions d'achat et de vente de cryptomonnaies, au traitement des paiements, et à la gestion des échanges.</p>
              <p><strong className="text-foreground/80">Conformité réglementaire KYC/AML</strong> (base légale : obligation légale) : vérification de l'identité des Utilisateurs conformément aux obligations légales LCB-FT, surveillance des transactions, et coopération avec les autorités compétentes.</p>
              <p><strong className="text-foreground/80">Prévention de la fraude et sécurité</strong> (base légale : intérêt légitime) : détection et prévention des activités frauduleuses, des tentatives d'accès non autorisé et des comportements abusifs.</p>
              <p><strong className="text-foreground/80">Amélioration des Services et analytics</strong> (base légale : intérêt légitime) : analyse des données d'utilisation de la Plateforme pour améliorer les Services, corriger les bugs et optimiser les performances.</p>
              <p><strong className="text-foreground/80">Communications marketing et promotionnelles</strong> (base légale : consentement) : envoi de newsletters et d'informations sur les Services Terex, uniquement avec le consentement préalable et explicite de l'Utilisateur.</p>
            </div>
          </section>

          <section id="kyc-aml">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">6. Traitement des Données KYC/AML</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Le traitement des données collectées dans le cadre des procédures KYC (Know Your Customer) et AML (Anti-Money Laundering) revêt un caractère particulier en raison de la sensibilité des données concernées et des obligations légales strictes qui le régissent. Ce traitement est fondé sur le respect des obligations légales imposées par la directive de la BCEAO sur les établissements de paiement, la loi uniforme UEMOA relative à la LCB-FT, et les recommandations du GAFI.</p>
              <p>Les données KYC comprennent notamment des données biométriques (photographies permettant la reconnaissance faciale dans le cadre des procédures de liveness check), des données d'identité officielles (copies de pièces d'identité) et des données patrimoniales pour les niveaux de vérification supérieurs. Ces données sont traitées avec un niveau de protection renforcé, conformément à l'article 9 du RGPD.</p>
              <p>Les vérifications AML comprennent la consultation des listes de sanctions internationales (OFAC, ONU, UE), des bases de données des personnes politiquement exposées (PPE), et des listes noires de personnes condamnées pour des infractions financières. Ces vérifications sont réalisées lors de l'inscription et de manière périodique pour les comptes actifs.</p>
              <p>Terex est tenu, en vertu des obligations légales LCB-FT, de conserver les données KYC pendant une durée minimale de cinq (5) ans après la fin de la relation contractuelle, et les données relatives aux transactions pendant une durée minimale de cinq (5) ans à compter de leur date d'exécution. Ces durées de conservation sont impératives.</p>
              <p>Les résultats des vérifications KYC/AML peuvent conduire au refus de l'inscription, à la suspension du Compte ou à la transmission de déclarations de soupçon aux autorités compétentes (CENTIF du Sénégal). Dans ces cas, Terex peut être légalement empêché d'informer l'Utilisateur de la transmission de ces déclarations (interdiction de « tipping-off »).</p>
            </div>
          </section>

          <section id="donnees-financieres">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">7. Données Financières et Transactionnelles</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les données financières et transactionnelles collectées par Terex comprennent l'intégralité de l'historique des transactions effectuées sur la Plateforme (achats, ventes, transferts, conversions), les montants correspondants en cryptomonnaies et en devises fiduciaires, les cours appliqués, les frais prélevés, les dates et heures d'exécution, et les identifiants de transaction blockchain.</p>
              <p>S'agissant des moyens de paiement, Terex collecte les identifiants de paiement nécessaires au traitement des transactions : numéros de téléphone Mobile Money, références des transactions Mobile Money. Les informations complètes des cartes bancaires ne sont jamais stockées par Terex et sont traitées exclusivement par nos prestataires de paiement certifiés PCI-DSS.</p>
              <p>Les données transactionnelles sont utilisées pour : l'exécution et le suivi des transactions, la génération des reçus et relevés de compte, la conformité réglementaire, la résolution des litiges et des réclamations, et l'analyse des risques. Ces données ne sont jamais vendues à des tiers à des fins commerciales.</p>
              <p>Les adresses de portefeuilles cryptomonnaies associées aux transactions Terex sont des données pseudonymes qui peuvent permettre l'identification de l'Utilisateur lorsqu'elles sont combinées avec d'autres données. Terex traite ces données avec le même niveau de protection que les données directement identifiantes.</p>
            </div>
          </section>

          <section id="partage-destinataires">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">8. Partage et Destinataires des Données</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex ne vend, ne loue ni ne cède les données personnelles de ses Utilisateurs à des tiers à des fins commerciales. Le partage des données est strictement limité aux cas nécessaires à la fourniture des Services, au respect des obligations légales ou à la protection des intérêts légitimes de Terex. Tous les tiers destinataires de données personnelles sont soumis à des obligations contractuelles de confidentialité et de sécurité.</p>
              <p>Les <strong className="text-foreground/80">prestataires de services techniques</strong> destinataires de données comprennent : les fournisseurs d'infrastructure cloud et d'hébergement, les prestataires de services de vérification d'identité en ligne (pour le traitement des documents KYC et les vérifications biométriques), les processeurs de paiement Mobile Money (Orange, Wave et autres opérateurs), et les prestataires de services de messagerie électronique.</p>
              <p>Les <strong className="text-foreground/80">autorités compétentes</strong> peuvent recevoir des données personnelles : sur réquisition judiciaire ou sur injonction d'une autorité administrative ; dans le cadre des obligations de déclaration LCB-FT (déclarations de soupçon à la CENTIF) ; dans le cadre de procédures fiscales ; et dans le cadre de procédures pénales ou civiles impliquant un Utilisateur.</p>
              <p>En cas de restructuration, fusion, acquisition ou cession d'actifs impliquant Terex, les données personnelles des Utilisateurs peuvent être transférées à l'entité acquéreuse, sous réserve qu'elle s'engage à les protéger conformément à la présente Politique. Les Utilisateurs seront informés de tout tel transfert dans un délai raisonnable.</p>
            </div>
          </section>

          <section id="transferts-internationaux">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">9. Transferts Internationaux de Données</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Dans le cadre de ses activités, Terex peut être amené à transférer des données personnelles vers des pays situés hors du territoire sénégalais et hors de l'espace UEMOA. Ces transferts peuvent intervenir notamment lors de l'utilisation de services d'infrastructure cloud basés à l'international, lors du recours à des prestataires de vérification d'identité, ou lors de la communication avec des autorités étrangères dans le cadre d'une coopération internationale LCB-FT.</p>
              <p>Terex s'assure que tout transfert international de données personnelles est réalisé dans le respect des exigences légales applicables. Pour les transferts vers des pays ne bénéficiant pas d'une décision d'adéquation de la Commission Européenne, Terex met en place des garanties appropriées, notamment sous la forme de clauses contractuelles types (CCT) approuvées par les autorités compétentes.</p>
              <p>En ce qui concerne les données KYC transmises à des prestataires de vérification d'identité basés à l'international, ces transferts sont encadrés par des contrats de traitement de données conformes aux exigences du RGPD et de la loi sénégalaise 2008-12, incluant des obligations strictes de confidentialité et de sécurité.</p>
              <p>L'Utilisateur peut obtenir des informations sur les transferts internationaux de données le concernant et sur les garanties mises en place en contactant le DPO de Terex à l'adresse dpo@terex.sn.</p>
            </div>
          </section>

          <section id="securite">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">10. Sécurité et Confidentialité des Données</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre tout accès non autorisé, toute divulgation, altération, perte ou destruction. Ces mesures sont proportionnées aux risques identifiés et tiennent compte de l'état de l'art et de la sensibilité des données traitées.</p>
              <p>Les mesures techniques déployées comprennent : le chiffrement des données en transit via des protocoles TLS 1.3 pour toutes les communications ; le chiffrement des données au repos (AES-256) pour toutes les données sensibles stockées sur les serveurs ; et l'utilisation d'une architecture de sécurité en couches incluant des pare-feux, des systèmes de détection d'intrusion et des solutions de prévention des pertes de données (DLP).</p>
              <p>Les mesures organisationnelles comprennent : la mise en place d'une politique de contrôle d'accès basée sur le principe du moindre privilège ; la réalisation d'audits de sécurité réguliers par des prestataires indépendants certifiés ; la formation régulière de l'ensemble du personnel sur les bonnes pratiques de sécurité informatique et la protection des données personnelles.</p>
              <p>En ce qui concerne les documents KYC, ceux-ci font l'objet d'un traitement particulièrement sécurisé : stockage dans des espaces de données dédiés et isolés, avec accès restreint au personnel habilité ; conservation sous format chiffré avec gestion des clés de chiffrement par un système dédié (KMS) ; et suppression sécurisée à l'expiration de la durée de conservation légale.</p>
            </div>
          </section>

          <section id="durees-conservation">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">11. Durées de Conservation</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex conserve les données personnelles des Utilisateurs aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, dans le respect des obligations légales de conservation. À l'expiration des durées de conservation applicables, les données sont soit supprimées de manière sécurisée, soit anonymisées de façon irréversible.</p>
              <p><strong className="text-foreground/80">Données de Compte et d'identification :</strong> conservées pendant toute la durée de la relation contractuelle, puis archivées pour une durée de cinq (5) ans à compter de la date de clôture du Compte.</p>
              <p><strong className="text-foreground/80">Documents KYC (pièces d'identité, justificatifs) :</strong> conservés pendant toute la durée de la relation contractuelle et pendant une durée de cinq (5) ans minimum à compter de la fin de cette relation, conformément aux obligations légales LCB-FT.</p>
              <p><strong className="text-foreground/80">Données transactionnelles :</strong> conservées pendant cinq (5) ans à compter de la date d'exécution de chaque transaction, conformément aux obligations légales en matière de conservation des données financières.</p>
              <p><strong className="text-foreground/80">Données techniques et de navigation :</strong> les journaux de connexion sont conservés pendant douze (12) mois à des fins de sécurité informatique. Les données de cookies sont conservées selon les durées indiquées dans la politique cookies.</p>
              <p><strong className="text-foreground/80">Données marketing :</strong> conservées jusqu'au retrait du consentement de l'Utilisateur ou pendant une durée maximale de trois (3) ans à compter du dernier contact actif.</p>
            </div>
          </section>

          <section id="vos-droits">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">12. Vos Droits (RGPD et CEDEAO)</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>En vertu de la loi sénégalaise n° 2008-12 du 25 janvier 2008, du RGPD de l'Union Européenne et de la Politique de Protection des Données Personnelles de la CEDEAO, vous bénéficiez des droits suivants relatifs au traitement de vos données personnelles :</p>
              <p><strong className="text-foreground/80">Droit d'accès (article 15 du RGPD) :</strong> vous avez le droit d'obtenir confirmation que Terex traite ou ne traite pas de données personnelles vous concernant, et d'accéder à ces données ainsi qu'aux informations relatives aux finalités du traitement, aux catégories de données concernées et aux durées de conservation.</p>
              <p><strong className="text-foreground/80">Droit de rectification (article 16 du RGPD) :</strong> vous avez le droit d'obtenir, dans les meilleurs délais, la rectification des données personnelles inexactes vous concernant et de faire compléter les données personnelles incomplètes.</p>
              <p><strong className="text-foreground/80">Droit à l'effacement ou « droit à l'oubli » (article 17 du RGPD) :</strong> vous avez le droit d'obtenir l'effacement de données personnelles vous concernant dans les meilleurs délais, sous réserve des obligations légales de conservation imposées à Terex dans le cadre KYC/AML.</p>
              <p><strong className="text-foreground/80">Droit à la portabilité (article 20 du RGPD) :</strong> vous avez le droit de recevoir les données personnelles vous concernant dans un format structuré, couramment utilisé et lisible par machine, et de les transmettre à un autre responsable du traitement.</p>
              <p><strong className="text-foreground/80">Droit d'opposition (article 21 du RGPD) :</strong> vous avez le droit de vous opposer à tout moment au traitement de vos données fondé sur l'intérêt légitime de Terex. Vous avez également le droit de vous opposer à tout moment au traitement de vos données à des fins de marketing direct.</p>
            </div>
          </section>

          <section id="exercice-droits">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">13. Exercice de vos Droits</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Pour exercer l'un de vos droits relatifs à vos données personnelles, vous pouvez adresser une demande écrite à notre Délégué à la Protection des Données (DPO) par e-mail à l'adresse dpo@terex.sn ou par courrier postal à l'adresse de Terex, avec la mention « Exercice de droits — Protection des données personnelles ».</p>
              <p>Pour des raisons de sécurité, Terex peut vous demander de fournir un justificatif de votre identité avant de traiter votre demande. Cette vérification est réalisée dans le seul but de s'assurer que la demande émane bien de la personne concernée.</p>
              <p>Terex s'engage à accuser réception de votre demande dans un délai de quarante-huit (48) heures ouvrables et à y donner suite dans un délai maximum d'un (1) mois à compter de la réception de la demande complète. Ce délai peut être prolongé de deux (2) mois supplémentaires en cas de demande complexe.</p>
              <p>Si Terex n'est pas en mesure de faire droit à votre demande (par exemple, en raison d'une obligation légale de conservation des données), vous en serez informé par écrit avec indication des motifs du refus et de vos voies de recours disponibles.</p>
            </div>
          </section>

          <section id="cookies">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">14. Cookies, Traceurs et Technologies Similaires</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>La Plateforme Terex utilise des cookies et d'autres technologies de traçage pour améliorer l'expérience des Utilisateurs, assurer la sécurité de la Plateforme, et analyser l'utilisation des Services. Un cookie est un petit fichier texte déposé sur votre terminal lors de votre visite sur la Plateforme.</p>
              <p>Terex utilise différentes catégories de cookies : les <strong className="text-foreground/80">cookies strictement nécessaires</strong> (exemptés du consentement), qui sont indispensables au fonctionnement de la Plateforme (maintien de la session de connexion, sécurité CSRF) ; les <strong className="text-foreground/80">cookies de préférence</strong>, qui permettent de mémoriser vos paramètres ; les <strong className="text-foreground/80">cookies analytiques</strong>, qui permettent d'analyser le comportement des Utilisateurs ; et les <strong className="text-foreground/80">cookies de sécurité</strong>, qui contribuent à la détection des comportements frauduleux.</p>
              <p>Vous pouvez gérer vos préférences en matière de cookies via le panneau de gestion des cookies accessible depuis le pied de page de la Plateforme, ou via les paramètres de votre navigateur web. La désactivation de certains cookies peut affecter le bon fonctionnement de certaines fonctionnalités.</p>
              <p>Terex n'utilise pas de cookies publicitaires ou de traceurs de marketing comportemental tiers permettant de vous suivre sur d'autres sites web que la Plateforme Terex. Si cette politique venait à évoluer, votre consentement serait recueilli au préalable.</p>
            </div>
          </section>

          <section id="marketing">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">15. Marketing Direct et Communications</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex peut vous adresser des communications commerciales, des newsletters et des informations sur ses Services, uniquement avec votre consentement préalable, libre, spécifique, éclairé et univoque, tel que requis par l'article 7 du RGPD. Ce consentement est recueilli lors de l'inscription ou à tout autre moment via les préférences de communication accessibles depuis votre espace utilisateur.</p>
              <p>Vous pouvez retirer votre consentement à recevoir des communications marketing à tout moment, sans justification, en cliquant sur le lien de désinscription présent dans chaque e-mail commercial, ou en modifiant vos préférences de communication dans les paramètres de votre Compte. La prise en compte de votre désinscription est effective dans un délai maximum de quarante-huit (48) heures.</p>
              <p>Indépendamment de vos préférences marketing, Terex est autorisé à vous envoyer des communications purement transactionnelles et de service (confirmation de transaction, alertes de sécurité, notifications réglementaires) fondées sur l'exécution du contrat. Ces communications ne peuvent être désactivées tant que votre Compte reste actif.</p>
            </div>
          </section>

          <section id="profilage">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">16. Profilage et Décisions Automatisées</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex utilise des systèmes automatisés de détection et de prévention de la fraude qui analysent les comportements transactionnels des Utilisateurs afin d'identifier les activités potentiellement frauduleuses ou non conformes aux politiques de lutte contre le blanchiment de capitaux. Ces systèmes constituent un profilage au sens de l'article 22 du RGPD lorsqu'ils conduisent à des décisions automatisées produisant des effets juridiques sur les Utilisateurs.</p>
              <p>Conformément à l'article 22 du RGPD, les Utilisateurs ont le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé produisant des effets juridiques significatifs. Lorsqu'une décision automatisée défavorable est prise, l'Utilisateur peut demander une intervention humaine, exprimer son point de vue et contester la décision en contactant le service support de Terex.</p>
              <p>La base légale du profilage à des fins de détection de fraude et de conformité AML est l'intérêt légitime de Terex et le respect de ses obligations légales LCB-FT. Le profilage à des fins de personnalisation des Services n'est effectué, le cas échéant, que sur la base d'un consentement explicite de l'Utilisateur.</p>
            </div>
          </section>

          <section id="mineurs">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">17. Données des Mineurs</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Les Services Terex sont exclusivement réservés aux personnes majeures (âgées de 18 ans révolus ou plus). Terex ne collecte pas sciemment de données personnelles concernant des personnes mineures. Si, malgré les vérifications en place, Terex prenait connaissance qu'un mineur a créé un Compte, le Compte serait immédiatement clôturé et les données supprimées dans les meilleurs délais, sous réserve des obligations légales applicables.</p>
              <p>Les parents et tuteurs légaux qui auraient connaissance de la création d'un Compte par un mineur sont invités à en informer immédiatement Terex à l'adresse dpo@terex.sn. Terex prendra les mesures nécessaires dans les meilleurs délais.</p>
              <p>Terex met en place des mesures de contrôle raisonnables pour prévenir l'inscription de mineurs, notamment via la vérification de la date de naissance lors de l'inscription et via les procédures KYC qui incluent la vérification des pièces d'identité.</p>
            </div>
          </section>

          <section id="sous-traitants">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">18. Sous-traitants et Partenaires</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex fait appel à des prestataires de services tiers (sous-traitants) pour l'assistance à la fourniture de ses Services. Ces sous-traitants traitent des données personnelles pour le compte de Terex, conformément aux instructions de Terex et dans le strict cadre de contrats de sous-traitance conformes aux exigences de l'article 28 du RGPD.</p>
              <p>Les principales catégories de sous-traitants auxquels Terex fait appel sont : les fournisseurs d'infrastructure cloud et d'hébergement, les prestataires de services de vérification d'identité KYC, les opérateurs de paiement Mobile Money et leurs intégrateurs techniques, les prestataires de services de messagerie électronique, et les prestataires de solutions de détection de fraude et de conformité AML.</p>
              <p>La liste des sous-traitants principaux de Terex est disponible sur demande auprès du DPO (dpo@terex.sn). Terex effectue une due diligence préalable sur les pratiques de sécurité et de protection des données de ses sous-traitants avant tout engagement.</p>
            </div>
          </section>

          <section id="incidents">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">19. Incident de Sécurité et Violation de Données</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex dispose d'une procédure formelle de gestion des incidents de sécurité et des violations de données personnelles, conforme aux exigences des articles 33 et 34 du RGPD. En cas de violation de données personnelles susceptible d'engendrer un risque pour les droits et libertés des Utilisateurs, Terex s'engage à notifier l'incident à l'autorité de contrôle compétente dans un délai maximum de soixante-douze (72) heures après en avoir pris connaissance.</p>
              <p>Lorsque la violation de données est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes concernées (par exemple, en cas de fuite de données d'identité ou de données financières), Terex s'engage à notifier directement les Utilisateurs affectés dans les meilleurs délais, avec une description de la nature de la violation et des mesures prises.</p>
              <p>Terex met en place une équipe de réponse aux incidents chargée de détecter, analyser, contenir et remédier à tout incident de sécurité affectant la Plateforme. Si vous suspectez une utilisation non autorisée de votre Compte, vous êtes invité à contacter immédiatement le service support de Terex et à modifier votre mot de passe.</p>
            </div>
          </section>

          <section id="dpo">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">20. Délégué à la Protection des Données (DPO)</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex a désigné un Délégué à la Protection des Données (DPO — Data Protection Officer), conformément aux exigences de l'article 37 du RGPD. Le DPO est chargé d'informer et conseiller Terex et ses employés sur les obligations relatives à la protection des données, de contrôler le respect du RGPD et des autres règles applicables, de sensibiliser et former le personnel, et de coopérer avec les autorités de contrôle compétentes.</p>
              <p>Le DPO est également le point de contact privilégié des Utilisateurs pour toute question relative au traitement de leurs données personnelles et à l'exercice de leurs droits. Il est joignable à l'adresse électronique dédiée : dpo@terex.sn, et par courrier postal à l'adresse du siège social de Terex, avec la mention « DPO — Protection des données personnelles ».</p>
              <p>Le DPO dispose de l'indépendance nécessaire à l'exercice de ses fonctions et bénéficie des ressources et de l'accès aux données de traitement nécessaires à l'accomplissement de ses missions. Il est soumis au secret professionnel concernant les informations auxquelles il accède dans le cadre de ses fonctions.</p>
            </div>
          </section>

          <section id="autorite-controle">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">21. Autorité de Contrôle</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Si vous estimez que le traitement de vos données personnelles par Terex n'est pas conforme à la législation applicable, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente. L'autorité de contrôle nationale compétente au Sénégal est la Commission de Protection des Données Personnelles (CDP), accessible à l'adresse : www.cdp.sn, e-mail : contact@cdp.sn.</p>
              <p>Si vous résidez dans un État membre de l'Union Européenne ou de l'Espace Économique Européen (EEE), vous pouvez également introduire une réclamation auprès de l'autorité de protection des données de votre État de résidence. Terex coopère pleinement avec toutes les autorités de contrôle compétentes.</p>
              <p>Avant de saisir une autorité de contrôle, nous vous encourageons à nous contacter directement en premier lieu, afin de nous permettre de répondre à vos préoccupations et de résoudre le différend à l'amiable. Notre DPO (dpo@terex.sn) est disponible pour traiter vos demandes dans les meilleurs délais.</p>
            </div>
          </section>

          <section id="modifications">
            <h2 className="text-xl md:text-2xl font-normal text-foreground mb-5 pb-3 border-b border-white/[0.07]">22. Modifications de la Politique</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Terex se réserve le droit de modifier la présente Politique de Confidentialité à tout moment afin de la mettre en conformité avec les évolutions législatives et réglementaires applicables. Toute modification substantielle est portée à la connaissance des Utilisateurs par notification par e-mail et par affichage d'un avis visible sur la Plateforme, au moins trente (30) jours avant son entrée en vigueur.</p>
              <p>La version en vigueur de la présente Politique est toujours accessible sur la Plateforme, avec indication de la date de la dernière mise à jour. La poursuite de l'utilisation des Services après l'entrée en vigueur des modifications vaut acceptation de celles-ci.</p>
              <p>La clôture du Compte ne met pas fin aux obligations de conservation des données imposées par la loi. Pour toute question sur la présente Politique ou pour exercer vos droits, n'hésitez pas à contacter notre DPO à l'adresse dpo@terex.sn.</p>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3 mt-6">
                <p className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Coordonnées du Responsable de Traitement</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <span className="text-foreground/60 font-medium">Société</span>
                  <span>Terex — Teranga Exchange</span>
                  <span className="text-foreground/60 font-medium">Adresse</span>
                  <span>Plateau, Avenue Léopold Sédar Senghor, Dakar, République du Sénégal</span>
                  <span className="text-foreground/60 font-medium">E-mail général</span>
                  <a href="mailto:terangaexchange@gmail.com" className="text-[#3B968F] hover:underline">terangaexchange@gmail.com</a>
                  <span className="text-foreground/60 font-medium">E-mail DPO</span>
                  <a href="mailto:dpo@terex.sn" className="text-[#3B968F] hover:underline">dpo@terex.sn</a>
                  <span className="text-foreground/60 font-medium">Mise à jour</span>
                  <span>mars 2025</span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      <FooterSection />
    </div>
  );
};

export default PrivacyPage;
