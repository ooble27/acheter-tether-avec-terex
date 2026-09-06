import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, BookOpen, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp, GraduationCap, Play, Loader2,
  Lightbulb, AlertTriangle, Info, Layers, Target,
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
type ModuleWithLessons = Module & { lessons: Lesson[] };
type Enrollment = { id: string; course_id: string; status: string; expires_at: string | null };
type Progress = { lesson_id: string; completed: boolean };

// ─── Tokens ─────────────────────────────────────────────────────────────
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
const GREEN = '#4ade80';
const GREEN_DIM = 'rgba(74,222,128,0.12)';
const GREEN_BORDER = 'rgba(74,222,128,0.25)';

const LEVELS: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const TYPE_META: Record<string, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: 'Vidéo', color: '#818cf8' },
  pdf:   { icon: FileText, label: 'PDF', color: '#f472b6' },
  text:  { icon: Type, label: 'Lecture', color: '#60a5fa' },
  zoom:  { icon: Radio, label: 'Session live', color: '#34d399' },
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

// ═══════════════════════════════════════════════════════════════════════
// ─── Catalog ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={18} /></button>
        <div>
          <h1 style={{ color: TEXT, fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Terex Academy
          </h1>
          <p style={{ color: TEXT_SUBTLE, fontSize: 13, margin: '2px 0 0' }}>Formations crypto & blockchain</p>
        </div>
      </div>

      {loading ? <FullLoader /> : courses.length === 0 ? (
        <EmptyState label="Aucune formation disponible pour le moment." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {courses.map(c => (
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
        padding: isMobile ? 16 : 20, color: TEXT, outline: 'none',
        WebkitTapHighlightColor: 'transparent', transition: 'background 0.15s',
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
            {enrolled && <Chip color={GREEN} bg={GREEN_DIM} border={GREEN_BORDER}>Inscrit</Chip>}
          </div>
          {course.description && (
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: '0 0 10px', lineHeight: 1.55 }}>
              {course.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <MetaTag>{LEVELS[course.level] ?? course.level}</MetaTag>
            {course.duration_hours && <MetaTag><Clock size={11} /> {course.duration_hours}h</MetaTag>}
            <MetaTag>{course.price_cfa === 0 ? 'Gratuit' : `${course.price_cfa.toLocaleString('fr-FR')} CFA`}</MetaTag>
          </div>
        </div>
        <ChevronRight size={16} color={TEXT_MUTE} style={{ flexShrink: 0, marginTop: 12 }} />
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── CourseDetail ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function CourseDetail({ courseId, onBack, onOpenLesson }: {
  courseId: string; onBack: () => void; onOpenLesson: (lId: string) => void;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
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

  // Auto-expand the first incomplete module (or last module if all done)
  useEffect(() => {
    if (modules.length === 0) return;
    const doneSet = new Set(progress.filter(p => p.completed).map(p => p.lesson_id));
    const firstIncomplete = modules.find(m => m.lessons.some(l => !doneSet.has(l.id)));
    const toExpand = firstIncomplete?.id ?? modules[modules.length - 1].id;
    setExpandedModules(new Set([toExpand]));
  }, [modules, progress]);

  const totalLessons = useMemo(() => modules.reduce((s, m) => s + m.lessons.length, 0), [modules]);
  const doneSet = useMemo(() => new Set(progress.filter(p => p.completed).map(p => p.lesson_id)), [progress]);
  const relevantCompleted = useMemo(() => {
    const ids = new Set(modules.flatMap(m => m.lessons.map(l => l.id)));
    return [...doneSet].filter(id => ids.has(id)).length;
  }, [modules, doneSet]);
  const pct = totalLessons > 0 ? Math.round((relevantCompleted / totalLessons) * 100) : 0;
  const canAccess = (l: Lesson) => enrolled || l.is_free_preview;

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Find next lesson to continue
  const nextLesson = useMemo(() => {
    const flat = modules.flatMap(m => m.lessons);
    return flat.find(l => !doneSet.has(l.id) && canAccess(l));
  }, [modules, doneSet, enrolled]);

  const nextLessonModule = useMemo(() => {
    if (!nextLesson) return null;
    return modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
  }, [nextLesson, modules]);

  if (loading) return <FullLoader />;
  if (!course) return <EmptyState label="Formation introuvable." />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '16px 20px 100px' : '32px 40px 140px' }}>
      {/* Back button */}
      <button onClick={onBack} style={{ ...backBtnStyle, marginBottom: 20 }}>
        <ArrowLeft size={18} />
      </button>

      {/* Course Hero */}
      <div style={{
        background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`,
        padding: isMobile ? '20px 18px' : '28px 28px',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          <span style={{
            width: 48, height: 48, borderRadius: 14, background: ICON_BG,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <GraduationCap size={22} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
          </span>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: TEXT, fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0, letterSpacing: '-0.3px', lineHeight: 1.25 }}>
              {course.title}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <MetaTag>{LEVELS[course.level] ?? course.level}</MetaTag>
              <MetaTag><Layers size={11} /> {modules.length} modules</MetaTag>
              <MetaTag><BookOpen size={11} /> {totalLessons} leçons</MetaTag>
              {course.duration_hours && <MetaTag><Clock size={11} /> {course.duration_hours}h</MetaTag>}
            </div>
          </div>
        </div>

        {course.description && (
          <p style={{ color: TEXT_DIM, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
            {course.description}
          </p>
        )}

        {/* Progress bar (enrolled) or lock message */}
        {enrolled ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: TEXT_SUBTLE, fontSize: 12, fontWeight: 500 }}>Progression</span>
              <span style={{ color: pct === 100 ? GREEN : TEXT, fontSize: 13, fontWeight: 600 }}>
                {pct}%
                <span style={{ color: TEXT_SUBTLE, fontWeight: 400, marginLeft: 6, fontSize: 12 }}>
                  ({relevantCompleted}/{totalLessons})
                </span>
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: pct === 100 ? GREEN : TEXT, width: `${pct}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER_SOFT}` }}>
            <Lock size={14} color={TEXT_SUBTLE} />
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: 0 }}>Contactez l'équipe Terex pour accéder au contenu complet.</p>
          </div>
        )}
      </div>

      {/* Continue CTA */}
      {enrolled && nextLesson && nextLessonModule && (
        <button onClick={() => onOpenLesson(nextLesson.id)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            cursor: 'pointer', color: TEXT, textAlign: 'left',
            marginBottom: 20, transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
          <span style={{
            width: 40, height: 40, borderRadius: 12, background: TEXT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Play size={16} color={BG} fill={BG} style={{ marginLeft: 2 }} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: TEXT_SUBTLE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              {pct > 0 ? 'Continuer' : 'Commencer'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextLesson.title}
            </div>
            <div style={{ fontSize: 11, color: TEXT_MUTE, marginTop: 2 }}>
              {nextLessonModule.title}
            </div>
          </div>
          <ChevronRight size={16} color={TEXT_MUTE} />
        </button>
      )}

      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 14, padding: '0 2px',
      }}>
        <span style={{ color: TEXT_SUBTLE, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Programme du cours
        </span>
        <span style={{ flex: 1, height: 1, background: BORDER_SOFT }} />
      </div>

      {/* Module Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {modules.map((m, mi) => {
          const expanded = expandedModules.has(m.id);
          const doneInModule = m.lessons.filter(l => doneSet.has(l.id)).length;
          const moduleComplete = doneInModule === m.lessons.length && m.lessons.length > 0;
          const moduleInProgress = doneInModule > 0 && !moduleComplete;

          return (
            <div key={m.id} style={{
              borderRadius: 14, border: `1px solid ${expanded ? BORDER : BORDER_SOFT}`,
              background: expanded ? CARD : 'transparent',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
            }}>
              {/* Module header — always clickable */}
              <button
                onClick={() => toggleModule(m.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: isMobile ? '14px 14px' : '14px 18px',
                  cursor: 'pointer', border: 'none', background: 'transparent',
                  color: TEXT, textAlign: 'left', outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                {/* Module number circle */}
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em',
                  background: moduleComplete ? GREEN_DIM : 'rgba(255,255,255,0.05)',
                  color: moduleComplete ? GREEN : TEXT_DIM,
                  border: `1px solid ${moduleComplete ? GREEN_BORDER : 'rgba(255,255,255,0.08)'}`,
                }}>
                  {moduleComplete ? <CheckCircle2 size={16} /> : mi + 1}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, lineHeight: 1.3 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTE, marginTop: 2 }}>
                    {m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}
                    {enrolled && ` · ${doneInModule}/${m.lessons.length}`}
                    {moduleInProgress && enrolled && (
                      <span style={{ color: TEXT_DIM, marginLeft: 4 }}>en cours</span>
                    )}
                  </div>
                </div>

                {/* Module progress mini-bar */}
                {enrolled && m.lessons.length > 0 && !moduleComplete && (
                  <div style={{
                    width: 40, height: 3, borderRadius: 2,
                    background: 'rgba(255,255,255,0.06)', flexShrink: 0,
                    marginRight: 4,
                  }}>
                    <div style={{
                      width: `${(doneInModule / m.lessons.length) * 100}%`,
                      height: '100%', borderRadius: 2, background: TEXT_DIM,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                )}

                <span style={{ color: TEXT_MUTE, flexShrink: 0 }}>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {/* Lesson list (collapsed/expanded) */}
              {expanded && (
                <div style={{ padding: '0 0 6px' }}>
                  {m.lessons.map((l, li) => {
                    const meta = TYPE_META[l.content_type] ?? TYPE_META.text;
                    const Icon = meta.icon;
                    const done = doneSet.has(l.id);
                    const accessible = canAccess(l);
                    const isNext = nextLesson?.id === l.id;

                    return (
                      <div
                        key={l.id}
                        onClick={() => accessible && onOpenLesson(l.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: isMobile ? '10px 14px 10px 58px' : '10px 18px 10px 62px',
                          cursor: accessible ? 'pointer' : 'default',
                          opacity: accessible ? 1 : 0.45,
                          transition: 'background 0.12s',
                          background: isNext ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderLeft: isNext ? `2px solid ${TEXT}` : '2px solid transparent',
                        }}
                        onMouseEnter={e => { if (accessible) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isNext ? 'rgba(255,255,255,0.03)' : 'transparent'; }}>
                        {/* Status icon */}
                        {done
                          ? <CheckCircle2 size={15} color={GREEN} style={{ flexShrink: 0 }} />
                          : accessible
                            ? <Circle size={15} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
                            : <Lock size={13} color="#444" style={{ flexShrink: 0 }} />}

                        {/* Type icon */}
                        <span style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: `${meta.color}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={12} color={meta.color} strokeWidth={2} />
                        </span>

                        {/* Title */}
                        <span style={{
                          flex: 1, fontSize: 13, minWidth: 0,
                          color: done ? TEXT_DIM : TEXT,
                          fontWeight: isNext ? 500 : 400,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {l.title}
                        </span>

                        {/* Preview badge */}
                        {l.is_free_preview && !enrolled && (
                          <Chip color={TEXT_SUBTLE} bg="rgba(255,255,255,0.04)" border={BORDER}>Aperçu</Chip>
                        )}

                        {/* Duration */}
                        {l.duration_min && <span style={{ color: TEXT_MUTE, fontSize: 11, flexShrink: 0 }}>{l.duration_min} min</span>}

                        {accessible && <ChevronRight size={13} color="#444" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <SpinKeyframe />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── LessonViewer ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function LessonViewer({ lessonId, courseId, onBackToCourse, onOpenLesson }: {
  lessonId: string; courseId: string;
  onBackToCourse: () => void; onOpenLesson: (lId: string) => void;
}) {
  const [lesson, setLesson] = useState<(Lesson & { module?: Module }) | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [completed, setCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);

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
  const currentModuleIdx = useMemo(() => modules.findIndex(m => m.lessons.some(l => l.id === lessonId)), [modules, lessonId]);
  const currentLessonInModuleIdx = useMemo(() => {
    const mod = modules[currentModuleIdx];
    return mod ? mod.lessons.findIndex(l => l.id === lessonId) : 0;
  }, [modules, currentModuleIdx, lessonId]);

  const toggleComplete = async () => {
    if (!user) return;
    setMarking(true);
    const newState = !completed;
    const { data: existing } = await supabase.from('lesson_progress' as any)
      .select('id').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();
    if (existing) {
      await supabase.from('lesson_progress' as any).update({
        completed: newState, completed_at: newState ? new Date().toISOString() : null,
      } as any).eq('id', (existing as any).id);
    } else {
      await supabase.from('lesson_progress' as any).insert({
        user_id: user.id, lesson_id: lessonId,
        completed: newState, completed_at: newState ? new Date().toISOString() : null,
      } as any);
    }
    setCompleted(newState);
    setProgressMap(p => ({ ...p, [lessonId]: newState }));
    setMarking(false);
    if (newState && next) setTimeout(() => onOpenLesson(next.id), 400);
  };

  if (loading) return <FullLoader />;
  if (!lesson) return <EmptyState label="Leçon introuvable." />;

  const meta = TYPE_META[lesson.content_type] ?? TYPE_META.text;
  const Icon = meta.icon;
  const totalInModule = modules[currentModuleIdx]?.lessons.length ?? 0;

  // ── Desktop: sidebar + content ──────────────────────────────────────
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          width: 280, flexShrink: 0, background: '#1e1e1e',
          borderRight: `1px solid ${BORDER_SOFT}`,
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${BORDER_SOFT}` }}>
            <button onClick={onBackToCourse}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: TEXT_DIM, fontSize: 12, background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 0',
              }}>
              <ArrowLeft size={14} />
              Retour au cours
            </button>
          </div>

          {/* Sidebar modules */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {modules.map((m, mi) => {
              const isCurrentModule = mi === currentModuleIdx;
              const doneInModule = m.lessons.filter(l => progressMap[l.id]).length;
              const moduleComplete = doneInModule === m.lessons.length && m.lessons.length > 0;

              return (
                <div key={m.id}>
                  {/* Module label */}
                  <div style={{
                    padding: '10px 16px 6px',
                    fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: isCurrentModule ? TEXT : TEXT_MUTE,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {moduleComplete
                      ? <CheckCircle2 size={12} color={GREEN} />
                      : <span style={{ color: TEXT_MUTE }}>{String(mi + 1).padStart(2, '0')}</span>}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.title}
                    </span>
                  </div>

                  {/* Lessons */}
                  {m.lessons.map(l => {
                    const isCurrent = l.id === lessonId;
                    const done = progressMap[l.id];
                    const lMeta = TYPE_META[l.content_type] ?? TYPE_META.text;
                    const LIcon = lMeta.icon;

                    return (
                      <div
                        key={l.id}
                        onClick={() => onOpenLesson(l.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 16px 8px 28px',
                          cursor: 'pointer', fontSize: 13,
                          background: isCurrent ? 'rgba(255,255,255,0.05)' : 'transparent',
                          borderLeft: isCurrent ? `2px solid ${TEXT}` : '2px solid transparent',
                          color: isCurrent ? TEXT : done ? TEXT_MUTE : TEXT_DIM,
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}>
                        {done ? <CheckCircle2 size={13} color={GREEN} style={{ flexShrink: 0 }} />
                          : <LIcon size={12} color={lMeta.color} style={{ flexShrink: 0 }} />}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                          {l.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 40px 100px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: TEXT_MUTE }}>
              <span>Module {(currentModuleIdx + 1)}</span>
              <ChevronRight size={12} />
              <span style={{ color: TEXT_SUBTLE }}>Leçon {currentLessonInModuleIdx + 1}/{totalInModule}</span>
            </div>

            {/* Lesson header */}
            <div style={{ marginBottom: 24 }}>
              {lesson.module?.title && (
                <p style={{ color: TEXT_SUBTLE, fontSize: 12, margin: '0 0 6px', fontWeight: 500 }}>
                  {lesson.module.title}
                </p>
              )}
              <h1 style={{ color: TEXT, fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.4px', lineHeight: 1.25 }}>
                {lesson.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, color: meta.color, fontWeight: 500,
                  background: `${meta.color}12`, padding: '3px 10px', borderRadius: 6,
                }}>
                  <Icon size={12} strokeWidth={2} />
                  {meta.label}
                </span>
                {lesson.duration_min && (
                  <span style={{ fontSize: 12, color: TEXT_MUTE }}>
                    <Clock size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />
                    {lesson.duration_min} min
                  </span>
                )}
              </div>
            </div>

            {/* Lesson content */}
            <LessonContent lesson={lesson} isMobile={false} />

            {/* Mark as done */}
            {user && (
              <button onClick={toggleComplete} disabled={marking}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 20px', borderRadius: 12,
                  border: `1px solid ${completed ? GREEN_BORDER : BORDER}`,
                  background: completed ? GREEN_DIM : 'rgba(255,255,255,0.03)',
                  color: completed ? GREEN : TEXT,
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.15s', marginTop: 28, marginBottom: 24,
                }}>
                {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  : completed ? <><CheckCircle2 size={16} /> Terminé</>
                  : <><Circle size={16} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
              </button>
            )}

            {/* Prev / Next */}
            <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {prev ? <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} /> : <div />}
              {next ? <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} /> : <div />}
            </nav>
          </div>
        </main>
      </div>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 90 }}>
      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: BG, borderBottom: `1px solid ${BORDER_SOFT}`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBackToCourse} style={backBtnStyle}><ArrowLeft size={16} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: TEXT_MUTE }}>
            Module {currentModuleIdx + 1} · Leçon {currentLessonInModuleIdx + 1}/{totalInModule}
          </div>
          <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lesson.title}
          </div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, color: meta.color, fontWeight: 500,
          background: `${meta.color}12`, padding: '3px 8px', borderRadius: 5,
        }}>
          <Icon size={10} strokeWidth={2} />
          {meta.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        {/* Module name */}
        {lesson.module?.title && (
          <p style={{ color: TEXT_SUBTLE, fontSize: 11, margin: '0 0 6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {lesson.module.title}
          </p>
        )}
        <h1 style={{ color: TEXT, fontSize: 21, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
          {lesson.title}
        </h1>

        <LessonContent lesson={lesson} isMobile={true} />

        {/* Mark as done */}
        {user && (
          <button onClick={toggleComplete} disabled={marking}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 12,
              border: `1px solid ${completed ? GREEN_BORDER : BORDER}`,
              background: completed ? GREEN_DIM : 'rgba(255,255,255,0.03)',
              color: completed ? GREEN : TEXT,
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s', marginTop: 20, marginBottom: 16,
            }}>
            {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : completed ? <><CheckCircle2 size={16} /> Terminé</>
              : <><Circle size={16} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
          </button>
        )}

        {/* Prev / Next */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {next && <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} />}
          {prev && <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} />}
        </nav>
      </div>
      <SpinKeyframe />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── LessonContent — media + structured text ─────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function LessonContent({ lesson, isMobile }: { lesson: Lesson; isMobile: boolean }) {
  return (
    <>
      {/* Video */}
      {lesson.content_type === 'video' && lesson.content_url && (
        <div style={{
          position: 'relative', paddingBottom: '56.25%',
          background: '#000', borderRadius: 14, overflow: 'hidden',
          marginBottom: 20, border: `1px solid ${BORDER}`,
        }}>
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

      {/* PDF */}
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

      {/* Zoom */}
      {lesson.content_type === 'zoom' && (
        <div style={{ background: CARD, borderRadius: 14, padding: 20, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Radio size={14} color={TYPE_META.zoom.color} />
            <span style={{ color: TEXT_DIM, fontSize: 12, fontWeight: 600 }}>Session en direct</span>
          </div>
          {lesson.zoom_date ? (
            <p style={{ color: TEXT, fontSize: 14, margin: 0 }}>
              Prévue le {new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {' à '}{new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          ) : (
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: 0 }}>Date à confirmer — les inscrits seront prévenus par e-mail.</p>
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

      {/* Text content — structured rendering */}
      {lesson.content_text && <StructuredContent source={lesson.content_text} isMobile={isMobile} />}

      {/* Empty state */}
      {!lesson.content_text && !lesson.content_url && lesson.content_type !== 'zoom' && (
        <div style={{ color: TEXT_SUBTLE, fontSize: 13, padding: 24, textAlign: 'center', background: CARD, borderRadius: 12, border: `1px solid ${BORDER}` }}>
          Le contenu de cette leçon sera bientôt ajouté.
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── StructuredContent — intelligent text rendering ──────────────────
// ═══════════════════════════════════════════════════════════════════════
type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'callout'; text: string; variant: 'tip' | 'warning' | 'info' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'hr' };

function StructuredContent({ source, isMobile }: { source: string; isMobile: boolean }) {
  const sections = useMemo(() => parseIntoSections(source), [source]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 8 }}>
      {sections.map((section, si) => (
        <div key={si} style={{
          background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`,
          padding: isMobile ? '18px 16px' : '22px 24px',
          marginBottom: 8,
        }}>
          {/* Section heading */}
          {section.heading && (
            <div style={{
              fontSize: 16, fontWeight: 600, color: TEXT,
              marginBottom: 14, letterSpacing: '-0.01em',
              paddingBottom: 10,
              borderBottom: `1px solid ${BORDER_SOFT}`,
            }}>
              {inlineRender(section.heading)}
            </div>
          )}

          {/* Section blocks */}
          <div style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>
            {section.blocks.map((b, bi) => renderContentBlock(b, bi))}
          </div>
        </div>
      ))}
    </div>
  );
}

type Section = { heading: string | null; blocks: ContentBlock[] };

function parseIntoSections(src: string): Section[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const sections: Section[] = [];
  let current: Section = { heading: null, blocks: [] };
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // H2 creates a new section
    if (line.startsWith('## ')) {
      if (current.blocks.length > 0 || current.heading) {
        sections.push(current);
      }
      current = { heading: line.slice(3).trim(), blocks: [] };
      i++;
      continue;
    }

    // H3 is an inline sub-heading
    if (line.startsWith('### ')) {
      current.blocks.push({ type: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      current.blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Blockquote → callout
    if (line.startsWith('> ')) {
      let acc = line.slice(2); i++;
      while (i < lines.length && lines[i].startsWith('> ')) { acc += ' ' + lines[i].slice(2); i++; }
      const variant = detectCalloutVariant(acc);
      current.blocks.push({ type: 'callout', text: acc, variant });
      continue;
    }

    // Unordered list
    if (/^\s*[•\-\*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[•\-\*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[•\-\*]\s+/, '')); i++;
      }
      current.blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++;
      }
      current.blocks.push({ type: 'ol', items });
      continue;
    }

    // Check for UPPERCASE HEADING lines (many lessons use these)
    if (isUppercaseHeading(line) && !line.startsWith('#')) {
      if (current.blocks.length > 0 || current.heading) {
        sections.push(current);
      }
      current = { heading: toTitleCase(line.trim()), blocks: [] };
      i++;
      continue;
    }

    // Regular paragraph
    let acc = line; i++;
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i]) && !isUppercaseHeading(lines[i])) {
      acc += ' ' + lines[i]; i++;
    }
    current.blocks.push({ type: 'p', text: acc });
  }

  if (current.blocks.length > 0 || current.heading) {
    sections.push(current);
  }

  // If everything is in one section with no heading, keep as one card
  // but if there's a lot of content, it's still well-structured
  return sections;
}

function isUppercaseHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 4 || trimmed.length > 80) return false;
  const upper = trimmed.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (upper.length < 3) return false;
  return upper === upper.toUpperCase() && /[A-ZÀ-Ÿ]/.test(upper);
}

function toTitleCase(text: string): string {
  const cleaned = text.replace(/[—\-:]+$/, '').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function detectCalloutVariant(text: string): 'tip' | 'warning' | 'info' {
  const lower = text.toLowerCase();
  if (lower.includes('attention') || lower.includes('danger') || lower.includes('important') || lower.includes('arnaque') || lower.includes('erreur') || lower.includes('jamais') || lower.includes('ne faites pas')) return 'warning';
  if (lower.includes('conseil') || lower.includes('astuce') || lower.includes('recommand') || lower.includes('retenez') || lower.includes('retenir')) return 'tip';
  return 'info';
}

function isBlockStart(l: string): boolean {
  return /^---+$/.test(l.trim())
    || l.startsWith('## ') || l.startsWith('### ') || l.startsWith('> ')
    || /^\s*[•\-\*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l);
}

function renderContentBlock(b: ContentBlock, k: number): JSX.Element {
  switch (b.type) {
    case 'h3':
      return (
        <h3 key={k} style={{
          fontSize: 14, fontWeight: 600, color: TEXT,
          margin: k === 0 ? '0 0 8px' : '18px 0 8px',
          textTransform: 'none',
        }}>
          {inlineRender(b.text)}
        </h3>
      );
    case 'callout': {
      const configs = {
        tip: { icon: Lightbulb, bg: 'rgba(250,204,21,0.06)', border: 'rgba(250,204,21,0.15)', iconColor: '#fbbf24', accent: 'rgba(250,204,21,0.3)' },
        warning: { icon: AlertTriangle, bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', iconColor: '#f87171', accent: 'rgba(239,68,68,0.3)' },
        info: { icon: Info, bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.15)', iconColor: '#60a5fa', accent: 'rgba(96,165,250,0.3)' },
      };
      const cfg = configs[b.variant];
      const CalloutIcon = cfg.icon;
      return (
        <div key={k} style={{
          margin: '14px 0', padding: '12px 14px',
          borderRadius: 10,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          borderLeft: `3px solid ${cfg.accent}`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <CalloutIcon size={16} color={cfg.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, flex: 1 }}>
            {inlineRender(b.text)}
          </div>
        </div>
      );
    }
    case 'ul':
      return (
        <ul key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{
              position: 'relative', paddingLeft: 18, marginBottom: 6,
              fontSize: 14, lineHeight: 1.6,
            }}>
              <span style={{
                position: 'absolute', left: 4, top: 10,
                width: 4, height: 4, borderRadius: '50%',
                background: TEXT_SUBTLE,
              }} />
              {inlineRender(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none', counterReset: 'step' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{
              display: 'flex', gap: 10, marginBottom: 8,
              fontSize: 14, lineHeight: 1.6, alignItems: 'flex-start',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: TEXT_DIM,
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1 }}>{inlineRender(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'hr':
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid ${BORDER_SOFT}`, margin: '16px 0' }} />;
    case 'p':
    default:
      return <p key={k} style={{ margin: '0 0 10px' }}>{inlineRender(b.text)}</p>;
  }
}

function inlineRender(text: string): (string | JSX.Element)[] {
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

// ═══════════════════════════════════════════════════════════════════════
// ─── Shared components ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 14, borderRadius: 12,
        background: CARD, border: `1px solid ${BORDER}`,
        cursor: 'pointer', textAlign: isNext ? 'right' : 'left',
        color: TEXT, flexDirection: isNext ? 'row-reverse' : 'row',
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

function Chip({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
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

const backBtnStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: TEXT, cursor: 'pointer', flexShrink: 0,
};

function SpinKeyframe() {
  return <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>;
}

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
