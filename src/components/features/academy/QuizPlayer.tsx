import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Loader2,
  HelpCircle, Award, Circle,
} from 'lucide-react';
import {
  C, FONT, card, heroCard, sH, cardHeaderRow, cardTitle,
  btnPrimary, btnGhost, numeric,
  primaryHoverIn, primaryHoverOut, ghostHoverIn, ghostHoverOut,
} from '@/components/admin/adminTheme';

const OK = '#4ade80';
const BAD = '#f87171';

type Quiz = {
  id: string; module_id: string; title: string; description: string | null; pass_score: number;
};
type Question = {
  id: string; quiz_id: string; question: string; explanation: string | null; position: number;
  answers: Answer[];
};
type Answer = {
  id: string; question_id: string; answer: string; is_correct: boolean; position: number;
};

export function QuizPlayer({
  quizId, moduleTitle, onBackToModule, onPassed,
}: {
  quizId: string;
  moduleTitle: string;
  onBackToModule: () => void;
  onPassed: () => void;
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'intro' | 'take' | 'result'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: q } = await supabase.from('quizzes' as any).select('*').eq('id', quizId).single();
      setQuiz(q as any);
      const { data: qs } = await supabase.from('quiz_questions' as any)
        .select('*').eq('quiz_id', quizId).order('position');
      const questionsList = (qs as any[]) ?? [];
      const withAnswers = await Promise.all(questionsList.map(async (qu: any) => {
        const { data: ans } = await supabase.from('quiz_answers' as any)
          .select('*').eq('question_id', qu.id).order('position');
        return { ...qu, answers: (ans as any[]) ?? [] };
      }));
      setQuestions(withAnswers);

      if (user) {
        const { data: attempts } = await supabase.from('quiz_attempts' as any)
          .select('score').eq('user_id', user.id).eq('quiz_id', quizId)
          .order('score', { ascending: false }).limit(1);
        const best = (attempts as any[])?.[0]?.score ?? null;
        setBestScore(best);
      }
      setLoading(false);
    })();
  }, [quizId, user]);

  const score = useMemo(() => {
    if (!questions.length) return 0;
    const correct = questions.reduce((sum, q) => {
      const picked = answers[q.id];
      const correctAns = q.answers.find(a => a.is_correct);
      return sum + (picked === correctAns?.id ? 1 : 0);
    }, 0);
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const passed = quiz && score >= quiz.pass_score;
  const answered = Object.keys(answers).length;
  const currentQ = questions[current];

  const submit = async () => {
    if (!user || !quiz) return;
    setSubmitted(true);
    await supabase.from('quiz_attempts' as any).insert({
      quiz_id: quiz.id, user_id: user.id,
      score, passed: !!passed, answers_json: answers,
    } as any);
    if (bestScore === null || score > bestScore) setBestScore(score);
    setStep('result');
    if (passed) setTimeout(() => onPassed(), 100);
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    setStep('take');
  };

  if (loading) return <DeferredSpinner />;
  if (!quiz) return null;

  // ─── Intro ─────────────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, fontWeight: 300 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
          <BackBtn onClick={onBackToModule} />

          <div style={{ ...heroCard, padding: isMobile ? '26px 22px' : '32px 30px', fontFamily: FONT }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: C.l2, border: `1px solid ${C.bds}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <HelpCircle size={16} color={C.t2} />
              </div>
              <p style={{ ...sH, margin: 0 }}>{moduleTitle}</p>
            </div>
            <h1 style={{
              fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.02em',
              fontSize: isMobile ? 24 : 30, lineHeight: 1.15,
              color: C.t1, margin: '0 0 10px',
            }}>
              {quiz.title}
            </h1>
            {quiz.description && (
              <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                {quiz.description}
              </p>
            )}

            <div style={{ display: 'flex', gap: 0, marginTop: 24 }}>
              {[
                { label: 'Questions', value: questions.length },
                { label: 'Seuil', value: quiz.pass_score, hint: '%' },
                ...(bestScore !== null ? [{ label: 'Meilleur score', value: bestScore, hint: '%' }] : []),
              ].map((s: any, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                  {i > 0 && <div style={{ width: 1, background: C.bds, marginRight: 18 }} />}
                  <div style={{ paddingRight: 18 }}>
                    <p style={{ ...sH, fontSize: 10, marginBottom: 5 }}>{s.label}</p>
                    <p style={{ ...numeric, color: C.t1, fontSize: 15, fontWeight: 400, margin: 0 }}>
                      {s.value}{s.hint && <span style={{ color: C.t3, fontSize: 11, marginLeft: 3, fontWeight: 300 }}>{s.hint}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bestScore !== null && bestScore >= quiz.pass_score && (
            <div style={{
              marginTop: 20, padding: '14px 18px', borderRadius: 12,
              background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.20)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Award size={18} color={OK} />
              <p style={{ color: C.t1, fontSize: 13, margin: 0, fontWeight: 300 }}>
                Vous avez validé ce quiz.{' '}
                <span style={{ color: C.t3 }}>Vous pouvez le refaire pour vous entraîner.</span>
              </p>
            </div>
          )}

          <button
            onClick={() => setStep('take')}
            style={{
              ...btnPrimary, width: '100%', height: 48, marginTop: 22,
              fontSize: 13, justifyContent: 'center',
            }}
            onMouseEnter={e => primaryHoverIn(e.currentTarget)}
            onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
            {bestScore !== null ? 'Refaire le quiz' : 'Commencer le quiz'}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Result ────────────────────────────────────────────────────────────
  if (step === 'result') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, fontWeight: 300 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
          <BackBtn onClick={onBackToModule} />

          {/* Big score card */}
          <div style={{
            ...heroCard, padding: isMobile ? '30px 22px' : '38px 30px', fontFamily: FONT,
            textAlign: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 18px',
              background: passed ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)',
              border: `1.5px solid ${passed ? 'rgba(74,222,128,0.30)' : 'rgba(248,113,113,0.30)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {passed ? <Award size={30} color={OK} /> : <RotateCcw size={26} color={BAD} />}
            </div>

            <p style={{ ...sH, marginBottom: 8, justifyContent: 'center' }}>
              {passed ? 'Quiz validé' : 'Continuez à vous entraîner'}
            </p>
            <div style={{
              ...numeric, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em',
              color: passed ? OK : C.t1, lineHeight: 1, margin: '10px 0 4px',
            }}>
              {score}<span style={{ color: C.t3, fontSize: 22, marginLeft: 4, fontWeight: 300 }}>%</span>
            </div>
            <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0', ...numeric }}>
              {questions.filter(q => {
                const picked = answers[q.id];
                const correct = q.answers.find(a => a.is_correct);
                return picked === correct?.id;
              }).length} / {questions.length} réponses correctes · seuil {quiz.pass_score}%
            </p>
          </div>

          {/* Per-question review */}
          <div style={{ ...card, marginTop: 22, fontFamily: FONT }}>
            <div style={cardHeaderRow}>
              <span style={cardTitle}>Correction</span>
            </div>
            {questions.map((q, qi) => {
              const picked = answers[q.id];
              const correct = q.answers.find(a => a.is_correct);
              const wasRight = picked === correct?.id;
              const pickedAns = q.answers.find(a => a.id === picked);
              const isLast = qi === questions.length - 1;
              return (
                <div key={q.id} style={{
                  padding: '16px 20px', borderBottom: isLast ? 'none' : `1px solid ${C.bds}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: wasRight ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)',
                      border: `1px solid ${wasRight ? 'rgba(74,222,128,0.30)' : 'rgba(248,113,113,0.30)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: wasRight ? OK : BAD,
                    }}>
                      {wasRight ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...sH, fontSize: 10, marginBottom: 2 }}>Question {qi + 1}</p>
                      <p style={{ color: C.t1, fontSize: 13.5, fontWeight: 400, margin: 0, lineHeight: 1.4 }}>
                        {q.question}
                      </p>
                    </div>
                  </div>

                  {!wasRight && pickedAns && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginLeft: 32, marginBottom: 6 }}>
                      <span style={{ ...sH, fontSize: 10 }}>Votre réponse</span>
                      <span style={{ color: BAD, fontSize: 13, fontWeight: 300, textDecoration: 'line-through' }}>{pickedAns.answer}</span>
                    </div>
                  )}
                  {correct && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginLeft: 32, marginBottom: q.explanation ? 8 : 0 }}>
                      <span style={{ ...sH, fontSize: 10 }}>{wasRight ? 'Bonne réponse' : 'Réponse correcte'}</span>
                      <span style={{ color: OK, fontSize: 13, fontWeight: 400 }}>{correct.answer}</span>
                    </div>
                  )}
                  {q.explanation && (
                    <p style={{ color: C.t2, fontSize: 12.5, margin: '8px 0 0 32px', lineHeight: 1.55, fontWeight: 300 }}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: passed ? '1fr' : '1fr 1fr', gap: 10, marginTop: 22 }}>
            {!passed && (
              <button onClick={restart}
                style={{ ...btnGhost, width: '100%', height: 46, justifyContent: 'center', fontSize: 13 }}
                onMouseEnter={e => ghostHoverIn(e.currentTarget)}
                onMouseLeave={e => ghostHoverOut(e.currentTarget)}>
                <RotateCcw size={13} /> Refaire le quiz
              </button>
            )}
            <button onClick={onBackToModule}
              style={{ ...btnPrimary, width: '100%', height: 46, justifyContent: 'center', fontSize: 13 }}
              onMouseEnter={e => primaryHoverIn(e.currentTarget)}
              onMouseLeave={e => primaryHoverOut(e.currentTarget)}>
              {passed ? 'Retour au module' : 'Revenir au module'}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Take ──────────────────────────────────────────────────────────────
  if (!currentQ) return null;
  const canGoNext = !!answers[currentQ.id];
  const isLastQ = current === questions.length - 1;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, fontWeight: 300 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '20px 16px 100px' : '32px 24px 120px' }}>
        <BackBtn onClick={() => setStep('intro')} />

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <p style={{ ...sH, fontSize: 10 }}>Question {current + 1} sur {questions.length}</p>
            <p style={{ ...numeric, color: C.t3, fontSize: 11, margin: 0 }}>
              {answered}/{questions.length} répondu{answered > 1 ? 'es' : ''}
            </p>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              height: '100%', borderRadius: 2, background: C.accent,
              width: `${((current + 1) / questions.length) * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{
          background: C.l1, borderRadius: 16, border: `1px solid ${C.bds}`,
          padding: isMobile ? '22px 20px' : '28px 28px', fontFamily: FONT,
        }}>
          <h2 style={{
            fontFamily: FONT, fontWeight: 300, letterSpacing: '-0.01em',
            fontSize: isMobile ? 19 : 22, lineHeight: 1.35,
            color: C.t1, margin: '0 0 22px',
          }}>
            {currentQ.question}
          </h2>

          {/* Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentQ.answers.map(a => {
              const picked = answers[currentQ.id] === a.id;
              return (
                <button key={a.id}
                  onClick={() => setAnswers({ ...answers, [currentQ.id]: a.id })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 10,
                    background: picked ? 'rgba(255,255,255,0.05)' : C.bg,
                    border: `1px solid ${picked ? C.accentBd : C.bds}`,
                    cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                    transition: 'all 0.15s', color: C.t1,
                  }}
                  onMouseEnter={e => { if (!picked) e.currentTarget.style.borderColor = C.bd; }}
                  onMouseLeave={e => { if (!picked) e.currentTarget.style.borderColor = C.bds; }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: picked ? C.accent : 'transparent',
                    border: `1.5px solid ${picked ? C.accent : C.bd}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {picked ? <Circle size={8} fill="#111" color="#111" /> : null}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 300 }}>
                    {a.answer}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            style={{
              ...btnGhost, flex: 1, height: 46, justifyContent: 'center', fontSize: 13,
              opacity: current === 0 ? 0.4 : 1, cursor: current === 0 ? 'default' : 'pointer',
            }}
            onMouseEnter={e => { if (current !== 0) ghostHoverIn(e.currentTarget); }}
            onMouseLeave={e => { if (current !== 0) ghostHoverOut(e.currentTarget); }}>
            <ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} /> Précédente
          </button>
          {!isLastQ ? (
            <button
              onClick={() => setCurrent(current + 1)}
              disabled={!canGoNext}
              style={{
                ...btnPrimary, flex: 1, height: 46, justifyContent: 'center', fontSize: 13,
                opacity: canGoNext ? 1 : 0.4, cursor: canGoNext ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (canGoNext) primaryHoverIn(e.currentTarget); }}
              onMouseLeave={e => { if (canGoNext) primaryHoverOut(e.currentTarget); }}>
              Suivante <ChevronRight size={13} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canGoNext || submitted}
              style={{
                ...btnPrimary, flex: 1, height: 46, justifyContent: 'center', fontSize: 13,
                opacity: canGoNext && !submitted ? 1 : 0.4,
                cursor: canGoNext && !submitted ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (canGoNext && !submitted) primaryHoverIn(e.currentTarget); }}
              onMouseLeave={e => { if (canGoNext && !submitted) primaryHoverOut(e.currentTarget); }}>
              {submitted ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <>Terminer <CheckCircle2 size={13} /></>}
            </button>
          )}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function DeferredSpinner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 220);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      background: C.bg, minHeight: '100vh', fontFamily: FONT,
      textAlign: 'center', padding: 80,
    }}>
      {visible && <Loader2 size={18} color={C.t3} style={{ animation: 'spin 1s linear infinite' }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: C.l2, border: `1px solid ${C.bds}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.t2, cursor: 'pointer', flexShrink: 0, marginBottom: 20,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t1; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
      <ArrowLeft size={16} />
    </button>
  );
}
