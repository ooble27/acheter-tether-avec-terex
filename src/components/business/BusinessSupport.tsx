import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LifeBuoy, ChevronRight, ChevronDown, ChevronUp, Search,
  MessageCircle, Mail, BookOpen, ArrowLeft, Copy, Check,
  FileText, Zap, Shield, Users, Code2, Terminal, Globe,
  Clock, ExternalLink, AlertCircle,
} from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.22)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const HERO_BG = 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)';

type SubPage = 'main' | 'guide' | 'docs' | 'api' | 'compliance';

const HOURS = [
  { day: 'Lun – Ven', time: '08h00 – 20h00', open: true  },
  { day: 'Samedi',    time: '09h00 – 17h00', open: true  },
  { day: 'Dimanche',  time: 'Fermé',          open: false },
];

function isOpenNow() {
  const h = new Date().getHours(), day = new Date().getDay();
  if (day === 0) return false;
  if (day === 6) return h >= 9 && h < 17;
  return h >= 8 && h < 20;
}

const FAQ_ITEMS = [
  {
    q: "Quel est le délai de traitement des paiements ?",
    a: "Les paiements sont traités dans un délai de 2 à 24h ouvrées après confirmation de votre virement. En cas de volume élevé, ce délai peut atteindre 48h. Les clients Business+ bénéficient d'un traitement prioritaire.",
  },
  {
    q: "Comment augmenter ma limite de transaction mensuelle ?",
    a: "Rendez-vous dans la section Conformité KYC → Niveau suivant. Soumettez les documents requis (RCCM, NINEA, CNI dirigeant, justificatif siège). Notre équipe traite votre dossier sous 24–48h ouvrées.",
  },
  {
    q: "Quels réseaux blockchain sont supportés ?",
    a: "Terex supporte TRC-20 (TRON), BEP-20 (Binance Smart Chain) et ERC-20 (Ethereum). TRC-20 est recommandé pour les transactions fréquentes en raison de ses frais réduits.",
  },
  {
    q: "Comment configurer les webhooks pour mon système ERP ?",
    a: "Accédez à Profil entreprise → API & Intégrations → Webhook. Renseignez l'URL de votre serveur et sélectionnez les événements à écouter. Les requêtes sont signées HMAC-SHA256. Consultez la documentation technique pour les détails d'intégration.",
  },
  {
    q: 'Que faire si un paiement est en statut "En attente" depuis plus de 24h ?',
    a: "Vérifiez d'abord que votre USDT a bien été envoyé sur la bonne adresse et réseau. Si c'est le cas, contactez-nous sur WhatsApp avec le hash de transaction. Notre équipe vérifiera manuellement dans les 2h ouvrées.",
  },
  {
    q: "Comment ajouter un membre à mon équipe ?",
    a: "Allez dans Équipe & Accès → Inviter un membre. Renseignez l'email et le rôle (Viewer, Opérateur, Administrateur). L'invitation est valable 7 jours. Les membres Viewer ne peuvent pas initier de transactions.",
  },
  {
    q: "Quels sont les frais de service Terex ?",
    a: "Terex applique des frais variables selon le volume mensuel : 1,5 % jusqu'à 10 000 USDT, 1,2 % de 10 001 à 50 000 USDT, et 0,9 % au-delà. Les frais réseau (gas) sont additionnels et dépendent du réseau choisi.",
  },
  {
    q: "Comment exporter mon historique de transactions ?",
    a: 'Dans la section Historique & Reçus, utilisez le bouton "Exporter" en haut à droite. Vous pouvez exporter en CSV ou PDF pour une période définie. Les exports incluent hash, montant, frais, statut et contreparties.',
  },
];

const SERVICES = [
  { name: 'API Terex',          status: 'operational' as const },
  { name: 'Paiements USDT',     status: 'operational' as const },
  { name: 'KYC & Conformité',   status: 'operational' as const },
  { name: 'Trésorerie',         status: 'degraded'    as const },
  { name: 'Webhooks',           status: 'operational' as const },
];

