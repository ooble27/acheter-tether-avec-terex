import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, ArrowLeft, Trash2, GripVertical, Save, Loader2,
  BookOpen, Video, FileText, Type, Radio, ChevronRight,
  Users, Search, X, Check, HelpCircle, Circle,
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
  cover_url: string | null;
  created_at: string;
};
type Module = {
  id: string; course_id: string; title: string; position: number;
  summary: string | null;
};
type QuizAnswer = { id: string; question_id: string; answer: string; is_correct: boolean; position: number };
type QuizQuestion = { id: string; quiz_id: string; question: string; explanation: string | null; position: number; answers: QuizAnswer[] };
type Quiz = { id: string; module_id: string; title: string; description: string | null; pass_score: number; questions: QuizQuestion[] };
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

type ModuleFull = Module & { lessons: Lesson[]; quiz: Quiz | null };

function CourseEditor({ id, onBack }: { id: string | null; onBack: () => void }) {
  const isNew = !id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [level, setLevel] = useState('debutant');
  const [priceCfa, setPriceCfa] = useState(0);
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [status, setStatus] = useState('draft');

  const [modules, setModules] = useState<ModuleFull[]>([]);
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
        setCoverUrl(course.cover_url ?? '');
      }
      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', id).order('position');
      const modList = (mods as any[]) ?? [];
      const withLessons = await Promise.all(modList.map(async (m: any) => {
        const [{ data: ls }, { data: q }] = await Promise.all([
          supabase.from('lessons' as any).select('*').eq('module_id', m.id).order('position'),
          supabase.from('quizzes' as any).select('*').eq('module_id', m.id).maybeSingle(),
        ]);
        let quiz: Quiz | null = null;
        if (q) {
          const quizRow = q as any;
          const { data: questions } = await supabase.from('quiz_questions' as any).select('*').eq('quiz_id', quizRow.id).order('position');
          const questionsList = (questions as any[]) ?? [];
          const withAnswers = await Promise.all(questionsList.map(async (qu: any) => {
            const { data: answers } = await supabase.from('quiz_answers' as any).select('*').eq('question_id', qu.id).order('position');
            return { ...qu, answers: (answers as any[]) ?? [] };
          }));
          quiz = { ...quizRow, questions: withAnswers };
        }
        return { ...m, lessons: (ls as any[]) ?? [], quiz };
      }));
      setModules(withLessons);
      setLoading(false);
    })();
  }, [id]);

  const saveCourse = async () => {
    setSaving(true);
    const payload: any = {
      title, slug: slug || slugify(title), description: description || null,
      cover_url: coverUrl || null,
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
      const mPayload: any = { course_id: savedId, title: m.title, position: mi, summary: m.summary || null };
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

      // Quiz save
      if (m.quiz) {
        const qPayload: any = {
          module_id: modId, title: m.quiz.title,
          description: m.quiz.description || null, pass_score: m.quiz.pass_score,
        };
        let quizId = m.quiz.id;
        if (m.quiz.id.startsWith('new-')) {
          const { data, error } = await supabase.from('quizzes' as any).insert(qPayload).select('id').single();
          if (error) continue;
          quizId = (data as any).id;
        } else {
          await supabase.from('quizzes' as any).update(qPayload).eq('id', quizId);
        }

        for (let qi = 0; qi < m.quiz.questions.length; qi++) {
          const qu = m.quiz.questions[qi];
          const quPayload: any = {
            quiz_id: quizId, question: qu.question,
            explanation: qu.explanation || null, position: qi,
          };
          let questionId = qu.id;
          if (qu.id.startsWith('new-')) {
            const { data, error } = await supabase.from('quiz_questions' as any).insert(quPayload).select('id').single();
            if (error) continue;
            questionId = (data as any).id;
          } else {
            await supabase.from('quiz_questions' as any).update(quPayload).eq('id', questionId);
          }

          for (let ai = 0; ai < qu.answers.length; ai++) {
            const a = qu.answers[ai];
            const aPayload: any = {
              question_id: questionId, answer: a.answer, is_correct: a.is_correct, position: ai,
            };
            if (a.id.startsWith('new-')) {
              await supabase.from('quiz_answers' as any).insert(aPayload);
            } else {
              await supabase.from('quiz_answers' as any).update(aPayload).eq('id', a.id);
            }
          }
        }
      }
    }
    setSaving(false);
    onBack();
  };

  const addModule = () => {
    setModules(prev => [...prev, { id: 'new-' + Date.now(), course_id: courseId ?? '', title: '', position: prev.length, summary: null, lessons: [], quiz: null }]);
  };

  const addQuiz = (mi: number) => {
    setModules(prev => prev.map((m, i) => i !== mi ? m : {
      ...m,
      quiz: {
        id: 'new-' + Date.now(), module_id: m.id, title: 'Quiz du module',
        description: null, pass_score: 70,
        questions: [{
          id: 'new-q-' + Date.now(), quiz_id: '', question: '', explanation: null, position: 0,
          answers: [
            { id: 'new-a-' + Date.now() + '-1', question_id: '', answer: '', is_correct: true,  position: 0 },
            { id: 'new-a-' + Date.now() + '-2', question_id: '', answer: '', is_correct: false, position: 1 },
          ],
        }],
      },
    }));
  };

  const removeQuiz = async (mi: number) => {
    const m = modules[mi];
    if (m.quiz && !m.quiz.id.startsWith('new-')) {
      if (!confirm('Supprimer le quiz de ce module ?')) return;
      await supabase.from('quizzes' as any).delete().eq('id', m.quiz.id);
    }
    setModules(prev => prev.map((mo, i) => i !== mi ? mo : { ...mo, quiz: null }));
  };

  const updateQuiz = (mi: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => i !== mi ? m : { ...m, quiz: m.quiz ? { ...m.quiz, [field]: value } : m.quiz }));
  };

  const addQuestion = (mi: number) => {
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: [...m.quiz.questions, {
            id: 'new-q-' + Date.now(), quiz_id: m.quiz.id, question: '', explanation: null,
            position: m.quiz.questions.length,
            answers: [
              { id: 'new-a-' + Date.now() + '-1', question_id: '', answer: '', is_correct: true,  position: 0 },
              { id: 'new-a-' + Date.now() + '-2', question_id: '', answer: '', is_correct: false, position: 1 },
            ],
          }],
        },
      };
    }));
  };

  const removeQuestion = async (mi: number, qi: number) => {
    const q = modules[mi].quiz?.questions[qi];
    if (q && !q.id.startsWith('new-')) {
      await supabase.from('quiz_questions' as any).delete().eq('id', q.id);
    }
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return { ...m, quiz: { ...m.quiz, questions: m.quiz.questions.filter((_, j) => j !== qi) } };
    }));
  };

  const updateQuestion = (mi: number, qi: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: m.quiz.questions.map((q, j) => j !== qi ? q : { ...q, [field]: value }),
        },
      };
    }));
  };

  const addAnswer = (mi: number, qi: number) => {
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: m.quiz.questions.map((q, j) => j !== qi ? q : {
            ...q,
            answers: [...q.answers, {
              id: 'new-a-' + Date.now(), question_id: q.id, answer: '', is_correct: false,
              position: q.answers.length,
            }],
          }),
        },
      };
    }));
  };

  const removeAnswer = async (mi: number, qi: number, ai: number) => {
    const a = modules[mi].quiz?.questions[qi].answers[ai];
    if (a && !a.id.startsWith('new-')) {
      await supabase.from('quiz_answers' as any).delete().eq('id', a.id);
    }
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: m.quiz.questions.map((q, j) => j !== qi ? q : {
            ...q, answers: q.answers.filter((_, k) => k !== ai),
          }),
        },
      };
    }));
  };

  const updateAnswer = (mi: number, qi: number, ai: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: m.quiz.questions.map((q, j) => j !== qi ? q : {
            ...q, answers: q.answers.map((a, k) => k !== ai ? a : { ...a, [field]: value }),
          }),
        },
      };
    }));
  };

  const setCorrectAnswer = (mi: number, qi: number, ai: number) => {
    setModules(prev => prev.map((m, i) => {
      if (i !== mi || !m.quiz) return m;
      return {
        ...m,
        quiz: {
          ...m.quiz,
          questions: m.quiz.questions.map((q, j) => j !== qi ? q : {
            ...q, answers: q.answers.map((a, k) => ({ ...a, is_correct: k === ai })),
          }),
        },
      };
    }));
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
          <Field label="URL de couverture (image)">
            <input style={inputStyle} value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..." />
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
              {!m.quiz && (
                <button style={chipAction} onClick={() => addQuiz(mi)}><HelpCircle size={11} /> Quiz</button>
              )}
              <button style={{ ...iconButton, width: 26, height: 26 }} onClick={() => removeModule(mi)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
                <Trash2 size={12} />
              </button>
            </div>
            <div style={{ padding: '0 18px 10px 60px' }}>
              <textarea
                style={{ ...inputStyle, minHeight: 40, resize: 'vertical', fontSize: 12 }}
                value={m.summary ?? ''}
                placeholder="Résumé du module (1-2 phrases, affiché sur la fiche formation)"
                onChange={e => updateModule(mi, 'summary', e.target.value)} />
            </div>
            {m.lessons.map((l, li) => (
              <LessonRow key={l.id} lesson={l} index={li} isLast={li === m.lessons.length - 1 && !m.quiz}
                onUpdate={(f, v) => updateLesson(mi, li, f, v)}
                onRemove={() => removeLesson(mi, li)} />
            ))}
            {m.quiz && (
              <QuizEditor
                quiz={m.quiz}
                onUpdateQuiz={(f, v) => updateQuiz(mi, f, v)}
                onAddQuestion={() => addQuestion(mi)}
                onUpdateQuestion={(qi, f, v) => updateQuestion(mi, qi, f, v)}
                onRemoveQuestion={qi => removeQuestion(mi, qi)}
                onAddAnswer={qi => addAnswer(mi, qi)}
                onUpdateAnswer={(qi, ai, f, v) => updateAnswer(mi, qi, ai, f, v)}
                onSetCorrect={(qi, ai) => setCorrectAnswer(mi, qi, ai)}
                onRemoveAnswer={(qi, ai) => removeAnswer(mi, qi, ai)}
                onRemoveQuiz={() => removeQuiz(mi)}
              />
            )}
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

function QuizEditor({
  quiz, onUpdateQuiz, onAddQuestion, onUpdateQuestion, onRemoveQuestion,
  onAddAnswer, onUpdateAnswer, onSetCorrect, onRemoveAnswer, onRemoveQuiz,
}: {
  quiz: Quiz;
  onUpdateQuiz: (field: string, value: any) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (qi: number, field: string, value: any) => void;
  onRemoveQuestion: (qi: number) => void;
  onAddAnswer: (qi: number) => void;
  onUpdateAnswer: (qi: number, ai: number, field: string, value: any) => void;
  onSetCorrect: (qi: number, ai: number) => void;
  onRemoveAnswer: (qi: number, ai: number) => void;
  onRemoveQuiz: () => void;
}) {
  return (
    <div style={{ marginLeft: 38, padding: '14px 18px', borderTop: `1px solid ${C.bds}`, background: 'rgba(255,255,255,0.008)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <HelpCircle size={14} color={C.t2} />
        <span style={{ color: C.t1, fontSize: 12.5, fontFamily: FONT, fontWeight: 500 }}>Quiz du module</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C.t3, fontSize: 11, fontFamily: FONT }}>
          Seuil de réussite : {quiz.pass_score}%
        </span>
        <button style={{ ...iconButton, width: 26, height: 26 }} onClick={onRemoveQuiz}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => iconButtonHoverOut(e.currentTarget)} title="Supprimer le quiz">
          <Trash2 size={12} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 12 }}>
        <input style={{ ...inputStyle, fontSize: 12.5 }} value={quiz.title}
          onChange={e => onUpdateQuiz('title', e.target.value)} placeholder="Titre du quiz" />
        <input style={{ ...inputStyle, fontSize: 12.5 }} type="number" min={0} max={100}
          value={quiz.pass_score} onChange={e => onUpdateQuiz('pass_score', Math.max(0, Math.min(100, Number(e.target.value))))} />
      </div>

      {quiz.questions.map((q, qi) => (
        <div key={q.id} style={{
          background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, padding: 12, marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ color: C.t3, fontSize: 11, fontFamily: FONT, flexShrink: 0 }}>Q{qi + 1}</span>
            <input style={{ ...inputStyle, fontSize: 12.5, fontWeight: 500 }} value={q.question}
              onChange={e => onUpdateQuestion(qi, 'question', e.target.value)} placeholder="Question…" />
            <button style={{ ...iconButton, width: 24, height: 24 }} onClick={() => onRemoveQuestion(qi)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => iconButtonHoverOut(e.currentTarget)} title="Supprimer la question">
              <X size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {q.answers.map((a, ai) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => onSetCorrect(qi, ai)}
                  title={a.is_correct ? 'Bonne réponse' : 'Marquer comme bonne réponse'}
                  style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: a.is_correct ? 'rgba(74,222,128,0.15)' : 'transparent',
                    border: `1.5px solid ${a.is_correct ? '#4ade80' : C.bd}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#4ade80',
                  }}>
                  {a.is_correct && <Check size={11} />}
                </button>
                <input style={{ ...inputStyle, fontSize: 12 }} value={a.answer}
                  onChange={e => onUpdateAnswer(qi, ai, 'answer', e.target.value)}
                  placeholder={`Réponse ${ai + 1}`} />
                {q.answers.length > 2 && (
                  <button style={{ ...iconButton, width: 22, height: 22 }} onClick={() => onRemoveAnswer(qi, ai)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => iconButtonHoverOut(e.currentTarget)}>
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
            <button style={{ ...chipAction, alignSelf: 'flex-start', marginTop: 2 }} onClick={() => onAddAnswer(qi)}>
              <Plus size={10} /> Ajouter une réponse
            </button>
          </div>

          <textarea
            style={{ ...inputStyle, fontSize: 12, minHeight: 40, resize: 'vertical' }}
            value={q.explanation ?? ''}
            onChange={e => onUpdateQuestion(qi, 'explanation', e.target.value)}
            placeholder="Explication affichée après la réponse (optionnel)" />
        </div>
      ))}

      <button style={chipAction} onClick={onAddQuestion}>
        <Plus size={11} /> Ajouter une question
      </button>
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
