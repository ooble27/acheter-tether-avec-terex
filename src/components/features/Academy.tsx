import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, BookOpen, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight,
  GraduationCap, Play, Loader2, Download,
  Lightbulb, AlertTriangle, Info, Layers,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────
type Course = {
  id: string; title: string; slug: string; description: string | null;
  price_cfa: number; level: string; status: string; duration_hours: number | null;
};
type Module = { id: string; course_id: string; title: string; position: number; pptx_url: string | null; pdf_url: string | null };
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
const BG = '#111111';
const BG_ELEVATED = '#191919';
const CARD = '#1e1e1e';
const CARD_HOVER = '#252525';
const BORDER = 'rgba(255,255,255,0.08)';
const BORDER_ACTIVE = 'rgba(255,255,255,0.15)';
const TEXT = '#ffffff';
const TEXT_DIM = '#a1a1aa';
const TEXT_SUBTLE = '#71717a';
const TEXT_MUTE = '#52525b';
const GREEN = '#22c55e';
const GREEN_DIM = 'rgba(34,197,94,0.12)';
const GREEN_BORDER = 'rgba(34,197,94,0.25)';
const ACCENT = '#3b82f6';
const ACCENT_DIM = 'rgba(59,130,246,0.12)';

const LEVELS: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const TYPE_META: Record<string, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: 'Vidéo', color: '#818cf8' },
  pdf:   { icon: FileText, label: 'PDF', color: '#f472b6' },
  text:  { icon: Type, label: 'Lecture', color: '#60a5fa' },
  zoom:  { icon: Radio, label: 'Session live', color: '#34d399' },
};

const MODULE_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#f43f5e', '#84cc16',
  '#6366f1', '#14b8a6',
];

