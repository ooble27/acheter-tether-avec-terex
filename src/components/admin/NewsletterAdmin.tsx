/**
 * Campagnes email — page à vues multiples (fini le scroll infini).
 *
 * 3 vues indépendantes :
 *   1. Galerie   — landing : 16 modèles catégorisés + bouton "Nouveau vierge".
 *   2. Composer  — plein écran, split composer / aperçu, bouton retour.
 *   3. Historique — liste compacte des dernières campagnes envoyées.
 */
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
  ArrowLeft, Plus, LayoutGrid, ChevronRight, Pencil, ShieldAlert,
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

// ── Segments ─────────────────────────────────────────────────────────────
type Segment = 'all' | 'active_clients' | 'never_ordered' | 'inactive_30d' | 'unconfirmed';
const SEGMENTS: { id: Segment; label: string; desc: string; Icon: any }[] = [
  { id: 'all',            label: 'Tous les clients', desc: 'Tous les comptes confirmés',       Icon: Users },
  { id: 'active_clients', label: 'Clients actifs',    desc: 'Ont déjà passé une commande',     Icon: UserCheck },
  { id: 'never_ordered',  label: 'Jamais commandé',   desc: 'Inscrits sans commande',          Icon: UserX },
  { id: 'inactive_30d',   label: 'Inactifs 30 j',      desc: 'Aucune commande depuis 30 jours', Icon: Moon },
  { id: 'unconfirmed',    label: 'Non confirmés',     desc: 'Email non vérifié',                Icon: ShieldAlert },
];

// ── Templates ────────────────────────────────────────────────────────────
type Category = 'promo' | 'product' | 'education' | 'lifecycle';
const CATEGORIES: { id: Category | 'all'; label: string; color: string }[] = [
  { id: 'all',       label: 'Tous',        color: '#fff' },
  { id: 'promo',     label: 'Promos',      color: '#fbbf24' },
  { id: 'product',   label: 'Produit',     color: '#60a5fa' },
  { id: 'education', label: 'Éducation',   color: '#a78bfa' },
  { id: 'lifecycle', label: 'Cycle client', color: '#34d399' },
];

interface CampaignTemplate {
  id: string; category: Category; name: string; icon: any; description: string;
  subject: string; previewText: string; heroTitle: string; content: string;
  highlightLabel?: string; highlightValue?: string; highlightSub?: string;
  ctaText: string; ctaUrl: string;
  useAutoRate?: boolean;
}

