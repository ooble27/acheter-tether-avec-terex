
import { ModernHeroSection } from './ModernHeroSection';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  return <ModernHeroSection user={user} onShowDashboard={onShowDashboard} />;
}
