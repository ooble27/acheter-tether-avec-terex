/**
 * Mail Studio — éditeur visuel de templates email par blocs, avec IA.
 * Langage visuel : strictement monochrome (adminTheme.ts) — niveaux de gris,
 * blanc comme unique surbrillance, Poppins. Aucune couleur d'accent.
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Trash2, Eye, Loader2, ArrowLeft, Send, Save,
  GripVertical, ChevronDown, ChevronUp, Copy, LayoutGrid,
  Smartphone, Monitor, Type, Image, Columns, MousePointerClick,
  Receipt, Minus, FileText, Sparkles, X, Wand2,
  Mail, Clock, CheckCircle2, Edit3, PanelLeftOpen,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';
import { C, FONT } from '@/components/admin/adminTheme';

// ── Block type metadata ─────────────────────────────────────────────────────
const BLOCK_TYPES: { type: string; label: string; desc: string; icon: any; defaultProps: Record<string, any> }[] = [
  { type: 'brand-header', label: 'En-tête', desc: 'Logo Terex + lien', icon: LayoutGrid, defaultProps: {} },
  { type: 'hero-image', label: 'Image héro', desc: 'Bannière (URL requise)', icon: Image, defaultProps: { src: '', alt: '', height: 320 } },
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
  { id: 'marketing', label: 'Marketing' },
  { id: 'transactional', label: 'Transactionnel' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'reactivation', label: 'Réactivation' },
];

interface BlockSpec { type: string; props: Record<string, any> }
interface TemplateRecord {
  id: string; name: string; subject: string; preview_text: string;
  blocks: BlockSpec[]; category: string; is_draft: boolean;
  created_at: string; updated_at: string;
}

type View = 'list' | 'editor';

// ── API helpers ──────────────────────────────────────────────────────────────
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
// Main
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
    setShowAiPanel(false); setShowBlockPalette(false);
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
      setShowAiPanel(false); setShowBlockPalette(false);
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
      } else {
        toast.error('L\'IA n\'a rien généré, reformule ta demande.');
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
    <div className="flex flex-col gap-5" style={{ fontFamily: FONT }}>
      <style>{drillStyles}{studioStyles}</style>
      <PageHeader
        title="Mail Studio"
        sub="Créez des templates email visuels — manuellement ou avec l'IA"
        right={view === 'list' ? (
          <button onClick={openNew} className="ms-btn-primary">
            <Plus size={14} /> Nouveau
          </button>
        ) : undefined}
      />

      {view === 'list' && (
        <ListView templates={templates} loading={loading} onNew={openNew} onEdit={openEdit} onDelete={deleteTemplate} />
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
      <div className="ms-center">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.t3 }} />
        <span>Chargement…</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="ms-empty">
        <div className="ms-empty-icon"><Mail size={26} /></div>
        <h3>Aucun template</h3>
        <p>Créez votre premier template email — manuellement ou généré par IA.</p>
        <button onClick={onNew} className="ms-btn-primary"><Plus size={14} /> Créer un template</button>
      </div>
    );
  }

  return (
    <div className="ms-grid">
      {templates.map(t => {
        const cat = CATEGORIES.find(c => c.id === t.category);
        return (
          <div key={t.id} className="ms-tpl-card" onClick={() => onEdit(t.id)}>
            <div className="ms-tpl-head">
              <div className="ms-tpl-badges">
                <span className={`ms-status ${t.is_draft ? 'draft' : 'live'}`}>
                  <span className="ms-dot" /> {t.is_draft ? 'Brouillon' : 'Publié'}
                </span>
                <span className="ms-cat">{cat?.label || t.category}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); onDelete(t.id); }} className="ms-tpl-del">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="ms-tpl-body">
              <p className="ms-tpl-title">{t.name}</p>
              <p className="ms-tpl-subject">{t.subject || '(pas de sujet)'}</p>
            </div>
            <div className="ms-tpl-foot">
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
      {/* Toolbar */}
      <div className="ms-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={p.onBack} className="ms-btn-ghost">
            <ArrowLeft size={14} /> Retour
          </button>
          <span className="ms-toolbar-label">{p.editId ? 'Modifier' : 'Nouveau'} template</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => p.setShowAiPanel(!p.showAiPanel)} className={`ms-btn-ghost ${p.showAiPanel ? 'on' : ''}`}>
            <Wand2 size={14} /> IA
          </button>
          <button onClick={p.onRefreshPreview} disabled={p.previewLoading} className="ms-btn-ghost">
            {p.previewLoading ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Aperçu
          </button>
          <button onClick={p.onSave} disabled={p.saving} className="ms-btn-primary">
            {p.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer
          </button>
        </div>
      </div>

      {/* AI Panel */}
      {p.showAiPanel && (
        <div className="ms-ai-panel">
          <div className="ms-ai-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ms-ai-icon"><Wand2 size={15} /></div>
              <div>
                <p className="ms-ai-title">Compose avec l'IA</p>
                <p className="ms-ai-sub">Décris le mail que tu veux, l'IA génère les blocs</p>
              </div>
            </div>
            <button onClick={() => p.setShowAiPanel(false)} className="ms-icon-btn"><X size={14} /></button>
          </div>
          <div className="ms-ai-body">
            <textarea
              value={p.aiPrompt}
              onChange={e => p.setAiPrompt(e.target.value)}
              placeholder="Ex : Email de bienvenue pour un nouvel inscrit — lui expliquer comment acheter ses premiers USDT avec Wave, ton chaleureux."
              className="ms-ai-textarea"
              rows={3}
            />
            <div className="ms-ai-actions">
              <p className="ms-ai-hint">L'IA respecte la voix de marque Terex. Sans URL d'image fournie, elle n'ajoute pas de photo.</p>
              <button onClick={p.onAiGenerate} disabled={p.aiLoading || !p.aiPrompt.trim()} className="ms-btn-primary">
                {p.aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {p.aiLoading ? 'Génération…' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="ms-layout">
        {/* Left */}
        <div className="ms-col">
          <section className="ms-section">
            <div className="ms-sec-head">
              <Edit3 size={13} style={{ color: C.t3 }} />
              <span>Informations</span>
            </div>
            <div className="ms-meta-grid">
              <Field label="Nom du template">
                <input value={p.name} onChange={e => p.setName(e.target.value)} placeholder="Mon template…" />
              </Field>
              <Field label="Catégorie">
                <select value={p.category} onChange={e => p.setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Sujet de l'email">
                <input value={p.subject} onChange={e => p.setSubject(e.target.value)} placeholder="Sujet de l'email…" />
              </Field>
              <Field label="Texte d'aperçu">
                <input value={p.previewText} onChange={e => p.setPreviewText(e.target.value)} placeholder="Visible sous le sujet en inbox…" />
              </Field>
            </div>
            <div style={{ paddingTop: 12 }}>
              <button onClick={() => p.setIsDraft(!p.isDraft)} className={`ms-status ${p.isDraft ? 'draft' : 'live'} clickable`}>
                {p.isDraft ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                {p.isDraft ? 'Brouillon' : 'Publié'}
              </button>
            </div>
          </section>

          <section className="ms-section">
            <div className="ms-sec-head" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LayoutGrid size={13} style={{ color: C.t3 }} />
                <span>Blocs ({p.blocks.length})</span>
              </div>
              <button onClick={() => p.setShowBlockPalette(!p.showBlockPalette)} className="ms-chip">
                <Plus size={12} /> Ajouter
              </button>
            </div>

            {p.showBlockPalette && (
              <div className="ms-palette">
                {BLOCK_TYPES.map(bt => {
                  const Icon = bt.icon;
                  return (
                    <button key={bt.type} onClick={() => p.onAddBlock(bt.type)} className="ms-palette-item">
                      <div className="ms-palette-icon"><Icon size={15} /></div>
                      <div style={{ minWidth: 0 }}>
                        <span className="ms-palette-label">{bt.label}</span>
                        <span className="ms-palette-desc">{bt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {p.blocks.length === 0 && (
              <div className="ms-blocks-empty">
                <PanelLeftOpen size={18} style={{ opacity: 0.4 }} />
                <p>Aucun bloc. Ajoutez-en ou utilisez l'IA.</p>
              </div>
            )}

            <div className="ms-block-list">
              {p.blocks.map((block, idx) => (
                <BlockItem
                  key={idx}
                  block={block} idx={idx} total={p.blocks.length}
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

        {/* Right */}
        <div className="ms-col ms-col-sticky">
          <section className="ms-section">
            <div className="ms-sec-head" style={{ justifyContent: 'space-between' }}>
              <span>Aperçu</span>
              <div className="ms-device">
                {([['mobile', Smartphone], ['desktop', Monitor]] as const).map(([id, Icon]) => (
                  <button key={id} onClick={() => p.setPreviewDevice(id)} className={`ms-device-btn ${p.previewDevice === id ? 'on' : ''}`}>
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {p.previewHtml ? (
              <div className="ms-preview" data-device={p.previewDevice}>
                <iframe
                  title="Aperçu email" srcDoc={p.previewHtml} sandbox=""
                  style={{ width: p.previewDevice === 'mobile' ? 375 : '100%', height: 560, border: 'none', borderRadius: 8, background: '#111' }}
                />
              </div>
            ) : (
              <div className="ms-preview-empty">
                <Eye size={20} style={{ opacity: 0.35 }} />
                <p>Cliquez « Aperçu » pour voir le rendu</p>
              </div>
            )}
          </section>

          <section className="ms-section">
            <div className="ms-sec-head">
              <Send size={13} style={{ color: C.t3 }} />
              <span>Envoyer un test</span>
            </div>
            <div className="ms-send-row">
              <input type="email" value={p.testEmail} onChange={e => p.setTestEmail(e.target.value)}
                placeholder="email@exemple.com" className="ms-send-input" />
              <button onClick={p.onSendTest} disabled={p.testing || !p.testEmail} className="ms-btn-ghost">
                {p.testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Envoyer
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
    <div className={`ms-block ${expanded ? 'open' : ''}`}>
      <div className="ms-block-head" onClick={onToggle}>
        <div className="ms-block-left">
          <GripVertical size={12} style={{ color: C.t3, flexShrink: 0 }} />
          <div className="ms-block-icon"><Icon size={13} /></div>
          <span className="ms-block-label">{meta?.label || block.type}</span>
        </div>
        <div className="ms-block-right">
          <span className="ms-block-idx">{idx + 1}</span>
          {expanded ? <ChevronUp size={13} color={C.t3} /> : <ChevronDown size={13} color={C.t3} />}
        </div>
      </div>

      {expanded && (
        <div className="ms-block-body">
          <div className="ms-block-actions">
            <button onClick={onMoveUp} disabled={idx === 0} className="ms-act"><ChevronUp size={12} /> Haut</button>
            <button onClick={onMoveDown} disabled={idx === total - 1} className="ms-act"><ChevronDown size={12} /> Bas</button>
            <button onClick={onDuplicate} className="ms-act"><Copy size={12} /> Dupliquer</button>
            <button onClick={onRemove} className="ms-act danger"><Trash2 size={12} /> Supprimer</button>
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
      <div className="ms-props">
        <PropField label="Texte du lien" value={props.linkText || ''} onChange={v => onUpdate('linkText', v)} placeholder="Se connecter" />
        <PropField label="URL du lien" value={props.linkUrl || ''} onChange={v => onUpdate('linkUrl', v)} placeholder="https://terangaexchange.com" />
      </div>
    );
  }

  if (type === 'hero-image') {
    return (
      <div className="ms-props">
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
      <div className="ms-props">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Grand titre…" />
        <PropField label="Sous-titre" value={props.subtitle || ''} onChange={v => onUpdate('subtitle', v)} />
        <PropSelect label="Alignement" value={props.align || 'left'} onChange={v => onUpdate('align', v)}
          options={[{ v: 'left', l: 'Gauche' }, { v: 'center', l: 'Centré' }]} />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="ms-props">
        <PropField label="Formule d'accueil" value={props.greeting || ''} onChange={v => onUpdate('greeting', v)} placeholder="Bonjour {{prenom}}," />
        <PropTextarea label="Texte" value={props.text || ''} onChange={v => onUpdate('text', v)} placeholder="Paragraphes séparés par une ligne vide…" />
      </div>
    );
  }

  if (type === 'highlight-box') {
    return (
      <div className="ms-props">
        <PropField label="Libellé" value={props.label || ''} onChange={v => onUpdate('label', v)} placeholder="TAUX DU JOUR" />
        <PropField label="Valeur" value={props.value || ''} onChange={v => onUpdate('value', v)} placeholder="585 CFA / USDT" />
        <PropField label="Sous-texte" value={props.sub || ''} onChange={v => onUpdate('sub', v)} />
      </div>
    );
  }

  if (type === 'cta-button') {
    return (
      <div className="ms-props">
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
      <div className="ms-props">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Détails de la transaction" />
        <div className="ms-field">
          <label>Lignes</label>
          <div className="ms-lines">
            {lines.map((line, i) => (
              <div key={i} className="ms-line">
                <input value={line.label} onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], label: e.target.value }; onUpdate('lines', nl); }} placeholder="Libellé" />
                <input value={line.value} onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], value: e.target.value }; onUpdate('lines', nl); }} placeholder="Valeur" />
                <button onClick={() => onUpdate('lines', lines.filter((_, j) => j !== i))} className="ms-act danger" style={{ padding: '5px 7px' }}><X size={12} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => onUpdate('lines', [...lines, { label: '', value: '' }])} className="ms-chip" style={{ marginTop: 8 }}><Plus size={12} /> Ligne</button>
        </div>
      </div>
    );
  }

  if (type === 'feature-row') {
    const features: { icon?: string; title: string; text: string }[] = props.features || [];
    return (
      <div className="ms-props">
        <PropSelect label="Colonnes" value={String(props.columns || 2)} onChange={v => onUpdate('columns', Number(v))}
          options={[{ v: '2', l: '2 colonnes' }, { v: '3', l: '3 colonnes' }]} />
        <div className="ms-field">
          <label>Fonctionnalités</label>
          {features.map((f, i) => (
            <div key={i} className="ms-feature">
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={f.icon || ''} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], icon: e.target.value }; onUpdate('features', nf); }} placeholder="Emoji" style={{ width: 54, flexShrink: 0 }} />
                <input value={f.title} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], title: e.target.value }; onUpdate('features', nf); }} placeholder="Titre" style={{ flex: 1 }} />
                <button onClick={() => onUpdate('features', features.filter((_, j) => j !== i))} className="ms-act danger" style={{ padding: '5px 7px' }}><X size={12} /></button>
              </div>
              <input value={f.text} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], text: e.target.value }; onUpdate('features', nf); }} placeholder="Description" />
            </div>
          ))}
          <button onClick={() => onUpdate('features', [...features, { title: '', text: '' }])} className="ms-chip" style={{ marginTop: 8 }}><Plus size={12} /> Feature</button>
        </div>
      </div>
    );
  }

  if (type === 'quiet-divider') {
    return (
      <div className="ms-props">
        <PropField label="Espacement (px)" value={String(props.spacing ?? 8)} onChange={v => onUpdate('spacing', Number(v) || 8)} />
      </div>
    );
  }

  if (type === 'footer') {
    return (
      <div className="ms-props">
        <PropField label="URL désinscription" value={props.unsubscribeUrl || ''} onChange={v => onUpdate('unsubscribeUrl', v)} placeholder="https://…/unsubscribe" />
        <PropTextarea label="Note" value={props.note || ''} onChange={v => onUpdate('note', v)} />
      </div>
    );
  }

  return <p style={{ color: C.t3, fontSize: 12, padding: '8px 0' }}>Aucune propriété éditable.</p>;
}

// ── Field components ─────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="ms-field"><label>{label}</label>{children}</div>;
}

function PropField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="ms-field">
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function PropTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="ms-field">
      <label>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} />
    </div>
  );
}

function PropSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[];
}) {
  return (
    <div className="ms-field">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles — 100% monochrome, dérivé de adminTheme.ts
// ═══════════════════════════════════════════════════════════════════════════════
const studioStyles = `
.ms-btn-primary {
  display: inline-flex; align-items: center; gap: 6px; height: 36px;
  padding: 0 16px; border-radius: 9px; background: ${C.accent}; border: none;
  color: #111; font-size: 12px; font-weight: 400; font-family: ${FONT};
  cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.ms-btn-primary:hover { background: ${C.accentHover}; }
.ms-btn-primary:disabled { opacity: 0.5; cursor: default; }

.ms-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px; height: 36px;
  padding: 0 14px; border-radius: 9px; background: transparent;
  border: 1px solid ${C.bd}; color: ${C.t2}; font-size: 12px; font-weight: 400;
  font-family: ${FONT}; cursor: pointer; white-space: nowrap; transition: all 0.15s;
}
.ms-btn-ghost:hover { border-color: ${C.accentBd}; color: ${C.accent}; }
.ms-btn-ghost.on { border-color: ${C.accentBd}; color: ${C.accent}; background: ${C.accentSoft}; }
.ms-btn-ghost:disabled { opacity: 0.45; cursor: default; }

.ms-chip {
  display: inline-flex; align-items: center; gap: 4px; height: 26px;
  padding: 0 10px; background: ${C.accentSoft}; border: 1px solid ${C.accentBd};
  border-radius: 7px; color: ${C.accent}; font-size: 11px; font-weight: 400;
  font-family: ${FONT}; cursor: pointer; transition: opacity 0.15s;
}
.ms-chip:hover { opacity: 0.82; }

.ms-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 7px; background: transparent;
  border: 1px solid ${C.bds}; color: ${C.t3}; cursor: pointer; transition: all 0.12s;
}
.ms-icon-btn:hover { color: ${C.accent}; border-color: ${C.accentBd}; }

/* Toolbar */
.ms-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ms-toolbar-label { color: ${C.t3}; font-size: 12px; }

/* AI panel — monochrome */
.ms-ai-panel { background: ${C.l1}; border: 1px solid ${C.bd}; border-radius: 14px; overflow: hidden; animation: crm-in 0.2s ease both; }
.ms-ai-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid ${C.bds}; }
.ms-ai-icon { width: 32px; height: 32px; border-radius: 9px; background: ${C.l3}; display: flex; align-items: center; justify-content: center; color: ${C.t1}; }
.ms-ai-title { color: ${C.t1}; font-size: 13px; font-weight: 400; margin: 0; }
.ms-ai-sub { color: ${C.t3}; font-size: 11px; margin: 2px 0 0; }
.ms-ai-body { padding: 16px 18px; }
.ms-ai-textarea {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${C.bd};
  border-radius: 9px; color: ${C.t1}; font-size: 13px; padding: 11px 13px; outline: none;
  resize: vertical; min-height: 68px; font-family: ${FONT}; line-height: 1.5; box-sizing: border-box;
  transition: border-color 0.15s;
}
.ms-ai-textarea:focus { border-color: ${C.accentBd}; }
.ms-ai-textarea::placeholder { color: ${C.t3}; }
.ms-ai-actions { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-top: 12px; }
.ms-ai-hint { color: ${C.t3}; font-size: 11px; margin: 2px 0 0; flex: 1; line-height: 1.5; }

/* Layout */
.ms-layout { display: grid; grid-template-columns: 1fr 400px; gap: 18px; align-items: start; }
@media (max-width: 1080px) { .ms-layout { grid-template-columns: 1fr; } }
.ms-col { display: flex; flex-direction: column; gap: 16px; }
.ms-col-sticky { position: sticky; top: 16px; }

/* Sections */
.ms-section { background: ${C.l1}; border: 1px solid ${C.bds}; border-radius: 14px; padding: 18px 20px; }
.ms-sec-head {
  display: flex; align-items: center; gap: 8px; color: ${C.t3}; font-size: 11px;
  font-weight: 400; text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 16px;
}

/* Meta grid */
.ms-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 620px) { .ms-meta-grid { grid-template-columns: 1fr; } }

/* Fields */
.ms-field { display: flex; flex-direction: column; gap: 6px; }
.ms-field label { color: ${C.t3}; font-size: 10.5px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.1em; }
.ms-field input, .ms-field select, .ms-field textarea, .ms-line input, .ms-feature input {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${C.bd};
  border-radius: 9px; color: ${C.t1}; font-size: 13px; padding: 9px 12px; outline: none;
  font-family: ${FONT}; box-sizing: border-box; transition: border-color 0.15s;
}
.ms-field input:focus, .ms-field select:focus, .ms-field textarea:focus,
.ms-line input:focus, .ms-feature input:focus { border-color: ${C.accentBd}; }
.ms-field input::placeholder, .ms-field textarea::placeholder,
.ms-line input::placeholder, .ms-feature input::placeholder { color: ${C.t3}; }
.ms-field textarea { resize: vertical; min-height: 76px; line-height: 1.55; }
.ms-field select { appearance: none; -webkit-appearance: none; }

/* Status pill */
.ms-status {
  display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 11px;
  border-radius: 7px; font-size: 11px; font-weight: 400; font-family: ${FONT};
  border: 1px solid ${C.bds}; background: transparent; color: ${C.t2};
}
.ms-status.clickable { cursor: pointer; transition: all 0.12s; }
.ms-status.clickable:hover { border-color: ${C.bdh}; }
.ms-status .ms-dot { width: 6px; height: 6px; border-radius: 50%; background: ${C.t3}; }
.ms-status.live { color: ${C.t1}; border-color: ${C.accentBd}; background: ${C.accentSoft}; }
.ms-status.live .ms-dot { background: ${C.accent}; }

.ms-cat { display: inline-flex; align-items: center; height: 26px; padding: 0 10px; border-radius: 7px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: ${C.t3}; background: ${C.l3}; }

/* Palette */
.ms-palette {
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 14px;
  padding: 10px; border-radius: 11px; background: ${C.l2}; border: 1px solid ${C.bds};
  animation: crm-in 0.15s ease both;
}
@media (max-width: 620px) { .ms-palette { grid-template-columns: 1fr; } }
.ms-palette-item { display: flex; align-items: center; gap: 10px; padding: 9px 11px; border-radius: 9px; background: transparent; border: 1px solid transparent; cursor: pointer; transition: all 0.12s; text-align: left; }
.ms-palette-item:hover { background: ${C.l3}; border-color: ${C.bd}; }
.ms-palette-icon { width: 32px; height: 32px; border-radius: 8px; background: ${C.l3}; display: flex; align-items: center; justify-content: center; color: ${C.t2}; flex-shrink: 0; }
.ms-palette-item:hover .ms-palette-icon { color: ${C.t1}; }
.ms-palette-label { display: block; font-size: 12px; font-weight: 400; color: ${C.t1}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ms-palette-desc { display: block; font-size: 10.5px; color: ${C.t3}; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Block list */
.ms-block-list { display: flex; flex-direction: column; gap: 4px; }
.ms-blocks-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px 16px; color: ${C.t3}; font-size: 12.5px; }
.ms-blocks-empty p { margin: 0; }

.ms-block { border: 1px solid ${C.bds}; border-radius: 11px; overflow: hidden; transition: all 0.12s; }
.ms-block.open { border-color: ${C.bd}; background: rgba(255,255,255,0.012); }
.ms-block:hover:not(.open) { border-color: ${C.bd}; }
.ms-block-head { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; cursor: pointer; user-select: none; }
.ms-block-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ms-block-right { display: flex; align-items: center; gap: 6px; }
.ms-block-icon { width: 26px; height: 26px; border-radius: 7px; background: ${C.l3}; display: flex; align-items: center; justify-content: center; color: ${C.t2}; flex-shrink: 0; }
.ms-block-label { color: ${C.t1}; font-size: 12.5px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ms-block-idx { color: ${C.t3}; font-size: 10px; font-weight: 400; background: ${C.l3}; padding: 2px 7px; border-radius: 5px; font-variant-numeric: tabular-nums; }
.ms-block-body { padding: 0 12px 14px; border-top: 1px solid ${C.bds}; }
.ms-block-actions { display: flex; gap: 4px; padding: 11px 0; flex-wrap: wrap; }
.ms-act { display: inline-flex; align-items: center; gap: 4px; padding: 5px 9px; border-radius: 7px; font-size: 10.5px; font-weight: 400; font-family: ${FONT}; background: transparent; border: 1px solid ${C.bds}; color: ${C.t2}; cursor: pointer; transition: all 0.1s; }
.ms-act:hover { border-color: ${C.accentBd}; color: ${C.accent}; }
.ms-act:disabled { opacity: 0.3; cursor: default; }
.ms-act.danger { color: ${C.t2}; }
.ms-act.danger:hover { border-color: rgba(239,68,68,0.5); color: #f87171; }

.ms-props { display: flex; flex-direction: column; gap: 11px; padding-top: 2px; }
.ms-lines { display: flex; flex-direction: column; gap: 6px; }
.ms-line { display: flex; gap: 6px; align-items: center; }
.ms-line input { flex: 1; }
.ms-feature { display: flex; flex-direction: column; gap: 6px; padding: 8px 0; border-bottom: 1px solid ${C.bds}; }
.ms-feature:last-of-type { border-bottom: none; }

/* Preview */
.ms-preview { display: flex; justify-content: center; background: #0d0d0d; border-radius: 10px; padding: 12px; overflow: hidden; }
.ms-preview[data-device="mobile"] { padding: 16px 0; }
.ms-preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 56px 20px; background: #0d0d0d; border-radius: 10px; color: ${C.t3}; font-size: 12.5px; }
.ms-preview-empty p { margin: 0; }
.ms-device { display: flex; gap: 3px; }
.ms-device-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 28px; border-radius: 7px; cursor: pointer; border: 1px solid ${C.bds}; background: transparent; color: ${C.t3}; transition: all 0.12s; }
.ms-device-btn.on { background: ${C.accentSoft}; border-color: ${C.accentBd}; color: ${C.accent}; }
.ms-device-btn:hover:not(.on) { border-color: ${C.bdh}; color: ${C.t2}; }

/* Send */
.ms-send-row { display: flex; gap: 8px; }
.ms-send-input { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid ${C.bd}; border-radius: 9px; color: ${C.t1}; font-size: 13px; padding: 9px 12px; outline: none; font-family: ${FONT}; box-sizing: border-box; transition: border-color 0.15s; }
.ms-send-input:focus { border-color: ${C.accentBd}; }
.ms-send-input::placeholder { color: ${C.t3}; }

/* List */
.ms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.ms-tpl-card { background: ${C.l1}; border: 1px solid ${C.bds}; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.16s; display: flex; flex-direction: column; }
.ms-tpl-card:hover { border-color: ${C.bdh}; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(0,0,0,0.35); }
.ms-tpl-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 0; }
.ms-tpl-badges { display: flex; gap: 6px; align-items: center; }
.ms-tpl-del { background: none; border: none; cursor: pointer; color: ${C.t3}; padding: 5px; border-radius: 7px; transition: all 0.12s; display: flex; }
.ms-tpl-del:hover { color: #f87171; background: rgba(239,68,68,0.08); }
.ms-tpl-body { padding: 12px 16px 14px; flex: 1; }
.ms-tpl-title { color: ${C.t1}; font-size: 14px; font-weight: 400; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ms-tpl-subject { color: ${C.t3}; font-size: 12px; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ms-tpl-foot { display: flex; align-items: center; gap: 5px; padding: 10px 16px; border-top: 1px solid ${C.bds}; color: ${C.t3}; font-size: 11px; }

/* States */
.ms-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 60px 20px; color: ${C.t3}; font-size: 13px; }
.ms-empty { background: ${C.l1}; border: 1px solid ${C.bds}; border-radius: 14px; text-align: center; padding: 56px 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ms-empty-icon { width: 52px; height: 52px; border-radius: 13px; background: ${C.l3}; display: flex; align-items: center; justify-content: center; color: ${C.t2}; margin-bottom: 4px; }
.ms-empty h3 { color: ${C.t1}; font-size: 15px; font-weight: 400; margin: 0; }
.ms-empty p { color: ${C.t3}; font-size: 13px; margin: 0 0 12px; max-width: 320px; line-height: 1.5; }
`;
