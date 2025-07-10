
import { SimpleHeroSection } from './SimpleHeroSection';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  return <SimpleHeroSection user={user} onShowDashboard={onShowDashboard} />;
}