const TEMPLATES: CampaignTemplate[] = [
  // Promos
  { id: 'rate', category: 'promo', name: 'Taux du jour', icon: Sparkles,
    description: 'Le taux USDT/CFA du moment mis en avant',
    subject: 'Le taux du jour est disponible sur Terex',
    previewText: 'Consultez le taux USDT/CFA à jour et lancez votre transaction en 3 minutes.',
    heroTitle: 'Le taux du jour vous attend',
    content: 'Le taux USDT/CFA du moment est mis à jour en temps réel sur votre tableau de bord.\nAchetez ou vendez vos USDT en quelques minutes, avec Wave ou Orange Money, et recevez vos fonds rapidement.',
    highlightLabel: 'Taux du jour', highlightValue: '585 CFA / USDT', highlightSub: 'Achat & vente · temps réel',
    ctaText: 'Voir le taux', ctaUrl: 'https://terangaexchange.com/dashboard', useAutoRate: true },
  { id: 'weekend', category: 'promo', name: 'Boost Weekend', icon: PartyPopper,
    description: 'Message positif pour animer le weekend',
    subject: 'Le weekend commence, votre USDT aussi',
    previewText: 'Wave et Orange Money ouverts 24/7 — vos transactions ne s\'arrêtent pas.',
    heroTitle: 'Le weekend est votre allié',
    content: 'Contrairement aux banques classiques, Terex reste ouvert 7 jours sur 7.\nVos transactions USDT/CFA se font aussi bien un samedi soir qu\'un mardi matin — même délai de ~3 minutes.',
    highlightLabel: 'Ouvert', highlightValue: '7 j / 7', highlightSub: 'Wave · Orange Money · toutes chaînes',
    ctaText: 'Ouvrir une transaction', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'flash', category: 'promo', name: 'Flash 24 h', icon: Zap,
    description: 'Message court à forte urgence',
    subject: 'Aujourd\'hui seulement — offre Terex',
    previewText: 'Une opportunité à saisir dans les 24 prochaines heures.',
    heroTitle: '24 heures pour en profiter',
    content: 'Nous mettons en avant une opération spéciale valable jusqu\'à demain soir.\nSi vous prévoyiez d\'acheter ou vendre des USDT cette semaine, c\'est le bon moment.',
    highlightLabel: 'Validité', highlightValue: '24 heures', highlightSub: 'Fin ce soir minuit',
    ctaText: 'En profiter maintenant', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'referral_push', category: 'promo', name: 'Parrainage', icon: Gift,
    description: 'Incite au parrainage d\'amis',
    subject: 'Invitez un ami sur Terex',
    previewText: 'Faites découvrir la façon la plus simple d\'échanger USDT et CFA.',
    heroTitle: 'Un ami qui pourrait profiter de Terex ?',
    content: 'Vous connaissez quelqu\'un qui échange régulièrement des cryptos ou reçoit des fonds internationaux ?\nEnvoyez-lui votre lien Terex : il découvre une plateforme sécurisée, un taux transparent et un support en français, 24/7.',
    ctaText: 'Copier mon lien de parrainage', ctaUrl: 'https://terangaexchange.com/referral' },
  // Produit
  { id: 'updates', category: 'product', name: 'Nouveautés', icon: Newspaper,
    description: 'Récap des dernières améliorations',
    subject: 'Ce mois-ci sur Terex',
    previewText: 'Découvrez les dernières améliorations de la plateforme.',
    heroTitle: 'Ce qui a changé sur Terex',
    content: 'Nous avons travaillé dur ces dernières semaines pour rendre vos échanges plus fluides.\nAdresses USDT enregistrées, numéros Wave/Orange sauvegardés, sélecteur de réseau redesigné : tout ce qui vous fait gagner du temps à chaque commande.',
    ctaText: 'Découvrir les nouveautés', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'new_network', category: 'product', name: 'Nouveau réseau', icon: Network,
    description: 'Annonce l\'ajout d\'un réseau blockchain',
    subject: 'Un nouveau réseau blockchain arrive sur Terex',
    previewText: 'Recevez vos USDT sur encore plus de chaînes.',
    heroTitle: 'Un réseau de plus, la même simplicité',
    content: 'Terex prend désormais en charge un nouveau réseau blockchain pour l\'envoi et la réception d\'USDT.\nAucun changement dans votre parcours : sélectionnez le réseau à la deuxième étape de votre commande et Terex fait le reste.',
    highlightLabel: 'Réseaux supportés', highlightValue: '7', highlightSub: 'Tron · BNB · Ethereum · Polygon · Solana · Aptos · Binance',
    ctaText: 'Essayer le nouveau réseau', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'feature_launch', category: 'product', name: 'Lancement', icon: Rocket,
    description: 'Grosse annonce produit',
    subject: 'Nouveau sur Terex',
    previewText: 'Une fonctionnalité conçue pour vous faire gagner du temps.',
    heroTitle: 'Une nouveauté à découvrir',
    content: 'Nous venons de lancer une nouvelle fonctionnalité sur Terex.\nElle est disponible dès aujourd\'hui pour tous les comptes vérifiés, sans surcoût. Ouvrez votre tableau de bord pour la découvrir.',
    ctaText: 'Voir la nouveauté', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'maintenance', category: 'product', name: 'Maintenance', icon: Wrench,
    description: 'Annonce d\'une intervention planifiée',
    subject: 'Maintenance planifiée sur Terex',
    previewText: 'Courte interruption prévue pour améliorer la plateforme.',
    heroTitle: 'Maintenance planifiée',
    content: 'Une courte fenêtre de maintenance est prévue pour améliorer les performances de Terex.\nLa plateforme sera indisponible pendant quelques minutes. Les commandes en cours ne sont pas impactées et reprennent normalement à la fin de l\'opération.',
    highlightLabel: 'Fenêtre', highlightValue: 'Ce soir · 23 h – 23 h 30', highlightSub: 'Heure UTC',
    ctaText: 'En savoir plus', ctaUrl: 'https://terangaexchange.com/status' },
  // Éducation
  { id: 'security', category: 'education', name: 'Sécurité', icon: Shield,
    description: 'Rappels sécurité — anti-arnaque',
    subject: 'Protégez votre compte Terex',
    previewText: '3 gestes simples pour rester en sécurité.',
    heroTitle: 'Votre sécurité, notre priorité',
    content: 'Terex ne vous demandera jamais votre mot de passe ni votre clé privée par email ou WhatsApp.\nSi quelqu\'un se présente comme membre de notre équipe et vous demande ces informations, c\'est une arnaque.\nEn cas de doute, écrivez-nous à terangaexchange@gmail.com pour vérifier.',
    ctaText: 'Voir nos conseils sécurité', ctaUrl: 'https://terangaexchange.com/security-policy' },
  { id: 'tips', category: 'education', name: 'Astuce du jour', icon: BookOpen,
    description: 'Petit conseil pratique',
    subject: 'Astuce Terex : gagnez du temps sur vos commandes',
    previewText: 'Un raccourci utile pour vos prochains achats.',
    heroTitle: 'Astuce · gagnez du temps',
    content: 'Depuis le nouveau tableau de bord, vous pouvez enregistrer vos adresses USDT et vos numéros Wave / Orange Money.\nÀ votre prochaine commande, sélectionnez-les en un clic — plus besoin de retaper ni de risquer une faute de frappe.',
    ctaText: 'Configurer mon carnet', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'why_terex', category: 'education', name: 'Pourquoi Terex', icon: HeartHandshake,
    description: 'Argumentaire de confiance',
    subject: 'Pourquoi les clients choisissent Terex',
    previewText: 'Rapidité, sécurité, support 24/7 : nos garanties.',
    heroTitle: 'Ce qui fait la différence',
    content: 'Terex traite vos commandes en environ 3 minutes, avec un support humain joignable 24 h/24.\nChaque compte est vérifié par KYC et chaque transaction est visible dans votre historique en temps réel.\nC\'est cette simplicité qui fait qu\'aujourd\'hui, des milliers de personnes échangent leurs USDT/CFA avec nous.',
    highlightLabel: 'Délai moyen', highlightValue: '~3 minutes', highlightSub: 'Depuis le paiement jusqu\'à la réception',
    ctaText: 'Ouvrir mon compte', ctaUrl: 'https://terangaexchange.com/dashboard' },
  // Cycle client
  { id: 'welcome', category: 'lifecycle', name: 'Bienvenue', icon: Coins,
    description: 'Nouveaux inscrits — premiers pas',
    subject: 'Bienvenue sur Terex',
    previewText: 'Vos premiers USDT en moins de 3 minutes.',
    heroTitle: 'Bienvenue chez Terex',
    content: 'Merci de nous avoir rejoints. Terex est la façon la plus simple d\'échanger des USDT et des CFA en Afrique de l\'Ouest.\nPour commencer : ouvrez votre tableau de bord, choisissez « Acheter » ou « Vendre », et laissez-vous guider. Votre équipe support est là si besoin.',
    ctaText: 'Faire ma première transaction', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'reactivation', category: 'lifecycle', name: 'Réactivation', icon: Bell,
    description: 'Clients inactifs depuis 30 j+',
    subject: 'On ne vous a pas vu depuis un moment',
    previewText: 'Votre compte Terex est toujours actif.',
    heroTitle: 'Ça fait un moment !',
    content: 'Votre compte Terex est toujours actif et prêt à l\'emploi.\nAcheter ou vendre des USDT prend moins de 3 minutes : choisissez votre montant, payez avec Wave ou Orange Money, et c\'est réglé.\nNotre équipe support répond en moins de 5 minutes si vous avez la moindre question.',
    ctaText: 'Reprendre mes transactions', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'milestone', category: 'lifecycle', name: 'Merci', icon: TrendingUp,
    description: 'Message de remerciement / milestone',
    subject: 'Un grand merci — de la part de Terex',
    previewText: 'Sans vous, Terex ne serait pas là.',
    heroTitle: 'Merci d\'être client Terex',
    content: 'Nous voulions simplement vous dire merci.\nChaque transaction que vous faites sur Terex nous permet de continuer à construire une plateforme d\'échange plus simple, plus rapide, et plus juste pour toute l\'Afrique de l\'Ouest.',
    ctaText: 'Ouvrir Terex', ctaUrl: 'https://terangaexchange.com/dashboard' },
  { id: 'megaphone', category: 'lifecycle', name: 'Communiqué', icon: Megaphone,
    description: 'Message général important',
    subject: 'Un mot de l\'équipe Terex',
    previewText: 'Une information importante concernant votre compte.',
    heroTitle: 'Un mot de l\'équipe',
    content: 'Nous voulions vous partager une information importante concernant votre compte Terex.\n[Rédigez ici le contenu du communiqué avant l\'envoi.]',
    ctaText: 'Ouvrir Terex', ctaUrl: 'https://terangaexchange.com/dashboard' },
];

