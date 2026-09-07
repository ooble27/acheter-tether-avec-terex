import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, CheckCircle2, Circle, ChevronRight, Loader2,
  FileText, Video, Radio, Type, Clock, Play, BookOpen,
  Lightbulb, AlertTriangle, Info,
} from 'lucide-react';
import {
  C, FONT, card, cardHeaderRow, cardTitle, sH, numeric,
  btnPrimary, btnGhost,
  primaryHoverIn, primaryHoverOut,
} from '@/components/admin/adminTheme';

const OK = '#4ade80';

type Lesson = {
  id: string; module_id: string; title: string; content_type: string;
  content_url: string | null; content_text: string | null;
  zoom_date: string | null; duration_min: number | null;
  position: number; is_free_preview: boolean;
};
type Module = { id: string; title: string; position: number };
type ModuleLite = { id: string; lessons: Lesson[] };

const TYPE_LABEL: Record<string, string> = { video: 'Vidéo', pdf: 'PDF', text: 'Lecture', zoom: 'Session live' };
const TYPE_ICON: Record<string, typeof Video> = { video: Video, pdf: FileText, text: Type, zoom: Radio };

export function LessonViewer({
  lessonId, courseId, onBackToModule, onOpenLesson,
}: {
  lessonId: string; courseId: string;
  onBackToModule: () => void; onOpenLesson: (lId: string) => void;
}) {
  const [lesson, setLesson] = useState<(Lesson & { module?: Module }) | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [allModules, setAllModules] = useState<ModuleLite[]>([]);
  const [completed, setCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const scrollToSection = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      const { data: mods } = await supabase.from('course_modules' as any).select('id').eq('course_id', courseId).order('position');
      const withLessons = await Promise.all(((mods as any[]) ?? []).map(async (mod: any) => {
        const { data: ls } = await supabase.from('lessons' as any).select('*').eq('module_id', mod.id).order('position');
        return { id: mod.id, lessons: (ls as any[]) ?? [] };
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

  // Parse lesson content into sections for section-based navigation.
  // If the very first block of the first section is an image (the lesson's
  // hero picture, prepended in Supabase), lift it out so it can be rendered
  // full-bleed above the sections instead of inside a bordered card.
  const { hero, sections } = useMemo(() => {
    if (!lesson?.content_text) return { hero: null as ContentBlock | null, sections: [] as Section[] };
    const parsed = parseIntoSections(lesson.content_text);
    let heroBlock: ContentBlock | null = null;
    if (parsed.length > 0 && !parsed[0].heading && parsed[0].blocks[0]?.type === 'img') {
      heroBlock = parsed[0].blocks[0];
      // Drop the extracted image; if that leaves the first section empty,
      // drop the section too.
      const [first, ...rest] = parsed;
      const remaining = first.blocks.slice(1);
      const cleanedFirst = { ...first, blocks: remaining };
      return {
        hero: heroBlock,
        sections: remaining.length > 0 ? [cleanedFirst, ...rest] : rest,
      };
    }
    return { hero: null, sections: parsed };
  }, [lesson?.content_text]);

  const flat = useMemo(() => allModules.flatMap(m => m.lessons), [allModules]);
  const idx = flat.findIndex(l => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  const currentLessonInModuleIdx = useMemo(() => moduleLessons.findIndex(l => l.id === lessonId), [moduleLessons, lessonId]);
  const currentModuleIdx = useMemo(() => allModules.findIndex(m => m.lessons.some(l => l.id === lessonId)), [allModules, lessonId]);

  const totalSections = sections.length;
  const hasSections = totalSections > 0;

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

  if (loading) return <DeferredSpinner background />;
  if (!lesson) return null;

  const label = TYPE_LABEL[lesson.content_type] ?? 'Leçon';

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, fontWeight: 300, overflowX: 'hidden' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: isMobile ? '0 0 100px' : '0 24px 120px',
      }}>
        {/* Sticky header — respects the PWA / mobile safe area so the title
            never hides behind the status bar (notch, wifi / clock strip). */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20, background: C.bg,
          borderBottom: `1px solid ${C.bds}`,
          padding: isMobile
            ? 'calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px'
            : '22px 0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBackToModule}
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: C.l2, border: `1px solid ${C.bds}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.t2, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t1; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
              <ArrowLeft size={15} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...sH, fontSize: 10, marginBottom: 2 }}>
                Module <span style={{ ...numeric, color: C.t2, letterSpacing: 0 }}>{String(currentModuleIdx + 1).padStart(2, '0')}</span>
                <span style={{ margin: '0 6px', color: C.t3 }}>·</span>
                Leçon <span style={{ ...numeric, color: C.t2, letterSpacing: 0 }}>{currentLessonInModuleIdx + 1}/{moduleLessons.length}</span>
              </div>
              <div style={{
                fontSize: 13, color: C.t1, fontWeight: 300,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {lesson.title}
              </div>
            </div>
            {hasSections && (
              <div style={{
                display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 4,
                background: C.l2, border: `1px solid ${C.bds}`,
                borderRadius: 8, padding: '4px 10px',
                color: C.t2, fontSize: 11, ...numeric,
              }}>
                {totalSections} section{totalSections > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: isMobile ? '20px 16px 0' : '28px 0 0' }}>
          {/* Lesson meta head */}
          <p style={{ ...sH, marginBottom: 8 }}>{label}</p>
          <h1 style={{
            fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
            fontSize: isMobile ? 24 : 32, lineHeight: 1.18,
            color: C.t1, margin: '0 0 12px', textWrap: 'balance' as any,
          }}>
            {lesson.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            {lesson.duration_min && (
              <span style={{ ...numeric, fontSize: 12, color: C.t3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} /> {lesson.duration_min} min
              </span>
            )}
            {hasSections && (
              <span style={{ ...numeric, fontSize: 12, color: C.t3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <BookOpen size={12} /> {totalSections} section{totalSections > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Hero image — full-width, no card, sits above the two-column layout */}
          {hero && hero.type === 'img' && (
            <figure style={{ margin: '0 0 32px' }}>
              <img src={hero.url} alt={hero.alt} loading="lazy"
                style={{
                  width: '100%', display: 'block',
                  aspectRatio: '16 / 9', objectFit: 'cover',
                  borderRadius: 12, background: C.l2,
                }} />
              {(hero.caption || hero.alt) && (
                <figcaption style={{
                  color: C.t3, fontSize: 12, marginTop: 10,
                  fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5,
                }}>
                  {hero.caption || hero.alt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Two-column layout on desktop (sticky TOC + article), single column
              on mobile. The whole lesson is shown in one scroll — no section
              pagination — so it reads long and rich like a real course page. */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: !isMobile && hasSections ? '220px minmax(0, 1fr)' : 'minmax(0, 1fr)',
            gap: isMobile ? 0 : 32,
            alignItems: 'flex-start',
          }}>
            {/* TOC sidebar (desktop only) — anchors jump to each section */}
            {!isMobile && hasSections && (
              <aside style={{
                position: 'sticky', top: 110,
                background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
                padding: 8, overflow: 'hidden', minWidth: 0,
              }}>
                <p style={{ ...sH, fontSize: 10, padding: '10px 12px 8px', margin: 0 }}>Sommaire</p>
                {sections.map((s, si) => (
                  <button key={si} onClick={() => scrollToSection(si)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', textAlign: 'left', padding: '9px 12px',
                      borderRadius: 8, background: 'transparent',
                      border: 'none', cursor: 'pointer', color: C.t2,
                      fontFamily: FONT, fontWeight: 300, fontSize: 12.5,
                      marginBottom: 2, transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = C.t1; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.t2; }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: C.l2, border: `1px solid ${C.bds}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...numeric, fontSize: 10, fontWeight: 500, color: C.t3,
                    }}>
                      {si + 1}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.heading || `Section ${si + 1}`}
                    </span>
                  </button>
                ))}
              </aside>
            )}

            {/* Main content column — minWidth:0 lets wide children (tables,
                long code) scroll inside themselves instead of widening the page */}
            <div style={{ minWidth: 0 }}>
              {/* Media (video / pdf link / zoom info) */}
              <LessonMedia lesson={lesson} />

              {/* Full lesson — all sections stacked */}
              {hasSections ? (
                sections.map((s, si) => (
                  <div key={si} ref={el => { sectionRefs.current[si] = el; }}
                    style={{ scrollMarginTop: 90, marginTop: si === 0 ? 0 : 36 }}>
                    <SectionCard section={s} sectionIndex={si} total={totalSections} isMobile={isMobile} />
                  </div>
                ))
              ) : lesson.content_text ? (
                <div style={{
                  color: C.t2, fontSize: isMobile ? 15.5 : 16.5, lineHeight: 1.85, fontWeight: 300,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {lesson.content_text}
                </div>
              ) : null}

              {/* Mark as done */}
              {user && (
                <button onClick={toggleComplete} disabled={marking}
                  style={{
                    ...(completed ? btnGhost : btnPrimary),
                    width: '100%', height: 48, marginTop: 40,
                    justifyContent: 'center', fontSize: 13, fontWeight: 400,
                    ...(completed ? { color: OK, borderColor: 'rgba(74,222,128,0.30)', background: 'rgba(74,222,128,0.06)' } : {}),
                  }}
                  onMouseEnter={e => { if (!completed) primaryHoverIn(e.currentTarget); }}
                  onMouseLeave={e => { if (!completed) primaryHoverOut(e.currentTarget); }}>
                  {marking
                    ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    : completed
                      ? <><CheckCircle2 size={14} /> Leçon terminée</>
                      : <><Circle size={14} /> Marquer comme terminé{next ? ' & continuer' : ''}</>}
                </button>
              )}

              {/* Prev/Next lesson — stacked on mobile (each full width, readable),
                  side by side only on desktop where there's room. */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: (!isMobile && prev && next) ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)',
                gap: 10, marginTop: 14,
              }}>
                {prev && <NavCard direction="prev" label={prev.title} onClick={() => onOpenLesson(prev.id)} />}
                {next && <NavCard direction="next" label={next.title} onClick={() => onOpenLesson(next.id)} />}
              </div>

              {/* Desktop module lessons list */}
              {!isMobile && moduleLessons.length > 1 && (
                <div style={{ ...card, marginTop: 28, fontFamily: FONT }}>
                  <div style={cardHeaderRow}>
                    <span style={cardTitle}>Leçons du module</span>
                    <span style={{ ...numeric, fontSize: 11, color: C.t3 }}>{moduleLessons.length}</span>
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
                          color: done ? OK : isCurrent ? C.t1 : C.t3, ...numeric, fontSize: 11, flexShrink: 0,
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
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Section card — renders one parsed section
// ═══════════════════════════════════════════════════════════════════════
function SectionCard({ section, sectionIndex, total, isMobile }: {
  section: Section; sectionIndex: number; total: number; isMobile: boolean;
}) {
  // Renders directly on the page — no card border or background, so the text
  // flows like a real article. The visual grouping comes from the heading rule
  // and the eyebrow, not from an outer box.
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: C.l2, border: `1px solid ${C.bd}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.t2, ...numeric, fontSize: 11, fontWeight: 400,
        }}>
          {sectionIndex + 1}
        </span>
        <span style={{ ...sH, fontSize: 10 }}>Section {sectionIndex + 1} / {total}</span>
      </div>
      {section.heading && (
        <h2 style={{
          fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
          fontSize: isMobile ? 24 : 30, lineHeight: 1.2,
          color: C.t1, margin: '0 0 20px', textWrap: 'balance' as any,
          paddingBottom: 14, borderBottom: `1px solid ${C.bds}`,
        }}>
          {inlineRender(section.heading)}
        </h2>
      )}
      <div style={{ color: C.t2, fontSize: isMobile ? 15.5 : 16.5, lineHeight: 1.85, fontWeight: 300 }}>
        {section.blocks.map((b, bi) => renderContentBlock(b, bi))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Media
// ═══════════════════════════════════════════════════════════════════════
function LessonMedia({ lesson }: { lesson: Lesson }) {
  if (lesson.content_type === 'video' && lesson.content_url) {
    return (
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
    );
  }
  if (lesson.content_type === 'pdf' && lesson.content_url) {
    return (
      <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, color: C.t1,
          fontSize: 13, textDecoration: 'none', fontFamily: FONT,
          background: C.l1, borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.bds}`,
          marginBottom: 22, fontWeight: 300,
        }}>
        <FileText size={16} color={C.t2} />
        <span style={{ flex: 1 }}>Ouvrir le document PDF</span>
        <ChevronRight size={14} color={C.t3} />
      </a>
    );
  }
  if (lesson.content_type === 'zoom') {
    return (
      <div style={{ background: C.l1, borderRadius: 14, padding: 20, border: `1px solid ${C.bds}`, marginBottom: 22 }}>
        <p style={{ ...sH, marginBottom: 8 }}>Session en direct</p>
        {lesson.zoom_date ? (
          <p style={{ color: C.t1, fontSize: 14, margin: 0, fontWeight: 300 }}>
            Prévue le {new Date(lesson.zoom_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' à '}{new Date(lesson.zoom_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        ) : (
          <p style={{ color: C.t2, fontSize: 13, margin: 0, fontWeight: 300 }}>Date à confirmer.</p>
        )}
        {lesson.content_url && (
          <a href={lesson.content_url} target="_blank" rel="noopener noreferrer"
            style={{ ...btnPrimary, textDecoration: 'none', marginTop: 14 }}>
            <Play size={12} fill="#111" /> Rejoindre
          </a>
        )}
      </div>
    );
  }
  return null;
}

function NavCard({ direction, label, onClick }: { direction: 'prev' | 'next'; label: string; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', minWidth: 0,
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
          {isNext ? 'Leçon suivante' : 'Leçon précédente'}
        </div>
        <div style={{
          fontSize: 12.5, color: C.t1, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 300,
        }}>
          {label}
        </div>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Markdown-like parser (same logic used before, extracted)
// ═══════════════════════════════════════════════════════════════════════
type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'callout'; text: string; variant: 'tip' | 'warning' | 'info' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'img'; url: string; alt: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'hr' };

type Section = { heading: string | null; blocks: ContentBlock[] };

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
    if (line.startsWith('### ')) { current.blocks.push({ type: 'h3', text: line.slice(4).trim() }); i++; continue; }
    if (/^---+$/.test(line.trim())) { current.blocks.push({ type: 'hr' }); i++; continue; }
    // Markdown table: a header row of pipes, a separator row (---|---), then data rows.
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:\-|]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const splitRow = (r: string) => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = splitRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      current.blocks.push({ type: 'table', head, rows });
      continue;
    }
    // Markdown image: ![alt](url), optionally followed on the same line by a caption in _italics_
    const imgMatch = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*(?:_([^_]+)_)?\s*$/);
    if (imgMatch) {
      current.blocks.push({ type: 'img', alt: imgMatch[1], url: imgMatch[2], caption: imgMatch[3] });
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
      while (i < lines.length && /^\s*[•\-\*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[•\-\*]\s+/, '')); i++; }
      current.blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
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
    || /^\s*[•\-\*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)
    || /^\s*!\[[^\]]*\]\([^)]+\)/.test(l)
    || /^\s*\|.*\|\s*$/.test(l);
}

