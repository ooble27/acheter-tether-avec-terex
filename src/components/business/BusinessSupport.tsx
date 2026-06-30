import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LifeBuoy, ChevronRight, ChevronDown, ChevronUp, Search,
  MessageCircle, Mail, BookOpen, ArrowLeft, Copy, Check,
  FileText, Shield, Code2, Terminal, Globe,
  ExternalLink, AlertCircle, Phone,
  Scale, Users, TrendingUp, Database, Bell, ShieldCheck,
} from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#ffffff', tealH: '#2d7870', tealT: 'rgba(255, 255, 255,0.08)', tealB: 'rgba(255, 255, 255,0.22)',
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
  { q: "Quel est le délai de traitement des paiements ?", a: "Les paiements sont traités dans un délai de 2 à 24h ouvrées après confirmation de votre virement. En cas de volume élevé, ce délai peut atteindre 48h. Les clients Business+ bénéficient d'un traitement prioritaire." },
  { q: "Comment augmenter ma limite de transaction mensuelle ?", a: "Rendez-vous dans la section Conformité KYC → Niveau suivant. Soumettez les documents requis (RCCM, NINEA, CNI dirigeant, justificatif siège). Notre équipe traite votre dossier sous 24–48h ouvrées." },
  { q: "Quels réseaux blockchain sont supportés ?", a: "Terex supporte TRC-20 (TRON), BEP-20 (Binance Smart Chain) et ERC-20 (Ethereum). TRC-20 est recommandé pour les transactions fréquentes en raison de ses frais réduits." },
  { q: "Comment configurer les webhooks pour mon système ERP ?", a: "Accédez à Profil entreprise → API & Intégrations → Webhook. Renseignez l'URL de votre serveur et sélectionnez les événements à écouter. Les requêtes sont signées HMAC-SHA256." },
  { q: 'Que faire si un paiement est en statut "En attente" depuis plus de 24h ?', a: "Vérifiez d'abord que votre USDT a bien été envoyé sur la bonne adresse et réseau. Si c'est le cas, contactez-nous sur WhatsApp avec le hash de transaction. Notre équipe vérifiera manuellement dans les 2h ouvrées." },
  { q: "Comment ajouter un membre à mon équipe ?", a: "Allez dans Équipe & Accès → Inviter un membre. Renseignez l'email et le rôle. L'invitation est valable 7 jours. Les membres Viewer ne peuvent pas initier de transactions." },
  { q: "Quels sont les frais de service Terex ?", a: "Terex applique des frais variables selon le volume mensuel : 1,5 % jusqu'à 10 000 USDT, 1,2 % de 10 001 à 50 000 USDT, et 0,9 % au-delà. Les frais réseau (gas) sont additionnels." },
  { q: "Comment exporter mon historique de transactions ?", a: 'Dans la section Historique & Reçus, utilisez le bouton "Exporter" en haut à droite. Vous pouvez exporter en CSV ou PDF pour une période définie.' },
];

const SERVICES = [
  { name: 'API Terex',          status: 'operational' as const },
  { name: 'Paiements USDT',     status: 'operational' as const },
  { name: 'KYC & Conformité',   status: 'operational' as const },
  { name: 'Trésorerie',         status: 'degraded'    as const },
  { name: 'Webhooks',           status: 'operational' as const },
];

// ── Shared components ──────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.bds}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', textAlign: 'left', fontFamily: FONT }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: open ? C.teal : C.t1, transition: 'color 0.15s', lineHeight: 1.4 }}>{q}</span>
        {open ? <ChevronUp style={{ width: 15, height: 15, color: C.teal, flexShrink: 0 }} /> : <ChevronDown style={{ width: 15, height: 15, color: C.t3, flexShrink: 0 }} />}
      </button>
      {open && <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.7, margin: '0 0 14px', paddingRight: 24 }}>{a}</p>}
    </div>
  );
}

function NavCard({ icon: Icon, title, sub, onClick }: { icon: React.ElementType; title: string; sub: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? C.l2 : C.l1, border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 12, padding: '16px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.15s', transform: hov ? 'translateY(-1px)' : 'none', fontFamily: FONT }}>
      <Icon style={{ width: 17, height: 17, color: C.t1, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <ChevronRight style={{ width: 13, height: 13, color: C.t3, flexShrink: 0, marginTop: 2 }} />
    </button>
  );
}

function TealBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ height: 36, paddingLeft: 18, paddingRight: 18, background: hov ? C.tealH : C.teal, border: 'none', borderRadius: 9, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, whiteSpace: 'nowrap', transition: 'background 0.15s', ...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ height: 36, paddingLeft: 16, paddingRight: 16, background: 'transparent', border: `1px solid ${hov ? C.tealB : C.bd}`, borderRadius: 9, color: hov ? C.teal : C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, whiteSpace: 'nowrap', transition: 'all 0.15s', ...style }}>
      {children}
    </button>
  );
}

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: 'relative', background: '#0d0d0d', border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden', margin: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', borderBottom: `1px solid ${C.bds}`, background: C.l1 }}>
        <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? C.t1 : C.t3, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: FONT, padding: '2px 6px', transition: 'color 0.15s' }}>
          {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '14px 16px', overflowX: 'auto', fontFamily: MONO, fontSize: 12, lineHeight: 1.7, color: '#d1d5db', whiteSpace: 'pre' }}>{code}</pre>
    </div>
  );
}

function ContactCard({ icon: Icon, label, sub, meta, href }: { icon: React.ElementType; label: string; sub: string; meta: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, background: hov ? C.l2 : C.l1, border: `1px solid ${hov ? C.bd : C.bds}`, textDecoration: 'none', transition: 'all 0.15s', cursor: 'pointer' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 17, height: 17, color: C.t1 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, fontFamily: FONT, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>{meta}</div>
        <ExternalLink style={{ width: 11, height: 11, color: C.t3, marginTop: 4 }} />
      </div>
    </a>
  );
}

