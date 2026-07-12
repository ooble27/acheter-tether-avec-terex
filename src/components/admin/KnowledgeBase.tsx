import { useMemo, useState } from 'react';
import {
  Search, ChevronRight, BookOpen, Coins, Repeat, ClipboardCheck, CreditCard,
  ShieldCheck, AlertTriangle, HelpCircle, GraduationCap,
} from 'lucide-react';
import { PageHeader, DrillPage, FilterChip, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const RED = '#e07a7a';

// ── Blocs de contenu ──────────────────────────────────────────────────────────
type Block =
  | { t: 'p'; x: string }
  | { t: 'h'; x: string }
  | { t: 'ul'; x: string[] }
  | { t: 'steps'; x: string[] }
  | { t: 'note'; x: string }
  | { t: 'warn'; x: string }
  | { t: 'kv'; x: [string, string][] };

interface Article { id: string; cat: string; title: string; summary: string; body: Block[] }

const CATS: { id: string; label: string; Icon: any }[] = [
  { id: 'crypto', label: 'Bases de la crypto', Icon: Coins },
  { id: 'terex', label: 'Comment Terex marche', Icon: Repeat },
  { id: 'ops', label: 'Procédures — commandes', Icon: ClipboardCheck },
  { id: 'pay', label: 'Paiements & vérifications', Icon: CreditCard },
  { id: 'kyc', label: 'KYC & conformité', Icon: ShieldCheck },
  { id: 'fraud', label: 'Sécurité & fraude', Icon: AlertTriangle },
  { id: 'faq', label: 'Questions clients', Icon: HelpCircle },
  { id: 'glossary', label: 'Glossaire', Icon: GraduationCap },
];
const catLabel = (id: string) => CATS.find(c => c.id === id)?.label || id;

const ARTICLES: Article[] = [
  // ═══════════════════ BASES DE LA CRYPTO ═══════════════════
  {
    id: 'what-usdt', cat: 'crypto', title: "Comprendre l'USDT (Tether) en profondeur",
    summary: "Le stablecoin qu'on échange : ce que c'est, pourquoi les clients en veulent.",
    body: [
      { t: 'p', x: "L'USDT, aussi appelé « Tether », est une monnaie numérique (cryptomonnaie) dont la particularité est d'avoir une valeur stable : 1 USDT vaut en permanence environ 1 dollar américain (USD). C'est pour cela qu'on l'appelle un « stablecoin » (littéralement « pièce stable »)." },
      { t: 'p', x: "Contrairement au Bitcoin ou à l'Ethereum dont le prix peut monter ou chuter de 10 % en une journée, l'USDT ne bouge quasiment jamais. Sa valeur est « adossée » (garantie) par des réserves en dollars détenues par l'entreprise Tether. C'est ce qui en fait un outil de confiance pour échanger et conserver de la valeur." },
      { t: 'h', x: "Pourquoi nos clients achètent ou vendent de l'USDT" },
      { t: 'ul', x: [
        "Envoyer ou recevoir de l'argent à l'international, rapidement et à moindre coût, sans passer par une banque.",
        "Se protéger contre la dévaluation du franc CFA ou l'inflation : garder son argent « en dollars numériques ».",
        "Épargner ou faire du commerce en ligne (achats internationaux, paiement de fournisseurs, e-commerce).",
        "Recevoir des paiements de l'étranger (freelances, diaspora, familles).",
      ] },
      { t: 'h', x: "Le vocabulaire de base à maîtriser" },
      { t: 'kv', x: [
        ['Cryptomonnaie', "Monnaie numérique qui circule sur une blockchain, sans banque centrale."],
        ['Stablecoin', "Cryptomonnaie stable, adossée à une vraie monnaie (l'USDT est adossé au dollar)."],
        ['USDT / Tether', "Le stablecoin dollar. C'est CE que nous échangeons contre des CFA."],
        ['1 USDT', "≈ 1 dollar US ≈ le « taux du jour » en CFA (ex. 585 CFA aujourd'hui)."],
        ['USDC', "Un autre stablecoin dollar (concurrent de l'USDT). On travaille surtout avec l'USDT."],
      ] },
      { t: 'note', x: "Image simple à retenir et à donner aux clients : l'USDT est un « dollar numérique ». Un client veut soit en ACHETER (il paie en CFA, on lui envoie de l'USDT), soit en VENDRE (il nous envoie de l'USDT, on le paie en CFA). Notre métier, c'est ce change, vite et sans erreur." },
    ],
  },
  {
    id: 'blockchain-networks', cat: 'crypto', title: "Blockchain, réseaux (TRC20, BEP20, ERC20…) et adresses",
    summary: "La notion la PLUS importante à maîtriser pour ne pas perdre de fonds.",
    body: [
      { t: 'p', x: "Une blockchain est un grand registre public et infalsifiable où sont inscrites toutes les transactions crypto du monde entier. Chaque envoi d'USDT y laisse une trace permanente et vérifiable par tous." },
      { t: 'p', x: "Point crucial : l'USDT n'existe pas sur une seule blockchain. Il circule sur plusieurs blockchains différentes, qu'on appelle des « réseaux ». Le même USDT peut voyager sur le réseau Tron, sur le réseau Binance, sur Ethereum, etc. Ce ne sont pas les mêmes « routes » — et une route ne communique pas avec l'autre." },
      { t: 'h', x: "Les réseaux qu'on rencontre chez Terex" },
      { t: 'kv', x: [
        ['TRC20 (Tron)', "LE plus utilisé chez nous. Frais très bas (souvent moins de 1 USDT), confirmation en ~1 minute. Les adresses commencent par un « T »."],
        ['BEP20 (BNB Smart Chain)', "Réseau de Binance. Frais bas, rapide. Adresses commencent par « 0x »."],
        ['ERC20 (Ethereum)', "Le réseau historique. Sécurisé mais frais parfois élevés (plusieurs dollars). Adresses commencent par « 0x »."],
        ['Polygon', "Rapide et peu cher. Adresses « 0x »."],
        ['Solana (SPL)', "Très rapide, frais minimes. Format d'adresse différent (ni T ni 0x)."],
        ['Aptos, Arbitrum, Base', "Réseaux plus récents, rapides et peu chers, parfois demandés."],
      ] },
      { t: 'warn', x: "RÈGLE D'OR ABSOLUE : on envoie TOUJOURS l'USDT sur le MÊME réseau que celui choisi par le client. Si le client a demandé TRC20 et qu'on envoie en BEP20, les fonds sont PERDUS — définitivement, personne ne peut les récupérer, ni nous, ni le client, ni Tether. C'est l'erreur la plus grave et la plus coûteuse possible. Vérifiez le réseau DEUX fois avant d'envoyer." },
      { t: 'h', x: "L'adresse de wallet" },
      { t: 'p', x: "Une adresse crypto est l'équivalent d'un numéro de compte bancaire, mais en crypto : une longue suite de lettres et de chiffres (30 à 45 caractères selon le réseau). Exemple TRC20 : TXYZa1b2C3d4E5f6G7h8J9k0Lmn1PqrsTuv. C'est à cette adresse qu'on envoie l'USDT lors d'un achat." },
      { t: 'ul', x: [
        "Une adresse doit être COPIÉE-COLLÉE exactement, jamais recopiée à la main : une seule lettre fausse = fonds perdus.",
        "Le début de l'adresse indique souvent le réseau : « T » = Tron (TRC20), « 0x » = Ethereum/BSC/Polygon.",
        "Sur le détail d'une commande d'achat, l'onglet « Destination » affiche l'adresse ET le réseau exacts : c'est la seule source de vérité.",
      ] },
      { t: 'note', x: "Bonne pratique : après avoir collé l'adresse dans le portefeuille d'envoi, comparez les 4 premiers ET les 4 derniers caractères avec ceux de la commande. Si ça correspond, c'est bon." },
    ],
  },
  {
    id: 'confirmations-explorers', cat: 'crypto', title: "Transactions, confirmations et vérification on-chain (txID)",
    summary: "Comment prouver qu'un envoi est parti et arrivé.",
    body: [
      { t: 'p', x: "Chaque envoi de crypto génère une « transaction » identifiée par un code unique appelé txID (ou « hash »). Ce code est la PREUVE que l'envoi a eu lieu. On peut le vérifier publiquement sur un site appelé « explorateur de blockchain »." },
      { t: 'h', x: "Les explorateurs selon le réseau" },
      { t: 'kv', x: [
        ['TRC20 (Tron)', "tronscan.org — collez le txID ou l'adresse pour voir les transactions."],
        ['BEP20 (BSC)', "bscscan.com"],
        ['ERC20 (Ethereum)', "etherscan.io"],
        ['Polygon', "polygonscan.com"],
        ['Solana', "solscan.io"],
      ] },
      { t: 'h', x: "Les confirmations" },
      { t: 'p', x: "Une transaction n'est pas « validée » instantanément : le réseau doit la confirmer. Sur TRC20 c'est quasi immédiat (quelques secondes à 1 minute). Sur Ethereum ça peut prendre quelques minutes. Tant qu'une vente n'est pas confirmée sur la blockchain, on ne considère PAS les USDT comme reçus." },
      { t: 'steps', x: [
        "Pour vérifier qu'un client nous a bien envoyé ses USDT (vente) : ouvrez l'explorateur du bon réseau.",
        "Collez l'adresse de réception de l'entreprise (ou le txID fourni par le client).",
        "Vérifiez : le bon montant, le bon réseau, et le statut « Success / Confirmed ».",
        "Seulement alors, vous pouvez payer le client en CFA.",
      ] },
      { t: 'warn', x: "Un client peut envoyer une capture d'écran disant « j'ai envoyé ». Une capture ne prouve RIEN (elle peut être fausse ou la transaction annulée). La seule preuve valable est la transaction confirmée sur l'explorateur blockchain." },
    ],
  },
  {
    id: 'wallet-binance', cat: 'crypto', title: "Wallets, Binance : où le client reçoit ou envoie ses USDT",
    summary: "Les destinations possibles et comment les lire.",
    body: [
      { t: 'p', x: "Un « wallet » (portefeuille) est une application qui stocke les cryptos d'une personne et lui donne une adresse pour recevoir. Quand un client achète, il indique OÙ recevoir ; quand il vend, il envoie DEPUIS son wallet vers le nôtre." },
      { t: 'h', x: "Les deux grands cas de destination (achat)" },
      { t: 'kv', x: [
        ['Wallet personnel', "Une app crypto (Trust Wallet, MetaMask, Exodus…) avec une adresse. On envoie l'USDT à cette adresse, sur le réseau choisi. C'est le cas le plus courant."],
        ['Compte Binance', "Le client reçoit sur la plus grande plateforme d'échange au monde. Deux sous-cas : (1) via son adresse de dépôt Binance (comme un wallet), (2) via « Binance Pay » avec son email / ID Binance."],
      ] },
      { t: 'h', x: "Comment lire la destination dans une commande" },
      { t: 'p', x: "Dans le détail d'une commande d'ACHAT, l'onglet « Destination » (ou la carte « À faire ») affiche toujours l'adresse et le réseau. Si le client a choisi Binance Pay, l'onglet « Paiement » montrera plutôt son email / ID Binance. En cas de doute sur ce que le client a saisi, tout est dans les onglets du détail de commande." },
      { t: 'note', x: "Ne demandez jamais au client de vous « redonner » son adresse par message si elle est déjà dans la commande : utilisez celle de la commande. Toute adresse envoyée par message au dernier moment doit éveiller la méfiance (voir Sécurité)." },
    ],
  },

  // ═══════════════════ COMMENT TEREX MARCHE ═══════════════════
  {
    id: 'terex-overview', cat: 'terex', title: "Ce que fait Terex : la mission et les 4 services",
    summary: "Vue d'ensemble de la plateforme et de notre métier.",
    body: [
      { t: 'p', x: "Terex (Teranga Exchange) est une plateforme de change entre le franc CFA et les cryptomonnaies stables (USDT). Notre mission : permettre à toute personne en Afrique de l'Ouest d'acheter, vendre et envoyer de l'argent en dollars numériques, simplement, rapidement et en toute confiance." },
      { t: 'h', x: "Les 4 services de la plateforme" },
      { t: 'kv', x: [
        ['Acheter', "Le client paie en CFA (Wave / Orange Money via Naboopay) → nous lui envoyons des USDT sur son wallet ou Binance."],
        ['Vendre', "Le client nous envoie des USDT sur notre portefeuille → nous le payons en CFA sur son numéro Mobile Money."],
        ['Virement', "Transfert international : envoyer de l'argent vers un bénéficiaire dans un autre pays."],
        ['OTC', "« Over The Counter » : les très gros volumes, traités au cas par cas avec un taux négocié et un suivi personnalisé."],
      ] },
      { t: 'h', x: "Notre rôle en tant qu'équipe" },
      { t: 'p', x: "Chaque service se traduit par des « commandes » qui arrivent dans le back-office. Notre travail d'équipe consiste à traiter chaque commande : vérifier le paiement, envoyer les bons fonds, et clôturer la commande — le tout vite et sans la moindre erreur. La rapidité fait la réputation ; l'absence d'erreur protège l'argent de l'entreprise." },
      { t: 'note', x: "Un client satisfait revient et parle de nous. Une seule mauvaise expérience (retard, erreur de réseau, fraude non détectée) peut coûter très cher en argent et en réputation. Chaque commande compte." },
    ],
  },
  {
    id: 'rate-margin', cat: 'terex', title: "Le taux du jour et la marge de l'entreprise",
    summary: "Comment le prix est fixé et comment Terex gagne sa vie.",
    body: [
      { t: 'p', x: "Le « taux du jour » est le prix d'1 USDT exprimé en CFA (ex. 585 CFA). Il suit le marché international (le prix du dollar / de l'USDT) et est mis à jour automatiquement en temps réel sur la plateforme." },
      { t: 'h', x: "D'où vient notre marge (notre bénéfice)" },
      { t: 'p', x: "Terex ne prend pas de « commission » affichée : la marge est intégrée dans le taux. Le principe :" },
      { t: 'kv', x: [
        ['À l\'achat', "Le client paie l'USDT un peu AU-DESSUS du prix du marché (environ +2 %). Cette différence est notre marge."],
        ['À la vente', "Nous rachetons l'USDT du client un peu EN DESSOUS du marché (environ -10 CFA par USDT). Cette différence est notre marge."],
        ['Virement', "Des frais sont facturés sur le montant transféré."],
        ['OTC', "Le taux est négocié selon le volume ; la marge peut être ajustée pour les très gros montants."],
      ] },
      { t: 'p', x: "Exemple concret d'un achat : si le marché est à 573 CFA/USDT, le client paie environ 585 CFA/USDT. Pour 100 USDT, il paie 58 500 CFA. Nous « achetons » ces 100 USDT à ~57 300 CFA de valeur marché → la marge brute est d'environ 1 200 CFA sur cette opération." },
      { t: 'note', x: "Vous n'avez JAMAIS à calculer la marge à la main : la plateforme applique le taux automatiquement au moment de la commande. Retenez seulement le principe pour comprendre le métier et répondre aux clients qui demandent « pourquoi ce prix ? »." },
    ],
  },
  {
    id: 'order-lifecycle', cat: 'terex', title: "Le cycle de vie d'une commande (les statuts)",
    summary: "Ce que veut dire chaque statut et qui doit agir.",
    body: [
      { t: 'p', x: "Chaque commande passe par des étapes appelées « statuts ». Comprendre chaque statut, c'est savoir exactement ce qu'il reste à faire." },
      { t: 'kv', x: [
        ['En attente', "La commande vient d'être créée. Pour un achat : on attend souvent la confirmation du paiement. C'est le point de départ du travail de l'opérateur."],
        ['En traitement', "Un opérateur a pris la commande en charge et est en train de l'exécuter (envoi des fonds en cours). Elle est verrouillée à son nom."],
        ['Terminée', "Les fonds ont été envoyés et la commande est clôturée. Rien de plus à faire."],
        ['Annulée', "La commande n'a pas été honorée (paiement non reçu, erreur, doute, demande client). Un email d'annulation a normalement été envoyé au client."],
        ['Échouée', "Un problème technique a interrompu la commande. À examiner au cas par cas."],
      ] },
      { t: 'h', x: "Le parcours normal" },
      { t: 'steps', x: [
        "En attente → l'opérateur prend en charge et vérifie le paiement.",
        "En traitement → l'opérateur envoie les fonds (USDT ou CFA).",
        "Terminée → une fois l'envoi confirmé, l'opérateur clôture.",
      ] },
      { t: 'note', x: "Les codes couleur dans le back-office : « En attente » en gris, « En traitement » en blanc (actif), « Terminée » estompé, « Annulée / Échouée » en rouge. Aucun statut n'est laissé au hasard." },
    ],
  },
  {
    id: 'admin-navigation', cat: 'terex', title: "Naviguer dans le back-office (chaque onglet expliqué)",
    summary: "À quoi sert chaque section de l'administration.",
    body: [
      { t: 'p', x: "Le back-office est organisé en onglets. Selon votre rôle, vous ne voyez que les onglets qui vous concernent (un opérateur ne voit pas la comptabilité, par exemple)." },
      { t: 'kv', x: [
        ['File d\'attente', "Les commandes actives à traiter. C'est ici que l'opérateur passe l'essentiel de son temps : prendre en charge, puis traiter."],
        ['Commandes', "TOUTES les commandes (achats, ventes, virements) et les archives, avec recherche et filtres. Pour retrouver une commande passée."],
        ['KYC', "Les vérifications d'identité à valider ou rejeter."],
        ['Campagnes', "L'envoi d'emails marketing aux clients (rôle Marketing)."],
        ['Candidatures', "Le suivi des recrutements (rôle RH)."],
        ['Performance', "Réservé à l'administrateur : qui traite quoi, volumes par membre."],
        ['Présences', "Réservé à l'administrateur : les heures pointées par chacun (arrivée / sortie)."],
        ['Comptabilité', "Réservé à l'administrateur : revenus et marges."],
        ['Guide', "Cette base de connaissances, accessible à toute l'équipe."],
      ] },
      { t: 'h', x: "Ouvrir une commande" },
      { t: 'p', x: "Dans la File d'attente ou dans Commandes, cliquez sur une ligne pour ouvrir son détail. En haut : le client et le flux « paie → reçoit ». La carte « À faire » vous dit exactement quoi envoyer. Les onglets (Client, Transaction, Paiement, Destination, Historique) contiennent toutes les informations. Le Journal (onglet Historique) trace chaque action." },
    ],
  },

  // ═══════════════════ PROCÉDURES — COMMANDES ═══════════════════
  {
    id: 'process-buy', cat: 'ops', title: "PROCÉDURE — Traiter un ACHAT (mode opératoire complet)",
    summary: "Le client a payé en CFA, nous devons lui envoyer l'USDT.",
    body: [
      { t: 'p', x: "Un ACHAT signifie : le client a payé (ou va payer) en CFA, et nous devons lui envoyer l'USDT correspondant sur sa destination. C'est l'opération la plus fréquente. Suivez cette procédure À LA LETTRE, sans sauter d'étape." },
      { t: 'h', x: "Étape 1 — Prendre en charge" },
      { t: 'steps', x: [
        "Dans la File d'attente, repérez la commande d'achat (icône Achat).",
        "Ouvrez-la et cliquez « Prendre en charge » : elle se verrouille à votre nom pour toute l'équipe. Personne d'autre ne pourra la traiter en même temps.",
      ] },
      { t: 'h', x: "Étape 2 — Vérifier le paiement (JAMAIS sauter)" },
      { t: 'steps', x: [
        "Ouvrez l'onglet « Paiement » et le statut de la commande.",
        "Pour un achat payé via Naboopay (Wave/Orange), le statut du paiement doit être « confirmé ». La plateforme le met à jour automatiquement quand Naboopay valide.",
        "Si le paiement n'est PAS confirmé : ne faites rien, attendez la confirmation, ou contactez un responsable si le client affirme avoir payé.",
      ] },
      { t: 'warn', x: "N'envoyez JAMAIS l'USDT avant d'avoir la CERTITUDE que le client a payé et que le paiement est confirmé. Un envoi crypto est IRRÉVERSIBLE : si vous envoyez et que le paiement n'était pas réel, l'entreprise perd l'argent." },
      { t: 'h', x: "Étape 3 — Lire précisément ce qu'il faut envoyer" },
      { t: 'steps', x: [
        "Dans la carte « À faire », lisez le MONTANT exact en USDT à envoyer.",
        "Lisez le RÉSEAU (TRC20, BEP20…). C'est vital.",
        "Copiez l'ADRESSE de réception (bouton copier) — ne la retapez jamais. Ou l'email/ID Binance si c'est Binance Pay (onglet Destination / Paiement).",
      ] },
      { t: 'h', x: "Étape 4 — Envoyer l'USDT" },
      { t: 'steps', x: [
        "Depuis le portefeuille de l'entreprise, préparez un envoi d'USDT.",
        "Sélectionnez EXACTEMENT le même réseau que celui de la commande.",
        "Collez l'adresse. Vérifiez les 4 premiers et 4 derniers caractères par rapport à la commande.",
        "Saisissez le montant exact en USDT.",
        "Validez l'envoi et attendez la confirmation de la transaction (txID).",
      ] },
      { t: 'h', x: "Étape 5 — Clôturer" },
      { t: 'steps', x: [
        "Une fois la transaction confirmée sur la blockchain, revenez sur la commande.",
        "Cliquez « Marquer comme terminé ».",
        "La commande passe en « Terminée » et le client reçoit sa confirmation.",
      ] },
      { t: 'note', x: "Checklist mentale avant de valider l'envoi : Paiement confirmé ? · Bon réseau ? · Bonne adresse (4 premiers + 4 derniers caractères vérifiés) ? · Bon montant ? Si les 4 sont OK, envoyez." },
    ],
  },
  {
    id: 'process-sell', cat: 'ops', title: "PROCÉDURE — Traiter une VENTE (mode opératoire complet)",
    summary: "Le client nous envoie des USDT, nous devons le payer en CFA.",
    body: [
      { t: 'p', x: "Une VENTE signifie : le client nous envoie de l'USDT sur notre portefeuille, et nous devons le payer en CFA sur son numéro Mobile Money. Ici, l'ordre est inversé : on reçoit d'abord, on paie ensuite." },
      { t: 'h', x: "Étape 1 — Prendre en charge" },
      { t: 'p', x: "Comme pour un achat : ouvrez la commande de vente et cliquez « Prendre en charge » pour la verrouiller à votre nom." },
      { t: 'h', x: "Étape 2 — Vérifier la RÉCEPTION des USDT (le point critique)" },
      { t: 'steps', x: [
        "Ouvrez l'onglet « Transaction » pour voir le montant d'USDT et le réseau attendus.",
        "Vérifiez sur NOTRE portefeuille (ou sur l'explorateur blockchain du bon réseau) que les USDT sont bien ARRIVÉS.",
        "Contrôlez trois choses : le bon MONTANT, le bon RÉSEAU, et le statut CONFIRMÉ sur la blockchain.",
      ] },
      { t: 'warn', x: "Ne payez JAMAIS le client avant d'avoir vérifié vous-même que ses USDT sont réellement arrivés et confirmés. Une capture d'écran du client ne suffit pas : seule la transaction confirmée on-chain fait foi." },
      { t: 'h', x: "Étape 3 — Lire le montant CFA et le NUMÉRO à payer" },
      { t: 'steps', x: [
        "Dans la carte « À faire », lisez le MONTANT exact en CFA à envoyer.",
        "Lisez le NUMÉRO du client : celui saisi DANS la commande (onglet Paiement) — pas forcément le numéro du compte.",
        "Notez le prestataire indiqué (Wave ou Orange Money).",
      ] },
      { t: 'warn', x: "Le numéro à payer est celui que le client a indiqué DANS cette commande de vente. Il peut vouloir être payé sur un autre numéro que celui de son compte. Utilisez TOUJOURS le numéro de l'onglet Paiement de la commande, jamais un numéro reçu par message." },
      { t: 'h', x: "Étape 4 — Payer et clôturer" },
      { t: 'steps', x: [
        "Envoyez le montant exact en CFA via Wave ou Orange Money sur le numéro indiqué.",
        "Conservez la preuve de paiement (reçu Mobile Money).",
        "Revenez sur la commande et cliquez « Marquer comme terminé ».",
      ] },
      { t: 'note', x: "Checklist avant de payer : ✔ USDT reçus et confirmés (montant + réseau) ? ✔ Bon montant CFA ? ✔ Bon numéro (celui de la commande) ? Si oui, payez." },
    ],
  },
  {
    id: 'process-transfer', cat: 'ops', title: "PROCÉDURE — Traiter un VIREMENT international",
    summary: "Envoyer de l'argent vers un bénéficiaire à l'étranger.",
    body: [
      { t: 'p', x: "Un virement international consiste à faire parvenir de l'argent à un bénéficiaire dans un autre pays. La commande contient les informations du destinataire et le montant à lui faire parvenir." },
      { t: 'h', x: "Procédure" },
      { t: 'steps', x: [
        "Prenez la commande en charge.",
        "Vérifiez que le client a bien payé (montant + frais). Onglet Paiement.",
        "Ouvrez l'onglet « Bénéficiaire » : nom exact, pays, téléphone, éventuellement email, ainsi que le montant à recevoir et la devise d'arrivée.",
        "Effectuez le versement au bénéficiaire par le canal prévu (selon le pays et la méthode définie en interne).",
        "Conservez la preuve d'envoi.",
        "Cliquez « Marquer comme terminé ».",
      ] },
      { t: 'warn', x: "Vérifiez soigneusement le NOM et le NUMÉRO du bénéficiaire : une erreur sur un transfert international est difficile à corriger. En cas d'incohérence, contactez le client avant d'envoyer." },
      { t: 'note', x: "Les frais et le montant à recevoir sont indiqués dans l'onglet Bénéficiaire. Si le pays ou la méthode de versement n'est pas clair, escaladez à un responsable plutôt que de deviner." },
    ],
  },
  {
    id: 'process-otc', cat: 'ops', title: "PROCÉDURE — Traiter une commande OTC (gros volume)",
    summary: "Les très gros montants, à traiter avec un soin particulier.",
    body: [
      { t: 'p', x: "OTC (« Over The Counter ») désigne les transactions de gros volume, traitées de gré à gré avec un taux négocié. Ces commandes engagent des montants importants : la moindre erreur y coûte très cher. Elles demandent une vigilance maximale et, le plus souvent, la validation d'un responsable." },
      { t: 'h', x: "Règles spécifiques à l'OTC" },
      { t: 'ul', x: [
        "Le taux est souvent négocié spécifiquement : ne l'appliquez pas de tête, référez-vous à ce qui a été convenu avec le client.",
        "Vérifiez le KYC du client : un gros volume sur un compte non vérifié est un signal d'alerte majeur.",
        "Vérifiez la provenance des fonds si demandé (conformité).",
        "Pour les montants les plus élevés, un envoi en plusieurs fois (par paliers) peut être demandé — suivez la consigne interne.",
        "Faites valider par un responsable avant tout envoi important.",
      ] },
      { t: 'warn', x: "Sur l'OTC, ne prenez JAMAIS d'initiative seul si un doute existe (montant, taux, provenance, identité). Une erreur ou une fraude sur un gros volume peut mettre l'entreprise en difficulté. Dans le doute : on s'arrête, on vérifie, on escalade." },
    ],
  },
  {
    id: 'claim-lock', cat: 'ops', title: "La prise en charge et le verrouillage",
    summary: "Pourquoi c'est obligatoire et comment ça marche.",
    body: [
      { t: 'p', x: "Avant de traiter toute commande, il faut cliquer « Prendre en charge ». Cette action verrouille la commande à votre nom : elle devient VOTRE responsabilité, et personne d'autre dans l'équipe ne peut la traiter en même temps." },
      { t: 'h', x: "Pourquoi c'est indispensable" },
      { t: 'ul', x: [
        "Éviter le double traitement : sans verrou, deux opérateurs pourraient envoyer les fonds à un même client → double perte pour l'entreprise.",
        "Traçabilité : chaque prise en charge et chaque action sont inscrites dans le Journal (qui, quoi, quand). En cas de problème, on sait qui a fait quoi.",
        "Responsabilité claire : une commande = un responsable identifié.",
      ] },
      { t: 'h', x: "Les bons réflexes" },
      { t: 'ul', x: [
        "Ne prenez en charge que ce que vous allez traiter tout de suite.",
        "Si finalement vous ne pouvez pas la traiter, cliquez « Libérer » pour la remettre dans la file.",
        "Si vous voyez « Un collègue traite déjà cette commande » : ne la touchez pas, il s'en occupe.",
      ] },
      { t: 'note', x: "Le Journal d'activité (onglet Historique d'une commande) garde une trace permanente et infalsifiable. Travaillez toujours proprement : ce que vous faites est enregistré." },
    ],
  },
  {
    id: 'cancel-order', cat: 'ops', title: "PROCÉDURE — Annuler une commande",
    summary: "Quand annuler, et comment le faire proprement.",
    body: [
      { t: 'p', x: "On annule une commande quand elle ne peut pas être honorée. Il faut le faire proprement pour que le client soit informé et que la comptabilité reste juste." },
      { t: 'h', x: "Quand annuler" },
      { t: 'ul', x: [
        "Le paiement n'a pas été reçu dans les délais.",
        "Les informations sont erronées ou impossibles à exécuter (mauvaise adresse, numéro invalide).",
        "Le client demande lui-même l'annulation avant traitement.",
        "Il existe un doute sérieux de fraude (voir Sécurité) — dans ce cas, escaladez d'abord.",
      ] },
      { t: 'h', x: "Comment annuler" },
      { t: 'steps', x: [
        "Ouvrez la commande, cliquez « Annuler ».",
        "Renseignez le MOTIF d'annulation dans le champ prévu (soyez précis : « paiement non reçu », « adresse invalide »…).",
        "Cliquez « Envoyer l'email d'annulation » pour prévenir automatiquement le client.",
      ] },
      { t: 'note', x: "Rappel : les ACHATS non payés sont annulés automatiquement au bout de 30 minutes. Les VENTES et les autres cas s'annulent manuellement. N'annulez jamais une commande déjà payée sans en informer un responsable." },
    ],
  },
  {
    id: 'daily-routine', cat: 'ops', title: "La routine quotidienne de l'opérateur",
    summary: "Ce qu'on fait à l'ouverture, pendant, et à la fermeture.",
    body: [
      { t: 'h', x: "À l'arrivée (ouverture de service)" },
      { t: 'steps', x: [
        "Pointez votre arrivée (bouton « Pointer l'arrivée » en haut du back-office).",
        "Vérifiez la File d'attente : combien de commandes en attente, y a-t-il des commandes anciennes (ancienneté élevée) à traiter en priorité ?",
        "Traitez d'abord les plus anciennes et les plus urgentes.",
      ] },
      { t: 'h', x: "Pendant le service" },
      { t: 'ul', x: [
        "Prenez les commandes une par une, traitez-les complètement avant de passer à la suivante.",
        "Respectez les procédures d'achat / vente à la lettre (vérifier, envoyer, clôturer).",
        "Au moindre doute (paiement, réseau, fraude), arrêtez-vous et vérifiez.",
        "Gardez la file la plus courte possible : la rapidité fait notre réputation.",
      ] },
      { t: 'h', x: "À la fin (fermeture de service)" },
      { t: 'steps', x: [
        "Assurez-vous de ne laisser aucune commande « en traitement » à votre nom non terminée : terminez-la ou libérez-la.",
        "Pointez votre sortie (bouton « Sortie »).",
      ] },
      { t: 'note', x: "Ne quittez jamais votre service en laissant une commande verrouillée à votre nom : elle resterait bloquée pour les autres. Terminez ou libérez avant de partir." },
    ],
  },
  {
    id: 'escalation', cat: 'ops', title: "Que faire en cas de problème (escalade)",
    summary: "Les situations où l'on s'arrête et où l'on demande de l'aide.",
    body: [
      { t: 'p', x: "Personne n'est censé tout gérer seul. Certaines situations DOIVENT être remontées à un responsable avant d'agir. Mieux vaut une commande en retard qu'une erreur irréparable." },
      { t: 'h', x: "Situations à escalader immédiatement" },
      { t: 'ul', x: [
        "Doute sérieux de fraude (voir Sécurité).",
        "Gros montant / OTC inhabituel, surtout sur un compte récent ou non vérifié.",
        "Le client dit avoir payé mais le paiement n'apparaît pas.",
        "Une erreur a été commise (mauvais réseau, mauvais montant, mauvais destinataire).",
        "Incohérence entre l'identité, le paiement et la commande.",
        "Tout ce dont vous n'êtes pas sûr à 100 %.",
      ] },
      { t: 'warn', x: "Si une erreur d'envoi a été commise (fonds partis au mauvais endroit) : NE tentez PAS de la « rattraper » seul dans la précipitation. Signalez-la tout de suite, calmement, avec le txID et les détails. Plus l'information remonte vite, plus il y a de chances d'agir." },
      { t: 'note', x: "Escalader n'est pas un échec, c'est un réflexe professionnel. Les meilleures équipes sont celles qui savent dire « je ne suis pas sûr, je vérifie »." },
    ],
  },

  // ═══════════════════ PAIEMENTS & VÉRIFICATIONS ═══════════════════
  {
    id: 'payment-methods', cat: 'pay', title: "Les moyens de paiement : Wave, Orange Money, Naboopay",
    summary: "Qui fait quoi dans la chaîne de paiement.",
    body: [
      { t: 'kv', x: [
        ['Wave', "Service de Mobile Money très répandu au Sénégal et en Afrique de l'Ouest. Paiement et versement par numéro de téléphone. Frais faibles."],
        ['Orange Money', "Le Mobile Money d'Orange. Même principe : versement par numéro. Certains clients préfèrent l'un ou l'autre."],
        ['Naboopay', "Le prestataire (agrégateur) qui ENCAISSE les paiements des clients pour les ACHATS. Quand un client paie, Naboopay confirme automatiquement le paiement à la plateforme, qui met le statut à « confirmé »."],
      ] },
      { t: 'h', x: "Le sens des flux" },
      { t: 'ul', x: [
        "ACHAT : le client PAIE (via Naboopay / Wave / Orange) → statut de paiement « confirmé » → on envoie l'USDT.",
        "VENTE : le client nous envoie l'USDT → on le PAIE en CFA via Wave ou Orange Money sur son numéro.",
      ] },
      { t: 'note', x: "Retenez : à l'achat, Naboopay gère l'encaissement automatiquement. À la vente, c'est NOUS qui versons manuellement, sur le numéro indiqué dans la commande." },
    ],
  },
  {
    id: 'verify-payment', cat: 'pay', title: "PROCÉDURE — Vérifier un paiement (achat et vente)",
    summary: "La vérification qui protège l'argent de l'entreprise.",
    body: [
      { t: 'p', x: "Vérifier le paiement est l'étape qui protège l'entreprise. Ne l'expédiez jamais. La méthode diffère selon achat ou vente." },
      { t: 'h', x: "Vérifier un ACHAT (le client a payé en CFA)" },
      { t: 'steps', x: [
        "Ouvrez la commande, onglet Paiement + statut.",
        "Le paiement via Naboopay doit afficher « confirmé » (mise à jour automatique).",
        "Si « en attente » : le paiement n'est pas (encore) validé → n'envoyez rien.",
        "Si le client insiste avoir payé alors que le statut ne bouge pas → escaladez, ne devinez pas.",
      ] },
      { t: 'h', x: "Vérifier une VENTE (le client nous envoie de l'USDT)" },
      { t: 'steps', x: [
        "Regardez le montant et le réseau attendus (onglet Transaction).",
        "Ouvrez l'explorateur blockchain du bon réseau (Tronscan pour TRC20, etc.) ou consultez notre portefeuille.",
        "Confirmez : bon montant reçu, bon réseau, statut « Success / confirmé ».",
        "Seulement alors, payez le client en CFA.",
      ] },
      { t: 'warn', x: "Ne vous fiez JAMAIS à une capture d'écran, un SMS ou une parole. À l'achat : le statut « confirmé » de la plateforme. À la vente : la transaction confirmée on-chain. Ce sont les deux seules preuves valables." },
    ],
  },

  // ═══════════════════ KYC ═══════════════════
  {
    id: 'kyc-why', cat: 'kyc', title: "Le KYC : rôle, procédure et critères de décision",
    summary: "Vérifier l'identité : pourquoi et comment décider.",
    body: [
      { t: 'p', x: "KYC signifie « Know Your Customer » (connaître son client). C'est la vérification d'identité obligatoire avant que le client puisse transiger librement. Elle protège la plateforme contre la fraude, l'usurpation d'identité et le blanchiment d'argent, et c'est une obligation légale et réglementaire." },
      { t: 'h', x: "Ce que le client fournit" },
      { t: 'ul', x: [
        "Une pièce d'identité (recto et souvent verso) : passeport, carte d'identité ou permis.",
        "Un selfie (photo de son visage) pour prouver que c'est bien lui.",
        "Parfois un justificatif de domicile.",
        "Ses informations personnelles (nom, date de naissance, nationalité, adresse).",
      ] },
      { t: 'h', x: "PROCÉDURE — traiter une vérification" },
      { t: 'steps', x: [
        "Ouvrez la vérification dans l'onglet KYC (les dossiers « à traiter / soumis » sont prioritaires).",
        "Ouvrez chaque document : vérifiez qu'il est LISIBLE, NET et NON EXPIRÉ.",
        "Comparez la PHOTO de la pièce avec le SELFIE : est-ce visiblement la même personne ?",
        "Vérifiez que le NOM de la pièce correspond aux informations du compte.",
        "Décidez : « Approuver » si tout est cohérent, « Mettre en révision » si vous voulez un second regard, « Rejeter » avec un motif clair si quelque chose ne va pas.",
      ] },
      { t: 'h', x: "Motifs de rejet fréquents" },
      { t: 'ul', x: [
        "Document flou, coupé ou illisible.",
        "Pièce expirée.",
        "Le selfie ne correspond pas à la photo de la pièce.",
        "Le nom ne correspond pas au compte.",
        "Soupçon de document falsifié.",
      ] },
      { t: 'warn', x: "En cas de doute sur l'authenticité d'un document, NE L'APPROUVEZ PAS. Mettez « en révision » et signalez-le. Un KYC approuvé à tort ouvre la porte à la fraude." },
    ],
  },

  // ═══════════════════ SÉCURITÉ & FRAUDE ═══════════════════
  {
    id: 'fraud-signals', cat: 'fraud', title: "Reconnaître les signaux de fraude",
    summary: "Ce qui doit vous rendre méfiant, et pourquoi.",
    body: [
      { t: 'p', x: "Les fraudeurs cherchent à nous faire envoyer des fonds sans contrepartie réelle, ou à utiliser la plateforme pour blanchir de l'argent. Votre vigilance est la première protection. Voici les signaux qui doivent alerter." },
      { t: 'h', x: "Signaux comportementaux" },
      { t: 'ul', x: [
        "Le client met la PRESSION pour qu'on envoie vite, avant confirmation du paiement (« dépêchez-vous », « je suis pressé »).",
        "Il demande à changer le numéro / le wallet de réception au DERNIER moment, avec insistance.",
        "Il fournit des preuves de paiement par capture d'écran plutôt que par le canal officiel.",
        "Ses explications sont confuses ou changent d'une fois à l'autre.",
      ] },
      { t: 'h', x: "Signaux sur le compte / la commande" },
      { t: 'ul', x: [
        "Beaucoup de commandes en très peu de temps (vélocité anormale).",
        "Montant élevé sur un compte récent ou dont le KYC n'est pas vérifié.",
        "Incohérence entre l'identité (KYC), le nom du compte et les informations de paiement.",
        "Taux d'annulation élevé sur son historique.",
      ] },
      { t: 'note', x: "La fiche Client 360° (accessible depuis une commande) affiche automatiquement des drapeaux « À surveiller » : taux d'annulation, vélocité, KYC non vérifié. Consultez-la systématiquement au moindre doute." },
      { t: 'warn', x: "En présence d'un doute sérieux : NE TRAITEZ PAS la commande. Prenez le temps de vérifier et escaladez à un responsable. Un fraudeur compte sur votre précipitation. La lenteur est ici une protection." },
    ],
  },
  {
    id: 'security-rules', cat: 'fraud', title: "Les 8 règles de sécurité (à connaître par cœur)",
    summary: "Le minimum vital, à respecter en toutes circonstances.",
    body: [
      { t: 'steps', x: [
        "Ne jamais envoyer de fonds avant d'avoir CONFIRMÉ le paiement (achat) ou la RÉCEPTION on-chain (vente).",
        "Toujours COPIER-COLLER les adresses et numéros — jamais les retaper à la main.",
        "Toujours VÉRIFIER LE RÉSEAU avant d'envoyer de l'USDT (TRC20 ≠ BEP20).",
        "Toujours utiliser le numéro / l'adresse de LA COMMANDE, jamais reçu par message au dernier moment.",
        "Ne jamais traiter une commande déjà prise en charge par un collègue.",
        "Ne jamais partager vos accès, mots de passe ou codes — même à un « collègue » ou un « responsable » par message.",
        "Vérifier la fiche Client 360° au moindre doute.",
        "Dans le doute, on S'ARRÊTE et on DEMANDE. Toujours.",
      ] },
      { t: 'note', x: "Ces règles ne sont pas des suggestions : ce sont les garde-fous qui protègent l'argent de l'entreprise et votre responsabilité. Une seule règle enfreinte peut coûter très cher." },
    ],
  },

  // ═══════════════════ FAQ CLIENTS ═══════════════════
  {
    id: 'faq-common', cat: 'faq', title: "Réponses aux questions fréquentes des clients",
    summary: "Ce que les clients demandent souvent, et comment répondre.",
    body: [
      { t: 'p', x: "Voici des réponses claires et rassurantes à donner aux clients. Restez poli, professionnel, et ne promettez jamais l'impossible." },
      { t: 'kv', x: [
        ["« Combien de temps pour recevoir mes USDT ? »", "Généralement quelques minutes après la confirmation du paiement, le temps qu'un opérateur traite et que le réseau blockchain confirme la transaction."],
        ["« J'ai payé mais je n'ai rien reçu »", "On vérifie le statut de sa commande. Si « en attente », le paiement n'est peut-être pas encore confirmé. Si « terminé », on lui demande son adresse/réseau et on vérifie la transaction sur l'explorateur."],
        ["« Je me suis trompé de réseau / d'adresse »", "Malheureusement, un envoi crypto est irréversible : on ne peut pas récupérer des fonds envoyés à la mauvaise adresse ou sur le mauvais réseau. On l'invite à toujours bien vérifier avant de valider."],
        ["« C'est quoi le taux du jour ? »", "Le prix d'1 USDT en CFA affiché sur la plateforme, mis à jour en temps réel selon le marché."],
        ["« Pourquoi je dois faire le KYC ? »", "C'est une vérification d'identité obligatoire, pour la sécurité de tous et pour lutter contre la fraude. Une fois vérifié, il peut transiger librement."],
        ["« Puis-je être payé sur un autre numéro que celui de mon compte ? »", "Oui : à la vente, il indique le numéro de réception directement dans sa commande."],
        ["« Est-ce sécurisé ? »", "Oui : chaque opération est vérifiée par un opérateur, l'identité des clients est contrôlée (KYC), et chaque action est tracée."],
        ["« Vos frais / votre marge ? »", "Le taux affiché inclut tout : pas de frais cachés. Le prix d'achat est légèrement au-dessus du marché, le prix de rachat légèrement en dessous."],
      ] },
    ],
  },

  // ═══════════════════ GLOSSAIRE ═══════════════════
  {
    id: 'glossary', cat: 'glossary', title: "Glossaire complet de la crypto et de Terex",
    summary: "Tous les termes à connaître, expliqués simplement.",
    body: [
      { t: 'kv', x: [
        ['USDT / Tether', "Le « dollar numérique » (stablecoin) que nous échangeons contre des CFA."],
        ['Stablecoin', "Cryptomonnaie stable, adossée à une vraie monnaie (le dollar pour l'USDT)."],
        ['Cryptomonnaie', "Monnaie numérique qui circule sur une blockchain, sans banque centrale."],
        ['Blockchain', "Registre public et infalsifiable de toutes les transactions crypto."],
        ['Réseau', "La blockchain sur laquelle circule l'USDT : TRC20, BEP20, ERC20, Polygon, Solana…"],
        ['TRC20', "USDT sur le réseau Tron. Le plus utilisé chez nous : frais bas, rapide."],
        ['BEP20', "USDT sur BNB Smart Chain (Binance)."],
        ['ERC20', "USDT sur Ethereum (frais parfois plus élevés)."],
        ['Wallet', "Portefeuille crypto (application) qui stocke les fonds et fournit une adresse."],
        ['Adresse', "Le « numéro de compte » crypto (longue suite de caractères) où l'on envoie les fonds."],
        ['txID / hash', "Identifiant unique d'une transaction : la preuve d'un envoi, vérifiable en ligne."],
        ['Explorateur', "Site web pour vérifier une transaction (Tronscan, BscScan, Etherscan…)."],
        ['Confirmation', "Validation d'une transaction par le réseau. Tant que non confirmée, on n'agit pas."],
        ['Binance', "La plus grande plateforme d'échange crypto au monde ; certains clients y reçoivent."],
        ['Binance Pay', "Service de Binance permettant de recevoir via email / ID au lieu d'une adresse."],
        ['KYC', "« Know Your Customer » : la vérification d'identité obligatoire."],
        ['Mobile Money', "Paiement mobile par numéro de téléphone (Wave, Orange Money)."],
        ['Naboopay', "Le prestataire qui encaisse les paiements des clients pour les achats."],
        ['Taux du jour', "Prix d'1 USDT en CFA à l'instant présent."],
        ['Marge', "Le bénéfice de Terex, intégré dans le taux (pas de frais affichés)."],
        ['OTC', "« Over The Counter » : transactions de gros volume, à taux négocié."],
        ['Prise en charge', "Verrouiller une commande à son nom avant de la traiter."],
      ] },
    ],
  },
];

// ── Rendu d'un bloc ───────────────────────────────────────────────────────────
function BlockView({ b }: { b: Block }) {
  if (b.t === 'p') return <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{b.x}</p>;
  if (b.t === 'h') return <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 700, margin: '6px 0 0' }}>{b.x}</p>;
  if (b.t === 'ul') return (
    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {b.x.map((it, i) => <li key={i} style={{ color: '#d1d5db', fontSize: 13.5, lineHeight: 1.65 }}>{it}</li>)}
    </ul>
  );
  if (b.t === 'steps') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {b.x.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0, width: 23, height: 23, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
          <p style={{ color: '#d1d5db', fontSize: 13.5, lineHeight: 1.65, margin: 0, paddingTop: 1 }}>{it}</p>
        </div>
      ))}
    </div>
  );
  if (b.t === 'note') return (
    <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 15px' }}>
      <BookOpen size={15} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{b.x}</p>
    </div>
  );
  if (b.t === 'warn') return (
    <div style={{ display: 'flex', gap: 10, background: 'rgba(224,122,122,0.05)', border: `1px solid rgba(224,122,122,0.25)`, borderRadius: 12, padding: '13px 15px' }}>
      <AlertTriangle size={15} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ color: '#e8c9c9', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{b.x}</p>
    </div>
  );
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      {b.x.map(([k, v], i) => (
        <div key={i} style={{ padding: '12px 15px', borderBottom: i < b.x.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{k}</p>
          <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{v}</p>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeBase() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  const q = search.trim().toLowerCase();
  const list = useMemo(() => ARTICLES.filter(a =>
    (cat === 'all' || a.cat === cat) &&
    (!q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.body.some(bl =>
      ('x' in bl) && JSON.stringify(bl.x).toLowerCase().includes(q)))
  ), [q, cat]);

  const article = openId ? ARTICLES.find(a => a.id === openId) : null;

  if (article) {
    const C = CATS.find(c => c.id === article.cat);
    return (
      <>
        <style>{drillStyles}</style>
        <DrillPage title={article.title} sub={catLabel(article.cat)} onBack={() => setOpenId(null)}
          right={C ? <C.Icon size={18} color="rgba(255,255,255,0.5)" /> : undefined}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, maxWidth: 740 }}>
            {article.body.map((b, i) => <BlockView key={i} b={b} />)}
          </div>
        </DrillPage>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>
      <PageHeader title="Base de connaissances" sub="Tout ce qu'un membre de l'équipe doit savoir — crypto, plateforme, procédures détaillées" />

      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un sujet (ex. réseau, KYC, vente, fraude, virement…)"
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '11px 14px 11px 38px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
        <FilterChip label="Tout" count={ARTICLES.length} selected={cat === 'all'} onClick={() => setCat('all')} />
        {CATS.map(c => {
          const n = ARTICLES.filter(a => a.cat === c.id).length;
          return <FilterChip key={c.id} label={c.label} count={n} selected={cat === c.id} onClick={() => setCat(c.id)} />;
        })}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '24px 16px', margin: 0, textAlign: 'center' }}>Aucun article ne correspond à « {search} ».</p>
        ) : list.map((a, i) => {
          const C = CATS.find(c => c.id === a.cat);
          return (
            <button key={a.id} onClick={() => setOpenId(a.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: i < list.length - 1 ? `1px solid ${BORDER}` : 'none', padding: '14px 16px', cursor: 'pointer' }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {C ? <C.Icon size={17} color="rgba(255,255,255,0.75)" /> : <BookOpen size={17} color="rgba(255,255,255,0.75)" />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 600 }}>{a.title}</span>
                <span style={{ display: 'block', color: '#6b7280', fontSize: 12.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.summary}</span>
              </span>
              <ChevronRight size={16} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
