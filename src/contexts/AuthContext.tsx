
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resendVerification: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resendVerification: async () => ({ error: null }),
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    
    // Vérifier si on est en mode PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
    
    if (isStandalone) {
      console.log('AuthProvider: Mode PWA détecté');
    }
    
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email || 'no user');
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Synchroniser avec localStorage pour PWA - avec plus de détails
        if (session?.user) {
          console.log('AuthProvider: Sauvegarde session pour PWA');
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-user-email', session.user.email || '');
          
          // En mode PWA, marquer que la session est synchronisée
          if (isStandalone) {
            localStorage.setItem('terex-pwa-session-synced', 'true');
          }
        } else {
          console.log('AuthProvider: Nettoyage session localStorage');
          localStorage.removeItem('terex-session-active');
          localStorage.removeItem('terex-last-session-update');
          localStorage.removeItem('terex-user-email');
          localStorage.removeItem('terex-pwa-session-synced');
        }
      }
    )

    // Get initial session - avec retry en mode PWA
    const getInitialSession = async (retryCount = 0) => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Erreur récupération session initiale:', error);
          if (isStandalone && retryCount < 3) {
            console.log(`AuthProvider: Retry ${retryCount + 1} en mode PWA`);
            setTimeout(() => getInitialSession(retryCount + 1), 2000);
            return;
          }
        }
        
        console.log('AuthProvider: Session initiale:', session?.user?.email || 'aucune session');
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Synchroniser avec localStorage pour PWA
        if (session?.user) {
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-user-email', session.user.email || '');
        }
      } catch (error) {
        console.error('AuthProvider: Erreur inattendue:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements de session depuis d'autres onglets (pour PWA)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'terex-session-active' && e.newValue === 'true' && !user) {
        console.log('AuthProvider: Session détectée depuis un autre onglet');
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && !user) {
              console.log('AuthProvider: Session récupérée depuis autre onglet');
              setSession(session);
              setUser(session.user);
            }
          });
        }, 1000);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    }
  }, [user])

  const signUp = async (email: string, password: string, name: string) => {
    console.log('AuthProvider: Starting sign up for:', email)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    console.log('AuthProvider: Sign up result:', { error })
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    console.log('AuthProvider: Starting sign out...')
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('AuthProvider: Sign out error:', error)
      } else {
        console.log('AuthProvider: Sign out successful')
      }
      
      // Force clear the state regardless of error
      setUser(null)
      setSession(null)
      
      // Nettoyer localStorage
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
      localStorage.removeItem('terex-pwa-session-synced');
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error)
      // Force clear the state even on error
      setUser(null)
      setSession(null)
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
      localStorage.removeItem('terex-pwa-session-synced');
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signOut,
    resendVerification,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
