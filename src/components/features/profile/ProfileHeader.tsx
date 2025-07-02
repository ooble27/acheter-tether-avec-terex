
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  user: { email: string; name: string } | null;
  isKYCVerified: boolean;
}

export function ProfileHeader({ user, isKYCVerified }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white dark:bg-terex-darker rounded-xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-terex-gray/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-gray-100 dark:border-terex-gray/30">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-terex-accent text-white text-lg font-medium">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {user?.name || 'Utilisateur'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          className="border-gray-200 dark:border-terex-gray hover:bg-gray-50 dark:hover:bg-terex-gray/50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Badge 
          variant="secondary" 
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Compte actif
        </Badge>
        
        {isKYCVerified && (
          <Badge 
            variant="secondary" 
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Vérifié
          </Badge>
        )}
      </div>
    </div>
  );
}
