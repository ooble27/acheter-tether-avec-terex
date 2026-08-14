import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase envoie un lien qui, une fois cliqué, ouvre l'app avec un fragment
    // (#access_token=…&type=recovery). Le SDK détecte ce fragment automatiquement
    // et crée la session ; on écoute PASSWORD_RECOVERY / SIGNED_IN pour débloquer l'écran.
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setHasRecoverySession(!!data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const passwordRequirements = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !passwordsMatch) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });

      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('same as the old') || msg.includes('should be different')) {
        toast({ title: "Mot de passe identique", description: "Choisissez un mot de passe différent de l'ancien.", variant: "destructive" });
      } else {
        toast({ title: "Erreur", description: "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "h-10 bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder:text-[#3a3a3a] rounded-md focus:border-[rgba(255,255,255,0.25)] focus:ring-1 focus:ring-[rgba(255,255,255,0.10)] transition-colors text-sm px-3";

  return (
    <div className="min-h-screen w-full flex" style={{ background: '#1a1a1a' }}>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[380px]">
            <div className="flex items-center gap-3 mb-10">
              <img src="/terex-logo.png" alt="Terex" className="w-9 h-9" />
              <div>
                <span className="text-xl font-black text-white">TEREX</span>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Teranga Exchange</p>
              </div>
            </div>

            {hasRecoverySession === false ? (
              <div className="space-y-5">
                <h1 className="text-2xl font-semibold text-white mb-1">Lien invalide ou expiré</h1>
                <p className="text-sm text-gray-500">
                  Le lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau depuis la page de connexion.
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full h-10 font-medium rounded-md text-sm"
                  style={{ background: '#ffffff', color: '#141414', border: 'none' }}
                >
                  Retour à la connexion
                </Button>
              </div>
            ) : hasRecoverySession === null ? (
              <div className="text-center text-gray-400 text-sm py-12">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3" />
                Vérification du lien…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Nouveau mot de passe</h1>
                  <p className="text-sm text-gray-500">Choisissez un nouveau mot de passe pour votre compte.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {password && (
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        {[
                          { key: 'minLength',      label: '6 caractères min.' },
                          { key: 'hasUppercase',   label: 'Majuscule' },
                          { key: 'hasLowercase',   label: 'Minuscule' },
                          { key: 'hasNumber',      label: 'Chiffre' },
                          { key: 'hasSpecialChar', label: 'Caractère spécial' },
                        ].map(({ key, label }) => {
                          const ok = passwordRequirements[key as keyof typeof passwordRequirements];
                          return (
                            <div key={key} className="flex items-center gap-1.5">
                              {ok
                                ? <Check className="w-3 h-3 shrink-0 text-white" />
                                : <X className="w-3 h-3 shrink-0 text-gray-600" />}
                              <span className={`text-xs ${ok ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">Confirmer le mot de passe</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                    {confirm && !passwordsMatch && (
                      <p className="text-xs text-red-400">Les mots de passe ne correspondent pas.</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || !passwordsMatch}
                  className="w-full h-10 font-medium rounded-md text-sm transition-all"
                  style={{
                    background: '#ffffff',
                    color: '#141414',
                    border: 'none',
                    opacity: (!isPasswordValid || !passwordsMatch) && !isLoading ? 0.45 : 1,
                  }}
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mise à jour…</> : 'Mettre à jour le mot de passe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="p-6 border-t text-center" style={{ borderColor: '#1f1f1f' }}>
          <p className="text-xs text-gray-600">© 2026 Terex · Teranga Exchange</p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
