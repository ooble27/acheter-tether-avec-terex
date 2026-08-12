import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Mail, Send, Eye, Loader2, Users, TestTube, RefreshCw, History,
  UserCheck, UserX, Moon, CheckCircle2, AlertCircle, Sparkles,
  Coins, Zap, Gift, Bell, Megaphone, Rocket, Shield, BookOpen,
  Wrench, TrendingUp, PartyPopper, Network, HeartHandshake, Newspaper,
  ChevronRight,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';
const ACCENT_ROW = 'rgba(255,255,255,0.08)';
const ACCENT_BORDER = 'rgba(255,255,255,0.25)';

const cardStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20,
};
const inputClass = 'text-white placeholder-[#6b7280]';
const inputStyle: React.CSSProperties = {
  background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12, color: '#fff', outline: 'none',
};

type Segment = 'all' | 'active_clients' | 'never_ordered' | 'inactive_30d';

const SEGMENTS: { id: Segment; label: string; desc: string; Icon: any }[] = [
  { id: 'all',             label: 'Tous les clients', desc: 'Tous les comptes confirmés',      Icon: Users },
  { id: 'active_clients',  label: 'Clients actifs',    desc: 'Ont déjà passé une commande',    Icon: UserCheck },
  { id: 'never_ordered',   label: 'Jamais commandé',   desc: 'Inscrits sans commande',         Icon: UserX },
  { id: 'inactive_30d',    label: 'Inactifs 30 j',      desc: 'Aucune commande depuis 30 jours', Icon: Moon },
];

type Category = 'promo' | 'product' | 'education' | 'lifecycle';

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all',       label: 'Tous' },
  { id: 'promo',     label: 'Promos & Taux' },
  { id: 'product',   label: 'Produit' },
  { id: 'education', label: 'Éducation' },
  { id: 'lifecycle', label: 'Cycle client' },
];

interface CampaignTemplate {
  id: string; category: Category; name: string; icon: any; description: string;
  subject: string; previewText: string; heroTitle: string; content: string;
  highlightLabel?: string; highlightValue?: string; highlightSub?: string;
  ctaText: string; ctaUrl: string;
  useAutoRate?: boolean;
}

