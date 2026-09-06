import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, BookOpen, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight, ChevronLeft,
  GraduationCap, Play, Loader2,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────
type Course = {
  id: string; title: string; slug: string; description: string | null;
  price_cfa: number; level: string; status: string; duration_hours: number | null;
};
type Module = { id: string; course_id: string; title: string; position: number };
type Lesson = {
  id: string; module_id: string; title: string; content_type: string;
  content_url: string | null; content_text: string | null;
  zoom_date: string | null; duration_min: number | null;
  position: number; is_free_preview: boolean;
};
type Enrollment = { id: string; course_id: string; status: string; expires_at: string | null };
type Progress = { lesson_id: string; completed: boolean };

// ─── Tokens (match du reste de l'app — DashboardHome / BuyUSDT) ─────────
const BG = '#1a1a1a';
const CARD = '#222222';
const CARD_HOVER = '#2a2a2a';
const BORDER = 'rgba(255,255,255,0.09)';
const BORDER_SOFT = 'rgba(255,255,255,0.05)';
const ICON_BG = '#2c2c2c';
const TEXT = '#ffffff';
const TEXT_DIM = '#9ca3af';
const TEXT_SUBTLE = '#6b7280';
const TEXT_MUTE = '#555555';

const LEVELS: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const TYPE_META: Record<string, { icon: typeof Video; label: string }> = {
  video: { icon: Video, label: 'Vidéo' },
  pdf:   { icon: FileText, label: 'PDF' },
  text:  { icon: Type, label: 'Lecture' },
  zoom:  { icon: Radio, label: 'Session Zoom' },
};

// ─── Root ───────────────────────────────────────────────────────────────
export function Academy({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'catalog' | 'course' | 'lesson'>('catalog');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>
      {view === 'catalog' && (
        <Catalog onBack={onBack} onOpenCourse={(id) => { setCourseId(id); setView('course'); }} />
      )}
      {view === 'course' && courseId && (
        <CourseDetail
          courseId={courseId}
          onBack={() => { setView('catalog'); setCourseId(null); }}
          onOpenLesson={(lId) => { setLessonId(lId); setView('lesson'); }}
        />
      )}
      {view === 'lesson' && lessonId && courseId && (
        <LessonViewer
          lessonId={lessonId}
          courseId={courseId}
          onBackToCourse={() => { setLessonId(null); setView('course'); }}
          onOpenLesson={(lId) => setLessonId(lId)}
        />
      )}
    </div>
  );
}

