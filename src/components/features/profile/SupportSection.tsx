
import { ContactCard } from './ContactCard';
import { ShareAndContactCard } from './ShareAndContactCard';

interface SupportSectionProps {
  user: { email: string; name: string } | null;
}

export function SupportSection({ user }: SupportSectionProps) {
  return (
    <div className="space-y-6">
      <ContactCard user={user} />
      <ShareAndContactCard />
    </div>
  );
}
