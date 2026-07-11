import { useEffect, useState } from 'react';
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
  Mail, Send, Eye, Loader2, Users, TestTube, FileText, Gift, Bell,
  Megaphone, RefreshCw, History, UserCheck, UserX, Moon, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const cardStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18,
};
const inputClass = 'text-white placeholder-[#6b7280]';
const inputStyle: React.CSSProperties = {
  background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 12, color: '#fff', outline: 'none',
};

type Segment = 'all' | 'active_clients' | 'never_ordered' | 'inactive_30d';

const SEGMENTS: { id: Segment; label: string; desc: string; Icon: any }[] = [
  { id: 'all', label: 'Tous les clients', desc: 'Tous les comptes confirmés', Icon: Users },
  { id: 'active_clients', label: 'Clients actifs', desc: 'Ont déjà passé une commande', Icon: UserCheck },
  { id: 'never_ordered', label: 'Jamais commandé', desc: 'Inscrits sans commande', Icon: UserX },
  { id: 'inactive_30d', label: 'Inactifs 30 j', desc: 'Aucune commande depuis 30 jours', Icon: Moon },
];

interface CampaignTemplate {
  id: string; name: string; icon: React.ReactNode; description: string;
  subject: string; previewText: string; heroTitle: string; content: string;
  highlightLabel?: string; highlightValue?: string; highlightSub?: string;
  ctaText: string; ctaUrl: string;
}

