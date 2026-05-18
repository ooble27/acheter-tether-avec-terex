
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Check, X, Shield, Zap, Globe, BarChart2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FEATURES = [
  { icon: Zap,       label: 'Paiements USDT en moins de 10 minutes' },
  { icon: Globe,     label: 'TRC-20, BEP-20 et ERC-20 supportés' },
  { icon: BarChart2, label: 'Analytiques et trésorerie en temps réel' },
  { icon: Shield,    label: 'Conformité BCEAO / UEMOA' },
];

export function BusinessLoginForm() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [company, setCompany]       = useState('');
  const [activeTab, setActiveTab]   = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const { signUp } = useAuth();
  const { toast }  = useToast();

  const passwordReqs = {
    minLength:      password.length >= 6,
    hasUppercase:   /[A-Z]/.test(password),
    hasLowercase:   /[a-z]/.test(password),
    hasNumber:      /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordReqs).every(Boolean);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: 'Connexion réussie', description: 'Bienvenue sur Terex Business.', className: 'bg-terex-accent text-white border-terex-accent' });
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('Email not confirmed')) {
        toast({ title: 'Identifiants incorrects', description: "L'email ou le mot de passe est incorrect.", variant: 'destructive' });
      } else if (msg.includes('For security purposes')) {
        toast({ title: 'Trop de tentatives', description: 'Veuillez attendre quelques minutes.', variant: 'destructive' });
      } else {
        toast({ title: 'Erreur de connexion', description: 'Impossible de se connecter.', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const displayName = company.trim() || email.split('@')[0];
      const { error, data } = await signUp(email, password, displayName, '');
      if (error) {
        if (error.message.includes('already')) {
          toast({ title: 'Email déjà utilisé', description: 'Cet email est déjà enregistré.', variant: 'destructive' });
          setActiveTab('login');
        } else {
          toast({ title: "Erreur d'inscription", description: error.message, variant: 'destructive' });
        }
      } else {
        if (data?.user && data.user.identities?.length === 0) {
          toast({ title: 'Email déjà utilisé', description: 'Cet email est déjà enregistré.', variant: 'destructive' });
          setActiveTab('login');
        } else {
          toast({ title: 'Compte créé !', description: 'Vérifiez votre email pour activer votre compte Business.', className: 'bg-terex-accent text-white border-terex-accent' });
        }
      }
    } catch {
      toast({ title: 'Erreur', description: "Une erreur inattendue s'est produite.", variant: 'destructive' });
    }
  };

  const inp = 'h-10 bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder:text-[#3a3a3a] rounded-md focus:border-[#3B968F] focus:ring-1 focus:ring-[#3B968F]/30 transition-colors text-sm px-3';

  return (
    <div className="min-h-screen w-full flex">

      {/* ── LEFT — Formulaire ───────────────────────────────── */}
      <div className="flex-1 lg:w-[40%] flex flex-col min-h-screen" style={{ background: '#151515' }}>

        {/* Logo tablette */}
        <div className="hidden md:flex lg:hidden items-center gap-3 p-6 border-b" style={{ borderColor: '#222' }}>
          <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" className="w-8 h-8 rounded-lg" />
          <div>
            <span className="text-sm font-black" style={{ color: '#3B968F' }}>TEREX</span>
            <span className="text-sm font-semibold text-white ml-1">Business</span>
          </div>
        </div>

        {/* Formulaire centré */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[380px]">

            {/* Logo desktop */}
            <div className="hidden lg:flex items-center gap-3 mb-10">
              <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" className="w-9 h-9 rounded-xl" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black" style={{ color: '#3B968F' }}>TEREX</span>
                  <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,150,143,0.15)', border: '1px solid rgba(59,150,143,0.3)' }}>Business</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(59,150,143,0.5)' }}>Teranga Exchange</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 rounded-xl p-1" style={{ background: '#1c1c1c', border: '1px solid #282828' }}>
              {(['login', 'register'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    background: activeTab === tab ? '#3B968F' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#555',
                  }}
                >
                  {tab === 'login' ? 'Se connecter' : 'Créer un compte'}
                </button>
              ))}
            </div>

            {/* ── CONNEXION ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Connexion Business</h1>
                  <p className="text-sm" style={{ color: '#555' }}>Accédez à votre espace entreprise.</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium" style={{ color: '#666' }}>Adresse email</Label>
                    <Input type="email" placeholder="contact@entreprise.sn" value={email} onChange={e => setEmail(e.target.value)} className={inp} required disabled={isLoading} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium" style={{ color: '#666' }}>Mot de passe</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={`${inp} pr-10`} required disabled={isLoading} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 px-3 flex items-center" style={{ color: '#444' }}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold rounded-lg text-sm" style={{ background: '#3B968F', color: '#fff', border: 'none' }}>
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connexion…</> : 'Se connecter'}
                </Button>
                <p className="text-center text-xs" style={{ color: '#444' }}>
                  Pas encore de compte ?{' '}
                  <button type="button" onClick={() => setActiveTab('register')} className="underline" style={{ color: '#3B968F' }}>Créer un compte Business</button>
                </p>
              </form>
            )}

            {/* ── INSCRIPTION ── */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Compte Business</h1>
                  <p className="text-sm" style={{ color: '#555' }}>Créez votre espace entreprise Terex.</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium" style={{ color: '#666' }}>Nom de l'entreprise</Label>
                    <Input type="text" placeholder="SARL Votre Entreprise" value={company} onChange={e => setCompany(e.target.value)} className={inp} required disabled={isLoading} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium" style={{ color: '#666' }}>Adresse email</Label>
                    <Input type="email" placeholder="contact@entreprise.sn" value={email} onChange={e => setEmail(e.target.value)} className={inp} required disabled={isLoading} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium" style={{ color: '#666' }}>Mot de passe</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={`${inp} pr-10`} required disabled={isLoading} minLength={6} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 px-3 flex items-center" style={{ color: '#444' }}>
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
                          const ok = passwordReqs[key as keyof typeof passwordReqs];
                          return (
                            <div key={key} className="flex items-center gap-1.5">
                              {ok ? <Check className="w-3 h-3 shrink-0" style={{ color: '#3B968F' }} /> : <X className="w-3 h-3 shrink-0" style={{ color: '#333' }} />}
                              <span className="text-xs" style={{ color: ok ? '#aaa' : '#444' }}>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#444' }}>
                  En continuant, vous acceptez nos{' '}
                  <a href="/terms" style={{ color: '#3B968F' }} className="hover:underline">Conditions d'utilisation</a>
                  {' '}et notre{' '}
                  <a href="/privacy" style={{ color: '#3B968F' }} className="hover:underline">Politique de confidentialité</a>.
                </p>
                <Button type="submit" disabled={isLoading || !isPasswordValid} className="w-full h-10 font-semibold rounded-lg text-sm" style={{ background: '#3B968F', color: '#fff', border: 'none', opacity: !isPasswordValid && !isLoading ? 0.45 : 1 }}>
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Création…</> : 'Créer mon compte Business'}
                </Button>
                <p className="text-center text-xs" style={{ color: '#444' }}>
                  Déjà un compte ?{' '}
                  <button type="button" onClick={() => setActiveTab('login')} className="underline" style={{ color: '#3B968F' }}>Se connecter</button>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="p-6 border-t text-center" style={{ borderColor: '#1f1f1f' }}>
          <p className="text-xs" style={{ color: '#333' }}>© 2026 Terex · Teranga Exchange</p>
        </div>
      </div>

      {/* ── RIGHT — Branding Business ────────────────────────── */}
      <div className="hidden lg:flex relative lg:w-[60%] flex-col overflow-hidden" style={{ background: '#111111' }}>

        {/* Lignes décoratives */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33%', width: 1, background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: '33%', width: 1, background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div className="relative z-10 flex-1 flex flex-col justify-center px-20">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" className="w-10 h-10 rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black" style={{ color: '#3B968F' }}>TEREX</span>
                <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,150,143,0.12)', border: '1px solid rgba(59,150,143,0.25)' }}>Business</span>
              </div>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-4xl font-black text-white mb-5" style={{ letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            La finance de votre<br />entreprise, sous contrôle.
          </h2>
          <p className="text-base mb-12" style={{ color: '#555', lineHeight: 1.7, maxWidth: 380 }}>
            Paiements USDT, trésorerie consolidée et API webhook pour les entreprises de la zone UEMOA.
          </p>

          {/* Features */}
          <div className="space-y-5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,150,143,0.10)', border: '1px solid rgba(59,150,143,0.20)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#3B968F' }} />
                </div>
                <span className="text-sm" style={{ color: '#888' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Séparateur + badge conformité */}
          <div className="mt-14 pt-10 border-t" style={{ borderColor: '#1e1e1e' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Shield className="w-4 h-4" style={{ color: '#444' }} />
              </div>
              <p className="text-xs" style={{ color: '#444' }}>
                Plateforme conforme aux directives BCEAO / UEMOA.<br />KYC entreprise requis pour les niveaux supérieurs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
