
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, HelpCircle, ShoppingCart, TrendingDown, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { supportFlows, getSupportFlowById, getQuestionById } from '@/data/supportFlows';
import { CheckCircle } from 'lucide-react';

const iconMap = {
  ShoppingCart,
  TrendingDown,
  Send,
  User
};

const HelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [conversationPath, setConversationPath] = useState<Array<{ question: string; answer: string }>>([]);
  const [solution, setSolution] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      window.location.reload();
    }
  };

  const handleShowDashboard = () => {
    navigate('/');
  };

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
      setConversationPath([
        ...conversationPath,
        { question: currentQuestion.question, answer: answerText }
      ]);
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

  // Vue de sélection du flux (page principale)
  if (!selectedFlowId) {
    return (
      <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
        {/* Grid background pattern - white with more density like Attio */}
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

        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-terex-accent/20">
                <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5 text-terex-accent mr-2" />
                <span className="text-terex-accent font-medium text-sm sm:text-base">Centre d'Aide</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
                Comment pouvons-nous vous <span className="text-terex-accent">aider</span> ?
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
                Choisissez la catégorie correspondant à votre problème et nous vous guiderons étape par étape vers la solution
              </p>
            </div>
          </div>
        </div>

        {/* Catégories de support */}
        <div className="py-8 sm:py-12 md:py-16 bg-terex-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {supportFlows.map((flow) => {
                const IconComponent = iconMap[flow.icon as keyof typeof iconMap];
                return (
                  <Card
                    key={flow.id}
                    className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300 cursor-pointer group overflow-hidden"
                    onClick={() => handleSelectFlow(flow.id)}
                  >
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 bg-terex-accent/20 rounded-xl flex items-center justify-center group-hover:bg-terex-accent/30 transition-colors">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-terex-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg sm:text-xl mb-1 break-words">{flow.title}</CardTitle>
                          <CardDescription className="text-gray-300 text-sm break-words">
                            {flow.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <Button
                        className="w-full bg-terex-accent/10 text-terex-accent hover:bg-terex-accent/20 border border-terex-accent/30 text-sm sm:text-base"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFlow(flow.id);
                        }}
                      >
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Support */}
            <div className="mt-12 sm:mt-16 text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Besoin d'aide supplémentaire ?</h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
                Notre équipe de support est là pour vous aider 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xl mx-auto">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold w-full sm:w-auto"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">Nous Contacter</span>
                </Button>
                <Button 
                  variant="outline"
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/14182619091', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <FooterSection />
      </div>
    );
  }

  // Vue de conversation (questions/réponses/solution)
  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
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

      <div className="py-6 sm:py-8 md:py-12 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={handleReset}
            variant="ghost"
            className="mb-6 sm:mb-8 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10 text-sm sm:text-base"
          >
            ← Retour aux catégories
          </Button>

          {selectedFlow && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                {(() => {
                  const IconComponent = iconMap[selectedFlow.icon as keyof typeof iconMap];
                  return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-terex-accent flex-shrink-0" />;
                })()}
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">{selectedFlow.title}</h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base break-words">{selectedFlow.description}</p>
            </div>
          )}

          {/* Historique de conversation */}
          {conversationPath.length > 0 && (
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {conversationPath.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Card className="bg-terex-darker/50 border-terex-accent/20 overflow-hidden">
                    <CardContent className="pt-4 p-4 sm:p-6">
                      <p className="text-white font-medium mb-2 text-sm sm:text-base break-words">{item.question}</p>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-terex-accent flex-shrink-0 mt-0.5" />
                        <p className="text-terex-accent text-sm sm:text-base break-words flex-1">{item.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Question actuelle */}
          {currentQuestion && !solution && (
            <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/30 overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-white text-lg sm:text-xl break-words">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {currentQuestion.answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 sm:py-4 px-4 sm:px-6 border-terex-accent/30 text-gray-300 hover:bg-terex-accent/10 hover:text-white hover:border-terex-accent/50 text-sm sm:text-base whitespace-normal break-words"
                      onClick={() => handleSelectAnswer(answer.text, answer.nextQuestionId, answer.solution)}
                    >
                      {answer.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution finale */}
          {solution && (
            <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 border-terex-accent/30 overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-terex-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-terex-accent" />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed text-sm sm:text-base break-words">{solution}</p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-terex-accent/20">
                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Cette solution a-t-elle résolu votre problème ?</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={handleReset}
                      className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold w-full sm:w-auto text-sm sm:text-base"
                    >
                      Oui, merci !
                    </Button>
                    <Button
                      variant="outline"
                      className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 w-full sm:w-auto text-sm sm:text-base"
                      onClick={() => window.open('https://wa.me/14182619091', '_blank')}
                    >
                      Non, contacter le support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default HelpPage;