// ─── Root ───────────────────────────────────────────────────────────────
export function Academy({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'catalog' | 'course' | 'module' | 'lesson'>('catalog');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
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
          onOpenModule={(mId) => { setModuleId(mId); setView('module'); }}
        />
      )}
      {view === 'module' && moduleId && courseId && (
        <ModuleDetail
          moduleId={moduleId}
          courseId={courseId}
          onBack={() => { setModuleId(null); setView('course'); }}
          onOpenLesson={(lId) => { setLessonId(lId); setView('lesson'); }}
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
      <SpinKeyframe />
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
          {courses.map(c => {
            const enrolled = isEnrolled(c.id);
            return (
              <button key={c.id} onClick={() => onOpenCourse(c.id)}
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
                    width: 48, height: 48, borderRadius: 14, background: ACCENT_DIM,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <GraduationCap size={22} color={ACCENT} strokeWidth={1.6} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 600, margin: 0 }}>{c.title}</h3>
                      {enrolled && <Chip color={GREEN} bg={GREEN_DIM} border={GREEN_BORDER}>Inscrit</Chip>}
                    </div>
                    {c.description && (
                      <p style={{ color: TEXT_DIM, fontSize: 13, margin: '0 0 10px', lineHeight: 1.55 }}>
                        {c.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <MetaTag>{LEVELS[c.level] ?? c.level}</MetaTag>
                      {c.duration_hours && <MetaTag><Clock size={11} /> {c.duration_hours}h</MetaTag>}
                      <MetaTag>{c.price_cfa === 0 ? 'Gratuit' : `${c.price_cfa.toLocaleString('fr-FR')} CFA`}</MetaTag>
                    </div>
                  </div>
                  <ChevronRight size={16} color={TEXT_MUTE} style={{ flexShrink: 0, marginTop: 14 }} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── CourseDetail — module grid ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function CourseDetail({ courseId, onBack, onOpenModule }: {
  courseId: string; onBack: () => void; onOpenModule: (mId: string) => void;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
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
  const doneSet = useMemo(() => new Set(progress.filter(p => p.completed).map(p => p.lesson_id)), [progress]);
  const relevantCompleted = useMemo(() => {
    const ids = new Set(modules.flatMap(m => m.lessons.map(l => l.id)));
    return [...doneSet].filter(id => ids.has(id)).length;
  }, [modules, doneSet]);
  const pct = totalLessons > 0 ? Math.round((relevantCompleted / totalLessons) * 100) : 0;

  if (loading) return <FullLoader />;
  if (!course) return <EmptyState label="Formation introuvable." />;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '16px 16px 100px' : '32px 32px 120px' }}>
      {/* Back */}
      <button onClick={onBack} style={{ ...backBtnStyle, marginBottom: 20 }}>
        <ArrowLeft size={18} />
      </button>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${CARD} 0%, #1a1a2e 100%)`,
        borderRadius: 20, border: `1px solid ${BORDER}`,
        padding: isMobile ? '24px 20px' : '32px 32px',
        marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(59,130,246,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: 60,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(139,92,246,0.04)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', gap: isMobile ? 16 : 24, alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
          {/* Progress ring */}
          {enrolled && (
            <div style={{ flexShrink: 0 }}>
              <ProgressRing pct={pct} size={isMobile ? 72 : 88} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Formation
            </div>
            <h1 style={{ color: TEXT, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              {course.title}
            </h1>
            {course.description && (
              <p style={{ color: TEXT_DIM, fontSize: 14, lineHeight: 1.6, margin: '0 0 14px', maxWidth: 520 }}>
                {course.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <MetaTag><Layers size={12} /> {modules.length} modules</MetaTag>
              <MetaTag><BookOpen size={12} /> {totalLessons} leçons</MetaTag>
              {course.duration_hours && <MetaTag><Clock size={12} /> {course.duration_hours}h</MetaTag>}
              <MetaTag>{LEVELS[course.level] ?? course.level}</MetaTag>
            </div>
          </div>
        </div>

        {/* Not enrolled message */}
        {!enrolled && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`,
            marginTop: 20,
          }}>
            <Lock size={14} color={TEXT_SUBTLE} />
            <p style={{ color: TEXT_DIM, fontSize: 13, margin: 0 }}>
              Contactez l'équipe Terex pour accéder au contenu complet.
            </p>
          </div>
        )}
      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '0 4px' }}>
        <span style={{ color: TEXT_SUBTLE, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Modules
        </span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        {enrolled && (
          <span style={{ color: TEXT_MUTE, fontSize: 12 }}>
            {relevantCompleted}/{totalLessons} leçons terminées
          </span>
        )}
      </div>

      {/* Module grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 12 : 14,
      }}>
        {modules.map((m, mi) => {
          const doneInModule = m.lessons.filter(l => doneSet.has(l.id)).length;
          const moduleComplete = doneInModule === m.lessons.length && m.lessons.length > 0;
          const moduleStarted = doneInModule > 0;
          const color = MODULE_COLORS[mi % MODULE_COLORS.length];

          return (
            <button
              key={m.id}
              onClick={() => onOpenModule(m.id)}
              style={{
                display: 'flex', flexDirection: 'column',
                background: CARD, border: `1px solid ${moduleComplete ? GREEN_BORDER : BORDER}`,
                borderRadius: 16, padding: isMobile ? '16px 16px 14px' : '20px 20px 16px',
                cursor: 'pointer', color: TEXT, textAlign: 'left', outline: 'none',
                WebkitTapHighlightColor: 'transparent', transition: 'all 0.2s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = CARD_HOVER;
                e.currentTarget.style.borderColor = moduleComplete ? GREEN_BORDER : BORDER_ACTIVE;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = CARD;
                e.currentTarget.style.borderColor = moduleComplete ? GREEN_BORDER : BORDER;
                e.currentTarget.style.transform = 'translateY(0)';
              }}>

              {/* Top row: number + status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  background: moduleComplete ? GREEN_DIM : `${color}15`,
                  color: moduleComplete ? GREEN : color,
                  border: `1px solid ${moduleComplete ? GREEN_BORDER : `${color}30`}`,
                }}>
                  {moduleComplete ? <CheckCircle2 size={18} /> : String(mi + 1).padStart(2, '0')}
                </span>
                {enrolled && (
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: moduleComplete ? GREEN : moduleStarted ? TEXT_DIM : TEXT_MUTE,
                  }}>
                    {moduleComplete ? 'Terminé' : moduleStarted ? `${doneInModule}/${m.lessons.length}` : `${m.lessons.length} leçons`}
                  </span>
                )}
                {!enrolled && (
                  <span style={{ fontSize: 11, color: TEXT_MUTE }}>
                    {m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 style={{
                color: TEXT, fontSize: 15, fontWeight: 600,
                margin: '0 0 8px', lineHeight: 1.35, flex: 1,
              }}>
                {m.title}
              </h3>

              {/* Progress bar */}
              {enrolled && m.lessons.length > 0 && (
                <div style={{
                  width: '100%', height: 3, borderRadius: 2,
                  background: 'rgba(255,255,255,0.06)',
                  marginTop: 'auto',
                }}>
                  <div style={{
                    width: `${(doneInModule / m.lessons.length) * 100}%`,
                    height: '100%', borderRadius: 2,
                    background: moduleComplete ? GREEN : color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              )}

              {/* Hover arrow indicator */}
              <ChevronRight size={14} color={TEXT_MUTE} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                opacity: 0.4,
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── ModuleDetail — lesson list for one module ──────────────────────
// ═══════════════════════════════════════════════════════════════════════
function ModuleDetail({ moduleId, courseId, onBack, onOpenLesson }: {
  moduleId: string; courseId: string;
  onBack: () => void; onOpenLesson: (lId: string) => void;
}) {
  const [module_, setModule] = useState<ModuleWithLessons | null>(null);
  const [allModules, setAllModules] = useState<ModuleWithLessons[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: m } = await supabase.from('course_modules' as any).select('*').eq('id', moduleId).single();
      const modData = m as any as Module;
      const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', moduleId).order('position');
      setModule({ ...modData, lessons: (ls as any[]) ?? [] });

      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position');
      const withLessons = await Promise.all(((mods as any[]) ?? []).map(async (mod: any) => {
        const { data: modLessons } = await supabase.from('lessons' as any).select('*').eq('module_id', mod.id).order('position');
        return { ...mod, lessons: (modLessons as any[]) ?? [] };
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
  const color = MODULE_COLORS[moduleIdx >= 0 ? moduleIdx % MODULE_COLORS.length : 0];
  const canAccess = (l: Lesson) => enrolled || l.is_free_preview;

  const nextLesson = useMemo(() => {
    if (!module_) return null;
    return module_.lessons.find(l => !doneSet.has(l.id) && canAccess(l));
  }, [module_, doneSet, enrolled]);

  const doneInModule = module_ ? module_.lessons.filter(l => doneSet.has(l.id)).length : 0;
  const moduleComplete = module_ ? doneInModule === module_.lessons.length && module_.lessons.length > 0 : false;
  const pct = module_ && module_.lessons.length > 0 ? Math.round((doneInModule / module_.lessons.length) * 100) : 0;

  if (loading) return <FullLoader />;
  if (!module_) return <EmptyState label="Module introuvable." />;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '16px 16px 100px' : '32px 32px 120px' }}>
      {/* Back */}
      <button onClick={onBack} style={{ ...backBtnStyle, marginBottom: 20 }}>
        <ArrowLeft size={18} />
      </button>

      {/* Module header */}
      <div style={{
        background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`,
        padding: isMobile ? '20px 18px' : '28px 28px',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        {/* Color accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {/* Module number */}
          <span style={{
            width: 44, height: 44, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, flexShrink: 0,
            background: moduleComplete ? GREEN_DIM : `${color}15`,
            color: moduleComplete ? GREEN : color,
            border: `1px solid ${moduleComplete ? GREEN_BORDER : `${color}30`}`,
          }}>
            {moduleComplete ? <CheckCircle2 size={20} /> : String(moduleIdx + 1).padStart(2, '0')}
          </span>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: TEXT_SUBTLE, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Module {moduleIdx + 1} sur {allModules.length}
            </div>
            <h1 style={{ color: TEXT, fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0, lineHeight: 1.25, letterSpacing: '-0.3px' }}>
              {module_.title}
            </h1>
          </div>
        </div>

        {/* Progress */}
        {enrolled && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: TEXT_SUBTLE, fontSize: 12, fontWeight: 500 }}>Progression</span>
              <span style={{ color: moduleComplete ? GREEN : TEXT, fontSize: 13, fontWeight: 600 }}>
                {pct}%
                <span style={{ color: TEXT_SUBTLE, fontWeight: 400, marginLeft: 6, fontSize: 12 }}>
                  ({doneInModule}/{module_.lessons.length})
                </span>
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: moduleComplete ? GREEN : color,
                width: `${pct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Downloads */}
        {enrolled && (module_.pdf_url || module_.pptx_url) && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16,
            paddingTop: 16, borderTop: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <span style={{ fontSize: 12, color: TEXT_SUBTLE, fontWeight: 500, marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Download size={13} /> Supports :
            </span>
            {module_.pdf_url && (
              <a href={module_.pdf_url} download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12, fontWeight: 500, color: '#f472b6',
                  background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.18)',
                  borderRadius: 8, padding: '5px 12px', textDecoration: 'none', cursor: 'pointer',
                }}>
                <FileText size={12} /> PDF
              </a>
            )}
            {module_.pptx_url && (
              <a href={module_.pptx_url} download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12, fontWeight: 500, color: '#818cf8',
                  background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)',
                  borderRadius: 8, padding: '5px 12px', textDecoration: 'none', cursor: 'pointer',
                }}>
                <FileText size={12} /> PowerPoint
              </a>
            )}
          </div>
        )}
      </div>

      {/* Continue CTA */}
      {enrolled && nextLesson && (
        <button onClick={() => onOpenLesson(nextLesson.id)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderRadius: 14,
            background: `${color}10`, border: `1px solid ${color}25`,
            cursor: 'pointer', color: TEXT, textAlign: 'left',
            marginBottom: 20, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; }}>
          <span style={{
            width: 40, height: 40, borderRadius: 12, background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: TEXT_SUBTLE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              {doneInModule > 0 ? 'Continuer' : 'Commencer'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextLesson.title}
            </div>
          </div>
          <ChevronRight size={16} color={TEXT_MUTE} />
        </button>
      )}

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {module_.lessons.map((l, li) => {
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
                display: 'flex', alignItems: 'center', gap: 12,
                padding: isMobile ? '14px 14px' : '14px 18px',
                borderRadius: 14, cursor: accessible ? 'pointer' : 'default',
                background: isNext ? `${color}08` : CARD,
                border: `1px solid ${isNext ? `${color}20` : BORDER}`,
                opacity: accessible ? 1 : 0.5,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (accessible) { e.currentTarget.style.background = isNext ? `${color}12` : CARD_HOVER; e.currentTarget.style.borderColor = BORDER_ACTIVE; } }}
              onMouseLeave={e => { e.currentTarget.style.background = isNext ? `${color}08` : CARD; e.currentTarget.style.borderColor = isNext ? `${color}20` : BORDER; }}>

              {/* Lesson number */}
              <span style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600,
                background: done ? GREEN_DIM : 'rgba(255,255,255,0.04)',
                color: done ? GREEN : TEXT_MUTE,
                border: `1px solid ${done ? GREEN_BORDER : 'rgba(255,255,255,0.06)'}`,
              }}>
                {done ? <CheckCircle2 size={15} /> : li + 1}
              </span>

              {/* Type icon */}
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${meta.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={13} color={meta.color} strokeWidth={2} />
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: isNext ? 500 : 400,
                  color: done ? TEXT_DIM : TEXT,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {l.title}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: TEXT_MUTE }}>{meta.label}</span>
                  {l.duration_min && <span style={{ fontSize: 11, color: TEXT_MUTE }}>{l.duration_min} min</span>}
                </div>
              </div>

              {/* Status */}
              {l.is_free_preview && !enrolled && (
                <Chip color={TEXT_SUBTLE} bg="rgba(255,255,255,0.04)" border={BORDER}>Aperçu</Chip>
              )}
              {!accessible && <Lock size={14} color={TEXT_MUTE} style={{ flexShrink: 0 }} />}
              {accessible && <ChevronRight size={14} color={TEXT_MUTE} style={{ flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── LessonViewer ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function LessonViewer({ lessonId, courseId, onBackToModule, onOpenLesson }: {
  lessonId: string; courseId: string;
  onBackToModule: () => void; onOpenLesson: (lId: string) => void;
}) {
  const [lesson, setLesson] = useState<(Lesson & { module?: Module }) | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [allModules, setAllModules] = useState<ModuleWithLessons[]>([]);
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
        const { data: siblings } = await supabase.from('lessons' as any).select('*').eq('module_id', lessonData.module_id).order('position');
        setModuleLessons((siblings as any[]) ?? []);
      }
      setLesson({ ...lessonData, module: moduleData });

      const { data: mods } = await supabase.from('course_modules' as any).select('*').eq('course_id', courseId).order('position');
      const withLessons = await Promise.all(((mods as any[]) ?? []).map(async (mod: any) => {
        const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', mod.id).order('position');
        return { ...mod, lessons: (ls as any[]) ?? [] };
      }));
      setAllModules(withLessons);

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

  const flat = useMemo(() => allModules.flatMap(m => m.lessons), [allModules]);
  const idx = flat.findIndex(l => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  const currentModuleIdx = useMemo(() => allModules.findIndex(m => m.lessons.some(l => l.id === lessonId)), [allModules, lessonId]);
  const currentLessonInModuleIdx = useMemo(() => moduleLessons.findIndex(l => l.id === lessonId), [moduleLessons, lessonId]);
  const moduleColor = MODULE_COLORS[currentModuleIdx >= 0 ? currentModuleIdx % MODULE_COLORS.length : 0];

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
  const totalInModule = moduleLessons.length;

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: isMobile ? '0 0 100px' : '0 32px 120px' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: BG_ELEVATED,
        borderBottom: `1px solid ${BORDER}`,
        padding: isMobile ? '12px 16px' : '14px 0',
        marginBottom: isMobile ? 0 : 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBackToModule} style={backBtnStyle}>
            <ArrowLeft size={16} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: TEXT_MUTE }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: moduleColor }} />
              Module {currentModuleIdx + 1}
              <span style={{ color: TEXT_MUTE }}>·</span>
              Leçon {currentLessonInModuleIdx + 1}/{totalInModule}
            </div>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
              {lesson.title}
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, color: meta.color, fontWeight: 500,
            background: `${meta.color}12`, padding: '4px 10px', borderRadius: 6,
          }}>
            <Icon size={11} strokeWidth={2} />
            {meta.label}
          </span>
        </div>

        {/* Mini progress bar */}
        {totalInModule > 0 && (
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', marginTop: 10, borderRadius: 1 }}>
            <div style={{
              height: '100%', borderRadius: 1, background: moduleColor,
              width: `${((currentLessonInModuleIdx + 1) / totalInModule) * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}
      </div>

      {/* Lesson content */}
      <div style={{ padding: isMobile ? '20px 18px' : '0' }}>
        {/* Title */}
        {lesson.module?.title && (
          <p style={{ color: moduleColor, fontSize: 12, margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {lesson.module.title}
          </p>
        )}
        <h1 style={{ color: TEXT, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.4px', lineHeight: 1.25 }}>
          {lesson.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          {lesson.duration_min && (
            <span style={{ fontSize: 12, color: TEXT_MUTE, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {lesson.duration_min} min
            </span>
          )}
        </div>

        {/* Media content */}
        <LessonContent lesson={lesson} isMobile={isMobile} />

        {/* Mark as done */}
        {user && (
          <button onClick={toggleComplete} disabled={marking}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 14,
              border: `1px solid ${completed ? GREEN_BORDER : BORDER}`,
              background: completed ? GREEN_DIM : CARD,
              color: completed ? GREEN : TEXT,
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s', marginTop: 28, marginBottom: 24,
            }}
            onMouseEnter={e => { if (!completed) e.currentTarget.style.background = CARD_HOVER; }}
            onMouseLeave={e => { if (!completed) e.currentTarget.style.background = CARD; }}>
            {marking ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : completed ? <><CheckCircle2 size={16} /> Terminé</>
              : <><Circle size={16} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
          </button>
        )}

        {/* Prev / Next navigation */}
        <nav style={{ display: 'grid', gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr', gap: 10 }}>
          {prev && <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} />}
          {next && <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} />}
        </nav>

        {/* Module lessons sidebar for desktop */}
        {!isMobile && moduleLessons.length > 1 && (
          <div style={{
            marginTop: 32, padding: '20px 20px 14px',
            background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_SUBTLE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Leçons du module
            </div>
            {moduleLessons.map((l, li) => {
              const isCurrent = l.id === lessonId;
              const done = progressMap[l.id];
              return (
                <div key={l.id}
                  onClick={() => !isCurrent && onOpenLesson(l.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                    cursor: isCurrent ? 'default' : 'pointer',
                    background: isCurrent ? `${moduleColor}10` : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}>
                  {done ? <CheckCircle2 size={13} color={GREEN} style={{ flexShrink: 0 }} />
                    : <span style={{ width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: isCurrent ? moduleColor : TEXT_MUTE, fontWeight: 600, flexShrink: 0 }}>{li + 1}</span>}
                  <span style={{
                    fontSize: 13, color: isCurrent ? TEXT : done ? TEXT_MUTE : TEXT_DIM,
                    fontWeight: isCurrent ? 500 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {l.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── LessonContent — media + structured text ─────────────────────────
// ═══════════════════════════════════════════════════════════════════════
function LessonContent({ lesson, isMobile }: { lesson: Lesson; isMobile: boolean }) {
  return (
    <>
      {lesson.content_type === 'video' && lesson.content_url && (
        <div style={{
          position: 'relative', paddingBottom: '56.25%',
          background: '#000', borderRadius: 16, overflow: 'hidden',
          marginBottom: 24, border: `1px solid ${BORDER}`,
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

      {lesson.content_type === 'pdf' && lesson.content_url && (
        <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, color: TEXT,
            fontSize: 14, textDecoration: 'none',
            background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}`,
            marginBottom: 24,
          }}>
          <FileText size={20} color={TEXT_DIM} />
          <span style={{ flex: 1 }}>Ouvrir le document PDF</span>
          <ChevronRight size={14} color={TEXT_MUTE} />
        </a>
      )}

      {lesson.content_type === 'zoom' && (
        <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}`, marginBottom: 24 }}>
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
                background: TEXT, color: BG, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
              <Play size={13} /> Rejoindre
            </a>
          )}
        </div>
      )}

      {lesson.content_text && <StructuredContent source={lesson.content_text} isMobile={isMobile} />}

      {!lesson.content_text && !lesson.content_url && lesson.content_type !== 'zoom' && (
        <div style={{ color: TEXT_SUBTLE, fontSize: 13, padding: 24, textAlign: 'center', background: CARD, borderRadius: 14, border: `1px solid ${BORDER}` }}>
          Le contenu de cette leçon sera bientôt ajouté.
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── StructuredContent ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'callout'; text: string; variant: 'tip' | 'warning' | 'info' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'hr' };

type Section = { heading: string | null; blocks: ContentBlock[] };

function StructuredContent({ source, isMobile }: { source: string; isMobile: boolean }) {
  const sections = useMemo(() => parseIntoSections(source), [source]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 8 }}>
      {sections.map((section, si) => (
        <div key={si} style={{
          background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`,
          padding: isMobile ? '18px 16px' : '24px 28px',
          marginBottom: 10,
        }}>
          {section.heading && (
            <div style={{
              fontSize: 17, fontWeight: 600, color: TEXT,
              marginBottom: 14, letterSpacing: '-0.01em',
              paddingBottom: 12,
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
            }}>
              {inlineRender(section.heading)}
            </div>
          )}
          <div style={{ color: '#d1d5db', fontSize: 14.5, lineHeight: 1.75 }}>
            {section.blocks.map((b, bi) => renderContentBlock(b, bi))}
          </div>
        </div>
      ))}
    </div>
  );
}

function parseIntoSections(src: string): Section[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const sections: Section[] = [];
  let current: Section = { heading: null, blocks: [] };
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }

    if (line.startsWith('## ')) {
      if (current.blocks.length > 0 || current.heading) sections.push(current);
      current = { heading: line.slice(3).trim(), blocks: [] };
      i++; continue;
    }
    if (line.startsWith('### ')) {
      current.blocks.push({ type: 'h3', text: line.slice(4).trim() });
      i++; continue;
    }
    if (/^---+$/.test(line.trim())) {
      current.blocks.push({ type: 'hr' });
      i++; continue;
    }
    if (line.startsWith('> ')) {
      let acc = line.slice(2); i++;
      while (i < lines.length && lines[i].startsWith('> ')) { acc += ' ' + lines[i].slice(2); i++; }
      current.blocks.push({ type: 'callout', text: acc, variant: detectCalloutVariant(acc) });
      continue;
    }
    if (/^\s*[•\-\*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[•\-\*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[•\-\*]\s+/, '')); i++;
      }
      current.blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++;
      }
      current.blocks.push({ type: 'ol', items });
      continue;
    }
    if (isUppercaseHeading(line) && !line.startsWith('#')) {
      if (current.blocks.length > 0 || current.heading) sections.push(current);
      current = { heading: toTitleCase(line.trim()), blocks: [] };
      i++; continue;
    }

    let acc = line; i++;
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i]) && !isUppercaseHeading(lines[i])) {
      acc += ' ' + lines[i]; i++;
    }
    current.blocks.push({ type: 'p', text: acc });
  }
  if (current.blocks.length > 0 || current.heading) sections.push(current);
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
  return /^---+$/.test(l.trim()) || l.startsWith('## ') || l.startsWith('### ') || l.startsWith('> ')
    || /^\s*[•\-\*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l);
}

function renderContentBlock(b: ContentBlock, k: number): JSX.Element {
  switch (b.type) {
    case 'h3':
      return (
        <h3 key={k} style={{
          fontSize: 15, fontWeight: 600, color: TEXT,
          margin: k === 0 ? '0 0 10px' : '20px 0 10px',
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
          margin: '14px 0', padding: '14px 16px',
          borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`,
          borderLeft: `3px solid ${cfg.accent}`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <CalloutIcon size={16} color={cfg.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ color: TEXT, fontSize: 13.5, lineHeight: 1.65, flex: 1 }}>
            {inlineRender(b.text)}
          </div>
        </div>
      );
    }
    case 'ul':
      return (
        <ul key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ position: 'relative', paddingLeft: 18, marginBottom: 7, fontSize: 14, lineHeight: 1.65 }}>
              <span style={{ position: 'absolute', left: 4, top: 11, width: 4, height: 4, borderRadius: '50%', background: TEXT_SUBTLE }} />
              {inlineRender(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none', counterReset: 'step' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14, lineHeight: 1.65, alignItems: 'flex-start' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: TEXT_DIM, flexShrink: 0, marginTop: 2,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1 }}>{inlineRender(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'hr':
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid rgba(255,255,255,0.06)`, margin: '18px 0' }} />;
    case 'p':
    default:
      return <p key={k} style={{ margin: '0 0 12px' }}>{inlineRender(b.text)}</p>;
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
        padding: '2px 7px', borderRadius: 5, color: TEXT,
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
function ProgressRing({ pct, size }: { pct: number; size: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const isComplete = pct === 100;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={isComplete ? GREEN : ACCENT} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size > 80 ? 20 : 16, fontWeight: 700, color: isComplete ? GREEN : TEXT }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 14, borderRadius: 14,
        background: CARD, border: `1px solid ${BORDER}`,
        cursor: 'pointer', textAlign: isNext ? 'right' : 'left',
        color: TEXT, flexDirection: isNext ? 'row-reverse' : 'row',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = CARD_HOVER; e.currentTarget.style.borderColor = BORDER_ACTIVE; }}
      onMouseLeave={e => { e.currentTarget.style.background = CARD; e.currentTarget.style.borderColor = BORDER; }}>
      <ChevronRight size={16} color={TEXT_DIM} style={isNext ? {} : { transform: 'rotate(180deg)' }} />
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
      borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, color: TEXT_SUBTLE,
      background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 10px',
      border: '1px solid rgba(255,255,255,0.06)',
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
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
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
