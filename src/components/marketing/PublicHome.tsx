import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { TerexLanding } from './TerexLanding';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function PublicHome({ user, onShowDashboard }: PublicHomeProps) {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#111111' }}>
      <PWAInstallPrompt />
      <TerexLanding user={user} onShowDashboard={onShowDashboard} />
    </div>
  );
}
