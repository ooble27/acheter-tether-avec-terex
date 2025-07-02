
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoSection } from './PersonalInfoSection';
import { SecuritySection } from './SecuritySection';
import { SupportSection } from './SupportSection';
import { User, Shield, MessageCircle } from 'lucide-react';
import { KYCData } from '@/hooks/useKYC';

interface ProfileTabsProps {
  user: { email: string; name: string } | null;
  onStartKYC: () => void;
  kycData: KYCData | null;
  isKYCVerified: boolean;
}

export function ProfileTabs({ user, onStartKYC, kycData, isKYCVerified }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-terex-darker border-terex-gray">
        <TabsTrigger 
          value="profile" 
          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-400"
        >
          <User className="w-4 h-4 mr-2" />
          Mon Profil
        </TabsTrigger>
        <TabsTrigger 
          value="security" 
          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-400"
        >
          <Shield className="w-4 h-4 mr-2" />
          Sécurité
        </TabsTrigger>
        <TabsTrigger 
          value="support" 
          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-gray-400"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Support
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="profile" className="mt-0">
          <PersonalInfoSection user={user} />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <SecuritySection 
            onStartKYC={onStartKYC}
            kycData={kycData}
            isKYCVerified={isKYCVerified}
          />
        </TabsContent>

        <TabsContent value="support" className="mt-0">
          <SupportSection user={user} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