const TEMPLATES: CampaignTemplate[] = [
  // ── Promos & Taux ────────────────────────────────────────────────────────
  {
    id: 'rate', category: 'promo', name: 'Taux du jour', icon: Sparkles,
    description: 'Le taux USDT/CFA du moment mis en avant',
    subject: 'Le taux du jour est disponible sur Terex',
    previewText: 'Consultez le taux USDT/CFA à jour et lancez votre transaction en 3 minutes.',
    heroTitle: 'Le taux du jour vous attend',
    content: 'Le taux USDT/CFA du moment est mis à jour en temps réel sur votre tableau de bord.\nAchetez ou vendez vos USDT en quelques minutes, avec Wave ou Orange Money, et recevez vos fonds rapidement.',
    highlightLabel: 'Taux du jour', highlightValue: '585 CFA / USDT', highlightSub: 'Achat & vente · temps réel',
    ctaText: 'Voir le taux', ctaUrl: 'https://terangaexchange.com/dashboard',
    useAutoRate: true,
  },
  {
    id: 'weekend', category: 'promo', name: 'Boost Weekend', icon: PartyPopper,
    description: 'Message positif pour animer le weekend',
    subject: 'Le weekend commence, votre USDT aussi',
    previewText: 'Wave et Orange Money ouverts 24/7 — vos transactions ne s\'arrêtent pas.',
    heroTitle: 'Le weekend est votre allié',
    content: 'Contrairement aux banques classiques, Terex reste ouvert 7 jours sur 7.\nVos transactions USDT/CFA se font aussi bien un samedi soir qu\'un mardi matin — même délai de ~3 minutes.',
    highlightLabel: 'Ouvert', highlightValue: '7 j / 7', highlightSub: 'Wave · Orange Money · toutes chaînes',
    ctaText: 'Ouvrir une transaction', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'flash', category: 'promo', name: 'Flash 24 h', icon: Zap,
    description: 'Message court à forte urgence',
    subject: 'Aujourd\'hui seulement — offre Terex',
    previewText: 'Une opportunité à saisir dans les 24 prochaines heures.',
    heroTitle: '24 heures pour en profiter',
    content: 'Nous mettons en avant une opération spéciale valable jusqu\'à demain soir.\nSi vous prévoyiez d\'acheter ou vendre des USDT cette semaine, c\'est le bon moment.',
    highlightLabel: 'Validité', highlightValue: '24 heures', highlightSub: 'Fin ce soir minuit',
    ctaText: 'En profiter maintenant', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'referral_push', category: 'promo', name: 'Parrainage', icon: Gift,
    description: 'Incite au parrainage d\'amis',
    subject: 'Invitez un ami sur Terex',
    previewText: 'Faites découvrir la façon la plus simple d\'échanger USDT et CFA.',
    heroTitle: 'Un ami qui pourrait profiter de Terex ?',
    content: 'Vous connaissez quelqu\'un qui échange régulièrement des cryptos ou reçoit des fonds internationaux ?\nEnvoyez-lui votre lien Terex : il découvre une plateforme sécurisée, un taux transparent et un support en français, 24/7.',
    ctaText: 'Copier mon lien de parrainage', ctaUrl: 'https://terangaexchange.com/referral',
  },

  // ── Produit ──────────────────────────────────────────────────────────────
  {
    id: 'updates', category: 'product', name: 'Nouveautés', icon: Newspaper,
    description: 'Récap des dernières améliorations',
    subject: 'Ce mois-ci sur Terex',
    previewText: 'Découvrez les dernières améliorations de la plateforme.',
    heroTitle: 'Ce qui a changé sur Terex',
    content: 'Nous avons travaillé dur ces dernières semaines pour rendre vos échanges plus fluides.\nAdresses USDT enregistrées, numéros Wave/Orange sauvegardés, sélecteur de réseau redesigné : tout ce qui vous fait gagner du temps à chaque commande.',
    ctaText: 'Découvrir les nouveautés', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'new_network', category: 'product', name: 'Nouveau réseau', icon: Network,
    description: 'Annonce l\'ajout d\'un réseau blockchain',
    subject: 'Un nouveau réseau blockchain arrive sur Terex',
    previewText: 'Recevez vos USDT sur encore plus de chaînes.',
    heroTitle: 'Un réseau de plus, la même simplicité',
    content: 'Terex prend désormais en charge un nouveau réseau blockchain pour l\'envoi et la réception d\'USDT.\nAucun changement dans votre parcours : sélectionnez le réseau à la deuxième étape de votre commande et Terex fait le reste.',
    highlightLabel: 'Réseaux supportés', highlightValue: '7', highlightSub: 'Tron · BNB · Ethereum · Polygon · Solana · Aptos · Binance',
    ctaText: 'Essayer le nouveau réseau', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'feature_launch', category: 'product', name: 'Lancement', icon: Rocket,
    description: 'Grosse annonce produit',
    subject: 'Nouveau sur Terex',
    previewText: 'Une fonctionnalité conçue pour vous faire gagner du temps.',
    heroTitle: 'Une nouveauté à découvrir',
    content: 'Nous venons de lancer une nouvelle fonctionnalité sur Terex.\nElle est disponible dès aujourd\'hui pour tous les comptes vérifiés, sans surcoût. Ouvrez votre tableau de bord pour la découvrir.',
    ctaText: 'Voir la nouveauté', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'maintenance', category: 'product', name: 'Maintenance', icon: Wrench,
    description: 'Annonce d\'une intervention planifiée',
    subject: 'Maintenance planifiée sur Terex',
    previewText: 'Courte interruption prévue pour améliorer la plateforme.',
    heroTitle: 'Maintenance planifiée',
    content: 'Une courte fenêtre de maintenance est prévue pour améliorer les performances de Terex.\nLa plateforme sera indisponible pendant quelques minutes. Les commandes en cours ne sont pas impactées et reprennent normalement à la fin de l\'opération.',
    highlightLabel: 'Fenêtre', highlightValue: 'Ce soir · 23 h – 23 h 30', highlightSub: 'Heure UTC',
    ctaText: 'En savoir plus', ctaUrl: 'https://terangaexchange.com/status',
  },

  // ── Éducation & Confiance ────────────────────────────────────────────────
  {
    id: 'security', category: 'education', name: 'Sécurité', icon: Shield,
    description: 'Rappels sécurité — anti-arnaque',
    subject: 'Protégez votre compte Terex',
    previewText: '3 gestes simples pour rester en sécurité.',
    heroTitle: 'Votre sécurité, notre priorité',
    content: 'Terex ne vous demandera jamais votre mot de passe ni votre clé privée par email ou WhatsApp.\nSi quelqu\'un se présente comme membre de notre équipe et vous demande ces informations, c\'est une arnaque.\nEn cas de doute, écrivez-nous à terangaexchange@gmail.com pour vérifier.',
    ctaText: 'Voir nos conseils sécurité', ctaUrl: 'https://terangaexchange.com/security-policy',
  },
  {
    id: 'tips', category: 'education', name: 'Astuce du jour', icon: BookOpen,
    description: 'Petit conseil pratique',
    subject: 'Astuce Terex : gagnez du temps sur vos commandes',
    previewText: 'Un raccourci utile pour vos prochains achats.',
    heroTitle: 'Astuce · gagnez du temps',
    content: 'Depuis le nouveau tableau de bord, vous pouvez enregistrer vos adresses USDT et vos numéros Wave / Orange Money.\nÀ votre prochaine commande, sélectionnez-les en un clic — plus besoin de retaper ni de risquer une faute de frappe.',
    ctaText: 'Configurer mon carnet', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'why_terex', category: 'education', name: 'Pourquoi Terex', icon: HeartHandshake,
    description: 'Argumentaire de confiance',
    subject: 'Pourquoi les clients choisissent Terex',
    previewText: 'Rapidité, sécurité, support 24/7 : nos garanties.',
    heroTitle: 'Ce qui fait la différence',
    content: 'Terex traite vos commandes en environ 3 minutes, avec un support humain joignable 24 h/24.\nChaque compte est vérifié par KYC et chaque transaction est visible dans votre historique en temps réel.\nC\'est cette simplicité qui fait qu\'aujourd\'hui, des milliers de personnes échangent leurs USDT/CFA avec nous.',
    highlightLabel: 'Délai moyen', highlightValue: '~3 minutes', highlightSub: 'Depuis le paiement jusqu\'à la réception',
    ctaText: 'Ouvrir mon compte', ctaUrl: 'https://terangaexchange.com/dashboard',
  },

  // ── Cycle client ─────────────────────────────────────────────────────────
  {
    id: 'welcome', category: 'lifecycle', name: 'Bienvenue', icon: Coins,
    description: 'Nouveaux inscrits — premiers pas',
    subject: 'Bienvenue sur Terex',
    previewText: 'Vos premiers USDT en moins de 3 minutes.',
    heroTitle: 'Bienvenue chez Terex',
    content: 'Merci de nous avoir rejoints. Terex est la façon la plus simple d\'échanger des USDT et des CFA en Afrique de l\'Ouest.\nPour commencer : ouvrez votre tableau de bord, choisissez « Acheter » ou « Vendre », et laissez-vous guider. Votre équipe support est là si besoin.',
    ctaText: 'Faire ma première transaction', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'reactivation', category: 'lifecycle', name: 'Réactivation', icon: Bell,
    description: 'Clients inactifs depuis 30 j+',
    subject: 'On ne vous a pas vu depuis un moment',
    previewText: 'Votre compte Terex est toujours actif.',
    heroTitle: 'Ça fait un moment !',
    content: 'Votre compte Terex est toujours actif et prêt à l\'emploi.\nAcheter ou vendre des USDT prend moins de 3 minutes : choisissez votre montant, payez avec Wave ou Orange Money, et c\'est réglé.\nNotre équipe support répond en moins de 5 minutes si vous avez la moindre question.',
    ctaText: 'Reprendre mes transactions', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'milestone', category: 'lifecycle', name: 'Merci', icon: TrendingUp,
    description: 'Message de remerciement / milestone',
    subject: 'Un grand merci — de la part de Terex',
    previewText: 'Sans vous, Terex ne serait pas là.',
    heroTitle: 'Merci d\'être client Terex',
    content: 'Nous voulions simplement vous dire merci.\nChaque transaction que vous faites sur Terex nous permet de continuer à construire une plateforme d\'échange plus simple, plus rapide, et plus juste pour toute l\'Afrique de l\'Ouest.',
    ctaText: 'Ouvrir Terex', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'megaphone', category: 'lifecycle', name: 'Communiqué', icon: Megaphone,
    description: 'Message général important',
    subject: 'Un mot de l\'équipe Terex',
    previewText: 'Une information importante concernant votre compte.',
    heroTitle: 'Un mot de l\'équipe',
    content: 'Nous voulions vous partager une information importante concernant votre compte Terex.\n[Rédigez ici le contenu du communiqué avant l\'envoi.]',
    ctaText: 'Ouvrir Terex', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
];

interface CampaignRecord {
  id: string; subject: string; segment: string; recipients_count: number;
  success_count: number; error_count: number; status: string; created_at: string;
}

const segmentLabel = (id: string) => SEGMENTS.find(s => s.id === id)?.label || id;

export function NewsletterAdmin() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [content, setContent] = useState('');
  const [highlightLabel, setHighlightLabel] = useState('');
  const [highlightValue, setHighlightValue] = useState('');
  const [highlightSub, setHighlightSub] = useState('');
  const [autoRate, setAutoRate] = useState(false);
  const [ctaText, setCtaText] = useState('Accéder à mon compte');
  const [ctaUrl, setCtaUrl] = useState('https://terangaexchange.com/dashboard');
  const [segment, setSegment] = useState<Segment>('all');
  const [segmentCount, setSegmentCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [history, setHistory] = useState<CampaignRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const filteredTemplates = useMemo(
    () => category === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === category),
    [category],
  );

  const payload = () => ({
    subject: subject.trim(), previewText: previewText.trim(), heroTitle: heroTitle.trim(), content,
    highlightLabel: highlightLabel.trim() || undefined,
    highlightValue: highlightValue.trim() || undefined,
    highlightSub: highlightSub.trim() || undefined,
    autoRate,
    ctaText, ctaUrl, segment,
  });

  // Compteur de destinataires du segment sélectionné
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCountLoading(true);
      setSegmentCount(null);
      try {
        const { data, error } = await supabase.functions.invoke('send-newsletter', {
          body: { mode: 'count', segment, subject: '-' },
        });
        if (!cancelled && !error && data?.success) setSegmentCount(data.count);
      } catch { /* silencieux */ }
      if (!cancelled) setCountLoading(false);
    })();
    return () => { cancelled = true; };
  }, [segment]);

  const loadHistory = async () => {
    const { data } = await (supabase as any)
      .from('email_campaigns')
      .select('id, subject, segment, recipients_count, success_count, error_count, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory((data as CampaignRecord[]) || []);
  };
  useEffect(() => { loadHistory(); }, []);

  const applyTemplate = (t: CampaignTemplate) => {
    setSelectedTemplate(t.id);
    setSubject(t.subject); setPreviewText(t.previewText); setHeroTitle(t.heroTitle);
    setContent(t.content);
    setHighlightLabel(t.highlightLabel || ''); setHighlightValue(t.highlightValue || ''); setHighlightSub(t.highlightSub || '');
    setAutoRate(!!t.useAutoRate);
    setCtaText(t.ctaText); setCtaUrl(t.ctaUrl);
    toast.success(`Modèle « ${t.name} » appliqué`);
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setSubject(''); setPreviewText(''); setHeroTitle(''); setContent('');
    setHighlightLabel(''); setHighlightValue(''); setHighlightSub('');
    setAutoRate(false);
    setCtaText('Accéder à mon compte'); setCtaUrl('https://terangaexchange.com/dashboard');
    setPreviewHtml('');
  };

  const refreshPreview = async () => {
    if (!subject && !heroTitle && !content) { toast.error('Composez d\'abord votre email'); return; }
    setPreviewLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { ...payload(), mode: 'preview' },
      });
      if (error) throw error;
      setPreviewHtml(data?.html || '');
    } catch (e: any) {
      toast.error(e.message || 'Aperçu impossible');
    } finally {
      setPreviewLoading(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail) { toast.error('Entrez un email de test'); return; }
    if (!subject.trim() || !content.trim()) { toast.error('Sujet et message requis'); return; }
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { ...payload(), mode: 'test', testEmail },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec du test');
      toast.success(`Test envoyé à ${testEmail}`);
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors du test');
    } finally {
      setIsTesting(false);
    }
  };

  const sendCampaign = async () => {
    setConfirmOpen(false);
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { ...payload(), mode: 'send' },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec de l\'envoi');
      toast.success(data.message || `Campagne envoyée à ${data.totalSent} destinataires`);
      loadHistory();
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  const isReady = subject.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <style>{drillStyles}</style>
      <PageHeader title="Campagnes" sub="Composez, testez et envoyez vos emails marketing" />

      {/* ══ Modèles avec catégories ═════════════════════════════════════════ */}
      <section style={cardStyle}>
        <div className="flex flex-col gap-4">
          {/* Header + reset */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-white font-semibold text-[15px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9ca3af]" />
                Modèles prêts à l'emploi
              </h3>
              <p className="text-[#6b7280] text-[12px] mt-0.5">
                {TEMPLATES.length} modèles conçus pour couvrir tous vos cas d'usage
              </p>
            </div>
            <Button onClick={resetForm} size="sm" className="text-white hover:opacity-90"
              style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Vider
            </Button>
          </div>

          {/* Tabs catégories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  padding: '7px 14px', borderRadius: '999px',
                  border: `1px solid ${category === c.id ? ACCENT_BORDER : BORDER}`,
                  background: category === c.id ? ACCENT_ROW : 'transparent',
                  color: category === c.id ? '#fff' : '#9ca3af',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', outline: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grille de templates */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredTemplates.map(t => {
              const Icon = t.icon;
              const sel = selectedTemplate === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className="text-left transition-all hover:opacity-95"
                  style={{
                    padding: '16px', borderRadius: '14px',
                    background: sel ? ACCENT_ROW : INPUT_BG,
                    border: `1px solid ${sel ? ACCENT_BORDER : BORDER}`,
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: sel ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    color: sel ? '#fff' : '#9ca3af',
                  }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 className="text-white font-semibold text-[13px] mb-1 truncate">{t.name}</h4>
                    <p className="text-[#6b7280] text-[11px] leading-snug line-clamp-2">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Composer + Aperçu en 2 colonnes ═════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-5">
        {/* ── Composer ────────────────────────────────────────────────────── */}
        <section style={cardStyle}>
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-4 h-4 text-[#9ca3af]" />
            <h3 className="text-white font-semibold text-[15px]">Composer</h3>
            {selectedTemplate && (
              <span className="ml-auto text-[11px] text-[#9ca3af] px-2 py-1 rounded-md" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                Modèle : {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#9ca3af] text-[12px]">Sujet</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder="Sujet de l'email…" className={inputClass} style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#9ca3af] text-[12px]">Texte d'aperçu (sous le sujet, dans la boîte mail)</Label>
              <Input value={previewText} onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Aperçu affiché dans la boîte de réception…" className={inputClass} style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#9ca3af] text-[12px]">Titre principal</Label>
              <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Grand titre de l'email…" className={inputClass} style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#9ca3af] text-[12px]">Message (un paragraphe par ligne)</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={'Premier paragraphe…\nDeuxième paragraphe…'}
                className={`resize-none ${inputClass}`} style={inputStyle} rows={7} />
            </div>

            {/* Bloc mis en avant */}
            <div className="space-y-2">
              <Label className="text-[#9ca3af] text-[12px]">Bloc mis en avant (optionnel)</Label>
              <button type="button" onClick={() => setAutoRate(!autoRate)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:opacity-90"
                style={{
                  background: autoRate ? ACCENT_ROW : INPUT_BG,
                  border: `1px solid ${autoRate ? ACCENT_BORDER : BORDER}`,
                }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: autoRate ? '#fff' : 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}>
                  {autoRate && <CheckCircle2 className="w-4 h-4" style={{ color: '#141414' }} />}
                </div>
                <div>
                  <p className="text-white text-[13px] font-medium">Taux du jour automatique</p>
                  <p className="text-[#6b7280] text-[11px]">Le taux USDT/CFA en direct est inséré au moment de l'envoi.</p>
                </div>
              </button>
              {!autoRate && (
                <div className="grid grid-cols-3 gap-3">
                  <Input value={highlightLabel} onChange={(e) => setHighlightLabel(e.target.value)}
                    placeholder="Libellé" className={inputClass} style={inputStyle} />
                  <Input value={highlightValue} onChange={(e) => setHighlightValue(e.target.value)}
                    placeholder="Valeur" className={inputClass} style={inputStyle} />
                  <Input value={highlightSub} onChange={(e) => setHighlightSub(e.target.value)}
                    placeholder="Sous-texte" className={inputClass} style={inputStyle} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[#9ca3af] text-[12px]">Bouton</Label>
                <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9ca3af] text-[12px]">URL</Label>
                <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Audience */}
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#9ca3af]" />
              <h4 className="text-white font-semibold text-[13px]">Audience</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map(({ id, label, desc, Icon }) => (
                <button key={id} onClick={() => setSegment(id)}
                  className="p-3 rounded-xl text-left transition-all hover:opacity-90"
                  style={{
                    background: segment === id ? ACCENT_ROW : INPUT_BG,
                    border: `1px solid ${segment === id ? ACCENT_BORDER : BORDER}`,
                  }}>
                  <Icon className={`w-4 h-4 mb-2 ${segment === id ? 'text-white' : 'text-[#9ca3af]'}`} />
                  <p className="text-white text-[13px] font-semibold">{label}</p>
                  <p className="text-[#6b7280] text-[11px]">{desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: '#9ca3af' }}>
              {countLoading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Calcul…</>
                : segmentCount !== null
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> <span className="text-white font-semibold">{segmentCount}</span> destinataire(s) · désabonnés exclus</>
                  : <><AlertCircle className="w-3.5 h-3.5" /> Nombre indisponible</>}
            </div>
          </div>

          {/* Envoi */}
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-[#9ca3af]" />
              <h4 className="text-white font-semibold text-[13px]">Envoyer</h4>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Email de test…" className={`flex-1 ${inputClass}`} style={inputStyle} />
                <Button onClick={sendTest} disabled={isTesting || !testEmail || !isReady}
                  className="text-white hover:opacity-90" style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><TestTube className="w-4 h-4 mr-2" /> Tester</>}
                </Button>
              </div>
              <Button onClick={() => setConfirmOpen(true)} disabled={isSending || !isReady}
                className="w-full font-semibold hover:opacity-90" style={{ background: '#fff', color: '#141414' }}>
                {isSending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours…</>
                  : <><Send className="w-4 h-4 mr-2" /> Envoyer à « {segmentLabel(segment)} »{segmentCount !== null ? ` · ${segmentCount}` : ''}</>}
              </Button>
            </div>
          </div>
        </section>

        {/* ── Aperçu ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <section style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#9ca3af]" />
                <h3 className="text-white font-semibold text-[15px]">Aperçu réel</h3>
              </div>
              <Button onClick={refreshPreview} size="sm" disabled={previewLoading}
                className="text-white hover:opacity-90" style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
                {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Actualiser</>}
              </Button>
            </div>
            {previewHtml ? (
              <iframe title="Aperçu email" srcDoc={previewHtml} sandbox=""
                className="w-full rounded-lg" style={{ height: 620, border: `1px solid ${BORDER}`, background: '#141414' }} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center rounded-lg"
                style={{ height: 320, border: `1px dashed ${BORDER}` }}>
                <Eye className="w-6 h-6 mb-2" style={{ color: '#4b5563' }} />
                <p className="text-[#6b7280] text-[13px]">Cliquez sur « Actualiser » pour voir le rendu<br />exact de l'email (celui que recevra le client).</p>
              </div>
            )}
          </section>

          {/* Historique repliable */}
          <section style={cardStyle}>
            <button
              onClick={() => setHistoryOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', outline: 'none', color: '#fff' }}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#9ca3af]" />
                <h3 className="text-white font-semibold text-[15px]">Dernières campagnes</h3>
                {history.length > 0 && (
                  <span className="ml-1 text-[11px] text-[#9ca3af] px-2 py-0.5 rounded-md" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                    {history.length}
                  </span>
                )}
              </div>
              <ChevronRight
                className="w-4 h-4 text-[#9ca3af]"
                style={{ transition: 'transform 0.15s', transform: historyOpen ? 'rotate(90deg)' : 'none' }}
              />
            </button>
            {historyOpen && (
              <div className="mt-4">
                {history.length === 0 ? (
                  <p className="text-[#6b7280] text-[13px]">Aucune campagne envoyée pour le moment.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {history.map(c => (
                      <div key={c.id} className="p-3 rounded-xl" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-white text-[13px] font-medium truncate">{c.subject}</p>
                          <span className="text-[11px] whitespace-nowrap" style={{ color: c.error_count > 0 ? '#cca24f' : '#9ca3af' }}>
                            {c.success_count}/{c.recipients_count} envoyés
                          </span>
                        </div>
                        <p className="text-[#6b7280] text-[11px] mt-1">
                          {segmentLabel(c.segment)} · {new Date(c.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                          {c.error_count > 0 ? ` · ${c.error_count} erreur(s)` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Confirmation d'envoi de masse */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer l'envoi de la campagne</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              « {subject} » sera envoyé à <strong className="text-white">{segmentCount ?? '…'} destinataire(s)</strong> du
              segment « {segmentLabel(segment)} ». Cette action est immédiate et irréversible.
              Pensez à faire un envoi test d'abord.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2d2d2d] border-[rgba(255,255,255,0.07)] text-white hover:bg-[#2d2d2d]">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={sendCampaign} className="bg-white text-[#141414] hover:bg-white/90">
              Envoyer maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
