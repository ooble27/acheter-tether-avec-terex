
import { ImmersiveHero } from './ImmersiveHero';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  return <ImmersiveHero user={user} onShowDashboard={onShowDashboard} />;
}
