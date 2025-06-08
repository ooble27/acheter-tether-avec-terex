
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users } from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  courses: number;
  progress: number;
  color: string;
}

interface CourseCardProps {
  module: CourseModule;
  isSelected: boolean;
  onSelect: () => void;
}

const getColorClasses = (color: string, isSelected: boolean) => {
  const baseClasses = "transition-all duration-200 cursor-pointer hover:shadow-lg";
  
  if (isSelected) {
    switch (color) {
      case 'green': return `${baseClasses} bg-green-500/20 border-green-500/50`;
      case 'blue': return `${baseClasses} bg-blue-500/20 border-blue-500/50`;
      case 'purple': return `${baseClasses} bg-purple-500/20 border-purple-500/50`;
      case 'red': return `${baseClasses} bg-red-500/20 border-red-500/50`;
      default: return `${baseClasses} bg-terex-accent/20 border-terex-accent/50`;
    }
  }
  
  return `${baseClasses} bg-terex-darker border-terex-gray/30 hover:border-terex-accent/30`;
};

const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'Débutant': return 'bg-green-500/10 text-green-500 border-green-500/30';
    case 'Intermédiaire': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    case 'Avancé': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
    case 'Essentiel': return 'bg-red-500/10 text-red-500 border-red-500/30';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  }
};

export function CourseCard({ module, isSelected, onSelect }: CourseCardProps) {
  return (
    <Card 
      className={getColorClasses(module.color, isSelected)}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <BookOpen className="h-6 w-6 text-terex-accent" />
          <Badge variant="outline" className={getLevelBadgeColor(module.level)}>
            {module.level}
          </Badge>
        </div>
        <CardTitle className="text-white text-lg">{module.title}</CardTitle>
        <p className="text-gray-400 text-sm">{module.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Users className="h-4 w-4" />
            <span>{module.courses} cours</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progression</span>
            <span className="text-white font-medium">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
