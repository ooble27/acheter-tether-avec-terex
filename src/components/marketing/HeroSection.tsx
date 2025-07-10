
import { AfricanYouthHero } from './AfricanYouthHero';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  return <AfricanYouthHero user={user} onShowDashboard={onShowDashboard} />;
}