function renderContentBlock(b: ContentBlock, k: number): JSX.Element {
  switch (b.type) {
    case 'h3':
      return (
        <h3 key={k} style={{
          fontSize: 17, fontWeight: 400, color: C.t1, fontFamily: FONT,
          margin: k === 0 ? '0 0 12px' : '26px 0 12px', letterSpacing: '-0.01em',
        }}>
          {inlineRender(b.text)}
        </h3>
      );
    case 'callout': {
      const cfg = b.variant === 'warning'
        ? { Icon: AlertTriangle, bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.20)', iconColor: '#f87171' }
        : b.variant === 'tip'
          ? { Icon: Lightbulb, bg: C.l2, border: C.bd, iconColor: C.t2 }
          : { Icon: Info, bg: C.l2, border: C.bd, iconColor: C.t2 };
      const CalloutIcon = cfg.Icon;
      return (
        <div key={k} style={{
          margin: '18px 0', padding: '16px 18px',
          borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <CalloutIcon size={17} color={cfg.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ color: C.t1, fontSize: 14.5, lineHeight: 1.7, flex: 1, fontWeight: 300 }}>
            {inlineRender(b.text)}
          </div>
        </div>
      );
    }
    case 'ul':
      return (
        <ul key={k} style={{ margin: '12px 0 18px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ position: 'relative', paddingLeft: 20, marginBottom: 10, fontSize: 15.5, lineHeight: 1.75 }}>
              <span style={{ position: 'absolute', left: 4, top: 12, width: 6, height: 6, borderRadius: '50%', background: C.t3 }} />
              {inlineRender(it)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={k} style={{ margin: '12px 0 18px', paddingLeft: 0, listStyle: 'none' }}>
          {b.items.map((it, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, fontSize: 15.5, lineHeight: 1.75, alignItems: 'flex-start' }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: C.l2, border: `1px solid ${C.bds}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...numeric, fontSize: 12, color: C.t2,
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1 }}>{inlineRender(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'img':
      // Images flow directly on the page — no bordered card, no fill background.
      // We force a consistent 16:9 aspect ratio + object-fit: cover so photos of
      // different natural sizes still read as one system across lessons.
      return (
        <figure key={k} style={{ margin: '24px 0 28px' }}>
          <img src={b.url} alt={b.alt} loading="lazy"
            style={{
              width: '100%', display: 'block',
              aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, background: C.l2,
            }} />
          {(b.caption || b.alt) && (
            <figcaption style={{
              color: C.t3, fontSize: 12, marginTop: 10, textAlign: 'left',
              fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5,
            }}>
              {b.caption || b.alt}
            </figcaption>
          )}
        </figure>
      );
    case 'table':
      // Wrapped in an overflow-x container so wide tables scroll inside
      // themselves on mobile instead of blowing out the page width.
      return (
        <div key={k} style={{ margin: '20px 0 24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 10, border: `1px solid ${C.bds}` }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: b.head.length > 2 ? 380 : 0, fontSize: 14 }}>
            <thead>
              <tr>
                {b.head.map((cell, ci) => (
                  <th key={ci} style={{
                    textAlign: 'left', padding: '11px 14px',
                    background: C.l2, color: C.t1, fontWeight: 500, fontSize: 12.5,
                    borderBottom: `1px solid ${C.bd}`,
                  }}>
                    {inlineRender(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '11px 14px', color: ci === 0 ? C.t1 : C.t2,
                      fontWeight: ci === 0 ? 400 : 300, lineHeight: 1.5,
                      borderBottom: ri === b.rows.length - 1 ? 'none' : `1px solid ${C.bds}`,
                      verticalAlign: 'top',
                    }}>
                      {inlineRender(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'hr':
      return <hr key={k} style={{ border: 'none', borderTop: `1px solid ${C.bds}`, margin: '20px 0' }} />;
    case 'p':
    default:
      return <p key={k} style={{ margin: '0 0 14px' }}>{inlineRender(b.text)}</p>;
  }
}

function inlineRender(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  // Order matters: match links [text](url) first, then bold, then inline code.
  const regex = /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(`[^`]+`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    const token = m[0];
    if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        let href = linkMatch[2].trim();
        // Bare domains (etherscan.io) → prefix with https:// so they resolve.
        if (!/^https?:\/\//i.test(href) && !href.startsWith('/') && !href.startsWith('mailto:')) {
          href = 'https://' + href;
        }
        parts.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer"
            style={{ color: C.accent, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 400 }}>
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith('**')) {
      parts.push(<strong key={key++} style={{ color: C.t1, fontWeight: 500 }}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++} style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: '0.88em', background: C.l2, border: `1px solid ${C.bds}`,
        padding: '2px 7px', borderRadius: 5, color: C.t1, wordBreak: 'break-all',
      }}>{token.slice(1, -1)}</code>);
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

/**
 * A loader that only shows its spinner after 220 ms — most Supabase reads
 * come back well before that, so a hard "blank screen + spinner" flash for
 * fast navigations is avoided.
 */
function DeferredSpinner({ background }: { background?: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 220);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      background: background ? C.bg : 'transparent',
      minHeight: background ? '100vh' : 240, fontFamily: FONT,
      textAlign: 'center', padding: 80,
    }}>
      {visible && <Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function isYouTube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}
function toYouTubeEmbed(url: string): string {
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] ?? '';
  else if (url.includes('v=')) videoId = url.split('v=')[1]?.split(/[&#]/)[0] ?? '';
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}