// ── FAQ accordion ──────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.bds}` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '14px 0', textAlign: 'left', fontFamily: FONT,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: open ? C.teal : C.t1, transition: 'color 0.15s', lineHeight: 1.4 }}>{q}</span>
        {open
          ? <ChevronUp style={{ width: 15, height: 15, color: C.teal, flexShrink: 0 }} />
          : <ChevronDown style={{ width: 15, height: 15, color: C.t3, flexShrink: 0 }} />}
      </button>
      {open && (
        <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.7, margin: '0 0 14px', paddingRight: 24 }}>{a}</p>
      )}
    </div>
  );
}

// ── NavCard ────────────────────────────────────────────────────────
function NavCard({ icon: Icon, title, sub, onClick }: { icon: React.ElementType; title: string; sub: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? C.l2 : C.l1, border: `1px solid ${hov ? C.bd : C.bds}`,
      borderRadius: 12, padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
      display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.15s',
      transform: hov ? 'translateY(-1px)' : 'none', fontFamily: FONT,
    }}>
      <Icon style={{ width: 18, height: 18, color: C.teal, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <ChevronRight style={{ width: 14, height: 14, color: C.t3, flexShrink: 0, marginTop: 2 }} />
    </button>
  );
}

// ── Code block ────────────────────────────────────────────────────
function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: 'relative', background: '#0d0d0d', border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden', margin: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: `1px solid ${C.bds}`, background: C.l1 }}>
        <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? C.teal : C.t3, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: FONT, padding: '2px 6px' }}>
          {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '14px 16px', overflowX: 'auto', fontFamily: MONO, fontSize: 12, lineHeight: 1.7, color: '#d1d5db', whiteSpace: 'pre' }}>{code}</pre>
    </div>
  );
}

// ── Section title ──────────────────────────────────────────────────
function SectionH({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: '28px 0 12px', letterSpacing: '-0.01em', fontFamily: FONT }}>{children}</h3>;
}
function SectionP({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 14px', fontFamily: FONT }}>{children}</p>;
}

// ── Contact button ─────────────────────────────────────────────────
function ContactBtn({ icon: Icon, label, sub, href }: { icon: React.ElementType; label: string; sub: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: hov ? C.l3 : C.l2, border: `1px solid ${hov ? C.bd : C.bds}`, textDecoration: 'none', transition: 'all 0.15s', cursor: 'pointer' }}>
      <Icon style={{ width: 18, height: 18, color: C.teal, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, fontFamily: FONT, marginTop: 1 }}>{sub}</div>
      </div>
      <ExternalLink style={{ width: 12, height: 12, color: C.t3, flexShrink: 0 }} />
    </a>
  );
}

// ════════════════════════════════════════════════════════════════════
// SUB-PAGES
// ════════════════════════════════════════════════════════════════════

function SubPageShell({ title, sub, icon: Icon, onBack, children }: {
  title: string; sub: string; icon: React.ElementType;
  onBack: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '22px 24px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 12, fontFamily: FONT, padding: '0 0 14px', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
          onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Support
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon style={{ width: 22, height: 22, color: C.teal }} />
          </div>
          <div>
            <h2 style={{ color: C.t1, fontSize: 19, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>{title}</h2>
            <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0' }}>{sub}</p>
          </div>
        </div>
      </div>
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '24px 28px' }}>
        {children}
      </div>
    </div>
  );
}