// ─── Catalog ────────────────────────────────────────────────────────────
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

  const isEnrolled = (id: string) => enrollments.some(e => e.course_id === id && e.status === 'active');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '16px 20px 100px' : '32px 32px 120px' }}>
      {/* Header — même pattern que les autres pages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /></button>
        <div>
          <h1 style={{ color: TEXT, fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Terex Academy
          </h1>
          <p style={{ color: TEXT_SUBTLE, fontSize: 13, margin: '2px 0 0' }}>Formations crypto & blockchain</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={20} color={TEXT_SUBTLE} style={{ animation: 'spin 1s linear infinite' }} /></div>
      ) : courses.length === 0 ? (
        <EmptyState label="Aucune formation disponible pour le moment." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} enrolled={isEnrolled(c.id)} onClick={() => onOpenCourse(c.id)} isMobile={isMobile} />
          ))}
        </div>
      )}
      <SpinKeyframe />
    </div>
  );
}

function CourseCard({ course, enrolled, onClick, isMobile }: {
  course: Course; enrolled: boolean; onClick: () => void; isMobile: boolean;
}) {
  return (
    <button onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: isMobile ? 16 : 20, color: TEXT, outline: 'none', WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = CARD_HOVER; }}
      onMouseLeave={e => { e.currentTarget.style.background = CARD; }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12, background: ICON_BG,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <GraduationCap size={20} color="rgba(255,255,255,0.9)" strokeWidth={1.6} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h3 style={{ color: TEXT, fontSize: 15, fontWeight: 600, margin: 0 }}>{course.title}</h3>
            {enrolled && <Chip color="#4ade80" bg="rgba(74,222,128,0.1)" border="rgba(74,222,128,0.2)">Inscrit</Chip>}
          </div>
          {course.description && (
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: '0 0 10px', lineHeight: 1.55 }}>
              {course.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Meta>{LEVELS[course.level] ?? course.level}</Meta>
            {course.duration_hours && <Meta><Clock size={11} /> {course.duration_hours}h</Meta>}
            <Meta>{course.price_cfa === 0 ? 'Gratuit' : `${course.price_cfa.toLocaleString('fr-FR')} CFA`}</Meta>
          </div>
        </div>
        <ChevronRight size={16} color={TEXT_MUTE} style={{ flexShrink: 0, marginTop: 12 }} />
      </div>
    </button>
  );
}

// ─── CourseDetail ───────────────────────────────────────────────────────
function CourseDetail({ courseId, onBack, onOpenLesson }: {
  courseId: string; onBack: () => void; onOpenLesson: (lId: string) => void;
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
      const [{ data: c }, { data: mods }] = await Promise.all([
        supabase.from('courses' as any).select('*').eq('id', courseId).single(),
        supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position'),
      ]);
      setCourse(c as any);
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

  const totalLessons = useMemo(() => modules.reduce((s, m) => s + m.lessons.length, 0), [modules]);
  const relevantCompleted = useMemo(() => {
    const ids = new Set(modules.flatMap(m => m.lessons.map(l => l.id)));
    return progress.filter(p => p.completed && ids.has(p.lesson_id)).length;
  }, [modules, progress]);
  const pct = totalLessons > 0 ? Math.round((relevantCompleted / totalLessons) * 100) : 0;
  const isLessonDone = (id: string) => progress.some(p => p.lesson_id === id && p.completed);
  const canAccess = (l: Lesson) => enrolled || l.is_free_preview;

  if (loading) return <FullLoader />;
  if (!course) return <EmptyState label="Formation introuvable." />;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '16px 20px 100px' : '32px 32px 140px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={backBtn}><ArrowLeft size={18} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: TEXT, fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25 }}>
            {course.title}
          </h1>
          <p style={{ color: TEXT_SUBTLE, fontSize: 13, margin: '4px 0 0' }}>
            {LEVELS[course.level]} · {modules.length} modules · {course.duration_hours ? `${course.duration_hours}h` : `${totalLessons} leçons`}
          </p>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <p style={{ color: TEXT_DIM, fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
          {course.description}
        </p>
      )}

      {/* Bloc progression / lock — carte identique au reste */}
      {enrolled ? (
        totalLessons > 0 && (
          <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>Progression</span>
              <span style={{ color: TEXT_SUBTLE, fontSize: 12 }}>{relevantCompleted}/{totalLessons} · {pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: pct === 100 ? '#4ade80' : TEXT, width: `${pct}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 14, border: `1px solid ${BORDER}`, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock size={16} color={TEXT_SUBTLE} />
          <p style={{ color: TEXT_DIM, fontSize: 13, margin: 0 }}>
            Vous n'êtes pas inscrit. Contactez l'équipe Terex pour obtenir l'accès complet.
          </p>
        </div>
      )}

      {/* Modules — liste simple, cohérente avec les cartes du dashboard */}
      {modules.map((m, mi) => {
        const doneInModule = m.lessons.filter(l => isLessonDone(l.id)).length;
        return (
          <div key={m.id} style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: m.lessons.length > 0 ? `1px solid ${BORDER_SOFT}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: TEXT_MUTE, fontSize: 11, fontWeight: 600, minWidth: 26 }}>M{mi + 1}</span>
                <span style={{ color: TEXT, fontSize: 14, fontWeight: 500, flex: 1 }}>{m.title}</span>
                <span style={{ color: TEXT_MUTE, fontSize: 11 }}>
                  {enrolled ? `${doneInModule}/${m.lessons.length}` : `${m.lessons.length} leçon${m.lessons.length > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
            {m.lessons.map((l, li) => {
              const Icon = TYPE_META[l.content_type]?.icon ?? Type;
              const done = isLessonDone(l.id);
              const accessible = canAccess(l);
              return (
                <div key={l.id}
                  onClick={() => accessible && onOpenLesson(l.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                    borderTop: li > 0 ? `1px solid ${BORDER_SOFT}` : 'none',
                    cursor: accessible ? 'pointer' : 'default',
                    opacity: accessible ? 1 : 0.5,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (accessible) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  {done ? <CheckCircle2 size={16} color="#4ade80" /> : accessible ? <Circle size={16} color="#444" /> : <Lock size={14} color="#444" />}
                  <Icon size={13} color={TEXT_SUBTLE} strokeWidth={1.5} />
                  <span style={{ flex: 1, color: done ? TEXT_DIM : TEXT, fontSize: 13, textDecoration: done ? 'line-through' : 'none' }}>
                    {l.title}
                  </span>
                  {l.is_free_preview && !enrolled && (
                    <Chip color={TEXT_SUBTLE} bg="rgba(255,255,255,0.04)" border={BORDER}>APERÇU</Chip>
                  )}
                  {l.duration_min && <span style={{ color: TEXT_MUTE, fontSize: 11 }}>{l.duration_min} min</span>}
                  {accessible && <ChevronRight size={14} color="#444" />}
                </div>
              );
            })}
          </div>
        );
      })}

      <SpinKeyframe />
    </div>
  );
}

// ─── LessonViewer ───────────────────────────────────────────────────────
type LessonWithModule = Lesson & { module?: Module };

function LessonViewer({ lessonId, courseId, onBackToCourse, onOpenLesson }: {
  lessonId: string; courseId: string;
  onBackToCourse: () => void;
  onOpenLesson: (lId: string) => void;
}) {
  const [lesson, setLesson] = useState<LessonWithModule | null>(null);
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [completed, setCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: l } = await supabase.from('lessons' as any).select('*').eq('id', lessonId).single();
      const lessonData = l as any as Lesson;
      let moduleData: Module | undefined;
      if (lessonData?.module_id) {
        const { data: m } = await supabase.from('course_modules' as any).select('*').eq('id', lessonData.module_id).single();
        moduleData = m as any as Module;
      }
      setLesson({ ...lessonData, module: moduleData });

      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position');
      const withLessons = await Promise.all(((mods as any[]) ?? []).map(async (m: any) => {
        const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', m.id).order('position');
        return { ...m, lessons: (ls as any[]) ?? [] };
      }));
      setModules(withLessons);

      if (user) {
        const { data: p } = await supabase.from('lesson_progress' as any).select('lesson_id, completed').eq('user_id', user.id);
        const map: Record<string, boolean> = {};
        ((p as any[]) ?? []).forEach(row => { map[row.lesson_id] = !!row.completed; });
        setProgressMap(map);
        setCompleted(!!map[lessonId]);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [lessonId, courseId, user]);

  const flat = useMemo(() => modules.flatMap(m => m.lessons), [modules]);
  const idx = flat.findIndex(l => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

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
    setProgressMap(p => ({ ...p, [lessonId]: newState }));
    setMarking(false);
    if (newState && next) {
      setTimeout(() => onOpenLesson(next.id), 350);
    }
  };

  if (loading) return <FullLoader />;
  if (!lesson) return <EmptyState label="Leçon introuvable." />;

  const meta = TYPE_META[lesson.content_type] ?? TYPE_META.text;
  const Icon = meta.icon;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '16px 20px 60px' : '32px 32px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <button onClick={onBackToCourse} style={backBtn}><ArrowLeft size={18} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          {lesson.module?.title && (
            <p style={{ color: TEXT_SUBTLE, fontSize: 12, margin: '0 0 4px' }}>{lesson.module.title}</p>
          )}
          <h1 style={{ color: TEXT, fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25 }}>
            {lesson.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: TEXT_SUBTLE, fontSize: 12 }}>
            <Icon size={12} strokeWidth={1.6} />
            <span>{meta.label}</span>
            {lesson.duration_min && <><span>·</span><span>{lesson.duration_min} min</span></>}
          </div>
        </div>
      </div>

      {/* Corps */}
      {lesson.content_type === 'video' && lesson.content_url && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: 14, overflow: 'hidden', marginBottom: 20, border: `1px solid ${BORDER}` }}>
          {isYouTube(lesson.content_url) ? (
            <iframe src={toYouTubeEmbed(lesson.content_url)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <video controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <source src={lesson.content_url} />
            </video>
          )}
        </div>
      )}

      {lesson.content_type === 'pdf' && lesson.content_url && (
        <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, color: TEXT,
            fontSize: 14, textDecoration: 'none',
            background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}`,
            marginBottom: 20,
          }}>
          <FileText size={20} color={TEXT_DIM} />
          <span style={{ flex: 1 }}>Ouvrir le document PDF</span>
          <ChevronRight size={14} color={TEXT_MUTE} />
        </a>
      )}

      {lesson.content_type === 'zoom' && (
        <div style={{ background: CARD, borderRadius: 14, padding: 20, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Radio size={14} color={TEXT_DIM} />
            <span style={{ color: TEXT_DIM, fontSize: 12, fontWeight: 600 }}>Session en direct</span>
          </div>
          {lesson.zoom_date ? (
            <p style={{ color: TEXT, fontSize: 14, margin: 0 }}>
              Prévue le {new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {' à '}{new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          ) : (
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: 0 }}>Date à confirmer — les inscrits sont prévenus par e-mail.</p>
          )}
          {lesson.content_url && (
            <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
                padding: '10px 18px', borderRadius: 10,
                background: TEXT, color: BG,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
              <Play size={13} /> Rejoindre
            </a>
          )}
        </div>
      )}

      {lesson.content_text && <ProseText source={lesson.content_text} isMobile={isMobile} />}

      {!lesson.content_text && !lesson.content_url && lesson.content_type !== 'zoom' && (
        <div style={{ color: TEXT_SUBTLE, fontSize: 13, padding: 24, textAlign: 'center', background: CARD, borderRadius: 12, border: `1px solid ${BORDER}` }}>
          Le contenu de cette leçon sera bientôt ajouté.
        </div>
      )}

      {/* Bouton terminé */}
      {user && (
        <button onClick={toggleComplete} disabled={marking}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 20px', borderRadius: 12,
            border: `1px solid ${completed ? 'rgba(74,222,128,0.3)' : BORDER}`,
            background: completed ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
            color: completed ? '#4ade80' : TEXT,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
            marginTop: 24, marginBottom: 20,
          }}>
          {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : completed ? <><CheckCircle2 size={16} /> Terminé</>
            : <><Circle size={16} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
        </button>
      )}

      {/* Navigation prev/next */}
      <nav style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
        {prev ? <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} /> : <div />}
        {next ? <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} /> : <div />}
      </nav>

      <SpinKeyframe />
    </div>
  );
}

