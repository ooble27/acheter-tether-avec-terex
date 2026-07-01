import { Phone, Mail, Coins, HandCoins, Send, User, Search, CheckCircle, ArrowLeft, ArrowRight, Sparkles, LifeBuoy, BookOpen, MessageCircle } from 'lucide-react';
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
const CARD = '#1a1a1a';
const CARD2 = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const iconMap = { Coins, HandCoins, Send, User };

const categoryCards = [
  { flowId: 'buy-usdt', title: 'Acheter USDT', description: "Tout ce qu'il faut savoir pour acheter du USDT facilement et en toute sécurité.", icon: 'Coins', articles: 8 },
  { flowId: 'sell-usdt', title: 'Vendre USDT', description: 'Guides détaillés pour vendre vos USDT et recevoir vos fonds rapidement.', icon: 'HandCoins', articles: 6 },
  { flowId: 'transfer', title: 'Transferts Internationaux', description: "Envoyez de l'argent partout en Afrique avec les meilleurs taux.", icon: 'Send', articles: 5 },
  { flowId: 'account', title: 'Compte & Sécurité', description: 'Gérez votre compte, votre vérification KYC et vos paramètres de sécurité.', icon: 'User', articles: 7 },
];

const popularQueries = ['Délai de réception', 'Vérification KYC', 'Frais de transfert', 'Wave / Orange Money'];

