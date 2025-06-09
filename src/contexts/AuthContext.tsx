
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
    
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Synchroniser avec localStorage pour PWA
        if (session?.user) {
          localStorage.setItem('terex-session-active', 'true');
          localStorage.setItem('terex-last-session-update', Date.now().toString());
        } else {
          localStorage.removeItem('terex-session-active');
          localStorage.removeItem('terex-last-session-update');
        }
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Synchroniser avec localStorage pour PWA
      if (session?.user) {
        localStorage.setItem('terex-session-active', 'true');
        localStorage.setItem('terex-last-session-update', Date.now().toString());
      }
    })

    // Écouter les changements de session depuis d'autres onglets (pour PWA)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'terex-session-active' && e.newValue === 'true' && !user) {
        console.log('Session detected from another tab, refreshing...');
        supabase.auth.refreshSession();
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
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error)
      // Force clear the state even on error
      setUser(null)
      setSession(null)
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
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
