
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Settings, LogOut, CheckCircle, AlertCircle, Clock, Mail, Phone, MapPin, Calendar, Briefcase, Star } from 'lucide-react';
import { PersonalInfoCard } from '@/components/features/profile/PersonalInfoCard';
import { SecuritySettingsCard } from '@/components/features/profile/SecuritySettingsCard';
import { ProfileStatsCard } from '@/components/features/profile/ProfileStatsCard';
import { ContactCard } from '@/components/features/profile/ContactCard';
import { ShareAndContactCard } from '@/components/features/profile/ShareAndContactCard';
import { useKYC } from '@/hooks/useKYC';
import { useScrollToTop } from '@/components/ScrollToTop';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const scrollToTop = useScrollToTop();
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const { kycData, loading } = useKYC();

  // Déterminer le statut KYC basé sur kycData
  const kycStatus = kycData?.status || 'not_verified';

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="space-y-6">
      {/* En-tête du profil */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-white" />
            <div>
              <CardTitle className="text-2xl font-bold text-white">{user?.name || 'Utilisateur'}</CardTitle>
              <CardDescription className="text-gray-400">{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {kycStatus === 'approved' ? (
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircle className="w-4 h-4 mr-2" />
                KYC Validé
              </Badge>
            ) : kycStatus === 'pending' || kycStatus === 'submitted' || kycStatus === 'under_review' ? (
              <Badge className="bg-yellow-500 text-white border-0">
                <Clock className="w-4 h-4 mr-2" />
                KYC En cours
              </Badge>
            ) : kycStatus === 'rejected' ? (
              <Badge className="bg-red-500 text-white border-0">
                <AlertCircle className="w-4 h-4 mr-2" />
                KYC Refusé
              </Badge>
            ) : (
              <Badge className="bg-gray-500 text-white border-0">
                <Shield className="w-4 h-4 mr-2" />
                KYC Non vérifié
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation entre les onglets */}
      <div className="flex items-center space-x-4">
        <Button
          variant={activeTab === 'personal' ? 'default' : 'outline'}
          onClick={() => setActiveTab('personal')}
          className={`flex items-center space-x-2 ${activeTab === 'personal' ? 'gradient-button text-white' : 'border-terex-gray text-gray-300 hover:bg-terex-gray'}`}
        >
          <User className="w-4 h-4" />
          <span>Informations personnelles</span>
        </Button>
        <Button
          variant={activeTab === 'security' ? 'default' : 'outline'}
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 ${activeTab === 'security' ? 'gradient-button text-white' : 'border-terex-gray text-gray-300 hover:bg-terex-gray'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Sécurité</span>
        </Button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'personal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonalInfoCard user={user} />
          <ContactCard user={user} />
          <ShareAndContactCard />
        </div>
      ) : (
        <SecuritySettingsCard />
      )}

      {/* Statistiques du profil */}
      <ProfileStatsCard />
    </div>
  );
}
