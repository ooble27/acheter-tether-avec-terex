/**
 * Mail Studio — éditeur de templates email par blocs.
 *
 * Vues :
 *   1. Liste   — tous les templates sauvegardés + bouton « Nouveau ».
 *   2. Éditeur — palette de blocs, JSON props par bloc, aperçu live (iframe).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Trash2, Eye, Loader2, ArrowLeft, Send, TestTube, Save,
  GripVertical, ChevronDown, ChevronUp, Copy, LayoutGrid,
  Smartphone, Monitor, Type, Image, Columns, MousePointerClick,
  Receipt, Minus, FileText, Sparkles, X,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const INPUT_BG = 'rgba(255,255,255,0.04)';

const cardStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20,
};
const inputStyle: React.CSSProperties = {
  width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
  color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' as const,
};

// ── Block type metadata ─────────────────────────────────────────────────
const BLOCK_TYPES: { type: string; label: string; icon: any; defaultProps: Record<string, any> }[] = [
  { type: 'brand-header',        label: 'En-tête Terex',   icon: LayoutGrid,         defaultProps: {} },
  { type: 'hero-image',          label: 'Image héro',      icon: Image,              defaultProps: { src: '', alt: '', height: 320 } },
  { type: 'big-title',           label: 'Grand titre',     icon: Type,               defaultProps: { title: '', subtitle: '', align: 'left' } },
  { type: 'text',                label: 'Texte',           icon: FileText,           defaultProps: { text: '', greeting: '' } },
  { type: 'highlight-box',       label: 'Chiffre clé',     icon: Sparkles,           defaultProps: { label: '', value: '', sub: '' } },
  { type: 'feature-row',         label: 'Fonctionnalités', icon: Columns,            defaultProps: { features: [{ title: '', text: '' }], columns: 2 } },
  { type: 'cta-button',          label: 'Bouton CTA',      icon: MousePointerClick,  defaultProps: { text: 'Accéder à Terex', url: 'https://terangaexchange.com/dashboard', style: 'brand' } },
  { type: 'transaction-receipt', label: 'Reçu',            icon: Receipt,            defaultProps: { title: 'Détails', lines: [{ label: '', value: '' }] } },
  { type: 'quiet-divider',       label: 'Séparateur',      icon: Minus,              defaultProps: {} },
  { type: 'footer',              label: 'Pied de page',    icon: FileText,           defaultProps: { note: 'Vous recevez cet e-mail parce que vous avez un compte sur Terex.' } },
];

const CATEGORIES = [
  { id: 'marketing',      label: 'Marketing' },
  { id: 'transactional',  label: 'Transactionnel' },
  { id: 'onboarding',     label: 'Onboarding' },
  { id: 'reactivation',   label: 'Réactivation' },
];

interface BlockSpec { type: string; props: Record<string, any> }
interface TemplateRecord {
  id: string; name: string; subject: string; preview_text: string;
  blocks: BlockSpec[]; category: string; is_draft: boolean;
  created_at: string; updated_at: string;
}

type View = 'list' | 'editor';

// ── API helper ──────────────────────────────────────────────────────────
async function api(action: string, extra: Record<string, any> = {}) {
  const { data, error } = await supabase.functions.invoke('mail-studio-api', {
    body: { action, ...extra },
  });
  if (error) throw new Error(error.message || 'Erreur API');
  if (data?.error) throw new Error(data.error);
  return data;
}

// ═════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════
export function MailStudioAdmin() {
  const [view, setView] = useState<View>('list');
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor state
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
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  // ── Load templates ──────────────────────────────────────────────────
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

  // ── Editor helpers ──────────────────────────────────────────────────
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
        subject: subject || 'Aperçu', preview_text: previewText || subject,
        blocks,
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

  // ── Block operations ────────────────────────────────────────────────
  const addBlock = (type: string) => {
    const meta = BLOCK_TYPES.find(b => b.type === type);
    if (!meta) return;
    const newBlock: BlockSpec = { type, props: JSON.parse(JSON.stringify(meta.defaultProps)) };
    setBlocks(prev => [...prev, newBlock]);
    setExpandedBlock(blocks.length);
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
      <style>{drillStyles}</style>
      <PageHeader
        title="Mail Studio"
        sub="Créez et gérez vos templates email par blocs"
        right={view === 'list' ? (
          <button onClick={openNew} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 12,
            background: '#fff', border: 'none', color: '#141414',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <Plus size={14} /> Nouveau template
          </button>
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
          onBack={() => setView('list')}
          onSave={saveTemplate}
          onRefreshPreview={refreshPreview}
          onSendTest={sendTest}
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

// ═════════════════════════════════════════════════════════════════════════
// List View
// ═════════════════════════════════════════════════════════════════════════
interface ListProps {
  templates: TemplateRecord[]; loading: boolean;
  onNew: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void;
}

function ListView({ templates, loading, onNew, onEdit, onDelete }: ListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
        Chargement…
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
        <LayoutGrid size={32} color="#4b5563" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Aucun template</p>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 16px' }}>Créez votre premier template email par blocs.</p>
        <button onClick={onNew} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 12,
          background: '#fff', border: 'none', color: '#141414',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> Créer un template
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(t => (
        <button key={t.id} onClick={() => onEdit(t.id)}
          className="text-left transition-all"
          style={{
            ...cardStyle, padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = BORDER; }}
        >
          <div style={{ padding: '18px 20px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: t.is_draft ? '#fbbf24' : '#34d399',
                background: t.is_draft ? 'rgba(251,191,36,0.10)' : 'rgba(52,211,153,0.10)',
                padding: '2px 8px', borderRadius: 6,
              }}>
                {t.is_draft ? 'Brouillon' : 'Publié'}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 500, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {CATEGORIES.find(c => c.id === t.category)?.label || t.category}
              </span>
            </div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t.name}
            </p>
            <p style={{ color: '#6b7280', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t.subject || '(pas de sujet)'}
            </p>
          </div>
          <div style={{
            padding: '10px 20px', borderTop: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: '#4b5563', fontSize: 11 }}>
              {new Date(t.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onDelete(t.id); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4,
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Editor View
// ═════════════════════════════════════════════════════════════════════════
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
  onBack: () => void;
  onSave: () => void;
  onRefreshPreview: () => void;
  onSendTest: () => void;
  onAddBlock: (type: string) => void;
  onRemoveBlock: (idx: number) => void;
  onMoveBlock: (idx: number, dir: -1 | 1) => void;
  onUpdateProp: (idx: number, key: string, value: any) => void;
  onDuplicate: (idx: number) => void;
}

function EditorView(p: EditorProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={p.onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 12,
            background: CARD, border: `1px solid ${BORDER}`,
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <ArrowLeft size={14} /> Retour
          </button>
          <span style={{ color: '#6b7280', fontSize: 12 }}>
            {p.editId ? 'Modifier' : 'Nouveau'} template
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={p.onRefreshPreview} disabled={p.previewLoading}
            style={{
              ...ghostBtn, opacity: p.previewLoading ? 0.5 : 1,
            }}>
            {p.previewLoading ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Aperçu
          </button>
          <button onClick={p.onSave} disabled={p.saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 12,
              background: '#fff', border: 'none', color: '#141414',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              opacity: p.saving ? 0.5 : 1,
            }}>
            {p.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Enregistrer
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5 items-start">
        {/* Left — blocks editor */}
        <div className="flex flex-col gap-4">
          {/* Meta fields */}
          <section style={cardStyle}>
            <SLabel text="Informations" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label style={labelStyle}>Nom du template</label>
                <input value={p.name} onChange={e => p.setName(e.target.value)}
                  placeholder="Mon template…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={p.category} onChange={e => p.setCategory(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' as const }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sujet</label>
                <input value={p.subject} onChange={e => p.setSubject(e.target.value)}
                  placeholder="Sujet de l'email…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Texte d'aperçu</label>
                <input value={p.previewText} onChange={e => p.setPreviewText(e.target.value)}
                  placeholder="Visible sous le sujet…" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => p.setIsDraft(!p.isDraft)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${p.isDraft ? 'rgba(251,191,36,0.30)' : 'rgba(52,211,153,0.30)'}`,
                  background: p.isDraft ? 'rgba(251,191,36,0.08)' : 'rgba(52,211,153,0.08)',
                  color: p.isDraft ? '#fbbf24' : '#34d399',
                  fontSize: 11, fontWeight: 600,
                }}>
                {p.isDraft ? 'Brouillon' : 'Publié'}
              </button>
            </div>
          </section>

          {/* Block list */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SLabel text={`Blocs (${p.blocks.length})`} />
            </div>

            {p.blocks.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: 20 }}>
                Aucun bloc — ajoutez-en depuis la palette ci-dessous.
              </p>
            )}

            <div className="flex flex-col gap-2">
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

            {/* Block palette */}
            <div style={{ marginTop: 16, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
              <SLabel text="Ajouter un bloc" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {BLOCK_TYPES.map(bt => {
                  const Icon = bt.icon;
                  return (
                    <button key={bt.type} onClick={() => p.onAddBlock(bt.type)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '7px 12px', borderRadius: 10,
                        background: INPUT_BG, border: `1px solid ${BORDER}`,
                        color: '#9ca3af', fontSize: 11.5, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = '#9ca3af'; }}
                    >
                      <Icon size={13} /> {bt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right — preview + send test (sticky) */}
        <div className="flex flex-col gap-4" style={{ position: 'sticky', top: 16 }}>
          {/* Device toggle + preview */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SLabel text="Aperçu" />
              <div style={{ display: 'flex', gap: 4 }}>
                {([['mobile', Smartphone], ['desktop', Monitor]] as const).map(([id, Icon]) => (
                  <button key={id} onClick={() => p.setPreviewDevice(id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${p.previewDevice === id ? 'rgba(255,255,255,0.25)' : BORDER}`,
                      background: p.previewDevice === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: p.previewDevice === id ? '#fff' : '#6b7280',
                    }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {p.previewHtml ? (
              <div style={{
                display: 'flex', justifyContent: 'center', background: '#111',
                borderRadius: 12, padding: p.previewDevice === 'mobile' ? '16px 0' : 8,
                overflow: 'hidden',
              }}>
                <iframe
                  title="Aperçu email"
                  srcDoc={p.previewHtml}
                  sandbox=""
                  style={{
                    width: p.previewDevice === 'mobile' ? 375 : '100%',
                    height: 520, border: 'none', borderRadius: 8,
                    background: '#1a1a1a',
                  }}
                />
              </div>
            ) : (
              <div style={{
                background: '#111', borderRadius: 12, padding: '60px 20px',
                textAlign: 'center', color: '#4b5563', fontSize: 13,
              }}>
                <Eye size={24} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ margin: 0 }}>Cliquez « Aperçu » pour voir le rendu</p>
              </div>
            )}
          </section>

          {/* Send test */}
          <section style={{ ...cardStyle, background: '#181818' }}>
            <SLabel text="Envoyer un test" />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input type="email" value={p.testEmail} onChange={e => p.setTestEmail(e.target.value)}
                placeholder="Email de test…"
                style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
              <button onClick={p.onSendTest} disabled={p.testing || !p.testEmail}
                style={{
                  ...ghostBtn,
                  opacity: (p.testing || !p.testEmail) ? 0.5 : 1,
                }}>
                {p.testing ? <Loader2 size={14} className="animate-spin" /> : <TestTube size={14} />}
                Test
              </button>
            </div>
            <p style={{ color: '#4b5563', fontSize: 11, margin: '8px 0 0', lineHeight: 1.5 }}>
              Envoie le template actuel à l'adresse ci-dessus pour vérifier le rendu.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Block Item (collapsible editor for one block)
