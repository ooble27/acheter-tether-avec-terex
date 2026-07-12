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
  { id: 'ops', label: 'Traiter les commandes', Icon: ClipboardCheck },
  { id: 'pay', label: 'Paiements', Icon: CreditCard },
  { id: 'kyc', label: 'KYC & conformité', Icon: ShieldCheck },
  { id: 'fraud', label: 'Sécurité & fraude', Icon: AlertTriangle },
  { id: 'faq', label: 'Questions clients', Icon: HelpCircle },
  { id: 'glossary', label: 'Glossaire', Icon: GraduationCap },
];
const catLabel = (id: string) => CATS.find(c => c.id === id)?.label || id;

const ARTICLES: Article[] = [
  // ─────────── BASES DE LA CRYPTO ───────────
  {
    id: 'what-usdt', cat: 'crypto', title: "C'est quoi l'USDT (Tether) ?",
    summary: "Le stablecoin qu'on achète et vend sur Terex.",
    body: [
      { t: 'p', x: "L'USDT (« Tether ») est une monnaie numérique dont la valeur est fixée sur le dollar américain : 1 USDT vaut toujours environ 1 dollar. On appelle ça un « stablecoin » (monnaie stable), car contrairement au Bitcoin, son prix ne monte ni ne descend brutalement." },
      { t: 'p', x: "Sur Terex, le client échange des CFA contre de l'USDT (achat) ou de l'USDT contre des CFA (vente). Notre métier, c'est ce change." },
      { t: 'kv', x: [
        ['Stablecoin', "Cryptomonnaie stable, adossée à une vraie monnaie (ici le dollar)."],
        ['1 USDT', "≈ 1 dollar US ≈ le taux du jour en CFA (ex. 585 CFA)."],
        ['À quoi ça sert', "Envoyer/recevoir de l'argent à l'international, se protéger de l'inflation, épargner en dollars."],
      ] },
      { t: 'note', x: "Retenez l'essentiel : l'USDT est un « dollar numérique ». Le client veut soit en acheter (nous lui en envoyons), soit en vendre (il nous en envoie, on le paie en CFA)." },
    ],
  },
  {
    id: 'blockchain-networks', cat: 'crypto', title: "Blockchain, réseaux (TRC20, BEP20…) et adresses",
    summary: "Comprendre les réseaux et pourquoi ils comptent.",
    body: [
      { t: 'p', x: "Une blockchain est un grand registre public où sont inscrites toutes les transactions crypto. L'USDT peut circuler sur plusieurs blockchains différentes, qu'on appelle « réseaux »." },
      { t: 'h', x: "Les réseaux les plus courants" },
      { t: 'kv', x: [
        ['TRC20', "Réseau Tron. Le plus utilisé chez nous : frais très bas, rapide."],
        ['BEP20', "Réseau BNB Smart Chain (Binance). Frais bas."],
        ['ERC20', "Réseau Ethereum. Frais souvent plus élevés."],
        ['Polygon / Solana / Aptos', "Autres réseaux rapides et peu chers."],
      ] },
      { t: 'warn', x: "RÈGLE D'OR : on envoie toujours l'USDT sur LE MÊME réseau que celui choisi par le client. Envoyer sur un mauvais réseau = fonds perdus, impossible à récupérer. Vérifiez toujours le réseau avant d'envoyer." },
      { t: 'h', x: "L'adresse de wallet" },
      { t: 'p', x: "Une adresse est comme un numéro de compte crypto : une longue suite de lettres et de chiffres (ex. TXYZa1b2C3...). C'est là qu'on envoie l'USDT du client lors d'un achat. Elle doit être copiée-collée EXACTEMENT, jamais recopiée à la main." },
    ],
  },
  {
    id: 'wallet-binance', cat: 'crypto', title: "Wallet, Binance : où le client reçoit ses USDT",
    summary: "Les deux destinations possibles d'un achat.",
    body: [
      { t: 'p', x: "Quand un client achète de l'USDT, il doit indiquer OÙ le recevoir. Deux cas :" },
      { t: 'kv', x: [
        ['Wallet personnel', "Une application crypto (Trust Wallet, MetaMask…) avec une adresse. On envoie à cette adresse, sur le bon réseau."],
        ['Compte Binance', "Le client donne son email / ID Binance. On envoie via Binance Pay ou vers son adresse de dépôt Binance."],
      ] },
      { t: 'note', x: "Dans le détail d'une commande, l'onglet « Destination » (achat) vous montre l'adresse et le réseau exacts à utiliser. Copiez, ne retapez jamais." },
    ],
  },

  // ─────────── COMMENT TEREX MARCHE ───────────
  {
    id: 'terex-overview', cat: 'terex', title: "Ce que fait Terex (vue d'ensemble)",
    summary: "Achat, vente, virement, OTC — en une page.",
    body: [
      { t: 'p', x: "Terex (Teranga Exchange) est une plateforme de change entre le franc CFA et l'USDT. Quatre services :" },
      { t: 'kv', x: [
        ['Acheter', "Le client paie en CFA (Wave/Orange Money) → on lui envoie des USDT."],
        ['Vendre', "Le client nous envoie des USDT → on le paie en CFA sur son numéro Mobile Money."],
        ['Virement', "Transfert international pour envoyer de l'argent vers un autre pays."],
        ['OTC', "Gros volumes, traités au cas par cas avec un taux négocié."],
      ] },
      { t: 'p', x: "Notre rôle d'équipe : traiter chaque commande vite et sans erreur — vérifier le paiement, envoyer les bons fonds, et marquer la commande terminée." },
    ],
  },
  {
    id: 'rate-margin', cat: 'terex', title: "Le taux du jour et la marge",
    summary: "Comment Terex gagne de l'argent.",
    body: [
      { t: 'p', x: "Le « taux du jour » est le prix d'1 USDT en CFA (ex. 585 CFA). Il suit le marché et est mis à jour en temps réel." },
      { t: 'h', x: "D'où vient notre marge" },
      { t: 'kv', x: [
        ['Achat', "Le client paie un peu au-dessus du marché (~+2 %). La différence est notre marge."],
        ['Vente', "On rachète l'USDT un peu en dessous du marché (~-10 CFA par USDT). La différence est notre marge."],
        ['Virement', "Des frais sont facturés sur le transfert."],
      ] },
      { t: 'note', x: "Vous n'avez pas à calculer la marge : la plateforme applique le taux automatiquement. Retenez juste le principe pour répondre aux clients." },
    ],
  },

  // ─────────── TRAITER LES COMMANDES (métier opérateur) ───────────
  {
    id: 'process-buy', cat: 'ops', title: "Traiter un ACHAT (étape par étape)",
    summary: "Le client a payé, on doit envoyer les USDT.",
    body: [
      { t: 'p', x: "Un achat = le client a payé en CFA, on doit lui envoyer l'USDT. Voici la procédure exacte :" },
      { t: 'steps', x: [
        "Ouvrez la commande depuis la File d'attente et cliquez « Prendre en charge » (elle se verrouille à votre nom).",
        "Vérifiez que le paiement est bien confirmé (statut du paiement / onglet Paiement).",
        "Dans la carte « À faire », lisez le MONTANT en USDT, le RÉSEAU et copiez l'ADRESSE de réception.",
        "Envoyez l'USDT depuis le portefeuille de l'entreprise, sur EXACTEMENT ce réseau et cette adresse.",
        "Une fois l'envoi effectué (transaction confirmée), revenez et cliquez « Marquer comme terminé ».",
      ] },
      { t: 'warn', x: "N'envoyez JAMAIS les USDT avant d'avoir confirmé que le client a bien payé. Une fois l'USDT envoyé, c'est irréversible." },
    ],
  },
  {
    id: 'process-sell', cat: 'ops', title: "Traiter une VENTE (étape par étape)",
    summary: "Le client nous envoie des USDT, on le paie en CFA.",
    body: [
      { t: 'p', x: "Une vente = le client nous envoie de l'USDT, on doit le payer en CFA sur son numéro Mobile Money." },
      { t: 'steps', x: [
        "Prenez la commande en charge.",
        "Vérifiez que les USDT du client sont bien arrivés sur notre portefeuille (bon montant, bon réseau).",
        "Dans la carte « À faire », lisez le MONTANT en CFA à envoyer et le NUMÉRO du client (celui saisi DANS la commande, onglet Paiement).",
        "Envoyez l'argent via Wave ou Orange Money sur ce numéro exact.",
        "Cliquez « Marquer comme terminé ».",
      ] },
      { t: 'warn', x: "Le numéro à payer est celui indiqué DANS la commande, pas forcément le numéro du compte du client. Il peut vouloir être payé sur un autre numéro. Utilisez toujours celui de l'onglet Paiement." },
    ],
  },
  {
    id: 'claim-lock', cat: 'ops', title: "La prise en charge (pourquoi c'est obligatoire)",
    summary: "Éviter que deux personnes traitent la même commande.",
    body: [
      { t: 'p', x: "Avant de traiter une commande, il faut « Prendre en charge ». Cela la verrouille à votre nom pour tout le reste de l'équipe." },
      { t: 'ul', x: [
        "Personne d'autre ne peut la traiter en même temps → pas de double envoi.",
        "Chaque action est tracée dans le Journal (qui, quoi, quand).",
        "Si finalement vous ne la traitez pas, cliquez « Libérer » pour la rendre disponible.",
      ] },
      { t: 'note', x: "Si vous voyez « Un collègue traite déjà cette commande », ne la touchez pas : il s'en occupe." },
    ],
  },
  {
    id: 'cancel-order', cat: 'ops', title: "Annuler une commande",
    summary: "Quand et comment annuler proprement.",
    body: [
      { t: 'p', x: "On annule une commande quand elle ne peut pas être honorée : paiement non reçu, informations erronées, demande du client, doute sérieux (voir Sécurité)." },
      { t: 'steps', x: [
        "Ouvrez la commande, cliquez « Annuler ».",
        "Indiquez le motif d'annulation dans le champ prévu.",
        "Cliquez « Envoyer l'email d'annulation » pour prévenir le client automatiquement.",
      ] },
      { t: 'note', x: "Les achats non payés sont annulés automatiquement après 30 minutes. Les ventes s'annulent manuellement." },
    ],
  },

  // ─────────── PAIEMENTS ───────────
  {
    id: 'payment-methods', cat: 'pay', title: "Wave, Orange Money, Naboopay",
    summary: "Les moyens de paiement et comment vérifier.",
    body: [
      { t: 'kv', x: [
        ['Wave', "Mobile Money très utilisé au Sénégal. Paiement/versement par numéro de téléphone."],
        ['Orange Money', "Mobile Money d'Orange. Idem, par numéro."],
        ['Naboopay', "Le prestataire qui encaisse les paiements des clients pour les achats. Il confirme automatiquement le paiement à la plateforme."],
      ] },
      { t: 'h', x: "Vérifier qu'un paiement est bien reçu" },
      { t: 'ul', x: [
        "Achat : le statut du paiement passe à « confirmé » automatiquement quand Naboopay valide.",
        "Vente : vérifiez sur notre portefeuille crypto que les USDT sont bien arrivés (montant ET réseau).",
        "En cas de doute, ne traitez pas : demandez à un responsable.",
      ] },
    ],
  },

  // ─────────── KYC ───────────
  {
    id: 'kyc-why', cat: 'kyc', title: "Le KYC : c'est quoi, à quoi ça sert",
    summary: "Vérifier l'identité des clients.",
    body: [
      { t: 'p', x: "KYC = « Know Your Customer » (connaître son client). C'est la vérification d'identité obligatoire : pièce d'identité, selfie, justificatif. Ça protège la plateforme contre la fraude et le blanchiment, et c'est une obligation légale." },
      { t: 'h', x: "Comment traiter une vérification" },
      { t: 'steps', x: [
        "Ouvrez la vérification dans l'onglet KYC.",
        "Vérifiez que la pièce d'identité est lisible, valide (non expirée) et correspond au selfie.",
        "Vérifiez que le nom correspond aux informations du compte.",
        "Cliquez « Approuver » si tout est bon, ou « Rejeter » en indiquant la raison (document flou, expiré, ne correspond pas…).",
      ] },
      { t: 'warn', x: "En cas de doute sur l'authenticité d'un document, ne l'approuvez pas : mettez « en révision » et signalez-le." },
    ],
  },

  // ─────────── SÉCURITÉ & FRAUDE ───────────
  {
    id: 'fraud-signals', cat: 'fraud', title: "Signaux d'alerte (fraude)",
    summary: "Ce qui doit vous rendre méfiant.",
    body: [
      { t: 'p', x: "Restez vigilant. Voici les signaux qui doivent alerter :" },
      { t: 'ul', x: [
        "Beaucoup de commandes en très peu de temps (vélocité anormale).",
        "Client qui demande d'envoyer sur un numéro / wallet différent au dernier moment, avec insistance.",
        "Montants inhabituellement élevés pour un compte récent ou non vérifié (KYC).",
        "Client pressé, qui met la pression pour qu'on envoie avant confirmation du paiement.",
        "Informations incohérentes entre le compte, le paiement et la pièce d'identité.",
      ] },
      { t: 'note', x: "La fiche Client 360° affiche des drapeaux « À surveiller » automatiquement (taux d'annulation, vélocité, KYC non vérifié). Consultez-la en cas de doute." },
      { t: 'warn', x: "En cas de doute sérieux : NE TRAITEZ PAS. Prenez le temps, vérifiez, et demandez à un responsable. Mieux vaut une commande en retard qu'une fraude." },
    ],
  },
  {
    id: 'security-rules', cat: 'fraud', title: "Les règles de sécurité de base",
    summary: "À respecter en toutes circonstances.",
    body: [
      { t: 'ul', x: [
        "Ne jamais envoyer de fonds avant d'avoir confirmé le paiement/la réception.",
        "Toujours copier-coller les adresses et numéros, jamais les retaper.",
        "Toujours vérifier le RÉSEAU avant d'envoyer de l'USDT.",
        "Ne jamais partager vos accès, mots de passe ou codes.",
        "Ne jamais traiter une commande déjà prise en charge par un collègue.",
        "En cas de doute, on s'arrête et on demande.",
      ] },
    ],
  },

  // ─────────── FAQ CLIENTS ───────────
  {
    id: 'faq-common', cat: 'faq', title: "Réponses aux questions fréquentes des clients",
    summary: "Ce que les clients demandent souvent.",
    body: [
      { t: 'kv', x: [
        ["« Combien de temps pour recevoir mes USDT ? »", "Généralement quelques minutes après confirmation du paiement, le temps qu'un opérateur traite et que le réseau confirme."],
        ["« Je n'ai pas reçu mes USDT »", "Vérifiez le statut de sa commande. Si « terminé », demandez son adresse/réseau et vérifiez la transaction. Si « en attente », le paiement n'est peut-être pas confirmé."],
        ["« Je me suis trompé de réseau / d'adresse »", "Malheureusement, un envoi crypto est irréversible. Sensibilisez : toujours vérifier avant de valider."],
        ["« C'est quoi le taux ? »", "Le taux du jour affiché sur la plateforme, mis à jour en temps réel."],
        ["« Pourquoi je dois faire le KYC ? »", "C'est une obligation légale de vérification d'identité, pour la sécurité de tous et contre la fraude."],
        ["« Puis-je être payé sur un autre numéro ? »", "Oui, le client indique le numéro de réception dans sa commande de vente."],
      ] },
    ],
  },

  // ─────────── GLOSSAIRE ───────────
  {
    id: 'glossary', cat: 'glossary', title: "Glossaire crypto (l'essentiel)",
    summary: "Tous les mots à connaître.",
    body: [
      { t: 'kv', x: [
        ['USDT / Tether', "Dollar numérique (stablecoin). Ce qu'on échange."],
        ['Stablecoin', "Crypto stable adossée à une vraie monnaie."],
        ['Blockchain', "Registre public des transactions crypto."],
        ['Réseau', "La blockchain sur laquelle circule l'USDT (TRC20, BEP20…)."],
        ['Wallet', "Portefeuille crypto (application) avec une adresse."],
        ['Adresse', "Le « numéro de compte » crypto où envoyer les fonds."],
        ['TRC20', "USDT sur le réseau Tron (frais bas, courant)."],
        ['BEP20', "USDT sur BNB Smart Chain."],
        ['ERC20', "USDT sur Ethereum (frais plus élevés)."],
        ['Binance', "La plus grande plateforme d'échange crypto ; certains clients reçoivent là-bas."],
        ['KYC', "Vérification d'identité obligatoire."],
        ['Mobile Money', "Paiement mobile (Wave, Orange Money)."],
        ['Taux du jour', "Prix d'1 USDT en CFA à l'instant T."],
        ['Marge', "Ce que Terex gagne sur chaque opération."],
        ['Transaction / txID', "Preuve d'un envoi crypto (identifiant unique sur la blockchain)."],
      ] },
    ],
  },
];

