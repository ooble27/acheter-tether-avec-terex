
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  progress: number;
  color: string;
}

interface ProgressTrackerProps {
  modules: CourseModule[];
  achievements: Achievement[];
}

export function ProgressTracker({ modules, achievements }: ProgressTrackerProps) {
  const totalProgress = Math.round(
    modules.reduce((acc, module) => acc + module.progress, 0) / modules.length
  );

  const completedModules = modules.filter(m => m.progress === 100).length;
  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-terex-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalProgress}%</p>
            <p className="text-sm text-gray-400">Progression totale</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{completedModules}</p>
            <p className="text-sm text-gray-400">Modules terminés</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{earnedAchievements}</p>
            <p className="text-sm text-gray-400">Badges obtenus</p>
          </CardContent>
        </Card>
      </div>

      {/* Progression par module */}
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Progression par module</CardTitle>
          <CardDescription className="text-gray-400">
            Suivez votre avancement dans chaque module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-white font-medium">{module.title}</h4>
                <span className="text-sm text-gray-400">{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="h-2" />
              {module.progress === 100 && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  ✓ Terminé
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges et réalisations */}
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Badges et réalisations</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Débloquez des badges en progressant dans vos apprentissages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-gray-500/10 border-gray-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.earned 
                      ? 'bg-yellow-500/20' 
                      : 'bg-gray-500/20'
                  }`}>
                    <Trophy className={`h-5 w-5 ${
                      achievement.earned 
                        ? 'text-yellow-500' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned 
                        ? 'text-yellow-500' 
                        : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