// ── Sub-page shell ─────────────────────────────────────────────────
function SubPageShell({ title, sub, icon: Icon, backLabel = 'Support', onBack, children }: { title: string; sub: string; icon: React.ElementType; backLabel?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT }}>
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '22px 26px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 12, fontFamily: FONT, padding: '0 0 16px', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = C.t1)} onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
          <ArrowLeft style={{ width: 13, height: 13 }} /> {backLabel}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon style={{ width: 22, height: 22, color: C.t1 }} />
          </div>
          <div>
            <h2 style={{ color: C.t1, fontSize: 19, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>{title}</h2>
            <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0' }}>{sub}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// GUIDE DE DÉMARRAGE
// ════════════════════════════════════════════════════════════════════
function GuidePage({ onBack }: { onBack: () => void }) {
  const STEPS = [
    { n: 1, icon: Users,    title: "Créer votre compte Business",        desc: "Renseignez les informations de base : raison sociale, RCCM, NINEA, adresse du siège et coordonnées du représentant légal.", tags: ["Email professionnel", "Numéro WhatsApp", "Informations entreprise"] },
    { n: 2, icon: Shield,   title: "Compléter la vérification KYC",      desc: "Soumettez vos documents via Conformité & KYC. Délai de traitement 24–48h ouvrées. Chaque niveau débloque une limite plus haute.", tags: ["RCCM", "NINEA", "CNI dirigeant", "Justificatif siège"] },
    { n: 3, icon: Database, title: "Alimenter votre compte",             desc: "Transférez des USDT vers votre adresse de dépôt Terex. TRC-20, BEP-20 et ERC-20 acceptés. Crédit après confirmation blockchain.", tags: ["Copiez l'adresse de dépôt", "Choisissez TRC-20 recommandé", "Délai 1–10 min"] },
    { n: 4, icon: Globe,    title: "Ajouter vos fournisseurs",           desc: "Enregistrez vos fournisseurs : nom, pays, réseau blockchain, adresse wallet. Ils seront disponibles à chaque paiement.", tags: ["Réseau blockchain", "Adresse wallet vérifiée", "Catégorie métier"] },
    { n: 5, icon: FileText, title: "Effectuer votre premier paiement",  desc: "Depuis Paiements, saisissez le montant, sélectionnez le fournisseur et confirmez. Paiements > 5 000 USDT nécessitent une validation.", tags: ["Minimum 100 USDT", "Frais 1,5 %", "Confirmation blockchain"] },
    { n: 6, icon: Code2,    title: "Intégrer l'API (optionnel)",         desc: "Automatisez vos paiements depuis votre ERP. Générez une clé API depuis votre profil et configurez les webhooks temps réel.", tags: ["Clé API en 1 clic", "Webhooks temps réel", "SDKs disponibles"] },
  ];

  return (
    <SubPageShell title="Guide de démarrage B2B" sub="Mise en service de votre compte Terex Business en 6 étapes" icon={BookOpen} onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12 }}>
        {STEPS.map(step => {
          const Icon = step.icon;
          return (
            <div key={step.n} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 16, height: 16, color: C.t2 }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: C.t3, fontFamily: MONO, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Étape {step.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: FONT, letterSpacing: '-0.01em' }}>{step.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.t3, lineHeight: 1.65, margin: '0 0 14px', fontFamily: FONT }}>{step.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {step.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, padding: '3px 9px', borderRadius: 20, fontFamily: FONT }}>{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SubPageShell>
  );
}

// ════════════════════════════════════════════════════════════════════
// DOCUMENTATION TECHNIQUE
// ════════════════════════════════════════════════════════════════════
function DocsPage({ onBack }: { onBack: () => void }) {
  return (
    <SubPageShell title="Documentation technique" sub="Intégration de l'API Terex Business dans vos systèmes d'information" icon={Code2} onBack={onBack}>
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 14 }}>

        {/* Col 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>Vue d'ensemble</h3>
            <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.7, margin: '0 0 14px', fontFamily: FONT }}>
              L'API Terex Business est RESTful, utilise JSON et requiert une authentification par clé API. Elle permet d'automatiser l'ensemble du cycle de paiement fournisseur, la gestion des contacts et la réception de notifications webhook.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[['URL de base', 'api.terex.io/v1'], ['Format', 'JSON / REST'], ['Versioning', 'URI (v1, v2…)']].map(([k, v]) => (
                <div key={k} style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8, padding: '8px 14px' }}>
                  <div style={{ fontSize: 10, color: C.t3, fontFamily: FONT, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: C.t1, fontFamily: MONO }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>Authentification</h3>
            <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.65, margin: '0 0 12px', fontFamily: FONT }}>Incluez votre clé API dans l'en-tête <code style={{ fontFamily: MONO, fontSize: 11.5, color: C.t1, background: C.l2, padding: '1px 6px', borderRadius: 4 }}>Authorization</code> de chaque requête :</p>
            <CodeBlock lang="HTTP" code={`Authorization: Bearer txb_live_xK9mP2qR...`} />
            <p style={{ fontSize: 11.5, color: C.t3, margin: '8px 0 0', fontFamily: FONT }}>Générez vos clés depuis Profil → API & Intégrations. Les clés de test commencent par <code style={{ fontFamily: MONO }}>txb_test_</code>.</p>
          </div>

          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 12px', fontFamily: FONT }}>Codes de réponse HTTP</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[['200', 'Succès'], ['201', 'Ressource créée'], ['400', 'Paramètres invalides'], ['401', 'Clé API invalide'], ['403', 'KYC incomplet ou limite dépassée'], ['404', 'Ressource introuvable'], ['429', 'Rate limit atteinte (100 req/min)'], ['500', 'Erreur serveur Terex']].map(([code, desc], i, arr) => (
                <div key={code} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <code style={{ fontFamily: MONO, fontSize: 12, color: code.startsWith('2') ? C.teal : code.startsWith('4') || code.startsWith('5') ? C.t2 : C.t2, width: 36, flexShrink: 0 }}>{code}</code>
                  <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>Webhooks</h3>
            <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.65, margin: '0 0 12px', fontFamily: FONT }}>Terex envoie des POST vers votre endpoint à chaque événement. La charge utile est signée HMAC-SHA256 avec votre secret webhook.</p>
            <CodeBlock lang="Node.js — Vérification" code={`const crypto = require('crypto');

function verify(payload, sig, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return \`sha256=\${hash}\` === sig;
}

app.post('/webhooks/terex', (req, res) => {
  const sig = req.headers['x-terex-signature'];
  if (!verify(req.body, sig, process.env.SECRET))
    return res.status(401).send('Invalide');
  const { event, data } = req.body;
  // Traitez l'événement ici
  res.status(200).send('OK');
});`} />
          </div>

          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 12px', fontFamily: FONT }}>Événements webhook disponibles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['payment.created',   "Paiement initié"],
                ['payment.completed', 'Confirmation blockchain'],
                ['payment.failed',    'Paiement échoué'],
                ['supplier.added',    'Fournisseur enregistré'],
                ['kyc.updated',       'Niveau KYC modifié'],
                ['rate.locked',       'Taux figé 15 min'],
              ].map(([ev, desc]) => (
                <div key={ev} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 7 }}>
                  <code style={{ fontFamily: MONO, fontSize: 11, color: C.t2, flexShrink: 0 }}>{ev}</code>
                  <span style={{ fontSize: 11, color: C.t3, fontFamily: FONT }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>Rate limiting</h3>
            <p style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.65, margin: '0 0 12px', fontFamily: FONT }}>Les en-têtes de réponse indiquent votre quota restant :</p>
            <CodeBlock lang="HTTP Response Headers" code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1715000000`} />
          </div>
        </div>
      </div>
    </SubPageShell>
  );
}

// ════════════════════════════════════════════════════════════════════
// RÉFÉRENCE API
// ════════════════════════════════════════════════════════════════════
function ApiPage({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<'curl' | 'node' | 'python'>('curl');

  const ENDPOINTS: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; desc: string; body?: string; response: string; curlEx: string; nodeEx: string; pythonEx: string }[] = [
    {
      method: 'POST', path: '/payments', desc: 'Créer un paiement USDT vers un fournisseur.',
      body: `{
  "amount": 1500,
  "currency": "USDT",
  "network": "TRC20",
  "supplier_id": "sup_a1b2c3",
  "reference": "CMD-2025-042",
  "note": "Facture textile mars"
}`,
      response: `{
  "id": "pay_a1b2c3d4e5",
  "reference": "CMD-2025-042",
  "amount": 1500,
  "fee": 22.5,
  "total": 1522.5,
  "status": "processing",
  "txHash": null,
  "createdAt": "2025-05-18T10:23:00Z"
}`,
      curlEx: `curl -X POST https://api.terex.io/v1/payments \\
  -H "Authorization: Bearer txb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"amount":1500,"currency":"USDT","network":"TRC20","supplier_id":"sup_a1b2c3","reference":"CMD-2025-042"}'`,
      nodeEx: `const payment = await client.payments.create({
  amount: 1500, currency: 'USDT', network: 'TRC20',
  supplier_id: 'sup_a1b2c3', reference: 'CMD-2025-042',
  note: 'Facture textile mars',
});
console.log(payment.id, payment.status);`,
      pythonEx: `payment = client.payments.create(
    amount=1500, currency="USDT", network="TRC20",
    supplier_id="sup_a1b2c3", reference="CMD-2025-042",
)
print(payment.id, payment.status)`,
    },
    {
      method: 'GET', path: '/payments/{id}', desc: 'Récupérer le détail et statut d\'un paiement.',
      response: `{
  "id": "pay_a1b2c3d4e5",
  "status": "completed",
  "txHash": "a1b2c3d4e5f6a7b8...",
  "confirmedAt": "2025-05-18T10:25:41Z",
  "supplier": {
    "name": "Shenzhen Electronics",
    "wallet": "TQn7hB9kNYX4zCN8..."
  }
}`,
      curlEx: `curl https://api.terex.io/v1/payments/pay_a1b2c3d4e5 \\
  -H "Authorization: Bearer txb_live_..."`,
      nodeEx: `const payment = await client.payments.retrieve('pay_a1b2c3d4e5');
console.log(payment.status);   // "completed"
console.log(payment.txHash);   // "a1b2c3..."`,
      pythonEx: `payment = client.payments.retrieve("pay_a1b2c3d4e5")
print(payment.status)    # "completed"`,
    },
    {
      method: 'GET', path: '/suppliers', desc: 'Lister les fournisseurs paginés.',
      response: `{
  "data": [
    {
      "id": "sup_a1b2c3",
      "name": "Shenzhen Electronics",
      "network": "TRC20",
      "country": "CN"
    }
  ],
  "total": 12,
  "page": 1
}`,
      curlEx: `curl "https://api.terex.io/v1/suppliers?page=1&limit=20" \\
  -H "Authorization: Bearer txb_live_..."`,
      nodeEx: `const list = await client.suppliers.list({ page: 1, limit: 20 });
console.log(list.total); // 12`,
      pythonEx: `suppliers = client.suppliers.list(page=1, limit=20)
print(suppliers.total)  # 12`,
    },
    {
      method: 'GET', path: '/balance', desc: 'Consulter votre solde USDT en temps réel.',
      response: `{
  "wallets": [
    { "chain": "TRC20", "usdt": 45230.00 },
    { "chain": "BEP20", "usdt": 12450.00 },
    { "chain": "ERC20", "usdt":  8100.00 }
  ],
  "total_usdt": 65780.00,
  "updatedAt": "2025-05-18T10:24:00Z"
}`,
      curlEx: `curl https://api.terex.io/v1/balance \\
  -H "Authorization: Bearer txb_live_..."`,
      nodeEx: `const bal = await client.balance.retrieve();
console.log(bal.total_usdt); // 65780`,
      pythonEx: `bal = client.balance.retrieve()
print(bal.total_usdt)  # 65780`,
    },
  ];

  const [selected, setSelected] = useState(0);
  const ep = ENDPOINTS[selected];

  const methodColor = (m: string) => ({ GET: C.teal, POST: C.t2, PUT: C.t3, DELETE: C.red }[m] || C.t3);
  const methodBg    = (m: string) => ({ GET: C.tealT, POST: 'rgba(255,255,255,0.05)', PUT: 'rgba(255,255,255,0.03)', DELETE: C.redT }[m] || 'transparent');

  const codeMap = { curl: ep.curlEx, node: ep.nodeEx, python: ep.pythonEx };

  return (
    <SubPageShell title="Référence API" sub="Documentation complète de l'API REST Terex Business v1" icon={Terminal} onBack={onBack}>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* Sidebar endpoints */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 20 }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.bds}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.09em', textTransform: 'uppercase', fontFamily: FONT }}>Endpoints</span>
          </div>
          <div style={{ padding: '6px 0' }}>
            {ENDPOINTS.map((e, i) => (
              <button key={i} onClick={() => setSelected(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: selected === i ? C.l2 : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: selected === i ? `2px solid ${C.teal}` : '2px solid transparent', transition: 'all 0.12s' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: methodColor(e.method), background: methodBg(e.method), padding: '2px 6px', borderRadius: 4, fontFamily: MONO, flexShrink: 0 }}>{e.method}</span>
                <span style={{ fontSize: 11, color: selected === i ? C.t1 : C.t3, fontFamily: MONO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.path}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.bds}` }}>
            <p style={{ fontSize: 10, color: C.t3, margin: 0, fontFamily: FONT, lineHeight: 1.5 }}>GET /payments · DELETE /payments/{'{id}'} · POST /suppliers · POST /webhooks ···</p>
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Endpoint title */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: methodColor(ep.method), background: methodBg(ep.method), padding: '3px 9px', borderRadius: 5, fontFamily: MONO }}>{ep.method}</span>
              <code style={{ fontSize: 14, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{ep.path}</code>
            </div>
            <p style={{ fontSize: 13, color: C.t2, margin: 0, fontFamily: FONT }}>{ep.desc}</p>
          </div>

          {/* Code example */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: FONT }}>Exemple de requête</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['curl', 'node', 'python'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: lang === l ? 600 : 400, border: `1px solid ${lang === l ? C.tealB : C.bds}`, background: lang === l ? C.tealT : 'transparent', color: lang === l ? C.teal : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}>
                    {l === 'curl' ? 'cURL' : l === 'node' ? 'Node.js' : 'Python'}
                  </button>
                ))}
              </div>
            </div>
            <CodeBlock lang={lang === 'curl' ? 'cURL' : lang === 'node' ? 'Node.js' : 'Python'} code={codeMap[lang]} />
          </div>

          {/* Request body */}
          {ep.body && (
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 22px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: '0 0 8px', fontFamily: FONT }}>Corps de la requête</p>
              <CodeBlock lang="JSON" code={ep.body} />
            </div>
          )}

          {/* Response */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 22px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.t1, margin: '0 0 8px', fontFamily: FONT }}>Exemple de réponse <span style={{ fontFamily: MONO, fontSize: 10, color: C.teal, background: C.tealT, padding: '2px 7px', borderRadius: 4, marginLeft: 6 }}>200 OK</span></p>
            <CodeBlock lang="JSON" code={ep.response} />
          </div>
        </div>
      </div>
    </SubPageShell>
  );
}

// ════════════════════════════════════════════════════════════════════
// POLITIQUE DE CONFORMITÉ — contenu identique à BusinessCompliance
// ════════════════════════════════════════════════════════════════════
function CompliancePolicyPage({ onBack }: { onBack: () => void }) {
  const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.015em', fontFamily: FONT };
  const body: React.CSSProperties = { fontSize: 13, color: C.t2, lineHeight: 1.75, margin: 0, fontFamily: FONT };
  const card: React.CSSProperties = { background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '24px 26px' };

  const sections = [
    {
      icon: Scale, title: 'Cadre réglementaire',
      content: [
        "Terex Exchange opère en conformité avec les directives de l'Union Économique et Monétaire Ouest-Africaine (UEMOA) et les recommandations de la Banque Centrale des États de l'Afrique de l'Ouest (BCEAO).",
        "Notre politique de lutte contre le blanchiment de capitaux et le financement du terrorisme (LCB-FT) s'appuie sur la Directive N°02/2015/CM/UEMOA relative aux systèmes de paiement, ainsi que sur le droit des affaires OHADA applicable aux entités commerciales de la zone.",
        "Toute transaction dépassant les seuils réglementaires est soumise à une déclaration auprès de la CENTIF (Cellule Nationale de Traitement des Informations Financières) conformément à la loi sénégalaise N°2018-03.",
      ],
    },
    {
      icon: Users, title: "Vérification d'identité (KYC)",
      content: [
        "Notre processus KYC (Know Your Customer) est structuré en quatre niveaux progressifs, chacun débloquant des limites de transaction supérieures. Ce système garantit que les capacités accordées sont proportionnelles au niveau de vérification effectué.",
        "Niveau 1 — Basique (5 000 USDT/mois) : vérification de l'identité personnelle du titulaire du compte (CNI, passeport), du numéro de téléphone et de l'adresse e-mail.",
        "Niveau 2 — Entreprise (50 000 USDT/mois) : vérification de l'entité commerciale incluant le RCCM, le NINEA, la pièce d'identité du dirigeant et le justificatif de siège social.",
        "Niveau 3 — Avancé (200 000 USDT/mois) : vérification approfondie incluant les statuts notariés, les états financiers certifiés, le registre des bénéficiaires effectifs (UBE > 25 %) et le contrat cadre Terex.",
        "Niveau 4 — Premium (Illimité) : audit complet de conformité mené par notre équipe dédiée, incluant une visite sur site si nécessaire.",
      ],
    },
    {
      icon: TrendingUp, title: 'Limites et surveillance des transactions',
      content: [
        "Les limites de transaction sont fixées par niveau de vérification et s'appliquent sur une base mensuelle calendaire. Le dépassement d'un seuil entraîne le blocage temporaire des opérations jusqu'au renouvellement de la période ou à l'obtention d'un niveau supérieur.",
        "Chaque transaction est analysée en temps réel par notre système de détection des anomalies. Les transactions inhabituelles — par leur montant, leur fréquence ou leur destination — font l'objet d'une révision manuelle par notre équipe conformité.",
        "En cas de suspicion d'opération illicite, Terex Exchange se réserve le droit de suspendre temporairement le compte concerné, de demander des justificatifs complémentaires et, si nécessaire, de procéder à une déclaration de soupçon auprès de la CENTIF.",
      ],
    },
    {
      icon: Database, title: 'Conservation des données',
      content: [
        "Les documents et données collectés dans le cadre du processus KYC sont conservés pendant une durée minimale de cinq (5) ans à compter de la clôture du compte, conformément aux obligations légales en vigueur en zone UEMOA.",
        "L'ensemble des documents sensibles est chiffré en transit et au repos selon les standards AES-256. Nos serveurs sont hébergés dans des datacenters certifiés ISO 27001, avec réplication géographique pour assurer la continuité de service.",
        "Terex Exchange est enregistré auprès de la Commission des Données Personnelles (CDP) du Sénégal. Nous ne partageons vos données qu'avec les autorités compétentes sur réquisition légale.",
      ],
    },
    {
      icon: Bell, title: 'Obligations de déclaration',
      content: [
        "Conformément à la législation sénégalaise et aux directives UEMOA, Terex Exchange est tenu de déclarer à la CENTIF toute opération dont les caractéristiques laissent supposer une origine illicite des fonds ou un risque de financement du terrorisme.",
        "Les seuils déclenchant une déclaration systématique sont alignés sur les recommandations du GAFI et incluent notamment les virements supérieurs à 5 000 000 FCFA (≈ 7 650 EUR) effectués par un même client sur 30 jours.",
        "En cas de gel d'avoirs ordonné par les autorités compétentes, Terex Exchange exécutera la mesure dans les délais légaux et en informera le titulaire du compte dans les limites permises par la loi.",
      ],
    },
    {
      icon: BookOpen, title: 'Vos droits',
      content: [
        "Conformément à la loi N°2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel et aux prérogatives de la CDP, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.",
        "Pour exercer ces droits ou pour toute question relative à notre politique de conformité, vous pouvez contacter notre équipe dédiée à l'adresse compliance@terex.sn ou par courrier à l'adresse du siège social de Terex Exchange, Dakar, Sénégal.",
        "Toute réclamation non résolue peut être adressée à la Commission des Données Personnelles (CDP) du Sénégal, autorité de contrôle compétente.",
      ],
    },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }} onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }} onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
          <ArrowLeft size={13} /> Support
        </button>
        <span style={{ color: C.t3, fontSize: 13 }}>/</span>
        <span style={{ color: C.t2, fontSize: 13 }}>Politique de conformité</span>
      </div>

      {/* Hero */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '32px 32px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <ShieldCheck size={16} color={C.t3} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Terex Exchange</span>
        </div>
        <h1 style={{ color: C.t1, fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 10px', lineHeight: 1.2 }}>
          Politique de conformité<br />
          <span style={{ color: C.t3, fontWeight: 400, fontSize: 18 }}>& Règlement intérieur KYC / LCB-FT</span>
        </h1>
        <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
          {[['Dernière mise à jour', '15 janvier 2025'], ['Zone de couverture', 'UEMOA / Zone OHADA'], ['Version', 'v2.1']].map(([label, val]) => (
            <div key={label} style={{ paddingRight: 24, borderRight: `1px solid ${C.bds}` }}>
              <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t2, fontFamily: label === 'Version' ? MONO : FONT }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sommaire */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px', marginBottom: 14 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 12px' }}>Sommaire</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
          {sections.map((s, i) => (
            <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO, width: 18 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={C.t3} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>{String(i + 1).padStart(2, '0')}</span>
                  <h2 style={sectionTitle}>{s.title}</h2>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 46 }}>
                {s.content.map((para, j) => <p key={j} style={body}>{para}</p>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 16, padding: '16px 24px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>Des questions ? Contactez-nous à <strong style={{ color: C.t2 }}>compliance@terex.sn</strong></span>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 14px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }} onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }} onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
          <ArrowLeft size={13} /> Retour au Support
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ════════════════════════════════════════════════════════════════════
interface Props { user: { email: string; name: string } | null; }

export function BusinessSupport({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';

  const [subPage, setSubPage] = useState<SubPage>('main');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqFocused, setFaqFocused] = useState(false);

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
    <div style={{ fontFamily: FONT, color: C.t1 }}>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ COLONNE GAUCHE ═══════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hero — style Trésorerie */}
          <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '30px 28px 26px', boxShadow: '0 4px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <LifeBuoy style={{ width: 18, height: 18, color: C.t3 }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Support Terex</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <p style={{ color: C.t1, fontSize: 52, fontWeight: 700, fontFamily: MONO, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
                2h
                <span style={{ color: C.t3, fontSize: 16, fontWeight: 400, marginLeft: 10, letterSpacing: 0 }}>ouvrées</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
              <div style={{ paddingRight: 24 }}>
                <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>Transactions</p>
                <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>{stats.payments || '—'}</p>
              </div>
              <div style={{ width: 1, background: C.bds, alignSelf: 'stretch', marginRight: 24 }} />
              <div style={{ paddingRight: 24 }}>
                <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>Complétées</p>
                <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>{stats.completed || '—'}</p>
              </div>
              <div style={{ width: 1, background: C.bds, alignSelf: 'stretch', marginRight: 24 }} />
              <div>
                <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px', fontWeight: 500 }}>Fournisseurs</p>
                <p style={{ color: C.t2, fontSize: 16, fontFamily: MONO, fontWeight: 600, margin: 0 }}>{stats.suppliers || '—'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <GhostBtn onClick={() => window.open('https://wa.me/+14182619091', '_blank')}>
                <MessageCircle style={{ width: 13, height: 13 }} /> WhatsApp
              </GhostBtn>
              <TealBtn onClick={() => window.open('mailto:terangaexchange@gmail.com?subject=Support%20Terex%20Business', '_blank')}>
                <Mail style={{ width: 13, height: 13 }} /> Envoyer un email
              </TealBtn>
            </div>
          </div>

          {/* Ressources & Documentation */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ressources & Documentation</h3>
            </div>
            <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <NavCard icon={BookOpen}  title="Guide de démarrage"      sub="Mise en service B2B étape par étape"    onClick={() => setSubPage('guide')} />
              <NavCard icon={Code2}     title="Documentation technique" sub="Intégration API, webhooks, SDKs"         onClick={() => setSubPage('docs')} />
              <NavCard icon={Terminal}  title="Référence API"           sub="Endpoints, exemples, structure réponse"  onClick={() => setSubPage('api')} />
              <NavCard icon={Shield}    title="Politique de conformité" sub="Cadre KYC/AML, UEMOA, vos droits"        onClick={() => setSubPage('compliance')} />
            </div>
          </div>

          {/* FAQ */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Questions fréquentes</h3>
              <div style={{ position: 'relative', flexShrink: 0, width: 190 }}>
                <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: C.t3, pointerEvents: 'none' }} />
                <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} onFocus={() => setFaqFocused(true)} onBlur={() => setFaqFocused(false)} placeholder="Rechercher…" style={{ width: '100%', background: C.l2, border: `1px solid ${faqFocused ? C.teal : C.bds}`, borderRadius: 8, paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s' }} />
              </div>
            </div>
            <div style={{ padding: '0 18px' }}>
              {filteredFaq.length === 0
                ? <p style={{ color: C.t3, fontSize: 12, padding: '24px 0', textAlign: 'center' }}>Aucun résultat pour "{faqSearch}"</p>
                : filteredFaq.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)
              }
            </div>
          </div>
        </div>

        {/* ══ COLONNE DROITE (sticky) ══════════════════════════════ */}
        <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Nous contacter */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nous contacter</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ContactCard icon={MessageCircle} label="WhatsApp Business" sub="+1 418 261 9091" meta="Réponse en moins de 2h" href="https://wa.me/+14182619091" />
              <ContactCard icon={Mail} label="Email" sub="terangaexchange@gmail.com" meta="Réponse sous 24h" href="mailto:terangaexchange@gmail.com?subject=Support%20Terex%20Business" />
              <ContactCard icon={Shield} label="Conformité & KYC" sub="compliance@terex.sn" meta="Questions réglementaires" href="mailto:compliance@terex.sn?subject=Conformité%20Terex%20Business" />
            </div>
          </div>

          {/* Horaires */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Horaires d'assistance</h3>
              <span style={{ fontSize: 11, color: openNow ? C.teal : C.t3, background: openNow ? C.tealT : 'rgba(255,255,255,0.04)', border: `1px solid ${openNow ? C.tealB : C.bds}`, padding: '2px 8px', borderRadius: 20 }}>
                {openNow ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
            <div style={{ padding: '6px 18px' }}>
              {HOURS.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < HOURS.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>{h.day}</span>
                  <span style={{ fontSize: 12, color: h.open ? C.t1 : C.t3, fontFamily: MONO }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statut des services */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.bds}` }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: C.t3, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Statut des services</h3>
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
          </div>

          {/* Urgences */}
          <div style={{ padding: '14px 16px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Phone style={{ width: 14, height: 14, color: C.t2, flexShrink: 0 }} />
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
