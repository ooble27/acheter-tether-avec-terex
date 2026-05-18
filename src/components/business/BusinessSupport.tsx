import { useState, useMemo } from 'react';
import {
  MessageCircle, Mail, HelpCircle, Clock, ChevronDown,
  ChevronRight, Send, Check, AlertCircle, Search,
  FileText, Zap, Shield, Activity, Plus, X,
  LifeBuoy, ExternalLink, Circle,
} from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.22)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const HERO_BG = 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)';

// ── Types ─────────────────────────────────────────────────────────────
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type Priority = 'low' | 'normal' | 'high' | 'urgent';
type Category = 'payment' | 'kyc' | 'api' | 'account' | 'billing' | 'other';

interface Ticket {
  id: string; subject: string; category: Category; priority: Priority;
  status: TicketStatus; message: string; createdAt: string; updatedAt: string;
  ref: string;
}

// ── Données statiques ─────────────────────────────────────────────────
const INITIAL_TICKETS: Ticket[] = [
  { id: 't1', ref: 'TKT-2025-0047', subject: 'Paiement en attente depuis 48h', category: 'payment', priority: 'high', status: 'in_progress', message: '', createdAt: '2025-05-16T09:14:00Z', updatedAt: '2025-05-16T14:30:00Z' },
  { id: 't2', ref: 'TKT-2025-0039', subject: 'Question sur les frais API', category: 'api', priority: 'normal', status: 'resolved', message: '', createdAt: '2025-05-10T11:00:00Z', updatedAt: '2025-05-11T10:20:00Z' },
  { id: 't3', ref: 'TKT-2025-0031', subject: 'Mise à jour du document NINEA', category: 'kyc', priority: 'normal', status: 'resolved', message: '', createdAt: '2025-05-02T08:45:00Z', updatedAt: '2025-05-03T15:10:00Z' },
];

const SERVICES = [
  { name: 'API Terex',         status: 'operational' as const },
  { name: 'Paiements USDT',   status: 'operational' as const },
  { name: 'KYC & Conformité', status: 'operational' as const },
  { name: 'Trésorerie',        status: 'degraded'    as const },
  { name: 'Webhooks',          status: 'operational' as const },
];

const HOURS = [
  { day: 'Lun – Ven', time: '08h00 – 20h00', open: true  },
  { day: 'Samedi',    time: '09h00 – 17h00', open: true  },
  { day: 'Dimanche',  time: 'Fermé',          open: false },
];

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
    a: "Vérifiez d'abord que votre USDT a bien été envoyé sur la bonne adresse et réseau. Si c'est le cas, ouvrez un ticket de support en catégorie \"Paiement\" avec le hash de transaction. Notre équipe vérifiera manuellement dans les 2h ouvrées.",
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

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'payment', label: 'Paiement' },
  { id: 'kyc',     label: 'KYC / Conformité' },
  { id: 'api',     label: 'API & Intégrations' },
  { id: 'account', label: 'Compte & Profil' },
  { id: 'billing', label: 'Facturation' },
  { id: 'other',   label: 'Autre' },
];

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'low',    label: 'Faible' },
  { id: 'normal', label: 'Normal' },
  { id: 'high',   label: 'Élevé' },
  { id: 'urgent', label: 'Urgent' },
];

// ── Utilitaires ───────────────────────────────────────────────────────
function statusLabel(s: TicketStatus) {
  return { open: 'Ouvert', in_progress: 'En cours', resolved: 'Résolu', closed: 'Fermé' }[s];
}
function statusColor(s: TicketStatus): string {
  return { open: C.t2, in_progress: C.teal, resolved: C.t3, closed: C.t3 }[s];
}
function statusBg(s: TicketStatus): string {
  return { open: 'rgba(255,255,255,0.06)', in_progress: C.tealT, resolved: 'rgba(255,255,255,0.04)', closed: 'rgba(255,255,255,0.04)' }[s];
}
function statusBorder(s: TicketStatus): string {
  return { open: C.bd, in_progress: C.tealB, resolved: C.bds, closed: C.bds }[s];
}
function relDate(iso: string) {
  const d = new Date(iso), now = Date.now(), diff = now - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  const days = Math.floor(h / 24);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
}
function isOpenNow() {
  const h = new Date().getHours(), day = new Date().getDay();
  if (day === 0) return false;
  if (day === 6) return h >= 9 && h < 17;
  return h >= 8 && h < 20;
}

