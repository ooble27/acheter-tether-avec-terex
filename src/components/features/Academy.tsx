import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, BookOpen, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight,
  GraduationCap, Play, Loader2, Users,
} from 'lucide-react';

type Course = {
  id: string; title: string; slug: string; description: string | null;
  price_cfa: number; level: string; status: string; duration_hours: number | null;
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
  id: string; course_id: string; status: string; expires_at: string | null;
};
type Progress = {
  lesson_id: string; completed: boolean;
};

const LEVELS: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const TYPE_ICONS: Record<string, typeof Video> = { video: Video, pdf: FileText, text: Type, zoom: Radio };
const TYPE_LABELS: Record<string, string> = { video: 'Vidéo', pdf: 'PDF', text: 'Texte', zoom: 'Zoom' };

const BG = '#1a1a1a';
const CARD = '#222222';
const BORDER = 'rgba(255,255,255,0.09)';
const ACCENT = '#e5e5e5';

export function Academy({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'catalog' | 'course' | 'lesson'>('catalog');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);

  const openCourse = (id: string) => { setCourseId(id); setView('course'); };
  const openLesson = (lId: string, mId: string) => { setLessonId(lId); setModuleId(mId); setView('lesson'); };
  const backToCatalog = () => { setView('catalog'); setCourseId(null); };
  const backToCourse = () => { setView('course'); setLessonId(null); setModuleId(null); };

  if (view === 'lesson' && lessonId && courseId)
    return <LessonViewer lessonId={lessonId} courseId={courseId} onBack={backToCourse} />;
  if (view === 'course' && courseId)
    return <CourseDetail courseId={courseId} onBack={backToCatalog} onOpenLesson={openLesson} />;
  return <Catalog onBack={onBack} onOpenCourse={openCourse} />;
}

