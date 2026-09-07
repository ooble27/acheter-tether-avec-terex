import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, Video, FileText, Type, Radio,
  CheckCircle2, Circle, Lock, Clock, ChevronRight,
  GraduationCap, Play, Loader2, Download,
  Lightbulb, AlertTriangle, Info,
} from 'lucide-react';
import {
  C, FONT, card, heroCard, sH,
  cardHeaderRow, cardTitle, btnPrimary, btnGhost, numeric,
  listRowHoverIn, listRowHoverOut,
  primaryHoverIn, primaryHoverOut,
} from '@/components/admin/adminTheme';

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

const LEVELS: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const TYPE_LABEL: Record<string, string> = { video: 'Vidéo', pdf: 'PDF', text: 'Lecture', zoom: 'Live' };
const TYPE_ICON: Record<string, typeof Video> = { video: Video, pdf: FileText, text: Type, zoom: Radio };

// Green dot for "completed / published" — same as AcademyAdmin
const OK = '#4ade80';

// ═══════════════════════════════════════════════════════════════════════
// Root
// ═══════════════════════════════════════════════════════════════════════
export function Academy({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'catalog' | 'course' | 'module' | 'lesson'>('catalog');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.t1, fontFamily: FONT, fontWeight: 300 }}>
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
// Catalog
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
      <PageHead onBack={onBack} eyebrow="Formation" title="Terex Academy" sub="Comprendre la crypto, sans jargon." />

      {loading ? <FullLoader /> : courses.length === 0 ? (
        <EmptyState label="Aucune formation disponible pour le moment." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          {courses.map(c => {
            const enrolled = isEnrolled(c.id);
            return (
              <button key={c.id} onClick={() => onOpenCourse(c.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                  background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14,
                  padding: isMobile ? '18px 18px' : '22px 24px', color: C.t1, outline: 'none',
                  fontFamily: FONT, WebkitTapHighlightColor: 'transparent',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.l2; e.currentTarget.style.borderColor = C.bd; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.l1; e.currentTarget.style.borderColor = C.bds; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...sH, marginBottom: 8 }}>
                      Formation {enrolled && <span style={{ color: OK, marginLeft: 8, letterSpacing: 0, textTransform: 'none' }}>· Inscrit</span>}
                    </p>
                    <h3 style={{ color: C.t1, fontSize: 18, fontWeight: 400, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{c.title}</h3>
                    {c.description && (
                      <p style={{ color: C.t2, fontSize: 13, margin: '0 0 12px', lineHeight: 1.6, fontWeight: 300 }}>
                        {c.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <MetaTag>{LEVELS[c.level] ?? c.level}</MetaTag>
                      {c.duration_hours && <MetaTag><Clock size={11} /> {c.duration_hours}h</MetaTag>}
                      <MetaTag>{c.price_cfa === 0 ? 'Gratuit' : `${c.price_cfa.toLocaleString('fr-FR')} CFA`}</MetaTag>
                    </div>
                  </div>
                  <ChevronRight size={16} color={C.t3} style={{ flexShrink: 0, marginTop: 4 }} />
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
// Course Detail — hero + module list
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

  if (loading) return <FullLoader />;
  if (!course) return <EmptyState label="Formation introuvable." />;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
      <BackButton onClick={onBack} />

      {/* Hero — monochrome, style back-office */}
      <div style={{ ...heroCard, padding: isMobile ? '24px 22px 22px' : '30px 30px 26px', fontFamily: FONT }}>
        <p style={{ ...sH, marginBottom: 14 }}>Formation Terex Academy</p>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 24 : 30, lineHeight: 1.15,
          color: C.t1, margin: '0 0 12px',
        }}>
          {course.title}
        </h1>
        {course.description && (
          <p style={{ color: C.t2, fontSize: isMobile ? 13 : 14, lineHeight: 1.65, margin: 0, fontWeight: 300, maxWidth: 620 }}>
            {course.description}
          </p>
        )}

        {/* Stats bar — same pattern as AdminHero */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: 22 }}>
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

        {/* Progress bar under stats when enrolled */}
        {enrolled && totalLessons > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
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

        {/* Not enrolled notice */}
        {!enrolled && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 22,
            padding: '11px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.bds}`,
          }}>
            <Lock size={13} color={C.t3} />
            <p style={{ color: C.t2, fontSize: 12.5, margin: 0, fontWeight: 300 }}>
              Contactez l'équipe Terex pour accéder au contenu complet.
            </p>
          </div>
        )}
      </div>

      {/* Modules — clean single-column list within a card */}
      <div style={{ ...card, marginTop: 22, fontFamily: FONT }}>
        <div style={cardHeaderRow}>
          <span style={cardTitle}>Modules</span>
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

            return (
              <div
                key={m.id}
                onClick={() => onOpenModule(m.id)}
                style={{
                  padding: isMobile ? '14px 18px' : '16px 20px',
                  borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => listRowHoverIn(e.currentTarget)}
                onMouseLeave={e => listRowHoverOut(e.currentTarget)}>

                {/* Module number — monochrome, tabular */}
                <span style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: complete ? 'rgba(74,222,128,0.10)' : C.l2,
                  border: `1px solid ${complete ? 'rgba(74,222,128,0.25)' : C.bds}`,
                  color: complete ? OK : C.t2,
                  fontFamily: FONT, fontVariantNumeric: 'tabular-nums',
                  fontSize: 13, fontWeight: 400,
                }}>
                  {complete ? <CheckCircle2 size={15} /> : String(mi + 1).padStart(2, '0')}
                </span>

                {/* Title + progress bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: C.t1, fontSize: 14, fontWeight: 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: enrolled && m.lessons.length > 0 ? 8 : 3,
                  }}>
                    {m.title}
                  </div>
                  {enrolled && m.lessons.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 1 }}>
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
                    <div style={{ ...numeric, fontSize: 11, color: C.t3 }}>
                      {m.lessons.length} leçon{m.lessons.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <ChevronRight size={14} color={C.t3} style={{ flexShrink: 0 }} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Module Detail
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
  const canAccess = (l: Lesson) => enrolled || l.is_free_preview;

  const nextLesson = useMemo(() => {
    if (!module_) return null;
    return module_.lessons.find(l => !doneSet.has(l.id) && canAccess(l));
  }, [module_, doneSet, enrolled]);

  const doneInModule = module_ ? module_.lessons.filter(l => doneSet.has(l.id)).length : 0;
  const complete = module_ ? doneInModule === module_.lessons.length && module_.lessons.length > 0 : false;
  const pct = module_ && module_.lessons.length > 0 ? Math.round((doneInModule / module_.lessons.length) * 100) : 0;

  if (loading) return <FullLoader />;
  if (!module_) return <EmptyState label="Module introuvable." />;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
      <BackButton onClick={onBack} />

      {/* Hero — same pattern */}
      <div style={{ ...heroCard, padding: isMobile ? '24px 22px 22px' : '28px 30px 26px', fontFamily: FONT }}>
        <p style={{ ...sH, marginBottom: 12 }}>
          Module <span style={{ ...numeric, color: C.t2 }}>{String(moduleIdx + 1).padStart(2, '0')}</span> · <span style={{ ...numeric, color: C.t3 }}>{allModules.length}</span> au total
        </p>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 22 : 26, lineHeight: 1.2,
          color: C.t1, margin: 0,
        }}>
          {module_.title}
        </h1>

        {/* Progress line */}
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
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: complete ? OK : C.accent,
                width: `${pct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Downloads — monochrome pills */}
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

      {/* Continue CTA — plain white primary */}
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
                  padding: isMobile ? '13px 18px' : '14px 20px',
                  borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: accessible ? 'pointer' : 'default',
                  opacity: accessible ? 1 : 0.5,
                  transition: 'background 0.12s',
                  background: isNext ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
                onMouseEnter={e => { if (accessible) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isNext ? 'rgba(255,255,255,0.02)' : 'transparent'; }}>

                {/* Status */}
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

                {/* Type icon (subtle, monochrome) */}
                <Icon size={13} color={C.t3} strokeWidth={1.8} style={{ flexShrink: 0 }} />

                {/* Title + meta */}
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

                {/* Preview badge */}
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Lesson Viewer
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

  const label = TYPE_LABEL[lesson.content_type] ?? 'Leçon';
  const totalInModule = moduleLessons.length;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: isMobile ? '0 0 100px' : '0 24px 120px' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: C.bg, borderBottom: `1px solid ${C.bds}`,
        padding: isMobile ? '14px 16px 12px' : '18px 0 14px',
        marginBottom: isMobile ? 0 : 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={onBackToModule} inline />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...sH, fontSize: 10, marginBottom: 2 }}>
              Module <span style={{ ...numeric, color: C.t2, letterSpacing: 0 }}>{String(currentModuleIdx + 1).padStart(2, '0')}</span>
              <span style={{ margin: '0 6px', color: C.t3 }}>·</span>
              Leçon <span style={{ ...numeric, color: C.t2, letterSpacing: 0 }}>{currentLessonInModuleIdx + 1}/{totalInModule}</span>
            </div>
            <div style={{
              fontSize: 13, color: C.t1, fontWeight: 300,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {lesson.title}
            </div>
          </div>
        </div>
        {totalInModule > 0 && (
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', marginTop: 12, borderRadius: 1 }}>
            <div style={{
              height: '100%', borderRadius: 1, background: C.accent,
              width: `${((currentLessonInModuleIdx + 1) / totalInModule) * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}
      </div>

      {/* Lesson content */}
      <div style={{ padding: isMobile ? '22px 18px 0' : '0' }}>
        <p style={{ ...sH, marginBottom: 8 }}>{label}</p>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 22 : 28, lineHeight: 1.2,
          color: C.t1, margin: '0 0 12px',
        }}>
          {lesson.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          {lesson.duration_min && (
            <span style={{ ...numeric, fontSize: 12, color: C.t3, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} /> {lesson.duration_min} min
            </span>
          )}
          {lesson.module?.title && (
            <span style={{ fontSize: 12, color: C.t3 }}>
              {lesson.module.title}
            </span>
          )}
        </div>

        {/* Media */}
        <LessonContent lesson={lesson} isMobile={isMobile} />

        {/* Mark as done */}
        {user && (
          <button onClick={toggleComplete} disabled={marking}
            style={{
              ...(completed ? btnGhost : btnPrimary),
              width: '100%', height: 46, marginTop: 28, marginBottom: 22,
              justifyContent: 'center', fontSize: 13, fontWeight: 400,
              ...(completed ? { color: OK, borderColor: 'rgba(74,222,128,0.30)', background: 'rgba(74,222,128,0.06)' } : {}),
            }}
            onMouseEnter={e => { if (!completed) primaryHoverIn(e.currentTarget); }}
            onMouseLeave={e => { if (!completed) primaryHoverOut(e.currentTarget); }}>
            {marking
              ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              : completed
                ? <><CheckCircle2 size={14} /> Terminé</>
                : <><Circle size={14} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
          </button>
        )}

        {/* Prev / Next navigation */}
        <nav style={{ display: 'grid', gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr', gap: 10 }}>
          {prev && <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} />}
          {next && <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} />}
        </nav>

        {/* Desktop module sidebar (at bottom, in a card) */}
        {!isMobile && moduleLessons.length > 1 && (
          <div style={{ ...card, marginTop: 28, fontFamily: FONT }}>
            <div style={cardHeaderRow}>
              <span style={cardTitle}>Leçons du module</span>
              <span style={{ ...numeric, fontSize: 11, color: C.t3 }}>
                {moduleLessons.length}
              </span>
            </div>
            {moduleLessons.map((l, li) => {
              const isCurrent = l.id === lessonId;
              const done = progressMap[l.id];
              const isLast = li === moduleLessons.length - 1;
              return (
                <div key={l.id}
                  onClick={() => !isCurrent && onOpenLesson(l.id)}
                  style={{
                    padding: '12px 20px',
                    borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: isCurrent ? 'default' : 'pointer',
                    background: isCurrent ? 'rgba(255,255,255,0.03)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; }}
                  onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{
                    width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? OK : isCurrent ? C.t1 : C.t3,
                    ...numeric, fontSize: 11,
                    flexShrink: 0,
                  }}>
                    {done ? <CheckCircle2 size={13} /> : li + 1}
                  </span>
                  <span style={{
                    fontSize: 13, color: isCurrent ? C.t1 : done ? C.t2 : C.t1,
                    fontWeight: 300, flex: 1,
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
// LessonContent — media + text
// ═══════════════════════════════════════════════════════════════════════
function LessonContent({ lesson, isMobile }: { lesson: Lesson; isMobile: boolean }) {
  return (
    <>
      {lesson.content_type === 'video' && lesson.content_url && (
        <div style={{
          position: 'relative', paddingBottom: '56.25%',
          background: '#000', borderRadius: 14, overflow: 'hidden',
          marginBottom: 22, border: `1px solid ${C.bds}`,
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
            display: 'flex', alignItems: 'center', gap: 12, color: C.t1,
            fontSize: 13, textDecoration: 'none', fontFamily: FONT,
            background: C.l1, borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.bds}`,
            marginBottom: 22,
          }}>
          <FileText size={16} color={C.t2} />
          <span style={{ flex: 1 }}>Ouvrir le document PDF</span>
          <ChevronRight size={14} color={C.t3} />
        </a>
      )}

      {lesson.content_type === 'zoom' && (
        <div style={{ background: C.l1, borderRadius: 14, padding: 20, border: `1px solid ${C.bds}`, marginBottom: 22 }}>
          <p style={{ ...sH, marginBottom: 8 }}>Session en direct</p>
          {lesson.zoom_date ? (
            <p style={{ color: C.t1, fontSize: 14, margin: 0, fontWeight: 300 }}>
              Prévue le {new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {' à '}{new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          ) : (
            <p style={{ color: C.t2, fontSize: 13, margin: 0, fontWeight: 300 }}>Date à confirmer — les inscrits seront prévenus par e-mail.</p>
          )}
          {lesson.content_url && (
            <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
              style={{
                ...btnPrimary, textDecoration: 'none', marginTop: 14,
              }}>
              <Play size={12} fill="#111" /> Rejoindre
            </a>
          )}
        </div>
      )}

      {lesson.content_text && <StructuredContent source={lesson.content_text} isMobile={isMobile} />}

      {!lesson.content_text && !lesson.content_url && lesson.content_type !== 'zoom' && (
        <div style={{ color: C.t3, fontSize: 13, padding: 24, textAlign: 'center', background: C.l1, borderRadius: 14, border: `1px solid ${C.bds}` }}>
          Le contenu de cette leçon sera bientôt ajouté.
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// StructuredContent — parses markdown-like lesson text into sections
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
      {sections.map((section, si) => (
        <div key={si} style={{
          background: C.l1, borderRadius: 14, border: `1px solid ${C.bds}`,
          padding: isMobile ? '18px 18px' : '22px 26px',
          fontFamily: FONT,
        }}>
          {section.heading && (
            <div style={{
              fontSize: 15, fontWeight: 400, color: C.t1,
              marginBottom: 12, letterSpacing: '-0.01em',
              paddingBottom: 10,
              borderBottom: `1px solid ${C.bds}`,
            }}>
              {inlineRender(section.heading)}
            </div>
          )}
          <div style={{ color: C.t2, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
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
          fontSize: 14, fontWeight: 400, color: C.t1, fontFamily: FONT,
          margin: k === 0 ? '0 0 10px' : '20px 0 10px',
          letterSpacing: '-0.005em',
        }}>
          {inlineRender(b.text)}
        </h3>
      );
    case 'callout': {
      // Callouts stay monochrome — only warnings get a subtle warm tint.
      // Tip and Info share the same neutral surface.
      const cfg = b.variant === 'warning'
        ? { Icon: AlertTriangle, bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.20)', iconColor: '#f87171' }
        : b.variant === 'tip'
          ? { Icon: Lightbulb,   bg: C.l2,                    border: C.bd,                    iconColor: C.t2 }
          : { Icon: Info,        bg: C.l2,                    border: C.bd,                    iconColor: C.t2 };
      const CalloutIcon = cfg.Icon;
      return (
        <div key={k} style={{
          margin: '14px 0', padding: '13px 15px',
          borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <CalloutIcon size={15} color={cfg.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ color: C.t1, fontSize: 13, lineHeight: 1.65, flex: 1, fontWeight: 300 }}>
            {inlineRender(b.text)}
          </div>
        </div>
      );
    }
    case 'ul':
      return (
        <ul key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ position: 'relative', paddingLeft: 16, marginBottom: 7, fontSize: 13.5, lineHeight: 1.65 }}>
              <span style={{ position: 'absolute', left: 4, top: 10, width: 4, height: 4, borderRadius: '50%', background: C.t3 }} />
              {inlineRender(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '8px 0 14px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13.5, lineHeight: 1.65, alignItems: 'flex-start' }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: C.l2, border: `1px solid ${C.bds}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...numeric, fontSize: 11, color: C.t2,
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
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid ${C.bds}`, margin: '18px 0' }} />;
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
      parts.push(<strong key={key++} style={{ color: C.t1, fontWeight: 500 }}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++} style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: '0.88em', background: C.l2, border: `1px solid ${C.bds}`,
        padding: '2px 7px', borderRadius: 5, color: C.t1,
      }}>{token.slice(1, -1)}</code>);
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

// ═══════════════════════════════════════════════════════════════════════
// Shared components
// ═══════════════════════════════════════════════════════════════════════
function PageHead({ onBack, eyebrow, title, sub }: { onBack: () => void; eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <BackButton onClick={onBack} noMargin />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...sH, marginBottom: 6 }}>{eyebrow}</p>
        <h1 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: 26, lineHeight: 1.2, color: C.t1, margin: 0,
        }}>
          {title}
        </h1>
        <p style={{ color: C.t2, fontSize: 13, margin: '4px 0 0', fontWeight: 300 }}>{sub}</p>
      </div>
    </div>
  );
}

function BackButton({ onClick, noMargin, inline }: { onClick: () => void; noMargin?: boolean; inline?: boolean }) {
  return (
    <button onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: C.l2, border: `1px solid ${C.bds}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.t2, cursor: 'pointer', flexShrink: 0,
        marginBottom: noMargin || inline ? 0 : 20,
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

function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px', borderRadius: 12,
        background: C.l1, border: `1px solid ${C.bds}`,
        cursor: 'pointer', textAlign: isNext ? 'right' : 'left',
        color: C.t1, flexDirection: isNext ? 'row-reverse' : 'row',
        fontFamily: FONT, transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.l2; e.currentTarget.style.borderColor = C.bd; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.l1; e.currentTarget.style.borderColor = C.bds; }}>
      <ChevronRight size={15} color={C.t3} style={isNext ? {} : { transform: 'rotate(180deg)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...sH, fontSize: 10, marginBottom: 3 }}>
          {isNext ? 'Suivante' : 'Précédente'}
        </div>
        <div style={{ fontSize: 12.5, color: C.t1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 300 }}>
          {label}
        </div>
      </div>
    </button>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10.5, color: C.t2, letterSpacing: '0.04em',
      background: C.l2, borderRadius: 6, padding: '4px 9px',
      border: `1px solid ${C.bds}`,
      fontFamily: FONT, fontWeight: 300,
    }}>{children}</span>
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

function FullLoader() {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} />
      <SpinKeyframe />
    </div>
  );
}

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
