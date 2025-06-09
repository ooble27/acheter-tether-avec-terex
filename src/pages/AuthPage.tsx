
import { LoginForm } from '@/components/auth/LoginForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(94,234,212,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(94,234,212,0.05),transparent_50%)]"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-terex-accent/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-terex-accent/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-terex-accent/20 rounded-full animate-bounce"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 rounded-xl shadow-2xl"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-xl blur opacity-60"></div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent">
                TEREX
              </span>
            </h1>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Rejoignez la révolution <span className="text-terex-accent">crypto</span>
          </h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Connectez-vous pour accéder à votre plateforme d'échange USDT et de virements internationaux
          </p>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md">
          <div className="bg-terex-darker/80 backdrop-blur-xl border border-terex-accent/20 rounded-2xl p-8 shadow-2xl shadow-terex-accent/10">
            <LoginForm />
          </div>
        </div>

        {/* Back to home link */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()}
            className="text-terex-accent hover:text-terex-accent/80 transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
