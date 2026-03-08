
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, HelpCircle, ShoppingCart, TrendingDown, Send, User, Search, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { supportFlows, getSupportFlowById, getQuestionById } from '@/data/supportFlows';
import { Input } from '@/components/ui/input';

const iconMap = {
  ShoppingCart,
  TrendingDown,
  Send,
  User
};

const categoryCards = [
  {
    flowId: "buy-usdt",
    title: "Acheter USDT",
    description: "Tout ce qu'il faut savoir pour acheter du USDT facilement et en toute sécurité.",
    icon: "ShoppingCart",
  },
  {
    flowId: "sell-usdt",
    title: "Vendre USDT",
    description: "Guides détaillés pour vendre vos USDT et recevoir vos fonds rapidement.",
    icon: "TrendingDown",
  },
  {
    flowId: "transfer",
    title: "Transferts Internationaux",
    description: "Envoyez de l'argent partout en Afrique avec les meilleurs taux.",
    icon: "Send",
  },
  {
    flowId: "account",
    title: "Compte & Sécurité",
    description: "Gérez votre compte, votre vérification KYC et vos paramètres de sécurité.",
    icon: "User",
  },
];

const HelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [conversationPath, setConversationPath] = useState<Array<{ question: string; answer: string }>>([]);
  const [solution, setSolution] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erreur", description: "Impossible de se déconnecter", variant: "destructive" });
    } else {
      toast({ title: "Déconnexion réussie", description: "Vous avez été déconnecté avec succès", className: "bg-green-600 text-white border-green-600" });
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
    ? categoryCards.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryCards;

  // Main help center view
  if (!selectedFlowId) {
    return (
      <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
        <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <HeaderSection
          user={user ? {
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
          } : null}
          onShowDashboard={handleShowDashboard}
          onLogout={handleLogout}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2">
            Centre d'Aide
          </h1>
          <p className="text-white/50 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl">
            Guides, FAQ et support pour l'achat, la vente et les transferts de USDT sur Terex.
          </p>

          {/* Search */}
          <div className="relative mb-10 sm:mb-14 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Poser une question ou rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 rounded-lg focus:border-white/20 focus:ring-0"
            />
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-16">
            {filteredCategories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <Card
                  key={category.flowId}
                  className="bg-terex-gray/80 border-white/10 hover:border-white/20 hover:bg-terex-gray transition-all duration-300 cursor-pointer group overflow-hidden rounded-xl"
                  onClick={() => handleSelectFlow(category.flowId)}
                >
                  {/* Preview mockup area */}
                  <div className="relative h-36 sm:h-44 bg-terex-darker/50 border-b border-white/10 flex items-center justify-center p-4 overflow-hidden">
                    {/* Simulated UI preview */}
                    <div className="w-full max-w-[200px] bg-terex-dark rounded-lg border border-white/10 p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-terex-accent/20 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-terex-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-16 bg-white/20 rounded" />
                          <div className="h-1.5 w-10 bg-white/10 rounded mt-1" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-white/10 rounded" />
                        <div className="h-2 w-3/4 bg-white/10 rounded" />
                        <div className="h-6 w-full bg-terex-accent/30 rounded mt-3" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-white font-semibold text-lg mb-1.5">{category.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact */}
          <div className="text-center py-10 border-t border-white/[0.06]">
            <h2 className="text-xl sm:text-2xl font-light text-white mb-3">Besoin d'aide supplémentaire ?</h2>
            <p className="text-white/40 text-sm mb-6">Notre équipe de support est disponible 24/7</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] font-normal"
              >
                <Mail className="w-4 h-4 mr-2" />
                Nous Contacter
              </Button>
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.06]"
                onClick={() => window.open('https://wa.me/14182619091', '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <FooterSection />
      </div>
    );
  }

  // Conversation view
  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux catégories
        </button>

        {selectedFlow && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const IconComponent = iconMap[selectedFlow.icon as keyof typeof iconMap];
                return <IconComponent className="w-5 h-5 text-white/50 flex-shrink-0" />;
              })()}
              <h2 className="text-2xl sm:text-3xl font-light text-white">{selectedFlow.title}</h2>
            </div>
            <p className="text-white/40 text-sm">{selectedFlow.description}</p>
          </div>
        )}

        {/* Conversation history */}
        {conversationPath.length > 0 && (
          <div className="space-y-3 mb-8">
            {conversationPath.map((item, index) => (
              <div key={index} className="bg-terex-gray/80 border border-white/10 rounded-lg p-4 sm:p-5">
                <p className="text-white font-medium mb-2 text-sm">{item.question}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terex-accent flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current question */}
        {currentQuestion && !solution && (
          <div className="bg-terex-gray/80 border border-white/10 rounded-lg p-5 sm:p-6">
            <h3 className="text-white font-medium text-lg mb-4">{currentQuestion.question}</h3>
            <div className="space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  className="w-full text-left py-3 px-4 rounded-lg border border-white/10 bg-terex-darker/60 text-white/70 hover:bg-terex-darker hover:text-white hover:border-white/20 transition-all text-sm"
                  onClick={() => handleSelectAnswer(answer.text, answer.nextQuestionId, answer.solution)}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Solution */}
        {solution && (
          <div className="bg-terex-gray/80 border border-white/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-terex-accent/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-terex-accent" />
              </div>
              <h3 className="text-white font-medium text-lg">Solution</h3>
            </div>
            <p className="text-white/70 whitespace-pre-line leading-relaxed text-sm mb-6">{solution}</p>

            <div className="pt-5 border-t border-white/10">
              <p className="text-white/50 mb-4 text-sm">Cette solution a-t-elle résolu votre problème ?</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleReset}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium text-sm"
                >
                  Oui, merci !
                </Button>
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/[0.08] text-sm"
                  onClick={() => window.open('https://wa.me/14182619091', '_blank')}
                >
                  Non, contacter le support
                </Button>
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
