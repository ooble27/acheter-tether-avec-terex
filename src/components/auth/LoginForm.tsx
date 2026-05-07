
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Check, X, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const { toast } = useToast();

  const passwordRequirements = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à Terex.",
        className: "bg-terex-accent text-white border-terex-accent",
      });
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('Email not confirmed')) {
        toast({ title: "Identifiants incorrects", description: "L'email ou le mot de passe est incorrect.", variant: "destructive" });
      } else if (msg.includes('For security purposes')) {
        toast({ title: "Trop de tentatives", description: "Veuillez attendre quelques minutes.", variant: "destructive" });
      } else {
        toast({ title: "Erreur de connexion", description: "Impossible de se connecter. Vérifiez vos identifiants.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: signUpError, data } = await signUp(email, password, name, referralCode);
      if (signUpError) {
        if (signUpError.message.includes('already')) {
          toast({ title: "Email déjà utilisé", description: "Cet email est déjà enregistré.", variant: "destructive" });
          setActiveTab('login');
        } else {
          toast({ title: "Erreur d'inscription", description: signUpError.message, variant: "destructive" });
        }
      } else {
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          toast({ title: "Email déjà utilisé", description: "Cet email est déjà enregistré.", variant: "destructive" });
          setActiveTab('login');
        } else {
          toast({ title: "Inscription réussie !", description: "Vérifiez votre email pour activer votre compte.", className: "bg-terex-accent text-white border-terex-accent" });
        }
      }
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('already')) {
        toast({ title: "Email déjà utilisé", description: "Cet email est déjà enregistré.", variant: "destructive" });
        setActiveTab('login');
      } else {
        toast({ title: "Erreur", description: "Une erreur inattendue s'est produite.", variant: "destructive" });
      }
    }
  };

  const inputClass =
    "h-10 bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder:text-[#3a3a3a] rounded-md focus:border-terex-accent focus:ring-1 focus:ring-terex-accent/30 transition-colors text-sm px-3";

  return (
    <div className="min-h-screen w-full flex">

      {/* ── LEFT — Formulaire ──────────────────────────────────────────── */}
      <div className="flex-1 lg:w-[38%] flex flex-col min-h-screen" style={{ background: '#101010' }}>

        {/* Logo tablette uniquement (masqué sur mobile et desktop) */}
        <div className="hidden md:flex lg:hidden items-center gap-3 p-6 border-b" style={{ borderColor: '#1f1f1f' }}>
          <img src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" alt="Terex" className="w-8 h-8" />
          <span className="text-lg font-black" style={{ color: '#3b968f' }}>TEREX</span>
        </div>

        {/* Formulaire centré */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[380px]">

            {/* Logo desktop */}
            <div className="hidden lg:flex items-center gap-3 mb-10">
              <img src="/lovable-uploads/1201a99e-a9d2-4269-8a38-081a3f9ca624.png" alt="Terex" className="w-9 h-9" />
              <div>
                <span className="text-xl font-black" style={{ color: '#3b968f' }}>TEREX</span>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(59,150,143,0.6)' }}>Teranga Exchange</p>
              </div>
            </div>

            {/* Toggle onglets */}
            <div className="flex mb-8 rounded-lg p-1" style={{ background: '#1a1a1a', border: '1px solid #2e2e2e' }}>
              {(['login', 'register'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
                  style={{
                    background: activeTab === tab ? '#3b968f' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#6b6b6b',
                  }}
                >
                  {tab === 'login' ? 'Se connecter' : "S'inscrire"}
                </button>
              ))}
            </div>

            {/* ── CONNEXION ── */}
            {activeTab === 'login' && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Connexion</h1>
                  <p className="text-sm text-gray-500">Entrez vos identifiants pour accéder à votre compte.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">Adresse email</Label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                  </div>

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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 font-medium rounded-md text-sm transition-all"
                  style={{ background: '#3b968f', color: '#fff', border: 'none' }}
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connexion…</> : 'Se connecter'}
                </Button>

                <p className="text-center text-xs text-gray-500">
                  Pas encore de compte ?{' '}
                  <button type="button" onClick={() => setActiveTab('register')}
                    className="underline" style={{ color: '#3b968f' }}>
                    Créer un compte
                  </button>
                </p>
              </form>
            )}

            {/* ── INSCRIPTION ── */}
            {activeTab === 'register' && (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Créer un compte</h1>
                  <p className="text-sm text-gray-500">Rejoignez Terex en quelques secondes.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">Nom complet</Label>
                    <Input
                      type="text"
                      placeholder="Votre nom complet"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">Adresse email</Label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isLoading}
                    />
                  </div>

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
                                ? <Check className="w-3 h-3 shrink-0" style={{ color: '#3b968f' }} />
                                : <X className="w-3 h-3 shrink-0 text-gray-600" />}
                              <span className={`text-xs ${ok ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-400">
                      Code de parrainage{' '}
                      <span className="text-gray-600 font-normal">(optionnel)</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="TEREX-XXXXXXXX"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase())}
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  En continuant, vous acceptez nos{' '}
                  <a href="/terms" style={{ color: '#3b968f' }} className="hover:underline">Conditions d'utilisation</a>
                  {' '}et notre{' '}
                  <a href="/privacy" style={{ color: '#3b968f' }} className="hover:underline">Politique de confidentialité</a>.
                </p>

                <Button
                  type="submit"
                  disabled={isLoading || !isPasswordValid}
                  className="w-full h-10 font-medium rounded-md text-sm transition-all"
                  style={{
                    background: '#3b968f',
                    color: '#fff',
                    border: 'none',
                    opacity: !isPasswordValid && !isLoading ? 0.45 : 1,
                  }}
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Création…</> : 'Créer un compte'}
                </Button>

                <p className="text-center text-xs text-gray-500">
                  Déjà un compte ?{' '}
                  <button type="button" onClick={() => setActiveTab('login')}
                    className="underline" style={{ color: '#3b968f' }}>
                    Se connecter
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Pied de page gauche uniquement */}
        <div className="p-6 border-t text-center" style={{ borderColor: '#1f1f1f' }}>
          <p className="text-xs text-gray-600">© 2026 Terex · Teranga Exchange</p>
        </div>
      </div>

      {/* ── RIGHT — Citation ───────────────────────────────────────────── */}
      <div className="hidden lg:flex relative lg:w-[62%] flex-col overflow-hidden"
        style={{ background: '#0d0d0d' }}>

        {/* Contenu centré */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-20">

          {/* Icône guillemet */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-10"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Quote className="w-5 h-5 text-white opacity-60" />
          </div>

          {/* Citation */}
          <p className="text-3xl font-light text-white mb-12" style={{ lineHeight: '1.6', letterSpacing: '-0.01em' }}>
            "Le problème fondamental avec les monnaies conventionnelles, c'est toute la confiance qu'il faut pour les faire fonctionner."
          </p>

          {/* Auteur */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
              }}>
              SN
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Satoshi Nakamoto</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Créateur du Bitcoin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
