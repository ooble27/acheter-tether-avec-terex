
import { LoginForm } from '@/components/auth/LoginForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-terex-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthPage;
