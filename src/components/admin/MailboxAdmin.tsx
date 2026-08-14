/**
 * Messagerie back-office — inspirée du MailboxPanel d'Ooble.
 *
 * Trois sous-vues :
 *   1. Composer   — libre. Picker de destinataires (recherche annuaire client
 *                   + adresses tapées à la main). Sujet, corps texte simple,
 *                   variables {{prenom}} / {{nom_complet}} / {{email}} auto-
 *                   substituées à l'envoi. Un envoi par destinataire.
 *   2. Envoyés    — historique local (localStorage) des envois avec statut.
 *   3. Modèles    — points de départ réutilisables (chargés dans le composer,
 *                   entièrement éditables ensuite).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Mail, Send, Users, User, X, Loader2, Check, AlertTriangle,
  Sparkles, Bookmark, History, Search, Eye, ArrowLeft,
  UserCheck, ShieldAlert, HandCoins, HelpCircle, MessageSquare,
  Wallet, Clock, Wrench, Trophy, Gift, Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';
const ACCENT_ROW = 'rgba(255,255,255,0.08)';
const ACCENT_BORDER = 'rgba(255,255,255,0.25)';

const cardStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20,
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

// ── Types ────────────────────────────────────────────────────────────────
interface Recipient {
  id?: string;
  email: string;
  firstName: string;
  fullName: string;
}

interface ClientDirEntry {
  id: string;
  email: string;
  firstName: string;
  fullName: string;
}

interface SentMail {
  id: string;
  to: string;
  subject: string;
  bodySnippet: string;
  sentAt: string;
  ok: boolean;
  error?: string;
}

// ── Snippets Terex (modèles rédigés à la main, adaptés au contexte) ─────
interface Snippet {
  id: string; name: string; description: string; icon: any;
  subject: string; body: string;
}

const SNIPPETS: Snippet[] = [
  {
    id: 'welcome', name: 'Bienvenue personnalisée', description: 'Message d\'accueil plus chaleureux que l\'auto.',
    icon: HandCoins, subject: 'Bienvenue sur Terex',
    body: `Bonjour {{prenom}},

Bienvenue chez Terex. Votre compte est actif : vous pouvez dès maintenant acheter ou vendre des USDT contre des francs CFA en quelques minutes.

Quelques repères pour bien démarrer :
- Le taux du jour est affiché en temps réel sur votre tableau de bord.
- Les paiements se font via Wave ou Orange Money.
- Nos équipes répondent en moins de 5 minutes en semaine, en cas de question.

À bientôt,
L'équipe Terex`,
  },
  {
    id: 'kyc-followup', name: 'Relance KYC', description: 'Le client n\'a pas fini sa vérification.',
    icon: UserCheck, subject: 'Finalisez votre vérification Terex',
    body: `Bonjour {{prenom}},

Nous n'avons pas encore reçu tous les documents nécessaires à la validation de votre compte Terex.

Pour finaliser votre vérification KYC, vous pouvez reprendre la démarche depuis votre espace : https://terangaexchange.com/dashboard

Un membre de l'équipe reste disponible si vous avez la moindre question — répondez simplement à ce message.

À bientôt,`,
  },
  {
    id: 'kyc-complement', name: 'Complément KYC', description: 'Un document est illisible ou manquant.',
    icon: UserCheck, subject: 'Complément d\'information pour votre dossier',
    body: `Bonjour {{prenom}},

Nous avons bien reçu votre dossier de vérification et il nous manque [préciser la pièce] pour finaliser.

Pouvez-vous nous transmettre ce document en réponse à ce message ?

Merci,`,
  },
  {
    id: 'payment-received', name: 'Paiement reçu', description: 'Confirmation manuelle après réception d\'un Wave.',
    icon: Wallet, subject: 'Paiement reçu — commande [REF]',
    body: `Bonjour {{prenom}},

Nous confirmons la réception de votre paiement pour la commande [REF].

Nous procédons à l'envoi de vos USDT à l'adresse indiquée. Vous recevrez un dernier email dès que la transaction blockchain est validée.

Merci de votre confiance,`,
  },
  {
    id: 'order-completed', name: 'Transaction terminée', description: 'Confirmation manuelle après envoi USDT.',
    icon: Check, subject: 'Transaction terminée — commande [REF]',
    body: `Bonjour {{prenom}},

Votre transaction [REF] est terminée. Voici le hash blockchain de l'envoi :

[HASH]

Vous pouvez le retrouver dans votre historique à tout moment.

À bientôt sur Terex,`,
  },
  {
    id: 'delay-apology', name: 'Excuses délai', description: 'Message d\'excuse pour un traitement plus long.',
    icon: Clock, subject: 'Traitement de votre commande [REF]',
    body: `Bonjour {{prenom}},

Le traitement de votre commande [REF] prend plus de temps qu'habituellement en raison de [préciser la cause]. Nous en sommes désolés.

Estimation d'achèvement : [préciser].

Nous restons à votre disposition en réponse à ce message si vous avez la moindre question.

Merci pour votre patience,`,
  },
  {
    id: 'wrong-network', name: 'Mauvais réseau USDT', description: 'Le client a envoyé sur le mauvais réseau.',
    icon: ShieldAlert, subject: 'Réseau blockchain — action requise sur votre vente',
    body: `Bonjour {{prenom}},

Nous détectons que le dépôt USDT associé à votre commande [REF] a été effectué sur le réseau [reçu], alors que la commande était configurée pour [attendu].

Selon le réseau utilisé, la récupération des fonds est parfois possible mais nécessite des frais supplémentaires et un délai de traitement plus long.

Merci de nous confirmer :
1. Le hash de la transaction
2. L'adresse d'expédition

Nous revenons vers vous avec la marche à suivre.

Cordialement,`,
  },
  {
    id: 'wallet-format', name: 'Adresse wallet invalide', description: 'Adresse fournie non valide pour le réseau choisi.',
    icon: AlertTriangle, subject: 'Vérification de votre adresse USDT — commande [REF]',
    body: `Bonjour {{prenom}},

Avant d'envoyer vos USDT pour la commande [REF], nous vérifions le format de l'adresse de réception. Celle que vous avez fournie ne correspond pas au format attendu pour le réseau [préciser].

Pouvez-vous nous confirmer que vous vouliez bien recevoir sur [réseau] ? Si oui, envoyez-nous la bonne adresse pour ce réseau en réponse à ce message.

Cordialement,`,
  },
  {
    id: 'security-alert', name: 'Alerte sécurité', description: 'Signaler une activité inhabituelle.',
    icon: ShieldAlert, subject: 'Activité inhabituelle sur votre compte Terex',
    body: `Bonjour {{prenom}},

Nous avons détecté une activité inhabituelle sur votre compte Terex : [préciser].

Par précaution, nous avons temporairement suspendu les opérations en attendant votre confirmation. Si c'était bien vous, répondez à ce message pour lever la suspension.

Si vous ne reconnaissez pas cette activité, changez immédiatement votre mot de passe et contactez-nous.

Cordialement,
L'équipe sécurité Terex`,
  },
  {
    id: 'thank-you', name: 'Remerciement', description: 'Message positif à un client fidèle.',
    icon: Trophy, subject: 'Un mot de la part de Terex',
    body: `Bonjour {{prenom}},

Nous voulions simplement vous dire merci pour votre confiance depuis vos premiers échanges sur Terex.

Chaque commande que vous nous passez nous permet de continuer à améliorer la plateforme pour vous et pour tous nos clients d'Afrique de l'Ouest.

À très vite,
L'équipe Terex`,
  },
  {
    id: 'referral-push', name: 'Invitation parrainage', description: 'Pousse le client à parrainer.',
    icon: Gift, subject: 'Faites découvrir Terex à un ami',
    body: `Bonjour {{prenom}},

Vous connaissez quelqu'un qui échange régulièrement des cryptos ou reçoit des fonds internationaux ?

Envoyez-lui votre lien Terex : il découvre une plateforme sécurisée, un taux transparent et un support en français, 24/7.

Votre lien de parrainage : https://terangaexchange.com/referral

Merci de votre soutien,`,
  },
  {
    id: 'sav-response', name: 'Réponse SAV', description: 'Réponse type à une demande support.',
    icon: HelpCircle, subject: 'Re: [SUJET]',
    body: `Bonjour {{prenom}},

Merci pour votre message.

[Rédigez votre réponse ici.]

N'hésitez pas si vous avez besoin d'autre chose,
L'équipe Terex`,
  },
  {
    id: 'maintenance', name: 'Maintenance planifiée', description: 'Prévenir d\'une intervention planifiée.',
    icon: Wrench, subject: 'Maintenance planifiée sur Terex',
    body: `Bonjour {{prenom}},

Nous vous informons qu'une opération de maintenance est programmée le [date] de [heure] à [heure].

Pendant cette période, l'accès à la plateforme sera temporairement indisponible. Aucune commande en cours ne sera perdue.

Merci pour votre compréhension.

Cordialement,`,
  },
  {
    id: 'blank', name: 'Message libre', description: 'Point de départ vierge (juste la formule de politesse).',
    icon: MessageSquare, subject: '',
    body: `Bonjour {{prenom}},

[Rédigez votre message ici.]

Cordialement,
L'équipe Terex`,
  },
];

const CLIENT_VARS = ['prenom', 'nom_complet', 'email'];
const varsFor = (r: Recipient) => ({
  prenom: r.firstName || '',
  nom_complet: r.fullName || r.email,
  email: r.email,
});
const substituteVars = (text: string, vars: Record<string, string>) =>
  text.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? `{{${k}}}`));

const manualRecipient = (email: string): Recipient => {
  const local = email.split('@')[0] ?? '';
  const first = (local.split(/[._-]/)[0] || '').replace(/^./, c => c.toUpperCase());
  return { email, firstName: first, fullName: first };
};

// ── Localstorage : historique envois ─────────────────────────────────────
const SENT_KEY = 'terex_mailbox_sent_v1';
const loadSent = (): SentMail[] => {
  try { return JSON.parse(localStorage.getItem(SENT_KEY) || '[]'); } catch { return []; }
};
const recordSent = (m: SentMail) => {
  const list = [m, ...loadSent()].slice(0, 200);
  localStorage.setItem(SENT_KEY, JSON.stringify(list));
};

// ── Composant principal ─────────────────────────────────────────────────
type SubTab = 'compose' | 'sent' | 'snippets';

export function MailboxAdmin() {
  const [tab, setTab] = useState<SubTab>('compose');
  const [clients, setClients] = useState<ClientDirEntry[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // Composer state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [cc, setCc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Snippet appliqué
  const [pickedSnippetId, setPickedSnippetId] = useState<string | null>(null);
  const [pendingSnippet, setPendingSnippet] = useState<Snippet | null>(null);

  // Assistant IA
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBusy, setAiBusy] = useState(false);

  const [sent, setSent] = useState<SentMail[]>([]);

  // Charger l'annuaire clients
  useEffect(() => {
    (async () => {
      setClientsLoading(true);
      try {
        const { data } = await (supabase as any)
          .from('client_infos')
          .select('id, user_id, first_name, last_name, email')
          .not('email', 'is', null)
          .limit(500);
        const list: ClientDirEntry[] = (data || []).map((c: any) => {
          const fn = c.first_name || '';
          const ln = c.last_name || '';
          const full = [fn, ln].filter(Boolean).join(' ') || c.email;
          return { id: c.user_id || c.id, email: c.email, firstName: fn, fullName: full };
        });
        setClients(list);
      } catch { /* silencieux */ }
      setClientsLoading(false);
    })();
    setSent(loadSent());
  }, []);

  // Appliquer un snippet
  const applySnippet = (s: Snippet) => {
    setPickedSnippetId(s.id);
    setSubject(s.subject);
    setBody(s.body);
    setTab('compose');
    toast.success(`Modèle « ${s.name} » chargé dans le composer`);
  };

  useEffect(() => {
    if (pendingSnippet) {
      applySnippet(pendingSnippet);
      setPendingSnippet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSnippet]);

  const isReady = recipients.length > 0 && subject.trim().length > 0 && body.trim().length > 0;

  // Prévisualisation pour le 1er destinataire (variables substituées)
  const previewR = recipients[0];
  const previewVars = previewR ? varsFor(previewR) : {};
  const previewSubject = previewR ? substituteVars(subject, previewVars) : subject;
  const previewBody = previewR
    ? substituteVars(body, previewVars)
    : body;

  const bodyToHtml = (t: string) =>
    t.split(/\n\n+/)
      .map(p => `<p>${p.split('\n').map(esc).join('<br/>')}</p>`)
      .join('');

  const sendAll = async () => {
    if (busy) return;
    // Validation explicite pour feedback clair (au lieu du bouton silencieusement disabled)
    if (recipients.length === 0) { toast.error('Ajoutez au moins un destinataire'); return; }
    if (!subject.trim()) { toast.error('Le sujet est vide'); return; }
    if (!body.trim()) { toast.error('Le message est vide'); return; }

    setBusy(true);
    let ok = 0, ko = 0;
    let firstErr: string | undefined;
    const ccList = cc.split(',').map(s => s.trim()).filter(s => EMAIL_RE.test(s));

    for (const r of recipients) {
      const vars = varsFor(r);
      const subj = substituteVars(subject, vars);
      const bodyText = substituteVars(body, vars);
      const html = bodyToHtml(bodyText);

      try {
        const { data, error } = await supabase.functions.invoke('send-custom-email', {
          body: { to: r.email, subject: subj, html, text: bodyText, cc: ccList.length ? ccList : undefined },
        });
        if (error || !data?.success) {
          const msg = data?.error || error?.message || 'Échec';
          ko++; firstErr = firstErr || msg;
          recordSent({ id: crypto.randomUUID(), to: r.email, subject: subj, bodySnippet: bodyText.slice(0, 140),
                       sentAt: new Date().toISOString(), ok: false, error: msg });
        } else {
          ok++;
          recordSent({ id: crypto.randomUUID(), to: r.email, subject: subj, bodySnippet: bodyText.slice(0, 140),
                       sentAt: new Date().toISOString(), ok: true });
        }
      } catch (e: any) {
        ko++; firstErr = firstErr || e?.message || 'Erreur inconnue';
        recordSent({ id: crypto.randomUUID(), to: r.email, subject: subj, bodySnippet: bodyText.slice(0, 140),
                     sentAt: new Date().toISOString(), ok: false, error: e?.message });
      }
    }

    setSent(loadSent());
    setBusy(false);

    if (ko === 0) {
      toast.success(recipients.length === 1
        ? `Envoyé à ${recipients[0].fullName || recipients[0].email}`
        : `${ok} messages envoyés`);
      setRecipients([]); setSubject(''); setBody(''); setCc(''); setShowCc(false); setPickedSnippetId(null);
    } else if (ok === 0) {
      toast.error(firstErr || 'Échec des envois');
    } else {
      toast.warning(`${ok} envoyés · ${ko} en échec${firstErr ? ` — ${firstErr}` : ''}`);
    }
  };

  // ── Assistant IA : demande un draft à Claude ────────────────────────────
  const runAiDraft = async () => {
    const intention = aiPrompt.trim();
    if (!intention || aiBusy) return;
    setAiBusy(true);
    try {
      // Contexte client si un vrai destinataire est sélectionné
      const target = recipients.find(r => r.id) || recipients[0];
      const { data, error } = await supabase.functions.invoke('ai-draft-mail', {
        body: {
          intention,
          clientName: target?.firstName || undefined,
          clientEmail: target?.email || undefined,
        },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Échec du draft IA');
      setSubject(data.subject);
      setBody(data.body);
      setAiPrompt('');
      setAiOpen(false);
      toast.success(`Draft IA généré (${data.tokens.in} + ${data.tokens.out} tokens)`);
    } catch (e: any) {
      toast.error(e?.message || 'Erreur lors du draft IA');
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <style>{drillStyles}</style>
      <PageHeader title="Messagerie" sub="Écrivez librement à un client ou à plusieurs" />

      {/* Sous-tabs — même style que la nav du haut (rounded 12) */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'compose', label: 'Composer', Icon: Mail },
          { id: 'sent',    label: `Envoyés${sent.length ? ` (${sent.length})` : ''}`, Icon: History },
          { id: 'snippets',label: 'Modèles', Icon: Bookmark },
        ].map(({ id, label, Icon }) => {
          const sel = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id as SubTab)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 12,
                background: sel ? '#ffffff' : CARD,
                border: `1px solid ${sel ? '#ffffff' : BORDER}`,
                color: sel ? '#141414' : '#9ca3af',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', outline: 'none', transition: 'all 0.15s',
              }}
            >
              <Icon size={14} strokeWidth={2} /> {label}
            </button>
          );
        })}
      </div>

      {tab === 'compose' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-5">
          {/* Composer */}
          <section style={{ ...cardStyle, padding: 0 }}>
            {/* Recipient picker */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', rowGap: 12 }}>
              <RecipientPicker
                selected={recipients}
                clients={clients}
                loading={clientsLoading}
                onAdd={(r) => setRecipients(prev =>
                  prev.some(x => x.email.toLowerCase() === r.email.toLowerCase()) ? prev : [...prev, r]
                )}
                onRemove={(email) => setRecipients(prev => prev.filter(r => r.email !== email))}
                onSelectAll={() => setRecipients(clients.map(c => ({ id: c.id, email: c.email, firstName: c.firstName, fullName: c.fullName })))}
              />
              {showCc ? (
                <FieldRow label="Cc">
                  <input value={cc} onChange={e => setCc(e.target.value)} placeholder="terangaexchange@gmail.com"
                    style={fieldInput} spellCheck={false} autoCapitalize="none" />
                </FieldRow>
              ) : (
                <button type="button" onClick={() => setShowCc(true)}
                  style={{ justifySelf: 'start', background: 'transparent', border: 'none',
                    cursor: 'pointer', color: '#6b7280', fontSize: 12, padding: 0 }}>
                  + Ajouter Cc
                </button>
              )}
              <FieldRow label="Sujet">
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Objet du message"
                  style={fieldInput} />
              </FieldRow>
            </div>

            {/* Toolbar : variables + Assistant IA */}
            <div style={{ padding: '10px 20px', borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.015)',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Sparkles size={13} color="#9ca3af" />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Variables :</span>
              {CLIENT_VARS.map(v => (
                <button key={v} onClick={() => setBody(b => b + `{{${v}}}`)} type="button"
                  style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, color: '#fff',
                    padding: '3px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  {`{{${v}}}`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAiOpen(o => !o)}
                style={{
                  marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 8,
                  background: aiOpen ? ACCENT_ROW : INPUT_BG,
                  border: `1px solid ${aiOpen ? ACCENT_BORDER : BORDER}`,
                  color: '#fff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', outline: 'none',
                }}>
                <Wand2 size={12} strokeWidth={2} /> Suggérer avec l'IA
              </button>
            </div>

            {/* Bandeau IA plié/déplié */}
            {aiOpen && (
              <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`,
                background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Wand2 size={14} color="#9ca3af" style={{ marginTop: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void runAiDraft(); }
                      }}
                      placeholder="Décrivez en une phrase ce que vous voulez dire. Ex : « réponds gentiment qu'on a bien reçu son KYC mais qu'il manque la preuve d'adresse »"
                      rows={2}
                      style={{ width: '100%', boxSizing: 'border-box', border: 'none', outline: 'none',
                        background: 'transparent', color: '#fff', fontSize: 14, lineHeight: 1.5,
                        resize: 'none', padding: '6px 0',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 10 }}>
                      <span style={{ fontSize: 10.5, color: '#6b7280' }}>
                        {recipients[0]
                          ? `Contexte : ${recipients[0].fullName || recipients[0].email}`
                          : 'Aucun contexte — sélectionnez un destinataire pour personnaliser.'}
                      </span>
                      <button type="button" onClick={runAiDraft}
                        disabled={!aiPrompt.trim() || aiBusy}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          background: aiPrompt.trim() && !aiBusy ? '#fff' : '#3d3d3d',
                          color: aiPrompt.trim() && !aiBusy ? '#141414' : '#6b7280',
                          fontSize: 12, fontWeight: 600,
                          cursor: aiPrompt.trim() && !aiBusy ? 'pointer' : 'not-allowed', outline: 'none',
                        }}>
                        {aiBusy
                          ? <><Loader2 size={12} className="animate-spin" /> Génération…</>
                          : <><Wand2 size={12} /> Générer le draft</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Body */}
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={'Bonjour {{prenom}},\n\nÉcrivez votre message ici.\n\nCordialement,\nL\'équipe Terex'}
              rows={14}
              style={{ display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '16px 20px 8px', border: 'none', outline: 'none',
                background: 'transparent', color: '#fff', fontSize: 15, lineHeight: 1.55,
                resize: 'vertical', minHeight: 260,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            />

            {/* Actions bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12, padding: '12px 20px', borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button type="button" onClick={() => setShowPreview(v => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent',
                    border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, padding: '6px 8px' }}>
                  <Eye size={13} /> {showPreview ? 'Cacher l\'aperçu' : 'Voir l\'aperçu'}
                </button>
                {pickedSnippetId && (
                  <span style={{ fontSize: 11, color: '#9ca3af',
                    background: INPUT_BG, border: `1px solid ${BORDER}`,
                    padding: '4px 10px', borderRadius: 999 }}>
                    Modèle : {SNIPPETS.find(s => s.id === pickedSnippetId)?.name}
                  </span>
                )}
              </div>
              <button onClick={sendAll} disabled={busy}
                style={{ height: 38, padding: '0 20px', borderRadius: 10, border: 'none',
                  background: !busy ? '#fff' : '#3d3d3d',
                  color: !busy ? '#141414' : '#6b7280',
                  fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7,
                  cursor: !busy ? 'pointer' : 'not-allowed', transition: 'all 0.15s', opacity: isReady ? 1 : 0.7 }}
                title={isReady ? 'Envoyer' : 'Complétez destinataire, sujet et message'}>
                {busy
                  ? <><Loader2 size={14} className="animate-spin" /> Envoi…</>
                  : <><Send size={14} /> {recipients.length > 1 ? `Envoyer à ${recipients.length}` : 'Envoyer'}</>}
              </button>
            </div>
          </section>

          {/* Preview */}
          {showPreview && (
            <div style={{ ...cardStyle, padding: 0 }}>
              <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={14} color="#9ca3af" />
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Aperçu</span>
                </div>
                <span style={{ fontSize: 10.5, color: '#6b7280' }}>
                  {previewR ? `Pour ${previewR.fullName || previewR.email}` : 'Rendu final chez le destinataire'}
                </span>
              </div>
              <MailPreview subject={previewSubject || '—'} body={previewBody} to={previewR?.email ?? '—'} />
            </div>
          )}
        </div>
      )}

      {tab === 'sent' && (
        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <History size={14} color="#9ca3af" />
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>Historique local</h3>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280' }}>
              Stocké sur cet appareil uniquement · {sent.length} envois
            </span>
          </div>
          {sent.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13 }}>Aucun message envoyé depuis cet appareil.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sent.map(m => (
                <div key={m.id} style={{ padding: 14, borderRadius: 12,
                  background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%',
                      background: m.ok ? '#22c55e' : '#ef4444' }} />
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || '—'}</p>
                    <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {dateFmt.format(new Date(m.sentAt))}
                    </span>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    → {m.to}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: 0, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {m.bodySnippet}
                  </p>
                  {!m.ok && m.error && (
                    <p style={{ color: '#f87171', fontSize: 11, margin: '6px 0 0' }}>
                      Erreur : {m.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'snippets' && (
        <section style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Bookmark size={14} color="#9ca3af" />
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>Modèles de démarrage</h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
              {SNIPPETS.length} modèles rédigés à la main pour les cas courants. Chargez-en un dans le composer puis modifiez-le comme vous voulez.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {SNIPPETS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setPendingSnippet(s)}
                  style={{ padding: 16, borderRadius: 14, background: INPUT_BG,
                    border: `1px solid ${BORDER}`, textAlign: 'left', cursor: 'pointer',
                    outline: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT_ROW; }}
                  onMouseLeave={e => { e.currentTarget.style.background = INPUT_BG; }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    color: '#9ca3af', marginBottom: 10 }}>
                    <Icon size={16} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>{s.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: 11.5, margin: 0, lineHeight: 1.4 }}>{s.description}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Recipient picker ─────────────────────────────────────────────────────
interface PickerProps {
  selected: Recipient[]; clients: ClientDirEntry[]; loading: boolean;
  onAdd: (r: Recipient) => void; onRemove: (email: string) => void; onSelectAll: () => void;
}

function RecipientPicker({ selected, clients, loading, onAdd, onRemove, onSelectAll }: PickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const q = query.trim().toLowerCase();
  const selectedIds = new Set(selected.map(r => r.email.toLowerCase()));
  const matches = q
    ? clients
        .filter(c => !selectedIds.has(c.email.toLowerCase()))
        .filter(c =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.firstName.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : clients.filter(c => !selectedIds.has(c.email.toLowerCase())).slice(0, 6);

  const commit = () => {
    const raw = query.trim();
    if (!raw) return;
    if (EMAIL_RE.test(raw)) { onAdd(manualRecipient(raw)); setQuery(''); setOpen(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', alignItems: 'start', gap: 8, position: 'relative' }}>
      <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase',
        letterSpacing: '0.08em', paddingTop: 8 }}>À</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minHeight: 32 }}>
        {selected.map(r => (
          <span key={r.email} title={r.email}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 6px 4px 10px', borderRadius: 999,
              background: r.id ? ACCENT_ROW : INPUT_BG,
              border: `1px solid ${r.id ? ACCENT_BORDER : BORDER}`,
              color: '#fff', fontSize: 12, maxWidth: '100%' }}>
            {r.id ? <User size={10} color="#9ca3af" /> : <Mail size={10} color="#9ca3af" />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
              {r.fullName || r.email}
            </span>
            <button type="button" onClick={() => onRemove(r.email)} aria-label={`Retirer ${r.email}`}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 18, height: 18, borderRadius: 999, background: 'transparent', border: 'none',
                cursor: 'pointer', color: '#9ca3af' }}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 140)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            if (e.key === 'Backspace' && !query && selected.length > 0) {
              onRemove(selected[selected.length - 1].email);
            }
          }}
          placeholder={selected.length === 0 ? 'Chercher un client ou taper un email…' : ''}
          spellCheck={false} autoCapitalize="none"
          style={{ flex: 1, minWidth: 180, border: 'none', outline: 'none',
            background: 'transparent', color: '#fff', fontSize: 15, padding: '6px 0' }} />
      </div>

      {open && (matches.length > 0 || loading || (clients.length > 0 && q)) && (
        <div onMouseDown={e => e.preventDefault()}
          style={{ position: 'absolute', top: '100%', left: 56, right: 0, marginTop: 4, zIndex: 20,
            background: '#242424', border: `1px solid ${BORDER}`, borderRadius: 12,
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.5)', maxHeight: 320, overflowY: 'auto', padding: 4 }}>
          {loading && (
            <div style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>
              Chargement de l'annuaire…
            </div>
          )}
          {!loading && matches.length === 0 && (
            <div style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>
              {q ? (
                <>Aucun résultat. {EMAIL_RE.test(q) && <>Entrée pour envoyer à cette adresse.</>}</>
              ) : 'Tous les clients sont déjà sélectionnés.'}
            </div>
          )}
          {matches.map(c => (
            <button key={c.id} type="button"
              onMouseDown={() => { onAdd({ id: c.id, email: c.email, firstName: c.firstName, fullName: c.fullName }); setQuery(''); }}
              style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#fff', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`,
                color: '#9ca3af', fontSize: 11.5 }}>
                {(c.firstName || c.email)[0]?.toUpperCase() || '?'}
              </span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: 13, color: '#fff',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.fullName}
                </span>
                <span style={{ display: 'block', fontSize: 11, color: '#6b7280',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.email}
                </span>
              </span>
            </button>
          ))}
          {!loading && clients.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderTop: `1px solid ${BORDER}`, marginTop: 4,
              fontSize: 11, color: '#6b7280' }}>
              <span>{clients.length} clients dans l'annuaire</span>
              <button type="button" onMouseDown={onSelectAll}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#9ca3af', fontSize: 11, padding: 0 }}>
                <Users size={11} /> Tout sélectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Petites briques ─────────────────────────────────────────────────────
const fieldInput: React.CSSProperties = {
  border: 'none', padding: 0, background: 'transparent',
  fontSize: 15, color: '#fff', outline: 'none', width: '100%',
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '48px 1fr', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function MailPreview({ subject, body, to }: { subject: string; body: string; to: string }) {
  return (
    <div style={{ background: '#f6f6f4', padding: 16, minHeight: 480 }}>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08)' }}>
        <div style={{ padding: '18px 22px 12px' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111' }}>Terex</div>
        </div>
        <div style={{ padding: '4px 22px 8px', fontSize: 12, color: '#6b6b68', lineHeight: 1.55 }}>
          <div><span style={{ color: '#9c9c98', display: 'inline-block', width: 42 }}>À</span> {to}</div>
          <div style={{ marginTop: 4 }}><span style={{ color: '#9c9c98', display: 'inline-block', width: 42 }}>Sujet</span> {subject}</div>
        </div>
        <div style={{ padding: '14px 22px 22px', fontSize: 15, color: '#111', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {body}
        </div>
      </div>
    </div>
  );
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
