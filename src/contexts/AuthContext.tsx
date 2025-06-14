
import React from 'react'
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

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resendVerification: async () => ({ error: null }),
})

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    console.log('AuthProvider: Initializing...')
    
    // Configurer l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email || 'no user');
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Synchroniser avec localStorage pour PWA
        if (session?.user) {
          console.log('AuthProvider: Sauvegarde session pour PWA');
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
          localStorage.setItem('terex-user-email', session.user.email || '');
        } else {
          console.log('AuthProvider: Nettoyage session localStorage');
          localStorage.removeItem('terex-session-active');
          localStorage.removeItem('terex-last-session-update');
          localStorage.removeItem('terex-user-email');
          localStorage.removeItem('terex-pwa-session-synced');
        }
      }
    )

    // Récupérer la session initiale
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Récupération session initiale');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Erreur récupération session initiale:', error);
        }
        
        console.log('AuthProvider: Session initiale:', session?.user?.email || 'aucune session');
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

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

    return () => {
      subscription.unsubscribe();
    }
  }, []) // Removed user dependency to prevent circular issues

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
      
      setUser(null)
      setSession(null)
      
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
      localStorage.removeItem('terex-pwa-session-synced');
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error)
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

  const value = React.useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signOut,
    resendVerification,
  }), [user, session, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
