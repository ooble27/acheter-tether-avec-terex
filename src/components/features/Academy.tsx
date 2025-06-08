
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Trophy, BookOpen, Play, CheckCircle, Star } from 'lucide-react';
import { CourseCard } from './academy/CourseCard';
import { ProgressTracker } from './academy/ProgressTracker';
import { QuizComponent } from './academy/QuizComponent';
import { CertificateDisplay } from './academy/CertificateDisplay';

const courseModules = [
  {
    id: 'beginner',
    title: 'Module Débutant',
    description: 'Les bases de la blockchain et des cryptomonnaies',
    level: 'Débutant',
    duration: '2-3 heures',
    courses: 8,
    progress: 75,
    color: 'green',
    topics: [
      { title: 'Qu\'est-ce que la blockchain ?', completed: true, duration: '15 min' },
      { title: 'Bitcoin vs Altcoins', completed: true, duration: '20 min' },
      { title: 'Les portefeuilles crypto', completed: true, duration: '25 min' },
      { title: 'Comment acheter sa première crypto', completed: false, duration: '30 min' },
      { title: 'Comprendre les frais de transaction', completed: false, duration: '15 min' },
    ]
  },
  {
    id: 'intermediate',
    title: 'Module Intermédiaire',
    description: 'DeFi, stablecoins et exchanges',
    level: 'Intermédiaire',
    duration: '4-5 heures',
    courses: 12,
    progress: 40,
    color: 'blue',
    topics: [
      { title: 'Qu\'est-ce que la DeFi ?', completed: true, duration: '30 min' },
      { title: 'Les stablecoins expliqués (USDT, USDC)', completed: true, duration: '25 min' },
      { title: 'CEX vs DEX : différences', completed: false, duration: '35 min' },
      { title: 'Yield farming et liquidity mining', completed: false, duration: '40 min' },
      { title: 'Les protocoles de prêt', completed: false, duration: '30 min' },
    ]
  },
  {
    id: 'advanced',
    title: 'Module Avancé',
    description: 'Analyse technique et stratégies avancées',
    level: 'Avancé',
    duration: '6-8 heures',
    courses: 15,
    progress: 15,
    color: 'purple',
    topics: [
      { title: 'Analyse technique : bases', completed: true, duration: '45 min' },
      { title: 'Indicateurs et oscillateurs', completed: false, duration: '50 min' },
      { title: 'Gestion des risques avancée', completed: false, duration: '40 min' },
      { title: 'Stratégies de trading', completed: false, duration: '60 min' },
      { title: 'Psychologie du trader', completed: false, duration: '35 min' },
    ]
  },
  {
    id: 'security',
    title: 'Module Sécurité',
    description: 'Protéger ses actifs et éviter les pièges',
    level: 'Essentiel',
    duration: '3-4 heures',
    courses: 10,
    progress: 60,
    color: 'red',
    topics: [
      { title: 'Sécuriser son portefeuille', completed: true, duration: '30 min' },
      { title: 'Reconnaître les arnaques', completed: true, duration: '25 min' },
      { title: 'Hardware wallets : guide complet', completed: true, duration: '35 min' },
      { title: 'Backup et récupération', completed: false, duration: '20 min' },
      { title: 'Vérification des contrats smart', completed: false, duration: '40 min' },
    ]
  }
];

const achievements = [
  { title: 'Premier pas', description: 'Complété votre première leçon', earned: true },
  { title: 'Étudiant assidu', description: '5 leçons complétées', earned: true },
  { title: 'Maître débutant', description: 'Module débutant terminé', earned: false },
  { title: 'Expert DeFi', description: 'Module intermédiaire terminé', earned: false },
];

export function Academy() {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedModule, setSelectedModule] = useState('beginner');

  const totalProgress = Math.round(
    courseModules.reduce((acc, module) => acc + module.progress, 0) / courseModules.length
  );

  return (
    <div className="min-h-screen bg-terex-dark text-white overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-6 py-3 md:py-6">
        {/* Header */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
            <div className="p-2 md:p-3 bg-terex-accent/20 rounded-xl flex-shrink-0">
              <GraduationCap className="h-5 w-5 md:h-8 md:w-8 text-terex-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-3xl font-bold text-white truncate">Formation & Académie</h1>
              <p className="text-gray-400 text-xs md:text-base leading-tight">Maîtrisez la blockchain et les cryptomonnaies</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30 self-start md:self-auto text-xs flex-shrink-0">
            Terex Academy
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Votre progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-terex-accent">{totalProgress}%</p>
                <p className="text-sm text-gray-400">Progression globale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {courseModules.reduce((acc, m) => acc + m.courses, 0)}
                </p>
                <p className="text-sm text-gray-400">Leçons disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {achievements.filter(a => a.earned).length}
                </p>
                <p className="text-sm text-gray-400">Badges obtenus</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">15h</p>
                <p className="text-sm text-gray-400">Temps d'apprentissage</p>
              </div>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-terex-darker border border-terex-gray/30 grid grid-cols-4 w-full h-auto p-1">
            <TabsTrigger value="courses" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-2 py-2">
              Cours
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-2 py-2">
              Progression
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-2 py-2">
              Quiz
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm px-2 py-2">
              Certificats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {courseModules.map((module) => (
                <CourseCard
                  key={module.id}
                  module={module}
                  isSelected={selectedModule === module.id}
                  onSelect={() => setSelectedModule(module.id)}
                />
              ))}
            </div>

            {/* Selected Module Details */}
            {selectedModule && (
              <Card className="bg-terex-darker border-terex-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    {courseModules.find(m => m.id === selectedModule)?.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {courseModules.find(m => m.id === selectedModule)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseModules.find(m => m.id === selectedModule)?.topics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-terex-gray/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {topic.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Play className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">{topic.title}</p>
                            <p className="text-xs text-gray-400">{topic.duration}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={topic.completed ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}>
                          {topic.completed ? 'Terminé' : 'À voir'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker modules={courseModules} achievements={achievements} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizComponent />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