// ── Guide de démarrage B2B ─────────────────────────────────────────
function GuidePage({ onBack }: { onBack: () => void }) {
  const STEPS = [
    {
      n: 1, title: "Créer votre compte Business",
      desc: "Renseignez les informations de base de votre entreprise : raison sociale, numéro RCCM, NINEA, adresse du siège social et coordonnées du représentant légal.",
      items: ["Email professionnel vérifié", "Numéro de téléphone WhatsApp", "Informations de l'entreprise"],
    },
    {
      n: 2, title: "Compléter la vérification KYC",
      desc: "La vérification KYC est obligatoire pour effectuer des paiements. Soumettez vos documents via la section Conformité & KYC. Délai de traitement : 24–48h ouvrées.",
      items: ["RCCM (Registre du Commerce)", "NINEA ou équivalent", "CNI / Passeport du dirigeant", "Justificatif du siège social"],
    },
    {
      n: 3, title: "Alimenter votre compte",
      desc: "Transférez des USDT vers votre adresse de dépôt Terex. Nous acceptons TRC-20, BEP-20 et ERC-20. Le solde est crédité après confirmation blockchain (1–10 min).",
      items: ["Copiez votre adresse de dépôt dans Trésorerie", "Choisissez le réseau (TRC-20 recommandé)", "Effectuez le virement depuis votre wallet"],
    },
    {
      n: 4, title: "Ajouter vos fournisseurs",
      desc: "Enregistrez vos fournisseurs dans la section dédiée. Renseignez le nom, le pays, le réseau blockchain préféré et l'adresse wallet de destination.",
      items: ["Nom et pays du fournisseur", "Réseau blockchain (TRC-20, BEP-20, ERC-20)", "Adresse wallet vérifiée"],
    },
    {
      n: 5, title: "Effectuer votre premier paiement",
      desc: "Depuis la section Paiements, saisissez le montant, sélectionnez le fournisseur et le réseau. Vérifiez le récapitulatif avant de confirmer. Les paiements > 5 000 USDT nécessitent une validation.",
      items: ["Minimum 100 USDT par transaction", "Frais 1,5 % (dégressifs selon volume)", "Confirmation blockchain incluse"],
    },
    {
      n: 6, title: "Intégrer l'API (optionnel)",
      desc: "Automatisez vos paiements en intégrant l'API Terex à votre ERP ou système comptable. Générez une clé API depuis votre profil et consultez la documentation technique.",
      items: ["Clé API générée en 1 clic", "Webhooks temps réel", "SDKs Node.js, Python, cURL disponibles"],
    },
  ];

  return (
    <SubPageShell title="Guide de démarrage B2B" sub="Mise en service de votre compte Terex Business étape par étape" icon={BookOpen} onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((step, i) => (
          <div key={step.n} style={{ display: 'flex', gap: 20, paddingBottom: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.teal, fontFamily: MONO }}>
                {step.n}
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 1, flex: 1, background: C.bds, marginTop: 8 }} />}
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: '0 0 8px', fontFamily: FONT }}>{step.title}</h4>
              <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.6, margin: '0 0 12px', fontFamily: FONT }}>{step.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {step.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SubPageShell>
  );
}

