
import { SecuritySettingsCard } from './SecuritySettingsCard';
import { NotificationSettingsCard } from './NotificationSettingsCard';
import { KYCData } from '@/hooks/useKYC';

interface SecuritySectionProps {
  onStartKYC: () => void;
  kycData: KYCData | null;
  isKYCVerified: boolean;
}

export function SecuritySection({ onStartKYC, kycData, isKYCVerified }: SecuritySectionProps) {
  return (
    <div className="space-y-6">
      <SecuritySettingsCard 
        onStartKYC={onStartKYC}
        kycData={kycData}
        isKYCVerified={isKYCVerified}
      />
      <NotificationSettingsCard />
    </div>
  );
}