// ═════════════════════════════════════════════════════════════════════════
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
    <div style={{
      background: expanded ? 'rgba(255,255,255,0.03)' : 'transparent',
      border: `1px solid ${expanded ? 'rgba(255,255,255,0.12)' : BORDER}`,
      borderRadius: 12, overflow: 'hidden', transition: 'all 0.15s',
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        <GripVertical size={14} color="#4b5563" style={{ flexShrink: 0 }} />
        <Icon size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
        <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 500, flex: 1, minWidth: 0 }}>
          {meta?.label || block.type}
        </span>
        <span style={{ color: '#4b5563', fontSize: 10.5, flexShrink: 0 }}>#{idx + 1}</span>
        {expanded ? <ChevronUp size={14} color="#6b7280" /> : <ChevronDown size={14} color="#6b7280" />}
      </div>

      {/* Expanded — props editor */}
      {expanded && (
        <div style={{ padding: '0 12px 12px', borderTop: `1px solid ${BORDER}` }}>
          {/* Actions */}
          <div style={{ display: 'flex', gap: 4, padding: '8px 0 10px', flexWrap: 'wrap' }}>
            <SmallBtn icon={ChevronUp} label="Haut" onClick={onMoveUp} disabled={idx === 0} />
            <SmallBtn icon={ChevronDown} label="Bas" onClick={onMoveDown} disabled={idx === total - 1} />
            <SmallBtn icon={Copy} label="Dupliquer" onClick={onDuplicate} />
            <SmallBtn icon={Trash2} label="Supprimer" onClick={onRemove} danger />
          </div>

          {/* Dynamic props */}
          <BlockPropsEditor block={block} onUpdate={onUpdateProp} />
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Block Props Editor — render fields based on block type
// ═════════════════════════════════════════════════════════════════════════
function BlockPropsEditor({ block, onUpdate }: { block: BlockSpec; onUpdate: (key: string, val: any) => void }) {
  const { type, props } = block;

  if (type === 'brand-header') {
    return (
      <div className="flex flex-col gap-3">
        <PropField label="Texte du lien" value={props.linkText || ''} onChange={v => onUpdate('linkText', v)} placeholder="Se connecter" />
        <PropField label="URL du lien" value={props.linkUrl || ''} onChange={v => onUpdate('linkUrl', v)} placeholder="https://terangaexchange.com" />
      </div>
    );
  }

  if (type === 'hero-image') {
    return (
      <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-3">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Grand titre…" />
        <PropField label="Sous-titre" value={props.subtitle || ''} onChange={v => onUpdate('subtitle', v)} />
        <PropSelect label="Alignement" value={props.align || 'left'} onChange={v => onUpdate('align', v)}
          options={[{ v: 'left', l: 'Gauche' }, { v: 'center', l: 'Centré' }]} />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="flex flex-col gap-3">
        <PropField label="Formule d'accueil" value={props.greeting || ''} onChange={v => onUpdate('greeting', v)} placeholder="Bonjour {{prenom}}," />
        <PropTextarea label="Texte" value={props.text || ''} onChange={v => onUpdate('text', v)} placeholder="Paragraphes séparés par une ligne vide…" />
      </div>
    );
  }

  if (type === 'highlight-box') {
    return (
      <div className="flex flex-col gap-3">
        <PropField label="Libellé" value={props.label || ''} onChange={v => onUpdate('label', v)} placeholder="TAUX DU JOUR" />
        <PropField label="Valeur" value={props.value || ''} onChange={v => onUpdate('value', v)} placeholder="585 CFA / USDT" />
        <PropField label="Sous-texte" value={props.sub || ''} onChange={v => onUpdate('sub', v)} />
      </div>
    );
  }

  if (type === 'cta-button') {
    return (
      <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-3">
        <PropField label="Titre" value={props.title || ''} onChange={v => onUpdate('title', v)} placeholder="Détails de la transaction" />
        <div>
          <label style={labelStyle}>Lignes</label>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input value={line.label}
                onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], label: e.target.value }; onUpdate('lines', nl); }}
                placeholder="Libellé" style={{ ...inputStyle, flex: 1 }} />
              <input value={line.value}
                onChange={e => { const nl = [...lines]; nl[i] = { ...nl[i], value: e.target.value }; onUpdate('lines', nl); }}
                placeholder="Valeur" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => { const nl = lines.filter((_, j) => j !== i); onUpdate('lines', nl); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
                <X size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => onUpdate('lines', [...lines, { label: '', value: '' }])}
            style={{ ...ghostBtn, fontSize: 11, padding: '5px 10px' }}>
            <Plus size={12} /> Ligne
          </button>
        </div>
      </div>
    );
  }

  if (type === 'feature-row') {
    const features: { icon?: string; title: string; text: string }[] = props.features || [];
    return (
      <div className="flex flex-col gap-3">
        <PropSelect label="Colonnes" value={String(props.columns || 2)} onChange={v => onUpdate('columns', Number(v))}
          options={[{ v: '2', l: '2 colonnes' }, { v: '3', l: '3 colonnes' }]} />
        <div>
          <label style={labelStyle}>Fonctionnalités</label>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < features.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <input value={f.icon || ''} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], icon: e.target.value }; onUpdate('features', nf); }}
                  placeholder="Emoji" style={{ ...inputStyle, width: 50, flexShrink: 0 }} />
                <input value={f.title} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], title: e.target.value }; onUpdate('features', nf); }}
                  placeholder="Titre" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => onUpdate('features', features.filter((_, j) => j !== i))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
                  <X size={14} />
                </button>
              </div>
              <input value={f.text} onChange={e => { const nf = [...features]; nf[i] = { ...nf[i], text: e.target.value }; onUpdate('features', nf); }}
                placeholder="Description" style={inputStyle} />
            </div>
          ))}
          <button onClick={() => onUpdate('features', [...features, { title: '', text: '' }])}
            style={{ ...ghostBtn, fontSize: 11, padding: '5px 10px', marginTop: 6 }}>
            <Plus size={12} /> Feature
          </button>
        </div>
      </div>
    );
  }

  if (type === 'quiet-divider') {
    return (
      <PropField label="Espacement (px)" value={String(props.spacing ?? 8)} onChange={v => onUpdate('spacing', Number(v) || 8)} />
    );
  }

  if (type === 'footer') {
    return (
      <div className="flex flex-col gap-3">
        <PropField label="URL désinscription" value={props.unsubscribeUrl || ''} onChange={v => onUpdate('unsubscribeUrl', v)} placeholder="https://…/unsubscribe" />
        <PropTextarea label="Note" value={props.note || ''} onChange={v => onUpdate('note', v)} />
      </div>
    );
  }

  return <p style={{ color: '#6b7280', fontSize: 12 }}>Aucune propriété éditable.</p>;
}

// ═════════════════════════════════════════════════════════════════════════
// Shared mini-components
// ═════════════════════════════════════════════════════════════════════════
const labelStyle: React.CSSProperties = {
  display: 'block', color: '#6b7280', fontSize: 10.5, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px',
};

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 14px', borderRadius: 10,
  background: CARD, border: `1px solid ${BORDER}`,
  color: '#fff', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', whiteSpace: 'nowrap',
};

function SLabel({ text }: { text: string }) {
  return (
    <p style={{
      color: '#6b7280', fontSize: 10.5, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
    }}>
      {text}
    </p>
  );
}

function SmallBtn({ icon: Icon, label, onClick, disabled, danger }: {
  icon: any; label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 6, fontSize: 10.5,
        background: 'transparent', border: `1px solid ${BORDER}`,
        color: danger ? '#ef4444' : '#9ca3af', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}>
      <Icon size={11} /> {label}
    </button>
  );
}

function PropField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function PropTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={4}
        style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
    </div>
  );
}

function PropSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, appearance: 'none' as const }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