const sharedStyles = `
  @keyframes tx-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .tx-fade { animation: tx-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
  .tx-fade-2 { animation: tx-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
  .tx-tile { transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
  .tx-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
  .tx-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.06) !important; }
  .tx-input::placeholder { color: rgba(255,255,255,0.3); }
  .tx-cta { transition: transform 0.15s ease; }
  .tx-cta:hover { transform: translateY(-1px); }
  .tx-ans { transition: border-color 0.18s ease, background 0.18s ease; }
  .tx-ans:hover { border-color: rgba(255,255,255,0.18) !important; background: rgba(255,255,255,0.04) !important; }
  .tx-chip { transition: border-color 0.2s ease, background 0.2s ease; }
  .tx-chip:hover { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.05) !important; }
  @keyframes tx-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.85); } }
  .tx-live-dot { animation: tx-pulse 1.6s ease-in-out infinite; }
  @keyframes tx-typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
  .tx-dot1 { animation: tx-typing 1.3s ease-in-out infinite; }
  .tx-dot2 { animation: tx-typing 1.3s ease-in-out 0.2s infinite; }
  .tx-dot3 { animation: tx-typing 1.3s ease-in-out 0.4s infinite; }
  @keyframes tx-bubble { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .tx-b1 { animation: tx-bubble 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
  .tx-b2 { animation: tx-bubble 0.6s cubic-bezier(0.22,1,0.36,1) 0.8s both; }
  .tx-b3 { animation: tx-bubble 0.6s cubic-bezier(0.22,1,0.36,1) 1.3s both; }
  @media (max-width: 1100px) { .tx-vline { display: none !important; } }
  @media (max-width: 940px) { .tx-asym { grid-template-columns: 1fr !important; } .tx-chat { order: -1; } }
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
        <div style={{ height: 64 }} />

        {/* HERO — éditorial + barre de recherche premium */}
        <header className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 0', position: 'relative', zIndex: 1 }}>
          <div className="tx-fade" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 10px', borderRadius: 999, background: ICON_BG, border: `1px solid ${BORDER}`, marginBottom: 22 }}>
              <LifeBuoy size={14} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.01em' }}>Centre d'aide Terex</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.1rem,5vw,3.1rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04, margin: '0 0 16px' }}>
              Comment pouvons-nous<br />vous aider ?
            </h1>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.6, margin: '0 auto 30px', maxWidth: 480 }}>
              Guides, FAQ et assistance pour l'achat, la vente et les transferts de USDT.
            </p>

            {/* Barre de recherche — mockup premium */}
            <div className="tx-fade-2" style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                <input
                  className="tx-input"
                  placeholder="Rechercher un guide, une question…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', background: CARD, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 16, color: '#fff', fontSize: 15, padding: '0 64px 0 50px', height: 60, outline: 'none', boxSizing: 'border-box' }}
                />
                <kbd style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 9px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: MUTED2 }}>
                  <Sparkles size={11} /> AI
                </kbd>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: MUTED2, alignSelf: 'center' }}>Populaire :</span>
                {popularQueries.map(q => (
                  <button key={q} onClick={() => setSearchQuery(q)} className="tx-chip" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '6px 13px', fontSize: 12.5, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* SUPPORT EN DIRECT + COLLECTIONS — layout asymétrique */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 0', position: 'relative', zIndex: 1 }}>
          <div className="tx-asym" style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 18, alignItems: 'stretch' }}>

            {/* Mockup CHAT — assistant en direct */}
            <div className="tx-chat tx-fade" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* En-tête conversation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>TX</div>
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 13, height: 13, borderRadius: '50%', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="tx-live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} />
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>Support Terex</p>
                  <p style={{ fontSize: 12, color: MUTED2, margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} /> En ligne · répond en ~5 min
                  </p>
                </div>
                <MessageCircle size={18} color="rgba(255,255,255,0.3)" />
              </div>

              {/* Bulles */}
              <div style={{ flex: 1, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'flex-end', minHeight: 240 }}>
                <div className="tx-b1" style={{ alignSelf: 'flex-start', maxWidth: '82%', background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: '16px 16px 16px 4px', padding: '11px 15px' }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, color: 'rgba(255,255,255,0.92)' }}>Bonjour 👋 Comment puis-je vous aider aujourd'hui ?</p>
                </div>
                <div className="tx-b2" style={{ alignSelf: 'flex-end', maxWidth: '82%', background: '#fff', borderRadius: '16px 16px 4px 16px', padding: '11px 15px' }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, color: '#141414', fontWeight: 500 }}>Combien de temps pour recevoir mes CFA ?</p>
                </div>
                <div className="tx-b3" style={{ alignSelf: 'flex-start', background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: '16px 16px 16px 4px', padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 8 }}>
                    <span className="tx-dot1" style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                    <span className="tx-dot2" style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                    <span className="tx-dot3" style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                  </div>
                </div>
              </div>

              {/* Réponses rapides + barre de saisie */}
              <div style={{ padding: '0 20px 18px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
                  {['Délais', 'Frais', 'KYC'].map(c => (
                    <span key={c} className="tx-chip" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '6px 12px', fontSize: 12, color: 'rgba(255,255,255,0.7)', cursor: 'default' }}>{c}</span>
                  ))}
                </div>
                <button onClick={() => window.open('https://wa.me/14182619091', '_blank')} className="tx-cta" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '0 8px 0 16px', height: 48, cursor: 'pointer' }}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13.5, color: MUTED2 }}>Écrire un message…</span>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Send size={15} color="#141414" />
                  </span>
                </button>
              </div>
            </div>

            {/* Collections — bento à tailles variées */}
            <div className="tx-fade-2" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: 0 }}>Parcourir les collections</p>
                <span style={{ fontSize: 12, color: MUTED2 }}>{filteredCategories.length} catégories</span>
              </div>

              {filteredCategories.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '48px 24px' }}>
                  <Search size={28} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Aucun résultat</p>
                  <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>Essayez d'autres mots-clés</p>
                </div>
              ) : (
                <div className="tx-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 14 }}>
                  {filteredCategories.map((category, i) => {
                    const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                    const feature = i === 0; // première tuile mise en avant
                    return (
                      <button key={category.flowId} onClick={() => handleSelectFlow(category.flowId)}
                        className="tx-tile" style={{ gridColumn: feature ? '1 / -1' : 'auto', background: feature ? CARD : CARD2, border: `1px solid ${BORDER}`, borderRadius: 18, padding: feature ? '24px 24px' : '22px 20px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: feature ? 'row' : 'column', alignItems: feature ? 'center' : 'stretch', gap: feature ? 18 : 0, position: 'relative' }}>
                        <div style={{ width: feature ? 52 : 44, height: feature ? 52 : 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: feature ? 0 : 16 }}>
                          <IconComponent size={feature ? 24 : 20} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <h3 style={{ fontSize: feature ? 17 : 15.5, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 5px' }}>{category.title}</h3>
                            {feature && <ArrowRight size={17} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.55, margin: feature ? 0 : '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{category.description}</p>
                          {!feature && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: MUTED2 }}>
                              <BookOpen size={12} /> {category.articles} articles
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LIVE RATE STRIP */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '20px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ position: 'relative', width: 9, height: 9, flexShrink: 0 }}>
                <span className="tx-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff' }} />
              </span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 5px' }}>Taux USDT / CFA · en direct</p>
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
            </div>
            <button onClick={() => navigate('/auth')} className="tx-cta" style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 44, padding: '0 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              Échanger maintenant <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 32px 88px', position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 48, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px' }}>Besoin d'aide supplémentaire ?</h2>
            <p style={{ fontSize: 15, color: MUTED, margin: '0 0 26px' }}>Notre équipe de support est disponible 24/7.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/contact')} className="tx-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} /> Nous contacter
              </button>
              <button onClick={() => window.open('https://wa.me/14182619091', '_blank')} style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 50, padding: '0 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
      <div style={{ height: 64 }} />

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
