
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Star, Award, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { KYCData } from '@/hooks/useKYC';

interface ProfileHeaderCardProps {
  user: { email: string; name: string } | null;
  kycData: KYCData | null;
  isKYCVerified: boolean;
}

export function ProfileHeaderCard({ user, kycData, isKYCVerified }: ProfileHeaderCardProps) {
  const getKYCStatusBadge = () => {
    if (isKYCVerified) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
          <CheckCircle className="w-4 h-4 mr-2" />
          Vérifié KYC
        </Badge>
      );
    }

    switch (kycData?.status) {
      case 'submitted':
      case 'under_review':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30">
            <Clock className="w-4 h-4 mr-2" />
            En cours
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Non vérifié
          </Badge>
        );
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.email || 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker/95 via-terex-dark/95 to-terex-darker/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/5 via-transparent to-blue-500/5"></div>
      
      <CardContent className="relative z-10 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-terex-accent/30 shadow-2xl">
              <AvatarFallback className="bg-gradient-to-br from-terex-accent to-terex-accent/70 text-white text-2xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center border-4 border-terex-darker shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                {user?.name || 'Utilisateur Terex'}
              </h1>
              <p className="text-gray-400 text-lg font-medium">{user?.email}</p>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-terex-accent/20 text-terex-accent border-terex-accent/30 hover:bg-terex-accent/30 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Membre Terex
              </Badge>
              
              {getKYCStatusBadge()}
              
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Compte Actif
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-gray/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">0</div>
                <div className="text-gray-400 text-sm">Transactions</div>
              </div>
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-gray/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">0 CFA</div>
                <div className="text-gray-400 text-sm">Volume</div>
              </div>
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-gray/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">-</div>
                <div className="text-gray-400 text-sm">Dernière</div>
              </div>
              <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-gray/20 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-terex-accent" />
                  <div className="text-terex-accent text-sm font-medium">Sécurisé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
