
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
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-terex-gray/30 h-12 rounded-lg p-1">
        <TabsTrigger 
          value="profile" 
          className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-terex-accent dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium"
        >
          <User className="w-4 h-4 mr-2" />
          Profil
        </TabsTrigger>
        <TabsTrigger 
          value="security" 
          className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-terex-accent dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium"
        >
          <Shield className="w-4 h-4 mr-2" />
          Sécurité
        </TabsTrigger>
        <TabsTrigger 
          value="support" 
          className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-terex-accent dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Support
        </TabsTrigger>
      </TabsList>

      <div className="mt-8">
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
