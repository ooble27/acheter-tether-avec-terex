import { Phone, Mail, ShoppingCart, TrendingDown, Send, User, Search, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { getSupportFlowById, getQuestionById } from '@/data/supportFlows';

const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const iconMap = { ShoppingCart, TrendingDown, Send, User };

const categoryCards = [
  { flowId: 'buy-usdt', title: 'Acheter USDT', description: "Tout ce qu'il faut savoir pour acheter du USDT facilement et en toute sécurité.", icon: 'ShoppingCart' },
  { flowId: 'sell-usdt', title: 'Vendre USDT', description: 'Guides détaillés pour vendre vos USDT et recevoir vos fonds rapidement.', icon: 'TrendingDown' },
  { flowId: 'transfer', title: 'Transferts Internationaux', description: "Envoyez de l'argent partout en Afrique avec les meilleurs taux.", icon: 'Send' },
  { flowId: 'account', title: 'Compte & Sécurité', description: 'Gérez votre compte, votre vérification KYC et vos paramètres de sécurité.', icon: 'User' },
];

const sharedStyles = `
  @keyframes tx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .tx-fade { animation: tx-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .tx-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
  .tx-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
  .tx-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.06) !important; }
  .tx-input::placeholder { color: rgba(255,255,255,0.3); }
  .tx-cta { transition: transform 0.15s ease; }
  .tx-cta:hover { transform: translateY(-1px); }
  .tx-ans { transition: border-color 0.18s ease, background 0.18s ease; }
  .tx-ans:hover { border-color: rgba(255,255,255,0.18) !important; background: rgba(255,255,255,0.04) !important; }
  @media (max-width: 1100px) { .tx-vline { display: none !important; } }
  @media (max-width: 760px) { .tx-grid { grid-template-columns: 1fr !important; } }
  @media (max-width: 560px) { .tx-pad { padding-left: 20px !important; padding-right: 20px !important; } }
`;

const VLines = () => (
  <>
    <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
    <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
  </>
);

const HelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [conversationPath, setConversationPath] = useState<Array<{ question: string; answer: string }>>([]);
  const [solution, setSolution] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de se déconnecter', variant: 'destructive' });
    } else {
      toast({ title: 'Déconnexion réussie', description: 'Vous avez été déconnecté avec succès' });
      window.location.reload();
    }
  };

  const handleShowDashboard = () => navigate('/');

  const handleSelectFlow = (flowId: string) => {
    const flow = getSupportFlowById(flowId);
    if (flow) {
      setSelectedFlowId(flowId);
      setCurrentQuestionId(flow.startQuestionId);
      setConversationPath([]);
      setSolution(null);
    }
  };

  const handleSelectAnswer = (answerText: string, nextQuestionId?: string, solutionText?: string) => {
    const flow = selectedFlowId ? getSupportFlowById(selectedFlowId) : null;
    const currentQuestion = flow && currentQuestionId ? getQuestionById(flow, currentQuestionId) : null;
    if (currentQuestion) {
      setConversationPath([...conversationPath, { question: currentQuestion.question, answer: answerText }]);
    }
    if (solutionText) {
      setSolution(solutionText);
      setCurrentQuestionId(null);
    } else if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    }
  };

  const handleReset = () => {
    setSelectedFlowId(null);
    setCurrentQuestionId(null);
    setConversationPath([]);
    setSolution(null);
  };

  const selectedFlow = selectedFlowId ? getSupportFlowById(selectedFlowId) : null;
  const currentQuestion = selectedFlow && currentQuestionId ? getQuestionById(selectedFlow, currentQuestionId) : null;

  const filteredCategories = searchQuery
    ? categoryCards.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryCards;

  const header = (
    <HeaderSection
      user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
      onShowDashboard={handleShowDashboard}
      onLogout={handleLogout}
    />
  );

  // ---- Main help center view ----
  if (!selectedFlowId) {
    return (
      <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
        <style>{sharedStyles}</style>
        <VLines />
        {header}
        <div style={{ height: 72 }} />

        {/* HERO */}
        <header className="tx-pad tx-fade" style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 32px 0', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 12px' }}>Centre d'aide</p>
          <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 14px' }}>
            Comment pouvons-nous vous aider ?
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 520 }}>
            Guides, FAQ et support pour l'achat, la vente et les transferts de USDT sur Terex.
          </p>
          <div style={{ position: 'relative', maxWidth: 560 }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
            <input
              className="tx-input"
              placeholder="Poser une question ou rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, color: '#fff', fontSize: 14, padding: '0 14px 0 42px', height: 48, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </header>

        {/* CATEGORY GRID */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '44px 32px 0', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 18px' }}>Collections</p>
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Search size={28} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Aucun résultat</p>
              <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>Essayez d'autres mots-clés</p>
            </div>
          ) : (
            <div className="tx-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {filteredCategories.map(category => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <button key={category.flowId} onClick={() => handleSelectFlow(category.flowId)}
                    className="tx-tile" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '26px 24px', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComponent size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                      </div>
                      <ArrowRight size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                    <h3 style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 6px' }}>{category.title}</h3>
                    <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{category.description}</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* LIVE RATE STRIP */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 32px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 22px' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 6px' }}>Taux USDT / CFA · en direct</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, minHeight: 30 }}>
                {rateDisplay ? (
                  <>
                    <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>{rateDisplay}</span>
                    <span style={{ color: MUTED2, fontSize: 13, fontWeight: 600 }}>CFA</span>
                  </>
                ) : (
                  <span style={{ display: 'inline-block', width: 100, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
            </div>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', opacity: 0.85, boxShadow: '0 0 0 4px rgba(255,255,255,0.08)' }} />
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 32px 88px', position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 44, textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>Besoin d'aide supplémentaire ?</h2>
            <p style={{ fontSize: 14, color: MUTED, margin: '0 0 24px' }}>Notre équipe de support est disponible 24/7.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/contact')} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 48, padding: '0 22px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} /> Nous contacter
              </button>
              <button onClick={() => window.open('https://wa.me/14182619091', '_blank')} style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 48, padding: '0 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Phone size={16} /> WhatsApp
              </button>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    );
  }

  // ---- Conversation view ----
  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{sharedStyles}</style>
      <VLines />
      {header}
      <div style={{ height: 72 }} />

      <div className="tx-pad" style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 88px', position: 'relative', zIndex: 1 }}>
        <button onClick={handleReset}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: MUTED, fontSize: 13.5, cursor: 'pointer', marginBottom: 28, padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
          <ArrowLeft size={15} /> Retour aux catégories
        </button>

        {selectedFlow && (
          <div className="tx-fade" style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 12px' }}>Assistant</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {(() => {
                  const IconComponent = iconMap[selectedFlow.icon as keyof typeof iconMap];
                  return <IconComponent size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />;
                })()}
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 4px' }}>{selectedFlow.title}</h2>
                <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>{selectedFlow.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conversation history */}
        {conversationPath.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {conversationPath.map((item, index) => (
              <div key={index} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>{item.question}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle size={16} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current question */}
        {currentQuestion && !solution && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px' }}>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 18px' }}>{currentQuestion.question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQuestion.answers.map((answer, index) => (
                <button key={index} onClick={() => handleSelectAnswer(answer.text, answer.nextQuestionId, answer.solution)}
                  className="tx-ans" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px', color: 'rgba(255,255,255,0.85)', fontSize: 14, cursor: 'pointer' }}>
                  {answer.text}
                  <ArrowRight size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Solution */}
        {solution && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={20} color="rgba(255,255,255,0.9)" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Solution</h3>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 24px', whiteSpace: 'pre-line' }}>{solution}</p>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
              <p style={{ fontSize: 13.5, color: MUTED, margin: '0 0 16px' }}>Cette solution a-t-elle résolu votre problème ?</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleReset} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 46, padding: '0 22px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }}>
                  Oui, merci !
                </button>
                <button onClick={() => window.open('https://wa.me/14182619091', '_blank')} style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 46, padding: '0 22px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}>
                  Non, contacter le support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <FooterSection />
    </div>
  );
};

export default HelpPage;
