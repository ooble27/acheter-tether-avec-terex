import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, BookOpen, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight, ChevronLeft,
  GraduationCap, Play, Loader2, Award, Sparkles,
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

// ─── Tokens ─────────────────────────────────────────────────────────────
// Palette éditoriale : fond crème sombre, accents ambre chauds, texte off-white.
// Objectif : lecture longue confortable, feeling « académie » et pas « app fintech ».
const T = {
  bg: '#131211',            // Fond principal, très sombre mais pas noir
  panel: '#1c1a17',         // Cartes, panels
  panelSoft: '#211f1b',     // Zones actives, hovers
  border: 'rgba(255,238,210,0.10)',
  borderSoft: 'rgba(255,238,210,0.05)',
  text: '#f4ede1',          // Texte primaire, warm off-white
  textDim: '#a89f8f',
  textSubtle: '#6b6357',
  accent: '#e4b055',        // Ambre chaud — pour progression + boutons primaires
  accentSoft: 'rgba(228,176,85,0.12)',
  success: '#7fbf6d',
  successSoft: 'rgba(127,191,109,0.12)',
  danger: '#c96f6f',
} as const;
const FONT_HEAD = "'Fraunces', 'Playfair Display', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";

const LEVELS: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};
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
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: FONT_BODY }}>
      <FontLink />
      {view === 'catalog' && (
        <Catalog
          onBack={onBack}
          onOpenCourse={(id) => { setCourseId(id); setView('course'); }}
        />
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
    <div style={{ maxWidth: 820, margin: '0 auto', padding: isMobile ? '18px 20px 80px' : '48px 32px 120px' }}>
      <button onClick={onBack} style={backIcon}><ArrowLeft size={16} /></button>

      {/* Hero éditorial — sobre mais posé */}
      <header style={{ marginTop: 24, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles size={14} color={T.accent} />
          <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.accent, fontWeight: 500 }}>
            Terex Academy
          </span>
        </div>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: isMobile ? 32 : 44, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, fontWeight: 500, color: T.text, textWrap: 'balance' as any }}>
          Apprendre la crypto, sereinement.
        </h1>
        <p style={{ color: T.textDim, fontSize: isMobile ? 15 : 17, lineHeight: 1.6, margin: '18px 0 0', maxWidth: 620 }}>
          Des parcours pensés pour un débutant absolu. On construit ensemble votre autonomie —
          de la première notion jusqu'à votre premier achat de USDT sur Terex.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Loader2 size={22} color={T.textSubtle} style={{ animation: 'spin 1s linear infinite' }} /></div>
      ) : courses.length === 0 ? (
        <EmptyState label="Aucune formation disponible pour le moment." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {courses.map((c, i) => {
            const enrolled = isEnrolled(c.id);
            return (
              <CourseCard key={c.id} course={c} enrolled={enrolled} onClick={() => onOpenCourse(c.id)} featured={i === 0} isMobile={isMobile} />
            );
          })}
        </div>
      )}
      <SpinKeyframe />
    </div>
  );
}

