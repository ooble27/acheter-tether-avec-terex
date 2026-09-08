import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { setBrowserThemeColor, useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, Video, FileText, Type, Radio,
  CheckCircle2, Lock, Clock, ChevronRight,
  GraduationCap, Play, Loader2, Download,
  Layers, BookOpen, HelpCircle, Award, Sparkles,
  Sun, Moon,
} from 'lucide-react';
import {
  C, FONT, card, heroCard, sH,
  cardHeaderRow, cardTitle, btnPrimary, numeric,
  listRowHoverIn, listRowHoverOut,
  primaryHoverIn, primaryHoverOut,
  ACADEMY_THEME_CSS,
} from './academy/academyTheme';
import { LessonViewer } from './academy/LessonViewer';
import { QuizPlayer } from './academy/QuizPlayer';

// ─── Types ──────────────────────────────────────────────────────────────
type Course = {
  id: string; title: string; slug: string; description: string | null;
  price_cfa: number; level: string; status: string; duration_hours: number | null;
  cover_url: string | null;
};
type Module = {
  id: string; course_id: string; title: string; position: number;
  summary: string | null; pptx_url: string | null; pdf_url: string | null;
};
type Lesson = {
  id: string; module_id: string; title: string; content_type: string;
  content_url: string | null; content_text: string | null;
  zoom_date: string | null; duration_min: number | null;
  position: number; is_free_preview: boolean;
};
type ModuleWithLessons = Module & { lessons: Lesson[]; quiz_id: string | null };
type Enrollment = { id: string; course_id: string; status: string; expires_at: string | null };
type Progress = { lesson_id: string; completed: boolean };
type QuizAttempt = { quiz_id: string; score: number; passed: boolean };

const LEVELS: Record<string, string> = {
  debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé',
};
const TYPE_LABEL: Record<string, string> = { video: 'Vidéo', pdf: 'PDF', text: 'Lecture', zoom: 'Live' };
const TYPE_ICON: Record<string, typeof Video> = { video: Video, pdf: FileText, text: Type, zoom: Radio };

const OK = C.ok;

