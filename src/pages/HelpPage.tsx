
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
      <div className="min-h-screen bg-terex-dark">
        <HeaderSection 
          user={user ? {
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
          } : null}
          onShowDashboard={handleShowDashboard}
          onLogout={handleLogout}
        />

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
                <HelpCircle className="w-5 h-5 text-terex-accent mr-2" />
                <span className="text-terex-accent font-medium">Centre d'Aide</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Comment pouvons-nous vous <span className="text-terex-accent">aider</span> ?
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                Choisissez la catégorie correspondant à votre problème et nous vous guiderons étape par étape vers la solution
              </p>
            </div>
          </div>
        </div>

        {/* Catégories de support */}
        <div className="py-16 bg-terex-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {supportFlows.map((flow) => {
                const IconComponent = iconMap[flow.icon as keyof typeof iconMap];
                return (
                  <Card
                    key={flow.id}
                    className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleSelectFlow(flow.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-terex-accent/20 rounded-xl flex items-center justify-center group-hover:bg-terex-accent/30 transition-colors">
                          <IconComponent className="w-7 h-7 text-terex-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{flow.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {flow.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full bg-terex-accent/10 text-terex-accent hover:bg-terex-accent/20 border border-terex-accent/30"
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
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Besoin d'aide supplémentaire ?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Notre équipe de support est là pour vous aider 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Nous Contacter
                </Button>
                <Button 
                  variant="outline"
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                  onClick={() => window.open('https://wa.me/14182619091', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp: +1 418-261-9091
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
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      <div className="py-12 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={handleReset}
            variant="ghost"
            className="mb-8 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
          >
            ← Retour aux catégories
          </Button>

          {selectedFlow && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                {(() => {
                  const IconComponent = iconMap[selectedFlow.icon as keyof typeof iconMap];
                  return <IconComponent className="w-6 h-6 text-terex-accent" />;
                })()}
                <h2 className="text-2xl font-bold text-white">{selectedFlow.title}</h2>
              </div>
              <p className="text-gray-300">{selectedFlow.description}</p>
            </div>
          )}

          {/* Historique de conversation */}
          {conversationPath.length > 0 && (
            <div className="space-y-4 mb-8">
              {conversationPath.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Card className="bg-terex-darker/50 border-terex-accent/20">
                    <CardContent className="pt-4">
                      <p className="text-white font-medium mb-2">{item.question}</p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-terex-accent" />
                        <p className="text-terex-accent">{item.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Question actuelle */}
          {currentQuestion && !solution && (
            <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/30">
              <CardHeader>
                <CardTitle className="text-white text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-6 border-terex-accent/30 text-gray-300 hover:bg-terex-accent/10 hover:text-white hover:border-terex-accent/50"
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
            <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 border-terex-accent/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-terex-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-terex-accent" />
                  </div>
                  <CardTitle className="text-white text-xl">Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed">{solution}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-terex-accent/20">
                  <p className="text-gray-300 mb-4">Cette solution a-t-elle résolu votre problème ?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleReset}
                      className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                    >
                      Oui, merci !
                    </Button>
                    <Button
                      variant="outline"
                      className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
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
