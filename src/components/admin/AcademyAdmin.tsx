import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, ArrowLeft, Trash2, GripVertical, Save, Loader2,
  BookOpen, Video, FileText, Type, Radio, ChevronRight,
  Users, Search, X, Check,
} from 'lucide-react';
import { PageHeader, drillStyles } from '@/components/admin/AdminDrill';
import {
  C, FONT, card, cardHeaderRow, cardTitle, btnPrimary, btnGhost,
  inputStyle, chipAction, listRowStyle, iconButton,
  primaryHoverIn, primaryHoverOut, ghostHoverIn, ghostHoverOut,
  iconButtonHoverIn, iconButtonHoverOut, pillSmall,
} from '@/components/admin/adminTheme';

type Course = {
  id: string; title: string; slug: string; description: string | null;
  price_cfa: number; level: string; status: string; duration_hours: number | null;
  created_at: string;
};
type Module = {
  id: string; course_id: string; title: string; position: number;
};
type Lesson = {
  id: string; module_id: string; title: string; content_type: string;
  content_url: string | null; content_text: string | null;
  zoom_date: string | null; duration_min: number | null;
  position: number; is_free_preview: boolean;
};
type Enrollment = {
  id: string; user_id: string; course_id: string; status: string;
  expires_at: string | null; enrolled_at: string;
  email?: string; full_name?: string;
};

const LEVELS = [
  { v: 'debutant', l: 'Débutant' },
  { v: 'intermediaire', l: 'Intermédiaire' },
  { v: 'avance', l: 'Avancé' },
];
const STATUSES = [
  { v: 'draft', l: 'Brouillon' },
  { v: 'published', l: 'Publié' },
  { v: 'archived', l: 'Archivé' },
];
const CONTENT_TYPES = [
  { v: 'video', l: 'Vidéo', icon: Video },
  { v: 'pdf', l: 'PDF', icon: FileText },
  { v: 'text', l: 'Texte', icon: Type },
  { v: 'zoom', l: 'Zoom', icon: Radio },
];

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function AcademyAdmin() {
  const [view, setView] = useState<'list' | 'editor' | 'enrollments'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  if (view === 'editor') return <CourseEditor id={editingId} onBack={() => { setView('list'); setEditingId(null); }} />;
  if (view === 'enrollments') return <EnrollmentManager onBack={() => setView('list')} />;
  return <CourseList onNew={() => { setEditingId(null); setView('editor'); }} onEdit={id => { setEditingId(id); setView('editor'); }} onEnrollments={() => setView('enrollments')} />;
}