// ═══════════════════════════════════════════════════════════════════════
// Root
// ═══════════════════════════════════════════════════════════════════════
export function Academy({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'catalog' | 'course' | 'module' | 'lesson' | 'quiz'>('catalog');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizModuleTitle, setQuizModuleTitle] = useState<string>('');
  // Single source of truth: the global app theme. Academy and Dashboard share
  // the same state via ThemeContext (localStorage key `terex-theme`), so a
  // switch on either side reflects on the other instantly.
  const { theme, toggleTheme } = useTheme();

  // Keep the browser chrome (Safari/Chrome status bar) in sync while the
  // Academy is mounted; the global theme drives it either way, but we still
  // call setBrowserThemeColor to force the update when re-entering.
  useEffect(() => {
    setBrowserThemeColor(theme === 'light');
  }, [theme]);

  return (
    <div
      className="ac-scope"
      data-ac-theme={theme}
      style={{ background: C.bg, minHeight: '100vh', color: C.t1, fontFamily: FONT, fontWeight: 300 }}
    >
      <style>{ACADEMY_THEME_CSS}</style>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {view === 'catalog' && (
        <Catalog onBack={onBack} onOpenCourse={(id) => { setCourseId(id); setView('course'); }} />
      )}
      {view === 'course' && courseId && (
        <CourseDetail
          courseId={courseId}
          onBack={() => { setView('catalog'); setCourseId(null); }}
          onOpenModule={(mId) => { setModuleId(mId); setView('module'); }}
        />
      )}
      {view === 'module' && moduleId && courseId && (
        <ModuleDetail
          moduleId={moduleId}
          courseId={courseId}
          onBack={() => { setModuleId(null); setView('course'); }}
          onOpenLesson={(lId) => { setLessonId(lId); setView('lesson'); }}
          onOpenQuiz={(qId, title) => { setQuizId(qId); setQuizModuleTitle(title); setView('quiz'); }}
        />
      )}
      {view === 'lesson' && lessonId && courseId && (
        <LessonViewer
          lessonId={lessonId}
          courseId={courseId}
          onBackToModule={() => { setLessonId(null); setView('module'); }}
          onOpenLesson={(lId) => setLessonId(lId)}
        />
      )}
      {view === 'quiz' && quizId && (
        <QuizPlayer
          quizId={quizId}
          moduleTitle={quizModuleTitle}
          onBackToModule={() => { setQuizId(null); setView('module'); }}
          onPassed={() => { /* no-op — user goes back manually */ }}
        />
      )}
      <SpinKeyframe />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Catalog — polished course cards with cover image
// ═══════════════════════════════════════════════════════════════════════
function Catalog({ onBack, onOpenCourse }: { onBack: () => void; onOpenCourse: (id: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('courses' as any)
        .select('*').eq('status', 'published').order('created_at', { ascending: false });
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
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile
        ? 'calc(env(safe-area-inset-top, 0px) + 24px) 16px 100px'
        : '40px 24px 120px' }}>
      {/* Simple page head */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 32 }}>
        <BackButton onClick={onBack} noMargin />
        <div style={{ flex: 1 }}>
          <p style={{ ...sH, marginBottom: 6 }}>Terex Academy</p>
          <h1 style={{
            fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
            fontSize: isMobile ? 28 : 34, lineHeight: 1.15,
            color: C.t1, margin: 0, textWrap: 'balance' as any,
          }}>
            Comprendre la crypto,<br style={{ display: isMobile ? 'none' : 'block' }} /> sans jargon.
          </h1>
          <p style={{ color: C.t2, fontSize: isMobile ? 14 : 15, margin: '10px 0 0', fontWeight: 300, maxWidth: 520, lineHeight: 1.55 }}>
            Des formations conçues par l'équipe Terex — pratiques, progressives, et pensées pour l'Afrique.
          </p>
        </div>
      </div>

      {loading ? <FullLoader /> : courses.length === 0 ? (
        <EmptyState label="Aucune formation disponible pour le moment." />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: isMobile ? 16 : 20,
        }}>
          {courses.map((c, i) => {
            const enrolled = isEnrolled(c.id);
            return (
              <CourseCard key={c.id} course={c} enrolled={enrolled} onClick={() => onOpenCourse(c.id)} tone={i} />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Course card — presents the course like a real e-learning tile.
 * A cover image (or a themed gradient when none is set) sits on top,
 * course info sits below in a subtle card body.
 */
function CourseCard({ course, enrolled, onClick, tone }: {
  course: Course; enrolled: boolean; onClick: () => void; tone: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: C.l1, border: `1px solid ${hovered ? C.bd : C.bds}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        textAlign: 'left', padding: 0, fontFamily: FONT,
        transition: 'all 0.18s ease', color: C.t1,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}>
      <CourseCover url={course.cover_url} tone={tone} />
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ ...sH, fontSize: 10 }}>{LEVELS[course.level] ?? course.level}</span>
          {enrolled && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.t3 }} />
              <span style={{ color: OK, fontSize: 10, fontWeight: 400, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Inscrit
              </span>
            </>
          )}
        </div>
        <h3 style={{
          color: C.t1, fontSize: 18, fontWeight: 400,
          margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.3,
          textWrap: 'balance' as any,
        }}>
          {course.title}
        </h3>
        {course.description && (
          <p style={{
            color: C.t2, fontSize: 13, margin: '0 0 14px',
            lineHeight: 1.6, fontWeight: 300,
            display: '-webkit-box', WebkitLineClamp: 2 as any,
            WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
          }}>
            {course.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.t3, fontSize: 11 }}>
          {course.duration_hours && (
            <span style={{ ...numeric, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={11} /> {course.duration_hours}h
            </span>
          )}
          <span style={{ ...numeric, display: 'flex', alignItems: 'center', gap: 5 }}>
            {course.price_cfa === 0 ? 'Gratuit' : `${course.price_cfa.toLocaleString('fr-FR')} CFA`}
          </span>
          <span style={{ flex: 1 }} />
          <ChevronRight size={14} color={hovered ? C.t1 : C.t3} style={{ transition: 'color 0.18s' }} />
        </div>
      </div>
    </button>
  );
}

/**
 * Cover — uses `cover_url` if set, otherwise draws a themed monochrome
 * gradient with a subtle GraduationCap silhouette.
 */
function CourseCover({ url, tone }: { url: string | null; tone: number }) {
  if (url) {
    return (
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '16/9' as any,
        background: `url(${url}) center/cover no-repeat`, borderBottom: `1px solid ${C.bds}`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)',
        }} />
      </div>
    );
  }
  // Themed monochrome gradient fallback — offsets each card slightly by tone
  const grads = [
    'linear-gradient(135deg, #262626 0%, hsl(var(--terex-dark)) 55%, hsl(var(--terex-darker)) 100%)',
    'linear-gradient(135deg, hsl(var(--terex-gray)) 0%, hsl(var(--terex-darker)) 55%, hsl(var(--terex-darker)) 100%)',
    'linear-gradient(135deg, hsl(var(--terex-darker)) 0%, hsl(var(--terex-dark)) 50%, #262626 100%)',
    'linear-gradient(135deg, hsl(var(--terex-darker)) 0%, hsl(var(--terex-dark)) 50%, hsl(var(--terex-gray)) 100%)',
  ];
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '16/9' as any,
      background: grads[tone % grads.length], borderBottom: `1px solid ${C.bds}`,
      overflow: 'hidden',
    }}>
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', top: -80, right: -60, width: 200, height: 200, borderRadius: '50%',
        border: `1px solid ${C.ov3}`, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -70, left: -50, width: 160, height: 160, borderRadius: '50%',
        border: `1px solid ${C.ov2}`, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <GraduationCap size={64} color="${C.ov6}" strokeWidth={1} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Course Detail
// ═══════════════════════════════════════════════════════════════════════
function CourseDetail({ courseId, onBack, onOpenModule }: {
  courseId: string; onBack: () => void; onOpenModule: (mId: string) => void;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
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
        const [{ data: ls }, { data: quiz }] = await Promise.all([
          supabase.from('lessons' as any).select('*').eq('module_id', m.id).order('position'),
          supabase.from('quizzes' as any).select('id').eq('module_id', m.id).maybeSingle(),
        ]);
        return { ...m, lessons: (ls as any[]) ?? [], quiz_id: (quiz as any)?.id ?? null };
      }));
      setModules(withLessons);

      if (user) {
        const { data: e } = await supabase.from('enrollments' as any).select('*')
          .eq('user_id', user.id).eq('course_id', courseId).eq('status', 'active').maybeSingle();
        setEnrolled(!!e);
        const { data: p } = await supabase.from('lesson_progress' as any).select('lesson_id, completed').eq('user_id', user.id);
        setProgress((p as any[]) ?? []);
        const { data: a } = await supabase.from('quiz_attempts' as any).select('quiz_id, score, passed').eq('user_id', user.id);
        setAttempts((a as any[]) ?? []);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [courseId, user]);

  const totalLessons = useMemo(() => modules.reduce((s, m) => s + m.lessons.length, 0), [modules]);
  const doneSet = useMemo(() => new Set(progress.filter(p => p.completed).map(p => p.lesson_id)), [progress]);
  const relevantCompleted = useMemo(() => {
    const ids = new Set(modules.flatMap(m => m.lessons.map(l => l.id)));
    return [...doneSet].filter(id => ids.has(id)).length;
  }, [modules, doneSet]);
  const pct = totalLessons > 0 ? Math.round((relevantCompleted / totalLessons) * 100) : 0;

  const passedQuizzes = useMemo(() => {
    const set = new Set<string>();
    for (const a of attempts) if (a.passed) set.add(a.quiz_id);
    return set;
  }, [attempts]);

  if (loading) return <FullLoader />;
  if (!course) return <EmptyState label="Formation introuvable." />;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile
        ? 'calc(env(safe-area-inset-top, 0px) + 24px) 16px 100px'
        : '40px 24px 120px' }}>
      <BackButton onClick={onBack} />

      {/* Hero — cover image / gradient with title overlay + stats below */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 18, overflow: 'hidden', marginBottom: 22,
      }}>
        <CourseHero course={course} pct={pct} enrolled={enrolled} isMobile={isMobile} />
        {/* Stats row */}
        <div style={{
          padding: isMobile ? '20px 20px 22px' : '22px 26px 24px',
          display: 'flex', flexWrap: 'wrap', gap: 0,
        }}>
          {[
            { label: 'Modules', value: modules.length },
            { label: 'Leçons',  value: totalLessons },
            ...(course.duration_hours ? [{ label: 'Durée', value: course.duration_hours, hint: 'h' }] : []),
            { label: 'Niveau',  value: LEVELS[course.level] ?? course.level },
            ...(enrolled ? [{ label: 'Progression', value: `${pct}`, hint: '%' }] : []),
          ].map((s: any, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
              {i > 0 && <div style={{ width: 1, background: C.bds, marginRight: 18 }} />}
              <div style={{ paddingRight: 18 }}>
                <p style={{ ...sH, fontSize: 10, marginBottom: 5 }}>{s.label}</p>
                <p style={{ ...numeric, color: C.t1, fontSize: 15, fontWeight: 400, margin: 0 }}>
                  {s.value}
                  {s.hint && <span style={{ color: C.t3, fontSize: 11, marginLeft: 4, fontWeight: 300 }}>{s.hint}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {enrolled && totalLessons > 0 && (
          <div style={{ padding: isMobile ? '0 20px 20px' : '0 26px 24px' }}>
            <div style={{ height: 3, background: C.ov5, borderRadius: 2 }}>
              <div style={{
                height: '100%', borderRadius: 2, background: pct === 100 ? OK : C.accent,
                width: `${pct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
            <p style={{ color: C.t3, fontSize: 11, margin: '8px 0 0', ...numeric }}>
              {relevantCompleted} / {totalLessons} leçons terminées
            </p>
          </div>
        )}

        {!enrolled && (
          <div style={{ padding: isMobile ? '0 20px 20px' : '0 26px 24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10,
              background: C.ov2, border: `1px solid ${C.bds}`,
            }}>
              <Lock size={13} color={C.t3} />
              <p style={{ color: C.t2, fontSize: 12.5, margin: 0, fontWeight: 300 }}>
                Contactez l'équipe Terex pour accéder au contenu complet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modules card */}
      <div style={{ ...card, fontFamily: FONT }}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Programme</span>
          {enrolled && (
            <span style={{ ...numeric, fontSize: 11, color: C.t3 }}>
              {relevantCompleted}/{totalLessons} leçons
            </span>
          )}
        </div>
        {modules.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: C.t3, fontSize: 12 }}>
            Aucun module publié pour cette formation.
          </div>
        ) : (
          modules.map((m, mi) => {
            const doneInModule = m.lessons.filter(l => doneSet.has(l.id)).length;
            const complete = doneInModule === m.lessons.length && m.lessons.length > 0;
            const modulePct = m.lessons.length > 0 ? (doneInModule / m.lessons.length) * 100 : 0;
            const isLast = mi === modules.length - 1;
            const hasQuiz = !!m.quiz_id;
            const quizPassed = hasQuiz && passedQuizzes.has(m.quiz_id!);

            return (
              <div
                key={m.id}
                onClick={() => onOpenModule(m.id)}
                style={{
                  padding: isMobile ? '16px 18px' : '18px 22px',
                  borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => listRowHoverIn(e.currentTarget)}
                onMouseLeave={e => listRowHoverOut(e.currentTarget)}>

                {/* Module number */}
                <span style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: complete ? 'rgba(74,222,128,0.10)' : C.l2,
                  border: `1px solid ${complete ? 'rgba(74,222,128,0.25)' : C.bds}`,
                  color: complete ? OK : C.t2,
                  ...numeric, fontSize: 13, fontWeight: 400,
                }}>
                  {complete ? <CheckCircle2 size={16} /> : String(mi + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: C.t1, fontSize: 14.5, fontWeight: 400,
                    marginBottom: m.summary ? 4 : (enrolled && m.lessons.length > 0 ? 8 : 3),
                    lineHeight: 1.3,
                  }}>
                    {m.title}
                  </div>
                  {m.summary && (
                    <p style={{
                      color: C.t2, fontSize: 12.5, lineHeight: 1.55, margin: '0 0 8px',
                      fontWeight: 300,
                    }}>
                      {m.summary}
                    </p>
                  )}
                  {enrolled && m.lessons.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 2, background: C.ov4, borderRadius: 1 }}>
                        <div style={{
                          height: '100%', borderRadius: 1,
                          background: complete ? OK : C.accent,
                          width: `${modulePct}%`, transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <span style={{ ...numeric, fontSize: 10, color: C.t3, flexShrink: 0 }}>
                        {doneInModule}/{m.lessons.length}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.t3, fontSize: 11 }}>
                      <span style={{ ...numeric, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={11} /> {m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}
                      </span>
                      {hasQuiz && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <HelpCircle size={11} /> Quiz
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right side: quiz badge & arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {hasQuiz && quizPassed && (
                    <Award size={14} color={OK} strokeWidth={1.8} />
                  )}
                  <ChevronRight size={14} color={C.t3} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * Course hero — cover image (or gradient), with title + eyebrow overlaid.
 * A subtle scrim keeps text readable on any cover.
 */
function CourseHero({ course, pct, enrolled, isMobile }: {
  course: Course; pct: number; enrolled: boolean; isMobile: boolean;
}) {
  return (
    <div style={{
      position: 'relative', width: '100%',
      aspectRatio: isMobile ? '16/10' as any : '21/9' as any,
      background: course.cover_url
        ? `url(${course.cover_url}) center/cover no-repeat`
        : 'linear-gradient(135deg, #262626 0%, hsl(var(--terex-dark)) 45%, #222 100%)',
      borderBottom: `1px solid ${C.bds}`, overflow: 'hidden',
    }}>
      {/* Decorative rings when no cover */}
      {!course.cover_url && (
        <>
          <div style={{
            position: 'absolute', top: -120, right: -80, width: 320, height: 320, borderRadius: '50%',
            border: `1px solid ${C.ov3}`, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -100, left: -60, width: 240, height: 240, borderRadius: '50%',
            border: `1px solid ${C.ov2}`, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '50%', right: '18%', transform: 'translateY(-50%)',
            opacity: 0.05,
          }}>
            <GraduationCap size={140} color="hsl(var(--foreground))" strokeWidth={0.6} />
          </div>
        </>
      )}
      {/* Scrim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)',
      }} />
      {/* Overlay content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: isMobile ? '20px' : '28px 30px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ ...sH, fontSize: 10, color: 'hsl(var(--terex-accent) / 0.60)' }}>Terex Academy</span>
          {enrolled && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'hsl(var(--terex-accent) / 0.30)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: OK, fontSize: 10, fontWeight: 400, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                <Sparkles size={11} /> Inscrit · {pct}%
              </span>
            </>
          )}
        </div>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 24 : 32, lineHeight: 1.15,
          color: 'hsl(var(--foreground))', margin: 0, textWrap: 'balance' as any,
          maxWidth: 680,
          textShadow: course.cover_url ? '0 1px 20px rgba(0,0,0,0.4)' : 'none',
        }}>
          {course.title}
        </h1>
        {course.description && !course.cover_url && (
          <p style={{
            color: 'hsl(var(--terex-accent) / 0.70)', fontSize: isMobile ? 13 : 14,
            margin: '10px 0 0', fontWeight: 300, maxWidth: 560, lineHeight: 1.55,
          }}>
            {course.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Module Detail
// ═══════════════════════════════════════════════════════════════════════
function ModuleDetail({ moduleId, courseId, onBack, onOpenLesson, onOpenQuiz }: {
  moduleId: string; courseId: string;
  onBack: () => void; onOpenLesson: (lId: string) => void;
  onOpenQuiz: (qId: string, moduleTitle: string) => void;
}) {
  const [module_, setModule] = useState<ModuleWithLessons | null>(null);
  const [quizInfo, setQuizInfo] = useState<{ id: string; title: string; pass_score: number; questionCount: number } | null>(null);
  const [allModules, setAllModules] = useState<ModuleWithLessons[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [bestAttempt, setBestAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: m } = await supabase.from('course_modules' as any).select('*').eq('id', moduleId).single();
      const modData = m as any as Module;
      const [{ data: ls }, { data: quizRow }] = await Promise.all([
        supabase.from('lessons' as any).select('*').eq('module_id', moduleId).order('position'),
        supabase.from('quizzes' as any).select('*').eq('module_id', moduleId).maybeSingle(),
      ]);
      let quiz_id: string | null = null;
      if (quizRow) {
        const q = quizRow as any;
        quiz_id = q.id;
        const { count } = await supabase.from('quiz_questions' as any)
          .select('*', { count: 'exact', head: true }).eq('quiz_id', q.id);
        setQuizInfo({ id: q.id, title: q.title, pass_score: q.pass_score, questionCount: count ?? 0 });
        if (user) {
          const { data: at } = await supabase.from('quiz_attempts' as any)
            .select('quiz_id, score, passed').eq('user_id', user.id).eq('quiz_id', q.id)
            .order('score', { ascending: false }).limit(1);
          setBestAttempt(((at as any[]) ?? [])[0] ?? null);
        }
      } else {
        setQuizInfo(null);
        setBestAttempt(null);
      }
      setModule({ ...modData, lessons: (ls as any[]) ?? [], quiz_id });

      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position');
      const withLessons = await Promise.all(((mods as any[]) ?? []).map(async (mod: any) => {
        const { data: modLessons } = await supabase.from('lessons' as any).select('*').eq('module_id', mod.id).order('position');
        return { ...mod, lessons: (modLessons as any[]) ?? [], quiz_id: null };
      }));
      setAllModules(withLessons);

      if (user) {
        const { data: e } = await supabase.from('enrollments' as any).select('*')
          .eq('user_id', user.id).eq('course_id', courseId).eq('status', 'active').maybeSingle();
        setEnrolled(!!e);
        const { data: p } = await supabase.from('lesson_progress' as any).select('lesson_id, completed').eq('user_id', user.id);
        setProgress((p as any[]) ?? []);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [moduleId, courseId, user]);

  const doneSet = useMemo(() => new Set(progress.filter(p => p.completed).map(p => p.lesson_id)), [progress]);
  const moduleIdx = useMemo(() => allModules.findIndex(m => m.id === moduleId), [allModules, moduleId]);
  const canAccess = (l: Lesson) => enrolled || l.is_free_preview;

  const nextLesson = useMemo(() => {
    if (!module_) return null;
    return module_.lessons.find(l => !doneSet.has(l.id) && canAccess(l));
  }, [module_, doneSet, enrolled]);

  const doneInModule = module_ ? module_.lessons.filter(l => doneSet.has(l.id)).length : 0;
  const complete = module_ ? doneInModule === module_.lessons.length && module_.lessons.length > 0 : false;
  const pct = module_ && module_.lessons.length > 0 ? Math.round((doneInModule / module_.lessons.length) * 100) : 0;
  const allLessonsDone = complete;
  const quizPassed = bestAttempt?.passed ?? false;

  if (loading) return <FullLoader />;
  if (!module_) return <EmptyState label="Module introuvable." />;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: isMobile
        ? 'calc(env(safe-area-inset-top, 0px) + 24px) 16px 100px'
        : '40px 24px 120px' }}>
      <BackButton onClick={onBack} />

      {/* Hero */}
      <div style={{ ...heroCard, padding: isMobile ? '24px 22px 22px' : '28px 30px 26px', fontFamily: FONT }}>
        <p style={{ ...sH, marginBottom: 12 }}>
          Module <span style={{ ...numeric, color: C.t2 }}>{String(moduleIdx + 1).padStart(2, '0')}</span> · <span style={{ ...numeric, color: C.t3 }}>{allModules.length}</span> au total
        </p>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 22 : 28, lineHeight: 1.18,
          color: C.t1, margin: 0, textWrap: 'balance' as any,
        }}>
          {module_.title}
        </h1>
        {module_.summary && (
          <p style={{
            color: C.t2, fontSize: 14, lineHeight: 1.6,
            margin: '10px 0 0', fontWeight: 300, maxWidth: 620,
          }}>
            {module_.summary}
          </p>
        )}

        {enrolled && module_.lessons.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <p style={{ ...sH, fontSize: 10 }}>Progression</p>
              <p style={{ ...numeric, color: complete ? OK : C.t1, fontSize: 14, fontWeight: 400, margin: 0 }}>
                {pct}<span style={{ color: C.t3, fontSize: 11, marginLeft: 3, fontWeight: 300 }}>%</span>
                <span style={{ color: C.t3, fontSize: 11, marginLeft: 8, fontWeight: 300 }}>
                  {doneInModule}/{module_.lessons.length}
                </span>
              </p>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: C.ov5 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: complete ? OK : C.accent,
                width: `${pct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {enrolled && (module_.pdf_url || module_.pptx_url) && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22,
            paddingTop: 18, borderTop: `1px solid ${C.bds}`,
            alignItems: 'center',
          }}>
            <span style={{ ...sH, fontSize: 10, marginRight: 6 }}>Supports</span>
            {module_.pdf_url && <DownloadPill href={module_.pdf_url} label="PDF" />}
            {module_.pptx_url && <DownloadPill href={module_.pptx_url} label="PowerPoint" />}
          </div>
        )}
      </div>

      {/* Continue CTA */}
      {enrolled && nextLesson && (
        <button onClick={() => onOpenLesson(nextLesson.id)}
          style={{
            ...btnPrimary, width: '100%', height: 48, marginTop: 22,
            justifyContent: 'space-between', paddingLeft: 20, paddingRight: 18,
            fontSize: 13, fontWeight: 400,
          }}
          onMouseEnter={e => primaryHoverIn(e.currentTarget)}
          onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Play size={13} fill="#111" style={{ marginLeft: 1 }} />
            {doneInModule > 0 ? 'Continuer' : 'Commencer'} — {nextLesson.title}
          </span>
          <ChevronRight size={15} />
        </button>
      )}

      {/* Lesson list card */}
      <div style={{ ...card, marginTop: 20, fontFamily: FONT }}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Leçons</span>
          <span style={{ ...numeric, fontSize: 11, color: C.t3 }}>
            {module_.lessons.length} leçon{module_.lessons.length > 1 ? 's' : ''}
          </span>
        </div>
        {module_.lessons.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: C.t3, fontSize: 12 }}>
            Ce module n'a pas encore de leçons.
          </div>
        ) : (
          module_.lessons.map((l, li) => {
            const Icon = TYPE_ICON[l.content_type] ?? Type;
            const label = TYPE_LABEL[l.content_type] ?? 'Leçon';
            const done = doneSet.has(l.id);
            const accessible = canAccess(l);
            const isNext = nextLesson?.id === l.id;
            const isLast = li === module_.lessons.length - 1;

            return (
              <div
                key={l.id}
                onClick={() => accessible && onOpenLesson(l.id)}
                style={{
                  padding: isMobile ? '13px 18px' : '14px 22px',
                  borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: accessible ? 'pointer' : 'default',
                  opacity: accessible ? 1 : 0.5,
                  transition: 'background 0.12s',
                  background: isNext ? C.ov2 : 'transparent',
                }}
                onMouseEnter={e => { if (accessible) e.currentTarget.style.background = C.ov2; }}
                onMouseLeave={e => { e.currentTarget.style.background = isNext ? C.ov2 : 'transparent'; }}>

                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'rgba(74,222,128,0.10)' : C.l2,
                  border: `1px solid ${done ? 'rgba(74,222,128,0.25)' : C.bds}`,
                  color: done ? OK : C.t3,
                  ...numeric, fontSize: 11,
                }}>
                  {done ? <CheckCircle2 size={13} /> : li + 1}
                </span>

                <Icon size={13} color={C.t3} strokeWidth={1.8} style={{ flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, color: done ? C.t2 : C.t1,
                    fontWeight: isNext ? 400 : 300,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {l.title}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    <span style={{ fontSize: 10.5, color: C.t3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
                    {l.duration_min && <span style={{ ...numeric, fontSize: 10.5, color: C.t3 }}>{l.duration_min} min</span>}
                  </div>
                </div>

                {l.is_free_preview && !enrolled && (
                  <span style={{
                    fontSize: 10, color: C.t2, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6, padding: '3px 8px',
                    flexShrink: 0,
                  }}>Aperçu</span>
                )}
                {!accessible && <Lock size={12} color={C.t3} style={{ flexShrink: 0 }} />}
                {accessible && <ChevronRight size={13} color={C.t3} style={{ flexShrink: 0 }} />}
              </div>
            );
          })
        )}
      </div>

      {/* Quiz card — visible when the module has a quiz */}
      {quizInfo && (
        <QuizCard
          quiz={quizInfo}
          bestAttempt={bestAttempt}
          canTake={enrolled}
          allLessonsDone={allLessonsDone}
          onOpen={() => onOpenQuiz(quizInfo.id, module_.title)}
        />
      )}
    </div>
  );
}

function QuizCard({
  quiz, bestAttempt, canTake, allLessonsDone, onOpen,
}: {
  quiz: { id: string; title: string; pass_score: number; questionCount: number };
  bestAttempt: QuizAttempt | null;
  canTake: boolean;
  allLessonsDone: boolean;
  onOpen: () => void;
}) {
  const passed = bestAttempt?.passed ?? false;
  const attempted = bestAttempt !== null;

  return (
    <div style={{
      marginTop: 22, background: C.l1, border: `1px solid ${C.bds}`,
      borderRadius: 14, padding: 22, fontFamily: FONT,
      display: 'flex', alignItems: 'center', gap: 18,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: passed ? 'rgba(74,222,128,0.10)' : C.l2,
        border: `1px solid ${passed ? 'rgba(74,222,128,0.25)' : C.bds}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {passed ? <Award size={20} color={OK} /> : <HelpCircle size={20} color={C.t2} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...sH, fontSize: 10, marginBottom: 4 }}>
          {passed ? 'Quiz validé' : attempted ? 'Quiz — À rejouer' : 'Quiz du module'}
        </p>
        <h3 style={{
          color: C.t1, fontSize: 15, fontWeight: 400, margin: '0 0 6px',
          letterSpacing: '-0.005em',
        }}>
          {quiz.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.t3, fontSize: 11 }}>
          <span style={{ ...numeric }}>{quiz.questionCount} question{quiz.questionCount > 1 ? 's' : ''}</span>
          <span style={{ ...numeric }}>Seuil {quiz.pass_score}%</span>
          {attempted && (
            <span style={{ color: passed ? OK : C.t2, ...numeric }}>
              Meilleur score : {bestAttempt!.score}%
            </span>
          )}
        </div>
      </div>
      {canTake ? (
        <button onClick={onOpen}
          style={{
            ...btnPrimary, height: 40, fontSize: 12.5, whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => primaryHoverIn(e.currentTarget)}
          onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
          {passed ? 'Refaire' : attempted ? 'Reprendre' : 'Commencer'}
          <ChevronRight size={13} />
        </button>
      ) : (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: C.t3, fontSize: 11, ...numeric,
        }}>
          <Lock size={11} /> Inscription requise
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Shared helpers
// ═══════════════════════════════════════════════════════════════════════
/**
 * Same flat horizontal sliding switch as the Dashboard's ThemeToggle,
 * anchored to the top-right of the Academy scope. The theme state is
 * shared with the Dashboard via ThemeContext.
 *
 * Positioning:
 *  - On mobile, kept `fixed` at the viewport corner (unchanged).
 *  - On tablet/desktop, made `absolute` inside the Academy scope so it
 *    lives in the normal document flow and scrolls with the content —
 *    on wide screens the fixed corner used to be clipped by the browser
 *    chrome (Safari address bar) or by the tablet bezel; keeping it in
 *    the flow puts it inside each screen's own header padding instead.
 */
function ThemeToggle({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  const light = theme === 'light';
  const isMobile = useIsMobile();
  const W = 58, H = 30, KNOB = 24, PAD = 3;
  return (
    <button
      onClick={onToggle}
      aria-label={light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        zIndex: 50,
        top: isMobile
          ? 'calc(env(safe-area-inset-top, 0px) + 16px)'
          : 24,
        right: isMobile
          ? 'max(16px, calc((100vw - 1000px) / 2 + 16px))'
          : 'max(16px, calc((100vw - 1000px) / 2 + 16px))',
        width: W, height: H,
        borderRadius: 999,
        border: `1px solid ${C.accentBd}`,
        background: C.l2,
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: PAD,
          left: light ? W - KNOB - PAD : PAD,
          width: KNOB, height: KNOB,
          borderRadius: '50%',
          background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {light
          ? <Moon size={13} color={C.accentFg} />
          : <Sun size={13} color={C.accentFg} />}
      </span>
    </button>
  );
}

function BackButton({ onClick, noMargin }: { onClick: () => void; noMargin?: boolean }) {
  return (
    <button onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: C.l2, border: `1px solid ${C.bds}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.t2, cursor: 'pointer', flexShrink: 0,
        marginBottom: noMargin ? 0 : 20,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t1; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
      <ArrowLeft size={16} />
    </button>
  );
}

function DownloadPill({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} download
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 11.5, fontWeight: 400, color: C.t1,
        background: C.l2, border: `1px solid ${C.bd}`,
        borderRadius: 8, padding: '6px 12px', textDecoration: 'none',
        cursor: 'pointer', fontFamily: FONT,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBd; e.currentTarget.style.background = C.l3; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.background = C.l2; }}>
      <Download size={11} /> {label}
    </a>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: C.t3, fontSize: 13, fontWeight: 300 }}>
      <GraduationCap size={34} color={C.t3} style={{ marginBottom: 14, opacity: 0.5 }} />
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );
}

/**
 * A loader that appears only after 220 ms — under that threshold a Supabase
 * round-trip normally already returned, so a screen-blanking spinner would
 * flash for nothing. When it does render, it takes up the same padding the
 * content will use, so the layout doesn't jump when it swaps in.
 */
function FullLoader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 220);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ textAlign: 'center', padding: 80, minHeight: 240 }}>
      {visible && <Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} />}
      <SpinKeyframe />
    </div>
  );
}

function SpinKeyframe() {
  return <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>;
}
