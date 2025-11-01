import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, ShoppingCart, TrendingDown, Send, User } from 'lucide-react';
import { supportFlows, getSupportFlowById, getQuestionById, SupportFlow } from '@/data/supportFlows';

interface GuidedSupportProps {
  onBack: () => void;
}

const iconMap = {
  ShoppingCart,
  TrendingDown,
  Send,
  User
};

export const GuidedSupport = ({ onBack }: GuidedSupportProps) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [conversationPath, setConversationPath] = useState<Array<{ question: string; answer: string }>>([]);
  const [solution, setSolution] = useState<string | null>(null);

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

  // Vue de sélection du flux
  if (!selectedFlowId) {
    return (
      <div className="min-h-screen bg-terex-dark py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-8 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Support Guidé
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Répondez à quelques questions simples et nous vous guiderons étape par étape vers la solution
            </p>
          </div>

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
        </div>
      </div>
    );
  }

  // Vue de conversation et solution
  return (
    <div className="min-h-screen bg-terex-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={handleReset}
          variant="ghost"
          className="mb-8 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux catégories
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
  );
};
