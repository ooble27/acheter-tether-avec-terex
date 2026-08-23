/**
 * Mail Studio — éditeur visuel de templates email par blocs, avec IA.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Trash2, Eye, Loader2, ArrowLeft, Send, Save,
  GripVertical, ChevronDown, ChevronUp, Copy, LayoutGrid,
  Smartphone, Monitor, Type, Image, Columns, MousePointerClick,
  Receipt, Minus, FileText, Sparkles, X, Wand2, RotateCcw,
  Mail, Clock, CheckCircle, Edit3, Zap, PanelLeftOpen,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg: '#0f0f0f',
  card: '#171717',
  cardHover: '#1c1c1c',
  elevated: '#1f1f1f',
  surface: '#242424',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.14)',
  borderActive: 'rgba(255,255,255,0.22)',
  text: '#f5f5f5',
  textSec: '#a1a1a1',
  textMuted: '#666666',
  brand: '#3fd6a5',
  brandDim: 'rgba(63,214,165,0.12)',
  brandBorder: 'rgba(63,214,165,0.25)',
  ai: '#a78bfa',
  aiDim: 'rgba(167,139,250,0.10)',
  aiBorder: 'rgba(167,139,250,0.30)',
  danger: '#ef4444',
  dangerDim: 'rgba(239,68,68,0.10)',
  warning: '#fbbf24',
  warningDim: 'rgba(251,191,36,0.10)',
  success: '#34d399',
  successDim: 'rgba(52,211,153,0.10)',
  inputBg: 'rgba(255,255,255,0.035)',
  radius: 14,
  radiusSm: 10,
};

// ── Block type metadata ────────────────────────────────────────────────────
const BLOCK_TYPES: { type: string; label: string; desc: string; icon: any; defaultProps: Record<string, any> }[] = [
  { type: 'brand-header', label: 'En-tête', desc: 'Logo Terex + lien', icon: LayoutGrid, defaultProps: {} },
  { type: 'hero-image', label: 'Image héro', desc: 'Bannière pleine largeur', icon: Image, defaultProps: { src: '', alt: '', height: 320 } },
  { type: 'big-title', label: 'Grand titre', desc: 'Titre + sous-titre', icon: Type, defaultProps: { title: '', subtitle: '', align: 'left' } },
  { type: 'text', label: 'Texte', desc: 'Paragraphe libre', icon: FileText, defaultProps: { text: '', greeting: '' } },
  { type: 'highlight-box', label: 'Chiffre clé', desc: 'Valeur mise en avant', icon: Sparkles, defaultProps: { label: '', value: '', sub: '' } },
  { type: 'feature-row', label: 'Fonctionnalités', desc: 'Colonnes de features', icon: Columns, defaultProps: { features: [{ title: '', text: '' }], columns: 2 } },
  { type: 'cta-button', label: 'Bouton CTA', desc: "Appel à l'action", icon: MousePointerClick, defaultProps: { text: 'Accéder à Terex', url: 'https://terangaexchange.com/dashboard', style: 'brand' } },
  { type: 'transaction-receipt', label: 'Reçu', desc: 'Tableau de détails', icon: Receipt, defaultProps: { title: 'Détails', lines: [{ label: '', value: '' }] } },
  { type: 'quiet-divider', label: 'Séparateur', desc: 'Espace visuel', icon: Minus, defaultProps: {} },
  { type: 'footer', label: 'Pied de page', desc: 'Désinscription + note', icon: FileText, defaultProps: { note: 'Vous recevez cet e-mail parce que vous avez un compte sur Terex.' } },
];

const CATEGORIES = [
  { id: 'marketing', label: 'Marketing', color: C.brand },
  { id: 'transactional', label: 'Transactionnel', color: '#60a5fa' },
  { id: 'onboarding', label: 'Onboarding', color: '#fbbf24' },
  { id: 'reactivation', label: 'Réactivation', color: '#f472b6' },
];

interface BlockSpec { type: string; props: Record<string, any> }
interface TemplateRecord {
  id: string; name: string; subject: string; preview_text: string;
  blocks: BlockSpec[]; category: string; is_draft: boolean;
  created_at: string; updated_at: string;
}

type View = 'list' | 'editor';

// ── API helper ──────────────────────────────────────────────────────────────
async function api(action: string, extra: Record<string, any> = {}) {
  const { data, error } = await supabase.functions.invoke('mail-studio-api', {
    body: { action, ...extra },
  });
  if (error) throw new Error(error.message || 'Erreur API');
  if (data?.error) throw new Error(data.error);
  return data;
}

async function aiCompose(prompt: string, category: string) {
  const { data, error } = await supabase.functions.invoke('ai-compose-blocks', {
    body: { prompt, category },
  });
  if (error) throw new Error(error.message || 'Erreur IA');
  if (data?.error) throw new Error(data.error);
  return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════════════
export function MailStudioAdmin() {
  const [view, setView] = useState<View>('list');
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [category, setCategory] = useState('marketing');
  const [isDraft, setIsDraft] = useState(true);
  const [blocks, setBlocks] = useState<BlockSpec[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showBlockPalette, setShowBlockPalette] = useState(false);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('list');
      setTemplates(data.templates || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  const openNew = () => {
    setEditId(null);
    setName(''); setSubject(''); setPreviewText('');
    setCategory('marketing'); setIsDraft(true);
    setBlocks([
      { type: 'brand-header', props: {} },
      { type: 'big-title', props: { title: '' } },
      { type: 'text', props: { text: '', greeting: 'Bonjour {{prenom}},' } },
      { type: 'cta-button', props: { text: 'Accéder à Terex', url: 'https://terangaexchange.com/dashboard', style: 'brand' } },
      { type: 'quiet-divider', props: {} },
      { type: 'footer', props: {} },
    ]);
    setExpandedBlock(null); setPreviewHtml('');
    setView('editor');
  };

  const openEdit = async (id: string) => {
    try {
      const data = await api('get', { id });
      const t = data.template;
      setEditId(t.id);
      setName(t.name); setSubject(t.subject); setPreviewText(t.preview_text);
      setCategory(t.category); setIsDraft(t.is_draft);
      setBlocks(t.blocks || []);
      setExpandedBlock(null); setPreviewHtml('');
      setView('editor');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const saveTemplate = async () => {
    if (!name.trim()) { toast.error('Nom requis'); return; }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: name.trim(), subject: subject.trim(),
        preview_text: previewText.trim(), category,
        is_draft: isDraft, blocks,
      };
      if (editId) payload.id = editId;
      const data = await api('save', payload);
      if (data.template?.id) setEditId(data.template.id);
      toast.success(editId ? 'Template mis à jour' : 'Template créé');
      loadTemplates();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Supprimer ce template ?')) return;
    try {
      await api('delete', { id });
      toast.success('Template supprimé');
      loadTemplates();
      if (editId === id) setView('list');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const refreshPreview = async () => {
    setPreviewLoading(true);
    try {
      const data = await api('preview', {
        subject: subject || 'Aperçu', preview_text: previewText || subject, blocks,
      });
      setPreviewHtml(data.html || '');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail) { toast.error('Email requis'); return; }
    setTesting(true);
    try {
      const data = await api('send-test', {
        to: testEmail, subject: subject || 'Test Mail Studio',
        preview_text: previewText, blocks,
      });
      toast.success(data.message || `Test envoyé à ${testEmail}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setTesting(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) { toast.error('Décris ton email'); return; }
    setAiLoading(true);
    try {
      const data = await aiCompose(aiPrompt.trim(), category);
      if (data.blocks?.length) {
        setBlocks(data.blocks);
        if (data.subject) setSubject(data.subject);
        if (data.preview_text) setPreviewText(data.preview_text);
        toast.success('Template généré par IA');
        setShowAiPanel(false);
        setAiPrompt('');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const addBlock = (type: string) => {
    const meta = BLOCK_TYPES.find(b => b.type === type);
    if (!meta) return;
    setBlocks(prev => [...prev, { type, props: JSON.parse(JSON.stringify(meta.defaultProps)) }]);
    setExpandedBlock(blocks.length);
    setShowBlockPalette(false);
  };

  const removeBlock = (idx: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== idx));
    setExpandedBlock(null);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= blocks.length) return;
    setBlocks(prev => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
    setExpandedBlock(next);
  };

  const updateBlockProp = (idx: number, key: string, value: any) => {
    setBlocks(prev => prev.map((b, i) => i === idx ? { ...b, props: { ...b.props, [key]: value } } : b));
  };

  const duplicateBlock = (idx: number) => {
    setBlocks(prev => {
      const arr = [...prev];
      arr.splice(idx + 1, 0, JSON.parse(JSON.stringify(prev[idx])));
      return arr;
    });
    setExpandedBlock(idx + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <style>{drillStyles}{studioStyles}</style>
      <PageHeader
        title="Mail Studio"
        sub="Créez des templates email visuels — manuellement ou avec l'IA"
        right={view === 'list' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={openNew} className="studio-btn-primary">
              <Plus size={14} /> Nouveau
            </button>
          </div>
        ) : undefined}
      />

      {view === 'list' && (
        <ListView
          templates={templates}
          loading={loading}
          onNew={openNew}
          onEdit={openEdit}
          onDelete={deleteTemplate}
        />
      )}

      {view === 'editor' && (
        <EditorView
          editId={editId}
          name={name} setName={setName}
          subject={subject} setSubject={setSubject}
          previewText={previewText} setPreviewText={setPreviewText}
          category={category} setCategory={setCategory}
          isDraft={isDraft} setIsDraft={setIsDraft}
          blocks={blocks}
          expandedBlock={expandedBlock} setExpandedBlock={setExpandedBlock}
          previewHtml={previewHtml} previewLoading={previewLoading}
          previewDevice={previewDevice} setPreviewDevice={setPreviewDevice}
          saving={saving} testing={testing}
          testEmail={testEmail} setTestEmail={setTestEmail}
          showAiPanel={showAiPanel} setShowAiPanel={setShowAiPanel}
          aiPrompt={aiPrompt} setAiPrompt={setAiPrompt}
          aiLoading={aiLoading}
          showBlockPalette={showBlockPalette} setShowBlockPalette={setShowBlockPalette}
          onBack={() => setView('list')}
          onSave={saveTemplate}
          onRefreshPreview={refreshPreview}
          onSendTest={sendTest}
          onAiGenerate={handleAiGenerate}
          onAddBlock={addBlock}
          onRemoveBlock={removeBlock}
          onMoveBlock={moveBlock}
          onUpdateProp={updateBlockProp}
          onDuplicate={duplicateBlock}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// List View
// ═══════════════════════════════════════════════════════════════════════════════
interface ListProps {
  templates: TemplateRecord[]; loading: boolean;
  onNew: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void;
}

function ListView({ templates, loading, onNew, onEdit, onDelete }: ListProps) {
  if (loading) {
    return (
      <div className="studio-center-state">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.textMuted }} />
        <span>Chargement…</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="studio-empty-state">
        <div className="studio-empty-icon">
          <Mail size={28} />
        </div>
        <h3>Aucun template</h3>
        <p>Créez votre premier template email — manuellement ou généré par IA.</p>
        <button onClick={onNew} className="studio-btn-primary">
          <Sparkles size={14} /> Créer un template
        </button>
      </div>
    );
  }

  return (
    <div className="studio-grid">
      {templates.map(t => {
        const cat = CATEGORIES.find(c => c.id === t.category);
        return (
          <div key={t.id} className="studio-template-card" onClick={() => onEdit(t.id)}>
            <div className="studio-card-header">
              <div className="studio-card-badges">
                <span className="studio-badge" style={{
                  color: t.is_draft ? C.warning : C.success,
                  background: t.is_draft ? C.warningDim : C.successDim,
                }}>
                  {t.is_draft ? 'Brouillon' : 'Publié'}
                </span>
                <span className="studio-badge" style={{
                  color: cat?.color || C.textMuted,
                  background: `${cat?.color || C.textMuted}15`,
                }}>
                  {cat?.label || t.category}
                </span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onDelete(t.id); }}
                className="studio-card-delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div className="studio-card-body">
              <p className="studio-card-title">{t.name}</p>
              <p className="studio-card-subject">{t.subject || '(pas de sujet)'}</p>
            </div>
            <div className="studio-card-footer">
              <Clock size={11} />
              <span>{new Date(t.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Editor View
// ═══════════════════════════════════════════════════════════════════════════════
interface EditorProps {
  editId: string | null;
  name: string; setName: (v: string) => void;
  subject: string; setSubject: (v: string) => void;
  previewText: string; setPreviewText: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  isDraft: boolean; setIsDraft: (v: boolean) => void;
  blocks: BlockSpec[];
  expandedBlock: number | null; setExpandedBlock: (v: number | null) => void;
  previewHtml: string; previewLoading: boolean;
  previewDevice: 'mobile' | 'desktop'; setPreviewDevice: (v: 'mobile' | 'desktop') => void;
  saving: boolean; testing: boolean;
  testEmail: string; setTestEmail: (v: string) => void;
  showAiPanel: boolean; setShowAiPanel: (v: boolean) => void;
  aiPrompt: string; setAiPrompt: (v: string) => void;
  aiLoading: boolean;
  showBlockPalette: boolean; setShowBlockPalette: (v: boolean) => void;
  onBack: () => void;
  onSave: () => void;
  onRefreshPreview: () => void;
  onSendTest: () => void;
  onAiGenerate: () => void;
  onAddBlock: (type: string) => void;
  onRemoveBlock: (idx: number) => void;
  onMoveBlock: (idx: number, dir: -1 | 1) => void;
  onUpdateProp: (idx: number, key: string, value: any) => void;
  onDuplicate: (idx: number) => void;
}

function EditorView(p: EditorProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="studio-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={p.onBack} className="studio-btn-ghost">
            <ArrowLeft size={14} /> Retour
          </button>
          <span className="studio-toolbar-label">
            {p.editId ? 'Modifier' : 'Nouveau'} template
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => p.setShowAiPanel(!p.showAiPanel)}
            className={`studio-btn-ai ${p.showAiPanel ? 'active' : ''}`}
          >
            <Wand2 size={14} /> IA
          </button>
          <button onClick={p.onRefreshPreview} disabled={p.previewLoading} className="studio-btn-ghost">
            {p.previewLoading ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Aperçu
          </button>
          <button onClick={p.onSave} disabled={p.saving} className="studio-btn-primary">
            {p.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Enregistrer
          </button>
        </div>
      </div>

      {/* ── AI Panel (collapsible) ────────────────────────────────── */}
      {p.showAiPanel && (
        <div className="studio-ai-panel">
          <div className="studio-ai-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="studio-ai-icon"><Wand2 size={16} /></div>
              <div>
                <p className="studio-ai-title">Compose avec l'IA</p>
                <p className="studio-ai-sub">Décris le mail que tu veux, l'IA génère les blocs</p>
              </div>
            </div>
            <button onClick={() => p.setShowAiPanel(false)} className="studio-btn-icon-sm">
              <X size={14} />
            </button>
          </div>
          <div className="studio-ai-body">
            <textarea
              value={p.aiPrompt}
              onChange={e => p.setAiPrompt(e.target.value)}
              placeholder="Ex: Email de bienvenue pour un nouvel utilisateur qui vient de s'inscrire, lui expliquer comment acheter ses premiers USDT…"
              className="studio-ai-textarea"
              rows={3}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p className="studio-ai-hint">
                L'IA respecte la voix de marque Terex et génère des blocs prêts à l'emploi.
              </p>
              <button
                onClick={p.onAiGenerate}
                disabled={p.aiLoading || !p.aiPrompt.trim()}
                className="studio-btn-ai-action"
              >
                {p.aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {p.aiLoading ? 'Génération…' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────────── */}
      <div className="studio-editor-layout">
        {/* ── Left: Meta + Blocks ─────────────────────────────────── */}
        <div className="studio-editor-left">
          {/* Meta fields */}
          <section className="studio-section">
            <div className="studio-section-header">
              <Edit3 size={14} style={{ color: C.textMuted }} />
              <span>Informations</span>
            </div>
            <div className="studio-meta-grid">
              <div className="studio-field">
                <label>Nom du template</label>
                <input value={p.name} onChange={e => p.setName(e.target.value)}
                  placeholder="Mon template…" />
              </div>
              <div className="studio-field">
                <label>Catégorie</label>
                <select value={p.category} onChange={e => p.setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="studio-field">
                <label>Sujet de l'email</label>
                <input value={p.subject} onChange={e => p.setSubject(e.target.value)}
                  placeholder="Sujet de l'email…" />
              </div>
              <div className="studio-field">
                <label>Texte d'aperçu</label>
                <input value={p.previewText} onChange={e => p.setPreviewText(e.target.value)}
                  placeholder="Visible sous le sujet en inbox…" />
              </div>
            </div>
            <div style={{ paddingTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => p.setIsDraft(!p.isDraft)} className="studio-status-toggle"
                style={{
                  color: p.isDraft ? C.warning : C.success,
                  background: p.isDraft ? C.warningDim : C.successDim,
                  borderColor: p.isDraft ? 'rgba(251,191,36,0.20)' : 'rgba(52,211,153,0.20)',
                }}>
                {p.isDraft ? <Clock size={11} /> : <CheckCircle size={11} />}
                {p.isDraft ? 'Brouillon' : 'Publié'}
              </button>
            </div>
          </section>

          {/* Block list */}
          <section className="studio-section">
            <div className="studio-section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LayoutGrid size={14} style={{ color: C.textMuted }} />
                <span>Blocs ({p.blocks.length})</span>
              </div>
              <button onClick={() => p.setShowBlockPalette(!p.showBlockPalette)}
                className="studio-btn-ghost-sm">
                <Plus size={13} /> Ajouter
              </button>
            </div>

            {/* Block palette (dropdown) */}
            {p.showBlockPalette && (
              <div className="studio-palette">
                {BLOCK_TYPES.map(bt => {
                  const Icon = bt.icon;
                  return (
                    <button key={bt.type} onClick={() => p.onAddBlock(bt.type)}
                      className="studio-palette-item">
                      <div className="studio-palette-icon"><Icon size={16} /></div>
                      <div>
                        <span className="studio-palette-label">{bt.label}</span>
                        <span className="studio-palette-desc">{bt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {p.blocks.length === 0 && (
              <div className="studio-blocks-empty">
                <PanelLeftOpen size={20} style={{ opacity: 0.3 }} />
                <p>Aucun bloc. Ajoutez-en ou utilisez l'IA pour générer.</p>
              </div>
            )}

            <div className="studio-block-list">
              {p.blocks.map((block, idx) => (
                <BlockItem
                  key={idx}
                  block={block}
                  idx={idx}
                  total={p.blocks.length}
                  expanded={p.expandedBlock === idx}
                  onToggle={() => p.setExpandedBlock(p.expandedBlock === idx ? null : idx)}
                  onRemove={() => p.onRemoveBlock(idx)}
                  onMoveUp={() => p.onMoveBlock(idx, -1)}
                  onMoveDown={() => p.onMoveBlock(idx, 1)}
                  onDuplicate={() => p.onDuplicate(idx)}
                  onUpdateProp={(key, val) => p.onUpdateProp(idx, key, val)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ── Right: Preview + Send ───────────────────────────────── */}
        <div className="studio-editor-right">
          <section className="studio-section studio-preview-section">
            <div className="studio-section-header" style={{ justifyContent: 'space-between' }}>
              <span>Aperçu</span>
              <div className="studio-device-toggle">
                {([['mobile', Smartphone], ['desktop', Monitor]] as const).map(([id, Icon]) => (
                  <button key={id} onClick={() => p.setPreviewDevice(id)}
                    className={`studio-device-btn ${p.previewDevice === id ? 'active' : ''}`}>
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {p.previewHtml ? (
              <div className="studio-preview-frame" data-device={p.previewDevice}>
                <iframe
                  title="Aperçu email"
                  srcDoc={p.previewHtml}
                  sandbox=""
                  style={{
                    width: p.previewDevice === 'mobile' ? 375 : '100%',
                    height: 560, border: 'none', borderRadius: 8,
                    background: '#111',
                  }}
                />
              </div>
            ) : (
              <div className="studio-preview-empty">
                <Eye size={22} style={{ opacity: 0.3 }} />
                <p>Cliquez « Aperçu » pour voir le rendu email</p>
              </div>
            )}
          </section>

          {/* Send test */}
          <section className="studio-section studio-send-section">
            <div className="studio-section-header">
              <Send size={14} style={{ color: C.textMuted }} />
              <span>Envoyer un test</span>
            </div>
            <div className="studio-send-row">
              <input type="email" value={p.testEmail} onChange={e => p.setTestEmail(e.target.value)}
                placeholder="email@exemple.com" className="studio-send-input" />
              <button onClick={p.onSendTest} disabled={p.testing || !p.testEmail}
                className="studio-btn-ghost" style={{ opacity: (p.testing || !p.testEmail) ? 0.4 : 1 }}>
                {p.testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Envoyer
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Block Item
// ═══════════════════════════════════════════════════════════════════════════════
interface BlockItemProps {
  block: BlockSpec; idx: number; total: number; expanded: boolean;
  onToggle: () => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  onDuplicate: () => void;
  onUpdateProp: (key: string, value: any) => void;
}

function BlockItem({ block, idx, total, expanded, onToggle, onRemove, onMoveUp, onMoveDown, onDuplicate, onUpdateProp }: BlockItemProps) {
  const meta = BLOCK_TYPES.find(b => b.type === block.type);
  const Icon = meta?.icon || FileText;

  return (
    <div className={`studio-block-item ${expanded ? 'expanded' : ''}`}>
      <div className="studio-block-header" onClick={onToggle}>
        <div className="studio-block-left">
          <GripVertical size={12} style={{ color: C.textMuted, flexShrink: 0 }} />
          <div className="studio-block-icon"><Icon size={13} /></div>
          <span className="studio-block-label">{meta?.label || block.type}</span>
        </div>
        <div className="studio-block-right">
          <span className="studio-block-idx">{idx + 1}</span>
          {expanded ? <ChevronUp size={13} color={C.textMuted} /> : <ChevronDown size={13} color={C.textMuted} />}
        </div>
      </div>

      {expanded && (
        <div className="studio-block-body">
          <div className="studio-block-actions">
            <button onClick={onMoveUp} disabled={idx === 0} className="studio-action-btn">
              <ChevronUp size={12} /> Haut
            </button>
            <button onClick={onMoveDown} disabled={idx === total - 1} className="studio-action-btn">
              <ChevronDown size={12} /> Bas
            </button>
            <button onClick={onDuplicate} className="studio-action-btn">
              <Copy size={12} /> Dupliquer
            </button>
            <button onClick={onRemove} className="studio-action-btn danger">
              <Trash2 size={12} /> Supprimer
            </button>
          </div>
          <BlockPropsEditor block={block} onUpdate={onUpdateProp} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Block Props Editor
// ═══════════════════════════════════════════════════════════════════════════════
function BlockPropsEditor({ block, onUpdate }: { block: BlockSpec; onUpdate: (key: string, val: any) => void }) {
  const { type, props } = block;

  if (type === 'brand-header') {
    return (
      <div className="studio-props">
        <PropField label="Texte du lien" value={props.linkText || ''} onChange={v => onUpdate('linkText', v)} placeholder="Se connecter" />
        <PropField label="URL du lien" value={props.linkUrl || ''} onChange={v => onUpdate('linkUrl', v)} placeholder="https://terangaexchange.com" />
      </div>
    );
  }

  if (type === 'hero-image') {
    return (
      <div className="studio-props">
        <PropField label="URL de l'image" value={props.src || ''} onChange={v => onUpdate('src', v)} placeholder="https://…" />
        <PropField label="Texte alt" value={props.alt || ''} onChange={v => onUpdate('alt', v)} placeholder="Description" />
        <PropField label="Hauteur (px)" value={String(props.height ?? 320)} onChange={v => onUpdate('height', Number(v) || 320)} placeholder="320" />
        <PropField label="Titre overlay" value={props.overlayTitle || ''} onChange={v => onUpdate('overlayTitle', v)} />
        <PropField label="Sous-titre overlay" value={props.overlaySubtitle || ''} onChange={v => onUpdate('overlaySubtitle', v)} />
      </div>
    );
  }

  if (type === 'big-title') {
    return (
      <div className="studio-props">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Grand titre…" />
        <PropField label="Sous-titre" value={props.subtitle || ''} onChange={v => onUpdate('subtitle', v)} />
        <PropSelect label="Alignement" value={props.align || 'left'} onChange={v => onUpdate('align', v)}
          options={[{ v: 'left', l: 'Gauche' }, { v: 'center', l: 'Centré' }]} />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="studio-props">
        <PropField label="Formule d'accueil" value={props.greeting || ''} onChange={v => onUpdate('greeting', v)} placeholder="Bonjour {{prenom}}," />
        <PropTextarea label="Texte" value={props.text || ''} onChange={v => onUpdate('text', v)} placeholder="Paragraphes séparés par une ligne vide…" />
      </div>
    );
  }

  if (type === 'highlight-box') {
    return (
      <div className="studio-props">
        <PropField label="Libellé" value={props.label || ''} onChange={v => onUpdate('label', v)} placeholder="TAUX DU JOUR" />
        <PropField label="Valeur" value={props.value || ''} onChange={v => onUpdate('value', v)} placeholder="585 CFA / USDT" />
        <PropField label="Sous-texte" value={props.sub || ''} onChange={v => onUpdate('sub', v)} />
      </div>
    );
  }

  if (type === 'cta-button') {
    return (
      <div className="studio-props">
        <PropField label="Texte" value={props.text || ''} onChange={v => onUpdate('text', v)} placeholder="Accéder à Terex" />
        <PropField label="URL" value={props.url || ''} onChange={v => onUpdate('url', v)} placeholder="https://…" />
        <PropSelect label="Style" value={props.style || 'brand'} onChange={v => onUpdate('style', v)}
          options={[{ v: 'brand', l: 'Vert (brand)' }, { v: 'white', l: 'Blanc' }, { v: 'outline', l: 'Contour' }]} />
        <PropField label="Sous-texte" value={props.subtitle || ''} onChange={v => onUpdate('subtitle', v)} />
      </div>
    );
  }

  if (type === 'transaction-receipt') {
    const lines: { label: string; value: string }[] = props.lines || [];
    return (
      <div className="studio-props">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Détails de la transaction" />
        <div className="studio-field">
          <label>Lignes</label>
          <div className="studio-receipt-lines">
            {lines.map((line, i) => (
              <div key={i} className="studio-receipt-line">
                <input value={line.label}
                  onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], label: e.target.value }; onUpdate('lines', nl); }}
                  placeholder="Libellé" />
                <input value={line.value}
                  onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], value: e.target.value }; onUpdate('lines', nl); }}
                  placeholder="Valeur" />
                <button onClick={() => onUpdate('lines', lines.filter((_, j) => j !== i))} className="studio-action-btn danger" style={{ padding: '4px 6px' }}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => onUpdate('lines', [...lines, { label: '', value: '' }])}
            className="studio-btn-ghost-sm" style={{ marginTop: 6 }}>
            <Plus size={12} /> Ligne
          </button>
        </div>
      </div>
    );
  }

  if (type === 'feature-row') {
    const features: { icon?: string; title: string; text: string }[] = props.features || [];
    return (
      <div className="studio-props">
        <PropSelect label="Colonnes" value={String(props.columns || 2)} onChange={v => onUpdate('columns', Number(v))}
          options={[{ v: '2', l: '2 colonnes' }, { v: '3', l: '3 colonnes' }]} />
        <div className="studio-field">
          <label>Fonctionnalités</label>
          {features.map((f, i) => (
            <div key={i} className="studio-feature-item">
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={f.icon || ''} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], icon: e.target.value }; onUpdate('features', nf); }}
                  placeholder="Emoji" style={{ width: 52, flexShrink: 0 }} />
                <input value={f.title} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], title: e.target.value }; onUpdate('features', nf); }}
                  placeholder="Titre" style={{ flex: 1 }} />
                <button onClick={() => onUpdate('features', features.filter((_, j) => j !== i))} className="studio-action-btn danger" style={{ padding: '4px 6px' }}>
                  <X size={12} />
                </button>
              </div>
              <input value={f.text} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], text: e.target.value }; onUpdate('features', nf); }}
                placeholder="Description" />
            </div>
          ))}
          <button onClick={() => onUpdate('features', [...features, { title: '', text: '' }])}
            className="studio-btn-ghost-sm" style={{ marginTop: 6 }}>
            <Plus size={12} /> Feature
          </button>
        </div>
      </div>
    );
  }

  if (type === 'quiet-divider') {
    return (
      <div className="studio-props">
        <PropField label="Espacement (px)" value={String(props.spacing ?? 8)} onChange={v => onUpdate('spacing', Number(v) || 8)} />
      </div>
    );
  }

  if (type === 'footer') {
    return (
      <div className="studio-props">
        <PropField label="URL désinscription" value={props.unsubscribeUrl || ''} onChange={v => onUpdate('unsubscribeUrl', v)} placeholder="https://…/unsubscribe" />
        <PropTextarea label="Note" value={props.note || ''} onChange={v => onUpdate('note', v)} />
      </div>
    );
  }

  return <p style={{ color: C.textMuted, fontSize: 12, padding: '8px 0' }}>Aucune propriété éditable.</p>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Field components
// ═══════════════════════════════════════════════════════════════════════════════
function PropField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="studio-field">
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function PropTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="studio-field">
      <label>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={4} />
    </div>
  );
}

function PropSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="studio-field">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════════════════
const studioStyles = `
/* ── Buttons ─────────────────────────────────────────────── */
.studio-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: ${C.radiusSm}px;
  background: ${C.brand}; border: none; color: #111;
  font-size: 12.5px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
}
.studio-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.studio-btn-primary:disabled { opacity: 0.5; cursor: default; transform: none; }

.studio-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: ${C.radiusSm}px;
  background: ${C.card}; border: 1px solid ${C.border};
  color: ${C.textSec}; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.studio-btn-ghost:hover { border-color: ${C.borderHover}; color: ${C.text}; background: ${C.elevated}; }
.studio-btn-ghost:disabled { opacity: 0.4; cursor: default; }

.studio-btn-ghost-sm {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 8px;
  background: transparent; border: 1px solid ${C.border};
  color: ${C.textSec}; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.12s;
}
.studio-btn-ghost-sm:hover { border-color: ${C.borderHover}; color: ${C.text}; }

.studio-btn-ai {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: ${C.radiusSm}px;
  background: ${C.aiDim}; border: 1px solid ${C.aiBorder};
  color: ${C.ai}; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.studio-btn-ai:hover { background: rgba(167,139,250,0.18); }
.studio-btn-ai.active { background: rgba(167,139,250,0.20); border-color: ${C.ai}; }

.studio-btn-ai-action {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: ${C.radiusSm}px;
  background: ${C.ai}; border: none; color: #fff;
  font-size: 12.5px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; flex-shrink: 0;
}
.studio-btn-ai-action:hover { filter: brightness(1.15); }
.studio-btn-ai-action:disabled { opacity: 0.5; cursor: default; }

.studio-btn-icon-sm {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 8px;
  background: transparent; border: 1px solid ${C.border};
  color: ${C.textMuted}; cursor: pointer; transition: all 0.12s;
}
.studio-btn-icon-sm:hover { color: ${C.text}; border-color: ${C.borderHover}; }

/* ── Toolbar ─────────────────────────────────────────────── */
.studio-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.studio-toolbar-label { color: ${C.textMuted}; font-size: 12px; }

/* ── AI Panel ────────────────────────────────────────────── */
.studio-ai-panel {
  background: ${C.card}; border: 1px solid ${C.aiBorder};
  border-radius: ${C.radius}px; overflow: hidden;
  animation: crm-in 0.2s ease both;
}
.studio-ai-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid ${C.border};
}
.studio-ai-icon {
  width: 32px; height: 32px; border-radius: 10px;
  background: ${C.aiDim}; display: flex; align-items: center;
  justify-content: center; color: ${C.ai};
}
.studio-ai-title { color: ${C.text}; font-size: 13px; font-weight: 600; margin: 0; }
.studio-ai-sub { color: ${C.textMuted}; font-size: 11.5px; margin: 2px 0 0; }
.studio-ai-body { padding: 16px 18px; }
.studio-ai-textarea {
  width: 100%; background: ${C.inputBg}; border: 1px solid ${C.border};
  border-radius: ${C.radiusSm}px; color: ${C.text}; font-size: 13px;
  padding: 12px 14px; outline: none; resize: vertical; min-height: 70px;
  font-family: inherit; line-height: 1.5; box-sizing: border-box;
  transition: border-color 0.15s;
}
.studio-ai-textarea:focus { border-color: ${C.aiBorder}; }
.studio-ai-textarea::placeholder { color: ${C.textMuted}; }
.studio-ai-hint { color: ${C.textMuted}; font-size: 11px; margin: 10px 0 0; flex: 1; }

/* ── Editor Layout ───────────────────────────────────────── */
.studio-editor-layout {
  display: grid; grid-template-columns: 1fr 420px;
  gap: 20px; align-items: start;
}
@media (max-width: 1100px) {
  .studio-editor-layout { grid-template-columns: 1fr; }
}

.studio-editor-left { display: flex; flex-direction: column; gap: 16px; }
.studio-editor-right { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 16px; }

/* ── Sections ────────────────────────────────────────────── */
.studio-section {
  background: ${C.card}; border: 1px solid ${C.border};
  border-radius: ${C.radius}px; padding: 18px 20px;
}
.studio-section-header {
  display: flex; align-items: center; gap: 8px;
  color: ${C.textSec}; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 14px;
}

/* ── Meta Grid ───────────────────────────────────────────── */
.studio-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
@media (max-width: 640px) { .studio-meta-grid { grid-template-columns: 1fr; } }

/* ── Fields ──────────────────────────────────────────────── */
.studio-field { display: flex; flex-direction: column; gap: 5px; }
.studio-field label {
  color: ${C.textMuted}; font-size: 10.5px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.studio-field input, .studio-field select, .studio-field textarea {
  width: 100%; background: ${C.inputBg}; border: 1px solid ${C.border};
  border-radius: 8px; color: ${C.text}; font-size: 12.5px;
  padding: 8px 11px; outline: none; font-family: inherit;
  box-sizing: border-box; transition: border-color 0.15s;
}
.studio-field input:focus, .studio-field select:focus, .studio-field textarea:focus {
  border-color: ${C.borderActive};
}
.studio-field input::placeholder, .studio-field textarea::placeholder { color: ${C.textMuted}; }
.studio-field textarea { resize: vertical; min-height: 72px; line-height: 1.5; }
.studio-field select { appearance: none; }

.studio-status-toggle {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 11px; border-radius: 8px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: 1px solid; transition: all 0.12s;
}

/* ── Block palette ───────────────────────────────────────── */
.studio-palette {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  margin-bottom: 14px; padding: 12px; border-radius: ${C.radiusSm}px;
  background: ${C.elevated}; border: 1px solid ${C.border};
  animation: crm-in 0.15s ease both;
}
@media (max-width: 640px) { .studio-palette { grid-template-columns: 1fr; } }

.studio-palette-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: transparent; border: 1px solid transparent;
  color: ${C.text}; cursor: pointer; transition: all 0.12s;
  text-align: left;
}
.studio-palette-item:hover {
  background: ${C.surface}; border-color: ${C.borderHover};
}
.studio-palette-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: ${C.inputBg}; display: flex; align-items: center;
  justify-content: center; color: ${C.textSec}; flex-shrink: 0;
}
.studio-palette-label { display: block; font-size: 12px; font-weight: 600; color: ${C.text}; }
.studio-palette-desc { display: block; font-size: 10.5px; color: ${C.textMuted}; margin-top: 1px; }

/* ── Block list ──────────────────────────────────────────── */
.studio-block-list { display: flex; flex-direction: column; gap: 4px; }
.studio-blocks-empty {
  text-align: center; padding: 32px 16px; color: ${C.textMuted}; font-size: 12.5px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.studio-blocks-empty p { margin: 0; }

.studio-block-item {
  background: transparent; border: 1px solid ${C.border};
  border-radius: ${C.radiusSm}px; overflow: hidden;
  transition: all 0.12s;
}
.studio-block-item.expanded {
  border-color: ${C.borderHover}; background: rgba(255,255,255,0.015);
}
.studio-block-item:hover:not(.expanded) { border-color: ${C.borderHover}; }

.studio-block-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; cursor: pointer; user-select: none;
}
.studio-block-left { display: flex; align-items: center; gap: 8px; }
.studio-block-right { display: flex; align-items: center; gap: 6px; }
.studio-block-icon {
  width: 26px; height: 26px; border-radius: 7px;
  background: ${C.inputBg}; display: flex; align-items: center;
  justify-content: center; color: ${C.textSec};
}
.studio-block-label { color: ${C.text}; font-size: 12.5px; font-weight: 500; }
.studio-block-idx {
  color: ${C.textMuted}; font-size: 10px; font-weight: 600;
  background: ${C.inputBg}; padding: 2px 6px; border-radius: 5px;
}
.studio-block-body { padding: 0 12px 14px; border-top: 1px solid ${C.border}; }
.studio-block-actions {
  display: flex; gap: 4px; padding: 10px 0; flex-wrap: wrap;
}
.studio-action-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 9px; border-radius: 6px; font-size: 10.5px; font-weight: 500;
  background: transparent; border: 1px solid ${C.border};
  color: ${C.textSec}; cursor: pointer; transition: all 0.1s;
}
.studio-action-btn:hover { border-color: ${C.borderHover}; color: ${C.text}; }
.studio-action-btn:disabled { opacity: 0.35; cursor: default; }
.studio-action-btn.danger { color: ${C.danger}; }
.studio-action-btn.danger:hover { border-color: rgba(239,68,68,0.4); background: ${C.dangerDim}; }

.studio-props { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }

/* ── Receipt lines ───────────────────────────────────────── */
.studio-receipt-lines { display: flex; flex-direction: column; gap: 6px; }
.studio-receipt-line { display: flex; gap: 6px; align-items: center; }
.studio-receipt-line input { flex: 1; }

/* ── Feature items ───────────────────────────────────────── */
.studio-feature-item {
  display: flex; flex-direction: column; gap: 6px;
  padding: 8px 0; border-bottom: 1px solid ${C.border};
}
.studio-feature-item:last-child { border-bottom: none; }

/* ── Preview ─────────────────────────────────────────────── */
.studio-preview-section { padding: 18px; }
.studio-preview-frame {
  display: flex; justify-content: center;
  background: #0a0a0a; border-radius: ${C.radiusSm}px;
  padding: 12px; overflow: hidden;
}
.studio-preview-frame[data-device="mobile"] { padding: 16px 0; }
.studio-preview-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 8px; padding: 60px 20px;
  background: #0a0a0a; border-radius: ${C.radiusSm}px;
  color: ${C.textMuted}; font-size: 12.5px;
}
.studio-preview-empty p { margin: 0; }

.studio-device-toggle { display: flex; gap: 3px; }
.studio-device-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
  border: 1px solid ${C.border}; background: transparent;
  color: ${C.textMuted}; transition: all 0.12s;
}
.studio-device-btn.active {
  background: ${C.inputBg}; border-color: ${C.borderHover}; color: ${C.text};
}
.studio-device-btn:hover:not(.active) { border-color: ${C.borderHover}; color: ${C.textSec}; }

/* ── Send section ────────────────────────────────────────── */
.studio-send-section { background: ${C.elevated}; }
.studio-send-row { display: flex; gap: 8px; }
.studio-send-input {
  flex: 1; background: ${C.inputBg}; border: 1px solid ${C.border};
  border-radius: 8px; color: ${C.text}; font-size: 12px;
  padding: 8px 11px; outline: none; box-sizing: border-box;
}
.studio-send-input:focus { border-color: ${C.borderActive}; }
.studio-send-input::placeholder { color: ${C.textMuted}; }

/* ── List View ───────────────────────────────────────────── */
.studio-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.studio-template-card {
  background: ${C.card}; border: 1px solid ${C.border};
  border-radius: ${C.radius}px; overflow: hidden; cursor: pointer;
  transition: all 0.18s; display: flex; flex-direction: column;
}
.studio-template-card:hover {
  border-color: ${C.borderHover}; transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
.studio-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 0;
}
.studio-card-badges { display: flex; gap: 6px; }
.studio-badge {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; padding: 3px 8px; border-radius: 6px;
}
.studio-card-delete {
  background: none; border: none; cursor: pointer; color: ${C.textMuted};
  padding: 4px; border-radius: 6px; transition: all 0.12s;
  display: flex; align-items: center;
}
.studio-card-delete:hover { color: ${C.danger}; background: ${C.dangerDim}; }
.studio-card-body { padding: 12px 16px 14px; flex: 1; }
.studio-card-title {
  color: ${C.text}; font-size: 14px; font-weight: 600; margin: 0 0 4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.studio-card-subject {
  color: ${C.textMuted}; font-size: 12px; margin: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.studio-card-footer {
  display: flex; align-items: center; gap: 5px;
  padding: 10px 16px; border-top: 1px solid ${C.border};
  color: ${C.textMuted}; font-size: 11px;
}

/* ── Empty/Center states ─────────────────────────────────── */
.studio-center-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 60px 20px; color: ${C.textMuted}; font-size: 13px;
}
.studio-empty-state {
  background: ${C.card}; border: 1px solid ${C.border};
  border-radius: ${C.radius}px; text-align: center; padding: 60px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.studio-empty-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: ${C.inputBg}; display: flex; align-items: center;
  justify-content: center; color: ${C.textMuted}; margin-bottom: 4px;
}
.studio-empty-state h3 { color: ${C.text}; font-size: 15px; font-weight: 600; margin: 0; }
.studio-empty-state p { color: ${C.textMuted}; font-size: 13px; margin: 0 0 12px; max-width: 320px; }
`;
