
import { ImmersiveHero } from './ImmersiveHero';
import { DiasporaHero } from './DiasporaHero';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  variant?: 'default' | 'diaspora';
}

export function HeroSection({ user, onShowDashboard, variant = 'default' }: HeroSectionProps) {
  if (variant === 'diaspora') {
    return <DiasporaHero user={user} onShowDashboard={onShowDashboard} />;
  }
  
  return <ImmersiveHero user={user} onShowDashboard={onShowDashboard} />;
}
