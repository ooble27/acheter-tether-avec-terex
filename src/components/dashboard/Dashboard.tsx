
import { AuthProvider } from '@/contexts/AuthContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { DashboardContent } from './DashboardContent';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <AuthProvider>
      <TransactionProvider>
        <DashboardContent user={user} onLogout={onLogout} />
      </TransactionProvider>
    </AuthProvider>
  );
}