// ── Documentation technique ────────────────────────────────────────
function DocsPage({ onBack }: { onBack: () => void }) {
  return (
    <SubPageShell title="Documentation technique" sub="Intégration de l'API Terex Business dans vos systèmes" icon={Code2} onBack={onBack}>
      <SectionH>Vue d'ensemble</SectionH>
      <SectionP>
        L'API Terex Business vous permet d'automatiser l'ensemble du cycle de paiement fournisseur — création de paiements, consultation du statut, gestion des fournisseurs et réception de notifications en temps réel via webhooks. L'API est RESTful, utilise JSON et requiert une authentification par clé API.
      </SectionP>

      <SectionH>Authentification</SectionH>
      <SectionP>Toutes les requêtes doivent inclure votre clé API dans l'en-tête <code style={{ fontFamily: MONO, fontSize: 12, color: C.teal, background: C.tealT, padding: '1px 6px', borderRadius: 4 }}>Authorization</code>.</SectionP>
      <CodeBlock lang="HTTP" code={`Authorization: Bearer txb_live_xK9mP2qR4vL8nJ5sT1uY7wA6bC0dE...`} />

      <SectionH>URL de base</SectionH>
      <CodeBlock lang="URL" code={`https://api.terex.io/v1`} />

      <SectionH>Codes de réponse</SectionH>
      <div style={{ border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        {[
          { code: '200', desc: 'Succès' },
          { code: '201', desc: 'Ressource créée' },
          { code: '400', desc: 'Paramètres invalides' },
          { code: '401', desc: 'Clé API manquante ou invalide' },
          { code: '403', desc: 'Accès refusé (KYC incomplet ou limites dépassées)' },
          { code: '404', desc: 'Ressource introuvable' },
          { code: '429', desc: 'Trop de requêtes (100 req/min max)' },
          { code: '500', desc: 'Erreur serveur Terex' },
        ].map((r, i) => (
          <div key={r.code} style={{ display: 'flex', gap: 16, padding: '9px 14px', borderBottom: i < 7 ? `1px solid ${C.bds}` : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
            <code style={{ fontFamily: MONO, fontSize: 12, color: C.teal, width: 40, flexShrink: 0 }}>{r.code}</code>
            <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{r.desc}</span>
          </div>
        ))}
      </div>

      <SectionH>Webhooks</SectionH>
      <SectionP>Les webhooks envoient des notifications POST vers votre endpoint lorsqu'un événement se produit. La charge utile est signée avec HMAC-SHA256 en utilisant votre secret webhook.</SectionP>
      <CodeBlock lang="Node.js — Vérification signature" code={`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return \`sha256=\${computed}\` === signature;
}

// Dans votre handler Express :
app.post('/webhooks/terex', (req, res) => {
  const sig = req.headers['x-terex-signature'];
  if (!verifyWebhook(req.body, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Signature invalide');
  }
  const { event, data } = req.body;
  console.log('Événement reçu:', event, data);
  res.status(200).send('OK');
});`} />

      <SectionH>Événements disponibles</SectionH>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { event: 'payment.created',   desc: "Paiement initié par l'utilisateur" },
          { event: 'payment.completed', desc: 'Paiement confirmé sur la blockchain' },
          { event: 'payment.failed',    desc: 'Paiement échoué (fonds insuffisants, réseau)' },
          { event: 'supplier.added',    desc: 'Nouveau fournisseur enregistré' },
          { event: 'kyc.updated',       desc: 'Niveau KYC modifié (hausse ou baisse)' },
          { event: 'rate.locked',       desc: 'Taux de change figé pour 15 minutes' },
        ].map(e => (
          <div key={e.event} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8 }}>
            <code style={{ fontFamily: MONO, fontSize: 11.5, color: C.teal, flexShrink: 0 }}>{e.event}</code>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>{e.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '14px 16px', background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <AlertCircle style={{ width: 15, height: 15, color: C.teal, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: C.t2, margin: 0, fontFamily: FONT, lineHeight: 1.5 }}>
          Pour les exemples complets de payload et le référentiel de tous les endpoints, consultez la <strong style={{ color: C.teal }}>Référence API</strong> dans ce centre de documentation.
        </p>
      </div>
    </SubPageShell>
  );
}

// ── Référence API complète ─────────────────────────────────────────
function ApiPage({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<'curl' | 'node' | 'python'>('curl');

  const PAYMENT_CREATE: Record<string, string> = {
    curl: `curl -X POST https://api.terex.io/v1/payments \\
  -H "Authorization: Bearer txb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "currency": "USDT",
    "network": "TRC20",
    "supplier_id": "sup_a1b2c3d4",
    "reference": "CMD-2025-042",
    "note": "Facture textile mars"
  }'`,
    node: `const terex = require('@terex/sdk');
const client = new terex.Client({
  apiKey: process.env.TEREX_API_KEY,
});

const payment = await client.payments.create({
  amount: 1500,
  currency: 'USDT',
  network: 'TRC20',
  supplier_id: 'sup_a1b2c3d4',
  reference: 'CMD-2025-042',
  note: 'Facture textile mars',
});

console.log(payment.id);      // pay_xxxxxxxx
console.log(payment.status);  // "processing"
console.log(payment.txHash);  // hash blockchain`,
    python: `import terex

client = terex.Client(api_key="txb_live_...")

payment = client.payments.create(
    amount=1500,
    currency="USDT",
    network="TRC20",
    supplier_id="sup_a1b2c3d4",
    reference="CMD-2025-042",
    note="Facture textile mars",
)

print(payment.id)      # pay_xxxxxxxx
print(payment.status)  # "processing"`,
  };

  const PAYMENT_GET: Record<string, string> = {
    curl: `curl https://api.terex.io/v1/payments/pay_xxxxxxxx \\
  -H "Authorization: Bearer txb_live_..."`,
    node: `const payment = await client.payments.retrieve('pay_xxxxxxxx');
console.log(payment.status);   // "completed"
console.log(payment.txHash);   // "a1b2c3d4e5f6..."`,
    python: `payment = client.payments.retrieve("pay_xxxxxxxx")
print(payment.status)    # "completed"
print(payment.tx_hash)   # "a1b2c3d4e5f6..."`,
  };

  const SUPPLIERS_LIST: Record<string, string> = {
    curl: `curl "https://api.terex.io/v1/suppliers?page=1&limit=20" \\
  -H "Authorization: Bearer txb_live_..."`,
    node: `const suppliers = await client.suppliers.list({ page: 1, limit: 20 });
console.log(suppliers.data.length);  // 12
console.log(suppliers.total);        // 12`,
    python: `suppliers = client.suppliers.list(page=1, limit=20)
print(len(suppliers.data))  # 12`,
  };

  const LangBtn = ({ id, label }: { id: typeof lang; label: string }) => (
    <button onClick={() => setLang(id)} style={{
      padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: lang === id ? 600 : 400,
      border: `1px solid ${lang === id ? C.tealB : C.bds}`,
      background: lang === id ? C.tealT : 'transparent',
      color: lang === id ? C.teal : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s',
    }}>{label}</button>
  );

  const ENDPOINTS = [
    { method: 'POST',   path: '/payments',                  desc: "Créer un paiement" },
    { method: 'GET',    path: '/payments',                  desc: "Lister les paiements" },
    { method: 'GET',    path: '/payments/{id}',             desc: "Récupérer un paiement" },
    { method: 'DELETE', path: '/payments/{id}',             desc: "Annuler un paiement (si en attente)" },
    { method: 'GET',    path: '/suppliers',                 desc: "Lister les fournisseurs" },
    { method: 'POST',   path: '/suppliers',                 desc: "Ajouter un fournisseur" },
    { method: 'PUT',    path: '/suppliers/{id}',            desc: "Modifier un fournisseur" },
    { method: 'DELETE', path: '/suppliers/{id}',            desc: "Supprimer un fournisseur" },
    { method: 'GET',    path: '/webhooks',                  desc: "Lister les webhooks configurés" },
    { method: 'POST',   path: '/webhooks',                  desc: "Créer un webhook" },
    { method: 'DELETE', path: '/webhooks/{id}',             desc: "Supprimer un webhook" },
    { method: 'GET',    path: '/balance',                   desc: "Consulter votre solde USDT" },
    { method: 'GET',    path: '/rates',                     desc: "Taux de change temps réel" },
  ];

  const METHOD_STYLE: Record<string, { color: string; bg: string }> = {
    GET:    { color: C.teal,  bg: C.tealT  },
    POST:   { color: '#6ea8fe', bg: 'rgba(110,168,254,0.08)' },
    PUT:    { color: C.t2,    bg: 'rgba(255,255,255,0.05)' },
    DELETE: { color: C.red,   bg: C.redT   },
  };

  return (
    <SubPageShell title="Référence API" sub="Documentation complète de l'API REST Terex Business v1" icon={Terminal} onBack={onBack}>

      {/* Endpoints index */}
      <SectionH>Endpoints disponibles</SectionH>
      <div style={{ border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        {ENDPOINTS.map((ep, i) => {
          const s = METHOD_STYLE[ep.method] || METHOD_STYLE.GET;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < ENDPOINTS.length - 1 ? `1px solid ${C.bds}` : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 4, width: 52, textAlign: 'center', flexShrink: 0, fontFamily: MONO }}>{ep.method}</span>
              <code style={{ fontSize: 12, color: C.t1, fontFamily: MONO, flex: 1 }}>{ep.path}</code>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: FONT }}>{ep.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Language selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <LangBtn id="curl" label="cURL" />
        <LangBtn id="node" label="Node.js" />
        <LangBtn id="python" label="Python" />
      </div>

      {/* Exemples détaillés */}
      <SectionH>POST /payments — Créer un paiement</SectionH>
      <SectionP>Initie un paiement USDT vers un fournisseur. Retourne l'objet paiement avec le statut initial. Les paiements {">"} 5 000 USDT passent en statut <code style={{ fontFamily: MONO, fontSize: 11, color: C.teal }}>pending</code> jusqu'à validation.</SectionP>
      <CodeBlock lang={lang} code={PAYMENT_CREATE[lang]} />

      <SectionH>GET /payments/{'{id}'} — Récupérer un paiement</SectionH>
      <SectionP>Retourne les détails complets d'un paiement : statut, hash blockchain, frais prélevés, date de confirmation.</SectionP>
      <CodeBlock lang={lang} code={PAYMENT_GET[lang]} />

      <SectionH>GET /suppliers — Lister les fournisseurs</SectionH>
      <SectionP>Retourne la liste paginée de vos fournisseurs enregistrés avec leurs wallets et préférences réseau.</SectionP>
      <CodeBlock lang={lang} code={SUPPLIERS_LIST[lang]} />

      <SectionH>Objet Payment — Structure de réponse</SectionH>
      <CodeBlock lang="JSON" code={`{
  "id": "pay_a1b2c3d4e5f6",
  "reference": "CMD-2025-042",
  "amount": 1500,
  "fee": 22.5,
  "total": 1522.5,
  "currency": "USDT",
  "network": "TRC20",
  "supplier": {
    "id": "sup_a1b2c3d4",
    "name": "Shenzhen Electronics Co.",
    "wallet": "TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7"
  },
  "status": "completed",
  "txHash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
  "note": "Facture textile mars",
  "createdAt": "2025-05-18T10:23:00Z",
  "confirmedAt": "2025-05-18T10:25:41Z"
}`} />
    </SubPageShell>
  );
}

// ── Politique de conformité ────────────────────────────────────────
function CompliancePolicyPage({ onBack }: { onBack: () => void }) {
  return (
    <SubPageShell title="Politique de conformité" sub="Cadre réglementaire et obligations KYC/AML de Terex Business" icon={Shield} onBack={onBack}>

      <SectionH>Cadre réglementaire</SectionH>
      <SectionP>Terex Exchange opère dans le respect du cadre réglementaire de l'UEMOA et des recommandations du GAFI (Groupe d'Action Financière) en matière de lutte contre le blanchiment d'argent (LBC) et le financement du terrorisme (FT). Notre programme de conformité est mis à jour annuellement.</SectionP>

      <SectionH>Obligations KYC</SectionH>
      <SectionP>Tout client Business doit se soumettre à une procédure de vérification d'identité (Know Your Customer) avant d'effectuer des transactions. Les niveaux de vérification progressifs permettent d'accéder à des limites de transaction plus élevées.</SectionP>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {[
          { n: 1, label: "Niveau Basique",    limit: "5 000 USDT/mois",    docs: "CNI, téléphone, email" },
          { n: 2, label: "Niveau Entreprise", limit: "50 000 USDT/mois",   docs: "RCCM, NINEA, CNI dirigeant, justificatif siège" },
          { n: 3, label: "Niveau Avancé",     limit: "200 000 USDT/mois",  docs: "Statuts, PV d'AG, états financiers" },
          { n: 4, label: "Niveau Premium",    limit: "Illimitée",           docs: "Contrat cadre + audit Terex" },
        ].map(l => (
          <div key={l.n} style={{ display: 'flex', gap: 14, padding: '12px 16px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 9 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.teal, flexShrink: 0, fontFamily: MONO }}>{l.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{l.label} — <span style={{ color: C.teal }}>{l.limit}</span></div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 3, fontFamily: FONT }}>{l.docs}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionH>Transactions surveillées</SectionH>
      <SectionP>Les transactions suivantes font l'objet d'un contrôle renforcé ou d'une validation manuelle par notre équipe de conformité :</SectionP>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {[
          "Transactions supérieures à 5 000 USDT (validation obligatoire)",
          "Volume mensuel dépassant la limite de votre niveau KYC",
          "Bénéficiaire situé dans un pays à risque élevé",
          "Patterns inhabituels (fréquence anormale, fractionnement)",
          "Premières transactions vers un nouveau fournisseur > 2 000 USDT",
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8 }}>
            <AlertCircle style={{ width: 14, height: 14, color: C.t3, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{item}</span>
          </div>
        ))}
      </div>

      <SectionH>Conservation des données</SectionH>
      <SectionP>Conformément à la réglementation UEMOA, Terex conserve l'ensemble des données de transactions et des documents KYC pendant une durée minimale de 5 ans. Toutes les données sont stockées sur des serveurs sécurisés en zone UEMOA.</SectionP>

      <SectionH>Contact Conformité</SectionH>
      <div style={{ padding: '14px 18px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Mail style={{ width: 16, height: 16, color: C.teal, flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>Équipe conformité Terex</div>
          <div style={{ fontSize: 12, color: C.t3, fontFamily: FONT, marginTop: 3 }}>compliance@terex.sn — réponse sous 24–48h ouvrées</div>
        </div>
      </div>
    </SubPageShell>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════

interface Props { user: { email: string; name: string } | null; }

export function BusinessSupport({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';

  const [subPage, setSubPage] = useState<SubPage>('main');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqFocused, setFaqFocused] = useState(false);

  // Données réelles depuis localStorage
  const stats = useMemo(() => {
    try {
      const payments  = JSON.parse(localStorage.getItem(`terex_b2b_${userId}_payments`)  || '[]');
      const suppliers = JSON.parse(localStorage.getItem(`terex_b2b_${userId}_suppliers`) || '[]');
      const completed = payments.filter((p: { status: string }) => p.status === 'completed').length;
      return { payments: payments.length, suppliers: suppliers.length, completed };
    } catch { return { payments: 0, suppliers: 0, completed: 0 }; }
  }, [userId]);

  const filteredFaq = faqSearch.trim().length > 1
    ? FAQ_ITEMS.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()))
    : FAQ_ITEMS;

  const openNow = isOpenNow();

  if (subPage === 'guide')      return <GuidePage onBack={() => setSubPage('main')} />;
  if (subPage === 'docs')       return <DocsPage onBack={() => setSubPage('main')} />;
  if (subPage === 'api')        return <ApiPage onBack={() => setSubPage('main')} />;
  if (subPage === 'compliance') return <CompliancePolicyPage onBack={() => setSubPage('main')} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '26px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LifeBuoy style={{ width: 26, height: 26, color: C.teal }} />
            </div>
            <div>
              <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Support</h2>
              <p style={{ color: C.t3, fontSize: 12, margin: '5px 0 0' }}>
                {openNow ? 'Équipe disponible en ce moment' : 'Répond le prochain jour ouvré'}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.teal, letterSpacing: '-0.03em', lineHeight: 1 }}>2h</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 3 }}>délai de réponse ouvrées</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.bds}`, flexWrap: 'wrap' }}>
          {[
            { label: 'Transactions', val: stats.payments || '—' },
            { label: 'Complétées', val: stats.completed || '—' },
            { label: 'Fournisseurs', val: stats.suppliers || '—' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.t1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Decorative SVG */}
        <div style={{ position: 'absolute', right: 20, top: 20, opacity: 0.04, pointerEvents: 'none' }}>
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <circle cx="55" cy="55" r="45" stroke="white" strokeWidth="1.5"/>
            <circle cx="55" cy="55" r="30" stroke="white" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx="55" cy="55" r="15" stroke="white" strokeWidth="1"/>
            <path d="M55 20 L55 90 M20 55 L90 55" stroke="white" strokeWidth="0.7"/>
          </svg>
        </div>
      </div>

      {/* ── 3fr / 2fr grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 20, alignItems: 'start' }}>

        {/* ── LEFT ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Navigation sous-pages */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ressources & Documentation</h3>
            </div>
            <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <NavCard icon={BookOpen} title="Guide de démarrage" sub="Mise en service B2B étape par étape" onClick={() => setSubPage('guide')} />
              <NavCard icon={Code2}   title="Documentation technique" sub="Intégration API, webhooks, SDKs" onClick={() => setSubPage('docs')} />
              <NavCard icon={Terminal} title="Référence API" sub="Tous les endpoints avec exemples" onClick={() => setSubPage('api')} />
              <NavCard icon={Shield}  title="Politique de conformité" sub="Cadre KYC/AML et obligations" onClick={() => setSubPage('compliance')} />
            </div>
          </div>

          {/* FAQ */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Questions fréquentes</h3>
              <div style={{ position: 'relative', flexShrink: 0, width: 200 }}>
                <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: C.t3, pointerEvents: 'none' }} />
                <input
                  value={faqSearch} onChange={e => setFaqSearch(e.target.value)}
                  onFocus={() => setFaqFocused(true)} onBlur={() => setFaqFocused(false)}
                  placeholder="Rechercher…"
                  style={{ width: '100%', background: C.l2, border: `1px solid ${faqFocused ? C.teal : C.bds}`, borderRadius: 8, paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                />
              </div>
            </div>
            <div style={{ padding: '0 18px' }}>
              {filteredFaq.length === 0 ? (
                <p style={{ color: C.t3, fontSize: 12, padding: '24px 0', textAlign: 'center' }}>Aucun résultat pour "{faqSearch}"</p>
              ) : (
                filteredFaq.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT (sticky) ─────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Nous contacter */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nous contacter</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ContactBtn icon={MessageCircle} label="WhatsApp Business" sub="+1 418 261 9091 · Réponse rapide" href="https://wa.me/+14182619091" />
              <ContactBtn icon={Mail}          label="Email" sub="terangaexchange@gmail.com" href="mailto:terangaexchange@gmail.com?subject=Support%20Terex%20Business" />
              <ContactBtn icon={Globe}         label="Documentation en ligne" sub="docs.terex.io" href="https://terex.io" />
            </div>
          </div>

          {/* Horaires */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Horaires d'assistance</h3>
              <span style={{ fontSize: 11, color: openNow ? C.teal : C.t3, background: openNow ? C.tealT : 'rgba(255,255,255,0.04)', border: `1px solid ${openNow ? C.tealB : C.bds}`, padding: '2px 8px', borderRadius: 20 }}>
                {openNow ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
            <div style={{ padding: '10px 18px' }}>
              {HOURS.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < HOURS.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{h.day}</span>
                  <span style={{ fontSize: 12, color: h.open ? C.t1 : C.t3, fontFamily: MONO }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statut des services */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Statut des services</h3>
            </div>
            <div style={{ padding: '6px 0' }}>
              {SERVICES.map((svc, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 18px', borderBottom: i < SERVICES.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{svc.name}</span>
                  <span style={{ fontSize: 11, color: svc.status === 'operational' ? C.t2 : C.t3, fontFamily: FONT }}>
                    {svc.status === 'operational' ? 'Opérationnel' : 'Dégradé'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 18px', borderTop: `1px solid ${C.bds}` }}>
              <a href="https://status.terex.io" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.t3, textDecoration: 'none', fontFamily: FONT, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                <ExternalLink style={{ width: 11, height: 11 }} />
                Page de statut officielle
              </a>
            </div>
          </div>

          {/* Urgences */}
          <div style={{ padding: '14px 16px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Zap style={{ width: 14, height: 14, color: C.teal }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: FONT }}>Urgences critiques</span>
            </div>
            <p style={{ fontSize: 11, color: C.t3, margin: 0, lineHeight: 1.5, fontFamily: FONT }}>
              Paiement bloqué, accès compromis ou incident de sécurité — contactez directement WhatsApp au <strong style={{ color: C.t2 }}>+1 418 261 9091</strong> pour une réponse immédiate.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