// ── Composants atomiques ──────────────────────────────────────────────
function TealBtn({ children, onClick, disabled, style }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 38, paddingLeft: 18, paddingRight: 18, background: disabled ? C.l3 : h ? C.tealH : C.teal, color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT, transition: 'background 0.13s', flexShrink: 0, ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, paddingLeft: 16, paddingRight: 16, background: h ? C.l3 : 'rgba(255,255,255,0.04)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', flexShrink: 0, ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function Inp({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  const [f, setF] = useState(false);
  return (
    <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', background: C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.4)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s' }} />
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 7 }}>{children}</div>;
}

function GroupHead({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{children}</div>;
}

// ── FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.bds}` }}>
      <button onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 22px', background: h ? 'rgba(255,255,255,0.02)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', transition: 'background 0.12s' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: open ? C.t1 : C.t2, flex: 1 }}>{q}</span>
        <ChevronDown size={14} color={C.t3} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ padding: '0 22px 18px', fontSize: 13, color: C.t3, lineHeight: 1.75 }}>{a}</div>
      )}
    </div>
  );
}

// ── Nouveau ticket modal ──────────────────────────────────────────────
function NewTicketModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (t: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'ref'>) => void }) {
  const [subject,  setSubject]  = useState('');
  const [category, setCategory] = useState<Category>('payment');
  const [priority, setPriority] = useState<Priority>('normal');
  const [message,  setMessage]  = useState('');
  const [focus,    setFocus]    = useState('');

  const canSubmit = subject.trim().length >= 5 && message.trim().length >= 20;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560, background: C.l1, border: `1px solid ${C.bd}`, borderRadius: 18, padding: '28px 30px', boxShadow: '0 32px 96px rgba(0,0,0,0.65)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: '0 0 4px', letterSpacing: '-0.01em' }}>Nouveau ticket</h3>
            <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>Réponse garantie sous 2h ouvrées</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
            onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Lbl>Sujet</Lbl>
            <Inp value={subject} onChange={setSubject} placeholder="Décrivez le problème en quelques mots…" />
            {subject.length > 0 && subject.length < 5 && <div style={{ fontSize: 11, color: C.red, marginTop: 5 }}>Minimum 5 caractères</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <Lbl>Catégorie</Lbl>
              <select value={category} onChange={e => setCategory(e.target.value as Category)}
                style={{ width: '100%', background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, cursor: 'pointer', appearance: 'none' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Priorité</Lbl>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
                style={{ width: '100%', background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, cursor: 'pointer', appearance: 'none' }}>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Lbl>Message détaillé</Lbl>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Décrivez le problème en détail : date, montant, hash de transaction si applicable, messages d'erreur… (minimum 20 caractères)"
              rows={6}
              onFocus={() => setFocus('msg')} onBlur={() => setFocus('')}
              style={{ width: '100%', background: C.l2, border: `1px solid ${focus === 'msg' ? 'rgba(59,150,143,0.4)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', resize: 'none', lineHeight: 1.65, transition: 'border-color 0.15s' }} />
            <div style={{ textAlign: 'right', fontSize: 11, color: message.length < 20 ? C.t3 : C.t2, marginTop: 4 }}>{message.length} / 20 min</div>
          </div>

          {priority === 'urgent' && (
            <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: C.redT, border: `1px solid ${C.redB}`, borderRadius: 9 }}>
              <AlertCircle size={13} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>
                Pour les urgences critiques (paiement bloqué, sécurité), contactez directement WhatsApp pour une réponse immédiate.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
            <GhostBtn onClick={onClose} style={{ height: 36, fontSize: 12 }}>Annuler</GhostBtn>
            <TealBtn
              onClick={() => canSubmit && onSubmit({ subject, category, priority, status: 'open', message })}
              disabled={!canSubmit}
              style={{ height: 36, fontSize: 12 }}>
              <Send size={13} /> Envoyer le ticket
            </TealBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export function BusinessSupport() {
  const [tickets, setTickets]     = useState<Ticket[]>(INITIAL_TICKETS);
  const [modal, setModal]         = useState(false);
  const [submitted, setSubmitted] = useState<Ticket | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  const online = isOpenNow();

  const filteredFaq = useMemo(() =>
    faqSearch.trim()
      ? FAQ_ITEMS.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()))
      : FAQ_ITEMS
  , [faqSearch]);

  const filteredTickets = useMemo(() => {
    if (activeTab === 'open') return tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
    if (activeTab === 'resolved') return tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    return tickets;
  }, [tickets, activeTab]);

  function handleSubmit(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'ref'>) {
    const now = new Date().toISOString();
    const ref = `TKT-2025-${String(tickets.length + 48).padStart(4, '0')}`;
    const ticket: Ticket = { ...data, id: `t${Date.now()}`, ref, createdAt: now, updatedAt: now };
    setTickets(p => [ticket, ...p]);
    setModal(false);
    setSubmitted(ticket);
    setTimeout(() => setSubmitted(null), 5000);
  }

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>

      {/* Confirmation ticket soumis */}
      {submitted && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 10 }}>
          <Check size={14} color={C.teal} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Ticket créé — {submitted.ref}</span>
            <span style={{ fontSize: 12, color: C.t3, marginLeft: 8 }}>Réponse attendue sous 2h ouvrées</span>
          </div>
          <button onClick={() => setSubmitted(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}><X size={14} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ COLONNE GAUCHE ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Héro */}
          <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 28px 24px', boxShadow: '0 4px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
              <LifeBuoy size={15} color={C.t3} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Support B2B</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: online ? C.tealT : 'rgba(255,255,255,0.04)', border: `1px solid ${online ? C.tealB : C.bds}`, borderRadius: 20, padding: '3px 10px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: online ? C.teal : C.t3 }} />
                <span style={{ fontSize: 11, color: online ? C.teal : C.t3 }}>{online ? 'En ligne' : 'Hors ligne'}</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 6 }}>SLA garanti</div>
              <div style={{ fontSize: 36, fontWeight: 700, fontFamily: MONO, letterSpacing: '-0.04em', lineHeight: 1, color: C.t1, marginBottom: 6 }}>
                2h
                <span style={{ fontSize: 16, color: C.t3, fontWeight: 400, marginLeft: 8, letterSpacing: 0 }}>ouvrées</span>
              </div>
              <div style={{ fontSize: 12, color: C.t3 }}>Délai de réponse maximal garanti pour les clients B2B</div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              {[
                { v: String(tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length), l: 'Tickets ouverts' },
                { v: String(tickets.filter(t => t.status === 'resolved').length), l: 'Résolus' },
                { v: '98 %', l: 'Satisfaction' },
              ].map((s, i, arr) => (
                <div key={s.l} style={{ paddingRight: i < arr.length - 1 ? 24 : 0, borderRight: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO, marginBottom: 3 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.t3 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <TealBtn onClick={() => setModal(true)} style={{ height: 36, fontSize: 12 }}>
              <Plus size={13} /> Nouveau ticket
            </TealBtn>
          </div>

          {/* Tickets */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <GroupHead>Mes tickets</GroupHead>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['all', 'open', 'resolved'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: `1px solid ${activeTab === tab ? C.tealB : 'transparent'}`, background: activeTab === tab ? C.tealT : 'transparent', color: activeTab === tab ? C.teal : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}>
                    {tab === 'all' ? 'Tous' : tab === 'open' ? 'Ouverts' : 'Résolus'}
                  </button>
                ))}
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center', color: C.t3, fontSize: 13 }}>
                Aucun ticket dans cette catégorie
              </div>
            ) : (
              filteredTickets.map((t, i) => (
                <div key={t.id} style={{ padding: '16px 22px', borderBottom: i < filteredTickets.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{t.subject}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{t.ref}</span>
                        <span style={{ fontSize: 11, color: C.t3 }}>·</span>
                        <span style={{ fontSize: 11, color: C.t3 }}>{CATEGORIES.find(c => c.id === t.category)?.label}</span>
                        <span style={{ fontSize: 11, color: C.t3 }}>·</span>
                        <span style={{ fontSize: 11, color: C.t3 }}>{relDate(t.createdAt)}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: statusColor(t.status), background: statusBg(t.status), border: `1px solid ${statusBorder(t.status)}`, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {statusLabel(t.status)}
                    </span>
                  </div>
                  {t.status === 'in_progress' && (
                    <div style={{ fontSize: 11, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 6, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Activity size={11} /> Traitement en cours par notre équipe
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* FAQ */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}><GroupHead>Questions fréquentes</GroupHead></div>
              <div style={{ position: 'relative', width: 200 }}>
                <Search size={12} color={C.t3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)}
                  placeholder="Rechercher…"
                  style={{ width: '100%', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8, paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT, boxSizing: 'border-box' }} />
              </div>
            </div>
            {filteredFaq.length === 0 ? (
              <div style={{ padding: '30px 22px', textAlign: 'center', color: C.t3, fontSize: 13 }}>Aucun résultat pour « {faqSearch} »</div>
            ) : (
              filteredFaq.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)
            )}
          </div>
        </div>

        {/* ══ COLONNE DROITE ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>

          {/* Canaux de contact */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <GroupHead>Nous contacter</GroupHead>
            </div>
            {[
              {
                icon: <MessageCircle size={16} color={C.t3} />,
                title: 'WhatsApp Business',
                sub: 'Réponse rapide — idéal pour les urgences',
                badge: online ? 'En ligne' : undefined,
                href: "https://wa.me/33600000000?text=Bonjour%2C%20je%20suis%20client%20Terex%20Business.",
              },
              {
                icon: <Mail size={16} color={C.t3} />,
                title: 'Email dédié B2B',
                sub: 'b2b@terex.io — pour les dossiers complexes',
                href: "mailto:b2b@terex.io?subject=Support%20Terex%20Business",
              },
              {
                icon: <FileText size={16} color={C.t3} />,
                title: 'Documentation technique',
                sub: 'API, webhooks, intégrations, guides',
                href: "https://docs.terex.io",
              },
            ].map((c, i, arr) => {
              const [h, setH] = useState(false);
              return (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', background: h ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.12s', textDecoration: 'none' }}>
                  <span style={{ color: C.t3, flexShrink: 0, display: 'flex' }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{c.title}</span>
                      {c.badge && <span style={{ fontSize: 10, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 4, padding: '1px 6px' }}>{c.badge}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{c.sub}</div>
                  </div>
                  <ExternalLink size={12} color={C.t3} style={{ flexShrink: 0 }} />
                </a>
              );
            })}
          </div>

          {/* Horaires */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <GroupHead>Horaires d'ouverture</GroupHead>
              <span style={{ fontSize: 11, color: C.t3 }}>Heure Dakar (GMT)</span>
            </div>
            {HOURS.map((row, i) => (
              <div key={row.day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < HOURS.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{row.day}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.open ? C.teal : C.t3, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: row.open ? C.t2 : C.t3, fontFamily: MONO }}>{row.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Statut des services */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <GroupHead>Statut des services</GroupHead>
              <span style={{ fontSize: 11, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 4, padding: '2px 7px' }}>
                {SERVICES.filter(s => s.status === 'operational').length}/{SERVICES.length} opérationnels
              </span>
            </div>
            {SERVICES.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: i < SERVICES.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t2 }}>{s.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'operational' ? C.teal : C.red }} />
                  <span style={{ fontSize: 11, color: s.status === 'operational' ? C.t3 : C.red }}>
                    {s.status === 'operational' ? 'Opérationnel' : 'Dégradé'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ressources utiles */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <GroupHead>Ressources</GroupHead>
            </div>
            {[
              { icon: <FileText size={14} color={C.t3} />, label: 'Guide de démarrage B2B', sub: 'Configuration et premiers paiements' },
              { icon: <Zap size={14} color={C.t3} />,      label: 'Référence API complète', sub: 'Endpoints, webhooks, exemples' },
              { icon: <Shield size={14} color={C.t3} />,   label: 'Politique de conformité', sub: 'KYC, LCB-FT, UEMOA' },
            ].map((r, i, arr) => {
              const [h, setH] = useState(false);
              return (
                <div key={r.label}
                  onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', cursor: 'pointer', background: h ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.12s' }}>
                  <span style={{ display: 'flex', flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{r.sub}</div>
                  </div>
                  <ChevronRight size={13} color={C.t3} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal nouveau ticket */}
      {modal && <NewTicketModal onClose={() => setModal(false)} onSubmit={handleSubmit} />}
    </div>
  );
}