// ── Rendu d'un bloc ───────────────────────────────────────────────────────────
function BlockView({ b }: { b: Block }) {
  if (b.t === 'p') return <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{b.x}</p>;
  if (b.t === 'h') return <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '4px 0 0' }}>{b.x}</p>;
  if (b.t === 'ul') return (
    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {b.x.map((it, i) => <li key={i} style={{ color: '#d1d5db', fontSize: 13.5, lineHeight: 1.6 }}>{it}</li>)}
    </ul>
  );
  if (b.t === 'steps') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {b.x.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
          <p style={{ color: '#d1d5db', fontSize: 13.5, lineHeight: 1.6, margin: 0, paddingTop: 1 }}>{it}</p>
        </div>
      ))}
    </div>
  );
  if (b.t === 'note') return (
    <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
      <BookOpen size={15} color="#9ca3af" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b.x}</p>
    </div>
  );
  if (b.t === 'warn') return (
    <div style={{ display: 'flex', gap: 10, background: 'rgba(224,122,122,0.05)', border: `1px solid rgba(224,122,122,0.25)`, borderRadius: 12, padding: '12px 14px' }}>
      <AlertTriangle size={15} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ color: '#e8c9c9', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b.x}</p>
    </div>
  );
  // kv
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      {b.x.map(([k, v], i) => (
        <div key={i} style={{ padding: '11px 14px', borderBottom: i < b.x.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>{k}</p>
          <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{v}</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
            {article.body.map((b, i) => <BlockView key={i} b={b} />)}
          </div>
        </DrillPage>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>
      <PageHeader title="Base de connaissances" sub="Tout ce qu'un membre de l'équipe doit savoir — crypto, plateforme, procédures" />

      {/* Recherche */}
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un sujet (ex. réseau, KYC, vente, fraude…)"
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '11px 14px 11px 38px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Catégories */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
        <FilterChip label="Tout" count={ARTICLES.length} selected={cat === 'all'} onClick={() => setCat('all')} />
        {CATS.map(c => {
          const n = ARTICLES.filter(a => a.cat === c.id).length;
          return <FilterChip key={c.id} label={c.label} count={n} selected={cat === c.id} onClick={() => setCat(c.id)} />;
        })}
      </div>

      {/* Liste des articles */}
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