function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 14, borderRadius: 12,
        background: CARD, border: `1px solid ${BORDER}`,
        cursor: 'pointer', textAlign: isNext ? 'right' : 'left',
        color: TEXT,
        flexDirection: isNext ? 'row-reverse' : 'row',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = CARD_HOVER; }}
      onMouseLeave={e => { e.currentTarget.style.background = CARD; }}>
      {isNext ? <ChevronRight size={16} color={TEXT_DIM} /> : <ChevronLeft size={16} color={TEXT_DIM} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT_MUTE, marginBottom: 2 }}>
          {isNext ? 'Suivante' : 'Précédente'}
        </div>
        <div style={{ fontSize: 13, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </div>
      </div>
    </button>
  );
}

// ─── Prose (mini-markdown) — même font que le reste, pas de serif ───────
function ProseText({ source, isMobile }: { source: string; isMobile: boolean }) {
  const blocks = useMemo(() => parseBlocks(source), [source]);
  return (
    <div style={{
      background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`,
      padding: isMobile ? 18 : 24, marginBottom: 20,
      color: '#d4d4d4', fontSize: 14.5, lineHeight: 1.7,
    }}>
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}

type Block =
  | { type: 'p'; text: string }
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'hr' };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (/^---+$/.test(line.trim())) { blocks.push({ type: 'hr' }); i++; continue; }
    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4) }); i++; continue; }
    if (line.startsWith('## ')) { blocks.push({ type: 'h2', text: line.slice(3) }); i++; continue; }
    if (line.startsWith('> ')) {
      let acc = line.slice(2); i++;
      while (i < lines.length && lines[i].startsWith('> ')) { acc += ' ' + lines[i].slice(2); i++; }
      blocks.push({ type: 'quote', text: acc });
      continue;
    }
    if (/^\s*[•\-\*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[•\-\*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[•\-\*]\s+/, '')); i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }
    let acc = line; i++;
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      acc += ' ' + lines[i]; i++;
    }
    blocks.push({ type: 'p', text: acc });
  }
  return blocks;
}

function isBlockStart(l: string): boolean {
  return /^---+$/.test(l.trim())
    || l.startsWith('## ') || l.startsWith('### ') || l.startsWith('> ')
    || /^\s*[•\-\*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l);
}

function renderBlock(b: Block, k: number): JSX.Element {
  switch (b.type) {
    case 'h2':
      return <h2 key={k} style={{ fontSize: 17, fontWeight: 700, color: TEXT, margin: '22px 0 10px', letterSpacing: '-0.01em' }}>{inline(b.text)}</h2>;
    case 'h3':
      return <h3 key={k} style={{ fontSize: 15, fontWeight: 600, color: TEXT, margin: '18px 0 8px' }}>{inline(b.text)}</h3>;
    case 'quote':
      return (
        <blockquote key={k} style={{
          margin: '16px 0', padding: '10px 14px',
          borderLeft: `3px solid ${TEXT_SUBTLE}`,
          background: 'rgba(255,255,255,0.03)', borderRadius: '0 8px 8px 0',
          color: TEXT, fontStyle: 'italic',
        }}>{inline(b.text)}</blockquote>
      );
    case 'ul':
      return (
        <ul key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ position: 'relative', paddingLeft: 20, marginBottom: 6 }}>
              <span style={{ position: 'absolute', left: 4, top: 10, width: 4, height: 4, borderRadius: '50%', background: TEXT_SUBTLE }} />
              {inline(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '8px 0 14px', paddingLeft: 22 }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ marginBottom: 6, paddingLeft: 4 }}>{inline(it)}</li>
          ))}
        </ol>
      );
    case 'hr':
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid ${BORDER_SOFT}`, margin: '22px 0' }} />;
    case 'p':
    default:
      return <p key={k} style={{ margin: '0 0 12px' }}>{inline(b.text)}</p>;
  }
}

function inline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    const token = m[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++} style={{ color: TEXT, fontWeight: 600 }}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++} style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: '0.88em', background: 'rgba(255,255,255,0.06)',
        padding: '2px 6px', borderRadius: 4, color: TEXT,
      }}>{token.slice(1, -1)}</code>);
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

// ─── Small building blocks ──────────────────────────────────────────────
function Chip({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, color: TEXT_SUBTLE,
      background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 8px',
      border: `1px solid rgba(255,255,255,0.06)`,
    }}>{children}</span>
  );
}
function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: TEXT_SUBTLE, fontSize: 13 }}>
      <GraduationCap size={38} color="#444" style={{ marginBottom: 14 }} />
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );
}
function FullLoader() {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Loader2 size={20} color={TEXT_SUBTLE} style={{ animation: 'spin 1s linear infinite' }} />
      <SpinKeyframe />
    </div>
  );
}
const backBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: TEXT, cursor: 'pointer', flexShrink: 0,
};
function SpinKeyframe() {
  return <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>;
}

// ─── Helpers ────────────────────────────────────────────────────────────
function isYouTube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
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
