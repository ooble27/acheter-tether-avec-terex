
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Star, Award, Shield, CheckCircle } from 'lucide-react';

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
    <div className="relative overflow-hidden bg-gradient-to-br from-terex-accent/20 via-terex-accent/10 to-transparent rounded-2xl mb-8 p-6 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-terex-accent/30">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-terex-accent to-terex-accent/70 text-white text-xl md:text-2xl font-bold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {user?.name || 'Utilisateur'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-4">
              {user?.email}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-terex-darker/50 text-terex-accent border-terex-accent/30">
                <Star className="w-3 h-3 mr-1" />
                Membre Terex
              </Badge>
              
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Award className="w-3 h-3 mr-1" />
                Compte Actif
              </Badge>

              {isKYCVerified && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vérifié KYC
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