function CourseCard({ course, enrolled, onClick, featured, isMobile }: {
  course: Course; enrolled: boolean; onClick: () => void; featured?: boolean; isMobile: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hover ? T.panelSoft : T.panel,
        border: `1px solid ${hover ? 'rgba(255,238,210,0.16)' : T.border}`,
        borderRadius: 20, padding: isMobile ? 20 : 26,
        transition: 'all 0.2s ease',
        color: T.text, fontFamily: FONT_BODY, outline: 'none',
      }}
    >
      {featured && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: '4px 10px', background: T.accentSoft, borderRadius: 999, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.accent, fontWeight: 600 }}>
          <Sparkles size={10} /> Parcours principal
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: isMobile ? 46 : 56, height: isMobile ? 46 : 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${T.accent}22, ${T.accent}08)`,
          border: `1px solid ${T.accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <GraduationCap size={isMobile ? 22 : 26} color={T.accent} strokeWidth={1.4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 style={{ fontFamily: FONT_HEAD, fontSize: isMobile ? 20 : 24, fontWeight: 500, color: T.text, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {course.title}
            </h3>
            {enrolled && <BadgeSuccess>Inscrit</BadgeSuccess>}
          </div>
          {course.description && (
            <p style={{ color: T.textDim, fontSize: 14, lineHeight: 1.55, margin: '0 0 14px' }}>
              {course.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Meta><BookOpen size={11} /> {LEVELS[course.level] ?? course.level}</Meta>
            {course.duration_hours && <Meta><Clock size={11} /> {course.duration_hours}h</Meta>}
            <Meta>{course.price_cfa === 0 ? 'Gratuit' : `${course.price_cfa.toLocaleString('fr-FR')} CFA`}</Meta>
          </div>
        </div>
        <ChevronRight size={18} color={T.textSubtle} style={{ flexShrink: 0, marginTop: isMobile ? 4 : 10, transition: 'transform 0.2s', transform: hover ? 'translateX(3px)' : 'none' }} />
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
    <div style={{ maxWidth: 820, margin: '0 auto', padding: isMobile ? '18px 20px 100px' : '40px 32px 140px' }}>
      <button onClick={onBack} style={backIcon}><ArrowLeft size={16} /></button>

      {/* Hero du cours */}
      <section style={{ marginTop: 24, marginBottom: 36 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.accent, fontWeight: 600 }}>
            Parcours · {LEVELS[course.level]}
          </span>
        </div>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: isMobile ? 28 : 40, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, color: T.text, textWrap: 'balance' as any }}>
          {course.title}
        </h1>
        {course.description && (
          <p style={{ color: T.textDim, fontSize: isMobile ? 15 : 16, lineHeight: 1.65, margin: '18px 0 0', maxWidth: 640 }}>
            {course.description}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <Meta><BookOpen size={11} /> {modules.length} modules</Meta>
          <Meta><Clock size={11} /> {course.duration_hours ? `${course.duration_hours}h` : `${totalLessons} leçons`}</Meta>
          {enrolled && <BadgeSuccess>Vous êtes inscrit</BadgeSuccess>}
        </div>
      </section>

      {/* Bloc progression / lock */}
      {enrolled ? (
        <section style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18, padding: 22, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={16} color={T.accent} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: '0.02em' }}>Votre progression</span>
            </div>
            <span style={{ fontSize: 13, color: T.textDim, fontVariantNumeric: 'tabular-nums' as any }}>
              {relevantCompleted}<span style={{ color: T.textSubtle }}> / {totalLessons}</span> · {pct}%
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: T.panelSoft, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: pct === 100 ? T.success : T.accent,
              transition: 'width 0.5s ease',
              borderRadius: 3,
            }} />
          </div>
          {pct === 100 && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: T.success, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} /> Parcours terminé — bravo !
            </p>
          )}
        </section>
      ) : (
        <section style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18, padding: 22, marginBottom: 32, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.panelSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={16} color={T.textDim} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: T.text }}>Inscription requise</p>
            <p style={{ margin: 0, fontSize: 13, color: T.textDim, lineHeight: 1.55 }}>
              Vous pouvez explorer les leçons marquées « Aperçu » gratuitement. Pour accéder à
              l'ensemble du parcours, contactez l'équipe Terex.
            </p>
          </div>
        </section>
      )}

      {/* Timeline verticale des modules — style OpenClassrooms */}
      <section>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textSubtle, fontWeight: 600, margin: '0 0 20px' }}>
          Le parcours en {modules.length} chapitres
        </p>
        <div style={{ position: 'relative' }}>
          {/* Trait vertical continu */}
          <div style={{
            position: 'absolute', left: 19, top: 12, bottom: 12,
            width: 1, background: T.borderSoft,
          }} />
          {modules.map((m, mi) => {
            const doneInModule = m.lessons.filter(l => isLessonDone(l.id)).length;
            const moduleDone = m.lessons.length > 0 && doneInModule === m.lessons.length;
            return (
              <div key={m.id} style={{ position: 'relative', paddingLeft: 56, marginBottom: 22 }}>
                {/* Puce numérotée */}
                <div style={{
                  position: 'absolute', left: 0, top: 4,
                  width: 40, height: 40, borderRadius: 20,
                  background: moduleDone ? T.success : T.panel,
                  border: `1px solid ${moduleDone ? T.success : T.border}`,
                  color: moduleDone ? T.bg : T.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums' as any,
                }}>
                  {moduleDone ? <CheckCircle2 size={18} /> : (mi + 1)}
                </div>

                {/* En-tête module */}
                <div style={{ paddingTop: 6, marginBottom: 12 }}>
                  <h3 style={{ fontFamily: FONT_HEAD, fontSize: isMobile ? 17 : 20, fontWeight: 500, color: T.text, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: 12, color: T.textSubtle, margin: '4px 0 0' }}>
                    {m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}
                    {enrolled && ` · ${doneInModule} terminée${doneInModule > 1 ? 's' : ''}`}
                  </p>
                </div>

                {/* Leçons du module */}
                <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  {m.lessons.map((l, li) => {
                    const Icon = TYPE_META[l.content_type]?.icon ?? Type;
                    const done = isLessonDone(l.id);
                    const accessible = canAccess(l);
                    return (
                      <div key={l.id}
                        onClick={() => accessible && onOpenLesson(l.id)}
                        onMouseEnter={e => { if (accessible) e.currentTarget.style.background = T.panelSoft; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 16px',
                          borderTop: li > 0 ? `1px solid ${T.borderSoft}` : 'none',
                          cursor: accessible ? 'pointer' : 'default',
                          transition: 'background 0.15s',
                        }}>
                        <div style={{ flexShrink: 0 }}>
                          {done
                            ? <CheckCircle2 size={16} color={T.success} />
                            : accessible
                              ? <Circle size={16} color={T.textSubtle} strokeWidth={1.5} />
                              : <Lock size={14} color={T.textSubtle} />}
                        </div>
                        <Icon size={13} color={T.textSubtle} strokeWidth={1.5} />
                        <span style={{
                          flex: 1, fontSize: 14, fontWeight: 400,
                          color: accessible ? T.text : T.textSubtle,
                          textDecoration: done ? 'line-through' : 'none',
                          opacity: accessible ? 1 : 0.7,
                        }}>
                          {l.title}
                        </span>
                        {l.is_free_preview && !enrolled && (
                          <span style={{ fontSize: 10, color: T.accent, background: T.accentSoft, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Aperçu</span>
                        )}
                        {l.duration_min && <span style={{ fontSize: 12, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' as any }}>{l.duration_min} min</span>}
                        {accessible && <ChevronRight size={14} color={T.textSubtle} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
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
      // Leçon + son module
      const { data: l } = await supabase.from('lessons' as any).select('*').eq('id', lessonId).single();
      const lessonData = l as any as Lesson;
      let moduleData: Module | undefined;
      if (lessonData?.module_id) {
        const { data: m } = await supabase.from('course_modules' as any).select('*').eq('id', lessonData.module_id).single();
        moduleData = m as any as Module;
      }
      setLesson({ ...lessonData, module: moduleData });

      // Tous les modules + leurs leçons pour la sidebar / navigation
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

  // Navigation prev / next à travers tous les modules
  const flat = useMemo(() => modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title }))), [modules]);
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
      // Petit délai pour laisser voir la case cochée avant d'avancer
      setTimeout(() => onOpenLesson(next.id), 400);
    }
  };

  if (loading) return <FullLoader />;
  if (!lesson) return <EmptyState label="Leçon introuvable." />;

  const meta = TYPE_META[lesson.content_type] ?? TYPE_META.text;
  const Icon = meta.icon;

  const wrapperStyle: React.CSSProperties = isMobile
    ? { padding: '18px 20px 40px', maxWidth: 720, margin: '0 auto' }
    : { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, padding: '40px 32px 60px', maxWidth: 1180, margin: '0 auto' };

  return (
    <div style={wrapperStyle}>
      {/* Sidebar desktop uniquement */}
      {!isMobile && (
        <aside style={{ position: 'sticky', top: 40, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', paddingRight: 6 }}>
          <button onClick={onBackToCourse}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: T.textDim, fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 20, fontFamily: FONT_BODY }}>
            <ArrowLeft size={13} /> Retour au parcours
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {modules.map((m, mi) => (
              <div key={m.id}>
                <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textSubtle, fontWeight: 600, margin: '0 0 8px' }}>
                  {(mi + 1).toString().padStart(2, '0')} — {m.title}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {m.lessons.map(l => {
                    const active = l.id === lessonId;
                    const done = !!progressMap[l.id];
                    return (
                      <button key={l.id} onClick={() => onOpenLesson(l.id)}
                        style={{
                          textAlign: 'left', background: active ? T.panelSoft : 'none',
                          border: 'none', padding: '7px 10px', borderRadius: 8,
                          display: 'flex', alignItems: 'center', gap: 8,
                          cursor: 'pointer', fontFamily: FONT_BODY,
                          color: active ? T.text : T.textDim,
                          fontSize: 12.5, lineHeight: 1.4,
                        }}>
                        {done
                          ? <CheckCircle2 size={11} color={T.success} style={{ flexShrink: 0 }} />
                          : <Circle size={11} color={active ? T.accent : T.textSubtle} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                        <span style={{ flex: 1 }}>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Contenu principal */}
      <article style={{ maxWidth: 720, minWidth: 0 }}>
        {isMobile && (
          <button onClick={onBackToCourse} style={backIcon}><ArrowLeft size={16} /></button>
        )}

        {/* En-tête de la leçon */}
        <header style={{ marginTop: isMobile ? 20 : 0, marginBottom: 28 }}>
          {lesson.module?.title && (
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.accent, fontWeight: 600, margin: '0 0 10px' }}>
              {lesson.module.title}
            </p>
          )}
          <h1 style={{ fontFamily: FONT_HEAD, fontSize: isMobile ? 26 : 36, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0, color: T.text, textWrap: 'balance' as any }}>
            {lesson.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, color: T.textDim, fontSize: 12.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon size={12} strokeWidth={1.6} /> {meta.label}
            </span>
            {lesson.duration_min && (
              <>
                <span style={{ color: T.textSubtle }}>·</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' as any }}>{lesson.duration_min} min de lecture</span>
              </>
            )}
          </div>
        </header>

        {/* Corps de la leçon */}
        <div style={{ marginBottom: 40 }}>
          {lesson.content_type === 'video' && lesson.content_url && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
              {isYouTube(lesson.content_url) ? (
                <iframe
                  src={toYouTubeEmbed(lesson.content_url)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
                display: 'flex', alignItems: 'center', gap: 14, color: T.text,
                fontSize: 14, textDecoration: 'none',
                background: T.panel, borderRadius: 14, padding: 20, border: `1px solid ${T.border}`,
                marginBottom: 24,
              }}>
              <FileText size={22} color={T.accent} strokeWidth={1.5} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Document PDF</div>
                <div style={{ color: T.textDim, fontSize: 12 }}>Cliquez pour ouvrir dans un nouvel onglet</div>
              </div>
              <ChevronRight size={16} color={T.textSubtle} />
            </a>
          )}

          {lesson.content_type === 'zoom' && (
            <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Radio size={16} color={T.accent} />
                <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.accent, fontWeight: 600 }}>
                  Session en direct
                </span>
              </div>
              {lesson.zoom_date ? (
                <p style={{ color: T.text, fontSize: 15, margin: '0 0 4px' }}>
                  Prévue le <strong>{new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> à {new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              ) : (
                <p style={{ color: T.textDim, fontSize: 14, margin: '0 0 4px' }}>Date à confirmer — les inscrits sont prévenus par e-mail 24 h avant.</p>
              )}
              {lesson.content_url && (
                <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
                    padding: '10px 18px', borderRadius: 10,
                    background: T.accent, color: T.bg,
                    fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  }}>
                  <Play size={13} /> Rejoindre la session Zoom
                </a>
              )}
            </div>
          )}

          {lesson.content_text && <ProseText source={lesson.content_text} />}

          {!lesson.content_text && !lesson.content_url && lesson.content_type !== 'zoom' && (
            <div style={{ color: T.textDim, fontSize: 14, padding: 24, textAlign: 'center', background: T.panel, borderRadius: 12 }}>
              Le contenu de cette leçon sera bientôt ajouté.
            </div>
          )}
        </div>

        {/* Bouton "Marquer comme terminé" */}
        {user && (
          <button onClick={toggleComplete} disabled={marking}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 12,
              border: `1px solid ${completed ? T.success : T.accent}`,
              background: completed ? T.successSoft : T.accent,
              color: completed ? T.success : T.bg,
              fontFamily: FONT_BODY,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
              marginBottom: 24,
            }}>
            {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : completed ? <><CheckCircle2 size={16} /> Leçon terminée</>
              : <><CheckCircle2 size={16} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
          </button>
        )}

        {/* Navigation prev / next */}
        <nav style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
          {prev ? (
            <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} />
          ) : <div />}
          {next ? (
            <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} />
          ) : <div />}
        </nav>
      </article>

      <SpinKeyframe />
    </div>
  );
}

function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 16, borderRadius: 12,
        background: T.panel, border: `1px solid ${T.border}`,
        cursor: 'pointer', textAlign: isNext ? 'right' : 'left',
        color: T.text, fontFamily: FONT_BODY,
        flexDirection: isNext ? 'row-reverse' : 'row',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = T.panelSoft; }}
      onMouseLeave={e => { e.currentTarget.style.background = T.panel; }}>
      {isNext ? <ChevronRight size={16} color={T.textDim} /> : <ChevronLeft size={16} color={T.textDim} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textSubtle, marginBottom: 2 }}>
          {isNext ? 'Leçon suivante' : 'Leçon précédente'}
        </div>
        <div style={{ fontSize: 13, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </div>
      </div>
    </button>
  );
}

// ─── Prose rendering (mini-markdown) ────────────────────────────────────
// Les leçons utilisent : **gras**, `code inline`, > citation, 1./• listes,
// ## titres, --- séparateurs. Rendu propre pour la lecture longue.
function ProseText({ source }: { source: string }) {
  const blocks = useMemo(() => parseBlocks(source), [source]);
  return (
    <div style={{ fontSize: 16, lineHeight: 1.75, color: T.text, fontFamily: FONT_BODY, maxWidth: 680 }}>
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
  const flushList = (kind: 'ul' | 'ol', items: string[]) => { if (items.length) blocks.push({ type: kind, items }); };
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (/^---+$/.test(line.trim())) { blocks.push({ type: 'hr' }); i++; continue; }
    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4) }); i++; continue; }
    if (line.startsWith('## ')) { blocks.push({ type: 'h2', text: line.slice(3) }); i++; continue; }
    if (line.startsWith('> ')) {
      let acc = line.slice(2);
      i++;
      while (i < lines.length && lines[i].startsWith('> ')) { acc += ' ' + lines[i].slice(2); i++; }
      blocks.push({ type: 'quote', text: acc });
      continue;
    }
    // Bullet list (• - *)
    if (/^\s*[•\-\*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[•\-\*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[•\-\*]\s+/, ''));
        i++;
      }
      flushList('ul', items);
      continue;
    }
    // Numbered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      flushList('ol', items);
      continue;
    }
    // Paragraphe (fusionne les lignes non vides consécutives)
    let acc = line;
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      acc += ' ' + lines[i];
      i++;
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
      return <h2 key={k} style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 500, color: T.text, margin: '32px 0 12px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{inline(b.text)}</h2>;
    case 'h3':
      return <h3 key={k} style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 500, color: T.text, margin: '24px 0 8px', letterSpacing: '-0.01em' }}>{inline(b.text)}</h3>;
    case 'quote':
      return (
        <blockquote key={k} style={{
          margin: '22px 0', padding: '14px 20px',
          borderLeft: `3px solid ${T.accent}`,
          background: T.panel, borderRadius: '0 10px 10px 0',
          color: T.text, fontStyle: 'italic', fontSize: 16,
        }}>{inline(b.text)}</blockquote>
      );
    case 'ul':
      return (
        <ul key={k} style={{ margin: '10px 0 18px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ position: 'relative', paddingLeft: 22, marginBottom: 8 }}>
              <span style={{ position: 'absolute', left: 4, top: 10, width: 5, height: 5, borderRadius: '50%', background: T.accent }} />
              {inline(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '10px 0 18px', paddingLeft: 24, listStyle: 'decimal' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ marginBottom: 8, paddingLeft: 4 }}>{inline(it)}</li>
          ))}
        </ol>
      );
    case 'hr':
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid ${T.borderSoft}`, margin: '32px 0' }} />;
    case 'p':
    default:
      return <p key={k} style={{ margin: '0 0 16px' }}>{inline(b.text)}</p>;
  }
}

// Rendu inline : **gras** et `code`
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
      parts.push(<strong key={key++} style={{ color: T.text, fontWeight: 600 }}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++} style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: '0.88em', background: T.panel,
        padding: '2px 6px', borderRadius: 5,
        border: `1px solid ${T.borderSoft}`, color: T.accent,
      }}>{token.slice(1, -1)}</code>);
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

// ─── Small building blocks ──────────────────────────────────────────────
function BadgeSuccess({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: T.success, background: T.successSoft,
      border: `1px solid ${T.success}30`,
      borderRadius: 6, padding: '3px 8px',
    }}>{children}</span>
  );
}
function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12, color: T.textDim,
      background: T.panelSoft, borderRadius: 6, padding: '4px 10px',
      border: `1px solid ${T.borderSoft}`,
    }}>{children}</span>
  );
}
function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: T.textDim, fontSize: 14 }}>
      <GraduationCap size={38} color={T.textSubtle} style={{ marginBottom: 14, opacity: 0.6 }} />
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );
}
function FullLoader() {
  return (
    <div style={{ textAlign: 'center', padding: 100 }}>
      <Loader2 size={22} color={T.textSubtle} style={{ animation: 'spin 1s linear infinite' }} />
      <SpinKeyframe />
    </div>
  );
}
const backIcon: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: T.panel, border: `1px solid ${T.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: T.text, cursor: 'pointer',
};
function SpinKeyframe() {
  return <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>;
}
function FontLink() {
  useEffect(() => {
    const id = 'academy-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
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