function CourseList({ onNew, onEdit, onEnrollments }: { onNew: () => void; onEdit: (id: string) => void; onEnrollments: () => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('courses' as any).select('*').order('created_at', { ascending: false });
    setCourses((data as any[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusDot = (s: string) => s === 'published' ? '#4ade80' : s === 'archived' ? '#f87171' : C.t3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{drillStyles}</style>
      <PageHeader title="Terex Academy" sub="Gestion des formations crypto et blockchain" />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button style={btnPrimary} onMouseEnter={e => primaryHoverIn(e.currentTarget)} onMouseLeave={e => primaryHoverOut(e.currentTarget)} onClick={onNew}>
          <Plus size={14} /> Nouvelle formation
        </button>
        <button style={btnGhost} onMouseEnter={e => ghostHoverIn(e.currentTarget)} onMouseLeave={e => ghostHoverOut(e.currentTarget)} onClick={onEnrollments}>
          <Users size={14} /> Inscriptions
        </button>
      </div>

      <div style={card}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Formations ({courses.length})</span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} /></div>
        ) : courses.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: C.t3, fontSize: 13, fontFamily: FONT }}>
            Aucune formation. Créez la première.
          </div>
        ) : courses.map((c, i) => (
          <div key={c.id} style={{ ...listRowStyle(i === courses.length - 1), cursor: 'pointer' }}
            onClick={() => onEdit(c.id)}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={15} color={C.t3} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.t1, fontSize: 13, fontFamily: FONT, fontWeight: 400 }}>{c.title}</div>
              <div style={{ color: C.t3, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>
                {LEVELS.find(l => l.v === c.level)?.l} · {c.price_cfa === 0 ? 'Gratuit' : `${c.price_cfa.toLocaleString()} CFA`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.t2, fontFamily: FONT }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot(c.status) }} />
                {STATUSES.find(s => s.v === c.status)?.l}
              </span>
              <ChevronRight size={14} color={C.t3} />
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CourseEditor({ id, onBack }: { id: string | null; onBack: () => void }) {
  const isNew = !id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('debutant');
  const [priceCfa, setPriceCfa] = useState(0);
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [status, setStatus] = useState('draft');

  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [courseId, setCourseId] = useState<string | null>(id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data: c } = await supabase.from('courses' as any).select('*').eq('id', id).single();
      if (c) {
        const course = c as any;
        setTitle(course.title); setSlug(course.slug); setDescription(course.description ?? '');
        setLevel(course.level); setPriceCfa(course.price_cfa); setStatus(course.status);
        setDurationHours(course.duration_hours ?? '');
      }
      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', id).order('position');
      const modList = (mods as any[]) ?? [];
      const withLessons = await Promise.all(modList.map(async (m: any) => {
        const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', m.id).order('position');
        return { ...m, lessons: (ls as any[]) ?? [] };
      }));
      setModules(withLessons);
      setLoading(false);
    })();
  }, [id]);

  const saveCourse = async () => {
    setSaving(true);
    const payload: any = {
      title, slug: slug || slugify(title), description: description || null,
      level, price_cfa: priceCfa, status,
      duration_hours: durationHours === '' ? null : Number(durationHours),
    };

    let savedId = courseId;
    if (isNew && !courseId) {
      const { data, error } = await supabase.from('courses' as any).insert(payload).select('id').single();
      if (error) { alert('Erreur: ' + error.message); setSaving(false); return; }
      savedId = (data as any).id;
      setCourseId(savedId);
    } else {
      const { error } = await supabase.from('courses' as any).update(payload).eq('id', savedId);
      if (error) { alert('Erreur: ' + error.message); setSaving(false); return; }
    }

    for (let mi = 0; mi < modules.length; mi++) {
      const m = modules[mi];
      const mPayload: any = { course_id: savedId, title: m.title, position: mi };
      let modId = m.id;
      if (m.id.startsWith('new-')) {
        const { data, error } = await supabase.from('course_modules' as any).insert(mPayload).select('id').single();
        if (error) continue;
        modId = (data as any).id;
      } else {
        await supabase.from('course_modules' as any).update(mPayload).eq('id', modId);
      }

      for (let li = 0; li < m.lessons.length; li++) {
        const l = m.lessons[li];
        const lPayload: any = {
          module_id: modId, title: l.title, content_type: l.content_type,
          content_url: l.content_url || null, content_text: l.content_text || null,
          zoom_date: l.zoom_date || null, duration_min: l.duration_min || null,
          position: li, is_free_preview: l.is_free_preview,
        };
        if (l.id.startsWith('new-')) {
          await supabase.from('lessons' as any).insert(lPayload);
        } else {
          await supabase.from('lessons' as any).update(lPayload).eq('id', l.id);
        }
      }
    }
    setSaving(false);
    onBack();
  };

  const addModule = () => {
    setModules(prev => [...prev, { id: 'new-' + Date.now(), course_id: courseId ?? '', title: '', position: prev.length, lessons: [] }]);
  };

  const addLesson = (moduleIndex: number) => {
    setModules(prev => prev.map((m, i) => i !== moduleIndex ? m : {
      ...m, lessons: [...m.lessons, {
        id: 'new-' + Date.now(), module_id: m.id, title: '', content_type: 'video',
        content_url: null, content_text: null, zoom_date: null, duration_min: null,
        position: m.lessons.length, is_free_preview: false,
      }]
    }));
  };

  const updateModule = (mi: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => i !== mi ? m : { ...m, [field]: value }));
  };

  const updateLesson = (mi: number, li: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => i !== mi ? m : {
      ...m, lessons: m.lessons.map((l, j) => j !== li ? l : { ...l, [field]: value })
    }));
  };

  const removeModule = async (mi: number) => {
    const m = modules[mi];
    if (!m.id.startsWith('new-')) {
      await supabase.from('course_modules' as any).delete().eq('id', m.id);
    }
    setModules(prev => prev.filter((_, i) => i !== mi));
  };

  const removeLesson = async (mi: number, li: number) => {
    const l = modules[mi].lessons[li];
    if (!l.id.startsWith('new-')) {
      await supabase.from('lessons' as any).delete().eq('id', l.id);
    }
    setModules(prev => prev.map((m, i) => i !== mi ? m : { ...m, lessons: m.lessons.filter((_, j) => j !== li) }));
  };

  const deleteCourse = async () => {
    if (!courseId || courseId.startsWith('new-')) { onBack(); return; }
    if (!confirm('Supprimer cette formation et tout son contenu ?')) return;
    await supabase.from('courses' as any).delete().eq('id', courseId);
    onBack();
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div className="drill-page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{drillStyles}{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ ...iconButton, width: 32, height: 32 }} onClick={onBack}
          onMouseEnter={e => iconButtonHoverIn(e.currentTarget)} onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
          <ArrowLeft size={15} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.t1, fontSize: 15, fontWeight: 500, fontFamily: FONT }}>{isNew ? 'Nouvelle formation' : 'Modifier la formation'}</div>
        </div>
        <button style={{ ...btnGhost, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }} onClick={deleteCourse}>
          <Trash2 size={13} /> Supprimer
        </button>
        <button style={btnPrimary} onClick={saveCourse} disabled={saving}
          onMouseEnter={e => primaryHoverIn(e.currentTarget)} onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
          Enregistrer
        </button>
      </div>

      {/* Course fields */}
      <div style={card}>
        <div style={cardHeaderRow}><span style={cardTitle}>Informations</span></div>
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Titre">
            <input style={inputStyle} value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(slugify(e.target.value)); }}
              placeholder="Ex: Crypto pour débutants" />
          </Field>
          <Field label="Slug (URL)">
            <input style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} placeholder="crypto-pour-debutants" />
          </Field>
          <Field label="Description">
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez le contenu de cette formation..." />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Field label="Niveau">
              <select style={inputStyle} value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
              </select>
            </Field>
            <Field label="Prix (CFA)">
              <input style={inputStyle} type="number" value={priceCfa} onChange={e => setPriceCfa(Number(e.target.value))} min={0} />
            </Field>
            <Field label="Durée (heures)">
              <input style={inputStyle} type="number" value={durationHours} onChange={e => setDurationHours(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
            </Field>
          </div>
          <Field label="Statut">
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUSES.map(s => (
                <button key={s.v} style={pillSmall(status === s.v)} onClick={() => setStatus(s.v)}>{s.l}</button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      {/* Modules & lessons */}
      <div style={card}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Modules & leçons</span>
          <button style={chipAction} onClick={addModule}><Plus size={12} /> Module</button>
        </div>
        {modules.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: C.t3, fontSize: 12, fontFamily: FONT }}>
            Ajoutez un module pour structurer le cours.
          </div>
        ) : modules.map((m, mi) => (
          <div key={m.id} style={{ borderBottom: mi < modules.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.01)' }}>
              <GripVertical size={14} color={C.t3} style={{ flexShrink: 0 }} />
              <span style={{ color: C.t3, fontSize: 11, fontFamily: FONT, flexShrink: 0, width: 28 }}>M{mi + 1}</span>
              <input style={{ ...inputStyle, fontWeight: 500, fontSize: 13 }} value={m.title} placeholder="Titre du module"
                onChange={e => updateModule(mi, 'title', e.target.value)} />
              <button style={chipAction} onClick={() => addLesson(mi)}><Plus size={11} /> Leçon</button>
              <button style={{ ...iconButton, width: 26, height: 26 }} onClick={() => removeModule(mi)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
                <Trash2 size={12} />
              </button>
            </div>
            {m.lessons.map((l, li) => (
              <LessonRow key={l.id} lesson={l} index={li} isLast={li === m.lessons.length - 1}
                onUpdate={(f, v) => updateLesson(mi, li, f, v)}
                onRemove={() => removeLesson(mi, li)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson, index, isLast, onUpdate, onRemove }: {
  lesson: Lesson; index: number; isLast: boolean;
  onUpdate: (field: string, value: any) => void; onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(lesson.id.startsWith('new-'));
  const Icon = CONTENT_TYPES.find(ct => ct.v === lesson.content_type)?.icon ?? Type;

  return (
    <div style={{ marginLeft: 38, borderBottom: isLast ? 'none' : `1px solid ${C.bds}` }}>
      <div style={{ padding: '10px 18px 10px 0', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}>
        <Icon size={13} color={C.t3} />
        <span style={{ color: C.t2, fontSize: 11, fontFamily: FONT, flexShrink: 0 }}>L{index + 1}</span>
        <span style={{ flex: 1, color: lesson.title ? C.t1 : C.t3, fontSize: 12.5, fontFamily: FONT }}>
          {lesson.title || 'Sans titre'}
        </span>
        {lesson.is_free_preview && <span style={{ fontSize: 9, color: C.t3, border: `1px solid ${C.bds}`, borderRadius: 5, padding: '2px 6px', fontFamily: FONT }}>PREVIEW</span>}
        <ChevronRight size={12} color={C.t3} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {expanded && (
        <div style={{ padding: '0 18px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Field label="Titre">
            <input style={inputStyle} value={lesson.title} onChange={e => onUpdate('title', e.target.value)} placeholder="Titre de la leçon" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Type">
              <div style={{ display: 'flex', gap: 4 }}>
                {CONTENT_TYPES.map(ct => (
                  <button key={ct.v} style={pillSmall(lesson.content_type === ct.v)} onClick={() => onUpdate('content_type', ct.v)}>
                    <ct.icon size={11} /> {ct.l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Durée (min)">
              <input style={inputStyle} type="number" value={lesson.duration_min ?? ''} onChange={e => onUpdate('duration_min', e.target.value === '' ? null : Number(e.target.value))} min={0} />
            </Field>
          </div>
          {(lesson.content_type === 'video' || lesson.content_type === 'pdf') && (
            <Field label={lesson.content_type === 'video' ? 'URL vidéo' : 'URL du PDF'}>
              <input style={inputStyle} value={lesson.content_url ?? ''} onChange={e => onUpdate('content_url', e.target.value)} placeholder="https://..." />
            </Field>
          )}
          {lesson.content_type === 'text' && (
            <Field label="Contenu texte">
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={lesson.content_text ?? ''} onChange={e => onUpdate('content_text', e.target.value)} />
            </Field>
          )}
          {lesson.content_type === 'zoom' && (
            <Field label="Date de la session Zoom">
              <input style={inputStyle} type="datetime-local" value={lesson.zoom_date?.slice(0, 16) ?? ''} onChange={e => onUpdate('zoom_date', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: C.t2, fontSize: 12, fontFamily: FONT }}>
              <input type="checkbox" checked={lesson.is_free_preview} onChange={e => onUpdate('is_free_preview', e.target.checked)} />
              Aperçu gratuit
            </label>
            <button style={{ ...iconButton, width: 26, height: 26 }} onClick={onRemove}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EnrollmentManager({ onBack }: { onBack: () => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('courses' as any).select('*').order('title');
      const c = (data as any[]) ?? [];
      setCourses(c);
      if (c.length > 0) setSelectedCourse(c[0].id);
      setLoading(false);
    })();
  }, []);

  const loadEnrollments = useCallback(async (courseId: string) => {
    if (!courseId) return;
    const { data } = await supabase.from('enrollments' as any).select('*').eq('course_id', courseId).order('enrolled_at', { ascending: false });
    const enrs = (data as any[]) ?? [];
    const withProfiles = await Promise.all(enrs.map(async (e: any) => {
      const { data: p } = await supabase.rpc('admin_get_user_info', { user_uuid: e.user_id });
      const info = (p as any[])?.[0];
      return { ...e, email: info?.email, full_name: info?.full_name };
    }));
    setEnrollments(withProfiles);
  }, []);

  useEffect(() => { if (selectedCourse) loadEnrollments(selectedCourse); }, [selectedCourse, loadEnrollments]);

  const searchUsers = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    const { data } = await supabase.rpc('admin_search_users', { search_term: searchEmail.trim() });
    setSearchResults((data as any[]) ?? []);
    setSearching(false);
  };

  const enrollUser = async (userId: string) => {
    if (!selectedCourse) return;
    setEnrolling(true);
    const { error } = await supabase.from('enrollments' as any).insert({
      user_id: userId, course_id: selectedCourse, status: 'active',
    } as any);
    if (error) {
      if (error.code === '23505') alert('Cet utilisateur est déjà inscrit à cette formation.');
      else alert('Erreur: ' + error.message);
    } else {
      setSearchEmail('');
      setSearchResults([]);
      loadEnrollments(selectedCourse);
    }
    setEnrolling(false);
  };

  const revokeEnrollment = async (enrollmentId: string) => {
    if (!confirm("Révoquer l'accès de cet utilisateur ?")) return;
    await supabase.from('enrollments' as any).update({ status: 'revoked' } as any).eq('id', enrollmentId);
    loadEnrollments(selectedCourse);
  };

  const reactivateEnrollment = async (enrollmentId: string) => {
    await supabase.from('enrollments' as any).update({ status: 'active' } as any).eq('id', enrollmentId);
    loadEnrollments(selectedCourse);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div className="drill-page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{drillStyles}{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ ...iconButton, width: 32, height: 32 }} onClick={onBack}
          onMouseEnter={e => iconButtonHoverIn(e.currentTarget)} onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
          <ArrowLeft size={15} />
        </button>
        <div style={{ color: C.t1, fontSize: 15, fontWeight: 500, fontFamily: FONT }}>Inscriptions</div>
      </div>

      {/* Course selector */}
      <div style={card}>
        <div style={cardHeaderRow}><span style={cardTitle}>Sélectionner une formation</span></div>
        <div style={{ padding: 14 }}>
          <select style={inputStyle} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({STATUSES.find(s => s.v === c.status)?.l})</option>)}
          </select>
        </div>
      </div>

      {/* Enroll user */}
      <div style={card}>
        <div style={cardHeaderRow}><span style={cardTitle}>Inscrire un utilisateur</span></div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} value={searchEmail} onChange={e => setSearchEmail(e.target.value)}
              placeholder="Email, nom ou Terex ID..." onKeyDown={e => e.key === 'Enter' && searchUsers()} />
            <button style={btnPrimary} onClick={searchUsers} disabled={searching}
              onMouseEnter={e => primaryHoverIn(e.currentTarget)} onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
              {searching ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div style={{ border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden' }}>
              {searchResults.map((u, i) => (
                <div key={u.id} style={{ ...listRowStyle(i === searchResults.length - 1), justifyContent: 'space-between' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.t1, fontSize: 12.5, fontFamily: FONT }}>{u.full_name || 'Sans nom'}</div>
                    <div style={{ color: C.t3, fontSize: 11, fontFamily: FONT }}>{u.email} {u.terex_id ? `· ${u.terex_id}` : ''}</div>
                  </div>
                  <button style={chipAction} onClick={() => enrollUser(u.id)} disabled={enrolling}>
                    <Plus size={11} /> Inscrire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current enrollments */}
      <div style={card}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Inscrits ({enrollments.filter(e => e.status === 'active').length})</span>
        </div>
        {enrollments.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: C.t3, fontSize: 12, fontFamily: FONT }}>
            Aucune inscription pour cette formation.
          </div>
        ) : enrollments.map((e, i) => (
          <div key={e.id} style={listRowStyle(i === enrollments.length - 1)}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.t1, fontSize: 12.5, fontFamily: FONT }}>{e.full_name || 'Sans nom'}</div>
              <div style={{ color: C.t3, fontSize: 11, fontFamily: FONT }}>{e.email} · {new Date(e.enrolled_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10, fontFamily: FONT, padding: '3px 8px', borderRadius: 6,
                background: e.status === 'active' ? 'rgba(74,222,128,0.1)' : e.status === 'revoked' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)',
                color: e.status === 'active' ? '#4ade80' : e.status === 'revoked' ? '#f87171' : C.t3,
                border: `1px solid ${e.status === 'active' ? 'rgba(74,222,128,0.2)' : e.status === 'revoked' ? 'rgba(248,113,113,0.2)' : C.bds}`,
              }}>
                {e.status === 'active' ? 'Actif' : e.status === 'revoked' ? 'Révoqué' : 'Expiré'}
              </span>
              {e.status === 'active' ? (
                <button style={{ ...iconButton, width: 26, height: 26 }} onClick={() => revokeEnrollment(e.id)}
                  onMouseEnter={e2 => { e2.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e2.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={e2 => iconButtonHoverOut(e2.currentTarget)} title="Révoquer">
                  <X size={12} />
                </button>
              ) : e.status === 'revoked' ? (
                <button style={{ ...iconButton, width: 26, height: 26 }} onClick={() => reactivateEnrollment(e.id)}
                  onMouseEnter={e2 => iconButtonHoverIn(e2.currentTarget)}
                  onMouseLeave={e2 => iconButtonHoverOut(e2.currentTarget)} title="Réactiver">
                  <Check size={12} />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: C.t3, fontSize: 11, fontFamily: FONT, letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  );
}