const TEMPLATES: CampaignTemplate[] = [
  {
    id: 'rate', name: 'Taux du jour', icon: <Gift className="w-5 h-5" />, description: 'Promo sur le taux',
    subject: 'Taux exceptionnel sur Terex aujourd\'hui',
    previewText: 'Profitez de notre meilleur taux USDT/CFA',
    heroTitle: 'Un taux à ne pas manquer',
    content: 'Bonne nouvelle : notre taux USDT/CFA est particulièrement avantageux en ce moment.\nAchetez ou vendez vos USDT en quelques minutes, avec Wave ou Orange Money, et recevez vos fonds rapidement.',
    highlightLabel: 'Taux du jour', highlightValue: '585 CFA / USDT', highlightSub: 'Achat & vente · mis à jour en temps réel',
    ctaText: 'Profiter du taux', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'reactivation', name: 'Réactivation', icon: <Bell className="w-5 h-5" />, description: 'Clients inactifs',
    subject: 'On ne vous a pas vu depuis un moment 👀'.replace(' 👀', ''),
    previewText: 'Votre compte Terex vous attend',
    heroTitle: 'Ça fait un moment !',
    content: 'Votre compte Terex est toujours actif et prêt à l\'emploi.\nAcheter ou vendre des USDT prend moins de 3 minutes : choisissez votre montant, payez avec Wave ou Orange Money, et c\'est réglé.\nNotre équipe support répond en moins de 5 minutes si vous avez la moindre question.',
    ctaText: 'Reprendre mes transactions', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'updates', name: 'Nouveautés', icon: <Megaphone className="w-5 h-5" />, description: 'Nouvelles fonctionnalités',
    subject: 'Du nouveau sur Terex',
    previewText: 'Découvrez les dernières améliorations de la plateforme',
    heroTitle: 'Terex s\'améliore pour vous',
    content: 'Nous avons travaillé dur ces dernières semaines pour améliorer votre expérience.\nTransactions plus rapides, interface repensée, suivi de commande amélioré : tout est pensé pour que vos échanges USDT/CFA soient les plus simples d\'Afrique de l\'Ouest.',
    ctaText: 'Découvrir les nouveautés', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
  {
    id: 'welcome', name: 'Bienvenue', icon: <FileText className="w-5 h-5" />, description: 'Nouveaux inscrits',
    subject: 'Bienvenue chez Terex',
    previewText: 'Vos premiers USDT en moins de 3 minutes',
    heroTitle: 'Bienvenue chez Terex',
    content: 'Merci de nous avoir rejoints ! Terex est la façon la plus simple d\'acheter et vendre des USDT en CFA.\nPour commencer : créez votre première commande, payez avec Wave ou Orange Money, et recevez vos USDT directement sur votre portefeuille.',
    ctaText: 'Faire ma première transaction', ctaUrl: 'https://terangaexchange.com/dashboard',
  },
];

interface CampaignRecord {
  id: string; subject: string; segment: string; recipients_count: number;
  success_count: number; error_count: number; status: string; created_at: string;
}

const segmentLabel = (id: string) => SEGMENTS.find(s => s.id === id)?.label || id;

export function NewsletterAdmin() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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

  // Historique des campagnes
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
    setAutoRate(t.id === 'rate'); // le modèle « Taux du jour » utilise le taux en direct
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

  return (
    <div className="flex flex-col gap-4">
      <style>{drillStyles}</style>
      <PageHeader title="Campagnes" sub="Composez, testez et envoyez vos emails marketing" />

      {/* Modèles */}
      <div style={cardStyle}>
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2 font-semibold">
            <FileText className="w-5 h-5 text-[#9ca3af]" /> Modèles
          </h3>
          <Button onClick={resetForm} size="sm" className="text-white hover:opacity-90"
            style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
            <RefreshCw className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => applyTemplate(t)}
              className="p-4 rounded-xl transition-all text-left hover:opacity-90"
              style={{
                background: selectedTemplate === t.id ? 'rgba(255,255,255,0.08)' : INPUT_BG,
                border: selectedTemplate === t.id ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${BORDER}`,
              }}>
              <div className={`mb-3 ${selectedTemplate === t.id ? 'text-white' : 'text-[#9ca3af]'}`}>{t.icon}</div>
              <h3 className="text-white font-semibold mb-1">{t.name}</h3>
              <p className="text-[#6b7280] text-xs">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Colonne gauche : composer + audience + envoi */}
        <div className="flex flex-col gap-4">

          {/* Composer */}
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <Mail className="w-5 h-5 text-[#9ca3af]" /> Composer
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Sujet</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email..." className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Texte d'aperçu (sous le sujet, dans la boîte mail)</Label>
                <Input value={previewText} onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Aperçu affiché dans la boîte de réception..." className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Titre principal</Label>
                <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Grand titre de l'email..." className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Message (un paragraphe par ligne)</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder={'Premier paragraphe...\nDeuxième paragraphe...'}
                  className={`resize-none ${inputClass}`} style={inputStyle} rows={6} />
              </div>

              {/* Bloc mis en avant (optionnel) */}
              <div className="space-y-2">
                <Label className="text-[#9ca3af]">Bloc mis en avant (optionnel — ex. taux, code promo)</Label>
                <button type="button" onClick={() => setAutoRate(!autoRate)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:opacity-90"
                  style={{
                    background: autoRate ? 'rgba(255,255,255,0.08)' : INPUT_BG,
                    border: autoRate ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${BORDER}`,
                  }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: autoRate ? '#fff' : 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}>
                    {autoRate && <CheckCircle2 className="w-4 h-4" style={{ color: '#141414' }} />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Taux du jour automatique</p>
                    <p className="text-[#6b7280] text-xs">Le taux USDT/CFA en direct est inséré au moment de l'envoi — rien à saisir.</p>
                  </div>
                </button>
                {!autoRate && (
                  <div className="grid grid-cols-3 gap-3">
                    <Input value={highlightLabel} onChange={(e) => setHighlightLabel(e.target.value)}
                      placeholder="Libellé" className={inputClass} style={inputStyle} />
                    <Input value={highlightValue} onChange={(e) => setHighlightValue(e.target.value)}
                      placeholder="Valeur (ex. 585 CFA)" className={inputClass} style={inputStyle} />
                    <Input value={highlightSub} onChange={(e) => setHighlightSub(e.target.value)}
                      placeholder="Sous-texte" className={inputClass} style={inputStyle} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#9ca3af]">Bouton</Label>
                  <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={inputClass} style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#9ca3af]">URL</Label>
                  <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* Audience */}
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <Users className="w-5 h-5 text-[#9ca3af]" /> Audience
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SEGMENTS.map(({ id, label, desc, Icon }) => (
                <button key={id} onClick={() => setSegment(id)}
                  className="p-3 rounded-xl text-left transition-all hover:opacity-90"
                  style={{
                    background: segment === id ? 'rgba(255,255,255,0.08)' : INPUT_BG,
                    border: segment === id ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${BORDER}`,
                  }}>
                  <Icon className={`w-4 h-4 mb-2 ${segment === id ? 'text-white' : 'text-[#9ca3af]'}`} />
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-[#6b7280] text-xs">{desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#9ca3af' }}>
              {countLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Calcul des destinataires…</>
                : segmentCount !== null
                  ? <><CheckCircle2 className="w-4 h-4" /> <span className="text-white font-semibold">{segmentCount}</span> destinataire(s) — désabonnés exclus automatiquement</>
                  : <><AlertCircle className="w-4 h-4" /> Nombre indisponible</>}
            </div>
          </div>

          {/* Envoi */}
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <Send className="w-5 h-5 text-[#9ca3af]" /> Envoyer
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Votre email pour le test..." className={`flex-1 ${inputClass}`} style={inputStyle} />
                <Button onClick={sendTest} disabled={isTesting || !testEmail}
                  className="text-white hover:opacity-90" style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><TestTube className="w-4 h-4 mr-2" /> Tester</>}
                </Button>
              </div>
              <Button onClick={() => setConfirmOpen(true)} disabled={isSending || !subject.trim() || !content.trim()}
                className="w-full font-bold hover:opacity-90" style={{ background: '#fff', color: '#141414' }}>
                {isSending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours…</>
                  : <><Users className="w-4 h-4 mr-2" /> Envoyer à « {segmentLabel(segment)} »{segmentCount !== null ? ` (${segmentCount})` : ''}</>}
              </Button>
            </div>
          </div>
        </div>

        {/* Colonne droite : aperçu réel + historique */}
        <div className="flex flex-col gap-4">
          <div style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white flex items-center gap-2 font-semibold">
                <Eye className="w-5 h-5 text-[#9ca3af]" /> Aperçu réel
              </h3>
              <Button onClick={refreshPreview} size="sm" disabled={previewLoading}
                className="text-white hover:opacity-90" style={{ background: '#2d2d2d', border: `1px solid ${BORDER}` }}>
                {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Actualiser</>}
              </Button>
            </div>
            {previewHtml ? (
              <iframe title="Aperçu email" srcDoc={previewHtml} sandbox=""
                className="w-full rounded-lg" style={{ height: 560, border: `1px solid ${BORDER}`, background: '#141414' }} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center rounded-lg"
                style={{ height: 240, border: `1px dashed ${BORDER}` }}>
                <Eye className="w-6 h-6 mb-2" style={{ color: '#4b5563' }} />
                <p className="text-[#6b7280] text-sm">Cliquez sur « Actualiser » pour voir le rendu<br />exact de l'email (celui que recevra le client).</p>
              </div>
            )}
          </div>

          {/* Historique */}
          <div style={cardStyle}>
            <h3 className="text-white flex items-center gap-2 font-semibold mb-4">
              <History className="w-5 h-5 text-[#9ca3af]" /> Dernières campagnes
            </h3>
            {history.length === 0 ? (
              <p className="text-[#6b7280] text-sm">Aucune campagne envoyée pour le moment.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map(c => (
                  <div key={c.id} className="p-3 rounded-xl" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-white text-sm font-medium truncate">{c.subject}</p>
                      <span className="text-xs whitespace-nowrap" style={{ color: c.error_count > 0 ? '#cca24f' : '#9ca3af' }}>
                        {c.success_count}/{c.recipients_count} envoyés
                      </span>
                    </div>
                    <p className="text-[#6b7280] text-xs mt-1">
                      {segmentLabel(c.segment)} · {new Date(c.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                      {c.error_count > 0 ? ` · ${c.error_count} erreur(s)` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
