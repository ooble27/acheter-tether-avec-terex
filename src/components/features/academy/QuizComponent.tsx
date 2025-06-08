
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Brain, Award, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const quizzes = [
  {
    id: 'blockchain-basics',
    title: 'Les bases de la blockchain',
    description: 'Testez vos connaissances sur les concepts fondamentaux',
    difficulty: 'Débutant',
    questions: [
      {
        question: "Qu'est-ce qu'une blockchain ?",
        options: [
          "Une base de données centralisée",
          "Un registre distribué et décentralisé",
          "Un type de cryptomonnaie",
          "Un portefeuille numérique"
        ],
        correct: 1,
        explanation: "Une blockchain est un registre distribué et décentralisé qui enregistre les transactions de manière sécurisée et transparente."
      },
      {
        question: "Que signifie 'miner' dans le contexte des cryptomonnaies ?",
        options: [
          "Acheter des cryptomonnaies",
          "Valider des transactions et créer de nouveaux blocs",
          "Échanger des cryptomonnaies",
          "Stocker des cryptomonnaies"
        ],
        correct: 1,
        explanation: "Miner consiste à valider des transactions et créer de nouveaux blocs en résolvant des problèmes cryptographiques complexes."
      },
      {
        question: "Qu'est-ce qui rend Bitcoin décentralisé ?",
        options: [
          "Il est contrôlé par une banque centrale",
          "Il fonctionne sur un réseau peer-to-peer",
          "Il est géré par une seule entreprise",
          "Il nécessite l'autorisation d'un gouvernement"
        ],
        correct: 1,
        explanation: "Bitcoin est décentralisé car il fonctionne sur un réseau peer-to-peer sans autorité centrale."
      }
    ]
  },
  {
    id: 'stablecoins',
    title: 'Comprendre les stablecoins',
    description: 'Quiz sur USDT, USDC et autres stablecoins',
    difficulty: 'Intermédiaire',
    questions: [
      {
        question: "Quel est l'objectif principal d'un stablecoin ?",
        options: [
          "Générer des profits importants",
          "Maintenir une valeur stable",
          "Remplacer toutes les cryptomonnaies",
          "Être plus volatil que Bitcoin"
        ],
        correct: 1,
        explanation: "Les stablecoins sont conçus pour maintenir une valeur stable, généralement indexée sur une devise fiat comme le dollar américain."
      },
      {
        question: "Quelle est la différence entre USDT et USDC ?",
        options: [
          "USDT est plus réglementé que USDC",
          "USDC a une meilleure transparence et audit",
          "USDT est plus récent que USDC",
          "Il n'y a aucune différence"
        ],
        correct: 1,
        explanation: "USDC (USD Coin) est généralement considéré comme ayant une meilleure transparence et des audits plus réguliers que USDT (Tether)."
      }
    ]
  }
];

export function QuizComponent() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const currentQuizData = quizzes.find(q => q.id === selectedQuiz);

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
    setSelectedAnswer('');
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, parseInt(selectedAnswer)];
    setAnswers(newAnswers);

    if (currentQuestion < (currentQuizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setQuizCompleted(true);
      setShowResults(true);
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === currentQuizData?.questions[index].correct ? 1 : 0);
      }, 0);
      
      toast({
        title: "Quiz terminé !",
        description: `Vous avez obtenu ${score}/${currentQuizData?.questions.length} bonnes réponses.`,
      });
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
    setSelectedAnswer('');
  };

  const calculateScore = () => {
    if (!currentQuizData) return 0;
    return answers.reduce((acc, answer, index) => {
      return acc + (answer === currentQuizData.questions[index].correct ? 1 : 0);
    }, 0);
  };

  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Brain className="h-6 w-6 text-terex-accent" />
              <span>Quiz interactifs</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Testez vos connaissances avec nos quiz thématiques
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-terex-darker border-terex-gray/30 hover:border-terex-accent/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white">{quiz.title}</CardTitle>
                  <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30">
                    {quiz.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {quiz.questions.length} questions
                  </span>
                  <Button 
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="bg-terex-accent hover:bg-terex-accent-light"
                  >
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showResults && currentQuizData) {
    const score = calculateScore();
    const percentage = Math.round((score / currentQuizData.questions.length) * 100);

    return (
      <div className="space-y-6">
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Award className="h-6 w-6 text-yellow-500" />
              <span>Résultats du quiz</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-terex-accent mb-2">
                {score}/{currentQuizData.questions.length}
              </p>
              <p className="text-xl text-white mb-4">{percentage}% de réussite</p>
              <Badge variant="outline" className={
                percentage >= 80 
                  ? 'bg-green-500/10 text-green-500 border-green-500/30'
                  : percentage >= 60
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  : 'bg-red-500/10 text-red-500 border-red-500/30'
              }>
                {percentage >= 80 ? 'Excellent !' : percentage >= 60 ? 'Bien joué !' : 'À améliorer'}
              </Badge>
            </div>

            <div className="space-y-4">
              {currentQuizData.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correct;

                return (
                  <div key={index} className="p-4 bg-terex-gray/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <h4 className="text-white font-medium">Question {index + 1}</h4>
                    </div>
                    <p className="text-gray-300 mb-2">{question.question}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      <strong>Votre réponse:</strong> {question.options[userAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-400 mb-2">
                        <strong>Bonne réponse:</strong> {question.options[question.correct]}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">{question.explanation}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Autres quiz
              </Button>
              <Button onClick={() => handleStartQuiz(selectedQuiz)} className="bg-terex-accent hover:bg-terex-accent-light">
                Refaire ce quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">{currentQuizData?.title}</CardTitle>
          <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30">
            {currentQuestion + 1}/{currentQuizData?.questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuizData && (
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">
              {currentQuizData.questions[currentQuestion].question}
            </h3>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {currentQuizData.questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-terex-gray/20 rounded-lg hover:bg-terex-gray/30 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-white cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={resetQuiz}>
                Quitter
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="bg-terex-accent hover:bg-terex-accent-light"
              >
                {currentQuestion < (currentQuizData.questions.length - 1) ? 'Suivant' : 'Terminer'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