function Catalog({ onBack, onOpenCourse }: { onBack: () => void; onOpenCourse: (id: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('courses' as any).select('*').eq('status', 'published').order('created_at', { ascending: false });
      setCourses((c as any[]) ?? []);
      if (user) {
        const { data: e } = await supabase.from('enrollments' as any).select('*').eq('user_id', user.id);
        setEnrollments((e as any[]) ?? []);
      }
      setLoading(false);
    })();
  }, [user]);

  const isEnrolled = (courseId: string) => enrollments.some(e => e.course_id === courseId && e.status === 'active');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /></button>
        <div>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Terex Academy
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '2px 0 0' }}>Formations crypto & blockchain</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={20} color="#6b7280" style={{ animation: 'spin 1s linear infinite' }} /></div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <GraduationCap size={40} color="#444" style={{ marginBottom: 16 }} />
          <p style={{ color: '#6b7280', fontSize: 14 }}>Aucune formation disponible pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {courses.map(c => {
            const enrolled = isEnrolled(c.id);
            return (
              <div key={c.id} onClick={() => onOpenCourse(c.id)}
                style={{ background: CARD, borderRadius: 16, padding: isMobile ? 16 : 20, border: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#2c2c2c', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={20} color="#888" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>{c.title}</h3>
                      {enrolled && (
                        <span style={{ fontSize: 10, color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, padding: '2px 7px', whiteSpace: 'nowrap' }}>
                          Inscrit
                        </span>
                      )}
                    </div>
                    {c.description && <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5 }}>{c.description}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <Tag>{LEVELS[c.level] || c.level}</Tag>
                      {c.duration_hours && <Tag><Clock size={11} /> {c.duration_hours}h</Tag>}
                      <Tag>{c.price_cfa === 0 ? 'Gratuit' : `${c.price_cfa.toLocaleString()} CFA`}</Tag>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#555" style={{ flexShrink: 0, marginTop: 12 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CourseDetail({ courseId, onBack, onOpenLesson }: {
  courseId: string; onBack: () => void;
  onOpenLesson: (lessonId: string, moduleId: string) => void;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: c } = await supabase.from('courses' as any).select('*').eq('id', courseId).single();
      setCourse(c as any);

      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position');
      const modList = (mods as any[]) ?? [];
      const withLessons = await Promise.all(modList.map(async (m: any) => {
        const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', m.id).order('position');
        return { ...m, lessons: (ls as any[]) ?? [] };
      }));
      setModules(withLessons);

      if (user) {
        const { data: e } = await supabase.from('enrollments' as any).select('*')
          .eq('user_id', user.id).eq('course_id', courseId).eq('status', 'active').maybeSingle();
        setEnrolled(!!e);

        const { data: p } = await supabase.from('lesson_progress' as any).select('lesson_id, completed').eq('user_id', user.id);
        setProgress((p as any[]) ?? []);
      }
      setLoading(false);
    })();
  }, [courseId, user]);

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = progress.filter(p => p.completed).length;
  const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));
  const relevantCompleted = progress.filter(p => p.completed && allLessonIds.includes(p.lesson_id)).length;
  const pct = totalLessons > 0 ? Math.round((relevantCompleted / totalLessons) * 100) : 0;

  const isLessonDone = (id: string) => progress.some(p => p.lesson_id === id && p.completed);
  const canAccess = (lesson: Lesson) => enrolled || lesson.is_free_preview;

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={20} color="#6b7280" style={{ animation: 'spin 1s linear infinite' }} /></div>;
  if (!course) return <div style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>Formation introuvable.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>{course.title}</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '2px 0 0' }}>
            {LEVELS[course.level]} · {course.duration_hours ? `${course.duration_hours}h` : `${totalLessons} leçons`}
          </p>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>
      )}

      {/* Progress bar */}
      {enrolled && totalLessons > 0 && (
        <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Progression</span>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{relevantCompleted}/{totalLessons} · {pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', borderRadius: 3, background: pct === 100 ? '#4ade80' : '#fff', width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* Not enrolled notice */}
      {!enrolled && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock size={16} color="#6b7280" />
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
            Vous n'êtes pas inscrit à cette formation. Contactez l'équipe Terex pour obtenir l'accès.
          </p>
        </div>
      )}

      {/* Modules */}
      {modules.map((m, mi) => (
        <div key={m.id} style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: m.lessons.length > 0 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#555', fontSize: 11, fontWeight: 600, width: 24 }}>M{mi + 1}</span>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{m.title}</span>
              <span style={{ color: '#555', fontSize: 11, marginLeft: 'auto' }}>{m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}</span>
            </div>
          </div>
          {m.lessons.map((l, li) => {
            const Icon = TYPE_ICONS[l.content_type] || Type;
            const done = isLessonDone(l.id);
            const accessible = canAccess(l);
            return (
              <div key={l.id}
                onClick={() => accessible ? onOpenLesson(l.id, m.id) : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px',
                  borderBottom: li < m.lessons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  cursor: accessible ? 'pointer' : 'default',
                  opacity: accessible ? 1 : 0.5,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (accessible) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                {done ? <CheckCircle2 size={16} color="#4ade80" /> : accessible ? <Circle size={16} color="#444" /> : <Lock size={14} color="#444" />}
                <Icon size={14} color="#666" />
                <span style={{ flex: 1, color: done ? '#9ca3af' : '#e5e5e5', fontSize: 13, textDecoration: done ? 'line-through' : 'none' }}>{l.title || 'Sans titre'}</span>
                {l.is_free_preview && !enrolled && (
                  <span style={{ fontSize: 9, color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '2px 6px' }}>APERÇU</span>
                )}
                {l.duration_min && <span style={{ color: '#555', fontSize: 11 }}>{l.duration_min} min</span>}
                {accessible && <ChevronRight size={14} color="#444" />}
              </div>
            );
          })}
        </div>
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function LessonViewer({ lessonId, courseId, onBack }: {
  lessonId: string; courseId: string; onBack: () => void;
}) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: l } = await supabase.from('lessons' as any).select('*').eq('id', lessonId).single();
      setLesson(l as any);

      if (user) {
        const { data: p } = await supabase.from('lesson_progress' as any).select('completed')
          .eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();
        setCompleted(!!(p as any)?.completed);
      }
      setLoading(false);
    })();
  }, [lessonId, user]);

  const toggleComplete = async () => {
    if (!user) return;
    setMarking(true);
    const newState = !completed;

    const { data: existing } = await supabase.from('lesson_progress' as any)
      .select('id').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();

    if (existing) {
      await supabase.from('lesson_progress' as any).update({
        completed: newState,
        completed_at: newState ? new Date().toISOString() : null,
      } as any).eq('id', (existing as any).id);
    } else {
      await supabase.from('lesson_progress' as any).insert({
        user_id: user.id, lesson_id: lessonId,
        completed: newState,
        completed_at: newState ? new Date().toISOString() : null,
      } as any);
    }
    setCompleted(newState);
    setMarking(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={20} color="#6b7280" style={{ animation: 'spin 1s linear infinite' }} /></div>;
  if (!lesson) return <div style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>Leçon introuvable.</div>;

  const Icon = TYPE_ICONS[lesson.content_type] || Type;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon size={15} color="#888" />
            <span style={{ color: '#6b7280', fontSize: 12 }}>{TYPE_LABELS[lesson.content_type]}</span>
            {lesson.duration_min && <span style={{ color: '#555', fontSize: 11 }}>· {lesson.duration_min} min</span>}
          </div>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 18 : 22, fontWeight: 600, margin: '4px 0 0', letterSpacing: '-0.3px' }}>{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: 16 }}>
        {lesson.content_type === 'video' && lesson.content_url && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            {lesson.content_url.includes('youtube.com') || lesson.content_url.includes('youtu.be') ? (
              <iframe
                src={toYouTubeEmbed(lesson.content_url)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <source src={lesson.content_url} />
              </video>
            )}
          </div>
        )}

        {lesson.content_type === 'pdf' && lesson.content_url && (
          <div style={{ padding: 20 }}>
            <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 14, textDecoration: 'none', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
              <FileText size={20} color="#888" />
              <span style={{ flex: 1 }}>Ouvrir le document PDF</span>
              <ChevronRight size={14} color="#555" />
            </a>
          </div>
        )}

        {lesson.content_type === 'text' && lesson.content_text && (
          <div style={{ padding: isMobile ? 16 : 24, color: '#d4d4d4', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {lesson.content_text}
          </div>
        )}

        {lesson.content_type === 'zoom' && (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <Radio size={32} color="#888" style={{ marginBottom: 12 }} />
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 500, margin: '0 0 4px' }}>Session Zoom en direct</p>
            {lesson.zoom_date ? (
              <p style={{ color: '#9ca3af', fontSize: 13 }}>
                Prévue le {new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            ) : (
              <p style={{ color: '#6b7280', fontSize: 13 }}>Date à venir</p>
            )}
            {lesson.content_url && (
              <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 20px', borderRadius: 10, background: '#fff', color: '#1a1a1a', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <Play size={14} /> Rejoindre
              </a>
            )}
          </div>
        )}

        {!lesson.content_url && !lesson.content_text && lesson.content_type !== 'zoom' && (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
            Contenu à venir.
          </div>
        )}
      </div>

      {/* Mark complete button */}
      {user && (
        <button onClick={toggleComplete} disabled={marking}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: 14, borderRadius: 12, border: `1px solid ${completed ? 'rgba(74,222,128,0.3)' : BORDER}`,
            background: completed ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
            color: completed ? '#4ade80' : ACCENT, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
          {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {completed ? 'Terminé' : 'Marquer comme terminé'}
        </button>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 8px', border: `1px solid rgba(255,255,255,0.06)` }}>
      {children}
    </span>
  );
}

function toYouTubeEmbed(url: string): string {
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] ?? '';
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split(/[&#]/)[0] ?? '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

const backBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', cursor: 'pointer', flexShrink: 0,
};