const catColor = (c: Category) => CATEGORIES.find(x => x.id === c)?.color || '#fff';

interface CampaignRecord {
  id: string; subject: string; segment: string; recipients_count: number;
  success_count: number; error_count: number; status: string; created_at: string;
}
const segmentLabel = (id: string) => SEGMENTS.find(s => s.id === id)?.label || id;

type View = 'gallery' | 'composer' | 'history';

export function NewsletterAdmin() {
  const [view, setView] = useState<View>('gallery');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // ── Composer state ─────────────────────────────────────────────────────
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

  const filteredTemplates = useMemo(
    () => category === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === category),
    [category],
  );

  const payload = () => ({
    subject: subject.trim(), previewText: previewText.trim(), heroTitle: heroTitle.trim(), content,
    highlightLabel: highlightLabel.trim() || undefined,
    highlightValue: highlightValue.trim() || undefined,
    highlightSub: highlightSub.trim() || undefined,
    autoRate, ctaText, ctaUrl, segment,
  });

  // Compteur audience
  useEffect(() => {
    if (view !== 'composer') return;
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
  }, [segment, view]);

  const loadHistory = async () => {
    const { data } = await (supabase as any)
      .from('email_campaigns')
      .select('id, subject, segment, recipients_count, success_count, error_count, status, created_at')
      .order('created_at', { ascending: false })
      .limit(30);
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
    setPreviewHtml('');
    setView('composer');
  };

  const startBlank = () => {
    setSelectedTemplate(null);
    setSubject(''); setPreviewText(''); setHeroTitle(''); setContent('');
    setHighlightLabel(''); setHighlightValue(''); setHighlightSub('');
    setAutoRate(false);
    setCtaText('Accéder à mon compte'); setCtaUrl('https://terangaexchange.com/dashboard');
    setPreviewHtml('');
    setView('composer');
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
      setView('history');
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  const isReady = subject.trim().length > 0 && content.trim().length > 0;
  const selectedTpl = selectedTemplate ? TEMPLATES.find(t => t.id === selectedTemplate) : null;

  return (
    <div className="flex flex-col gap-5">
      <style>{drillStyles}</style>
      <PageHeader title="Campagnes" sub="Composez, testez et envoyez vos emails marketing" />

      {/* ── Nav vues (sous-tabs — MÊME style que la nav du haut : rounded 12) */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'gallery',  label: 'Modèles',    Icon: LayoutGrid },
          { id: 'composer', label: 'Composer',   Icon: Pencil },
          { id: 'history',  label: `Historique${history.length ? ` (${history.length})` : ''}`, Icon: History },
        ].map(({ id, label, Icon }) => {
          const sel = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id as View)}
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

      {view === 'gallery' && (
        <GalleryView
          category={category}
          onCategoryChange={setCategory}
          templates={filteredTemplates}
          selectedId={selectedTemplate}
          onPickTemplate={applyTemplate}
          onStartBlank={startBlank}
        />
      )}

      {view === 'composer' && (
        <ComposerView
          selectedTpl={selectedTpl}
          onBack={() => setView('gallery')}
          subject={subject} setSubject={setSubject}
          previewText={previewText} setPreviewText={setPreviewText}
          heroTitle={heroTitle} setHeroTitle={setHeroTitle}
          content={content} setContent={setContent}
          highlightLabel={highlightLabel} setHighlightLabel={setHighlightLabel}
          highlightValue={highlightValue} setHighlightValue={setHighlightValue}
          highlightSub={highlightSub} setHighlightSub={setHighlightSub}
          autoRate={autoRate} setAutoRate={setAutoRate}
          ctaText={ctaText} setCtaText={setCtaText}
          ctaUrl={ctaUrl} setCtaUrl={setCtaUrl}
          segment={segment} setSegment={setSegment}
          segmentCount={segmentCount} countLoading={countLoading}
          testEmail={testEmail} setTestEmail={setTestEmail}
          isTesting={isTesting} isSending={isSending}
          previewHtml={previewHtml} previewLoading={previewLoading}
          isReady={isReady}
          onRefreshPreview={refreshPreview}
          onSendTest={sendTest}
          onSendCampaign={() => setConfirmOpen(true)}
        />
      )}

      {view === 'history' && (
        <HistoryView history={history} onReload={loadHistory} />
      )}

      {/* Confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer l'envoi</AlertDialogTitle>
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

// ── Vue Galerie ──────────────────────────────────────────────────────────
interface GalleryProps {
  category: Category | 'all'; onCategoryChange: (c: Category | 'all') => void;
  templates: CampaignTemplate[]; selectedId: string | null;
  onPickTemplate: (t: CampaignTemplate) => void; onStartBlank: () => void;
}

function GalleryView({ category, onCategoryChange, templates, selectedId, onPickTemplate, onStartBlank }: GalleryProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header + filtres catégories + CTA vierge */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              style={{
                padding: '8px 14px', borderRadius: 12,
                border: `1px solid ${category === c.id ? '#ffffff' : BORDER}`,
                background: category === c.id ? '#ffffff' : CARD,
                color: category === c.id ? '#141414' : '#9ca3af',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          onClick={onStartBlank}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 12,
            border: `1px dashed rgba(255,255,255,0.20)`,
            background: 'transparent', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none',
          }}
        >
          <Plus size={13} /> Composer vierge
        </button>
      </div>

      {/* Grille — chaque carte = mini aperçu de l'email (comme un template picker Figma) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <TemplateCard key={t.id} t={t} selected={selectedId === t.id} onPick={() => onPickTemplate(t)} />
        ))}
      </div>
    </div>
  );
}

/**
 * Carte modèle avec MINI APERÇU de l'email intégré (fond blanc, comme un
 * template picker Figma/Notion). Plus visuel qu'une simple icône.
 */
function TemplateCard({ t, selected, onPick }: { t: CampaignTemplate; selected: boolean; onPick: () => void }) {
  const Icon = t.icon;
  return (
    <button
      onClick={onPick}
      className="text-left transition-all group"
      style={{
        padding: 0, borderRadius: 18, overflow: 'hidden',
        background: CARD,
        border: `1px solid ${selected ? 'rgba(255,255,255,0.35)' : BORDER}`,
        display: 'flex', flexDirection: 'column',
        outline: 'none', cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = selected ? 'rgba(255,255,255,0.35)' : BORDER; }}
    >
      {/* Mini aperçu email (fond blanc/gris comme un vrai mail) */}
      <div style={{
        background: '#f6f6f4', padding: '16px 18px 14px',
        borderBottom: `1px solid ${BORDER}`, minHeight: 168,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111', fontWeight: 500 }}>
          Terex
        </div>
        <div style={{ height: 1, background: '#ececea' }} />
        <div style={{
          fontSize: 10.5, color: '#8a8a86', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500,
        }}>
          {(t.category === 'promo' ? 'Promo' : t.category === 'product' ? 'Produit' : t.category === 'education' ? 'Éducation' : 'Cycle client')}
        </div>
        <div style={{ fontSize: 15, color: '#111', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          {t.heroTitle}
        </div>
        <div style={{ fontSize: 11, color: '#4a4a47', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {t.content.split('\n')[0]}
        </div>
        {t.highlightValue && (
          <div style={{ background: '#fff', border: `1px solid #ececea`, borderRadius: 8, padding: '8px 10px', marginTop: 'auto' }}>
            <div style={{ fontSize: 9, color: '#8a8a86', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              {t.highlightLabel}
            </div>
            <div style={{ fontSize: 14, color: '#111', fontWeight: 600, marginTop: 2 }}>
              {t.highlightValue}
            </div>
          </div>
        )}
        <div style={{ marginTop: t.highlightValue ? 0 : 'auto', display: 'flex' }}>
          <div style={{ background: '#111', color: '#fff', fontSize: 10.5,
            padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}>
            {t.ctaText}
          </div>
        </div>
      </div>

      {/* Footer : nom + description */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.06)',
          color: '#fff', flexShrink: 0,
        }}>
          <Icon size={16} strokeWidth={1.7} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="text-white font-semibold text-[13.5px] truncate">{t.name}</div>
          <div className="text-[#6b7280] text-[11px] leading-snug truncate">{t.description}</div>
        </div>
        <ChevronRight size={14} color="#4b5563" style={{ flexShrink: 0 }} />
      </div>
    </button>
  );
}

// ── Vue Composer ─────────────────────────────────────────────────────────
interface ComposerProps {
  selectedTpl: CampaignTemplate | null | undefined; onBack: () => void;
  subject: string; setSubject: (v: string) => void;
  previewText: string; setPreviewText: (v: string) => void;
  heroTitle: string; setHeroTitle: (v: string) => void;
  content: string; setContent: (v: string) => void;
  highlightLabel: string; setHighlightLabel: (v: string) => void;
  highlightValue: string; setHighlightValue: (v: string) => void;
  highlightSub: string; setHighlightSub: (v: string) => void;
  autoRate: boolean; setAutoRate: (v: boolean) => void;
  ctaText: string; setCtaText: (v: string) => void;
  ctaUrl: string; setCtaUrl: (v: string) => void;
  segment: Segment; setSegment: (v: Segment) => void;
  segmentCount: number | null; countLoading: boolean;
  testEmail: string; setTestEmail: (v: string) => void;
  isTesting: boolean; isSending: boolean;
  previewHtml: string; previewLoading: boolean;
  isReady: boolean;
  onRefreshPreview: () => void;
  onSendTest: () => void;
  onSendCampaign: () => void;
}

function ComposerView(p: ComposerProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header — bouton retour + badge modèle + actions rapides */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={p.onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 12,
              background: CARD, border: `1px solid ${BORDER}`,
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', outline: 'none',
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} /> Retour
          </button>
          {p.selectedTpl && (
            <span className="text-[#9ca3af] text-[12px]">
              Basé sur <strong className="text-white">« {p.selectedTpl.name} »</strong>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={p.onRefreshPreview} disabled={p.previewLoading}
            size="sm" className="text-white hover:opacity-90"
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            {p.previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Aperçu réel</>}
          </Button>
        </div>
      </div>

      {/* WYSIWYG : l'aperçu email EST l'éditeur.
          À gauche : rendu email fond clair, chaque bloc éditable au clic (contentEditable).
          À droite : panneau de contrôle compact (audience + envoi + IA).
          Aperçu réel (iframe rendue par l'edge function) toggle-able. */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* ═══ Canvas WYSIWYG à gauche ═══ */}
        <div>
          {/* Le canvas WYSIWYG est TOUJOURS visible. Le "Aperçu réel"
              apparaît juste au-dessus quand il est chargé. */}
          {p.previewHtml && (
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div className="flex items-center justify-between mb-3">
                <SectionTitle icon={Eye} label="Rendu final chez le client" />
              </div>
              <iframe title="Aperçu email" srcDoc={p.previewHtml} sandbox=""
                className="w-full rounded-xl"
                style={{ height: 500, border: `1px solid ${BORDER}`, background: '#141414' }} />
            </div>
          )}
          <WysiwygCanvas p={p} />
        </div>

        {/* ═══ Panneau contrôle à droite (sticky) ═══ */}
        <div className="flex flex-col gap-4" style={{ position: 'sticky', top: 16 }}>
          {/* Audience */}
          <section style={cardStyle}>
            <SectionTitle icon={Users} label="Audience" />
            <div className="grid grid-cols-2 gap-2 mt-3">
              {SEGMENTS.map(({ id, label, desc, Icon }) => (
                <button key={id} onClick={() => p.setSegment(id)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: p.segment === id ? '#252525' : INPUT_BG,
                    border: `1px solid ${p.segment === id ? 'rgba(255,255,255,0.20)' : BORDER}`,
                  }}>
                  <Icon className={`w-4 h-4 mb-1.5 ${p.segment === id ? 'text-white' : 'text-[#9ca3af]'}`} />
                  <p className="text-white text-[12px] font-semibold">{label}</p>
                  <p className="text-[#6b7280] text-[10.5px]">{desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[12px]" style={{ color: '#9ca3af' }}>
              {p.countLoading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Calcul…</>
                : p.segmentCount !== null
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> <span className="text-white font-semibold">{p.segmentCount}</span> destinataire(s)</>
                  : <><AlertCircle className="w-3.5 h-3.5" /> Nombre indisponible</>}
            </div>
            {p.segment === 'unconfirmed' && (
              <VerificationPanel count={p.segmentCount} />
            )}
          </section>

          {/* Envoi */}
          <section style={{ ...cardStyle, background: '#181818' }}>
            <SectionTitle icon={Send} label="Envoyer" />
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex gap-2">
                <Input type="email" value={p.testEmail} onChange={e => p.setTestEmail(e.target.value)}
                  placeholder="Email de test…" className={`flex-1 ${inputClass}`}
                  style={{ ...inputStyle, fontSize: 12 }} />
                <Button onClick={p.onSendTest} disabled={p.isTesting || !p.testEmail || !p.isReady}
                  className="text-white hover:opacity-90" size="sm"
                  style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
                  {p.isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><TestTube className="w-3.5 h-3.5 mr-1" />Test</>}
                </Button>
              </div>
              <Button onClick={p.onSendCampaign} disabled={p.isSending || !p.isReady}
                className="w-full font-semibold hover:opacity-90"
                style={{ background: '#fff', color: '#141414', height: 44, fontSize: 13 }}>
                {p.isSending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</>
                  : <><Send className="w-4 h-4 mr-2" /> Envoyer à {p.segmentCount ?? 0}</>}
              </Button>
              <p className="text-[10.5px] text-[#6b7280] leading-relaxed">
                Clic sur « Aperçu réel » en haut pour voir le rendu exact avant d'envoyer.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * Canvas WYSIWYG — le mail est rendu en fond clair (comme il apparaîtra
 * chez le client) et chaque bloc est éditable en place (contentEditable).
 * Bien plus lisible qu'un formulaire de champs empilés.
 */
function WysiwygCanvas({ p }: { p: ComposerProps }) {
  const paragraphs = p.content.split('\n').filter(Boolean);
  return (
    <div style={{
      background: '#f6f6f4', borderRadius: 20, padding: 24,
      border: `1px solid ${BORDER}`,
    }}>
      {/* Sujet + preview text — au-dessus de la carte mail, comme dans une boîte de réception */}
      <div style={{ marginBottom: 16, paddingLeft: 4 }}>
        <label className="block text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: '#8a8a86' }}>Sujet</label>
        <input
          value={p.subject} onChange={e => p.setSubject(e.target.value)}
          placeholder="Sujet de l'email…"
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            color: '#111', fontSize: 15, fontWeight: 600, padding: '4px 0',
          }}
        />
        <input
          value={p.previewText} onChange={e => p.setPreviewText(e.target.value)}
          placeholder="Petit texte d'aperçu affiché sous le sujet dans la boîte…"
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            color: '#6b6b68', fontSize: 12, padding: '2px 0 0',
          }}
        />
      </div>

      {/* Carte email — le vrai design */}
      <div style={{
        background: '#fff', borderRadius: 14,
        boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08)',
        overflow: 'hidden', color: '#111',
      }}>
        {/* Header brand */}
        <div style={{ padding: '22px 28px 12px' }}>
          <span style={{
            fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#111', fontWeight: 500,
          }}>Terex</span>
        </div>

        {/* Body */}
        <div style={{ padding: '4px 28px 28px', fontSize: 15 }}>
          {/* Hero title éditable */}
          <textarea
            value={p.heroTitle}
            onChange={e => { p.setHeroTitle(e.target.value); autosize(e.target); }}
            onFocus={e => autosize(e.target)}
            placeholder="Grand titre de l'email…"
            rows={1}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              color: '#111', fontSize: 22, fontWeight: 500,
              margin: '0 0 12px', letterSpacing: '-0.01em', lineHeight: 1.3,
              resize: 'none', padding: 0, fontFamily: 'inherit',
            }}
          />

          <p style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 500, color: '#111' }}>
            Bonjour {'{{prenom}}'},
          </p>

          {/* Body message éditable en textarea */}
          <textarea
            value={p.content}
            onChange={e => { p.setContent(e.target.value); autosize(e.target, 100); }}
            onFocus={e => autosize(e.target, 100)}
            placeholder={'Rédigez votre message ici.\n\nUn paragraphe par ligne vide.'}
            rows={5}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              color: '#4a4a47', fontSize: 15, lineHeight: 1.6,
              margin: '0 0 14px', resize: 'none', padding: 0, fontFamily: 'inherit',
            }}
          />

          {/* Highlight block — mode auto-rate ou fields éditables */}
          <div style={{
            margin: '8px 0 20px', background: '#f6f6f4', borderRadius: 10,
            padding: '22px 18px', textAlign: 'center', position: 'relative',
          }}>
            {/* Toggle auto-rate en coin */}
            <button type="button" onClick={() => p.setAutoRate(!p.autoRate)}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: p.autoRate ? '#111' : '#fff',
                color: p.autoRate ? '#fff' : '#111',
                border: `1px solid ${p.autoRate ? '#111' : '#ececea'}`,
                borderRadius: 6, padding: '3px 8px',
                fontSize: 9.5, fontWeight: 600, cursor: 'pointer', outline: 'none',
              }}>
              {p.autoRate ? '● Taux auto ON' : '○ Taux auto'}
            </button>

            {p.autoRate ? (
              <>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8a86' }}>Taux du jour</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: '#111', lineHeight: 1 }}>
                  585 CFA / USDT
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#4a4a47' }}>Mis à jour en temps réel</p>
              </>
            ) : (
              <>
                <input value={p.highlightLabel} onChange={e => p.setHighlightLabel(e.target.value)}
                  placeholder="LIBELLÉ (ex : TAUX DU JOUR)"
                  style={{
                    width: '100%', border: 'none', outline: 'none', background: 'transparent',
                    textAlign: 'center', color: '#8a8a86', fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px', padding: 0,
                  }} />
                <input value={p.highlightValue} onChange={e => p.setHighlightValue(e.target.value)}
                  placeholder="Valeur (ex : 585 CFA)"
                  style={{
                    width: '100%', border: 'none', outline: 'none', background: 'transparent',
                    textAlign: 'center', color: '#111', fontSize: 32, fontWeight: 500,
                    letterSpacing: '-0.02em', lineHeight: 1, padding: 0,
                  }} />
                <input value={p.highlightSub} onChange={e => p.setHighlightSub(e.target.value)}
                  placeholder="Sous-texte"
                  style={{
                    width: '100%', border: 'none', outline: 'none', background: 'transparent',
                    textAlign: 'center', color: '#4a4a47', fontSize: 13,
                    margin: '10px 0 0', padding: 0,
                  }} />
              </>
            )}
          </div>

          {/* CTA button éditable */}
          <div style={{ margin: '4px 0 8px', display: 'flex', gap: 12, alignItems: 'stretch' }}>
            <input
              value={p.ctaText} onChange={e => p.setCtaText(e.target.value)}
              placeholder="Texte bouton"
              style={{
                background: '#111', color: '#fff', border: 'none', outline: 'none',
                padding: '12px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                width: 'auto', minWidth: 140, textAlign: 'center',
              }}
            />
            <input
              value={p.ctaUrl} onChange={e => p.setCtaUrl(e.target.value)}
              placeholder="URL du bouton"
              style={{
                flex: 1, background: '#fff', color: '#4a4a47', border: '1px dashed #d0d0cc',
                outline: 'none', padding: '12px 14px', borderRadius: 8,
                fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            />
          </div>
        </div>

        {/* Footer visuel (informatif) */}
        <div style={{ borderTop: '1px solid #ececea', padding: '16px 28px', color: '#4a4a47', fontSize: 12 }}>
          <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111', fontWeight: 500 }}>Terex</div>
          <div style={{ marginTop: 6 }}>terangaexchange@gmail.com · terangaexchange.com</div>
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 11, color: '#6b6b68', textAlign: 'center' }}>
        Cliquez sur n'importe quel champ pour l'éditer. « Aperçu réel » en haut pour voir le rendu exact.
      </p>
    </div>
  );
}

function autosize(el: HTMLTextAreaElement, minHeight = 30) {
  el.style.height = 'auto';
  el.style.height = Math.max(el.scrollHeight, minHeight) + 'px';
}

function SectionTitle({ icon: Icon, label, optional }: { icon: any; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-[#9ca3af]" />
      <h3 className="text-white font-semibold text-[13.5px]">{label}</h3>
      {optional && <span className="text-[#6b7280] text-[11px]">optionnel</span>}
    </div>
  );
}

// ── Panneau relance validation ──────────────────────────────────────────
function VerificationPanel({ count }: { count: number | null }) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; errors: number } | null>(null);

  const sendAll = async () => {
    setSending(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('resend-verification', {
        body: { mode: 'send_all' },
      });
      if (error) throw error;
      if (data?.success) {
        setResult({ sent: data.stats.sent, errors: data.stats.errors });
        toast.success(`${data.stats.sent} email(s) de vérification envoyé(s)`);
      } else {
        throw new Error(data?.error || 'Erreur inconnue');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erreur lors de l\'envoi');
    }
    setSending(false);
  };

  return (
    <div className="mt-3 p-3 rounded-xl" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
      <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">
        Envoyer un email de vérification personnalisé (avec lien de confirmation) aux {count ?? '…'} comptes non confirmés.
      </p>
      <Button onClick={sendAll} disabled={sending || !count}
        size="sm" className="w-full text-[12px] font-semibold hover:opacity-90"
        style={{ background: '#fff', color: '#141414', height: 36 }}>
        {sending
          ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Envoi en cours…</>
          : <><Mail className="w-3.5 h-3.5 mr-1.5" /> Relancer la validation ({count ?? 0})</>}
      </Button>
      {result && (
        <p className="text-[10.5px] mt-2" style={{ color: result.errors > 0 ? '#fbbf24' : '#22c55e' }}>
          {result.sent} envoyé(s){result.errors > 0 ? `, ${result.errors} erreur(s)` : ''}
        </p>
      )}
    </div>
  );
}

// ── Vue Historique ───────────────────────────────────────────────────────
function HistoryView({ history, onReload }: { history: CampaignRecord[]; onReload: () => void }) {
  return (
    <section style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#9ca3af]" />
          <h3 className="text-white font-semibold text-[15px]">Dernières campagnes</h3>
          {history.length > 0 && (
            <span className="ml-1 text-[11px] text-[#9ca3af] px-2 py-0.5 rounded-md"
              style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
              {history.length}
            </span>
          )}
        </div>
        <Button onClick={onReload} size="sm" className="text-white hover:opacity-90"
          style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
          <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
        </Button>
      </div>
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div style={{ width: 48, height: 48, borderRadius: 14, background: INPUT_BG,
            border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <History className="w-5 h-5 text-[#6b7280]" />
          </div>
          <p className="text-white text-[14px] font-medium">Aucune campagne envoyée</p>
          <p className="text-[#6b7280] text-[12px] mt-1">Les campagnes envoyées apparaîtront ici.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map(c => {
            const success = c.error_count === 0;
            return (
              <div key={c.id} className="p-4 rounded-xl transition-colors"
                style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div style={{ width: 8, height: 8, borderRadius: 999,
                      background: success ? '#22c55e' : '#f59e0b' }} />
                    <p className="text-white text-[14px] font-medium truncate">{c.subject}</p>
                  </div>
                  <span className="text-[12px] whitespace-nowrap font-medium"
                    style={{ color: success ? '#22c55e' : '#fbbf24' }}>
                    {c.success_count}/{c.recipients_count} envoyés
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: '#6b7280' }}>
                  <span className="inline-flex items-center gap-1">
                    <Users size={11} /> {segmentLabel(c.segment)}
                  </span>
                  <span>·</span>
                  <span>{new Date(c.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  {c.error_count > 0 && (
                    <>
                      <span>·</span>
                      <span style={{ color: '#f59e0b' }}>{c.error_count} erreur(s)</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
