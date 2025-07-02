
import { PersonalInfoCard } from './PersonalInfoCard';
import { ProfileStatsCard } from './ProfileStatsCard';
import { QuickActionsCard } from './QuickActionsCard';

interface PersonalInfoSectionProps {
  user: { email: string; name: string } | null;
}

export function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <ProfileStatsCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <PersonalInfoCard user={user} />
        
        {/* Actions rapides */}
        <QuickActionsCard />
      </div>
    </div>
  );
}
